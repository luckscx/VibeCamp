import { useState } from 'react'
import { glossary } from '../data/generated/content'

export default function Glossary() {
  const [kw, setKw] = useState('')

  const filtered = glossary.filter((g) => {
    if (!kw.trim()) return true
    const k = kw.toLowerCase()
    return (
      g.term.toLowerCase().includes(k) ||
      g.full.toLowerCase().includes(k) ||
      g.plain.toLowerCase().includes(k)
    )
  })

  // 搜索时按字母序铺平；否则按分类分组（分类顺序沿用源文件）
  const groups: { name: string; items: typeof glossary }[] = []
  for (const g of filtered) {
    const key = g.category || '其他'
    const found = groups.find((x) => x.name === key)
    if (found) found.items.push(g)
    else groups.push({ name: key, items: [g] })
  }
  const searching = kw.trim().length > 0
  if (searching) groups.forEach((x) => x.items.sort((a, b) => a.term.localeCompare(b.term, 'zh')))

  return (
    <div className="space-y-8">
      <header>
        <h1 className="section-title">📖 黑话翻译表</h1>
        <p className="prose-cn mt-2 max-w-3xl">
          看不懂的词不用背，<span className="text-slate-200">查得到就行</span>。
          这里把 AI 和编程里最常见的话翻译成人话，每条都配了生活里的比方。
        </p>
      </header>

      <input
        value={kw}
        onChange={(e) => setKw(e.target.value)}
        placeholder="搜词，比如「npm」「部署」「状态」"
        className="w-full rounded-lg border border-ink-700 bg-ink-900 px-4 py-2.5 text-sm text-slate-200 placeholder:text-slate-600 focus:border-vibe-600 focus:outline-none"
      />

      <div className="space-y-8">
        {(searching ? [{ name: `找到 ${filtered.length} 条`, items: groups.flatMap((g) => g.items) }] : groups).map(
          (grp) => (
            <section key={grp.name}>
              <h2 className="mb-4 flex items-center gap-2 text-sm font-bold tracking-wide text-vibe-400">
                <span className="h-4 w-1 rounded bg-vibe-500/60" />
                {grp.name}
                <span className="text-xs font-normal text-slate-600">{grp.items.length}</span>
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {grp.items.map((g) => (
                  <div key={`${grp.name}-${g.term}`} className="card">
                    <div className="flex flex-wrap items-baseline gap-2">
                      <h3 className="font-bold text-white">{g.term}</h3>
                      {g.full && <span className="text-xs text-slate-600">{g.full}</span>}
                    </div>
                    <p className="prose-cn mt-2 !text-slate-300">{g.plain}</p>
                  </div>
                ))}
              </div>
            </section>
          ),
        )}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-slate-500">没找到。试试搜短一点的关键字。</p>
      )}

      <section className="rounded-2xl border border-ink-700 bg-ink-900/40 p-6">
        <h2 className="text-lg font-bold text-white">遇到看不懂的词，直接问 AI</h2>
        <pre className="mt-4 overflow-x-auto rounded-lg border border-ink-700 bg-ink-950 p-4 text-xs leading-relaxed text-slate-300">
          {`「【这个词】是什么意思？用大白话解释，
再打个生活里的比方。
我是完全零基础的新手，别假设我懂任何术语。」`}
        </pre>
      </section>
    </div>
  )
}
