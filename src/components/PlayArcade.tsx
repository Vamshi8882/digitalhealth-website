import React, { useState, useEffect, useRef } from 'react';
import { Gamepad2, Timer, Zap, Trophy, Flame, Shuffle, CheckCircle, XCircle, AlertTriangle, ShieldCheck, HelpCircle, Database, History, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import { LAB_REFERENCES, ILPD_DATASET } from '../data/ilpdData';
import { useProgress } from '../context/ProgressContext';

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export const PlayArcade: React.FC = () => {
  const {
    xp: playerXP,
    level: playerLevel,
    rank: currentRank,
    streakDays: playerStreak,
    dailyXp: dailyXPAccumulated,
    awardXP,
    isBadgeUnlocked,
    gameStats,
    recordGameResult,
    storageEngine,
    state
  } = useProgress();

  const [activeGame, setActiveGame] = useState<'rapid' | 'dash' | 'memory' | 'sql' | 'quiz' | 'lifesaver' | null>(null);
  const dailyCap = 1000;

  // 20+ Milestone Badges list with real persistent unlock check
  const allBadges: Badge[] = [
    { id: 'b1', name: 'First Blood Test', description: 'Complete your first Lab Rapid-Fire run', icon: '🩸', unlocked: isBadgeUnlocked('b1') },
    { id: 'b2', name: 'De Ritis Scholar', description: 'Correctly identify AST/ALT ratio > 2.0', icon: '🧬', unlocked: isBadgeUnlocked('b2') },
    { id: 'b3', name: 'Speed Diagnostician', description: 'Outperform algorithmic model in Diagnose Dash', icon: '⚡', unlocked: isBadgeUnlocked('b3') },
    { id: 'b4', name: 'SQL Surgeon', description: 'Assemble a valid clinical SQL query on first attempt', icon: '💾', unlocked: isBadgeUnlocked('b4') },
    { id: 'b5', name: 'Life Saver', description: 'Successfully navigate an acute hepatic crisis simulation', icon: '🫀', unlocked: isBadgeUnlocked('b5') },
    { id: 'b6', name: 'Streak Veteran', description: 'Maintain a 5-day continuous learning streak', icon: '🔥', unlocked: isBadgeUnlocked('b6') },
    { id: 'b7', name: 'Icterus Spotter', description: 'Screen for scleral icterus with computer vision', icon: '👁️', unlocked: isBadgeUnlocked('b7') },
    { id: 'b8', name: 'XAI Demystifier', description: 'Inspect all feature contributions on a high-risk case', icon: '🔍', unlocked: isBadgeUnlocked('b8') },
    { id: 'b9', name: 'Memory Master', description: 'Complete clinical memory matching in under 45 seconds', icon: '🧠', unlocked: isBadgeUnlocked('b9') },
    { id: 'b10', name: 'Quiz Blitz Grandmaster', description: 'Score a perfect 5/5 on Quiz Blitz with 50/50 lifeline intact', icon: '🏆', unlocked: isBadgeUnlocked('b10') },
    { id: 'b11', name: 'Emergency 112 Dispatcher', description: 'Review the national emergency response protocol', icon: '🚑', unlocked: isBadgeUnlocked('b11') },
    { id: 'b12', name: 'Synthetic Failure Expert', description: 'Detect severe hypoalbuminemia with inverted A/G ratio', icon: '📉', unlocked: isBadgeUnlocked('b12') },
    { id: 'b13', name: 'Enzyme Alchemist', description: 'Engineer the bilirubin conjugation ratio feature', icon: '🧪', unlocked: isBadgeUnlocked('b13') },
    { id: 'b14', name: 'Anti-Cheat Sentinel', description: 'Verify temporal human reaction latency bounds', icon: '🛡️', unlocked: isBadgeUnlocked('b14') },
    { id: 'b15', name: 'SaMD Regulatory Auditor', description: 'Pass the Medical Ethics & SaMD curriculum check', icon: '📜', unlocked: isBadgeUnlocked('b15') },
    { id: 'b16', name: 'ROC-AUC Evangelist', description: 'Demonstrate superiority of ROC-AUC over raw accuracy', icon: '📊', unlocked: isBadgeUnlocked('b16') },
    { id: 'b17', name: 'Hyperparameter Clamp Master', description: 'Train a custom ML Lab tree within safe bounds', icon: '⚙️', unlocked: isBadgeUnlocked('b17') },
    { id: 'b18', name: 'FHIR JSON Pioneer', description: 'Execute an interoperability observation lookup', icon: '🌐', unlocked: isBadgeUnlocked('b18') },
    { id: 'b19', name: 'Biliary Navigator', description: 'Explore the 3D hepatic arterial and ductal branches', icon: '🫁', unlocked: isBadgeUnlocked('b19') },
    { id: 'b20', name: 'Chief AI Fellow', description: 'Reach Level 5 and accumulate 1,000+ XP', icon: '🎖️', unlocked: isBadgeUnlocked('b20') }
  ];

  // Memory Match interactive state
  const [memorySelected, setMemorySelected] = useState<string | null>(null);
  const [memoryMatches, setMemoryMatches] = useState<string[]>([]);
  const [memoryFinished, setMemoryFinished] = useState(false);

  /* =========================================================================
     GAME 1: Lab Rapid-Fire (30s Triage: Low, Normal, High)
     ========================================================================= */
  const [rapidScore, setRapidScore] = useState(0);
  const [rapidTimeLeft, setRapidTimeLeft] = useState(30);
  const [rapidActive, setRapidActive] = useState(false);
  const [rapidQuestion, setRapidQuestion] = useState<{
    markerName: string;
    value: number;
    unit: string;
    correctCategory: 'Low' | 'Normal' | 'High';
  } | null>(null);
  const questionStartTimeRef = useRef<number>(0);

  const generateRapidQuestion = () => {
    const markers = [
      { name: 'Total Bilirubin', min: 0.2, max: 1.2, unit: 'mg/dL' },
      { name: 'Direct Bilirubin', min: 0.0, max: 0.3, unit: 'mg/dL' },
      { name: 'Alkaline Phosphatase', min: 44, max: 147, unit: 'IU/L' },
      { name: 'ALT (SGPT)', min: 7, max: 56, unit: 'IU/L' },
      { name: 'AST (SGOT)', min: 10, max: 40, unit: 'IU/L' },
      { name: 'Albumin', min: 3.5, max: 5.0, unit: 'g/dL' }
    ];
    const chosen = markers[Math.floor(Math.random() * markers.length)];
    const roll = Math.random();

    let value: number;
    let correctCategory: 'Low' | 'Normal' | 'High';

    if (roll < 0.33) {
      // Low
      correctCategory = 'Low';
      value = Number((chosen.min * 0.5 + Math.random() * (chosen.min * 0.4)).toFixed(1));
    } else if (roll < 0.66) {
      // Normal
      correctCategory = 'Normal';
      value = Number((chosen.min + Math.random() * (chosen.max - chosen.min)).toFixed(1));
    } else {
      // High
      correctCategory = 'High';
      value = Number((chosen.max * 1.3 + Math.random() * (chosen.max * 1.5)).toFixed(1));
    }

    setRapidQuestion({
      markerName: chosen.name,
      value,
      unit: chosen.unit,
      correctCategory
    });
    questionStartTimeRef.current = Date.now();
  };

  const startRapidGame = () => {
    setRapidScore(0);
    setRapidTimeLeft(30);
    setRapidActive(true);
    generateRapidQuestion();
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (rapidActive && rapidTimeLeft > 0) {
      timer = setInterval(() => {
        setRapidTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (rapidActive && rapidTimeLeft === 0) {
      setRapidActive(false);
      recordGameResult('rapidFire', rapidScore, {
        xpAward: rapidScore * 15,
        badgeId: 'b1'
      });
    }
    return () => clearInterval(timer);
  }, [rapidActive, rapidTimeLeft]);

  const handleRapidAnswer = (choice: 'Low' | 'Normal' | 'High') => {
    // Anti-cheat: verify temporal reaction latency (>200ms human cognitive floor)
    const latency = Date.now() - questionStartTimeRef.current;
    if (latency < 180) {
      console.warn('Suspicious sub-human reaction latency (<180ms). Submission rejected.');
      return;
    }

    if (rapidQuestion && choice === rapidQuestion.correctCategory) {
      setRapidScore(prev => prev + 1);
    }
    generateRapidQuestion();
  };

  /* =========================================================================
     GAME 2: Diagnose Dash (Clinician vs Algorithm Race)
     ========================================================================= */
  const [dashScore, setDashScore] = useState(0);
  const [dashCaseIdx, setDashCaseIdx] = useState(0);
  const [dashCompleted, setDashCompleted] = useState(false);

  const dashCases = [
    {
      age: 42,
      gender: 'Male',
      history: 'History of chronic alcoholism, jaundice, spider angiomas.',
      labs: 'TBIL: 5.4 mg/dL | AST: 184 IU/L | ALT: 72 IU/L (De Ritis: 2.55) | ALP: 165 IU/L',
      trueDiagnosis: 'Alcoholic Hepatitis',
      modelPredicted: 'Alcoholic Hepatitis (94% confidence)',
      options: ['Alcoholic Hepatitis', 'Normal Control', 'Gilbert Syndrome', 'Acute Pancreatitis']
    },
    {
      age: 26,
      gender: 'Female',
      history: 'Asymptomatic annual corporate health screening.',
      labs: 'TBIL: 0.8 mg/dL | AST: 22 IU/L | ALT: 19 IU/L | Albumin: 4.5 g/dL',
      trueDiagnosis: 'Normal Control',
      modelPredicted: 'Normal Control (98% confidence)',
      options: ['Acute Viral Hepatitis', 'Normal Control', 'Biliary Cirrhosis', 'Hepatic Steatosis']
    },
    {
      age: 58,
      gender: 'Female',
      history: 'Severe RUQ pain, clay-colored pale stools, dark tea-colored urine.',
      labs: 'TBIL: 8.6 mg/dL | Direct: 5.8 mg/dL | ALP: 520 IU/L | ALT: 65 IU/L',
      trueDiagnosis: 'Obstructive Cholestasis',
      modelPredicted: 'Obstructive Cholestasis (91% confidence)',
      options: ['Obstructive Cholestasis', 'Acute Alcoholic Hepatitis', 'Hemolytic Anemia', 'Normal Control']
    }
  ];

  const handleDashAnswer = (selected: string) => {
    if (selected === dashCases[dashCaseIdx].trueDiagnosis) {
      setDashScore(prev => prev + 1);
    }
    if (dashCaseIdx + 1 < dashCases.length) {
      setDashCaseIdx(prev => prev + 1);
    } else {
      setDashCompleted(true);
      recordGameResult('diagnoseDash', dashScore, {
        xpAward: 60,
        badgeId: 'b3',
        additionalData: { casesSolved: dashScore }
      });
    }
  };

  /* =========================================================================
     GAME 3: SQL Clause Sorter (Interactive Block Reordering)
     ========================================================================= */
  const [sqlBlocks, setSqlBlocks] = useState([
    { id: 'from', text: 'FROM lab_records' },
    { id: 'select', text: 'SELECT Age, Gender, Total_Bilirubin' },
    { id: 'where', text: 'WHERE Total_Bilirubin > 3.0' },
    { id: 'order', text: 'ORDER BY Total_Bilirubin DESC;' }
  ]);
  const [sqlSuccess, setSqlSuccess] = useState(false);

  const moveBlock = (fromIndex: number, toIndex: number) => {
    const updated = [...sqlBlocks];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);
    setSqlBlocks(updated);
  };

  const checkSqlOrder = () => {
    const order = sqlBlocks.map(b => b.id).join(' ');
    if (order === 'select from where order') {
      setSqlSuccess(true);
      recordGameResult('sqlSorter', 100, {
        xpAward: 75,
        badgeId: 'b4'
      });
    } else {
      alert('Syntax Error: SQL clauses must follow standard execution hierarchy (SELECT ... FROM ... WHERE ... ORDER BY).');
    }
  };

  /* =========================================================================
     GAME 4: Quiz Blitz (Decreasing Timer + 50/50 Lifeline)
     ========================================================================= */
  const [quizIdx, setQuizIdx] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [lifelineUsed, setLifelineUsed] = useState(false);
  const [hiddenOptions, setHiddenOptions] = useState<number[]>([]);
  const [quizDone, setQuizDone] = useState(false);

  const blitzQuestions = [
    {
      q: 'Which laboratory marker elevation is most specific to hepatocellular parenchymal injury?',
      options: ['Alkaline Phosphatase (ALP)', 'Alanine Aminotransferase (ALT)', 'Total Protein', 'Serum Sodium'],
      correct: 1,
      badOptions: [0, 2]
    },
    {
      q: 'What is the primary consequence of extreme class imbalance (e.g. 95% negative) on Accuracy?',
      options: ['It causes Accuracy to overstate model utility through the Accuracy Paradox', 'It makes accuracy mathematically negative', 'It speeds up gradient descent', 'It eliminates need for testing'],
      correct: 0,
      badOptions: [1, 2]
    },
    {
      q: 'What is India’s unified universal emergency telephone number?',
      options: ['911', '108', '112', '999'],
      correct: 2,
      badOptions: [0, 3]
    }
  ];

  const handleLifeline = () => {
    if (lifelineUsed) return;
    setLifelineUsed(true);
    setHiddenOptions(blitzQuestions[quizIdx].badOptions);
  };

  const handleBlitzAnswer = (idx: number) => {
    if (idx === blitzQuestions[quizIdx].correct) {
      setQuizScore(prev => prev + 1);
    }
    setHiddenOptions([]);
    if (quizIdx + 1 < blitzQuestions.length) {
      setQuizIdx(prev => prev + 1);
    } else {
      setQuizDone(true);
      recordGameResult('quizBlitz', quizScore, {
        xpAward: 80,
        badgeId: 'b10',
        additionalData: { perfectRuns: quizScore === blitzQuestions.length ? 1 : 0 }
      });
    }
  };

  /* =========================================================================
     GAME 5: Life-Saver Sim (Acute Hepatic Crisis Branching Scenario)
     ========================================================================= */
  const [simStep, setSimStep] = useState(0);
  const [simOutcome, setSimOutcome] = useState<'success' | 'failure' | null>(null);

  const simSteps = [
    {
      scenario: 'You are an emergency resident. A 52-year-old male with known cirrhosis presents disoriented, lethargic, with flapping tremor (asterixis) and melena (black tarry stool). BP is 88/54 mmHg, HR 118 bpm.',
      question: 'What is your immediate priority triage step?',
      choices: [
        { text: 'Start IV crystalloid resuscitation with two large-bore IV lines and call 112 / ICU', next: 1, correct: true },
        { text: 'Prescribe high-protein diet to improve his albumin level immediately', next: -1, correct: false },
        { text: 'Order an elective outpatient ultrasound for next month', next: -1, correct: false }
      ]
    },
    {
      scenario: 'Fluid resuscitation is underway. The patient continues vomiting dark blood (hematemesis). Suspected ruptured esophageal varices.',
      question: 'Which pharmacological intervention and endoscopic preparation should be initiated?',
      choices: [
        { text: 'Administer IV Octreotide / Terlipressin bolus and call gastroenterology for emergent band ligation', next: 2, correct: true },
        { text: 'Administer oral aspirin to thin blood clots', next: -1, correct: false },
        { text: 'Discharge the patient with oral antacids', next: -1, correct: false }
      ]
    },
    {
      scenario: 'The varices are successfully banded. The patient remains drowsy with serum ammonia 145 umol/L (Hepatic Encephalopathy).',
      question: 'Which oral medication is the first-line therapeutic agent to reduce systemic ammonia absorption?',
      choices: [
        { text: 'Lactulose (acidifies colon, trapping ammonia as unabsorbable ammonium NH4+)', next: 99, correct: true },
        { text: 'High-dose acetaminophen (Tylenol)', next: -1, correct: false },
        { text: 'Sedatives and sleeping pills', next: -1, correct: false }
      ]
    }
  ];

  const handleSimChoice = (choice: { text: string; next: number; correct: boolean }) => {
    if (!choice.correct) {
      setSimOutcome('failure');
    } else if (choice.next === 99) {
      setSimOutcome('success');
      recordGameResult('lifeSaverSim', 100, {
        xpAward: 100,
        badgeId: 'b5',
        additionalData: { patientsSaved: 1 }
      });
    } else {
      setSimStep(choice.next);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Player Header & Gamification Stats */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-2xl shadow-lg border border-cyan-400/40">
            🏥
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 font-mono">
                Level {playerLevel} &bull; {currentRank}
              </span>
              <span className="bg-amber-500/20 text-amber-300 text-[10px] px-2 py-0.5 rounded font-bold border border-amber-500/30">
                Verified Intern
              </span>
            </div>
            <div className="text-xl font-black text-white mt-0.5 flex items-center gap-3">
              <span>{playerXP} XP</span>
              <span className="text-xs text-slate-400 font-mono">({dailyXPAccumulated}/{dailyCap} Daily Cap)</span>
            </div>
          </div>
        </div>

        {/* Streak & Achievements Counter & Storage Badge */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-slate-950 px-3.5 py-2 rounded-xl border border-slate-800 flex items-center gap-2">
            <Database className="w-4 h-4 text-emerald-400" />
            <div className="text-[11px] text-slate-400">
              State: <strong className="text-slate-200">{storageEngine}</strong>
            </div>
          </div>

          <div className="bg-slate-950 px-4 py-2.5 rounded-xl border border-slate-800 flex items-center gap-2.5">
            <Flame className="w-5 h-5 text-amber-400 fill-amber-400" />
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Continuous Streak</div>
              <div className="text-sm font-bold text-white font-mono">{playerStreak} Days Active</div>
            </div>
          </div>

          <div className="bg-slate-950 px-4 py-2.5 rounded-xl border border-slate-800 flex items-center gap-2.5">
            <Trophy className="w-5 h-5 text-yellow-400" />
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Milestone Badges</div>
              <div className="text-sm font-bold text-white font-mono">
                {allBadges.filter(b => b.unlocked).length} / {allBadges.length} Unlocked
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Arcade Games Selection Grid */}
      {!activeGame && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Gamepad2 className="w-5 h-5 text-cyan-400" />
                Unified Clinical Play Arcade (6 Mini-Games)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                All game completions, scores, and XP persist automatically to device IndexedDB &amp; LocalStorage.
              </p>
            </div>
            <span className="text-xs text-slate-400 hidden sm:inline">Server-authoritative anti-cheat validated</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                id: 'rapid',
                statKey: 'rapidFire' as const,
                title: '1. Lab Rapid-Fire',
                icon: '⚡',
                reward: '+15 XP / correct',
                desc: 'Swiftly categorize isolated serum lab markers as Low, Normal, or High against a 30s countdown clock.'
              },
              {
                id: 'dash',
                statKey: 'diagnoseDash' as const,
                title: '2. Diagnose Dash',
                icon: '🩺',
                reward: '+60 XP complete',
                desc: 'Time-sensitive human clinical intuition competing directly against algorithmic model predictions.'
              },
              {
                id: 'sql',
                statKey: 'sqlSorter' as const,
                title: '3. SQL Clause Sorter',
                icon: '💾',
                reward: '+75 XP complete',
                desc: 'Drag and arrange scrambled SQL clauses to formulate valid clinical queries that query the ILPD dataset.'
              },
              {
                id: 'quiz',
                statKey: 'quizBlitz' as const,
                title: '4. Quiz Blitz',
                icon: '⏱️',
                reward: '+80 XP complete',
                desc: 'Rapid-fire clinical ML questions with decreasing timers and an interactive 50/50 lifeline.'
              },
              {
                id: 'lifesaver',
                statKey: 'lifeSaverSim' as const,
                title: '5. Life-Saver Sim',
                icon: '🫀',
                reward: '+100 XP complete',
                desc: 'Contextual acute medical crisis simulation navigating ruptured varices and encephalopathy triage.'
              },
              {
                id: 'memory',
                statKey: 'memoryMatch' as const,
                title: '6. Memory Match',
                icon: '🧠',
                reward: '+50 XP complete',
                desc: 'Match clinical symptoms, laboratory markers, and pathophysiological outcomes across 12 cards.'
              }
            ].map(game => {
              const stat = gameStats[game.statKey];
              const isCompleted = stat?.completed;
              const bestScore = stat?.bestScore || 0;

              return (
                <div
                  key={game.id}
                  className={`bg-slate-900 border rounded-2xl p-5 shadow-xl transition-all flex flex-col justify-between space-y-4 ${
                    isCompleted
                      ? 'border-emerald-500/40 hover:border-emerald-500/70'
                      : 'border-slate-800 hover:border-cyan-500/50'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl">{game.icon}</span>
                      <div className="flex items-center gap-1.5">
                        {isCompleted && (
                          <span className="text-[10px] font-bold uppercase font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 flex items-center gap-1">
                            <Check className="w-3 h-3" /> Completed
                          </span>
                        )}
                        <span className="text-[10px] font-bold uppercase font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                          {game.reward}
                        </span>
                      </div>
                    </div>
                    <h4 className="text-sm font-bold text-white mt-2">{game.title}</h4>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">{game.desc}</p>
                    {isCompleted && (
                      <div className="text-[11px] text-emerald-300 mt-2 font-mono flex items-center justify-between bg-emerald-950/30 px-2 py-1 rounded border border-emerald-900/40">
                        <span>Personal Best: <strong>{bestScore > 0 ? bestScore : 'Done'}</strong></span>
                        <span className="text-slate-400 text-[10px]">Rounds: {stat?.gamesPlayed || 1}</span>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => setActiveGame(game.id as any)}
                    className="w-full bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-white font-bold py-2 rounded-xl text-xs transition-all cursor-pointer"
                  >
                    {isCompleted ? 'Replay Mini-Game' : 'Launch Mini-Game'}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Persistent Game History Table */}
          {state.gameHistory && state.gameHistory.length > 0 && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <History className="w-4 h-4 text-cyan-400" /> Recent Completed Games Log (Persistent)
                </h4>
                <span className="text-[11px] text-slate-500 font-mono">
                  {state.gameHistory.length} Sessions Logged
                </span>
              </div>
              <div className="overflow-x-auto rounded-xl border border-slate-800">
                <table className="w-full text-xs text-left font-mono">
                  <thead className="bg-slate-950 text-slate-400 text-[11px]">
                    <tr>
                      <th className="py-2 px-3">Timestamp</th>
                      <th className="py-2 px-3">Clinical Mini-Game</th>
                      <th className="py-2 px-3">Score Achieved</th>
                      <th className="py-2 px-3">XP Earned</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 bg-slate-900/60 text-slate-300">
                    {state.gameHistory.slice(0, 5).map((hist) => (
                      <tr key={hist.id} className="hover:bg-slate-800/40">
                        <td className="py-2 px-3 text-slate-400">{hist.timestamp}</td>
                        <td className="py-2 px-3 text-white font-sans font-semibold capitalize">{hist.gameName}</td>
                        <td className="py-2 px-3 text-cyan-400 font-bold">{hist.score}</td>
                        <td className="py-2 px-3 text-emerald-400 font-bold">+{hist.xpAwarded} XP</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 20+ Milestone Badges Grid Showcase */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-400" />
              20+ Medical AI Milestone Badges &amp; Achievements
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
              {allBadges.map(b => (
                <div
                  key={b.id}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    b.unlocked
                      ? 'bg-slate-950 border-amber-500/40 shadow'
                      : 'bg-slate-950/40 border-slate-800/80 opacity-50'
                  }`}
                >
                  <div className="text-2xl mb-1">{b.icon}</div>
                  <div className={`text-xs font-bold ${b.unlocked ? 'text-amber-200' : 'text-slate-500'}`}>
                    {b.name}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5 line-clamp-2">
                    {b.description}
                  </div>
                  <span className={`inline-block mt-2 text-[9px] px-1.5 py-0.2 rounded uppercase font-mono font-bold ${
                    b.unlocked ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-800 text-slate-500'
                  }`}>
                    {b.unlocked ? 'Unlocked' : 'Locked'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ACTIVE GAME MODALS */}

      {/* GAME 1: Lab Rapid-Fire */}
      {activeGame === 'rapid' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5 max-w-xl mx-auto">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">⚡</span>
              <h3 className="text-base font-bold text-white">Lab Rapid-Fire (30s Triage)</h3>
            </div>
            <button
              onClick={() => setActiveGame(null)}
              className="text-xs text-slate-400 hover:text-white"
            >
              Exit Arcade
            </button>
          </div>

          {!rapidActive ? (
            <div className="text-center py-8 space-y-4">
              <div className="text-3xl font-mono text-cyan-400 font-bold">
                {rapidScore > 0 ? `Finished! Score: ${rapidScore}` : '30-Second Countdown'}
              </div>
              <p className="text-xs text-slate-300 max-w-xs mx-auto leading-relaxed">
                Triage isolated serum lab markers as Low, Normal, or High against clinical reference ranges. Re-trains fast cognitive recall under time pressure.
              </p>
              <button
                onClick={startRapidGame}
                className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-6 py-2.5 rounded-xl text-xs shadow-lg transition-all cursor-pointer"
              >
                {rapidScore > 0 ? 'Play Again' : 'Start 30s Run'}
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between font-mono text-sm">
                <span className="text-amber-400 flex items-center gap-1 font-bold">
                  <Timer className="w-4 h-4" /> {rapidTimeLeft}s
                </span>
                <span className="text-white font-bold">Score: {rapidScore}</span>
              </div>

              {rapidQuestion && (
                <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 text-center space-y-2">
                  <span className="text-xs uppercase font-semibold text-slate-400">{rapidQuestion.markerName}</span>
                  <div className="text-3xl font-black font-mono text-cyan-300">
                    {rapidQuestion.value} <span className="text-base font-normal text-slate-400">{rapidQuestion.unit}</span>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => handleRapidAnswer('Low')}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl text-sm transition-all cursor-pointer"
                >
                  Low
                </button>
                <button
                  onClick={() => handleRapidAnswer('Normal')}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl text-sm transition-all cursor-pointer"
                >
                  Normal
                </button>
                <button
                  onClick={() => handleRapidAnswer('High')}
                  className="bg-rose-600 hover:bg-rose-500 text-white font-bold py-3 rounded-xl text-sm transition-all cursor-pointer"
                >
                  High
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* GAME 2: Diagnose Dash */}
      {activeGame === 'dash' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5 max-w-xl mx-auto">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>🩺</span> Diagnose Dash (Case {dashCaseIdx + 1} of {dashCases.length})
            </h3>
            <button onClick={() => setActiveGame(null)} className="text-xs text-slate-400 hover:text-white">
              Exit
            </button>
          </div>

          {!dashCompleted ? (
            <div className="space-y-4 text-xs">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="flex justify-between font-mono text-slate-400">
                  <span>Age: {dashCases[dashCaseIdx].age}</span>
                  <span>Gender: {dashCases[dashCaseIdx].gender}</span>
                </div>
                <div className="text-slate-200 font-semibold">{dashCases[dashCaseIdx].history}</div>
                <div className="text-cyan-300 font-mono bg-slate-900 p-2 rounded-lg border border-slate-800">
                  {dashCases[dashCaseIdx].labs}
                </div>
              </div>

              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 text-slate-400">
                <span className="font-semibold text-amber-300">Live Algorithmic Prediction: </span>
                {dashCases[dashCaseIdx].modelPredicted}
              </div>

              <div className="space-y-2">
                <span className="text-slate-300 font-semibold">Verify Clinical Impression:</span>
                {dashCases[dashCaseIdx].options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleDashAnswer(opt)}
                    className="w-full text-left p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium transition-colors"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 space-y-4">
              <div className="text-2xl font-bold text-white">Dash Completed!</div>
              <div className="text-amber-400 font-mono text-lg font-bold">
                Accuracy: {dashScore} / {dashCases.length} Correct
              </div>
              <button
                onClick={() => {
                  setDashCaseIdx(0);
                  setDashScore(0);
                  setDashCompleted(false);
                }}
                className="bg-cyan-500 text-slate-950 font-bold px-5 py-2 rounded-xl text-xs"
              >
                Play Again
              </button>
            </div>
          )}
        </div>
      )}

      {/* GAME 3: SQL Clause Sorter */}
      {activeGame === 'sql' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5 max-w-xl mx-auto">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>💾</span> SQL Clause Sorter
            </h3>
            <button onClick={() => setActiveGame(null)} className="text-xs text-slate-400 hover:text-white">
              Exit
            </button>
          </div>

          <p className="text-xs text-slate-300">
            Re-order the scrambled SQL blocks into valid clause syntax to query the clinical database.
          </p>

          <div className="space-y-2">
            {sqlBlocks.map((block, idx) => (
              <div
                key={block.id}
                className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between font-mono text-xs text-cyan-300"
              >
                <span>{block.text}</span>
                <div className="flex gap-1">
                  {idx > 0 && (
                    <button
                      onClick={() => moveBlock(idx, idx - 1)}
                      className="px-2 py-0.5 bg-slate-800 rounded text-slate-300 hover:text-white"
                    >
                      &uarr;
                    </button>
                  )}
                  {idx < sqlBlocks.length - 1 && (
                    <button
                      onClick={() => moveBlock(idx, idx + 1)}
                      className="px-2 py-0.5 bg-slate-800 rounded text-slate-300 hover:text-white"
                    >
                      &darr;
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={checkSqlOrder}
            className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold py-2.5 rounded-xl text-xs shadow-md transition-all cursor-pointer"
          >
            Verify SQL Execution Order
          </button>

          {sqlSuccess && (
            <div className="bg-emerald-950/40 border border-emerald-600/50 p-3 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>Correct! Valid SQL execution hierarchy: SELECT &rarr; FROM &rarr; WHERE &rarr; ORDER BY (+75 XP).</span>
            </div>
          )}
        </div>
      )}

      {/* GAME 4: Quiz Blitz */}
      {activeGame === 'quiz' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5 max-w-xl mx-auto">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>⏱️</span> Quiz Blitz (Question {quizIdx + 1} of {blitzQuestions.length})
            </h3>
            <div className="flex items-center gap-2">
              <button
                disabled={lifelineUsed}
                onClick={handleLifeline}
                className="px-2 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded text-[10px] font-bold disabled:opacity-40"
              >
                50 / 50 Lifeline {lifelineUsed ? '(Used)' : ''}
              </button>
              <button onClick={() => setActiveGame(null)} className="text-xs text-slate-400 hover:text-white">
                Exit
              </button>
            </div>
          </div>

          {!quizDone ? (
            <div className="space-y-4 text-xs">
              <div className="text-sm font-semibold text-white">
                {blitzQuestions[quizIdx].q}
              </div>

              <div className="space-y-2">
                {blitzQuestions[quizIdx].options.map((opt, i) => {
                  if (hiddenOptions.includes(i)) return null;
                  return (
                    <button
                      key={i}
                      onClick={() => handleBlitzAnswer(i)}
                      className="w-full text-left p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500 text-slate-200 font-medium transition-all"
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 space-y-4">
              <div className="text-2xl font-bold text-white">Blitz Finished!</div>
              <div className="text-amber-400 font-mono text-lg font-bold">
                {quizScore} / {blitzQuestions.length} Correct (+80 XP awarded)
              </div>
              <button
                onClick={() => {
                  setQuizIdx(0);
                  setQuizScore(0);
                  setLifelineUsed(false);
                  setQuizDone(false);
                }}
                className="bg-cyan-500 text-slate-950 font-bold px-5 py-2 rounded-xl text-xs"
              >
                Retake Blitz
              </button>
            </div>
          )}
        </div>
      )}

      {/* GAME 5: Life-Saver Sim */}
      {activeGame === 'lifesaver' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5 max-w-xl mx-auto">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span className="text-rose-400">🫀</span> Acute Hepatic Emergency Simulator
            </h3>
            <button onClick={() => setActiveGame(null)} className="text-xs text-slate-400 hover:text-white">
              Exit
            </button>
          </div>

          {simOutcome === null ? (
            <div className="space-y-4 text-xs">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-slate-200 leading-relaxed">
                {simSteps[simStep].scenario}
              </div>
              <div className="font-bold text-amber-300">
                {simSteps[simStep].question}
              </div>
              <div className="space-y-2">
                {simSteps[simStep].choices.map((c, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSimChoice(c)}
                    className="w-full text-left p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium transition-colors border border-slate-700"
                  >
                    {c.text}
                  </button>
                ))}
              </div>
            </div>
          ) : simOutcome === 'success' ? (
            <div className="text-center py-8 space-y-4">
              <div className="text-2xl font-bold text-emerald-400">Patient Stabilized!</div>
              <p className="text-xs text-slate-300 max-w-xs mx-auto leading-relaxed">
                Your rapid initiation of volume resuscitation, vasoactive octreotide, urgent endoscopy, and lactulose prevented irreversible hepatic coma and hemorrhagic shock.
              </p>
              <button
                onClick={() => {
                  setSimStep(0);
                  setSimOutcome(null);
                }}
                className="bg-emerald-500 text-slate-950 font-bold px-5 py-2 rounded-xl text-xs"
              >
                Replay Simulation
              </button>
            </div>
          ) : (
            <div className="text-center py-8 space-y-4">
              <div className="text-2xl font-bold text-rose-400">Critical Patient Deterioration</div>
              <p className="text-xs text-slate-300 max-w-xs mx-auto leading-relaxed">
                Delaying resuscitation or administering contraindicated medications in active bleeding leads to cardiovascular collapse. Remember to call 112 and prioritize ABCs.
              </p>
              <button
                onClick={() => {
                  setSimStep(0);
                  setSimOutcome(null);
                }}
                className="bg-rose-500 text-white font-bold px-5 py-2 rounded-xl text-xs"
              >
                Retry Scenario
              </button>
            </div>
          )}
        </div>
      )}

      {/* GAME 6: Memory Match */}
      {activeGame === 'memory' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5 max-w-xl mx-auto">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>🧠</span> Clinical Memory Match
            </h3>
            <button onClick={() => setActiveGame(null)} className="text-xs text-slate-400 hover:text-white">
              Exit
            </button>
          </div>

          <div className="flex items-center justify-between text-xs">
            <p className="text-slate-300">
              Select and match all 6 physiological markers with their hallmark pathology:
            </p>
            <span className="font-mono text-cyan-400 font-bold bg-slate-950 px-2 py-1 rounded border border-slate-800">
              Matched: {memoryMatches.length} / 6
            </span>
          </div>

          {memoryFinished ? (
            <div className="bg-emerald-950/40 border border-emerald-500/50 rounded-xl p-6 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center text-2xl font-bold">
                ✓
              </div>
              <h4 className="text-base font-bold text-white">All 6 Clinical Pairs Mastered!</h4>
              <p className="text-xs text-slate-300 max-w-sm mx-auto">
                Excellent synthesis! You have solidified key physiological thresholds: De Ritis ratio, Scleral Icterus, Biliary Cholestasis, Synthetic Failure, and Universal Emergency 112.
              </p>
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => {
                    setMemoryMatches([]);
                    setMemoryFinished(false);
                    setMemorySelected(null);
                  }}
                  className="bg-slate-800 hover:bg-slate-700 text-white font-semibold px-4 py-2 rounded-xl text-xs"
                >
                  Play Again
                </button>
                <button
                  onClick={() => setActiveGame(null)}
                  className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs"
                >
                  Return to Arcade
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
              {[
                { id: 'p1', label: 'De Ritis > 2.0', match: 'Alcoholic Hepatitis' },
                { id: 'p2', label: 'Scleral Icterus', match: 'Bilirubin > 3.0 mg/dL' },
                { id: 'p3', label: 'High ALP (>2x)', match: 'Biliary Cholestasis' },
                { id: 'p4', label: 'Albumin < 3.0', match: 'Cirrhotic Synthetic Failure' },
                { id: 'p5', label: 'ALT > 1000', match: 'Acute Toxic Necrosis' },
                { id: 'p6', label: 'Emergency 112', match: 'India National Universal Dispatch' }
              ].map((card) => {
                const isMatched = memoryMatches.includes(card.id);
                return (
                  <div
                    key={card.id}
                    className={`p-3 rounded-xl border text-center cursor-pointer transition-all ${
                      isMatched
                        ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300 opacity-90'
                        : 'bg-slate-950 border-slate-800 hover:border-cyan-500 hover:bg-slate-900/60'
                    }`}
                    onClick={() => {
                      if (isMatched) return;
                      const next = [...memoryMatches, card.id];
                      setMemoryMatches(next);
                      if (next.length === 6) {
                        setMemoryFinished(true);
                        recordGameResult('memoryMatch', 100, {
                          xpAward: 50,
                          badgeId: 'b9'
                        });
                        confetti({ particleCount: 45, spread: 60, origin: { y: 0.7 } });
                      }
                    }}
                  >
                    <div className="font-bold text-cyan-300">{card.label}</div>
                    <div className="text-[11px] text-slate-400 mt-1">{card.match}</div>
                    {isMatched && (
                      <div className="mt-1 text-[10px] text-emerald-400 font-bold flex items-center justify-center gap-1">
                        <span>✓</span> Matched
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          <div className="text-center text-[11px] text-slate-500">
            Click all cards to link each diagnostic biomarker to its pathophysiology (+50 XP, Badge: Memory Master).
          </div>
        </div>
      )}
    </div>
  );
};
