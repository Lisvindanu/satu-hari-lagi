import React, { useCallback, useEffect, useRef, useState } from 'react';
import useGameState, { madnessLevel } from './hooks/useGameState';
import useAudio from './hooks/useAudio';
import useSpeedrun from './hooks/useSpeedrun';
import useSettings from './hooks/useSettings';
import dialogueData from './data/dialogue.json';
import LandingScreen from './components/LandingScreen';
import TitleScreen from './components/TitleScreen';
import PauseMenu from './components/PauseMenu';
import SettingsPanel from './components/SettingsPanel';
import Backlog from './components/Backlog';
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
import { register, login, loadSession, saveProgress, resetProgress, clearToken, saveRun, clearRun } from './utils/auth';

const DEATH_TIME = 15 * 60;
const TENSION_TIME = 14 * 60 + 30; // 14:30

export default function App() {
  const {
    state,
    goToNode,
    setCurrentLine,
    addClue,
    hasClue,
    resetLoop,
    startGame,
    setProgress,
    quitToTitle,
    triggerDeath,
    reachEnding,
    continueFromEnding,
    formatTime,
  } = useGameState();

  const audio = useAudio();
  const speedrun = useSpeedrun();
  const { settings, updateSetting } = useSettings();
  const prevBgRef = useRef(null);
  const prevClueCountRef = useRef(0);
  const prevPhaseRef = useRef('title');
  const prevAchievementsRef = useRef(new Set());
  const speedrunnerQueuedRef = useRef(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [endingElapsed, setEndingElapsed] = useState(null);
  const [achievementQueue, setAchievementQueue] = useState([]);
  const [user, setUser] = useState(null);
  const [entered, setEntered] = useState(false);
  const [paused, setPaused] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showBacklog, setShowBacklog] = useState(false);
  const [history, setHistory] = useState([]);
  const seenLinesRef = useRef(new Set());

  const currentNode = dialogueData[state.currentNodeId];

  const pushHistory = useCallback((entry) => {
    setHistory(prev => {
      const last = prev[prev.length - 1];
      if (last && last.text === entry.text && last.speaker === entry.speaker) return prev;
      const next = [...prev, entry];
      return next.length > 200 ? next.slice(next.length - 200) : next;
    });
  }, []);

  const isLineSeen = useCallback((key) => seenLinesRef.current.has(key), []);
  const markLineSeen = useCallback((key) => { seenLinesRef.current.add(key); }, []);

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

  // Heartbeat when time is running out — starts earlier as madness deepens
  useEffect(() => {
    const tensionStart = TENSION_TIME - madnessLevel(state.loopCount) * 15;
    if (state.phase === 'playing' && state.time >= tensionStart && state.time < DEATH_TIME) {
      const bpm = 80 + ((state.time - tensionStart) / (DEATH_TIME - tensionStart)) * 60;
      audio.startHeartbeat(bpm);
    } else {
      audio.stopHeartbeat();
    }
  }, [state.time, state.phase, state.loopCount, audio]);

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

  // Speedrun achievement (session-only, queue once)
  useEffect(() => {
    if (speedrunnerQueuedRef.current) return;
    if (endingElapsed !== null && endingElapsed > 0 && endingElapsed <= 5 * 60 * 1000) {
      const a = ACHIEVEMENTS.find(x => x.id === 'speedrunner');
      if (a) {
        speedrunnerQueuedRef.current = true;
        setAchievementQueue(q => [...q, a]);
      }
    }
  }, [endingElapsed]);

  const dismissAchievement = useCallback(() => {
    setAchievementQueue(q => q.slice(1));
  }, []);

  // Esc — close open overlays, else toggle pause while playing
  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== 'Escape') return;
      if (showSettings) { setShowSettings(false); return; }
      if (showBacklog) { setShowBacklog(false); return; }
      if (state.phase === 'playing') setPaused(p => !p);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [showSettings, showBacklog, state.phase]);

  // Auto-login from stored token on mount
  useEffect(() => {
    let cancelled = false;
    loadSession().then(session => {
      if (cancelled || !session) return;
      setUser({ username: session.username });
      setProgress({ ...session.progress, run: session.run });
    });
    return () => { cancelled = true; };
  }, [setProgress]);

  // Auto-save progress to account whenever it grows
  useEffect(() => {
    if (user && (state.endings.length || state.clues.length || state.loopCount)) {
      saveProgress({ clues: state.clues, endings: state.endings, loopCount: state.loopCount });
    }
  }, [state.endings, state.clues, state.loopCount, user]);

  // Save current-run position (debounced) so reload / another device can resume it
  useEffect(() => {
    if (!user || state.phase !== 'playing') return;
    const t = setTimeout(() => {
      saveRun({ nodeId: state.currentNodeId, line: state.currentLine, time: state.time });
    }, 800);
    return () => clearTimeout(t);
  }, [user, state.phase, state.currentNodeId, state.currentLine, state.time]);

  // Clear the saved run once a loop terminates (ending or death) — nothing to resume
  useEffect(() => {
    if (user && (state.phase === 'ending' || state.phase === 'dead')) {
      clearRun();
    }
  }, [user, state.phase]);

  const handleAuth = useCallback(async (mode, username, pin) => {
    const result = mode === 'register' ? await register(username, pin) : await login(username, pin);
    if (result.error) return result.error;
    setUser({ username: result.username });
    setProgress({ ...result.progress, run: result.run });
    return null;
  }, [setProgress]);

  const handleLogout = useCallback(() => {
    clearToken();
    setUser(null);
    setProgress({ clues: [], endings: [], loopCount: 0 });
  }, [setProgress]);

  // Reset progress. mode 'full' wipes the ending gallery too; 'soft' keeps it.
  const handleReset = useCallback(async (mode) => {
    let progress = { clues: [], endings: mode === 'full' ? [] : state.endings, loopCount: 0 };
    if (user) {
      // Hard-clear server first so the auto-save merge can't restore old progress
      const serverProgress = await resetProgress(mode);
      if (serverProgress) progress = serverProgress;
    }
    prevAchievementsRef.current = checkAchievements(progress);
    setProgress(progress);
  }, [user, state.endings, setProgress]);

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

  // Landing page (gate shown before the title menu)
  if (state.phase === 'title' && !entered) {
    return <LandingScreen onEnter={() => setEntered(true)} audio={audio} />;
  }

  // Title screen
  if (state.phase === 'title') {
    return (
      <>
        <TitleScreen
          onStart={() => { speedrun.start(); startGame(); }}
          loopCount={state.loopCount}
          audio={audio}
          onShowLeaderboard={() => setShowLeaderboard(true)}
          onShowGallery={() => setShowGallery(true)}
          onShowAchievements={() => setShowAchievements(true)}
          onShowSettings={() => setShowSettings(true)}
          hasEndings={state.endings.length > 0}
          achievementCount={unlockedAchievementIds.length}
          user={user}
          onAuth={handleAuth}
          onLogout={handleLogout}
          onReset={handleReset}
        />
        {showLeaderboard && <Leaderboard onClose={() => setShowLeaderboard(false)} />}
        {showGallery && <EndingGallery unlockedEndings={state.endings} onClose={() => setShowGallery(false)} />}
        {showAchievements && <AchievementGallery unlockedIds={unlockedAchievementIds} onClose={() => setShowAchievements(false)} />}
        {showSettings && (
          <SettingsPanel
            settings={settings}
            updateSetting={updateSetting}
            audio={audio}
            onClose={() => setShowSettings(false)}
          />
        )}
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
    return (
      <>
        <EndingScreen
          endingId={state.currentEnding}
          loopCount={state.loopCount}
          onRestart={() => { speedrun.start(); resetLoop(); }}
          onContinue={(nodeId, time) => { speedrun.start(); setEndingElapsed(null); continueFromEnding(nodeId, time); }}
          elapsedMs={endingElapsed}
          formatTime={speedrun.format}
          user={user}
          onShowLeaderboard={() => setShowLeaderboard(true)}
        />
        {showLeaderboard && (
          <Leaderboard
            endingId={state.currentEnding}
            onClose={() => setShowLeaderboard(false)}
          />
        )}
      </>
    );
  }

  // Playing phase
  if (!currentNode) return null;

  const isTense = state.time >= TENSION_TIME;
  const madness = madnessLevel(state.loopCount);

  return (
    <div className={`fixed inset-0 overflow-hidden ${isTense && !settings.reduceMotion ? 'tense-vignette' : ''}`}>
      <SceneBackground backgroundId={currentNode.background} madness={madness} />
      <CharacterSprite characterId={currentNode.character} />
      {madness >= 2 && !settings.reduceMotion && <div className={`madness-vignette m${madness}`} />}
      <DialogueBox
        node={currentNode}
        onChoice={handleChoice}
        onLineChange={setCurrentLine}
        startLine={state.currentLine}
        madness={madness}
        hasClue={hasClue}
        formatTime={formatTime}
        time={state.time}
        loopCount={state.loopCount}
        audio={audio}
        settings={settings}
        onHistory={pushHistory}
        isLineSeen={isLineSeen}
        markLineSeen={markLineSeen}
      />
      <ClueNotification clues={state.clues} />
      <AchievementNotification achievement={achievementQueue[0] || null} onDismiss={dismissAchievement} />
      <button
        onClick={() => { audio.playClick(); setPaused(true); }}
        className="fixed top-4 right-4 z-50 text-gray-400 hover:text-white text-xs tracking-[0.3em] uppercase bg-black/50 backdrop-blur-sm px-3 py-1 transition-colors cursor-pointer"
        aria-label="Jeda"
      >
        ❚❚
      </button>
      {paused && (
        <PauseMenu
          audio={audio}
          lang={settings.language}
          onResume={() => setPaused(false)}
          onSettings={() => setShowSettings(true)}
          onBacklog={() => setShowBacklog(true)}
          onQuit={() => { setPaused(false); speedrun.stop(); quitToTitle(); }}
        />
      )}
      {showSettings && (
        <SettingsPanel
          settings={settings}
          updateSetting={updateSetting}
          audio={audio}
          onClose={() => setShowSettings(false)}
        />
      )}
      {showBacklog && (
        <Backlog history={history} lang={settings.language} onClose={() => setShowBacklog(false)} />
      )}
    </div>
  );
}
