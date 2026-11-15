#!/usr/bin/env python3
"""Jadwalkan postingan TikTok. Utama: VIDEO animasi (--video out/<tgl>/vid_<akun>.mp4, dari render_video.js).
Cadangan: FOTO (JPG 1080x1920) dari desain feed IG hari itu (--png).

  python3 tiktok.py --akun sewalaptopbogorr --video out/<tgl>/vid_sewalaptopbogorr.mp4 --caption out/<tgl>/tt_sewalaptopbogorr.txt \
      --tanggal 2026-11-16 [--go]

  python3 tiktok.py --akun sewalaptopbogorr --png out/<tgl>/sewalaptopbogor.png --caption out/<tgl>/tt_sewalaptopbogorr.txt \
      --tanggal 2026-11-16 [--go]

Desain 1080x1350 ditempatkan di kanvas 9:16 (y=170) dengan latar diperpanjang dari tepi atas/bawah desain,
supaya bagian bawah aman dari teks caption TikTok. TikTok menolak PNG ("file_format_check_failed"): selalu JPEG.
"""
import argparse, json, sys
from pathlib import Path
from PIL import Image
sys.path.insert(0, str(Path(__file__).resolve().parent))
from jadwal import call, upload, cek_slot, waktu, utc, ROOT


def ke_916(png: Path) -> Path:
    im = Image.open(png).convert("RGB")
    W, H, TOP = 1080, 1920, 170
    def warna(y0, y1):  # warna rata-rata (median) beberapa baris tepi
        r = im.crop((0, y0, W, y1)).resize((64, 1)); px = sorted(r.getpixel((x, 0)) for x in range(64))
        return px[len(px) // 2]
    atas, bawah = warna(0, 4), warna(im.height - 4, im.height)
    can = Image.new("RGB", (W, H), bawah)
    can.paste(Image.new("RGB", (W, TOP), atas), (0, 0))
    can.paste(im, (0, TOP))
    # sambungan halus 60px di bawah desain
    for i in range(60):
        y = TOP + im.height - 60 + i; a = i / 59
        row = im.crop((0, im.height - 60 + i, W, im.height - 60 + i + 1))
        can.paste(Image.blend(row, Image.new("RGB", (W, 1), bawah), a), (0, y))
    out = png.with_name(png.stem + "_tiktok.jpg")
    can.save(out, quality=90, optimize=True)
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--akun", required=True); ap.add_argument("--png"); ap.add_argument("--video"); ap.add_argument("--caption", required=True)
    ap.add_argument("--tanggal", required=True); ap.add_argument("--jam"); ap.add_argument("--tag", default="")
    ap.add_argument("--go", action="store_true"); ap.add_argument("--paksa", action="store_true")
    a = ap.parse_args()
    conf = json.loads((ROOT / "brands.json").read_text())
    akun = next((x for x in conf["tiktok"] if x["username"] == a.akun), None)
    if not akun: sys.exit(f"Akun TikTok {a.akun} tidak ada di brands.json > tiktok")
    cap = Path(a.caption).read_text().strip()
    if conf["wa"] not in cap: sys.exit(f"Caption wajib memuat WA {conf['wa']}")
    if len(cap) > 2000: sys.exit("Caption TikTok terlalu panjang (maks 2000)")
    t = waktu(a.tanggal, a.jam or akun["jam"]); cek_slot(akun["accountId"], t, a.paksa)
    if a.video:
        f = Path(a.video); jenis, mime = "video", "video/mp4"
    elif a.png:
        f = ke_916(Path(a.png)); jenis, mime = "image", "image/jpeg"
    else:
        sys.exit("Isi --video (utama) atau --png (cadangan)")
    print(f"Rencana TikTok ({jenis}): @{a.akun} {t:%Y-%m-%d %H:%M} WIB | {f.name} {f.stat().st_size//1024}KB")
    if not a.go: print("(simulasi, tambahkan --go)"); return
    url = upload(f, mime)
    body = {"title": f"autofeed:{a.tag}"[:100] if a.tag else "", "description": cap, "type": jenis, "medias": [{"type": jenis, "url": url}],
            "additionalInfo": {"isDraft": False, "isAiGenerated": False}, "accountId": akun["accountId"], "scheduleAt": utc(t)}
    r = call("POST", "/public/schedule", body)
    print("✅ TikTok dijadwalkan:", a.akun, t.isoformat(), r.get("_id") or r)


if __name__ == "__main__":
    main()
