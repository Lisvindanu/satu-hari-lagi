import React, { useState } from 'react';

export default function PauseMenu({ onResume, onQuit, audio }) {
  const [muted, setMuted] = useState(audio ? audio.isMuted() : false);

  const toggleMute = () => {
    if (!audio) return;
    const next = audio.setMuted(!muted);
    setMuted(next);
    if (!next) audio.playClick();
  };

  const handleResume = () => {
    if (audio) audio.playClick();
    onResume();
  };

  return (
    <div className="fixed inset-0 z-[60] bg-black/85 backdrop-blur-sm flex flex-col items-center justify-center animate-fadeIn">
      <div className="absolute inset-0 screentone opacity-10 pointer-events-none" />

      <div className="relative z-10 text-center px-6 flex flex-col items-center gap-7">
        <h2 className="text-2xl sm:text-3xl font-bold text-white ink-text tracking-[0.3em]">
          JEDA
        </h2>

        <div className="flex flex-col items-center gap-5 mt-2">
          <button
            onClick={handleResume}
            className="text-gray-300 text-sm tracking-[0.4em] uppercase hover:text-white transition-colors duration-300 cursor-pointer"
          >
            lanjut
          </button>

          <button
            onClick={toggleMute}
            className="text-gray-500 text-sm tracking-[0.4em] uppercase hover:text-amber-300 transition-colors duration-300 cursor-pointer"
          >
            {muted ? 'suara: mati' : 'suara: hidup'}
          </button>

          <button
            onClick={onQuit}
            className="text-gray-700 text-xs tracking-[0.4em] uppercase hover:text-amber-300 transition-colors duration-300 cursor-pointer mt-2"
          >
            keluar ke menu
          </button>
        </div>
      </div>
    </div>
  );
}
