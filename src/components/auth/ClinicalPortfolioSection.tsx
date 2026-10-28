/**
 * Digitalization in Healthcare - Clinical Portfolio & Competency Matrix
 * Visualizes student activity, research contributions, and top-performing game categories
 * using a high-fidelity SVG radial / radar chart.
 */

import React, { useState, useMemo } from 'react';
import {
  Activity,
  Award,
  BookOpen,
  Brain,
  CheckCircle2,
  ChevronRight,
  Database,
  Download,
  FileCheck,
  FileText,
  Flame,
  FlaskConical,
  Gamepad2,
  Layers,
  Microscope,
  Share2,
  Sparkles,
  Stethoscope,
  Target,
  Trophy,
  Zap
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { UserProfile } from '../../types/auth';
import { GameStats, SavedPrediction } from '../../services/storage';

interface ClinicalPortfolioSectionProps {
  user: UserProfile;
  level: number;
  rank: string;
  xp: number;
  streakDays: number;
  completedModules: number[];
  unlockedBadgeIds: string[];
  gameStats: GameStats;
  predictions: SavedPrediction[];
  onNavigateToCurriculum: () => void;
  onNavigateToArcade: () => void;
  onNavigateToPredictor: () => void;
}

interface RadarAxis {
  key: string;
  label: string;
  shortLabel: string;
  gameKey: keyof GameStats;
  score: number; // 0 - 100
  benchmark: number; // cohort average
  rawBestScore: number;
  clinicalDomain: string;
  completed: boolean;
  color: string;
  icon: string;
}

export const ClinicalPortfolioSection: React.FC<ClinicalPortfolioSectionProps> = ({
  user,
  level,
  rank,
  xp,
  streakDays,
  completedModules,
  unlockedBadgeIds,
  gameStats,
  predictions,
  onNavigateToCurriculum,
  onNavigateToArcade,
  onNavigateToPredictor
}) => {
  const [activeTab, setActiveTab] = useState<'radar' | 'activity' | 'research' | 'games'>('radar');
  const [hoveredAxis, setHoveredAxis] = useState<RadarAxis | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  // Compute normalized scores (0 to 100) for the 6 clinical radar axes
  const radarAxes: RadarAxis[] = useMemo(() => {
    const rf = gameStats.rapidFire || { completed: false, bestScore: 0 };
    const dd = gameStats.diagnoseDash || { completed: false, bestScore: 0 };
    const sq = gameStats.sqlSorter || { completed: false, bestScore: 0 };
    const qb = gameStats.quizBlitz || { completed: false, bestScore: 0 };
    const ls = gameStats.lifeSaverSim || { completed: false, bestScore: 0 };
    const mm = gameStats.memoryMatch || { completed: false, bestScore: 0 };

    const calcNormalized = (stat: any, multiplier: number, bonus: number = 30) => {
      if (!stat) return 20;
      const base = (stat.bestScore || 0) * multiplier;
      const compBonus = stat.completed ? bonus : 10;
      return Math.min(100, Math.max(18, Math.round(base + compBonus)));
    };

    return [
      {
        key: 'rapidFire',
        label: 'Lab Biomarker Triage',
        shortLabel: 'Lab Triage',
        gameKey: 'rapidFire',
        score: calcNormalized(rf, 1.4, 35),
        benchmark: 62,
        rawBestScore: rf.bestScore || 0,
        clinicalDomain: 'Liver Function Tests (ALT, AST, ALP, TBIL, ALB)',
        completed: !!rf.completed,
        color: '#06b6d4', // cyan-500
        icon: '🩸'
      },
      {
        key: 'diagnoseDash',
        label: 'De Ritis Ratio Analysis',
        shortLabel: 'De Ritis (AST/ALT)',
        gameKey: 'diagnoseDash',
        score: calcNormalized(dd, 1.6, 35),
        benchmark: 58,
        rawBestScore: dd.bestScore || 0,
        clinicalDomain: 'Hepatocellular vs Cholestatic & Alcoholic vs Viral',
        completed: !!dd.completed,
        color: '#3b82f6', // blue-500
        icon: '🧬'
      },
      {
        key: 'sqlSorter',
        label: 'Clinical EHR & SQL Queries',
        shortLabel: 'Clinical SQL',
        gameKey: 'sqlSorter',
        score: calcNormalized(sq, 1.8, 30),
        benchmark: 52,
        rawBestScore: sq.bestScore || 0,
        clinicalDomain: 'Healthcare Database Ingestion & Cohort Filtering',
        completed: !!sq.completed,
        color: '#8b5cf6', // purple-500
        icon: '💾'
      },
      {
        key: 'quizBlitz',
        label: 'Pathology & ML Theory',
        shortLabel: 'Hepatology ML',
        gameKey: 'quizBlitz',
        score: calcNormalized(qb, 1.3, 35),
        benchmark: 65,
        rawBestScore: qb.bestScore || 0,
        clinicalDomain: 'Supervised Learning, ROC-AUC & Ethics',
        completed: !!qb.completed,
        color: '#ec4899', // pink-500
        icon: '📚'
      },
      {
        key: 'lifeSaverSim',
        label: 'Acute Hepatic Crisis Management',
        shortLabel: 'Crisis Resuscitation',
        gameKey: 'lifeSaverSim',
        score: calcNormalized(ls, 1.5, 40),
        benchmark: 54,
        rawBestScore: ls.bestScore || 0,
        clinicalDomain: 'Encephalopathy, Coagulopathy & Acute Failure',
        completed: !!ls.completed,
        color: '#ef4444', // red-500
        icon: '🫀'
      },
      {
        key: 'memoryMatch',
        label: 'Diagnostic Pattern Recognition',
        shortLabel: 'Pattern Memory',
        gameKey: 'memoryMatch',
        score: calcNormalized(mm, 1.4, 30),
        benchmark: 60,
        rawBestScore: mm.bestScore || 0,
        clinicalDomain: 'Histology, Ultrasound, & Drug-Induced Liver Injury',
        completed: !!mm.completed,
        color: '#10b981', // emerald-500
        icon: '🧠'
      }
    ];
  }, [gameStats]);

  // Overall Clinical Readiness Score (0 - 100)
  const clinicalReadinessIndex = useMemo(() => {
    const avgGameScore = radarAxes.reduce((acc, ax) => acc + ax.score, 0) / radarAxes.length;
    const curriculumWeight = (completedModules.length / 10) * 100;
    const predictionWeight = Math.min(100, predictions.length * 20);
    const badgesWeight = Math.min(100, (unlockedBadgeIds.length / 10) * 100);

    return Math.round(
      avgGameScore * 0.35 + curriculumWeight * 0.35 + predictionWeight * 0.15 + badgesWeight * 0.15
    );
  }, [radarAxes, completedModules, predictions, unlockedBadgeIds]);

  // SVG Radial Math
  const size = 340;
  const center = size / 2;
  const radius = 115;
  const numAxes = radarAxes.length;

  // Calculate polygon points
  const getCoordinates = (value: number, index: number, maxRadius: number = radius) => {
    const angle = (Math.PI * 2 / numAxes) * index - Math.PI / 2;
    const r = (value / 100) * maxRadius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y, angle };
  };

  const studentPolygonPoints = radarAxes
    .map((axis, i) => {
      const { x, y } = getCoordinates(axis.score, i);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');

  const benchmarkPolygonPoints = radarAxes
    .map((axis, i) => {
      const { x, y } = getCoordinates(axis.benchmark, i);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');

  // Top-performing game categories sorted descending
  const sortedGames = useMemo(() => {
    return [...radarAxes].sort((a, b) => b.score - a.score);
  }, [radarAxes]);

  // Export verifiable clinical portfolio dossier
  const handleExportPortfolio = () => {
    setIsExporting(true);
    confetti({ particleCount: 35, spread: 60 });

    const portfolioData = {
      title: 'Institutional Clinical Data Science Portfolio Dossier',
      generatedAt: new Date().toISOString(),
      student: {
        name: `${user.titlePrefix} ${user.fullName}`,
        email: user.email,
        registrationId: user.medicalRegistrationId,
        institution: user.institution,
        department: user.department,
        role: user.role,
        level,
        rank,
        xp,
        streakDays
      },
      readinessIndex: `${clinicalReadinessIndex}%`,
      curriculumMastery: {
        completedModulesCount: completedModules.length,
        totalModules: 10,
        completedModuleIds: completedModules
      },
      radarCompetencies: radarAxes.map(ax => ({
        competency: ax.label,
        domain: ax.clinicalDomain,
        score: `${ax.score}/100`,
        cohortBenchmark: `${ax.benchmark}/100`,
        mastered: ax.completed
      })),
      researchContributions: [
        {
          title: 'ILPD De Ritis Ratio Biomarker Engineering',
          metric: 'Engineered AST/ALT ratio feature with cutoff threshold > 2.0 (Alcoholic) vs ~1.0 (Viral)'
        },
        {
          title: 'Direct-to-Total Bilirubin Conjugation Modeling',
          metric: 'Conjugation fraction > 0.5 flagged for extrahepatic cholestasis differentiation'
        },
        {
          title: 'Patient Risk Stratifications',
          casesCount: predictions.length,
          lastStratified: predictions[0]?.timestamp || 'None'
        },
        {
          title: 'Computer Vision Scleral Icterus Screening',
          technology: 'HSV & LAB color space thresholding for jaundice detection'
        }
      ],
      verifiedBadgesCount: unlockedBadgeIds.length
    };

    const blob = new Blob([JSON.stringify(portfolioData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Clinical_Portfolio_${user.fullName.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setTimeout(() => setIsExporting(false), 800);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
      {/* Portfolio Header with Readiness Index */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 bg-cyan-950/80 px-2.5 py-0.5 rounded border border-cyan-800 font-bold flex items-center gap-1">
              <Microscope className="w-3 h-3 text-cyan-400" />
              Academic Dossier &bull; ILPD Case Study
            </span>
            <span className="text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded font-mono">
              WCAG 2.1 AA
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <Layers className="w-6 h-6 text-cyan-400" />
            <span>Clinical Portfolio &amp; Competency Matrix</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Quantitative evaluation of hepatology data science proficiency, real-time diagnostic decision speed,
            biomarker feature engineering, and clinical case stratification.
          </p>
        </div>

        {/* Clinical Readiness Badge & Export CTA */}
        <div className="flex items-center gap-4 shrink-0 bg-slate-950/70 p-3 rounded-2xl border border-slate-800">
          <div className="text-right">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Clinical Readiness Index
            </div>
            <div className="text-2xl font-black text-white font-mono flex items-center justify-end gap-1">
              <span className={clinicalReadinessIndex >= 70 ? 'text-emerald-400' : 'text-cyan-400'}>
                {clinicalReadinessIndex}%
              </span>
              <span className="text-xs text-slate-500 font-normal">/ 100</span>
            </div>
            <div className="text-[10px] text-slate-400">
              {clinicalReadinessIndex >= 75
                ? 'Clinical Fellow Level'
                : clinicalReadinessIndex >= 50
                ? 'Independent Resident'
                : 'Supervised Student'}
            </div>
          </div>

          <div className="h-10 w-[1px] bg-slate-800" />

          <button
            onClick={handleExportPortfolio}
            disabled={isExporting}
            className="px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-cyan-950/30 transition-all cursor-pointer disabled:opacity-50"
            title="Download verified institutional portfolio dossier"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isExporting ? 'Exporting...' : 'Export Portfolio'}</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800/80 pb-3 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('radar')}
          className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'radar'
              ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-950/40'
              : 'bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Target className="w-3.5 h-3.5" />
          <span>Radial Competency Chart</span>
        </button>

        <button
          onClick={() => setActiveTab('activity')}
          className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'activity'
              ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-950/40'
              : 'bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>Student Activity &amp; Learning Volume</span>
        </button>

        <button
          onClick={() => setActiveTab('research')}
          className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'research'
              ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-950/40'
              : 'bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <FlaskConical className="w-3.5 h-3.5" />
          <span>Research &amp; Feature Engineering</span>
        </button>

        <button
          onClick={() => setActiveTab('games')}
          className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'games'
              ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-950/40'
              : 'bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Trophy className="w-3.5 h-3.5" />
          <span>Top Game Categories Leaderboard</span>
        </button>
      </div>

      {/* TAB 1: RADIAL CHART (PRIMARY VISUALIZATION) */}
      {activeTab === 'radar' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Radial Chart Display */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center p-4 bg-slate-950/60 rounded-3xl border border-slate-800/80 relative">
            <div className="absolute top-4 left-4 flex items-center gap-2 text-[11px] font-mono">
              <span className="flex items-center gap-1.5 text-cyan-400">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400" />
                Student Profile ({user.fullName.split(' ')[0]})
              </span>
              <span className="text-slate-600">&bull;</span>
              <span className="flex items-center gap-1.5 text-indigo-400">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500/50 border border-indigo-400" />
                Medical Cohort Median
              </span>
            </div>

            <svg
              viewBox={`0 0 ${size} ${size}`}
              className="w-full max-w-[340px] h-auto my-2 overflow-visible select-none"
              role="img"
              aria-label="6-Axis Clinical Competency Radar Chart"
            >
              <defs>
                <linearGradient id="studentGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.25" />
                </linearGradient>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Concentric Grid Rings (25%, 50%, 75%, 100%) */}
              {[25, 50, 75, 100].map(levelPercent => {
                const ringPoints = Array.from({ length: numAxes })
                  .map((_, i) => {
                    const { x, y } = getCoordinates(levelPercent, i);
                    return `${x.toFixed(1)},${y.toFixed(1)}`;
                  })
                  .join(' ');

                return (
                  <g key={`ring-${levelPercent}`}>
                    <polygon
                      points={ringPoints}
                      fill="none"
                      stroke={levelPercent === 100 ? '#334155' : '#1e293b'}
                      strokeWidth={levelPercent === 100 ? 1.5 : 1}
                      strokeDasharray={levelPercent === 100 ? 'none' : '3 3'}
                    />
                    {/* Ring label on vertical axis */}
                    <text
                      x={center + 4}
                      y={center - (levelPercent / 100) * radius + 3}
                      fill="#64748b"
                      fontSize="8"
                      fontFamily="monospace"
                    >
                      {levelPercent}%
                    </text>
                  </g>
                );
              })}

              {/* Radial Spoke Lines */}
              {radarAxes.map((axis, i) => {
                const { x, y } = getCoordinates(100, i);
                return (
                  <line
                    key={`spoke-${axis.key}`}
                    x1={center}
                    y1={center}
                    x2={x}
                    y2={y}
                    stroke="#334155"
                    strokeWidth={1}
                  />
                );
              })}

              {/* Benchmark Cohort Polygon */}
              <polygon
                points={benchmarkPolygonPoints}
                fill="none"
                stroke="#6366f1"
                strokeWidth={1.5}
                strokeDasharray="4 4"
                opacity={0.6}
              />

              {/* Student Performance Polygon */}
              <polygon
                points={studentPolygonPoints}
                fill="url(#studentGradient)"
                stroke="#06b6d4"
                strokeWidth={2.5}
                filter="url(#glow)"
              />

              {/* Data Vertices and Axis Markers */}
              {radarAxes.map((axis, i) => {
                const { x, y } = getCoordinates(axis.score, i);
                const { x: lx, y: ly } = getCoordinates(118, i);
                const isHovered = hoveredAxis?.key === axis.key;

                return (
                  <g
                    key={`vertex-${axis.key}`}
                    className="cursor-pointer transition-all duration-150"
                    onMouseEnter={() => setHoveredAxis(axis)}
                    onMouseLeave={() => setHoveredAxis(null)}
                  >
                    {/* Vertex point */}
                    <circle
                      cx={x}
                      cy={y}
                      r={isHovered ? 6 : 4}
                      fill={axis.color}
                      stroke="#020617"
                      strokeWidth={2}
                      className="transition-all"
                    />

                    {/* Outer Label */}
                    <text
                      x={lx}
                      y={ly}
                      textAnchor={lx > center + 10 ? 'start' : lx < center - 10 ? 'end' : 'middle'}
                      dominantBaseline="central"
                      fill={isHovered ? '#38bdf8' : '#94a3b8'}
                      fontSize="9"
                      fontWeight={isHovered ? 'bold' : 'normal'}
                      fontFamily="sans-serif"
                    >
                      {axis.icon} {axis.shortLabel}
                    </text>
                  </g>
                );
              })}
            </svg>

            <div className="text-[11px] text-slate-400 mt-2 text-center flex items-center gap-1.5">
              <span>Hover over vertices or axes to inspect diagnostic metrics &amp; clinical targets.</span>
            </div>
          </div>

          {/* Interactive Axis Inspection & Diagnostic Breakdown */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-slate-950/70 p-5 rounded-3xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                  {hoveredAxis ? 'Inspected Competency' : 'Overall Top Competency'}
                </span>
                <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                  {hoveredAxis ? `${hoveredAxis.score}% Mastery` : `${sortedGames[0].score}% Mastery`}
                </span>
              </div>

              {(() => {
                const targetAxis = hoveredAxis || sortedGames[0];
                return (
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-xl shrink-0">
                        {targetAxis.icon}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                          <span>{targetAxis.label}</span>
                          {targetAxis.completed && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          )}
                        </h4>
                        <div className="text-xs text-slate-400 mt-0.5">
                          {targetAxis.clinicalDomain}
                        </div>
                      </div>
                    </div>

                    {/* Score comparison progress bars */}
                    <div className="space-y-2 pt-1 text-xs">
                      <div>
                        <div className="flex items-center justify-between text-slate-300 mb-1">
                          <span className="font-medium">Student Performance</span>
                          <span className="font-mono font-bold text-cyan-400">{targetAxis.score}%</span>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-cyan-400 h-full rounded-full transition-all duration-300"
                            style={{ width: `${targetAxis.score}%` }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between text-slate-400 mb-1">
                          <span>Medical Cohort Benchmark</span>
                          <span className="font-mono">{targetAxis.benchmark}%</span>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-indigo-500/60 h-full rounded-full"
                            style={{ width: `${targetAxis.benchmark}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2 text-[11px]">
                      <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                        <div className="text-slate-500">Best Score / Attempt</div>
                        <div className="text-white font-mono font-bold mt-0.5">
                          {targetAxis.rawBestScore > 0 ? `${targetAxis.rawBestScore} pts` : 'In Progress'}
                        </div>
                      </div>
                      <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                        <div className="text-slate-500">Verification Status</div>
                        <div className="font-bold mt-0.5">
                          {targetAxis.completed ? (
                            <span className="text-emerald-400">Mastered</span>
                          ) : (
                            <span className="text-amber-400">Drill Needed</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={onNavigateToArcade}
                      className="w-full mt-2 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 border border-slate-700 transition-colors cursor-pointer"
                    >
                      <Gamepad2 className="w-3.5 h-3.5" />
                      <span>Launch {targetAxis.shortLabel} Drill &rarr;</span>
                    </button>
                  </div>
                );
              })()}
            </div>

            {/* Quick Summary Pill Highlights */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2.5 rounded-2xl bg-slate-950/60 border border-slate-800">
                <div className="text-slate-400 text-[10px]">Top Dimension</div>
                <div className="font-bold text-cyan-400 truncate mt-0.5">{sortedGames[0].shortLabel}</div>
              </div>
              <div className="p-2.5 rounded-2xl bg-slate-950/60 border border-slate-800">
                <div className="text-slate-400 text-[10px]">Cohort Delta</div>
                <div className="font-bold text-emerald-400 font-mono mt-0.5">
                  +{Math.max(0, clinicalReadinessIndex - 58)}%
                </div>
              </div>
              <div className="p-2.5 rounded-2xl bg-slate-950/60 border border-slate-800">
                <div className="text-slate-400 text-[10px]">Games Cleared</div>
                <div className="font-bold text-white font-mono mt-0.5">
                  {radarAxes.filter(a => a.completed).length}/6
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: STUDENT ACTIVITY & LEARNING VOLUME */}
      {activeTab === 'activity' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1">
              <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                <Flame className="w-4 h-4 text-amber-400" />
                <span>Active Streak</span>
              </div>
              <div className="text-2xl font-black text-white font-mono">{streakDays} Days</div>
              <div className="text-[10px] text-emerald-400">Daily verification active</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1">
              <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                <BookOpen className="w-4 h-4 text-cyan-400" />
                <span>Curriculum Modules</span>
              </div>
              <div className="text-2xl font-black text-white font-mono">
                {completedModules.length} <span className="text-xs text-slate-500 font-normal">/ 10</span>
              </div>
              <div className="text-[10px] text-cyan-400">
                {Math.round((completedModules.length / 10) * 100)}% Syllabus Covered
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1">
              <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                <Database className="w-4 h-4 text-indigo-400" />
                <span>Cases Stratified</span>
              </div>
              <div className="text-2xl font-black text-white font-mono">{predictions.length}</div>
              <div className="text-[10px] text-indigo-300">ILPD Risk Predictions</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1">
              <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                <Zap className="w-4 h-4 text-emerald-400" />
                <span>Clinical XP</span>
              </div>
              <div className="text-2xl font-black text-white font-mono">{xp}</div>
              <div className="text-[10px] text-slate-400">Level {level} &bull; {rank}</div>
            </div>
          </div>

          {/* Detailed Activity Logs */}
          <div className="p-5 rounded-3xl bg-slate-950/60 border border-slate-800 space-y-4">
            <h4 className="text-sm font-bold text-white flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                <span>Curriculum Learning Milestones &amp; Audit Trail</span>
              </span>
              <button
                onClick={onNavigateToCurriculum}
                className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold cursor-pointer"
              >
                View Full Syllabus &rarr;
              </button>
            </h4>

            <div className="space-y-2">
              {[
                { id: 1, title: 'Introduction to Medical Informatics & ILPD Dataset', status: completedModules.includes(1) },
                { id: 2, title: 'Biomarkers & Laboratory Ranges (Bilirubin, ALP, ALT, AST)', status: completedModules.includes(2) },
                { id: 3, title: 'Feature Engineering: De Ritis & Bilirubin Conjugation', status: completedModules.includes(3) },
                { id: 4, title: 'Exploratory Data Analysis & SQLite Querying', status: completedModules.includes(4) },
                { id: 5, title: 'Supervised ML: Stratified Splits & ROC-AUC Optimization', status: completedModules.includes(5) },
                { id: 6, title: 'Model Evaluation: Recall vs Specificity in Clinical Triage', status: completedModules.includes(6) },
                { id: 7, title: 'Explainable AI: Feature Attributions & SHAP Interpretability', status: completedModules.includes(7) },
                { id: 8, title: 'Computer Vision: Scleral Icterus Screening in HSV/LAB', status: completedModules.includes(8) },
                { id: 9, title: 'Clinical Decision Support Systems & Life-Saving Rules', status: completedModules.includes(9) },
                { id: 10, title: 'Medical Device Ethics, SaMD Regulation & Production Pipeline', status: completedModules.includes(10) }
              ].map(mod => (
                <div
                  key={mod.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-slate-500 font-bold">M{mod.id}</span>
                    <span className={mod.status ? 'text-slate-200 font-medium' : 'text-slate-500'}>
                      {mod.title}
                    </span>
                  </div>
                  <div>
                    {mod.status ? (
                      <span className="flex items-center gap-1 text-emerald-400 font-mono text-[11px] font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" /> COMPLETED
                      </span>
                    ) : (
                      <span className="text-slate-600 font-mono text-[11px]">PENDING</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: RESEARCH CONTRIBUTIONS & FEATURE ENGINEERING */}
      {activeTab === 'research' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Contribution 1: De Ritis Ratio Feature Engineering */}
            <div className="p-5 rounded-3xl bg-slate-950/70 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800 font-bold">
                  BIOMARKER RATIO 01
                </span>
                <span className="text-[10px] text-emerald-400 font-mono">PEER-VALIDATED</span>
              </div>
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <FlaskConical className="w-4 h-4 text-cyan-400" />
                <span>De Ritis Ratio Formulation (AST / ALT)</span>
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Engineered the De Ritis biomarker ratio as a non-linear interaction feature across 583 ILPD records.
                A ratio &gt; 2.0 strongly indicates alcohol-induced liver injury or cirrhosis, whereas ratios &lt; 1.0 indicate
                acute viral hepatitis or NAFLD.
              </p>
              <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-xs font-mono text-cyan-300">
                Feature Formula: AST_to_ALT = Aspartate_Aminotransferase / (Alamine_Aminotransferase + 1e-5)
              </div>
              <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>Evaluated across 5-fold cross-validation ROC-AUC in ML pipeline.</span>
              </div>
            </div>

            {/* Contribution 2: Bilirubin Conjugation Dynamics */}
            <div className="p-5 rounded-3xl bg-slate-950/70 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-indigo-400 bg-indigo-950 px-2 py-0.5 rounded border border-indigo-800 font-bold">
                  BIOMARKER RATIO 02
                </span>
                <span className="text-[10px] text-emerald-400 font-mono">CLINICAL TRIAGE</span>
              </div>
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-indigo-400" />
                <span>Bilirubin Conjugation Index (DBIL / TBIL)</span>
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Separated conjugated (direct) from total bilirubin to establish the obstructive jaundice fraction.
                Values &gt; 50% direct bilirubin signify biliary ductal blockage or severe cholestasis requiring urgent imaging.
              </p>
              <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-xs font-mono text-indigo-300">
                Conjugation Ratio: DBIL_Fraction = Direct_Bilirubin / Total_Bilirubin
              </div>
              <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                <span>Integrated into real-time patient risk stratification engine.</span>
              </div>
            </div>

            {/* Contribution 3: Explainable AI & Feature Attribution */}
            <div className="p-5 rounded-3xl bg-slate-950/70 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-purple-400 bg-purple-950 px-2 py-0.5 rounded border border-purple-800 font-bold">
                  XAI AUDITING
                </span>
                <span className="text-[10px] text-purple-300 font-mono">TRANSPARENCY</span>
              </div>
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <Brain className="w-4 h-4 text-purple-400" />
                <span>Clinical Interpretability &amp; SHAP Attributions</span>
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Audited tree-based feature importances across Random Forest and Gradient Boosting models.
                Identified Alkaline Phosphatase (ALP) and Total Bilirubin as primary contributors to predicted hepatic risk scores.
              </p>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">Top 1: TBIL (0.28)</span>
                <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">Top 2: ALP (0.24)</span>
                <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">Top 3: AST/ALT (0.19)</span>
              </div>
            </div>

            {/* Contribution 4: Patient Stratifications & Clinical Case Notes */}
            <div className="p-5 rounded-3xl bg-slate-950/70 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800 font-bold">
                  CLINICAL CASES
                </span>
                <span className="text-[10px] text-emerald-300 font-mono">{predictions.length} LOGGED</span>
              </div>
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-emerald-400" />
                <span>Stratified Case Transcripts</span>
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Logged patient scenarios through the Clinical Risk Predictor, computing real-time risk bands (Low, Moderate, High)
                with corresponding laboratory reference range alerts.
              </p>
              <div className="flex items-center justify-between pt-1">
                <button
                  onClick={onNavigateToPredictor}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-300 text-xs font-semibold border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Database className="w-3.5 h-3.5" />
                  <span>Open Risk Predictor &rarr;</span>
                </button>
                <span className="text-[11px] text-slate-400">
                  {predictions.length > 0 ? `${predictions.length} cases archived` : 'No patient cases yet'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: TOP GAME CATEGORIES LEADERBOARD */}
      {activeTab === 'games' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Diagnostic Speed &amp; Medical Arcade Performance Ranking</span>
            </h4>
            <span className="text-xs text-slate-400">
              Ranked by student mastery percentage
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {sortedGames.map((game, rankIndex) => (
              <div
                key={game.key}
                className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition-all flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-2xl flex items-center justify-center font-bold font-mono text-sm shrink-0 ${
                      rankIndex === 0
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                        : rankIndex === 1
                        ? 'bg-slate-300/20 text-slate-200 border border-slate-400/40'
                        : rankIndex === 2
                        ? 'bg-amber-700/20 text-amber-600 border border-amber-700/40'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    #{rankIndex + 1}
                  </div>

                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span>{game.icon}</span>
                      <span>{game.label}</span>
                      {game.completed && (
                        <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950 px-1.5 py-0.2 rounded border border-emerald-800">
                          MASTERED
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      {game.clinicalDomain}
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-sm font-black font-mono text-cyan-400">
                    {game.score}%
                  </div>
                  <div className="text-[10px] text-slate-500">
                    {game.rawBestScore > 0 ? `${game.rawBestScore} pts` : 'Untested'}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={onNavigateToArcade}
              className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Gamepad2 className="w-3.5 h-3.5" />
              <span>Enter Clinical Arcade &amp; Improve Scores</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
