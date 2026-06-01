import React, { useCallback, useEffect, useRef } from 'react';
import useGameState from './hooks/useGameState';
import useAudio from './hooks/useAudio';
import dialogueData from './data/dialogue.json';
import TitleScreen from './components/TitleScreen';
import DialogueBox from './components/DialogueBox';
import SceneBackground from './components/SceneBackground';
import CharacterSprite from './components/CharacterSprite';
import GlitchEffect from './components/GlitchEffect';
import DeathScreen from './components/DeathScreen';
import EndingScreen from './components/EndingScreen';
import ClueNotification from './components/ClueNotification';

const DEATH_TIME = 15 * 60;
const TENSION_TIME = 14 * 60 + 30; // 14:30

export default function App() {
  const {
    state,
    goToNode,
    addClue,
    hasClue,
    resetLoop,
    startGame,
    triggerDeath,
    reachEnding,
    continueFromEnding,
    formatTime,
  } = useGameState();

  const audio = useAudio();
  const prevBgRef = useRef(null);
  const prevClueCountRef = useRef(0);

  const currentNode = dialogueData[state.currentNodeId];

  // Ambience based on background
  useEffect(() => {
    if (state.phase === 'playing' && currentNode) {
      const bg = currentNode.background;
      if (bg !== prevBgRef.current) {
        audio.startAmbience(bg);
        prevBgRef.current = bg;
      }
    }

    if (state.phase !== 'playing') {
      audio.stopAllAmbience();
      prevBgRef.current = null;
    }
  }, [state.phase, currentNode, audio]);

  // Heartbeat when time is running out
  useEffect(() => {
    if (state.phase === 'playing' && state.time >= TENSION_TIME && state.time < DEATH_TIME) {
      const bpm = 80 + ((state.time - TENSION_TIME) / (DEATH_TIME - TENSION_TIME)) * 60;
      audio.startHeartbeat(bpm);
    } else {
      audio.stopHeartbeat();
    }
  }, [state.time, state.phase, audio]);

  // Clue get notification
  useEffect(() => {
    if (state.clues.length > prevClueCountRef.current) {
      audio.playClueGet();
    }
    prevClueCountRef.current = state.clues.length;
  }, [state.clues.length, audio]);

  const handleChoice = useCallback((choice) => {
    audio.playChoiceSelect();

    if (choice.triggerDeath) {
      triggerDeath();
      return;
    }

    if (choice.ending) {
      reachEnding(choice.ending);
      return;
    }

    if (choice.givesClue) {
      addClue(choice.givesClue);
    }

    if (choice.nextNode) {
      goToNode(choice.nextNode, choice.timeCost || 0);
    }
  }, [goToNode, addClue, triggerDeath, reachEnding, audio]);

  const handleGlitchComplete = useCallback(() => {
    triggerDeath();
  }, [triggerDeath]);

  // Title screen
  if (state.phase === 'title') {
    return <TitleScreen onStart={startGame} loopCount={state.loopCount} audio={audio} />;
  }

  // Glitch transition
  if (state.phase === 'glitch') {
    return <GlitchEffect onComplete={handleGlitchComplete} audio={audio} />;
  }

  // Death screen
  if (state.phase === 'dead') {
    return <DeathScreen loopCount={state.loopCount} onRestart={resetLoop} audio={audio} />;
  }

  // Ending screen
  if (state.phase === 'ending') {
    return (
      <EndingScreen
        endingId={state.endings[state.endings.length - 1]}
        loopCount={state.loopCount}
        onRestart={resetLoop}
        onContinue={continueFromEnding}
      />
    );
  }

  // Playing phase
  if (!currentNode) return null;

  const isTense = state.time >= TENSION_TIME;

  return (
    <div className={`fixed inset-0 overflow-hidden ${isTense ? 'tense-vignette' : ''}`}>
      <SceneBackground backgroundId={currentNode.background} />
      <CharacterSprite characterId={currentNode.character} />
      <DialogueBox
        node={currentNode}
        onChoice={handleChoice}
        hasClue={hasClue}
        formatTime={formatTime}
        time={state.time}
        audio={audio}
      />
      <ClueNotification clues={state.clues} />
    </div>
  );
}
