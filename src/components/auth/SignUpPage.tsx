/**
 * Digitalization in Healthcare - Comprehensive Clinical Sign-Up Page
 * Includes full profile photo upload/customizer and complete institutional details.
 */

import React, { useState, useRef } from 'react';
import {
  HeartPulse,
  Upload,
  Camera,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Building,
  User,
  Mail,
  Lock,
  Phone,
  MapPin,
  Sparkles,
  RefreshCw,
  X,
  FileBadge
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '../../context/AuthContext';
import { ClinicalRole, RegisterFormData } from '../../types/auth';
import { PRESET_AVATARS } from '../../services/authStorage';

interface SignUpPageProps {
  onNavigateToLogin: () => void;
  onSignUpSuccess: () => void;
}

export const SignUpPage: React.FC<SignUpPageProps> = ({
  onNavigateToLogin,
  onSignUpSuccess
}) => {
  const { signup } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<RegisterFormData>({
    fullName: '',
    titlePrefix: 'Dr.',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'Internal Medicine Resident',
    institution: 'All India Institute of Medical Sciences (AIIMS)',
    department: 'Department of Internal Medicine',
    medicalRegistrationId: 'NMC-2024-' + Math.floor(1000 + Math.random() * 9000),
    specialization: 'Hepatology & Clinical Decision Support Systems',
    bio: 'Medical scholar exploring non-invasive machine learning algorithms and transaminase feature engineering.',
    avatarUrl: PRESET_AVATARS[0].url,
    phone: '+91 98765 43210',
    location: 'New Delhi, India',
    agreeToSaMDTerms: true
  });

  const [avatarPreview, setAvatarPreview] = useState<string>(PRESET_AVATARS[0].url);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showAvatarPresets, setShowAvatarPresets] = useState(false);

  // Handle local file image upload
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please select a valid image file (PNG, JPG, or WebP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage('Image size exceeds 5MB limit. Please choose a smaller photo.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (evt) => {
      const dataUrl = evt.target?.result as string;
      if (dataUrl) {
        setAvatarPreview(dataUrl);
        setFormData(prev => ({ ...prev, avatarUrl: dataUrl }));
        setErrorMessage(null);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSelectPresetAvatar = (url: string) => {
    setAvatarPreview(url);
    setFormData(prev => ({ ...prev, avatarUrl: url }));
    setShowAvatarPresets(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!formData.fullName.trim()) {
      setErrorMessage('Full name is required.');
      return;
    }

    if (!formData.email.trim()) {
      setErrorMessage('Email address is required.');
      return;
    }

    if (formData.password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter.');
      return;
    }

    if (!formData.agreeToSaMDTerms) {
      setErrorMessage('Please acknowledge the SaMD Educational Non-Diagnostic Agreement.');
      return;
    }

    setIsUploading(true);
    try {
      await signup(formData);
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
      onSignUpSuccess();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to create account.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-4 px-2 sm:px-4">
      {/* Regulatory Notice Banner */}
      <div className="mb-6 bg-slate-900 border border-slate-800 rounded-2xl p-3 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>New Institutional Profile Registration &bull; Clinical Credentials Dossier</span>
        </div>
        <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
          NMC / Institutional Verification
        </span>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 text-xs font-mono font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Digitalization in Healthcare Registration
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Create Clinician &amp; Student Profile
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Join the educational medical cohort. Your profile links your 10 curriculum modules, quiz attempts, arcade game achievements, and diagnostic machine learning laboratory runs into a persistent dossier.
          </p>
        </div>

        {errorMessage && (
          <div className="p-4 rounded-2xl bg-rose-950/60 border border-rose-500/50 text-rose-200 text-xs flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div className="leading-relaxed">{errorMessage}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section 1: Profile Photo Customizer */}
          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Camera className="w-4 h-4 text-cyan-400" />
                  <span>Profile Photo &amp; Clinical Avatar</span>
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Upload an image from your device or select from verified clinical presets.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAvatarPresets(!showAvatarPresets)}
                className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold"
              >
                {showAvatarPresets ? 'Hide Presets' : 'Choose Preset Avatar'}
              </button>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-6">
              {/* Avatar Preview Card */}
              <div className="relative group shrink-0">
                <div className="w-28 h-28 rounded-2xl overflow-hidden border-2 border-cyan-500/60 shadow-xl shadow-cyan-950/40 bg-slate-900 relative">
                  <img
                    src={avatarPreview}
                    alt="Profile Preview"
                    className="w-full h-full object-cover"
                  />
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer text-white text-[10px] font-bold"
                  >
                    <Upload className="w-5 h-5 text-cyan-400 mb-1" />
                    <span>Change Photo</span>
                  </div>
                </div>

                <div className="absolute -bottom-2 -right-2 w-7 h-7 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center shadow-lg font-black text-xs">
                  ✓
                </div>
              </div>

              {/* Upload Controls */}
              <div className="flex-1 space-y-3 text-center sm:text-left">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  className="hidden"
                  onChange={handleImageFileChange}
                />

                <div className="flex flex-wrap items-center gap-2.5 justify-center sm:justify-start">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 shadow-lg transition-all cursor-pointer"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Upload Image File</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowAvatarPresets(!showAvatarPresets)}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold px-4 py-2 rounded-xl text-xs flex items-center gap-2 border border-slate-700 transition-all cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>Select Preset Avatar</span>
                  </button>
                </div>

                <div className="text-[11px] text-slate-500 leading-relaxed">
                  Supports PNG, JPG, or WebP (max 5MB). Photo is stored locally on device with instant preview.
                </div>
              </div>
            </div>

            {/* Preset Avatars Drawer */}
            {showAvatarPresets && (
              <div className="pt-4 border-t border-slate-800 animate-in fade-in duration-200">
                <div className="text-xs font-semibold text-slate-300 mb-3">
                  Select a Clinical Avatar:
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                  {PRESET_AVATARS.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => handleSelectPresetAvatar(preset.url)}
                      className={`p-1.5 rounded-xl border text-center transition-all group ${
                        avatarPreview === preset.url
                          ? 'border-cyan-400 bg-cyan-950/40'
                          : 'border-slate-800 bg-slate-900 hover:border-slate-700'
                      }`}
                    >
                      <img
                        src={preset.url}
                        alt={preset.name}
                        className="w-16 h-16 rounded-lg object-cover mx-auto"
                      />
                      <div className="text-[10px] text-slate-400 mt-1 truncate group-hover:text-cyan-300">
                        {preset.name}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Section 2: Clinical Identity & Credentials */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
              <User className="w-4 h-4 text-cyan-400" />
              <span>Personal &amp; Academic Credentials</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
              <div className="sm:col-span-3 space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Title Prefix</label>
                <select
                  value={formData.titlePrefix}
                  onChange={(e) => setFormData({ ...formData, titlePrefix: e.target.value as any })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="Dr.">Dr.</option>
                  <option value="Student">Student</option>
                  <option value="Prof.">Prof.</option>
                  <option value="Mr.">Mr.</option>
                  <option value="Ms.">Ms.</option>
                </select>
              </div>

              <div className="sm:col-span-9 space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Full Name</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="e.g. Vamshi Yadav"
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="sm:col-span-6 space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Institutional Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="doctor@hospital.edu"
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="sm:col-span-6 space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Contact Telephone / Dispatch</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="sm:col-span-6 space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Account Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Minimum 6 characters"
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="sm:col-span-6 space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Confirm Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    placeholder="Re-enter password"
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Institutional & Clinical Role Details */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
              <Building className="w-4 h-4 text-cyan-400" />
              <span>Medical Institution &amp; Clinical Role</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
              <div className="sm:col-span-6 space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Academic / Clinical Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as ClinicalRole })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="Medical Student (MBBS)">Medical Student (MBBS)</option>
                  <option value="Internal Medicine Resident">Internal Medicine Resident</option>
                  <option value="Hepatology Clinical Fellow">Hepatology Clinical Fellow</option>
                  <option value="Consultant Gastroenterologist">Consultant Gastroenterologist</option>
                  <option value="Clinical Data Scientist">Clinical Data Scientist</option>
                  <option value="Biomedical Informatics Researcher">Biomedical Informatics Researcher</option>
                </select>
              </div>

              <div className="sm:col-span-6 space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Medical Council / Student Registration ID
                </label>
                <div className="relative">
                  <FileBadge className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={formData.medicalRegistrationId}
                    onChange={(e) => setFormData({ ...formData, medicalRegistrationId: e.target.value })}
                    placeholder="e.g. NMC-2024-9182"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="sm:col-span-6 space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Teaching Hospital / Medical University
                </label>
                <input
                  type="text"
                  value={formData.institution}
                  onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                  placeholder="e.g. All India Institute of Medical Sciences (AIIMS)"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="sm:col-span-6 space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Department / Division</label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  placeholder="e.g. Gastroenterology &amp; Hepatology"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="sm:col-span-6 space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Clinical Specialization</label>
                <input
                  type="text"
                  value={formData.specialization}
                  onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                  placeholder="e.g. De Ritis Ratio, Liver Cirrhosis &amp; SaMD"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="sm:col-span-6 space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">City &amp; Country</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g. New Delhi, India"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="sm:col-span-12 space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Clinical Bio &amp; Research Focus</label>
                <textarea
                  rows={2}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Summarize your clinical background or medical training focus..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 resize-none"
                />
              </div>
            </div>
          </div>

          {/* Section 4: SaMD Non-Diagnostic Agreement & Submission */}
          <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-600/40 space-y-3">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.agreeToSaMDTerms}
                onChange={(e) => setFormData({ ...formData, agreeToSaMDTerms: e.target.checked })}
                className="mt-0.5 rounded bg-slate-950 border-slate-800 text-cyan-500 focus:ring-0"
              />
              <div className="text-xs text-amber-200/90 leading-relaxed">
                <span className="font-bold text-amber-100">
                  SaMD Educational Non-Diagnostic Acknowledgment:
                </span>{' '}
                I understand that Digitalization in Healthcare is an educational simulation platform based on the Indian Liver Patient Dataset. Algorithms and risk models are intended solely for medical education and research.
              </div>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <button
              type="button"
              onClick={onNavigateToLogin}
              className="text-xs text-slate-400 hover:text-white transition-colors"
            >
              Already registered? <span className="text-cyan-400 font-bold underline">Sign In</span>
            </button>

            <button
              type="submit"
              disabled={isUploading}
              className="w-full sm:w-auto bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold px-8 py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-xl shadow-cyan-950/60 transition-all cursor-pointer disabled:opacity-50"
            >
              {isUploading ? (
                <span>Creating Profile...</span>
              ) : (
                <>
                  <span>Create Clinical Profile &amp; Enter Platform</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
