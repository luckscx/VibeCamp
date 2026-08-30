import { useState } from 'react'
import { glossary } from '../data/issues'

export default function Glossary() {
  const [kw, setKw] = useState('')

  const list = glossary
    .filter((g) => {
      if (!kw.trim()) return true
      const k = kw.toLowerCase()
      return (
        g.term.toLowerCase().includes(k) ||
        (g.full?.toLowerCase().includes(k) ?? false) ||
        g.plain.toLowerCase().includes(k)
      )
    })
    .sort((a, b) => a.term.localeCompare(b.term, 'zh'))

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

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((g) => (
          <div key={g.term} className="card">
            <div className="flex flex-wrap items-baseline gap-2">
              <h2 className="font-bold text-white">{g.term}</h2>
              {g.full && <span className="text-xs text-slate-600">{g.full}</span>}
            </div>
            <p className="prose-cn mt-2 !text-slate-300">{g.plain}</p>
            {g.analogy && (
              <p className="mt-3 border-l-2 border-vibe-600/40 pl-3 text-xs leading-relaxed text-slate-500">
                {g.analogy}
              </p>
            )}
          </div>
        ))}
      </div>

      {list.length === 0 && (
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
