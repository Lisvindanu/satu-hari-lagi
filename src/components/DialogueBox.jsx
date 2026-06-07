import React, { useState, useEffect, useCallback, useRef } from 'react';
import { TEXT_SPEEDS } from '../hooks/useSettings';

export default function DialogueBox({
  node, onChoice, onLineChange, startLine = 0, madness = 0, hasClue,
  formatTime, time, loopCount, audio,
  settings = {}, onHistory, isLineSeen, markLineSeen,
}) {
  const [lineIndex, setLineIndex] = useState(() => Math.min(startLine, node.lines.length - 1));
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [canAdvance, setCanAdvance] = useState(false);
  const [showChoices, setShowChoices] = useState(false);
  const tickCounterRef = useRef(0);
  const clickLockRef = useRef(false);
  const mountedNodeRef = useRef(node.id);
  const lastPushedRef = useRef(null);
  const autoTimerRef = useRef(null);

  const currentLine = node.lines[lineIndex];
  const reduceMotion = !!settings.reduceMotion;

  // Reset only when the node actually changes (not on first mount / resume)
  useEffect(() => {
    if (mountedNodeRef.current !== node.id) {
      mountedNodeRef.current = node.id;
      setLineIndex(0);
      setShowChoices(false);
      setCanAdvance(false);
    }
  }, [node.id]);

  // Report current line up so a resumed run lands on the same spot
  useEffect(() => {
    if (onLineChange) onLineChange(lineIndex);
  }, [lineIndex, onLineChange]);

  // Push the line into the session backlog once when it first appears
  useEffect(() => {
    if (!currentLine) return;
    const key = `${node.id}:${lineIndex}`;
    if (lastPushedRef.current !== key) {
      lastPushedRef.current = key;
      if (onHistory) onHistory({ speaker: currentLine.speaker, text: currentLine.text });
    }
  }, [node.id, lineIndex, currentLine, onHistory]);

  // Typewriter effect — speed comes from settings; instant or already-seen skips it
  useEffect(() => {
    if (!currentLine) return;

    const speed = TEXT_SPEEDS[settings.textSpeed] ?? TEXT_SPEEDS.normal;
    const seen = settings.skipRead && isLineSeen && isLineSeen(`${node.id}:${lineIndex}`);

    if (speed === 0 || seen) {
      setDisplayedText(currentLine.text);
      setIsTyping(false);
      const t = setTimeout(() => setCanAdvance(true), seen ? 0 : 150);
      return () => clearTimeout(t);
    }

    setIsTyping(true);
    setCanAdvance(false);
    setDisplayedText('');
    tickCounterRef.current = 0;
    let i = 0;
    const text = currentLine.text;

    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayedText(text.slice(0, i + 1));
        tickCounterRef.current++;
        if (tickCounterRef.current % 2 === 0 && audio) {
          audio.playTypeTick();
        }
        i++;
      } else {
        setIsTyping(false);
        clearInterval(interval);
        setTimeout(() => setCanAdvance(true), 400);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [lineIndex, currentLine, audio, settings.textSpeed, settings.skipRead, isLineSeen, node.id]);

  // Move forward: next line, or reveal choices / trigger terminal nodes
  const advance = useCallback(() => {
    if (currentLine && markLineSeen) markLineSeen(`${node.id}:${lineIndex}`);
    if (lineIndex < node.lines.length - 1) {
      setLineIndex(prev => prev + 1);
    } else if (node.choices && node.choices.length > 0) {
      setShowChoices(true);
    } else if (node.triggerDeath) {
      onChoice({ triggerDeath: true });
    } else if (node.ending) {
      onChoice({ ending: node.ending });
    }
  }, [currentLine, markLineSeen, node, lineIndex, onChoice]);

  const handleClick = useCallback(() => {
    if (clickLockRef.current) return;
    clickLockRef.current = true;
    setTimeout(() => { clickLockRef.current = false; }, 350);

    if (audio) audio.playClick();

    // Skip typing — show full text immediately, then wait for canAdvance
    if (isTyping) {
      setDisplayedText(currentLine.text);
      setIsTyping(false);
      setTimeout(() => setCanAdvance(true), 200);
      return;
    }

    if (!canAdvance) return;
    advance();
  }, [isTyping, canAdvance, currentLine, advance, audio]);

  // Auto-advance — when enabled, progress lines automatically after a delay
  useEffect(() => {
    if (autoTimerRef.current) { clearTimeout(autoTimerRef.current); autoTimerRef.current = null; }
    if (settings.autoAdvance && !isTyping && canAdvance && !showChoices) {
      const delay = settings.autoDelay ?? 1600;
      autoTimerRef.current = setTimeout(() => advance(), delay);
    }
    return () => { if (autoTimerRef.current) clearTimeout(autoTimerRef.current); };
  }, [settings.autoAdvance, settings.autoDelay, isTyping, canAdvance, showChoices, advance]);

  const availableChoices = (node.choices || []).filter(c =>
    !c.requiresClue || hasClue(c.requiresClue)
  );

  // Keyboard: space/enter/→ to advance, number keys to pick a choice
  useEffect(() => {
    const onKey = (e) => {
      if (showChoices) {
        const n = parseInt(e.key, 10);
        if (n >= 1 && n <= availableChoices.length) {
          e.preventDefault();
          onChoice(availableChoices[n - 1]);
        }
        return;
      }
      if (e.key === ' ' || e.key === 'Enter' || e.key === 'ArrowRight') {
        e.preventDefault();
        handleClick();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [showChoices, availableChoices, onChoice, handleClick]);

  const speakerColor = currentLine?.speaker === 'narasi'
    ? 'text-gray-400 italic'
    : currentLine?.speaker === '???'
      ? 'text-red-400'
      : 'text-amber-300';

  const isTense = loopCount > 0 && time >= 14 * 60 + 30;
  const clockColor = isTense
    ? 'text-red-500 clock-tense'
    : 'text-gray-300';

  const progress = node.lines.length > 1
    ? ((lineIndex) / (node.lines.length - 1)) * 100
    : 100;

  const textSize = settings.largeText ? 'text-xl sm:text-2xl' : 'text-lg';
  const unease = madness >= 3 && !reduceMotion ? 'text-unease' : '';

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      {/* Clock — top center */}
      <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 text-sm tracking-[0.5em] font-mono select-none px-3 py-1 bg-black/50 backdrop-blur-sm ${clockColor}`}>
        {formatTime(time)}
        {loopCount > 0 && <span className="text-gray-600 ml-3 text-xs tracking-normal">loop {loopCount + 1}</span>}
      </div>

      {/* Progress line */}
      {node.lines.length > 1 && !showChoices && (
        <div className="absolute -top-0.5 left-0 h-[1px] bg-gray-800 w-full">
          <div
            className="h-full bg-amber-900/50 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Dialogue box */}
      <div
        className="bg-black/92 border-t border-gray-800/80 px-6 sm:px-8 py-5 sm:py-6 min-h-[160px] sm:min-h-[180px] cursor-pointer backdrop-blur-sm"
        onClick={!showChoices ? handleClick : undefined}
        onTouchEnd={!showChoices ? (e) => { e.preventDefault(); handleClick(); } : undefined}
      >
        {!showChoices ? (
          <div>
            {currentLine && currentLine.speaker !== 'narasi' && (
              <div className={`text-xs tracking-[0.3em] uppercase mb-3 ${speakerColor}`}>
                {currentLine.speaker}
              </div>
            )}

            <p className={`${textSize} leading-relaxed ${speakerColor} ink-text ${unease}`}>
              {displayedText}
              {isTyping && <span className="cursor-blink" />}
            </p>

            {canAdvance && !isTyping && (
              <div className="text-gray-700 text-xs mt-4 tracking-widest animate-pulse">
                ▼
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            <div className="text-xs text-gray-600 tracking-widest mb-4 uppercase">
              Pilih tindakan:
            </div>
            {availableChoices.map((choice, i) => (
              <button
                key={i}
                onMouseEnter={() => audio && audio.playChoiceHover()}
                onClick={(e) => { e.stopPropagation(); onChoice(choice); }}
                onTouchEnd={(e) => { e.stopPropagation(); e.preventDefault(); onChoice(choice); }}
                className="block w-full text-left px-4 py-3 border border-gray-800 text-gray-300 hover:border-amber-700 hover:text-amber-200 hover:bg-amber-950/20 active:bg-amber-950/30 transition-all duration-300 text-sm tracking-wide cursor-pointer"
              >
                <span className="text-gray-600 mr-3">{i + 1}.</span>
                {choice.text}
                {choice.timeCost > 0 && (
                  <span className="float-right text-gray-600 text-xs mt-0.5">
                    +{choice.timeCost}m
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
