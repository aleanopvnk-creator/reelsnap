"use client";

import React, { useState, useEffect, useCallback } from "react";
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
  Smartphone,
  RefreshCw,
  AlertCircle,
  FileText,
  CheckCircle2,
  Music,
  History,
  Trash2,
  Globe,
  Sun,
  Moon,
  Clock,
  Image as ImageIcon,
  Layers,
  Film,
  Headphones,
  ScanSearch,
  Infinity,
  ChevronLeft,
  ChevronRight,
  Info,
} from "lucide-react";
import FaqAccordion from "@/components/FaqAccordion";
import AdSlot from "@/components/AdSlot";
import InfoModal, { ModalTab } from "@/components/InfoModal";
import { Language, translations } from "@/lib/translations";

export interface MediaItem {
  id?: string;
  type: "video" | "image";
  url: string;
  thumbnailUrl: string;
  width?: number;
  height?: number;
}

export interface ExtractionData {
  shortcode: string;
  mediaType: "video" | "image" | "carousel";
  videoUrl?: string;
  audioUrl?: string;
  imageUrl?: string;
  items?: MediaItem[];
  thumbnailUrl: string;
  caption: string;
  author: string;
  duration?: number;
  source: string;
}

export interface DownloadHistoryItem {
  id: string;
  shortcode: string;
  url: string;
  thumbnailUrl: string;
  author: string;
  caption: string;
  mediaType: "video" | "image" | "carousel";
  timestamp: number;
  timeFormatted?: string;
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
  const [downloadingPhoto, setDownloadingPhoto] = useState<number | boolean>(false);
  const [downloadingAll, setDownloadingAll] = useState(false);
  const [activeCarouselIndex, setActiveCarouselIndex] = useState(0);
  const [modalTab, setModalTab] = useState<ModalTab | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Production Features
  const [lang, setLang] = useState<Language>("id");
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [history, setHistory] = useState<DownloadHistoryItem[]>([]);
  const [copiedHistoryId, setCopiedHistoryId] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPwaModal, setShowPwaModal] = useState(false);

  const t = translations[lang];

  // Helper to smoothly scroll to an element considering sticky header and mobile viewports
  const scrollToSection = (id: string) => {
    if (typeof window === "undefined") return;
    const el = document.getElementById(id);
    if (!el) return;

    el.scrollIntoView({ behavior: "smooth", block: "start" });

    setTimeout(() => {
      const updatedEl = document.getElementById(id);
      if (updatedEl) {
        const rect = updatedEl.getBoundingClientRect();
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

  // Automatic smooth scroll to result area when extraction completes successfully
  useEffect(() => {
    if (data && !isLoading) {
      const timer = setTimeout(() => {
        scrollToSection("result-section");
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [data, isLoading]);

  // Load Saved Preferences (Theme, Language, History) & PWA Listeners
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const savedLang = localStorage.getItem("reelsnap_lang") as Language | null;
        if (savedLang === "id" || savedLang === "en") {
          setLang(savedLang);
        }

        const savedTheme = localStorage.getItem("reelsnap_theme") as "dark" | "light" | null;
        if (savedTheme === "light" || savedTheme === "dark") {
          setTheme(savedTheme);
          if (typeof document !== "undefined") {
            document.documentElement.classList.remove("dark", "light");
            document.documentElement.classList.add(savedTheme);
            document.documentElement.setAttribute("data-theme", savedTheme);
          }
        }

        const savedHistory = localStorage.getItem("reelsnap_download_history");
        if (savedHistory) {
          const parsed = JSON.parse(savedHistory);
          if (Array.isArray(parsed)) {
            setHistory(parsed.slice(0, 6));
          }
        }
      } catch {
        // ignore storage errors
      }
    }, 50);

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  // Theme Toggle Handler
  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    if (typeof document !== "undefined") {
      if (newTheme === "light") {
        document.documentElement.classList.remove("dark");
        document.documentElement.classList.add("light");
        document.documentElement.setAttribute("data-theme", "light");
      } else {
        document.documentElement.classList.remove("light");
        document.documentElement.classList.add("dark");
        document.documentElement.setAttribute("data-theme", "dark");
      }
    }
    try {
      localStorage.setItem("reelsnap_theme", newTheme);
    } catch {
      // ignore
    }
  };

  // Language Toggle Handler
  const toggleLanguage = () => {
    const newLang: Language = lang === "id" ? "en" : "id";
    setLang(newLang);
    try {
      localStorage.setItem("reelsnap_lang", newLang);
    } catch {
      // ignore
    }
  };

  // Install PWA Handler
  const handleInstallApp = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice?.outcome === "accepted") {
        setDeferredPrompt(null);
      }
    } else {
      setShowPwaModal(true);
    }
  };

  const handleOpenModal = (tab: ModalTab) => {
    setModalTab(tab);
  };

  const handleScrollToFaq = () => {
    const faqElement = document.getElementById("faq");
    if (faqElement) {
      faqElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Extraction submit runner
  const triggerSubmit = useCallback(
    async (targetUrl: string) => {
      const cleanTarget = targetUrl.trim();
      if (!cleanTarget) {
        setError(t.hero.emptyError);
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
      setActiveCarouselIndex(0);

      try {
        const response = await fetch("/api/extract", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: cleanTarget }),
        });

        const resData = await response.json();

        if (!response.ok || !resData.success) {
          throw new Error(resData.error || "Gagal mengekstrak media dari URL Instagram tersebut.");
        }

        setData(resData);

        // Format timestamp safely inside event handler
        const now = new Date();
        const timeFormatted = now.toLocaleDateString(lang === "en" ? "en-US" : "id-ID", {
          day: "numeric",
          month: "short",
          hour: "2-digit",
          minute: "2-digit",
        });

        // Save to Recent Downloads History (Max 6, deduplicated by shortcode)
        const historyItem: DownloadHistoryItem = {
          id: resData.shortcode,
          shortcode: resData.shortcode,
          url: cleanTarget,
          thumbnailUrl: resData.thumbnailUrl,
          author: resData.author || "Instagram Creator",
          caption: resData.caption || "",
          mediaType: resData.mediaType || "video",
          timestamp: Date.now(),
          timeFormatted,
        };

        setHistory((prev) => {
          const filtered = prev.filter((item) => item.shortcode !== resData.shortcode);
          const updated = [historyItem, ...filtered].slice(0, 6);
          try {
            localStorage.setItem("reelsnap_download_history", JSON.stringify(updated));
          } catch {
            // ignore
          }
          return updated;
        });
      } catch (err: unknown) {
        setError(
          err instanceof Error
            ? err.message
            : "Terjadi gangguan saat mengambil data. Silakan periksa kembali tautan Anda."
        );
      } finally {
        setIsLoading(false);
      }
    },
    [t.hero.emptyError, lang]
  );

  // Form submit handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    triggerSubmit(url);
  };

  // Paste from clipboard handler with auto-fetch
  const handlePaste = async () => {
    try {
      if (!navigator.clipboard?.readText) {
        setError(t.hero.clipboardError);
        return;
      }
      const text = await navigator.clipboard.readText();
      if (text) {
        const clean = text.trim();
        setUrl(clean);
        setError(null);

        // Auto-fetch if valid Instagram link
        if (/(?:instagram\.com|instagr\.am)\/(?:reel|reels|p|tv|share\/(?:reel|p))\/([A-Za-z0-9_-]+)/i.test(clean)) {
          triggerSubmit(clean);
        }
      }
    } catch {
      setError(t.hero.clipboardDenied);
    }
  };

  // Clear input handler
  const handleClear = () => {
    setUrl("");
    setError(null);
    setData(null);
  };

  // Clear History handler
  const handleClearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem("reelsnap_download_history");
    } catch {
      // ignore
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
      setError("Gagal menyalin keterangan ke clipboard.");
    }
  };

  // Copy link from history
  const handleCopyHistoryLink = async (itemUrl: string, id: string) => {
    try {
      await navigator.clipboard.writeText(itemUrl);
      setCopiedHistoryId(id);
      setTimeout(() => setCopiedHistoryId(null), 2000);
    } catch {
      // ignore
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

  const handleDownloadPhoto = (photoUrl?: string, itemIndex?: number) => {
    const targetPhoto = photoUrl || data?.imageUrl || data?.thumbnailUrl;
    if (!targetPhoto) return;
    setDownloadingPhoto(itemIndex !== undefined ? itemIndex : true);

    const indexSuffix = itemIndex !== undefined ? `-${itemIndex + 1}` : "";
    const downloadUrl = `/api/download?url=${encodeURIComponent(targetPhoto)}&filename=ReelSnap-Photo-${data?.shortcode}${indexSuffix}.jpg&type=image`;

    const link = document.createElement("a");
    link.href = downloadUrl;
    link.setAttribute("download", `ReelSnap-Photo-${data?.shortcode}${indexSuffix}.jpg`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => setDownloadingPhoto(false), 2000);
  };

  const handleDownloadAllPhotos = async () => {
    if (!data?.items || data.items.length === 0) return;
    setDownloadingAll(true);
    for (let i = 0; i < data.items.length; i++) {
      const item = data.items[i];
      const link = document.createElement("a");
      const downloadUrl = `/api/download?url=${encodeURIComponent(item.url)}&filename=ReelSnap-Photo-${data.shortcode}-${i + 1}.jpg&type=image`;
      link.href = downloadUrl;
      link.setAttribute("download", `ReelSnap-Photo-${data.shortcode}-${i + 1}.jpg`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      await new Promise((r) => setTimeout(r, 450));
    }
    setTimeout(() => setDownloadingAll(false), 1200);
  };

  const handleReset = () => {
    setData(null);
    setUrl("");
    setActiveCarouselIndex(0);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      setTimeout(() => {
        const inputEl = document.getElementById("instagram-url-input");
        inputEl?.focus();
      }, 350);
    }
  };

  // Media flags and item resolution
  const isVideo = data?.mediaType === "video";
  const isCarousel = data?.mediaType === "carousel" && Array.isArray(data?.items) && data.items.length > 1;
  const currentItem = isCarousel && data?.items ? data.items[activeCarouselIndex] : null;

  const currentPhotoUrl = currentItem?.url || data?.imageUrl || data?.thumbnailUrl || "";
  const proxiedPhotoUrl = currentPhotoUrl
    ? `/api/download?url=${encodeURIComponent(currentPhotoUrl)}&filename=photo-${data?.shortcode}-${activeCarouselIndex + 1}.jpg&type=image`
    : "";

  const proxiedVideoUrl = (currentItem?.type === "video" ? currentItem.url : data?.videoUrl)
    ? `/api/download?url=${encodeURIComponent(currentItem?.type === "video" ? currentItem.url : data!.videoUrl!)}&filename=preview-${data?.shortcode}.mp4`
    : "";

  const proxiedThumbnailUrl = (currentItem?.thumbnailUrl || data?.thumbnailUrl)
    ? `/api/download?url=${encodeURIComponent(currentItem?.thumbnailUrl || data!.thumbnailUrl)}&filename=poster-${data?.shortcode}.jpg&type=image`
    : "";

  return (
    <div
      data-theme={theme}
      className={`min-h-screen flex flex-col justify-between ${
        theme === "light"
          ? "bg-slate-50 text-slate-950 light"
          : "bg-zinc-950 text-zinc-100 dark"
      } overflow-x-hidden selection:bg-pink-500 selection:text-white transition-colors duration-200`}
    >
      {/* Top Header */}
      <header
        className={`sticky top-0 z-50 backdrop-blur-xl border-b transition-colors ${
          theme === "light"
            ? "bg-white/95 border-slate-200 shadow-sm"
            : "bg-zinc-950/85 border-zinc-800/80"
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-2.5">
            <button
              type="button"
              onClick={() => scrollToSection("hero")}
              className="flex items-center gap-2 sm:gap-2.5 cursor-pointer text-left focus:outline-none"
            >
              <img
                src="/icon.png"
                alt="ReelSnap Logo"
                className="w-8 h-8 sm:w-9 sm:h-9 object-contain drop-shadow-[0_2px_10px_rgba(236,72,153,0.35)] transition-transform hover:scale-105 select-none"
              />
              <span className="font-black text-lg sm:text-xl tracking-tight text-slate-950 dark:text-white">
                Reel<span className="text-ig-gradient font-black">Snap</span>
              </span>
            </button>
          </div>

          {/* Center Navigation Anchor Links (Smooth Scroll) */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-1.5">
            <button
              type="button"
              onClick={() => scrollToSection("hero")}
              className={`px-2.5 lg:px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                theme === "light"
                  ? "text-slate-700 hover:text-pink-600 hover:bg-slate-100"
                  : "text-zinc-300 hover:text-pink-400 hover:bg-zinc-900/80"
              }`}
            >
              {t.navbar.home}
            </button>
            <button
              type="button"
              onClick={() => scrollToSection("how-to")}
              className={`px-2.5 lg:px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                theme === "light"
                  ? "text-slate-700 hover:text-pink-600 hover:bg-slate-100"
                  : "text-zinc-300 hover:text-pink-400 hover:bg-zinc-900/80"
              }`}
            >
              {t.navbar.howTo}
            </button>
            <button
              type="button"
              onClick={() => scrollToSection("features")}
              className={`px-2.5 lg:px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                theme === "light"
                  ? "text-slate-700 hover:text-pink-600 hover:bg-slate-100"
                  : "text-zinc-300 hover:text-pink-400 hover:bg-zinc-900/80"
              }`}
            >
              {t.navbar.features}
            </button>
            <button
              type="button"
              onClick={() => scrollToSection("faq")}
              className={`px-2.5 lg:px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                theme === "light"
                  ? "text-slate-700 hover:text-pink-600 hover:bg-slate-100"
                  : "text-zinc-300 hover:text-pink-400 hover:bg-zinc-900/80"
              }`}
            >
              {t.navbar.faq}
            </button>
            <button
              type="button"
              onClick={() => scrollToSection("about")}
              className={`px-2.5 lg:px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                theme === "light"
                  ? "text-slate-700 hover:text-pink-600 hover:bg-slate-100"
                  : "text-zinc-300 hover:text-pink-400 hover:bg-zinc-900/80"
              }`}
            >
              {t.navbar.about}
            </button>
          </nav>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* PWA Install Button */}
            <button
              type="button"
              onClick={handleInstallApp}
              title={t.navbar.installApp}
              className="hidden xs:inline-flex items-center gap-1 text-[11px] sm:text-xs font-bold px-2.5 py-1 rounded-full bg-pink-500/15 hover:bg-pink-500/25 border border-pink-500/30 text-pink-700 dark:text-pink-300 transition-colors cursor-pointer"
            >
              <Smartphone className="w-3 h-3 text-pink-600 dark:text-pink-400" />
              <span className="hidden sm:inline">{t.navbar.installApp}</span>
              <span className="sm:hidden">{t.navbar.installAppShort}</span>
            </button>

            {/* Language Switcher (ID / EN) */}
            <button
              type="button"
              onClick={toggleLanguage}
              title="Ganti Bahasa / Switch Language"
              className={`inline-flex items-center gap-1 text-[11px] sm:text-xs font-bold px-2.5 py-1 rounded-full border transition-colors cursor-pointer ${
                theme === "light"
                  ? "bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-900 shadow-sm"
                  : "bg-zinc-900/80 hover:bg-zinc-800 border-zinc-800/80 text-zinc-200"
              }`}
            >
              <Globe className="w-3 h-3 text-pink-600 dark:text-pink-400" />
              <span>{lang.toUpperCase()}</span>
            </button>

            {/* Theme Toggle (Dark / Light) */}
            <button
              type="button"
              onClick={toggleTheme}
              title={theme === "dark" ? "Mode Terang (Light Mode)" : "Mode Gelap (Dark Mode)"}
              className={`p-1.5 rounded-full border transition-all cursor-pointer ${
                theme === "light"
                  ? "bg-amber-100 hover:bg-amber-200 border-amber-300 text-amber-800 shadow-sm"
                  : "bg-zinc-900/80 hover:bg-zinc-800 border-zinc-800/80 text-zinc-200"
              }`}
            >
              {theme === "dark" ? (
                <Sun className="w-3.5 h-3.5 text-amber-400" />
              ) : (
                <Moon className="w-3.5 h-3.5 text-purple-700" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <section id="hero" className="relative pt-6 pb-4 sm:pt-12 sm:pb-8 px-4 sm:px-6 overflow-hidden scroll-mt-20">
          {/* Subtle Glow Background */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] sm:w-[500px] h-[220px] sm:h-[320px] bg-gradient-to-tr from-pink-500/15 via-purple-500/10 to-orange-400/15 blur-3xl pointer-events-none rounded-full" />

          <div className="relative max-w-3xl mx-auto text-center">
            {/* Tag Badge */}
            <div className={`inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1.5 rounded-full border text-[10.5px] xs:text-xs sm:text-xs font-extrabold mb-3.5 sm:mb-5 transition-all select-none max-w-full ${
              theme === "light"
                ? "bg-pink-50 border-pink-300 text-pink-800 shadow-sm"
                : "bg-gradient-to-r from-pink-500/15 via-purple-500/10 to-amber-500/15 border-pink-500/30 text-pink-200 shadow-lg shadow-pink-500/10 backdrop-blur-md hover:border-pink-500/50"
            }`}>
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-gradient-to-tr from-pink-500 via-rose-500 to-amber-400 text-white shadow-sm shadow-pink-500/40 shrink-0">
                <Flame className="w-3 h-3 fill-white animate-pulse" />
              </span>
              <span className="tracking-wide">{t.hero.badge}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-slate-950 dark:text-white tracking-tight leading-[1.18]">
              {t.hero.titleLine1} <br className="hidden sm:inline" />
              <span className="text-ig-gradient block sm:inline mt-1 sm:mt-0 font-black">{t.hero.titleLine2}</span>
            </h1>

            {/* Subtitle */}
            <p className="mt-2.5 sm:mt-3.5 text-xs sm:text-sm md:text-base font-semibold text-slate-700 dark:text-zinc-300 max-w-lg mx-auto leading-relaxed px-2">
              {t.hero.subtitle}
            </p>

            {/* Input Form Card */}
            <div className="mt-6 sm:mt-8 max-w-2xl mx-auto">
              <form
                onSubmit={handleSubmit}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsDragging(true);
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsDragging(false);
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsDragging(false);
                  const droppedText =
                    e.dataTransfer.getData("text/uri-list") ||
                    e.dataTransfer.getData("text/plain");
                  if (droppedText && droppedText.trim()) {
                    const clean = droppedText.trim();
                    setUrl(clean);
                    setError(null);
                    setTimeout(() => triggerSubmit(clean), 60);
                  }
                }}
                className={`backdrop-blur-md rounded-2xl border-2 p-2 sm:p-2.5 transition-all focus-within:ring-2 focus-within:ring-pink-500/40 focus-within:border-pink-500 ${
                  isDragging
                    ? "border-pink-500 bg-pink-500/10 ring-4 ring-pink-500/25 scale-[1.01]"
                    : theme === "light"
                    ? "bg-white border-slate-300 shadow-xl shadow-slate-200/70"
                    : "bg-zinc-900/90 border-zinc-800 shadow-xl shadow-pink-500/5"
                }`}
              >
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <div className="relative flex-1 flex items-center">
                    <input
                      type="url"
                      id="instagram-url-input"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      onPaste={(e) => {
                        const pasted = e.clipboardData.getData("text").trim();
                        if (/(?:instagram\.com|instagr\.am)\/(?:reel|reels|p|tv|share\/(?:reel|p))\/([A-Za-z0-9_-]+)/i.test(pasted)) {
                          setUrl(pasted);
                          setError(null);
                          setTimeout(() => triggerSubmit(pasted), 60);
                        }
                      }}
                      placeholder={t.hero.placeholder}
                      className={`w-full h-11 sm:h-12 pl-3.5 pr-20 sm:pr-24 text-base sm:text-sm bg-transparent font-bold focus:outline-none ${
                        theme === "light"
                          ? "text-slate-950 placeholder:text-slate-500 placeholder:font-semibold"
                          : "text-white placeholder:text-zinc-400 placeholder:font-medium"
                      } placeholder:text-xs sm:placeholder:text-sm`}
                      disabled={isLoading}
                      required
                    />

                    {/* Dynamic Clear / Paste Button inside input */}
                    <div className="absolute right-2 flex items-center gap-1">
                      {url ? (
                        <button
                          type="button"
                          onClick={handleClear}
                          aria-label={t.hero.clearBtn}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                            theme === "light"
                              ? "bg-slate-200 hover:bg-slate-300 text-slate-900"
                              : "bg-zinc-800 hover:bg-zinc-700 text-zinc-200"
                          }`}
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>{t.hero.clearBtn}</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={handlePaste}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                            theme === "light"
                              ? "bg-slate-200 hover:bg-slate-300 text-slate-900"
                              : "bg-zinc-800 hover:bg-zinc-700 text-zinc-200"
                          }`}
                        >
                          <Clipboard className="w-3 h-3 text-pink-500" />
                          <span>{t.hero.pasteBtn}</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full sm:w-auto h-11 sm:h-12 px-6 sm:px-8 rounded-xl bg-ig-gradient bg-ig-gradient-hover text-white font-black text-xs sm:text-sm md:text-base shadow-lg shadow-pink-500/25 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shrink-0"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>{t.hero.processingBtn}</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4 stroke-[2.5]" />
                        <span>{t.hero.downloadBtn}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Supported Links Format Info */}
              <div className="mt-2.5 flex items-center justify-center gap-1.5 px-2 text-center select-none">
                <Info className="w-3.5 h-3.5 text-pink-600 dark:text-pink-400 shrink-0" />
                <span className="text-[11px] sm:text-xs font-semibold text-slate-600 dark:text-zinc-400">
                  {isDragging ? t.hero.dropHere : t.hero.supportedLinksInfo}
                </span>
              </div>

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

            {/* Recent Downloads History (Client-Side via localStorage) */}
            {history.length > 0 && (
              <div className="mt-6 sm:mt-8 max-w-2xl mx-auto text-left">
                <div className="p-3.5 sm:p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 shadow-lg">
                  <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-zinc-800/80">
                    <div className="flex items-center gap-2">
                      <History className="w-4 h-4 text-pink-400" />
                      <h3 className="font-bold text-white text-xs sm:text-sm">
                        {t.history.title}
                      </h3>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300">
                        {history.length} {t.history.itemsCount}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={handleClearHistory}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-zinc-400 hover:text-red-400 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>{t.history.clear}</span>
                    </button>
                  </div>

                  {/* History Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {history.map((item) => (
                      <div
                        key={item.shortcode}
                        className="flex items-center gap-2.5 p-2 rounded-xl bg-zinc-950/60 border border-zinc-800/80 hover:border-zinc-700 transition-colors group"
                      >
                        {/* Thumbnail */}
                        <div className="w-12 h-12 rounded-lg bg-black overflow-hidden relative shrink-0">
                          <img
                            src={`/api/download?url=${encodeURIComponent(item.thumbnailUrl)}&filename=thumb-${item.shortcode}.jpg&type=image`}
                            alt={item.author}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                          <span className="absolute bottom-0.5 right-0.5 px-1 py-0.2 rounded bg-black/80 text-[8.5px] font-bold text-white uppercase">
                            {item.mediaType === "video" ? "MP4 HD" : "FOTO HD"}
                          </span>
                        </div>

                        {/* Info & Actions */}
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-white text-xs truncate">
                            @{item.author}
                          </p>
                          <p className="text-[10.5px] text-zinc-400 flex items-center gap-1 mt-0.5">
                            <Clock className="w-3 h-3 text-zinc-500" />
                            <span>{item.timeFormatted || t.history.justNow}</span>
                          </p>

                          <div className="flex items-center gap-2 mt-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                setUrl(item.url);
                                triggerSubmit(item.url);
                              }}
                              className="text-[10.5px] font-semibold text-pink-400 hover:text-pink-300 transition-colors cursor-pointer"
                            >
                              {t.history.reDownload}
                            </button>
                            <span className="text-zinc-600">•</span>
                            <button
                              type="button"
                              onClick={() => handleCopyHistoryLink(item.url, item.id)}
                              className="text-[10.5px] font-semibold text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
                            >
                              {copiedHistoryId === item.id ? t.history.copied : t.history.copyLink}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Top Responsive Ad Slot */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <AdSlot slotId="top-horizontal-banner" format="horizontal" lang={lang} />
        </div>

        {/* Loading Skeleton */}
        {isLoading && (
          <section id="loading-section" className="py-6 px-4 sm:px-6 max-w-2xl mx-auto scroll-mt-20 sm:scroll-mt-24">
            <div className="rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 sm:p-6 shadow-xl space-y-4 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-zinc-800" />
                <div className="space-y-1.5 flex-1">
                  <div className="w-32 h-3.5 rounded bg-slate-200 dark:bg-zinc-800" />
                  <div className="w-20 h-2.5 rounded bg-slate-200 dark:bg-zinc-800" />
                </div>
              </div>
              <div className="w-full aspect-video rounded-xl bg-slate-200 dark:bg-zinc-800" />
              <div className="space-y-2">
                <div className="w-3/4 h-3.5 rounded bg-slate-200 dark:bg-zinc-800" />
                <div className="w-1/2 h-3 rounded bg-slate-200 dark:bg-zinc-800" />
              </div>
              <div className="w-full h-11 rounded-xl bg-slate-200 dark:bg-zinc-800" />
            </div>
          </section>
        )}

        {/* Result Area: Focused on Reels Video & MP3 Audio */}
        {data && (
          <section id="result-section" className="py-6 px-3 sm:px-6 max-w-4xl mx-auto scroll-mt-20 sm:scroll-mt-24">
            <div className={`rounded-2xl sm:rounded-3xl border-2 p-4 sm:p-6 md:p-8 overflow-hidden backdrop-blur-sm transition-all ${
              theme === "light"
                ? "bg-white border-slate-300 shadow-2xl shadow-slate-200/80"
                : "bg-zinc-900/95 border-zinc-800 shadow-2xl shadow-pink-500/5"
            }`}>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6 items-center">
                {/* Left Column: Responsive Uncropped Media Player & Image Viewer */}
                <div className="md:col-span-5 flex flex-col items-center justify-center w-full">
                  <div className="w-full max-w-[320px] xs:max-w-[340px] sm:max-w-[360px] md:max-w-[380px] min-h-[260px] max-h-[500px] flex items-center justify-center bg-black/95 dark:bg-black rounded-2xl overflow-hidden shadow-2xl border border-zinc-800/90 relative group p-2">
                    {isVideo || currentItem?.type === "video" ? (
                      <video
                        key={proxiedVideoUrl}
                        src={proxiedVideoUrl}
                        poster={proxiedThumbnailUrl}
                        controls
                        preload="metadata"
                        playsInline
                        className="w-auto h-auto max-w-full max-h-[460px] object-contain rounded-xl select-none"
                      >
                        Browser Anda tidak mendukung pemutar video. Silakan langsung unduh file melalui tombol di samping.
                      </video>
                    ) : (
                      <div className="relative w-full h-full flex flex-col items-center justify-center min-h-[260px]">
                        <img
                          key={proxiedPhotoUrl}
                          src={proxiedPhotoUrl}
                          alt={data.caption || "Instagram Photo"}
                          className="w-auto h-auto max-w-full max-h-[460px] object-contain rounded-xl select-none transition-all duration-300"
                          loading="eager"
                        />
                        <span className="absolute bottom-2 right-2 px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md text-[9.5px] xs:text-[10px] font-black text-white border border-white/20 shadow-md flex items-center gap-1 select-none">
                          <BadgeCheck className="w-3.5 h-3.5 text-emerald-400" />
                          <span>{t.result.uncroppedLabel}</span>
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Multi-item carousel thumbnail slider */}
                  {isCarousel && data.items && data.items.length > 1 && (
                    <div className="w-full max-w-[320px] xs:max-w-[340px] sm:max-w-[360px] md:max-w-[380px] mt-3">
                      <div className="flex items-center justify-between text-[11px] font-bold text-zinc-400 dark:text-zinc-400 mb-1.5 px-1">
                        <span>
                          {t.result.slideOf} {activeCarouselIndex + 1} / {data.items.length}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() =>
                              setActiveCarouselIndex((prev) =>
                                prev > 0 ? prev - 1 : data.items!.length - 1
                              )
                            }
                            className="p-1 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors cursor-pointer"
                            title="Foto Sebelumnya"
                          >
                            <ChevronLeft className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setActiveCarouselIndex((prev) =>
                                prev < data.items!.length - 1 ? prev + 1 : 0
                              )
                            }
                            className="p-1 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors cursor-pointer"
                            title="Foto Selanjutnya"
                          >
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 overflow-x-auto py-1 px-0.5 scrollbar-thin">
                        {data.items.map((item, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setActiveCarouselIndex(idx)}
                            className={`relative w-12 h-12 rounded-lg overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                              activeCarouselIndex === idx
                                ? "border-pink-500 scale-105 shadow-md shadow-pink-500/30"
                                : "border-zinc-700/60 opacity-60 hover:opacity-100"
                            }`}
                          >
                            <img
                              src={`/api/download?url=${encodeURIComponent(
                                item.thumbnailUrl || item.url
                              )}&filename=thumb-${data.shortcode}-${idx}.jpg&type=image`}
                              alt={`Slide ${idx + 1}`}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                            <span className="absolute bottom-0.5 right-0.5 px-1 rounded bg-black/80 text-[8px] font-bold text-white">
                              {idx + 1}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Column: Media Details & Actions */}
                <div className="md:col-span-7 flex flex-col justify-between space-y-3.5 sm:space-y-4">
                  {/* Creator Info & Detected Media Type */}
                  <div
                    className={`flex items-center justify-between pb-3 border-b gap-2 ${
                      theme === "light" ? "border-slate-200" : "border-zinc-800/80"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full p-0.5 bg-ig-gradient flex items-center justify-center shrink-0">
                        <div className="w-full h-full rounded-full bg-zinc-900 flex items-center justify-center text-pink-400 font-black text-xs sm:text-sm uppercase">
                          {data.author.charAt(0) || "IG"}
                        </div>
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-black text-slate-950 dark:text-white text-sm sm:text-base truncate">
                            @{data.author}
                          </h3>
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                        </div>
                        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                          {isVideo ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/30">
                              <Video className="w-3 h-3" />
                              <span>{t.result.videoBadge}</span>
                            </span>
                          ) : isCarousel ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-pink-500/15 text-pink-600 dark:text-pink-400 border border-pink-500/30">
                              <Layers className="w-3 h-3" />
                              <span>
                                {t.result.carouselBadge} ({data.items?.length || 0})
                              </span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                              <ImageIcon className="w-3 h-3" />
                              <span>{t.result.photoBadge}</span>
                            </span>
                          )}
                          <p className="text-[11px] font-bold text-slate-600 dark:text-zinc-400 truncate">
                            • #{data.shortcode}
                          </p>
                        </div>
                      </div>
                    </div>

                    <a
                      href={`https://www.instagram.com/p/${data.shortcode}/`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center gap-1 text-[11px] sm:text-xs font-bold px-2.5 py-1.5 rounded-lg transition-colors shrink-0 ${
                        theme === "light"
                          ? "bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300"
                          : "bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
                      }`}
                    >
                      <span>{t.result.openInIg}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  {/* Caption Box */}
                  {data.caption && (
                    <div
                      className={`p-3 sm:p-3.5 rounded-xl border text-left ${
                        theme === "light"
                          ? "bg-slate-50 border-slate-200"
                          : "bg-zinc-800/50 border-zinc-800/90"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10.5px] sm:text-xs font-black uppercase tracking-wider text-slate-700 dark:text-zinc-400 flex items-center gap-1">
                          <FileText className="w-3 h-3 text-pink-600 dark:text-pink-500" />
                          <span>{t.result.captionTitle}</span>
                        </span>
                        <button
                          type="button"
                          onClick={handleCopyCaption}
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-pink-600 hover:text-pink-700 dark:text-pink-400 dark:hover:text-pink-300 transition-colors cursor-pointer"
                        >
                          {copiedCaption ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-500" />
                              <span className="text-emerald-600 dark:text-emerald-400">
                                {t.result.copied}
                              </span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>{t.result.copyCaption}</span>
                            </>
                          )}
                        </button>
                      </div>
                      <p
                        className={`text-xs sm:text-sm font-semibold leading-relaxed whitespace-pre-line ${
                          theme === "light" ? "text-slate-800" : "text-zinc-200"
                        } ${!isCaptionExpanded ? "line-clamp-3" : ""}`}
                      >
                        {data.caption}
                      </p>
                      {data.caption.length > 120 && (
                        <button
                          type="button"
                          onClick={() => setIsCaptionExpanded(!isCaptionExpanded)}
                          className="mt-1 text-[11px] font-bold text-pink-600 hover:text-pink-700 dark:text-pink-400 dark:hover:text-pink-300 transition-colors cursor-pointer"
                        >
                          {isCaptionExpanded ? t.result.showLess : t.result.showMore}
                        </button>
                      )}
                    </div>
                  )}

                  {/* Feature Highlights Pills */}
                  <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap text-[10.5px] sm:text-[11px]">
                    <span
                      className={`px-2 py-0.5 rounded-md font-bold border ${
                        theme === "light"
                          ? "bg-slate-100 border-slate-300 text-slate-800"
                          : "bg-zinc-800/80 border-zinc-700/60 text-zinc-300"
                      }`}
                    >
                      {t.result.badges.format}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-md font-bold border ${
                        theme === "light"
                          ? "bg-slate-100 border-slate-300 text-slate-800"
                          : "bg-zinc-800/80 border-zinc-700/60 text-zinc-300"
                      }`}
                    >
                      {t.result.badges.resolution}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-md font-bold border ${
                        theme === "light"
                          ? "bg-emerald-100 border-emerald-300 text-emerald-900"
                          : "bg-zinc-800/80 border-zinc-700/60 text-emerald-300"
                      }`}
                    >
                      {t.result.badges.uncropped}
                    </span>
                    {isVideo && (
                      <span
                        className={`px-2 py-0.5 rounded-md font-bold border ${
                          theme === "light"
                            ? "bg-purple-100 border-purple-300 text-purple-900"
                            : "bg-zinc-800/80 border-zinc-700/60 text-purple-300"
                        }`}
                      >
                        {t.result.badges.audio}
                      </span>
                    )}
                    <span
                      className={`px-2 py-0.5 rounded-md font-bold border ${
                        theme === "light"
                          ? "bg-emerald-100 border-emerald-300 text-emerald-900"
                          : "bg-zinc-800/80 border-zinc-700/60 text-emerald-400"
                      }`}
                    >
                      {t.result.badges.noWatermark}
                    </span>
                  </div>

                  {/* Action Download Buttons */}
                  <div className="space-y-2 sm:space-y-2.5 pt-1">
                    {/* VIDEO DOWNLOAD OPTIONS (Reels / Feed Video) */}
                    {isVideo && (
                      <>
                        <button
                          type="button"
                          onClick={handleDownloadVideo}
                          disabled={downloadingVideo}
                          className="w-full h-11 sm:h-12 px-4 rounded-xl bg-ig-gradient bg-ig-gradient-hover text-white font-black text-xs sm:text-sm md:text-base shadow-lg shadow-pink-500/25 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2"
                        >
                          {downloadingVideo ? (
                            <>
                              <RefreshCw className="w-4 h-4 animate-spin" />
                              <span>{t.result.preparingVideo}</span>
                            </>
                          ) : (
                            <>
                              <Download className="w-4 h-4 stroke-[2.5]" />
                              <span>{t.result.downloadVideo}</span>
                            </>
                          )}
                        </button>

                        {data.audioUrl && (
                          <button
                            type="button"
                            onClick={handleDownloadAudio}
                            disabled={downloadingAudio}
                            className="w-full h-11 sm:h-12 px-4 rounded-xl bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-black text-xs sm:text-sm md:text-base shadow-lg shadow-purple-500/20 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2"
                          >
                            {downloadingAudio ? (
                              <>
                                <RefreshCw className="w-4 h-4 animate-spin" />
                                <span>{t.result.convertingAudio}</span>
                              </>
                            ) : (
                              <>
                                <Music className="w-4 h-4 stroke-[2.5]" />
                                <span>{t.result.downloadAudio}</span>
                                <span className="hidden xs:inline text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full bg-white/20 text-white border border-white/20">
                                  192 kbps
                                </span>
                              </>
                            )}
                          </button>
                        )}
                      </>
                    )}

                    {/* PHOTO DOWNLOAD OPTIONS (Single Photo or Carousel) */}
                    {!isVideo && (
                      <>
                        <button
                          type="button"
                          onClick={() => handleDownloadPhoto(currentPhotoUrl, activeCarouselIndex)}
                          disabled={Boolean(downloadingPhoto)}
                          className="w-full h-11 sm:h-12 px-4 rounded-xl bg-ig-gradient bg-ig-gradient-hover text-white font-black text-xs sm:text-sm md:text-base shadow-lg shadow-pink-500/25 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2"
                        >
                          {downloadingPhoto ? (
                            <>
                              <RefreshCw className="w-4 h-4 animate-spin" />
                              <span>{t.result.preparingPhoto}</span>
                            </>
                          ) : (
                            <>
                              <Download className="w-4 h-4 stroke-[2.5]" />
                              <span>
                                {isCarousel ? t.result.downloadCurrentPhoto : t.result.downloadPhoto}
                              </span>
                              <span className="hidden xs:inline text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full bg-white/20 text-white border border-white/20">
                                HD Asli
                              </span>
                            </>
                          )}
                        </button>

                        {/* If Carousel: Show Download All Photos */}
                        {isCarousel && data.items && data.items.length > 1 && (
                          <button
                            type="button"
                            onClick={handleDownloadAllPhotos}
                            disabled={downloadingAll}
                            className="w-full h-11 sm:h-12 px-4 rounded-xl bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-black text-xs sm:text-sm md:text-base shadow-lg shadow-purple-500/20 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2"
                          >
                            {downloadingAll ? (
                              <>
                                <RefreshCw className="w-4 h-4 animate-spin" />
                                <span>{t.result.preparingPhoto}</span>
                              </>
                            ) : (
                              <>
                                <Layers className="w-4 h-4 stroke-[2.5]" />
                                <span>
                                  {t.result.downloadAllPhotos} ({data.items.length} Foto)
                                </span>
                              </>
                            )}
                          </button>
                        )}
                      </>
                    )}

                    {/* Reset / Unduh Media Lainnya */}
                    <button
                      type="button"
                      onClick={handleReset}
                      className={`w-full h-10 sm:h-11 px-4 rounded-xl border font-bold text-xs sm:text-sm active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2 pt-0.5 ${
                        theme === "light"
                          ? "border-slate-300 bg-slate-100 hover:bg-slate-200 text-slate-800 hover:text-slate-950"
                          : "border-zinc-700/80 bg-zinc-800/70 hover:bg-zinc-700 text-zinc-300 hover:text-white"
                      }`}
                    >
                      <RefreshCw className="w-3.5 h-3.5 text-zinc-400" />
                      <span>{t.result.downloadAnother}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* How To Download Section (3 Steps) */}
        <section id="how-to" className="py-10 sm:py-14 px-4 sm:px-6 max-w-4xl mx-auto scroll-mt-20">
          <div className="text-center mb-8 sm:mb-10">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-950 dark:text-white">
              {t.howTo.title}
            </h2>
            <p className="mt-2 text-xs sm:text-sm font-semibold text-slate-700 dark:text-zinc-300 max-w-md mx-auto">
              {t.howTo.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            <div className={`rounded-2xl p-5 sm:p-6 border-2 transition-all text-center relative group ${
              theme === "light"
                ? "bg-white border-slate-200 shadow-lg shadow-slate-200/60"
                : "bg-zinc-900/60 border-zinc-800/80 shadow-none hover:border-pink-500/40"
            }`}>
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-pink-500/20 to-purple-500/20 text-pink-600 dark:text-pink-400 font-black text-base sm:text-lg flex items-center justify-center mx-auto mb-4 border border-pink-500/30 group-hover:scale-110 transition-transform">
                1
              </div>
              <h3 className="font-black text-slate-950 dark:text-white text-base sm:text-lg mb-2">
                {t.howTo.step1Title}
              </h3>
              <p className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-zinc-300 leading-relaxed">
                {t.howTo.step1Desc}
              </p>
            </div>

            <div className={`rounded-2xl p-5 sm:p-6 border-2 transition-all text-center relative group ${
              theme === "light"
                ? "bg-white border-slate-200 shadow-lg shadow-slate-200/60"
                : "bg-zinc-900/60 border-zinc-800/80 shadow-none hover:border-pink-500/40"
            }`}>
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-purple-500/20 to-amber-500/20 text-purple-600 dark:text-purple-400 font-black text-base sm:text-lg flex items-center justify-center mx-auto mb-4 border border-purple-500/30 group-hover:scale-110 transition-transform">
                2
              </div>
              <h3 className="font-black text-slate-950 dark:text-white text-base sm:text-lg mb-2">
                {t.howTo.step2Title}
              </h3>
              <p className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-zinc-300 leading-relaxed">
                {t.howTo.step2Desc}
              </p>
            </div>

            <div className={`rounded-2xl p-5 sm:p-6 border-2 transition-all text-center relative group ${
              theme === "light"
                ? "bg-white border-slate-200 shadow-lg shadow-slate-200/60"
                : "bg-zinc-900/60 border-zinc-800/80 shadow-none hover:border-pink-500/40"
            }`}>
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-amber-500/20 to-emerald-500/20 text-amber-600 dark:text-amber-400 font-black text-base sm:text-lg flex items-center justify-center mx-auto mb-4 border border-amber-500/30 group-hover:scale-110 transition-transform">
                3
              </div>
              <h3 className="font-black text-slate-950 dark:text-white text-base sm:text-lg mb-2">
                {t.howTo.step3Title}
              </h3>
              <p className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-zinc-300 leading-relaxed">
                {t.howTo.step3Desc}
              </p>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="py-10 sm:py-14 px-4 sm:px-6 max-w-5xl mx-auto border-t border-slate-200 dark:border-zinc-800/80 scroll-mt-20">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-950 dark:text-white">
              {t.features.title}
            </h2>
            <p className="mt-2 text-xs sm:text-sm font-semibold text-slate-700 dark:text-zinc-300 max-w-lg mx-auto">
              {t.features.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {/* Feature 1: Kualitas Full HD Asli */}
            <div className={`p-5 sm:p-6 rounded-2xl border-2 transition-all duration-300 group ${
              theme === "light"
                ? "bg-white border-slate-200/90 hover:border-pink-300 hover:shadow-xl hover:shadow-pink-500/5 shadow-md shadow-slate-200/50"
                : "bg-zinc-900/50 border-zinc-800 hover:border-pink-500/40 hover:shadow-xl hover:shadow-pink-500/5"
            }`}>
              <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center mb-3.5 transition-transform duration-300 group-hover:scale-110 ${
                theme === "light"
                  ? "bg-pink-50 border border-pink-200/80 text-pink-600 shadow-sm"
                  : "bg-pink-500/15 border border-pink-500/30 text-pink-400 shadow-sm shadow-pink-500/10"
              }`}>
                <Film className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2]" />
              </div>
              <h3 className="font-black text-slate-950 dark:text-white text-sm sm:text-base mb-1.5">{t.features.feat1Title}</h3>
              <p className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-zinc-300 leading-relaxed">{t.features.feat1Desc}</p>
            </div>

            {/* Feature 2: 100% Tanpa Watermark */}
            <div className={`p-5 sm:p-6 rounded-2xl border-2 transition-all duration-300 group ${
              theme === "light"
                ? "bg-white border-slate-200/90 hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-500/5 shadow-md shadow-slate-200/50"
                : "bg-zinc-900/50 border-zinc-800 hover:border-emerald-500/40 hover:shadow-xl hover:shadow-emerald-500/5"
            }`}>
              <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center mb-3.5 transition-transform duration-300 group-hover:scale-110 ${
                theme === "light"
                  ? "bg-emerald-50 border border-emerald-200/80 text-emerald-600 shadow-sm"
                  : "bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 shadow-sm shadow-emerald-500/10"
              }`}>
                <BadgeCheck className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2]" />
              </div>
              <h3 className="font-black text-slate-950 dark:text-white text-sm sm:text-base mb-1.5">{t.features.feat2Title}</h3>
              <p className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-zinc-300 leading-relaxed">{t.features.feat2Desc}</p>
            </div>

            {/* Feature 3: Ekstrak Audio MP3 192 kbps */}
            <div className={`p-5 sm:p-6 rounded-2xl border-2 transition-all duration-300 group ${
              theme === "light"
                ? "bg-white border-slate-200/90 hover:border-amber-300 hover:shadow-xl hover:shadow-amber-500/5 shadow-md shadow-slate-200/50"
                : "bg-zinc-900/50 border-zinc-800 hover:border-amber-500/40 hover:shadow-xl hover:shadow-amber-500/5"
            }`}>
              <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center mb-3.5 transition-transform duration-300 group-hover:scale-110 ${
                theme === "light"
                  ? "bg-amber-50 border border-amber-200/80 text-amber-600 shadow-sm"
                  : "bg-amber-500/15 border border-amber-500/30 text-amber-400 shadow-sm shadow-amber-500/10"
              }`}>
                <Headphones className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2]" />
              </div>
              <h3 className="font-black text-slate-950 dark:text-white text-sm sm:text-base mb-1.5">{t.features.feat3Title}</h3>
              <p className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-zinc-300 leading-relaxed">{t.features.feat3Desc}</p>
            </div>

            {/* Feature 4: Deteksi Otomatis Reels & Foto */}
            <div className={`p-5 sm:p-6 rounded-2xl border-2 transition-all duration-300 group ${
              theme === "light"
                ? "bg-white border-slate-200/90 hover:border-sky-300 hover:shadow-xl hover:shadow-sky-500/5 shadow-md shadow-slate-200/50"
                : "bg-zinc-900/50 border-zinc-800 hover:border-sky-500/40 hover:shadow-xl hover:shadow-sky-500/5"
            }`}>
              <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center mb-3.5 transition-transform duration-300 group-hover:scale-110 ${
                theme === "light"
                  ? "bg-sky-50 border border-sky-200/80 text-sky-600 shadow-sm"
                  : "bg-sky-500/15 border border-sky-500/30 text-sky-400 shadow-sm shadow-sky-500/10"
              }`}>
                <ScanSearch className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2]" />
              </div>
              <h3 className="font-black text-slate-950 dark:text-white text-sm sm:text-base mb-1.5">{t.features.feat4Title}</h3>
              <p className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-zinc-300 leading-relaxed">{t.features.feat4Desc}</p>
            </div>

            {/* Feature 5: 100% Gratis Tanpa Batas */}
            <div className={`p-5 sm:p-6 rounded-2xl border-2 transition-all duration-300 group ${
              theme === "light"
                ? "bg-white border-slate-200/90 hover:border-purple-300 hover:shadow-xl hover:shadow-purple-500/5 shadow-md shadow-slate-200/50"
                : "bg-zinc-900/50 border-zinc-800 hover:border-purple-500/40 hover:shadow-xl hover:shadow-purple-500/5"
            }`}>
              <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center mb-3.5 transition-transform duration-300 group-hover:scale-110 ${
                theme === "light"
                  ? "bg-purple-50 border border-purple-200/80 text-purple-600 shadow-sm"
                  : "bg-purple-500/15 border border-purple-500/30 text-purple-400 shadow-sm shadow-purple-500/10"
              }`}>
                <Infinity className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2]" />
              </div>
              <h3 className="font-black text-slate-950 dark:text-white text-sm sm:text-base mb-1.5">{t.features.feat5Title}</h3>
              <p className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-zinc-300 leading-relaxed">{t.features.feat5Desc}</p>
            </div>

            {/* Feature 6: Aman & Responsif */}
            <div className={`p-5 sm:p-6 rounded-2xl border-2 transition-all duration-300 group ${
              theme === "light"
                ? "bg-white border-slate-200/90 hover:border-rose-300 hover:shadow-xl hover:shadow-rose-500/5 shadow-md shadow-slate-200/50"
                : "bg-zinc-900/50 border-zinc-800 hover:border-rose-500/40 hover:shadow-xl hover:shadow-rose-500/5"
            }`}>
              <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center mb-3.5 transition-transform duration-300 group-hover:scale-110 ${
                theme === "light"
                  ? "bg-rose-50 border border-rose-200/80 text-rose-600 shadow-sm"
                  : "bg-rose-500/15 border border-rose-500/30 text-rose-400 shadow-sm shadow-rose-500/10"
              }`}>
                <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2]" />
              </div>
              <h3 className="font-black text-slate-950 dark:text-white text-sm sm:text-base mb-1.5">{t.features.feat6Title}</h3>
              <p className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-zinc-300 leading-relaxed">{t.features.feat6Desc}</p>
            </div>
          </div>
        </section>

        {/* Middle Responsive Ad Slot */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <AdSlot slotId="mid-content-banner" format="horizontal" lang={lang} />
        </div>

        {/* FAQ Section */}
        <section id="faq" className="py-12 sm:py-16 px-4 sm:px-6 max-w-4xl mx-auto scroll-mt-20">
          <div className="text-center mb-8 sm:mb-10">
            <span className="text-[11px] sm:text-xs font-black text-pink-700 dark:text-pink-300 uppercase tracking-widest px-3 py-1 rounded-full bg-pink-500/15 border border-pink-500/30">
              {t.faq.badge}
            </span>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-950 dark:text-white mt-3">
              {t.faq.title}
            </h2>
            <p className="mt-2 text-xs sm:text-sm font-semibold text-slate-700 dark:text-zinc-300 max-w-md mx-auto">
              {t.faq.subtitle}
            </p>
          </div>

          <FaqAccordion lang={lang} />
        </section>

        {/* About ReelSnap Section (About Card + 4 Metrics) */}
        <section id="about" className="py-12 sm:py-16 px-4 sm:px-6 max-w-4xl mx-auto scroll-mt-20">
          <div
            className={`rounded-3xl border-2 p-6 sm:p-8 md:p-10 transition-all backdrop-blur-md relative overflow-hidden ${
              theme === "light"
                ? "bg-white border-slate-200/90 shadow-2xl shadow-slate-200/70"
                : "bg-zinc-900/90 border-zinc-800 shadow-2xl shadow-pink-500/5"
            }`}
          >
            {/* Background Accent Glow */}
            <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-bl from-pink-500/10 via-purple-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-tr from-amber-500/10 via-rose-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10">
              {/* Badge & Title */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-pink-500/15 border border-pink-500/30 text-pink-700 dark:text-pink-300 mb-3.5">
                <ShieldCheck className="w-3.5 h-3.5 text-pink-500" />
                <span>{t.about.badge}</span>
              </div>

              <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-950 dark:text-white tracking-tight mb-4">
                {t.about.title}
              </h2>

              {/* 2 Paragraphs */}
              <div className="space-y-3.5 text-xs sm:text-sm font-semibold text-slate-700 dark:text-zinc-300 leading-relaxed text-justify sm:text-left">
                <p>{t.about.p1}</p>
                <p>{t.about.p2}</p>
              </div>

              {/* Thin Horizontal Divider */}
              <div className="my-6 sm:my-8 border-t border-slate-200 dark:border-zinc-800/80" />

              {/* 4 Metrics Columns */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-center">
                {/* Metric 1 */}
                <div className={`p-4 rounded-2xl border transition-all ${
                  theme === "light"
                    ? "bg-slate-50/80 border-slate-200"
                    : "bg-zinc-950/60 border-zinc-800/80"
                }`}>
                  <div className="text-2xl sm:text-3xl font-black text-ig-gradient mb-1">
                    {t.about.metric1Value}
                  </div>
                  <div className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                    {t.about.metric1Label}
                  </div>
                  <div className="text-[10.5px] sm:text-xs font-semibold text-slate-500 dark:text-zinc-400 mt-0.5">
                    {t.about.metric1Desc}
                  </div>
                </div>

                {/* Metric 2 */}
                <div className={`p-4 rounded-2xl border transition-all ${
                  theme === "light"
                    ? "bg-slate-50/80 border-slate-200"
                    : "bg-zinc-950/60 border-zinc-800/80"
                }`}>
                  <div className="text-2xl sm:text-3xl font-black text-ig-gradient mb-1">
                    {t.about.metric2Value}
                  </div>
                  <div className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                    {t.about.metric2Label}
                  </div>
                  <div className="text-[10.5px] sm:text-xs font-semibold text-slate-500 dark:text-zinc-400 mt-0.5">
                    {t.about.metric2Desc}
                  </div>
                </div>

                {/* Metric 3 */}
                <div className={`p-4 rounded-2xl border transition-all ${
                  theme === "light"
                    ? "bg-slate-50/80 border-slate-200"
                    : "bg-zinc-950/60 border-zinc-800/80"
                }`}>
                  <div className="text-2xl sm:text-3xl font-black text-ig-gradient mb-1">
                    {t.about.metric3Value}
                  </div>
                  <div className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                    {t.about.metric3Label}
                  </div>
                  <div className="text-[10.5px] sm:text-xs font-semibold text-slate-500 dark:text-zinc-400 mt-0.5">
                    {t.about.metric3Desc}
                  </div>
                </div>

                {/* Metric 4 */}
                <div className={`p-4 rounded-2xl border transition-all ${
                  theme === "light"
                    ? "bg-slate-50/80 border-slate-200"
                    : "bg-zinc-950/60 border-zinc-800/80"
                }`}>
                  <div className="text-2xl sm:text-3xl font-black text-ig-gradient mb-1">
                    {t.about.metric4Value}
                  </div>
                  <div className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                    {t.about.metric4Label}
                  </div>
                  <div className="text-[10.5px] sm:text-xs font-semibold text-slate-500 dark:text-zinc-400 mt-0.5">
                    {t.about.metric4Desc}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer Area (Professional 4-Column Layout) */}
      <footer
        className={`border-t transition-colors ${
          theme === "light"
            ? "bg-slate-100 border-slate-200 text-slate-800"
            : "bg-zinc-950 border-zinc-800/80 text-zinc-300"
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          {/* 4 Column Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 pb-10 sm:pb-12 border-b border-slate-300/80 dark:border-zinc-800/80">
            {/* Column 1: Brand & Social Pills (span 4) */}
            <div className="lg:col-span-4 space-y-4">
              <div className="flex items-center gap-2.5">
                <img
                  src="/icon.png"
                  alt="ReelSnap Logo"
                  className="w-8 h-8 object-contain drop-shadow-[0_2px_8px_rgba(236,72,153,0.3)] select-none"
                />
                <span className="font-black text-xl text-slate-950 dark:text-white tracking-tight">
                  Reel<span className="text-ig-gradient font-black">Snap</span>
                </span>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-zinc-400 leading-relaxed max-w-sm">
                {t.footer.tagline}
              </p>

              <div className="pt-2">
                <p className="text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-2.5">
                  {t.footer.followLabel}
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  {/* Instagram Pill */}
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-pink-500/15 hover:bg-pink-500/25 border border-pink-500/30 text-pink-700 dark:text-pink-300 transition-all hover:scale-105"
                  >
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                    <span>Instagram</span>
                  </a>

                  {/* TikTok Pill */}
                  <a
                    href="https://tiktok.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-slate-200/80 dark:bg-zinc-800 hover:bg-slate-300 dark:hover:bg-zinc-700 text-slate-800 dark:text-zinc-200 transition-all hover:scale-105 border border-slate-300 dark:border-zinc-700"
                  >
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.97v7.68c0 2.11-.64 4.24-1.92 5.91-1.66 2.17-4.32 3.44-7.05 3.36-2.58-.08-5.02-1.32-6.57-3.37-1.76-2.31-2.23-5.46-1.26-8.23.97-2.77 3.35-4.84 6.26-5.41.66-.13 1.33-.18 2-.17v4.06c-.44-.03-.89-.01-1.33.07-1.38.25-2.55 1.19-3.08 2.49-.53 1.3-.32 2.82.56 3.93.88 1.11 2.31 1.74 3.73 1.62 1.42-.12 2.68-.96 3.25-2.26.24-.55.36-1.15.36-1.76V.02z"/>
                    </svg>
                    <span>TikTok</span>
                  </a>

                  {/* WhatsApp Pill */}
                  <a
                    href="https://whatsapp.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 transition-all hover:scale-105"
                  >
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                    </svg>
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Column 2: Navigasi Cepat (span 3) */}
            <div className="lg:col-span-3 space-y-3">
              <h3 className="font-black text-xs sm:text-sm text-slate-950 dark:text-white uppercase tracking-wider">
                {t.footer.col2Title}
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm font-semibold">
                <li>
                  <button
                    type="button"
                    onClick={() => scrollToSection("hero")}
                    className="text-slate-600 hover:text-pink-600 dark:text-zinc-400 dark:hover:text-pink-400 transition-colors cursor-pointer text-left"
                  >
                    {t.footer.navHome}
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => scrollToSection("how-to")}
                    className="text-slate-600 hover:text-pink-600 dark:text-zinc-400 dark:hover:text-pink-400 transition-colors cursor-pointer text-left"
                  >
                    {t.footer.navHowTo}
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => scrollToSection("features")}
                    className="text-slate-600 hover:text-pink-600 dark:text-zinc-400 dark:hover:text-pink-400 transition-colors cursor-pointer text-left"
                  >
                    {t.footer.navFeatures}
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => scrollToSection("faq")}
                    className="text-slate-600 hover:text-pink-600 dark:text-zinc-400 dark:hover:text-pink-400 transition-colors cursor-pointer text-left"
                  >
                    {t.footer.navFaq}
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => scrollToSection("about")}
                    className="text-slate-600 hover:text-pink-600 dark:text-zinc-400 dark:hover:text-pink-400 transition-colors cursor-pointer text-left"
                  >
                    {t.footer.navAbout}
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3: Keamanan & Etika (span 3) */}
            <div className="lg:col-span-3 space-y-3">
              <h3 className="font-black text-xs sm:text-sm text-slate-950 dark:text-white uppercase tracking-wider">
                {t.footer.col3Title}
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm font-semibold">
                <li>
                  <button
                    type="button"
                    onClick={() => handleOpenModal("dmca")}
                    className="text-slate-600 hover:text-pink-600 dark:text-zinc-400 dark:hover:text-pink-400 transition-colors cursor-pointer flex items-center gap-1.5 text-left"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>{t.footer.ethicsCopyright}</span>
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => handleOpenModal("terms")}
                    className="text-slate-600 hover:text-pink-600 dark:text-zinc-400 dark:hover:text-pink-400 transition-colors cursor-pointer flex items-center gap-1.5 text-left"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>{t.footer.ethicsPublicOnly}</span>
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => handleOpenModal("privacy")}
                    className="text-slate-600 hover:text-pink-600 dark:text-zinc-400 dark:hover:text-pink-400 transition-colors cursor-pointer flex items-center gap-1.5 text-left"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>{t.footer.ethicsNoStorage}</span>
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => scrollToSection("about")}
                    className="text-slate-600 hover:text-pink-600 dark:text-zinc-400 dark:hover:text-pink-400 transition-colors cursor-pointer flex items-center gap-1.5 text-left"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>{t.footer.ethicsSsrf}</span>
                  </button>
                </li>
                <li className="pt-1.5 flex items-center gap-2.5 text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => handleOpenModal("privacy")}
                    className="text-pink-600 dark:text-pink-400 hover:underline cursor-pointer"
                  >
                    {t.footer.privacy}
                  </button>
                  <span className="text-slate-400 dark:text-zinc-700">•</span>
                  <button
                    type="button"
                    onClick={() => handleOpenModal("terms")}
                    className="text-pink-600 dark:text-pink-400 hover:underline cursor-pointer"
                  >
                    {t.footer.terms}
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 4: Media Sosial & Kontak (span 2) */}
            <div className="lg:col-span-2 space-y-3">
              <h3 className="font-black text-xs sm:text-sm text-slate-950 dark:text-white uppercase tracking-wider">
                {t.footer.col4Title}
              </h3>
              <ul className="space-y-2.5 text-xs sm:text-sm font-semibold">
                <li>
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-600 hover:text-pink-600 dark:text-zinc-400 dark:hover:text-pink-400 transition-colors flex items-center gap-2"
                  >
                    <div className="w-6 h-6 rounded-lg bg-pink-500/10 flex items-center justify-center text-pink-500 shrink-0">
                      <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                    </div>
                    <span>{t.footer.contactIg}</span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://tiktok.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-600 hover:text-pink-600 dark:text-zinc-400 dark:hover:text-pink-400 transition-colors flex items-center gap-2"
                  >
                    <div className="w-6 h-6 rounded-lg bg-slate-200 dark:bg-zinc-800 flex items-center justify-center text-slate-800 dark:text-zinc-200 shrink-0">
                      <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.97v7.68c0 2.11-.64 4.24-1.92 5.91-1.66 2.17-4.32 3.44-7.05 3.36-2.58-.08-5.02-1.32-6.57-3.37-1.76-2.31-2.23-5.46-1.26-8.23.97-2.77 3.35-4.84 6.26-5.41.66-.13 1.33-.18 2-.17v4.06c-.44-.03-.89-.01-1.33.07-1.38.25-2.55 1.19-3.08 2.49-.53 1.3-.32 2.82.56 3.93.88 1.11 2.31 1.74 3.73 1.62 1.42-.12 2.68-.96 3.25-2.26.24-.55.36-1.15.36-1.76V.02z"/>
                      </svg>
                    </div>
                    <span>{t.footer.contactTiktok}</span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://whatsapp.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-600 hover:text-pink-600 dark:text-zinc-400 dark:hover:text-pink-400 transition-colors flex items-center gap-2"
                  >
                    <div className="w-6 h-6 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0">
                      <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                      </svg>
                    </div>
                    <span>{t.footer.contactWa}</span>
                  </a>
                </li>
                <li className="pt-1">
                  <span className="text-[11px] font-medium text-slate-500 dark:text-zinc-500">
                    {t.footer.contactHours}
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Legal Disclaimer & Copyright Notice */}
          <div className="pt-8 sm:pt-10 space-y-4 text-xs">
            <p className="text-[11px] sm:text-xs text-slate-600 dark:text-zinc-400 leading-relaxed text-justify sm:text-left">
              {t.footer.disclaimer}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2 border-t border-slate-300/50 dark:border-zinc-800/50">
              <p className="text-[11px] sm:text-xs font-bold text-slate-600 dark:text-zinc-400">
                © 2026 ReelSnap. {t.footer.copyright}
              </p>
              <div className="flex items-center gap-2 text-[10.5px] font-bold text-slate-500 dark:text-zinc-500">
                <span>Built for Speed & Security</span>
                <span>•</span>
                <span>SSRF Protected</span>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Info & Legal Modal (Google AdSense Compliant Dialog) */}
      <InfoModal
        isOpen={modalTab !== null}
        onClose={() => setModalTab(null)}
        activeTab={modalTab || "privacy"}
        setActiveTab={(tab) => setModalTab(tab)}
        onScrollToFaq={handleScrollToFaq}
        lang={lang}
      />

      {/* iOS PWA Install Instruction Dialog Modal */}
      {showPwaModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in"
          onClick={() => setShowPwaModal(false)}
        >
          <div
            className="relative w-full max-w-sm bg-white dark:bg-zinc-900 border-2 border-pink-500/30 rounded-3xl p-6 shadow-2xl text-center space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-500 to-amber-400 p-0.5 mx-auto">
              <img
                src="/icon.png"
                alt="ReelSnap Icon"
                className="w-full h-full object-contain rounded-2xl"
              />
            </div>
            <div>
              <h3 className="font-black text-slate-950 dark:text-white text-base">
                {t.pwaModal.title}
              </h3>
              <p className="text-xs font-semibold text-slate-600 dark:text-zinc-300 mt-1">
                {t.pwaModal.iosInstructions}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-100 dark:bg-zinc-800/80 text-left text-xs font-bold text-slate-800 dark:text-zinc-200 space-y-1.5 border border-slate-200 dark:border-zinc-700">
              <p>{t.pwaModal.step1}</p>
              <p>{t.pwaModal.step2}</p>
              <p>{t.pwaModal.step3}</p>
            </div>

            <button
              type="button"
              onClick={() => setShowPwaModal(false)}
              className="w-full py-2.5 rounded-xl bg-ig-gradient text-white font-bold text-xs shadow-md shadow-pink-500/20 active:scale-[0.98] transition-all cursor-pointer"
            >
              {t.pwaModal.close}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
