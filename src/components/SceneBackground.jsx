import React from 'react';

const BACKGROUNDS = {
  'cafe-siang': {
    src: '/assets/bg/cafe-siang.png',
    ambiance: 'warm',
  },
  'cafe-mendung': {
    src: '/assets/bg/cafe-mendung.png',
    ambiance: 'cold',
  },
  'perempatan': {
    src: '/assets/bg/perempatan.png',
    ambiance: 'cold',
  },
  'truk-kabin': {
    src: '/assets/bg/truk-kabin.png',
    ambiance: 'cold',
  },
  'kota-salju': {
    src: '/assets/bg/kota-salju.png',
    ambiance: 'cold',
  },
  'void-putih': {
    src: '/assets/bg/void-putih.png',
    ambiance: 'warm',
  },
  'perempatan-malam': {
    src: '/assets/bg/perempatan-malam.png',
    ambiance: 'cold',
  },
  'kafe-tutup': {
    src: '/assets/bg/kafe-tutup.png',
    ambiance: 'cold',
  },
};

export default function SceneBackground({ backgroundId }) {
  const bg = BACKGROUNDS[backgroundId] || BACKGROUNDS['cafe-siang'];
  const isOutdoor = backgroundId === 'perempatan' || backgroundId === 'perempatan-malam';

  return (
    <div key={backgroundId} className="fixed inset-0 z-0 scene-transition">
      <img
        src={bg.src}
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
        style={{
          imageRendering: 'pixelated',
          filter: bg.ambiance === 'cold'
            ? 'saturate(0.5) brightness(0.65) contrast(1.2)'
            : 'saturate(0.75) brightness(0.85) contrast(1.1)',
        }}
        draggable={false}
      />

      {/* Scanline overlay */}
      <div className="absolute inset-0 scanlines opacity-25" />

      {/* Rain for cold scenes */}
      {bg.ambiance === 'cold' && (
        <div className="absolute inset-0 rain-overlay opacity-30" />
      )}

      {/* Extra heavy rain for outdoor */}
      {isOutdoor && (
        <div className="absolute inset-0 rain-overlay opacity-40" style={{ animationDuration: '0.25s' }} />
      )}

      {/* Vignette + bottom darken */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/15" />
      <div className="absolute inset-0" style={{ boxShadow: 'inset 0 0 150px 50px rgba(0,0,0,0.5)' }} />
    </div>
  );
}
