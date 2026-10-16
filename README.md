# 🚀 SatsetReels - Production-Ready Instagram Video Downloader

Aplikasi web Fullstack modern berstandar production untuk mengunduh video **Instagram Reels & Post** menggunakan **Next.js (App Router)**, **TypeScript**, dan **Tailwind CSS**.

---

## ✨ Fitur Utama

- **Dual-Layer Extraction Architecture**:
  - **Layer 1 (Native Scraper)**: Mengambil data langsung dari Instagram GraphQL Query (`doc_id: 8845758582119845`) dan Embed Scraper dengan header modern (`X-IG-App-ID: 936619743392459`, User-Agent browser, dll).
  - **Layer 2 (RapidAPI Fallback)**: Otomatis beralih ke RapidAPI jika IP server hosting terkena limit dari Instagram.
- **Direct Pipe Streaming Proxy (`/api/download`)**:
  - Mengatasi blokir **Cross-Origin Resource Sharing (CORS)** dari CDN Instagram (`*.cdninstagram.com`, `*.fbcdn.net`).
  - Memaksa direct file attachment download (`Content-Disposition: attachment; filename="IGReels-[shortcode].mp4"`) di browser mobile (iOS Safari & Android Chrome).
  - Dilengkapi proteksi **SSRF (Server-Side Request Forgery)**.
- **In-Memory Rate Limiting**:
  - Mencegah spam bot dengan sliding-window rate limiter per client IP.
- **UI/UX Instagram Premium**:
  - Gradien khas Instagram (`#f09433`, `#e6683c`, `#dc2743`, `#cc2366`, `#bc1888`).
  - Dark Mode & Light Mode dengan deteksi preferensi sistem dan penyimpanan di `localStorage`.
  - Tombol **"Tempel (Paste)"** otomatis menggunakan Clipboard API.
  - Preview pemutar video langsung di browser tanpa kendala CORS.
  - Tombol **"Salin Caption"** dan **"Download Thumbnail (.JPG)"**.
- **SEO & Monetisasi**:
  - Meta tags lengkap, OpenGraph, Twitter Card.
  - Schema terstruktur JSON-LD (`WebApplication` dan `HowTo`).
  - Komponen slot iklan responsif siap pakai (**Google AdSense Ready**).
  - Accordion FAQ interaktif.

---

## 📁 Struktur Proyek

```text
ig-downloader/
├── app/
│   ├── api/
│   │   ├── download/
│   │   │   └── route.ts         # Direct-pipe streaming download proxy (CORS bypass & SSRF safe)
│   │   └── extract/
│   │       └── route.ts         # Endpoint ekstraksi dengan validator & rate limiting
│   ├── globals.css              # Styling Tailwind CSS & gradien Instagram
│   ├── layout.tsx               # Root layout dengan SEO & JSON-LD
│   └── page.tsx                 # Frontend UI modern dengan preview & interaksi
├── components/
│   ├── AdSlot.tsx               # Komponen placeholder iklan AdSense-ready
│   └── FaqAccordion.tsx         # Komponen akordeon FAQ interaktif
├── lib/
│   ├── instagram.ts             # Engine Dual-Layer ekstraksi Instagram
│   └── rate-limiter.ts          # In-memory sliding-window rate limiter & IP resolver
├── .env.example                 # Template variabel lingkungan produksi
├── next.config.ts               # Konfigurasi Next.js
├── package.json                 # Dependensi proyek
└── tsconfig.json                # Konfigurasi TypeScript
```

---

## 🛠️ Instalasi & Menjalankan Lokal

1. **Clone atau buka repositori**:
   ```bash
   cd c:/xampp/htdocs/ig-downloader
   ```

2. **Instal dependensi**:
   ```bash
   npm install
   ```

3. **Salin file environment**:
   ```bash
   cp .env.example .env.local
   ```

4. **Jalankan development server**:
   ```bash
   npm run dev
   ```
   Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

5. **Build untuk production**:
   ```bash
   npm run build
   npm run start
   ```

---

## ⚙️ Konfigurasi Environment (`.env.local`)

| Variabel | Keterangan | Wajib? |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_APP_URL` | URL publik website (contoh: `https://igdownloader.app`) | Ya (untuk SEO) |
| `RAPIDAPI_KEY` | API Key RapidAPI untuk fallback jika server IP terkena blokir Instagram | Disarankan untuk Vercel/VPS |
| `RAPIDAPI_HOST` | Host RapidAPI (default: `instagram-downloader-download-instagram-videos-stories4.p.rapidapi.com`) | Opsional |
| `INSTAGRAM_COOKIE` | Cookie sesi akun Instagram untuk akses native GraphQL tanpa batas | Opsional |
| `INSTAGRAM_SESSION_ID` | Nilai `sessionid` dari cookie browser Instagram | Opsional |

---

## 🚀 Panduan Deploy ke Vercel

1. **Push kode ke GitHub/GitLab/Bitbucket**:
   ```bash
   git init
   git add .
   git commit -m "feat: initial production-ready instagram downloader"
   git branch -M main
   git remote add origin https://github.com/USERNAME/ig-downloader.git
   git push -u origin main
   ```

2. **Import ke Vercel**:
   - Masuk ke [https://vercel.com](https://vercel.com).
   - Klik **"Add New Project"** lalu pilih repositori `ig-downloader`.
   - Vercel akan otomatis mendeteksi framework **Next.js**.

3. **Atur Environment Variables di Vercel Dashboard**:
   - `NEXT_PUBLIC_APP_URL`: Masukkan domain produksi Anda (misal: `https://your-domain.vercel.app`).
   - `RAPIDAPI_KEY`: Masukkan key RapidAPI Anda (sangat disarankan karena IP datacenter cloud publik seperti AWS/Vercel sering dibatasi oleh Instagram).

4. **Klik "Deploy"**:
   - Vercel akan menjalankan `npm run build` dan menghasilkan deployment berkecepatan tinggi di Global Edge Network.

---

## ⚖️ Lisensi & Disclaimer

Aplikasi ini dibuat untuk tujuan edukasi dan penggunaan pribadi. Seluruh hak cipta, merek dagang, dan konten Instagram adalah milik Meta Platforms, Inc.
