import { Link, useParams, Navigate } from 'react-router-dom'
import { resources } from '../data/generated/content'
import Markdown from '../components/Markdown'

/**
 * content/resources/ 下的模板与提示词。
 * 数据源来自 scripts/build_content.py 生成的 content.ts，
 * 改内容请编辑 content/resources/ 下的 markdown。
 */

const CATS: Record<string, { label: string; icon: string; desc: string }> = {
  templates: {
    label: '项目模板',
    icon: '📦',
    desc: '一段可以直接复制的开工提示词。新建空文件夹，粘进去，改掉中括号里的内容。',
  },
  prompts: {
    label: '提示词',
    icon: '✨',
    desc: '按场景拆分的提示词，卡在哪一步就抄哪一条。',
  },
}

function catMeta(c: string) {
  return CATS[c] ?? { label: c, icon: '📄', desc: '' }
}

/** 正文里可能有 ../assets/ 相对图片，改写成 public/content-assets/ */
function fixAssets(body: string) {
  return body.replace(/\]\(\.\.\/assets\//g, '](./content-assets/')
}

/**
 * 取正文第一段「干净的」有效文字做摘要。
 * 跳过标题、代码块、表格、引用块 —— 尤其是引用块，
 * 模板开头的「⚠️ 状态：草稿」警告会被当成摘要，在列表页很吵。
 */
function summarize(body: string): string {
  const lines = body.split('\n')
  for (const raw of lines) {
    const line = raw.trim()
    if (!line) continue
    if (line.startsWith('#') || line.startsWith('```') || line.startsWith('---')) continue
    if (line.startsWith('|') || line.startsWith('>')) continue
    return line
      .replace(/\*\*(.+?)\*\*/g, '$1')
      .replace(/`([^`]+)`/g, '$1')
      .replace(/\*(.+?)\*/g, '$1')
      .slice(0, 90)
  }
  return ''
}

export default function Resources() {
  const { category, slug } = useParams()

  // /resources —— 列表页
  if (!category) {
    const cats = [...new Set(resources.map((r) => r.category))]

    return (
      <div className="space-y-10">
        <header>
          <h1 className="section-title">🧰 资源库</h1>
          <p className="prose-cn mt-2 max-w-3xl">
            按需查阅，不用按顺序读。
            <span className="text-slate-200">每一条都能直接复制使用</span>——
            不用理解原理，粘进去改改就能跑。
          </p>
        </header>

        {cats.map((c) => {
          const meta = catMeta(c)
          const items = resources.filter((r) => r.category === c)
          return (
            <section key={c}>
              <h2 className="mb-4 flex items-center gap-2 text-sm font-bold tracking-wide text-vibe-400">
                <span className="h-4 w-1 rounded bg-vibe-500/60" />
                {meta.icon} {meta.label}
                <span className="text-xs font-normal text-slate-600">{items.length}</span>
              </h2>
              <p className="prose-cn mb-4 !text-sm">{meta.desc}</p>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((r) => (
                  <Link
                    key={r.slug}
                    to={`/resources/${r.category}/${r.slug}`}
                    className="card group flex flex-col !p-5"
                  >
                    <h3 className="font-bold text-white group-hover:text-vibe-300">{r.title}</h3>
                    <p className="prose-cn mt-2 !text-sm">{summarize(r.body)}</p>
                  </Link>
                ))}
              </div>
            </section>
          )
        })}
      </div>
    )
  }

  // /resources/:category/:slug —— 详情页
  const r = resources.find((x) => x.category === category && x.slug === slug)
  if (!r) return <Navigate to="/resources" replace />

  const meta = catMeta(r.category)

  return (
    <article className="mx-auto max-w-3xl">
      <Link to="/resources" className="text-sm text-slate-500 hover:text-vibe-400">
        ← 全部资源
      </Link>

      <header className="mt-4 border-b border-ink-700 pb-6">
        <span className="chip">
          {meta.icon} {meta.label}
        </span>
        <h1 className="mt-3 text-3xl font-bold leading-snug text-white">{r.title}</h1>
      </header>

      <div className="mt-8">
        <Markdown source={fixAssets(r.body)} />
      </div>

      <nav className="mt-16 border-t border-ink-800 pt-6">
        <Link to="/resources" className="btn-ghost">
          ← 回到资源库
        </Link>
      </nav>
    </article>
  )
}
