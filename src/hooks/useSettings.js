import { useState, useCallback, useEffect } from 'react';

const STORAGE_KEY = 'shl_settings';

// Text speed presets → ms per character (0 = instant)
export const TEXT_SPEEDS = {
  slow: 45,
  normal: 25,
  fast: 12,
  instant: 0,
};

const DEFAULTS = {
  textSpeed: 'normal',   // key of TEXT_SPEEDS
  autoAdvance: false,    // auto-progress lines after they finish
  autoDelay: 1600,       // ms to wait before auto-advancing
  skipRead: false,       // instantly skip lines already seen this session
  reduceMotion: false,   // dampen madness jitter / heavy animation
  largeText: false,      // bigger dialogue font for readability
  language: 'id',        // UI chrome language (id | en)
};

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULTS };
    return { ...DEFAULTS, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULTS };
  }
}

export default function useSettings() {
  const [settings, setSettings] = useState(load);

  // Persist whenever settings change
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(settings)); } catch { /* ignore */ }
  }, [settings]);

  const updateSetting = useCallback((key, value) => {
    setSettings(prev => (prev[key] === value ? prev : { ...prev, [key]: value }));
  }, []);

  return { settings, updateSetting };
}
