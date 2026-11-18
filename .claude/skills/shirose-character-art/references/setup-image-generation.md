# Setup image generation untuk skill shirose-character-art

## Audit awal (hasil pemeriksaan saat skill dibuat, 15 Nov 2026)
- Tidak ada tool image-generation / ComfyUI MCP di sesi Claude yang diperiksa; daftar connector org kosong.
- Sandbox cloud: tanpa GPU, tanpa PyTorch; akses jaringan ke huggingface.co, api.openai.com, api.replicate.com dan `127.0.0.1:8188` gagal (allowlist). Sandbox tidak bisa menjangkau ComfyUI di PC user.
- Yang tersedia di sandbox: Pillow, OpenCV, scikit-image (dipakai untuk validasi, sprite sheet, pembuatan GIF) — **bukan untuk menggambar karakter**.
- Connector registry: ada **Hugging Face** (Gradio Spaces), belum terpasang. ComfyUI MCP tidak ditemukan di registry resmi pada pencarian itu.
Kesimpulan: **generasi gambar belum bisa dilakukan** sampai salah satu jalur di bawah dipasang. Jangan mengklaim sebaliknya.

## Jalur A (disarankan): ComfyUI lokal + MCP/klien di PC user
Cocok untuk konsistensi karakter karena bisa memakai referensi identitas, pose terpisah, inpaint, dan LoRA.

1. **Perangkat**: GPU NVIDIA ≥ 8 GB VRAM (12 GB+ ideal). Tanpa GPU, generasi sangat lambat.
2. **Pasang ComfyUI** (Windows portable build dari repo resmi ComfyUI) lalu jalankan; cek `http://127.0.0.1:8188` terbuka.
3. **ComfyUI-Manager** → pasang custom node:
   - IP-Adapter (mis. *ComfyUI_IPAdapter_plus*) — referensi identitas dari master.
   - ControlNet + preprocessor (*comfyui_controlnet_aux*: OpenPose/DWPose, depth) — referensi pose terpisah.
   - Rembg / background-removal node — latar transparan.
   - Opsional: node inpaint (crop & stitch) untuk wajah/tangan.
4. **Model**: satu checkpoint ilustrasi/anime yang kuat (mis. keluarga SDXL anime) + ControlNet OpenPose untuk arsitekturnya + IP-Adapter yang cocok. Nama/versi persisnya berubah cepat — pilih yang terbaru dan kompatibel, jangan campur SD1.5 dan SDXL.
5. **Konsistensi kuat = LoRA karakter**: buat 20–40 gambar (turnaround + pose + ekspresi yang sudah disetujui, caption seragam, token unik misal `shirose_chibi`) lalu latih LoRA. Satu gambar referensi lewat IP-Adapter saja biasanya tidak cukup untuk sayap berlapis & emblem; LoRA + IP-Adapter + validasi adalah kombinasi yang realistis.
6. **Workflow**: rakit di ComfyUI (identity ref → IP-Adapter; pose → ControlNet; prompt; sampler; rembg) lalu **Save (API Format)** ke `.claude/skills/shirose-character-art/workflows/<nama>.json`. Ganti input dengan placeholder `{{PROMPT}}`, `{{NEGATIVE}}`, `{{SEED}}`, `{{REF_IMAGE}}`, `{{POSE_IMAGE}}`. `scripts/comfy_client.py` mengisi placeholder, mengunggah gambar, menunggu hasil, dan menyimpannya.
7. **Hubungkan ke Claude** — salah satu:
   - *Claude Code lokal di PC user* (paling sederhana): skill + `comfy_client.py` berjalan langsung ke `127.0.0.1:8188`. Tes: `python3 .claude/skills/shirose-character-art/scripts/comfy_client.py status` (harus exit 0).
   - *MCP server ComfyUI*: cari MCP server ComfyUI yang dirawat aktif (periksa repo, lisensi, dan izin sebelum memasang), tambahkan ke konfigurasi MCP Claude (Claude Code: `claude mcp add <nama> -- <perintah>`; Claude desktop: `claude_desktop_config.json` bagian `mcpServers`), restart, lalu pastikan tool-nya muncul di sesi.
   - Sesi cloud tidak bisa menjangkau `localhost` PC; gunakan jalur lokal di atas atau tunnel yang user kendalikan sendiri (pertimbangkan keamanannya).

## Jalur B: Hugging Face connector (Gradio Spaces)
Connector Hugging Face tersedia di registry (belum terpasang). Bisa memanggil Space gambar publik. Keterbatasan: antrean, kuota, privasi gambar referensi (Space publik), dan umumnya tidak ada kontrol multi-referensi + pose + inpaint seperti ComfyUI. Cocok untuk eksplorasi, bukan produksi aset yang konsisten. Pasang dari pengaturan connector claude.ai.

## Jalur C: API gambar berbayar
Perlu domain API masuk allowlist jaringan environment dan kunci API di variabel lingkungan (jangan di-commit). Periksa apakah model mendukung referensi gambar + kontrol pose; tanpa itu konsistensi karakter lemah.

## Verifikasi setelah setup (jalankan sebelum mengerjakan aset apa pun)
1. `comfy_client.py status` → exit 0.
2. Generate 1 gambar uji dari master + pose idle; jalankan `validate_identity.py --strict`; lihat hasil dengan mata.
3. Catat versi model/LoRA/workflow di `manifest.json`.
