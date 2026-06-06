import React from 'react';

const CHARACTERS = {
  'raka-normal': { src: '/assets/characters/raka-normal.png', position: 'right' },
  'raka-senyum': { src: '/assets/characters/raka-senyum.png', position: 'right' },
  'raka-bingung': { src: '/assets/characters/raka-bingung.png', position: 'right' },
  'raka-serius': { src: '/assets/characters/raka-serius.png', position: 'right' },
  'sosok-diam': { src: '/assets/characters/sosok-diam.png', position: 'left' },
  'sosok-menyeringai': { src: '/assets/characters/sosok-menyeringai.png', position: 'left' },
  'sosok-tua': { src: '/assets/characters/sosok-tua.png', position: 'left' },
  'raka-sedih': { src: '/assets/characters/raka-sedih.png', position: 'right' },
  'mc-doppelganger': { src: '/assets/characters/mc-doppelganger.png', position: 'right' },
};

export default function CharacterSprite({ characterId }) {
  if (!characterId) return null;

  const char = CHARACTERS[characterId];
  if (!char) return null;

  const positionClass = char.position === 'left'
    ? 'left-[10%]'
    : 'right-[10%]';

  return (
    <div
      key={characterId}
      className={`fixed bottom-[180px] z-10 char-enter ${positionClass}`}
    >
      <img
        src={char.src}
        alt=""
        className="h-[380px] w-auto drop-shadow-[0_0_30px_rgba(0,0,0,0.9)]"
        style={{ imageRendering: 'pixelated' }}
        draggable={false}
      />
    </div>
  );
}
