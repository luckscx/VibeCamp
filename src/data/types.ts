export type Level = 'L0' | 'L1' | 'L2' | 'L3'

export interface Tool {
  id: string
  name: string
  tagline: string
  /** 一句话定位：什么时候该选它 */
  bestFor: string
  /** 不适合什么 */
  notFor: string
  install: { label: string; cmd: string }[]
  /** 上手难度 */
  barrier: '极低' | '低' | '中'
  strengths: string[]
  weaknesses: string[]
  /** 典型启动方式 */
  quickStart: string
  url?: string
}

export interface PathStep {
  id: string
  title: string
  goal: string
  hours: string
  /** 要教会用户的具体动作 */
  actions: string[]
  /** 完成标志 —— 可验证 */
  done: string
  /** 可直接抄的启动提示词 */
  prompt?: string
}

export interface Track {
  id: string
  name: string
  emoji: string
  desc: string
  level: Level
  totalHours: string
  steps: PathStep[]
}

export interface Template {
  id: string
  name: string
  emoji: string
  category: '游戏' | '应用' | '工具'
  difficulty: '入门' | '进阶'
  desc: string
  /** 预期产出 */
  outcome: string
  tech: string[]
  /** 一键开工提示词 */
  prompt: string
  /** 后续迭代方向 */
  nextSteps: string[]
}

export interface PromptCard {
  id: string
  title: string
  scene: string
  level: Level
  /** 提示词正文 */
  body: string
  why: string
}

export interface Issue {
  id: string
  symptom: string
  category: '环境' | '对话' | '代码' | '部署'
  /** 根因 */
  cause: string
  /** 一步步解决 */
  fixes: string[]
  /** 以后怎么避免 */
  prevent: string
}

