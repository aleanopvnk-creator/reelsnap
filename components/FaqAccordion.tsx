"use client";

import React, { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

interface FaqItem {
  question: string;
  answer: string;
}

const FAQ_LIST: FaqItem[] = [
  {
    question: "Apakah layanan ReelSnap ini 100% gratis?",
    answer:
      "Ya, ReelSnap sepenuhnya gratis dan dapat digunakan tanpa batas kapan pun Anda inginkan. Tidak ada biaya langganan, tanpa registrasi, dan tanpa perlu menginstal aplikasi tambahan.",
  },
  {
    question: "Apakah saya harus login dengan akun Instagram saya?",
    answer:
      "Sama sekali tidak! Keamanan dan privasi Anda terjamin 100%. Kami tidak pernah meminta username, kata sandi, ataupun akses akun media sosial Anda. Cukup salin URL video publik dan tempel di formulir unduhan.",
  },
  {
    question: "Bisakah mengunduh video dari akun Instagram yang di-private?",
    answer:
      "Untuk menghormati privasi pemilik akun serta mematuhi kebijakan privasi, ReelSnap hanya mendukung pengunduhan konten dari akun Instagram yang bersifat publik (tidak dikunci/private).",
  },
  {
    question: "Bagaimana cara download video Reels di perangkat iPhone (iOS)?",
    answer:
      "Di browser Safari (iOS 13+), cukup klik tombol 'Download Video HD'. Safari akan menampilkan pop-up konfirmasi unduhan. Setelah selesai, ketuk ikon panah biru di samping kolom alamat Safari, lalu pilih file dan klik 'Simpan Video' untuk memasukkannya langsung ke galeri Foto Anda.",
  },
  {
    question: "Apakah video hasil unduhan memiliki watermark?",
    answer:
      "Tidak ada watermark! Video yang Anda unduh adalah file asli langsung dari server CDN Instagram dengan kualitas resolusi tertinggi (HD / 1080p) tanpa logo atau watermark tambahan apa pun.",
  },
  {
    question: "Di mana video tersimpan setelah selesai diunduh?",
    answer:
      "Di komputer (Windows/Mac) dan Android, video langsung masuk ke folder 'Downloads' atau 'Unduhan' peramban Anda. Di smartphone, video otomatis muncul di aplikasi Galeri atau File Manager.",
  },
];

export default function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-2.5 sm:space-y-3">
      {FAQ_LIST.map((item, idx) => {
        const isOpen = openIndex === idx;
        return (
          <div
            key={idx}
            className="rounded-xl sm:rounded-2xl border border-zinc-800/80 bg-zinc-900/50 transition-all duration-200 overflow-hidden shadow-sm"
          >
            <button
              type="button"
              onClick={() => toggle(idx)}
              className="w-full py-3.5 px-4 sm:py-4 sm:px-6 flex items-center justify-between text-left gap-3 hover:bg-zinc-800/40 transition-colors cursor-pointer"
              aria-expanded={isOpen}
            >
              <div className="flex items-center gap-2.5 sm:gap-3 flex-1 pr-2">
                <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5 text-pink-500 shrink-0" />
                <span className="font-semibold text-zinc-100 text-xs sm:text-sm md:text-base leading-snug">
                  {item.question}
                </span>
              </div>
              <ChevronDown
                className={`w-4 h-4 sm:w-5 sm:h-5 text-zinc-400 transition-transform duration-300 shrink-0 ${
                  isOpen ? "rotate-180 text-pink-500" : ""
                }`}
              />
            </button>
            {isOpen && (
              <div className="px-4 pb-4 sm:px-6 sm:pb-5 pt-1 text-xs sm:text-sm text-zinc-300 leading-relaxed border-t border-zinc-800/60">
                {item.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
