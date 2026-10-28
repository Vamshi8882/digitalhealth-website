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
  UserPlus
} from 'lucide-react';

import { ThreeLiverViewer } from './components/ThreeLiverViewer';
import { ClinicalPredictor } from './components/ClinicalPredictor';
import { DatasetDashboard } from './components/DatasetDashboard';
import { ComputerVisionScreening } from './components/ComputerVisionScreening';
import { MLLabView } from './components/MLLabView';
import { LearningModules } from './components/LearningModules';
import { ClinicalEthicsFirstAid } from './components/ClinicalEthicsFirstAid';
import { PlayArcade } from './components/PlayArcade';
import { CommunityHub } from './components/CommunityHub';
import { AITutorModal } from './components/AITutorModal';
import { LoginPage } from './components/auth/LoginPage';
import { SignUpPage } from './components/auth/SignUpPage';
import { ProfilePage } from './components/auth/ProfilePage';
import { ProgressProvider, useProgress } from './context/ProgressContext';
import { AuthProvider, useAuth } from './context/AuthContext';

type ActiveView =
  | 'home'
  | 'anatomy'
  | 'predictor'
  | 'dashboard'
  | 'screening'
  | 'mllab'
  | 'learn'
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

  const { currentUser, isAuthenticated } = useAuth();

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
    { id: 'anatomy', label: '3D Anatomy', icon: Layers },
    { id: 'predictor', label: 'Risk Predictor', icon: Activity },
    { id: 'dashboard', label: 'ILPD Dashboard', icon: Database },
    { id: 'screening', label: 'CV Screener', icon: Eye },
    { id: 'mllab', label: 'ML Lab', icon: Cpu },
    { id: 'learn', label: 'Curriculum (10)', icon: BookOpen },
    { id: 'ethics', label: 'Ethics & First-Aid', icon: ShieldAlert },
    { id: 'play', label: 'Play Arcade', icon: Gamepad2 },
    { id: 'community', label: 'Research Hub', icon: Users },
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

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
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
        className="bg-slate-900 border-b border-slate-800 px-4 py-1.5 text-[11px] text-slate-300 flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-rose-400 font-bold">
            <PhoneCall className="w-3 h-3" /> India National Universal Emergency: Dial 112
          </span>
          <span className="hidden md:inline text-slate-600">|</span>
          <span className="hidden md:inline text-slate-400">
            For acute medical resuscitation, poison control, or traumatic hemorrhage.
          </span>
        </div>
        <div className="text-amber-300/90 font-medium font-mono text-[10px]">
          EDUCATIONAL MEDICAL PLATFORM &bull; NOT A CLINICAL DIAGNOSTIC DEVICE
        </div>
      </aside>

      {/* Primary Navigation Bar with Persistent Progress Bar */}
      <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-none border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Logo & Brand Lockup */}
          <button
            onClick={() => setActiveView('home')}
            className="flex items-center gap-3 text-left cursor-pointer group shrink-0"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-cyan-950 border border-cyan-400/30 group-hover:scale-105 transition-transform">
              <HeartPulse className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-black text-white tracking-tight flex items-center gap-2">
                <span>Digitalization in Healthcare</span>
                <span className="hidden sm:inline-block px-1.5 py-0.2 text-[9px] font-mono bg-cyan-950 text-cyan-300 rounded border border-cyan-800">
                  ILPD ML
                </span>
              </div>
              <div className="text-[11px] text-slate-400 font-medium">
                Medical Data Science &amp; Clinical Informatics Platform
              </div>
            </div>
          </button>

          {/* Desktop Nav Items */}
          <nav className="hidden 2xl:flex items-center gap-1 text-xs font-semibold">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id as ActiveView)}
                  className={`px-2.5 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                    isActive
                      ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Header Status: Student Persistent Progress, User Profile & AI Tutor Modal */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Student Stats Pill (XP, Streak, Level) */}
            <div
              onClick={() => setIsDataModalOpen(true)}
              title="Click to view Persistent State & Storage Backup"
              className="hidden lg:flex items-center gap-2 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-cyan-500/50 px-2.5 py-1.5 rounded-xl cursor-pointer transition-all text-xs"
            >
              <div className="flex items-center gap-1 text-amber-400 font-bold">
                <Flame className="w-3.5 h-3.5 fill-amber-400" />
                <span>{streakDays}d</span>
              </div>
              <span className="text-slate-700">|</span>
              <div className="flex items-center gap-1 text-cyan-300 font-semibold font-mono">
                <Trophy className="w-3.5 h-3.5 text-cyan-400" />
                <span>{xp} XP</span>
              </div>
              <span className="text-slate-700">|</span>
              <span className="text-[11px] text-indigo-300 bg-indigo-950/60 border border-indigo-800/60 px-1.5 py-0.5 rounded font-mono">
                Lv {level}
              </span>
            </div>

            {/* Persistent Data Backup Trigger */}
            <button
              onClick={() => setIsDataModalOpen(true)}
              className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white p-2 rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer"
              title="State & Storage Manager (IndexedDB / LocalStorage)"
              aria-label="State and storage manager"
            >
              <Database className="w-4 h-4 text-cyan-400" />
              <span className="hidden xl:inline text-[11px] font-mono">Sync</span>
            </button>

            {/* User Profile Chip / Authentication Trigger */}
            {currentUser ? (
              <button
                onClick={() => setActiveView('profile')}
                className={`flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-xl border transition-all cursor-pointer ${
                  activeView === 'profile'
                    ? 'bg-cyan-500/15 border-cyan-400 text-white shadow'
                    : 'bg-slate-900 border-slate-800 hover:border-cyan-500/60 text-slate-300 hover:text-white'
                }`}
                title="View Full Clinical Profile & Credentials"
              >
                <div className="relative">
                  <img
                    src={currentUser.avatarUrl}
                    alt={currentUser.fullName}
                    className="w-7 h-7 rounded-lg object-cover border border-cyan-400/40 shrink-0"
                  />
                  <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-slate-950" />
                </div>
                <div className="hidden sm:block text-left text-xs leading-none">
                  <div className="font-bold text-white truncate max-w-[100px]">
                    {currentUser.fullName}
                  </div>
                  <div className="text-[10px] text-cyan-400 truncate max-w-[100px] mt-0.5">
                    {currentUser.role.split(' ')[0]}
                  </div>
                </div>
              </button>
            ) : (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setActiveView('login')}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 text-xs font-semibold flex items-center gap-1"
                >
                  <LogIn className="w-3.5 h-3.5 text-cyan-400" />
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
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold px-3 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-lg shadow-cyan-950/50 transition-all cursor-pointer shrink-0"
            >
              <Bot className="w-4 h-4" />
              <span className="hidden lg:inline">Ask AI Tutor</span>
            </button>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="2xl:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="2xl:hidden bg-slate-900 border-b border-slate-800 p-4 space-y-2 text-xs">
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
            {/* Hero Section */}
            <div className="relative bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/40 border border-slate-800 rounded-3xl p-8 shadow-2xl overflow-hidden">
              <div className="relative z-10 max-w-3xl space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 text-xs font-mono font-semibold">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Medical Education &amp; Healthcare Digitalization
                </div>
                <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                  Demystifying Clinical Machine Learning through the Indian Liver Patient Dataset
                </h1>

                {currentUser && (
                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs max-w-md">
                    <img
                      src={currentUser.avatarUrl}
                      alt={currentUser.fullName}
                      className="w-9 h-9 rounded-xl object-cover border border-cyan-400/50 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-white">
                        Welcome back, {currentUser.titlePrefix} {currentUser.fullName}
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

                <p className="text-sm text-slate-300 leading-relaxed">
                  An immersive, project-based educational platform for medical students, healthcare technologists, and data scientists. Master laboratory biomarker feature engineering, supervised diagnostics, model evaluation metrics (ROC-AUC vs Accuracy), and medical computer vision.
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={() => setActiveView('predictor')}
                    className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-lg transition-all cursor-pointer"
                  >
                    <span>Launch Risk Predictor</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setActiveView('anatomy')}
                    className="bg-slate-800 hover:bg-slate-700 text-white font-semibold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 transition-all cursor-pointer border border-slate-700"
                  >
                    <Layers className="w-4 h-4 text-cyan-400" />
                    <span>Explore 3D Liver Model</span>
                  </button>
                  <button
                    onClick={() => setActiveView('learn')}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 transition-all cursor-pointer border border-slate-700"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Curriculum Modules ({completedModules.length}/10)</span>
                  </button>
                  <button
                    onClick={() => setActiveView('profile')}
                    className="bg-slate-800 hover:bg-slate-700 text-cyan-300 font-semibold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 transition-all cursor-pointer border border-cyan-800/60"
                  >
                    <User className="w-4 h-4" />
                    <span>My Clinical Profile</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Persistent Learning & Games Tracker Banner */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-white">Your Persistent Clinical Learning Record</h2>
                    <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950/70 border border-cyan-800 px-2 py-0.5 rounded">
                      {storageEngine}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Your module completions, quiz responses, high scores, and diagnostic runs automatically persist across browser refreshes and offline sessions.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsDataModalOpen(true)}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-3 py-1.5 rounded-xl font-semibold flex items-center gap-1.5 transition-colors border border-slate-700"
                  >
                    <Database className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Backup / Export</span>
                  </button>
                  <button
                    onClick={() => setActiveView('learn')}
                    className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs px-3.5 py-1.5 rounded-xl font-bold flex items-center gap-1 transition-all"
                  >
                    <span>Resume Study</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Progress Summary Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-1">
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-1">
                  <div className="text-[11px] text-slate-400 flex items-center justify-between">
                    <span>Curriculum Mastery</span>
                    <span className="font-bold text-cyan-400">{curriculumPercent}%</span>
                  </div>
                  <div className="text-base font-bold text-white">
                    {completedModules.length} / 10 Modules
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2 overflow-hidden">
                    <div
                      className="bg-cyan-400 h-full rounded-full transition-all duration-500"
                      style={{ width: `${curriculumPercent}%` }}
                    />
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-1">
                  <div className="text-[11px] text-slate-400 flex items-center justify-between">
                    <span>Clinical Games</span>
                    <span className="font-bold text-emerald-400">{completedGamesCount}/6</span>
                  </div>
                  <div className="text-base font-bold text-white">
                    {completedGamesCount === 6 ? 'All Games Mastered' : `${completedGamesCount} Completed`}
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">
                    Rapid, Dash, SQL, Quiz, Sim, Match
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-1">
                  <div className="text-[11px] text-slate-400 flex items-center justify-between">
                    <span>Rank &amp; Tier</span>
                    <span className="font-bold text-indigo-400">Lv {level}</span>
                  </div>
                  <div className="text-base font-bold text-white truncate">
                    {rank}
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">
                    {xp} Total Clinical XP
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-1">
                  <div className="text-[11px] text-slate-400 flex items-center justify-between">
                    <span>Badges Unlocked</span>
                    <span className="font-bold text-amber-400">{unlockedBadgeIds.length}/20</span>
                  </div>
                  <div className="text-base font-bold text-white">
                    {unlockedBadgeIds.length} Honors
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">
                    Streak: {streakDays} Continuous Days
                  </div>
                </div>
              </div>
            </div>

            {/* 4-Step Learning Path */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white">4-Step Medical Data Science Learning Path</h2>
                  <p className="text-xs text-slate-400">Structured progression from raw biochemical assays to verified clinical decision support.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  {
                    step: 'Step 1',
                    title: 'Biomarkers & Pathology',
                    desc: 'Examine the 10 serum lab markers in ILPD, physiological reference ranges, and the clinical significance of AST, ALT, and Bilirubin.',
                    view: 'predictor' as ActiveView,
                    color: 'from-blue-500 to-cyan-500'
                  },
                  {
                    step: 'Step 2',
                    title: 'Feature Engineering',
                    desc: 'Learn how Fernando De Ritis discovered the AST/ALT ratio in 1957, and how bilirubin conjugation ratios supercharge ML models.',
                    view: 'dashboard' as ActiveView,
                    color: 'from-cyan-500 to-emerald-500'
                  },
                  {
                    step: 'Step 3',
                    title: 'Supervised ML & ROC-AUC',
                    desc: 'Train Logistic Regression, Random Forests, and Trees. Understand the Accuracy Paradox in imbalanced clinical cohorts.',
                    view: 'mllab' as ActiveView,
                    color: 'from-amber-500 to-orange-500'
                  },
                  {
                    step: 'Step 4',
                    title: 'Computer Vision & Ethics',
                    desc: 'Analyze HSV/LAB color spaces for scleral icterus screening and study the Nine Ethical Rules of Digital Medicine.',
                    view: 'screening' as ActiveView,
                    color: 'from-rose-500 to-pink-500'
                  }
                ].map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => setActiveView(item.view)}
                    className="bg-slate-900 border border-slate-800 hover:border-cyan-500/50 p-5 rounded-2xl shadow-xl space-y-3 cursor-pointer transition-all group flex flex-col justify-between"
                  >
                    <div>
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400">
                        {item.step}
                      </span>
                      <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors mt-1">
                        {item.title}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>

                    <div className="pt-2 flex items-center justify-between text-xs text-cyan-400 font-semibold group-hover:translate-x-1 transition-transform">
                      <span>Explore Component</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Interactive 3D Preview Hero */}
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

        {/* RISK PREDICTOR VIEW */}
        {activeView === 'predictor' && <ClinicalPredictor />}

        {/* DATASET DASHBOARD VIEW */}
        {activeView === 'dashboard' && <DatasetDashboard />}

        {/* CV SCREENING VIEW */}
        {activeView === 'screening' && <ComputerVisionScreening />}

        {/* ML LAB VIEW */}
        {activeView === 'mllab' && <MLLabView />}

        {/* CURRICULUM MODULES VIEW */}
        {activeView === 'learn' && <LearningModules />}

        {/* ETHICS & FIRST-AID VIEW */}
        {activeView === 'ethics' && <ClinicalEthicsFirstAid />}

        {/* PLAY ARCADE VIEW */}
        {activeView === 'play' && <PlayArcade />}

        {/* COMMUNITY HUB VIEW */}
        {activeView === 'community' && <CommunityHub />}

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
      <footer className="bg-slate-900 border-t border-slate-800 mt-12 py-6 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center md:text-left">
            <div className="font-bold text-white">Digitalization in Healthcare &bull; Educational Platform</div>
            <div className="text-[11px] text-slate-500">
              Indian Liver Patient Dataset (ILPD) &bull; WCAG 2.1 AA Compliant &bull; Educational Simulation Only
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px]">
            <button onClick={() => setActiveView('profile')} className="hover:text-cyan-400 transition-colors">
              Clinician Profile
            </button>
            <span>&bull;</span>
            <button onClick={() => setActiveView('login')} className="hover:text-cyan-400 transition-colors">
              Sign In
            </button>
            <span>&bull;</span>
            <button onClick={() => setActiveView('ethics')} className="hover:text-cyan-400 transition-colors">
              Nine Ethical Rules
            </button>
            <span>&bull;</span>
            <button onClick={() => setActiveView('ethics')} className="hover:text-cyan-400 transition-colors">
              Emergency 112 Handbook
            </button>
            <span>&bull;</span>
            <button onClick={() => setActiveView('community')} className="hover:text-cyan-400 transition-colors">
              Research Hub
            </button>
            <span>&bull;</span>
            <button onClick={() => setIsAITutorOpen(true)} className="hover:text-cyan-400 transition-colors">
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
    <AuthProvider>
      <ProgressProvider>
        <MainAppLayout />
      </ProgressProvider>
    </AuthProvider>
  );
}
