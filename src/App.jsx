import React, { useCallback, useEffect, useRef, useState } from 'react';
import useGameState from './hooks/useGameState';
import useAudio from './hooks/useAudio';
import useSpeedrun from './hooks/useSpeedrun';
import dialogueData from './data/dialogue.json';
import TitleScreen from './components/TitleScreen';
import DialogueBox from './components/DialogueBox';
import SceneBackground from './components/SceneBackground';
import CharacterSprite from './components/CharacterSprite';
import GlitchEffect from './components/GlitchEffect';
import DeathScreen from './components/DeathScreen';
import EndingScreen from './components/EndingScreen';
import ClueNotification from './components/ClueNotification';
import Leaderboard from './components/Leaderboard';
import EndingGallery from './components/EndingGallery';
import AchievementNotification from './components/AchievementNotification';
import AchievementGallery from './components/AchievementGallery';
import { ACHIEVEMENTS, checkAchievements } from './data/achievements';
import { encodeSave } from './utils/saveCode';

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
    loadSave,
    triggerDeath,
    reachEnding,
    continueFromEnding,
    formatTime,
  } = useGameState();

  const audio = useAudio();
  const speedrun = useSpeedrun();
  const prevBgRef = useRef(null);
  const prevClueCountRef = useRef(0);
  const prevPhaseRef = useRef('title');
  const prevAchievementsRef = useRef(new Set());
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [endingElapsed, setEndingElapsed] = useState(null);
  const [achievementQueue, setAchievementQueue] = useState([]);

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

  // Achievement tracking
  useEffect(() => {
    const current = checkAchievements({ endings: state.endings, clues: state.clues, loopCount: state.loopCount });
    const wasTitle = prevPhaseRef.current === 'title';
    const isNowActive = state.phase === 'playing' || state.phase === 'ending';

    if (wasTitle && isNowActive) {
      // Just transitioned from title (start/load) — init without notifying
      prevAchievementsRef.current = current;
    } else if (isNowActive) {
      const newOnes = [...current].filter(id => !prevAchievementsRef.current.has(id));
      if (newOnes.length > 0) {
        const toAdd = newOnes.map(id => ACHIEVEMENTS.find(a => a.id === id)).filter(Boolean);
        setAchievementQueue(q => [...q, ...toAdd]);
      }
      prevAchievementsRef.current = current;
    }

    prevPhaseRef.current = state.phase;
  }, [state.endings, state.clues, state.loopCount, state.phase]);

  // Speedrun achievement (session-only)
  useEffect(() => {
    if (endingElapsed !== null && endingElapsed <= 5 * 60 * 1000) {
      const a = ACHIEVEMENTS.find(x => x.id === 'speedrunner');
      if (a) setAchievementQueue(q => [...q, a]);
    }
  }, [endingElapsed]);

  const dismissAchievement = useCallback(() => {
    setAchievementQueue(q => q.slice(1));
  }, []);

  const handleChoice = useCallback((choice) => {
    audio.playChoiceSelect();

    if (choice.triggerDeath) {
      triggerDeath();
      return;
    }

    if (choice.ending) {
      const ms = speedrun.stop();
      setEndingElapsed(ms);
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

  const unlockedAchievementIds = [...checkAchievements({ endings: state.endings, clues: state.clues, loopCount: state.loopCount })];

  // Title screen
  if (state.phase === 'title') {
    return (
      <>
        <TitleScreen
          onStart={() => { speedrun.start(); startGame(); }}
          onLoadSave={(saved) => { speedrun.start(); loadSave(saved); }}
          loopCount={state.loopCount}
          audio={audio}
          onShowLeaderboard={() => setShowLeaderboard(true)}
          onShowGallery={() => setShowGallery(true)}
          onShowAchievements={() => setShowAchievements(true)}
          hasEndings={state.endings.length > 0}
          achievementCount={unlockedAchievementIds.length}
        />
        {showLeaderboard && <Leaderboard onClose={() => setShowLeaderboard(false)} />}
        {showGallery && <EndingGallery unlockedEndings={state.endings} onClose={() => setShowGallery(false)} />}
        {showAchievements && <AchievementGallery unlockedIds={unlockedAchievementIds} onClose={() => setShowAchievements(false)} />}
      </>
    );
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
    const saveCode = encodeSave({ clues: state.clues, endings: state.endings, loopCount: state.loopCount });
    return (
      <>
        <EndingScreen
          endingId={state.endings[state.endings.length - 1]}
          loopCount={state.loopCount}
          onRestart={() => { speedrun.start(); resetLoop(); }}
          onContinue={continueFromEnding}
          elapsedMs={endingElapsed}
          formatTime={speedrun.format}
          saveCode={saveCode}
          onShowLeaderboard={() => setShowLeaderboard(true)}
        />
        {showLeaderboard && (
          <Leaderboard
            endingId={state.endings[state.endings.length - 1]}
            onClose={() => setShowLeaderboard(false)}
          />
        )}
      </>
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
        loopCount={state.loopCount}
        audio={audio}
      />
      <ClueNotification clues={state.clues} />
      <AchievementNotification achievement={achievementQueue[0] || null} onDismiss={dismissAchievement} />
    </div>
  );
}
