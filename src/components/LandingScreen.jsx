import React from 'react';

export default function LandingScreen({ onEnter, audio }) {
  const handleEnter = () => {
    if (audio) audio.playClick();
    onEnter();
  };

  return (
    <div
      className="fixed inset-0 bg-black flex flex-col items-center justify-center overflow-hidden cursor-pointer"
      onClick={handleEnter}
    >
      {/* Atmospheric layers */}
      <div className="absolute inset-0 screentone opacity-20 pointer-events-none" />
      <div className="absolute inset-0 scanlines opacity-40 pointer-events-none" />
      <div className="absolute inset-0 rain-overlay opacity-30 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black pointer-events-none" />

      {/* Faint looming clock — the deadline */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none">
        <span className="text-[28vw] sm:text-[20vw] font-mono font-bold text-red-950/20 tracking-tighter clock-tense">
          15:00
        </span>
      </div>

      <div className="relative z-10 text-center px-6 animate-fadeIn">
        <p className="text-xs text-gray-600 tracking-[0.5em] uppercase mb-6">
          sebuah visual novel
        </p>

        <h1 className="text-6xl sm:text-8xl font-bold text-white ink-text tracking-wider leading-none">
          SATU
        </h1>
        <h1 className="text-6xl sm:text-8xl font-bold text-white ink-text tracking-wider leading-none">
          HARI LAGI
        </h1>

        <div className="my-8 mx-auto w-16 h-[1px] bg-gray-700" />

        <p className="text-gray-400 text-sm sm:text-base leading-relaxed max-w-md mx-auto italic">
          Jam tiga sore, kamu akan mati.
        </p>
        <p className="text-gray-600 text-sm sm:text-base leading-relaxed max-w-md mx-auto mt-2">
          Lalu hari ini dimulai lagi. Dan lagi.
        </p>

        <div className="mt-14">
          <span className="inline-block text-gray-400 text-sm tracking-[0.5em] uppercase animate-pulse">
            ketuk untuk masuk
          </span>
        </div>
      </div>

      <p className="absolute bottom-6 text-gray-800 text-[10px] tracking-[0.3em] uppercase">
        time loop · mystery
      </p>
    </div>
  );
}
