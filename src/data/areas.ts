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
  hp14s: { name: "HP 14s", category: "Laptop", specs: "AMD A9 · 8GB · SSD 512GB + HDD 1TB", daily: "Rp79.000", weekly: "Rp450.000", monthly: "Rp1.400.000", featured: true },
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
    title: "Sewa & Rental Laptop Jakarta Timur — Murah, Cepat",
    metaDescription:
      "Solusi rental laptop murah dan cepat di Jakarta Timur. Basis di Rawamangun, ambil langsung tanpa ongkir atau kirim <1 jam. Mulai Rp79rb, tanpa deposit.",
    keywords: "sewa laptop jakarta timur, rental laptop jakarta timur, solusi rental laptop murah dan cepat, sewa laptop rawamangun, rental laptop jaktim, sewa laptop cakung, sewa laptop pulogadung, sewa laptop duren sawit",
    h1: "Sewa & Rental Laptop Jakarta Timur",
    intro:
      "Techpora adalah solusi rental laptop murah dan cepat untuk warga Jakarta Timur. Kami berbasis di Rawamangun, jadi pengambilan langsung di sini paling praktis dan tanpa ongkir. Kami rutin melayani area Rawamangun, Cawang, Cakung, Pulogadung, Duren Sawit, Kampung Melayu, hingga Jatinegara. Banyak mahasiswa UNJ, UKI, dan STIE Trisakti yang sewa harian untuk sidang dan tugas kuliah — dan kantor-kantor di Kawasan Industri Pulogadung sewa mingguan untuk kebutuhan staff temporary.",
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
    units: [laptops.hp14s, laptops.thinkpad, laptops.vivobook, laptops.redmibook, laptops.acer, laptops.epsonPrinter],
  },
  {
    slug: "sewa-laptop-jakarta-barat",
    area: "Jakarta Barat",
    areaShort: "Jakbar",
    title: "Sewa Laptop Jakarta Barat — Grogol & Puri | Techpora",
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
    title: "Sewa Laptop Jakarta Utara — PIK & Kelapa Gading | Techpora",
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
    title: "Sewa Laptop Jakarta Pusat — Sudirman & Thamrin | Techpora",
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
    title: "Sewa Laptop Tangerang — BSD & Alam Sutera | Techpora",
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
  {
    slug: "sewa-laptop-rawamangun",
    area: "Rawamangun",
    areaShort: "Rawamangun",
    title: "Sewa & Rental Laptop Rawamangun — Ambil Langsung",
    metaDescription:
      "Sewa & rental laptop Rawamangun, Jakarta Timur. Basis toko di Jl. R. Mangun Muka Raya — ambil langsung tanpa ongkir, mulai Rp79rb/hari, tanpa deposit.",
    keywords: "sewa laptop rawamangun, rental laptop rawamangun, sewa laptop dekat unj, rental laptop pulogadung, sewa laptop jakarta timur, sewa laptop harian rawamangun",
    h1: "Sewa & Rental Laptop di Rawamangun",
    intro:
      "Rawamangun adalah rumah Techpora. Toko kami ada di Jl. R. Mangun Muka Raya, jadi buat warga Rawamangun ini sewa laptop paling dekat yang bisa diambil langsung tanpa ongkir sepeser pun. Tidak perlu menunggu pengiriman, tidak perlu menyeberang kota — cukup mampir, cek unitnya sendiri, dan bawa pulang hari itu juga. Kawasan ini padat kampus dan kantor: mahasiswa UNJ yang kosnya di sekitar Pemuda dan Balai Pustaka sering sewa harian untuk sidang, sementara kantor di Kawasan Industri Pulogadung yang bersebelahan kerap sewa mingguan untuk staff tambahan. Karena kami benar-benar berada di sini, respons dan serah terimanya jauh lebih cepat dibanding penyedia yang basisnya di luar Jakarta Timur.",
    highlights: [
      { title: "Toko di Rawamangun", desc: "Jl. R. Mangun Muka Raya. Ambil langsung, nol ongkir, cek unit di tempat sebelum bawa pulang." },
      { title: "Jalan Kaki dari Kos UNJ", desc: "Mahasiswa di sekitar Pemuda, Balai Pustaka, dan Pramuka tinggal jalan kaki atau sekali naik ojek." },
      { title: "Buka Sampai Malam", desc: "Laptop bermasalah menjelang sidang besok pagi? Chat malam ini, unit bisa siap." },
    ],
    landmarks: ["Jl. Pemuda", "Balai Pustaka", "Jl. Pramuka", "Arion Mall", "UNJ", "Velodrome Rawamangun", "Kawasan Industri Pulogadung", "Sunan Giri"],
    eta: "Ambil sendiri di toko (0 ongkir) atau kirim ke sekitar Rawamangun dalam hitungan menit.",
    useCases: [
      "Mahasiswa UNJ untuk sidang skripsi & tugas kuliah",
      "Kantor & pabrik Kawasan Industri Pulogadung",
      "Warga Rawamangun untuk kebutuhan mendadak",
      "Acara & pelatihan di venue sekitar Rawamangun",
    ],
    units: [laptops.hp14s, laptops.thinkpad, laptops.vivobook, laptops.acer, laptops.epsonPrinter, laptops.viewsonic],
  },
  {
    slug: "sewa-laptop-event-jakarta",
    area: "Event Jakarta",
    areaShort: "Event",
    title: "Sewa Laptop Event Jakarta — Seminar, Ujian, Pameran",
    metaDescription:
      "Sewa laptop untuk event di Jakarta: seminar, workshop, ujian serentak, pameran, hingga lomba. Unit seragam, siap antar ke venue, mulai Rp79rb/hari.",
    keywords: "sewa laptop event jakarta, rental laptop seminar, sewa laptop workshop jakarta, sewa laptop ujian serentak, rental laptop pameran jakarta, sewa laptop lomba",
    h1: "Sewa Laptop untuk Event di Jakarta",
    intro:
      "Event punya kebutuhan yang berbeda dari sewa perorangan: jumlahnya banyak, waktunya ketat, dan tidak ada ruang untuk unit yang bermasalah di tengah acara. Techpora melayani kebutuhan laptop untuk seminar, workshop, pelatihan, ujian serentak, pameran, hingga lomba di berbagai venue Jakarta. Kami paham bahwa untuk panitia, yang paling menentukan bukan sekadar harga, melainkan kepastian: unit datang tepat waktu, jumlahnya sesuai, dan siap dipakai begitu tiba. Karena itu setiap unit kami cek sebelum diserahkan, dan untuk pesanan beberapa unit kami usahakan spesifikasi yang seragam supaya pengalaman peserta konsisten. Sampaikan tanggal, jumlah, dan jenis acaramu, dan kami bantu susun kebutuhannya.",
    highlights: [
      { title: "Unit Seragam", desc: "Untuk beberapa unit, kami usahakan spesifikasi setara supaya semua peserta dapat pengalaman sama." },
      { title: "Antar ke Venue", desc: "Diantar dan disiapkan di lokasi acara, sudah dicek berfungsi sebelum peserta datang." },
      { title: "Booking Jauh Hari", desc: "Amankan tanggal event-mu lebih awal supaya jumlah unit terjamin, terutama untuk acara besar." },
    ],
    landmarks: ["Hotel & convention", "Kampus", "Co-working space", "Gedung pelatihan", "Balai pertemuan", "Kantor"],
    eta: "Diantar ke venue sesuai jadwal acara. Untuk jumlah banyak, koordinasi H-beberapa hari.",
    useCases: [
      "Seminar, workshop, dan pelatihan perusahaan",
      "Ujian serentak & asesmen berbasis komputer",
      "Pameran, expo, dan booth interaktif",
      "Lomba, hackathon, dan kompetisi",
    ],
    units: [laptops.hp14s, laptops.thinkpad, laptops.vivobook, laptops.redmibook, laptops.acer, laptops.epsonProj],
  },
  {
    slug: "sewa-laptop-mahasiswa-jakarta",
    area: "Mahasiswa Jakarta",
    areaShort: "Mahasiswa",
    title: "Sewa Laptop Mahasiswa Jakarta — Harian & Bulanan",
    metaDescription:
      "Rental laptop mahasiswa Jakarta untuk skripsi, sidang, tugas, dan ujian online. Tanpa deposit, harian mulai Rp79rb, bisa bulanan. Dekat kampus UNJ.",
    keywords: "rental laptop mahasiswa jakarta, sewa laptop mahasiswa jakarta, sewa laptop skripsi, sewa laptop sidang, sewa laptop ujian online, rental laptop kuliah",
    h1: "Sewa Laptop untuk Mahasiswa Jakarta",
    intro:
      "Buat mahasiswa, laptop sering jadi kebutuhan yang muncul mendadak dan tidak selalu terjangkau untuk dibeli. Laptop rusak menjelang sidang, butuh perangkat lebih layak untuk ujian online berpengawas, atau sekadar butuh unit sementara selama laptop utama diperbaiki — semuanya bisa diatasi dengan menyewa. Techpora melayani mahasiswa di seluruh Jakarta, dengan basis di Rawamangun yang dekat kampus UNJ. Kami tahu kondisi kantong mahasiswa, jadi harga kami mulai Rp79rb per hari tanpa deposit, dan ada opsi bulanan yang jauh lebih hemat untuk kebutuhan sepanjang semester seperti mengerjakan skripsi. Cukup foto dokumen identitas, tidak perlu setor uang jaminan.",
    highlights: [
      { title: "Ramah Kantong Mahasiswa", desc: "Harian mulai Rp79rb, tanpa deposit. Bulanan lebih hemat untuk kebutuhan sepanjang semester." },
      { title: "Dekat Kampus UNJ", desc: "Basis di Rawamangun. Mahasiswa UNJ dan sekitarnya bisa ambil langsung tanpa ongkir." },
      { title: "Cocok Ujian Online", desc: "Unit dengan kamera dan mikrofon berfungsi untuk ujian berpengawas dan sidang daring." },
    ],
    landmarks: ["UNJ", "UKI", "STIE Trisakti", "IISIP", "Kampus sekitar Jaktim", "Kos mahasiswa"],
    eta: "Ambil sendiri di Rawamangun (0 ongkir) atau diantar ke kos/kampus area Jakarta.",
    useCases: [
      "Skripsi & sidang akhir",
      "Ujian online berpengawas (proctored)",
      "Tugas kuliah & presentasi kelompok",
      "Pengganti sementara saat laptop diperbaiki",
    ],
    units: [laptops.hp14s, laptops.thinkpad, laptops.vivobook, laptops.redmibook],
  },
  {
    slug: "sewa-laptop-pulogadung",
    area: "Pulogadung",
    areaShort: "Pulogadung",
    title: "Sewa & Rental Laptop Pulogadung, Jakarta Timur",
    metaDescription:
      "Sewa laptop Pulogadung, Jakarta Timur — dekat basis kami di Rawamangun. Cepat sampai ke Kawasan Industri Pulogadung, mulai Rp79rb/hari, tanpa deposit.",
    keywords: "sewa laptop pulogadung, rental laptop pulogadung, sewa laptop kawasan industri pulogadung, sewa laptop jakarta timur",
    h1: "Sewa & Rental Laptop di Pulogadung",
    intro:
      "Pulogadung bersebelahan langsung dengan Rawamangun, tempat toko Techpora berada — jadi untuk warga dan kantor di Pulogadung, kami termasuk penyedia terdekat yang bisa sampai cepat. Kawasan Industri Pulogadung padat dengan pabrik dan kantor yang kerap butuh laptop tambahan mendadak: untuk staf kontrak, audit, pelatihan, atau presentasi ke klien. Karena jaraknya dekat, unit bisa diambil langsung atau diantar dalam waktu singkat tanpa ongkir yang membengkak. Kami paham kebutuhan kantor berbeda dari perorangan — butuh cepat, butuh pasti, dan sering butuh beberapa unit sekaligus.",
    highlights: [
      { title: "Dekat dari Basis Kami", desc: "Rawamangun dan Pulogadung bersebelahan. Antar cepat, ongkir minim." },
      { title: "Siap untuk Kantor", desc: "Beberapa unit sekaligus untuk staf tambahan, pelatihan, atau audit." },
      { title: "Ambil atau Diantar", desc: "Bisa ambil langsung di toko atau diantar ke kantor kawasan industri." },
    ],
    landmarks: ["Kawasan Industri Pulogadung", "JIEP", "Terminal Pulogadung", "Jl. Bekasi Raya", "Rawamangun", "Pulomas"],
    eta: "Antar cepat ke area Pulogadung dari basis Rawamangun, atau ambil sendiri tanpa ongkir.",
    useCases: [
      "Kantor & pabrik untuk staf tambahan",
      "Pelatihan & audit di kawasan industri",
      "Presentasi ke klien",
      "Kebutuhan perorangan warga Pulogadung",
    ],
    units: [laptops.hp14s, laptops.thinkpad, laptops.vivobook, laptops.acer, laptops.epsonProj, laptops.epsonPrinter],
  },
  {
    slug: "sewa-laptop-cempaka-putih",
    area: "Cempaka Putih",
    areaShort: "Cempaka Putih",
    title: "Sewa & Rental Laptop Cempaka Putih Jakarta",
    metaDescription:
      "Sewa laptop Cempaka Putih — dekat dari basis kami di Rawamangun, cepat sampai. Mulai Rp79rb/hari, tanpa deposit, bisa ambil langsung atau diantar.",
    keywords: "sewa laptop cempaka putih, rental laptop cempaka putih, sewa laptop jakarta pusat, sewa laptop dekat cempaka putih",
    h1: "Sewa & Rental Laptop di Cempaka Putih",
    intro:
      "Cempaka Putih berbatasan dengan area Rawamangun dan Pulomas, sehingga dari basis Techpora unit bisa sampai dengan cepat. Kawasan ini punya campuran perkantoran, rumah sakit besar, dan permukiman — kebutuhannya beragam, dari staf kantor yang butuh unit tambahan, tenaga kesehatan yang butuh laptop untuk pelatihan, sampai warga yang laptopnya sedang bermasalah. Karena jaraknya dekat, kamu tidak perlu menunggu pengiriman lama atau membayar ongkir jauh. Cukup sampaikan lokasi dan kebutuhanmu, unit bisa diantar atau diambil langsung di toko kami.",
    highlights: [
      { title: "Jarak Dekat", desc: "Berbatasan dengan Rawamangun dan Pulomas — antar cepat, ongkir minim." },
      { title: "Untuk Beragam Kebutuhan", desc: "Kantor, tenaga kesehatan, pelatihan, hingga kebutuhan perorangan." },
      { title: "Tanpa Deposit", desc: "Cukup dokumen identitas, mulai Rp79rb per hari." },
    ],
    landmarks: ["RS Islam Cempaka Putih", "Jl. Letjen Suprapto", "Cempaka Mas", "Pulomas", "Rawamangun", "Jl. Ahmad Yani"],
    eta: "Antar cepat ke Cempaka Putih dari basis Rawamangun, atau ambil sendiri tanpa ongkir.",
    useCases: [
      "Perkantoran sekitar Letjen Suprapto",
      "Pelatihan tenaga kesehatan",
      "Kebutuhan mendadak warga",
      "Presentasi & rapat",
    ],
    units: [laptops.hp14s, laptops.thinkpad, laptops.vivobook, laptops.acer, laptops.redmibook, laptops.epsonProj],
  },
  {
    slug: "sewa-laptop-matraman",
    area: "Matraman",
    areaShort: "Matraman",
    title: "Sewa & Rental Laptop Matraman Jakarta Timur",
    metaDescription:
      "Sewa laptop Matraman, Jakarta Timur — dekat dari basis kami di Rawamangun. Cepat sampai, mulai Rp79rb/hari, tanpa deposit, bisa diantar atau ambil sendiri.",
    keywords: "sewa laptop matraman, rental laptop matraman, sewa laptop jakarta timur, sewa laptop dekat matraman",
    h1: "Sewa & Rental Laptop di Matraman",
    intro:
      "Matraman berada di jalur yang menghubungkan Jakarta Timur dan Pusat, tidak jauh dari basis Techpora di Rawamangun. Kawasan ini ramai dengan permukiman padat, sekolah, dan usaha kecil — kebutuhan sewa laptopnya sering muncul mendadak: pelajar dan mahasiswa untuk tugas, pelaku usaha untuk mengurus pembukuan atau katalog daring, atau warga yang butuh pengganti sementara. Karena jaraknya dekat, unit bisa sampai cepat tanpa ongkir yang jauh. Sampaikan lokasi dan kebutuhanmu, kami bantu siapkan unit yang sesuai.",
    highlights: [
      { title: "Akses Cepat", desc: "Di jalur Rawamangun–Matraman, unit sampai cepat tanpa ongkir jauh." },
      { title: "Untuk Pelajar & UMKM", desc: "Tugas sekolah, pembukuan usaha, katalog daring, hingga pengganti mendadak." },
      { title: "Fleksibel", desc: "Harian, mingguan, atau bulanan — sesuai kebutuhanmu." },
    ],
    landmarks: ["Jl. Matraman Raya", "Stasiun Pondok Jati", "Berlan", "Salemba", "Rawamangun", "Jl. Pramuka"],
    eta: "Antar cepat ke Matraman dari basis Rawamangun, atau ambil sendiri tanpa ongkir.",
    useCases: [
      "Pelajar & mahasiswa untuk tugas",
      "UMKM untuk pembukuan & katalog",
      "Pengganti laptop sementara",
      "Kebutuhan rumahan mendadak",
    ],
    units: [laptops.hp14s, laptops.thinkpad, laptops.vivobook, laptops.acer],
  },
];

export const areaBySlug = (slug: string) => areas.find((a) => a.slug === slug);
