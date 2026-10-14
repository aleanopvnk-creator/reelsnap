"use client";

import React, { useState } from "react";
import {
  Download,
  Clipboard,
  X,
  Sparkles,
  Video,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  Zap,
  Smartphone,
  RefreshCw,
  AlertCircle,
  Share2,
  FileText,
  Image as ImageIcon,
  CheckCircle2,
} from "lucide-react";
import FaqAccordion from "@/components/FaqAccordion";
import AdSlot from "@/components/AdSlot";

interface ExtractionData {
  shortcode: string;
  videoUrl: string;
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
  const [downloadingThumb, setDownloadingThumb] = useState(false);

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

  const handleDownloadThumbnail = () => {
    if (!data?.thumbnailUrl) return;
    setDownloadingThumb(true);
    const downloadUrl = `/api/download?url=${encodeURIComponent(data.thumbnailUrl)}&filename=ReelSnap-Thumb-${data.shortcode}.jpg&type=image`;

    const link = document.createElement("a");
    link.href = downloadUrl;
    link.setAttribute("download", `ReelSnap-Thumb-${data.shortcode}.jpg`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => setDownloadingThumb(false), 2000);
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
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl object-cover shadow-md shadow-pink-500/20"
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
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-950/40 border border-pink-800/40 text-pink-400 text-[11px] sm:text-xs font-semibold mb-3 sm:mb-5 shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Unduh Video Reels & Post Instagram Gratis</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-[1.18]">
              Download Video Instagram <br className="hidden sm:inline" />
              <span className="text-ig-gradient block sm:inline mt-1 sm:mt-0">Cepat & Tanpa Watermark</span>
            </h1>

            {/* Subtitle */}
            <p className="mt-2.5 sm:mt-3.5 text-xs sm:text-sm md:text-base text-zinc-400 max-w-lg mx-auto leading-relaxed">
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
                      className="w-full h-11 sm:h-12 pl-3.5 pr-20 sm:pr-24 text-xs sm:text-sm md:text-base bg-transparent text-white placeholder:text-zinc-500 focus:outline-none"
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
          <section className="py-6 px-4 sm:px-6 max-w-2xl mx-auto">
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
          <section className="py-6 px-4 sm:px-6 max-w-4xl mx-auto" id="result-section">
            <div className="rounded-2xl sm:rounded-3xl border border-zinc-800 bg-zinc-900/90 shadow-2xl p-4 sm:p-6 md:p-8 overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6 items-center">
                {/* Left Column: Responsive Video Preview Container */}
                <div className="md:col-span-5 flex justify-center">
                  <div className="w-full max-w-[260px] sm:max-w-[280px] aspect-[9/16] bg-black rounded-2xl overflow-hidden shadow-2xl border border-zinc-800/80 relative">
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
                <div className="md:col-span-7 flex flex-col justify-between space-y-4">
                  {/* Creator Info */}
                  <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full p-0.5 bg-ig-gradient flex items-center justify-center">
                        <div className="w-full h-full rounded-full bg-zinc-900 flex items-center justify-center text-pink-400 font-bold text-xs sm:text-sm uppercase">
                          {data.author.charAt(0) || "IG"}
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-bold text-white text-sm sm:text-base">
                            @{data.author}
                          </h3>
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                        </div>
                        <p className="text-[11px] text-zinc-400">
                          Instagram Creator • #{data.shortcode}
                        </p>
                      </div>
                    </div>

                    <a
                      href={`https://www.instagram.com/p/${data.shortcode}/`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-zinc-800 text-zinc-300 hover:bg-zinc-700 transition-colors"
                    >
                      <span>Buka di IG</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  {/* Caption Box */}
                  {data.caption && (
                    <div className="p-3 sm:p-3.5 rounded-xl bg-zinc-800/50 border border-zinc-800 text-left">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1">
                          <FileText className="w-3 h-3 text-pink-500" />
                          <span>Caption Post</span>
                        </span>
                        <button
                          type="button"
                          onClick={handleCopyCaption}
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-pink-400 hover:underline cursor-pointer"
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
                        className={`text-xs sm:text-sm text-zinc-300 leading-relaxed whitespace-pre-line ${
                          !isCaptionExpanded ? "line-clamp-3" : ""
                        }`}
                      >
                        {data.caption}
                      </p>
                      {data.caption.length > 120 && (
                        <button
                          type="button"
                          onClick={() => setIsCaptionExpanded(!isCaptionExpanded)}
                          className="mt-1 text-[11px] font-semibold text-zinc-400 hover:text-pink-400 transition-colors cursor-pointer"
                        >
                          {isCaptionExpanded ? "Sembunyikan" : "Lihat Selengkapnya..."}
                        </button>
                      )}
                    </div>
                  )}

                  {/* Feature highlights pill */}
                  <div className="flex items-center gap-2 flex-wrap text-[11px] text-zinc-400">
                    <span className="px-2 py-0.5 rounded-md bg-zinc-800/70 border border-zinc-700/50">Format: MP4</span>
                    <span className="px-2 py-0.5 rounded-md bg-zinc-800/70 border border-zinc-700/50">Resolusi: HD Asli</span>
                    <span className="px-2 py-0.5 rounded-md bg-zinc-800/70 border border-zinc-700/50">Tanpa Watermark</span>
                  </div>

                  {/* Action Download Buttons */}
                  <div className="space-y-2.5 pt-1">
                    <button
                      type="button"
                      onClick={handleDownloadVideo}
                      disabled={downloadingVideo}
                      className="w-full h-12 sm:h-13 rounded-xl bg-ig-gradient bg-ig-gradient-hover text-white font-bold text-sm sm:text-base shadow-lg shadow-pink-500/25 active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-2.5"
                    >
                      {downloadingVideo ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Memulai Unduhan...</span>
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4 stroke-[2.5]" />
                          <span>Download Video HD (.MP4)</span>
                        </>
                      )}
                    </button>

                    <div className="grid grid-cols-2 gap-2.5">
                      <button
                        type="button"
                        onClick={handleDownloadThumbnail}
                        disabled={downloadingThumb}
                        className="h-10 sm:h-11 px-3 rounded-xl border border-zinc-700 bg-zinc-800/90 text-zinc-200 font-semibold text-xs sm:text-sm hover:bg-zinc-700 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <ImageIcon className="w-3.5 h-3.5 text-pink-400" />
                        <span>Thumbnail (.JPG)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setData(null);
                          setUrl("");
                        }}
                        className="h-10 sm:h-11 px-3 rounded-xl border border-zinc-700 bg-zinc-800/90 text-zinc-200 font-semibold text-xs sm:text-sm hover:bg-zinc-700 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <RefreshCw className="w-3.5 h-3.5 text-zinc-400" />
                        <span>Unduh Lainnya</span>
                      </button>
                    </div>
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
              Cara Download Video Reels dengan ReelSnap
            </h2>
            <p className="mt-1.5 text-xs sm:text-sm text-zinc-400">
              Hanya 3 langkah mudah untuk menyimpan video ke perangkat Anda
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-5">
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
                Simpan Video HD
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Lihat preview video yang muncul, lalu tekan <strong className="text-zinc-200">&quot;Download Video HD (.MP4)&quot;</strong> untuk menyimpan otomatis.
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
                Fitur lengkap berstandar production untuk kemudahan pengunduhan video Anda
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
              {/* Feature 1 */}
              <div className="p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-zinc-900/70 border border-zinc-800 shadow-sm">
                <div className="w-8 h-8 rounded-lg bg-pink-950 text-pink-400 flex items-center justify-center mb-3">
                  <Video className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm sm:text-base text-white mb-1">
                  Kualitas Asli Full HD
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Video diunduh langsung dari server CDN Instagram tanpa kompresi tambahan sehingga ketajaman gambar tetap maksimal.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-zinc-900/70 border border-zinc-800 shadow-sm">
                <div className="w-8 h-8 rounded-lg bg-purple-950 text-purple-400 flex items-center justify-center mb-3">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm sm:text-base text-white mb-1">
                  Tanpa Watermark
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Tidak ada logo, teks, atau watermark tambahan pada video unduhan Anda. Bersih dan cocok untuk arsip atau editing.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-zinc-900/70 border border-zinc-800 shadow-sm">
                <div className="w-8 h-8 rounded-lg bg-amber-950 text-amber-400 flex items-center justify-center mb-3">
                  <Zap className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm sm:text-base text-white mb-1">
                  Kecepatan Server Kilat
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Didukung infrastruktur proxy streaming direct pipe, proses unduhan berlangsung instan tanpa buffer lambat.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-zinc-900/70 border border-zinc-800 shadow-sm">
                <div className="w-8 h-8 rounded-lg bg-emerald-950 text-emerald-400 flex items-center justify-center mb-3">
                  <Smartphone className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm sm:text-base text-white mb-1">
                  Dukungan Semua Perangkat
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Bekerja lancar di iPhone (Safari), HP Android (Chrome), komputer Windows, macOS, dan tablet.
                </p>
              </div>

              {/* Feature 5 */}
              <div className="p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-zinc-900/70 border border-zinc-800 shadow-sm">
                <div className="w-8 h-8 rounded-lg bg-blue-950 text-blue-400 flex items-center justify-center mb-3">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm sm:text-base text-white mb-1">
                  100% Aman & Anonim
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Tidak perlu login akun atau menginstal APK apa pun. Kami tidak menyimpan riwayat unduhan atau data pribadi Anda.
                </p>
              </div>

              {/* Feature 6 */}
              <div className="p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-zinc-900/70 border border-zinc-800 shadow-sm">
                <div className="w-8 h-8 rounded-lg bg-rose-950 text-rose-400 flex items-center justify-center mb-3">
                  <Share2 className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm sm:text-base text-white mb-1">
                  Thumbnail & Teks Caption
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Selain video MP4, Anda juga dapat mengunduh gambar thumbnail berkualitas tinggi dan menyalin teks caption lengkap.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-10 sm:py-14 px-4 sm:px-6 max-w-4xl mx-auto">
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
              className="w-6 h-6 rounded-md object-cover shadow-sm"
            />
            <span className="font-bold text-sm sm:text-base text-white">
              ReelSnap
            </span>
          </div>

          <p className="text-[11px] sm:text-xs text-zinc-400 max-w-lg mx-auto leading-relaxed">
            Layanan pengunduh media online gratis untuk konten Instagram publik. ReelSnap tidak berafiliasi,
            didukung, atau disponsori oleh Instagram atau Meta Platforms, Inc.
          </p>

          <div className="flex items-center justify-center gap-3 text-[11px] sm:text-xs font-medium text-zinc-400 pt-1">
            <span className="hover:text-pink-400 cursor-pointer">Kebijakan Privasi</span>
            <span>•</span>
            <span className="hover:text-pink-400 cursor-pointer">Ketentuan Layanan</span>
            <span>•</span>
            <span className="hover:text-pink-400 cursor-pointer">Bantuan</span>
          </div>

          <div className="text-[10px] sm:text-[11px] text-zinc-600 pt-1">
            &copy; 2026 ReelSnap. Seluruh hak cipta dilindungi undang-undang.
          </div>
        </div>
      </footer>
    </div>
  );
}
