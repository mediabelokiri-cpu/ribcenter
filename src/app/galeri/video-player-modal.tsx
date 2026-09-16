'use client';

/* eslint-disable @next/next/no-img-element */
import { useState } from 'react';
import type { MediaItem } from '@/types/database';

interface VideoPlayerModalProps {
  videos: MediaItem[];
}

export function VideoPlayerModal({ videos }: VideoPlayerModalProps) {
  const [activeVideo, setActiveVideo] = useState<MediaItem | null>(null);

  if (videos.length === 0) {
    return (
      <div className="p-16 text-center bg-white rounded-2xl border border-neutral-200 shadow-xs space-y-2">
        <span className="text-4xl block">🎬</span>
        <h3 className="text-sm font-bold text-neutral-700">Belum Ada Video Dokumentasi</h3>
        <p className="text-xs text-neutral-400 max-w-sm mx-auto">
          Arsip video liputan lapangan akan segera ditambahkan.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Video Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {videos.map((item) => {
          let thumb = item.file_url;

          if (typeof item.metadata === 'object' && item.metadata !== null) {
            const meta = item.metadata as Record<string, unknown>;
            if (meta.thumbnail_url) thumb = String(meta.thumbnail_url);
          }

          return (
            <div
              key={item.id}
              onClick={() => setActiveVideo(item)}
              className="group cursor-pointer bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-xs hover:border-[#AF191A] hover:shadow-md transition-all flex flex-col"
            >
              {/* Thumbnail Container */}
              <div className="relative aspect-video bg-neutral-900 overflow-hidden flex items-center justify-center">
                <img
                  src={thumb}
                  alt={item.title || 'Video Thumbnail'}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/file.svg';
                  }}
                />

                {/* Big Red Play Button */}
                <div className="absolute inset-0 bg-black/25 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-[#AF191A] text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform pl-1">
                    ▶
                  </div>
                </div>

                <span className="absolute bottom-2 right-2 text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-black/80 text-white">
                  YOUTUBE
                </span>
              </div>

              {/* Video Info */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                <div>
                  <h3 className="text-sm font-bold text-[#191919] line-clamp-2 group-hover:text-[#AF191A] transition-colors leading-snug">
                    {item.title}
                  </h3>
                  {item.caption && (
                    <p className="text-xs text-neutral-500 line-clamp-2 mt-1 leading-relaxed">
                      {item.caption}
                    </p>
                  )}
                </div>

                <span className="text-[11px] font-semibold text-[#AF191A] flex items-center gap-1 pt-2 border-t border-neutral-100">
                  Putar Video &#9656;
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* VIDEO PLAYER MODAL */}
      {activeVideo && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
          onClick={() => setActiveVideo(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-3xl w-full p-5 shadow-2xl space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center pb-2 border-b border-neutral-200">
              <h3 className="text-sm font-bold text-[#191919] line-clamp-1 pr-4">
                {activeVideo.title}
              </h3>
              <button
                onClick={() => setActiveVideo(null)}
                className="text-neutral-400 hover:text-neutral-800 text-xl font-bold"
              >
                &times;
              </button>
            </div>

            {/* Responsive Video Frame */}
            <div className="aspect-video w-full rounded-xl overflow-hidden bg-black shadow-inner">
              {typeof activeVideo.metadata === 'object' &&
              activeVideo.metadata !== null &&
              'embed_url' in activeVideo.metadata ? (
                <iframe
                  src={`${String((activeVideo.metadata as Record<string, unknown>).embed_url)}?autoplay=1`}
                  title={activeVideo.title || 'Video Player'}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-white space-y-2">
                  <p className="text-xs text-neutral-300">Video tidak dapat diputar langsung di iframe.</p>
                  <a
                    href={activeVideo.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-lg bg-[#AF191A] text-white text-xs font-semibold"
                  >
                    Buka Video di YouTube
                  </a>
                </div>
              )}
            </div>

            {activeVideo.caption && (
              <p className="text-xs text-neutral-600 pt-1 leading-relaxed">
                {activeVideo.caption}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
