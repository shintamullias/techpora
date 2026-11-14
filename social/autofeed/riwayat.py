#!/usr/bin/env python3
"""Riwayat & slot kosong 7 hari ke depan untuk semua akun di brands.json (Instagram, TikTok, Threads).
  python3 riwayat.py
"""
import datetime, json
from jadwal import semua_jadwal, WIB, ROOT
conf = json.loads((ROOT / "brands.json").read_text())
S = semua_jadwal(); now = datetime.datetime.now(WIB)
for platform, daftar in (("INSTAGRAM", conf["akun"]), ("TIKTOK", conf.get("tiktok", [])), ("THREADS", conf.get("threads", []))):
    print(f"===== {platform}")
    for a in daftar:
        mine = sorted([s for s in S if s.get("accountId") == a["accountId"]], key=lambda s: s["scheduleAt"])
        hari = {datetime.datetime.fromisoformat(s["scheduleAt"].replace("Z", "+00:00")).astimezone(WIB).date() for s in mine if s.get("status") not in ("failed", "error")}
        kosong = [(now.date() + datetime.timedelta(days=i)).isoformat() for i in range(1, 8) if now.date() + datetime.timedelta(days=i) not in hari]
        print(f"@{a['username']} ({a['brand']}, {a['kota']}, jam {a['jam']}) | kosong: {kosong}")
        if platform == "INSTAGRAM":
            print("   layout terakhir:", [(s["scheduleAt"][:10], s["title"].replace("autofeed:", "")) for s in mine if (s.get("title") or "").startswith("autofeed:")][-6:])
        else:
            print("   teks terakhir:", [(s["scheduleAt"][:10], (s.get("description") or "")[:70].replace("\n", " ")) for s in mine][-5:])
        gagal = [(s["scheduleAt"][:16], s.get("errorMessage")) for s in mine if s.get("status") in ("failed", "error")][-3:]
        if gagal: print("   GAGAL:", gagal)
