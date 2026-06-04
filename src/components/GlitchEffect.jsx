import React, { useState, useEffect } from 'react';

const GLITCH_TEXTS = [
  'SEGFAULT at 15:00:00',
  'process terminated',
  'Restarting...',
  'Loop initialized',
  'Subject: active',
  'ERROR: timeline corrupted',
  'FATAL: cannot escape',
  '15:00:00',
  '15:00:00',
  '15:00:00',
];

export default function GlitchEffect({ onComplete, audio }) {
  const [phase, setPhase] = useState(0); // 0=crash, 1=glitch, 2=static, 3=black
  const [texts, setTexts] = useState([]);

  useEffect(() => {
    // Phase 0: brake screech + flash crash image (0 - 1.2s)
    if (audio) audio.playBrakeScreech();

    const tCollision = setTimeout(() => {
      if (audio) audio.playCollision();
      setPhase(1); // → glitch
    }, 1000);

    // Phase 1: glitch text spam (1.0 - 3.0s)
    const textInterval = setInterval(() => {
      setTexts(prev => {
        const next = [...prev, GLITCH_TEXTS[Math.floor(Math.random() * GLITCH_TEXTS.length)]];
        return next.slice(-12);
      });
    }, 150);

    const tGlitch = setTimeout(() => {
      if (audio) audio.playGlitch(3);
    }, 1200);

    const t2 = setTimeout(() => {
      clearInterval(textInterval);
      setPhase(2); // → static
    }, 3000);

    const t3 = setTimeout(() => {
      setPhase(3); // → fade to black
    }, 4000);

    const t4 = setTimeout(() => {
      onComplete();
    }, 5000);

    return () => {
      clearTimeout(tCollision);
      clearTimeout(tGlitch);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearInterval(textInterval);
    };
  }, [onComplete, audio]);

  return (
    <div className="fixed inset-0 z-[100] bg-black">

      {/* Phase 0: crash impact — flash white then show skid mark image */}
      {phase === 0 && (
        <div className="w-full h-full relative overflow-hidden">
          {/* Bekas rem / crash scene */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-60"
            style={{ backgroundImage: "url('/assets/bg/bekas-rem.png')" }}
          />
          {/* Red tint overlay */}
          <div className="absolute inset-0 bg-red-950/60" />
          {/* Impact flash */}
          <div className="absolute inset-0 bg-white/20 animate-pulse" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-white/90 text-2xl tracking-[0.5em] font-mono">
              15:00
            </div>
          </div>
        </div>
      )}

      {/* Phase 1: glitch */}
      {phase === 1 && (
        <div className="glitch-active w-full h-full relative overflow-hidden">
          {/* Crash scene underneath */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{ backgroundImage: "url('/assets/bg/scene-tabrakan.png')" }}
          />
          <div className="absolute inset-0 scanlines opacity-60" />

          {/* Chromatic aberration clock */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-[120px] font-bold text-red-600 opacity-40 absolute" style={{ transform: 'translate(-4px, 2px)' }}>15:00</div>
            <div className="text-[120px] font-bold text-cyan-400 opacity-40 absolute" style={{ transform: 'translate(4px, -2px)' }}>15:00</div>
            <div className="text-[120px] font-bold text-white opacity-80 absolute ink-text">15:00</div>
          </div>

          {/* Glitch text */}
          <div className="absolute inset-0 p-8 font-mono text-xs text-red-500 overflow-hidden opacity-70">
            {texts.map((t, i) => (
              <div key={i} className="mb-1" style={{ marginLeft: `${Math.random() * 40}%` }}>
                {t}
              </div>
            ))}
          </div>

          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute w-full bg-white/10"
              style={{ top: `${20 + i * 15}%`, height: '2px', transform: `translateX(${Math.random() * 20 - 10}px)` }}
            />
          ))}
        </div>
      )}

      {/* Phase 2: static */}
      {phase === 2 && (
        <div className="w-full h-full static-noise flex items-center justify-center">
          <div className="text-white text-sm tracking-[0.5em] animate-pulse font-mono">
            LOOP RESET
          </div>
        </div>
      )}

      {/* Phase 3: fade to black */}
      {phase === 3 && (
        <div className="w-full h-full bg-black animate-fadeIn" />
      )}
    </div>
  );
}
