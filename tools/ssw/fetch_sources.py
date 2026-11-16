# -*- coding: utf-8 -*-
"""Unduh PDF resmi yang tercatat di SSW_SOURCE_REGISTRY.json ke ssw-materials/<sektor>/original-pdf/.
Jalankan di komputer/lingkungan yang boleh mengakses situs pemerintah Jepang:
    python3 tools/ssw/fetch_sources.py            # semua yang NOT DOWNLOADED dan berakhiran .pdf
    python3 tools/ssw/fetch_sources.py SRC-001    # hanya ID tertentu
Setelah unduh: status di registry diubah menjadi DOWNLOADED (+ sha256, ukuran, tanggal). Cek lisensi penggunaan ulang
sebelum commit; dokumen pemerintah biasanya boleh dirujuk, tetapi jangan redistribusi jika syaratnya melarang."""
import json, sys, hashlib, os, re, datetime, urllib.request
REG = "SSW_SOURCE_REGISTRY.json"
SLUG = {"auto-maintenance": "automobile-maintenance", "industrial-mfg": "industrial-manufacturing", "semua": "common"}
only = set(sys.argv[1:])
d = json.load(open(REG, encoding="utf-8"))
for r in d["documents"]:
    url = r["official_source_url"]
    if only and r["document_id"] not in only: continue
    if not url.lower().endswith(".pdf") or r["download_status"].startswith("DOWNLOADED"): continue
    folder = os.path.join("ssw-materials", SLUG.get(r["sector"], r["sector"]), "original-pdf")
    os.makedirs(folder, exist_ok=True)
    fn = os.path.join(folder, r["document_id"] + "_" + re.sub(r"[^A-Za-z0-9._-]", "_", url.rsplit("/", 1)[-1]))
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (shirose-nihongo source fetch)"})
        data = urllib.request.urlopen(req, timeout=60).read()
        if not data.startswith(b"%PDF"): raise ValueError("bukan PDF")
        open(fn, "wb").write(data)
        r.update(download_status="DOWNLOADED", local_path=fn, sha256=hashlib.sha256(data).hexdigest(), bytes=len(data),
                 last_checked=datetime.date.today().isoformat())
        print("OK  ", r["document_id"], fn, len(data))
    except Exception as e:
        print("GAGAL", r["document_id"], url, e)
json.dump(d, open(REG, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
