import { useState } from 'react'
import { issues } from '../data/issues'
import type { Issue } from '../data/types'

const cats = ['全部', '环境', '对话', '代码', '部署'] as const
type Cat = (typeof cats)[number]

const catColor: Record<Issue['category'], string> = {
  环境: '!bg-violet-600/15 !text-violet-400',
  对话: '!bg-vibe-600/15 !text-vibe-400',
  代码: '!bg-camp-500/15 !text-camp-400',
  部署: '!bg-emerald-600/15 !text-emerald-400',
}

export default function Issues() {
  const [cat, setCat] = useState<Cat>('全部')
  const [kw, setKw] = useState('')

  const list = issues.filter((i) => {
    const matchCat = cat === '全部' || i.category === cat
    const matchKw =
      !kw.trim() ||
      (i.symptom + i.cause + i.fixes.join('') + i.prevent).toLowerCase().includes(kw.toLowerCase())
    return matchCat && matchKw
  })

  return (
    <div className="space-y-8">
      <header>
        <h1 className="section-title">🚑 排错手册</h1>
        <p className="prose-cn mt-2 max-w-3xl">
          卡住是正常的，<span className="text-slate-200">卡住然后放弃才是问题</span>。
          下面这 {issues.length} 个是真实新手最高频的翻车现场。先搜一下，大概率已经有人摔过了。
        </p>
      </header>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          value={kw}
          onChange={(e) => setKw(e.target.value)}
          placeholder="搜症状关键字，比如「白屏」「command not found」"
          className="flex-1 rounded-lg border border-ink-700 bg-ink-900 px-4 py-2.5 text-sm text-slate-200 placeholder:text-slate-600 focus:border-vibe-600 focus:outline-none"
        />
        <div className="flex flex-wrap gap-2">
          {cats.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                cat === c
                  ? 'bg-vibe-600 text-white'
                  : 'border border-ink-700 text-slate-400 hover:bg-ink-800 hover:text-slate-200'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {list.length === 0 && (
        <div className="rounded-xl border border-ink-700 bg-ink-900/50 p-8 text-center">
          <p className="text-slate-400">没找到匹配的。把你遇到的报错原文丢给 CodeBuddy，</p>
          <p className="prose-cn mt-1">配上这句：「这是报错，帮我定位原因并修复」。</p>
        </div>
      )}

      <div className="space-y-4">
        {list.map((i) => (
          <article key={i.id} className="rounded-xl border border-ink-700 bg-ink-900/50 p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <h2 className="flex-1 font-semibold text-white">
                <span className="mr-2 text-rose-500">⚠</span>
                {i.symptom}
              </h2>
              <span className={`chip shrink-0 ${catColor[i.category]}`}>{i.category}</span>
            </div>

            <div className="mt-4 rounded-lg border border-ink-700 bg-ink-950/50 p-3">
              <div className="text-xs font-semibold uppercase text-slate-500">根因</div>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-300">{i.cause}</p>
            </div>

            <div className="mt-4">
              <div className="text-xs font-semibold uppercase text-slate-500">怎么解决</div>
              <ol className="mt-2 space-y-2">
                {i.fixes.map((f, j) => (
                  <li key={j} className="flex gap-2.5 text-sm leading-relaxed text-slate-300">
                    <span className="shrink-0 text-vibe-600">{j + 1}.</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="mt-4 rounded-lg border border-emerald-900/40 bg-emerald-500/5 p-3">
              <div className="text-xs font-semibold text-emerald-500">🛡️ 以后怎么避免</div>
              <p className="mt-1.5 text-sm text-slate-300">{i.prevent}</p>
            </div>
          </article>
        ))}
      </div>

      <section className="rounded-2xl border border-vibe-600/20 bg-vibe-600/5 p-6">
        <h2 className="text-lg font-bold text-white">手册里没有的坑，怎么问</h2>
        <p className="prose-cn mt-2">
          直接把这段复制给 CodeBuddy，方括号里换成你的实际情况：
        </p>
        <pre className="mt-4 overflow-x-auto rounded-lg border border-ink-700 bg-ink-950 p-4 text-xs leading-relaxed text-slate-300">
          {`我遇到一个问题，帮我定位。

【现象】
（具体发生了什么，越具体越好）

【我做了什么】
1. ...
2. ...

【我想要的结果】
...

【报错原文】
（控制台的红色报错，整段复制，不要只截一句）

【环境】
系统：macOS / Windows
浏览器：Chrome
项目类型：单个 HTML 文件 / Vite 项目

请先告诉我最可能的 3 个原因，再给我修复方案。`}
        </pre>
      </section>
    </div>
  )
}
