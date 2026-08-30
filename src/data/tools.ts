import type { Tool } from './types'

/**
 * 资料整理自腾讯内部 KM 与公开文档，工具版本以 2026-08 为准。
 * codebuddy 本机实测版本：2.125.0
 */
export const tools: Tool[] = [
  {
    id: 'codebuddy',
    name: 'CodeBuddy',
    tagline: '腾讯自研 Coding Agent，会自己读代码库、改代码、跑验证',
    bestFor: '你有明确想做的东西（小游戏、小工具、网页），希望它从头到尾做完并跑起来',
    notFor: '只想让它帮忙写周报、整理 Excel、生成 PPT —— 那是 WorkBuddy 的活',
    install: [
      {
        label: '安装（腾讯镜像源，内网可用）',
        cmd: 'npm install -g --registry=https://mirrors.tencent.com/npm @tencent/codebuddy-code',
      },
      { label: '确认装好了', cmd: 'codebuddy --version' },
      {
        label: '进入你的项目目录，开始第一轮',
        cmd: 'cd my-game && codebuddy "做一个贪吃蛇游戏，方向键控制，吃到食物加分"',
      },
    ],
    barrier: '低',
    strengths: [
      '端到端：需求 → 分析代码库 → 写代码 → 跑起来验证，不用你盯着每一步',
      '对中文需求理解好，说人话就能干活',
      '内网可用，走公司合规通道，代码不出内网',
      '支持 -p 非交互模式，可以塞进脚本里批量跑',
    ],
    weaknesses: [
      '需求越模糊产出越跑偏 —— 它不会读心，只会猜',
      '一次改太多文件时容易顾此失彼，需要你拆小步骤',
      '生成的代码能跑不等于对，得自己点一遍',
    ],
    quickStart: 'cd 到空目录 → codebuddy "我想做……" → 它问啥你答啥 → 跑起来看看',
  },
  {
    id: 'workbuddy',
    name: 'WorkBuddy',
    tagline: '全场景 AI 办公工作台，一句话让它干完一串活',
    bestFor: '日常办公：文档、表格、数据分析、多步骤杂活，尤其是"我不懂技术但要出活"',
    notFor: '要交付一个能跑的工程（网站/游戏）—— 它没有工程上下文，做不了',
    install: [
      { label: '桌面端：从腾讯官网下载安装包，登录即用', cmd: '# 无需命令行，下载安装即可' },
      { label: '确认入口', cmd: '打开 WorkBuddy → 新建任务 → 用自然语言描述你要办的事' },
    ],
    barrier: '极低',
    strengths: [
      '零命令行，图形界面 + 自然语言，非技术同学无障碍',
      '能直接操作本地文件（Excel、Word、PDF），不只是陪你聊天',
      '多步骤任务能自己拆、自己串起来做完',
      '适合做"素材整理"这类前期准备工作，再交给 CodeBuddy 落地',
    ],
    weaknesses: [
      '产出偏文档/数据，不适合产出可运行的软件工程',
      '对"代码库"没有上下文，跨文件一致性差',
      '复杂逻辑容易在中间步骤悄悄跑偏',
    ],
    quickStart: '打开 WorkBuddy → 说"帮我把这份表格按 XX 整理成一份报告" → 检查产出',
  },
  {
    id: 'claude-internal',
    name: 'Claude Code 内网版',
    tagline: 'Anthropic Claude Code 的腾讯内网封装版',
    bestFor: '你想要原生 Claude Code 的体验，又需要走公司合规通道',
    notFor: '第一次接触 AI 编程的小白 —— CodeBuddy 的中文引导更友好',
    install: [
      {
        label: '安装',
        cmd: 'npm install -g --registry=https://mirrors.tencent.com/npm @tencent/claude-code-internal',
      },
      { label: '启动（必须带 PTY，否则交互会卡住）', cmd: "claude-internal '做一个待办清单应用' " },
    ],
    barrier: '中',
    strengths: [
      '原生 Claude Code 能力，长任务推理稳',
      '内网部署，安全合规、自动脱敏',
      '社区生态（skills / MCP）可复用',
    ],
    weaknesses: [
      '交互式终端应用，需要 PTY 环境，自动化调度略麻烦',
      '启动时会有工作目录信任确认，批量脚本要处理交互',
      '中文体验不如 CodeBuddy 顺手',
    ],
    quickStart: '装好后在目标目录 claude-internal "你的需求"，首次会问是否信任该目录，选 Yes',
  },
]

export const compareMatrix: {
  dim: string
  codebuddy: string
  workbuddy: string
  claudeInternal: string
}[] = [
  {
    dim: '核心定位',
    codebuddy: '写代码、做工程',
    workbuddy: '办公任务、处理文件',
    claudeInternal: '写代码、做工程（原生 CC）',
  },
  {
    dim: '上手门槛',
    codebuddy: '低（会打字就行）',
    workbuddy: '极低（纯图形界面）',
    claudeInternal: '中（要懂点终端）',
  },
  {
    dim: '能不能产出可运行的软件',
    codebuddy: '✅ 强项',
    workbuddy: '❌ 不适合',
    claudeInternal: '✅ 强项',
  },
  {
    dim: '处理 Excel / 文档',
    codebuddy: '一般',
    workbuddy: '✅ 强项',
    claudeInternal: '一般',
  },
  {
    dim: '中文需求理解',
    codebuddy: '✅ 好',
    workbuddy: '✅ 好',
    claudeInternal: '一般',
  },
  {
    dim: '小白首选',
    codebuddy: '⭐ 做东西首选',
    workbuddy: '⭐ 办公首选',
    claudeInternal: '进阶再考虑',
  },
]

/** 一句话决策树 */
export const decisionTree: { q: string; a: string }[] = [
  { q: '我想做个能玩/能点的小东西', a: '→ CodeBuddy' },
  { q: '我要整理资料、做表格、写文档', a: '→ WorkBuddy' },
  { q: '我两个都要：先整理需求再做成应用', a: '→ WorkBuddy 理清楚 → CodeBuddy 做出来' },
  { q: '我是老手，想要原生 Claude Code', a: '→ Claude Code 内网版' },
]
