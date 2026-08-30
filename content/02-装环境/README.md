---
title: 装环境
order: 2
status: 草稿
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

**在终端里输入：**

```bash
node --version
```

**你应该看到（真实输出样本）：**
```
v22.15.0
```

**判断：**
- ✅ 版本号 `v18.20.0` 或更高 → 过关，去 2.2
- ❌ `v16.x` / `v18.19.x` 以下 → 版本太低，去 nodejs.org 装 LTS
- ❌ `command not found: node` / `不是内部或外部命令` → Node 没装，去 nodejs.org

> **怎么读版本号**：`v22.15.0` 意思是「22 版.15 小版.0 补丁」。
> 只要第一个数字 ≥ 18，且不是刚好卡在 18.0~18.19 就行。

**同时确认 npm 也在：**

```bash
npm --version
```

**你应该看到：**
```
10.9.2
```

> npm 是随 Node 一起装的。能看到版本号就说明都装好了。

### 2.2 安装（两条路）

#### 路线 A：已经装了 Node（推荐）

```bash
npm install -g @tencent-ai/codebuddy-code
```

**你应该看到（真实输出样本）：**
```
added 1 package in 12s
```
> 结尾会显示装了几个包、花了多久。不同机器数字不一样，只要有 `added` 就是成了。

**可能出现的红字（不用慌）：**

| 你看到的 | 意思 | 怎么办 |
|---|---|---|
| `npm WARN deprecated xxx` | 某个依赖包过时了 | **忽略**，不影响使用 |
| 一直在转圈没动静 | 网络慢 | 等 1-2 分钟；超过 3 分钟看下面 |
| `EACCES: permission denied` | 没权限写全局目录 | macOS/Linux：前面加 `sudo`；Windows：用管理员身份开终端 |

**网络慢的提速办法**（国内）：
```bash
npm install -g @tencent-ai/codebuddy-code --registry=https://registry.npmmirror.com
```

#### 路线 B：不想装 Node（Beta，一步到位）

**macOS / Linux：**
```bash
curl -fsSL https://copilot.tencent.com/cli/install.sh | bash
```

**Windows（PowerShell）：**
```powershell
irm https://copilot.tencent.com/cli/install.ps1 | iex
```

> ⚠️ 这条路线是 Beta 版，装完**同样要**走 2.3 验证。

### 2.3 验证安装

#### 示例 1：装完立刻验证，别等用到才发现没装好

**输入：**
```bash
codebuddy --version
```

**你应该看到：**
```
2.141.0
```

**如果看到 `codebuddy: command not found`（Windows 高发：不是内部或外部命令）**

这是 npm 全局目录没进 PATH。一步步查：

```bash
npm config get prefix
```

**你应该看到（示例）：**
```
/usr/local/lib/.nvm/versions/node/v22.15.0
```
> Windows 通常是：`C:\Users\你的用户名\AppData\Roaming\npm`

**然后**：把这个路径（Windows 的话后面加 `\`）加进系统环境变量 `PATH`，
**关掉终端重新开一个**，再跑一次 `codebuddy --version`。

#### 示例 2：命令找不到？查 npm 装到哪去了

Windows 上最常见。`codebuddy` 装好了但终端说找不到，八成是 npm 的全局目录
没进 PATH。先问 npm 它装哪儿了：

```bash
npm config get prefix
```

**你应该看到：**
```
C:\Users\grissom\AppData\Roaming\npm
```

把这个路径加进 `PATH`，**新开一个终端**再试。

> **验收点**：新终端里 `codebuddy --version` 能打印版本号，不是 `command not found`。
>
> 忘了重开终端是最常见的翻车点——环境变量的改动对已经打开的终端不生效。

> **忘了设 PATH 就重开的**，是最常见的翻车点。改完环境变量一定要**新开终端**。

### 2.4 登录

**输入：**
```bash
codebuddy
```

**你应该看到：**
```
? 请选择登录方式：
❯ Chinese Site (copilot.tencent.com)
  International Site (codebuddy.ai)
  Enterprise Domain
  iOA
```

**操作**：`↑` `↓` 选，**国内用户选第一个 `Chinese Site`**，回车。
浏览器会自动打开，扫码或点确认登录。

**验收点**：终端回到 `>` 提示符，且没有红色报错。
```
> _
```

**如果卡在"等待授权"不动：**
- 看浏览器是不是被拦截了弹窗
- 手动复制终端里显示的那个网址去浏览器打开
- 还是不行 → 换 `International Site` 试试

### 2.5 第一个动作：/init

#### 示例 3：先 cd 进目录，再 /init

```
> /init
```

**你必须先 `cd` 进项目目录再跑这个。** 例如：

```bash
cd ~/my-game     # 换成你自己的项目目录
codebuddy
> /init
```

**你应该看到：**

> 正在分析项目结构…
>
> 已生成 CODEBUDDY.md，包含：
> - 项目类型：Vite + React + TypeScript
> - 主要目录：src/components, src/pages
> - 构建命令：npm run build
> - 测试命令：npm test

**为什么必须先做这个**（官方文档明确说"强烈建议"）：
- 预先构建项目知识图谱 → 理解更准确
- 避免重复扫描 → 响应更快
- **省 30-50% 上下文 token**

**验收点**：项目目录里出现了 `CODEBUDDY.md`，且 AI 输出了项目结构分析。

> 项目结构大变时（比如换框架、加了一大堆文件）：`/clear` → `/init` 重来一次。

### 2.6 设成中文（可选）

```
> /config
```
进去找 `Language`，改成中文。

### 2.7 环境自检

```
> /doctor
```

**你应该看到：**
```
✓ Node.js        v22.15.0
✓ Git            git version 2.39.2
✓ 登录状态       已登录
```

> 有 `✗` 的项目会直接告诉你缺什么，照着补就行。
> **出问题先跑这个**，能省掉一半瞎猜。

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
