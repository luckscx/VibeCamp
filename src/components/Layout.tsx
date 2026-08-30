import { NavLink } from 'react-router-dom'

const nav = [
  { to: '/', label: '首页', icon: '🏕️' },
  { to: '/chapters', label: '主线教程', icon: '📚' },
  { to: '/cases', label: '真实案例', icon: '🔍' },
  { to: '/resources', label: '资源库', icon: '🧰' },
  { to: '/tools', label: '选工具', icon: '🧭' },
  { to: '/paths', label: '训练路径', icon: '🗺️' },
  { to: '/templates', label: '模板库', icon: '📦' },
  { to: '/prompts', label: '提示词', icon: '✨' },
  { to: '/issues', label: '排错', icon: '🚑' },
  { to: '/glossary', label: '黑话表', icon: '📖' },
]

function linkCls({ isActive }: { isActive: boolean }) {
  return `inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors whitespace-nowrap ${
    isActive ? 'bg-vibe-600/15 text-vibe-400' : 'text-slate-400 hover:bg-ink-800 hover:text-slate-200'
  }`
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-ink-950">
      <header className="sticky top-0 z-40 border-b border-ink-800 bg-ink-950/85 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex h-14 items-center justify-between">
            <NavLink to="/" className="flex items-center gap-2 font-bold text-white">
              <span className="text-xl">🏕️</span>
              <span className="text-base">
                Vibe<span className="text-vibe-400">Camp</span>
              </span>
              <span className="hidden text-xs font-normal text-slate-500 sm:inline">
                AI 构建训练营
              </span>
            </NavLink>
            <a
              href="https://github.com/luckscx/VibeCamp"
              target="_blank"
              rel="noreferrer"
              className="text-xs text-slate-500 hover:text-slate-300"
            >
              GitHub ↗
            </a>
          </div>
          <nav className="-mb-px flex gap-1 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {nav.map((n) => (
              <NavLink key={n.to} to={n.to} end={n.to === '/'} className={linkCls}>
                <span>{n.icon}</span>
                <span>{n.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>

      <footer className="border-t border-ink-800 py-8">
        <div className="mx-auto max-w-6xl px-4 text-xs leading-relaxed text-slate-600">
          <p>
            VibeCamp · 零门槛 AI 构建训练营。资料整理自腾讯 CodeBuddy / WorkBuddy 官方文档与社区实践，
            工具版本以 2026-08 为准。
          </p>
          <p className="mt-1">
            工具能力会持续迭代，遇到与本文不符之处以官方最新文档为准。
          </p>
        </div>
      </footer>
    </div>
  )
}
