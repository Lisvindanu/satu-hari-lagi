import { useState, useCallback } from 'react';

const INITIAL_TIME = 13 * 60; // 13:00 in minutes
const DEATH_TIME = 15 * 60;   // 15:00 in minutes

const INITIAL_STATE = {
  currentNodeId: 'intro',
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
      return { ...prev, currentNodeId: nodeId, time: newTime };
    });
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
      const autoClues = [...prev.clues];
      if (newLoopCount >= 2 && !autoClues.includes('loop-awareness')) autoClues.push('loop-awareness');
      if (newLoopCount >= 4 && !autoClues.includes('deep-awareness')) autoClues.push('deep-awareness');
      if (prev.endings.includes('terlambat') && !autoClues.includes('seen-terlambat')) autoClues.push('seen-terlambat');
      return {
        ...INITIAL_STATE,
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
      time: time || prev.time,
    }));
  }, []);

  return {
    state,
    advanceTime,
    goToNode,
    addClue,
    setFlag,
    hasClue,
    hasFlag,
    resetLoop,
    startGame,
    triggerDeath,
    reachEnding,
    continueFromEnding,
    formatTime,
  };
}
