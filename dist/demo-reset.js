(() => {
  const prefixes = ["evidence-workbench-v2-task:", "evidence-workbench-task:", "evidence-workbench-v2-requirements", "evidence-workbench-v2-design-versions", "evidence-workbench-v2-change-log", "evidence-workbench-v2-scenarios"];
  const trigger = document.querySelector("#resetDemoBtn");
  const modal = document.querySelector("#resetDemoModal");
  const cancel = document.querySelector("#cancelDemoReset");
  const confirm = document.querySelector("#confirmDemoReset");
  const countLabel = document.querySelector("#resetRecordCount");
  let previousFocus = null;

  if (!trigger || !modal || !cancel || !confirm) return;

  function matchingKeys() {
    return Object.keys(localStorage).filter((key) => prefixes.some((prefix) => key.startsWith(prefix)));
  }

  function openModal() {
    previousFocus = document.activeElement;
    const count = matchingKeys().length;
    countLabel.textContent = count > 0 ? `将清除 ${count} 条本机演示需求、任务或方案版本记录` : "当前没有已保存的演示记录；仍可恢复界面与模拟场景";
    modal.hidden = false;
    document.body.classList.add("modal-open");
    confirm.focus();
  }

  function closeModal() {
    modal.hidden = true;
    document.body.classList.remove("modal-open");
    previousFocus?.focus();
  }

  function resetDemo() {
    matchingKeys().forEach((key) => localStorage.removeItem(key));
    const target = new URL("index.html", location.href);
    target.searchParams.set("reset", "1");
    location.href = target.href;
  }

  trigger.addEventListener("click", openModal);
  cancel.addEventListener("click", closeModal);
  confirm.addEventListener("click", resetDemo);
  modal.addEventListener("click", (event) => { if (event.target === modal) closeModal(); });
  document.addEventListener("keydown", (event) => { if (event.key === "Escape" && !modal.hidden) closeModal(); });

  if (new URLSearchParams(location.search).get("reset") === "1") {
    history.replaceState({}, "", location.pathname);
    const toast = document.querySelector("#toast") || document.querySelector("#detailToast");
    if (toast) {
      toast.textContent = "演示数据已恢复到初始状态";
      requestAnimationFrame(() => toast.classList.add("show"));
      setTimeout(() => toast.classList.remove("show"), 2600);
    }
  }
})();
