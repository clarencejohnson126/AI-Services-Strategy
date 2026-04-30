"use client";

import { useState, useEffect } from "react";

interface Props {
  src: string;
  alt: string;
  ringColor: string;
}

export default function ClickablePhoto({ src, alt, ringColor }: Props) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Foto vergrößern"
        className="block w-full aspect-square rounded-xl overflow-hidden ring-4 transition hover:opacity-90 hover:scale-[1.02] cursor-zoom-in"
        style={{
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ["--tw-ring-color" as any]: ringColor,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      </button>

      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-sm flex items-center justify-center p-6 cursor-zoom-out"
        >
          <button
            aria-label="Schließen"
            onClick={(e) => {
              e.stopPropagation();
              setOpen(false);
            }}
            className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white text-2xl flex items-center justify-center transition"
          >
            ×
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={alt}
            onClick={(e) => e.stopPropagation()}
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl cursor-default"
          />
        </div>
      )}
    </>
  );
}
