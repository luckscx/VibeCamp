import { tracks } from '../data/tracks'
import CodeBlock from '../components/CodeBlock'

const levelLabel: Record<string, string> = {
  L0: 'L0 零基础',
  L1: 'L1 入门',
  L2: 'L2 进阶',
  L3: 'L3 高阶',
}

export default function Paths() {
  return (
    <div className="space-y-12">
      <header>
        <h1 className="section-title">🗺️ 训练路径</h1>
        <p className="prose-cn mt-2 max-w-3xl">
          每条路径的每一步都有<span className="text-slate-200">明确的完成标志</span>——
          不是"做完贪吃蛇"，而是"蛇能吃食物、撞墙会结束、分数会涨"。
          达不到就说明这一步没走完，别急着往下走。
        </p>
      </header>

      {tracks.map((t) => (
        <section key={t.id} id={t.id} className="scroll-mt-32">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink-700 pb-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{t.emoji}</span>
              <div>
                <h2 className="text-xl font-bold text-white">{t.name}</h2>
                <p className="text-xs text-slate-500">
                  {levelLabel[t.level]} · {t.steps.length} 步 · {t.totalHours}
                </p>
              </div>
            </div>
          </div>
          <p className="prose-cn mt-3 max-w-3xl">{t.desc}</p>

          <div className="mt-6 space-y-4">
            {t.steps.map((s, i) => (
              <div key={s.id} className="rounded-xl border border-ink-700 bg-ink-900/50 p-5">
                <div className="flex items-start gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-vibe-600/15 text-sm font-bold text-vibe-400">
                    {i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="font-semibold text-white">{s.title}</h3>
                      <span className="chip">⏱ {s.hours}</span>
                    </div>
                    <p className="mt-1 text-sm text-slate-500">目标：{s.goal}</p>

                    {/* 具体动作 */}
                    <div className="mt-4">
                      <div className="text-xs font-semibold uppercase text-slate-500">照着做</div>
                      <ol className="mt-2 space-y-2">
                        {s.actions.map((a, j) => (
                          <li key={j} className="flex gap-2.5 text-sm leading-relaxed text-slate-300">
                            <span className="shrink-0 text-slate-600">{j + 1}.</span>
                            <span>{a}</span>
                          </li>
                        ))}
                      </ol>
                    </div>

                    {/* 完成标志 */}
                    <div className="mt-4 rounded-lg border border-emerald-900/40 bg-emerald-500/5 p-3">
                      <div className="text-xs font-semibold text-emerald-500">✅ 这一步算做完的标志</div>
                      <p className="mt-1.5 text-sm text-slate-300">{s.done}</p>
                    </div>

                    {/* 启动提示词 */}
                    {s.prompt && (
                      <div className="mt-4">
                        <div className="mb-1.5 text-xs text-slate-500">
                          直接复制这段给 CodeBuddy（中括号里的内容换成你的）：
                        </div>
                        <CodeBlock code={s.prompt} lang="prompt" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}

      <section className="rounded-2xl border border-ink-700 bg-ink-900/40 p-6">
        <h2 className="text-lg font-bold text-white">🧭 三条路怎么选</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {[
            { t: '完全没做过', d: '走「零基础起飞」，6 小时出第一个东西。别跳步。' },
            { t: '想做游戏', d: '先走完零基础前两步，再切「小游戏线」，不然会卡在环境上。' },
            { t: '想做实用工具', d: '先走完零基础前两步，再切「小应用线」。需求想清楚比写代码重要。' },
          ].map((x) => (
            <div key={x.t} className="rounded-lg border border-ink-700 p-4">
              <h3 className="text-sm font-semibold text-vibe-400">{x.t}</h3>
              <p className="prose-cn mt-2">{x.d}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
