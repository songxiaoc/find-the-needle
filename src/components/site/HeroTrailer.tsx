'use client';

import { useState } from 'react';

function extractVideoId(trailerUrl: string): string {
  // Accept full YouTube URLs or bare video IDs
  const match = trailerUrl.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/
  );
  return match ? match[1] : trailerUrl;
}

interface HeroTrailerProps {
  trailerUrl: string;
  gameTitle: string;
}

export function HeroTrailer({ trailerUrl, gameTitle }: HeroTrailerProps) {
  const [open, setOpen] = useState(false);
  const videoId = extractVideoId(trailerUrl);
  const thumb = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

  return (
    <>
      <button
        type="button"
        className="group border-site-outline-strong bg-site-surface-container hover:border-site-primary relative w-full cursor-pointer overflow-hidden border transition-colors"
        aria-label={`Watch ${gameTitle} official trailer`}
        onClick={() => setOpen(true)}
      >
        <div className="relative aspect-video w-full">
          <img
            src={thumb}
            alt={`${gameTitle} official trailer`}
            className="size-full object-cover transition-all duration-200 group-hover:brightness-75"
          />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-site-primary/90 flex size-16 items-center justify-center rounded-full shadow-lg transition-transform duration-200 group-hover:scale-110 sm:size-20">
            <svg
              viewBox="0 0 24 24"
              fill="white"
              className="size-7 translate-x-0.5 sm:size-9"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
        <span className="absolute right-2.5 bottom-2.5 bg-black/70 px-2 py-0.5 text-[11px] text-white">
          YouTube
        </span>
      </button>

      {/* div.fixed instead of <dialog> — avoids PiP trigger and z-index fights */}
      {open && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <div className="relative w-full max-w-4xl">
            <iframe
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
              className="aspect-video w-full"
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
            <button
              className="absolute -top-9 right-0 text-sm text-white/80 hover:text-white"
              onClick={() => setOpen(false)}
            >
              ✕ Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
