"use client";

import React, { useEffect } from "react";
import {
  X,
  ShieldCheck,
  FileText,
  HelpCircle,
  AlertTriangle,
  Scale,
  Mail,
  ExternalLink,
  ArrowRight,
} from "lucide-react";
import { Language } from "@/lib/translations";

export type ModalTab = "privacy" | "terms" | "dmca" | "help";

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: ModalTab;
  setActiveTab: (tab: ModalTab) => void;
  onScrollToFaq?: () => void;
  lang?: Language;
}

export default function InfoModal({
  isOpen,
  onClose,
  activeTab,
  setActiveTab,
  onScrollToFaq,
  lang = "id",
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

  const isId = lang === "id";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="info-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 md:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[92vh] sm:max-h-[86vh] flex flex-col bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b border-slate-200 dark:border-zinc-800/80 bg-slate-50/90 dark:bg-zinc-950/70">
          <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
            <img
              src="/icon.png"
              alt="SatsetReels Logo"
              className="w-5 h-5 sm:w-6 sm:h-6 object-contain shrink-0"
            />
            <span id="info-modal-title" className="font-bold text-slate-900 dark:text-white text-sm sm:text-base md:text-lg truncate">
              {activeTab === "privacy" && (isId ? "Kebijakan Privasi" : "Privacy Policy")}
              {activeTab === "terms" && (isId ? "Ketentuan Layanan" : "Terms of Service")}
              {activeTab === "dmca" && (isId ? "DMCA & Penafian" : "DMCA & Disclaimer")}
              {activeTab === "help" && (isId ? "Pusat Bantuan & Kontak" : "Help & Contact Center")}
            </span>
          </div>
          <button
            onClick={onClose}
            aria-label={isId ? "Tutup jendela" : "Close modal"}
            className="p-1.5 sm:p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-200/60 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-zinc-800 transition-colors cursor-pointer shrink-0 ml-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation - 4 Segmented Capsules */}
        <div className="p-2 sm:p-2.5 bg-slate-50 dark:bg-zinc-950/70 border-b border-slate-200 dark:border-zinc-800/80">
          <div className="grid grid-cols-4 gap-1 bg-slate-200/60 dark:bg-zinc-900 p-1 rounded-xl border border-slate-200 dark:border-zinc-800">
            <button
              onClick={() => setActiveTab("privacy")}
              className={`flex items-center justify-center gap-1 sm:gap-1.5 py-1.5 sm:py-2 px-1 sm:px-2 rounded-lg text-[10.5px] sm:text-xs font-medium transition-all cursor-pointer ${
                activeTab === "privacy"
                  ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm font-semibold"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
              <span>{isId ? "Privasi" : "Privacy"}</span>
            </button>
            <button
              onClick={() => setActiveTab("terms")}
              className={`flex items-center justify-center gap-1 sm:gap-1.5 py-1.5 sm:py-2 px-1 sm:px-2 rounded-lg text-[10.5px] sm:text-xs font-medium transition-all cursor-pointer ${
                activeTab === "terms"
                  ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm font-semibold"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
              }`}
            >
              <FileText className="w-3.5 h-3.5 shrink-0" />
              <span>{isId ? "Ketentuan" : "Terms"}</span>
            </button>
            <button
              onClick={() => setActiveTab("dmca")}
              className={`flex items-center justify-center gap-1 sm:gap-1.5 py-1.5 sm:py-2 px-1 sm:px-2 rounded-lg text-[10.5px] sm:text-xs font-medium transition-all cursor-pointer ${
                activeTab === "dmca"
                  ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm font-semibold"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
              }`}
            >
              <Scale className="w-3.5 h-3.5 shrink-0" />
              <span>DMCA</span>
            </button>
            <button
              onClick={() => setActiveTab("help")}
              className={`flex items-center justify-center gap-1 sm:gap-1.5 py-1.5 sm:py-2 px-1 sm:px-2 rounded-lg text-[10.5px] sm:text-xs font-medium transition-all cursor-pointer ${
                activeTab === "help"
                  ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm font-semibold"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{isId ? "Bantuan" : "Help"}</span>
            </button>
          </div>
        </div>

        {/* Modal Body Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 text-xs sm:text-sm text-slate-700 dark:text-zinc-300 leading-relaxed custom-scrollbar">
          {/* TAB: PRIVACY POLICY (Google AdSense Compliant) */}
          {activeTab === "privacy" && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-3.5 rounded-xl bg-pink-50 border-2 border-pink-200 text-pink-900 dark:bg-pink-950/20 dark:border-pink-900/30 dark:text-pink-200 flex items-start gap-2.5 sm:gap-3">
                <ShieldCheck className="w-5 h-5 text-pink-600 dark:text-pink-400 shrink-0 mt-0.5" />
                <p className="text-xs sm:text-sm leading-relaxed font-bold">
                  {isId
                    ? "SatsetReels menghormati privasi Anda. Layanan ini dapat digunakan secara 100% anonim tanpa registrasi, tanpa login, dan tanpa menyimpan berkas hasil unduhan."
                    : "SatsetReels values your privacy. Our service is 100% anonymous with no registration, no Instagram login required, and no downloaded media stored on our servers."}
                </p>
              </div>

              <div>
                <h4 className="font-black text-slate-950 dark:text-white text-sm sm:text-base mb-1">
                  {isId ? "1. Tidak Ada Pengumpulan Data Pribadi" : "1. Zero Personal Data Collection"}
                </h4>
                <p className="text-slate-700 dark:text-zinc-300 font-semibold leading-relaxed">
                  {isId
                    ? "SatsetReels tidak pernah meminta atau menyimpan kredensial akun Instagram Anda (seperti username atau kata sandi), alamat IP permanen, nama lengkap, atau alamat email pengguna umum."
                    : "SatsetReels never requests or retains your personal Instagram credentials (username or password), permanent IP logs, full names, or email addresses for standard downloads."}
                </p>
              </div>

              <div>
                <h4 className="font-black text-slate-950 dark:text-white text-sm sm:text-base mb-1">
                  {isId ? "2. Pemrosesan Media Real-Time Tanpa Penyimpanan" : "2. Real-Time Media Streaming (No Storage)"}
                </h4>
                <p className="text-slate-700 dark:text-zinc-300 font-semibold leading-relaxed">
                  {isId
                    ? "Tautan URL Instagram yang Anda masukkan diproses secara langsung untuk menyalurkan berkas video, foto, atau audio dari CDN resmi Instagram ke peramban Anda. Server SatsetReels tidak menyimpan arsip atau salinan permanen dari konten tersebut."
                    : "Instagram links you provide are parsed in real time to stream video, photo, or audio content directly from Instagram's official CDN to your browser. SatsetReels servers do not host or archive any user media files."}
                </p>
              </div>

              <div>
                <h4 className="font-black text-slate-950 dark:text-white text-sm sm:text-base mb-1">
                  {isId ? "3. Kebijakan Cookie & Google AdSense" : "3. Cookie Policy & Google AdSense Compliance"}
                </h4>
                <p className="text-slate-700 dark:text-zinc-300 font-semibold leading-relaxed">
                  {isId
                    ? "Situs ini dapat menampilkan iklan yang dikelola oleh Google AdSense atau mitra periklanan pihak ketiga. Google menggunakan cookie (seperti cookie DoubleClick DART) untuk menayangkan iklan kepada pengguna berdasarkan kunjungan mereka ke situs ini dan situs web lain di internet."
                    : "This website may serve advertisements managed by Google AdSense or authorized third-party ad networks. Google uses cookies (including the DoubleClick DART cookie) to serve ads to users based on their prior visits to this website and other sites across the internet."}
                </p>
                <p className="text-slate-700 dark:text-zinc-300 font-semibold leading-relaxed mt-1.5">
                  {isId
                    ? "Pengguna dapat menyetel preferensi atau memilih keluar (opt-out) dari penayangan iklan hasil personalisasi dengan mengunjungi Pengaturan Iklan Google di https://www.google.com/settings/ads atau melalui https://www.aboutads.info."
                    : "Users may opt out of personalized advertising by visiting Google Ads Settings at https://www.google.com/settings/ads or via https://www.aboutads.info."}
                </p>
              </div>

              <div>
                <h4 className="font-black text-slate-950 dark:text-white text-sm sm:text-base mb-1">
                  {isId ? "4. Penyimpanan Lokal Peramban (LocalStorage)" : "4. Client-Side Browser Storage (LocalStorage)"}
                </h4>
                <p className="text-slate-700 dark:text-zinc-300 font-semibold leading-relaxed">
                  {isId
                    ? "Fitur 'Riwayat Unduhan Terakhir' dan preferensi bahasa/tema disimpan secara lokal pada peramban perangkat Anda (localStorage) dan tidak pernah dikirimkan ke server kami. Anda dapat menghapus data ini kapan saja melalui tombol 'Hapus Riwayat'."
                    : "Features such as 'Recent Downloads' and language/theme preferences are kept strictly on your local browser (localStorage) and are never transmitted to our backend. You can clear this data anytime using the 'Clear History' button."}
                </p>
              </div>
            </div>
          )}

          {/* TAB: TERMS OF SERVICE */}
          {activeTab === "terms" && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-3.5 rounded-xl bg-purple-50 border-2 border-purple-200 text-purple-900 dark:bg-purple-950/20 dark:border-purple-900/30 dark:text-purple-200 flex items-start gap-2.5 sm:gap-3">
                <FileText className="w-5 h-5 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
                <p className="text-xs sm:text-sm leading-relaxed font-bold">
                  {isId
                    ? "Dengan mengakses dan menggunakan SatsetReels, Anda menyetujui Ketentuan Layanan ini untuk penggunaan pribadi yang sah serta menghormati hak cipta kreator asli."
                    : "By accessing and using SatsetReels, you agree to these Terms of Service for lawful personal use and agree to respect all intellectual property rights of original creators."}
                </p>
              </div>

              <div>
                <h4 className="font-black text-slate-950 dark:text-white text-sm sm:text-base mb-1">
                  {isId ? "1. Ruang Lingkup & Tujuan Penggunaan" : "1. Scope & Permitted Use"}
                </h4>
                <p className="text-slate-700 dark:text-zinc-300 font-semibold leading-relaxed">
                  {isId
                    ? "SatsetReels disediakan murni sebagai alat bantu teknis untuk mengunduh konten dari akun Instagram publik untuk keperluan pencadangan pribadi (personal backup), edukasi, atau referensi non-komersial (fair use)."
                    : "SatsetReels is provided solely as a technical utility to download public Instagram media for personal backup, offline viewing, education, or non-commercial fair use."}
                </p>
              </div>

              <div>
                <h4 className="font-black text-slate-950 dark:text-white text-sm sm:text-base mb-1">
                  {isId ? "2. Hak Cipta & Kewajiban Pengguna" : "2. Copyrights & User Obligations"}
                </h4>
                <p className="text-slate-700 dark:text-zinc-300 font-semibold leading-relaxed">
                  {isId
                    ? "Seluruh hak cipta video, audio, foto, dan grafis dimiliki sepenuhnya oleh kreator konten asli. Anda dilarang mendistribusikan ulang, memonetisasi, atau menjual konten unduhan milik pihak ketiga tanpa izin tertulis dari pemilik hak cipta."
                    : "All video, audio, image, and graphic copyrights belong exclusively to their respective creators. You may not redistribute, commercialize, or monetize third-party media downloaded via SatsetReels without explicit permission from the copyright owner."}
                </p>
              </div>

              <div>
                <h4 className="font-black text-slate-950 dark:text-white text-sm sm:text-base mb-1">
                  {isId ? "3. Batasan Tanggung Jawab" : "3. Disclaimer of Warranties"}
                </h4>
                <p className="text-slate-700 dark:text-zinc-300 font-semibold leading-relaxed">
                  {isId
                    ? "Layanan disediakan 'sebagaimana adanya' (as-is) tanpa garansi ketersediaan tanpa gangguan. SatsetReels tidak bertanggung jawab atas kerugian atau pelanggaran hukum yang diakibatkan oleh penyalahgunaan layanan oleh pengguna."
                    : "The service is provided 'as is' without warranties of any kind. SatsetReels shall not be liable for any damages or legal violations resulting from unauthorized use by users."}
                </p>
              </div>
            </div>
          )}

          {/* TAB: DMCA & COPYRIGHT */}
          {activeTab === "dmca" && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-3.5 rounded-xl bg-rose-50 border-2 border-rose-200 text-rose-900 dark:bg-rose-950/20 dark:border-rose-900/30 dark:text-rose-200 flex items-start gap-2.5 sm:gap-3">
                <Scale className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                <p className="text-xs sm:text-sm leading-relaxed font-bold">
                  {isId
                    ? "SatsetReels sangat menghargai hak kekayaan intelektual orang lain dan mematuhi Digital Millennium Copyright Act (DMCA) serta peraturan hak cipta yang berlaku."
                    : "SatsetReels strongly respects intellectual property rights and complies with the Digital Millennium Copyright Act (DMCA) and international copyright laws."}
                </p>
              </div>

              <div>
                <h4 className="font-black text-slate-950 dark:text-white text-sm sm:text-base mb-1">
                  {isId ? "Penafian Merek Dagang" : "Trademark Non-Affiliation Disclaimer"}
                </h4>
                <p className="text-slate-700 dark:text-zinc-300 font-semibold leading-relaxed">
                  {isId
                    ? "SatsetReels adalah situs web independen dan TIDAK berafiliasi, didukung, disponsori, atau secara resmi terhubung dengan Instagram, Meta Platforms, Inc., atau entitas terkait lainnya. Nama 'Instagram' beserta logo kameranya adalah merek dagang terdaftar milik Meta Platforms, Inc."
                    : "SatsetReels is an independent tool and is NOT affiliated, associated, authorized, endorsed by, or in any way officially connected with Instagram, Meta Platforms, Inc., or any of its subsidiaries. The name 'Instagram' and related marks are registered trademarks of Meta Platforms, Inc."}
                </p>
              </div>

              <div>
                <h4 className="font-black text-slate-950 dark:text-white text-sm sm:text-base mb-1">
                  {isId ? "Prosedur Pengajuan DMCA Takedown" : "DMCA Notice & Takedown Procedure"}
                </h4>
                <p className="text-slate-700 dark:text-zinc-300 font-semibold leading-relaxed">
                  {isId
                    ? "Jika Anda adalah pemilik hak cipta yang sah dan meyakini bahwa konten Anda disalahgunakan atau ingin memblokir tautan konten Anda agar tidak dapat diproses oleh sistem SatsetReels, silakan kirimkan pemberitahuan resmi yang memuat:"
                    : "If you are a copyright owner and believe your copyrighted work is being infringed or wish to restrict your Instagram URLs from being processed through SatsetReels, please submit an official notice containing:"}
                </p>
                <ul className="list-disc list-inside space-y-1 text-slate-700 dark:text-zinc-300 font-semibold text-xs mt-2 pl-1">
                  <li>
                    {isId
                      ? "Identifikasi karya berhak cipta dan URL postingan Instagram spesifik."
                      : "Identification of the copyrighted material and specific Instagram post URLs."}
                  </li>
                  <li>
                    {isId
                      ? "Bukti kepemilikan hak cipta atau surat kuasa resmi perwakilan."
                      : "Proof of copyright ownership or legal representation authorization."}
                  </li>
                  <li>
                    {isId
                      ? "Informasi kontak (nama lengkap, alamat email, dan nomor telepon)."
                      : "Contact information including your full name, email address, and phone number."}
                  </li>
                  <li>
                    {isId
                      ? "Pernyataan iktikad baik bahwa penggunaan konten tersebut tidak diizinkan."
                      : "A good faith statement affirming that the disputed use is not authorized."}
                  </li>
                </ul>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border-2 border-slate-200 dark:bg-zinc-950/70 dark:border-zinc-800 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-pink-600 dark:text-pink-400 shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-slate-950 dark:text-white">Email DMCA / Hak Cipta:</p>
                    <p className="text-xs text-pink-600 dark:text-pink-400 font-mono font-bold">dmca@satsetreels.app</p>
                  </div>
                </div>
                <span className="text-[10px] text-slate-700 dark:text-zinc-400 uppercase font-black">Respon 24-48 Jam</span>
              </div>
            </div>
          )}

          {/* TAB: HELP & CONTACT */}
          {activeTab === "help" && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-3.5 rounded-xl bg-amber-50 border-2 border-amber-200 text-amber-900 dark:bg-amber-950/20 dark:border-amber-900/30 dark:text-amber-200 flex items-start gap-2.5 sm:gap-3">
                <HelpCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <p className="text-xs sm:text-sm leading-relaxed font-bold">
                  {isId
                    ? "Butuh bantuan saat mengunduh? Temukan solusi atas masalah teknis umum atau hubungi tim pengembang SatsetReels."
                    : "Need help downloading? Find quick fixes for common technical issues or contact the SatsetReels support team."}
                </p>
              </div>

              <div className="space-y-2.5">
                <h4 className="font-black text-slate-950 dark:text-white text-xs sm:text-sm flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  {isId ? "Kendala Umum & Solusi Cepat:" : "Common Issues & Troubleshooting:"}
                </h4>

                <div className="space-y-2">
                  <div className="p-3 rounded-xl bg-slate-50 border-2 border-slate-200 dark:bg-zinc-950/60 dark:border-zinc-800/80">
                    <p className="font-black text-slate-950 dark:text-white text-xs mb-1">
                      {isId ? "1. Tautan Akun Privat / Terkunci" : "1. Private Instagram Accounts"}
                    </p>
                    <p className="text-slate-700 dark:text-zinc-300 font-semibold text-xs leading-relaxed">
                      {isId
                        ? "SatsetReels hanya dapat mengunduh video dan foto dari akun publik. Video dari akun yang dikunci (privat) tidak dapat diakses."
                        : "SatsetReels only extracts media from public Instagram accounts. Private posts cannot be processed to protect account owner privacy."}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border-2 border-slate-200 dark:bg-zinc-950/60 dark:border-zinc-800/80">
                    <p className="font-black text-slate-950 dark:text-white text-xs mb-1">
                      {isId ? "2. Mengapa Video Terbuka di Tab Baru di iPhone / Safari?" : "2. Video Opens in New Tab on iPhone / Safari"}
                    </p>
                    <p className="text-slate-700 dark:text-zinc-300 font-semibold text-xs leading-relaxed">
                      {isId
                        ? "Pada iOS Safari, jika video diputar alih-alih langsung terunduh, tahan tombol video lalu ketuk 'Simpan Video' atau gunakan ikon Bagikan lalu 'Simpan ke File'."
                        : "On iOS Safari, if the video plays directly in a new tab instead of downloading, long-press the video and tap 'Save Video' or use the Share icon -> 'Save to Files'."}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border-2 border-slate-200 dark:bg-zinc-950/60 dark:border-zinc-800/80">
                    <p className="font-black text-slate-950 dark:text-white text-xs mb-1">
                      {isId ? "3. Format Audio MP3 192 kbps" : "3. 192 kbps MP3 Audio Extraction"}
                    </p>
                    <p className="text-slate-700 dark:text-zinc-300 font-semibold text-xs leading-relaxed">
                      {isId
                        ? "Fitur 'Unduh Audio (.MP3)' mengekstrak lagu atau latar suara video secara jernih dan otomatis mengonversinya ke format MP3 192 kbps."
                        : "The 'Download Audio (.MP3)' button extracts background music and audio tracks with high fidelity 192 kbps MP3 encoding."}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border-2 border-slate-200 dark:bg-zinc-950/70 dark:border-zinc-800 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-slate-950 dark:text-white">{isId ? "Kontak Dukungan Pengguna:" : "Support & Inquiries:"}</p>
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 font-mono font-bold">support@satsetreels.app</p>
                  </div>
                </div>
                <a
                  href="mailto:support@satsetreels.app"
                  className="px-3 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-900 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-white text-xs font-bold flex items-center gap-1 transition-colors"
                >
                  <span>{isId ? "Kirim Email" : "Email Us"}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {onScrollToFaq && (
                <div className="pt-1">
                  <button
                    onClick={() => {
                      onClose();
                      onScrollToFaq();
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-950 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-white font-bold text-xs sm:text-sm transition-all cursor-pointer border-2 border-slate-300 dark:border-transparent"
                  >
                    <span>{isId ? "Lihat Pertanyaan yang Sering Diajukan (FAQ)" : "View Frequently Asked Questions (FAQ)"}</span>
                    <ArrowRight className="w-4 h-4 text-pink-600 dark:text-pink-400" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 sm:px-6 py-3 sm:py-3.5 border-t border-slate-200 dark:border-zinc-800/80 bg-slate-50 dark:bg-zinc-950/70 flex items-center justify-between text-xs text-slate-600 dark:text-zinc-500">
          <span className="text-[11px] sm:text-xs">&copy; 2026 SatsetReels. {isId ? "Hak Cipta Dilindungi." : "All Rights Reserved."}</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 sm:py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-900 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-white font-medium text-xs sm:text-sm transition-colors cursor-pointer"
          >
            {isId ? "Tutup" : "Close"}
          </button>
        </div>
      </div>
    </div>
  );
}
