---
title: 选工具
order: 1
status: 草稿
---

# 第 1 章 · 选工具：我该用哪一个

## 这一章要解决的问题

CodeBuddy / WorkBuddy / IDE 插件，名字都像，不知道该装哪个。

## 已核实的产品定位

| 产品 | 定位 | 适合谁 |
|---|---|---|
| **WorkBuddy** | 中国版 Cowork，**类无代码体验**，面向知识工作者 | 不想碰命令行，想用自然语言完成办公/数据/文档任务 |
| **CodeBuddy Code（CLI）** | 对标 Claude Code 的 Coding Agent，端到端完成软件工程任务 | 真的要做一个能跑的游戏/应用，愿意敲几行命令 |
| **CodeBuddy IDE 插件** | 在编辑器里用 | 有一点基础，想边看代码边改 |

> 关键结论（来自官方定位）：**做小游戏 / 小应用 → 用 CodeBuddy Code**
> WorkBuddy 更偏办公自动化，不是做应用的主路径。

## 大纲

### 1.1 三句话决策树
```
你想做的东西 —— 是「处理文档/数据/报告」吗？
  ├─ 是 → WorkBuddy（桌面客户端，下载即用）
  └─ 否（要做一个能打开的东西）
       └─ 你能接受打开一个黑窗口敲几行命令吗？
            ├─ 能 → CodeBuddy Code ✅ 本训练营主路径
            └─ 不能 → 先试 WorkBuddy 建立感觉，再回来
```

### 1.2 CodeBuddy Code 是什么
- 对标 Anthropic Claude Code / OpenAI Codex 的自主编程 Agent
- 不只是代码补全：能自己理解需求、分析代码库、写代码、验证结果
- 官方宣称：零编程经验者数天可构建完整应用

### 1.3 WorkBuddy 速览（知道它存在，但本营不深讲）
- 官网下载：https://www.codebuddy.cn/work/
- 微信扫码登录，零代码零部署
- 内置多模型（混元 / DeepSeek / GLM / Kimi / MiniMax），不用自备 API Key
- 积分制：新用户 5000 积分，每日签到 100
- 特色：微信 ClawBot 远程操控、定时任务、金融数据查询
- 自定义身份：`~/.workbuddy/IDENTITY.md`、`~/.workbuddy/USER.md`
- 两种模式：**Craft**（可写文件）/ **Ask**（只读，更安全）

### 1.4 本训练营默认路径
→ **CodeBuddy Code CLI**

## 验收点

- [ ] 知道自己该装哪个，且能说出理由
- [ ] 装了 WorkBuddy 的人知道 Craft / Ask 模式的区别

## 待补材料

- [ ] WorkBuddy 官方安装页的准确按钮文案与截图
- [ ] CodeBuddy IDE 插件的入口（VS Code / JetBrains 市场链接）
