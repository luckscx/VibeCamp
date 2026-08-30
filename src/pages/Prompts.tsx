import { promptCards } from '../data/templates'
import CodeBlock from '../components/CodeBlock'
import type { Level } from '../data/types'

const levels: (Level | '全部')[] = ['全部', 'L0', 'L1', 'L2']
const levelColor: Record<Level, string> = {
  L0: '!bg-emerald-600/15 !text-emerald-400',
  L1: '!bg-vibe-600/15 !text-vibe-400',
  L2: '!bg-camp-500/15 !text-camp-400',
  L3: '!bg-rose-600/15 !text-rose-400',
}

export default function Prompts() {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="section-title">✨ 提示词库</h1>
        <p className="prose-cn mt-2 max-w-3xl">
          这些不是"魔法咒语"，是<span className="text-slate-200">沟通套路</span>。
          看懂每张卡片的「为什么这么写」，比抄走原文重要得多。
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {levels.map((l) => (
            <span
              key={l}
              className={`chip ${l === '全部' ? '' : levelColor[l as Level]} !px-3 !py-1`}
            >
              {l === 'L0' && 'L0 随时能用'}
              {l === 'L1' && 'L1 有点经验后'}
              {l === 'L2' && 'L2 项目复杂时'}
              {l === '全部' && '全部'}
            </span>
          ))}
        </div>
      </header>

      <div className="grid gap-5 lg:grid-cols-2">
        {promptCards.map((p) => (
          <article key={p.id} className="card flex flex-col">
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-lg font-bold text-white">{p.title}</h2>
              <span className={`chip shrink-0 ${levelColor[p.level]}`}>{p.level}</span>
            </div>
            <p className="mt-1 text-sm text-slate-500">适用场景：{p.scene}</p>

            <div className="mt-4 flex-1">
              <CodeBlock code={p.body} lang="prompt" title={p.title} />
            </div>

            <div className="mt-4 rounded-lg border border-camp-500/20 bg-camp-500/5 p-3">
              <div className="text-xs font-semibold text-camp-400">💡 为什么这么写</div>
              <p className="prose-cn mt-1.5 !text-slate-300">{p.why}</p>
            </div>
          </article>
        ))}
      </div>

      <section className="rounded-2xl border border-ink-700 bg-ink-900/40 p-6">
        <h2 className="text-lg font-bold text-white">写提示词的三条底层原则</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {[
            {
              t: '先对齐，再动手',
              d: '开工第一句永远是"先复述我的需求"。它理解错了还写完了，是最贵的一种浪费。',
            },
            {
              t: '一次只做一件事',
              d: '一次改十个文件它一定会漏。一次改一个，你能看清每一步对不对。',
            },
            {
              t: '给全信息，别让它猜',
              d: '报错就贴完整报错原文，想要什么就描述清楚。它不会读心，只会基于你给的信息猜。',
            },
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
