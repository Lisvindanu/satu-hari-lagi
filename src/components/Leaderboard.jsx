import React, { useState, useEffect } from 'react';
import { getLeaderboard } from '../utils/api';

const ENDING_LABELS = {
  selamat: 'SELAMAT',
  terlambat: 'TERLAMBAT',
  penyesalan: 'PENYESALAN',
  pengganti: 'PENGGANTI',
  paradoks: 'PARADOKS',
  observer: 'OBSERVER',
  glitch: 'GLITCH',
  simulasi: 'SIMULASI',
  penyangkalan: 'PENYANGKALAN',
  acceptance: 'PENERIMAAN',
  kekosongan: 'KEKOSONGAN',
  pengemudi: 'PENGEMUDI',
  'dua-sisi': 'DUA SISI',
  pengorbanan: 'PENGORBANAN',
  'kopi-terakhir': 'KOPI TERAKHIR',
};

function fmt(ms) {
  const m = Math.floor(ms / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  const cs = Math.floor((ms % 1000) / 10);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}.${String(cs).padStart(2, '0')}`;
}

export default function Leaderboard({ endingId, onClose }) {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEnding, setSelectedEnding] = useState(endingId || 'selamat');

  useEffect(() => {
    setLoading(true);
    getLeaderboard(selectedEnding).then(data => {
      setScores(Array.isArray(data) ? data : []);
      setLoading(false);
    });
  }, [selectedEnding]);

  return (
    <div className="fixed inset-0 bg-black/95 z-[200] flex flex-col items-center justify-center">
      <div className="absolute inset-0 screentone opacity-10" />

      <div className="relative z-10 w-full max-w-md px-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white ink-text tracking-[0.3em] mb-1">SPEEDRUN</h2>
          <p className="text-gray-600 text-xs tracking-widest">LEADERBOARD</p>
        </div>

        {/* Ending selector */}
        <div className="flex flex-wrap gap-2 justify-center mb-6">
          {Object.entries(ENDING_LABELS).map(([id, label]) => (
            <button
              key={id}
              onClick={() => setSelectedEnding(id)}
              className={`text-[10px] tracking-wider px-2 py-1 border transition-colors duration-200 cursor-pointer ${
                selectedEnding === id
                  ? 'border-amber-600 text-amber-400'
                  : 'border-gray-800 text-gray-600 hover:border-gray-600'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Score table */}
        <div className="border border-gray-800 bg-black/60">
          <div className="flex px-4 py-2 border-b border-gray-800 text-gray-600 text-[10px] tracking-widest">
            <span className="w-6">#</span>
            <span className="flex-1">NAMA</span>
            <span className="w-20 text-right">WAKTU</span>
            <span className="w-12 text-right">LOOP</span>
          </div>

          {loading ? (
            <div className="px-4 py-8 text-center text-gray-700 text-xs tracking-widest">memuat...</div>
          ) : scores.length === 0 ? (
            <div className="px-4 py-8 text-center text-gray-700 text-xs tracking-widest">
              belum ada record untuk ending ini
            </div>
          ) : (
            scores.map((s, i) => (
              <div
                key={i}
                className={`flex px-4 py-3 border-b border-gray-900 text-sm ${
                  i === 0 ? 'text-amber-400' : i === 1 ? 'text-gray-400' : i === 2 ? 'text-amber-700' : 'text-gray-600'
                }`}
              >
                <span className="w-6 font-mono">{i + 1}</span>
                <span className="flex-1 truncate">{s.name}</span>
                <span className="w-20 text-right font-mono">{fmt(s.time_ms)}</span>
                <span className="w-12 text-right text-xs">{s.loop_count}x</span>
              </div>
            ))
          )}
        </div>

        <button
          onClick={onClose}
          className="block mx-auto mt-8 text-gray-600 text-xs tracking-[0.4em] uppercase hover:text-gray-400 transition-colors cursor-pointer"
        >
          TUTUP
        </button>
      </div>
    </div>
  );
}
