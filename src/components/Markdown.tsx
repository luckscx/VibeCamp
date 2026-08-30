import { Fragment, type ReactNode } from 'react'
import CodeBlock from './CodeBlock'

/**
 * 极简 Markdown 渲染器。
 *
 * 只支持 content/ 里实际用到的语法：
 *   标题、段落、无序/有序列表、表格、代码块、引用、图片、行内代码/粗体/链接
 *
 * 为什么不用 marked / react-markdown：
 *   内容里的语法很有限，为此引一个依赖不划算，而且自己写能精确控制样式。
 *   哪天语法不够用了再换也不迟。
 */

interface MdProps {
  /** markdown 源文本 */
  source: string
}

/** 解析行内元素：`code` **bold** [text](url) */
function inline(text: string, keyPrefix: string): ReactNode[] {
  const out: ReactNode[] = []
  // 先匹配图片、链接，再匹配代码、粗体
  const RE = /(!?\[[^\]]*\]\([^)]+\))|(`[^`]+`)|(\*\*[^*]+\*\*)/g
  let last = 0
  let m: RegExpExecArray | null
  let i = 0

  while ((m = RE.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index))
    const tok = m[0]
    const key = `${keyPrefix}-i${i++}`

    if (tok.startsWith('![') || tok.startsWith('[')) {
      const isImg = tok.startsWith('![')
      const im = /^!?\[([^\]]*)\]\(([^)]+)\)$/.exec(tok)!
      const alt = im[1]
      const url = im[2]
      if (isImg) {
        out.push(
          <img
            key={key}
            src={url}
            alt={alt}
            loading="lazy"
            className="my-4 w-full rounded-lg border border-ink-700"
          />,
        )
      } else {
        const external = /^https?:/.test(url)
        out.push(
          <a
            key={key}
            href={url}
            {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
            className="text-vibe-400 underline decoration-vibe-400/30 underline-offset-2 hover:decoration-vibe-400"
          >
            {alt}
          </a>,
        )
      }
    } else if (tok.startsWith('`')) {
      out.push(
        <code key={key} className="rounded bg-ink-800 px-1.5 py-0.5 font-mono text-[0.85em] text-vibe-300">
          {tok.slice(1, -1)}
        </code>,
      )
    } else {
      out.push(
        <strong key={key} className="font-semibold text-slate-100">
          {tok.slice(2, -2)}
        </strong>,
      )
    }
    last = m.index + tok.length
  }
  if (last < text.length) out.push(text.slice(last))
  return out
}

function splitRow(line: string): string[] {
  return line
    .trim()
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .split('|')
    .map((c) => c.trim())
}

function isSeparator(line: string): boolean {
  return /^\|?[\s:|-]+\|[\s:|-]*$/.test(line.trim()) && line.includes('-')
}

export default function Markdown({ source }: MdProps) {
  const lines = source.replace(/\r\n/g, '\n').split('\n')
  const blocks: ReactNode[] = []

  let i = 0
  let key = 0

  while (i < lines.length) {
    const line = lines[i]

    // 空行
    if (!line.trim()) {
      i++
      continue
    }

    // 代码块（围栏）
    if (line.trim().startsWith('```')) {
      const lang = line.trim().slice(3).trim() || 'text'
      const buf: string[] = []
      i++
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        buf.push(lines[i])
        i++
      }
      i++ // 跳过收尾围栏
      blocks.push(<CodeBlock key={`cb${key++}`} code={buf.join('\n')} lang={lang} />)
      continue
    }

    // 标题
    const h = /^(#{1,6})\s+(.*)$/.exec(line)
    if (h) {
      const level = h[1].length
      const text = h[2]
      // 示例标题加锚点，供章节页目录跳转
      const exm = /^示例\s*(\d+)：/.exec(text)
      const id = exm ? `ex-${exm[1]}` : undefined
      const cls: Record<number, string> = {
        1: 'mt-8 text-2xl font-bold text-white',
        2: 'mt-8 border-b border-ink-700 pb-2 text-xl font-bold text-white',
        3: 'mt-6 text-lg font-semibold text-slate-100',
        4: 'mt-5 text-base font-semibold text-slate-200',
        5: 'mt-4 text-sm font-semibold text-slate-300',
        6: 'mt-4 text-sm font-semibold text-slate-400',
      }
      const Tag = `h${Math.min(level, 6)}` as 'h1'
      blocks.push(
        <Tag key={`h${key++}`} id={id} className={cls[Math.min(level, 6)]}>
          {inline(text, `h${key}`)}
        </Tag>,
      )
      i++
      continue
    }

    // 表格
    if (line.trim().startsWith('|') && i + 1 < lines.length && isSeparator(lines[i + 1])) {
      const header = splitRow(line)
      i += 2
      const rows: string[][] = []
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        rows.push(splitRow(lines[i]))
        i++
      }
      blocks.push(
        <div key={`t${key++}`} className="my-4 overflow-x-auto rounded-lg border border-ink-700">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-ink-900/70">
                {header.map((c, ci) => (
                  <th
                    key={ci}
                    className="border-b border-ink-700 px-3 py-2 text-left font-semibold text-slate-200"
                  >
                    {inline(c, `th${key}-${ci}`)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, ri) => (
                <tr key={ri} className="even:bg-ink-900/30">
                  {r.map((c, ci) => (
                    <td
                      key={ci}
                      className="border-b border-ink-800 px-3 py-2 align-top leading-relaxed text-slate-400"
                    >
                      {inline(c, `td${key}-${ri}-${ci}`)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>,
      )
      continue
    }

    // 引用块（连续 > 行合成一个；块内的 ``` 代码块单独渲染）
    if (line.trim().startsWith('>')) {
      const raw: string[] = []
      while (i < lines.length && lines[i].trim().startsWith('>')) {
        raw.push(lines[i].trim().replace(/^>\s?/, ''))
        i++
      }
      // 把引用内容切成「文本段」和「代码块段」
      const parts: ReactNode[] = []
      let buf: string[] = []

      const flushText = () => {
        if (!buf.length) return
        const k = `q${key}-${parts.length}`
        parts.push(
          <div key={k} className="space-y-2">
            {buf.map((b, bi) => (
              <p key={bi}>{inline(b, `${k}-${bi}`)}</p>
            ))}
          </div>,
        )
        buf = []
      }

      let n = 0
      while (n < raw.length) {
        if (raw[n].trim().startsWith('```')) {
          flushText()
          const code: string[] = []
          n++
          while (n < raw.length && !raw[n].trim().startsWith('```')) {
            code.push(raw[n])
            n++
          }
          n++ // 跳过收尾围栏
          parts.push(<CodeBlock key={`qc${key}-${parts.length}`} code={code.join('\n')} lang="prompt" />)
        } else {
          buf.push(raw[n])
          n++
        }
      }
      flushText()
      blocks.push(
        <blockquote
          key={`q${key++}`}
          className="my-4 rounded-r-lg border-l-2 border-vibe-500/50 bg-ink-900/40 px-4 py-3 text-sm leading-relaxed text-slate-400"
        >
          {parts}
        </blockquote>,
      )
      continue
    }

    // 无序列表
    if (/^\s*[-*+]\s+/.test(line)) {
      const items: string[] = []
      while (i < lines.length && /^\s*[-*+]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*[-*+]\s+/, ''))
        i++
      }
      blocks.push(
        <ul key={`u${key++}`} className="my-3 list-disc space-y-1.5 pl-6 text-sm leading-relaxed text-slate-400">
          {items.map((it, ii) => (
            <li key={ii}>{inline(it, `u${key}-${ii}`)}</li>
          ))}
        </ul>,
      )
      continue
    }

    // 有序列表
    if (/^\s*\d+[.)]\s+/.test(line)) {
      const items: string[] = []
      while (i < lines.length && /^\s*\d+[.)]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*\d+[.)]\s+/, ''))
        i++
      }
      blocks.push(
        <ol key={`o${key++}`} className="my-3 list-decimal space-y-1.5 pl-6 text-sm leading-relaxed text-slate-400">
          {items.map((it, ii) => (
            <li key={ii}>{inline(it, `o${key}-${ii}`)}</li>
          ))}
        </ol>,
      )
      continue
    }

    // 分割线
    if (/^\s*([-*_])\s*\1\s*\1[\s\-*_]*$/.test(line) || /^\s*---+\s*$/.test(line)) {
      blocks.push(<hr key={`hr${key++}`} className="my-6 border-ink-800" />)
      i++
      continue
    }

    // 普通段落（吸收后续非空、非块级起始行）
    const buf: string[] = [line]
    i++
    while (
      i < lines.length &&
      lines[i].trim() &&
      !lines[i].trim().startsWith('```') &&
      !lines[i].trim().startsWith('>') &&
      !lines[i].trim().startsWith('|') &&
      !/^#{1,6}\s/.test(lines[i]) &&
      !/^\s*[-*+]\s+/.test(lines[i]) &&
      !/^\s*\d+[.)]\s+/.test(lines[i])
    ) {
      buf.push(lines[i])
      i++
    }
    blocks.push(
      <p key={`p${key++}`} className="my-3 text-sm leading-relaxed text-slate-400">
        {inline(buf.join(' '), `p${key}`)}
      </p>,
    )
  }

  return <Fragment>{blocks}</Fragment>
}
