#!/usr/bin/env python3
"""Build satu proyek Cloudflare Pages dari repo ini.

Pemakaian (dipanggil sebagai build command di Cloudflare Pages):
    python3 tools/cf-pages/build.py web         -> dist/ berisi tampilan web + _redirects
    python3 tools/cf-pages/build.py jlpt-audio  -> dist/ berisi file milik proyek itu + _headers

Peta proyek ada di tools/cf-pages/projects.json. Web tidak berisi file milik
proyek lain; permintaan ke file itu dialihkan (302) ke proyek pemiliknya, jadi
pengguna tetap di shirosenihongo.com dan kode web tidak perlu diubah.
"""
import fnmatch
import json
import os
import re
import shutil
import sys

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
CONF = json.load(open(os.path.join(ROOT, "tools", "cf-pages", "projects.json"), encoding="utf-8"))
OUT = os.path.join(ROOT, "dist")
MAX_FILES = int(os.environ.get("CF_MAX_FILES", "20000"))
MAX_BYTES = 25 * 1024 * 1024
ALWAYS_SKIP = {".git", "dist", "node_modules"}

# Cache: audio praktis tidak pernah berubah isinya; soal/materi bisa diperbaiki.
CACHE_AUDIO = "public, max-age=2592000"
CACHE_SOAL = "public, max-age=3600"


def pattern_regex(p):
    """'data/jft/ppt/*/a/' -> regex prefix; '*' = satu segmen folder."""
    return re.compile("^" + "/".join(re.escape(s) if s != "*" else "[^/]+" for s in p.split("/")))


ORDER = list(CONF["projects"].keys())
RULES = [(name, pattern_regex(p), p) for name in ORDER for p in CONF["projects"][name]["paths"]]


def owner(rel):
    for name, rx, _ in RULES:
        if rx.match(rel):
            return name
    return "web"


def web_excluded(rel):
    for pat in CONF["web_exclude"]:
        if pat.endswith("/"):
            if rel.startswith(pat):
                return True
        elif "/" not in pat and fnmatch.fnmatch(os.path.basename(rel), pat) and "/" not in rel:
            return True
        elif rel == pat:
            return True
    return False


def all_files():
    for dirpath, dirnames, filenames in os.walk(ROOT):
        rel_dir = os.path.relpath(dirpath, ROOT)
        dirnames[:] = [d for d in dirnames if not (rel_dir == "." and d in ALWAYS_SKIP)]
        for f in filenames:
            rel = os.path.normpath(os.path.join(rel_dir, f)).replace(os.sep, "/")
            yield rel


def place(rel):
    src, dst = os.path.join(ROOT, rel), os.path.join(OUT, rel)
    os.makedirs(os.path.dirname(dst), exist_ok=True)
    try:
        os.link(src, dst)
    except OSError:
        shutil.copy2(src, dst)


def redirects():
    lines = ["# Dibuat otomatis oleh tools/cf-pages/build.py — jangan diedit manual."]
    for name, _, p in RULES:
        base = CONF["projects"][name]["base"].rstrip("/")
        if "*" in p:
            # data/jft/ppt/*/a/ -> /data/jft/ppt/:p1/a/:file (placeholder per segmen)
            segs, src, n = [], [], 0
            for s in p.strip("/").split("/"):
                if s == "*":
                    n += 1
                    s = f":p{n}"
                src.append(s)
            path = "/" + "/".join(src) + "/:file"
            lines.append(f"{path} {base}{path} 302")
        else:
            lines.append(f"/{p}* {base}/{p}:splat 302")
    return "\n".join(lines) + "\n"


def headers(name):
    cache = CACHE_AUDIO if name.endswith("audio") else CACHE_SOAL
    return (
        "/*\n"
        "  Access-Control-Allow-Origin: *\n"
        f"  Cache-Control: {cache}\n"
        "  X-Robots-Tag: noindex\n"
    )


def main():
    if len(sys.argv) != 2 or (sys.argv[1] != "web" and sys.argv[1] not in CONF["projects"]):
        sys.exit("pakai: build.py web|" + "|".join(ORDER))
    target = sys.argv[1]
    if os.path.exists(OUT):
        shutil.rmtree(OUT)
    os.makedirs(OUT)

    count, size, too_big = 0, 0, []
    for rel in all_files():
        if owner(rel) != target:
            continue
        if target == "web" and web_excluded(rel):
            continue
        b = os.path.getsize(os.path.join(ROOT, rel))
        if b > MAX_BYTES:
            too_big.append(rel)
            continue
        place(rel)
        count += 1
        size += b

    extra = os.path.join(OUT, "_redirects" if target == "web" else "_headers")
    with open(extra, "w", encoding="utf-8") as fh:
        fh.write(redirects() if target == "web" else headers(target))
    if target != "web":
        with open(os.path.join(OUT, "index.html"), "w", encoding="utf-8") as fh:
            fh.write('<!doctype html><meta charset="utf-8"><meta http-equiv="refresh" content="0;url=https://shirosenihongo.com/">')
        count += 1
    count += 1

    print(f"[cf-pages] {target}: {count} file, {size / 1048576:.1f} MB")
    if too_big:
        print("[cf-pages] DILEWATI (>25 MiB):", *too_big, sep="\n  ")
    if count > MAX_FILES:
        sys.exit(f"[cf-pages] GAGAL: {count} file melebihi batas {MAX_FILES}. Pecah proyek ini (lihat projects.json).")
    if count > MAX_FILES * 0.9:
        print(f"[cf-pages] PERINGATAN: {count} file, sudah >90% dari batas {MAX_FILES}. Siapkan proyek -2.")


if __name__ == "__main__":
    main()
