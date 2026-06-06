import React, { useState, useEffect, useCallback, useRef } from 'react';

export default function DialogueBox({ node, onChoice, onLineChange, startLine = 0, hasClue, formatTime, time, loopCount, audio }) {
  const [lineIndex, setLineIndex] = useState(() => Math.min(startLine, node.lines.length - 1));
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [canAdvance, setCanAdvance] = useState(false);
  const [showChoices, setShowChoices] = useState(false);
  const tickCounterRef = useRef(0);
  const clickLockRef = useRef(false);
  const mountedNodeRef = useRef(node.id);

  const currentLine = node.lines[lineIndex];

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

  // Typewriter effect
  useEffect(() => {
    if (!currentLine) return;

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
        // Small delay before allowing advance — prevents accidental skip
        setTimeout(() => setCanAdvance(true), 400);
      }
    }, 25);

    return () => clearInterval(interval);
  }, [lineIndex, currentLine, audio]);

  const handleClick = useCallback(() => {
    // Double-click guard
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

    if (lineIndex < node.lines.length - 1) {
      setLineIndex(prev => prev + 1);
    } else {
      if (node.choices && node.choices.length > 0) {
        setShowChoices(true);
      } else if (node.triggerDeath) {
        onChoice({ triggerDeath: true });
      } else if (node.ending) {
        onChoice({ ending: node.ending });
      }
    }
  }, [isTyping, canAdvance, lineIndex, node, currentLine, onChoice, audio]);

  const availableChoices = (node.choices || []).filter(c =>
    !c.requiresClue || hasClue(c.requiresClue)
  );

  const speakerColor = currentLine?.speaker === 'narasi'
    ? 'text-gray-400 italic'
    : currentLine?.speaker === '???'
      ? 'text-red-400'
      : 'text-amber-300';

  // Tension: only apply red/pulse on loop > 0
  const isTense = loopCount > 0 && time >= 14 * 60 + 30;
  const clockColor = isTense
    ? 'text-red-500 clock-tense'
    : 'text-gray-300';

  // Progress: current line out of total
  const progress = node.lines.length > 1
    ? ((lineIndex) / (node.lines.length - 1)) * 100
    : 100;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      {/* Clock — top center, more prominent */}
      <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 text-sm tracking-[0.5em] font-mono select-none px-3 py-1 bg-black/50 backdrop-blur-sm ${clockColor}`}>
        {formatTime(time)}
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

            <p className={`text-lg leading-relaxed ${speakerColor} ink-text`}>
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
