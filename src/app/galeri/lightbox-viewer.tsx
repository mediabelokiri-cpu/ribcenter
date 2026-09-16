'use client';

/* eslint-disable @next/next/no-img-element */
import { useState, useEffect, useCallback } from 'react';
import type { MediaItem } from '@/types/database';

interface LightboxViewerProps {
  photos: MediaItem[];
  albumTitle: string;
}

export function LightboxViewer({ photos, albumTitle }: LightboxViewerProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const activePhoto = selectedIndex !== null ? photos[selectedIndex] : null;

  const handleNext = useCallback(() => {
    if (selectedIndex === null) return;
    setSelectedIndex((prev) => (prev !== null && prev < photos.length - 1 ? prev + 1 : 0));
  }, [selectedIndex, photos.length]);

  const handlePrev = useCallback(() => {
    if (selectedIndex === null) return;
    setSelectedIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : photos.length - 1));
  }, [selectedIndex, photos.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      if (e.key === 'Escape') setSelectedIndex(null);
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, handleNext, handlePrev]);

  if (photos.length === 0) {
    return (
      <div className="p-16 text-center bg-white rounded-2xl border border-neutral-200 shadow-xs space-y-2">
        <span className="text-4xl block">📷</span>
        <h3 className="text-sm font-bold text-neutral-700">Belum Ada Foto Dalam Album</h3>
        <p className="text-xs text-neutral-400 max-w-sm mx-auto">
          Foto-foto dokumentasi untuk album ini sedang dipersiapkan oleh tim redaksi.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Grid of Photos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {photos.map((photo, idx) => (
          <div
            key={photo.id}
            onClick={() => setSelectedIndex(idx)}
            className="group relative bg-neutral-100 rounded-xl overflow-hidden aspect-4/3 cursor-pointer border border-neutral-200 shadow-xs hover:border-[#AF191A] hover:shadow-md transition-all"
          >
            <img
              src={photo.file_url}
              alt={photo.alt_text || photo.title || `${albumTitle} - Foto ${idx + 1}`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/file.svg';
              }}
            />

            {/* Hover Overlay with caption */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3.5">
              <span className="text-xs font-bold text-white line-clamp-1">
                {photo.title || `Foto #${idx + 1}`}
              </span>
              {photo.caption && (
                <p className="text-[11px] text-neutral-200 line-clamp-2 mt-0.5 leading-snug">
                  {photo.caption}
                </p>
              )}
              <span className="text-[10px] text-[#FFCC00] font-mono mt-1 font-semibold">
                Perbesar Foto ↗
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* LIGHTBOX MODAL */}
      {activePhoto && selectedIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 select-none"
          onClick={() => setSelectedIndex(null)}
        >
          {/* Close Button */}
          <button
            type="button"
            onClick={() => setSelectedIndex(null)}
            className="absolute top-4 right-4 text-white/70 hover:text-white text-2xl font-bold p-2 z-10"
            title="Tutup (Esc)"
          >
            &times;
          </button>

          {/* Navigation Arrows */}
          {photos.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrev();
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10 text-xl font-bold"
                title="Foto Sebelumnya (Panah Kiri)"
              >
                &#10094;
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10 text-xl font-bold"
                title="Foto Berikutnya (Panah Kanan)"
              >
                &#10095;
              </button>
            </>
          )}

          {/* Center Image Container */}
          <div
            className="max-w-5xl w-full flex flex-col items-center justify-center space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="max-h-[75vh] flex items-center justify-center overflow-hidden rounded-xl bg-black/40 border border-white/10 shadow-2xl">
              <img
                src={activePhoto.file_url}
                alt={activePhoto.alt_text || activePhoto.title || ''}
                className="max-h-[75vh] max-w-full w-auto object-contain"
              />
            </div>

            {/* Bottom Caption & Counter */}
            <div className="text-center text-white space-y-1 max-w-2xl px-4">
              <div className="flex items-center justify-center gap-2">
                <span className="text-xs font-bold text-[#FFCC00]">
                  {activePhoto.title || `Foto #${selectedIndex + 1}`}
                </span>
                <span className="text-[11px] text-white/50 font-mono">
                  ({selectedIndex + 1} dari {photos.length})
                </span>
              </div>
              {activePhoto.caption && (
                <p className="text-xs text-neutral-300 leading-relaxed font-normal">
                  {activePhoto.caption}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
