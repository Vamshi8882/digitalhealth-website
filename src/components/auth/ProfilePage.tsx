/**
 * Digitalization in Healthcare - Comprehensive User Profile Page
 * Displays full clinical credentials, profile photo customizer, academic progress dossier,
 * badges, game high-scores, and account management.
 */

import React, { useState, useRef } from 'react';
import {
  User,
  Building,
  Mail,
  Phone,
  MapPin,
  FileBadge,
  Sparkles,
  Camera,
  Upload,
  Edit3,
  ShieldCheck,
  Trophy,
  Flame,
  BookOpen,
  Gamepad2,
  Database,
  LogOut,
  Users,
  CheckCircle,
  X,
  RotateCcw,
  Save,
  Download
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '../../context/AuthContext';
import { useProgress } from '../../context/ProgressContext';
import { PRESET_AVATARS } from '../../services/authStorage';
import { ClinicalRole, UserProfile } from '../../types/auth';
import { ClinicalPortfolioSection } from './ClinicalPortfolioSection';

interface ProfilePageProps {
  onNavigateToCurriculum: () => void;
  onNavigateToArcade: () => void;
  onNavigateToPredictor: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  onNavigateToCurriculum,
  onNavigateToArcade,
  onNavigateToPredictor
}) => {
  const { currentUser, updateProfile, logout, switchUser, allUsers } = useAuth();
  const {
    xp,
    level,
    rank,
    streakDays,
    completedModules,
    unlockedBadgeIds,
    gameStats,
    predictions,
    exportDataJSON,
    storageEngine
  } = useProgress();

  const [isEditing, setIsEditing] = useState(false);
  const [showSwitchModal, setShowSwitchModal] = useState(false);
  const [editFormData, setEditFormData] = useState<Partial<UserProfile>>({});
  const [editAvatarPreview, setEditAvatarPreview] = useState<string>('');
  const [showPresetsInEdit, setShowPresetsInEdit] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!currentUser) {
    return null;
  }

  // Open Edit Modal
  const handleOpenEdit = () => {
    setEditFormData({
      fullName: currentUser.fullName,
      titlePrefix: currentUser.titlePrefix,
      role: currentUser.role,
      institution: currentUser.institution,
      department: currentUser.department,
      medicalRegistrationId: currentUser.medicalRegistrationId,
      specialization: currentUser.specialization,
      bio: currentUser.bio,
      phone: currentUser.phone || '',
      location: currentUser.location || '',
      avatarUrl: currentUser.avatarUrl
    });
    setEditAvatarPreview(currentUser.avatarUrl);
    setShowPresetsInEdit(false);
    setIsEditing(true);
  };

  // Handle image upload inside edit modal
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const dataUrl = evt.target?.result as string;
      if (dataUrl) {
        setEditAvatarPreview(dataUrl);
        setEditFormData(prev => ({ ...prev, avatarUrl: dataUrl }));
      }
    };
    reader.readAsDataURL(file);
  };

  // Save updated profile
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateProfile({
        ...editFormData,
        avatarUrl: editAvatarPreview
      });
      setIsEditing(false);
      confetti({ particleCount: 30, spread: 50 });
    } catch (err) {
      console.error('Failed to update profile:', err);
    } finally {
      setIsSaving(false);
    }
  };

  // Completed games calculation
  const completedGamesCount = Object.values(gameStats).filter(g => g.completed).length;
  const curriculumPercent = Math.round((completedModules.length / 10) * 100);

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 py-2">
      {/* Top Banner / Verification status */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-2">
              <span>Verified Institutional Clinical Profile</span>
              <span className="text-[10px] text-emerald-400 bg-emerald-950/70 border border-emerald-800 px-2 py-0.5 rounded font-mono">
                ACTIVE
              </span>
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Registration: {currentUser.medicalRegistrationId} &bull; Synced with {storageEngine}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSwitchModal(true)}
            className="bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-colors"
          >
            <Users className="w-3.5 h-3.5 text-cyan-400" />
            <span>Switch Clinician</span>
          </button>
          <button
            onClick={handleOpenEdit}
            className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-3.5 py-1.5 rounded-xl text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Profile</span>
          </button>
        </div>
      </div>

      {/* Main Profile Header Card */}
      <div className="relative bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/40 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Profile Photo Display with quick edit badge */}
          <div className="relative group shrink-0">
            <div className="w-32 h-32 rounded-3xl overflow-hidden border-2 border-cyan-500/60 shadow-2xl shadow-cyan-950/50 bg-slate-950 relative">
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.fullName}
                className="w-full h-full object-cover"
              />
              <button
                onClick={handleOpenEdit}
                className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer text-white text-[10px] font-bold"
              >
                <Camera className="w-5 h-5 text-cyan-400 mb-1" />
                <span>Change Photo</span>
              </button>
            </div>

            <div className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full bg-cyan-500 text-slate-950 font-bold font-mono text-[10px] shadow-lg flex items-center gap-1">
              <span>Lv {level}</span>
            </div>
          </div>

          {/* Profile Identity Details */}
          <div className="flex-1 space-y-4 text-center md:text-left">
            <div>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-1.5">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                  {currentUser.role}
                </span>
                <span className="text-[10px] font-mono text-indigo-300 bg-indigo-950 px-2 py-0.5 rounded border border-indigo-800">
                  {rank}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {currentUser.titlePrefix} {currentUser.fullName}
              </h1>

              <div className="text-xs text-slate-300 font-medium mt-1 flex flex-wrap items-center justify-center md:justify-start gap-2">
                <span className="flex items-center gap-1">
                  <Building className="w-3.5 h-3.5 text-cyan-400" />
                  {currentUser.institution}
                </span>
                <span className="text-slate-600 hidden sm:inline">&bull;</span>
                <span className="text-slate-400">{currentUser.department}</span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed max-w-2xl bg-slate-950/60 p-3 rounded-2xl border border-slate-800/80">
              {currentUser.bio}
            </p>

            {/* Quick Contact & Credentials Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-400 pt-1">
              <div className="flex items-center gap-2 justify-center md:justify-start">
                <Mail className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span className="truncate">{currentUser.email}</span>
              </div>
              <div className="flex items-center gap-2 justify-center md:justify-start">
                <FileBadge className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span>{currentUser.medicalRegistrationId}</span>
              </div>
              <div className="flex items-center gap-2 justify-center md:justify-start">
                <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span>{currentUser.location || 'India'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Clinical Performance & Learning Dossier Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Trophy className="w-4 h-4 text-cyan-400" />
            <span>Clinical Performance &amp; Medical Training Record</span>
          </h2>
          <span className="text-[11px] text-slate-400">
            Real-time IndexedDB persistence
          </span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Curriculum Card */}
          <div
            onClick={onNavigateToCurriculum}
            className="p-5 rounded-3xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 transition-all cursor-pointer space-y-3 group shadow-xl"
          >
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 flex items-center gap-1.5 font-semibold">
                <BookOpen className="w-4 h-4 text-cyan-400" /> Curriculum
              </span>
              <span className="font-bold text-cyan-400">{curriculumPercent}%</span>
            </div>
            <div className="text-xl font-bold text-white">
              {completedModules.length} / 10 Modules
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-cyan-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${curriculumPercent}%` }}
              />
            </div>
            <div className="text-[10px] text-slate-500 group-hover:text-cyan-300 transition-colors">
              Click to view module transcripts &rarr;
            </div>
          </div>

          {/* Gamification / XP Card */}
          <div
            onClick={onNavigateToArcade}
            className="p-5 rounded-3xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 transition-all cursor-pointer space-y-3 group shadow-xl"
          >
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 flex items-center gap-1.5 font-semibold">
                <Flame className="w-4 h-4 text-amber-400 fill-amber-400" /> Continuous Streak
              </span>
              <span className="font-bold text-amber-400">{streakDays} Days</span>
            </div>
            <div className="text-xl font-bold text-white font-mono">
              {xp} Total XP
            </div>
            <div className="text-xs text-indigo-300 font-medium">
              Rank: {rank}
            </div>
            <div className="text-[10px] text-slate-500 group-hover:text-amber-300 transition-colors">
              Open arcade &amp; practice drills &rarr;
            </div>
          </div>

          {/* Clinical Arcade Games Card */}
          <div
            onClick={onNavigateToArcade}
            className="p-5 rounded-3xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 transition-all cursor-pointer space-y-3 group shadow-xl"
          >
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 flex items-center gap-1.5 font-semibold">
                <Gamepad2 className="w-4 h-4 text-emerald-400" /> Clinical Games
              </span>
              <span className="font-bold text-emerald-400">{completedGamesCount}/6</span>
            </div>
            <div className="text-xl font-bold text-white">
              {completedGamesCount === 6 ? 'All 6 Mastered' : `${completedGamesCount} Completed`}
            </div>
            <div className="text-[10px] text-slate-400">
              Rapid, Dash, SQL, Quiz, Sim, Match
            </div>
            <div className="text-[10px] text-slate-500 group-hover:text-emerald-300 transition-colors">
              Play diagnostic speed games &rarr;
            </div>
          </div>

          {/* Patient Stratification Logs */}
          <div
            onClick={onNavigateToPredictor}
            className="p-5 rounded-3xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 transition-all cursor-pointer space-y-3 group shadow-xl"
          >
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 flex items-center gap-1.5 font-semibold">
                <Database className="w-4 h-4 text-indigo-400" /> Patient Cases
              </span>
              <span className="font-bold text-indigo-400">{predictions.length} Logged</span>
            </div>
            <div className="text-xl font-bold text-white">
              ILPD Predictor
            </div>
            <div className="text-[10px] text-slate-400">
              Explainable AI &amp; De Ritis Ratios
            </div>
            <div className="text-[10px] text-slate-500 group-hover:text-indigo-300 transition-colors">
              Run patient risk stratification &rarr;
            </div>
          </div>
        </div>
      </div>

      {/* Clinical Portfolio & Competency Matrix with Radial Chart */}
      <ClinicalPortfolioSection
        user={currentUser}
        level={level}
        rank={rank}
        xp={xp}
        streakDays={streakDays}
        completedModules={completedModules}
        unlockedBadgeIds={unlockedBadgeIds}
        gameStats={gameStats}
        predictions={predictions}
        onNavigateToCurriculum={onNavigateToCurriculum}
        onNavigateToArcade={onNavigateToArcade}
        onNavigateToPredictor={onNavigateToPredictor}
      />

      {/* Clinical Honors & Milestone Badges */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Milestone Honors &amp; Verified Badges</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Accumulated through verified diagnostic drills, curriculum mastery, and code execution.
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-amber-400 bg-amber-950/70 border border-amber-800 px-2.5 py-1 rounded-xl">
            {unlockedBadgeIds.length} / 20 Unlocked
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3 pt-2">
          {[
            { id: 'b1', name: 'First Blood Test', icon: '🩸', desc: 'Completed lab triage' },
            { id: 'b2', name: 'De Ritis Scholar', icon: '🧬', desc: 'Identified AST/ALT > 2.0' },
            { id: 'b3', name: 'Speed Diagnostician', icon: '⚡', desc: 'Diagnose Dash master' },
            { id: 'b4', name: 'SQL Surgeon', icon: '💾', desc: 'Clinical database clause' },
            { id: 'b5', name: 'Life Saver', icon: '🫀', desc: 'Emergency crisis sim' },
            { id: 'b6', name: 'Streak Veteran', icon: '🔥', desc: 'Active multi-day streak' },
            { id: 'b7', name: 'Icterus Spotter', icon: '👁️', desc: 'HSV/LAB computer vision' },
            { id: 'b8', name: 'XAI Demystifier', icon: '🔍', desc: 'Feature attribution review' },
            { id: 'b9', name: 'Memory Master', icon: '🧠', desc: 'Clinical memory pairs' },
            { id: 'b10', name: 'Chief AI Fellow', icon: '🎖️', desc: 'Reached senior level' }
          ].map(badge => {
            const isUnlocked = unlockedBadgeIds.includes(badge.id);
            return (
              <div
                key={badge.id}
                className={`p-3.5 rounded-2xl border text-center transition-all ${
                  isUnlocked
                    ? 'bg-slate-950 border-cyan-500/50 shadow-lg shadow-cyan-950/30'
                    : 'bg-slate-950/40 border-slate-800/80 opacity-40'
                }`}
              >
                <div className="text-2xl mb-1">{badge.icon}</div>
                <div className="text-xs font-bold text-white truncate">{badge.name}</div>
                <div className="text-[10px] text-slate-400 mt-0.5 truncate">{badge.desc}</div>
                <div className="mt-2 text-[9px] font-mono font-bold">
                  {isUnlocked ? (
                    <span className="text-cyan-400">UNLOCKED</span>
                  ) : (
                    <span className="text-slate-600">LOCKED</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Session Management Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 border border-slate-800 text-xs">
        <div className="space-y-0.5 text-center sm:text-left">
          <div className="font-semibold text-white">Active Session: {currentUser.email}</div>
          <div className="text-slate-400 text-[11px]">
            Created on {new Date(currentUser.createdAt).toLocaleDateString()} &bull; Last authenticated {new Date(currentUser.lastLoginAt).toLocaleTimeString()}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowSwitchModal(true)}
            className="px-4 py-2 rounded-xl bg-slate-850 hover:bg-slate-800 text-slate-300 font-semibold transition-colors flex items-center gap-1.5 border border-slate-700"
          >
            <Users className="w-3.5 h-3.5 text-cyan-400" />
            <span>Switch Clinician</span>
          </button>
          <button
            onClick={logout}
            className="px-4 py-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 hover:text-white font-bold border border-rose-800/60 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* EDIT PROFILE MODAL */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-cyan-400" />
                  <span>Edit Clinical Profile</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Update credentials, institutional affiliation, and profile photo.
                </p>
              </div>
              <button
                onClick={() => setIsEditing(false)}
                className="text-slate-400 hover:text-white p-1"
                aria-label="Close edit dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-6">
              {/* Photo Customizer inside Modal */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="text-xs font-semibold text-slate-300">Profile Photo</div>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden border border-cyan-500/60 bg-slate-900 shrink-0">
                    <img
                      src={editAvatarPreview}
                      alt="Avatar Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="space-y-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/png, image/jpeg, image/webp"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 shadow"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload New File</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowPresetsInEdit(!showPresetsInEdit)}
                        className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-xl text-xs font-semibold border border-slate-700"
                      >
                        <span>Choose Preset Avatar</span>
                      </button>
                    </div>
                  </div>
                </div>

                {showPresetsInEdit && (
                  <div className="pt-3 border-t border-slate-800 grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {PRESET_AVATARS.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => {
                          setEditAvatarPreview(p.url);
                          setEditFormData(prev => ({ ...prev, avatarUrl: p.url }));
                          setShowPresetsInEdit(false);
                        }}
                        className={`p-1 rounded-xl border ${
                          editAvatarPreview === p.url ? 'border-cyan-400' : 'border-slate-800'
                        }`}
                      >
                        <img src={p.url} alt={p.name} className="w-12 h-12 rounded-lg object-cover mx-auto" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 text-xs">
                <div className="sm:col-span-3 space-y-1">
                  <label className="font-semibold text-slate-300">Prefix</label>
                  <select
                    value={editFormData.titlePrefix}
                    onChange={(e) => setEditFormData({ ...editFormData, titlePrefix: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                  >
                    <option value="Dr.">Dr.</option>
                    <option value="Student">Student</option>
                    <option value="Prof.">Prof.</option>
                    <option value="Mr.">Mr.</option>
                    <option value="Ms.">Ms.</option>
                  </select>
                </div>

                <div className="sm:col-span-9 space-y-1">
                  <label className="font-semibold text-slate-300">Full Name</label>
                  <input
                    type="text"
                    value={editFormData.fullName || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, fullName: e.target.value })}
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                  />
                </div>

                <div className="sm:col-span-6 space-y-1">
                  <label className="font-semibold text-slate-300">Clinical Role</label>
                  <select
                    value={editFormData.role}
                    onChange={(e) => setEditFormData({ ...editFormData, role: e.target.value as ClinicalRole })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                  >
                    <option value="Medical Student (MBBS)">Medical Student (MBBS)</option>
                    <option value="Internal Medicine Resident">Internal Medicine Resident</option>
                    <option value="Hepatology Clinical Fellow">Hepatology Clinical Fellow</option>
                    <option value="Consultant Gastroenterologist">Consultant Gastroenterologist</option>
                    <option value="Clinical Data Scientist">Clinical Data Scientist</option>
                    <option value="Biomedical Informatics Researcher">Biomedical Informatics Researcher</option>
                  </select>
                </div>

                <div className="sm:col-span-6 space-y-1">
                  <label className="font-semibold text-slate-300">Registration ID</label>
                  <input
                    type="text"
                    value={editFormData.medicalRegistrationId || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, medicalRegistrationId: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                  />
                </div>

                <div className="sm:col-span-6 space-y-1">
                  <label className="font-semibold text-slate-300">Medical Institution</label>
                  <input
                    type="text"
                    value={editFormData.institution || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, institution: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                  />
                </div>

                <div className="sm:col-span-6 space-y-1">
                  <label className="font-semibold text-slate-300">Department</label>
                  <input
                    type="text"
                    value={editFormData.department || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, department: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                  />
                </div>

                <div className="sm:col-span-6 space-y-1">
                  <label className="font-semibold text-slate-300">Phone</label>
                  <input
                    type="text"
                    value={editFormData.phone || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                  />
                </div>

                <div className="sm:col-span-6 space-y-1">
                  <label className="font-semibold text-slate-300">Location</label>
                  <input
                    type="text"
                    value={editFormData.location || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, location: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                  />
                </div>

                <div className="sm:col-span-12 space-y-1">
                  <label className="font-semibold text-slate-300">Specialization</label>
                  <input
                    type="text"
                    value={editFormData.specialization || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, specialization: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                  />
                </div>

                <div className="sm:col-span-12 space-y-1">
                  <label className="font-semibold text-slate-300">Clinical Bio</label>
                  <textarea
                    rows={3}
                    value={editFormData.bio || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, bio: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white resize-none"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-5 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? 'Saving...' : 'Save Profile Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SWITCH CLINICIAN ACCOUNT MODAL */}
      {showSwitchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-cyan-400" />
                <span>Switch Clinician Profile</span>
              </h3>
              <button
                onClick={() => setShowSwitchModal(false)}
                className="text-slate-400 hover:text-white p-1"
                aria-label="Close switch account modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Select any registered clinician or student account to instantly switch sessions:
            </p>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {allUsers.map((u) => {
                const isActive = u.id === currentUser.id;
                return (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => {
                      switchUser(u.id);
                      setShowSwitchModal(false);
                    }}
                    className={`w-full text-left p-3 rounded-2xl border transition-all flex items-center gap-3 cursor-pointer ${
                      isActive
                        ? 'bg-cyan-950/40 border-cyan-500/80 shadow-md'
                        : 'bg-slate-950 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
                    }`}
                  >
                    <img
                      src={u.avatarUrl}
                      alt={u.fullName}
                      className="w-10 h-10 rounded-xl object-cover border border-slate-700 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-white flex items-center gap-1.5">
                        <span className="truncate">{u.fullName}</span>
                        {isActive && <CheckCircle className="w-3.5 h-3.5 text-cyan-400 shrink-0" />}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate">{u.role}</div>
                      <div className="text-[10px] text-slate-500 truncate">{u.institution}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
