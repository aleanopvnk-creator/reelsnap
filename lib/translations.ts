export type Language = "id" | "en";

export interface TranslationDictionary {
  navbar: {
    online: string;
    installApp: string;
    installAppShort: string;
    home: string;
    howTo: string;
    features: string;
    faq: string;
    about: string;
  };
  categories: {
    reels: string;
    video: string;
    audio: string;
    placeholders: {
      reels: string;
      video: string;
      audio: string;
    };
  };
  hero: {
    badge: string;
    titleLine1: string;
    titleLine2: string;
    subtitle: string;
    placeholder: string;
    pasteBtn: string;
    clearBtn: string;
    downloadBtn: string;
    processingBtn: string;
    emptyError: string;
    clipboardError: string;
    clipboardDenied: string;
    supportedLinksInfo: string;
    dropHere: string;
  };
  history: {
    title: string;
    clear: string;
    empty: string;
    reDownload: string;
    copyLink: string;
    copied: string;
    itemsCount: string;
    justNow: string;
    minutesAgo: string;
    hoursAgo: string;
    daysAgo: string;
  };
  result: {
    creator: string;
    openInIg: string;
    captionTitle: string;
    copyCaption: string;
    copied: string;
    showMore: string;
    showLess: string;
    badges: {
      format: string;
      resolution: string;
      audio: string;
      uncropped: string;
      noWatermark: string;
    };
    downloadVideo: string;
    preparingVideo: string;
    downloadAudio: string;
    convertingAudio: string;
    downloadPhoto: string;
    downloadCurrentPhoto: string;
    downloadAllPhotos: string;
    preparingPhoto: string;
    downloadAnother: string;
    videoBadge: string;
    photoBadge: string;
    carouselBadge: string;
    slideOf: string;
    uncroppedLabel: string;
  };
  howTo: {
    title: string;
    subtitle: string;
    step1Title: string;
    step1Desc: string;
    step2Title: string;
    step2Desc: string;
    step3Title: string;
    step3Desc: string;
  };
  features: {
    title: string;
    subtitle: string;
    feat1Title: string;
    feat1Desc: string;
    feat2Title: string;
    feat2Desc: string;
    feat3Title: string;
    feat3Desc: string;
    feat4Title: string;
    feat4Desc: string;
    feat5Title: string;
    feat5Desc: string;
    feat6Title: string;
    feat6Desc: string;
  };
  faq: {
    badge: string;
    title: string;
    subtitle: string;
  };
  about: {
    badge: string;
    title: string;
    p1: string;
    p2: string;
    metric1Value: string;
    metric1Label: string;
    metric1Desc: string;
    metric2Value: string;
    metric2Label: string;
    metric2Desc: string;
    metric3Value: string;
    metric3Label: string;
    metric3Desc: string;
    metric4Value: string;
    metric4Label: string;
    metric4Desc: string;
  };
  footer: {
    tagline: string;
    followLabel: string;
    col2Title: string;
    col3Title: string;
    col4Title: string;
    navHome: string;
    navHowTo: string;
    navFeatures: string;
    navFaq: string;
    navAbout: string;
    ethicsCopyright: string;
    ethicsPublicOnly: string;
    ethicsNoStorage: string;
    ethicsSsrf: string;
    privacy: string;
    terms: string;
    dmca: string;
    help: string;
    contactIg: string;
    contactTiktok: string;
    contactWa: string;
    contactHours: string;
    disclaimer: string;
    copyright: string;
  };
  pwaModal: {
    title: string;
    iosInstructions: string;
    step1: string;
    step2: string;
    step3: string;
    close: string;
  };
}

export const translations: Record<Language, TranslationDictionary> = {
  // 100% BAHASA INDONESIA MURNI
  id: {
    navbar: {
      online: "Server Aktif",
      installApp: "Pasang Aplikasi",
      installAppShort: "Pasang",
      home: "Beranda",
      howTo: "Cara Pakai",
      features: "Keunggulan",
      faq: "FAQ",
      about: "Tentang Kami",
    },
    categories: {
      reels: "Video Reels",
      video: "Video Feed / Post",
      audio: "Audio MP3",
      placeholders: {
        reels: "Tempel tautan Instagram Reels di sini...",
        video: "Tempel tautan Video Instagram di sini...",
        audio: "Tempel tautan Reels untuk mengambil Audio MP3...",
      },
    },
    hero: {
      badge: "Download Video Reels & Foto Postingan IG Tanpa Watermark",
      titleLine1: "Download Reels & Foto Instagram",
      titleLine2: "HD & Tanpa Watermark",
      subtitle:
        "Simpan video Reels, foto postingan HD, dan audio musik MP3 Instagram favorit Anda tanpa watermark secara instan dengan ReelSnap. Cepat, gratis, kualitas HD asli, dan langsung tersimpan di galeri ponsel atau laptop Anda.",
      placeholder:
        "Tempel tautan Instagram Reels atau Foto di sini... (contoh: https://www.instagram.com/reel/... atau /p/...)",
      pasteBtn: "Tempel",
      clearBtn: "Hapus",
      downloadBtn: "Download",
      processingBtn: "Memproses...",
      emptyError: "Silakan masukkan tautan Reels atau foto Instagram terlebih dahulu.",
      clipboardError: "Peramban Anda tidak mengizinkan akses papan klip otomatis. Silakan tempel secara manual.",
      clipboardDenied: "Gagal membaca papan klip. Pastikan izin akses telah diberikan pada peramban Anda.",
      supportedLinksInfo: "ⓘ Mendukung tautan resmi instagram.com/reel, /reels, /p (karusel), dan instagr.am",
      dropHere: "Lepaskan tautan Instagram di sini untuk memproses unduhan otomatis",
    },
    history: {
      title: "Riwayat Unduhan Terakhir",
      clear: "Hapus Riwayat",
      empty: "Belum ada riwayat unduhan.",
      reDownload: "Buka / Unduh Lagi",
      copyLink: "Salin Tautan",
      copied: "Tersalin!",
      itemsCount: "berkas",
      justNow: "Baru saja",
      minutesAgo: "menit lalu",
      hoursAgo: "jam lalu",
      daysAgo: "hari lalu",
    },
    result: {
      creator: "Kreator Instagram",
      openInIg: "Buka di Instagram",
      captionTitle: "Keterangan Postingan",
      copyCaption: "Salin",
      copied: "Tersalin!",
      showMore: "Lihat Selengkapnya...",
      showLess: "Sembunyikan",
      badges: {
        format: "Format: MP4, MP3 & JPG",
        resolution: "Resolusi: Full HD Asli",
        audio: "Audio: 192 kbps",
        uncropped: "Rasio Asli (Tidak Terpotong)",
        noWatermark: "Tanpa Watermark",
      },
      downloadVideo: "Download Video HD (.MP4)",
      preparingVideo: "Menyiapkan Berkas Video HD...",
      downloadAudio: "Download Audio (.MP3)",
      convertingAudio: "Mengonversi Audio MP3...",
      downloadPhoto: "Download Foto HD (.JPG)",
      downloadCurrentPhoto: "Download Foto Ini (.JPG)",
      downloadAllPhotos: "Download Semua Foto",
      preparingPhoto: "Menyiapkan Foto HD...",
      downloadAnother: "Download Media Lainnya",
      videoBadge: "Instagram Reels HD",
      photoBadge: "Postingan Foto HD",
      carouselBadge: "Postingan Foto HD",
      slideOf: "Foto ke-",
      uncroppedLabel: "Resolusi HD Penuh • Tidak Terpotong",
    },
    howTo: {
      title: "Cara Download Reels & Foto Instagram dengan ReelSnap",
      subtitle: "Hanya butuh 3 langkah mudah untuk download Reels dan foto IG tanpa watermark",
      step1Title: "1. Salin Tautan Instagram",
      step1Desc:
        "Buka aplikasi Instagram, pilih video Reels atau foto postingan yang diinginkan, ketuk tombol Bagikan lalu pilih 'Salin Tautan'.",
      step2Title: "2. Tempel Tautan di ReelSnap",
      step2Desc:
        "Buka situs ReelSnap di browser ponsel atau laptop Anda, tempel tautan pada kolom input. ReelSnap akan otomatis mendeteksi apakah link berupa Reels atau Foto.",
      step3Title: "3. Simpan Media ke Perangkat",
      step3Desc:
        "Klik tombol 'Download Video HD' atau 'Download Foto HD'. Berkas beresolusi penuh langsung tersimpan di galeri ponsel atau komputer Anda tanpa watermark dan tanpa terpotong.",
    },
    features: {
      title: "Keunggulan ReelSnap",
      subtitle: "Layanan download Reels IG dan foto postingan HD terbaik, cepat, dan tanpa watermark",
      feat1Title: "Kualitas Full HD Asli",
      feat1Desc: "Video Reels dan foto postingan di-download dengan kualitas resolusi tinggi orisinal (1080p) tanpa pecah dan rasio penuh tidak terpotong.",
      feat2Title: "100% Tanpa Watermark",
      feat2Desc: "Video dan foto bersih tanpa watermark, logo, atau username yang menutupi konten Anda.",
      feat3Title: "Ekstrak Audio MP3 192 kbps",
      feat3Desc: "Konversi suara atau musik latar dari Reels langsung ke berkas audio MP3 berkualitas jernih.",
      feat4Title: "Deteksi Otomatis Reels & Foto",
      feat4Desc: "Satu kolom input serbaguna otomatis mendeteksi apakah link berupa video Reels, feed video, atau foto postingan HD.",
      feat5Title: "100% Gratis Tanpa Batas",
      feat5Desc: "Tidak ada biaya berlangganan, batasan unduhan harian, atau pendaftaran akun pengguna.",
      feat6Title: "Aman & Responsif",
      feat6Desc: "Tampilan responsif di semua perangkat ponsel dan komputer tanpa menyimpan data pribadi Anda.",
    },
    faq: {
      badge: "Tanya Jawab",
      title: "Pertanyaan yang Sering Diajukan",
      subtitle: "Jawaban seputar layanan download Instagram Reels dan foto postingan HD dengan ReelSnap",
    },
    about: {
      badge: "Tentang ReelSnap",
      title: "Layanan Pengunduh Media Instagram Terpercaya & Bersih",
      p1: "ReelSnap hadir sebagai platform pengunduh konten Instagram modern yang dirancang untuk kecepatan, kemudahan, dan kenyamanan pengguna di semua perangkat. Kami berkomitmen menyediakan layanan unduh video Reels, foto postingan HD (termasuk karusel foto multi-slide), serta ekstraksi audio musik MP3 192 kbps berkualitas jernih yang 100% bersih, cepat, dan sepenuhnya bebas dari iklan spam, pop-up pengalih perhatian, atau keharusan memasang aplikasi tambahan.",
      p2: "Sistem ReelSnap dibangun di atas arsitektur keamanan server berstandar tinggi: perlindungan aktif pencegahan SSRF (Server-Side Request Forgery), filter domain ketat yang hanya terhubung ke domain resmi Meta dan CDN CDN terverifikasi, pembatasan laju (rate limiting) pintar untuk mencegah bot berbahaya, serta jaminan privasi mutlak tanpa pencatatan tautan URL atau penyimpanan berkas pribadi pengguna di database kami.",
      metric1Value: "100%",
      metric1Label: "Privasi Terjaga",
      metric1Desc: "Tanpa log riwayat URL",
      metric2Value: "< 2s",
      metric2Label: "Waktu Respons",
      metric2Desc: "Ekstraksi instan kilat",
      metric3Value: "1080p",
      metric3Label: "Maksimum Resolusi",
      metric3Desc: "Kualitas Full HD asli",
      metric4Value: "MP3",
      metric4Label: "Audio Terpisah",
      metric4Desc: "Bitrate jernih 192 kbps",
    },
    footer: {
      tagline:
        "Snap Your Favorite Reels. Unduh video Instagram berkualitas tinggi dengan antarmuka yang bersih, cepat, dan mudah digunakan di segala perangkat.",
      followLabel: "IKUTI & HUBUNGI KAMI:",
      col2Title: "Navigasi Cepat",
      col3Title: "Keamanan & Etika",
      col4Title: "Media Sosial & Kontak",
      navHome: "Beranda",
      navHowTo: "Cara Pakai",
      navFeatures: "Keunggulan Layanan",
      navFaq: "Tanya Jawab (FAQ)",
      navAbout: "Tentang Kami",
      ethicsCopyright: "Hormati Hak Cipta Kreator",
      ethicsPublicOnly: "Hanya Konten Publik Sah",
      ethicsNoStorage: "Tanpa Penyimpanan Data",
      ethicsSsrf: "Protokol Keamanan SSRF",
      privacy: "Kebijakan Privasi",
      terms: "Ketentuan Layanan",
      dmca: "DMCA & Hak Cipta",
      help: "Pusat Bantuan",
      contactIg: "Instagram @reelsnap",
      contactTiktok: "TikTok @reelsnap.id",
      contactWa: "WhatsApp Support",
      contactHours: "Dukungan Cepat 24 Jam",
      disclaimer:
        "Pernyataan Hukum (Disclaimer): ReelSnap adalah platform utilitas pihak ketiga yang berdiri sendiri dan tidak berafiliasi, didukung, disponsori, atau terkait secara resmi dengan Instagram, Meta Platforms, Inc., atau entitas anak perusahaannya. Seluruh merek dagang, logo, nama akun, dan konten visual adalah hak milik dari pemilik hak cipta masing-masing. ReelSnap ditujukan hanya untuk keperluan pengarsipan pribadi yang sah sesuai dengan asas Penggunaan Wajar (Fair Use) dan perundang-undangan hak cipta yang berlaku.",
      copyright: "Hak Cipta Dilindungi Undang-Undang.",
    },
    pwaModal: {
      title: "Pasang ReelSnap di Layar Utama",
      iosInstructions: "Untuk memasang ReelSnap di iPhone / iPad Anda:",
      step1: "1. Ketuk tombol Bagikan ⎋ di bagian bawah peramban Safari.",
      step2: "2. Gulir menu ke bawah lalu pilih 'Tambah ke Layar Utama' ⊕.",
      step3: "3. Ketuk 'Tambah' di pojok kanan atas. ReelSnap siap dibuka langsung dari Layar Utama!",
      close: "Tutup",
    },
  },

  // 100% PURE ENGLISH
  en: {
    navbar: {
      online: "Server Online",
      installApp: "Install App",
      installAppShort: "Install",
      home: "Home",
      howTo: "How to Use",
      features: "Features",
      faq: "FAQ",
      about: "About Us",
    },
    categories: {
      reels: "Reels Video",
      video: "Feed Video",
      audio: "Audio MP3",
      placeholders: {
        reels: "Paste Instagram Reels link here...",
        video: "Paste Instagram Video link here...",
        audio: "Paste Reels link to extract MP3 Audio...",
      },
    },
    hero: {
      badge: "Download Instagram Reels & Photo Posts Without Watermark",
      titleLine1: "Download Instagram Reels & Photos",
      titleLine2: "HD & No Watermark",
      subtitle:
        "Save your favorite Instagram Reels, HD photo posts, and MP3 audio instantly without watermarks using ReelSnap. Fast, free, original HD quality, saved directly to your device.",
      placeholder:
        "Paste Instagram Reels or Photo link here... (e.g. https://www.instagram.com/reel/... or /p/...)",
      pasteBtn: "Paste",
      clearBtn: "Clear",
      downloadBtn: "Download",
      processingBtn: "Processing...",
      emptyError: "Please enter an Instagram Reel or photo link first.",
      clipboardError: "Your browser does not allow automatic clipboard access. Please paste manually.",
      clipboardDenied: "Failed to read clipboard. Ensure clipboard permission is granted in your browser.",
      supportedLinksInfo: "ⓘ Supports official links: instagram.com/reel, /reels, /p (carousels), and instagr.am",
      dropHere: "Drop Instagram link here to auto-process download",
    },
    history: {
      title: "Recent Downloads",
      clear: "Clear History",
      empty: "No download history yet.",
      reDownload: "Open / Download Again",
      copyLink: "Copy Link",
      copied: "Copied!",
      itemsCount: "items",
      justNow: "Just now",
      minutesAgo: "m ago",
      hoursAgo: "h ago",
      daysAgo: "d ago",
    },
    result: {
      creator: "Instagram Creator",
      openInIg: "Open in Instagram",
      captionTitle: "Post Caption",
      copyCaption: "Copy",
      copied: "Copied!",
      showMore: "Show More...",
      showLess: "Show Less",
      badges: {
        format: "Format: MP4, MP3 & JPG",
        resolution: "Resolution: Original Full HD",
        audio: "Audio: 192 kbps",
        uncropped: "Full Aspect (Uncropped)",
        noWatermark: "No Watermark",
      },
      downloadVideo: "Download HD Video (.MP4)",
      preparingVideo: "Preparing HD Video File...",
      downloadAudio: "Download Audio (.MP3)",
      convertingAudio: "Converting MP3 Audio...",
      downloadPhoto: "Download HD Photo (.JPG)",
      downloadCurrentPhoto: "Download This Photo (.JPG)",
      downloadAllPhotos: "Download All Photos",
      preparingPhoto: "Preparing HD Photo...",
      downloadAnother: "Download Another Media",
      videoBadge: "Instagram Reels HD",
      photoBadge: "Instagram Photo HD",
      carouselBadge: "Instagram Photos HD",
      slideOf: "Photo",
      uncroppedLabel: "Full HD Resolution • Never Cropped",
    },
    howTo: {
      title: "How to Download Reels & Photos with ReelSnap",
      subtitle: "Only 3 simple steps to download Instagram Reels and photos without watermark",
      step1Title: "1. Copy Instagram Link",
      step1Desc: "Open the Instagram app, choose the Reel or photo post you want, tap Share, and select 'Copy Link'.",
      step2Title: "2. Paste Link into ReelSnap",
      step2Desc: "Visit ReelSnap on your mobile or desktop browser, paste the link into the input field. ReelSnap automatically detects whether it is a Reel or Photo.",
      step3Title: "3. Save Media to Device",
      step3Desc: "Click 'Download HD Video', 'Download Audio MP3', or 'Download HD Photo'. The file will save directly to your gallery without cropping.",
    },
    features: {
      title: "ReelSnap Key Features",
      subtitle: "The best, fastest Instagram Reels and HD photo downloader without watermark",
      feat1Title: "Original Full HD Quality",
      feat1Desc: "Reels videos and photo posts are downloaded at original high-resolution (1080p) with uncropped full aspect ratio.",
      feat2Title: "100% No Watermark",
      feat2Desc: "Clean videos and photos with zero watermarks, stamps, or logos covering your media.",
      feat3Title: "Extract 192 kbps MP3",
      feat3Desc: "Convert background audio and music tracks from Reels directly into high-fidelity MP3.",
      feat4Title: "Smart Auto-Detection",
      feat4Desc: "One input handles everything: Reels, feed videos, and HD photos automatically.",
      feat5Title: "100% Free & Unlimited",
      feat5Desc: "No subscription fees, no daily download limits, and no registration required.",
      feat6Title: "Safe & Fully Responsive",
      feat6Desc: "Smoothly optimized for mobile and desktop screens without storing any personal data.",
    },
    faq: {
      badge: "FAQ",
      title: "Frequently Asked Questions",
      subtitle: "Answers about downloading Instagram Reels and HD photo posts with ReelSnap",
    },
    about: {
      badge: "About ReelSnap",
      title: "Trusted & Safe Instagram Media Downloader Service",
      p1: "ReelSnap is a modern Instagram content downloader platform engineered for speed, simplicity, and user comfort across all devices. We are dedicated to providing seamless downloading for Instagram Reels videos, HD photo posts (including multi-slide photo carousels), and crystal-clear 192 kbps MP3 music extraction—100% free from spam advertisements, misleading popups, or unnecessary app installations.",
      p2: "Built upon an enterprise-grade server security architecture: active SSRF (Server-Side Request Forgery) prevention, strict domain filtering limited exclusively to verified Meta and Instagram CDN endpoints, intelligent rate limiting against malicious abuse, and an uncompromising privacy policy with zero URL logging or user data retention in our databases.",
      metric1Value: "100%",
      metric1Label: "Privacy Protected",
      metric1Desc: "Zero URL logging policy",
      metric2Value: "< 2s",
      metric2Label: "Response Time",
      metric2Desc: "Lightning fast extraction",
      metric3Value: "1080p",
      metric3Label: "Max Resolution",
      metric3Desc: "Original Full HD quality",
      metric4Value: "MP3",
      metric4Label: "Dedicated Audio",
      metric4Desc: "Crystal clear 192 kbps",
    },
    footer: {
      tagline:
        "Snap Your Favorite Reels. Download high quality Instagram videos and photos with a clean, fast, and intuitive interface on any device.",
      followLabel: "FOLLOW & CONTACT US:",
      col2Title: "Quick Navigation",
      col3Title: "Security & Ethics",
      col4Title: "Social & Contact",
      navHome: "Home",
      navHowTo: "How to Use",
      navFeatures: "Key Features",
      navFaq: "FAQ",
      navAbout: "About Us",
      ethicsCopyright: "Respect Creator Copyright",
      ethicsPublicOnly: "Public Content Only",
      ethicsNoStorage: "Zero Data Storage",
      ethicsSsrf: "SSRF Security Protocol",
      privacy: "Privacy Policy",
      terms: "Terms of Service",
      dmca: "DMCA & Disclaimer",
      help: "Help Center",
      contactIg: "Instagram @reelsnap",
      contactTiktok: "TikTok @reelsnap.id",
      contactWa: "WhatsApp Support",
      contactHours: "24/7 Fast Community Support",
      disclaimer:
        "Legal Disclaimer: ReelSnap is an independent third-party web utility and is not affiliated, associated, authorized, endorsed by, or in any way officially connected with Instagram, Meta Platforms, Inc., or any of their subsidiaries. All trademarks, logos, and media content belong to their respective copyright owners. ReelSnap is intended strictly for personal archival use in compliance with Fair Use principles and relevant copyright laws.",
      copyright: "All Rights Reserved.",
    },
    pwaModal: {
      title: "Install ReelSnap to Home Screen",
      iosInstructions: "To install ReelSnap on your iPhone / iPad:",
      step1: "1. Tap the Share button ⎋ at the bottom of Safari.",
      step2: "2. Scroll down and tap 'Add to Home Screen' ⊕.",
      step3: "3. Tap 'Add' in the top right corner. ReelSnap is now accessible directly from your Home Screen!",
      close: "Close",
    },
  },
};
