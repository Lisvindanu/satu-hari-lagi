import React from 'react';
import { ACHIEVEMENTS } from '../data/achievements';

export default function AchievementGallery({ unlockedIds, onClose }) {
  const unlocked = new Set(unlockedIds);
  const nonSession = ACHIEVEMENTS.filter(a => !a.sessionOnly);
  const count = nonSession.filter(a => unlocked.has(a.id)).length;

  const visible = ACHIEVEMENTS.filter(a => !a.sessionOnly);
  const regular = visible.filter(a => !a.secret);
  const secret = visible.filter(a => a.secret);

  return (
    <div className="fixed inset-0 bg-black/97 z-[200] flex flex-col overflow-hidden">
      <div className="absolute inset-0 screentone opacity-10" />

      <div className="relative z-10 flex flex-col h-full">
        {/* Header */}
        <div className="text-center py-6 border-b border-gray-900 shrink-0">
          <h2 className="text-xl font-bold text-white ink-text tracking-[0.3em]">PENCAPAIAN</h2>
          <p className="text-gray-600 text-xs tracking-widest mt-1">
            {count} / {nonSession.length} terbuka
          </p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6 max-w-lg mx-auto w-full">
          {/* Regular achievements */}
          <div>
            <p className="text-gray-700 text-[10px] tracking-[0.3em] uppercase mb-3">Umum</p>
            <div className="space-y-2">
              {regular.map(a => {
                const isUnlocked = unlocked.has(a.id);
                return (
                  <div
                    key={a.id}
                    className={`flex items-center gap-3 border px-4 py-3 transition-colors ${
                      isUnlocked ? 'border-gray-700 bg-gray-950/40' : 'border-gray-900 bg-black/10'
                    }`}
                  >
                    <span className={`font-mono text-sm shrink-0 w-5 text-center ${isUnlocked ? 'text-amber-500' : 'text-gray-800'}`}>
                      {a.icon}
                    </span>
                    <div>
                      <div className={`text-xs font-bold tracking-wide ${isUnlocked ? 'text-amber-200' : 'text-gray-700'}`}>
                        {a.title}
                      </div>
                      <div className="text-[10px] text-gray-600 mt-0.5">
                        {a.desc}
                      </div>
                    </div>
                    {isUnlocked && (
                      <span className="ml-auto text-amber-700 text-[10px] shrink-0">✓</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Secret achievements */}
          <div>
            <p className="text-gray-700 text-[10px] tracking-[0.3em] uppercase mb-3">Tersembunyi</p>
            <div className="space-y-2">
              {secret.map(a => {
                const isUnlocked = unlocked.has(a.id);
                return (
                  <div
                    key={a.id}
                    className={`flex items-center gap-3 border px-4 py-3 transition-colors ${
                      isUnlocked ? 'border-gray-700 bg-gray-950/40' : 'border-gray-900 bg-black/10'
                    }`}
                  >
                    <span className={`font-mono text-sm shrink-0 w-5 text-center ${isUnlocked ? 'text-amber-500' : 'text-gray-800'}`}>
                      {isUnlocked ? a.icon : '?'}
                    </span>
                    <div>
                      <div className={`text-xs font-bold tracking-wide ${isUnlocked ? 'text-amber-200' : 'text-gray-700'}`}>
                        {isUnlocked ? a.title : '? ? ? ? ?'}
                      </div>
                      <div className="text-[10px] text-gray-600 mt-0.5">
                        {isUnlocked ? a.desc : '???'}
                      </div>
                    </div>
                    {isUnlocked && (
                      <span className="ml-auto text-amber-700 text-[10px] shrink-0">✓</span>
                    )}
                  </div>
                );
              })}
            </div>
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
