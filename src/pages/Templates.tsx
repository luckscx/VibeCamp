import { useState } from 'react'
import { templates } from '../data/templates'
import CodeBlock from '../components/CodeBlock'

const cats = ['全部', '游戏', '应用', '工具'] as const
type Cat = (typeof cats)[number]

export default function Templates() {
  const [cat, setCat] = useState<Cat>('全部')
  const list = cat === '全部' ? templates : templates.filter((t) => t.category === cat)

  return (
    <div className="space-y-8">
      <header>
        <h1 className="section-title">📦 模板库</h1>
        <p className="prose-cn mt-2 max-w-3xl">
          每个模板都是一段<span className="text-slate-200">可以直接复制的开工提示词</span>。
          新建一个空文件夹，启动 CodeBuddy，原样粘进去，改掉中括号里的内容就行。
        </p>
      </header>

      <div className="flex flex-wrap gap-2">
        {cats.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              cat === c
                ? 'bg-vibe-600 text-white'
                : 'border border-ink-700 text-slate-400 hover:bg-ink-800 hover:text-slate-200'
            }`}
          >
            {c}
            <span className="ml-1.5 text-xs opacity-60">
              {c === '全部' ? templates.length : templates.filter((t) => t.category === c).length}
            </span>
          </button>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {list.map((t) => (
          <article key={t.id} className="card flex flex-col">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{t.emoji}</span>
                <div>
                  <h2 className="text-lg font-bold text-white">{t.name}</h2>
                  <div className="mt-1 flex flex-wrap gap-1.5">
                    <span className="chip">{t.category}</span>
                    <span
                      className={`chip ${
                        t.difficulty === '入门'
                          ? '!bg-emerald-600/15 !text-emerald-400'
                          : '!bg-camp-500/15 !text-camp-400'
                      }`}
                    >
                      {t.difficulty}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <p className="prose-cn mt-4">{t.desc}</p>

            <div className="mt-4 rounded-lg border border-ink-700 bg-ink-950/50 p-3">
              <div className="text-xs font-semibold uppercase text-slate-500">做出来是什么</div>
              <p className="mt-1.5 text-sm text-slate-300">{t.outcome}</p>
            </div>

            <div className="mt-3 flex flex-wrap gap-1.5">
              {t.tech.map((x) => (
                <span key={x} className="chip">
                  {x}
                </span>
              ))}
            </div>

            <details className="group mt-4">
              <summary className="cursor-pointer list-none text-sm font-medium text-vibe-400 hover:text-vibe-300">
                <span className="inline-block transition-transform group-open:rotate-90">▶</span> 展开开工提示词
              </summary>
              <div className="mt-3">
                <CodeBlock code={t.prompt} lang="prompt" title={`${t.name} · 开工提示词`} />
              </div>
            </details>

            <div className="mt-4 border-t border-ink-700 pt-3">
              <div className="text-xs font-semibold uppercase text-slate-500">做完之后还能加</div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {t.nextSteps.map((n) => (
                  <span key={n} className="chip !text-slate-400">
                    + {n}
                  </span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
