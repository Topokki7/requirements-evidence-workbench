(() => {
  const STORAGE_KEY = "evidence-workbench-v2-design-versions";
  const initialVersions = [
    {
      code: "V1",
      name: "抽拉式结构",
      status: "history",
      date: "2026-10-12",
      summary: "采用抽拉式承托结构完成第一轮方案验证。",
      reason: "承托刚度不足，模拟配送后出现密封保持风险，因此被后续结构替换。",
      tasks: [
        "密封保持测试（T-LEAK-B-V1）：重量差超过当时上限，未通过",
        "结构支撑检查（T-SUPPORT-A-V1）：承托变形，记录为方案风险"
      ]
    },
    {
      code: "V1.1",
      name: "旋底式结构",
      status: "history",
      date: "2026-10-18",
      summary: "增加底部旋转承托以改善承重表现。",
      reason: "承重有所改善，但旋转条仍外露，装配容错与使用安全风险未完全消除。",
      tasks: [
        "碗盖装配容错测试（T-ASSEMBLY-A-V1-1）：旋转条干涉装配，未通过",
        "使用安全评估（T-SAFE-A-V1-1）：外露部件存在误触风险"
      ]
    },
    {
      code: "V2",
      name: "嵌入式结构",
      status: "current",
      date: "2026-10-25",
      summary: "将承托与锁定结构嵌入盒体，作为当前获批并生效的正式方案。",
      reason: "当前没有已确认的结构问题；测试 B 待重新测试表示验证尚未完成，不等于 V2 失败。",
      tasks: [
        "外观泄漏测试（T-LEAK-A-V2）：已通过",
        "密封保持（重量损失）重新测试（T-LEAK-B-V2）：待重新测试"
      ]
    }
  ];

  const q = (selector) => document.querySelector(selector);
  const qa = (selector) => [...document.querySelectorAll(selector)];
  const track = q("#versionTrack");
  const slider = q("#versionSlider");
  const detail = q("#versionDetail");
  const addButton = q("#addDesignVersion");
  const editButton = q("#editDesignVersion");
  const modal = q("#versionEditorModal");
  if (!track || !slider || !detail || !addButton || !editButton || !modal) return;

  let versions = loadVersions();
  let selectedCode = versions.find((item) => item.status === "current")?.code || versions.at(-1)?.code;
  let scenarioState = { activeScenario: "baseline", draftCreated: false, draftScenario: null };
  let editorMode = "add";
  let previousFocus = null;

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[char]);
  }

  function loadVersions() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (Array.isArray(saved) && saved.length) return saved;
    } catch (error) {}
    return initialVersions.map((item) => ({ ...item, tasks: [...item.tasks] }));
  }

  function persist() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(versions));
  }

  function versionNumber(code) {
    const match = String(code).match(/[0-9]+(?:\.[0-9]+)?/);
    return match ? Number(match[0]) : 999;
  }

  function sorted(items) {
    return [...items].sort((a, b) => versionNumber(a.code) - versionNumber(b.code));
  }

  function statusLabel(status) {
    return ({ history: "历史版本", current: "当前正式方案", draft: "草案", review: "待审批", preview: "假设预览" })[status] || status;
  }

  function displayedVersions() {
    const items = sorted(versions);
    const hasV3 = items.some((item) => item.code === "V3");
    const showCandidate = !hasV3 && (scenarioState.activeScenario === "designV3" || (scenarioState.draftCreated && scenarioState.draftScenario === "designV3"));
    if (!showCandidate) return items;
    return [...items, {
      code: "V3",
      name: scenarioState.draftCreated ? "锁定结构变更草案" : "锁定结构候选方案",
      status: scenarioState.draftCreated ? "draft" : "preview",
      date: "尚未生效",
      summary: "仅在假设确认锁定结构存在问题后提出；当前正式方案仍为 V2。",
      reason: "这是变更影响预览，不是已确认事实，也不会自动替换当前方案。",
      tasks: ["V3 锁定结构重新测试（T-V3-LOCK-01）：仅预览，尚未执行"],
      temporary: true
    }];
  }

  function selectedVersion(items = displayedVersions()) {
    return items.find((item) => item.code === selectedCode) || items.find((item) => item.status === "current") || items.at(-1);
  }

  function role() {
    return q("#roleSelect")?.value || "member";
  }

  function canAdd() {
    return ["project", "design"].includes(role());
  }

  function canEdit(item) {
    if (!item || item.temporary) return false;
    if (role() === "project") return true;
    return role() === "design" && ["draft", "review"].includes(item.status);
  }

  function permissionText(item) {
    if (role() === "project") return "项目负责人可新增、修改版本，并在审批完成后指定当前正式方案。";
    if (role() === "design") return item && ["draft", "review"].includes(item.status)
      ? "设计组长可新增方案并修改草案或待审批版本；正式版本需项目负责人确认。"
      : "设计组长可新增方案，但已生效或已归档版本由项目负责人维护。";
    return "当前角色可查看版本记录；新增或修改方案需由项目负责人或设计组长操作。";
  }

  function renderDetail(item) {
    if (!item) return;
    const title = item.status === "history" ? "被替换原因" : item.status === "current" ? "当前判断" : "新增或变更原因";
    const records = item.tasks?.length ? item.tasks : ["尚未关联验证任务"];
    detail.innerHTML = `
      <div>
        <div class="version-detail-status"><div><p class="kicker">所选方案</p><h3>${escapeHtml(item.code)} · ${escapeHtml(item.name)}</h3></div><span class="badge ${item.status === "current" ? "green" : item.status === "history" ? "amber" : "purple"}">${escapeHtml(statusLabel(item.status))}</span></div>
        <p>${escapeHtml(item.summary)}</p>
        <p><strong>${title}：</strong>${escapeHtml(item.reason)}</p>
      </div>
      <div>
        <p class="kicker">相关验证记录</p>
        <ul class="version-detail-list">${records.map((record) => `<li class="${/已通过/.test(record) ? "ok" : ""}">${escapeHtml(record)}</li>`).join("")}</ul>
      </div>
      <div class="version-permission">${escapeHtml(permissionText(item))}</div>`;
  }

  function render(options = {}) {
    scenarioState = { ...scenarioState, ...options };
    const items = displayedVersions();
    if (!items.some((item) => item.code === selectedCode)) selectedCode = items.find((item) => item.status === "current")?.code || items.at(-1)?.code;
    const selected = selectedVersion(items);
    const current = versions.find((item) => item.status === "current") || versions.at(-1);
    q("#currentFormalHeading").textContent = `当前正式方案：${current.code}`;
    q("#currentSnapshotVersion").textContent = current.code;
    track.innerHTML = items.map((item) => `<button class="version-card ${escapeHtml(item.status)} ${item.code === selected.code ? "selected" : ""}" type="button" data-version-code="${escapeHtml(item.code)}" aria-pressed="${item.code === selected.code}">
      <span class="version-code">${escapeHtml(item.code)}</span>
      <span><strong>${escapeHtml(item.name)}</strong><small>${escapeHtml(item.date)} · ${escapeHtml(item.status === "history" ? "点击查看替换原因" : item.status === "current" ? "已批准并生效" : statusLabel(item.status))}</small></span>
      <b>${escapeHtml(statusLabel(item.status))}</b>
    </button>`).join("");
    qa("[data-version-code]").forEach((button) => button.addEventListener("click", () => selectVersion(button.dataset.versionCode, true)));
    const index = Math.max(0, items.findIndex((item) => item.code === selected.code));
    slider.max = String(Math.max(0, items.length - 1));
    slider.value = String(index);
    q("#versionPrevious").disabled = index === 0;
    q("#versionNext").disabled = index === items.length - 1;
    addButton.disabled = !canAdd();
    editButton.disabled = !canEdit(selected);
    renderDetail(selected);
  }

  function selectVersion(code, shouldScroll) {
    selectedCode = code;
    render();
    if (shouldScroll) requestAnimationFrame(() => q(`[data-version-code="${CSS.escape(code)}"]`)?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" }));
  }

  function nextVersionCode() {
    const highest = Math.max(...versions.map((item) => Math.floor(versionNumber(item.code))), 2);
    return `V${highest + 1}`;
  }

  function openEditor(mode) {
    const selected = selectedVersion(versions);
    if (mode === "add" && !canAdd()) return showToast("当前角色没有新增方案权限");
    if (mode === "edit" && !canEdit(selected)) return showToast("当前角色不能修改这个版本");
    editorMode = mode;
    previousFocus = document.activeElement;
    const item = mode === "edit" ? selected : {
      code: nextVersionCode(), name: "", status: "draft", summary: "", reason: "", tasks: []
    };
    q("#versionEditorTitle").textContent = mode === "add" ? "新增方案版本" : `修改方案 ${item.code}`;
    q("#versionEditorHint").textContent = mode === "add" ? "新增版本默认保存为草案，不会自动替换当前正式方案。" : "修改会保留版本号；历史原因和验证记录可在滑动轨道中继续查看。";
    q("#editVersionCode").value = item.code;
    q("#editVersionCode").disabled = mode === "edit";
    q("#editVersionStatus").value = item.status;
    q("#editVersionName").value = item.name;
    q("#editVersionSummary").value = item.summary;
    q("#editVersionReason").value = item.reason;
    q("#editVersionTasks").value = (item.tasks || []).join("\n");
    const currentOption = q('#editVersionStatus option[value="current"]');
    currentOption.disabled = role() !== "project";
    modal.hidden = false;
    document.body.classList.add("modal-open");
    q("#editVersionName").focus();
  }

  function closeEditor() {
    modal.hidden = true;
    document.body.classList.remove("modal-open");
    previousFocus?.focus();
  }

  q("#versionEditorForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const code = q("#editVersionCode").value.trim().toUpperCase();
    if (!/^V\d+(?:\.\d+)?$/.test(code)) return showToast("版本号请使用 V3 或 V3.1 这样的格式");
    if (editorMode === "add" && versions.some((item) => item.code === code)) return showToast("这个版本号已经存在");
    const status = q("#editVersionStatus").value;
    if (status === "current" && role() !== "project") return showToast("只有项目负责人可以指定当前正式方案");
    const next = {
      code,
      status,
      name: q("#editVersionName").value.trim(),
      summary: q("#editVersionSummary").value.trim(),
      reason: q("#editVersionReason").value.trim(),
      tasks: q("#editVersionTasks").value.split(/\n+/).map((item) => item.trim()).filter(Boolean),
      date: editorMode === "edit" ? versions.find((item) => item.code === code)?.date : new Date().toISOString().slice(0, 10)
    };
    if (status === "current") versions = versions.map((item) => item.status === "current" && item.code !== code ? { ...item, status: "history" } : item);
    const index = versions.findIndex((item) => item.code === code);
    if (index >= 0) versions[index] = next; else versions.push(next);
    versions = sorted(versions);
    selectedCode = code;
    persist();
    closeEditor();
    render();
    window.renderTimeline?.();
    showToast(editorMode === "add" ? `${code} 已保存为本机方案记录` : `${code} 方案记录已更新`);
  });

  addButton.addEventListener("click", () => openEditor("add"));
  editButton.addEventListener("click", () => openEditor("edit"));
  q("#cancelVersionEditor").addEventListener("click", closeEditor);
  modal.addEventListener("click", (event) => { if (event.target === modal) closeEditor(); });
  slider.addEventListener("input", () => {
    const items = displayedVersions();
    selectVersion(items[Number(slider.value)]?.code, true);
  });
  q("#versionPrevious").addEventListener("click", () => {
    const items = displayedVersions();
    const index = Math.max(0, items.findIndex((item) => item.code === selectedCode) - 1);
    selectVersion(items[index].code, true);
  });
  q("#versionNext").addEventListener("click", () => {
    const items = displayedVersions();
    const index = Math.min(items.length - 1, items.findIndex((item) => item.code === selectedCode) + 1);
    selectVersion(items[index].code, true);
  });
  q("#roleSelect")?.addEventListener("change", () => render());
  document.addEventListener("keydown", (event) => { if (event.key === "Escape" && !modal.hidden) closeEditor(); });

  window.getManagedVersionTimeline = () => sorted(versions).map((item) => ({
    version: item.code,
    date: item.date?.slice(5) || "本地",
    text: item.name,
    note: item.status === "current" ? "已批准并作为当前正式版本" : item.status === "history" ? item.reason : statusLabel(item.status),
    current: item.status === "current"
  }));
  window.renderManagedVersions = render;
  window.alignManagedVersion = () => selectVersion(selectedCode, true);
  render();
})();
