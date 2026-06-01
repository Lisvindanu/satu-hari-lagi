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
  const [phase, setPhase] = useState(0); // 0=glitch, 1=static, 2=black
  const [texts, setTexts] = useState([]);

  useEffect(() => {
    // Trigger glitch sound
    if (audio) audio.playGlitch(3);

    // Phase 0: Glitch text spam (2s)
    const textInterval = setInterval(() => {
      setTexts(prev => {
        const next = [...prev, GLITCH_TEXTS[Math.floor(Math.random() * GLITCH_TEXTS.length)]];
        return next.slice(-12);
      });
    }, 150);

    const t1 = setTimeout(() => {
      clearInterval(textInterval);
      setPhase(1); // static noise
    }, 2000);

    const t2 = setTimeout(() => {
      setPhase(2); // fade to black
    }, 3000);

    const t3 = setTimeout(() => {
      onComplete();
    }, 4000);

    return () => {
      clearInterval(textInterval);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[100] bg-black">
      {/* Glitch overlay */}
      {phase === 0 && (
        <div className="glitch-active w-full h-full relative overflow-hidden">
          {/* Scan lines */}
          <div className="absolute inset-0 scanlines opacity-60" />

          {/* Red/cyan chromatic split */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-[120px] font-bold text-red-600 opacity-40 absolute" style={{ transform: 'translate(-4px, 2px)' }}>
              15:00
            </div>
            <div className="text-[120px] font-bold text-cyan-400 opacity-40 absolute" style={{ transform: 'translate(4px, -2px)' }}>
              15:00
            </div>
            <div className="text-[120px] font-bold text-white opacity-80 absolute ink-text">
              15:00
            </div>
          </div>

          {/* Glitch text spam */}
          <div className="absolute inset-0 p-8 font-mono text-xs text-red-500 overflow-hidden opacity-70">
            {texts.map((t, i) => (
              <div key={i} className="mb-1" style={{ marginLeft: `${Math.random() * 40}%` }}>
                {t}
              </div>
            ))}
          </div>

          {/* Horizontal tear lines */}
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute w-full bg-white/10"
              style={{
                top: `${20 + i * 15}%`,
                height: '2px',
                transform: `translateX(${Math.random() * 20 - 10}px)`,
              }}
            />
          ))}
        </div>
      )}

      {/* Static noise phase */}
      {phase === 1 && (
        <div className="w-full h-full static-noise flex items-center justify-center">
          <div className="text-white text-sm tracking-[0.5em] animate-pulse font-mono">
            LOOP RESET
          </div>
        </div>
      )}

      {/* Fade to black */}
      {phase === 2 && (
        <div className="w-full h-full bg-black animate-fadeIn" />
      )}
    </div>
  );
}
