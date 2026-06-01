import React, { useState, useEffect, useCallback, useRef } from 'react';

export default function DialogueBox({ node, onChoice, hasClue, formatTime, time, audio }) {
  const [lineIndex, setLineIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [showChoices, setShowChoices] = useState(false);
  const tickCounterRef = useRef(0);

  const currentLine = node.lines[lineIndex];

  // Reset saat node berubah
  useEffect(() => {
    setLineIndex(0);
    setShowChoices(false);
  }, [node.id]);

  // Efek ketik + sound
  useEffect(() => {
    if (!currentLine) return;

    setIsTyping(true);
    setDisplayedText('');
    tickCounterRef.current = 0;
    let i = 0;
    const text = currentLine.text;

    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayedText(text.slice(0, i + 1));
        // Play tick every 2 chars
        tickCounterRef.current++;
        if (tickCounterRef.current % 2 === 0 && audio) {
          audio.playTypeTick();
        }
        i++;
      } else {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, 25);

    return () => clearInterval(interval);
  }, [lineIndex, currentLine, audio]);

  const handleClick = useCallback(() => {
    if (audio) audio.playClick();

    if (isTyping) {
      setDisplayedText(currentLine.text);
      setIsTyping(false);
      return;
    }

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
  }, [isTyping, lineIndex, node, currentLine, onChoice, audio]);

  const availableChoices = (node.choices || []).filter(c =>
    !c.requiresClue || hasClue(c.requiresClue)
  );

  const speakerColor = currentLine?.speaker === 'narasi'
    ? 'text-gray-400 italic'
    : currentLine?.speaker === '???'
      ? 'text-red-400'
      : 'text-amber-300';

  const isTense = time >= 14 * 60 + 30;
  const clockColor = isTense ? 'text-red-500 animate-pulse' : 'text-gray-500';

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      {/* Jam */}
      <div className={`absolute -top-12 right-6 text-sm tracking-[0.3em] font-mono ${clockColor}`}>
        {formatTime(time)}
      </div>

      {/* Kotak dialog */}
      <div
        className="bg-black/90 border-t border-gray-800 px-8 py-6 min-h-[180px] cursor-pointer backdrop-blur-sm"
        onClick={!showChoices ? handleClick : undefined}
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

            {!isTyping && (
              <div className="text-gray-700 text-xs mt-4 tracking-widest animate-pulse">
                ▼ klik untuk lanjut
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
                onClick={(e) => {
                  e.stopPropagation();
                  onChoice(choice);
                }}
                className="block w-full text-left px-4 py-3 border border-gray-800 text-gray-300 hover:border-amber-700 hover:text-amber-200 hover:bg-amber-950/20 transition-all duration-300 text-sm tracking-wide cursor-pointer"
              >
                <span className="text-gray-600 mr-3">{i + 1}.</span>
                {choice.text}
                {choice.timeCost > 0 && (
                  <span className="float-right text-gray-600 text-xs mt-0.5">
                    +{choice.timeCost} menit
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
