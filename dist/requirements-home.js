(() => {
  const STORAGE_KEY = "evidence-workbench-v2-requirements";
  const CHANGE_KEY = "evidence-workbench-v2-change-log";
  const clone = (value) => JSON.parse(JSON.stringify(value));
  const escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[char]);
  const statusClass = (status) => ({
    "需求来源资料待补充": "red",
    "测试进行中": "amber",
    "待重新测试": "amber",
    "待审批": "blue",
    "待最终验收": "purple",
    "待验收": "purple",
    "已通过": "green",
    "已关闭": "green"
  })[status] || "amber";

  function loadState() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (saved?.requirements && typeof saved.requirements === "object") return saved;
    } catch (error) {}
    return { requirements: clone(window.requirementRecords || {}) };
  }

  let state = loadState();
  let changes = loadChanges();
  let selectedRequirementId = Object.keys(state.requirements)[0];
  let editingScenarioChangeId = null;
  let editor = { type: "requirement", mode: "add", requirementId: null, taskId: null };
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];

  function currentRole() { return $("#roleSelect").value; }
  function canEditRequirement() { return currentRole() === "project"; }
  function canEditTask() { return ["project", "test"].includes(currentRole()); }
  function persist() { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
  function loadChanges() {
    try {
      const saved = JSON.parse(localStorage.getItem(CHANGE_KEY));
      return Array.isArray(saved) ? saved : [];
    } catch (error) { return []; }
  }
  function persistChanges() { localStorage.setItem(CHANGE_KEY, JSON.stringify(changes)); }
  function roleLabel(role = currentRole()) { return ({ project: "项目负责人", test: "测试组长", design: "设计组长", member: "普通成员" })[role] || role; }
  function now() { return new Date().toLocaleString("zh-CN", { hour12: false }); }
  function requirementSummary(item) { return item ? `${item.name}；${item.description?.slice(0,80) || "无内容"}；状态：${item.status}；负责人：${item.owner}` : "无（新增）"; }
  function taskSummary(item) { return item ? `${item.name}；标准：${item.criterion?.slice(0,80) || "待补充"}；状态：${item.status}；负责人：${item.owner}；目标日期：${item.due || "未排期"}` : "无（新增）"; }
  function addChange(entry) {
    changes.unshift({ id: `CH-${Date.now()}-${Math.random().toString(16).slice(2,6)}`, createdAt: now(), ...entry });
    persistChanges();
  }

  function taskState(task) {
    if (!task.available) return task;
    try {
      const saved = JSON.parse(localStorage.getItem(`evidence-workbench-v2-task:${task.id}`));
      if (!saved || saved.taskId !== task.id || saved.workflow === "new") return task;
      const mapped = {
        draft: ["草稿中", "amber"], submitted: ["待审核", "blue"], returned: ["已退回补充", "amber"],
        reviewed: saved.overallPass ? ["待验收", "purple"] : ["未通过", "red"], closed: ["已关闭", "green"]
      }[saved.workflow];
      return mapped ? { ...task, status: mapped[0], statusClass: mapped[1] } : task;
    } catch (error) { return task; }
  }

  function renderRequirementList() {
    const entries = Object.entries(state.requirements);
    if (!state.requirements[selectedRequirementId]) selectedRequirementId = entries[0]?.[0];
    $("#requirementCount").textContent = `${entries.length} 条`;
    $("#homeRequirementList").innerHTML = entries.map(([id, requirement]) => `<button class="home-requirement-item ${id === selectedRequirementId ? "selected" : ""}" data-requirement-id="${id}">
      <span><strong>${requirement.name}</strong><small class="requirement-code">${id}</small><small>${requirement.tasks?.length || 0} 项关联任务 · ${requirement.version || "版本待定"}</small></span>
      <span class="badge ${requirement.statusClass || statusClass(requirement.status)}">${requirement.status}</span>
    </button>`).join("");
    $$('[data-requirement-id]').forEach((button) => button.addEventListener("click", () => {
      selectedRequirementId = button.dataset.requirementId;
      renderAll();
    }));
  }

  function renderSelectedRequirement() {
    const requirement = state.requirements[selectedRequirementId];
    if (!requirement) return;
    $("#homeRequirementTitle").textContent = requirement.name;
    $("#homeRequirementCode").textContent = selectedRequirementId;
    $("#homeRequirementStatus").textContent = requirement.status;
    $("#homeRequirementStatus").className = `badge ${requirement.statusClass || statusClass(requirement.status)}`;
    $("#homeRequirementDescription").textContent = requirement.description;
    $("#homeRequirementVersion").textContent = requirement.version || "V2 · 当前正式版本";
    $("#homeRequirementEvidence").textContent = requirement.sourceEvidence || "尚未登记";
    $("#homeRequirementOwner").textContent = requirement.owner || "项目负责人";
    const missing = requirement.missing || [];
    $("#homeRequirementMissing").hidden = missing.length === 0;
    $("#homeRequirementMissing").textContent = missing.length ? `仍需补充：${missing.join("、")}` : "";
    $("#openHomeRequirement").href = `requirement.html?requirement=${encodeURIComponent(selectedRequirementId)}`;
    $("#linkedTaskCount").textContent = `${requirement.tasks?.length || 0} 项`;
    $("#homeLinkedTasks").innerHTML = (requirement.tasks || []).map(taskState).map((task) => `<div class="home-linked-task">
      <span><strong>${task.available ? `<a class="home-task-link" href="task.html?task=${encodeURIComponent(task.id)}">${escapeHtml(task.name)}（${escapeHtml(task.id)}）</a>` : `${escapeHtml(task.name)}（${escapeHtml(task.id)}）`}</strong><small>${escapeHtml(task.owner || "测试组长")}${task.due ? ` · 目标日期 ${escapeHtml(task.due)}` : ""}${task.criterion ? ` · ${escapeHtml(task.criterion)}` : ""}</small></span>
      <span class="badge ${task.statusClass || statusClass(task.status)}">${task.status}</span>
      <button class="task-edit-button" type="button" data-edit-task="${task.id}">修改任务</button>
    </div>`).join("") || '<div class="empty-state"><strong>尚未设置验证任务</strong><p>点击“新增验证任务”为这条需求建立验证关系。</p></div>';
    $$('[data-edit-task]').forEach((button) => button.addEventListener("click", () => openTaskEditor("edit", button.dataset.editTask)));
    updatePermissions();
  }

  function updatePermissions() {
    $("#addRequirement").disabled = !canEditRequirement();
    $("#editRequirement").disabled = !canEditRequirement();
    $("#addValidationTask").disabled = !canEditTask();
    $$('[data-edit-task]').forEach((button) => { button.disabled = !canEditTask(); });
    $("#requirementPermissionHint").textContent = canEditRequirement()
      ? "项目负责人可新增或修改需求，也可维护对应的验证任务。所有更改仅保存在本机演示数据中。"
      : canEditTask() ? "测试组长可新增或修改验证任务；需求内容由项目负责人维护。" : "当前角色为只读，不能修改需求或验证任务。";
  }

  function renderChangeLog() {
    const pending = changes.filter((item) => item.status === "待审批").length;
    $("#pendingChangeCount").textContent = `${pending} 项待审批`;
    $("#changeLogList").innerHTML = changes.length ? changes.map((item) => {
      const manageable = canManagePending(item);
      const scenarioChange = item.pending?.kind === "scenario";
      const approvalActions = item.status === "待审批" && currentRole() === "project" ? `<button class="primary" type="button" data-approve-change="${item.id}">${scenarioChange ? "批准进入实施" : "批准并生效"}</button><button class="secondary" type="button" data-reject-change="${item.id}">拒绝</button>` : "";
      const editAction = scenarioChange ? `<button class="secondary" type="button" data-edit-scenario-change="${item.id}">重新模拟</button>` : `<button class="secondary" type="button" data-edit-pending-change="${item.id}">修改申请</button>`;
      const ownerActions = manageable ? `${editAction}<button class="secondary" type="button" data-withdraw-change="${item.id}">撤回申请</button>` : "";
      const badgeClass = item.status === "待审批" ? "blue" : item.status === "已拒绝" ? "red" : item.status === "已撤回" ? "amber" : "green";
      const changeTypeLabel = item.entityType.endsWith("变更") ? item.entityType : `${item.entityType}变更`;
      return `<div class="change-log-entry">
      <div><p class="kicker">${escapeHtml(changeTypeLabel)} · ${escapeHtml(item.action)}</p><h3>${escapeHtml(item.entityName)}（${escapeHtml(item.entityId)}）</h3><p>${escapeHtml(item.reason)}</p><div class="change-log-meta"><span class="badge ${badgeClass}">${escapeHtml(item.status)}</span><small>${escapeHtml(item.createdAt)} · ${escapeHtml(item.actor)}</small></div></div>
      <div class="change-diff"><span><b>修改前：</b>${escapeHtml(item.beforeSummary)}</span><span><b>修改后：</b>${escapeHtml(item.afterSummary)}</span></div>
      <div class="change-log-actions">${approvalActions}${ownerActions}</div>
    </div>`;
    }).join("") : '<div class="change-log-empty"><strong>尚无变更记录</strong><p>新增或修改需求、任务后会在这里保留记录。</p></div>';
    $$('[data-approve-change]').forEach((button) => button.addEventListener("click", () => approveChange(button.dataset.approveChange)));
    $$('[data-reject-change]').forEach((button) => button.addEventListener("click", () => rejectChange(button.dataset.rejectChange)));
    $$('[data-edit-pending-change]').forEach((button) => button.addEventListener("click", () => openPendingChangeEditor(button.dataset.editPendingChange)));
    $$('[data-edit-scenario-change]').forEach((button) => button.addEventListener("click", () => editScenarioChange(button.dataset.editScenarioChange)));
    $$('[data-withdraw-change]').forEach((button) => button.addEventListener("click", () => withdrawChange(button.dataset.withdrawChange)));
  }

  function renderAll() { renderRequirementList(); renderSelectedRequirement(); renderChangeLog(); }

  function applyTaskPatch(patch) {
    const requirement = state.requirements[patch.requirementId];
    if (!requirement) return false;
    requirement.tasks ||= [];
    const index = requirement.tasks.findIndex((item) => item.id === patch.task.id);
    if (index >= 0) requirement.tasks[index] = patch.task; else requirement.tasks.push(patch.task);
    selectedRequirementId = patch.requirementId;
    return true;
  }

  function canManagePending(change) {
    if (!change || change.status !== "待审批") return false;
    if (currentRole() === "project") return true;
    const actorRole = change.actorRole || (change.actor === "测试组长" ? "test" : "");
    return currentRole() === "test" && actorRole === "test";
  }

  function approveChange(changeId) {
    if (currentRole() !== "project") return showToast("只有项目负责人可以批准变更");
    const change = changes.find((item) => item.id === changeId);
    if (!change || change.status !== "待审批") return;
    if (change.pending?.kind === "task" && !applyTaskPatch(change.pending)) return showToast("关联需求已不存在，无法应用该变更");
    const scenarioChange = change.pending?.kind === "scenario";
    change.status = scenarioChange ? "已批准待实施" : "已批准并生效";
    change.approvedAt = now();
    change.approver = "项目负责人";
    delete change.pending;
    persist();
    persistChanges();
    window.requirementRecords = state.requirements;
    renderAll();
    window.renderTasks?.();
    showToast(scenarioChange ? "模拟变更已批准进入实施，正式版本尚未自动修改" : "任务变更已批准并生效");
  }

  function rejectChange(changeId) {
    if (currentRole() !== "project") return showToast("只有项目负责人可以拒绝变更");
    const change = changes.find((item) => item.id === changeId);
    if (!change || change.status !== "待审批") return;
    change.status = "已拒绝";
    change.approvedAt = now();
    change.approver = "项目负责人";
    delete change.pending;
    persistChanges();
    renderAll();
    showToast("该变更已拒绝，正式数据未修改");
  }

  function withdrawChange(changeId) {
    const change = changes.find((item) => item.id === changeId);
    if (!canManagePending(change)) return showToast("当前角色不能撤回这条变更");
    if (!window.confirm("确认撤回这条变更申请？正式数据不会修改，撤回记录仍会保留。")) return;
    change.status = "已撤回";
    change.withdrawnAt = now();
    change.withdrawnBy = roleLabel();
    delete change.pending;
    persistChanges();
    renderAll();
    showToast("变更申请已撤回；正式数据未修改，记录继续保留");
  }

  function editScenarioChange(changeId) {
    const change = changes.find((item) => item.id === changeId);
    if (!canManagePending(change) || change.pending?.kind !== "scenario") return showToast("当前角色不能修改这条模拟变更");
    editingScenarioChangeId = changeId;
    document.querySelector('[data-home-mode="tasks"]')?.click();
    const select = $("#scenarioSelect");
    select.value = change.pending.scenario;
    select.dispatchEvent(new Event("change", { bubbles: true }));
    $("#scenario")?.scrollIntoView({ behavior: "smooth", block: "center" });
    showToast("请调整模拟场景，再点击“根据模拟结果发起变更”保存修改");
  }

  function setFormType(type) {
    const requirementMode = type === "requirement";
    $("#requirementFields").hidden = !requirementMode;
    $("#taskFields").hidden = requirementMode;
    $$("#requirementFields input,#requirementFields select,#requirementFields textarea").forEach((field) => { field.disabled = !requirementMode; });
    $$("#taskFields input,#taskFields select,#taskFields textarea").forEach((field) => { field.disabled = requirementMode; });
  }

  function populateRequirementSelect() {
    $("#editTaskRequirement").innerHTML = Object.entries(state.requirements).map(([id, item]) => `<option value="${id}">${item.name}（${id}）</option>`).join("");
  }

  function showEditor() {
    $("#entityEditorModal").hidden = false;
    document.body.classList.add("modal-open");
  }

  function closeEditor() {
    $("#entityEditorModal").hidden = true;
    document.body.classList.remove("modal-open");
    $("#entityEditorForm").reset();
  }

  function openRequirementEditor(mode) {
    if (!canEditRequirement()) return showToast("只有项目负责人可以新增或修改需求");
    editor = { type: "requirement", mode, requirementId: mode === "edit" ? selectedRequirementId : null, taskId: null };
    setFormType("requirement");
    $("#entityEditorTitle").textContent = mode === "edit" ? "修改需求" : "新增需求";
    $("#entityEditorHint").textContent = "保存后只影响本原型，并写入需求与任务变更记录。";
    const item = mode === "edit" ? state.requirements[selectedRequirementId] : null;
    $("#editRequirementId").value = mode === "edit" ? selectedRequirementId : `REQ-NEW-${String(Object.keys(state.requirements).length + 1).padStart(3,"0")}`;
    $("#editRequirementId").disabled = mode === "edit";
    $("#editRequirementName").value = item?.name || "";
    $("#editRequirementDescription").value = item?.description || "";
    $("#editRequirementStatus").value = item?.status || "需求来源资料待补充";
    $("#editRequirementOwner").value = item?.owner || "项目负责人";
    $("#editRequirementSource").value = item?.source || "";
    $("#editChangeReason").value = "";
    showEditor();
    $("#editRequirementName").focus();
  }

  function findTask(taskId) {
    for (const [requirementId, requirement] of Object.entries(state.requirements)) {
      const task = (requirement.tasks || []).find((item) => item.id === taskId);
      if (task) return { requirementId, task };
    }
    return null;
  }

  function openTaskEditor(mode, taskId = null) {
    if (!canEditTask()) return showToast("当前角色不能新增或修改验证任务");
    const found = taskId ? findTask(taskId) : null;
    editor = { type: "task", mode, requirementId: found?.requirementId || selectedRequirementId, taskId };
    setFormType("task");
    populateRequirementSelect();
    $("#entityEditorTitle").textContent = mode === "edit" ? "修改验证任务" : "新增验证任务";
    $("#entityEditorHint").textContent = currentRole() === "test" ? "保存后提交项目负责人审批，批准前不会修改正式任务。" : "保存后立即生效，并写入需求与任务变更记录。";
    $("#editTaskRequirement").value = editor.requirementId;
    $("#editTaskRequirement").disabled = mode === "edit";
    $("#editTaskId").value = found?.task.id || `T-NEW-${String(Date.now()).slice(-4)}-V2`;
    $("#editTaskId").disabled = mode === "edit";
    $("#editTaskName").value = found?.task.name || "";
    $("#editTaskOwner").value = found?.task.owner || "测试组长";
    $("#editTaskStatus").value = found?.task.status || "待重新测试";
    $("#editTaskDue").value = found?.task.due || "2026-11-10";
    $("#editTaskCriterion").value = found?.task.criterion || "";
    $("#editChangeReason").value = "";
    showEditor();
    $("#editTaskName").focus();
  }

  function openPendingChangeEditor(changeId) {
    const change = changes.find((item) => item.id === changeId);
    if (!canManagePending(change) || change.pending?.kind !== "task") return showToast("当前角色不能修改这条变更");
    const task = change.pending.task;
    editor = { type: "task", mode: "pending", requirementId: change.pending.requirementId, taskId: task.id, changeId };
    setFormType("task");
    populateRequirementSelect();
    $("#entityEditorTitle").textContent = `修改变更申请 · ${task.id}`;
    $("#entityEditorHint").textContent = "保存后仍处于待审批状态，不会提前修改正式任务。";
    $("#editTaskRequirement").value = change.pending.requirementId;
    $("#editTaskRequirement").disabled = true;
    $("#editTaskId").value = task.id;
    $("#editTaskId").disabled = true;
    $("#editTaskName").value = task.name;
    $("#editTaskOwner").value = task.owner || "测试组长";
    $("#editTaskStatus").value = task.status || "待重新测试";
    $("#editTaskDue").value = task.due === "未排期" ? "" : (task.due || "");
    $("#editTaskCriterion").value = task.criterion || "";
    $("#editChangeReason").value = change.reason || "";
    showEditor();
    $("#editTaskName").focus();
  }

  function saveRequirement() {
    const id = $("#editRequirementId").value.trim().toUpperCase();
    if (!/^[A-Z0-9-]+$/.test(id)) return showToast("需求编号只能使用大写字母、数字和连字符"), false;
    if (editor.mode === "add" && state.requirements[id]) return showToast("该需求编号已经存在"), false;
    const current = editor.mode === "edit" ? state.requirements[editor.requirementId] : null;
    const status = $("#editRequirementStatus").value;
    const next = {
      ...(current || {}),
      name: $("#editRequirementName").value.trim(),
      description: $("#editRequirementDescription").value.trim(),
      status,
      statusClass: statusClass(status),
      version: current?.version || "V2 · 当前正式版本",
      owner: $("#editRequirementOwner").value,
      source: $("#editRequirementSource").value.trim() || "来源待补充（本机演示）",
      sourceEvidence: status === "需求来源资料待补充" ? "尚未确认有效" : (current?.sourceEvidence || "本机记录 · 已确认有效"),
      missing: status === "需求来源资料待补充" ? (current?.missing?.length ? current.missing : ["原始问题描述", "审核结论", "审核人"]) : [],
      acceptance: current?.acceptance || ["验收标准待补充。"],
      tasks: current?.tasks || [],
      closeConditions: current?.closeConditions || ["需求来源资料完整", "验收标准已批准", "必需测试全部通过"]
    };
    state.requirements[id] = next;
    selectedRequirementId = id;
    addChange({
      entityType: "需求", entityId: id, entityName: next.name, action: editor.mode === "add" ? "新增" : "修改",
      reason: $("#editChangeReason").value.trim(), actor: roleLabel(), actorRole: currentRole(), status: "已批准并生效",
      beforeSummary: requirementSummary(current), afterSummary: requirementSummary(next)
    });
    return { applied: true, message: "需求已保存并写入变更记录" };
  }

  function saveTask() {
    const requirementId = $("#editTaskRequirement").value;
    const id = $("#editTaskId").value.trim().toUpperCase();
    if (!/^[A-Z0-9-]+$/.test(id)) return showToast("任务编号只能使用大写字母、数字和连字符"), false;
    const pendingDuplicate = changes.some((item) => item.status === "待审批" && item.entityId === id);
    if (editor.mode === "add" && (findTask(id) || pendingDuplicate)) return showToast("该任务编号已经存在或正在等待审批"), false;
    const requirement = state.requirements[requirementId];
    requirement.tasks ||= [];
    const existingIndex = requirement.tasks.findIndex((item) => item.id === id);
    const current = existingIndex >= 0 ? requirement.tasks[existingIndex] : null;
    const status = $("#editTaskStatus").value;
    const next = {
      ...(current || {}), id,
      name: $("#editTaskName").value.trim(),
      owner: $("#editTaskOwner").value,
      status, statusClass: statusClass(status),
      due: $("#editTaskDue").value || "未排期",
      criterion: $("#editTaskCriterion").value.trim(),
      available: current?.available ?? true
    };
    selectedRequirementId = requirementId;
    if (editor.mode === "pending") {
      const change = changes.find((item) => item.id === editor.changeId);
      if (!canManagePending(change)) return showToast("当前角色不能修改这条变更"), false;
      change.entityName = next.name;
      change.reason = $("#editChangeReason").value.trim();
      change.afterSummary = taskSummary(next);
      change.pending = { kind: "task", requirementId, task: next };
      change.updatedAt = now();
      change.lastEditedBy = roleLabel();
      persistChanges();
      return { applied: false, message: "变更申请已更新，仍等待项目负责人审批" };
    }
    const pending = currentRole() === "test";
    if (!pending) applyTaskPatch({ requirementId, task: next });
    addChange({
      entityType: "任务", entityId: id, entityName: next.name, action: editor.mode === "add" ? "新增" : "修改",
      reason: $("#editChangeReason").value.trim(), actor: roleLabel(), actorRole: currentRole(), status: pending ? "待审批" : "已批准并生效",
      beforeSummary: taskSummary(current), afterSummary: taskSummary(next),
      pending: pending ? { kind: "task", requirementId, task: next } : undefined
    });
    return { applied: !pending, message: pending ? "任务变更已提交项目负责人审批" : "验证任务已保存，可打开完整任务页" };
  }

  $$("[data-home-mode]").forEach((button) => button.addEventListener("click", () => {
    const mode = button.dataset.homeMode;
    $("#requirementWorkspace").hidden = mode !== "requirements";
    $("#taskWorkspace").hidden = mode !== "tasks";
    $$("[data-home-mode]").forEach((item) => {
      const active = item.dataset.homeMode === mode;
      item.classList.toggle("active", active);
      item.setAttribute("aria-selected", String(active));
    });
  }));
  $("#addRequirement").addEventListener("click", () => openRequirementEditor("add"));
  $("#editRequirement").addEventListener("click", () => openRequirementEditor("edit"));
  $("#addValidationTask").addEventListener("click", () => openTaskEditor("add"));
  $("#cancelEntityEditor").addEventListener("click", closeEditor);
  $("#entityEditorModal").addEventListener("click", (event) => { if (event.target === $("#entityEditorModal")) closeEditor(); });
  $("#entityEditorForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const result = editor.type === "requirement" ? saveRequirement() : saveTask();
    if (!result) return;
    if (result.applied) persist();
    window.requirementRecords = state.requirements;
    closeEditor();
    renderAll();
    window.renderTasks?.();
    showToast(result.message);
  });
  window.registerScenarioChangeRequest = ({ scenario, label, summary }) => {
    const existing = editingScenarioChangeId ? changes.find((item) => item.id === editingScenarioChangeId && item.status === "待审批") : null;
    const pending = { kind: "scenario", scenario, label, summary };
    if (existing) {
      existing.entityId = `SIM-${scenario.toUpperCase()}`;
      existing.entityName = label;
      existing.reason = `重新模拟：${label}`;
      existing.afterSummary = summary;
      existing.pending = pending;
      existing.updatedAt = now();
      existing.lastEditedBy = roleLabel();
      persistChanges();
    } else {
      addChange({
        entityType: "模拟变更", entityId: `SIM-${scenario.toUpperCase()}`, entityName: label, action: "发起申请",
        reason: `根据影响模拟结果发起：${label}`, actor: roleLabel(), actorRole: currentRole(), status: "待审批",
        beforeSummary: "当前正式数据保持不变", afterSummary: summary, pending
      });
    }
    editingScenarioChangeId = null;
    renderChangeLog();
  };
  $("#roleSelect").addEventListener("change", renderAll);
  document.addEventListener("keydown", (event) => { if (event.key === "Escape" && !$("#entityEditorModal").hidden) closeEditor(); });

  renderAll();
})();
