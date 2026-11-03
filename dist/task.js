const taskRecords = {
  "T-LEAK-B-V2": {
    type: "物理测试任务",
    title: "V2 · 密封保持（重量损失）重新测试",
    subtitle: "测试 B 独立判断重量损失；测试 A 的外观泄漏结论不会代替本任务。",
    status: "待重新测试", statusClass: "amber", stage: 1,
    requirement: "REQ-LEAK-001", version: "V2 · 当前正式版本", owner: "测试组长", reviewer: "项目负责人", due: "2026-11-06",
    criterion: "模拟配送 30 分钟后，测试前后重量差不超过 1 克。",
    failure: "重量差超过 1 克，记录到密封保持（重量损失）重新测试（T-LEAK-B-V2）；盒外出现液体，记录到外观泄漏测试（T-LEAK-A-V2）。",
    evidenceId: "E-TEST-B-02", sample: "3 个合成样本", environment: "23℃ · 50%RH", equipment: "电子秤（0.1g）", batch: "SYN-2026-11-B02",
    steps: ["记录每个样本初始重量。", "按合成配送路线振动与倾斜 30 分钟。", "擦除盒外非泄漏附着物后记录最终重量。", "逐个计算重量差并保存原始记录。"],
    results: [["重量差", "≤ 1.0g", "待登记", "待重新测试"], ["测试时长", "30 分钟", "30 分钟", "符合"]],
    failedActual: "1.6g", defectId: "DEF-LEAK-014", defectTitle: "密封保持重量损失超限",
    evidence: [["E-SETUP-02", "测试布置记录", "合成环境与设备校准信息"], ["E-WEIGHT-02", "称重原始表", "逐样本记录，待补最终重量"], ["E-REVIEW-02", "审核记录", "测试组长审核待完成"]],
    audit: [["2026-11-01 09:30", "任务创建", "由 V2 当前验证计划生成，负责人为测试组长。"], ["2026-11-01 10:05", "规则确认", "重量差上限 1 克；与外观泄漏任务分开判定。"]]
  },
  "APPL-B-V1-V2": {
    type: "旧测试结果沿用审批",
    title: "V1→V2 · 重量损失测试结果沿用审批",
    subtitle: "判断 V1 的测试结果能否作为 V2 的适用记录，不创建新的方案版本。",
    status: "待审批", statusClass: "blue", stage: 2,
    requirement: "REQ-LEAK-001", version: "V2 · 当前正式版本", owner: "项目负责人", reviewer: "项目主管/发起人", due: "2026-11-05",
    criterion: "必须证明测试 B 覆盖的结构、材料和工艺在 V1 与 V2 间完全未改变，并附差异对比、原测试记录和测试组长审核结果。",
    failure: "任一材料缺失或覆盖范围发生变化，旧测试结果沿用审批（APPL-B-V1-V2）即为未通过；密封保持（重量损失）重新测试（T-LEAK-B-V2）继续等待处理。",
    evidenceId: "E-APPL-02", sample: "不适用", environment: "文档审查", equipment: "版本差异清单", batch: "APPL-2026-11-02",
    steps: ["锁定旧记录对应的测试范围。", "比较 V1 与 V2 的结构、材料和工艺差异。", "测试组长确认差异是否影响测试结论。", "项目负责人审批并生成 V2 可沿用记录。"],
    results: [["结构差异", "测试范围内无变化", "待审核", "待审批"], ["原始记录", "完整可追溯", "已附", "符合"]],
    failedActual: "存在未解释差异", defectId: "ISSUE-APPL-006", defectTitle: "旧测试结果不满足沿用条件",
    evidence: [["E-DIFF-02", "版本差异表", "V1 与 V2 的结构对比"], ["E-OLD-B-01", "V1 测试 B 记录", "原始合成测试记录"], ["E-REVIEW-APPL", "测试组长审核记录", "待项目负责人审批"]],
    audit: [["2026-11-01 11:10", "沿用申请提交", "测试组长提交 V1→V2 旧测试结果沿用说明。"], ["2026-11-01 11:30", "进入审批", "当前尚未计入 V2 通过状态。"]]
  },
  "T-OPEN-A-V2": {
    type: "物理测试任务",
    title: "V2 · 开盖防飞溅测试验收",
    subtitle: "只判断开盖动作造成的飞溅，不代替密封保持或装配任务。",
    status: "待验收", statusClass: "purple", stage: 3,
    requirement: "REQ-OPEN-003", version: "V2 · 当前正式版本", owner: "测试组长", reviewer: "项目负责人", due: "2026-11-04",
    criterion: "按规定动作连续开盖 5 次，盒外收集纸均无可见液滴；5 次必须逐次记录。",
    failure: "任一次出现液滴，记录到开盖防飞溅测试（T-OPEN-A-V2）；不记录到密封保持测试或碗盖装配容错测试。",
    evidenceId: "E-OPEN-A-03", sample: "5 次开盖", environment: "23℃ · 静置台面", equipment: "收集纸与合成液", batch: "SYN-2026-11-O03",
    steps: ["按固定位置放置收集纸。", "以规定角度和速度执行开盖。", "每次检查并拍摄收集纸。", "记录 5 次结果并由测试组长审核确认。"],
    results: [["可见液滴", "5 次均为 0", "0 / 5", "通过"], ["动作次数", "5 次", "5 次", "符合"]],
    failedActual: "1 / 5 出现液滴", defectId: "DEF-OPEN-008", defectTitle: "开盖动作出现飞溅",
    evidence: [["E-OPEN-PHOTO", "收集纸图像", "5 次合成测试图像"], ["E-OPEN-LOG", "逐次记录", "开盖角度与观察结果"], ["E-OPEN-REVIEW", "审核记录", "测试组长已审核"]],
    audit: [["2026-10-31 14:00", "测试执行", "5 次开盖均未见液滴。"], ["2026-10-31 15:20", "测试组长审核", "结果通过，进入项目负责人验收。"]]
  },
  "E-VERIFY-04": {
    type: "证据有效性确认任务",
    title: "需求级 · 暴力运输稳定性来源确认",
    subtitle: "先确认需求来源资料有效，再决定是否创建物理测试；资料不完整不等于产品测试失败。",
    status: "需求来源资料待补充", statusClass: "red", stage: 1,
    requirement: "REQ-EVID-004", version: "V2 · 当前正式版本", owner: "项目负责人", reviewer: "项目主管/发起人", due: "2026-11-08",
    criterion: "证据记录必须包含来源时间、来源渠道、原始问题描述和审核结论；缺少任一项即判为资料未确认。",
    failure: "资料不完整，记录到暴力运输稳定性来源确认（E-VERIFY-04）；在补齐前不得创建对应的物理测试通过记录。",
    evidenceId: "E-SOURCE-04", sample: "1 条来源记录", environment: "文档审查", equipment: "来源登记表", batch: "EVID-2026-11-04",
    steps: ["确认来源渠道与获取时间。", "检查原始问题描述是否完整。", "记录审核结论及审核人。", "通过后再创建对应测试任务。"],
    results: [["来源时间", "必须存在", "已记录", "符合"], ["原始问题描述", "必须完整", "缺失", "未通过"]],
    failedActual: "原始问题描述缺失", defectId: "GAP-EVID-004", defectTitle: "需求来源信息不完整",
    evidence: [["E-SOURCE-04", "来源登记", "渠道和时间已记录"], ["E-ORIGINAL-04", "原始问题", "待补充"], ["E-REVIEW-04", "审核结论", "尚未生成"]],
    audit: [["2026-11-01 08:40", "来源记录创建", "登记渠道与获取时间。"], ["2026-11-01 09:00", "发现资料不完整", "原始问题描述尚未补齐。"]]
  },
  "T-ASSEMBLY-A-V2": {
    type: "物理测试任务",
    title: "V2 · 碗盖装配容错重新测试",
    subtitle: "只判断锁止到位和卡滞，不与泄漏或开盖任务共用结论。",
    status: "待重新测试", statusClass: "amber", stage: 1,
    requirement: "REQ-SEAL-005", version: "V2 · 当前正式版本", owner: "测试组长", reviewer: "项目负责人", due: "2026-11-07",
    criterion: "连续装配 10 次，10 次均锁止到位且无卡滞；每次记录锁止状态。",
    failure: "任何一次未锁止或卡滞，记录到碗盖装配容错重新测试（T-ASSEMBLY-A-V2）；不记录到泄漏测试。",
    evidenceId: "E-ASSEMBLY-A-05", sample: "10 次装配", environment: "23℃ · 标准工位", equipment: "装配治具", batch: "SYN-2026-11-A05",
    steps: ["检查样本与治具状态。", "按规定方向完成装配。", "记录锁止是否到位及是否卡滞。", "重复 10 次并汇总结论。"],
    results: [["锁止到位", "10 / 10", "待登记", "待重新测试"], ["卡滞次数", "0", "待登记", "待重新测试"]],
    failedActual: "9 / 10 锁止到位", defectId: "DEF-ASSEMBLY-011", defectTitle: "装配锁止未到位",
    evidence: [["E-ASSEMBLY-LOG", "逐次装配表", "10 次结果待补"], ["E-FIXTURE-05", "治具检查", "合成治具状态记录"], ["E-ASSEMBLY-REVIEW", "审核记录", "待测试组长确认"]],
    audit: [["2026-11-01 10:20", "重新测试任务创建", "V2 结构变化触发装配重新测试。"], ["2026-11-01 10:35", "判定规则确认", "10 次均锁止且无卡滞。"]]
  }
};

function makeManagedTask(id) {
  try {
    const managed = JSON.parse(localStorage.getItem("evidence-workbench-v2-requirements"))?.requirements || {};
    for (const [requirementId, requirement] of Object.entries(managed)) {
      const task = (requirement.tasks || []).find((item) => item.id === id && item.available);
      if (!task) continue;
      const stage = task.status === "待验收" ? 3 : task.status === "待审批" ? 2 : task.status === "已关闭" ? 5 : 1;
      return {
        type: "物理测试任务",
        title: `${requirement.version?.split(" · ")[0] || "当前版本"} · ${task.name}`,
        subtitle: "本任务由需求中心创建，判定、证据、审核和验收记录均独立保存。",
        status: task.status || "待重新测试", statusClass: task.statusClass || "amber", stage,
        requirement: requirementId, version: requirement.version || "V2 · 当前正式版本",
        owner: task.owner || "测试组长", reviewer: task.owner === "项目负责人" ? "项目主管/发起人" : "项目负责人", due: task.due || "未排期",
        criterion: task.criterion || "通过标准待补充。",
        failure: `未通过结果只记录到${task.name}（${id}），不会自动判定其他任务失败。`,
        evidenceId: `E-${id}`, sample: "待填写", environment: "待填写", equipment: "待填写", batch: "待填写",
        steps: ["确认任务范围和当前版本。", "按通过标准执行并逐项记录结果。", "补充证据记录并提交审核。", "审核通过后进入项目负责人验收。"],
        results: [["任务结论", task.criterion || "按批准标准判断", "待登记", "待登记"]],
        failedActual: "实际结果不满足通过标准", defectId: `ISSUE-${id}`, defectTitle: `${task.name}未满足通过标准`,
        evidence: [[`E-${id}-01`, "执行记录", "待补充任务执行证据"]],
        audit: [[new Date().toLocaleString("zh-CN", { hour12: false }), "任务创建", `由需求中心创建并关联 ${requirementId}。`]]
      };
    }
  } catch (error) {}
  return null;
}

const requestedTask = new URLSearchParams(location.search).get("task") || "T-LEAK-B-V2";
const taskId = /^[A-Z0-9-]+$/.test(requestedTask) ? requestedTask : "T-LEAK-B-V2";
const record = taskRecords[taskId] || makeManagedTask(taskId) || makeFallback(taskId);
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const storageKey = `evidence-workbench-v2-task:${taskId}`;

function normalizeVerdict(value) {
  if (value === "不合规") return "未通过";
  return ["符合", "通过", "未通过", "不适用"].includes(value) ? value : "待登记";
}

function normalizeEvidenceStatus(value) {
  return value === "已复核" ? "已审核" : value;
}

function baseFormState() {
  return {
    fields: { sample: record.sample, environment: record.environment, equipment: record.equipment, batch: record.batch },
    results: record.results.map(([metric, standard, actual, verdict]) => ({
      metric, standard,
      actual: /待|未运行/.test(actual) ? "" : actual,
      verdict: normalizeVerdict(verdict)
    })),
    evidence: record.evidence.map(([id, title, note]) => ({
      id, title, note,
      status: /待|尚未|缺失/.test(note) ? "待补充" : "已附"
    })),
    note: "",
    workflow: "new",
    updatedAt: null,
    audit: [],
    defectCreated: false,
    retestCreated: false
  };
}

function loadFormState() {
  const fallback = baseFormState();
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey));
    if (!saved || saved.taskId !== taskId) return fallback;
    return {
      ...fallback,
      ...saved,
      fields: { ...fallback.fields, ...(saved.fields || {}) },
      results: Array.isArray(saved.results) ? saved.results.map((item) => ({ ...item, verdict: normalizeVerdict(item.verdict) })) : fallback.results,
      evidence: Array.isArray(saved.evidence) ? saved.evidence.map((item) => ({ ...item, status: normalizeEvidenceStatus(item.status) })) : fallback.evidence,
      audit: Array.isArray(saved.audit) ? saved.audit : []
    };
  } catch (error) {
    return fallback;
  }
}

let formState = loadFormState();
let demoState = formState.retestCreated ? "retest" : formState.defectCreated ? "failed" : "initial";
let dirty = false;

function makeFallback(id) {
  return {
    type: "模拟场景任务", title: "预览任务详情", subtitle: "该任务只存在于当前模拟场景中，不属于当前正式版本。",
    status: "仅预览", statusClass: "purple", stage: 1, requirement: "REQ-LEAK-001", version: "V2 · 当前正式版本未修改", owner: "测试组长", reviewer: "项目负责人", due: "未排期",
    criterion: "按模拟场景中定义的任务范围独立判断；退出预览后该任务消失。", failure: `未通过结果只记录到当前模拟任务（${id}），不会自动改变其他任务状态。`, evidenceId: "PREVIEW-ONLY",
    sample: "待定义", environment: "模拟场景预览", equipment: "待定义", batch: "未更新到正式版本",
    steps: ["确认模拟场景假设。", "定义任务范围和判定规则。", "生成变更单后再进入审批。"], results: [["预览任务", "规则待审批", "未执行", "仅预览"]], failedActual: "预览结果未通过", defectId: "PREVIEW-DEFECT", defectTitle: "模拟场景问题",
    evidence: [["PREVIEW", "模拟计算", "不属于正式证据"]], audit: [["当前会话", "模拟任务生成", "退出预览后消失，未更新到正式版本。"]]
  };
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character]);
}

function currentTime() {
  return new Date().toLocaleString("zh-CN", { hour12: false });
}

function overallPass() {
  return formState.results.length > 0 && formState.results.every((item) => ["符合", "通过", "不适用"].includes(item.verdict));
}

function derivedStatus() {
  if (demoState === "retest") return "待重新测试";
  if (demoState === "failed" || formState.workflow === "reviewed" && !overallPass()) return "未通过";
  return ({ new: record.status, draft: "草稿中", submitted: "待审核", returned: "已退回", reviewed: "待验收", closed: "已关闭" })[formState.workflow] || record.status;
}

function derivedStatusClass() {
  const status = derivedStatus();
  if (status === "未通过") return "red";
  if (status === "已关闭") return "green";
  if (status === "待审核") return "blue";
  if (status === "待验收") return "purple";
  return status === "草稿中" || status === "已退回" || status === "待重新测试" ? "amber" : record.statusClass;
}

function derivedQueue() {
  if (formState.workflow === "closed") return "closed";
  if (formState.workflow === "submitted") return "approval";
  if (formState.workflow === "reviewed" && overallPass()) return "acceptance";
  if (["待补证据资料", "需求来源资料待补充"].includes(derivedStatus())) return "evidence";
  return "retest";
}

function persistState() {
  const payload = {
    ...formState,
    taskId,
    status: derivedStatus(),
    queue: derivedQueue(),
    overallPass: overallPass()
  };
  localStorage.setItem(storageKey, JSON.stringify(payload));
}

function addAudit(title, note) {
  formState.audit.push([currentTime(), title, note]);
}

function saveState(workflow, title, note) {
  if (workflow) formState.workflow = workflow;
  formState.updatedAt = currentTime();
  if (title) addAudit(title, note);
  persistState();
  dirty = false;
  renderAll();
}

function requirementInfo() {
  let managed = null;
  try {
    managed = JSON.parse(localStorage.getItem("evidence-workbench-v2-requirements"))?.requirements?.[record.requirement] || null;
  } catch (error) {}
  return managed || window.requirementRecords?.[record.requirement] || {
    name: "未命名需求",
    description: "当前任务已关联需求编号，但需求内容尚未登记。",
    status: "待补充",
    statusClass: "red",
    missing: ["需求名称", "需求描述"]
  };
}

function renderRequirementSummary() {
  const requirement = requirementInfo();
  const href = `requirement.html?requirement=${encodeURIComponent(record.requirement)}`;
  $("#requirementSummaryName").textContent = requirement.name;
  $("#requirementSummaryCode").textContent = record.requirement;
  $("#requirementSummaryText").textContent = requirement.description;
  $("#requirementSummaryStatus").textContent = requirement.status;
  $("#requirementSummaryStatus").className = `badge ${requirement.statusClass}`;
  $("#requirementSummaryLink").href = href;
  $("#openRequirementDetail").href = href;
  $("#metaRequirement").href = href;
  const missing = requirement.missing || [];
  $("#requirementMissing").hidden = missing.length === 0;
  $("#requirementMissing").textContent = missing.length ? `仍需补充：${missing.join("、")}` : "";
}

function renderHeader() {
  document.title = `${record.title}｜任务详情`;
  $("#taskType").textContent = record.type;
  $("#taskTitle").textContent = record.title;
  $("#taskSubtitle").textContent = record.subtitle;
  $("#taskStatus").textContent = derivedStatus();
  $("#taskStatus").className = `badge ${derivedStatusClass()}`;
  $("#crumbRequirement").textContent = record.requirement;
  $("#crumbTask").textContent = taskId;
  $("#metaTask").textContent = taskId;
  $("#metaRequirement").textContent = record.requirement;
  $("#metaVersion").textContent = record.version;
  $("#metaOwner").textContent = record.owner;
  $("#metaReviewer").textContent = record.reviewer;
  $("#metaDue").textContent = record.due;
  $("#criterionTask").textContent = taskId;
  $("#criterionText").textContent = record.criterion;
  $("#failureText").textContent = record.failure;
  $("#responsibleOwner").textContent = record.owner;
  $("#responsibleReviewer").textContent = record.reviewer;
  $("#relRequirement").textContent = record.requirement;
  $("#relVersion").textContent = record.version;
  $("#relTask").textContent = taskId;
  $("#relEvidence").textContent = record.evidenceId;
  $("#relOutcome").textContent = demoState === "initial" ? derivedStatus() : record.defectId;
}

function renderLifecycle() {
  const base = ["任务创建", "待执行/重新测试", "结果审核", "待验收", "已关闭"];
  const normalLabels = formState.workflow === "submitted" ? ["任务创建", "已执行", "待审核", "待验收", "已关闭"]
    : formState.workflow === "reviewed" && overallPass() ? ["任务创建", "已执行", "已审核", "待验收", "已关闭"] : base;
  const labels = demoState === "initial" ? normalLabels : demoState === "failed" ? ["任务创建", "已执行", "未通过", "问题处理中", "待重新测试"] : ["任务创建", "已执行", "未通过记录已保留", "重新测试任务已建", "待重新测试"];
  const workflowIndex = formState.workflow === "closed" ? 5 : formState.workflow === "submitted" ? 2 : formState.workflow === "reviewed" && overallPass() ? 3 : formState.workflow === "draft" || formState.workflow === "returned" ? 1 : record.stage;
  const activeIndex = demoState === "initial" ? workflowIndex : demoState === "failed" ? 3 : 4;
  $("#lifecycleSteps").innerHTML = labels.map((label,index) => {
    const blocked = demoState !== "initial" && index === 2;
    const className = blocked ? "blocked" : index < activeIndex ? "done" : index === activeIndex ? "current" : "";
    const note = blocked ? "保留失败记录" : index < activeIndex ? "已留痕" : index === activeIndex ? "当前状态" : "尚未进入";
    return `<li class="${className}"><strong>${label}</strong><small>${note}</small></li>`;
  }).join("");
}

function renderExecution() {
  $("#sampleCount").value = formState.fields.sample;
  $("#environment").value = formState.fields.environment;
  $("#equipment").value = formState.fields.equipment;
  $("#batch").value = formState.fields.batch;
  $("#executionNote").value = formState.note || "";
  $("#charCount").textContent = `${(formState.note || "").length} / 300`;
  $("#stepList").innerHTML = record.steps.map((step) => `<li>${step}</li>`).join("");
  $("#resultRows").innerHTML = formState.results.map((row,index) => `<tr>
    <td><strong>${escapeHtml(row.metric)}</strong></td><td>${escapeHtml(row.standard)}</td>
    <td><input class="result-input" data-editable data-result-index="${index}" data-result-field="actual" value="${escapeHtml(row.actual)}" placeholder="填写实际结果"></td>
    <td><select class="result-select" data-editable data-result-index="${index}" data-result-field="verdict">
      ${["待登记","符合","通过","未通过","不适用"].map((option) => `<option ${row.verdict === option ? "selected" : ""}>${option}</option>`).join("")}
    </select></td></tr>`).join("");
  $("#resultState").textContent = derivedStatus();
  $("#resultState").className = `badge ${derivedStatusClass()}`;
  $("#evidenceList").innerHTML = formState.evidence.map((item,index) => `<div class="evidence-item" data-evidence-index="${index}">
    <span>${escapeHtml(item.id)}</span>
    <input class="evidence-title" data-editable data-evidence-field="title" value="${escapeHtml(item.title)}" aria-label="证据名称">
    <input data-editable data-evidence-field="note" value="${escapeHtml(item.note)}" aria-label="证据说明">
    <select data-editable data-evidence-field="status" aria-label="证据状态">${["待补充","已附","已审核"].map((option) => `<option ${item.status === option ? "selected" : ""}>${option}</option>`).join("")}</select>
    <button class="remove-evidence" data-remove-evidence="${index}" type="button">移除此记录</button>
  </div>`).join("");
  renderEditState();
  bindEditableEvents();
}

function renderAudit() {
  const entries = [...record.audit, ...formState.audit];
  $("#auditList").innerHTML = entries.map(([time,title,note]) => `<div class="audit-entry"><time>${time}</time><i></i><div><strong>${title}</strong><small>${note}</small></div></div>`).join("");
}

function renderEditState() {
  const messages = {
    new: "尚未保存 · 修改只存在于当前输入框",
    draft: `草稿已保存 · ${formState.updatedAt || "本机"}`,
    submitted: `已提交审核 · ${formState.updatedAt || "本机"}`,
    returned: `已退回补充 · ${formState.updatedAt || "本机"}`,
    reviewed: `${overallPass() ? "审核通过" : "审核确认未通过"} · ${formState.updatedAt || "本机"}`,
    closed: `已验收关闭 · ${formState.updatedAt || "本机"}`
  };
  $("#editState").textContent = dirty ? "有未保存的修改" : messages[formState.workflow];
  $(".edit-mode").classList.toggle("dirty", dirty);
}

function collectForm() {
  formState.fields = {
    sample: $("#sampleCount").value.trim(),
    environment: $("#environment").value.trim(),
    equipment: $("#equipment").value.trim(),
    batch: $("#batch").value.trim()
  };
  formState.note = $("#executionNote").value.trim();
  formState.results = formState.results.map((row,index) => ({
    ...row,
    actual: $(`[data-result-index="${index}"][data-result-field="actual"]`)?.value.trim() || "",
    verdict: $(`[data-result-index="${index}"][data-result-field="verdict"]`)?.value || "待登记"
  }));
  formState.evidence = $$("[data-evidence-index]").map((item,index) => ({
    id: formState.evidence[index]?.id || `E-NEW-${String(index + 1).padStart(2,"0")}`,
    title: item.querySelector('[data-evidence-field="title"]').value.trim(),
    note: item.querySelector('[data-evidence-field="note"]').value.trim(),
    status: item.querySelector('[data-evidence-field="status"]').value
  }));
}

function markDirty() {
  dirty = true;
  $("#editState").textContent = "有未保存的修改";
  $(".edit-mode").classList.add("dirty");
  $("#charCount").textContent = `${$("#executionNote").value.length} / 300`;
  updatePermissions();
}

function bindEditableEvents() {
  $$("[data-edit-field], [data-editable]").forEach((field) => {
    field.oninput = markDirty;
    field.onchange = markDirty;
  });
  $$("[data-remove-evidence]").forEach((button) => {
    button.onclick = () => {
      collectForm();
      formState.evidence.splice(Number(button.dataset.removeEvidence), 1);
      dirty = true;
      renderExecution();
      updatePermissions();
    };
  });
}

function validateForSubmit() {
  collectForm();
  $$(".field-invalid").forEach((field) => field.classList.remove("field-invalid"));
  const invalid = [];
  ["sampleCount","environment","equipment","batch"].forEach((id) => { if (!$("#" + id).value.trim()) invalid.push($("#" + id)); });
  formState.results.forEach((item,index) => {
    if (!item.actual) invalid.push($(`[data-result-index="${index}"][data-result-field="actual"]`));
    if (item.verdict === "待登记") invalid.push($(`[data-result-index="${index}"][data-result-field="verdict"]`));
  });
  formState.evidence.forEach((item,index) => {
    const card = $(`[data-evidence-index="${index}"]`);
    if (!item.title) invalid.push(card.querySelector('[data-evidence-field="title"]'));
    if (!item.note) invalid.push(card.querySelector('[data-evidence-field="note"]'));
    if (item.status === "待补充") invalid.push(card.querySelector('[data-evidence-field="status"]'));
  });
  invalid.filter(Boolean).forEach((field) => field.classList.add("field-invalid"));
  if (invalid.length || formState.evidence.length === 0) {
    showToast("提交前请补齐实验设置、全部结果和证据状态");
    invalid[0]?.focus();
    return false;
  }
  return true;
}

function retestId() {
  return `RT-${taskId.replace(/^T-/,"")}-02`;
}

function renderFailure() {
  const failed = demoState !== "initial";
  $("#defectEmpty").hidden = failed;
  $("#defectPanel").hidden = !failed;
  $("#retestCard").hidden = demoState !== "retest";
  if (failed) {
    $("#defectId").textContent = record.defectId;
    $("#defectTitle").textContent = record.defectTitle;
    const failedRow = formState.results.find((item) => item.verdict === "未通过");
    $("#defectReason").textContent = `${failedRow?.actual || record.failedActual}，不满足“${failedRow?.metric || formState.results[0]?.metric}”的本任务判定规则。该结论只影响 ${taskId}。`;
    $("#defectTask").textContent = taskId;
    $("#defectVersion").textContent = record.version;
    $("#retestId").textContent = retestId();
  }
  $("#createRetest").disabled = !failed || demoState === "retest";
  $("#createRetest").textContent = demoState === "retest" ? "重新测试任务已生成" : "生成重新测试任务";
}

function requirementCloseConditions() {
  if (!record.type.includes("测试")) return [];
  const baselineAccepted = formState.workflow === "new" && record.status === "待验收";
  const currentTaskPassed = formState.workflow === "closed" || baselineAccepted || formState.workflow === "reviewed" && overallPass();
  const evidenceComplete = formState.evidence.length > 0 && formState.evidence.every((item) => item.title && item.note && item.status !== "待补充");
  const noOpenDefect = !formState.defectCreated && !formState.retestCreated && !formState.results.some((item) => item.verdict === "未通过");
  const common = [
    { label: "需求来源证据已确认有效", passed: true },
    { label: "当前方案为 V2，验收标准为 v1.1", passed: record.version.includes("V2") },
    { label: "本任务执行证据完整", passed: evidenceComplete },
    { label: "不存在未关闭的问题单", passed: noOpenDefect }
  ];
  if (taskId === "T-LEAK-B-V2") return [
    common[0], common[1],
    { label: "V2 外观泄漏测试已通过", passed: true },
    { label: "V2 重量损失测试已通过并审核", passed: currentTaskPassed },
    common[2], common[3]
  ];
  if (taskId === "T-OPEN-A-V2") return [
    common[0], common[1],
    { label: "V2 开盖飞溅测试 A 已通过", passed: currentTaskPassed },
    { label: "V2 开盖飞溅测试 B 已通过", passed: true },
    common[2], common[3]
  ];
  if (taskId === "T-ASSEMBLY-A-V2") return [
    common[0], common[1],
    { label: "V2 装配容错测试 A 已通过并审核", passed: currentTaskPassed },
    { label: "V2 装配容错测试 B 已通过", passed: true },
    common[2], common[3]
  ];
  return [common[0], common[1], { label: "当前任务已通过并审核", passed: currentTaskPassed }, common[2], common[3]];
}

function requirementGateReady() {
  const conditions = requirementCloseConditions();
  return conditions.length > 0 && conditions.every((item) => item.passed);
}

function inAcceptanceStage() {
  return formState.workflow === "closed" || formState.workflow === "reviewed" && overallPass() || formState.workflow === "new" && record.status === "待验收";
}

function renderAcceptance() {
  const conditions = requirementCloseConditions();
  const visible = conditions.length > 0;
  const closed = formState.workflow === "closed";
  const passedCount = conditions.filter((item) => item.passed).length;
  const missingCount = conditions.length - passedCount;
  $("#acceptancePanel").hidden = !visible;
  $("#acceptancePanel").classList.toggle("completed", closed);
  $("#acceptanceTitle").textContent = closed ? "需求已验收并关闭" : missingCount === 0 ? "需求关闭条件已满足" : "需求关闭条件";
  $("#acceptanceHint").textContent = closed
    ? "关闭记录已写入操作与审核记录；原始实验、证据和审核结果继续保留。"
    : missingCount === 0 ? "全部关闭条件已满足，等待项目负责人最终确认。" : `尚有 ${missingCount} 项未满足，系统已禁止关闭需求。`;
  $("#gateProgress").textContent = `${passedCount} / ${conditions.length}`;
  $("#gateList").innerHTML = conditions.map((item) => `<li class="${item.passed ? "passed" : ""}">${item.label}</li>`).join("");
  $("#rejectAcceptance").hidden = closed || !inAcceptanceStage();
  $("#closeAcceptance").hidden = closed;
}

function renderAll() {
  renderHeader();
  renderRequirementSummary();
  renderLifecycle();
  renderExecution();
  renderAcceptance();
  renderFailure();
  renderAudit();
  updatePermissions();
}

function activatePanel(name) {
  $$("[data-detail-panel]").forEach((panel) => { panel.hidden = panel.dataset.detailPanel !== name; });
  $$(".detail-tabs button").forEach((button) => {
    const active = button.dataset.panel === name;
    button.classList.toggle("active", active);
    button.setAttribute("aria-selected", String(active));
  });
}

function showToast(message) {
  const toast = $("#detailToast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 2200);
}

function updatePermissions() {
  const role = $("#detailRole").value;
  const testTask = record.type.includes("测试") || record.type.includes("预览");
  const ownerRole = ({ "测试组长": "test", "设计组长": "design", "项目负责人": "project" })[record.owner] || (testTask ? "test" : "project");
  const canRecord = role === ownerRole;
  const baselineAwaitingAcceptance = formState.workflow === "new" && record.status === "待验收";
  const canEdit = canRecord && !baselineAwaitingAcceptance && !["submitted","reviewed","closed"].includes(formState.workflow);
  const canReview = role === "project" && record.reviewer === "项目负责人" && formState.workflow === "submitted";
  const canAccept = role === "project" && inAcceptanceStage() && requirementGateReady();
  $$("#panel-execution input,#panel-execution select,#panel-execution textarea").forEach((field) => { field.disabled = !canEdit; });
  $$(".remove-evidence").forEach((button) => { button.disabled = !canEdit; });
  $("#addEvidence").disabled = !canEdit;
  $("#saveDraft").disabled = !canEdit;
  $("#submitReview").disabled = !canEdit;
  $("#resetDraft").disabled = !canEdit;
  $$(".review-action").forEach((button) => { button.hidden = !canReview; });
  $("#rejectAcceptance").disabled = !canAccept;
  $("#closeAcceptance").disabled = !canAccept;
  $("#closeAcceptance").title = requirementGateReady() ? (role === "project" ? "" : "只有项目负责人可以最终关闭需求") : "仍有需求关闭条件未满足";
  const hasFailure = $$('[data-result-field="verdict"]').some((field) => field.value === "未通过");
  $("#simulateFailure").disabled = !canRecord || demoState !== "initial" || !hasFailure;
  $("#createRetest").disabled = !canRecord || demoState === "initial" || demoState === "retest";
  $("#simulateFailure").title = !canRecord ? `只有任务负责人（${record.owner}）可以登记结果` : !hasFailure ? "请先在执行页把至少一项结论设为未通过" : "";
  $("#editHint").textContent = canEdit ? "可直接修改；保存草稿不会进入审批，提交审核后字段锁定。" : canReview ? "记录已锁定，项目负责人可退回补充或确认审核。" : canAccept ? "需求关闭条件已全部满足，请在上方完成最终确认。" : formState.workflow === "closed" ? "任务已关闭，全部记录为只读并继续保留。" : baselineAwaitingAcceptance ? "当前记录已进入待验收，需由项目负责人关闭或退回。" : "当前角色为只读；切换到任务负责人后才可编辑。";
  if (inAcceptanceStage() && formState.workflow !== "closed") {
    $("#acceptanceHint").textContent = canAccept
      ? "全部条件已满足。项目负责人可以确认关闭，也可以退回测试补充。"
      : requirementGateReady() ? "全部条件已满足；只有项目负责人可以执行最终关闭或退回。" : $("#acceptanceHint").textContent;
  }
}

$$('.detail-tabs button').forEach((button) => button.addEventListener('click', () => activatePanel(button.dataset.panel)));
$("#detailRole").addEventListener("change", () => { updatePermissions(); showToast(`已切换为${$("#detailRole").selectedOptions[0].textContent}`); });
$("#simulateFailure").addEventListener("click", () => {
  collectForm();
  if (!formState.results.some((item) => item.verdict === "未通过")) return showToast("请先在执行与证据页把至少一项结论设为未通过");
  demoState = "failed";
  formState.defectCreated = true;
  addAudit("记录未通过项", `实际结果不满足 ${taskId} 的独立判定规则，生成问题单 ${record.defectId}。`);
  formState.updatedAt = currentTime();
  persistState();
  dirty = false;
  renderAll();
  showToast(`已生成问题单 ${record.defectId}，原始结果已保留`);
});
$("#createRetest").addEventListener("click", () => {
  demoState = "retest";
  formState.retestCreated = true;
  addAudit("创建重新测试任务", `新任务 ${retestId()} 引用原失败记录，不覆盖历史。`);
  formState.updatedAt = currentTime();
  persistState();
  renderAll();
  showToast(`已生成重新测试任务 ${retestId()}`);
});
$("#resetFailure").addEventListener("click", () => {
  demoState = "initial";
  formState.defectCreated = false;
  formState.retestCreated = false;
  persistState();
  renderAll();
  showToast("已清除问题单与重新测试演示，填写记录仍保留");
});

$("#saveDraft").addEventListener("click", () => {
  collectForm();
  saveState("draft", "保存执行草稿", `${taskId} 的实验设置、测量结果和证据记录已保存在本机。`);
  showToast("草稿已保存；刷新页面后仍会保留");
});

$("#submitReview").addEventListener("click", () => {
  if (!validateForSubmit()) return;
  saveState("submitted", "提交结果审核", `${taskId} 已由任务负责人提交，编辑字段已锁定。`);
  showToast("已提交项目负责人审核");
});

$("#returnReview").addEventListener("click", () => {
  saveState("returned", "退回补充", "项目负责人退回记录，任务负责人可继续修改。 ");
  showToast("已退回任务负责人补充");
});

$("#approveReview").addEventListener("click", () => {
  saveState("reviewed", overallPass() ? "确认审核通过" : "确认未通过", overallPass() ? "记录完整且结论通过，进入待验收。" : "记录完整但存在未通过项，需创建问题单并重新测试。 ");
  showToast(overallPass() ? "审核通过，任务进入待验收" : "已确认未通过，请创建问题单");
});

$("#rejectAcceptance").addEventListener("click", () => {
  if ($("#detailRole").value !== "project" || !inAcceptanceStage()) return showToast("只有项目负责人可在待验收阶段退回");
  saveState("returned", "验收退回", "项目负责人在最终验收阶段退回测试补充，原审核记录继续保留。 ");
  showToast("已退回测试补充，任务负责人可继续编辑");
});

$("#closeAcceptance").addEventListener("click", () => {
  if ($("#detailRole").value !== "project") return showToast("只有项目负责人可以最终关闭需求");
  if (!inAcceptanceStage() || !requirementGateReady()) return showToast("仍有需求关闭条件未满足，暂时不能关闭");
  saveState("closed", "确认验收并关闭", `项目负责人确认 ${taskId} 满足当前版本验收标准，需求进入已关闭状态。`);
  showToast("验收完成，需求已关闭");
});

$("#resetDraft").addEventListener("click", () => {
  localStorage.removeItem(storageKey);
  formState = baseFormState();
  demoState = "initial";
  dirty = false;
  renderAll();
  showToast("已恢复任务原值，本地草稿已清除");
});

$("#addEvidence").addEventListener("click", () => {
  collectForm();
  formState.evidence.push({ id: `E-NEW-${String(formState.evidence.length + 1).padStart(2,"0")}`, title: "", note: "", status: "待补充" });
  dirty = true;
  renderExecution();
  updatePermissions();
  $$(".evidence-title").at(-1)?.focus();
});

$("#detailRole").value = ({ "项目负责人": "project", "设计组长": "design", "测试组长": "test" })[record.owner] || "test";
renderAll();
