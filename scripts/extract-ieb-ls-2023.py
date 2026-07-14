#!/usr/bin/env python3
"""
Extract Mom's IEB 2023 Life Sciences PDFs to local gitignored `_extracts/`.

  /tmp/am-pdf/bin/python scripts/extract-ieb-ls-2023.py
  # or any venv with: pip install pypdf

Does not commit text. See docs/parent-samples/.../EXTRACT_INDEX.md.
"""
from __future__ import annotations

import json
from pathlib import Path

try:
    from pypdf import PdfReader
except ImportError as e:
    raise SystemExit("Install pypdf first: python3 -m venv .venv && .venv/bin/pip install pypdf") from e

ROOT = Path(__file__).resolve().parents[1]
YEAR = ROOT / "docs/parent-samples/life-sciences/ieb/grade-12/final-exam/2023"
OUT = YEAR / "_extracts"
WEAK_CHAR_THRESHOLD = 200

FILES = [
    "paper-1/2023-paper-1-analysis-grid.pdf",
    "paper-1/2023-paper-1-memorandum.pdf",
    "paper-1/2023-paper-1-question-paper.pdf",
    "paper-2/2023-paper-2-analysis-grid.pdf",
    "paper-2/2023-paper-2-memorandum.pdf",
    "paper-2/2023-paper-2-question-paper.pdf",
    "paper-2/2023-paper-2-sources.pdf",
]


def extract_one(rel: str) -> dict:
    pdf_path = YEAR / rel
    if not pdf_path.exists():
        raise FileNotFoundError(pdf_path)
    reader = PdfReader(str(pdf_path))
    pages_text: list[str] = []
    weak: list[int] = []
    for i, page in enumerate(reader.pages, start=1):
        text = page.extract_text() or ""
        pages_text.append(f"\n\n===== PAGE {i} =====\n\n{text}")
        if len(text.strip()) < WEAK_CHAR_THRESHOLD:
            weak.append(i)
    out_name = Path(rel).name.replace(".pdf", ".txt")
    out_path = OUT / out_name
    body = "".join(pages_text).lstrip()
    out_path.write_text(body, encoding="utf-8")
    return {
        "file": rel,
        "extract": f"_extracts/{out_name}",
        "pages": len(reader.pages),
        "chars": len(body),
        "weakPages": weak,
        "method": "pypdf",
    }


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    results = [extract_one(rel) for rel in FILES]
    ocr_needed = [{"file": r["file"], "pages": r["weakPages"]} for r in results if r["weakPages"]]
    manifest = {
        "source": "IEB Life Sciences Grade 12 Final 2023",
        "files": results,
        "ocrNeededPages": ocr_needed,
        "note": "Low-char pages are typically lined blanks (headers only). Confirm with Vision OCR if unsure.",
    }
    (OUT / "EXTRACT_MANIFEST.json").write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
    print(f"Wrote {len(results)} extracts → {OUT}")
    for r in results:
        weak = f" weak={r['weakPages']}" if r["weakPages"] else ""
        print(f"  {r['extract']}: {r['pages']} pages, {r['chars']} chars{weak}")


if __name__ == "__main__":
    main()
