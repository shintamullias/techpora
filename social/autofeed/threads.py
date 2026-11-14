#!/usr/bin/env python3
"""Jadwalkan postingan PERCAKAPAN Threads (teks + balasan berantai) untuk akun di brands.json > threads.

  python3 threads.py out/<tgl>/threads.json --tanggal 2026-11-16 [--go]
threads.json: {"<username>": {"utama": "...", "balasan": ["...", "..."]}, ...}

Aturan: utama & tiap balasan maks 480 karakter; 1-3 balasan; WA 0821-7798-4041 hanya di balasan terakhir;
tanpa hashtag dan tanpa link; teks tiap akun BERBEDA.
"""
import argparse, json, sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent))
from jadwal import call, cek_slot, waktu, utc, ROOT


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("file"); ap.add_argument("--tanggal", required=True)
    ap.add_argument("--go", action="store_true"); ap.add_argument("--paksa", action="store_true")
    a = ap.parse_args()
    conf = json.loads((ROOT / "brands.json").read_text()); data = json.loads(Path(a.file).read_text())
    teks_semua = set()
    for u, d in data.items():
        akun = next((x for x in conf["threads"] if x["username"] == u), None)
        if not akun: print(f"⚠️  {u} tidak ada di brands.json > threads, dilewati"); continue
        bagian = [d["utama"]] + d.get("balasan", [])
        if not 1 <= len(d.get("balasan", [])) <= 3: sys.exit(f"{u}: balasan harus 1-3")
        for x in bagian:
            if len(x) > 480: sys.exit(f"{u}: teks {len(x)} karakter (> 480)")
            if "#" in x or "http" in x: sys.exit(f"{u}: jangan pakai hashtag/link di Threads")
        if conf["wa"] not in bagian[-1] or any(conf["wa"] in x for x in bagian[:-1]): sys.exit(f"{u}: WA hanya di balasan terakhir")
        if d["utama"] in teks_semua: sys.exit(f"{u}: teks utama sama dengan akun lain")
        teks_semua.add(d["utama"])
        t = waktu(a.tanggal, akun["jam"])
        try: cek_slot(akun["accountId"], t, a.paksa)
        except SystemExit as e: print(f"⚠️  {u}: {e}"); continue
        print(f"Rencana Threads: @{u} {t:%Y-%m-%d %H:%M} WIB | {len(bagian)} bagian")
        if not a.go: continue
        rep = [{"title": "", "description": x, "topic": "", "type": "text", "medias": []} for x in d["balasan"]]
        body = {"title": "", "description": d["utama"], "topic": "", "type": "text", "medias": [], "replies": rep,
                "additionalInfo": {"isDraft": False, "isAiGenerated": False}, "accountId": akun["accountId"], "scheduleAt": utc(t)}
        r = call("POST", "/public/schedule", body)
        print("✅ Threads dijadwalkan:", u, r.get("_id") or r)
    if not a.go: print("(simulasi, tambahkan --go)")


if __name__ == "__main__":
    main()
