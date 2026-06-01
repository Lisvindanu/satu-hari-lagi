import React, { useState, useEffect } from 'react';

const CLUE_NAMES = {
  'raka-ingat-loop': 'Raka ingat loop',
  'raka-tau-sesuatu': 'Raka tahu sesuatu',
  'segfault-clue': 'Log SEGFAULT',
  'sosok-tau-loop': 'Sosok tahu loop',
  'cara-berhenti': 'Cara berhenti',
  'kecelakaan-jam-3': 'Kecelakaan jam 3',
  'tau-harus-ke-perempatan': 'Harus ke perempatan',
  'identitas-korban': 'Identitas korban',
  'banyak-loop': 'Sudah 17+ loop',
  'loop-awareness': 'Kesadaran loop',
  'deep-awareness': 'Kesadaran mendalam',
  'seen-terlambat': 'Memori: terlambat',
};

export default function ClueNotification({ clues }) {
  const [showNew, setShowNew] = useState(null);
  const [prevCount, setPrevCount] = useState(clues.length);

  useEffect(() => {
    if (clues.length > prevCount) {
      const newClue = clues[clues.length - 1];
      setShowNew(newClue);
      const t = setTimeout(() => setShowNew(null), 3000);
      setPrevCount(clues.length);
      return () => clearTimeout(t);
    }
    setPrevCount(clues.length);
  }, [clues, prevCount]);

  return (
    <>
      {/* Clue counter */}
      {clues.length > 0 && (
        <div className="fixed top-4 left-4 z-40">
          <div className="text-amber-800/60 text-xs tracking-wider font-mono flex items-center gap-2">
            <span className="text-amber-600/80">&#9670;</span> Clue: {clues.length}
          </div>
        </div>
      )}

      {/* New clue toast */}
      {showNew && (
        <div className="fixed top-12 left-1/2 -translate-x-1/2 z-50 animate-fadeIn">
          <div className="bg-amber-950/80 border border-amber-700/50 px-6 py-3 text-amber-300 text-sm tracking-wider backdrop-blur-sm">
            <span className="text-amber-500 mr-2">&#9670;</span>
            Clue baru: {CLUE_NAMES[showNew] || showNew}
          </div>
        </div>
      )}
    </>
  );
}
