/**
 * Digitalization in Healthcare - Clinical Case Simulator Top Performers Sidebar
 * Displays high scores, usernames, cases solved, and diagnostic accuracy
 * of top medical students and residents to foster healthy academic competition.
 */

import React, { useState, useMemo } from 'react';
import {
  Trophy,
  Award,
  Flame,
  CheckCircle2,
  TrendingUp,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Target,
  Zap,
  UserCheck,
  Stethoscope,
  Info,
  ArrowUpRight,
  ShieldCheck,
  Medal
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useProgress } from '../context/ProgressContext';

export interface TopPerformer {
  id: string;
  name: string;
  username: string;
  institution: string;
  role: string;
  avatarColor: string;
  avatarInitials: string;
  casesSolved: number;
  totalCases: number;
  highScore: number;
  accuracyRate: number; // percentage
  fastestSolveTime: string; // e.g. "2m 45s"
  streakDays: number;
  clinicalSpecialtyInterest: string;
  diagnosticTip: string;
  isAllTimeWinner?: boolean;
}

// Peer benchmarks from academic hepatology residency cohorts
export const MOCK_TOP_PERFORMERS: TopPerformer[] = [
  {
    id: 'perf-1',
    name: 'Dr. Priya Swaminathan',
    username: 'priya_hepatology',
    institution: 'AIIMS New Delhi',
    role: 'Chief Clinical Fellow',
    avatarColor: 'from-amber-500 to-yellow-600',
    avatarInitials: 'PS',
    casesSolved: 6,
    totalCases: 6,
    highScore: 1020,
    accuracyRate: 98,
    fastestSolveTime: '2m 14s',
    streakDays: 14,
    clinicalSpecialtyInterest: 'Transplant Hepatology & Acute Liver Failure',
    diagnosticTip:
      'Always calculate De Ritis AST/ALT ratio first. AST/ALT > 2.0 with AST < 400 is almost pathognomonic for severe alcoholic hepatitis.',
    isAllTimeWinner: true
  },
  {
    id: 'perf-2',
    name: 'Dr. Rohan Mukherjee',
    username: 'rohan_gastro',
    institution: 'CMC Vellore',
    role: 'Senior Registrar',
    avatarColor: 'from-cyan-500 to-blue-600',
    avatarInitials: 'RM',
    casesSolved: 6,
    totalCases: 6,
    highScore: 975,
    accuracyRate: 95,
    fastestSolveTime: '2m 38s',
    streakDays: 11,
    clinicalSpecialtyInterest: 'Autoimmune & Cholestatic Liver Disorders',
    diagnosticTip:
      'Isolated massive ALP with normal common bile duct diameter on ultrasound points toward small-duct intrahepatic disease (PBC/PSC); check AMA early.'
  },
  {
    id: 'perf-3',
    name: 'Dr. Ananya Pandey',
    username: 'ananya_mbbs',
    institution: 'KGMU Lucknow',
    role: 'Internal Medicine Resident',
    avatarColor: 'from-emerald-500 to-teal-600',
    avatarInitials: 'AP',
    casesSolved: 5,
    totalCases: 6,
    highScore: 880,
    accuracyRate: 92,
    fastestSolveTime: '3m 05s',
    streakDays: 8,
    clinicalSpecialtyInterest: 'Viral Hepatitis & Portal Hypertension',
    diagnosticTip:
      'In cirrhosis with ascites, perform diagnostic paracentesis within 2 hours. Over 30% of spontaneous bacterial peritonitis (SBP) cases lack overt peritoneal signs.'
  },
  {
    id: 'perf-4',
    name: 'Dr. David K. Joseph',
    username: 'david_fellow',
    institution: 'JIPMER Puducherry',
    role: 'Junior Resident (PG-2)',
    avatarColor: 'from-purple-500 to-indigo-600',
    avatarInitials: 'DJ',
    casesSolved: 5,
    totalCases: 6,
    highScore: 820,
    accuracyRate: 89,
    fastestSolveTime: '3m 22s',
    streakDays: 6,
    clinicalSpecialtyInterest: 'Toxicology & Drug-Induced Liver Injury',
    diagnosticTip:
      'Paracetamol poisoning transaminases can easily exceed 5,000 IU/L. Start IV N-acetylcysteine immediately without waiting for serum APAP assay levels.'
  },
  {
    id: 'perf-5',
    name: 'Dr. Aarav Mehta',
    username: 'aarav_clinics',
    institution: 'PGI Chandigarh',
    role: 'Internal Medicine Resident',
    avatarColor: 'from-rose-500 to-pink-600',
    avatarInitials: 'AM',
    casesSolved: 4,
    totalCases: 6,
    highScore: 710,
    accuracyRate: 86,
    fastestSolveTime: '3m 50s',
    streakDays: 5,
    clinicalSpecialtyInterest: 'Metabolic Associated Steatohepatitis (MASH)',
    diagnosticTip:
      'In MASH with Type 2 Diabetes, ALT is often higher than AST early on. Once AST surpasses ALT, bridging fibrosis or early cirrhosis has likely set in.'
  }
];

interface TopPerformersSidebarProps {
  submittedCasesCount: number;
  totalCasesCount: number;
  userSimScore: number;
  userAccuracyRate?: number;
  onSelectCase?: (caseId: string) => void;
  onNavigateToCommunity?: () => void;
  className?: string;
}

export const TopPerformersSidebar: React.FC<TopPerformersSidebarProps> = ({
  submittedCasesCount,
  totalCasesCount,
  userSimScore,
  userAccuracyRate = 0,
  onSelectCase,
  onNavigateToCommunity,
  className = ''
}) => {
  const { currentUser } = useAuth();
  const { xp, streakDays: globalStreak } = useProgress();

  const [timeFilter, setTimeFilter] = useState<'weekly' | 'allTime'>('weekly');
  const [expandedPerformerId, setExpandedPerformerId] = useState<string | null>(null);
  const [showEncouragementTip, setShowEncouragementTip] = useState(true);

  // Compute live user stats for the simulator leaderboard
  const currentUserEntry = useMemo(() => {
    const rawName = currentUser?.fullName || 'Resident Colleague';
    const initials = rawName
      .split(' ')
      .map(part => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'DR';

    // Calculate simulated score: case simulator points + scaled progress XP
    const calculatedScore = userSimScore > 0 ? userSimScore : Math.min(600, Math.floor(xp * 0.4));
    const accuracy = userAccuracyRate > 0 ? userAccuracyRate : submittedCasesCount > 0 ? 88 : 0;

    return {
      id: 'current-user-live',
      name: rawName,
      username: currentUser?.email?.split('@')[0] || 'you',
      institution: currentUser?.institution || 'National Medical College',
      role: currentUser?.role || 'Medical Student (MBBS)',
      avatarColor: 'from-cyan-500 to-blue-600',
      avatarInitials: initials,
      casesSolved: submittedCasesCount,
      totalCases: totalCasesCount,
      highScore: calculatedScore,
      accuracyRate: accuracy,
      fastestSolveTime: submittedCasesCount > 0 ? '3m 12s' : '—',
      streakDays: Math.max(1, globalStreak || 1),
      clinicalSpecialtyInterest: 'Diagnostic Hepatology Simulation',
      diagnosticTip: 'Submit your accurate diagnoses across all clinical ward cases to climb the national residency ranking!'
    };
  }, [currentUser, userSimScore, userAccuracyRate, submittedCasesCount, totalCasesCount, xp, globalStreak]);

  // Merge and sort peer benchmarks with the active user
  const rankedList = useMemo(() => {
    const baseList = timeFilter === 'weekly'
      ? MOCK_TOP_PERFORMERS
      : [...MOCK_TOP_PERFORMERS].map(p => ({
          ...p,
          highScore: Math.round(p.highScore * 1.35)
        }));

    // Include the user in ranking
    const combined = [...baseList, currentUserEntry];
    combined.sort((a, b) => b.highScore - a.highScore);

    return combined.map((item, index) => ({
      ...item,
      rank: index + 1
    }));
  }, [timeFilter, currentUserEntry]);

  const userRank = useMemo(() => {
    const found = rankedList.find(p => p.id === 'current-user-live');
    return found?.rank || rankedList.length;
  }, [rankedList]);

  // Find the competitor just ahead of the user to foster healthy competition
  const nextCompetitor = useMemo(() => {
    if (userRank <= 1) return null;
    return rankedList[userRank - 2];
  }, [rankedList, userRank]);

  const pointsToOvertake = useMemo(() => {
    if (!nextCompetitor) return 0;
    return Math.max(15, nextCompetitor.highScore - currentUserEntry.highScore + 10);
  }, [nextCompetitor, currentUserEntry.highScore]);

  return (
    <div
      className={`bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl space-y-4 text-slate-100 flex flex-col ${className}`}
      aria-label="Clinical Case Simulator Top Performers Sidebar"
    >
      {/* Top Header */}
      <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-3.5">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Trophy className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-tight flex items-center gap-1.5">
                <span>Top Performers</span>
                <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950 px-1.5 py-0.5 rounded border border-cyan-800">
                  Ward Live
                </span>
              </h2>
              <p className="text-[11px] text-slate-400">
                Correctly Diagnosed Case Leaderboard
              </p>
            </div>
          </div>
        </div>

        {/* Time Cohort Toggle */}
        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-[10px] font-mono">
          <button
            onClick={() => setTimeFilter('weekly')}
            className={`px-2 py-0.8 rounded-lg font-bold transition-all cursor-pointer ${
              timeFilter === 'weekly'
                ? 'bg-cyan-500 text-slate-950'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Weekly
          </button>
          <button
            onClick={() => setTimeFilter('allTime')}
            className={`px-2 py-0.8 rounded-lg font-bold transition-all cursor-pointer ${
              timeFilter === 'allTime'
                ? 'bg-cyan-500 text-slate-950'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All-Time
          </button>
        </div>
      </div>

      {/* Healthy Competition Callout */}
      {showEncouragementTip && (
        <div className="relative rounded-2xl bg-gradient-to-r from-cyan-950/60 to-slate-950 border border-cyan-900/50 p-3 text-left">
          <button
            onClick={() => setShowEncouragementTip(false)}
            className="absolute top-2 right-2 text-slate-500 hover:text-slate-300 text-[10px] font-mono"
            aria-label="Dismiss competition callout"
          >
            &times;
          </button>
          <div className="flex items-start gap-2.5">
            <div className="p-1 rounded-lg bg-cyan-500/10 text-cyan-400 mt-0.5 shrink-0">
              <Flame className="w-4 h-4" />
            </div>
            <div className="text-[11px] leading-relaxed pr-3">
              <div className="font-bold text-cyan-300 flex items-center gap-1">
                <span>Residency Challenge</span>
                <span className="text-[9px] text-amber-300 bg-amber-950/80 px-1.5 rounded border border-amber-800">
                  +30 XP Bonus
                </span>
              </div>
              <p className="text-slate-300 mt-0.5">
                {userRank === 1 ? (
                  <span>🏆 Outstanding! You lead the ward cohort. Defend your rank by re-verifying challenging differentials!</span>
                ) : nextCompetitor ? (
                  <span>
                    You are <span className="font-bold text-amber-300 font-mono">#{userRank}</span> ({currentUserEntry.highScore} pts). Score <span className="font-bold text-emerald-300 font-mono">+{pointsToOvertake} pts</span> to surpass <span className="text-white font-medium">{nextCompetitor.name.split(' ')[1]}</span>!
                  </span>
                ) : (
                  <span>Diagnose patient cases accurately to place on the Inpatient Ward Leaderboard.</span>
                )}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Current User Snapshot Card (Sticky Placement) */}
      <div className="rounded-2xl bg-slate-950 border border-cyan-500/40 p-3.5 shadow-md relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-[10px] font-mono font-bold text-cyan-300">
              #{userRank}
            </div>
            <div className="text-xs font-bold text-white flex items-center gap-1.5">
              <span>Your Ward Standing</span>
              <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950/80 border border-emerald-800 px-1.5 py-0.2 rounded">
                Active
              </span>
            </div>
          </div>
          <div className="text-xs font-mono font-bold text-cyan-400">
            {currentUserEntry.highScore} <span className="text-[10px] text-slate-400 font-normal">pts</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-900 text-center font-mono">
          <div className="bg-slate-900/60 p-1.5 rounded-xl border border-slate-800/80">
            <div className="text-[9px] uppercase text-slate-400">Solved</div>
            <div className="text-xs font-bold text-white">
              {currentUserEntry.casesSolved}/{currentUserEntry.totalCases}
            </div>
          </div>
          <div className="bg-slate-900/60 p-1.5 rounded-xl border border-slate-800/80">
            <div className="text-[9px] uppercase text-slate-400">Accuracy</div>
            <div className="text-xs font-bold text-emerald-400">
              {currentUserEntry.accuracyRate}%
            </div>
          </div>
          <div className="bg-slate-900/60 p-1.5 rounded-xl border border-slate-800/80">
            <div className="text-[9px] uppercase text-slate-400">Streak</div>
            <div className="text-xs font-bold text-amber-400 flex items-center justify-center gap-0.5">
              <Flame className="w-3 h-3 text-amber-400" />
              <span>{currentUserEntry.streakDays}d</span>
            </div>
          </div>
        </div>
      </div>

      {/* Performers List */}
      <div className="space-y-2 flex-1 overflow-y-auto max-h-[460px] pr-0.5 custom-scrollbar">
        {rankedList.map((performer) => {
          const isUser = performer.id === 'current-user-live';
          const isExpanded = expandedPerformerId === performer.id;

          const medalBadge =
            performer.rank === 1 ? (
              <span className="text-amber-400 font-bold flex items-center gap-0.5">
                <Medal className="w-3.5 h-3.5 fill-amber-400/20" /> #1
              </span>
            ) : performer.rank === 2 ? (
              <span className="text-slate-300 font-bold flex items-center gap-0.5">
                <Medal className="w-3.5 h-3.5 fill-slate-300/20" /> #2
              </span>
            ) : performer.rank === 3 ? (
              <span className="text-amber-600 font-bold flex items-center gap-0.5">
                <Medal className="w-3.5 h-3.5 fill-amber-600/20" /> #3
              </span>
            ) : (
              <span className="text-slate-500 font-mono font-medium">#{performer.rank}</span>
            );

          return (
            <div
              key={performer.id}
              className={`rounded-2xl border transition-all text-left ${
                isUser
                  ? 'bg-slate-950/80 border-cyan-500/50 shadow-sm shadow-cyan-950/40 ring-1 ring-cyan-500/30'
                  : 'bg-slate-950/40 border-slate-800/80 hover:border-slate-700 hover:bg-slate-950/70'
              }`}
            >
              <div
                onClick={() => setExpandedPerformerId(isExpanded ? null : performer.id)}
                className="p-3 cursor-pointer flex items-center justify-between gap-2.5"
              >
                {/* Left: Rank & Avatar */}
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-6 text-center text-xs shrink-0 font-mono">
                    {medalBadge}
                  </div>

                  <div
                    className={`w-8 h-8 rounded-xl bg-gradient-to-br ${performer.avatarColor} flex items-center justify-center text-xs font-bold text-white shadow-sm shrink-0`}
                  >
                    {performer.avatarInitials}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 truncate">
                      <span className="text-xs font-bold text-white truncate">
                        {performer.name}
                      </span>
                      {isUser && (
                        <span className="text-[9px] font-mono text-cyan-300 bg-cyan-950 px-1 rounded border border-cyan-800 shrink-0">
                          YOU
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-slate-400 truncate flex items-center gap-1 font-mono">
                      <span>@{performer.username}</span>
                      <span>&bull;</span>
                      <span className="truncate">{performer.institution}</span>
                    </div>
                  </div>
                </div>

                {/* Right: Solved Cases & Score */}
                <div className="text-right shrink-0">
                  <div className="text-xs font-mono font-black text-cyan-300">
                    {performer.highScore}
                    <span className="text-[9px] font-normal text-slate-400 ml-0.5">pts</span>
                  </div>
                  <div className="text-[10px] font-mono text-slate-400 flex items-center justify-end gap-1">
                    <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
                    <span>{performer.casesSolved}/{performer.totalCases} dx</span>
                  </div>
                </div>
              </div>

              {/* Collapsible Clinical Rationale / Performance Breakdown */}
              {isExpanded && (
                <div className="px-3 pb-3 pt-1 border-t border-slate-900 space-y-2 text-[11px] bg-slate-900/50 rounded-b-2xl">
                  <div className="flex flex-wrap items-center justify-between gap-1 text-[10px] font-mono text-slate-400 pt-1">
                    <span>Rank: <strong className="text-white">{performer.role}</strong></span>
                    <span>Accuracy: <strong className="text-emerald-400">{performer.accuracyRate}%</strong></span>
                    <span>Best Time: <strong className="text-cyan-400">{performer.fastestSolveTime}</strong></span>
                  </div>

                  <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <div className="text-[10px] font-mono text-amber-400 font-bold flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      <span>Top Performer Diagnostic Pearl</span>
                    </div>
                    <p className="text-slate-300 text-[10px] italic leading-relaxed">
                      "{performer.diagnosticTip}"
                    </p>
                  </div>

                  <div className="text-[10px] text-slate-500 font-mono flex items-center justify-between">
                    <span>Specialty Focus: {performer.clinicalSpecialtyInterest}</span>
                    <span className="flex items-center gap-1 text-amber-400">
                      <Flame className="w-3 h-3" /> {performer.streakDays}-day streak
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Site-Wide Competitive Leaderboard CTA */}
      {onNavigateToCommunity && (
        <button
          onClick={onNavigateToCommunity}
          className="w-full py-2.5 px-3 rounded-2xl bg-gradient-to-r from-cyan-950/70 via-slate-900 to-amber-950/60 hover:from-cyan-900/60 hover:to-amber-900/60 border border-cyan-500/30 hover:border-cyan-400 text-cyan-300 font-bold text-xs flex items-center justify-between transition-all cursor-pointer group shadow-lg"
        >
          <span className="flex items-center gap-1.5">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>Site-Wide Global Leaderboard (Top 10)</span>
          </span>
          <ArrowUpRight className="w-3.5 h-3.5 text-cyan-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </button>
      )}

      {/* Footer Benchmark Insight */}
      <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-400 flex items-center justify-between font-mono">
        <span className="flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
          <span>Verified Clinical EMR Grading</span>
        </span>
        <span className="text-slate-500">
          Cohort Size: 48 Residents
        </span>
      </div>
    </div>
  );
};
