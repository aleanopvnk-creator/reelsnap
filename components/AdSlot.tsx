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
    horizontal: "h-16 sm:h-20 md:h-22 w-full max-w-4xl",
    rectangle: "h-56 sm:h-60 w-full max-w-sm",
    responsive: "min-h-[56px] sm:min-h-[70px] w-full",
  };

  return (
    <div
      className={`my-4 sm:my-5 flex flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed border-slate-300 dark:border-zinc-800 bg-slate-50/60 dark:bg-zinc-900/30 p-2.5 sm:p-3 transition-colors ${formatClasses[format]} ${className}`}
      data-ad-slot={slotId}
      aria-label={isId ? "Iklan Sponsor" : "Sponsored Ad"}
    >
      <div className="flex items-center gap-1.5 text-[10.5px] sm:text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-0.5">
        <Megaphone className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500" />
        <span>
          {isId
            ? "Ruang Iklan Sponsor (Siap Pasang AdSense)"
            : "Sponsored Ad Space (AdSense Ready)"}
        </span>
      </div>
      <p className="text-[10px] sm:text-[11px] font-normal text-slate-400 dark:text-zinc-500 text-center max-w-md px-2">
        {isId
          ? "Slot iklan responsif. Pasang kode unit iklan Google AdSense Anda pada komponen ini."
          : "Responsive ad slot. Insert your Google AdSense ad unit code into this component."}
      </p>
    </div>
  );
}
