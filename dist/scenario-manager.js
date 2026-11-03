(() => {
  const STORAGE_KEY = "evidence-workbench-v2-scenarios";
  const select = document.querySelector("#scenarioSelect");
  const modal = document.querySelector("#scenarioEditorModal");
  if (!select || !modal || typeof scenarioConfig === "undefined") return;

  const defaultNames = {
    baseline: "当前正式版本",
    designV3: "假设发现结构问题：V2 → V3",
    strict: "重量差 1g → 0.5g",
    evidenceOff: "一条证据不再有效"
  };
  const defaultCategories = { designV3: "方案结构变化", strict: "验收标准变化", evidenceOff: "证据状态变化" };
  let editorMode = "add";
  let editingKey = null;
  let previousFocus = null;

  function clone(value) { return JSON.parse(JSON.stringify(value)); }
  function currentRole() { return document.querySelector("#roleSelect")?.value || "member"; }
  function canManage() { return ["project", "design"].includes(currentRole()); }
  function percent(value, fallback) {
    const parsed = Math.max(0, Math.min(100, Number(value)));
    return Number.isFinite(parsed) ? `${parsed}%` : fallback;
  }
  function numberValue(value, fallback = 0) {
    const parsed = Math.max(0, Math.min(99, Number(value)));
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  function enrichDefaults() {
    Object.entries(scenarioConfig).forEach(([key, config]) => {
      config.optionLabel ||= defaultNames[key] || config.label;
      config.category ||= defaultCategories[key] || "其他";
    });
  }

  function load() {
    enrichDefaults();
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) return;
    try {
      const saved = JSON.parse(raw);
      if (!saved || typeof saved !== "object" || Array.isArray(saved)) return;
      Object.keys(scenarioConfig).filter((key) => key !== "baseline").forEach((key) => delete scenarioConfig[key]);
      Object.entries(saved).forEach(([key, config]) => { scenarioConfig[key] = config; });
    } catch (error) {}
  }

  function persist() {
    const saved = Object.fromEntries(Object.entries(scenarioConfig).filter(([key]) => key !== "baseline").map(([key, config]) => [key, clone(config)]));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
  }

  function rebuild(selectedKey = select.value) {
    select.innerHTML = "";
    Object.entries(scenarioConfig).forEach(([key, config]) => select.add(new Option(config.optionLabel || config.label, key)));
    select.value = scenarioConfig[selectedKey] ? selectedKey : "baseline";
    updateButtons();
  }

  function updateButtons() {
    const protectedScenario = select.value === "baseline";
    document.querySelector("#addScenario").disabled = !canManage();
    document.querySelector("#editScenario").disabled = !canManage() || protectedScenario;
    document.querySelector("#deleteScenario").disabled = !canManage() || protectedScenario;
  }

  function openEditor(mode) {
    if (!canManage()) return showToast("当前角色不能维护模拟场景");
    if (mode === "edit" && select.value === "baseline") return showToast("当前正式版本是系统基准，不能修改");
    editorMode = mode;
    editingKey = mode === "edit" ? select.value : null;
    const item = mode === "edit" ? scenarioConfig[editingKey] : {
      optionLabel: "", category: "其他", summary: "",
      counts: { ...scenarioConfig.baseline.counts }, metrics: { ...scenarioConfig.baseline.metrics }
    };
    previousFocus = document.activeElement;
    document.querySelector("#scenarioEditorTitle").textContent = mode === "edit" ? "修改模拟场景" : "新增模拟场景";
    document.querySelector("#editScenarioName").value = item.optionLabel || item.label || "";
    document.querySelector("#editScenarioCategory").value = item.category || "其他";
    document.querySelector("#editScenarioRetest").value = item.counts?.retest ?? 0;
    document.querySelector("#editScenarioEvidenceCount").value = item.counts?.evidence ?? 0;
    document.querySelector("#editScenarioEvidenceMetric").value = Number.parseFloat(item.metrics?.evidence) || 0;
    document.querySelector("#editScenarioDesignMetric").value = Number.parseFloat(item.metrics?.design) || 0;
    document.querySelector("#editScenarioVerificationMetric").value = Number.parseFloat(item.metrics?.verification) || 0;
    document.querySelector("#editScenarioSummary").value = item.summary || "";
    modal.hidden = false;
    document.body.classList.add("modal-open");
    document.querySelector("#editScenarioName").focus();
  }

  function closeEditor() {
    modal.hidden = true;
    document.body.classList.remove("modal-open");
    document.querySelector("#scenarioEditorForm").reset();
    previousFocus?.focus();
  }

  document.querySelector("#scenarioEditorForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const name = document.querySelector("#editScenarioName").value.trim();
    const key = editorMode === "edit" ? editingKey : `custom-${Date.now()}`;
    const current = scenarioConfig[key] || scenarioConfig.baseline;
    scenarioConfig[key] = {
      label: `预览：${name}`,
      optionLabel: name,
      category: document.querySelector("#editScenarioCategory").value,
      counts: {
        retest: numberValue(document.querySelector("#editScenarioRetest").value),
        approval: current.counts?.approval ?? scenarioConfig.baseline.counts.approval,
        acceptance: current.counts?.acceptance ?? scenarioConfig.baseline.counts.acceptance,
        evidence: numberValue(document.querySelector("#editScenarioEvidenceCount").value),
        closed: current.counts?.closed ?? scenarioConfig.baseline.counts.closed
      },
      metrics: {
        evidence: percent(document.querySelector("#editScenarioEvidenceMetric").value, "0%"),
        design: percent(document.querySelector("#editScenarioDesignMetric").value, "0%"),
        verification: percent(document.querySelector("#editScenarioVerificationMetric").value, "0%"),
        closed: current.metrics?.closed ?? scenarioConfig.baseline.metrics.closed
      },
      summary: document.querySelector("#editScenarioSummary").value.trim()
    };
    persist();
    rebuild(key);
    closeEditor();
    setScenario(key);
    showToast(editorMode === "edit" ? "模拟场景已修改并重新试算" : "模拟场景已新增并进入试算");
  });

  document.querySelector("#addScenario").addEventListener("click", () => openEditor("add"));
  document.querySelector("#editScenario").addEventListener("click", () => openEditor("edit"));
  document.querySelector("#deleteScenario").addEventListener("click", () => {
    if (!canManage()) return showToast("当前角色不能删除模拟场景");
    const key = select.value;
    if (key === "baseline") return showToast("当前正式版本是系统基准，不能删除");
    if (!window.confirm(`确认删除模拟场景“${scenarioConfig[key].optionLabel || scenarioConfig[key].label}”？已生成的变更记录不会被删除。`)) return;
    delete scenarioConfig[key];
    persist();
    rebuild("baseline");
    setScenario("baseline");
    showToast("模拟场景已删除；正式数据和历史变更记录未修改");
  });
  document.querySelector("#cancelScenarioEditor").addEventListener("click", closeEditor);
  modal.addEventListener("click", (event) => { if (event.target === modal) closeEditor(); });
  select.addEventListener("change", updateButtons);
  document.querySelector("#roleSelect")?.addEventListener("change", updateButtons);
  document.addEventListener("keydown", (event) => { if (event.key === "Escape" && !modal.hidden) closeEditor(); });

  load();
  rebuild(activeScenario);
})();
