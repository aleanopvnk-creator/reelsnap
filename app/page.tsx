"use client";

import React, { useState, useEffect } from "react";
import {
  Download,
  Clipboard,
  X,
  Flame,
  BadgeCheck,
  Video,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  Zap,
  Smartphone,
  RefreshCw,
  AlertCircle,
  FileText,
  CheckCircle2,
  Music,
} from "lucide-react";
import FaqAccordion from "@/components/FaqAccordion";
import AdSlot from "@/components/AdSlot";
import InfoModal, { ModalTab } from "@/components/InfoModal";

interface ExtractionData {
  shortcode: string;
  videoUrl: string;
  audioUrl?: string;
  thumbnailUrl: string;
  caption: string;
  author: string;
  duration?: number;
  source: string;
}

export default function HomePage() {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ExtractionData | null>(null);
  const [copiedCaption, setCopiedCaption] = useState(false);
  const [isCaptionExpanded, setIsCaptionExpanded] = useState(false);
  const [downloadingVideo, setDownloadingVideo] = useState(false);
  const [downloadingAudio, setDownloadingAudio] = useState(false);
  const [modalTab, setModalTab] = useState<ModalTab | null>(null);

  const handleOpenModal = (tab: ModalTab) => {
    setModalTab(tab);
  };

  const handleScrollToFaq = () => {
    const faqElement = document.getElementById("faq");
    if (faqElement) {
      faqElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Helper to smoothly scroll to an element considering sticky header and mobile viewports
  const scrollToSection = (id: string) => {
    if (typeof window === "undefined") return;
    const el = document.getElementById(id);
    if (!el) return;

    // Standard smooth scroll (respects scroll-margin-top)
    el.scrollIntoView({ behavior: "smooth", block: "start" });

    // Second-pass adjustment for mobile browsers after virtual keyboard dismissal
    setTimeout(() => {
      const updatedEl = document.getElementById(id);
      if (updatedEl) {
        const rect = updatedEl.getBoundingClientRect();
        // If element is partially cut off or off-target due to keyboard layout shifts
        if (rect.top < 50 || rect.top > 180) {
          const headerOffset = 70;
          const elementPosition = rect.top + window.scrollY;
          window.scrollTo({
            top: Math.max(0, elementPosition - headerOffset),
            behavior: "smooth",
          });
        }
      }
    }, 260);
  };

  // Automatic smooth scroll to loading skeleton when extraction starts
  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => {
        scrollToSection("loading-section");
      }, 60);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  // Automatic smooth scroll down to result card as soon as data arrives
  useEffect(() => {
    if (data) {
      const timer = setTimeout(() => {
        scrollToSection("result-section");
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [data]);

  // Paste from clipboard handler
  const handlePaste = async () => {
    try {
      if (!navigator.clipboard?.readText) {
        setError("Browser Anda tidak mengizinkan akses clipboard otomatis. Silakan tempel secara manual.");
        return;
      }
      const text = await navigator.clipboard.readText();
      if (text) {
        setUrl(text.trim());
        setError(null);
      }
    } catch {
      setError("Gagal membaca clipboard. Pastikan izin akses clipboard telah diberikan pada browser.");
    }
  };

  // Clear input handler
  const handleClear = () => {
    setUrl("");
    setError(null);
  };

  // Extraction submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) {
      setError("Silakan masukkan tautan video Instagram terlebih dahulu.");
      return;
    }

    // Dismiss virtual keyboard on mobile for maximum viewport visibility
    if (typeof document !== "undefined" && document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }

    setIsLoading(true);
    setError(null);
    setData(null);
    setIsCaptionExpanded(false);

    try {
      const response = await fetch("/api/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });

      const resData = await response.json();

      if (!response.ok || !resData.success) {
        throw new Error(resData.error || "Gagal mengekstrak video dari URL Instagram tersebut.");
      }

      setData(resData);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Terjadi gangguan saat mengambil data. Silakan periksa kembali link Anda."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Copy caption to clipboard
  const handleCopyCaption = async () => {
    if (!data?.caption) return;
    try {
      await navigator.clipboard.writeText(data.caption);
      setCopiedCaption(true);
      setTimeout(() => setCopiedCaption(false), 2500);
    } catch {
      setError("Gagal menyalin caption ke clipboard.");
    }
  };

  // Direct download helpers triggering /api/download proxy
  const handleDownloadVideo = () => {
    if (!data?.videoUrl) return;
    setDownloadingVideo(true);
    const downloadUrl = `/api/download?url=${encodeURIComponent(data.videoUrl)}&filename=ReelSnap-${data.shortcode}.mp4`;

    const link = document.createElement("a");
    link.href = downloadUrl;
    link.setAttribute("download", `ReelSnap-${data.shortcode}.mp4`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => setDownloadingVideo(false), 2000);
  };

  const handleDownloadAudio = () => {
    const audioSource = data?.audioUrl || data?.videoUrl;
    if (!audioSource) return;
    setDownloadingAudio(true);
    const downloadUrl = `/api/download?url=${encodeURIComponent(audioSource)}&filename=ReelSnap-Audio-${data.shortcode}.mp3&type=audio`;

    const link = document.createElement("a");
    link.href = downloadUrl;
    link.setAttribute("download", `ReelSnap-Audio-${data.shortcode}.mp3`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => setDownloadingAudio(false), 2500);
  };

  // Proxy URL for safe in-browser video playback without CORS errors
  const proxiedVideoUrl = data?.videoUrl
    ? `/api/download?url=${encodeURIComponent(data.videoUrl)}&filename=preview-${data.shortcode}.mp4`
    : "";

  const proxiedThumbnailUrl = data?.thumbnailUrl
    ? `/api/download?url=${encodeURIComponent(data.thumbnailUrl)}&filename=poster-${data.shortcode}.jpg&type=image`
    : "";

  return (
    <div className="min-h-screen flex flex-col justify-between bg-zinc-950 text-zinc-100 overflow-x-hidden selection:bg-pink-500 selection:text-white">
      {/* Top Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-zinc-950/85 border-b border-zinc-800/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-2.5">
            <img
              src="/icon.png"
              alt="ReelSnap Logo"
              className="w-8 h-8 sm:w-9 sm:h-9 object-contain drop-shadow-[0_2px_10px_rgba(236,72,153,0.35)] transition-transform hover:scale-105 select-none"
            />
            <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white">
              Reel<span className="text-ig-gradient">Snap</span>
            </span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-medium text-zinc-400 bg-zinc-900/80 border border-zinc-800/80 px-2.5 py-1 rounded-full">
            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Server Online</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-8 pb-6 sm:pt-14 sm:pb-10 px-4 sm:px-6 overflow-hidden">
          {/* Subtle Glow Background */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] sm:w-[500px] h-[220px] sm:h-[320px] bg-gradient-to-tr from-pink-500/15 via-purple-500/10 to-orange-400/15 blur-3xl pointer-events-none rounded-full" />

          <div className="relative max-w-3xl mx-auto text-center">
            {/* Tag Badge */}
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1.5 rounded-full bg-gradient-to-r from-pink-500/15 via-purple-500/10 to-amber-500/15 border border-pink-500/30 text-pink-200 text-[10.5px] xs:text-xs sm:text-xs font-semibold mb-3.5 sm:mb-5 shadow-lg shadow-pink-500/10 backdrop-blur-md hover:border-pink-500/50 transition-all select-none max-w-full">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-gradient-to-tr from-pink-500 via-rose-500 to-amber-400 text-white shadow-sm shadow-pink-500/40 shrink-0">
                <Flame className="w-3 h-3 fill-white animate-pulse" />
              </span>
              <span className="tracking-wide">Unduh Video Reels &amp; Post Instagram Gratis</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-[1.18]">
              Download Video Instagram <br className="hidden sm:inline" />
              <span className="text-ig-gradient block sm:inline mt-1 sm:mt-0">Cepat & Tanpa Watermark</span>
            </h1>

            {/* Subtitle */}
            <p className="mt-2.5 sm:mt-3.5 text-xs sm:text-sm md:text-base text-zinc-400 max-w-lg mx-auto leading-relaxed px-2">
              Simpan video Reels dan Post Instagram favorit Anda tanpa watermark secara instan dengan <strong>ReelSnap</strong>.
              Cepat, gratis, dan langsung tersimpan di galeri ponsel atau laptop Anda.
            </p>

            {/* Input Form Card */}
            <div className="mt-6 sm:mt-8 max-w-2xl mx-auto">
              <form
                onSubmit={handleSubmit}
                className="bg-zinc-900/90 backdrop-blur-md rounded-2xl border border-zinc-800 p-2 sm:p-2.5 shadow-xl shadow-pink-500/5 transition-all focus-within:ring-2 focus-within:ring-pink-500/40 focus-within:border-pink-500"
              >
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <div className="relative flex-1 flex items-center">
                    <input
                      type="url"
                      id="instagram-url-input"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="Tempel tautan Instagram di sini..."
                      className="w-full h-11 sm:h-12 pl-3.5 pr-20 sm:pr-24 text-base sm:text-sm bg-transparent text-white placeholder:text-zinc-500 placeholder:text-xs sm:placeholder:text-sm focus:outline-none"
                      disabled={isLoading}
                      required
                    />

                    {/* Quick Button inside input (Clear / Paste) */}
                    <div className="absolute right-2 flex items-center gap-1">
                      {url ? (
                        <button
                          type="button"
                          onClick={handleClear}
                          aria-label="Bersihkan link"
                          className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={handlePaste}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors cursor-pointer"
                        >
                          <Clipboard className="w-3 h-3 text-pink-400" />
                          <span>Tempel</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full sm:w-auto h-11 sm:h-12 px-6 sm:px-8 rounded-xl bg-ig-gradient bg-ig-gradient-hover text-white font-bold text-xs sm:text-sm md:text-base shadow-md shadow-pink-500/20 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shrink-0"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Memproses...</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4 stroke-[2.5]" />
                        <span>Download</span>
                      </>
                    )}
                  </button>
                </div>
              </form>


              {/* Error Message Alert */}
              {error && (
                <div className="mt-4 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-red-950/40 border border-red-900/60 text-red-300 text-xs sm:text-sm flex items-start gap-2.5 text-left animate-in fade-in">
                  <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-400 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-semibold text-red-200">Gagal Memproses Tautan</p>
                    <p className="mt-0.5 text-red-400 leading-relaxed text-[11px] sm:text-xs">
                      {error}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Top Responsive Ad Slot */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <AdSlot slotId="top-horizontal-banner" format="horizontal" />
        </div>

        {/* Loading Skeleton */}
        {isLoading && (
          <section id="loading-section" className="py-6 px-4 sm:px-6 max-w-2xl mx-auto scroll-mt-20 sm:scroll-mt-24">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4 sm:p-6 shadow-xl space-y-4 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-zinc-800" />
                <div className="space-y-1.5 flex-1">
                  <div className="w-32 h-3.5 rounded bg-zinc-800" />
                  <div className="w-20 h-2.5 rounded bg-zinc-800" />
                </div>
              </div>
              <div className="w-full aspect-video rounded-xl bg-zinc-800" />
              <div className="space-y-2">
                <div className="w-3/4 h-3.5 rounded bg-zinc-800" />
                <div className="w-1/2 h-3 rounded bg-zinc-800" />
              </div>
              <div className="w-full h-11 rounded-xl bg-zinc-800" />
            </div>
          </section>
        )}

        {/* Result Area (Card Hasil Unduhan - Dua Kolom di Desktop, Responsif di Mobile) */}
        {data && (
          <section id="result-section" className="py-6 px-3 sm:px-6 max-w-4xl mx-auto scroll-mt-20 sm:scroll-mt-24">
            <div className="rounded-2xl sm:rounded-3xl border border-zinc-800 bg-zinc-900/95 shadow-2xl p-4 sm:p-6 md:p-8 overflow-hidden backdrop-blur-sm">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6 items-center">
                {/* Left Column: Responsive Video Preview Container */}
                <div className="md:col-span-5 flex justify-center w-full">
                  <div className="w-full max-w-[220px] xs:max-w-[240px] sm:max-w-[260px] md:max-w-[280px] aspect-[9/16] bg-black rounded-2xl overflow-hidden shadow-2xl border border-zinc-800/90 relative group">
                    <video
                      src={proxiedVideoUrl}
                      poster={proxiedThumbnailUrl}
                      controls
                      preload="metadata"
                      playsInline
                      className="w-full h-full object-cover"
                    >
                      Browser Anda tidak mendukung pemutar video. Silakan langsung unduh file melalui tombol di samping.
                    </video>
                  </div>
                </div>

                {/* Right Column: Media Details & Download Actions */}
                <div className="md:col-span-7 flex flex-col justify-between space-y-3.5 sm:space-y-4">
                  {/* Creator Info */}
                  <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80 gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full p-0.5 bg-ig-gradient flex items-center justify-center shrink-0">
                        <div className="w-full h-full rounded-full bg-zinc-900 flex items-center justify-center text-pink-400 font-bold text-xs sm:text-sm uppercase">
                          {data.author.charAt(0) || "IG"}
                        </div>
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-bold text-white text-sm sm:text-base truncate">
                            @{data.author}
                          </h3>
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                        </div>
                        <p className="text-[11px] text-zinc-400 truncate">
                          Instagram Creator • #{data.shortcode}
                        </p>
                      </div>
                    </div>

                    <a
                      href={`https://www.instagram.com/p/${data.shortcode}/`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors shrink-0"
                    >
                      <span>Buka di IG</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  {/* Caption Box with decoded emojis and expand toggle */}
                  {data.caption && (
                    <div className="p-3 sm:p-3.5 rounded-xl bg-zinc-800/50 border border-zinc-800/90 text-left">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10.5px] sm:text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1">
                          <FileText className="w-3 h-3 text-pink-500" />
                          <span>Caption Post</span>
                        </span>
                        <button
                          type="button"
                          onClick={handleCopyCaption}
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-pink-400 hover:text-pink-300 transition-colors cursor-pointer"
                        >
                          {copiedCaption ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span className="text-emerald-400">Tersalin!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Salin</span>
                            </>
                          )}
                        </button>
                      </div>
                      <p
                        className={`text-xs sm:text-sm text-zinc-200 leading-relaxed whitespace-pre-line ${
                          !isCaptionExpanded ? "line-clamp-3" : ""
                        }`}
                      >
                        {data.caption}
                      </p>
                      {data.caption.length > 120 && (
                        <button
                          type="button"
                          onClick={() => setIsCaptionExpanded(!isCaptionExpanded)}
                          className="mt-1 text-[11px] font-semibold text-pink-400/90 hover:text-pink-300 transition-colors cursor-pointer"
                        >
                          {isCaptionExpanded ? "Sembunyikan" : "Lihat Selengkapnya..."}
                        </button>
                      )}
                    </div>
                  )}

                  {/* Feature highlights pill */}
                  <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap text-[10.5px] sm:text-[11px] text-zinc-400">
                    <span className="px-2 py-0.5 rounded-md bg-zinc-800/80 border border-zinc-700/60 text-zinc-300 font-medium">Format: MP4 &amp; MP3</span>
                    <span className="px-2 py-0.5 rounded-md bg-zinc-800/80 border border-zinc-700/60 text-zinc-300 font-medium">Resolusi: HD Asli</span>
                    <span className="px-2 py-0.5 rounded-md bg-zinc-800/80 border border-zinc-700/60 text-purple-300 font-medium">Audio: 192 kbps</span>
                    <span className="px-2 py-0.5 rounded-md bg-zinc-800/80 border border-zinc-700/60 text-emerald-400 font-medium">Tanpa Watermark</span>
                  </div>

                  {/* Action Download Buttons */}
                  <div className="space-y-2 sm:space-y-2.5 pt-1">
                    {/* Primary Video Download */}
                    <button
                      type="button"
                      onClick={handleDownloadVideo}
                      disabled={downloadingVideo}
                      className="w-full h-11 sm:h-12 px-4 rounded-xl bg-ig-gradient bg-ig-gradient-hover text-white font-bold text-xs sm:text-sm md:text-base shadow-lg shadow-pink-500/25 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      {downloadingVideo ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Menyiapkan Video HD...</span>
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4 stroke-[2.5]" />
                          <span>Download Video HD (.MP4)</span>
                        </>
                      )}
                    </button>

                    {/* Secondary Audio MP3 Download */}
                    <button
                      type="button"
                      onClick={handleDownloadAudio}
                      disabled={downloadingAudio}
                      className="w-full h-11 sm:h-12 px-4 rounded-xl bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-xs sm:text-sm md:text-base shadow-lg shadow-purple-500/20 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      {downloadingAudio ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Mengonversi Audio MP3...</span>
                        </>
                      ) : (
                        <>
                          <Music className="w-4 h-4 stroke-[2.5]" />
                          <span>Download Audio (.MP3)</span>
                          <span className="hidden xs:inline text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-full bg-white/20 text-white border border-white/20">
                            192 kbps
                          </span>
                        </>
                      )}
                    </button>

                    {/* Reset / Unduh Video Lain */}
                    <button
                      type="button"
                      onClick={() => {
                        setData(null);
                        setUrl("");
                        if (typeof window !== "undefined") {
                          window.scrollTo({ top: 0, behavior: "smooth" });
                          setTimeout(() => {
                            const inputEl = document.getElementById("instagram-url-input");
                            inputEl?.focus();
                          }, 350);
                        }
                      }}
                      className="w-full h-10 sm:h-11 px-4 rounded-xl border border-zinc-700/80 bg-zinc-800/70 hover:bg-zinc-700 text-zinc-300 hover:text-white font-semibold text-xs sm:text-sm active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2 pt-0.5"
                    >
                      <RefreshCw className="w-3.5 h-3.5 text-zinc-400" />
                      <span>Unduh Video Lainnya</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* How To Download Section (3 Steps) */}
        <section className="py-10 sm:py-14 px-4 sm:px-6 max-w-4xl mx-auto">
          <div className="text-center mb-8 sm:mb-10">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white">
              Cara Download Video Reels &amp; Audio dengan ReelSnap
            </h2>
            <p className="mt-1.5 text-xs sm:text-sm text-zinc-400">
              Hanya 3 langkah mudah untuk menyimpan video atau audio ke perangkat Anda
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-5">
            {/* Step 1 */}
            <div className="rounded-xl sm:rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5 text-center shadow-sm hover:border-zinc-700/80 transition-all">
              <div className="w-10 h-10 mx-auto rounded-xl bg-pink-950/60 text-pink-400 border border-pink-800/40 font-black text-base flex items-center justify-center mb-3">
                1
              </div>
              <h3 className="font-bold text-white text-sm sm:text-base mb-1.5">
                Salin Tautan Video
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Buka Instagram, pilih Reels atau video yang Anda suka, klik tombol Bagikan (ikon pesawat) dan pilih{" "}
                <strong className="text-zinc-200">&quot;Salin Tautan&quot;</strong>.
              </p>
            </div>

            {/* Step 2 */}
            <div className="rounded-xl sm:rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5 text-center shadow-sm hover:border-zinc-700/80 transition-all">
              <div className="w-10 h-10 mx-auto rounded-xl bg-purple-950/60 text-purple-400 border border-purple-800/40 font-black text-base flex items-center justify-center mb-3">
                2
              </div>
              <h3 className="font-bold text-white text-sm sm:text-base mb-1.5">
                Tempelkan ke ReelSnap
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Buka ReelSnap, lalu klik tombol <strong className="text-zinc-200">&quot;Tempel&quot;</strong> pada kolom di atas dan tekan{" "}
                <strong className="text-zinc-200">&quot;Download&quot;</strong>.
              </p>
            </div>

            {/* Step 3 */}
            <div className="rounded-xl sm:rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5 text-center shadow-sm hover:border-zinc-700/80 transition-all">
              <div className="w-10 h-10 mx-auto rounded-xl bg-amber-950/60 text-amber-400 border border-amber-800/40 font-black text-base flex items-center justify-center mb-3">
                3
              </div>
              <h3 className="font-bold text-white text-sm sm:text-base mb-1.5">
                Simpan Video HD / Audio MP3
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Lihat preview yang muncul, lalu tekan <strong className="text-zinc-200">&quot;Download Video HD (.MP4)&quot;</strong> atau <strong className="text-zinc-200">&quot;Download Audio (.MP3)&quot;</strong>.
              </p>
            </div>
          </div>
        </section>

        {/* Middle Ad Slot */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <AdSlot slotId="middle-responsive-ad" format="horizontal" />
        </div>

        {/* Features Section */}
        <section className="py-10 sm:py-14 px-4 sm:px-6 bg-zinc-900/30 border-y border-zinc-800/60">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8 sm:mb-10">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white">
                Keunggulan ReelSnap
              </h2>
              <p className="mt-1.5 text-xs sm:text-sm text-zinc-400">
                Fitur lengkap berstandar production untuk kemudahan pengunduhan video dan audio Anda
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
              {/* Feature 1 */}
              <div className="group p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-zinc-900/70 border border-zinc-800 hover:border-pink-500/40 shadow-sm transition-all duration-200">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-pink-500/20 via-pink-600/15 to-rose-500/20 border border-pink-500/30 text-pink-300 flex items-center justify-center mb-3.5 shadow-md shadow-pink-500/15 group-hover:scale-105 group-hover:border-pink-400/50 transition-all">
                  <Video className="w-5 h-5 text-pink-400" />
                </div>
                <h3 className="font-bold text-sm sm:text-base text-white mb-1 group-hover:text-pink-200 transition-colors">
                  Kualitas Asli Full HD
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Video diunduh langsung dari server CDN Instagram tanpa kompresi tambahan sehingga ketajaman gambar tetap maksimal.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="group p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-zinc-900/70 border border-zinc-800 hover:border-purple-500/40 shadow-sm transition-all duration-200">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-purple-500/20 via-purple-600/15 to-indigo-500/20 border border-purple-500/30 text-purple-300 flex items-center justify-center mb-3.5 shadow-md shadow-purple-500/15 group-hover:scale-105 group-hover:border-purple-400/50 transition-all">
                  <BadgeCheck className="w-5 h-5 text-purple-400 fill-purple-400/20" />
                </div>
                <h3 className="font-bold text-sm sm:text-base text-white mb-1 group-hover:text-purple-200 transition-colors">
                  Tanpa Watermark
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Tidak ada logo, teks, atau watermark tambahan pada video unduhan Anda. Bersih dan cocok untuk arsip atau editing.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="group p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-zinc-900/70 border border-zinc-800 hover:border-amber-500/40 shadow-sm transition-all duration-200">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-amber-500/20 via-amber-600/15 to-yellow-500/20 border border-amber-500/30 text-amber-300 flex items-center justify-center mb-3.5 shadow-md shadow-amber-500/15 group-hover:scale-105 group-hover:border-amber-400/50 transition-all">
                  <Zap className="w-5 h-5 text-amber-400 fill-amber-400/20" />
                </div>
                <h3 className="font-bold text-sm sm:text-base text-white mb-1 group-hover:text-amber-200 transition-colors">
                  Kecepatan Server Kilat
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Didukung infrastruktur proxy streaming direct pipe, proses unduhan berlangsung instan tanpa buffer lambat.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="group p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-zinc-900/70 border border-zinc-800 hover:border-emerald-500/40 shadow-sm transition-all duration-200">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 via-emerald-600/15 to-teal-500/20 border border-emerald-500/30 text-emerald-300 flex items-center justify-center mb-3.5 shadow-md shadow-emerald-500/15 group-hover:scale-105 group-hover:border-emerald-400/50 transition-all">
                  <Smartphone className="w-5 h-5 text-emerald-400" />
                </div>
                <h3 className="font-bold text-sm sm:text-base text-white mb-1 group-hover:text-emerald-200 transition-colors">
                  Dukungan Semua Perangkat
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Bekerja lancar di iPhone (Safari), HP Android (Chrome), komputer Windows, macOS, dan tablet.
                </p>
              </div>

              {/* Feature 5 */}
              <div className="group p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-zinc-900/70 border border-zinc-800 hover:border-blue-500/40 shadow-sm transition-all duration-200">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-blue-500/20 via-blue-600/15 to-cyan-500/20 border border-blue-500/30 text-blue-300 flex items-center justify-center mb-3.5 shadow-md shadow-blue-500/15 group-hover:scale-105 group-hover:border-blue-400/50 transition-all">
                  <ShieldCheck className="w-5 h-5 text-blue-400 fill-blue-400/20" />
                </div>
                <h3 className="font-bold text-sm sm:text-base text-white mb-1 group-hover:text-blue-200 transition-colors">
                  100% Aman & Anonim
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Tidak perlu login akun atau menginstal APK apa pun. Kami tidak menyimpan riwayat unduhan atau data pribadi Anda.
                </p>
              </div>

              {/* Feature 6 */}
              <div className="group p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-zinc-900/70 border border-zinc-800 hover:border-rose-500/40 shadow-sm transition-all duration-200">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-rose-500/20 via-rose-600/15 to-pink-500/20 border border-rose-500/30 text-rose-300 flex items-center justify-center mb-3.5 shadow-md shadow-rose-500/15 group-hover:scale-105 group-hover:border-rose-400/50 transition-all">
                  <Music className="w-5 h-5 text-rose-400" />
                </div>
                <h3 className="font-bold text-sm sm:text-base text-white mb-1 group-hover:text-rose-200 transition-colors">
                  Audio MP3 &amp; Teks Caption
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Selain video MP4, Anda juga dapat mengunduh format audio lagu/sound MP3 berkualitas 192kbps dan menyalin teks caption lengkap.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-10 sm:py-14 px-4 sm:px-6 max-w-4xl mx-auto scroll-mt-20">
          <div className="text-center mb-8 sm:mb-10">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white">
              Pertanyaan yang Sering Diajukan (FAQ)
            </h2>
            <p className="mt-1.5 text-xs sm:text-sm text-zinc-400">
              Jawaban seputar layanan pengunduhan Instagram Reels dan video dengan ReelSnap
            </p>
          </div>

          <FaqAccordion />
        </section>

        {/* Bottom Ad Slot */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-4">
          <AdSlot slotId="bottom-horizontal-banner" format="horizontal" />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800 bg-zinc-950 py-8 px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-3.5">
          <div className="flex items-center justify-center gap-2">
            <img
              src="/icon.png"
              alt="ReelSnap Logo"
              className="w-6 h-6 object-contain drop-shadow-[0_1px_6px_rgba(236,72,153,0.25)] select-none"
            />
            <span className="font-bold text-sm sm:text-base text-white">
              ReelSnap
            </span>
          </div>

          <p className="text-[11px] sm:text-xs text-zinc-400 max-w-lg mx-auto leading-relaxed">
            Layanan pengunduh media online gratis untuk konten Instagram publik. ReelSnap tidak berafiliasi,
            didukung, atau disponsori oleh Instagram atau Meta Platforms, Inc.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-x-3.5 sm:gap-x-4 gap-y-1.5 text-xs font-medium text-zinc-400 pt-1">
            <button
              onClick={() => handleOpenModal("privacy")}
              className="hover:text-pink-400 transition-colors cursor-pointer py-1 px-1.5"
            >
              Kebijakan Privasi
            </button>
            <span className="text-zinc-600 hidden xs:inline">•</span>
            <button
              onClick={() => handleOpenModal("terms")}
              className="hover:text-pink-400 transition-colors cursor-pointer py-1 px-1.5"
            >
              Ketentuan Layanan
            </button>
            <span className="text-zinc-600 hidden xs:inline">•</span>
            <button
              onClick={() => handleOpenModal("help")}
              className="hover:text-pink-400 transition-colors cursor-pointer py-1 px-1.5"
            >
              Bantuan
            </button>
          </div>

          <div className="text-[10px] sm:text-[11px] text-zinc-600 pt-1">
            &copy; 2026 ReelSnap. Seluruh hak cipta dilindungi undang-undang.
          </div>
        </div>
      </footer>

      {/* Informational Modal for Privacy, Terms & Help */}
      <InfoModal
        isOpen={modalTab !== null}
        onClose={() => setModalTab(null)}
        activeTab={modalTab || "privacy"}
        setActiveTab={(tab) => setModalTab(tab)}
        onScrollToFaq={handleScrollToFaq}
      />
    </div>
  );
}
