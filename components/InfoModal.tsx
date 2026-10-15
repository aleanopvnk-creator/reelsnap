"use client";

import React, { useEffect } from "react";
import { X, ShieldCheck, FileText, HelpCircle, AlertTriangle, ArrowRight } from "lucide-react";

export type ModalTab = "privacy" | "terms" | "help";

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: ModalTab;
  setActiveTab: (tab: ModalTab) => void;
  onScrollToFaq?: () => void;
}

export default function InfoModal({
  isOpen,
  onClose,
  activeTab,
  setActiveTab,
  onScrollToFaq,
}: InfoModalProps) {
  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="info-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 md:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[92vh] sm:max-h-[85vh] flex flex-col bg-zinc-900 border border-zinc-800 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b border-zinc-800/80 bg-zinc-950/70">
          <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
            <img
              src="/icon.png"
              alt="ReelSnap Logo"
              className="w-5 h-5 sm:w-6 sm:h-6 object-contain shrink-0"
            />
            <span id="info-modal-title" className="font-bold text-white text-sm sm:text-base md:text-lg truncate">
              {activeTab === "privacy" && "Kebijakan Privasi"}
              {activeTab === "terms" && "Ketentuan Layanan"}
              {activeTab === "help" && "Pusat Bantuan ReelSnap"}
            </span>
          </div>
          <button
            onClick={onClose}
            aria-label="Tutup modal"
            className="p-1.5 sm:p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer shrink-0 ml-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation - Fully Responsive Segmented Bar without Truncation */}
        <div className="p-2 sm:p-3 bg-zinc-950/50 border-b border-zinc-800/80">
          <div className="grid grid-cols-3 gap-1 sm:gap-1.5 bg-zinc-900/90 p-1 rounded-xl sm:rounded-2xl border border-zinc-800">
            <button
              onClick={() => setActiveTab("privacy")}
              className={`flex items-center justify-center gap-1 sm:gap-1.5 py-2 sm:py-2.5 px-1 sm:px-3 rounded-lg sm:rounded-xl text-[11px] sm:text-xs md:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === "privacy"
                  ? "bg-zinc-800 text-pink-400 shadow-md border border-pink-500/30"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              <span className="sm:hidden">Privasi</span>
              <span className="hidden sm:inline">Kebijakan Privasi</span>
            </button>
            <button
              onClick={() => setActiveTab("terms")}
              className={`flex items-center justify-center gap-1 sm:gap-1.5 py-2 sm:py-2.5 px-1 sm:px-3 rounded-lg sm:rounded-xl text-[11px] sm:text-xs md:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === "terms"
                  ? "bg-zinc-800 text-purple-400 shadow-md border border-purple-500/30"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              <span className="sm:hidden">Ketentuan</span>
              <span className="hidden sm:inline">Ketentuan Layanan</span>
            </button>
            <button
              onClick={() => setActiveTab("help")}
              className={`flex items-center justify-center gap-1 sm:gap-1.5 py-2 sm:py-2.5 px-1 sm:px-3 rounded-lg sm:rounded-xl text-[11px] sm:text-xs md:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === "help"
                  ? "bg-zinc-800 text-amber-400 shadow-md border border-amber-500/30"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              <span className="sm:hidden">Bantuan</span>
              <span className="hidden sm:inline">Panduan Bantuan</span>
            </button>
          </div>
        </div>

        {/* Modal Body Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 text-xs sm:text-sm text-zinc-300 leading-relaxed custom-scrollbar">
          {/* TAB: PRIVASI */}
          {activeTab === "privacy" && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-3.5 rounded-xl bg-pink-950/20 border border-pink-900/30 flex items-start gap-2.5 sm:gap-3">
                <ShieldCheck className="w-5 h-5 text-pink-400 shrink-0 mt-0.5" />
                <p className="text-pink-200/90 text-xs sm:text-sm leading-relaxed">
                  ReelSnap berkomitmen penuh menjaga privasi dan keamanan digital Anda. Kami tidak memerlukan data login, akun Instagram, atau informasi sensitif apa pun.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-white text-sm sm:text-base mb-1">
                  1. Informasi yang Kami Kumpulkan
                </h4>
                <p className="text-zinc-400 leading-relaxed">
                  Kami <strong>tidak pernah meminta atau menyimpan</strong> data kredensial pribadi seperti username, password Instagram, alamat email, atau riwayat unduhan pribadi Anda. Semua proses unduhan berlangsung anonim.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-white text-sm sm:text-base mb-1">
                  2. Pemrosesan Media Instagram
                </h4>
                <p className="text-zinc-400 leading-relaxed">
                  Tautan URL Instagram yang Anda inputkan hanya diproses secara real-time oleh server kami untuk mengambil link unduhan publik dari CDN Instagram/Meta. Server ReelSnap <strong>tidak menyimpan file video atau foto Anda secara permanen</strong>.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-white text-sm sm:text-base mb-1">
                  3. Penggunaan Cookie & Pelacakan
                </h4>
                <p className="text-zinc-400 leading-relaxed">
                  ReelSnap tidak menggunakan cookie pelacak pribadi yang invasif. Kami hanya dapat menggunakan penyimpanan lokal ringan browser untuk keperluan performa dan fungsionalitas antarmuka.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-white text-sm sm:text-base mb-1">
                  4. Keamanan Transmisi Data
                </h4>
                <p className="text-zinc-400 leading-relaxed">
                  Seluruh komunikasi data di ReelSnap terlindungi dengan enkripsi SSL/HTTPS tingkat tinggi untuk memastikan keamanan koneksi antara perangkat Anda dan server kami.
                </p>
              </div>
            </div>
          )}

          {/* TAB: KETENTUAN LAYANAN */}
          {activeTab === "terms" && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-3.5 rounded-xl bg-purple-950/20 border border-purple-900/30 flex items-start gap-2.5 sm:gap-3">
                <FileText className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                <p className="text-purple-200/90 text-xs sm:text-sm leading-relaxed">
                  Dengan menggunakan ReelSnap, Anda menyetujui ketentuan pemanfaatan layanan untuk tujuan pribadi yang sah dan menghormati hak cipta kreator.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-white text-sm sm:text-base mb-1">
                  1. Ruang Lingkup Layanan
                </h4>
                <p className="text-zinc-400 leading-relaxed">
                  ReelSnap adalah alat bantu gratis berbasis web yang dirancang untuk mempermudah pengunduhan video Reels, video postingan, dan foto dari akun Instagram yang bersifat <strong>publik</strong>.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-white text-sm sm:text-base mb-1">
                  2. Hak Cipta dan Kepemilikan Konten
                </h4>
                <p className="text-zinc-400 leading-relaxed">
                  Seluruh hak cipta, hak merek dagang, musik latar, serta konten video/gambar tetap merupakan hak milik penuh dari masing-masing kreator konten atau Meta Platforms, Inc. ReelSnap tidak mengklaim kepemilikan apa pun atas konten yang diunduh.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-white text-sm sm:text-base mb-1">
                  3. Tanggung Jawab Pengguna
                </h4>
                <p className="text-zinc-400 leading-relaxed">
                  Pengguna bertanggung jawab penuh atas penggunaan konten yang diunduh. Layanan ini hanya boleh digunakan untuk kepentingan pribadi, backup arsip, edukasi, atau referensi non-komersial (fair use). Dilarang keras menyebarluaskan kembali konten milik orang lain untuk tujuan komersial tanpa izin resmi dari pemilik konten.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-white text-sm sm:text-base mb-1">
                  4. Pernyataan Penafian (Disclaimer)
                </h4>
                <p className="text-zinc-400 leading-relaxed">
                  ReelSnap tidak berafiliasi, didukung, disponsori, atau secara resmi bermitra dengan Instagram, Facebook, atau Meta Platforms, Inc. Nama &quot;Instagram&quot; serta logonya adalah merek dagang terdaftar milik Meta Platforms, Inc.
                </p>
              </div>
            </div>
          )}

          {/* TAB: BANTUAN */}
          {activeTab === "help" && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-900/30 flex items-start gap-2.5 sm:gap-3">
                <HelpCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <p className="text-amber-200/90 text-xs sm:text-sm leading-relaxed">
                  Ikuti panduan ringkas berikut untuk mengunduh video Reels atau postingan Instagram dengan mudah.
                </p>
              </div>

              <div className="space-y-2.5 sm:space-y-3">
                <h4 className="font-bold text-white text-sm sm:text-base">
                  Cara Download Video Instagram:
                </h4>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/80">
                  <div className="w-6 h-6 rounded-lg bg-pink-500/20 text-pink-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <strong className="text-white block mb-0.5 text-xs sm:text-sm">Salin Tautan Video</strong>
                    <span className="text-zinc-400 text-xs leading-relaxed">
                      Buka aplikasi Instagram, pilih Reels/video yang ingin diunduh, ketuk tombol <strong>Bagikan (Share)</strong>, lalu pilih <strong>Salin Tautan (Copy Link)</strong>.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/80">
                  <div className="w-6 h-6 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <strong className="text-white block mb-0.5 text-xs sm:text-sm">Tempelkan di ReelSnap</strong>
                    <span className="text-zinc-400 text-xs leading-relaxed">
                      Kembali ke ReelSnap, klik tombol <strong>Tempel</strong> pada formulir input di atas, lalu tekan tombol <strong>Download</strong>.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/80">
                  <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <strong className="text-white block mb-0.5 text-xs sm:text-sm">Simpan Video HD</strong>
                    <span className="text-zinc-400 text-xs leading-relaxed">
                      Setelah preview muncul, klik tombol <strong>Download Video HD (.MP4)</strong> untuk menyimpan langsung file ke galeri Anda.
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-zinc-800/80">
                <h4 className="font-bold text-white text-xs sm:text-sm mb-2 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  Kendala Umum (Troubleshooting)
                </h4>
                <ul className="text-zinc-400 text-xs space-y-1.5 list-disc list-inside leading-relaxed">
                  <li>
                    <strong>Akun Private:</strong> Video dari akun private Instagram tidak dapat diunduh demi melindungi privasi pemilik akun.
                  </li>
                  <li>
                    <strong>Tautan Kadaluarsa:</strong> Pastikan tautan berasal dari postingan yang masih aktif (bukan Story 24 jam yang sudah hilang).
                  </li>
                  <li>
                    <strong>Browser iPhone/Safari:</strong> Jika video terbuka langsung di tab baru bukannya terunduh, tahan tombol video lalu pilih &quot;Save Video&quot;.
                  </li>
                </ul>
              </div>

              {onScrollToFaq && (
                <div className="pt-2">
                  <button
                    onClick={() => {
                      onClose();
                      onScrollToFaq();
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-medium text-xs sm:text-sm transition-all cursor-pointer"
                  >
                    <span>Buka Pertanyaan yang Sering Diajukan (FAQ)</span>
                    <ArrowRight className="w-4 h-4 text-pink-400" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 sm:px-6 py-3 sm:py-3.5 border-t border-zinc-800/80 bg-zinc-950/70 flex items-center justify-between text-xs text-zinc-500">
          <span className="text-[11px] sm:text-xs">&copy; 2026 ReelSnap</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 sm:py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-medium text-xs sm:text-sm transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
