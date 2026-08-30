import { Link, useParams, Navigate } from 'react-router-dom'
import { cases } from '../data/generated/content'
import Markdown from '../components/Markdown'

/**
 * 案例正文里的图片是 content/ 下的相对路径（如 ../assets/x.webp），
 * 构建时通过 public/content-assets/ 提供，这里做前缀改写。
 */
function fixAssets(body: string) {
  return body.replace(/\]\(\.\.\/assets\//g, '](./content-assets/')
}

export default function Cases() {
  const { slug } = useParams()

  // /cases —— 列表页
  if (!slug) {
    return (
      <div className="space-y-8">
        <header>
          <h1 className="section-title">🔍 真实案例</h1>
          <p className="prose-cn mt-2 max-w-3xl">
            这些案例<span className="text-slate-200">不是编的</span>，
            全部来自真实项目的 git 历史，标注了仓库和 commit 号——你可以自己翻出来对照。
          </p>
        </header>

        <div className="space-y-4">
          {cases.map((c) => (
            <Link key={c.slug} to={`/cases/${c.slug}`} className="card group block !p-6">
              <div className="flex flex-wrap items-center gap-2">
                <span className="chip font-mono">{c.repo}</span>
                {c.commits.map((h) => (
                  <span key={h} className="chip font-mono !text-vibe-400/70">
                    {h.slice(0, 7)}
                  </span>
                ))}
                {c.date && <span className="text-xs text-slate-600">{c.date}</span>}
              </div>
              <h2 className="mt-3 text-xl font-bold text-white group-hover:text-vibe-300">
                {c.title}
              </h2>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {c.tags.map((t) => (
                  <span key={t} className="chip">
                    {t}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>

        <section className="rounded-2xl border border-ink-700 bg-ink-900/40 p-6">
          <h2 className="text-lg font-bold text-white">🛠 怎么自己找案例</h2>
          <p className="prose-cn mt-2">
            你自己的项目也是素材。翻翻 git log，找那种
            <span className="text-slate-200">「连续几个 commit 都在改同一个地方」</span>
            的位置——那往往藏着最好的案例。
          </p>
        </section>
      </div>
    )
  }

  // /cases/:slug —— 详情页
  const c = cases.find((x) => x.slug === slug)
  if (!c) return <Navigate to="/cases" replace />

  return (
    <article className="mx-auto max-w-3xl">
      <Link to="/cases" className="text-sm text-slate-500 hover:text-vibe-400">
        ← 全部案例
      </Link>

      <header className="mt-4 border-b border-ink-700 pb-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="chip font-mono">{c.repo}</span>
          {c.commits.map((h) => (
            <span key={h} className="chip font-mono !text-vibe-400/70" title={h}>
              {h.slice(0, 7)}
            </span>
          ))}
        </div>
        <h1 className="mt-3 text-3xl font-bold leading-snug text-white">{c.title}</h1>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {c.date && <span className="text-xs text-slate-600">{c.date}</span>}
          {c.tags.map((t) => (
            <span key={t} className="chip">
              {t}
            </span>
          ))}
        </div>
      </header>

      <div className="mt-8">
        <Markdown source={fixAssets(c.body)} />
      </div>

      <nav className="mt-16 border-t border-ink-800 pt-6">
        <Link to="/cases" className="btn-ghost">
          ← 回到案例列表
        </Link>
      </nav>
    </article>
  )
}
