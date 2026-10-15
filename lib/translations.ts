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
    audio: string;
    photo: string;
    placeholders: {
      reels: string;
      audio: string;
      photo: string;
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
    preparingPhoto: string;
    downloadAnother: string;
    videoBadge: string;
    photoBadge: string;
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
    pills: {
      pill1: string;
      pill2: string;
      pill3: string;
    };
    bento: {
      card1Title: string;
      card1Desc: string;
      card2Title: string;
      card2Desc: string;
      card3Title: string;
      card3Desc: string;
      card4Title: string;
      card4Desc: string;
    };
  };
  footer: {
    tagline: string;
    statusActive: string;
    platforms: string;
    col2Title: string;
    serviceReels: string;
    serviceAudio: string;
    servicePhoto: string;
    col3Title: string;
    navHome: string;
    navHowTo: string;
    navFeatures: string;
    navFaq: string;
    navAbout: string;
    col4Title: string;
    legalPrivacy: string;
    legalTerms: string;
    legalDmca: string;
    legalHelp: string;
    disclaimer: string;
    copyright: string;
    tagBottomRight: string;
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
      audio: "Audio MP3",
      photo: "Foto HD",
      placeholders: {
        reels: "Tempel tautan video Instagram Reels di sini...",
        audio: "Tempel tautan Reels untuk ekstrak Audio MP3 (192 kbps)...",
        photo: "Tempel tautan postingan foto Instagram HD di sini...",
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
      supportedLinksInfo: "ⓘ Mendukung tautan resmi instagram.com/reel, /reels, /p, dan instagr.am",
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
      preparingPhoto: "Menyiapkan Foto HD...",
      downloadAnother: "Download Media Lainnya",
      videoBadge: "Instagram Reels HD",
      photoBadge: "Postingan Foto HD",
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
      badge: "EKOSISTEM MEDIA INSTAGRAM",
      title: "Dirancang Khusus untuk Menyimpan Momen Visual & Audio Instagram",
      p1: "ReelSnap dibangun khusus untuk menangani format media Instagram—mulai dari video vertikal Reels beresolusi tinggi, foto postingan Full HD jernih tanpa kompresi, hingga ekstraksi musik latar atau sound asli menjadi berkas MP3 berkualitas jernih.",
      p2: "Sistem kami berjalan langsung melalui jalur streaming terenkripsi ke jaringan CDN resmi Instagram tanpa menyimpan riwayat tautan pengguna di database, dilengkapi proteksi keamanan server otomatis dan sepenuhnya bebas dari iklan pop-up yang mengganggu.",
      pills: {
        pill1: "✓ Tanpa Login Akun",
        pill2: "✓ Bebas Tanda Air",
        pill3: "✓ Kompatibel iOS & Android",
      },
      bento: {
        card1Title: "Unduhan Video Reels",
        card1Desc: "Simpan video Reels vertikal kualitas 1080p MP4 dengan rasio asli dan bebas watermark.",
        card2Title: "Foto Postingan HD",
        card2Desc: "Resolusi visual utuh sesuai unggahan asli kreator tanpa kompresi gambar.",
        card3Title: "Konverter Audio MP3",
        card3Desc: "Pisahkan musik atau suara latar Reels menjadi file audio 192 kbps jernih.",
        card4Title: "Privasi Tanpa Jejak",
        card4Desc: "0% penyimpanan database. Riwayat hanya tersimpan lokal di perangkat Anda.",
      },
    },
    footer: {
      tagline:
        "Solusi instan pengunduh konten kreatif Instagram—simpan Reels, foto HD, dan audio MP3 langsung ke galeri perangkat Anda tanpa batas.",
      statusActive: "Jaringan Ekstraksi Instagram Aktif",
      platforms: "iPhone / iPad • Android • Windows & Mac",
      col2Title: "LAYANAN INSTAGRAM",
      serviceReels: "Pengunduh Video Reels",
      serviceAudio: "Ekstraktor Audio MP3",
      servicePhoto: "Pengunduh Foto HD",
      col3Title: "PANDUAN & FITUR",
      navHome: "Beranda Utama",
      navHowTo: "Cara Mengunduh (3 Langkah)",
      navFeatures: "Keunggulan ReelSnap",
      navFaq: "Pertanyaan Umum (FAQ)",
      navAbout: "Mengenal ReelSnap",
      col4Title: "LEGALITAS & BANTUAN",
      legalPrivacy: "Kebijakan Privasi",
      legalTerms: "Ketentuan Layanan",
      legalDmca: "Penafian Hak Cipta (DMCA)",
      legalHelp: "Pusat Bantuan & Kontak",
      disclaimer:
        "ReelSnap adalah alat utilitas independen dan tidak berafiliasi dengan Instagram atau Meta Platforms, Inc. Seluruh hak kekayaan intelektual atas konten media yang diunduh sepenuhnya menjadi milik masing-masing kreator.",
      copyright: "Seluruh Hak Cipta Dilindungi.",
      tagBottomRight: "Dibuat untuk Kreator & Pengarsip Konten",
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
      audio: "MP3 Audio",
      photo: "HD Photo",
      placeholders: {
        reels: "Paste Instagram Reels video link here...",
        audio: "Paste Reels link to extract MP3 Audio (192 kbps)...",
        photo: "Paste Instagram HD photo link here...",
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
      supportedLinksInfo: "ⓘ Supports official links: instagram.com/reel, /reels, /p, and instagr.am",
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
      preparingPhoto: "Preparing HD Photo...",
      downloadAnother: "Download Another Media",
      videoBadge: "Instagram Reels HD",
      photoBadge: "Instagram Photo HD",
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
      badge: "INSTAGRAM MEDIA ECOSYSTEM",
      title: "Specifically Crafted to Preserve Instagram Visual & Audio Moments",
      p1: "ReelSnap is purpose-built to handle Instagram's media formats—ranging from high-resolution vertical Reels videos, crystal-clear Full HD photo posts without compression, to extracting original background audio and music into crisp MP3 files.",
      p2: "Our system operates directly via encrypted streaming conduits to official Instagram CDN networks without recording user link history in databases, fortified with automated server safeguards and 100% free of invasive pop-up ads.",
      pills: {
        pill1: "✓ No Account Login",
        pill2: "✓ Zero Watermark",
        pill3: "✓ iOS & Android Compatible",
      },
      bento: {
        card1Title: "Reels Video Downloader",
        card1Desc: "Download 1080p MP4 vertical Reels videos in original aspect ratio, watermark-free.",
        card2Title: "HD Photo Downloader",
        card2Desc: "Full visual resolution matching creator's original upload without compression.",
        card3Title: "MP3 Audio Converter",
        card3Desc: "Extract original Reels music or background sound into clean 192 kbps audio.",
        card4Title: "Zero-Trace Privacy",
        card4Desc: "0% database storage. History is strictly saved locally on your device.",
      },
    },
    footer: {
      tagline:
        "Instant downloader solution for Instagram creative content—save Reels, HD photos, and MP3 audio directly to your device gallery without limits.",
      statusActive: "Instagram Extraction Network Active",
      platforms: "iPhone / iPad • Android • Windows & Mac",
      col2Title: "INSTAGRAM SERVICES",
      serviceReels: "Reels Video Downloader",
      serviceAudio: "MP3 Audio Extractor",
      servicePhoto: "HD Photo Downloader",
      col3Title: "GUIDE & FEATURES",
      navHome: "Main Home",
      navHowTo: "How to Download (3 Steps)",
      navFeatures: "ReelSnap Advantages",
      navFaq: "Frequently Asked Questions (FAQ)",
      navAbout: "About ReelSnap",
      col4Title: "LEGAL & SUPPORT",
      legalPrivacy: "Privacy Policy",
      legalTerms: "Terms of Service",
      legalDmca: "Copyright & DMCA Disclaimer",
      legalHelp: "Help & Contact Center",
      disclaimer:
        "ReelSnap is an independent utility tool not affiliated with Instagram or Meta Platforms, Inc. All intellectual property rights of downloaded media content remain with their respective creators.",
      copyright: "All Rights Reserved.",
      tagBottomRight: "Crafted for Creators & Content Archivists",
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
