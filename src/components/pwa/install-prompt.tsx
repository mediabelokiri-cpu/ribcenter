/* eslint-disable @next/next/no-img-element */
'use client';

import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  useEffect(() => {
    // 1. Check if already installed in standalone mode
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;

    if (isStandalone) {
      return;
    }

    // 2. Check if dismissed recently (within last 3 days)
    const dismissedAt = localStorage.getItem('rib_pwa_dismissed_at');
    if (dismissedAt) {
      const daysSinceDismiss = (Date.now() - parseInt(dismissedAt, 10)) / (1000 * 60 * 60 * 24);
      if (daysSinceDismiss < 3) {
        return;
      }
    }

    // 3. Detect iOS device
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isAppleDevice =
      /iphone|ipad|ipod/.test(userAgent) ||
      (window.navigator.platform === 'MacIntel' && window.navigator.maxTouchPoints > 1);

    if (isAppleDevice) {
      setIsIOS(true);
      // Give users a 2.5s window to view the page before prompting
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 2500);
      return () => clearTimeout(timer);
    }

    // 4. Android / Chrome / Edge BeforeInstallPrompt Handler
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Show prompt after 2 seconds
      setTimeout(() => {
        setShowPrompt(true);
      }, 2000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSGuide(true);
      return;
    }

    if (!deferredPrompt) {
      return;
    }

    // Trigger native Android install prompt
    await deferredPrompt.prompt();
    const choiceResult = await deferredPrompt.userChoice;

    if (choiceResult.outcome === 'accepted') {
      setShowPrompt(false);
      setDeferredPrompt(null);
    } else {
      handleDismiss();
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setShowIOSGuide(false);
    localStorage.setItem('rib_pwa_dismissed_at', Date.now().toString());
  };

  if (!showPrompt) {
    return null;
  }

  return (
    <>
      {/* Floating Bottom Card / Smart Mobile Install Prompt */}
      <div className="fixed bottom-4 left-4 right-4 z-50 max-w-md mx-auto animate-in fade-in slide-in-from-bottom-5 duration-300">
        <div className="bg-white/95 backdrop-blur-md border border-neutral-200/90 rounded-2xl shadow-2xl p-4 sm:p-5 flex flex-col gap-3.5 ring-1 ring-black/5">
          {/* Top Row: App Icon, Info, and Close Button */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#AF191A] p-0.5 shadow-md flex items-center justify-center shrink-0 overflow-hidden ring-2 ring-[#FFCC00]/40">
                <img
                  src="/icon.png"
                  alt="RIB CENTER Icon"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-sm text-[#191919] leading-tight">
                    RIB CENTER
                  </span>
                  <span className="px-1.5 py-0.5 text-[9px] font-bold uppercase rounded bg-red-50 text-[#AF191A] border border-red-200">
                    Aplikasi Resmi
                  </span>
                </div>
                <p className="text-xs text-neutral-500 mt-0.5 line-clamp-1">
                  Rahmat Ichwan Bahtiar
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleDismiss}
              aria-label="Tutup rekomendasi"
              className="text-neutral-400 hover:text-neutral-700 p-1 rounded-lg hover:bg-neutral-100 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Description */}
          <p className="text-xs text-neutral-600 leading-relaxed">
            Pasang aplikasi di layar utama ponsel untuk kemudahan memantau rekam kerja dan kirim aspirasi lebih cepat tanpa membuka browser.
          </p>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={handleInstallClick}
              className="flex-1 py-2.5 px-4 rounded-xl bg-[#AF191A] hover:bg-[#8e1415] text-white text-xs font-bold text-center transition-all shadow-md active:scale-98 flex items-center justify-center gap-1.5"
            >
              <span>📲</span>
              <span>{isIOS ? 'Lihat Cara Pasang di iPhone' : 'Install Aplikasi'}</span>
            </button>
            <button
              type="button"
              onClick={handleDismiss}
              className="py-2.5 px-3 rounded-xl border border-neutral-200 bg-neutral-50 hover:bg-neutral-100 text-neutral-600 text-xs font-semibold transition-colors"
            >
              Nanti Saja
            </button>
          </div>
        </div>
      </div>

      {/* Modal Petunjuk Khusus iOS (iPhone & iPad) */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 space-y-5 shadow-2xl border border-neutral-200 animate-in slide-in-from-bottom-6 duration-300">
            <div className="text-center space-y-1">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-[#AF191A] p-1 shadow-md mb-3 flex items-center justify-center overflow-hidden ring-4 ring-red-50">
                <img src="/icon.png" alt="RIB CENTER" className="w-full h-full object-cover" />
              </div>
              <h3 className="text-base font-extrabold text-[#191919]">
                Pasang di Layar Utama iPhone
              </h3>
              <p className="text-xs text-neutral-500">
                Ikuti 3 langkah mudah berikut di browser Safari:
              </p>
            </div>

            {/* Steps */}
            <div className="space-y-3 text-xs text-neutral-700 bg-neutral-50 p-4 rounded-2xl border border-neutral-200/80">
              <div className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-[#AF191A] text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                  1
                </span>
                <p className="leading-snug">
                  Ketuk tombol <strong className="text-[#191919]">Bagikan (Share)</strong>{' '}
                  <span className="inline-block px-1.5 py-0.5 rounded bg-neutral-200 font-mono text-[11px] align-middle">
                    ⎋
                  </span>{' '}
                  di bilah navigasi bawah Safari.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-[#AF191A] text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                  2
                </span>
                <p className="leading-snug">
                  Gulir ke bawah lalu pilih menu <strong className="text-[#191919]">&ldquo;Tambah ke Layar Utama&rdquo;</strong> (Add to Home Screen).
                </p>
              </div>

              <div className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-[#AF191A] text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                  3
                </span>
                <p className="leading-snug">
                  Ketuk <strong className="text-[#AF191A]">&ldquo;Tambah&rdquo; (Add)</strong> di pojok kanan atas. Aplikasi RIB CENTER siap digunakan!
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowIOSGuide(false)}
              className="w-full py-3 rounded-xl bg-[#AF191A] text-white text-xs font-bold hover:bg-[#8e1415] transition-colors shadow-md"
            >
              Saya Mengerti
            </button>
          </div>
        </div>
      )}
    </>
  );
}
