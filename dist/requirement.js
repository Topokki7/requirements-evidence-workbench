const requirementIdParam = new URLSearchParams(location.search).get("requirement") || "REQ-LEAK-001";
const requirementId = /^[A-Z0-9-]+$/.test(requirementIdParam) ? requirementIdParam : "REQ-LEAK-001";
function managedRequirement(id) {
  try {
    const saved = JSON.parse(localStorage.getItem("evidence-workbench-v2-requirements"));
    return saved?.requirements?.[id] || null;
  } catch (error) { return null; }
}
const requirement = managedRequirement(requirementId) || window.requirementRecords?.[requirementId] || window.requirementRecords["REQ-LEAK-001"];
const $ = (selector) => document.querySelector(selector);

function readTaskState(taskId) {
  try {
    const value = JSON.parse(localStorage.getItem(`evidence-workbench-v2-task:${taskId}`));
    return value?.taskId === taskId ? value : null;
  } catch (error) {
    return null;
  }
}

function taskDisplay(task) {
  const saved = readTaskState(task.id);
  if (!saved || saved.workflow === "new") return task;
  const mapped = {
    draft: ["草稿中", "amber"],
    submitted: ["待审核", "blue"],
    returned: ["已退回补充", "amber"],
    reviewed: saved.overallPass ? ["待验收", "purple"] : ["未通过", "red"],
    closed: ["已关闭", "green"]
  }[saved.workflow];
  return mapped ? { ...task, status: mapped[0], statusClass: mapped[1] } : task;
}

function conditionPassed(label) {
  const linked = requirement.tasks.map(taskDisplay);
  const statusOf = (id) => linked.find((task) => task.id === id)?.status || "";
  const passed = (id) => /已通过|待验收|已关闭/.test(statusOf(id));
  if (/需求来源证据有效/.test(label)) return (requirement.missing || []).length === 0;
  if (/当前版本与验收标准明确/.test(label)) return true;
  if (/原始问题描述完整/.test(label)) return !(requirement.missing || []).includes("原始问题描述");
  if (/来源渠道与时间明确/.test(label)) return true;
  if (/审核结论和审核人/.test(label)) return !(requirement.missing || []).some((item) => /审核/.test(item));
  if (/物理测试规则已批准|必需测试全部通过/.test(label)) return false;
  if (/外观泄漏测试/.test(label)) return passed("T-LEAK-A-V2");
  if (/重量损失测试/.test(label)) return passed("T-LEAK-B-V2");
  if (/开盖飞溅测试 A/.test(label)) return passed("T-OPEN-A-V2");
  if (/开盖飞溅测试 B/.test(label)) return passed("T-OPEN-B-V2");
  if (/装配容错测试 A/.test(label)) return passed("T-ASSEMBLY-A-V2");
  if (/装配保持测试 B/.test(label)) return passed("T-ASSEMBLY-B-V2");
  if (/执行证据完整/.test(label)) return (requirement.missing || []).length === 0;
  if (/不存在未关闭/.test(label)) return !linked.some((task) => task.status === "未通过");
  return false;
}

function renderRequirement() {
  document.title = `${requirement.name}｜需求详情`;
  $("#crumbRequirement").textContent = requirementId;
  $("#requirementTitle").textContent = requirement.name;
  $("#requirementDescription").textContent = requirement.description;
  $("#fullRequirement").textContent = requirement.description;
  $("#requirementStatus").textContent = requirement.status;
  $("#requirementStatus").className = `badge ${requirement.statusClass}`;
  $("#metaRequirement").textContent = requirementId;
  $("#metaVersion").textContent = requirement.version;
  $("#metaOwner").textContent = requirement.owner;
  $("#metaEvidence").textContent = requirement.sourceEvidence;
  $("#sourceText").textContent = requirement.source;
  $("#sourceEvidence").textContent = requirement.sourceEvidence;
  $("#acceptanceList").innerHTML = requirement.acceptance.map((item) => `<li>${item}</li>`).join("");

  const missing = requirement.missing || [];
  $("#sourceGap").hidden = missing.length === 0;
  $("#missingList").innerHTML = missing.map((item) => `<li>${item}</li>`).join("");

  const tasks = requirement.tasks.map(taskDisplay);
  $("#linkedTasks").innerHTML = tasks.map((task) => {
    const content = `<span><strong>${task.name}（${task.id}）</strong><small>${task.available ? "点击打开任务详情" : "当前原型仅保留状态"}</small></span><span class="badge ${task.statusClass}">${task.status}</span>`;
    return task.available ? `<a class="linked-task" href="task.html?task=${encodeURIComponent(task.id)}">${content}</a>` : `<div class="linked-task static">${content}</div>`;
  }).join("");

  const backTask = tasks.find((task) => task.available);
  if (backTask) {
    $("#backToTask").href = `task.html?task=${encodeURIComponent(backTask.id)}`;
    $("#backToTask").textContent = "← 返回关联任务";
  }

  const conditions = requirement.closeConditions.map((label) => ({ label, passed: conditionPassed(label) }));
  const passedCount = conditions.filter((item) => item.passed).length;
  $("#closeProgress").textContent = `${passedCount} / ${conditions.length}`;
  $("#closeConditionList").innerHTML = conditions.map((item) => `<li class="${item.passed ? "passed" : ""}">${item.label}</li>`).join("");
}

renderRequirement();
