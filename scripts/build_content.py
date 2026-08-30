#!/usr/bin/env python3
"""
把 content/ 下的 markdown 转成前端可直接 import 的 TS 数据。

    python3 scripts/build_content.py

产物：src/data/generated/content.ts

为什么不在运行时读 markdown：
    项目是纯静态站点（vite build 出 dist/），没有后端。
    构建期生成 TS，既能享受类型检查，也不用引入运行时 markdown 解析器。

运行时机：dev / build 前自动跑（package.json 里串好了）。
"""
from __future__ import annotations

import json
import re
import sys
from datetime import datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CONTENT = ROOT / "content"
OUT = ROOT / "src" / "data" / "generated" / "content.ts"

CHAPTER_RE = re.compile(r"^(\d+)-(.+)$")
FRONTMATTER_RE = re.compile(r"^---\s*\n(.*?)\n---\s*\n", re.DOTALL)


def parse_frontmatter(raw: str) -> tuple[dict, str]:
    m = FRONTMATTER_RE.match(raw)
    if not m:
        return {}, raw
    meta: dict = {}
    for line in m.group(1).split("\n"):
        line = line.strip()
        if not line or line.startswith("#"):
            continue
        if ":" not in line:
            continue
        k, v = line.split(":", 1)
        v = v.strip().strip('"').strip("'")
        # 支持 [a, b] 数组
        if v.startswith("[") and v.endswith("]"):
            v = [x.strip().strip('"').strip("'") for x in v[1:-1].split(",") if x.strip()]
        meta[k.strip()] = v
    return meta, raw[m.end():]


def first_heading(body: str, fallback: str) -> str:
    for line in body.split("\n"):
        if line.startswith("# "):
            return line[2:].strip()
    return fallback


def collect_chapters() -> list[dict]:
    """00-07 主线章节。"""
    out = []
    for d in sorted(CONTENT.iterdir()):
        if not d.is_dir():
            continue
        m = CHAPTER_RE.match(d.name)
        if not m:
            continue
        readme = d / "README.md"
        if not readme.exists():
            continue
        meta, body = parse_frontmatter(readme.read_text(encoding="utf-8"))
        out.append({
            "slug": d.name,
            "order": int(m.group(1)),
            "name": m.group(2),
            "title": meta.get("title") or first_heading(body, m.group(2)),
            "status": meta.get("status", "草稿"),
            "body": body.strip(),
        })
    return sorted(out, key=lambda c: c["order"])


def collect_cases() -> list[dict]:
    """真实案例（content/cases/<案例名>/README.md）。"""
    cases_dir = CONTENT / "cases"
    out = []
    if not cases_dir.is_dir():
        return out
    for d in sorted(cases_dir.iterdir()):
        if not d.is_dir() or d.name == "assets":
            continue
        readme = d / "README.md"
        if not readme.exists():
            continue
        meta, body = parse_frontmatter(readme.read_text(encoding="utf-8"))
        commits = meta.get("commits", [])
        if isinstance(commits, str):
            commits = [commits]
        out.append({
            "slug": d.name,
            "title": meta.get("title") or first_heading(body, d.name),
            "repo": meta.get("repo", ""),
            "commits": commits,
            "date": meta.get("date", ""),
            "tags": meta.get("tags", []),
            "body": body.strip(),
        })
    return out


def collect_resources() -> list[dict]:
    """resources/ 下的提示词与模板。"""
    res = CONTENT / "resources"
    out = []
    if not res.is_dir():
        return out
    for sub in sorted(res.iterdir()):
        if not sub.is_dir():
            continue
        for f in sorted(sub.glob("*.md")):
            if f.name == "README.md":
                continue
            meta, body = parse_frontmatter(f.read_text(encoding="utf-8"))
            out.append({
                "category": sub.name,
                "slug": f.stem,
                "title": meta.get("title") or first_heading(body, f.stem),
                "body": body.strip(),
            })
    return out


def clean_md(s: str) -> str:
    """去掉 markdown 行内标记：加粗、斜体、行内代码。"""
    s = re.sub(r"\*\*(.+?)\*\*", r"\1", s)
    s = re.sub(r"`([^`]+)`", r"\1", s)
    s = re.sub(r"\*(.+?)\*", r"\1", s)
    return s.strip()


def collect_glossary() -> list[dict]:
    """术语表：解析 resources/glossary/README.md 里的表格。"""
    f = CONTENT / "resources" / "glossary" / "README.md"
    if not f.exists():
        return []
    _, body = parse_frontmatter(f.read_text(encoding="utf-8"))
    out = []
    cat = ""
    for line in body.split("\n"):
        line = line.strip()
        if line.startswith("## "):
            cat = line[3:].strip()
            continue
        if not line.startswith("|"):
            continue
        cells = [c.strip() for c in line.strip("|").split("|")]
        if len(cells) < 2:
            continue
        # 跳过表头与分隔行
        if set(cells[0]) <= set("-: ") or cells[0] in ("术语", "名词", "Term"):
            continue
        out.append({
            "term": clean_md(cells[0]),
            "full": clean_md(cells[1]) if len(cells) > 2 else "",
            "plain": clean_md(cells[-1]),
            "category": cat,
        })
    return out


def collect_stats(chapters, cases, resources, glossary) -> dict:
    total_chars = sum(len(c["body"]) for c in chapters)
    total_chars += sum(len(c["body"]) for c in cases)
    total_chars += sum(len(r["body"]) for r in resources)
    examples = 0
    for c in chapters:
        examples += len(set(re.findall(r"示例\s*(\d+)", c["body"])))
    return {
        "chapters": len(chapters),
        "cases": len(cases),
        "resources": len(resources),
        "glossary": len(glossary),
        "examples": examples,
        "chars": total_chars,
        "builtAt": datetime.now().strftime("%Y-%m-%d %H:%M"),
    }


def sync_assets() -> int:
    """把 content/ 里的图片同步到 public/content-assets/，供站点引用。"""
    src = CONTENT / "cases" / "assets"
    dst = ROOT / "public" / "content-assets"
    if not src.is_dir():
        return 0
    dst.mkdir(parents=True, exist_ok=True)
    n = 0
    for f in src.iterdir():
        if f.is_file():
            target = dst / f.name
            # 内容变了才复制，避免每次构建都碰 mtime
            if not target.exists() or target.read_bytes() != f.read_bytes():
                target.write_bytes(f.read_bytes())
            n += 1
    return n


def main() -> int:
    if not CONTENT.is_dir():
        print("❌ 找不到 content/ 目录", file=sys.stderr)
        return 1

    chapters = collect_chapters()
    cases = collect_cases()
    resources = collect_resources()
    glossary = collect_glossary()
    stats = collect_stats(chapters, cases, resources, glossary)
    assets = sync_assets()

    OUT.parent.mkdir(parents=True, exist_ok=True)

    def js(x) -> str:
        return json.dumps(x, ensure_ascii=False, indent=2)

    OUT.write_text(
        "// 由 scripts/build_content.py 自动生成 —— 请勿手改\n"
        "// 改内容请编辑 content/ 下的 markdown，然后重跑 npm run build\n"
        "\n"
        "export interface Chapter {\n"
        "  slug: string\n"
        "  order: number\n"
        "  name: string\n"
        "  title: string\n"
        "  status: string\n"
        "  body: string\n"
        "}\n"
        "\n"
        "export interface CaseStudy {\n"
        "  slug: string\n"
        "  title: string\n"
        "  repo: string\n"
        "  commits: string[]\n"
        "  date: string\n"
        "  tags: string[]\n"
        "  body: string\n"
        "}\n"
        "\n"
        "export interface Resource {\n"
        "  category: string\n"
        "  slug: string\n"
        "  title: string\n"
        "  body: string\n"
        "}\n"
        "\n"
        "export interface GlossaryItem {\n"
        "  term: string\n"
        "  full: string\n"
        "  plain: string\n"
        "  category: string\n"
        "}\n"
        "\n"
        f"export const chapters: Chapter[] = {js(chapters)}\n\n"
        f"export const cases: CaseStudy[] = {js(cases)}\n\n"
        f"export const resources: Resource[] = {js(resources)}\n\n"
        f"export const glossary: GlossaryItem[] = {js(glossary)}\n\n"
        f"export const stats = {js(stats)} as const\n",
        encoding="utf-8",
    )

    print(f"✅ 已生成 {OUT.relative_to(ROOT)}")
    print(
        f"   {stats['chapters']} 章节 · {stats['cases']} 案例 · "
        f"{stats['resources']} 资源 · {stats['glossary']} 术语 · "
        f"{stats['examples']} 示例 · {stats['chars']} 字"
    )
    if assets:
        print(f"   🖼  同步 {assets} 张配图 → public/content-assets/")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
