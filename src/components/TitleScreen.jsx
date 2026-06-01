import React from 'react';

export default function TitleScreen({ onStart, loopCount, audio }) {
  const handleStart = () => {
    if (audio) audio.playClick();
    onStart();
  };

  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center">
      {/* Screentone bg */}
      <div className="absolute inset-0 screentone opacity-20" />

      <div className="relative z-10 text-center">
        <h1 className="text-6xl font-bold text-white ink-text tracking-wider mb-2">
          SATU HARI LAGI
        </h1>
        <p className="text-sm text-gray-500 tracking-[0.3em] mb-12">
          VISUAL NOVEL — TIME LOOP
        </p>

        {loopCount > 0 && (
          <p className="text-xs text-red-800 mb-8 tracking-widest">
            LOOP KE-{loopCount + 1}
          </p>
        )}

        <button
          onClick={handleStart}
          className="text-gray-400 text-sm tracking-[0.5em] uppercase hover:text-white transition-colors duration-500 cursor-pointer"
        >
          {loopCount === 0 ? 'MULAI' : 'COBA LAGI'}
        </button>

        <div className="mt-16 text-gray-700 text-xs tracking-wider">
          <p>klik untuk melanjutkan dialog · pilih dengan bijak</p>
          <p className="mt-1">setiap pilihan memakan waktu</p>
        </div>
      </div>
    </div>
  );
}
