// node render_video.js <spec.json>  -> <spec>.mp4 (1080x1920, 30fps, musik orisinal)
// spec: {"akun":"<username TikTok>","pilar":"evergreen|sales|seo","seed":3,"scenes":[{"tipe":"hook|cari|poin|harga|list|banding|cta","beats":8,...}]}
const { chromium } = require('playwright'); const { spawnSync, spawn } = require('child_process');
const path = require('path'); const fs = require('fs');
(async () => {
  const f = process.argv[2]; const spec = JSON.parse(fs.readFileSync(f, 'utf8'));
  const conf = JSON.parse(fs.readFileSync(path.join(__dirname, 'brands.json'), 'utf8'));
  const a = conf.tiktok.find(x => x.username === spec.akun); if (!a) { console.error('akun TikTok tidak dikenal'); process.exit(1); }
  const ig = conf.akun.find(x => x.username === a.sumberIG) || {};
  const B = { ...ig, ...a, wa: conf.wa, tema: conf.tema[a.brand], logoDark: ig.logoDark, logoVidH: a.logoVidH, logoWmH: a.logoWmH };
  const beats = spec.scenes.reduce((s, x) => s + (x.beats || 8), 0);
  const base = f.replace(/\.json$/, ''); const wav = base + '_musik.wav';
  const m = spawnSync('python3', [path.join(__dirname, 'musik.py'), '--beats', String(beats), '--drop', String(spec.dropBeat || 4), '--seed', String(spec.seed || 1), '--out', wav], { stdio: 'inherit' });
  if (m.status) process.exit(1);
  const br = await chromium.launch(); const p = await br.newPage({ viewport: { width: 1080, height: 1920 } });
  await p.goto('file://' + path.join(__dirname, 'video.html'));
  const dur = await p.evaluate(([s, b]) => window.render(s, b), [spec, B]);
  const FPS = 30, frames = Math.round(dur * FPS);
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-', '-i', wav,
    '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-preset', 'medium', '-crf', '20', '-c:a', 'aac', '-b:a', '192k', '-af', 'loudnorm=I=-14:TP=-1.5',
    '-shortest', '-movflags', '+faststart', base + '.mp4'], { stdio: ['pipe', 'inherit', 'inherit'] });
  const shots = {};
  for (let i = 0; i < frames; i++) {
    await p.evaluate(t => window.seek(t), i / FPS);
    const buf = await p.screenshot({ type: 'jpeg', quality: 90 });
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
  }
  ff.stdin.end(); await new Promise(r => ff.on('close', r));
  // kontak-sheet 1 frame per adegan (untuk cek mandiri)
  let b0 = 0; const outs = [];
  for (const [k, s] of spec.scenes.entries()) { const t = (b0 + (s.beats || 8) - 0.6) * 0.46875; await p.evaluate(t => window.seek(t), t);
    const o = `${base}_cek${k}.jpg`; await p.screenshot({ path: o, type: 'jpeg', quality: 70 }); outs.push(o); b0 += s.beats || 8; }
  await br.close();
  spawnSync('python3', ['-c', `import sys\nfrom PIL import Image\nfs=sys.argv[2:];ims=[Image.open(x).resize((270,480)) for x in fs]\ng=Image.new('RGB',(280*len(ims),480),'white')\nfor i,im in enumerate(ims): g.paste(im,(i*280,0))\ng.save(sys.argv[1],quality=80)`, base + '_cek.jpg', ...outs]);
  outs.forEach(o => fs.unlinkSync(o));
  console.log('OK', base + '.mp4', dur.toFixed(2) + 's', '| cek:', base + '_cek.jpg');
})();
