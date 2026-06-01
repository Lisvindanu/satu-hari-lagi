import { useRef, useCallback, useEffect } from 'react';

let audioCtx = null;

function getCtx() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioCtx;
}

// Resume audio context on first user interaction
function ensureResumed() {
  const ctx = getCtx();
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

// ── Synthesized sounds ──

function playTypeTick() {
  const ctx = ensureResumed();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'square';
  osc.frequency.value = 800 + Math.random() * 400;
  gain.gain.setValueAtTime(0.03, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
  osc.connect(gain).connect(ctx.destination);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.05);
}

function playClick() {
  const ctx = ensureResumed();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.value = 600;
  gain.gain.setValueAtTime(0.08, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
  osc.connect(gain).connect(ctx.destination);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.1);
}

function playChoiceHover() {
  const ctx = ensureResumed();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.value = 440;
  gain.gain.setValueAtTime(0.04, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
  osc.connect(gain).connect(ctx.destination);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.08);
}

function playChoiceSelect() {
  const ctx = ensureResumed();
  const t = ctx.currentTime;
  [523, 659, 784].forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.06, t + i * 0.08);
    gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.08 + 0.15);
    osc.connect(gain).connect(ctx.destination);
    osc.start(t + i * 0.08);
    osc.stop(t + i * 0.08 + 0.15);
  });
}

function playClueGet() {
  const ctx = ensureResumed();
  const t = ctx.currentTime;
  [392, 523, 659, 784].forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.07, t + i * 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.1 + 0.3);
    osc.connect(gain).connect(ctx.destination);
    osc.start(t + i * 0.1);
    osc.stop(t + i * 0.1 + 0.3);
  });
}

function playGlitch(duration = 2) {
  const ctx = ensureResumed();
  const bufferSize = ctx.sampleRate * duration;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * (i < bufferSize * 0.3 ? 1 : (1 - i / bufferSize));
  }
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.value = 2000;
  filter.Q.value = 5;
  gain.gain.setValueAtTime(0.15, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(0, ctx.currentTime + duration);
  source.connect(filter).connect(gain).connect(ctx.destination);
  source.start();

  // Low rumble
  const osc = ctx.createOscillator();
  const rumbleGain = ctx.createGain();
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(60, ctx.currentTime);
  osc.frequency.linearRampToValueAtTime(20, ctx.currentTime + duration);
  rumbleGain.gain.setValueAtTime(0.12, ctx.currentTime);
  rumbleGain.gain.linearRampToValueAtTime(0, ctx.currentTime + duration);
  osc.connect(rumbleGain).connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + duration);
}

function playDeath() {
  const ctx = ensureResumed();
  const t = ctx.currentTime;

  // Deep impact
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(80, t);
  osc.frequency.exponentialRampToValueAtTime(20, t + 2);
  gain.gain.setValueAtTime(0.2, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 2);
  osc.connect(gain).connect(ctx.destination);
  osc.start(t);
  osc.stop(t + 2);

  // Eerie high tone
  const osc2 = ctx.createOscillator();
  const gain2 = ctx.createGain();
  osc2.type = 'sine';
  osc2.frequency.value = 1200;
  gain2.gain.setValueAtTime(0, t + 0.5);
  gain2.gain.linearRampToValueAtTime(0.05, t + 1);
  gain2.gain.linearRampToValueAtTime(0, t + 3);
  osc2.connect(gain2).connect(ctx.destination);
  osc2.start(t + 0.5);
  osc2.stop(t + 3);
}

function playHeartbeat() {
  const ctx = ensureResumed();
  const t = ctx.currentTime;
  [0, 0.15].forEach(offset => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = 50;
    gain.gain.setValueAtTime(0.12, t + offset);
    gain.gain.exponentialRampToValueAtTime(0.001, t + offset + 0.2);
    osc.connect(gain).connect(ctx.destination);
    osc.start(t + offset);
    osc.stop(t + offset + 0.2);
  });
}

// ── Ambient loops ──

function createRainLoop() {
  const ctx = ensureResumed();
  const bufferSize = ctx.sampleRate * 2;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }

  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.loop = true;

  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 800;

  const gain = ctx.createGain();
  gain.gain.value = 0;

  source.connect(filter).connect(gain).connect(ctx.destination);
  source.start();

  return { source, gain, fadeIn: () => {
    gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 1);
  }, fadeOut: () => {
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1);
  }, stop: () => {
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.5);
    setTimeout(() => source.stop(), 600);
  }};
}

function createCafeAmbience() {
  const ctx = ensureResumed();
  // Gentle brown noise
  const bufferSize = ctx.sampleRate * 2;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  let last = 0;
  for (let i = 0; i < bufferSize; i++) {
    const white = Math.random() * 2 - 1;
    last = (last + 0.02 * white) / 1.02;
    data[i] = last * 3.5;
  }

  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.loop = true;

  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 400;

  const gain = ctx.createGain();
  gain.gain.value = 0;

  source.connect(filter).connect(gain).connect(ctx.destination);
  source.start();

  return { source, gain, fadeIn: () => {
    gain.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 1.5);
  }, fadeOut: () => {
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1);
  }, stop: () => {
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.5);
    setTimeout(() => source.stop(), 600);
  }};
}

export default function useAudio() {
  const rainRef = useRef(null);
  const cafeRef = useRef(null);
  const heartbeatIntervalRef = useRef(null);

  const startAmbience = useCallback((background) => {
    // Always have cafe ambience
    if (!cafeRef.current) {
      cafeRef.current = createCafeAmbience();
    }
    cafeRef.current.fadeIn();

    if (background === 'cafe-mendung' || background === 'perempatan') {
      if (!rainRef.current) {
        rainRef.current = createRainLoop();
      }
      rainRef.current.fadeIn();
    } else {
      if (rainRef.current) {
        rainRef.current.fadeOut();
      }
    }
  }, []);

  const stopAllAmbience = useCallback(() => {
    if (rainRef.current) {
      rainRef.current.stop();
      rainRef.current = null;
    }
    if (cafeRef.current) {
      cafeRef.current.stop();
      cafeRef.current = null;
    }
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current);
      heartbeatIntervalRef.current = null;
    }
  }, []);

  const startHeartbeat = useCallback((bpm = 80) => {
    if (heartbeatIntervalRef.current) return;
    playHeartbeat();
    heartbeatIntervalRef.current = setInterval(playHeartbeat, (60 / bpm) * 1000);
  }, []);

  const stopHeartbeat = useCallback(() => {
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current);
      heartbeatIntervalRef.current = null;
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAllAmbience();
    };
  }, [stopAllAmbience]);

  return {
    playTypeTick,
    playClick,
    playChoiceHover,
    playChoiceSelect,
    playClueGet,
    playGlitch,
    playDeath,
    playHeartbeat,
    startAmbience,
    stopAllAmbience,
    startHeartbeat,
    stopHeartbeat,
  };
}
