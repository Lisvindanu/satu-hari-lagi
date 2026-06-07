import React, { useState } from 'react';
import { makeT } from '../i18n';

export default function PauseMenu({ onResume, onQuit, onSettings, onBacklog, audio, lang = 'id' }) {
  const [confirmQuit, setConfirmQuit] = useState(false);
  const t = makeT(lang);

  const handleResume = () => {
    if (audio) audio.playClick();
    onResume();
  };

  return (
    <div className="fixed inset-0 z-[60] bg-black/85 backdrop-blur-sm flex flex-col items-center justify-center animate-fadeIn">
      <div className="absolute inset-0 screentone opacity-10 pointer-events-none" />

      <div className="relative z-10 text-center px-6 flex flex-col items-center gap-7">
        <h2 className="text-2xl sm:text-3xl font-bold text-white ink-text tracking-[0.3em]">
          {t('pause.title')}
        </h2>

        <div className="flex flex-col items-center gap-5 mt-2">
          <button
            onClick={handleResume}
            className="text-gray-300 text-sm tracking-[0.4em] uppercase hover:text-white transition-colors duration-300 cursor-pointer"
          >
            {t('pause.resume')}
          </button>

          <button
            onClick={() => { audio && audio.playClick(); onBacklog && onBacklog(); }}
            className="text-gray-500 text-sm tracking-[0.4em] uppercase hover:text-amber-300 transition-colors duration-300 cursor-pointer"
          >
            {t('pause.backlog')}
          </button>

          <button
            onClick={() => { audio && audio.playClick(); onSettings && onSettings(); }}
            className="text-gray-500 text-sm tracking-[0.4em] uppercase hover:text-amber-300 transition-colors duration-300 cursor-pointer"
          >
            {t('pause.settings')}
          </button>

          {!confirmQuit ? (
            <button
              onClick={() => setConfirmQuit(true)}
              className="text-gray-700 text-xs tracking-[0.4em] uppercase hover:text-amber-300 transition-colors duration-300 cursor-pointer mt-2"
            >
              {t('pause.quit')}
            </button>
          ) : (
            <div className="flex flex-col items-center gap-2 mt-2">
              <span className="text-gray-500 text-[10px] tracking-[0.2em] uppercase">{t('pause.confirmQuit')}</span>
              <div className="flex gap-4">
                <button
                  onClick={onQuit}
                  className="text-red-400/80 text-xs tracking-[0.3em] uppercase hover:text-red-300 transition-colors cursor-pointer"
                >
                  {t('pause.yesQuit')}
                </button>
                <button
                  onClick={() => setConfirmQuit(false)}
                  className="text-gray-600 text-xs tracking-[0.3em] uppercase hover:text-gray-400 transition-colors cursor-pointer"
                >
                  {t('pause.cancel')}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
