#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
VibeCamp 一键导出脚本

把 content/ 下的所有章节打包成一个可分发的教程包（zip），
并在导出时给内容加水印 + 页眉页脚。

用法：
    python3 scripts/export.py                     # 默认导出到 dist-export/
    python3 scripts/export.py --watermark "张三"   # 自定义水印
    python3 scripts/export.py --format dir        # 导出为目录而非 zip
    python3 scripts/export.py --no-watermark      # 不加水印

水印说明：
    水印会以两种方式嵌入，都「可见但不影响阅读」：
    1. 文首：一行来源声明（含水印名、导出时间）
    2. 文尾：一行分隔线 + 水印
    这样即便内容被复制出去，来源信息也会跟着走。
"""

import argparse
import re
import shutil
import sys
import zipfile
from datetime import datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CONTENT = ROOT / "content"
DEFAULT_OUT = ROOT / "dist-export"

# 章节显示顺序（按目录名排序即可，这里用于生成 README 索引）
CHAPTER_RE = re.compile(r"^(\d+)-(.+)$")
FRONTMATTER_RE = re.compile(r"^---\s*\n(.*?)\n---\s*\n", re.S)


def parse_frontmatter(text: str):
    """解析 YAML frontmatter（只处理简单的 key: value，够用即可）。"""
    meta = {}
    m = FRONTMATTER_RE.match(text)
    if not m:
        return meta, text
    for line in m.group(1).split("\n"):
        line = line.strip()
        if ":" in line and not line.startswith("#"):
            k, _, v = line.partition(":")
            meta[k.strip()] = v.strip()
    return meta, text[m.end():]


def make_watermark_block(name: str, when: str, source: str) -> str:
    """文首水印：来源声明。"""
    return (
        f"> 📦 本文档由 **VibeCamp** 导出\n"
        f"> 水印：{name} · 导出时间：{when}\n"
        f"> 源文件：`{source}` · 项目主页：https://github.com/luckscx/VibeCamp\n"
        f"\n---\n\n"
    )


def make_watermark_footer(name: str, when: str) -> str:
    """文尾水印。"""
    return (
        f"\n\n---\n\n"
        f"<!-- VibeCamp export | watermark: {name} | {when} -->\n"
        f"*本页来自 VibeCamp 教程包 · 水印：{name} · {when}*\n"
    )


def collect_files():
    """收集所有 markdown，按章节顺序排序。"""
    files = sorted(CONTENT.rglob("*.md"))
    # 排序：content/README.md 最前，然后 00..07，最后 resources
    def key(p: Path):
        rel = p.relative_to(CONTENT)
        parts = rel.parts
        if parts[0] == "README.md":
            return (0,)
        m = CHAPTER_RE.match(parts[0])
        if m:
            return (1, int(m.group(1)), parts[1:] if len(parts) > 1 else ("",))
        if parts[0] == "resources":
            return (2, *parts[1:])
        return (3, *parts)
    return sorted(files, key=key)


def build_index(files, watermark: str, when: str) -> str:
    """生成打包包的 README.md 索引。"""
    lines = [
        "# VibeCamp 教程包",
        "",
        "> AI 构建训练营 —— 帮零基础用户用 CodeBuddy / WorkBuddy 做出自己的小游戏、小应用",
        "",
        f"- 水印：**{watermark}**",
        f"- 导出时间：{when}",
        f"- 文件数：{len(files)}",
        "",
        "---",
        "",
        "## 目录",
        "",
    ]
    cur_section = None
    for f in files:
        rel = f.relative_to(CONTENT)
        parts = rel.parts
        if parts[0] == "README.md":
            lines.append(f"- [总目录]({rel.as_posix()})")
            continue
        m = CHAPTER_RE.match(parts[0])
        if m:
            section = "主线章节"
            label = f"第 {int(m.group(1))} 章 · {m.group(2)}"
        elif parts[0] == "resources":
            section = "资源库"
            label = " / ".join(parts[1:-1]) if len(parts) > 2 else "资源库"
        else:
            section = "其他"
            label = parts[0]
        if section != cur_section:
            lines.append("")
            lines.append(f"### {section}")
            lines.append("")
            cur_section = section
        _, body = parse_frontmatter(f.read_text(encoding="utf-8"))
        # 取第一个一级标题当名字
        title = None
        for l in body.split("\n"):
            if l.startswith("# "):
                title = l[2:].strip()
                break
        display = title or label
        lines.append(f"- [{display}]({rel.as_posix()})")
    lines += [
        "",
        "---",
        "",
        "## 使用建议",
        "",
        "1. 按「主线章节」从第 0 章开始顺序阅读",
        "2. 遇到看不懂的词查「资源库 → 术语表」",
        "3. 卡住了翻「第 5 章 · 排错」",
        "",
        "## 许可证",
        "",
        "内容基于 CodeBuddy 官方文档与实操整理，可自由分享，请保留水印来源。",
        "",
    ]
    return "\n".join(lines)


def export(watermark: str | None, out_dir: Path, as_zip: bool):
    files = collect_files()
    if not files:
        print("❌ content/ 下没有找到任何 .md 文件", file=sys.stderr)
        return 1

    when = datetime.now().strftime("%Y-%m-%d %H:%M")

    # 清理并重建输出目录
    if out_dir.exists():
        shutil.rmtree(out_dir)
    out_dir.mkdir(parents=True)

    count = 0
    for f in files:
        rel = f.relative_to(CONTENT)
        raw = f.read_text(encoding="utf-8")
        meta, body = parse_frontmatter(raw)

        if watermark:
            content = (
                make_watermark_block(watermark, when, rel.as_posix())
                + body
                + make_watermark_footer(watermark, when)
            )
        else:
            content = body

        target = out_dir / "VibeCamp" / rel
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(content, encoding="utf-8")
        count += 1

    # 索引
    idx_name = "VibeCamp"
    text = build_index(files, watermark or "（无）", when)
    if watermark:
        text = make_watermark_block(watermark, when, "README.md") + text
    (out_dir / idx_name / "README.md").write_text(text, encoding="utf-8")

    print(f"✅ 已导出 {count} 个文件 → {out_dir / idx_name}")

    if as_zip:
        zip_path = out_dir / f"VibeCamp-教程包-{datetime.now():%Y%m%d}.zip"
        with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as z:
            for p in sorted((out_dir / idx_name).rglob("*")):
                if p.is_file():
                    z.write(p, p.relative_to(out_dir / idx_name))
        size_kb = zip_path.stat().st_size / 1024
        print(f"📦 打包完成：{zip_path}")
        print(f"   大小：{size_kb:.1f} KB")
        return 0
    return 0


def main():
    ap = argparse.ArgumentParser(description="VibeCamp 教程包一键导出")
    ap.add_argument("--watermark", "-w", default="VibeCamp",
                    help="水印文字（默认 VibeCamp）")
    ap.add_argument("--no-watermark", action="store_true",
                    help="不加水印，导出纯净版")
    ap.add_argument("--out", "-o", default=str(DEFAULT_OUT),
                    help="输出目录（默认 dist-export/）")
    ap.add_argument("--format", "-f", choices=["zip", "dir"], default="zip",
                    help="输出格式（默认 zip）")
    args = ap.parse_args()

    wm = None if args.no_watermark else args.watermark
    return export(wm, Path(args.out), args.format == "zip")


if __name__ == "__main__":
    sys.exit(main())
