const requirements = [
  {
    id: "REQ-LEAK-001",
    requirementId: "REQ-LEAK-001",
    taskId: "T-LEAK-B-V2",
    title: "V2 · 密封保持（重量损失）重新测试",
    summary: "V2 的测试 B 尚未重新测试",
    queue: "retest",
    state: "待重新测试",
    evidence: "E-01 已确认有效",
    design: "方案 V2",
    designState: "当前已批准",
    tests: "A 通过 · B 待重新测试",
    owner: "测试组长",
    criterion: "测试 B（密封保持）：模拟配送 30 分钟后，测试前后重量差不超过 1 克。测试 A 另判“盒外无可见液体”，两项分别记录。",
    failureSignal: "重量差超过 1 克，记录到密封保持（重量损失）重新测试（T-LEAK-B-V2）；盒外出现液体，记录到外观泄漏测试（T-LEAK-A-V2）。",
    detail: "当前卡点是 T-LEAK-B-V2。测试 A 已通过；测试 B 只在 V1 通过，不能直接用于 V2，除非“旧测试结果可沿用”的证明材料获批。"
  },
  {
    id: "APPL-B-002",
    requirementId: "REQ-LEAK-001",
    taskId: "APPL-B-V1-V2",
    title: "V1→V2 · 重量损失测试结果沿用审批",
    summary: "V1→V2 旧测试结果沿用依据待审批",
    queue: "approval",
    state: "待审批",
    evidence: "E-APPL-02 待审批",
    design: "方案 V2",
    designState: "当前已批准",
    tests: "引用 V1-B · 尚未计入",
    owner: "项目负责人",
    criterion: "必须证明测试 B 覆盖的结构、材料和工艺在 V1 与 V2 间完全未改变，并附差异对比、原测试记录和测试组长审核结果。",
    failureSignal: "任一材料缺失或覆盖范围发生变化，旧测试结果沿用审批（APPL-B-V1-V2）即为未通过；密封保持（重量损失）重新测试（T-LEAK-B-V2）继续等待处理，不影响 V2 作为当前正式版本。",
    detail: "这是一条旧测试结果沿用审批，不是 V3 方案变更。审批通过后，V1-B 结果才可作为 V2 的有效记录。"
  },
  {
    id: "REQ-OPEN-003",
    requirementId: "REQ-OPEN-003",
    taskId: "T-OPEN-A-V2",
    title: "V2 · 开盖防飞溅测试验收",
    summary: "必需测试已通过，等待负责人确认",
    queue: "acceptance",
    state: "待验收",
    evidence: "E-03 已确认有效",
    design: "方案 V2",
    designState: "当前已批准",
    tests: "A 通过 · B 通过",
    owner: "测试组长",
    criterion: "测试 A（开盖飞溅）：按规定动作连续开盖 5 次，盒外收集纸均无可见液滴；5 次必须逐次记录。",
    failureSignal: "任一次出现液滴，记录到开盖防飞溅测试（T-OPEN-A-V2）；不记录到密封保持测试或碗盖装配容错测试。",
    detail: "测试已满足验收标准，但需求不会自动关闭；项目负责人确认后才可标记为已关闭。"
  },
  {
    id: "REQ-EVID-004",
    requirementId: "REQ-EVID-004",
    taskId: "E-VERIFY-04",
    title: "需求级 · 暴力运输稳定性来源确认",
    summary: "一条需求来源资料尚未确认有效",
    queue: "evidence",
    state: "需求来源资料待补充",
    evidence: "E-04 尚未确认有效",
    design: "方案 V2",
    designState: "当前已批准",
    tests: "尚未进入测试",
    owner: "项目负责人",
    criterion: "证据记录必须包含来源时间、来源渠道、原始问题描述和审核结论；缺少任一项即判为资料未确认。",
    failureSignal: "资料不完整，记录到暴力运输稳定性来源确认（E-VERIFY-04）；在补齐前不得创建对应的物理测试通过记录。",
    detail: "该需求存在来源记录，但资料尚未确认有效。确认前不能计入有效证据覆盖比例。"
  },
  {
    id: "REQ-SEAL-005",
    requirementId: "REQ-SEAL-005",
    taskId: "T-ASSEMBLY-A-V2",
    title: "V2 · 碗盖装配容错重新测试",
    summary: "V2 结构变化影响装配测试",
    queue: "retest",
    state: "待重新测试",
    evidence: "E-05 已确认有效",
    design: "方案 V2",
    designState: "当前已批准",
    tests: "A 待重新测试 · B 通过",
    owner: "测试组长",
    criterion: "测试 A（装配容错）：连续装配 10 次，10 次均锁止到位且无卡滞；每次记录锁止状态。",
    failureSignal: "任何一次未锁止或卡滞，记录到碗盖装配容错重新测试（T-ASSEMBLY-A-V2）；不记录到泄漏测试。",
    detail: "装配结构发生变化，旧版测试保留但不计入当前通过，需要新测试记录或证明旧测试结果可沿用的材料。"
  }
];

const queueMeta = {
  retest: { label: "待重新测试", className: "amber" },
  approval: { label: "待审批", className: "blue" },
  acceptance: { label: "待验收", className: "purple" },
  evidence: { label: "需求来源资料待补充", className: "red" },
  closed: { label: "已关闭", className: "green" }
};

const scenarioConfig = {
  baseline: {
    label: "当前正式版本",
    counts: { retest: 2, approval: 1, acceptance: 1, evidence: 1 },
    metrics: { evidence: "75%", design: "75%", verification: "25%", closed: "0" },
    summary: "尚未进入预览。正式数据未修改。"
  },
  designV3: {
    label: "假设预览：V2 → V3",
    counts: { retest: 3, approval: 1, acceptance: 1, evidence: 1 },
    metrics: { evidence: "75%", design: "50%", verification: "0%", closed: "0" },
    summary: "仅假设重新测试发现盒盖锁定结构问题后提出 V3。3 条需求受影响，4 项测试需检查；这不是当前事实，也不代表 V2 已失败。"
  },
  strict: {
    label: "预览：标准收紧",
    counts: { retest: 2, approval: 1, acceptance: 1, evidence: 1 },
    metrics: { evidence: "75%", design: "75%", verification: "25%", closed: "0" },
    summary: "重量差上限从 1 克收紧到 0.5 克，只影响使用该指标的 T-LEAK-B-V2；开盖和装配任务使用各自规则，不受影响。"
  },
  evidenceOff: {
    label: "预览：证据不再有效",
    counts: { retest: 2, approval: 1, acceptance: 1, evidence: 2 },
    metrics: { evidence: "50%", design: "75%", verification: "0%", closed: "0" },
    summary: "一条已确认有效的证据改为未确认。有效证据覆盖比例下降，2 条需求显示资料待补充，公开导出将省略相关内容。"
  }
};

let activeFilter = "all";
let selectedId = requirements[0].id;
let activeScenario = "baseline";
let draftCreated = false;
let draftScenario = null;

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

function badge(queue) {
  const meta = queueMeta[queue];
  return `<span class="badge ${meta.className}">${meta.label}</span>`;
}

function readLocalTask(taskId) {
  try {
    const value = JSON.parse(localStorage.getItem(`evidence-workbench-v2-task:${taskId}`));
    return value?.taskId === taskId ? value : null;
  } catch (error) {
    return null;
  }
}

function displayStatus(value) {
  return ({ "不合规": "未通过", "待复验": "待重新测试", "待复核": "待审核", "证据缺口": "需求来源资料待补充", "待补证据资料": "需求来源资料待补充" })[value] || value;
}

function applyLocalTaskState(item) {
  const saved = readLocalTask(item.taskId);
  if (!saved || saved.workflow === "new") return item;
  const messages = {
    draft: "已有本机草稿，尚未提交",
    submitted: "执行记录已提交，等待项目负责人审核",
    returned: "审核已退回，等待任务负责人补充",
    reviewed: saved.overallPass ? "记录已审核通过，等待最终验收" : "审核确认未通过，等待问题处理",
    closed: "项目负责人已验收，需求正式关闭"
  };
  return {
    ...item,
    queue: saved.queue || item.queue,
    state: displayStatus(saved.status || item.state),
    summary: messages[saved.workflow] || item.summary,
    tests: saved.workflow === "submitted" ? "记录已提交 · 待审核" : saved.workflow === "reviewed" ? (saved.overallPass ? "当前测试已审核通过" : "当前测试未通过") : item.tests,
    detail: `本任务在详情页有本机操作记录：${messages[saved.workflow] || displayStatus(saved.status)}。打开详情可继续处理并查看操作与审核记录。`
  };
}

function managedCustomTasks() {
  try {
    const managed = JSON.parse(localStorage.getItem("evidence-workbench-v2-requirements"))?.requirements || {};
    const builtInIds = new Set(requirements.map((item) => item.taskId));
    const queueFor = (status) => status === "待审批" ? "approval" : /待验收/.test(status) ? "acceptance" : /资料/.test(status) ? "evidence" : status === "已关闭" ? "closed" : "retest";
    return Object.entries(managed).flatMap(([requirementId, requirement]) => (requirement.tasks || [])
      .filter((task) => task.available && !builtInIds.has(task.id))
      .map((task) => ({
        id: `MANAGED-${task.id}`, requirementId, taskId: task.id,
        title: `${requirement.version?.split(" · ")[0] || "当前版本"} · ${task.name}`,
        summary: task.due && task.due !== "未排期" ? `目标日期 ${task.due}` : "已建立完整任务执行页",
        queue: queueFor(task.status), state: task.status,
        evidence: "任务执行页登记", design: requirement.version || "V2 · 当前正式版本", designState: "关联需求当前方案",
        tests: task.status, owner: task.owner || "测试组长", criterion: task.criterion,
        failureSignal: `未通过结果只记录到${task.name}（${task.id}），不会自动判定其他任务失败。`,
        detail: `该任务由需求中心新增，已进入正式任务执行流程；可填写结果、提交审核并由项目负责人验收。`
      })));
  } catch (error) { return []; }
}

function getTaskItems() {
  const items = [...requirements, ...managedCustomTasks()].map((item) => applyLocalTaskState({ ...item }));
  if (activeScenario === "designV3") {
    items.push({
      id: "SCN-V3-RETEST",
      requirementId: "REQ-LEAK-001",
      taskId: "T-V3-LOCK-01",
      title: "V3 新增重新测试范围",
      summary: "锁定结构变化新增 1 项重新测试",
      queue: "retest",
      state: "待重新测试",
      evidence: "预览计算",
      design: "方案 V3",
      designState: "模拟场景预览，未更新到正式版本",
      tests: "锁定结构测试待重新测试",
      owner: "测试组长",
      criterion: "假设 V3 改动锁定结构后，连续锁止 10 次，10 次均到位且不得出现松脱；该规则只属于 T-V3-LOCK-01。",
      failureSignal: "锁止不到位或松脱，记录到 V3 锁定结构重新测试（T-V3-LOCK-01）；不会自动判定其他泄漏或开盖任务失败。",
      detail: "该待办只存在于 V3 预览中。退出预览后消失；生成变更单也不会直接修改当前正式版本。"
    });
  }
  if (activeScenario === "strict") {
    const leakTask = items.find((item) => item.id === "REQ-LEAK-001");
    leakTask.summary = "测试 B 改用 0.5 克上限，仍待重新测试";
    leakTask.criterion = "测试 B（密封保持）：模拟配送 30 分钟后，测试前后重量差不超过 0.5 克。测试 A 的“盒外无可见液体”规则不变。";
    leakTask.failureSignal = "重量差超过 0.5 克归到 T-LEAK-B-V2；开盖或装配任务不受该验收标准影响。";
    leakTask.detail = "新验收标准只改变 T-LEAK-B-V2 的阈值。旧记录保留但不能自动满足 0.5 克要求；其他任务按自己的规则判断。";
  }
  if (activeScenario === "evidenceOff") {
    items.push({
      id: "SCN-EVID-GAP",
      requirementId: "REQ-LEAK-001",
      taskId: "E-VERIFY-01",
      title: "预览产生的需求来源资料待补充项",
      summary: "E-01 在模拟场景中被设为未确认",
      queue: "evidence",
      state: "需求来源资料待补充",
      evidence: "E-01 尚未确认有效（预览）",
      design: "方案 V2",
      designState: "当前已批准",
      tests: "结果保留 · 不计覆盖",
      owner: "项目负责人",
      criterion: "E-01 必须保持来源信息完整且审核有效；任一字段不再有效，即暂停计入覆盖比例。",
      failureSignal: "证据字段不再有效，记录到证据有效性确认（E-VERIFY-01）；不会把物理测试直接判为失败，但会阻止需求被标记为已验证。",
      detail: "待补资料状态只存在于证据预览中。退出预览后恢复当前正式版本。"
    });
  }
  return items;
}

function renderTasks() {
  const list = $("#taskList");
  const taskItems = getTaskItems();
  if (!taskItems.some((item) => item.id === selectedId)) selectedId = requirements[0].id;
  list.innerHTML = taskItems.map((item) => {
    const hidden = activeFilter !== "all" && item.queue !== activeFilter;
    return `<button class="task-item ${item.id === selectedId ? "selected" : ""} ${hidden ? "hidden" : ""}" data-id="${item.id}">
      <span><strong class="task-name">${item.title}</strong><small class="task-codes">任务编号 ${item.taskId} · 关联需求 ${item.requirementId}</small><small class="task-summary">${item.summary}</small></span>${badge(item.queue)}
    </button>`;
  }).join("");
  $$(".task-item").forEach((button) => button.addEventListener("click", () => {
    selectedId = button.dataset.id;
    renderTasks();
    renderSelected();
  }));
}

function renderSelected() {
  const item = getTaskItems().find((entry) => entry.id === selectedId) || requirements[0];
  const meta = queueMeta[item.queue];
  $("#chainTitle").textContent = item.title;
  $("#requirementState").textContent = item.state;
  $("#requirementState").className = `badge ${meta.className}`;
  $("#evidenceLabel").textContent = item.evidence;
  $("#requirementLabel").textContent = item.requirementId;
  $("#designLabel").textContent = item.design;
  $("#designState").textContent = item.designState;
  $("#testLabel").textContent = item.tests;
  $("#detailDrawer").innerHTML = `<strong>当前判断</strong><p>${item.detail}</p>`;
  $("#ruleNote").innerHTML = `<div class="rule-head"><span>本任务的通过标准</span><strong>${item.taskId} · ${item.owner}</strong></div><p>${item.criterion}</p><small><b>未通过原因对应的任务：</b>${item.failureSignal}</small>`;
  $("#openTaskDetail").href = `task.html?task=${encodeURIComponent(item.taskId)}`;
}

function renderCounts() {
  const config = scenarioConfig[activeScenario];
  const taskItems = getTaskItems();
  const counts = activeScenario === "baseline"
    ? taskItems.reduce((result,item) => ({ ...result, [item.queue]: (result[item.queue] || 0) + 1 }), { retest: 0, approval: 0, acceptance: 0, evidence: 0, closed: 0 })
    : config.counts;
  $("#countRetest").textContent = counts.retest;
  $("#countApproval").textContent = counts.approval;
  $("#countAcceptance").textContent = counts.acceptance;
  $("#countEvidence").textContent = counts.evidence;
  $("#metricEvidence").textContent = config.metrics.evidence;
  $("#metricDesign").textContent = config.metrics.design;
  $("#metricVerification").textContent = config.metrics.verification;
  $("#metricClosed").textContent = activeScenario === "baseline" ? taskItems.filter((item) => item.queue === "closed").length : config.metrics.closed;
}

function matrixCell(kind, text) {
  const dotClass = kind === "ok" ? "ok" : kind === "warn" ? "warn" : kind === "bad" ? "bad" : "muted";
  return `<span class="cell"><i class="dot ${dotClass}"></i>${text}</span>`;
}

function renderMatrix() {
  const preview = activeScenario;
  const rows = [
    ["REQ-LEAK-001", "ok", "已确认有效", preview === "evidenceOff" ? "bad" : "ok", preview === "designV3" ? "V3 假设" : "V2 当前", preview === "designV3" ? "warn" : "ok", preview === "designV3" ? "待重新测试 / T-LEAK-A-V3" : "通过 / T-LEAK-A-V2", "warn", preview === "designV3" ? "待重新测试 / T-LEAK-B-V3" : "待重新测试 / T-LEAK-B-V2", "muted", "否"],
    ["REQ-SEAL-005", "ok", "已确认有效", "ok", "V2 当前", "warn", "待重新测试 / T-ASSEMBLY-A-V2", "ok", "通过 / T-ASSEMBLY-B-V2", "muted", "否"],
    ["REQ-OPEN-003", "ok", "已确认有效", "ok", "V2 当前", "ok", "通过 / T-OPEN-A-V2", "ok", "通过 / T-OPEN-B-V2", "warn", "待验收"],
    ["REQ-EVID-004", "bad", "待确认", "ok", "V2 当前", "muted", "未运行", "muted", "未运行", "muted", "否"]
  ];
  const leakSaved = readLocalTask("T-LEAK-B-V2");
  if (preview === "baseline" && leakSaved && leakSaved.workflow !== "new") {
    if (leakSaved.workflow === "submitted") rows[0][7] = "warn", rows[0][8] = "待审核 / T-LEAK-B-V2";
    if (leakSaved.workflow === "draft" || leakSaved.workflow === "returned") rows[0][7] = "warn", rows[0][8] = `${displayStatus(leakSaved.status)} / T-LEAK-B-V2`;
    if (leakSaved.workflow === "reviewed") rows[0][7] = leakSaved.overallPass ? "ok" : "bad", rows[0][8] = `${leakSaved.overallPass ? "通过" : "未通过"} / T-LEAK-B-V2`;
    if (leakSaved.workflow === "closed") rows[0][7] = "ok", rows[0][8] = "通过 / T-LEAK-B-V2", rows[0][9] = "ok", rows[0][10] = "已关闭";
  }
  if (preview === "evidenceOff") rows[0][1] = "bad", rows[0][2] = "待确认";
  const customCategory = scenarioConfig[preview]?.category;
  if (!['baseline','designV3','strict','evidenceOff'].includes(preview)) {
    if (customCategory === "证据状态变化") rows[0][1] = "bad", rows[0][2] = "模拟为待确认", rows[0][9] = "muted", rows[0][10] = "否";
    if (["方案结构变化","材料或工艺变化"].includes(customCategory)) rows[0][3] = "warn", rows[0][4] = "变更预览", rows[0][5] = "warn", rows[0][6] = "待重新测试", rows[0][7] = "warn", rows[0][8] = "待重新测试";
    if (customCategory === "验收标准变化") rows[0][7] = "warn", rows[0][8] = "标准变化后待重新测试";
  }
  $("#matrixBody").innerHTML = rows.map((r) => `<tr><td><strong>${r[0]}</strong></td><td>${matrixCell(r[1],r[2])}</td><td>${matrixCell(r[3],r[4])}</td><td>${matrixCell(r[5],r[6])}</td><td>${matrixCell(r[7],r[8])}</td><td>${matrixCell(r[9],r[10])}</td></tr>`).join("");
}

function renderTimeline() {
  // 版本历史已统一收进顶部“方案版本管理”，避免重复维护第二套时间线。
}

function renderVersionGuide() {
  window.renderManagedVersions?.({ activeScenario, draftCreated, draftScenario });
}

function alignActiveVersion() {
  window.alignManagedVersion?.();
}

function setScenario(value) {
  activeScenario = value;
  const config = scenarioConfig[value];
  $("#scenarioBadge").textContent = config.label;
  $("#impactSummary").textContent = config.summary;
  $("#impactSummary").classList.toggle("preview", value !== "baseline");
  $("#createChange").disabled = value === "baseline";
  renderCounts();
  renderTasks();
  renderSelected();
  renderMatrix();
  renderTimeline();
  renderVersionGuide();
  showToast(value === "baseline" ? "已恢复当前正式版本" : `${config.label}：正式数据未修改`);
}

function setRole(role) {
  const action = $("#roleAction");
  const hint = $("#permissionHint");
  const rules = {
    project: ["查看待重新测试项", "项目负责人可审批组长提交的变更；本人发起的重大变更需项目主管/发起人审批。"],
    design: ["提交方案变更", "设计组长可编辑本组方案并提交审批，不能最终批准或修改测试记录。"],
    test: ["登记重新测试结果", "测试组长可编辑本组测试并提交审核，不能最终关闭需求。"],
    member: ["提交问题线索", "普通成员只查看和提交线索，不能修改正式记录。"]
  };
  [action.textContent, hint.textContent] = rules[role];
}

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 2200);
}

function focusTasks(filter) {
  activeFilter = filter;
  renderTasks();
  $("#tasks").scrollIntoView({ behavior: "smooth", block: "center" });
  $("#tasks").classList.remove("flash");
  requestAnimationFrame(() => $("#tasks").classList.add("flash"));
}

function exportReport() {
  const config = scenarioConfig[activeScenario];
  const content = [
    "外卖盒防漏汤需求追踪报告",
    "数据来源：全合成教学案例",
    `导出视图：${config.label}`,
    "当前正式方案：V2",
    `后续版本：${activeScenario === "designV3" || draftScenario === "designV3" ? "V3（假设/草案，未生效）" : "未创建"}`,
    "",
    `待重新测试：${config.counts.retest}`,
    `待审批：${config.counts.approval}`,
    `待验收：${config.counts.acceptance}`,
    `需求来源资料待补充：${config.counts.evidence}`,
    "",
    "冻结案例：REQ-LEAK-001 在 V2 下测试 B 未运行，状态为待重新测试。",
    "旧版本结果只有在存在“测试范围未改变”的证明材料并经审核后，才可沿用到当前版本。",
    "",
    "限制：本报告不代表真实产品通过测试、获得认证或完成量产。"
  ].join("\n");
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `防漏汤需求追踪报告-${activeScenario}.txt`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  showToast("追踪报告已导出");
}

$$('.status-card').forEach((card) => card.addEventListener('click', () => focusTasks(card.dataset.filter)));
$("#clearFilter").addEventListener("click", () => { activeFilter = "all"; renderTasks(); showToast("已清除筛选"); });
$("#scenarioSelect").addEventListener("change", (event) => setScenario(event.target.value));
$("#resetScenario").addEventListener("click", () => { $("#scenarioSelect").value = "baseline"; setScenario("baseline"); });
$("#createChange").addEventListener("click", () => {
  if (activeScenario === "baseline") return showToast("请先选择一个模拟场景");
  draftCreated = true;
  draftScenario = activeScenario;
  window.registerScenarioChangeRequest?.({ scenario: activeScenario, label: scenarioConfig[activeScenario].label, summary: scenarioConfig[activeScenario].summary });
  renderTimeline();
  renderVersionGuide();
  showToast("已发起变更申请，正式数据尚未修改");
  $("#versionGuide").scrollIntoView({ behavior: "smooth", block: "center" });
});
$("#roleSelect").addEventListener("change", (event) => { setRole(event.target.value); showToast(`已切换为${event.target.options[event.target.selectedIndex].text}`); });
$("#roleAction").addEventListener("click", () => {
  const role = $("#roleSelect").value;
  if (role === "project") return focusTasks("retest");
  showToast({ design: "方案变更已保存为草案", test: "已打开合成重新测试记录表", member: "问题线索已保存为草稿" }[role]);
});
$("#exportBtn").addEventListener("click", exportReport);
$$('.nav-item').forEach((button) => button.addEventListener('click', () => {
  $$('.nav-item').forEach((item) => item.classList.remove('active'));
  button.classList.add('active');
  const requirementTarget = button.dataset.target === "requirementWorkspace";
  document.querySelector(`[data-home-mode="${requirementTarget ? "requirements" : "tasks"}"]`)?.click();
  requestAnimationFrame(() => document.getElementById(button.dataset.target)?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
}));
$$('.version-list [data-version]').forEach((button) => button.addEventListener('click', () => {
  const versionButton = document.querySelector(`[data-version-code="${button.dataset.version}"]`);
  if (!versionButton) return showToast(`未找到方案 ${button.dataset.version}`);
  versionButton.click();
  $("#versionGuide")?.scrollIntoView({ behavior: "smooth", block: "center" });
}));
$$('.chain-node').forEach((node) => node.addEventListener('click', () => {
  const item = getTaskItems().find((entry) => entry.id === selectedId) || requirements[0];
  const details = {
    evidence: `<strong>证据记录</strong><p>${item.evidence}。资料是否有效与是否可公开是两个独立条件；本演示不显示真实原文。</p>`,
    requirement: `<strong>需求记录</strong><p>${item.requirementId} · ${item.title}。已批准需求才进入覆盖率分母。</p>`,
    design: `<strong>方案版本</strong><p>${item.design} · ${item.designState}。审批通过不代表已经应用，草稿不能替代当前方案。</p>`,
    tests: `<strong>测试任务 ${item.taskId}</strong><p>${item.tests}。${item.criterion}</p>`
  };
  $("#detailDrawer").innerHTML = details[node.dataset.detail];
}));

renderTasks();
renderSelected();
renderCounts();
renderMatrix();
renderTimeline();
renderVersionGuide();
setRole("project");
$("#createChange").disabled = true;
window.addEventListener("resize", alignActiveVersion);
window.addEventListener("pageshow", () => {
  renderTasks();
  renderSelected();
  renderCounts();
  renderMatrix();
});
window.addEventListener("storage", (event) => {
  if (!event.key?.startsWith("evidence-workbench-v2-task:")) return;
  renderTasks();
  renderSelected();
  renderCounts();
  renderMatrix();
});
