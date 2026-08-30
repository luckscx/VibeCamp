---
title: 速通计时：刷新一下就"作弊"了
repo: sell_games
commits: [f534e04, 9e83067, 123765f]
date: 2026-07-26 ~ 07-28
tags: [状态持久化, 边界情况, 多轮修复]
---

# 案例 · 速通计时：刷新一下就"作弊"了

> 本案例来自真实项目 **sell_games**（一个放置类经营游戏）的 git 历史。
> 涉及 3 个 commit，跨 3 天。

## 一句话

排行榜上出现了 70 秒通关的记录 —— 因为这个游戏**刷新一下页面就能重置计时起点**。

## 背景

游戏加了个"速通排行榜"：从新赛季开始到第一次"行业飞升"，用时越短排名越高。

**原始实现**（用挂钟时间）：

```ts
// 赛季开始时，记下当前时刻
seasonStart: {
  seasonStartedAt: Date.now(),
  firstAscendSeconds: 0,
}

// 飞升时，用「现在」减去「赛季开始时刻」
doAscend: () => {
  if (firstAscendSeconds === 0 && state.seasonStartedAt > 0) {
    firstAscendSeconds = Math.round((Date.now() - state.seasonStartedAt) / 1000);
  }
}
```

**看起来完全合理。** 跑了几天，排行榜上突然冒出一条 **70 秒**的记录。

## 出了什么问题

看 commit `f534e04` 里记下的 root cause（原文）：

> Root cause: seasonStartedAt/firstAscendSeconds were missing from `_savedState`,
> so every cold start reset the timer origin to 'now' — an ascend 1 minute
> after reopening the page recorded a 1-minute run.

翻成白话：

**`_savedState` 是一个白名单**，只有在里面的字段才会被存到本地存档。
`seasonStartedAt` 和 `firstAscendSeconds` **不在**这个白名单里。

于是：

```
第 1 天：开始新赛季 → seasonStartedAt = 今天
         …玩了 3 小时…
         关掉页面（seasonStartedAt 没被存下来，丢了）

第 2 天：打开页面 → 代码发现 seasonStartedAt 是空的
         → 重新赋值 seasonStartedAt = 现在
         …玩了 1 分钟，达成飞升…
         → 计时结果 = 现在 − 1分钟前 = 1 分钟 🎉（假的）
```

**玩家什么都没做错，是代码把"开始时间"记丢了。**

## 怎么修的

**第 1 次修（`f534e04`）**—— 换计时基准：不再用挂钟时间，改用游戏内活跃时间

```ts
// 改成：基线与成绩都必须进 _savedState
const _savedState = {
  // 速通计时基线与成绩：必须进 _savedState，否则每次冷启动丢失、计时起点被反复重置
  seasonStartPlayTime: _init.seasonStartPlayTime,
  firstAscendSeconds: _init.firstAscendSeconds,
}

// 飞升计时：用游戏内累计活跃时间，而不是 Date.now()
if (firstAscendSeconds === 0) {
  const base = state.seasonStartPlayTime >= 0 ? state.seasonStartPlayTime : 0;
  firstAscendSeconds = Math.max(1, Math.round(state.playTime - base));
}
```

> `playTime` 是游戏内累计的**活跃时长**，页面关掉就不涨，
> 后台挂着也不涨 —— 天然就是"只算你在玩的时间"。

**第 2 次修（`9e83067`）**—— 清理历史脏数据

老存档里已经有错误成绩了，光改代码不够，还得在**加载时**把脏数据作废：

```
- initGame: saves predating seasonStartPlayTime have their
  firstAscendSeconds voided on load
- cloud extras protocol bumped to extrasV=2; server ignores speedrun
  values from older clients
```

同时把云存档协议版本升到 `extrasV=2`，**服务端直接忽略老客户端传上来的成绩**。

**第 3 次修（`123765f`）**—— 服务端兜底校验

客户端能改，服务端不能信客户端。加了可审计的合格性校验。

## 这个案例教了什么

### 1. 「能跑」≠「对」

第一版实现**完全能跑**，正常玩也看不出问题。
只有在"跨天 + 刷新页面"这个特定组合下才暴露。

> **对新手的提醒**：你的小应用如果出现"偶尔数值不对"，
> 别急着说"算了重开一局"。先想想：**什么东西没被存下来？**

### 2. 改一个 bug 往往要三轮

| 轮次 | 解决什么 |
|---|---|
| 第 1 轮 | 修**根因**（换计时基准 + 字段进存档白名单） |
| 第 2 轮 | 修**历史数据**（老存档里的脏成绩要作废） |
| 第 3 轮 | 修**信任问题**（服务端不能信客户端） |

**只做第一轮是不够的** —— 排行榜上的假记录还在那儿。

### 3. AI 帮你写的代码，你要负责验收

这段代码是 AI 写的，语法正确、逻辑看起来也对。
但"哪些字段该进存档白名单"这个**系统级约束**，它没有主动考虑到。

**怎么防**：在需求里就写清验收条件。

```
做完请告诉我：
1. 刷新页面后，速通计时会继续还是重置？
2. 关掉页面一小时再打开，成绩会受影响吗？
3. 如果我手动改本地存档，服务端会发现吗？
```

> 这三条正好对应上面三轮修复。
> **提问的角度决定了代码的质量。**

### 4. 看 git 历史能学到最多

注意作者 commit message 里那句 `Root cause:` ——
**这是给未来的自己（和别人）留的线索**。

你自己的项目也该这么做。让 AI 写 commit message 时加一句：

```
commit message 里请写明：
- 这个改动修的是什么问题
- 根本原因是什么（Root cause）
- 如果以后的代码重蹈覆辙，应该怎么发现
```

## 相关章节

- [第 4 章 · 让它跑起来](../../04-让它跑起来/README.md) —— 验收清单怎么写
- [第 5 章 · 排错](../../05-排错/README.md) —— 报错了怎么贴给 AI
