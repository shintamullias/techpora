// Data area layanan — konten unik per halaman untuk SEO lokal.
// Setiap area memiliki framing/urutan/highlight yang berbeda, bukan copy-paste.

export type AreaProduct = {
  name: string;
  category: "Laptop" | "Printer" | "Proyektor";
  specs?: string;
  daily: string;
  weekly: string;
  monthly: string;
  featured?: boolean;
};

export type AreaData = {
  slug: string; // full URL path, e.g. "sewa-laptop-jakarta-selatan"
  area: string; // "Jakarta Selatan"
  areaShort: string; // "Jaksel"
  title: string;
  metaDescription: string;
  keywords: string;
  h1: string;
  intro: string; // 2–3 paragraf unik
  highlights: { title: string; desc: string }[]; // 3–4 poin lokal
  landmarks: string[]; // kawasan/kampus/kantor yang biasa dilayani
  units: AreaProduct[]; // subset unit yang paling relevan
  eta: string; // estimasi pengiriman
  useCases: string[]; // 3-4 use case dominan di area itu
};

const laptops: Record<string, AreaProduct> = {
  thinkpad: { name: "Lenovo ThinkPad", category: "Laptop", specs: "i3 · 8GB · SSD 256GB", daily: "Rp100.000", weekly: "Rp650.000", monthly: "Rp1.500.000" },
  vivobook: { name: "ASUS VivoBook", category: "Laptop", specs: "i3 · 8GB · SSD 256GB", daily: "Rp135.000", weekly: "Rp850.000", monthly: "Rp2.000.000" },
  redmibook: { name: "RedmiBook 15", category: "Laptop", specs: "i3 · 8GB · SSD 256GB", daily: "Rp135.000", weekly: "Rp850.000", monthly: "Rp2.000.000" },
  acer: { name: "Acer Aspire 5", category: "Laptop", specs: "i5 · 8GB · SSD 256GB", daily: "Rp175.000", weekly: "Rp1.100.000", monthly: "Rp3.000.000" },
  macbook: { name: "MacBook Air M1", category: "Laptop", specs: "M1 · 8GB · SSD 256GB", daily: "Rp250.000", weekly: "Rp1.500.000", monthly: "Rp4.500.000", featured: true },
  epsonPrinter: { name: "Epson L3210", category: "Printer", specs: "Print · Scan · Copy", daily: "Rp100.000", weekly: "Rp500.000", monthly: "Rp1.500.000" },
  hpPrinter: { name: "HP Smart Tank 215", category: "Printer", specs: "Print · Scan · Copy", daily: "Rp125.000", weekly: "Rp650.000", monthly: "Rp2.000.000" },
  viewsonic: { name: "ViewSonic SP3", category: "Proyektor", specs: "Portable · HD", daily: "Rp150.000", weekly: "Rp850.000", monthly: "Rp2.500.000" },
  epsonProj: { name: "Epson EB-E600", category: "Proyektor", specs: "3LCD · 3500 Lumens", daily: "Rp200.000", weekly: "Rp1.200.000", monthly: "Rp3.500.000" },
};

export const areas: AreaData[] = [
  {
    slug: "sewa-laptop-jakarta-selatan",
    area: "Jakarta Selatan",
    areaShort: "Jaksel",
    title: "Sewa Laptop Jakarta Selatan — MacBook & i5 Ready | Techpora",
    metaDescription:
      "Sewa laptop Jakarta Selatan harian, mingguan, bulanan. MacBook, ThinkPad, VivoBook siap kirim ke Kemang, Senayan, Pondok Indah, TB Simatupang. Fast response WA.",
    keywords: "sewa laptop jakarta selatan, rental laptop jaksel, sewa macbook jakarta selatan, sewa laptop kemang, sewa laptop senayan, sewa laptop pondok indah",
    h1: "Sewa Laptop Jakarta Selatan — Techpora",
    intro:
      "Butuh sewa laptop di area Jakarta Selatan? Techpora melayani pengiriman laptop, printer, dan proyektor ke kawasan Kemang, Senayan, SCBD, Pondok Indah, Cilandak, hingga TB Simatupang. Cocok untuk startup di co-working, meeting di kantor Sudirman-Senayan, atau kebutuhan pribadi mahasiswa area Blok M dan sekitarnya. Unit yang paling dicari di Jaksel: MacBook Air M1 dan Acer Aspire 5 (i5) — banyak dipakai untuk kerja remote dan presentasi klien.",
    highlights: [
      { title: "Cepat ke SCBD & Sudirman", desc: "Pengiriman kilat ke gedung perkantoran di sekitar Sudirman, SCBD, dan Senayan." },
      { title: "Bulanan Favorit di Jaksel", desc: "Sewa bulanan MacBook & i5 populer untuk freelancer dan pekerja hybrid di area co-working Kemang." },
      { title: "Unit Premium Ready", desc: "MacBook Air M1 stok banyak — cocok untuk meeting klien tanpa khawatir tampilan." },
    ],
    landmarks: ["Kemang", "Senayan", "SCBD", "Sudirman", "Pondok Indah", "Cilandak", "TB Simatupang", "Blok M", "Fatmawati"],
    eta: "Estimasi tiba 1–3 jam sesuai jarak dari Rawamangun.",
    useCases: [
      "Kerja remote / hybrid di co-working Kemang & SCBD",
      "Presentasi klien di kantor Sudirman-Senayan",
      "Mahasiswa Universitas Pancasila, Al-Azhar, London School",
      "Event / seminar di hotel kawasan Senayan & Kuningan",
    ],
    units: [laptops.macbook, laptops.acer, laptops.vivobook, laptops.thinkpad, laptops.epsonProj],
  },
  {
    slug: "sewa-laptop-jakarta-timur",
    area: "Jakarta Timur",
    areaShort: "Jaktim",
    title: "Sewa Laptop Jakarta Timur — Ambil Langsung di Rawamangun | Techpora",
    metaDescription:
      "Sewa laptop Jakarta Timur — basis operasional Techpora di Rawamangun. Bisa ambil langsung tanpa ongkir. Melayani Cawang, Cakung, Pulogadung, Duren Sawit.",
    keywords: "sewa laptop jakarta timur, rental laptop jaktim, sewa laptop rawamangun, sewa laptop cakung, sewa laptop pulogadung, sewa laptop duren sawit",
    h1: "Sewa Laptop Jakarta Timur — Techpora",
    intro:
      "Techpora berbasis di Rawamangun, Jakarta Timur — jadi pengambilan langsung di sini paling praktis dan tanpa ongkir. Kami rutin melayani area Rawamangun, Cawang, Cakung, Pulogadung, Duren Sawit, Kampung Melayu, hingga Jatinegara. Banyak mahasiswa UNJ, UKI, dan STIE Trisakti yang sewa harian untuk sidang dan tugas kuliah — dan kantor-kantor di Kawasan Industri Pulogadung sewa mingguan untuk kebutuhan staff temporary.",
    highlights: [
      { title: "Ambil Sendiri di Rawamangun", desc: "Hemat ongkir. Alamat toko: Jl. R. Mangun Muka Raya, siap sambut kapan pun jam operasional." },
      { title: "Dekat Kampus UNJ", desc: "Mahasiswa UNJ tinggal jalan kaki. Sewa harian ThinkPad & VivoBook paling laris untuk skripsi." },
      { title: "Kirim Kilat", desc: "Pengiriman ke area Jaktim biasanya di bawah 1 jam." },
    ],
    landmarks: ["Rawamangun", "Cawang", "Cakung", "Pulogadung", "Duren Sawit", "Kampung Melayu", "Jatinegara", "UNJ", "UKI Cawang"],
    eta: "Ambil sendiri di Rawamangun (0 ongkir) atau kirim < 1 jam.",
    useCases: [
      "Sidang & skripsi mahasiswa UNJ, UKI, STIE Trisakti",
      "Kantor Kawasan Industri Pulogadung (staff temporary)",
      "Event kecil-menengah di venue Jaktim",
      "Kebutuhan harian keluarga (belajar anak, kerja WFH)",
    ],
    units: [laptops.thinkpad, laptops.vivobook, laptops.redmibook, laptops.acer, laptops.epsonPrinter],
  },
  {
    slug: "sewa-laptop-jakarta-barat",
    area: "Jakarta Barat",
    areaShort: "Jakbar",
    title: "Sewa Laptop Jakarta Barat — Grogol, Puri, Kalideres | Techpora",
    metaDescription:
      "Sewa laptop Jakarta Barat harian & bulanan. Kirim ke Grogol, Kebon Jeruk, Puri Indah, Kalideres, Taman Anggrek. Cocok untuk mahasiswa Untar, Binus, Trisakti.",
    keywords: "sewa laptop jakarta barat, rental laptop jakbar, sewa laptop grogol, sewa laptop puri indah, sewa laptop binus, sewa laptop untar",
    h1: "Sewa Laptop Jakarta Barat — Techpora",
    intro:
      "Untuk area Jakarta Barat, Techpora menjangkau Grogol, Kebon Jeruk, Puri Indah, Kalideres, Taman Anggrek, hingga Meruya. Area ini punya banyak permintaan dari mahasiswa Untar, Binus, dan Trisakti untuk sewa bulanan — jauh lebih hemat dari beli laptop baru. Selain itu, banyak agency dan startup kecil di area Green Ville-Kebon Jeruk yang sewa 3–5 unit untuk staff proyek jangka pendek.",
    highlights: [
      { title: "Sewa Bulanan Hemat", desc: "Mahasiswa Binus/Untar/Trisakti banyak yang ambil paket bulanan untuk semesteran." },
      { title: "Bundle untuk Agency", desc: "Sewa 3–5 unit sekaligus untuk tim proyek jangka pendek — harga bisa dibicarakan." },
      { title: "Kirim ke Mall Area", desc: "Pengiriman ke tenant di Taman Anggrek, Central Park, atau Puri Indah Mall bisa diatur." },
    ],
    landmarks: ["Grogol", "Kebon Jeruk", "Puri Indah", "Kalideres", "Taman Anggrek", "Central Park", "Meruya", "Green Ville"],
    eta: "Estimasi pengiriman 2–4 jam ke area Jakarta Barat.",
    useCases: [
      "Mahasiswa Untar, Binus, Trisakti — sewa semesteran",
      "Startup / agency Kebon Jeruk — tim proyek",
      "Kerja freelance di co-working area Puri",
      "Kebutuhan tenant mall (event booth, launching)",
    ],
    units: [laptops.vivobook, laptops.redmibook, laptops.thinkpad, laptops.macbook, laptops.viewsonic],
  },
  {
    slug: "sewa-laptop-jakarta-utara",
    area: "Jakarta Utara",
    areaShort: "Jakut",
    title: "Sewa Laptop Jakarta Utara — PIK, Kelapa Gading, Ancol | Techpora",
    metaDescription:
      "Sewa laptop Jakarta Utara untuk event MICE, pameran, dan kantor. Kirim ke PIK, Kelapa Gading, Sunter, Ancol, Pluit. Paket bulk untuk event tersedia.",
    keywords: "sewa laptop jakarta utara, rental laptop jakut, sewa laptop kelapa gading, sewa laptop pik, sewa laptop pluit, sewa laptop event ancol",
    h1: "Sewa Laptop Jakarta Utara — Techpora",
    intro:
      "Jakarta Utara adalah kawasan MICE (Meeting, Incentive, Convention, Exhibition) — dan Techpora sudah biasa melayani sewa laptop volume banyak untuk event di JIExpo Kemayoran, Ancol, hingga PIK. Selain itu, kami juga sering kirim unit ke perkantoran di Sunter, Kelapa Gading, dan Pluit untuk kebutuhan training staff atau replace laptop rusak dadakan.",
    highlights: [
      { title: "Ready untuk Event Besar", desc: "Sewa 20–50+ unit sekaligus untuk registrasi event, booth, dan pameran di JIExpo/Ancol." },
      { title: "Antar-Jemput di Venue", desc: "Tim kami antar sekaligus jemput di lokasi acara, hemat waktu panitia." },
      { title: "Unit Seragam", desc: "Untuk event, semua unit spek seragam — tampilan booth rapi dan profesional." },
    ],
    landmarks: ["Kelapa Gading", "Sunter", "PIK", "Pluit", "Ancol", "JIExpo Kemayoran", "Muara Karang"],
    eta: "Pengiriman event bisa dijadwalkan H-1. Standar 2–3 jam.",
    useCases: [
      "Event & pameran di JIExpo, Ancol, ICE PIK",
      "Training kantor di Sunter & Kelapa Gading",
      "Booth registrasi (bulk 20–50 unit)",
      "Replace laptop rusak dadakan di kantor Pluit",
    ],
    units: [laptops.vivobook, laptops.thinkpad, laptops.redmibook, laptops.acer, laptops.epsonProj, laptops.viewsonic],
  },
  {
    slug: "sewa-laptop-jakarta-pusat",
    area: "Jakarta Pusat",
    areaShort: "Jakpus",
    title: "Sewa Laptop Jakarta Pusat — Sudirman, Thamrin, Menteng | Techpora",
    metaDescription:
      "Sewa laptop Jakarta Pusat untuk kantor Sudirman-Thamrin, hotel Menteng, dan venue seminar Kemayoran. Fast response, unit siap pakai, invoice tersedia.",
    keywords: "sewa laptop jakarta pusat, rental laptop jakpus, sewa laptop sudirman, sewa laptop thamrin, sewa laptop menteng, sewa laptop kemayoran",
    h1: "Sewa Laptop Jakarta Pusat — Techpora",
    intro:
      "Jakarta Pusat adalah jantung perkantoran & venue seminar Jakarta. Techpora rutin melayani sewa laptop untuk kantor pusat perusahaan di Sudirman-Thamrin, seminar di hotel kawasan Menteng, hingga event di kawasan Kemayoran. Kalau butuh invoice untuk klaim ke kantor, tinggal request — kami siapkan dokumen sesuai kebutuhan corporate.",
    highlights: [
      { title: "Invoice Corporate", desc: "Butuh dokumen untuk reimburse kantor? Kami siapkan invoice resmi." },
      { title: "Meeting-Ready", desc: "MacBook Air & Acer i5 populer untuk presentasi ke direksi & klien." },
      { title: "Cepat ke Hotel", desc: "Kirim langsung ke concierge hotel Menteng/Thamrin untuk speaker seminar." },
    ],
    landmarks: ["Sudirman", "Thamrin", "Menteng", "Kemayoran", "Cikini", "Tanah Abang", "Senen"],
    eta: "Estimasi tiba 1–3 jam ke area perkantoran Jakpus.",
    useCases: [
      "Kantor pusat Sudirman-Thamrin (staff & meeting)",
      "Speaker seminar di hotel Menteng",
      "Event conference di JCC & Balai Kartini",
      "Media & agency kawasan Kebon Sirih",
    ],
    units: [laptops.macbook, laptops.acer, laptops.vivobook, laptops.thinkpad, laptops.epsonProj],
  },
  {
    slug: "sewa-laptop-tangerang",
    area: "Tangerang",
    areaShort: "Tangerang",
    title: "Sewa Laptop Tangerang — BSD, Alam Sutera, Karawaci | Techpora",
    metaDescription:
      "Sewa laptop Tangerang harian & bulanan. Kirim ke BSD, Alam Sutera, Karawaci, Gading Serpong, Bintaro. Cocok untuk mahasiswa Prasmul, UMN, SGU.",
    keywords: "sewa laptop tangerang, rental laptop bsd, sewa laptop alam sutera, sewa laptop karawaci, sewa laptop umn, sewa laptop prasmul",
    h1: "Sewa Laptop Tangerang — Techpora",
    intro:
      "Kawasan Tangerang (BSD, Alam Sutera, Karawaci, Gading Serpong, Bintaro) berkembang pesat sebagai hub pendidikan & tech startup. Techpora melayani mahasiswa Prasmul, UMN, SGU, hingga Binus BSD yang butuh sewa laptop bulanan untuk kuliah — dan startup di The Breeze / QBig BSD yang butuh unit tambahan untuk hackathon atau bootcamp.",
    highlights: [
      { title: "Favorit Mahasiswa BSD", desc: "Sewa bulanan Acer Aspire 5 & VivoBook untuk mahasiswa UMN, Prasmul, SGU." },
      { title: "Tech Startup Friendly", desc: "Startup di The Breeze BSD sering sewa 5–10 unit untuk sprint/bootcamp." },
      { title: "Free Shipping Bulanan", desc: "Sewa minimal mingguan ke Tangerang gratis ongkir." },
    ],
    landmarks: ["BSD", "Alam Sutera", "Karawaci", "Gading Serpong", "Bintaro", "The Breeze", "QBig", "UMN", "Prasmul"],
    eta: "Pengiriman ke Tangerang biasanya 2–4 jam.",
    useCases: [
      "Mahasiswa UMN, Prasmul, SGU, Binus BSD",
      "Tech startup — sprint & hackathon",
      "Bootcamp coding di co-working BSD",
      "Kantor kawasan Karawaci Office Park",
    ],
    units: [laptops.acer, laptops.vivobook, laptops.macbook, laptops.thinkpad, laptops.epsonProj],
  },
  {
    slug: "sewa-laptop-bekasi",
    area: "Bekasi",
    areaShort: "Bekasi",
    title: "Sewa Laptop Bekasi — Summarecon, Harapan Indah | Techpora",
    metaDescription:
      "Sewa laptop Bekasi untuk training kantor & kebutuhan bulanan. Kirim ke Bekasi Kota, Summarecon, Harapan Indah, Grand Galaxy. Fast response WhatsApp.",
    keywords: "sewa laptop bekasi, rental laptop bekasi, sewa laptop summarecon bekasi, sewa laptop harapan indah, sewa laptop training bekasi",
    h1: "Sewa Laptop Bekasi — Techpora",
    intro:
      "Bekasi banyak dihuni pekerja pabrik & kantor kawasan industri (MM2100, Jababeka, Cikarang) — dan Techpora rutin melayani sewa laptop untuk training staff HRD, sertifikasi ISO, hingga audit tahunan. Untuk warga Summarecon Bekasi, Harapan Indah, dan Grand Galaxy, sewa harian juga banyak untuk kebutuhan freelance & anak kuliah remote.",
    highlights: [
      { title: "Training HRD & Audit", desc: "Sewa 10–30 unit untuk training staff perusahaan kawasan industri Bekasi." },
      { title: "Pengiriman Cikarang", desc: "Melayani hingga Cikarang & MM2100 dengan jadwal H-1." },
      { title: "Paket Bulanan Populer", desc: "Warga Summarecon & Harapan Indah banyak ambil bulanan untuk WFH." },
    ],
    landmarks: ["Bekasi Kota", "Summarecon Bekasi", "Harapan Indah", "Grand Galaxy", "Kemang Pratama", "Jababeka", "Cikarang", "MM2100"],
    eta: "Estimasi pengiriman 3–5 jam. Untuk Cikarang bisa dijadwalkan H-1.",
    useCases: [
      "Training kantor kawasan industri (MM2100, Jababeka)",
      "Audit tahunan & sertifikasi ISO",
      "Warga Summarecon/Harapan Indah untuk WFH",
      "Mahasiswa Kalbis, Bina Nusantara Bekasi",
    ],
    units: [laptops.thinkpad, laptops.vivobook, laptops.acer, laptops.redmibook, laptops.epsonPrinter],
  },
  {
    slug: "sewa-laptop-depok",
    area: "Depok",
    areaShort: "Depok",
    title: "Sewa Laptop Depok — Margonda, UI, Cinere | Techpora",
    metaDescription:
      "Sewa laptop Depok untuk mahasiswa UI, Gunadarma, dan kebutuhan skripsi. Harian & bulanan. Kirim ke Margonda, Beji, Cinere, Cimanggis, Sawangan.",
    keywords: "sewa laptop depok, rental laptop depok, sewa laptop margonda, sewa laptop ui, sewa laptop skripsi depok, sewa laptop gunadarma",
    h1: "Sewa Laptop Depok — Techpora",
    intro:
      "Depok adalah kota mahasiswa — dan Techpora sudah lama jadi andalan mahasiswa UI, Gunadarma, dan Politeknik Negeri Jakarta untuk sewa laptop skripsi, sidang, dan tugas akhir. Yang paling laris di sini: sewa bulanan ASUS VivoBook / Acer Aspire 5 untuk 1–3 bulan menuju wisuda. Kami juga melayani area Beji, Cinere, Cimanggis, hingga Sawangan.",
    highlights: [
      { title: "#1 untuk Skripsi", desc: "Paket bulanan i5 laris untuk mahasiswa yang lagi ngerjain revisi & sidang." },
      { title: "Antar ke Kos Margonda", desc: "Kirim langsung ke kos-kosan sekitar UI & Gunadarma." },
      { title: "Refund Cepat", desc: "Selesai sidang, unit tinggal dibalikin — jaminan diproses cepat." },
    ],
    landmarks: ["Margonda", "UI Depok", "Gunadarma", "Beji", "Cinere", "Cimanggis", "Sawangan", "PNJ"],
    eta: "Pengiriman ke Depok 2–4 jam. Bisa antar langsung ke kos.",
    useCases: [
      "Mahasiswa UI, Gunadarma, PNJ — skripsi & sidang",
      "Tugas akhir & TA (bulanan)",
      "Anak SMA les online (harian/mingguan)",
      "Freelance mahasiswa Depok",
    ],
    units: [laptops.vivobook, laptops.acer, laptops.thinkpad, laptops.redmibook, laptops.macbook],
  },
];

export const areaBySlug = (slug: string) => areas.find((a) => a.slug === slug);
