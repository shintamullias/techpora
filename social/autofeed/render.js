// node render.js <spec.json> [<spec2.json> ...]   -> PNG di sebelah file spec (nama sama, .png)
// spec: {"akun":"<username>","layout":"hero|produk|pricelist|persona|siapkerja|hariini|angka|tips|kenapa", ...}
const { chromium } = require('playwright'); const path = require('path'); const fs = require('fs');
(async () => {
  const conf = JSON.parse(fs.readFileSync(path.join(__dirname, 'brands.json'), 'utf8'));
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1350 } });
  await p.goto('file://' + path.join(__dirname, 'engine.html'));
  for (const f of process.argv.slice(2)) {
    const S = JSON.parse(fs.readFileSync(f, 'utf8'));
    const a = conf.akun.find(x => x.username === S.akun); if (!a) { console.error('akun tidak dikenal:', S.akun); process.exitCode = 1; continue; }
    const B = { ...a, wa: conf.wa, tema: conf.tema[a.brand], fitur: conf.fitur_default };
    if (S.layout === 'pricelist' && !S.tabel) S.tabel = Object.entries(conf.harga).map(([n, v]) => [v[0], n, v[1].split(' · ').slice(0, 2).join(' · '), v[2], v[3], v[4]]);
    S.seed = S.seed || [...(S.akun + S.layout + (S.judul || []).join(''))].reduce((s, c) => s + c.charCodeAt(0), 0);
    await p.evaluate(([S, B]) => window.render(S, B), [S, B]);
    await p.waitForTimeout(150);
    const out = f.replace(/\.json$/, '.png');
    await (await p.$('#post')).screenshot({ path: out });
    console.log('OK', out);
  }
  await b.close();
})();
