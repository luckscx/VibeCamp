import { useState } from 'react'
import CopyButton from './CopyButton'

interface Props {
  title?: string
  code: string
  lang?: string
}

export default function CodeBlock({ title, code, lang = 'bash' }: Props) {
  const [open, setOpen] = useState(true)

  return (
    <div className="overflow-hidden rounded-lg border border-ink-700 bg-ink-950">
      <div className="flex items-center justify-between border-b border-ink-700 bg-ink-900/60 px-3 py-2">
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-2 text-xs text-slate-500 hover:text-slate-300"
        >
          <span className="font-mono uppercase">{lang}</span>
          {title && <span className="text-slate-400">{title}</span>}
          <span className="text-slate-600">{open ? '收起 ▲' : '展开 ▼'}</span>
        </button>
        <CopyButton text={code} className="!px-2 !py-1 !text-xs" />
      </div>
      {open && (
        <pre className="overflow-x-auto p-3 text-xs leading-relaxed text-slate-300">
          <code>{code}</code>
        </pre>
      )}
    </div>
  )
}
