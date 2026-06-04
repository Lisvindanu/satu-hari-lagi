import React, { useState } from 'react';

export default function TitleScreen({ onStart, loopCount, audio, onShowLeaderboard, onShowGallery, onShowAchievements, hasEndings, achievementCount, user, onAuth, onLogout }) {
  const [showAuth, setShowAuth] = useState(false);
  const [mode, setMode] = useState('login'); // login | register
  const [username, setUsername] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const handleStart = () => {
    if (audio) audio.playClick();
    onStart();
  };

  const handleSubmit = async () => {
    if (busy) return;
    setError('');
    if (!/^[A-Za-z0-9_]{3,16}$/.test(username)) { setError('username 3-16 huruf/angka'); return; }
    if (!/^[0-9]{4}$/.test(pin)) { setError('pin harus 4 angka'); return; }
    setBusy(true);
    const err = await onAuth(mode, username, pin);
    setBusy(false);
    if (err) { setError(err); return; }
    if (audio) audio.playClick();
    setShowAuth(false);
    setUsername('');
    setPin('');
  };

  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center overflow-y-auto py-10">
      <div className="absolute inset-0 screentone opacity-20 pointer-events-none" />

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
          {loopCount === 0 ? 'MULAI' : 'LANJUTKAN'}
        </button>

        {/* Account */}
        <div className="mt-8">
          {user ? (
            <div className="flex flex-col items-center gap-2 animate-fadeIn">
              <p className="text-amber-700/80 text-xs tracking-widest">
                masuk sebagai <span className="text-amber-300">{user.username}</span>
              </p>
              <button
                onClick={onLogout}
                className="text-gray-700 text-xs tracking-widest hover:text-gray-500 transition-colors cursor-pointer"
              >
                keluar
              </button>
            </div>
          ) : !showAuth ? (
            <button
              onClick={() => setShowAuth(true)}
              className="text-gray-700 text-xs tracking-widest hover:text-amber-700 transition-colors cursor-pointer"
            >
              login / daftar (simpan progress)
            </button>
          ) : (
            <div className="flex flex-col items-center gap-3 animate-fadeIn">
              <div className="flex gap-4 text-xs tracking-widest">
                <button
                  onClick={() => { setMode('login'); setError(''); }}
                  className={`cursor-pointer transition-colors ${mode === 'login' ? 'text-amber-400' : 'text-gray-700 hover:text-gray-500'}`}
                >
                  LOGIN
                </button>
                <span className="text-gray-800">|</span>
                <button
                  onClick={() => { setMode('register'); setError(''); }}
                  className={`cursor-pointer transition-colors ${mode === 'register' ? 'text-amber-400' : 'text-gray-700 hover:text-gray-500'}`}
                >
                  DAFTAR
                </button>
              </div>

              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value.trim())}
                placeholder="username"
                maxLength={16}
                className="bg-transparent border-b border-gray-700 text-gray-300 text-sm text-center outline-none w-40 placeholder-gray-700 pb-1"
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                autoFocus
              />
              <input
                type="password"
                inputMode="numeric"
                pattern="[0-9]*"
                value={pin}
                onChange={e => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                placeholder="pin 4 angka"
                maxLength={4}
                className="bg-transparent border-b border-gray-700 text-gray-300 text-sm text-center outline-none w-40 placeholder-gray-700 pb-1 font-mono tracking-[0.5em]"
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              />

              <div className="flex gap-4 mt-1">
                <button
                  onClick={handleSubmit}
                  disabled={busy}
                  className="text-amber-700 text-xs tracking-widest hover:text-amber-400 transition-colors cursor-pointer disabled:opacity-40"
                >
                  {busy ? '...' : mode === 'login' ? 'MASUK' : 'BUAT AKUN'}
                </button>
                <button
                  onClick={() => { setShowAuth(false); setError(''); setUsername(''); setPin(''); }}
                  className="text-gray-700 text-xs tracking-widest hover:text-gray-500 transition-colors cursor-pointer"
                >
                  batal
                </button>
              </div>
              {error && (
                <p className="text-red-800 text-[10px] tracking-widest">{error}</p>
              )}
            </div>
          )}
        </div>

        {/* Ending gallery + Achievements + Leaderboard */}
        <div className="mt-8 flex flex-col items-center gap-3">
          {hasEndings && (
            <button
              onClick={onShowGallery}
              className="text-gray-700 text-xs tracking-widest hover:text-amber-700 transition-colors cursor-pointer"
            >
              ending gallery
            </button>
          )}
          <button
            onClick={onShowAchievements}
            className="text-gray-700 text-xs tracking-widest hover:text-amber-700 transition-colors cursor-pointer"
          >
            pencapaian{achievementCount > 0 ? ` (${achievementCount})` : ''}
          </button>
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
