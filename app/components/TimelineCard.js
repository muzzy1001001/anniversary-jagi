"use client";

import Image from "next/image";

export default function TimelineCard({ memory, phase, direction, onPhotoClick }) {
  const isAccent = memory.accent;

  const getAnimationClass = () => {
    if (phase === "exiting") {
      return direction === "next" ? "card-exit-left" : "card-exit-right";
    }
    if (phase === "entering") {
      return direction === "next"
        ? "card-enter-right"
        : "card-enter-left";
    }
    return "";
  };

  return (
    <div className={`w-full max-w-[360px] md:max-w-[420px] mx-auto ${getAnimationClass()}`}>
      <div
        className={`bg-white rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(123,79,46,0.1)] ${
          isAccent
            ? "border-2 border-medium-brown shadow-[0_8px_30px_rgba(196,138,90,0.25)]"
            : "border border-light-brown"
        }`}
      >
        {/* Photo with tap hint */}
        <button
          type="button"
          className="relative w-full aspect-[4/3] overflow-hidden cursor-pointer group focus:outline-none focus-visible:ring-2 focus-visible:ring-medium-brown focus-visible:ring-offset-2 focus-visible:ring-offset-cream rounded-t-2xl"
          onClick={onPhotoClick}
          aria-label={`View ${memory.title} fullscreen`}
        >
          <Image
            src={`/images/${memory.file}`}
            alt={memory.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="420px"
            priority
          />

          {/* Tap-to-expand hint */}
          <div className="absolute bottom-3 right-3 flex items-center gap-1.5 px-2.5 py-1.5 bg-black/40 backdrop-blur-sm rounded-lg text-white/90 text-xs font-[family-name:var(--font-nunito)] opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <svg
              className="w-3.5 h-3.5 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10 7.5v6m3-3h-6"
              />
            </svg>
            <span>Tap to expand</span>
          </div>
        </button>

        {/* Content */}
        <div className="p-5">
          {/* Badge */}
          <span
            className={`inline-block px-3 py-1 rounded-full text-xs font-bold tracking-wide mb-3 ${
              isAccent
                ? "bg-medium-brown text-cream"
                : "bg-light-brown text-dark-brown"
            }`}
          >
            {memory.badge}
          </span>

          {/* Title */}
          <h3 className="font-bold text-dark-brown font-[family-name:var(--font-gochi)] leading-tight mb-3 timeline-title">
            {memory.title}
          </h3>

          {/* Message */}
          <p className="text-text-brown leading-relaxed font-[family-name:var(--font-nunito)] timeline-message">
            {memory.msg}
          </p>
        </div>
      </div>
    </div>
  );
}
