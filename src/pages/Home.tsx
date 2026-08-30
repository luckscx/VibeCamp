import { tracks } from '../data/tracks'
import { promptCards } from '../data/templates'
import { issues } from '../data/issues'
import { glossary } from '../data/issues'
import { tools } from '../data/tools'
import { Link } from 'react-router-dom'

const stats = [
  { n: tools.length, label: '个工具横向对比', to: '/tools', icon: '🧭' },
  { n: tracks.length, label: '条训练路径', to: '/paths', icon: '🗺️' },
  { n: tracks.reduce((s, t) => s + t.steps.length, 0), label: '个可验收步骤', to: '/paths', icon: '✅' },
  { n: promptCards.length, label: '条现成提示词', to: '/prompts', icon: '✨' },
  { n: issues.length, label: '个高频翻车现场', to: '/issues', icon: '🚑' },
  { n: glossary.length, label: '个黑话翻译', to: '/glossary', icon: '📖' },
]

const principles = [
  {
    icon: '🎯',
    t: '先让你爽到，再讲原理',
    d: '第一节课就做出能玩的东西。原理是做出来的那刻才想懂的，不是先背会的。',
  },
  {
    icon: '🧱',
    t: '每一步都有完成标志',
    d: '"做完贪吃蛇"不是完成标志，"蛇能吃食物、撞墙会结束、分数会涨"才是。做不出来就是没做完。',
  },
  {
    icon: '🧯',
    t: '翻车是课程的一部分',
    d: '排错手册里 10 个坑，是真实新手最高频的 10 次崩溃。提前看过，就不会在半夜两点卡住。',
  },
  {
    icon: '🪜',
    t: '不追求优雅，追求完成',
    d: '第一版能跑就行。你会在做第 5 个东西的时候，突然理解第 1 个东西哪里写得烂。',
  },
]

export default function Home() {
  return (
    <div className="space-y-14">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl border border-ink-700 bg-gradient-to-br from-ink-900 via-ink-900 to-vibe-600/10 px-6 py-12 sm:px-10 sm:py-16">
        <div className="relative max-w-2xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-camp-500/30 bg-camp-500/10 px-3 py-1 text-xs text-camp-400">
            <span>🔥</span> 零基础 · 不看你学历 · 只看你做出来的东西
          </div>
          <h1 className="text-3xl font-bold leading-tight text-white sm:text-5xl">
            你不需要学会写代码，
            <br />
            你需要<span className="text-vibe-400">把东西做出来</span>。
          </h1>
          <p className="mt-5 text-base leading-relaxed text-slate-400 sm:text-lg">
            VibeCamp 是一套给完全零基础的人准备的 AI 构建训练营。
            我们把「用 CodeBuddy / WorkBuddy 从零做出一个小游戏或小应用」拆成了一条能走完的路：
            选对工具 → 一步步做 → 卡住了查手册 → 做出来发给别人用。
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/paths" className="btn-primary !px-5 !py-2.5 !text-base">
              🗺️ 先看训练路径
            </Link>
            <Link to="/templates" className="btn-ghost !px-5 !py-2.5 !text-base">
              📦 或者，直接抄一个模板开工
            </Link>
          </div>
          <p className="mt-4 text-xs text-slate-600">
            预计 6 小时做出第一个能玩的东西。不需要任何编程基础，只需要一台电脑。
          </p>
        </div>
      </section>

      {/* 内容规模 */}
      <section>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {stats.map((s) => (
            <Link
              key={s.label}
              to={s.to}
              className="card group flex flex-col items-center py-5 text-center"
            >
              <span className="text-2xl">{s.icon}</span>
              <span className="mt-2 text-2xl font-bold text-white group-hover:text-vibe-400">
                {s.n}
              </span>
              <span className="mt-1 text-xs leading-tight text-slate-500">{s.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* 四条原则 */}
      <section>
        <h2 className="section-title">这地方跟别的教程有什么不一样</h2>
        <p className="prose-cn mt-2 max-w-2xl">
          大部分 AI 编程教程讲的是「AI 有多强」。这里只讲一件事：
          <span className="text-slate-200">你怎么在今天之内做出一个能跑的东西。</span>
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {principles.map((p) => (
            <div key={p.t} className="card">
              <div className="text-2xl">{p.icon}</div>
              <h3 className="mt-3 font-semibold text-white">{p.t}</h3>
              <p className="prose-cn mt-2">{p.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 三条路径 */}
      <section>
        <h2 className="section-title">选一条路走</h2>
        <p className="prose-cn mt-2">不知道选哪条？先走第一条，6 小时就能出东西。</p>
        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          {tracks.map((t) => (
            <Link key={t.id} to={`/paths#${t.id}`} className="card group flex flex-col">
              <div className="flex items-center justify-between">
                <span className="text-3xl">{t.emoji}</span>
                <span className="chip">{t.level}</span>
              </div>
              <h3 className="mt-3 text-lg font-bold text-white group-hover:text-vibe-400">{t.name}</h3>
              <p className="prose-cn mt-2 flex-1">{t.desc}</p>
              <div className="mt-4 flex items-center justify-between border-t border-ink-700 pt-3 text-xs text-slate-500">
                <span>{t.steps.length} 个步骤</span>
                <span className="text-vibe-500">{t.totalHours}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 你将会做出什么 */}
      <section className="rounded-2xl border border-ink-700 bg-ink-900/40 p-6 sm:p-8">
        <h2 className="section-title">走完这条路，你会得到什么</h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-3">
          {[
            {
              t: '一个能玩的游戏',
              d: '不是教程里的例子，是你自己想出来的点子。能发给朋友，朋友能打开就玩。',
            },
            {
              t: '一个真的在用的工具',
              d: '解决你自己生活里的小麻烦。你自己会天天打开它——这才是真的做对了。',
            },
            {
              t: '一套不会再卡住的方法',
              d: '遇到报错不再慌，知道怎么问、怎么查、怎么验证。这个能力对所有 AI 工具都通用。',
            },
          ].map((x, i) => (
            <div key={x.t}>
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-vibe-600/20 text-xs font-bold text-vibe-400">
                  {i + 1}
                </span>
                <h3 className="font-semibold text-white">{x.t}</h3>
              </div>
              <p className="prose-cn mt-2 pl-8">{x.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section>
        <h2 className="section-title">先回答几个你肯定会问的</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {[
            {
              q: '我完全没写过代码，真的能行吗？',
              a: '能。这条路线的设计前提就是「你只会打字」。第一节课的内容是装工具和跑通第一句话，第二节课你就有能玩的东西了。',
            },
            {
              q: '需要装很多东西吗？',
              a: '两个：Node.js 和 CodeBuddy。都是下一步下一步的安装包 / 一行命令。装不上的话，排错手册第一个就是讲这个。',
            },
            {
              q: 'AI 写的代码我看不懂怎么办？',
              a: '看不懂不用看。你要做的是「跑起来看看对不对」，不是「逐行读懂」。想懂的时候，提示词库里有一张「让它当老师」的卡片。',
            },
            {
              q: 'CodeBuddy 和 WorkBuddy 到底用哪个？',
              a: '做东西（游戏/应用/网页）用 CodeBuddy；处理办公任务（文档/表格/数据）用 WorkBuddy。选工具那一页有完整对比和决策树。',
            },
          ].map((f) => (
            <div key={f.q} className="card">
              <h3 className="font-semibold text-vibe-400">Q：{f.q}</h3>
              <p className="prose-cn mt-2">A：{f.a}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
