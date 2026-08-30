import { useState } from 'react'
import { tools, compareMatrix, decisionTree } from '../data/tools'
import CodeBlock from '../components/CodeBlock'

export default function Tools() {
  const [active, setActive] = useState(tools[0].id)
  const tool = tools.find((t) => t.id === active)!

  return (
    <div className="space-y-12">
      <header>
        <h1 className="section-title">🧭 先选对工具</h1>
        <p className="prose-cn mt-2 max-w-3xl">
          这三个工具名字像，但干的不是一回事。选错了不是浪费时间，是根本做不出来。
          <span className="text-slate-200">先看决策树，30 秒就能定。</span>
        </p>
      </header>

      {/* 决策树 */}
      <section className="rounded-2xl border border-vibe-600/25 bg-vibe-600/5 p-6">
        <h2 className="text-lg font-bold text-white">30 秒决策树</h2>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {decisionTree.map((d) => (
            <div
              key={d.q}
              className="flex items-center justify-between gap-3 rounded-lg border border-ink-700 bg-ink-900/60 px-4 py-3"
            >
              <span className="text-sm text-slate-300">{d.q}</span>
              <span className="shrink-0 text-sm font-bold text-vibe-400">{d.a}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 对比表 */}
      <section>
        <h2 className="text-lg font-bold text-white">横向对比</h2>
        <div className="mt-4 overflow-x-auto rounded-xl border border-ink-700">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-ink-800/80 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3 font-medium">维度</th>
                <th className="px-4 py-3 font-medium text-vibe-400">CodeBuddy</th>
                <th className="px-4 py-3 font-medium text-camp-400">WorkBuddy</th>
                <th className="px-4 py-3 font-medium">Claude Code 内网版</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-800">
              {compareMatrix.map((r) => (
                <tr key={r.dim} className="hover:bg-ink-900/60">
                  <td className="px-4 py-3 font-medium text-slate-300">{r.dim}</td>
                  <td className="px-4 py-3 text-slate-400">{r.codebuddy}</td>
                  <td className="px-4 py-3 text-slate-400">{r.workbuddy}</td>
                  <td className="px-4 py-3 text-slate-400">{r.claudeInternal}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 详情 tab */}
      <section>
        <div className="flex flex-wrap gap-2">
          {tools.map((t) => (
            <button
              key={t.id}
              onClick={() => setActive(t.id)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                active === t.id
                  ? 'bg-vibe-600 text-white'
                  : 'border border-ink-700 text-slate-400 hover:bg-ink-800 hover:text-slate-200'
              }`}
            >
              {t.name}
            </button>
          ))}
        </div>

        <div className="mt-6 space-y-6">
          <div className="rounded-xl border border-ink-700 bg-ink-900/50 p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h3 className="text-2xl font-bold text-white">{tool.name}</h3>
                <p className="mt-1 text-slate-400">{tool.tagline}</p>
              </div>
              <span className="chip">上手难度：{tool.barrier}</span>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-emerald-900/40 bg-emerald-500/5 p-4">
                <div className="text-xs font-semibold uppercase text-emerald-500">✅ 适合</div>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">{tool.bestFor}</p>
              </div>
              <div className="rounded-lg border border-rose-900/40 bg-rose-500/5 p-4">
                <div className="text-xs font-semibold uppercase text-rose-500">❌ 不适合</div>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">{tool.notFor}</p>
              </div>
            </div>

            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              <div>
                <h4 className="text-sm font-semibold text-slate-300">强项</h4>
                <ul className="mt-2 space-y-1.5">
                  {tool.strengths.map((s) => (
                    <li key={s} className="flex gap-2 text-sm text-slate-400">
                      <span className="text-emerald-600">•</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-300">短板（提前知道，别踩）</h4>
                <ul className="mt-2 space-y-1.5">
                  {tool.weaknesses.map((s) => (
                    <li key={s} className="flex gap-2 text-sm text-slate-400">
                      <span className="text-rose-600">•</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* 安装步骤 */}
          <div>
            <h4 className="mb-3 text-sm font-semibold text-slate-300">装起来（复制即可执行）</h4>
            <div className="space-y-3">
              {tool.install.map((s, i) => (
                <div key={s.label}>
                  <div className="mb-1.5 flex items-center gap-2 text-xs text-slate-500">
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-ink-700 text-[10px]">
                      {i + 1}
                    </span>
                    {s.label}
                  </div>
                  <CodeBlock code={s.cmd} />
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-ink-700 bg-ink-900/40 p-4">
            <div className="text-xs font-semibold uppercase text-slate-500">最快上手方式</div>
            <p className="mt-2 font-mono text-sm text-vibe-400">{tool.quickStart}</p>
          </div>
        </div>
      </section>

      {/* 组合打法 */}
      <section className="rounded-2xl border border-camp-500/25 bg-camp-500/5 p-6">
        <h2 className="text-lg font-bold text-white">💡 进阶：两个一起用</h2>
        <p className="prose-cn mt-2">
          真实场景里，它们不是二选一，而是接力。典型打法：
        </p>
        <ol className="mt-4 space-y-3">
          {[
            '需求还很模糊 → 用 WorkBuddy 把它整理成结构化需求文档（用户是谁、核心场景、必须做什么、明确不做什么）',
            '拿着这份需求 → 交给 CodeBuddy，让它先复述一遍确认理解，再动手写代码',
            '做出来之后 → 用 WorkBuddy 写使用说明、整理反馈、准备分享材料',
          ].map((s, i) => (
            <li key={s} className="flex gap-3 text-sm text-slate-300">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-camp-500/20 text-xs font-bold text-camp-400">
                {i + 1}
              </span>
              <span>{s}</span>
            </li>
          ))}
        </ol>
        <p className="mt-4 text-xs text-slate-500">
          一句话：<span className="text-slate-300">WorkBuddy 帮你把事想清楚，CodeBuddy 帮你把事做出来。</span>
        </p>
      </section>
    </div>
  )
}
