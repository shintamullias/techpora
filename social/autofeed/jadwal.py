#!/usr/bin/env python3
"""Jadwalkan 1 feed (gambar) ke 1 akun Instagram lewat Repliz.

  python3 jadwal.py --akun sewalaptopbogor --png out/x.png --caption out/x.txt \
      --tanggal 2026-11-16 [--jam 10:00] [--tag hero:thinkpad] [--go]

Tanpa --go hanya simulasi (tidak upload, tidak menjadwalkan).
Menolak bila akun itu sudah punya jadwal (status apa pun) di tanggal yang sama (WIB), kecuali --paksa.
Kunci API Repliz disuntik proxy environment untuk api.repliz.com.
"""
import argparse, base64, datetime, json, os, sys, urllib.request, urllib.error
from pathlib import Path
from PIL import Image

BASE = "https://api.repliz.com"
ROOT = Path(__file__).resolve().parent
WIB = datetime.timezone(datetime.timedelta(hours=7))


def _auth():
    ak = os.environ.get("REPLIZ_ACCESS_KEY", "proxy-injected"); sk = os.environ.get("REPLIZ_SECRET_KEY", "proxy-injected")
    return "Basic " + base64.b64encode(f"{ak}:{sk}".encode()).decode()


def call(method, path, body=None):
    req = urllib.request.Request(BASE + path, method=method, data=json.dumps(body).encode() if body is not None else None,
                                 headers={"Authorization": _auth(), "Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(req, timeout=120) as r:
            return json.loads(r.read() or b"{}")
    except urllib.error.HTTPError as e:
        sys.exit(f"Repliz {method} {path} -> {e.code}: {e.read().decode()[:400]}")


def semua_jadwal():
    out, page = [], 1
    while True:
        d = call("GET", f"/public/schedule?page={page}&limit=100")
        out += d.get("docs", [])
        if page >= d.get("totalPages", 1): return out
        page += 1


def cek_slot(account_id, t, paksa=False):
    """Keluar bila akun sudah punya jadwal (selain failed/error) di tanggal WIB yang sama."""
    if t <= datetime.datetime.now(WIB) + datetime.timedelta(minutes=10): sys.exit(f"Waktu {t} sudah lewat / terlalu dekat")
    for s in semua_jadwal():
        if s.get("accountId") != account_id: continue
        st = datetime.datetime.fromisoformat(s["scheduleAt"].replace("Z", "+00:00")).astimezone(WIB)
        if st.date() == t.date() and s.get("status") not in ("failed", "error") and not paksa:
            sys.exit(f"Dilewati: akun {account_id} sudah punya jadwal {st:%Y-%m-%d %H:%M} WIB ({s.get('status')})")


def waktu(tanggal, jam):
    return datetime.datetime.fromisoformat(f"{tanggal}T{jam}:00").replace(tzinfo=WIB)


def utc(t):
    return t.astimezone(datetime.timezone.utc).isoformat().replace("+00:00", "Z")


def upload(path: Path, mime: str = "image/jpeg") -> str:
    init = call("POST", "/public/storage/file/init", {"filename": f"autofeed_{path.name}", "size": path.stat().st_size, "mimetype": mime})
    urllib.request.urlopen(urllib.request.Request(init["upload"], data=path.read_bytes(), method="PUT",
                                                  headers={"Content-Type": mime}), timeout=600).read()
    call("POST", f"/public/storage/file/{init['id']}/complete", {})
    return init["url"]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--akun", required=True); ap.add_argument("--png", required=True); ap.add_argument("--caption", required=True)
    ap.add_argument("--tanggal", required=True); ap.add_argument("--jam"); ap.add_argument("--tag", default="")
    ap.add_argument("--go", action="store_true"); ap.add_argument("--paksa", action="store_true")
    a = ap.parse_args()
    conf = json.loads((ROOT / "brands.json").read_text())
    akun = next((x for x in conf["akun"] if x["username"] == a.akun), None)
    if not akun: sys.exit(f"Akun {a.akun} tidak ada di brands.json")
    cap = Path(a.caption).read_text().strip()
    if conf["wa"] not in cap: sys.exit(f"Caption wajib memuat WA {conf['wa']}")
    if len(cap) > 2200: sys.exit("Caption > 2200 karakter (batas Instagram)")
    t = waktu(a.tanggal, a.jam or akun["jam"])
    cek_slot(akun["accountId"], t, a.paksa)
    jpg = Path(a.png).with_suffix(".jpg")
    Image.open(a.png).convert("RGB").save(jpg, quality=92, optimize=True)
    print(f"Rencana: @{a.akun} {t:%Y-%m-%d %H:%M} WIB | {jpg.name} {jpg.stat().st_size//1024}KB | tag={a.tag}")
    if not a.go:
        print("(simulasi, tambahkan --go untuk menjadwalkan)"); return
    url = upload(jpg)
    body = {"title": f"autofeed:{a.tag}"[:100], "description": cap, "type": "image", "medias": [{"type": "image", "url": url}],
            "additionalInfo": {"isDraft": False, "isAiGenerated": False},
            "accountId": akun["accountId"], "scheduleAt": utc(t)}
    r = call("POST", "/public/schedule", body)
    print("✅ Dijadwalkan:", a.akun, t.isoformat(), r.get("_id") or r.get("scheduleId") or r)


if __name__ == "__main__":
    main()
