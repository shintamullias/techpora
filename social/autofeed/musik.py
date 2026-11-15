#!/usr/bin/env python3
"""Musik orisinal 128 BPM gaya DJ remix untuk video TikTok (bebas hak cipta).
  python3 musik.py --beats 32 --drop 4 --seed 7 --out musik.wav
Struktur: intro tipis + snare roll (0..drop) -> drop penuh -> hit penutup 4 beat sebelum akhir.
"""
import argparse, numpy as np, soundfile as sf
ap = argparse.ArgumentParser(); ap.add_argument("--beats", type=float, required=True); ap.add_argument("--drop", type=float, default=4)
ap.add_argument("--seed", type=int, default=1); ap.add_argument("--out", required=True); a = ap.parse_args()
SR = 44100; B = 0.46875; NB = a.beats; N = int(SR * (NB * B + 1.5))
rng = np.random.default_rng(a.seed); L = np.zeros(N); R = np.zeros(N)
def t_(d): return np.arange(int(SR * d)) / SR
def at(b): return b * B
def add(sig, ts, g=1.0, pan=0.0):
    i = int(ts * SR); j = min(N, i + len(sig))
    if j > i: s = sig[:j - i] * g; L[i:j] += s * (1 - max(0, pan)); R[i:j] += s * (1 + min(0, pan))
def ma(x, k): return np.convolve(x, np.ones(k) / k, mode="same") if k > 1 else x
def note(m): return 440 * 2 ** ((m - 69) / 12)
def expd(n, r): return np.exp(-r * np.arange(n) / SR)
def kick(g=1.0):
    t = t_(.4); f = 45 + 160 * np.exp(-t * 38); s = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 7)
    return np.tanh(s * 2.2) * g
def clap():
    t = t_(.25); n = rng.standard_normal(len(t)); n = n - ma(n, 4); e = np.zeros(len(t))
    for o in (0, .008, .016): e += np.exp(-np.clip(t - o, 0, None) * 60) * (t >= o)
    return n * (e * .6 + np.exp(-t * 14) * .25)
def hat(op=False):
    d = .22 if op else .05; t = t_(d); n = rng.standard_normal(len(t)); n = n - ma(n, 2); return n * np.exp(-t * (14 if op else 80)) * .35
def snare():
    t = t_(.2); n = rng.standard_normal(len(t)); n = n - ma(n, 3); return n * np.exp(-t * 22) * .6 + np.sin(2 * np.pi * 190 * t) * np.exp(-t * 30) * .5
def saw(f, d): t = t_(d); return 2 * ((t * f) % 1) - 1
def ssaw(f, d, det=(-.12, -.05, 0, .05, .12)): return sum(saw(f * 2 ** (c / 12), d) for c in det) / len(det)
def stab(ch, d=.22, br=6): s = sum(ssaw(note(m), d) for m in ch) / len(ch); return ma(s, br) * expd(len(s), 9)
def sub(m, d, sl=None):
    t = t_(d); f = np.full(len(t), note(m))
    if sl is not None: f = note(m) + (note(sl) - note(m)) * np.exp(-t * 25)
    s = np.sin(2 * np.pi * np.cumsum(f) / SR); return np.tanh(s * 1.8) * np.minimum(1, t / .005) * np.minimum(1, (d - t) / .02)
def pluck(m, d=.2): s = ssaw(note(m), d, (-.06, 0, .06)); return ma(s, 3) * expd(len(s), 14)
def riser(d):
    t = t_(d); n = rng.standard_normal(len(t)); n = n - ma(n, 2); f = 300 + 3000 * (t / d) ** 2
    return (n * .5 + np.sin(2 * np.pi * np.cumsum(f) / SR) * .25) * (t / d) ** 2
def impact():
    t = t_(1.6); s = np.sin(2 * np.pi * (40 + 80 * np.exp(-t * 5)) * t) * np.exp(-t * 2.2); n = ma(rng.standard_normal(len(t)), 30) * np.exp(-t * 4)
    return np.tanh((s + n * 1.5) * 1.5)
PROG = [([[57,60,64],[53,57,60],[48,52,55],[55,59,62]],[33,29,36,31]),   # Am F C G
        ([[48,52,55],[55,59,62],[57,60,64],[53,57,60]],[36,31,33,29]),   # C G Am F
        ([[50,53,57],[46,50,53],[53,57,60],[48,52,55]],[38,34,41,36]),   # Dm Bb F C
        ([[52,55,59],[48,52,55],[55,59,62],[50,54,57]],[40,36,31,38])]   # Em C G D
HOOKS = [[76,74,72,74,76,79,76,74],[72,74,76,79,76,74,72,71],[74,77,76,74,72,74,76,77],[79,76,74,76,72,74,76,74]]
chords, roots = PROG[a.seed % 4]; hook = HOOKS[(a.seed // 4) % 4]
D = a.drop; END = NB - 4
for b in range(int(D)):
    for e in (0, .5): add(ma(pluck(hook[int((b % 4) * 2 + e * 2) % 8]), 10), at(b + e), .35)
    if b % 2 == 0: add(kick(.55), at(b))
for k, b in enumerate([D - 2, D - 1.5, D - 1, D - .75, D - .5, D - .375, D - .25, D - .125]): add(snare(), at(b), .3 + .05 * k)
add(riser(2 * B), at(D - 2), .4)
b = D
while b < END:
    bar = int((b - D) // 4); ch = chords[bar % 4]; rt = roots[bar % 4]; i = int((b - D) % 4) * 2
    add(kick(), at(b));  add(hat(True), at(b + .5), .8); add(hat(), at(b + .25), .5); add(hat(), at(b + .75), .5)
    if int(b - D) % 2 == 1: add(clap(), at(b), .9)
    add(sub(rt + 12, B * .45, sl=rt + 19 if int(b - D) % 4 == 0 else None), at(b + .5), .55); add(sub(rt, B * .3), at(b), .35)
    add(stab([m + 12 for m in ch]), at(b + .5), .28, -.3); add(stab([m + 12 for m in ch], br=4), at(b + .75), .18, .3)
    add(pluck(hook[i]), at(b), .3, .2); add(pluck(hook[i + 1]), at(b + .5), .26, -.2)
    b += 1
add(impact(), at(D), .7)
fin = sum(ssaw(note(m), 3.0) for m in [chords[0][0] - 12] + chords[0]) / 4; fin = ma(fin, 8) * expd(len(fin), 1.6)
add(fin, at(END), .5); add(kick(1.2), at(END)); add(impact(), at(END), .6)
mix = np.stack([L, R], 1); mix /= np.abs(mix).max() + 1e-9; mix = np.tanh(mix * 1.6) / np.tanh(1.6)
n = int(SR * NB * B); mix = mix[:n]; f = int(SR * .8); mix[-f:] *= np.linspace(1, 0, f)[:, None]
sf.write(a.out, mix * .9, SR); print("ok", a.out, n / SR)
