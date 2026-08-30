---
title: 装环境
order: 2
status: 大纲
---

# 第 2 章 · 装环境：从零到"AI 能干活"

> 这是**最劝退的一章**。写的时候每一步都要有"你应该看到什么"。

## 这一章要解决的问题

装不上、命令找不到、登录失败、不知道装没装成功。

## 已核实的硬事实

| 项 | 值 |
|---|---|
| npm 包名 | `@tencent-ai/codebuddy-code`（最新 2.141.0） |
| 安装命令 | `npm install -g @tencent-ai/codebuddy-code` |
| 原生安装器（Beta，无需 Node） | `curl -fsSL https://copilot.tencent.com/cli/install.sh \| bash` |
| Windows 原生安装器 | `irm https://copilot.tencent.com/cli/install.ps1 \| iex` |
| Node 要求 | **≥ 18.20** |
| 验证 | `codebuddy --version` |
| 更新 | `codebuddy update` |
| Windows 额外依赖 | **必须装 Git Bash** |

### 登录方式（4 选 1）
1. **Chinese Site** —— 国内用户，走 copilot.tencent.com
2. **International Site** —— 海外用户，走 codebuddy.ai
3. **Enterprise Domain** —— 企业专享版 / 私有化部署
4. **iOA** —— 腾讯内部员工

## 大纲

### 2.1 检查前置条件
```bash
node --version   # 必须 ≥ 18.20
npm --version
```
- **验收点**：能看到版本号，且 Node 版本 ≥ 18.20
- ❌ 版本太低 → 去 nodejs.org 装 LTS
- ❌ `command not found` → Node 没装

### 2.2 安装（两条路）
- 路线 A：有 Node → `npm install -g @tencent-ai/codebuddy-code`
- 路线 B：不想装 Node → 原生安装器（Beta）

### 2.3 验证安装
```bash
codebuddy --version
```
- **验收点**：输出版本号
- ❌ `codebuddy 不是内部或外部命令`（Windows 高发）
  → npm 全局目录没进 PATH，查 `npm config get prefix`，
   把 `%USERPROFILE%\AppData\Roaming\npm` 加进 PATH，重启终端

### 2.4 登录
- 启动后 4 选 1，↑↓ 选择，Enter 确认，浏览器完成认证
- **验收点**：终端回到 `>` 提示符，没有报错

### 2.5 第一个动作：/init
```
> /init
```
**为什么必须先做这个**（官方文档明确说"强烈建议"）：
- 预先构建项目知识图谱 → 理解更准确
- 避免重复扫描 → 响应更快
- **省 30-50% 上下文 token**

- **验收点**：AI 输出了项目结构分析
- 项目结构大变时：`/clear` → `/init` 重来

### 2.6 设成中文（可选）
`/config` → Language

### 2.7 环境自检
```
> /doctor
```
出问题先跑这个。

## 排错速查

| 症状 | 原因 | 解法 |
|---|---|---|
| `codebuddy 不是内部或外部命令` | npm 全局目录没进 PATH | 见 2.3 |
| 提示需要 git-bash | Windows 缺 Git Bash | 装 Git 时勾选 Git Bash；自定义路径设 `CODEBUDDY_CODE_GIT_BASH_PATH` |
| Node 版本报错 | < 18.20 | 升级 Node |
| ripgrep 未找到 | 缺 rg | 通常自动降级/下载，或手动装 ripgrep |

## 待补材料

- [ ] 真实安装过程截图（三步：执行 → 登录 → /init 后）
- [ ] 国内 npm 镜像是否更快的实测
