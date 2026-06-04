import React, { useState } from 'react';
import { decodeSave } from '../utils/saveCode';

export default function TitleScreen({ onStart, onLoadSave, loopCount, audio, onShowLeaderboard, onShowGallery, hasEndings }) {
  const [codeInput, setCodeInput] = useState('');
  const [codeError, setCodeError] = useState(false);
  const [showCodeInput, setShowCodeInput] = useState(false);

  const handleStart = () => {
    if (audio) audio.playClick();
    onStart();
  };

  const handleLoadCode = () => {
    const saved = decodeSave(codeInput);
    if (!saved) {
      setCodeError(true);
      setTimeout(() => setCodeError(false), 2000);
      return;
    }
    if (audio) audio.playClick();
    onLoadSave(saved);
  };

  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center">
      <div className="absolute inset-0 screentone opacity-20" />

      <div className="relative z-10 text-center px-6">
        <h1 className="text-5xl sm:text-6xl font-bold text-white ink-text tracking-wider mb-2">
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

        {/* Save code load */}
        <div className="mt-8">
          {!showCodeInput ? (
            <button
              onClick={() => setShowCodeInput(true)}
              className="text-gray-700 text-xs tracking-widest hover:text-gray-500 transition-colors cursor-pointer"
            >
              muat save code
            </button>
          ) : (
            <div className="flex flex-col items-center gap-3 animate-fadeIn">
              <input
                type="text"
                value={codeInput}
                onChange={e => setCodeInput(e.target.value.trim())}
                placeholder="masukkan kode"
                className={`bg-transparent border-b text-gray-300 text-sm text-center outline-none w-36 placeholder-gray-700 pb-1 font-mono ${
                  codeError ? 'border-red-800' : 'border-gray-700'
                }`}
                onKeyDown={e => e.key === 'Enter' && handleLoadCode()}
                autoFocus
              />
              <div className="flex gap-4">
                <button
                  onClick={handleLoadCode}
                  className="text-amber-700 text-xs tracking-widest hover:text-amber-400 transition-colors cursor-pointer"
                >
                  MUAT
                </button>
                <button
                  onClick={() => { setShowCodeInput(false); setCodeInput(''); }}
                  className="text-gray-700 text-xs tracking-widest hover:text-gray-500 transition-colors cursor-pointer"
                >
                  batal
                </button>
              </div>
              {codeError && (
                <p className="text-red-800 text-[10px] tracking-widest">kode tidak valid</p>
              )}
            </div>
          )}
        </div>

        {/* Ending gallery + Leaderboard */}
        <div className="mt-6 flex flex-col items-center gap-3">
          {hasEndings && (
            <button
              onClick={onShowGallery}
              className="text-gray-700 text-xs tracking-widest hover:text-amber-700 transition-colors cursor-pointer"
            >
              ending gallery
            </button>
          )}
          <button
            onClick={onShowLeaderboard}
            className="text-gray-700 text-xs tracking-widest hover:text-gray-500 transition-colors cursor-pointer"
          >
            speedrun leaderboard
          </button>
        </div>

        <div className="mt-12 text-gray-700 text-xs tracking-wider">
          <p>klik / tap untuk melanjutkan dialog · pilih dengan bijak</p>
          <p className="mt-1">setiap pilihan memakan waktu</p>
        </div>
      </div>
    </div>
  );
}
