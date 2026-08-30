import { useState } from 'react'

interface Props {
  text: string
  label?: string
  className?: string
}

export default function CopyButton({ text, label = '复制', className = '' }: Props) {
  const [done, setDone] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      // 降级方案：非 HTTPS 环境下 clipboard API 可能不可用
      const ta = document.createElement('textarea')
      ta.value = text
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    }
    setDone(true)
    setTimeout(() => setDone(false), 1600)
  }

  return (
    <button
      onClick={copy}
      className={`btn-ghost ${done ? '!border-emerald-600 !text-emerald-400' : ''} ${className}`}
    >
      {done ? '✓ 已复制' : label}
    </button>
  )
}
