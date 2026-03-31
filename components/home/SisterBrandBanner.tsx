"use client";

import { useState } from "react";
import { HiXMark } from "react-icons/hi2";

export default function SisterBrandBanner() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="relative bg-[#fff0f6] border-b border-pink-100 px-4 py-3">
      <div className="max-w-4xl mx-auto flex items-center justify-center gap-3 text-center flex-wrap">
        <span className="text-lg">🎀</span>
        <p className="text-sm text-[#6b2d4e]">
          <span className="font-semibold">New!</span> We&apos;ve started a brand just for your little ones —{" "}
          <a
            href={process.env.NEXT_PUBLIC_LSW_URL || "https://www.littleseriouswomen.com"}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 font-semibold hover:text-[#ec4899] transition-colors"
          >
            check out the Little Serious Women catalogue →
          </a>
        </p>
      </div>
      <button
        onClick={() => setDismissed(true)}
        aria-label="Dismiss"
        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9b5c76] hover:text-[#6b2d4e] transition-colors"
      >
        <HiXMark className="w-4 h-4" />
      </button>
    </div>
  );
}
