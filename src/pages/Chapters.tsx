import { Link, useParams, Navigate } from 'react-router-dom'
import { chapters, cases } from '../data/generated/content'
import Markdown from '../components/Markdown'

const statusStyle: Record<string, string> = {
  '完成': 'bg-emerald-500/10 text-emerald-400 border-emerald-800/40',
  '草稿': 'bg-amber-500/10 text-amber-400 border-amber-800/40',
  '大纲': 'bg-slate-500/10 text-slate-400 border-slate-700',
}

/** 抽出正文里的「示例 N：标题」，用于生成目录和锚点 */
interface Ex {
  num: string
  title: string
}

function collectExamples(body: string): Ex[] {
  const seen = new Set<string>()
  const out: Ex[] = []
  for (const m of body.matchAll(/^#{2,4}\s*示例\s*(\d+)：(.*)$/gm)) {
    if (seen.has(m[1])) continue
    seen.add(m[1])
    out.push({ num: m[1], title: m[2].trim() })
  }
  return out.sort((a, b) => Number(a.num) - Number(b.num))
}

/** 给示例标题注入锚点 id，让目录能跳过去 */
function anchorId(num: string) {
  return `ex-${num}`
}

export default function Chapters() {
  const { slug } = useParams()

  // /chapters —— 列表页
  if (!slug) {
    return (
      <div className="space-y-8">
        <header>
          <h1 className="section-title">📚 主线教程</h1>
          <p className="prose-cn mt-2 max-w-3xl">
            按顺序读。每章都有<span className="text-slate-200">可照做的操作示例</span>和
            <span className="text-slate-200">明确的验收点</span>——
            做完一步，确认对了，再往下走。
          </p>
        </header>

        <div className="grid gap-4 sm:grid-cols-2">
          {chapters.map((c) => {
            const n = new Set(Array.from(c.body.matchAll(/示例\s*(\d+)/g)).map((m) => m[1])).size
            return (
              <Link
                key={c.slug}
                to={`/chapters/${c.slug}`}
                className="card group flex flex-col !p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="font-mono text-2xl font-bold text-vibe-500/60">
                    {String(c.order).padStart(2, '0')}
                  </span>
                  <span
                    className={`rounded border px-2 py-0.5 text-xs ${
                      statusStyle[c.status] ?? statusStyle['草稿']
                    }`}
                  >
                    {c.status}
                  </span>
                </div>
                <h2 className="mt-2 text-lg font-bold text-white group-hover:text-vibe-300">
                  {c.title}
                </h2>
                <p className="mt-2 text-xs text-slate-500">
                  {c.body.length} 字 · {n} 个操作示例
                </p>
              </Link>
            )
          })}
        </div>

        {cases.length > 0 && (
          <section className="rounded-2xl border border-ink-700 bg-ink-900/40 p-6">
            <h2 className="text-lg font-bold text-white">🔍 配套真实案例</h2>
            <p className="prose-cn mt-2">
              这三个案例来自真实项目的 git 历史，标注了 commit 号，可以自己翻出来对照看。
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {cases.map((c) => (
                <Link key={c.slug} to={`/cases/${c.slug}`} className="btn-ghost">
                  {c.title} →
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    )
  }

  // /chapters/:slug —— 详情页
  const idx = chapters.findIndex((c) => c.slug === slug)
  if (idx < 0) return <Navigate to="/chapters" replace />

  const ch = chapters[idx]
  const prev = idx > 0 ? chapters[idx - 1] : null
  const next = idx < chapters.length - 1 ? chapters[idx + 1] : null
  const examples = collectExamples(ch.body)

  return (
    <article className="mx-auto max-w-3xl">
      <Link to="/chapters" className="text-sm text-slate-500 hover:text-vibe-400">
        ← 全部章节
      </Link>

      <header className="mt-4 border-b border-ink-700 pb-6">
        <div className="flex items-center gap-3">
          <span className="font-mono text-3xl font-bold text-vibe-500/60">
            {String(ch.order).padStart(2, '0')}
          </span>
          <span
            className={`rounded border px-2 py-0.5 text-xs ${
              statusStyle[ch.status] ?? statusStyle['草稿']
            }`}
          >
            {ch.status}
          </span>
        </div>
        <h1 className="mt-3 text-3xl font-bold text-white">{ch.title}</h1>
        {examples.length > 0 && (
          <nav className="mt-5 rounded-lg border border-ink-700 bg-ink-900/50 p-4">
            <div className="text-xs font-semibold uppercase text-slate-500">
              本章 {examples.length} 个操作示例
            </div>
            <ol className="mt-2.5 space-y-1.5">
              {examples.map((e) => (
                <li key={e.num} className="flex gap-2 text-sm">
                  <span className="shrink-0 font-mono text-xs text-vibe-500/70">
                    {String(e.num).padStart(2, '0')}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const el = document.getElementById(anchorId(e.num))
                      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
                    }}
                    className="text-left text-slate-300 underline decoration-slate-700 underline-offset-2 hover:text-vibe-300 hover:decoration-vibe-400"
                  >
                    {e.title}
                  </button>
                </li>
              ))}
            </ol>
          </nav>
        )}
      </header>

      <div className="mt-8">
        <Markdown source={ch.body} />
      </div>

      <nav className="mt-16 grid gap-3 border-t border-ink-800 pt-6 sm:grid-cols-2">
        {prev ? (
          <Link to={`/chapters/${prev.slug}`} className="card !p-4">
            <div className="text-xs text-slate-500">← 上一章</div>
            <div className="mt-1 font-medium text-slate-200">{prev.title}</div>
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link to={`/chapters/${next.slug}`} className="card !p-4 sm:text-right">
            <div className="text-xs text-slate-500">下一章 →</div>
            <div className="mt-1 font-medium text-slate-200">{next.title}</div>
          </Link>
        )}
      </nav>
    </article>
  )
}
