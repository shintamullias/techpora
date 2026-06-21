export type BlogSection = { h: string; p: string };
export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  category: string;
  date: string; // ISO
  readMinutes: number;
  intro: string;
  sections: BlogSection[];
};

const CTA =
  "Butuh rekomendasi unit sesuai kebutuhanmu? Tim Techpora.id siap bantu lewat WhatsApp dan unit bisa langsung dikirim ke lokasi area Jakarta.";

export const posts: BlogPost[] = [
  {
    slug: "tips-memilih-laptop-sewa-untuk-mahasiswa-akhir",
    title: "10 Tips Memilih Laptop Sewa untuk Mahasiswa Tingkat Akhir",
    description:
      "Panduan memilih laptop sewa yang tepat untuk skripsi, sidang, dan kebutuhan riset mahasiswa tingkat akhir.",
    category: "Tips",
    date: "2026-05-02",
    readMinutes: 6,
    intro:
      "Mahasiswa tingkat akhir butuh laptop yang stabil untuk olah data, menulis skripsi, dan presentasi sidang. Sewa laptop jadi solusi hemat jika unit pribadi sedang bermasalah atau spesifikasinya kurang.",
    sections: [
      { h: "Prioritaskan SSD, bukan HDD", p: "SSD membuat booting dan buka file Word/Excel berukuran besar terasa instan. Hindari unit yang masih pakai HDD karena akan memperlambat proses analisis data." },
      { h: "RAM minimal 8GB", p: "Untuk Microsoft Office, Zoom, browser banyak tab, dan SPSS, RAM 8GB sudah cukup. Jika kamu pakai NVivo, AMOS, atau dataset besar, pertimbangkan 16GB." },
      { h: "Pilih durasi sesuai timeline sidang", p: "Sewa bulanan biasanya jauh lebih murah per harinya dibanding harian. Hitung dari mulai bimbingan, revisi, hingga sidang akhir." },
      { h: "Cek garansi dan dukungan teknis", p: "Pastikan penyewa mengganti unit cepat jika ada kendala — telat satu hari saja bisa mengganggu jadwal bimbingan." },
    ],
  },
  {
    slug: "sewa-laptop-vs-beli-baru-mana-lebih-hemat",
    title: "Sewa Laptop vs Beli Baru: Mana Lebih Hemat di 2026?",
    description: "Perbandingan biaya, depresiasi, dan fleksibilitas antara sewa laptop dan beli unit baru.",
    category: "Perbandingan",
    date: "2026-05-08",
    readMinutes: 7,
    intro:
      "Banyak orang ragu antara menyewa laptop atau langsung beli. Jawabannya tergantung durasi pemakaian, kebutuhan upgrade, dan arus kas.",
    sections: [
      { h: "Hitung biaya total kepemilikan", p: "Laptop baru kelas i5 SSD 256GB rata-rata Rp9–12 juta. Setelah 2 tahun, harga jual turun 35–50%. Total biaya \"nyata\" pemakaian 1–2 tahun bisa setara sewa." },
      { h: "Sewa unggul untuk kebutuhan jangka pendek", p: "Project 1–3 bulan, event, atau onboarding karyawan baru lebih efisien dengan sewa karena tidak ada modal awal besar." },
      { h: "Beli unggul untuk pemakaian 3+ tahun", p: "Jika kamu butuh laptop harian dalam jangka panjang dan stabil, beli akan lebih ekonomis sekaligus jadi aset." },
    ],
  },
  {
    slug: "panduan-lengkap-sewa-laptop-untuk-event-di-jakarta",
    title: "Panduan Lengkap Sewa Laptop untuk Event di Jakarta",
    description: "Dari workshop, training, sampai pameran — panduan menyiapkan unit sewa untuk event 1 hari hingga 1 minggu.",
    category: "Event",
    date: "2026-05-10",
    readMinutes: 8,
    intro:
      "Event membutuhkan banyak laptop dengan spesifikasi seragam dan kondisi siap pakai. Salah pilih vendor bisa membuat acara terhambat di hari-H.",
    sections: [
      { h: "Tentukan jumlah dan spesifikasi seragam", p: "Workshop dan training butuh unit dengan RAM dan SSD seragam supaya peserta dapat pengalaman yang sama. Jangan campur i3 dengan i7 jika tidak perlu." },
      { h: "Pesan minimal H-3 untuk volume besar", p: "Untuk 10+ unit di tanggal sibuk seperti akhir tahun, vendor butuh waktu siapkan dan instal software seragam." },
      { h: "Sewa termasuk pengiriman", p: "Pilih vendor yang menawarkan antar-jemput. Bawa 20 laptop sendiri pakai grab car bukan ide bagus." },
    ],
  },
  {
    slug: "thinkpad-vs-macbook-air-m1-pilih-mana-untuk-sewa-bulanan",
    title: "ThinkPad vs MacBook Air M1: Pilih Mana untuk Sewa Bulanan?",
    description: "Perbandingan ThinkPad i3/i5 dan MacBook Air M1 untuk pekerja remote yang menyewa laptop bulanan.",
    category: "Perbandingan",
    date: "2026-05-12",
    readMinutes: 6,
    intro:
      "Dua pilihan paling populer untuk sewa bulanan: ThinkPad yang tangguh dan MacBook Air M1 yang efisien. Mana yang cocok untuk kamu?",
    sections: [
      { h: "Performa harian", p: "MacBook Air M1 unggul di efisiensi daya dan responsif untuk multitasking ringan. ThinkPad cocok untuk software Windows-only seperti aplikasi akuntansi atau Office plug-in tertentu." },
      { h: "Baterai", p: "MacBook Air M1 sanggup 10+ jam pemakaian nyata. ThinkPad rata-rata 5–7 jam. Untuk mobile worker, MacBook lebih nyaman." },
      { h: "Harga sewa", p: "ThinkPad biasanya 30–50% lebih murah per bulan. Cocok untuk yang prioritas hemat." },
    ],
  },
  {
    slug: "cara-sewa-laptop-aman-tanpa-tertipu",
    title: "Cara Sewa Laptop Aman Tanpa Tertipu Vendor Abal-Abal",
    description: "Checklist memilih vendor sewa laptop yang aman, legit, dan punya track record jelas.",
    category: "Tips",
    date: "2026-05-15",
    readMinutes: 5,
    intro:
      "Penipuan sewa laptop biasanya berawal dari DP via transfer ke akun pribadi tanpa kontrak. Hindari dengan beberapa langkah sederhana.",
    sections: [
      { h: "Cek reputasi online", p: "Cari nama vendor di Instagram, Google Maps, dan forum. Vendor legit punya jejak digital yang konsisten lebih dari setahun." },
      { h: "Pastikan ada kontrak tertulis", p: "Kontrak harus memuat identitas unit (serial number), durasi, harga, dan ketentuan kerusakan. Tolak vendor yang hanya \"chat-chat\"." },
      { h: "Bayar bertahap, bukan lunas di awal", p: "Vendor profesional biasanya minta DP 50% dan pelunasan saat serah terima unit." },
    ],
  },
  {
    slug: "sewa-laptop-untuk-skripsi-spesifikasi-yang-wajib-ada",
    title: "Sewa Laptop untuk Skripsi: Spesifikasi yang Wajib Ada",
    description: "Daftar spesifikasi laptop sewa yang ideal untuk pengerjaan skripsi dan tesis.",
    category: "Mahasiswa",
    date: "2026-05-17",
    readMinutes: 5,
    intro:
      "Skripsi melibatkan banyak buka-tutup dokumen, referensi PDF, dan software statistik. Salah pilih spek bisa bikin laptop lemot saat deadline.",
    sections: [
      { h: "Processor minimal Core i3 generasi baru", p: "Untuk Word + Mendeley + browser, i3 generasi 10 ke atas sudah cukup. Hindari Celeron." },
      { h: "RAM 8GB jadi standar", p: "8GB cukup untuk SPSS dasar. Jika riset kamu pakai NVivo atau dataset besar, sewa unit 16GB." },
      { h: "SSD 256GB", p: "256GB cukup menampung dataset, jurnal PDF, dan backup. Hindari HDD yang lambat." },
    ],
  },
  {
    slug: "7-alasan-startup-pilih-sewa-laptop-daripada-beli",
    title: "7 Alasan Startup Pilih Sewa Laptop daripada Beli",
    description: "Manfaat finansial dan operasional sewa laptop untuk startup early-stage.",
    category: "Bisnis",
    date: "2026-05-20",
    readMinutes: 6,
    intro:
      "Cash flow startup terbatas. Sewa laptop memberi fleksibilitas tanpa menggerus modal kerja.",
    sections: [
      { h: "Hemat capex", p: "Modal yang seharusnya dipakai beli laptop bisa dialokasikan ke marketing atau hiring." },
      { h: "Skala cepat", p: "Hire 5 orang minggu ini? Sewa 5 unit bisa siap dalam 2–3 hari." },
      { h: "Tidak repot soal aset & depresiasi", p: "Tim finance startup biasanya kecil. Sewa = biaya operasional bulanan, simpel di pembukuan." },
    ],
  },
  {
    slug: "tips-sewa-laptop-untuk-workshop-dan-pelatihan",
    title: "Tips Sewa Laptop untuk Workshop & Pelatihan",
    description: "Cara memastikan workshop berjalan lancar dengan unit sewa yang seragam dan stabil.",
    category: "Event",
    date: "2026-05-22",
    readMinutes: 5,
    intro:
      "Workshop digital marketing, coding, atau desain butuh unit seragam supaya peserta tidak terhambat perbedaan software/spek.",
    sections: [
      { h: "Sediakan unit cadangan 10%", p: "Untuk 30 peserta, sewa 33 unit. Jaga-jaga unit error atau peserta tambahan." },
      { h: "Minta pre-install software", p: "Minta vendor instal Figma, VS Code, Photoshop, atau software pelatihan sebelum dikirim." },
      { h: "Tes koneksi WiFi sebelum hari-H", p: "Pastikan adapter WiFi laptop kompatibel dan venue punya bandwidth cukup." },
    ],
  },
  {
    slug: "perbandingan-ram-8gb-vs-16gb-untuk-kerja-remote",
    title: "Perbandingan RAM 8GB vs 16GB untuk Kerja Remote",
    description: "Kapan kamu cukup pakai 8GB dan kapan perlu upgrade ke 16GB saat sewa laptop.",
    category: "Spesifikasi",
    date: "2026-05-25",
    readMinutes: 5,
    intro:
      "RAM jadi pembeda terbesar pengalaman pakai laptop. Tapi tidak semua orang butuh 16GB.",
    sections: [
      { h: "8GB: Office, Zoom, browser", p: "Untuk 80% pekerja kantor, 8GB sudah cukup nyaman. Tutup tab yang tidak perlu dan multitasking tetap lancar." },
      { h: "16GB: Designer, editor, developer", p: "Figma berat, Photoshop, Premiere, atau Docker minta resource lebih. Di sini 16GB beda jauh." },
      { h: "Cek aktivitas RAM kamu", p: "Buka Task Manager saat kerja normal. Jika RAM rutin di atas 80%, saatnya sewa unit 16GB." },
    ],
  },
  {
    slug: "sewa-laptop-harian-kapan-worth-it",
    title: "Sewa Laptop Harian: Kapan Worth It dan Kapan Tidak?",
    description: "Analisis kapan sewa harian lebih hemat dibanding sewa mingguan atau bulanan.",
    category: "Tips",
    date: "2026-05-27",
    readMinutes: 4,
    intro:
      "Sewa harian terlihat murah, tapi bisa jadi mahal kalau kebutuhanmu sebenarnya beberapa hari berturut-turut.",
    sections: [
      { h: "Harian cocok untuk 1–3 hari", p: "Presentasi klien, ujian sertifikasi, atau training singkat ideal pakai paket harian." },
      { h: "Mingguan hemat untuk 4–10 hari", p: "Begitu kebutuhan melewati 4 hari, paket mingguan biasanya jauh lebih murah per harinya." },
      { h: "Bulanan untuk project & WFH", p: "Untuk pemakaian rutin 2 minggu+, langsung ambil paket bulanan." },
    ],
  },
  {
    slug: "cara-hitung-budget-sewa-laptop-untuk-event-3-hari",
    title: "Cara Hitung Budget Sewa Laptop untuk Event 3 Hari",
    description: "Simulasi perhitungan biaya sewa laptop untuk event 3 hari dengan 20 unit.",
    category: "Event",
    date: "2026-05-29",
    readMinutes: 5,
    intro:
      "Hitung anggaran sewa laptop event butuh memperhitungkan jumlah unit, ongkos kirim, dan deposit.",
    sections: [
      { h: "Komponen biaya utama", p: "Total = (harga per unit × jumlah unit × jumlah hari) + ongkos kirim + deposit (refundable)." },
      { h: "Contoh simulasi", p: "20 unit i3 paket 3 hari Rp250.000/unit = Rp5.000.000 + ongkos kirim sekitar Rp300–500 ribu untuk area Jakarta." },
      { h: "Negosiasi paket event", p: "Untuk volume 15+ unit, vendor biasanya memberi diskon paket atau gratis ongkos antar-jemput." },
    ],
  },
  {
    slug: "sewa-macbook-untuk-content-creator-worth-it",
    title: "Sewa MacBook untuk Content Creator: Worth It?",
    description: "Pertimbangan menyewa MacBook untuk editor video dan content creator pemula.",
    category: "Perbandingan",
    date: "2026-06-01",
    readMinutes: 6,
    intro:
      "MacBook Air M1 dan Pro punya reputasi solid untuk editing video dan kerja kreatif. Sewa jadi pintu masuk tanpa modal besar.",
    sections: [
      { h: "Final Cut & Premiere lancar", p: "Chip M1 menangani timeline 1080p tanpa drop frame. Untuk 4K, M1 Air masih mampu tapi terbatas." },
      { h: "Color grading & preview", p: "Layar MacBook punya kalibrasi warna konsisten — penting untuk konten yang ditonton di banyak device." },
      { h: "Sewa = uji ekosistem", p: "Sebelum beli MacBook jutaan rupiah, sewa 1–2 bulan untuk memastikan ekosistem macOS cocok dengan workflow kamu." },
    ],
  },
  {
    slug: "sewa-laptop-untuk-trading-saham-spek-ideal",
    title: "Sewa Laptop untuk Trading Saham: Spek Ideal",
    description: "Spesifikasi laptop sewa untuk trader saham dengan multi-monitor dan platform real-time.",
    category: "Spesifikasi",
    date: "2026-06-03",
    readMinutes: 5,
    intro:
      "Trader saham butuh laptop yang stabil running chart, news feed, dan platform broker bersamaan.",
    sections: [
      { h: "RAM 16GB direkomendasikan", p: "RTI, Stockbit, dan multiple chart bersamaan menyedot RAM. Hindari unit 4GB." },
      { h: "Dukungan multi-monitor", p: "Pilih unit dengan HDMI dan USB-C agar bisa colok 1–2 monitor tambahan untuk chart." },
      { h: "Koneksi stabil", p: "Unit dengan WiFi 5/6 dan port Ethernet menjadi keunggulan saat trading saat jam volatil." },
    ],
  },
  {
    slug: "panduan-sewa-laptop-gaming-untuk-turnamen",
    title: "Panduan Sewa Laptop Gaming untuk Turnamen Esports",
    description: "Tips memilih laptop sewa untuk turnamen game seperti Mobile Legends emulator, Valorant, atau Dota 2.",
    category: "Event",
    date: "2026-06-05",
    readMinutes: 6,
    intro:
      "Turnamen esports butuh laptop dengan GPU dedicated dan refresh rate tinggi. Jangan sembarang sewa.",
    sections: [
      { h: "GPU dedicated wajib", p: "Minimal GTX 1650/RTX 3050 untuk Valorant 144Hz. Untuk Dota 2 di setting tinggi, lebih aman RTX 3060." },
      { h: "Layar 144Hz+", p: "Refresh rate tinggi memberi keunggulan kompetitif di game FPS." },
      { h: "Cek thermal", p: "Laptop gaming sewa harus melewati pengecekan suhu agar tidak throttling saat turnamen panjang." },
    ],
  },
  {
    slug: "sewa-laptop-untuk-ujian-online-cbt",
    title: "Sewa Laptop untuk Ujian Online (CBT)",
    description: "Spesifikasi minimum dan tips menyewa laptop untuk ujian Computer Based Test.",
    category: "Mahasiswa",
    date: "2026-06-07",
    readMinutes: 4,
    intro:
      "Banyak ujian sertifikasi dan beasiswa kini berbasis CBT. Sewa laptop jadi pilihan jika unit pribadi tidak memenuhi syarat.",
    sections: [
      { h: "Cek persyaratan teknis dari penyelenggara", p: "Biasanya minta webcam, mic, dan browser tertentu. Pastikan unit sewa memenuhi." },
      { h: "Battery & charger lengkap", p: "Ujian 3 jam tanpa colokan? Pastikan baterai sehat dan bawa charger." },
      { h: "Coba simulasi H-1", p: "Install browser ujian dan login dummy untuk pastikan tidak ada kendala saat hari-H." },
    ],
  },
  {
    slug: "sewa-laptop-untuk-umkm-roi-dan-manfaatnya",
    title: "Sewa Laptop untuk UMKM: ROI dan Manfaatnya",
    description: "Analisis return on investment sewa laptop untuk operasional UMKM.",
    category: "Bisnis",
    date: "2026-06-09",
    readMinutes: 6,
    intro:
      "UMKM dengan margin tipis butuh efisiensi maksimum. Sewa laptop bisa menjaga arus kas tetap sehat.",
    sections: [
      { h: "Biaya tetap & predictable", p: "Sewa = biaya bulanan flat, mudah dianggarkan." },
      { h: "Upgrade tanpa kerugian", p: "Saat butuh laptop lebih kuat, tinggal ganti unit sewa tanpa harus jual rugi." },
      { h: "Fokus ke core business", p: "Tidak perlu pusing service, garansi, atau resale value." },
    ],
  },
  {
    slug: "sewa-laptop-untuk-anak-sekolah-tips-orang-tua",
    title: "Sewa Laptop untuk Anak Sekolah: Tips untuk Orang Tua",
    description: "Panduan memilih laptop sewa yang aman dan ringan untuk anak sekolah.",
    category: "Tips",
    date: "2026-06-11",
    readMinutes: 5,
    intro:
      "Anak sekolah butuh laptop yang ringan, tahan banting, dan terjangkau. Sewa cocok terutama selama PJJ atau project sekolah.",
    sections: [
      { h: "Pilih ukuran 13–14 inci", p: "Lebih ringan dan muat tas sekolah. Hindari 15.6 inci untuk anak SD–SMP." },
      { h: "Setting parental control", p: "Aktifkan Family Safety di Windows atau Screen Time di macOS." },
      { h: "Tambahkan asuransi", p: "Jika tersedia, ambil opsi asuransi/perlindungan agar tidak panik jika anak tidak sengaja merusak." },
    ],
  },
  {
    slug: "cara-merawat-laptop-sewa-agar-tidak-kena-denda",
    title: "Cara Merawat Laptop Sewa agar Tidak Kena Denda",
    description: "Tips menjaga unit sewa tetap mulus dari pengambilan hingga pengembalian.",
    category: "Tips",
    date: "2026-06-13",
    readMinutes: 4,
    intro:
      "Denda kerusakan unit sewa bisa menghabiskan keuntungan hematmu. Cegah dengan kebiasaan sederhana.",
    sections: [
      { h: "Selalu pakai sleeve & tas empuk", p: "Mayoritas lecet terjadi saat mobilitas. Sleeve mengurangi risiko gores dan benturan." },
      { h: "Jauhkan dari makanan & minuman", p: "Tumpahan kopi adalah penyebab top kerusakan keyboard." },
      { h: "Bersihkan sebelum dikembalikan", p: "Layar berdebu dan sidik jari bisa dianggap kurang bersih. Lap dengan microfiber sebelum balik." },
    ],
  },
  {
    slug: "sewa-laptop-untuk-editor-video-spek-minimum",
    title: "Sewa Laptop untuk Editor Video: Spek Minimum",
    description: "Spesifikasi minimum dan rekomendasi laptop sewa untuk editor video.",
    category: "Spesifikasi",
    date: "2026-06-15",
    readMinutes: 6,
    intro:
      "Editing video adalah pekerjaan berat. Pilih unit sewa yang tidak akan menyiksa kamu di tengah deadline.",
    sections: [
      { h: "Minimum RAM 16GB", p: "8GB akan tersiksa di timeline Premiere/DaVinci. 16GB jadi titik nyaman." },
      { h: "GPU dedicated atau Apple Silicon", p: "GPU mempercepat render dan preview. MacBook Air M1/M2 juga sangat efisien tanpa GPU dedicated." },
      { h: "SSD 512GB+", p: "File video boros storage. Pilih SSD besar atau bawa external SSD." },
    ],
  },
  {
    slug: "sewa-laptop-untuk-designer-grafis-pilih-apa",
    title: "Sewa Laptop untuk Designer Grafis: Pilih Apa?",
    description: "Rekomendasi unit sewa untuk designer grafis pemula hingga pro.",
    category: "Perbandingan",
    date: "2026-06-17",
    readMinutes: 5,
    intro:
      "Adobe Suite dan Figma berat. Designer butuh layar dengan reproduksi warna baik dan RAM lega.",
    sections: [
      { h: "Layar sRGB tinggi", p: "Cari unit dengan cakupan warna sRGB 95%+ atau MacBook untuk konsistensi warna." },
      { h: "RAM 16GB jadi standar", p: "Photoshop + Illustrator + browser referensi gampang menembus 12GB pemakaian." },
      { h: "Storage SSD cepat", p: "File PSD besar lebih nyaman di NVMe SSD." },
    ],
  },
  {
    slug: "sewa-laptop-untuk-programmer-lenovo-atau-macbook",
    title: "Sewa Laptop untuk Programmer: Lenovo atau MacBook?",
    description: "Perbandingan unit sewa Lenovo ThinkPad dan MacBook untuk developer.",
    category: "Perbandingan",
    date: "2026-06-19",
    readMinutes: 6,
    intro:
      "Mayoritas developer nyaman di macOS atau Linux. Tapi ThinkPad juga punya keunggulan tersendiri.",
    sections: [
      { h: "MacBook untuk iOS & ekosistem Apple", p: "Wajib jika kamu develop iOS. Juga nyaman untuk web/full-stack." },
      { h: "ThinkPad untuk fleksibilitas Linux", p: "Driver Linux ThinkPad termasuk paling stabil di kelas laptop bisnis." },
      { h: "Pertimbangkan budget", p: "Untuk sewa bulanan, ThinkPad biasanya 30–40% lebih murah." },
    ],
  },
  {
    slug: "sewa-laptop-untuk-zoom-meeting-massal",
    title: "Sewa Laptop untuk Zoom Meeting Massal",
    description: "Tips sewa laptop untuk acara Zoom dengan banyak host dan breakout room.",
    category: "Event",
    date: "2026-06-21",
    readMinutes: 5,
    intro:
      "Webinar besar dan breakout room butuh banyak laptop. Vendor sewa yang berpengalaman bisa menyiapkan semuanya.",
    sections: [
      { h: "Webcam & mic eksternal", p: "Built-in webcam laptop seringkali kurang. Pertimbangkan tambahan webcam HD." },
      { h: "Pre-install Zoom & login", p: "Minta vendor instal Zoom plus akun kerja agar peserta tinggal pakai." },
      { h: "Backup koneksi", p: "Siapkan tethering mobile sebagai cadangan jika WiFi venue down." },
    ],
  },
  {
    slug: "sewa-laptop-untuk-wedding-organizer",
    title: "Sewa Laptop untuk Wedding Organizer",
    description: "Manfaat sewa laptop untuk operasional wedding organizer dan tim dokumentasi.",
    category: "Event",
    date: "2026-06-23",
    readMinutes: 5,
    intro:
      "WO membutuhkan laptop untuk koordinasi, presentasi vendor, hingga slideshow di resepsi.",
    sections: [
      { h: "Unit ringan untuk koordinasi", p: "Sales WO yang mobile lebih cocok dengan unit 13 inci ringan." },
      { h: "Unit performa untuk dokumentasi", p: "Tim foto/video butuh laptop kencang untuk backup dan editing on-site." },
      { h: "Sewa harian saat hari-H", p: "Tidak perlu beli unit khusus untuk dipakai di event 1 hari." },
    ],
  },
  {
    slug: "sewa-laptop-untuk-booth-pameran",
    title: "Sewa Laptop untuk Booth Pameran",
    description: "Tips memilih unit sewa untuk demo produk di booth pameran dan expo.",
    category: "Event",
    date: "2026-06-25",
    readMinutes: 5,
    intro:
      "Booth pameran butuh laptop yang siap menyala 8–10 jam non-stop sambil demo aplikasi atau slideshow.",
    sections: [
      { h: "Pilih layar besar untuk daya tarik", p: "Layar 15.6 inci memudahkan pengunjung melihat demo dari jarak dekat." },
      { h: "Pre-install demo & materi", p: "Pastikan semua file sudah di laptop sebelum pengiriman ke venue." },
      { h: "Sewa stand-by unit cadangan", p: "Pameran ramai = risiko unit error. Cadangan menghindari downtime booth." },
    ],
  },
  {
    slug: "sewa-laptop-untuk-konferensi-internasional",
    title: "Sewa Laptop untuk Konferensi Internasional",
    description: "Persiapan unit sewa untuk konferensi internasional dengan kebutuhan multibahasa.",
    category: "Event",
    date: "2026-06-27",
    readMinutes: 6,
    intro:
      "Konferensi internasional menuntut laptop dengan setting bahasa, software interpreter, dan koneksi stabil.",
    sections: [
      { h: "Setting bahasa & keyboard", p: "Sediakan opsi bahasa Inggris dan Indonesia. Untuk delegasi asing, siapkan layout US." },
      { h: "Software interpreter", p: "Pasang Zoom dengan fitur interpretation atau platform khusus seperti Interprefy." },
      { h: "Multi-monitor untuk panel", p: "Sediakan port HDMI/USB-C untuk menyambung ke projector dan secondary monitor moderator." },
    ],
  },
  {
    slug: "sewa-laptop-untuk-sertifikasi-dan-training-it",
    title: "Sewa Laptop untuk Sertifikasi & Training IT",
    description: "Spesifikasi unit sewa untuk peserta training Cisco, AWS, Microsoft, dan sertifikasi IT lain.",
    category: "Event",
    date: "2026-06-29",
    readMinutes: 5,
    intro:
      "Training Cisco, AWS, dan Microsoft butuh laptop dengan virtualization dan koneksi VPN stabil.",
    sections: [
      { h: "Virtualization aktif di BIOS", p: "Pastikan VT-x/AMD-V aktif agar bisa jalankan VirtualBox/VMware." },
      { h: "RAM minimal 16GB", p: "Lab VM ringan butuh 8–12GB sendiri. 8GB tidak cukup." },
      { h: "Stabilitas WiFi", p: "Lab cloud (AWS Console, Azure Portal) sangat bergantung pada koneksi." },
    ],
  },
  {
    slug: "sewa-laptop-untuk-hackathon",
    title: "Sewa Laptop untuk Hackathon: Apa Saja yang Disiapkan?",
    description: "Panduan menyiapkan unit sewa untuk peserta hackathon 24–48 jam.",
    category: "Event",
    date: "2026-07-01",
    readMinutes: 5,
    intro:
      "Hackathon menuntut laptop kuat yang bisa coding nonstop sambil running development tools dan komunikasi tim.",
    sections: [
      { h: "RAM 16GB & SSD cepat", p: "VS Code, Docker, dan browser berat. RAM 16GB bikin nyaman 24 jam." },
      { h: "Battery & charger ekstra", p: "Bawa charger cadangan karena colokan venue terbatas." },
      { h: "Account login terpisah", p: "Jangan login akun personal di unit sewa. Pakai akun GitHub sementara." },
    ],
  },
  {
    slug: "sewa-laptop-untuk-liputan-jurnalis",
    title: "Sewa Laptop untuk Liputan Jurnalis",
    description: "Pilihan unit sewa ringan untuk jurnalis lapangan yang banyak mobilitas.",
    category: "Profesional",
    date: "2026-07-03",
    readMinutes: 5,
    intro:
      "Jurnalis butuh laptop ringan dengan baterai panjang dan koneksi stabil untuk filing berita cepat dari lapangan.",
    sections: [
      { h: "Pilih unit di bawah 1.4 kg", p: "MacBook Air, ThinkPad X1 Carbon, atau LG Gram cocok untuk mobilitas." },
      { h: "Baterai 8 jam+", p: "Jurnalis sering tidak punya akses charger di lapangan." },
      { h: "Tethering & VPN siap", p: "Untuk liputan di daerah, tethering jadi penyelamat." },
    ],
  },
  {
    slug: "sewa-laptop-untuk-kru-produksi-film",
    title: "Sewa Laptop untuk Kru Produksi Film",
    description: "Pilihan unit sewa untuk kru produksi dari script, DIT, hingga on-set editing.",
    category: "Profesional",
    date: "2026-07-05",
    readMinutes: 6,
    intro:
      "Setiap divisi produksi film butuh laptop berbeda — dari script kontinuitas hingga DIT yang menangani 4K raw.",
    sections: [
      { h: "Script: laptop ringan", p: "Cukup unit ringan dengan Final Draft atau Highland." },
      { h: "DIT: high-end + storage besar", p: "Butuh CPU kuat dan ekspansi storage untuk backup harian." },
      { h: "On-set editor", p: "MacBook Pro atau laptop dengan GPU dedicated agar bisa preview cepat di Premiere/DaVinci." },
    ],
  },
  {
    slug: "sewa-laptop-bulanan-untuk-karyawan-kontrak",
    title: "Sewa Laptop Bulanan untuk Karyawan Kontrak",
    description: "Solusi sewa laptop bulanan untuk perusahaan yang merekrut karyawan kontrak jangka pendek.",
    category: "Bisnis",
    date: "2026-07-07",
    readMinutes: 5,
    intro:
      "Karyawan kontrak 3–6 bulan tidak efisien dibekali laptop baru. Sewa bulanan jauh lebih ekonomis.",
    sections: [
      { h: "Aktivasi cepat", p: "Unit bisa disiapkan dalam 1–2 hari, plug & play untuk hari pertama kerja." },
      { h: "Pengembalian fleksibel", p: "Saat kontrak selesai, tinggal serahkan unit kembali tanpa proses jual." },
      { h: "Standar IT seragam", p: "Vendor bisa siapkan image standar perusahaan (antivirus, VPN, dsb)." },
    ],
  },
  {
    slug: "sewa-laptop-untuk-onboarding-karyawan-baru",
    title: "Sewa Laptop untuk Onboarding Karyawan Baru",
    description: "Strategi sewa laptop sebagai jembatan sambil menunggu pembelian unit permanen.",
    category: "Bisnis",
    date: "2026-07-09",
    readMinutes: 4,
    intro:
      "Procurement laptop kantor sering memakan waktu berminggu-minggu. Sewa jadi solusi jembatan agar karyawan baru tidak nganggur.",
    sections: [
      { h: "Cepat siap di hari pertama", p: "Karyawan baru bisa langsung kerja, tidak menunggu PO selesai." },
      { h: "Trial spec sebelum beli", p: "Coba laptop sewa untuk validasi spec sebelum beli versi permanen." },
      { h: "Tidak mengganggu cash flow", p: "Procurement bisa direncanakan dengan tenang." },
    ],
  },
  {
    slug: "sewa-laptop-untuk-bootcamp-coding",
    title: "Sewa Laptop untuk Bootcamp Coding",
    description: "Unit sewa yang cocok untuk peserta bootcamp full-stack, data science, dan UI/UX.",
    category: "Event",
    date: "2026-07-11",
    readMinutes: 5,
    intro:
      "Bootcamp 3–6 bulan menuntut laptop yang sanggup running development environment harian.",
    sections: [
      { h: "RAM 16GB ideal", p: "Node, Docker, dan browser developer tools paling enak dengan 16GB." },
      { h: "Keyboard nyaman", p: "Bootcamp = ngoding 8+ jam sehari. Pilih unit dengan keyboard nyaman seperti ThinkPad." },
      { h: "Garansi swap cepat", p: "Jika unit bermasalah, vendor harus bisa swap dalam 24 jam." },
    ],
  },
  {
    slug: "sewa-laptop-untuk-try-out-online",
    title: "Sewa Laptop untuk Try Out Online",
    description: "Sewa laptop untuk lembaga bimbel yang menyelenggarakan try out online massal.",
    category: "Event",
    date: "2026-07-13",
    readMinutes: 5,
    intro:
      "Bimbel kini banyak menyelenggarakan TO online. Sewa laptop massal lebih efisien dibanding investasi unit baru.",
    sections: [
      { h: "Hitung kebutuhan per sesi", p: "Jika peserta 300 dengan 3 sesi, butuh 100 unit per sesi." },
      { h: "Standar browser & extension", p: "Pastikan vendor pre-install browser ujian dan disable extension yang bisa cheating." },
      { h: "Cek sebelum sesi", p: "Sediakan 1 jam untuk QC unit sebelum peserta datang." },
    ],
  },
  {
    slug: "sewa-laptop-untuk-survei-lapangan",
    title: "Sewa Laptop untuk Survei Lapangan",
    description: "Pilih laptop sewa yang tahan banting dan baterai panjang untuk surveyor lapangan.",
    category: "Profesional",
    date: "2026-07-15",
    readMinutes: 5,
    intro:
      "Surveyor lapangan butuh laptop yang siap menemani di lokasi proyek, bandara, hingga warung kopi.",
    sections: [
      { h: "Rugged atau bisnis-grade", p: "ThinkPad atau Latitude lebih tahan jatuh ringan dan tumpahan kecil." },
      { h: "Baterai 8 jam+", p: "Penting karena charger tidak selalu tersedia di lokasi." },
      { h: "Konektivitas lengkap", p: "USB-A, USB-C, HDMI memudahkan tukar data dengan tim di lapangan." },
    ],
  },
  {
    slug: "tips-negosiasi-harga-sewa-laptop",
    title: "Tips Negosiasi Harga Sewa Laptop",
    description: "Strategi negosiasi harga sewa laptop untuk pemakaian jangka panjang atau volume besar.",
    category: "Tips",
    date: "2026-07-17",
    readMinutes: 4,
    intro:
      "Harga sewa biasanya fleksibel untuk volume besar atau durasi panjang. Ini cara negosiasi yang sehat.",
    sections: [
      { h: "Sebutkan durasi pasti", p: "Komitmen 3 bulan biasanya menghasilkan diskon 10–20% per bulan." },
      { h: "Volume diskon", p: "10+ unit hampir selalu dapat harga corporate." },
      { h: "Tukar fleksibilitas dengan harga", p: "Setuju jadwal pengiriman fleksibel? Minta diskon tambahan." },
    ],
  },
  {
    slug: "apa-saja-syarat-dokumen-sewa-laptop",
    title: "Apa Saja Syarat Dokumen Sewa Laptop?",
    description: "Daftar lengkap dokumen yang biasanya diminta vendor sewa laptop di Jakarta.",
    category: "Tips",
    date: "2026-07-19",
    readMinutes: 4,
    intro:
      "Vendor sewa profesional minta dokumen untuk verifikasi identitas. Ini umum dan justru tanda vendor legit.",
    sections: [
      { h: "Dokumen wajib", p: "KTP, KK, dan satu kartu identitas pendukung (SIM/Kartu pegawai/Kartu mahasiswa)." },
      { h: "Dokumen tambahan", p: "Beberapa vendor minta slip gaji atau referensi tempat kerja untuk durasi panjang." },
      { h: "Selfie dengan KTP", p: "Verifikasi tambahan agar identitas penyewa cocok." },
    ],
  },
  {
    slug: "sewa-laptop-tanpa-ktp-bisa-atau-tidak",
    title: "Sewa Laptop Tanpa KTP: Bisa atau Tidak?",
    description: "Jawaban jujur soal sewa laptop tanpa KTP dan risikonya.",
    category: "Tips",
    date: "2026-07-21",
    readMinutes: 3,
    intro:
      "Pertanyaan klasik dari calon penyewa. Jawabannya: hampir tidak ada vendor profesional yang menerima.",
    sections: [
      { h: "Mengapa KTP wajib", p: "Vendor butuh verifikasi identitas untuk melindungi unit yang harganya jutaan rupiah." },
      { h: "Alternatif untuk WNA", p: "WNA biasanya bisa pakai paspor + KITAS." },
      { h: "Hindari vendor yang \"tidak butuh KTP\"", p: "Bisa jadi tanda penipuan, atau syarat lain yang lebih memberatkan di belakang." },
    ],
  },
  {
    slug: "antar-jemput-laptop-sewa-di-jakarta",
    title: "Antar-Jemput Laptop Sewa di Jakarta",
    description: "Cara kerja layanan antar-jemput unit sewa untuk area Jakarta dan sekitarnya.",
    category: "Layanan",
    date: "2026-07-23",
    readMinutes: 4,
    intro:
      "Layanan antar-jemput memudahkan penyewa yang sibuk. Ketahui zona, biaya, dan estimasi waktu.",
    sections: [
      { h: "Zona dan biaya", p: "Vendor biasanya menetapkan tarif berdasarkan zona Jakarta Pusat, Selatan, Barat, Timur, dan Utara." },
      { h: "Estimasi waktu", p: "Pemesanan sebelum jam 12 siang biasanya bisa sampai di hari yang sama untuk Jakarta." },
      { h: "Bebas ongkir untuk paket panjang", p: "Sewa bulanan/volume besar sering dapat gratis ongkir." },
    ],
  },
  {
    slug: "asuransi-laptop-sewa-perlu-atau-tidak",
    title: "Asuransi Laptop Sewa: Perlu atau Tidak?",
    description: "Pertimbangan menambah asuransi atau perlindungan unit sewa.",
    category: "Tips",
    date: "2026-07-25",
    readMinutes: 4,
    intro:
      "Beberapa vendor menawarkan add-on asuransi atau perlindungan kerusakan. Ini analisis singkat.",
    sections: [
      { h: "Untuk siapa cocok", p: "Cocok jika kamu mobile tinggi, sering travel, atau dipakai anak/karyawan." },
      { h: "Yang dicover", p: "Umumnya kerusakan tidak disengaja. Hilang dan kelalaian berat biasanya tidak." },
      { h: "Hitung premi vs risiko", p: "Premi ~5–10% dari biaya sewa. Worth it jika risikomu tinggi." },
    ],
  },
  {
    slug: "cek-kondisi-laptop-sewa-sebelum-diterima",
    title: "Cek Kondisi Laptop Sewa Sebelum Diterima",
    description: "Checklist QC unit saat serah terima dari vendor sewa laptop.",
    category: "Tips",
    date: "2026-07-27",
    readMinutes: 5,
    intro:
      "Cek menyeluruh saat serah terima menghindari sengketa di akhir periode sewa.",
    sections: [
      { h: "Cek fisik & layar", p: "Periksa lecet, retakan, dead pixel, dan engsel." },
      { h: "Cek keyboard & port", p: "Tes semua tombol, port USB, HDMI, audio." },
      { h: "Foto kondisi awal", p: "Dokumentasikan dan kirim ke vendor sebagai bukti." },
    ],
  },
  {
    slug: "laptop-sewa-lambat-lakukan-ini-dulu",
    title: "Laptop Sewa Lambat? Lakukan Ini Dulu",
    description: "Langkah awal saat unit sewa terasa lambat sebelum meminta swap.",
    category: "Tips",
    date: "2026-07-29",
    readMinutes: 4,
    intro:
      "Sebelum komplain, beberapa langkah sederhana sering mempercepat unit kembali.",
    sections: [
      { h: "Restart & cek startup apps", p: "Banyak aplikasi auto-start bisa bikin booting lambat." },
      { h: "Cek storage", p: "Jika storage < 10% sisa, performa akan turun drastis. Bersihkan file." },
      { h: "Update Windows & driver", p: "Update yang tertunda kadang bikin sistem berat." },
    ],
  },
  {
    slug: "software-wajib-install-di-laptop-sewa",
    title: "Software Wajib Install di Laptop Sewa",
    description: "Daftar software esensial dan etika instalasi di unit sewa.",
    category: "Tips",
    date: "2026-07-31",
    readMinutes: 4,
    intro:
      "Unit sewa biasanya bersih. Install software seperlunya dan etis.",
    sections: [
      { h: "Esensial", p: "Browser, Office, antivirus, software komunikasi (Zoom/Meet)." },
      { h: "Hindari software bajakan", p: "Risiko hukum dan virus. Pakai lisensi pribadi atau trial." },
      { h: "Uninstall sebelum dikembalikan", p: "Hapus aplikasi yang kamu install untuk privasi." },
    ],
  },
  {
    slug: "daftar-spesifikasi-minimum-untuk-wfh",
    title: "Daftar Spesifikasi Minimum untuk WFH",
    description: "Spek laptop yang nyaman untuk Work From Home harian.",
    category: "Spesifikasi",
    date: "2026-08-02",
    readMinutes: 5,
    intro:
      "WFH menuntut laptop yang stabil untuk meeting, browser banyak tab, dan tools kerja harian.",
    sections: [
      { h: "Core i3 generasi baru atau Ryzen 3", p: "Cukup untuk Office + Zoom + browser." },
      { h: "RAM 8GB minimum, 16GB nyaman", p: "Tergantung berat tools kamu." },
      { h: "Webcam HD & mic jernih", p: "Penting untuk meeting profesional." },
    ],
  },
  {
    slug: "redmibook-untuk-mahasiswa-review-singkat",
    title: "RedmiBook untuk Mahasiswa: Review Singkat",
    description: "Apakah RedmiBook layak disewa untuk kebutuhan kuliah dan tugas mahasiswa?",
    category: "Perbandingan",
    date: "2026-08-04",
    readMinutes: 5,
    intro:
      "RedmiBook tampil cantik dengan harga sewa kompetitif. Cocok untuk mahasiswa?",
    sections: [
      { h: "Desain & bobot", p: "Slim, layar 14 inci, nyaman dibawa ke kampus." },
      { h: "Performa harian", p: "i3/i5 dengan RAM 8GB cukup untuk Office, riset, dan Zoom." },
      { h: "Kekurangan", p: "Layar standar dan keyboard kurang travel dibanding ThinkPad." },
    ],
  },
  {
    slug: "asus-untuk-multitasking-kantor",
    title: "ASUS untuk Multitasking Kantor",
    description: "Pilihan ASUS untuk pekerja kantoran dengan multitasking tinggi.",
    category: "Perbandingan",
    date: "2026-08-06",
    readMinutes: 5,
    intro:
      "ASUS VivoBook dan ExpertBook jadi pilihan populer di kelas mid-range.",
    sections: [
      { h: "Performance", p: "Pilihan Ryzen 5/i5 dengan RAM 8–16GB cocok untuk multitasking ringan-berat." },
      { h: "Layar", p: "Banyak unit ASUS sudah pakai panel IPS dengan bezel tipis." },
      { h: "Konektivitas", p: "USB-A, USB-C, HDMI cukup lengkap untuk meeting kantor." },
    ],
  },
  {
    slug: "acer-aspire-pilihan-hemat-untuk-sewa",
    title: "Acer Aspire: Pilihan Hemat untuk Sewa",
    description: "Mengapa Acer Aspire jadi salah satu unit sewa termurah dengan performa cukup.",
    category: "Perbandingan",
    date: "2026-08-08",
    readMinutes: 4,
    intro:
      "Acer Aspire menonjol di kategori value-for-money untuk penyewa hemat.",
    sections: [
      { h: "Harga sewa kompetitif", p: "Biasanya termasuk paket termurah di vendor." },
      { h: "Spek standar cukup", p: "Cukup untuk Office, browser, dan Zoom." },
      { h: "Cocok untuk acara volume", p: "Pilihan favorit untuk training dan TO." },
    ],
  },
  {
    slug: "macbook-air-m1-hemat-baterai-untuk-mobile-worker",
    title: "MacBook Air M1: Hemat Baterai untuk Mobile Worker",
    description: "Kenapa MacBook Air M1 jadi favorit pekerja yang sering pindah lokasi.",
    category: "Perbandingan",
    date: "2026-08-10",
    readMinutes: 5,
    intro:
      "MacBook Air M1 punya kombinasi langka: ringan, senyap, dan baterai super panjang.",
    sections: [
      { h: "Baterai 10+ jam", p: "Cukup untuk seharian kerja tanpa colokan." },
      { h: "Fanless & senyap", p: "Tidak ada kipas, nyaman dipakai di tempat tenang seperti cafe atau kelas." },
      { h: "Cocok untuk creator", p: "M1 sanggup edit video 1080p dengan lancar." },
    ],
  },
  {
    slug: "sewa-laptop-di-jakarta-selatan-rekomendasi",
    title: "Sewa Laptop di Jakarta Selatan: Rekomendasi",
    description: "Panduan menemukan vendor sewa laptop di Jakarta Selatan yang reliable.",
    category: "Lokasi",
    date: "2026-08-12",
    readMinutes: 4,
    intro:
      "Jakarta Selatan jadi pusat aktivitas startup dan freelancer. Banyak pilihan vendor sewa laptop.",
    sections: [
      { h: "Cek reputasi & portofolio", p: "Pilih vendor yang sering kerja sama dengan event organizer dan corporate." },
      { h: "Layanan antar gratis", p: "Banyak vendor Jakarta Selatan gratis ongkir di zona yang sama." },
      { h: "Bandingkan paket bulanan", p: "Untuk pekerja remote, bandingkan minimal 2–3 vendor." },
    ],
  },
  {
    slug: "sewa-laptop-mendadak-tips-cepat-dan-aman",
    title: "Sewa Laptop Mendadak: Tips Cepat & Aman",
    description: "Cara menyewa laptop dalam hitungan jam tanpa terjebak vendor abal-abal.",
    category: "Tips",
    date: "2026-08-14",
    readMinutes: 4,
    intro:
      "Laptopmu rusak menjelang deadline? Sewa mendadak bisa dilakukan, tapi tetap utamakan keamanan.",
    sections: [
      { h: "Hubungi vendor yang sudah jelas track record", p: "Cari yang punya alamat fisik dan respons cepat di WhatsApp." },
      { h: "Siapkan dokumen lengkap", p: "KTP, KK, dan dokumen pendukung agar verifikasi cepat." },
      { h: "Bayar saat unit datang", p: "Hindari transfer penuh sebelum unit di tangan." },
    ],
  },
  {
    slug: "checklist-lengkap-sebelum-mengembalikan-laptop-sewa",
    title: "Checklist Lengkap Sebelum Mengembalikan Laptop Sewa",
    description: "Daftar yang harus dicek sebelum mengembalikan unit untuk menghindari denda.",
    category: "Tips",
    date: "2026-08-16",
    readMinutes: 4,
    intro:
      "Pengembalian unit harus rapi agar tidak ada potongan deposit.",
    sections: [
      { h: "Backup & logout akun", p: "Pindahkan file penting dan logout semua akun (browser, Outlook, dll)." },
      { h: "Factory reset jika diizinkan", p: "Beberapa vendor minta unit dikembalikan apa adanya; konfirmasi dulu." },
      { h: "Bersihkan & lengkapi aksesoris", p: "Charger, tas, dan aksesoris harus lengkap sesuai serah terima awal." },
    ],
  },
];

export const ctaText = CTA;
