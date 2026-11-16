/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import {
  Activity,
  BookOpen,
  Cpu,
  Database,
  Eye,
  Gamepad2,
  HeartPulse,
  Bot,
  ShieldAlert,
  Layers,
  Users,
  Menu,
  X,
  Sparkles,
  PhoneCall,
  CheckCircle,
  ArrowRight,
  Flame,
  Trophy,
  Download,
  Upload,
  RotateCcw,
  ShieldCheck,
  Check,
  AlertTriangle,
  Zap,
  User,
  LogIn,
  UserPlus,
  Stethoscope,
  Sun,
  Moon,
  Hospital,
  MessageSquare,
  GraduationCap
} from 'lucide-react';

import { ThreeLiverViewer } from './components/ThreeLiverViewer';
import { ClinicalPredictor } from './components/ClinicalPredictor';
import { ClinicalCaseSimulator } from './components/ClinicalCaseSimulator';
import { ClinicalIntelligenceSuite } from './components/ClinicalIntelligenceSuite';
import { DatasetDashboard } from './components/DatasetDashboard';
import { ComputerVisionScreening } from './components/ComputerVisionScreening';
import { MLLabView } from './components/MLLabView';
import { LearningModules } from './components/LearningModules';
import { ClinicalEthicsFirstAid } from './components/ClinicalEthicsFirstAid';
import { PlayArcade } from './components/PlayArcade';
import { CommunityHub } from './components/CommunityHub';
import { AITutorModal } from './components/AITutorModal';
import { GlobalSearchBar } from './components/GlobalSearchBar';
import { LoginPage } from './components/auth/LoginPage';
import { SignUpPage } from './components/auth/SignUpPage';
import { ProfilePage } from './components/auth/ProfilePage';
import { HospitalCaseRegistry } from './components/HospitalCaseRegistry';
import { MedicalLibraryHub } from './components/MedicalLibraryHub';
import { MedicalBlogsForum } from './components/MedicalBlogsForum';

// Generated High-Resolution Medical Textbook Illustrations
import liverAnatomyImg from './assets/images/liver_clinical_anatomy_1794117792828.jpg';
import liverStagesImg from './assets/images/liver_disease_stages_1794117770269.jpg';

import { ProgressProvider, useProgress } from './context/ProgressContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';

type ActiveView =
  | 'home'
  | 'hospital_cases'
  | 'cases'
  | 'learn'
  | 'library'
  | 'blogs'
  | 'intelligence'
  | 'predictor'
  | 'anatomy'
  | 'dashboard'
  | 'screening'
  | 'mllab'
  | 'ethics'
  | 'play'
  | 'community'
  | 'login'
  | 'signup'
  | 'profile';

function MainAppLayout() {
  const [activeView, setActiveView] = useState<ActiveView>('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAITutorOpen, setIsAITutorOpen] = useState(false);
  const [isDataModalOpen, setIsDataModalOpen] = useState(false);
  const [resetConfirming, setResetConfirming] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Deep-link state from Global Search
  const [selectedCaseIdForSim, setSelectedCaseIdForSim] = useState<string | null>(null);
  const [selectedTabForSim, setSelectedTabForSim] = useState<'chart' | 'labs' | 'imaging' | 'diagnosis' | 'debrief' | null>(null);
  const [selectedModuleIdForLearn, setSelectedModuleIdForLearn] = useState<number | null>(null);
  const [selectedTabForIntel, setSelectedTabForIntel] = useState<any>(null);
  const [selectedTabForDash, setSelectedTabForDash] = useState<'demographics' | 'models' | 'sql' | null>(null);

  const { currentUser, isAuthenticated } = useAuth();
  const { theme, isDark, toggleTheme } = useTheme();

  const {
    xp,
    level,
    rank,
    streakDays,
    completedModules,
    unlockedBadgeIds,
    gameStats,
    storageEngine,
    exportDataJSON,
    importDataJSON,
    resetProgress,
    activeNotification,
    dismissNotification
  } = useProgress();

  const navigationItems = [
    { id: 'home', label: 'Overview', icon: Activity },
    { id: 'hospital_cases', label: 'Hospital Cases', icon: Hospital },
    { id: 'cases', label: 'Case Simulator', icon: Stethoscope },
    { id: 'learn', label: 'Curriculum', icon: BookOpen },
    { id: 'library', label: 'Medical Library', icon: GraduationCap },
    { id: 'blogs', label: 'Medical Blogs & Forum', icon: MessageSquare },
    { id: 'intelligence', label: 'AI Clinical Suite', icon: Sparkles },
    { id: 'predictor', label: 'Risk Predictor', icon: Activity },
    { id: 'anatomy', label: '3D Anatomy', icon: Layers },
    { id: 'dashboard', label: 'ILPD Dashboard', icon: Database },
    { id: 'screening', label: 'CV Screener', icon: Eye },
    { id: 'mllab', label: 'ML Lab', icon: Cpu },
    { id: 'ethics', label: 'Ethics & First-Aid', icon: ShieldAlert },
    { id: 'play', label: 'Play Arcade', icon: Gamepad2 },
    { id: 'community', label: 'Leaderboard & Hub', icon: Trophy },
    { id: 'profile', label: 'My Profile', icon: User }
  ];

  // Handle Portfolio Export
  const handleExportPortfolio = () => {
    try {
      const dataStr = exportDataJSON();
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `digital_health_portfolio_${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Export failed:', e);
    }
  };

  // Handle Portfolio Import
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      const text = evt.target?.result;
      if (typeof text === 'string') {
        const success = await importDataJSON(text);
        if (success) {
          setIsDataModalOpen(false);
        }
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Calculate overall curriculum percent
  const curriculumPercent = Math.round((completedModules.length / 10) * 100);

  // Calculate completed games count
  const completedGamesCount = Object.values(gameStats).filter((g) => g.completed).length;

  // Handle Global Search Navigation with Deep-Linking
  const handleGlobalSearchNavigate = (
    viewId: string,
    options?: {
      caseId?: string;
      caseTab?: 'chart' | 'labs' | 'imaging' | 'diagnosis' | 'debrief';
      moduleId?: number;
      intelligenceTab?: string;
      dashboardTab?: 'demographics' | 'models' | 'sql';
    }
  ) => {
    if (options?.caseId) {
      setSelectedCaseIdForSim(options.caseId);
    }
    if (options?.caseTab) {
      setSelectedTabForSim(options.caseTab);
    }
    if (options?.moduleId) {
      setSelectedModuleIdForLearn(options.moduleId);
    }
    if (options?.intelligenceTab) {
      setSelectedTabForIntel(options.intelligenceTab);
    }
    if (options?.dashboardTab) {
      setSelectedTabForDash(options.dashboardTab);
    }
    setActiveView(viewId as ActiveView);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div
      className={`min-h-screen ${
        isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
      } flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950 transition-colors duration-200`}
    >
      {/* Hidden File Input for JSON Portfolio Import */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Accessibility Skip Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-cyan-500 text-slate-950 font-bold px-3 py-1.5 rounded-lg z-50 text-xs"
      >
        Skip to main content
      </a>

      {/* Top Banner: Emergency 112 Telephony & Educational Disclaimer */}
      <aside
        aria-label="Emergency and educational notification"
        className={`border-b px-4 py-1.5 text-[11px] flex items-center justify-between transition-colors ${
          isDark
            ? 'bg-slate-900 border-slate-800 text-slate-300'
            : 'bg-slate-100 border-slate-200 text-slate-700'
        }`}
      >
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-rose-500 font-bold">
            <PhoneCall className="w-3 h-3" /> India National Universal Emergency: Dial 112
          </span>
          <span className={`hidden md:inline ${isDark ? 'text-slate-600' : 'text-slate-300'}`}>|</span>
          <span className={`hidden md:inline ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            For acute medical resuscitation, poison control, or traumatic hemorrhage.
          </span>
        </div>
        <div className={`font-medium font-mono text-[10px] ${isDark ? 'text-amber-300/90' : 'text-amber-700'}`}>
          EDUCATIONAL MEDICAL PLATFORM &bull; NOT A CLINICAL DIAGNOSTIC DEVICE
        </div>
      </aside>

      {/* Primary Navigation Bar with Persistent Progress Bar */}
      <header
        className={`sticky top-0 z-40 backdrop-blur-md border-b transition-colors ${
          isDark
            ? 'bg-slate-950/95 border-slate-800'
            : 'bg-white/95 border-slate-200 shadow-xs'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3 sm:gap-4">
          {/* Logo & Brand Lockup */}
          <button
            onClick={() => setActiveView('home')}
            className="flex items-center gap-3 text-left cursor-pointer group shrink-0"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-cyan-950/30 border border-cyan-400/30 group-hover:scale-105 transition-transform">
              <HeartPulse className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-black tracking-tight flex items-center gap-2">
                <span className={isDark ? 'text-white' : 'text-slate-900'}>Digitalization in Healthcare</span>
                <span
                  className={`hidden sm:inline-block px-1.5 py-0.2 text-[9px] font-mono rounded border ${
                    isDark
                      ? 'bg-cyan-950 text-cyan-300 border-cyan-800'
                      : 'bg-cyan-50 text-cyan-700 border-cyan-200'
                  }`}
                >
                  ILPD ML
                </span>
              </div>
              <div className={`text-[11px] font-medium hidden sm:block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Medical Data Science &amp; Clinical Informatics Platform
              </div>
            </div>
          </button>

          {/* Global Search Bar (Prominent in Header) */}
          <div className="flex-1 max-w-xs xl:max-w-sm hidden md:block">
            <GlobalSearchBar onNavigate={handleGlobalSearchNavigate} className="w-full" />
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Right Header Status: Search (Mobile), Student Stats, Theme Toggle, Profile & AI Tutor */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Mobile Global Search Button */}
            <div className="md:hidden">
              <GlobalSearchBar onNavigate={handleGlobalSearchNavigate} />
            </div>
            {/* Student Stats Pill (XP, Streak, Level) */}
            <div
              onClick={() => setIsDataModalOpen(true)}
              title="Click to view Persistent State & Storage Backup"
              className={`hidden lg:flex items-center gap-2 border px-2.5 py-1.5 rounded-xl cursor-pointer transition-all text-xs ${
                isDark
                  ? 'bg-slate-900 hover:bg-slate-850 border-slate-800 hover:border-cyan-500/50'
                  : 'bg-slate-100 hover:bg-slate-200 border-slate-200 hover:border-cyan-500/50'
              }`}
            >
              <div className="flex items-center gap-1 text-amber-500 dark:text-amber-400 font-bold">
                <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                <span>{streakDays}d</span>
              </div>
              <span className={isDark ? 'text-slate-700' : 'text-slate-300'}>|</span>
              <div className="flex items-center gap-1 text-cyan-600 dark:text-cyan-300 font-semibold font-mono">
                <Trophy className="w-3.5 h-3.5 text-cyan-500 dark:text-cyan-400" />
                <span>{xp} XP</span>
              </div>
              <span className={isDark ? 'text-slate-700' : 'text-slate-300'}>|</span>
              <span
                className={`text-[11px] px-1.5 py-0.5 rounded font-mono border ${
                  isDark
                    ? 'text-indigo-300 bg-indigo-950/60 border-indigo-800/60'
                    : 'text-indigo-700 bg-indigo-50 border-indigo-200'
                }`}
              >
                Lv {level}
              </span>
            </div>

            {/* Persistent Data Backup Trigger */}
            <button
              onClick={() => setIsDataModalOpen(true)}
              className={`border p-2 rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                isDark
                  ? 'bg-slate-900 hover:bg-slate-850 border-slate-800 text-slate-300 hover:text-white'
                  : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700 hover:text-slate-900'
              }`}
              title="State & Storage Manager (IndexedDB / LocalStorage)"
              aria-label="State and storage manager"
            >
              <Database className="w-4 h-4 text-cyan-500 dark:text-cyan-400" />
              <span className="hidden xl:inline text-[11px] font-mono">Sync</span>
            </button>

            {/* Global Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className={`px-2.5 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                isDark
                  ? 'bg-slate-900 hover:bg-slate-850 border-slate-800 text-slate-200 hover:text-white hover:border-amber-400/50 shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-800 hover:text-slate-950 hover:border-indigo-500/50 shadow-xs'
              }`}
              title={
                isDark
                  ? 'Switch to Clinical White theme (bright office mode) [Shortcut: Alt+T]'
                  : 'Switch to High-Contrast Dark theme (diagnostic lab mode) [Shortcut: Alt+T]'
              }
              aria-label="Toggle clinical color theme"
            >
              {isDark ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span className="hidden sm:inline text-[11px] text-amber-300 font-bold">
                    Clinical White
                  </span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                  <span className="hidden sm:inline text-[11px] text-indigo-950 font-bold">
                    Dark Room
                  </span>
                </>
              )}
            </button>

            {/* User Profile Chip / Authentication Trigger */}
            {currentUser ? (
              <button
                onClick={() => setActiveView('profile')}
                className={`flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-xl border transition-all cursor-pointer ${
                  activeView === 'profile'
                    ? 'bg-cyan-500/15 border-cyan-400 text-cyan-600 dark:text-white shadow-xs'
                    : isDark
                    ? 'bg-slate-900 border-slate-800 hover:border-cyan-500/60 text-slate-300 hover:text-white'
                    : 'bg-slate-100 border-slate-200 hover:border-cyan-500/60 text-slate-700 hover:text-slate-900'
                }`}
                title="View Full Clinical Profile & Credentials"
              >
                <div className="relative">
                  <img
                    src={currentUser.avatarUrl}
                    alt={currentUser.fullName}
                    className="w-7 h-7 rounded-lg object-cover border border-cyan-400/40 shrink-0"
                  />
                  <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-slate-950 dark:ring-slate-950" />
                </div>
                <div className="hidden sm:block text-left text-xs leading-none">
                  <div className={`font-bold truncate max-w-[100px] ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {currentUser.fullName}
                  </div>
                  <div className="text-[10px] text-cyan-600 dark:text-cyan-400 truncate max-w-[100px] mt-0.5">
                    {currentUser.role.split(' ')[0]}
                  </div>
                </div>
              </button>
            ) : (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setActiveView('login')}
                  className={`px-2.5 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1 ${
                    isDark
                      ? 'bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-800'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200'
                  }`}
                >
                  <LogIn className="w-3.5 h-3.5 text-cyan-500 dark:text-cyan-400" />
                  <span>Sign In</span>
                </button>
                <button
                  onClick={() => setActiveView('signup')}
                  className="px-2.5 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold flex items-center gap-1"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Register</span>
                </button>
              </div>
            )}

            {/* AI Medical Tutor Modal Trigger */}
            <button
              onClick={() => setIsAITutorOpen(true)}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold px-3 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-lg shadow-cyan-950/20 transition-all cursor-pointer shrink-0"
            >
              <Bot className="w-4 h-4" />
              <span className="hidden lg:inline">Ask AI Tutor</span>
            </button>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`md:hidden p-2 rounded-xl border ${
                isDark
                  ? 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
                  : 'bg-slate-100 border-slate-200 text-slate-700 hover:text-slate-900'
              }`}
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Sub-Header Horizontal Navigation Strip for Desktop & Tablet */}
        <div
          className={`hidden md:flex border-t items-center px-4 sm:px-6 lg:px-8 overflow-x-auto py-2 gap-1.5 scrollbar-thin transition-colors ${
            isDark ? 'bg-slate-950/80 border-slate-900' : 'bg-slate-50/90 border-slate-200'
          }`}
        >
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id as ActiveView)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                    : isDark
                    ? 'text-slate-300 hover:text-white hover:bg-slate-900 border border-transparent hover:border-slate-800'
                    : 'text-slate-700 hover:text-slate-950 hover:bg-white border border-transparent hover:border-slate-200 shadow-xs'
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div
            className={`md:hidden border-b p-4 space-y-2 text-xs transition-colors ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-lg'
            }`}
          >
            {/* Mobile Global Search Bar */}
            <div className="mb-2">
              <GlobalSearchBar
                onNavigate={(v, opts) => {
                  handleGlobalSearchNavigate(v, opts);
                  setIsMobileMenuOpen(false);
                }}
                className="w-full"
              />
            </div>

            {/* Mobile Quick Theme Switcher */}
            <button
              onClick={toggleTheme}
              className={`w-full py-2.5 px-3 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all mb-2 cursor-pointer ${
                isDark
                  ? 'bg-slate-950 border-slate-800 text-slate-200 hover:border-amber-400/50'
                  : 'bg-slate-50 border-slate-200 text-slate-800 hover:border-indigo-400/50'
              }`}
            >
              <div className="flex items-center gap-2">
                {isDark ? (
                  <Sun className="w-4 h-4 text-amber-400" />
                ) : (
                  <Moon className="w-4 h-4 text-indigo-600" />
                )}
                <span>Display Theme</span>
              </div>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded border font-bold ${
                  isDark
                    ? 'bg-amber-950/70 text-amber-300 border-amber-800'
                    : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                }`}
              >
                {isDark ? '☀️ Switch to Clinical White' : '🌙 Switch to Dark Room'}
              </span>
            </button>
            {/* Active User Card Mobile */}
            {currentUser ? (
              <div
                onClick={() => {
                  setActiveView('profile');
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center gap-3 p-3 rounded-2xl bg-slate-950 border border-slate-800 cursor-pointer hover:border-cyan-500 mb-2"
              >
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.fullName}
                  className="w-10 h-10 rounded-xl object-cover border border-cyan-400/50"
                />
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-white truncate text-xs">
                    {currentUser.titlePrefix} {currentUser.fullName}
                  </div>
                  <div className="text-[11px] text-cyan-400 truncate">{currentUser.role}</div>
                  <div className="text-[10px] text-slate-500 truncate">{currentUser.institution}</div>
                </div>
                <span className="text-[10px] font-mono bg-cyan-950 text-cyan-300 px-2 py-0.5 rounded border border-cyan-800">
                  Profile &rarr;
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2 mb-2">
                <button
                  onClick={() => {
                    setActiveView('login');
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex-1 py-2 rounded-xl bg-slate-800 text-white font-semibold text-center text-xs"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    setActiveView('signup');
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex-1 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-center text-xs"
                >
                  Register Profile
                </button>
              </div>
            )}

            {/* Student Stats Bar Mobile */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800 mb-2">
              <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                <Flame className="w-3.5 h-3.5 fill-amber-400" />
                <span>{streakDays} Day Streak</span>
              </div>
              <div className="text-cyan-300 font-mono font-bold">{xp} Clinical XP</div>
              <span className="text-[10px] text-indigo-300 bg-indigo-950 px-2 py-0.5 rounded font-mono">
                Level {level}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-1.5">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveView(item.id as ActiveView);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`p-2 rounded-xl transition-all flex items-center gap-2 text-left ${
                      isActive
                        ? 'bg-cyan-500 text-slate-950 font-bold'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => {
                setIsDataModalOpen(true);
                setIsMobileMenuOpen(false);
              }}
              className="w-full mt-2 py-2 text-center rounded-xl bg-slate-800 text-cyan-300 hover:bg-slate-700 flex items-center justify-center gap-2 text-xs font-semibold"
            >
              <Database className="w-3.5 h-3.5" />
              <span>Storage &amp; Portfolio Backups</span>
            </button>
          </div>
        )}
      </header>

      {/* Floating In-App Progress Toast Notification */}
      {activeNotification && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 bg-slate-900 border border-cyan-500/50 shadow-2xl p-3.5 rounded-2xl max-w-sm text-xs animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
            {activeNotification.type === 'xp' ? (
              <Zap className="w-4 h-4 text-amber-400" />
            ) : activeNotification.type === 'badge' ? (
              <Trophy className="w-4 h-4 text-cyan-400" />
            ) : (
              <CheckCircle className="w-4 h-4 text-emerald-400" />
            )}
          </div>
          <div className="flex-1 pr-1">
            <div className="font-semibold text-white text-[12px]">{activeNotification.message}</div>
            <div className="text-[10px] text-slate-400 font-mono mt-0.5">
              Saved via {storageEngine}
            </div>
          </div>
          <button
            onClick={dismissNotification}
            className="text-slate-500 hover:text-white p-1"
            aria-label="Dismiss notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Content Viewport */}
      <main id="main-content" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        {/* OVERVIEW / HOME VIEW */}
        {activeView === 'home' && (
          <div className="space-y-8">
            {/* HERO SECTION */}
            <div className="relative bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/40 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />
              <div className="relative z-10 max-w-4xl space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 text-xs font-mono font-semibold">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Platform Mission &amp; Clinical SaMD Intelligence
                </div>
                <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
                  Digitalization in Healthcare: <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-400">Hepatobiliary Diagnostics &amp; Clinical Decision Support</span>
                </h1>

                {currentUser && (
                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs max-w-md">
                    <img
                      src={currentUser.avatarUrl}
                      alt={currentUser.fullName}
                      className="w-10 h-10 rounded-xl object-cover border border-cyan-400/50 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-white flex items-center gap-1.5">
                        <span>{currentUser.titlePrefix} {currentUser.fullName}</span>
                        <span className="text-[10px] bg-cyan-950 text-cyan-400 px-1.5 py-0.5 rounded font-mono">
                          @{currentUser.username}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 truncate">
                        {currentUser.role} &bull; {currentUser.institution}
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveView('profile')}
                      className="text-[10px] text-cyan-400 font-bold hover:underline"
                    >
                      Dossier &rarr;
                    </button>
                  </div>
                )}

                <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-3xl">
                  An advanced, certified educational simulation platform developed for medical students, postgraduate internal medicine residents, hepatologists, and healthcare data scientists. Bridging abstract biochemical assays with algorithmic Software as a Medical Device (SaMD) to instill disciplined clinical diagnostic reasoning.
                </p>

                {/* Primary CTA Buttons */}
                <div className="flex flex-wrap items-center gap-3 pt-3">
                  <button
                    onClick={() => setActiveView('hospital_cases')}
                    className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-cyan-950/50 transition-all cursor-pointer"
                  >
                    <Hospital className="w-4 h-4" />
                    <span>Hospital Cases Registry</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setActiveView('cases')}
                    className="bg-slate-800 hover:bg-slate-700 text-white font-semibold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 transition-all cursor-pointer border border-slate-700"
                  >
                    <Stethoscope className="w-4 h-4 text-cyan-400" />
                    <span>Clinical Case Simulator</span>
                  </button>
                  <button
                    onClick={() => setActiveView('library')}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 transition-all cursor-pointer border border-slate-700"
                  >
                    <BookOpen className="w-4 h-4 text-cyan-400" />
                    <span>Medical Textbooks &amp; Videos</span>
                  </button>
                  <button
                    onClick={() => setActiveView('blogs')}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 transition-all cursor-pointer border border-slate-700"
                  >
                    <MessageSquare className="w-4 h-4 text-cyan-400" />
                    <span>Medical Blogs &amp; Forum</span>
                  </button>
                  <button
                    onClick={() => setActiveView('learn')}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 transition-all cursor-pointer border border-slate-700"
                  >
                    <GraduationCap className="w-4 h-4 text-amber-400" />
                    <span>Curriculum Syllabus</span>
                  </button>
                </div>
              </div>
            </div>

            {/* PLATFORM OBJECTIVES: WHY IT IS USEFUL & HOW IT HELPS */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-cyan-400" />
                    <span>Platform Objectives: Why and How it Benefits You</span>
                  </h2>
                  <p className="text-xs text-slate-400">
                    Engineered to solve three critical bottlenecks in contemporary medical and health informatics training.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3 shadow-xl hover:border-cyan-500/40 transition-colors">
                  <div className="w-10 h-10 rounded-2xl bg-cyan-950 text-cyan-400 flex items-center justify-center border border-cyan-800">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-white">For MBBS Students &amp; Residents</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Overcome the gap between abstract textbook memorization and high-stakes ward triage. Study real hospital patient dossiers from AIIMS and CMC Vellore, practice diagnosing jaundice without patient safety hazards, and understand enzyme kinetics like the De Ritis ratio.
                  </p>
                  <ul className="text-xs text-slate-400 space-y-1 pt-1 list-disc list-inside">
                    <li>Interactive patient diagnostic simulators</li>
                    <li>Mastery check quizzes with immediate explanations</li>
                    <li>Gamified XP, streaks, and accredited credentials</li>
                  </ul>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3 shadow-xl hover:border-cyan-500/40 transition-colors">
                  <div className="w-10 h-10 rounded-2xl bg-purple-950 text-purple-400 flex items-center justify-center border border-purple-800">
                    <Users className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-white">For Professors &amp; Specialists</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Standardize bedside clinical teaching with verified curriculum modules. Publish hospital case records, review peer-contributed learning resources, and participate in the Medical Blogs &amp; Discussion Forum to resolve students' diagnostic doubts.
                  </p>
                  <ul className="text-xs text-slate-400 space-y-1 pt-1 list-disc list-inside">
                    <li>Publish and delete custom hospital case studies</li>
                    <li>Faculty endorsement badges on forum discussions</li>
                    <li>Reference international AASLD &amp; EASL guidelines</li>
                  </ul>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3 shadow-xl hover:border-cyan-500/40 transition-colors">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-950 text-emerald-400 flex items-center justify-center border border-emerald-800">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-white">For Data Scientists &amp; Researchers</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Inspect the 583-record Indian Liver Patient Dataset with in-browser SQL querying. Understand why high raw accuracy is deceptive in medical datasets, evaluate 5-fold cross-validated ROC-AUC, and inspect game-theoretic Shapley feature attributions.
                  </p>
                  <ul className="text-xs text-slate-400 space-y-1 pt-1 list-disc list-inside">
                    <li>Interactive SQLite query engine on clinical data</li>
                    <li>Compare Random Forest, LogReg, and Decision Trees</li>
                    <li>CIE LAB &amp; HSV computer vision color spaces</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* DETAILED MEDICAL SECTION 1: HEPATIC CLINICAL ANATOMY & COUINAUD SEGMENTS */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800 mb-1">
                    Anatomical Foundation &bull; Couinaud Classification
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                    <Layers className="w-5 h-5 text-cyan-400" />
                    <span>Clinical Hepatic Anatomy &amp; Microvascular Perfusion</span>
                  </h2>
                </div>
                <button
                  onClick={() => setActiveView('anatomy')}
                  className="bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-semibold px-4 py-2 rounded-xl border border-slate-700 flex items-center gap-1.5 self-start sm:self-auto"
                >
                  <span>Launch 3D Viewer</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* Cleanly Aligned High-Resolution Medical Illustration */}
                <div className="lg:col-span-6 space-y-2">
                  <div className="relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl group bg-slate-950">
                    <img
                      src={liverAnatomyImg}
                      alt="Comprehensive Clinical Liver Anatomy: Couinaud Segments, Vascular Tree, and Hepatic Lobule"
                      className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent p-3 text-[11px] text-slate-300">
                      Figure 1: Gross morphology showing right and left functional lobes, Couinaud segments (I to VIII), portal venous inflow, hepatic artery, and microarchitecture inset.
                    </div>
                  </div>
                </div>

                {/* Structured Medical Explanations */}
                <div className="lg:col-span-6 space-y-4 text-xs text-slate-300 leading-relaxed">
                  <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-2xl space-y-1.5">
                    <h4 className="font-bold text-white text-sm flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-cyan-400" />
                      The 8 Functional Couinaud Segments
                    </h4>
                    <p>
                      Unlike surface lobar divisions (falciform ligament), surgical hepatology relies on the French surgeon Claude Couinaud’s classification. Each of the 8 segments possesses its own independent vascular inflow (portal vein branch and hepatic artery branch), biliary drainage duct, and lymphatic drainage. This independence allows segmental anatomical resections without compromising adjacent hepatic parenchyma.
                    </p>
                  </div>

                  <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-2xl space-y-1.5">
                    <h4 className="font-bold text-white text-sm flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-cyan-400" />
                      Dual Vascular Supply (The 75/25 Rule)
                    </h4>
                    <p>
                      The liver receives approximately 1,500 mL of blood per minute (~25% of total cardiac output):
                    </p>
                    <ul className="list-disc list-inside space-y-1 pl-1 text-slate-400">
                      <li><strong className="text-slate-200">Hepatic Portal Vein (~75% Volume):</strong> Deoxygenated but rich in gastrointestinal nutrients, absorbed medications, pancreatic hormones (insulin/glucagon), and gut-derived bacterial endotoxins.</li>
                      <li><strong className="text-slate-200">Hepatic Artery (~25% Volume):</strong> Oxygenated blood originating from the celiac axis, providing ~50% of the liver's metabolic oxygen demands.</li>
                    </ul>
                  </div>

                  <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-2xl space-y-1.5">
                    <h4 className="font-bold text-white text-sm flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-cyan-400" />
                      Acinar Zonation (Rappaport Architecture)
                    </h4>
                    <p>
                      Hepatocytes are organized in hexagonal lobules around a central tributary. Rappaport's functional acinus defines three metabolic micro-zones:
                    </p>
                    <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
                      <div className="bg-slate-900 border border-slate-800 p-2 rounded-xl">
                        <strong className="text-cyan-400 block font-mono">Zone 1 (Periportal):</strong>
                        <span>Highest oxygen tension; active gluconeogenesis, ureagenesis, and fatty acid oxidation. First line of defense against blood-borne toxins.</span>
                      </div>
                      <div className="bg-slate-900 border border-slate-800 p-2 rounded-xl">
                        <strong className="text-rose-400 block font-mono">Zone 3 (Centrilobular):</strong>
                        <span>Lowest oxygen tension; highest concentration of Cytochrome P450 enzymes. Most vulnerable to ischemic necrosis and acetaminophen toxicity.</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* DETAILED MEDICAL SECTION 2: 4-STAGE PATHOLOGY PROGRESSION */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-rose-400 bg-rose-950/60 px-2 py-0.5 rounded border border-rose-800/40 mb-1">
                    Pathophysiological Cascade &bull; Fibrogenesis
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                    <Activity className="w-5 h-5 text-rose-400" />
                    <span>Pathology of Chronic Liver Disease Progression</span>
                  </h2>
                </div>
                <button
                  onClick={() => setActiveView('predictor')}
                  className="bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-semibold px-4 py-2 rounded-xl border border-slate-700 flex items-center gap-1.5 self-start sm:self-auto"
                >
                  <span>Predict Patient Risk</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* Structured Stage Progression Explanations */}
                <div className="lg:col-span-6 space-y-3 text-xs order-2 lg:order-1">
                  <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-emerald-900/40 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-emerald-400 text-xs flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        Stage 1: Normal Healthy Liver
                      </span>
                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                        FibroScan &lt; 5.5 kPa
                      </span>
                    </div>
                    <p className="text-slate-300 leading-relaxed">
                      Soft, resilient parenchyma with smooth capsule. Quiescent hepatic stellate cells store vitamin A in sub-endothelial space of Disse. Normal sinusoidal endothelial fenestrations allow unhindered macromolecular plasma exchange.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-amber-900/40 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-amber-400 text-xs flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-amber-400" />
                        Stage 2: Hepatic Steatosis (MASLD / NAFLD)
                      </span>
                      <span className="text-[10px] font-mono text-amber-400 bg-amber-950 px-2 py-0.5 rounded border border-amber-800">
                        Reversible &bull; CAP &gt; 270 dB/m
                      </span>
                    </div>
                    <p className="text-slate-300 leading-relaxed">
                      Macroscopic lipid accumulation (&gt;5% hepatocytes laden with triglyceride droplets). Driven by insulin resistance and caloric surplus. Hepatocytes swell but maintain cellular integrity; completely reversible through 5-7% weight reduction and Mediterranean diet.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-orange-900/40 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-orange-400 text-xs flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-orange-400" />
                        Stage 3: Steatohepatitis &amp; Bridging Fibrosis (MASH)
                      </span>
                      <span className="text-[10px] font-mono text-orange-400 bg-orange-950 px-2 py-0.5 rounded border border-orange-800">
                        FIB-4 &gt; 1.3 &bull; 8 - 12 kPa
                      </span>
                    </div>
                    <p className="text-slate-300 leading-relaxed">
                      Lipotoxicity triggers oxidative stress, hepatocyte ballooning degeneration, and Mallory-Denk bodies. Activated stellate cells transdifferentiate into contractile myofibroblasts, laying down dense type I and III collagen bands that bridge portal tracts.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-rose-900/40 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-rose-400 text-xs flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-rose-400" />
                        Stage 4: Cirrhosis &amp; Decompensation
                      </span>
                      <span className="text-[10px] font-mono text-rose-400 bg-rose-950 px-2 py-0.5 rounded border border-rose-800">
                        HVPG &gt; 10 mmHg &bull; &gt; 14 kPa
                      </span>
                    </div>
                    <p className="text-slate-300 leading-relaxed">
                      Irreversible architectural distortion with micronodular or macronodular regenerative nodules encircled by dense fibrotic scars. Sinusoidal capillarization precipitates portal hypertension, leading to variceal bleeding, ascites, jaundice, and encephalopathy.
                    </p>
                  </div>
                </div>

                {/* Cleanly Aligned High-Resolution Medical Illustration */}
                <div className="lg:col-span-6 space-y-2 order-1 lg:order-2">
                  <div className="relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl group bg-slate-950">
                    <img
                      src={liverStagesImg}
                      alt="4-Stage Progression of Liver Pathology: Normal, Steatosis, Fibrosis, and Micronodular Cirrhosis"
                      className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent p-3 text-[11px] text-slate-300">
                      Figure 2: Longitudinal continuum of hepatic parenchymal restructuring from healthy tissue to irreversible nodular cirrhosis with microscopic histological insets.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* BIOCHEMICAL BIOMARKER MATRIX (LFT PANEL) */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Activity className="w-4 h-4 text-cyan-400" />
                    <span>Hepatology Biomarkers &amp; Diagnostic Kinetic Matrix</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Core diagnostic parameters from the 583-patient Indian Liver Patient Dataset (ILPD) and their physiological rationale.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-2xl space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">ALT (SGPT)</span>
                    <span className="text-[10px] text-cyan-400 font-mono">7 - 56 U/L</span>
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    Cytoplasmic enzyme highly specific to hepatocytes. Disproportionate rise indicates direct cellular necrosis (acute viral or drug-induced injury).
                  </p>
                </div>

                <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-2xl space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">AST (SGOT) &amp; De Ritis</span>
                    <span className="text-[10px] text-cyan-400 font-mono">10 - 40 U/L</span>
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    Mitochondrial (80%) and cytoplasmic (20%). AST &gt; ALT (De Ritis &gt; 2.0) is a hallmark of alcoholic hepatitis and established cirrhotic fibrosis.
                  </p>
                </div>

                <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-2xl space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">Total &amp; Direct Bilirubin</span>
                    <span className="text-[10px] text-cyan-400 font-mono">0.2 - 1.2 mg/dL</span>
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    Direct (conjugated) fraction &gt; 40% confirms intrahepatic cholestasis or biliary obstruction. Unconjugated indicates pre-hepatic hemolysis or Gilbert.
                  </p>
                </div>

                <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-2xl space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">Albumin &amp; A/G Ratio</span>
                    <span className="text-[10px] text-cyan-400 font-mono">3.5 - 5.0 g/dL</span>
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    True reflection of chronic hepatic synthetic capacity (~20-day half-life). Inverted A/G ratio &lt; 1.0 flags advanced synthetic failure and ascites risk.
                  </p>
                </div>
              </div>
            </div>

            {/* PREVENTION, DIETARY HABITS & LIFESTYLE GUIDANCE */}
            <div className="bg-gradient-to-br from-emerald-950/30 via-slate-900 to-slate-900 border border-emerald-900/40 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-emerald-900/40 pb-3">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <HeartPulse className="w-5 h-5 text-emerald-400" />
                    <span>Evidence-Based Hepatoprotection, Lifestyle &amp; Prevention Guidance</span>
                  </h3>
                  <p className="text-xs text-slate-300">
                    Clinical preventive medicine guidelines endorsed by AASLD and EASL consensus panels.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-300">
                <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl space-y-2">
                  <h4 className="font-bold text-emerald-400 text-sm">Hepatoprotective Nutrition</h4>
                  <ul className="space-y-1.5 text-slate-300 list-disc list-inside">
                    <li><strong className="text-white">Mediterranean Diet:</strong> Prioritize extra virgin olive oil, nuts, avocados, and omega-3 rich fatty fish.</li>
                    <li><strong className="text-white">Filter Coffee (2-3 cups/day):</strong> Clinically demonstrated to reduce hepatic stellate cell activation and lower hepatocellular carcinoma incidence.</li>
                    <li><strong className="text-white">Fructose Restriction:</strong> Strictly eliminate high-fructose corn syrup (HFCS) beverages, which stimulate de novo lipogenesis.</li>
                  </ul>
                </div>

                <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl space-y-2">
                  <h4 className="font-bold text-emerald-400 text-sm">Metabolic Conditioning</h4>
                  <ul className="space-y-1.5 text-slate-300 list-disc list-inside">
                    <li><strong className="text-white">Aerobic Exercise:</strong> 150 to 200 minutes per week of moderate-intensity cardio (brisk walking, cycling) reduces visceral fat.</li>
                    <li><strong className="text-white">Resistance Training:</strong> Builds peripheral skeletal muscle mass, improving insulin-stimulated glucose uptake.</li>
                    <li><strong className="text-white">Targeted Weight Loss:</strong> 5-7% total body weight reduction resolves steatosis; 10% can reverse fibrosis.</li>
                  </ul>
                </div>

                <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl space-y-2">
                  <h4 className="font-bold text-amber-400 text-sm">Red-Flag Warning Signs</h4>
                  <ul className="space-y-1.5 text-slate-300 list-disc list-inside">
                    <li><strong className="text-white">Scleral Icterus &amp; Dark Urine:</strong> Indicates conjugated bilirubin exceeding 2.5-3.0 mg/dL.</li>
                    <li><strong className="text-white">Asterixis (Flapping Tremor):</strong> Early clinical manifestation of metabolic hepatic encephalopathy.</li>
                    <li><strong className="text-white">Hematemesis / Melena:</strong> Emergency gastrointestinal bleeding requiring immediate octreotide and endoscopy.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* INTERACTIVE 3D VIEWER CALLOUT */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Layers className="w-5 h-5 text-cyan-400" /> Interactive 3D Liver Anatomy &amp; Jaundice Simulation
                  </h2>
                  <p className="text-xs text-slate-400">
                    Procedural 3D model with Couinaud hepatic segments, vascular tree, and real-time bilirubin accumulation.
                  </p>
                </div>
                <button
                  onClick={() => setActiveView('anatomy')}
                  className="text-xs text-cyan-400 hover:underline flex items-center gap-1 font-semibold"
                >
                  Full Viewport <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              <ThreeLiverViewer />
            </div>
          </div>
        )}

        {/* HOSPITAL PATIENT CASE REGISTRY VIEW */}
        {activeView === 'hospital_cases' && (
          <HospitalCaseRegistry
            onNavigateToSimulator={() => setActiveView('cases')}
            onNavigateToCurriculum={() => setActiveView('learn')}
          />
        )}

        {/* MEDICAL RESEARCH & TEXTBOOK LIBRARY VIEW */}
        {activeView === 'library' && <MedicalLibraryHub />}

        {/* MEDICAL BLOGS & INTELLECTUAL DISCUSSION FORUM VIEW */}
        {activeView === 'blogs' && <MedicalBlogsForum />}

        {/* AI CLINICAL INTELLIGENCE SUITE VIEW */}
        {activeView === 'intelligence' && (
          <ClinicalIntelligenceSuite
            initialTab={selectedTabForIntel || undefined}
            onNavigateToView={(viewId) => setActiveView(viewId as ActiveView)}
          />
        )}

        {/* 3D ANATOMY VIEW */}
        {activeView === 'anatomy' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-cyan-400" />
                Procedural 3D Hepatic Spatial Anatomy &amp; Microscopic Lobule
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Rendered with Studio PBR lighting, RoomEnvironment reflections, and real-time jaundice slider reflecting tissue bilirubin deposition.
              </p>
            </div>
            <ThreeLiverViewer />
          </div>
        )}

        {/* CLINICAL CASE SIMULATOR VIEW */}
        {activeView === 'cases' && (
          <ClinicalCaseSimulator
            initialCaseId={selectedCaseIdForSim || undefined}
            initialTab={selectedTabForSim || undefined}
            onNavigateToPredictor={() => setActiveView('predictor')}
            onNavigateToArcade={() => setActiveView('play')}
            onNavigateToCommunity={() => setActiveView('community')}
          />
        )}

        {/* RISK PREDICTOR VIEW */}
        {activeView === 'predictor' && (
          <ClinicalPredictor onNavigateToIntelligence={() => setActiveView('intelligence')} />
        )}

        {/* DATASET DASHBOARD VIEW */}
        {activeView === 'dashboard' && (
          <DatasetDashboard initialTab={selectedTabForDash || undefined} />
        )}

        {/* CV SCREENING VIEW */}
        {activeView === 'screening' && <ComputerVisionScreening />}

        {/* ML LAB VIEW */}
        {activeView === 'mllab' && <MLLabView />}

        {/* CURRICULUM MODULES VIEW */}
        {activeView === 'learn' && (
          <LearningModules initialModuleId={selectedModuleIdForLearn || undefined} />
        )}

        {/* ETHICS & FIRST-AID VIEW */}
        {activeView === 'ethics' && <ClinicalEthicsFirstAid />}

        {/* PLAY ARCADE VIEW */}
        {activeView === 'play' && <PlayArcade />}

        {/* COMMUNITY HUB & GLOBAL CLINICAL LEADERBOARD VIEW */}
        {activeView === 'community' && (
          <CommunityHub onNavigateToCases={() => setActiveView('cases')} />
        )}

        {/* CLINICAL LOGIN VIEW */}
        {activeView === 'login' && (
          <LoginPage
            onNavigateToSignUp={() => setActiveView('signup')}
            onLoginSuccess={() => setActiveView('profile')}
          />
        )}

        {/* CLINICAL SIGN UP VIEW */}
        {activeView === 'signup' && (
          <SignUpPage
            onNavigateToLogin={() => setActiveView('login')}
            onSignUpSuccess={() => setActiveView('profile')}
          />
        )}

        {/* CLINICAL PROFILE DOSSIER VIEW */}
        {activeView === 'profile' && (
          <ProfilePage
            onNavigateToCurriculum={() => setActiveView('learn')}
            onNavigateToArcade={() => setActiveView('play')}
            onNavigateToPredictor={() => setActiveView('predictor')}
          />
        )}
      </main>

      {/* AI Medical Tutor Modal */}
      <AITutorModal isOpen={isAITutorOpen} onClose={() => setIsAITutorOpen(false)} />

      {/* Persistent Storage & Learning Portfolio Modal */}
      {isDataModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Storage &amp; Learning Portfolio</h3>
                  <p className="text-xs text-slate-400">
                    Dual-layer persistence: IndexedDB (primary) + LocalStorage (redundant mirror)
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsDataModalOpen(false);
                  setResetConfirming(false);
                }}
                className="text-slate-400 hover:text-white p-1"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Storage Architecture Overview */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2.5 text-xs">
              <div className="flex items-center justify-between text-slate-300">
                <span className="font-semibold flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" /> Active Storage Layer:
                </span>
                <span className="font-mono text-cyan-300 font-bold bg-cyan-950/70 border border-cyan-800 px-2 py-0.5 rounded">
                  {storageEngine}
                </span>
              </div>
              <div className="text-slate-400 leading-relaxed text-[11px]">
                Your entire clinical training dossier (10 modules, quiz answers, 6 arcade game records, unlocked badges, streaks, and risk prediction cases) is committed automatically to the browser&apos;s IndexedDB object store with zero latency.
              </div>
            </div>

            {/* Current Dossier Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 text-[11px]">Completed Modules:</span>
                <div className="font-bold text-white text-sm mt-0.5">{completedModules.length} / 10</div>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 text-[11px]">Completed Games:</span>
                <div className="font-bold text-emerald-300 text-sm mt-0.5">{completedGamesCount} / 6</div>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 text-[11px]">Clinical XP:</span>
                <div className="font-bold text-cyan-300 text-sm mt-0.5 font-mono">{xp} XP</div>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 text-[11px]">Active Streak:</span>
                <div className="font-bold text-amber-300 text-sm mt-0.5">{streakDays} Days</div>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 text-[11px]">Honors &amp; Badges:</span>
                <div className="font-bold text-indigo-300 text-sm mt-0.5">{unlockedBadgeIds.length} / 20</div>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 text-[11px]">Student Rank:</span>
                <div className="font-bold text-white text-xs mt-0.5 truncate">{rank}</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={handleExportPortfolio}
                  className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>Export Portfolio (.json)</span>
                </button>

                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-slate-800 hover:bg-slate-700 text-white font-semibold px-4 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition-all border border-slate-700"
                >
                  <Upload className="w-4 h-4 text-cyan-400" />
                  <span>Import Portfolio (.json)</span>
                </button>
              </div>

              {/* Reset Section with safe confirmation */}
              {!resetConfirming ? (
                <button
                  onClick={() => setResetConfirming(true)}
                  className="w-full text-center text-slate-500 hover:text-rose-400 text-[11px] pt-1 transition-colors flex items-center justify-center gap-1.5"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset All Local Training Progress</span>
                </button>
              ) : (
                <div className="bg-rose-950/40 border border-rose-600/50 rounded-2xl p-4 text-xs space-y-3 animate-in fade-in">
                  <div className="flex items-start gap-2.5 text-rose-200">
                    <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-rose-100">Confirm Progress Reset?</div>
                      <div className="text-[11px] text-rose-300 mt-0.5 leading-relaxed">
                        This will delete all completed modules, quiz records, arcade high scores, and unlocked badges from IndexedDB and LocalStorage.
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-2.5 pt-1">
                    <button
                      onClick={() => setResetConfirming(false)}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={async () => {
                        await resetProgress();
                        setResetConfirming(false);
                        setIsDataModalOpen(false);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold"
                    >
                      Yes, Reset Everything
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Clinical Footer */}
      <footer
        className={`border-t mt-12 py-6 text-xs transition-colors ${
          isDark
            ? 'bg-slate-900 border-slate-800 text-slate-400'
            : 'bg-white border-slate-200 text-slate-600'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center md:text-left">
            <div className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Digitalization in Healthcare &bull; Educational Platform
            </div>
            <div className={`text-[11px] ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
              Indian Liver Patient Dataset (ILPD) &bull; WCAG 2.1 AA Compliant &bull; Educational Simulation Only
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px]">
            <button onClick={() => setActiveView('profile')} className="hover:text-cyan-500 transition-colors">
              Clinician Profile
            </button>
            <span>&bull;</span>
            <button onClick={() => setActiveView('login')} className="hover:text-cyan-500 transition-colors">
              Sign In
            </button>
            <span>&bull;</span>
            <button onClick={() => setActiveView('ethics')} className="hover:text-cyan-500 transition-colors">
              Nine Ethical Rules
            </button>
            <span>&bull;</span>
            <button onClick={() => setActiveView('ethics')} className="hover:text-cyan-500 transition-colors">
              Emergency 112 Handbook
            </button>
            <span>&bull;</span>
            <button onClick={() => setActiveView('community')} className="hover:text-cyan-500 transition-colors">
              Research Hub
            </button>
            <span>&bull;</span>
            <button onClick={() => setIsAITutorOpen(true)} className="hover:text-cyan-500 transition-colors">
              AI Medical Tutor
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ProgressProvider>
          <MainAppLayout />
        </ProgressProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
