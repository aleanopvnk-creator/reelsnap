"use client";

import React from "react";
import { Megaphone } from "lucide-react";

interface AdSlotProps {
  slotId?: string;
  format?: "horizontal" | "rectangle" | "responsive";
  className?: string;
}

export default function AdSlot({
  slotId = "default-slot",
  format = "horizontal",
  className = "",
}: AdSlotProps) {
  const formatClasses = {
    horizontal: "h-20 sm:h-24 md:h-28 w-full max-w-4xl",
    rectangle: "h-60 sm:h-64 w-full max-w-sm",
    responsive: "min-h-[75px] sm:min-h-[90px] w-full",
  };

  return (
    <div
      className={`my-4 sm:my-6 flex flex-col items-center justify-center overflow-hidden rounded-xl sm:rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/40 p-3 sm:p-4 transition-all ${formatClasses[format]} ${className}`}
      data-ad-slot={slotId}
      aria-label="Iklan Sponsor"
    >
      <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-0.5 sm:mb-1">
        <Megaphone className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-pink-500/70" />
        <span>Ruang Iklan Sponsor (AdSense Ready)</span>
      </div>
      <p className="text-[10px] sm:text-xs text-zinc-500/80 text-center max-w-md px-2">
        Slot iklan responsif. Pasang kode unit iklan Google AdSense Anda pada komponen ini.
      </p>
    </div>
  );
}
