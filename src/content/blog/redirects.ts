// Keep these patterns shared with generation so duplicate/thin content stays archived.
const BRAND_DURATION_AREA = /^(sewa|rental)-(acer|laptop|macbook|redmibook|thinkpad|vivobook)-(3-hari|harian|mingguan|seminggu|bulanan|tahunan)-(jakarta|jakarta-selatan|jakarta-timur)$/;
const CITY_PERSONA = /^sewa-laptop-(bekasi|depok|tangerang|jakarta-barat|jakarta-pusat|jakarta-selatan|jakarta-timur|jakarta-utara)-(content-creator|developer|event-pameran|kerja-wfh|mahasiswa|ujian-online)$/;

export function isArchivedBlogSlug(slug: string): boolean {
  return BRAND_DURATION_AREA.test(slug) || CITY_PERSONA.test(slug);
}

export function getBlogRedirect(slug: string): string | null {
  const brandMatch = BRAND_DURATION_AREA.exec(slug);
  if (brandMatch) {
    const [, , brand, duration, area] = brandMatch;
    if (brand === "macbook") return "/sewa-macbook";
    if (duration === "harian" || duration === "3-hari") return "/sewa-laptop-harian-jakarta";
    if (area === "jakarta-selatan") return "/sewa-laptop-jakarta-selatan";
    if (area === "jakarta-timur") return "/sewa-laptop-jakarta-timur";
    return "/sewa-laptop-jakarta";
  }
  const cityMatch = CITY_PERSONA.exec(slug);
  if (cityMatch) return `/sewa-laptop-${cityMatch[1]}`;
  if (slug === "sewa-laptop-jakarta-40-ribu" || slug === "sewa-laptop-jakarta-49-ribu") {
    return "/blog/sewa-laptop-jakarta-murah";
  }
  return null;
}