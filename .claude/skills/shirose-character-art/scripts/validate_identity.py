#!/usr/bin/env python3
"""Validasi identitas karakter: bandingkan gambar kandidat dengan gambar referensi.

Pakai:  python3 validate_identity.py --ref REF.png --cand CAND.png [--profile shirose] [--out DIR] [--strict]
Keluaran: skor per cek + PASS/FAIL (exit code 0/1) + gambar side-by-side + report.json.

Cek yang dilakukan (semua harus lolos untuk PASS):
  1. palette   : proporsi piksel warna identitas (rambut navy, kacamata pink, sayap emas, emblem ungu, kulit, seragam gelap)
                 terhadap luas subjek harus mendekati referensi (toleransi per warna).
  2. histogram : korelasi histogram HSV area subjek (bukan latar).
  3. layout    : rasio komposisi (sayap lebar vs tinggi badan, posisi kepala) memakai bbox warna emas & rambut.
  4. features  : kecocokan fitur ORB (wajah/kacamata/emblem) setelah subjek dinormalisasi.
  5. ssim      : SSIM siluet+shading pada area kepala (crop 40% atas subjek) — menangkap perubahan wajah/rambut.
Catatan: ini alat bantu otomatis. Hasil PASS tetap harus DICEK MATA (lihat sbs.png); hasil FAIL = revisi.
"""
import argparse, json, os, sys
import numpy as np, cv2
from skimage.metrics import structural_similarity as ssim

# Rentang HSV OpenCV (H 0-179). Dikalibrasi dari master Shirose Nihongo.
PROFILES = {
  "shirose": {
    "colors": {  # nama: (lo, hi, rasio_min_terhadap_ref, rasio_maks_terhadap_ref)
      "wing_gold":   ((15, 110, 170), (32, 255, 255), 0.55, 1.8),
      "hair_navy":   ((100, 90, 25),  (128, 255, 150), 0.45, 2.2),
      "glasses_pink":((150, 50, 170), (178, 200, 255), 0.30, 3.0),
      "emblem_purple":((125, 90, 70), (150, 255, 255), 0.30, 3.0),
      "skin":        ((5, 25, 190),   (22, 130, 255),  0.45, 2.2),
      "uniform_dark":((0, 0, 0),      (180, 255, 70),  0.45, 2.2),
    },
    "required": ["wing_gold", "hair_navy", "skin"]   # warna senjata/efek menggeser rasio seragam & ungu → hanya dicek di --strict,
  }
}

def load(p):
    im = cv2.imread(p, cv2.IMREAD_UNCHANGED)
    if im is None: sys.exit(f"gagal baca {p}")
    if im.ndim == 3 and im.shape[2] == 4:      # alpha → komposit ke latar abu netral
        a = im[:, :, 3:4] / 255.0
        im = (im[:, :, :3] * a + 128 * (1 - a)).astype(np.uint8)
    elif im.ndim == 2: im = cv2.cvtColor(im, cv2.COLOR_GRAY2BGR)
    return im

def subject_mask(bgr):
    """Subjek = piksel berwarna jenuh/terang yang bukan latar. Latar diperkirakan dari median tepi."""
    h, w = bgr.shape[:2]
    edge = np.concatenate([bgr[0], bgr[-1], bgr[:, 0], bgr[:, -1]]).astype(np.float32)
    bg = np.median(edge, axis=0)
    d = np.linalg.norm(bgr.astype(np.float32) - bg, axis=2)
    m = (d > 40).astype(np.uint8) * 255
    m = cv2.morphologyEx(m, cv2.MORPH_CLOSE, np.ones((7, 7), np.uint8))
    n, lab, st, _ = cv2.connectedComponentsWithStats(m)
    if n <= 1: return m
    keep = np.zeros_like(m)
    big = st[1:, cv2.CC_STAT_AREA].max()
    for i in range(1, n):
        if st[i, cv2.CC_STAT_AREA] >= big * 0.05: keep[lab == i] = 255
    return keep

def crop_subject(bgr, m, size=256):
    ys, xs = np.where(m > 0)
    if len(xs) == 0: return cv2.resize(bgr, (size, size)), (0, 0, bgr.shape[1], bgr.shape[0])
    x0, x1, y0, y1 = xs.min(), xs.max(), ys.min(), ys.max()
    c = bgr[y0:y1 + 1, x0:x1 + 1]
    s = size / max(c.shape[:2])
    c = cv2.resize(c, (max(1, int(c.shape[1] * s)), max(1, int(c.shape[0] * s))), interpolation=cv2.INTER_AREA)
    canvas = np.full((size, size, 3), 128, np.uint8)
    oy, ox = (size - c.shape[0]) // 2, (size - c.shape[1]) // 2
    canvas[oy:oy + c.shape[0], ox:ox + c.shape[1]] = c
    return canvas, (x0, y0, x1 - x0 + 1, y1 - y0 + 1)

def color_ratios(bgr, m, prof):
    hsv = cv2.cvtColor(bgr, cv2.COLOR_BGR2HSV)
    area = max(1, int((m > 0).sum())); out = {}
    for k, (lo, hi, *_r) in prof["colors"].items():
        mk = cv2.inRange(hsv, np.array(lo), np.array(hi)); mk = cv2.bitwise_and(mk, m)
        out[k] = float((mk > 0).sum()) / area
    return out

def bbox_of(bgr, m, lo, hi):
    hsv = cv2.cvtColor(bgr, cv2.COLOR_BGR2HSV)
    mk = cv2.bitwise_and(cv2.inRange(hsv, np.array(lo), np.array(hi)), m)
    ys, xs = np.where(mk > 0)
    if len(xs) < 30: return None
    return xs.min(), ys.min(), xs.max(), ys.max()

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--ref", required=True); ap.add_argument("--cand", required=True)
    ap.add_argument("--profile", default="shirose"); ap.add_argument("--out", default=None)
    ap.add_argument("--strict", action="store_true", help="ambang lebih ketat (untuk pose idle/turnaround depan)")
    ap.add_argument("--no-ssim", action="store_true", help="lewati SSIM kepala (untuk pose yang menutupi/memutar kepala)")
    a = ap.parse_args()
    prof = PROFILES[a.profile]
    R, C = load(a.ref), load(a.cand)
    mR, mC = subject_mask(R), subject_mask(C)
    cR, bR = crop_subject(R, mR); cC, bC = crop_subject(C, mC)
    res, fails = {}, []

    # 1. palette
    rR, rC = color_ratios(R, mR, prof), color_ratios(C, mC, prof)
    pal = {}
    for k, (_, _, lo, hi) in prof["colors"].items():
        ratio = (rC[k] / rR[k]) if rR[k] > 1e-4 else (1.0 if rC[k] < 1e-3 else 9.9)
        ok = lo <= ratio <= hi
        pal[k] = {"ref": round(rR[k], 4), "cand": round(rC[k], 4), "ratio": round(ratio, 2), "ok": ok}
        if not ok and (k in prof["required"] or a.strict): fails.append(f"palette:{k} rasio {ratio:.2f} di luar [{lo},{hi}]")
    res["palette"] = pal

    # 2. histogram HSV (subjek saja)
    def hist(img, m):
        h = cv2.calcHist([cv2.cvtColor(img, cv2.COLOR_BGR2HSV)], [0, 1], m, [30, 32], [0, 180, 0, 256])
        return cv2.normalize(h, h).flatten()
    hc = float(cv2.compareHist(hist(R, mR), hist(C, mC), cv2.HISTCMP_CORREL))
    res["hist_corr"] = round(hc, 3)
    if hc < (0.55 if a.strict else 0.35): fails.append(f"histogram korelasi {hc:.2f} terlalu rendah")

    # 3. layout: lebar sayap / tinggi subjek, posisi vertikal rambut
    lo, hi = prof["colors"]["wing_gold"][:2]
    wR, wC = bbox_of(R, mR, lo, hi), bbox_of(C, mC, lo, hi)
    if wR and wC:
        ar = lambda b, s: (b[2] - b[0]) / max(1, s[3])
        lay = ar(wC, bC) / max(1e-3, ar(wR, bR))
        res["wing_width_ratio"] = round(lay, 2)
        if not (0.7 <= lay <= 1.4): fails.append(f"lebar sayap relatif {lay:.2f} (harus 0.7–1.4 dari ref)")
    elif wR and not wC: fails.append("sayap emas tidak terdeteksi pada kandidat")

    # 4. ORB features
    orb = cv2.ORB_create(1500)
    gR, gC = cv2.cvtColor(cR, cv2.COLOR_BGR2GRAY), cv2.cvtColor(cC, cv2.COLOR_BGR2GRAY)
    kR, dR = orb.detectAndCompute(gR, None); kC, dC = orb.detectAndCompute(gC, None)
    good = 0
    if dR is not None and dC is not None:
        bf = cv2.BFMatcher(cv2.NORM_HAMMING)
        for pr in bf.knnMatch(dR, dC, k=2):
            if len(pr) == 2 and pr[0].distance < 0.75 * pr[1].distance: good += 1
    res["orb_good_matches"] = good
    if good < (25 if a.strict else 10): fails.append(f"kecocokan fitur ORB hanya {good}")

    # 5. SSIM kepala
    if not a.no_ssim:
        hR, hC = cR[: int(256 * .42)], cC[: int(256 * .42)]
        s = float(ssim(cv2.cvtColor(hR, cv2.COLOR_BGR2GRAY), cv2.cvtColor(hC, cv2.COLOR_BGR2GRAY)))
        res["head_ssim"] = round(s, 3)
        if s < (0.45 if a.strict else 0.25): fails.append(f"SSIM kepala {s:.2f} rendah (wajah/rambut/kacamata berubah?)")

    res["verdict"] = "PASS" if not fails else "FAIL"; res["fails"] = fails
    out = a.out or os.path.dirname(os.path.abspath(a.cand))
    os.makedirs(out, exist_ok=True)
    sbs = np.hstack([cR, cC, cv2.absdiff(cR, cC)])
    stem = os.path.splitext(os.path.basename(a.cand))[0]
    cv2.imwrite(os.path.join(out, f"{stem}.sbs.png"), sbs)
    json.dump(res, open(os.path.join(out, f"{stem}.report.json"), "w"), indent=2, ensure_ascii=False)
    print(json.dumps({k: v for k, v in res.items() if k != "palette"}, indent=2, ensure_ascii=False))
    print("palette:", {k: v["ratio"] for k, v in res["palette"].items()})
    print(f"→ {res['verdict']}  (side-by-side: {stem}.sbs.png — WAJIB dicek mata)")
    sys.exit(0 if not fails else 1)

if __name__ == "__main__":
    main()
