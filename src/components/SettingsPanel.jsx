import React from 'react';
import { makeT, LANGUAGES } from '../i18n';

const SPEED_KEYS = ['slow', 'normal', 'fast', 'instant'];

function Row({ label, children }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2">
      <span className="text-gray-400 text-xs tracking-[0.2em] uppercase">{label}</span>
      <div className="flex items-center gap-2">{children}</div>
    </div>
  );
}

function Toggle({ on, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`text-xs tracking-[0.3em] uppercase px-3 py-1 border transition-colors cursor-pointer ${
        on
          ? 'border-amber-700 text-amber-300 bg-amber-950/20'
          : 'border-gray-800 text-gray-600 hover:text-gray-400'
      }`}
    >
      {on ? 'on' : 'off'}
    </button>
  );
}

export default function SettingsPanel({ settings, updateSetting, audio, onClose }) {
  const muted = audio ? audio.isMuted() : false;
  const [, force] = React.useReducer(x => x + 1, 0);
  const t = makeT(settings.language);

  const toggleMute = () => {
    if (!audio) return;
    const next = audio.setMuted(!muted);
    if (!next) audio.playClick();
    force();
  };

  return (
    <div className="fixed inset-0 z-[70] bg-black/85 backdrop-blur-sm flex items-center justify-center animate-fadeIn" onClick={onClose}>
      <div
        className="relative bg-black/95 border border-gray-800 px-7 py-6 w-[340px] max-w-[90vw]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-amber-800/80 text-[10px] tracking-[0.4em] uppercase mb-4">{t('settings.title')}</div>

        <Row label={t('settings.textSpeed')}>
          <div className="flex gap-1">
            {SPEED_KEYS.map(key => (
              <button
                key={key}
                onClick={() => { updateSetting('textSpeed', key); audio && audio.playClick(); }}
                className={`text-[10px] tracking-wider px-2 py-1 border transition-colors cursor-pointer ${
                  settings.textSpeed === key
                    ? 'border-amber-700 text-amber-300 bg-amber-950/20'
                    : 'border-gray-800 text-gray-600 hover:text-gray-400'
                }`}
              >
                {t(`settings.speed.${key}`)}
              </button>
            ))}
          </div>
        </Row>

        <Row label={t('settings.autoAdvance')}>
          <Toggle on={settings.autoAdvance} onClick={() => { updateSetting('autoAdvance', !settings.autoAdvance); audio && audio.playClick(); }} />
        </Row>

        <Row label={t('settings.skipRead')}>
          <Toggle on={settings.skipRead} onClick={() => { updateSetting('skipRead', !settings.skipRead); audio && audio.playClick(); }} />
        </Row>

        <Row label={t('settings.largeText')}>
          <Toggle on={settings.largeText} onClick={() => { updateSetting('largeText', !settings.largeText); audio && audio.playClick(); }} />
        </Row>

        <Row label={t('settings.reduceMotion')}>
          <Toggle on={settings.reduceMotion} onClick={() => { updateSetting('reduceMotion', !settings.reduceMotion); audio && audio.playClick(); }} />
        </Row>

        <Row label={t('settings.sound')}>
          <Toggle on={!muted} onClick={toggleMute} />
        </Row>

        <Row label={t('settings.language')}>
          <div className="flex gap-1">
            {LANGUAGES.map(l => (
              <button
                key={l.key}
                onClick={() => { updateSetting('language', l.key); audio && audio.playClick(); }}
                className={`text-[10px] tracking-wider px-2 py-1 border transition-colors cursor-pointer ${
                  settings.language === l.key
                    ? 'border-amber-700 text-amber-300 bg-amber-950/20'
                    : 'border-gray-800 text-gray-600 hover:text-gray-400'
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </Row>

        <button
          onClick={onClose}
          className="text-gray-600 text-xs tracking-[0.3em] uppercase mt-5 hover:text-gray-400 transition-colors cursor-pointer"
        >
          {t('common.close')}
        </button>
      </div>
    </div>
  );
}
