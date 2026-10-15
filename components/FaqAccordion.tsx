"use client";

import React, { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { Language } from "@/lib/translations";

interface FaqItem {
  question: string;
  answer: string;
}

const FAQ_LIST_ID: FaqItem[] = [
  {
    question: "Apakah layanan ReelSnap ini 100% gratis?",
    answer:
      "Ya, ReelSnap sepenuhnya gratis dan dapat digunakan tanpa batas kapan pun Anda butuhkan. Tidak ada biaya langganan, tanpa pendaftaran akun, dan tanpa perlu memasang aplikasi tambahan apa pun.",
  },
  {
    question: "Apakah saya harus masuk (login) dengan akun Instagram saya?",
    answer:
      "Sama sekali tidak! Keamanan dan privasi Anda terjamin 100%. Kami tidak pernah meminta nama pengguna, kata sandi, ataupun akses akun media sosial Anda. Cukup salin tautan video publik dan tempel pada formulir unduhan.",
  },
  {
    question: "Bisakah mengunduh video atau foto dari akun Instagram yang dikunci (privat)?",
    answer:
      "Demi menghormati privasi pemilik akun serta mematuhi ketentuan hak cipta, ReelSnap hanya mendukung pengunduhan konten dari akun Instagram yang bersifat publik (tidak dikunci/privat).",
  },
  {
    question: "Bagaimana cara download video Reels dan foto di iPhone (iOS)?",
    answer:
      "Di browser Safari (iOS 13+), cukup ketuk tombol 'Download Video HD' atau 'Download Foto HD'. Safari akan menampilkan jendela konfirmasi unduhan. Setelah selesai, ketuk ikon panah unduhan di samping kolom alamat Safari, pilih berkas dan ketuk 'Simpan Video' atau 'Simpan Gambar' untuk menyimpannya langsung ke galeri Foto Anda.",
  },
  {
    question: "Apakah video Reels dan foto hasil download memiliki watermark?",
    answer:
      "Sama sekali tanpa watermark! Semua video Reels dan foto postingan yang Anda unduh melalui ReelSnap bersih 100% tanpa watermark, logo, atau username yang menutupi konten Anda. Kualitas file adalah resolusi Full HD asli (1080p).",
  },
  {
    question: "Bisakah mengunduh musik atau audio MP3 saja dari video Instagram Reels?",
    answer:
      "Tentu saja! ReelSnap menyediakan fitur 'Download Audio (.MP3)' berkecepatan tinggi dengan bit rate 192 kbps jernih. Suara latar atau musik dari video Reels akan diekstrak langsung ke format MP3 yang kompatibel dengan semua pemutar musik.",
  },
  {
    question: "Format media apa saja yang didukung oleh ReelSnap?",
    answer:
      "ReelSnap mendukung download Video Reels & Feed (.MP4 kualitas Full HD), konversi audio (.MP3 192 kbps), serta Postingan Foto (.JPG resolusi HD orisinal tanpa watermark dan tanpa terpotong).",
  },
  {
    question: "Di mana berkas video dan audio tersimpan setelah selesai diunduh?",
    answer:
      "Di komputer (Windows/Mac) dan ponsel Android, berkas langsung tersimpan di folder 'Downloads' atau 'Unduhan' peramban Anda. Di iPhone, berkas video dan foto masuk ke galeri Foto atau aplikasi File, dan berkas MP3 tersimpan di folder Unduhan.",
  },
];

const FAQ_LIST_EN: FaqItem[] = [
  {
    question: "Is ReelSnap 100% free to use?",
    answer:
      "Yes, ReelSnap is completely free and unlimited forever. There are no subscriptions, no account registrations, and no third-party software installations required.",
  },
  {
    question: "Do I need to log in with my Instagram credentials?",
    answer:
      "Never! Your security and privacy are 100% protected. We never ask for your username, password, or Instagram account access. Simply paste a public post or Reel URL to download.",
  },
  {
    question: "Can I download media from private Instagram accounts?",
    answer:
      "To respect user privacy and comply with Meta copyright guidelines, ReelSnap only extracts content from public Instagram profiles.",
  },
  {
    question: "How do I download Instagram videos on iPhone (iOS)?",
    answer:
      "In Safari (iOS 13+), tap 'Download HD Video'. A download confirmation prompt will appear. Once finished, tap the blue arrow icon in Safari's address bar, choose the file, and tap 'Save Video' to store it in your Photos app.",
  },
  {
    question: "Does downloaded content contain any watermarks?",
    answer:
      "Zero watermarks! The files you download are streamed directly from Instagram CDN servers at original high resolution (HD / 1080p) with no added logos or stamps.",
  },
  {
    question: "Can I extract only the audio (MP3) from Instagram Reels?",
    answer:
      "Yes! ReelSnap features high-speed 192 kbps MP3 conversion. Any sound or background music track can be saved directly as an MP3 file playable on all mobile and desktop music players.",
  },
  {
    question: "What media formats are supported by ReelSnap?",
    answer:
      "ReelSnap supports downloading Instagram Reels Video (.MP4 Full HD), audio/music track extraction (.MP3 at 192 kbps), and HD Photo Posts (.JPG at original full resolution, never cropped).",
  },
  {
    question: "Where are downloaded files saved on my device?",
    answer:
      "On Windows, Mac, and Android, files land in your browser's default 'Downloads' folder. On iPhone/iPad, video files appear in your Photos or Files app, and MP3 files save in your Downloads directory.",
  },
];

interface FaqAccordionProps {
  lang?: Language;
}

export default function FaqAccordion({ lang = "id" }: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const faqList = lang === "en" ? FAQ_LIST_EN : FAQ_LIST_ID;

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-2.5 sm:space-y-3">
      {faqList.map((item, idx) => {
        const isOpen = openIndex === idx;
        return (
          <div
            key={idx}
            className="rounded-xl sm:rounded-2xl border-2 border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 transition-all duration-200 overflow-hidden shadow-sm"
          >
            <button
              type="button"
              onClick={() => toggle(idx)}
              className="w-full py-3.5 px-4 sm:py-4 sm:px-6 flex items-center justify-between text-left gap-3 hover:bg-slate-50 dark:hover:bg-zinc-800/40 transition-colors cursor-pointer"
              aria-expanded={isOpen}
            >
              <div className="flex items-center gap-2.5 sm:gap-3 flex-1 pr-2">
                <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5 text-pink-600 dark:text-pink-400 shrink-0" />
                <span className="font-extrabold text-slate-950 dark:text-white text-xs sm:text-sm md:text-base leading-snug">
                  {item.question}
                </span>
              </div>
              <ChevronDown
                className={`w-4 h-4 sm:w-5 sm:h-5 text-slate-500 dark:text-zinc-400 transition-transform duration-300 shrink-0 ${
                  isOpen ? "rotate-180 text-pink-600 dark:text-pink-400" : ""
                }`}
              />
            </button>
            {isOpen && (
              <div className="px-4 pb-4 sm:px-6 sm:pb-5 pt-1 text-xs sm:text-sm font-semibold text-slate-700 dark:text-zinc-200 leading-relaxed border-t border-slate-200 dark:border-zinc-800/60">
                {item.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
