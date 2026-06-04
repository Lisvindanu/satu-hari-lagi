import React from 'react';

const ALL_ENDINGS = [
  { id: 'selamat', title: 'SELAMAT', color: 'text-amber-300', hint: 'Selamatkan dirimu dari perempatan' },
  { id: 'terlambat', title: 'TERLAMBAT', color: 'text-red-400', hint: 'Berteriak, tapi terlambat' },
  { id: 'pengganti', title: 'PENGGANTI', color: 'text-orange-400', hint: 'Doronganmu terlalu keras' },
  { id: 'paradoks', title: 'PARADOKS', color: 'text-cyan-400', hint: 'Dua versi bertemu' },
  { id: 'penyesalan', title: 'PENYESALAN', color: 'text-gray-400', hint: 'Berjalan menjauh dari semuanya' },
  { id: 'observer', title: 'OBSERVER', color: 'text-indigo-400', hint: 'Ambil tempatnya di sudut kafe' },
  { id: 'glitch', title: 'GLITCH', color: 'text-cyan-300', hint: 'Edit time_reset.cfg' },
  { id: 'simulasi', title: 'SIMULASI', color: 'text-green-400', hint: 'system.exit(0)' },
  { id: 'penyangkalan', title: 'PENYANGKALAN', color: 'text-yellow-600', hint: 'Tidak percaya semua ini nyata' },
  { id: 'acceptance', title: 'PENERIMAAN', color: 'text-blue-300', hint: 'Berhenti melawan' },
  { id: 'kekosongan', title: 'KEKOSONGAN', color: 'text-gray-500', hint: 'Tunggu dari awal di perempatan' },
  { id: 'pengemudi', title: 'PENGEMUDI', color: 'text-red-300', hint: 'Temukan truk di gang sebelah' },
  { id: 'dua-sisi', title: 'DUA SISI', color: 'text-violet-400', hint: 'Lihat siapa yang masuk setelah keluar' },
  { id: 'pengorbanan', title: 'PENGORBANAN', color: 'text-purple-400', hint: 'Selamatkan, tapi tinggal' },
  { id: 'kopi-terakhir', title: 'KOPI TERAKHIR', color: 'text-amber-200', hint: 'Pamit dulu ke Raka' },
  { id: 'berdua', title: 'BERDUA', color: 'text-purple-300', hint: 'Bawa sosok itu bersamamu' },
  { id: 'marah', title: 'MARAH', color: 'text-red-500', hint: 'Terkadang marah itu cukup' },
  { id: 'hacker', title: 'HACKER', color: 'text-green-400', hint: 'Ada file lain di /system/' },
  { id: 'ingat', title: 'INGAT', color: 'text-sky-300', hint: 'Ingat betul-betul, lalu pergi' },
];

export default function EndingGallery({ unlockedEndings, onClose }) {
  const unlocked = new Set(unlockedEndings);
  const count = ALL_ENDINGS.filter(e => unlocked.has(e.id)).length;

  return (
    <div className="fixed inset-0 bg-black/96 z-[200] flex flex-col overflow-hidden">
      <div className="absolute inset-0 screentone opacity-10" />

      <div className="relative z-10 flex flex-col h-full">
        {/* Header */}
        <div className="text-center py-6 border-b border-gray-900 shrink-0">
          <h2 className="text-xl font-bold text-white ink-text tracking-[0.3em]">ENDING GALLERY</h2>
          <p className="text-gray-600 text-xs tracking-widest mt-1">
            {count} / {ALL_ENDINGS.length} terbuka
          </p>
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-lg mx-auto">
            {ALL_ENDINGS.map(e => {
              const isUnlocked = unlocked.has(e.id);
              return (
                <div
                  key={e.id}
                  className={`border p-3 transition-colors duration-300 ${
                    isUnlocked
                      ? 'border-gray-700 bg-gray-950/40'
                      : 'border-gray-900 bg-black/20'
                  }`}
                >
                  <div className={`text-xs font-bold tracking-wider mb-1 ${isUnlocked ? e.color : 'text-gray-800'}`}>
                    {isUnlocked ? e.title : '? ? ? ? ?'}
                  </div>
                  <div className="text-[10px] text-gray-700 leading-relaxed">
                    {isUnlocked ? e.hint : '???'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center py-4 border-t border-gray-900 shrink-0">
          <button
            onClick={onClose}
            className="text-gray-600 text-xs tracking-[0.4em] uppercase hover:text-gray-400 transition-colors cursor-pointer"
          >
            TUTUP
          </button>
        </div>
      </div>
    </div>
  );
}
