"use client";

import { useState, useEffect } from "react";

export default function EnvelopeLetter({ phase, direction }) {
  const [flapOpen, setFlapOpen] = useState(false);
  const [overlayVisible, setOverlayVisible] = useState(false);

  const getAnimationClass = () => {
    if (phase === "exiting") {
      return direction === "next" ? "card-exit-left" : "card-exit-right";
    }
    if (phase === "entering") {
      return direction === "next" ? "card-enter-right" : "card-enter-left";
    }
    return "";
  };

  const handleOpen = () => {
    if (flapOpen) return;
    setFlapOpen(true);
    setTimeout(() => {
      setOverlayVisible(true);
    }, 600);
  };

  const handleClose = () => {
    setOverlayVisible(false);
    setFlapOpen(false);
  };

  useEffect(() => {
    if (overlayVisible) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [overlayVisible]);

  const letterBody = `My dearest Jagi,

A year ago, I didn't know that our meet at Jollibee would change my life forever. But here we are, celebrating our 1st anniversary.

We've walked many kilometers together, shared countless laughs, and created memories that I will cherish forever. From our first meet to our 1st anniversary, every moment with you has been a treasure.

I am super grateful for your love, your patience, and your unwavering support. You have been my rock, my confidant, and my best friend. I am so lucky to have you in my life.

For more monthsaries, more matching shoes, more Japanese food, more everything — basta kauban ta.

As for my anniversary gift, Mag adto tag flea market, let have some fun there, didto ko mamalit saimong gifts on the spot.

Happy 1st anniversary, myjagi.
I love you — from Jagibordz. 🤎`;

  return (
    <div className={`w-full flex flex-col items-center ${getAnimationClass()}`}>
      {/* Envelope container */}
      <div
        className={`relative w-[260px] h-[180px] mx-auto ${!flapOpen ? "envelope-shake" : ""}`}
        style={{ perspective: "800px", transformStyle: "preserve-3d" }}
      >
        {/* 1. Outer rect */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 260 180">
          <rect
            x="0.75"
            y="0.75"
            width="258.5"
            height="178.5"
            rx="6"
            fill="#fdf6ef"
            stroke="#c48a5a"
            strokeWidth="1.5"
          />
        </svg>

        {/* 2. Bottom flap (V pointing UP) */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 260 180"
        >
          <path
            d="M0,180 L130,72 L260,180 Z"
            fill="#f5e6d4"
            stroke="#c48a5a"
            strokeWidth="1"
          />
        </svg>

        {/* 3. Left flap */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 260 180"
        >
          <path
            d="M0,0 L130,90 L0,180 Z"
            fill="#faf0e6"
            stroke="#c48a5a"
            strokeWidth="1"
          />
        </svg>

        {/* 4. Right flap */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 260 180"
        >
          <path
            d="M260,0 L130,90 L260,180 Z"
            fill="#faf0e6"
            stroke="#c48a5a"
            strokeWidth="1"
          />
        </svg>

        {/* 5. Top flap (openable) */}
        <button
          type="button"
          onClick={handleOpen}
          className="absolute top-0 left-0 w-full cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-medium-brown focus-visible:ring-offset-2 focus-visible:ring-offset-cream rounded-t-lg"
          style={{
            height: "100px",
            transformOrigin: "top center",
            transform: flapOpen ? "rotateX(-160deg)" : "rotateX(0deg)",
            transition: "transform 0.6s ease",
          }}
          aria-label="Open envelope"
        >
          <svg
            className="w-full h-full"
            viewBox="0 0 260 100"
            preserveAspectRatio="none"
          >
            <path
              d="M0,0 L130,100 L260,0 Z"
              fill="#f5e6d4"
              stroke="#c48a5a"
              strokeWidth="1"
            />
          </svg>
        </button>
      </div>

      {/* Open me text */}
      {!flapOpen && (
        <p className="mt-4 text-[20px] text-[#7b4f2e] font-[family-name:var(--font-gochi)]">
          Open me 💌
        </p>
      )}

      {/* Letter overlay */}
      {overlayVisible && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-5"
          style={{ backgroundColor: "rgba(30, 18, 10, 0.88)" }}
          onClick={handleClose}
        >
          <div
            className="relative w-full max-w-[380px] max-h-[85vh] overflow-y-auto rounded-xl px-7 py-8 shadow-2xl letter-overlay-enter"
            style={{
              backgroundColor: "#fffaf5",
              backgroundImage:
                "repeating-linear-gradient(transparent, transparent 31px, #e8d5c0 31px, #e8d5c0 32px)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              type="button"
              onClick={handleClose}
              className="absolute top-3 right-3 w-10 h-10 flex items-center justify-center rounded-full text-[#7b4f2e] hover:bg-[#f5e6d4] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-medium-brown"
              aria-label="Close letter"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <div
              className="font-[family-name:var(--font-gochi)] text-[#4a3728] text-base"
              style={{ whiteSpace: "pre-line", lineHeight: "32px" }}
            >
              {letterBody}
            </div>

            <div className="mt-5 text-right text-sm italic font-[family-name:var(--font-nunito)] text-[#a07858]">
              June 27, 2026
            </div>

            <button
              type="button"
              onClick={handleClose}
              className="mt-6 mx-auto block text-[#7b4f2e] font-[family-name:var(--font-gochi)] text-lg hover:opacity-80 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-medium-brown focus-visible:ring-offset-2 focus-visible:ring-offset-[#fffaf5] rounded"
            >
              fold back
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
