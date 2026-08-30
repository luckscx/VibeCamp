---
title: 下一步
order: 7
status: 大纲
---

# 第 7 章 · 下一步：从"能跑"到"能用"

## 这一章要解决的问题

第一个东西做出来了，然后呢？

## 大纲

### 7.1 三个扩展机制（你的杠杆）

用熟之后，这三个东西能让效率再上一个台阶。

| 机制 | 放哪 | 干什么 | 何时用 |
|---|---|---|---|
| **自定义斜杠命令** | `.codebuddy/commands/` 或 `~/.codebuddy/commands/` | 把常用提示词固化成 `/xxx` | 某个提示词用了 3 次以上 |
| **子代理 Sub-Agent** | `.codebuddy/agents/` 或 `~/.codebuddy/agents/` | 封装角色/流程，可复用 | 有固定套路的任务 |
| **Skills 技能** | `.codebuddy/skills/` 或 `~/.codebuddy/skills/` | AI 自动识别调用，可带脚本和权限白名单 | 想让 AI 自动用上某套规范 |

**Skills vs 斜杠命令的关键区别**（已核实）：

| 特性 | Skills | Slash Commands |
|---|---|---|
| 触发方式 | **AI 自动识别调用** | 用户手动输入 |
| 权限控制 | 支持工具白名单 | 无 |
| 工作目录 | 支持自定义 | 当前目录 |
| 可见性 | 对用户透明 | 用户主动发起 |

### 7.2 自定义斜杠命令速成

建一个 `.codebuddy/commands/review.md`：
```markdown
---
description: 审查当前改动
---
请审查这次改动，重点看：
1. 有没有明显的 bug
2. 有没有更简单的写法
3. 用中文回复
```
然后 `/review` 就能用。子目录会自动带前缀：`/frontend:build`

### 7.3 Skills 速成

建一个 `.codebuddy/skills/my-style/SKILL.md`：
```markdown
---
name: my-style
description: 我的项目规范和偏好
allowed-tools: Read, Write, Bash
---

本项目遵循以下规范：
- 用 TypeScript 严格模式
- 组件命名 PascalCase
- 注释用中文
```
**AI 会自动判断什么时候用，不用你手动调用。**

进阶：
- `context: fork` → 在独立子代理里跑，不污染主会话
- `user-invocable: false` → 从 `/` 菜单隐藏，只给 AI 内部用
- `hooks` → 在 Skill 里声明前置/后置检查（Beta，需在 settings.json 开 `allowUntrustedFrontmatterHooks`）

### 7.4 常用命令速查（已核实，20 个）

| 命令 | 用途 |
|---|---|
| `/init` | **初始化项目上下文，强烈推荐，省 30-50% token** |
| `/clear` | 清上下文，开新会话 |
| `/compact` | 压缩上下文 |
| `/doctor` | 环境自检 |
| `/cost` | 看花费 |
| `/status` | 看状态 |
| `/model` | 切换模型 |
| `/memory` | 管理长期记忆 |
| `/config` | 配置（含语言） |
| `/permissions` | 权限 |
| `/mcp` | 管理 MCP 连接 |
| `/agents` | 管理子代理 |
| `/add-dir` | 添加目录上下文 |
| `/bashes` | 后台任务 |
| `/terminal-setup` | Shift+Enter 换行 |
| `/help` | 帮助 |
| `/login` `/logout` `/upgrade` | 登录/登出/升级 |

### 7.5 无头模式（批量活）

```bash
codebuddy -p "给所有组件加上中文注释"
codebuddy -p "审查这次提交" --output-format json > out.json
git diff HEAD~1 | codebuddy -p "审查这次提交"
```

### 7.6 什么时候该真的学点编程

不需要为了做东西而学。但这两个信号出现时，学一点会省很多时间：
- 你想改的细节，总是描述不清
- 你开始好奇"它为什么这么写"

## 待补材料

- [ ] 各机制的实操截图
- [ ] 一个完整的自定义命令 / Skill 案例
