import { useState, useCallback } from 'react';

const INITIAL_TIME = 13 * 60; // 13:00 in minutes
const DEATH_TIME = 15 * 60;   // 15:00 in minutes

// Madness arc — the intro a loop starts on, escalating as the MC cracks
function introNodeFor(loopCount) {
  if (loopCount >= 8) return 'intro-hancur';
  if (loopCount >= 6) return 'intro-pecah';
  if (loopCount >= 4) return 'intro-retak';
  if (loopCount >= 1) return 'intro';
  return 'intro-first';
}

// Clues that accumulate automatically as loops pile up (memory + sanity)
function withAutoClues(clues, loopCount) {
  const c = [...clues];
  if (loopCount >= 2 && !c.includes('loop-awareness')) c.push('loop-awareness');
  if (loopCount >= 4 && !c.includes('deep-awareness')) c.push('deep-awareness');
  if (loopCount >= 6 && !c.includes('retak')) c.push('retak');
  if (loopCount >= 8 && !c.includes('hancur')) c.push('hancur');
  return c;
}

// Madness level (0-4) for visual/audio degradation
export function madnessLevel(loopCount) {
  if (loopCount >= 8) return 4;
  if (loopCount >= 6) return 3;
  if (loopCount >= 4) return 2;
  if (loopCount >= 1) return 1;
  return 0;
}

const INITIAL_STATE = {
  currentNodeId: 'intro-first',
  currentLine: 0,
  time: INITIAL_TIME,
  loopCount: 0,
  // Clues persist across loops (memory mechanic)
  clues: [],
  // Flags for current loop only
  flags: {},
  // Which endings have been seen
  endings: [],
  // Game phase
  phase: 'title', // title | playing | glitch | dead | ending
};

export default function useGameState() {
  const [state, setState] = useState(INITIAL_STATE);

  const advanceTime = useCallback((minutes) => {
    setState(prev => {
      const newTime = prev.time + minutes;
      if (newTime >= DEATH_TIME) {
        return { ...prev, time: DEATH_TIME, phase: 'glitch' };
      }
      return { ...prev, time: newTime };
    });
  }, []);

  const goToNode = useCallback((nodeId, timeCost = 0) => {
    setState(prev => {
      const newTime = prev.time + timeCost;
      if (newTime >= DEATH_TIME) {
        return { ...prev, time: DEATH_TIME, phase: 'glitch' };
      }
      return { ...prev, currentNodeId: nodeId, currentLine: 0, time: newTime };
    });
  }, []);

  // Track the dialogue line being read so a resumed run lands on the same spot
  const setCurrentLine = useCallback((line) => {
    setState(prev => (prev.currentLine === line ? prev : { ...prev, currentLine: line }));
  }, []);

  const addClue = useCallback((clueId) => {
    setState(prev => {
      if (prev.clues.includes(clueId)) return prev;
      return { ...prev, clues: [...prev.clues, clueId] };
    });
  }, []);

  const setFlag = useCallback((key, value = true) => {
    setState(prev => ({
      ...prev,
      flags: { ...prev.flags, [key]: value }
    }));
  }, []);

  const hasClue = useCallback((clueId) => {
    return state.clues.includes(clueId);
  }, [state.clues]);

  const hasFlag = useCallback((key) => {
    return !!state.flags[key];
  }, [state.flags]);

  // Reset loop — keep clues, reset everything else
  const resetLoop = useCallback(() => {
    setState(prev => {
      const newLoopCount = prev.loopCount + 1;
      const autoClues = withAutoClues(prev.clues, newLoopCount);
      if (prev.endings.includes('terlambat') && !autoClues.includes('seen-terlambat')) autoClues.push('seen-terlambat');
      return {
        ...INITIAL_STATE,
        currentNodeId: introNodeFor(newLoopCount),
        loopCount: newLoopCount,
        clues: autoClues,
        endings: prev.endings,
        phase: 'playing',
      };
    });
  }, []);

  // Start game from title
  const startGame = useCallback(() => {
    setState(prev => ({ ...prev, phase: 'playing' }));
  }, []);

  // Hydrate saved progress while staying on the title screen (used after login)
  const setProgress = useCallback(({ clues = [], endings = [], loopCount = 0 }) => {
    const autoClues = withAutoClues(clues, loopCount);
    setState(prev => ({
      ...prev,
      currentNodeId: introNodeFor(loopCount),
      currentLine: 0,
      time: INITIAL_TIME,
      loopCount,
      clues: autoClues,
      endings,
      flags: {},
      phase: 'title',
    }));
  }, []);

  // Return to title without losing the current run — resumes where you left off
  const quitToTitle = useCallback(() => {
    setState(prev => ({ ...prev, phase: 'title' }));
  }, []);

  // Trigger glitch -> death sequence
  const triggerDeath = useCallback(() => {
    setState(prev => ({ ...prev, phase: 'dead' }));
  }, []);

  // Reach an ending
  const reachEnding = useCallback((endingId) => {
    setState(prev => ({
      ...prev,
      phase: 'ending',
      endings: prev.endings.includes(endingId)
        ? prev.endings
        : [...prev.endings, endingId],
    }));
  }, []);

  const formatTime = useCallback((time) => {
    const h = Math.floor(time / 60);
    const m = time % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  }, []);

  // Continue from an ending to a new node (post-ending sequence)
  const continueFromEnding = useCallback((nodeId, time) => {
    setState(prev => ({
      ...prev,
      phase: 'playing',
      currentNodeId: nodeId,
      currentLine: 0,
      time: time || prev.time,
    }));
  }, []);

  return {
    state,
    advanceTime,
    goToNode,
    setCurrentLine,
    addClue,
    setFlag,
    hasClue,
    hasFlag,
    resetLoop,
    startGame,
    setProgress,
    quitToTitle,
    triggerDeath,
    reachEnding,
    continueFromEnding,
    formatTime,
  };
}
