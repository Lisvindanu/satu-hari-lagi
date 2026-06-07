import React, { useEffect, useRef } from 'react';
import { makeT } from '../i18n';

function speakerColor(speaker) {
  if (speaker === 'narasi') return 'text-gray-500 italic';
  if (speaker === '???') return 'text-red-400/80';
  return 'text-amber-300/80';
}

export default function Backlog({ history, onClose, lang = 'id' }) {
  const bottomRef = useRef(null);
  const t = makeT(lang);

  // Scroll to the most recent line on open
  useEffect(() => {
    if (bottomRef.current) bottomRef.current.scrollIntoView({ block: 'end' });
  }, []);

  return (
    <div className="fixed inset-0 z-[70] bg-black/90 backdrop-blur-sm flex flex-col animate-fadeIn" onClick={onClose}>
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-900">
        <span className="text-amber-800/80 text-[10px] tracking-[0.4em] uppercase">{t('backlog.title')}</span>
        <button
          onClick={onClose}
          className="text-gray-500 text-xs tracking-[0.3em] uppercase hover:text-gray-300 transition-colors cursor-pointer"
        >
          {t('common.close')}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-5 max-w-2xl mx-auto w-full" onClick={(e) => e.stopPropagation()}>
        {history.length === 0 ? (
          <div className="text-gray-700 text-sm text-center mt-10">{t('backlog.empty')}</div>
        ) : (
          <div className="space-y-3">
            {history.map((entry, i) => (
              <div key={i}>
                {entry.speaker && entry.speaker !== 'narasi' && (
                  <div className="text-[10px] tracking-[0.3em] uppercase text-gray-600 mb-0.5">{entry.speaker}</div>
                )}
                <p className={`text-sm leading-relaxed ${speakerColor(entry.speaker)}`}>{entry.text}</p>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
        )}
      </div>
    </div>
  );
}
