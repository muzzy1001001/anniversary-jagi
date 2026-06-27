"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { memories } from "@/lib/memories";
import TimelineCard from "./components/TimelineCard";
import EnvelopeLetter from "./components/EnvelopeLetter";
import RailroadTrack from "./components/RailroadTrack";
import Lightbox from "./components/Lightbox";

export default function Home() {
  const [started, setStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [trackIndex, setTrackIndex] = useState(0);
  const [phase, setPhase] = useState("idle");
  const [direction, setDirection] = useState(null);
  const [lightboxMemory, setLightboxMemory] = useState(null);
  const [trackVisible, setTrackVisible] = useState(false);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [musicMuted, setMusicMuted] = useState(false);
  const [interactionOccurred, setInteractionOccurred] = useState(false);

  // Audio ref
  const audioRef = useRef(null);

  // Swipe tracking
  const touchStartX = useRef(null);
  const touchEndX = useRef(null);

  // Refs for latest callbacks (avoid re-attaching listeners)
  const goNextRef = useRef();
  const goPrevRef = useRef();
  const closeLightboxRef = useRef();
  const lightboxClosingRef = useRef(false);

  /* ── Music ── */
  const toggleMusic = useCallback(() => {
    if (!audioRef.current) return;
    if (musicMuted) {
      audioRef.current.muted = false;
      setMusicMuted(false);
      if (audioRef.current.paused) {
        audioRef.current.play().catch(() => {});
      }
    } else {
      audioRef.current.muted = true;
      setMusicMuted(true);
    }
  }, [musicMuted]);

  useEffect(() => {
    const audio = new Audio("/music/bg.mp3");
    audio.loop = true;
    audio.volume = 0.6;
    audioRef.current = audio;

    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!interactionOccurred || !audioRef.current) return;
    if (!musicMuted && audioRef.current.paused) {
      audioRef.current.play().then(() => {
        setMusicPlaying(true);
      }).catch(() => {
        // Autoplay blocked, wait for next interaction
      });
    }
  }, [interactionOccurred, musicMuted]);

  useEffect(() => {
    const handleInteraction = () => {
      setInteractionOccurred(true);
    };
    window.addEventListener("click", handleInteraction, { once: true });
    window.addEventListener("touchstart", handleInteraction, { once: true });
    return () => {
      window.removeEventListener("click", handleInteraction);
      window.removeEventListener("touchstart", handleInteraction);
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onPlay = () => setMusicPlaying(true);
    const onPause = () => setMusicPlaying(false);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    return () => {
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
    };
  }, []);

  /* ── Navigation ── */
  const goNext = useCallback(() => {
    if (phase !== "idle" || currentIndex >= memories.length - 1) return;
    const next = currentIndex + 1;
    setDirection("next");
    setPhase("exiting");
    setTrackIndex(next);

    setTimeout(() => {
      setCurrentIndex(next);
      setPhase("entering");
    }, 200);

    setTimeout(() => {
      setPhase("idle");
    }, 650);
  }, [phase, currentIndex]);

  const goPrev = useCallback(() => {
    if (phase !== "idle" || currentIndex <= 0) return;
    const prev = currentIndex - 1;
    setDirection("prev");
    setPhase("exiting");
    setTrackIndex(prev);

    setTimeout(() => {
      setCurrentIndex(prev);
      setPhase("entering");
    }, 200);

    setTimeout(() => {
      setPhase("idle");
    }, 650);
  }, [phase, currentIndex]);

  const beginStory = useCallback(() => {
    setStarted(true);
    setTimeout(() => setTrackVisible(true), 100);
  }, []);

  const closeLightbox = useCallback(() => {
    if (lightboxClosingRef.current) return;
    lightboxClosingRef.current = true;
    setTimeout(() => {
      setLightboxMemory(null);
      lightboxClosingRef.current = false;
    }, 300);
  }, []);

  // Keep refs current
  goNextRef.current = goNext;
  goPrevRef.current = goPrev;
  closeLightboxRef.current = closeLightbox;

  /* ── Keyboard ── */
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (lightboxMemory) {
        if (e.key === "Escape") closeLightboxRef.current();
        return;
      }
      if (!started) return;
      if (e.key === "ArrowRight") goNextRef.current();
      if (e.key === "ArrowLeft") goPrevRef.current();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxMemory, started]);

  /* ── Swipe ── */
  const onTouchStart = (e) => {
    touchStartX.current = e.targetTouches[0].clientX;
    touchEndX.current = null;
  };
  const onTouchMove = (e) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };
  const onTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;
    if (distance > minSwipeDistance) goNextRef.current();
    if (distance < -minSwipeDistance) goPrevRef.current();
    touchStartX.current = null;
    touchEndX.current = null;
  };

  /* ── Body scroll lock when experience is active ── */
  useEffect(() => {
    if (started) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [started]);

  const isLastSlide = currentIndex === memories.length - 1;
  const currentMemory = memories[currentIndex];

  /* ════════════════════════════════════════
     HERO SCREEN
     ════════════════════════════════════════ */
  if (!started) {
    return (
      <main className="min-h-screen bg-cream">
        <section className="hero-section relative flex flex-col items-center justify-center px-6 pb-20 md:pb-28 text-center min-h-screen">
          {/* Decorative glows */}
          <div className="absolute top-8 left-8 w-16 h-16 md:w-24 md:h-24 rounded-full bg-light-brown/20 blur-2xl" />
          <div className="absolute bottom-8 right-8 w-20 h-20 md:w-32 md:h-32 rounded-full bg-medium-brown/15 blur-3xl" />

          {/* Pulsing Heart */}
          <div className="mb-6">
            <svg
              className="w-12 h-12 md:w-16 md:h-16 text-medium-brown pulse-heart"
              viewBox="0 0 24 24"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-dark-brown font-[family-name:var(--font-gochi)] mb-4 leading-tight">
            365 days of Love
          </h1>

          {/* Subtitle */}
          <p className="text-base md:text-lg text-medium-brown font-[family-name:var(--font-nunito)] tracking-wide">
            June 2025 – June 2026 · a recap of our journey together
          </p>

          {/* Begin button */}
          <button
            onClick={beginStory}
            className="mt-12 inline-flex items-center gap-2 px-8 py-4 bg-medium-brown text-cream rounded-full text-base font-[family-name:var(--font-nunito)] font-semibold shadow-lg hover:bg-dark-brown active:scale-95 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-dark-brown/50"
          >
            Begin
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
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </button>
        </section>
      </main>
    );
  }

  /* ════════════════════════════════════════
     EXPERIENCE SCREEN
     ════════════════════════════════════════ */
  return (
    <main
      className="h-[100dvh] overflow-hidden bg-cream relative select-none"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* ── Music toggle ── */}
      <button
        type="button"
        onClick={toggleMusic}
        className="music-toggle"
        aria-label={musicMuted || !musicPlaying ? "Unmute music" : "Mute music"}
      >
        {musicMuted || !musicPlaying ? "🔇" : "🎵"}
      </button>

      {/* ── Progress indicator ── */}
      <div className="absolute top-0 left-0 right-0 pt-[calc(env(safe-area-inset-top,16px)+20px)] px-6 text-center z-20">
        <span className="text-xs text-[#a07858] font-[family-name:var(--font-nunito)] tracking-widest">
          {String(currentIndex + 1).padStart(2, "0")} / {String(memories.length).padStart(2, "0")}
        </span>
      </div>

      {/* ── Date & location label + card ── */}
      <div className="absolute inset-x-0 top-[90px] bottom-[220px] flex flex-col items-center justify-center px-6 z-10">
        {/* Date & location (above card) */}
        {!isLastSlide && (
          <div
            key={`meta-${currentIndex}`}
            className="text-center mb-4 label-enter"
          >
            <div className="text-[18px] text-[#7b4f2e] font-[family-name:var(--font-gochi)]">
              {currentMemory.date}
            </div>
            <div className="text-[13px] text-[#a07858] font-[family-name:var(--font-nunito)] flex items-center justify-center gap-1 mt-0.5">
              <span>📍</span>
              <span>{currentMemory.location}</span>
            </div>
          </div>
        )}

        {/* Memory card or envelope */}
        {isLastSlide ? (
          <EnvelopeLetter phase={phase} direction={direction} />
        ) : (
          <TimelineCard
            memory={currentMemory}
            phase={phase}
            direction={direction}
            onPhotoClick={() => setLightboxMemory(currentMemory)}
          />
        )}
      </div>

      {/* ── Card connector line ── */}
      {!isLastSlide && (
        <div
          className="absolute left-1/2 -translate-x-1/2 z-0 border-l-2 border-dashed border-medium-brown/70"
          style={{ bottom: "170px", height: "50px" }}
        />
      )}

      {/* ── Railroad track ── */}
      <div
        className={`absolute bottom-[60px] left-0 right-0 h-[140px] overflow-hidden z-0 transition-transform duration-700 ease-out ${
          trackVisible ? "translate-y-0" : "translate-y-[100px]"
        }`}
      >
        <div
          className="h-full"
          style={{
            transform: `translateX(calc(50vw - ${trackIndex * 90 + 45 + 200}px))`,
            transition: "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          <RailroadTrack currentIndex={trackIndex} total={memories.length} />
        </div>
      </div>

      {/* ── Navigation buttons ── */}
      <div className="absolute bottom-5 left-0 right-0 flex items-center justify-between px-6 md:px-10 z-30">
        {/* PREV */}
        {currentIndex > 0 ? (
          <button
            onClick={goPrev}
            className="w-14 h-14 min-w-[56px] min-h-[56px] rounded-full bg-medium-brown text-cream flex items-center justify-center shadow-lg active:scale-95 transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-dark-brown/50"
            aria-label="Previous memory"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
        ) : (
          <div className="w-14 h-14" />
        )}

        {/* NEXT or end heart */}
        {currentIndex < memories.length - 1 ? (
          <button
            onClick={goNext}
            className="w-14 h-14 min-w-[56px] min-h-[56px] rounded-full bg-medium-brown text-cream flex items-center justify-center shadow-lg active:scale-95 transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-dark-brown/50"
            aria-label="Next memory"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        ) : (
          <div className="w-14 h-14 flex items-center justify-center">
            <span className="text-2xl text-medium-brown pulse-heart select-none">
              ✦
            </span>
          </div>
        )}
      </div>

      {/* ── Lightbox ── */}
      {lightboxMemory && (
        <Lightbox memory={lightboxMemory} onClose={closeLightbox} />
      )}
    </main>
  );
}
