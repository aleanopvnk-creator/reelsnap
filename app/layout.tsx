import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#09090b",
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://reelsnap.app"),
  title: "ReelSnap - Unduh Video Instagram Reels, Post HD Tanpa Watermark",
  description:
    "ReelSnap adalah aplikasi pengunduh video Instagram Reels Dan Post kualitas HD (1080p) gratis tanpa watermark. Cepat, aman, tanpa aplikasi tambahan, kompatibel dengan Android, iPhone (iOS), dan PC.",
  keywords: [
    "ReelSnap",
    "Instagram Reels Downloader",
    "Download Video Instagram",
    "Unduh Reels IG Tanpa Watermark",
    "Instagram Video Downloader HD",
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
    title: "ReelSnap - Unduh Video Instagram Reels & Post HD Tanpa Watermark",
    description:
      "Download video Instagram Reels & Post kualitas 1080p tanpa watermark secara instan dan gratis dengan ReelSnap.",
  },
  twitter: {
    card: "summary_large_image",
    title: "ReelSnap - Unduh Video Instagram Reels & Post HD Tanpa Watermark",
    description:
      "Download video Instagram Reels & Post kualitas 1080p tanpa watermark secara instan dan gratis dengan ReelSnap.",
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
        "ReelSnap adalah aplikasi web pengunduh video Instagram Reels dan Post kualitas tinggi tanpa watermark secara cepat dan gratis.",
    },
    {
      "@type": "HowTo",
      name: "Cara Mengunduh Video Reels Instagram dengan ReelSnap",
      description: "Panduan 3 langkah mudah mengunduh video Instagram Reels dalam kualitas Full HD menggunakan ReelSnap.",
      step: [
        {
          "@type": "HowToStep",
          name: "Langkah 1: Salin Tautan (Copy Link)",
          text: "Buka aplikasi Instagram, pilih video Reels yang ingin diunduh, klik ikon Bagikan (Pesawat Kertas) lalu pilih 'Salin Tautan'.",
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
          name: "Langkah 3: Unduh Video HD",
          text: "Klik tombol 'Download', pratinjau video akan muncul. Klik tombol 'Download Video HD (.MP4)' untuk menyimpan video ke perangkat Anda.",
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
    <html lang="id" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-zinc-950 text-zinc-100 antialiased selection:bg-pink-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
