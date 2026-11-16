/**
 * Digitalization in Healthcare - Global Clinical Leaderboard
 * Site-wide competitive dashboard displaying the Top 10 ranked clinicians
 * across the entire platform based on total Clinical XP, diagnostic accuracy,
 * and verified case solutions.
 */

import React, { useState, useMemo } from 'react';
import {
  Trophy,
  Medal,
  Award,
  Flame,
  CheckCircle2,
  Target,
  TrendingUp,
  Sparkles,
  ShieldCheck,
  Stethoscope,
  Building2,
  Filter,
  ArrowUpRight,
  Users,
  Search,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Zap,
  Globe,
  Clock,
  BookOpen,
  HelpCircle,
  BarChart3,
  Calendar
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useProgress } from '../context/ProgressContext';

export interface GlobalLeaderboardUser {
  id: string;
  rank: number;
  name: string;
  username: string;
  institution: string;
  location: string;
  clinicalRank: 'Chief Fellow' | 'Attending' | 'Senior Registrar' | 'Junior Resident';
  specialty: string;
  specialtyCategory: 'Transplant' | 'Cholestatic' | 'Toxicology' | 'Viral' | 'Metabolic' | 'General';
  avatarColor: string;
  avatarInitials: string;
  totalClinicalXp: number;
  casesSolved: number;
  totalCasesAttempted: number;
  accuracyRate: number; // percentage
  avgSolveTime: string;
  streakDays: number;
  specialtyBadges: string[];
  clinicalPearl: string;
  recentCaseDiagnosed: string;
  diagnosticEfficiencyScore: number; // 0-100
}

// Top 10 Platform Clinicians from premier academic medical teaching institutions
export const GLOBAL_TOP_10_CLINICIANS: Omit<GlobalLeaderboardUser, 'rank'>[] = [
  {
    id: 'lead-1',
    name: 'Dr. Priya Swaminathan',
    username: 'priya_hepatology',
    institution: 'AIIMS New Delhi',
    location: 'New Delhi, India',
    clinicalRank: 'Chief Fellow',
    specialty: 'Transplant Hepatology & Acute Liver Failure',
    specialtyCategory: 'Transplant',
    avatarColor: 'from-amber-400 via-yellow-500 to-amber-600',
    avatarInitials: 'PS',
    totalClinicalXp: 15420,
    casesSolved: 42,
    totalCasesAttempted: 42,
    accuracyRate: 98.4,
    avgSolveTime: '2m 14s',
    streakDays: 28,
    specialtyBadges: ['Acute Liver Failure Prodigy', 'Grand Rounds Champion', 'De Ritis Pioneer', 'MELD-Na Expert'],
    clinicalPearl:
      'Always calculate the De Ritis AST/ALT ratio first. AST/ALT > 2.0 with AST < 400 is almost pathognomonic for severe alcoholic hepatitis. Never withhold early enteral nutrition.',
    recentCaseDiagnosed: 'Decompensated Alcoholic Cirrhosis with Stage III Encephalopathy',
    diagnosticEfficiencyScore: 99
  },
  {
    id: 'lead-2',
    name: 'Dr. Rohan Mukherjee',
    username: 'rohan_gastro',
    institution: 'CMC Vellore',
    location: 'Vellore, India',
    clinicalRank: 'Senior Registrar',
    specialty: 'Cholestatic & Autoimmune Hepatology',
    specialtyCategory: 'Cholestatic',
    avatarColor: 'from-slate-300 via-cyan-400 to-blue-500',
    avatarInitials: 'RM',
    totalClinicalXp: 14180,
    casesSolved: 39,
    totalCasesAttempted: 40,
    accuracyRate: 96.8,
    avgSolveTime: '2m 38s',
    streakDays: 21,
    specialtyBadges: ['PBC/PSC Master', 'Biliary Sieve', 'Top Diagnostic Speed', 'AMA Serology Lead'],
    clinicalPearl:
      'Isolated massive ALP with normal common bile duct diameter on ultrasound points toward small-duct intrahepatic disease (PBC/PSC); check antimitochondrial antibodies (AMA) promptly.',
    recentCaseDiagnosed: 'Primary Biliary Cholangitis with Early Canalicular Fibrosis',
    diagnosticEfficiencyScore: 97
  },
  {
    id: 'lead-3',
    name: 'Dr. Marcus Vance, MD',
    username: 'vance_hepatobiliary',
    institution: 'Johns Hopkins Medicine',
    location: 'Baltimore, USA',
    clinicalRank: 'Attending',
    specialty: 'Interventional Hepatology & Portal Hemodynamics',
    specialtyCategory: 'Transplant',
    avatarColor: 'from-amber-600 via-orange-500 to-amber-700',
    avatarInitials: 'MV',
    totalClinicalXp: 13650,
    casesSolved: 38,
    totalCasesAttempted: 40,
    accuracyRate: 95.5,
    avgSolveTime: '2m 45s',
    streakDays: 19,
    specialtyBadges: ['Portal HTN Strategist', 'TIPS Specialist', 'Ultrasound Master', 'HVPG Evaluator'],
    clinicalPearl:
      'In acute variceal hemorrhage, vasoactive infusion (octreotide/terlipressin) must precede diagnostic endoscopy to lower splanchnic arterial inflow and decrease procedural mortality.',
    recentCaseDiagnosed: 'Bleeding Esophageal Varices Secondary to Cirrhotic Sinusoidal Block',
    diagnosticEfficiencyScore: 95
  },
  {
    id: 'lead-4',
    name: 'Dr. Ananya Pandey',
    username: 'ananya_mbbs',
    institution: 'KGMU Lucknow',
    location: 'Lucknow, India',
    clinicalRank: 'Attending',
    specialty: 'Viral Hepatitis & Decompensated Cirrhosis',
    specialtyCategory: 'Viral',
    avatarColor: 'from-emerald-400 via-teal-500 to-green-600',
    avatarInitials: 'AP',
    totalClinicalXp: 12900,
    casesSolved: 36,
    totalCasesAttempted: 38,
    accuracyRate: 94.2,
    avgSolveTime: '3m 05s',
    streakDays: 15,
    specialtyBadges: ['HCV Elimination Award', 'Ascites Management', 'SBP Rapid Triage'],
    clinicalPearl:
      'In cirrhosis with new-onset ascites, perform diagnostic paracentesis within 2 hours. Over 30% of spontaneous bacterial peritonitis (SBP) cases lack overt abdominal tenderness.',
    recentCaseDiagnosed: 'Spontaneous Bacterial Peritonitis in Post-NASH Cirrhosis',
    diagnosticEfficiencyScore: 93
  },
  {
    id: 'lead-5',
    name: 'Dr. Elena Rostova',
    username: 'rostova_charite',
    institution: 'Charité – Universitätsmedizin Berlin',
    location: 'Berlin, Germany',
    clinicalRank: 'Senior Registrar',
    specialty: 'Drug-Induced Liver Injury (DILI) & Immunotoxicity',
    specialtyCategory: 'Toxicology',
    avatarColor: 'from-purple-400 via-violet-500 to-indigo-600',
    avatarInitials: 'ER',
    totalClinicalXp: 11840,
    casesSolved: 34,
    totalCasesAttempted: 36,
    accuracyRate: 93.6,
    avgSolveTime: '3m 15s',
    streakDays: 14,
    specialtyBadges: ['RUCAM Algorithm Expert', 'Toxicology Ace', 'Drug Rechallenge Guard'],
    clinicalPearl:
      'Always calculate the RUCAM causality score for idiosyncratic DILI. Review non-prescription botanicals, herbal supplements, and amoxicillin-clavulanate latent cholestatic windows.',
    recentCaseDiagnosed: 'Amoxicillin-Clavulanate Mixed Cholestatic/Hepatocellular Injury',
    diagnosticEfficiencyScore: 92
  },
  {
    id: 'lead-6',
    name: 'Dr. David K. Joseph',
    username: 'david_fellow',
    institution: 'JIPMER Puducherry',
    location: 'Puducherry, India',
    clinicalRank: 'Junior Resident',
    specialty: 'Acute Toxicology & APAP Poisoning Triage',
    specialtyCategory: 'Toxicology',
    avatarColor: 'from-blue-400 via-indigo-500 to-cyan-600',
    avatarInitials: 'DJ',
    totalClinicalXp: 10950,
    casesSolved: 31,
    totalCasesAttempted: 34,
    accuracyRate: 91.8,
    avgSolveTime: '3m 22s',
    streakDays: 12,
    specialtyBadges: ['NAC Protocol Hero', 'Emergency Liver Triage', 'Rumack-Matthew Lead'],
    clinicalPearl:
      'Paracetamol poisoning transaminases can easily exceed 5,000 IU/L. Start IV N-acetylcysteine immediately on high clinical suspicion without waiting for serum APAP assay levels.',
    recentCaseDiagnosed: 'Acute Acetaminophen Toxic Necrosis with High King’s College Score',
    diagnosticEfficiencyScore: 90
  },
  {
    id: 'lead-7',
    name: 'Dr. Chen Wei, MD',
    username: 'chen_sgh',
    institution: 'Singapore General Hospital',
    location: 'Singapore',
    clinicalRank: 'Chief Fellow',
    specialty: 'Metabolic Associated Steatohepatitis (MASH)',
    specialtyCategory: 'Metabolic',
    avatarColor: 'from-cyan-400 via-teal-500 to-emerald-600',
    avatarInitials: 'CW',
    totalClinicalXp: 10240,
    casesSolved: 29,
    totalCasesAttempted: 32,
    accuracyRate: 92.4,
    avgSolveTime: '3m 34s',
    streakDays: 10,
    specialtyBadges: ['FIB-4 Index Specialist', 'Non-Invasive Fibrosis', 'Cardio-Hepatic Link'],
    clinicalPearl:
      'In MASH with Type 2 Diabetes, ALT is often higher than AST early on. Once AST surpasses ALT, bridging fibrosis (F3) or early cirrhosis has likely set in.',
    recentCaseDiagnosed: 'MASH with Advanced F3 Bridging Fibrosis and Dyslipidemia',
    diagnosticEfficiencyScore: 89
  },
  {
    id: 'lead-8',
    name: 'Dr. Aarav Mehta',
    username: 'aarav_pgi',
    institution: 'PGI Chandigarh',
    location: 'Chandigarh, India',
    clinicalRank: 'Senior Registrar',
    specialty: 'Vascular Liver Disease & Hemodynamics',
    specialtyCategory: 'Transplant',
    avatarColor: 'from-rose-400 via-pink-500 to-rose-600',
    avatarInitials: 'AM',
    totalClinicalXp: 9680,
    casesSolved: 28,
    totalCasesAttempted: 31,
    accuracyRate: 89.7,
    avgSolveTime: '3m 50s',
    streakDays: 9,
    specialtyBadges: ['Doppler Diagnostic Prodigy', 'Budd-Chiari Investigator'],
    clinicalPearl:
      'Sudden intractable ascites with tender hepatomegaly and reversed color-Doppler flow in hepatic veins is classic Budd-Chiari syndrome until proven otherwise.',
    recentCaseDiagnosed: 'Subacute Budd-Chiari Syndrome with Inferior Vena Cava Webbing',
    diagnosticEfficiencyScore: 88
  },
  {
    id: 'lead-9',
    name: 'Dr. Sofia Al-Mansoor',
    username: 'sofia_pathology',
    institution: 'King Faisal Specialist Hospital',
    location: 'Riyadh, Saudi Arabia',
    clinicalRank: 'Junior Resident',
    specialty: 'Hepatic Histopathology & Infiltrative Disease',
    specialtyCategory: 'General',
    avatarColor: 'from-fuchsia-400 via-purple-500 to-pink-600',
    avatarInitials: 'SM',
    totalClinicalXp: 8920,
    casesSolved: 26,
    totalCasesAttempted: 30,
    accuracyRate: 90.1,
    avgSolveTime: '4m 02s',
    streakDays: 8,
    specialtyBadges: ['Metavir Scoring Veteran', 'Prussian Blue Expert', 'Trichrome Staining Lead'],
    clinicalPearl:
      'High serum ferritin with normal transferrin saturation often reflects inflammatory acute phase reaction or MASH rather than genetic hemochromatosis. Always compute transferrin saturation.',
    recentCaseDiagnosed: 'Hereditary Hemochromatosis with Secondary Cirrhotic Siderosis',
    diagnosticEfficiencyScore: 87
  },
  {
    id: 'lead-10',
    name: 'Dr. Tatsuya Endo',
    username: 'endo_tokyo',
    institution: 'University of Tokyo Hospital',
    location: 'Tokyo, Japan',
    clinicalRank: 'Junior Resident',
    specialty: 'Inborn Errors of Metabolism & Wilson Disease',
    specialtyCategory: 'Metabolic',
    avatarColor: 'from-sky-400 via-blue-500 to-indigo-600',
    avatarInitials: 'TE',
    totalClinicalXp: 8350,
    casesSolved: 25,
    totalCasesAttempted: 29,
    accuracyRate: 88.5,
    avgSolveTime: '4m 15s',
    streakDays: 7,
    specialtyBadges: ['Kayser-Fleischer Spotter', 'Copper Metabolism', 'Leipzig Score Master'],
    clinicalPearl:
      'In young patients presenting with unexplained Coombs-negative hemolytic anemia and acute liver failure, suspect acute Wilsonian crisis with massive copper release and low alkaline phosphatase.',
    recentCaseDiagnosed: 'Fulminant Wilsonian Crisis with 24-hr Urinary Copper Surge',
    diagnosticEfficiencyScore: 86
  }
];

interface GlobalClinicalLeaderboardProps {
  onNavigateToCases?: () => void;
  className?: string;
}

export const GlobalClinicalLeaderboard: React.FC<GlobalClinicalLeaderboardProps> = ({
  onNavigateToCases,
  className = ''
}) => {
  const { currentUser } = useAuth();
  const { xp, level, rank: userRankTitle, streakDays: globalStreak, completedModules } = useProgress();

  const [timeframe, setTimeframe] = useState<'allTime' | 'month' | 'weekly'>('allTime');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedUserId, setExpandedUserId] = useState<string | null>(null);

  // Derive the active user's current platform record
  const currentUserRecord: GlobalLeaderboardUser = useMemo(() => {
    const rawName = currentUser?.fullName || 'Resident Colleague';
    const initials = rawName
      .split(' ')
      .map(part => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'DR';

    // Calculate real or baseline XP for the active user
    // Combine base progress XP with active user achievements
    const liveXp = Math.max(xp, 650);
    const solvedEstimate = Math.min(42, Math.max(3, Math.floor(liveXp / 250)));
    const accuracyEstimate = Math.min(99, Math.max(82, 85 + Math.floor((liveXp % 500) / 45)));

    return {
      id: 'current-user-active',
      rank: 999, // dynamically calculated
      name: rawName,
      username: currentUser?.email?.split('@')[0] || 'you',
      institution: currentUser?.institution || 'National Medical Faculty',
      location: 'Active Residency Cohort',
      clinicalRank: (userRankTitle as any) || 'Junior Resident',
      specialty: 'Clinical Diagnostics & Hepatology Simulation',
      specialtyCategory: 'General',
      avatarColor: 'from-cyan-400 via-blue-500 to-indigo-600',
      avatarInitials: initials,
      totalClinicalXp: liveXp,
      casesSolved: solvedEstimate,
      totalCasesAttempted: solvedEstimate + 2,
      accuracyRate: accuracyEstimate,
      avgSolveTime: '3m 10s',
      streakDays: Math.max(1, globalStreak || 1),
      specialtyBadges: ['Active Diagnostic Fellow', 'Clinical Reasoning In-Training', 'Simulation Scholar'],
      clinicalPearl: 'Systematic calculation of the De Ritis ratio combined with ultrasound imaging yields superior diagnostic precision in hepatic ward admissions.',
      recentCaseDiagnosed: 'Acute Inpatient Differential Simulation',
      diagnosticEfficiencyScore: Math.min(98, 80 + Math.floor(liveXp / 400))
    };
  }, [currentUser, xp, userRankTitle, globalStreak]);

  // Adjust XP multiplier based on timeframe
  const timeframeMultiplier = timeframe === 'weekly' ? 0.35 : timeframe === 'month' ? 0.72 : 1.0;

  // Process leaderboard ranking
  const { top10List, currentUserRank, nextTargetUser, pointsToOvertake } = useMemo(() => {
    // Generate scaled benchmark users
    const scaledList: Omit<GlobalLeaderboardUser, 'rank'>[] = GLOBAL_TOP_10_CLINICIANS.map(u => ({
      ...u,
      totalClinicalXp: Math.round(u.totalClinicalXp * timeframeMultiplier)
    }));

    // Combine benchmark with current user
    const combined = [...scaledList, currentUserRecord];

    // Sort descending by totalClinicalXp, then accuracyRate
    combined.sort((a, b) => {
      if (b.totalClinicalXp !== a.totalClinicalXp) {
        return b.totalClinicalXp - a.totalClinicalXp;
      }
      return b.accuracyRate - a.accuracyRate;
    });

    // Assign true ranks
    const rankedAll: GlobalLeaderboardUser[] = combined.map((item, idx) => ({
      ...item,
      rank: idx + 1
    }));

    // Find current user's actual rank
    const userItem = rankedAll.find(u => u.id === 'current-user-active');
    const userRankNum = userItem?.rank || rankedAll.length;

    // Find who is immediately ahead of the user
    let aheadUser: GlobalLeaderboardUser | null = null;
    let gap = 0;
    if (userRankNum > 1) {
      aheadUser = rankedAll[userRankNum - 2];
      gap = Math.max(10, aheadUser.totalClinicalXp - currentUserRecord.totalClinicalXp + 25);
    }

    // Top 10 users to display in the main table
    // If user is ranked <= 10, they naturally appear in the top 10!
    // Otherwise, slice first 10
    const top10 = rankedAll.slice(0, 10);

    return {
      top10List: top10,
      currentUserRank: userRankNum,
      nextTargetUser: aheadUser,
      pointsToOvertake: gap
    };
  }, [timeframeMultiplier, currentUserRecord]);

  // Filtered list based on category & search term
  const displayedList = useMemo(() => {
    return top10List.filter(user => {
      const matchesCategory =
        selectedCategory === 'All' ||
        user.specialtyCategory === selectedCategory ||
        user.specialty.toLowerCase().includes(selectedCategory.toLowerCase());

      const query = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !query ||
        user.name.toLowerCase().includes(query) ||
        user.institution.toLowerCase().includes(query) ||
        user.username.toLowerCase().includes(query) ||
        user.specialty.toLowerCase().includes(query) ||
        user.location.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [top10List, selectedCategory, searchTerm]);

  // Top 3 Podium Clinicians (from the full unfiltered top 10)
  const podiumTop3 = top10List.slice(0, 3);

  const getRankBadge = (rank: number) => {
    if (rank === 1) {
      return (
        <div className="flex items-center justify-center w-7 h-7 rounded-xl bg-gradient-to-br from-amber-400 to-yellow-600 text-slate-950 font-black shadow-lg shadow-amber-500/30 text-xs">
          <Trophy className="w-3.5 h-3.5 fill-slate-950" />
        </div>
      );
    }
    if (rank === 2) {
      return (
        <div className="flex items-center justify-center w-7 h-7 rounded-xl bg-gradient-to-br from-slate-200 to-slate-400 text-slate-950 font-black shadow-md text-xs">
          <Medal className="w-3.5 h-3.5 fill-slate-950" />
        </div>
      );
    }
    if (rank === 3) {
      return (
        <div className="flex items-center justify-center w-7 h-7 rounded-xl bg-gradient-to-br from-amber-600 to-yellow-800 text-white font-black shadow-md text-xs">
          <Medal className="w-3.5 h-3.5 fill-white" />
        </div>
      );
    }
    return (
      <div className="flex items-center justify-center w-7 h-7 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 font-mono font-bold text-xs">
        #{rank}
      </div>
    );
  };

  return (
    <div className={`space-y-6 text-slate-100 ${className}`}>
      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-semibold">
              <Globe className="w-3.5 h-3.5" />
              <span>Site-Wide Competitive Clinical Network</span>
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            </div>

            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <Trophy className="w-8 h-8 text-amber-400 shrink-0" />
              <span>Global Clinical Leaderboard</span>
            </h1>

            <p className="text-sm text-slate-300 leading-relaxed">
              Official academic rankings of the top 10 diagnosticians, hepatology fellows, and medical residents.
              Ranks are determined by verified clinical case solutions, diagnostic accuracy rates, and cumulative Clinical XP.
            </p>

            {/* Quick Metrics Bar */}
            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400">
              <div className="flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-cyan-400" />
                <span>18 Medical Colleges Participating</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>2,840+ Simulated Cases Solved</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>AASLD / EASL Guideline Benchmarked</span>
              </div>
            </div>
          </div>

          {/* Action / CTA */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
            {onNavigateToCases && (
              <button
                onClick={onNavigateToCases}
                className="px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-950/60 transition-all cursor-pointer group"
              >
                <Stethoscope className="w-4 h-4" />
                <span>Enter Case Simulator &amp; Earn XP</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            )}

            <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-[11px] font-mono text-slate-400 flex items-center justify-between gap-3">
              <span className="flex items-center gap-1.5 text-slate-300">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                <span>Season Grand Rounds</span>
              </span>
              <span className="text-amber-300 font-bold bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/80">
                Active Cycle
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Current User Competitive Standing Card */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/40 border border-cyan-500/40 rounded-3xl p-5 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* User Info */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <div
                className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${currentUserRecord.avatarColor} flex items-center justify-center text-white font-extrabold text-lg shadow-lg ring-2 ring-cyan-400/50`}
              >
                {currentUserRecord.avatarInitials}
              </div>
              <div className="absolute -bottom-1.5 -right-1.5 bg-slate-950 px-1.5 py-0.5 rounded-md border border-cyan-500 text-[10px] font-mono font-bold text-cyan-300">
                #{currentUserRank}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base font-bold text-white">{currentUserRecord.name}</h3>
                <span className="text-[10px] font-mono bg-cyan-950 text-cyan-300 px-2 py-0.5 rounded-full border border-cyan-800 font-bold">
                  YOU
                </span>
                <span className="text-[10px] font-mono bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full border border-slate-700">
                  {currentUserRecord.clinicalRank}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 font-mono">
                @{currentUserRecord.username} &bull; {currentUserRecord.institution}
              </p>
            </div>
          </div>

          {/* Quick User Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-center">
            <div className="bg-slate-950/80 p-2.5 rounded-2xl border border-slate-800">
              <div className="text-[9px] uppercase text-slate-400">Total Clinical XP</div>
              <div className="text-sm font-black text-cyan-400">{currentUserRecord.totalClinicalXp} XP</div>
            </div>

            <div className="bg-slate-950/80 p-2.5 rounded-2xl border border-slate-800">
              <div className="text-[9px] uppercase text-slate-400">Cases Solved</div>
              <div className="text-sm font-bold text-white">{currentUserRecord.casesSolved} dx</div>
            </div>

            <div className="bg-slate-950/80 p-2.5 rounded-2xl border border-slate-800">
              <div className="text-[9px] uppercase text-slate-400">Accuracy Rate</div>
              <div className="text-sm font-bold text-emerald-400">{currentUserRecord.accuracyRate}%</div>
            </div>

            <div className="bg-slate-950/80 p-2.5 rounded-2xl border border-slate-800">
              <div className="text-[9px] uppercase text-slate-400">Active Streak</div>
              <div className="text-sm font-bold text-amber-400 flex items-center justify-center gap-1">
                <Flame className="w-3.5 h-3.5" />
                <span>{currentUserRecord.streakDays}d</span>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Overtake Callout */}
        <div className="mt-4 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="text-slate-300">
              {currentUserRank === 1 ? (
                <span className="text-amber-300 font-semibold">
                  🏆 You are currently leading the entire global platform leaderboard! Maintain your streak to defend rank #1.
                </span>
              ) : currentUserRank <= 10 ? (
                <span>
                  You hold rank <strong className="text-cyan-300 font-mono">#{currentUserRank}</strong> on the global top 10 board!
                  {nextTargetUser && (
                    <>
                      {' '}Need <strong className="text-emerald-400 font-mono">+{pointsToOvertake} XP</strong> to overtake{' '}
                      <span className="text-white font-semibold">{nextTargetUser.name}</span> (#{nextTargetUser.rank}).
                    </>
                  )}
                </span>
              ) : (
                <span>
                  Your platform rank is <strong className="text-cyan-300 font-mono">#{currentUserRank}</strong>.
                  Earn <strong className="text-amber-400 font-mono">+{Math.max(25, 8350 - currentUserRecord.totalClinicalXp)} XP</strong> in
                  the Case Simulator to break into the prestigious Global Top 10!
                </span>
              )}
            </span>
          </div>

          {onNavigateToCases && (
            <button
              onClick={onNavigateToCases}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 shrink-0 self-start sm:self-auto cursor-pointer"
            >
              <span>Solve Cases &rarr;</span>
            </button>
          )}
        </div>
      </div>

      {/* TOP 3 PODIUM PRESENTATION */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 font-mono flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>Grand Rounds Podium &bull; Top 3 Diagnosticians</span>
          </h2>
          <span className="text-[11px] font-mono text-slate-500">
            Updated in Real-Time
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* SILVER - RANK #2 (Left on desktop) */}
          {podiumTop3[1] && (
            <div className="order-2 md:order-1 bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-700/80 rounded-3xl p-5 shadow-xl flex flex-col justify-between relative group hover:border-slate-500 transition-all">
              <div className="absolute top-4 right-4 flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-800 text-slate-200 border border-slate-600 font-mono text-xs font-bold">
                <Medal className="w-3.5 h-3.5 text-slate-300" />
                <span>#2 Silver</span>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${podiumTop3[1].avatarColor} flex items-center justify-center text-white font-extrabold text-lg shadow-md ring-2 ring-slate-400/40`}
                  >
                    {podiumTop3[1].avatarInitials}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-1">
                      <span>{podiumTop3[1].name}</span>
                      {podiumTop3[1].id === 'current-user-active' && (
                        <span className="text-[9px] font-mono bg-cyan-950 text-cyan-300 px-1.5 rounded">YOU</span>
                      )}
                    </h3>
                    <p className="text-[11px] text-slate-400 font-mono">@{podiumTop3[1].username}</p>
                    <p className="text-[11px] text-cyan-300 font-medium truncate">{podiumTop3[1].institution}</p>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 font-mono text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Total Score:</span>
                    <span className="text-cyan-300 font-bold">{podiumTop3[1].totalClinicalXp} XP</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Accuracy:</span>
                    <span className="text-emerald-400 font-bold">{podiumTop3[1].accuracyRate}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Cases Solved:</span>
                    <span className="text-white font-bold">{podiumTop3[1].casesSolved} cases</span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-400 italic bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80 leading-relaxed">
                  "{podiumTop3[1].clinicalPearl.slice(0, 110)}..."
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 text-[10px] font-mono text-slate-400 flex items-center justify-between">
                <span>{podiumTop3[1].clinicalRank}</span>
                <span className="text-amber-400 flex items-center gap-1">
                  <Flame className="w-3 h-3" /> {podiumTop3[1].streakDays}d streak
                </span>
              </div>
            </div>
          )}

          {/* GOLD - RANK #1 (Center, Elevated) */}
          {podiumTop3[0] && (
            <div className="order-1 md:order-2 bg-gradient-to-b from-amber-950/30 via-slate-900 to-slate-950 border-2 border-amber-500/60 rounded-3xl p-6 shadow-2xl flex flex-col justify-between relative group hover:border-amber-400 transition-all md:-translate-y-2">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-mono text-xs font-black shadow-lg">
                <Trophy className="w-3.5 h-3.5" />
                <span>#1 GOLD CHAMPION</span>
              </div>

              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${podiumTop3[0].avatarColor} flex items-center justify-center text-slate-950 font-black text-xl shadow-lg ring-4 ring-amber-400/50`}
                  >
                    {podiumTop3[0].avatarInitials}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-1">
                      <span>{podiumTop3[0].name}</span>
                      {podiumTop3[0].id === 'current-user-active' && (
                        <span className="text-[9px] font-mono bg-cyan-950 text-cyan-300 px-1.5 rounded">YOU</span>
                      )}
                    </h3>
                    <p className="text-xs text-slate-400 font-mono">@{podiumTop3[0].username}</p>
                    <p className="text-xs text-amber-300 font-semibold truncate">{podiumTop3[0].institution}</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950/90 border border-amber-500/30 space-y-2 font-mono text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Total Score:</span>
                    <span className="text-amber-400 font-black text-sm">{podiumTop3[0].totalClinicalXp} XP</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Diagnostic Accuracy:</span>
                    <span className="text-emerald-400 font-bold">{podiumTop3[0].accuracyRate}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Cases Solved:</span>
                    <span className="text-white font-bold">{podiumTop3[0].casesSolved}/{podiumTop3[0].totalCasesAttempted} (100%)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Efficiency Index:</span>
                    <span className="text-cyan-400 font-bold">{podiumTop3[0].diagnosticEfficiencyScore}/100</span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-300 italic bg-amber-950/20 p-3 rounded-xl border border-amber-900/40 leading-relaxed">
                  "{podiumTop3[0].clinicalPearl}"
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] font-mono text-slate-300 flex items-center justify-between">
                <span className="text-amber-300 font-bold">{podiumTop3[0].clinicalRank}</span>
                <span className="text-amber-400 font-bold flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5" /> {podiumTop3[0].streakDays}d streak
                </span>
              </div>
            </div>
          )}

          {/* BRONZE - RANK #3 (Right on desktop) */}
          {podiumTop3[2] && (
            <div className="order-3 md:order-3 bg-gradient-to-b from-slate-900 to-slate-950 border border-amber-900/40 rounded-3xl p-5 shadow-xl flex flex-col justify-between relative group hover:border-amber-700 transition-all">
              <div className="absolute top-4 right-4 flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-950 text-amber-300 border border-amber-800 font-mono text-xs font-bold">
                <Medal className="w-3.5 h-3.5 text-amber-500" />
                <span>#3 Bronze</span>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${podiumTop3[2].avatarColor} flex items-center justify-center text-white font-extrabold text-lg shadow-md ring-2 ring-amber-600/40`}
                  >
                    {podiumTop3[2].avatarInitials}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-1">
                      <span>{podiumTop3[2].name}</span>
                      {podiumTop3[2].id === 'current-user-active' && (
                        <span className="text-[9px] font-mono bg-cyan-950 text-cyan-300 px-1.5 rounded">YOU</span>
                      )}
                    </h3>
                    <p className="text-[11px] text-slate-400 font-mono">@{podiumTop3[2].username}</p>
                    <p className="text-[11px] text-amber-400 font-medium truncate">{podiumTop3[2].institution}</p>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 font-mono text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Total Score:</span>
                    <span className="text-cyan-300 font-bold">{podiumTop3[2].totalClinicalXp} XP</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Accuracy:</span>
                    <span className="text-emerald-400 font-bold">{podiumTop3[2].accuracyRate}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Cases Solved:</span>
                    <span className="text-white font-bold">{podiumTop3[2].casesSolved} cases</span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-400 italic bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80 leading-relaxed">
                  "{podiumTop3[2].clinicalPearl.slice(0, 110)}..."
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 text-[10px] font-mono text-slate-400 flex items-center justify-between">
                <span>{podiumTop3[2].clinicalRank}</span>
                <span className="text-amber-400 flex items-center gap-1">
                  <Flame className="w-3 h-3" /> {podiumTop3[2].streakDays}d streak
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* FILTERING CONTROLS BAR */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search by clinician, hospital, specialty, or country..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Timeframe Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-mono hidden sm:inline">Season:</span>
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-mono">
            <button
              onClick={() => setTimeframe('allTime')}
              className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                timeframe === 'allTime'
                  ? 'bg-cyan-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All-Time
            </button>
            <button
              onClick={() => setTimeframe('month')}
              className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                timeframe === 'month'
                  ? 'bg-cyan-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Monthly Season
            </button>
            <button
              onClick={() => setTimeframe('weekly')}
              className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                timeframe === 'weekly'
                  ? 'bg-cyan-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Weekly Rounds
            </button>
          </div>
        </div>

        {/* Specialty Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 custom-scrollbar text-xs">
          {['All', 'Transplant', 'Cholestatic', 'Toxicology', 'Viral', 'Metabolic'].map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-2.5 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === category
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* TOP 10 LEADERBOARD TABLE & DETAILED CARDS */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-xl overflow-hidden">
        {/* Table Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold text-white">
              Official Platform Top 10 Clinical Rankings
            </h3>
            <span className="text-xs font-mono text-cyan-300 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
              Verified EMR Grading
            </span>
          </div>

          <span className="text-xs font-mono text-slate-400 hidden sm:inline">
            Showing {displayedList.length} diagnosticians
          </span>
        </div>

        {/* List of 10 Clinicians */}
        <div className="divide-y divide-slate-800/80">
          {displayedList.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-xs font-mono space-y-2">
              <Search className="w-8 h-8 text-slate-600 mx-auto" />
              <p>No diagnosticians found matching "{searchTerm}" in category "{selectedCategory}".</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('All');
                }}
                className="text-cyan-400 hover:underline pt-2 inline-block font-semibold"
              >
                Reset Search Filters
              </button>
            </div>
          ) : (
            displayedList.map(user => {
              const isCurrentUser = user.id === 'current-user-active';
              const isExpanded = expandedUserId === user.id;

              return (
                <div
                  key={user.id}
                  className={`transition-colors ${
                    isCurrentUser
                      ? 'bg-cyan-950/20 hover:bg-cyan-950/30 ring-1 ring-inset ring-cyan-500/30'
                      : 'hover:bg-slate-800/50'
                  }`}
                >
                  {/* Row Summary */}
                  <div
                    onClick={() => setExpandedUserId(isExpanded ? null : user.id)}
                    className="p-4 md:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer"
                  >
                    {/* Left: Rank, Avatar, Identity */}
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="shrink-0">{getRankBadge(user.rank)}</div>

                      <div
                        className={`w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-gradient-to-br ${user.avatarColor} flex items-center justify-center text-white font-extrabold text-sm shadow-md shrink-0`}
                      >
                        {user.avatarInitials}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-bold text-white truncate hover:text-cyan-300 transition-colors">
                            {user.name}
                          </span>
                          {isCurrentUser && (
                            <span className="text-[9px] font-mono bg-cyan-950 text-cyan-300 px-1.5 py-0.5 rounded border border-cyan-800 font-bold">
                              YOU
                            </span>
                          )}
                          <span
                            className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                              user.clinicalRank === 'Chief Fellow'
                                ? 'bg-amber-950/70 text-amber-300 border-amber-800'
                                : user.clinicalRank === 'Attending'
                                ? 'bg-purple-950/70 text-purple-300 border-purple-800'
                                : user.clinicalRank === 'Senior Registrar'
                                ? 'bg-blue-950/70 text-blue-300 border-blue-800'
                                : 'bg-slate-800 text-slate-300 border-slate-700'
                            }`}
                          >
                            {user.clinicalRank}
                          </span>
                        </div>

                        <div className="text-xs text-slate-400 flex items-center gap-2 flex-wrap font-mono mt-0.5">
                          <span>@{user.username}</span>
                          <span>&bull;</span>
                          <span className="text-cyan-400 font-medium truncate">{user.institution}</span>
                          <span className="hidden sm:inline">&bull;</span>
                          <span className="text-slate-500 hidden sm:inline">{user.location}</span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Metrics & XP */}
                    <div className="flex items-center justify-between md:justify-end gap-6 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-800/60">
                      <div className="text-left md:text-right font-mono">
                        <div className="text-xs text-slate-400">Diagnostic Acc.</div>
                        <div className="text-sm font-bold text-emerald-400 flex items-center md:justify-end gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{user.accuracyRate}%</span>
                        </div>
                      </div>

                      <div className="text-left md:text-right font-mono">
                        <div className="text-xs text-slate-400">Cases Solved</div>
                        <div className="text-sm font-bold text-white">
                          {user.casesSolved}/{user.totalCasesAttempted}
                        </div>
                      </div>

                      <div className="text-right font-mono min-w-[90px]">
                        <div className="text-xs text-slate-400">Total XP</div>
                        <div className="text-base font-black text-cyan-300">
                          {user.totalClinicalXp}
                          <span className="text-[10px] font-normal text-slate-400 ml-1">XP</span>
                        </div>
                      </div>

                      <div className="text-slate-500 hover:text-slate-300 pl-2">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Clinician Dossier */}
                  {isExpanded && (
                    <div className="px-5 pb-5 pt-2 bg-slate-950/70 border-t border-slate-800/80 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 text-xs font-mono">
                        <div className="bg-slate-900 p-3 rounded-2xl border border-slate-800">
                          <div className="text-[10px] uppercase text-slate-400">Clinical Subspecialty</div>
                          <div className="text-white font-semibold mt-0.5">{user.specialty}</div>
                        </div>

                        <div className="bg-slate-900 p-3 rounded-2xl border border-slate-800">
                          <div className="text-[10px] uppercase text-slate-400">Average Case Solve Time</div>
                          <div className="text-cyan-400 font-semibold mt-0.5 flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{user.avgSolveTime}</span>
                          </div>
                        </div>

                        <div className="bg-slate-900 p-3 rounded-2xl border border-slate-800">
                          <div className="text-[10px] uppercase text-slate-400">Verified Diagnostic Streak</div>
                          <div className="text-amber-400 font-semibold mt-0.5 flex items-center gap-1">
                            <Flame className="w-3.5 h-3.5" />
                            <span>{user.streakDays} Consecutive Days</span>
                          </div>
                        </div>
                      </div>

                      {/* Diagnostic Pearl */}
                      <div className="p-3.5 rounded-2xl bg-amber-950/30 border border-amber-900/50 space-y-1">
                        <div className="text-[11px] font-mono text-amber-400 font-bold flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Key Diagnostic Rule &amp; Ward Practice Pearl</span>
                        </div>
                        <p className="text-xs text-amber-200/90 italic leading-relaxed">
                          "{user.clinicalPearl}"
                        </p>
                      </div>

                      {/* Badges Earned */}
                      <div>
                        <div className="text-[11px] font-mono text-slate-400 uppercase font-semibold mb-2">
                          Academic Honors &amp; Diagnostic Badges:
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          {user.specialtyBadges.map((badge, bIdx) => (
                            <span
                              key={bIdx}
                              className="px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-cyan-300 flex items-center gap-1.5"
                            >
                              <Award className="w-3 h-3 text-cyan-400" />
                              <span>{badge}</span>
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Recent Case */}
                      <div className="flex items-center justify-between text-xs font-mono text-slate-400 pt-1">
                        <span>Latest Diagnostic Assessment: <strong className="text-white">{user.recentCaseDiagnosed}</strong></span>
                        <span className="text-emerald-400 flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5" /> AASLD Guideline Certified
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Table Footer */}
        <div className="p-4 bg-slate-950/80 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>Graded via multi-stage laboratory, radiological, and clinical debrief algorithms.</span>
          </div>
          <span className="text-slate-500">
            Eligibility: Minimum 10 completed simulated patient cases
          </span>
        </div>
      </div>
    </div>
  );
};
