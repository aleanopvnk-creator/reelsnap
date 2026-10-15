"use client";

import React from "react";
import { Megaphone } from "lucide-react";
import { Language } from "@/lib/translations";

interface AdSlotProps {
  slotId?: string;
  format?: "horizontal" | "rectangle" | "responsive";
  className?: string;
  lang?: Language;
}

export default function AdSlot({
  slotId = "default-slot",
  format = "horizontal",
  className = "",
  lang = "id",
}: AdSlotProps) {
  const isId = lang === "id";

  const formatClasses = {
    horizontal: "h-20 sm:h-24 md:h-28 w-full max-w-4xl",
    rectangle: "h-60 sm:h-64 w-full max-w-sm",
    responsive: "min-h-[75px] sm:min-h-[90px] w-full",
  };

  return (
    <div
      className={`my-4 sm:my-6 flex flex-col items-center justify-center overflow-hidden rounded-xl sm:rounded-2xl border-2 border-dashed border-slate-300 dark:border-zinc-800 bg-slate-100 dark:bg-zinc-900/60 p-3 sm:p-4 transition-all ${formatClasses[format]} ${className}`}
      data-ad-slot={slotId}
      aria-label={isId ? "Iklan Sponsor" : "Sponsored Ad"}
    >
      <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-black uppercase tracking-wider text-slate-800 dark:text-zinc-200 mb-0.5 sm:mb-1">
        <Megaphone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-pink-600 dark:text-pink-400" />
        <span>
          {isId
            ? "Ruang Iklan Sponsor (Siap Pasang AdSense)"
            : "Sponsored Ad Space (AdSense Ready)"}
        </span>
      </div>
      <p className="text-[10px] sm:text-xs font-semibold text-slate-700 dark:text-zinc-300 text-center max-w-md px-2">
        {isId
          ? "Slot iklan responsif. Pasang kode unit iklan Google AdSense Anda pada komponen ini."
          : "Responsive ad slot. Insert your Google AdSense ad unit code into this component."}
      </p>
    </div>
  );
}
