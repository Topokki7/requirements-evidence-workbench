window.requirementRecords = {
  "REQ-LEAK-001": {
    name: "外卖盒密封防漏汤需求",
    description: "外卖盒在模拟配送过程中应保持密封，盒外不得出现可见液体，且测试前后重量差不得超过规定上限。",
    status: "测试进行中",
    statusClass: "amber",
    version: "V2 · 当前正式版本",
    owner: "项目负责人",
    source: "用户问题记录与配送场景分析（全合成）",
    sourceEvidence: "E-01 · 已确认有效",
    missing: [],
    acceptance: [
      "模拟配送 30 分钟后，盒外无可见液体。",
      "测试前后重量差不超过 1 克。",
      "外观泄漏与重量损失分别记录、分别审核。"
    ],
    tasks: [
      { id: "T-LEAK-A-V2", name: "外观泄漏测试", status: "已通过", statusClass: "green", available: false },
      { id: "T-LEAK-B-V2", name: "密封保持（重量损失）重新测试", status: "待重新测试", statusClass: "amber", available: true },
      { id: "APPL-B-V1-V2", name: "旧测试结果沿用审批", status: "待审批", statusClass: "blue", available: true }
    ],
    closeConditions: ["需求来源证据有效", "当前版本与验收标准明确", "外观泄漏测试通过", "重量损失测试通过并审核", "不存在未关闭的问题单"]
  },
  "REQ-OPEN-003": {
    name: "安全开盖防飞溅需求",
    description: "用户按规定动作开盖时，盒内液体不得飞溅到盒外，避免烫伤、污染桌面或影响使用体验。",
    status: "待最终验收",
    statusClass: "purple",
    version: "V2 · 当前正式版本",
    owner: "项目负责人",
    source: "开盖使用场景研究与风险分析（全合成）",
    sourceEvidence: "E-03 · 已确认有效",
    missing: [],
    acceptance: [
      "按规定角度和速度连续开盖 5 次。",
      "5 次测试的盒外收集纸均无可见液滴。",
      "每次动作和观察结果均有独立记录。"
    ],
    tasks: [
      { id: "T-OPEN-A-V2", name: "开盖防飞溅测试", status: "待验收", statusClass: "purple", available: true },
      { id: "T-OPEN-B-V2", name: "开盖动作稳定性测试", status: "已通过", statusClass: "green", available: false }
    ],
    closeConditions: ["需求来源证据有效", "当前版本与验收标准明确", "开盖飞溅测试 A 通过", "开盖飞溅测试 B 通过", "执行证据完整", "不存在未关闭的问题单"]
  },
  "REQ-EVID-004": {
    name: "暴力运输稳定性需求",
    description: "外卖盒经过规定的振动、倾斜和冲击后，盒体与盒盖不得松脱或出现明显泄漏。",
    status: "需求来源资料待补充",
    statusClass: "red",
    version: "V2 · 当前正式版本",
    owner: "项目负责人",
    source: "运输异常问题线索（全合成）",
    sourceEvidence: "E-04 · 尚未确认有效",
    missing: ["原始问题描述", "审核结论", "审核人"],
    acceptance: [
      "先补齐并确认需求来源资料。",
      "随后定义振动、倾斜和冲击的测试强度与次数。",
      "物理测试通过后仍需项目负责人完成最终验收。"
    ],
    tasks: [
      { id: "E-VERIFY-04", name: "暴力运输稳定性来源确认", status: "资料待补充", statusClass: "red", available: true }
    ],
    closeConditions: ["原始问题描述完整", "来源渠道与时间明确", "审核结论和审核人已记录", "物理测试规则已批准", "必需测试全部通过"]
  },
  "REQ-SEAL-005": {
    name: "碗盖装配容错需求",
    description: "碗盖在正常装配偏差范围内仍应可靠锁止，不得出现卡滞、未锁止到位或容易松脱。",
    status: "测试进行中",
    statusClass: "amber",
    version: "V2 · 当前正式版本",
    owner: "项目负责人",
    source: "装配过程观察与结构评审（全合成）",
    sourceEvidence: "E-05 · 已确认有效",
    missing: [],
    acceptance: [
      "连续装配 10 次，10 次均锁止到位。",
      "装配过程中卡滞次数为 0。",
      "每次锁止状态均有独立记录。"
    ],
    tasks: [
      { id: "T-ASSEMBLY-A-V2", name: "碗盖装配容错重新测试", status: "待重新测试", statusClass: "amber", available: true },
      { id: "T-ASSEMBLY-B-V2", name: "装配保持测试", status: "已通过", statusClass: "green", available: false }
    ],
    closeConditions: ["需求来源证据有效", "当前版本与验收标准明确", "装配容错测试 A 通过并审核", "装配保持测试 B 通过", "不存在未关闭的问题单"]
  }
};
