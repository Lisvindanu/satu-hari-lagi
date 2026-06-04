import React, { useState, useEffect, useRef } from 'react';

const CLUE_NAMES = {
  'raka-ingat-loop': 'Raka ingat sesuatu',
  'raka-tau-sesuatu': 'Raka menyimpan rahasia',
  'segfault-clue': 'Log sistem aneh',
  'sosok-tau-loop': 'Sosok tahu sesuatu',
  'cara-berhenti': 'Ada cara untuk berhenti',
  'kecelakaan-jam-3': 'Kecelakaan jam 3',
  'tau-harus-ke-perempatan': 'Harus ke perempatan',
  'identitas-korban': 'Identitas korban',
  'banyak-loop': 'Sudah terjadi berkali-kali',
  'loop-awareness': 'Kamu mulai ingat',
  'deep-awareness': 'Kamu ingat segalanya',
  'seen-terlambat': 'Memori: gagal',
};

export default function ClueNotification({ clues }) {
  const [toast, setToast] = useState(null); // { clueId, phase: 'enter'|'exit' }
  const [showLog, setShowLog] = useState(false);
  const prevCountRef = useRef(clues.length);
  const timerRef = useRef(null);

  useEffect(() => {
    if (clues.length > prevCountRef.current) {
      const newClue = clues[clues.length - 1];
      prevCountRef.current = clues.length;

      // Clear any existing timers
      if (timerRef.current) clearTimeout(timerRef.current);

      setToast({ clueId: newClue, phase: 'enter' });

      // Start exit animation after 3s, remove after 3.4s
      timerRef.current = setTimeout(() => {
        setToast(t => t ? { ...t, phase: 'exit' } : null);
        setTimeout(() => setToast(null), 400);
      }, 3000);
    }
    prevCountRef.current = clues.length;

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [clues]);

  return (
    <>
      {/* Clue counter — clickable to toggle log */}
      {clues.length > 0 && (
        <button
          onClick={() => setShowLog(s => !s)}
          className="fixed top-4 left-4 z-40 text-amber-800/60 text-xs tracking-wider font-mono flex items-center gap-2 hover:text-amber-500 transition-colors duration-200 cursor-pointer"
        >
          <span className="text-amber-700/80">◆</span>
          Catatan: {clues.length}
        </button>
      )}

      {/* Clue log panel */}
      {showLog && (
        <div className="fixed top-10 left-4 z-50 bg-black/96 border border-amber-900/30 p-4 min-w-[220px] max-w-[260px] backdrop-blur-sm animate-fadeIn">
          <div className="text-amber-800/80 text-[10px] tracking-[0.4em] uppercase mb-3">Catatanmu</div>
          <div className="space-y-2">
            {clues.map(clue => (
              <div key={clue} className="flex items-start gap-2">
                <span className="text-amber-800 text-xs mt-0.5">◆</span>
                <span className="text-amber-300/60 text-xs leading-relaxed">
                  {CLUE_NAMES[clue] || clue}
                </span>
              </div>
            ))}
          </div>
          <button
            onClick={() => setShowLog(false)}
            className="text-gray-700 text-xs mt-4 hover:text-gray-500 cursor-pointer transition-colors"
          >
            tutup
          </button>
        </div>
      )}

      {/* Toast notification with proper fade in/out */}
      {toast && (
        <div className={`fixed top-12 left-1/2 z-50 ${toast.phase === 'exit' ? 'clue-exit' : 'clue-enter'}`}>
          <div className="bg-amber-950/85 border border-amber-700/40 px-6 py-3 text-amber-300 text-sm tracking-wider backdrop-blur-sm whitespace-nowrap">
            <span className="text-amber-600 mr-2">◆</span>
            {CLUE_NAMES[toast.clueId] || toast.clueId}
          </div>
        </div>
      )}
    </>
  );
}
