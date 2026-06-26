"use client";

import { useEffect, useState, useCallback } from "react";

export default function Lightbox({ memory, onClose }) {
  const [closing, setClosing] = useState(false);

  const handleClose = useCallback(() => {
    if (closing) return;
    setClosing(true);
    setTimeout(onClose, 300);
  }, [closing, onClose]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const handleKey = (e) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKey);
    };
  }, [handleClose]);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${
        closing ? "lightbox-overlay-out" : "lightbox-overlay"
      }`}
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-label={memory.title}
      onTouchStart={(e) => e.stopPropagation()}
    >
      {/* Close button */}
      <button
        type="button"
        className="absolute top-4 right-4 z-20 w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
        onClick={handleClose}
        aria-label="Close lightbox"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      {/* Photo + caption */}
      <div
        className={`relative flex flex-col items-center max-w-full ${
          closing ? "lightbox-content-out" : "lightbox-content"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={`/images/${memory.file}`}
          alt={memory.title}
          className="max-w-[95vw] max-h-[85vh] w-auto h-auto object-contain rounded-lg select-none"
          draggable={false}
        />

        <div className="mt-4 text-center px-4">
          <h4 className="text-white text-lg md:text-xl font-bold font-[family-name:var(--font-gochi)]">
            {memory.title}
          </h4>
          <p className="text-white/70 text-sm mt-1 font-[family-name:var(--font-nunito)]">
            {memory.date}
          </p>
        </div>
      </div>
    </div>
  );
}
