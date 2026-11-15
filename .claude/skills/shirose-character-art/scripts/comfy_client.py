#!/usr/bin/env python3
"""Klien ComfyUI minimal (HTTP API, tanpa dependensi selain stdlib).

Pakai:
  python3 comfy_client.py status
  python3 comfy_client.py run --workflow wf.json --out DIR \
      --set PROMPT="..." --set NEGATIVE="..." --set SEED=123 \
      --image REF_IMAGE=ref/shirose-idle-master.png --image POSE_IMAGE=poses/sword.png

Workflow = file "Save (API Format)" dari ComfyUI. Isi placeholder dengan string {{NAMA}}:
  teks/angka  → --set NAMA=nilai
  gambar      → --image NAMA=path  (diunggah ke /upload/image, nilai diganti nama file hasil upload)
Env: COMFY_URL (default http://127.0.0.1:8188). Hasil gambar disimpan di --out.
JANGAN dipakai bila `status` gagal — artinya ComfyUI belum terhubung; jangan mengklaim gambar dibuat.
"""
import argparse, json, mimetypes, os, sys, time, uuid, urllib.request, urllib.parse, urllib.error

URL = os.environ.get("COMFY_URL", "http://127.0.0.1:8188").rstrip("/")

def req(path, data=None, headers=None, method=None):
    r = urllib.request.Request(URL + path, data=data, headers=headers or {}, method=method)
    with urllib.request.urlopen(r, timeout=60) as resp: return resp.read()

def status():
    try:
        s = json.loads(req("/system_stats")); print(json.dumps(s, indent=2)[:800]); return 0
    except Exception as e:
        print(f"ComfyUI TIDAK terhubung di {URL}: {e}", file=sys.stderr); return 2

def upload(path):
    b = uuid.uuid4().hex; name = os.path.basename(path); ct = mimetypes.guess_type(name)[0] or "image/png"
    body = (f"--{b}\r\nContent-Disposition: form-data; name=\"image\"; filename=\"{name}\"\r\nContent-Type: {ct}\r\n\r\n").encode() \
        + open(path, "rb").read() + f"\r\n--{b}\r\nContent-Disposition: form-data; name=\"overwrite\"\r\n\r\ntrue\r\n--{b}--\r\n".encode()
    out = json.loads(req("/upload/image", body, {"Content-Type": f"multipart/form-data; boundary={b}"}, "POST"))
    return out["name"]

def fill(node, vals):
    if isinstance(node, dict): return {k: fill(v, vals) for k, v in node.items()}
    if isinstance(node, list): return [fill(v, vals) for v in node]
    if isinstance(node, str) and node.startswith("{{") and node.endswith("}}"):
        k = node[2:-2]
        if k not in vals: sys.exit(f"placeholder {{{{{k}}}}} belum diisi")
        return vals[k]
    if isinstance(node, str) and "{{" in node:
        for k, v in vals.items(): node = node.replace("{{" + k + "}}", str(v))
    return node

def run(a):
    vals = {}
    for kv in a.set or []:
        k, v = kv.split("=", 1); vals[k] = int(v) if v.lstrip("-").isdigit() else v
    for kv in a.image or []:
        k, p = kv.split("=", 1); vals[k] = upload(p)
    wf = fill(json.load(open(a.workflow)), vals)
    pid = json.loads(req("/prompt", json.dumps({"prompt": wf, "client_id": uuid.uuid4().hex}).encode(), {"Content-Type": "application/json"}, "POST"))["prompt_id"]
    t0 = time.time()
    while True:
        h = json.loads(req(f"/history/{pid}"))
        if pid in h and h[pid].get("outputs"): break
        if time.time() - t0 > a.timeout: sys.exit("timeout menunggu ComfyUI")
        time.sleep(1.5)
    os.makedirs(a.out, exist_ok=True); saved = []
    for node in h[pid]["outputs"].values():
        for im in node.get("images", []):
            q = urllib.parse.urlencode({"filename": im["filename"], "subfolder": im.get("subfolder", ""), "type": im.get("type", "output")})
            dest = os.path.join(a.out, f"{int(time.time())}_{im['filename']}")
            open(dest, "wb").write(req("/view?" + q)); saved.append(dest)
    print(json.dumps(saved, indent=2)); return 0 if saved else 3

if __name__ == "__main__":
    ap = argparse.ArgumentParser(); sub = ap.add_subparsers(dest="cmd", required=True)
    sub.add_parser("status")
    r = sub.add_parser("run"); r.add_argument("--workflow", required=True); r.add_argument("--out", required=True)
    r.add_argument("--set", action="append"); r.add_argument("--image", action="append"); r.add_argument("--timeout", type=int, default=600)
    a = ap.parse_args(); sys.exit(status() if a.cmd == "status" else run(a))
