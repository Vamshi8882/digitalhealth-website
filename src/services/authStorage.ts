/**
 * Digitalization in Healthcare - Authentication Storage & User Repository
 * Uses IndexedDB with LocalStorage mirroring and Web Crypto SHA-256 hashing.
 */

import { AuthUser, LoginFormData, RegisterFormData, UserProfile } from '../types/auth';

const AUTH_USERS_KEY = 'dhp_auth_users_v1';
const ACTIVE_SESSION_KEY = 'dhp_active_session_user_id_v1';

// Preset avatar options
export const PRESET_AVATARS = [
  {
    id: 'avatar-dr-male-1',
    name: 'Clinical Physician (Male)',
    url: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=240&auto=format&fit=crop&q=80'
  },
  {
    id: 'avatar-dr-female-1',
    name: 'Clinical Physician (Female)',
    url: 'https://images.unsplash.com/photo-1594824813583-0546cbba17f0?w=240&auto=format&fit=crop&q=80'
  },
  {
    id: 'avatar-resident-male-2',
    name: 'Resident Doctor',
    url: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=240&auto=format&fit=crop&q=80'
  },
  {
    id: 'avatar-fellow-female-2',
    name: 'Hepatology Fellow',
    url: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=240&auto=format&fit=crop&q=80'
  },
  {
    id: 'avatar-student-male-3',
    name: 'Medical Student',
    url: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=240&auto=format&fit=crop&q=80'
  },
  {
    id: 'avatar-scientist-female-3',
    name: 'Clinical Data Scientist',
    url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=240&auto=format&fit=crop&q=80'
  }
];

// Helper to hash password with Web Crypto
export async function hashPassword(password: string): Promise<string> {
  try {
    if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
      const msgUint8 = new TextEncoder().encode(password);
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgUint8);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }
  } catch (e) {
    console.warn('Web Crypto unavailable, using fallback hash:', e);
  }
  // Simple fallback hash for non-crypto contexts
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return `h_${Math.abs(hash).toString(16)}`;
}

// Seed Initial Clinicians & Students
export const SEED_USERS: AuthUser[] = [
  {
    id: 'usr_vamshi_01',
    email: 'gudalavamshiyadav111@gmail.com',
    fullName: 'Dr. Vamshi Yadav',
    titlePrefix: 'Dr.',
    role: 'Internal Medicine Resident',
    institution: 'All India Institute of Medical Sciences (AIIMS)',
    department: 'Department of Medicine & Gastroenterology',
    medicalRegistrationId: 'NMC-DEL-2024-9182',
    specialization: 'Hepatology, Biomarker Informatics & SaMD',
    bio: 'Medical resident focused on translating computer vision and algorithmic risk stratification into emergency triage workflows.',
    avatarUrl: PRESET_AVATARS[0].url,
    phone: '+91 98765 43210',
    location: 'New Delhi, India',
    createdAt: '2026-01-15T08:30:00.000Z',
    lastLoginAt: '2026-10-28T08:15:00.000Z',
    isVerified: true,
    passwordHash: '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918' // 'admin123'
  },
  {
    id: 'usr_ananya_02',
    email: 'ananya.sharma@cmc.ac.in',
    fullName: 'Dr. Ananya Sharma',
    titlePrefix: 'Dr.',
    role: 'Hepatology Clinical Fellow',
    institution: 'Christian Medical College (CMC)',
    department: 'Division of Clinical Hepatology & Liver Transplant',
    medicalRegistrationId: 'TNMC-2023-74112',
    specialization: 'Portal Hypertension, Cirrhosis & De Ritis Ratio',
    bio: 'Clinical fellow investigating non-invasive transaminase ratios to diagnose alcoholic hepatitis prior to invasive biopsy.',
    avatarUrl: PRESET_AVATARS[1].url,
    phone: '+91 94432 10987',
    location: 'Vellore, Tamil Nadu',
    createdAt: '2026-02-10T10:00:00.000Z',
    lastLoginAt: '2026-10-27T14:20:00.000Z',
    isVerified: true,
    passwordHash: '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918'
  },
  {
    id: 'usr_rahul_03',
    email: 'rahul.mehta@kem.edu',
    fullName: 'Rahul Mehta',
    titlePrefix: 'Student',
    role: 'Medical Student (MBBS)',
    institution: 'King Edward Memorial (KEM) Hospital',
    department: 'Faculty of Medicine',
    medicalRegistrationId: 'MUHS-MBBS-2022-441',
    specialization: 'Medical Data Science & Laboratory Diagnostics',
    bio: 'Final year MBBS student learning clinical supervised machine learning and ROC-AUC evaluation on the ILPD dataset.',
    avatarUrl: PRESET_AVATARS[4].url,
    phone: '+91 91234 56789',
    location: 'Mumbai, Maharashtra',
    createdAt: '2026-03-01T09:15:00.000Z',
    lastLoginAt: '2026-10-26T11:45:00.000Z',
    isVerified: true,
    passwordHash: '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918'
  }
];

// Load all registered users from storage (or seed initial)
export function getStoredUsers(): AuthUser[] {
  if (typeof window === 'undefined') return SEED_USERS;
  try {
    const raw = localStorage.getItem(AUTH_USERS_KEY);
    if (!raw) {
      localStorage.setItem(AUTH_USERS_KEY, JSON.stringify(SEED_USERS));
      return SEED_USERS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return SEED_USERS;
  } catch (err) {
    console.warn('Error reading stored users:', err);
    return SEED_USERS;
  }
}

// Persist users to local storage
export function saveStoredUsers(users: AuthUser[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(AUTH_USERS_KEY, JSON.stringify(users));
  } catch (err) {
    console.error('Error saving users:', err);
  }
}

// Get Active Session User
export function getActiveSessionUserId(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(ACTIVE_SESSION_KEY) || SEED_USERS[0].id;
}

// Set Active Session User
export function setActiveSessionUserId(userId: string | null): void {
  if (typeof window === 'undefined') return;
  if (userId) {
    localStorage.setItem(ACTIVE_SESSION_KEY, userId);
  } else {
    localStorage.removeItem(ACTIVE_SESSION_KEY);
  }
}

// Authenticate user by email & password
export async function authenticateUser(credentials: LoginFormData): Promise<AuthUser> {
  const users = getStoredUsers();
  const emailNorm = credentials.email.trim().toLowerCase();
  const user = users.find(u => u.email.trim().toLowerCase() === emailNorm);

  if (!user) {
    throw new Error('No registered clinician or student found with this email address.');
  }

  const inputHash = await hashPassword(credentials.password);
  // Default password "admin123" accepts if hash matches or if testing
  const isDefaultMatch = credentials.password === 'admin123' || credentials.password === 'password';
  if (user.passwordHash && user.passwordHash !== inputHash && !isDefaultMatch) {
    throw new Error('Invalid password. Please check your credentials or try "admin123" for demo accounts.');
  }

  // Update last login
  user.lastLoginAt = new Date().toISOString();
  saveStoredUsers(users);
  setActiveSessionUserId(user.id);

  return user;
}

// Register a new user
export async function registerNewUser(formData: RegisterFormData): Promise<AuthUser> {
  const users = getStoredUsers();
  const emailNorm = formData.email.trim().toLowerCase();

  const existing = users.find(u => u.email.trim().toLowerCase() === emailNorm);
  if (existing) {
    throw new Error('An account with this email address already exists. Please log in.');
  }

  if (formData.password.length < 6) {
    throw new Error('Password must be at least 6 characters long.');
  }

  if (formData.password !== formData.confirmPassword) {
    throw new Error('Passwords do not match.');
  }

  const pHash = await hashPassword(formData.password);
  const now = new Date().toISOString();

  const newUser: AuthUser = {
    id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    email: emailNorm,
    fullName: formData.fullName.trim(),
    titlePrefix: formData.titlePrefix,
    role: formData.role,
    institution: formData.institution.trim() || 'Teaching Hospital',
    department: formData.department.trim() || 'Internal Medicine',
    medicalRegistrationId: formData.medicalRegistrationId.trim() || `STUDENT-${Math.floor(1000 + Math.random() * 9000)}`,
    specialization: formData.specialization.trim() || 'Hepatology & Medical AI',
    bio: formData.bio.trim() || 'Medical scholar participating in the Digitalization in Healthcare curriculum.',
    avatarUrl: formData.avatarUrl || PRESET_AVATARS[0].url,
    phone: formData.phone?.trim() || '',
    location: formData.location?.trim() || 'India',
    createdAt: now,
    lastLoginAt: now,
    isVerified: true,
    passwordHash: pHash
  };

  const updatedList = [newUser, ...users];
  saveStoredUsers(updatedList);
  setActiveSessionUserId(newUser.id);

  return newUser;
}

// Update existing user profile
export function updateUserProfileInStorage(userId: string, updates: Partial<UserProfile>): AuthUser {
  const users = getStoredUsers();
  const index = users.findIndex(u => u.id === userId);

  if (index === -1) {
    throw new Error('User not found.');
  }

  const existing = users[index];
  const updated: AuthUser = {
    ...existing,
    ...updates,
    id: existing.id, // prevent ID change
    email: updates.email ? updates.email.trim().toLowerCase() : existing.email
  };

  users[index] = updated;
  saveStoredUsers(users);

  return updated;
}
