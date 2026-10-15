import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#09090b",
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://reelsnap.app"),
  title: "ReelSnap - Download Reels & Foto Instagram HD Tanpa Watermark",
  description:
    "ReelSnap adalah situs download video Instagram Reels dan foto postingan kualitas Full HD (1080p) gratis tanpa watermark. Cepat, aman, tanpa aplikasi tambahan untuk Android, iPhone (iOS), dan PC.",
  keywords: [
    "ReelSnap",
    "Download Reels IG",
    "Download Foto Instagram HD",
    "Instagram Reels Downloader",
    "Download Postingan IG Tanpa Watermark",
    "Download Video Instagram",
    "Unduh Reels IG Tanpa Watermark",
    "Instagram Photo Downloader HD",
    "Cara Download Reels IG",
  ],
  authors: [{ name: "ReelSnap" }],
  creator: "ReelSnap",
  publisher: "ReelSnap",
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/apple-icon.png",
  },
  manifest: "/manifest.webmanifest",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "/",
    siteName: "ReelSnap",
    title: "ReelSnap - Download Reels & Foto Instagram HD Tanpa Watermark",
    description:
      "Download video Instagram Reels & Foto postingan kualitas Full HD tanpa watermark secara instan dan gratis dengan ReelSnap.",
  },
  twitter: {
    card: "summary_large_image",
    title: "ReelSnap - Download Reels & Foto Instagram HD Tanpa Watermark",
    description:
      "Download video Instagram Reels & Foto postingan kualitas Full HD tanpa watermark secara instan dan gratis dengan ReelSnap.",
  },
};

const jsonLdSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "ReelSnap",
      url: "https://reelsnap.app",
      applicationCategory: "MultimediaApplication",
      operatingSystem: "All (Android, iOS, Windows, macOS, Linux)",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      description:
        "ReelSnap adalah situs web pengunduh video Instagram Reels dan Foto postingan kualitas tinggi tanpa watermark secara cepat dan gratis.",
    },
    {
      "@type": "HowTo",
      name: "Cara Download Video Reels & Foto Instagram dengan ReelSnap",
      description: "Panduan 3 langkah mudah download video Instagram Reels dan foto postingan Full HD tanpa watermark menggunakan ReelSnap.",
      step: [
        {
          "@type": "HowToStep",
          name: "Langkah 1: Salin Tautan (Copy Link)",
          text: "Buka aplikasi Instagram, pilih video Reels atau foto postingan yang ingin diunduh, klik ikon Bagikan lalu pilih 'Salin Tautan'.",
          position: 1,
        },
        {
          "@type": "HowToStep",
          name: "Langkah 2: Tempelkan Tautan di ReelSnap",
          text: "Buka situs ReelSnap, tempelkan link Instagram ke dalam kolom input yang tersedia dengan menekan tombol 'Tempel'.",
          position: 2,
        },
        {
          "@type": "HowToStep",
          name: "Langkah 3: Download Media HD",
          text: "Klik tombol 'Download', pratinjau media akan muncul. Klik tombol 'Download Video HD' atau 'Download Foto HD' untuk menyimpan file ke perangkat Anda.",
          position: 3,
        },
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="dark" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/icon.png?v=4" type="image/png" sizes="any" />
        <link rel="shortcut icon" href="/favicon.ico?v=4" />
        <link rel="apple-touch-icon" href="/apple-icon.png?v=4" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var saved = localStorage.getItem('reelsnap_theme');
                if (saved === 'light') {
                  document.documentElement.classList.remove('dark');
                  document.documentElement.classList.add('light');
                  document.documentElement.setAttribute('data-theme', 'light');
                } else {
                  document.documentElement.classList.remove('light');
                  document.documentElement.classList.add('dark');
                  document.documentElement.setAttribute('data-theme', 'dark');
                }
              } catch (e) {}
            `,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }}
        />
      </head>
      <body className="min-h-screen flex flex-col font-sans antialiased selection:bg-pink-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
