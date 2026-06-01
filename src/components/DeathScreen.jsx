import React, { useState, useEffect } from 'react';

export default function DeathScreen({ loopCount, onRestart, audio }) {
  const [showText, setShowText] = useState(false);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    if (audio) audio.playDeath();
    const t1 = setTimeout(() => setShowText(true), 800);
    const t2 = setTimeout(() => setShowButton(true), 2500);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50">
      <div className="absolute inset-0 screentone opacity-10" />

      <div className="relative z-10 text-center">
        {showText && (
          <div className="animate-fadeIn">
            <div className="text-red-900 text-xs tracking-[0.5em] mb-6 font-mono">
              15:00:00
            </div>

            <h2 className="text-3xl text-white ink-text mb-4 tracking-wider">
              KAMU MATI.
            </h2>

            <p className="text-gray-500 text-sm mb-2 tracking-widest">
              Suara tabrakan. Lalu gelap.
            </p>

            <p className="text-gray-700 text-xs mt-8 tracking-wider">
              Loop ke-{loopCount + 1} berakhir.
            </p>

            {loopCount > 0 && (
              <p className="text-gray-800 text-xs mt-2 tracking-wider">
                Clue yang kamu kumpulkan tetap tersimpan.
              </p>
            )}
          </div>
        )}

        {showButton && (
          <button
            onClick={onRestart}
            className="mt-12 text-gray-500 text-sm tracking-[0.5em] uppercase hover:text-red-400 transition-colors duration-500 animate-fadeIn cursor-pointer"
          >
            ULANGI
          </button>
        )}
      </div>
    </div>
  );
}
