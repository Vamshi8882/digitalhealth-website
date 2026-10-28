/**
 * Digitalization in Healthcare - Authentication & User Profile Types
 */

export type ClinicalRole =
  | 'Medical Student (MBBS)'
  | 'Internal Medicine Resident'
  | 'Hepatology Clinical Fellow'
  | 'Consultant Gastroenterologist'
  | 'Clinical Data Scientist'
  | 'Biomedical Informatics Researcher';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  titlePrefix: 'Dr.' | 'Student' | 'Prof.' | 'Mr.' | 'Ms.';
  role: ClinicalRole;
  institution: string;
  department: string;
  medicalRegistrationId: string; // NMC / Medical Council / Student Roll ID
  specialization: string;
  bio: string;
  avatarUrl: string; // Base64 data URL or preset avatar identifier
  phone?: string;
  location?: string;
  createdAt: string;
  lastLoginAt: string;
  isVerified: boolean;
}

export interface AuthUser extends UserProfile {
  passwordHash?: string;
}

export interface LoginFormData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterFormData {
  fullName: string;
  titlePrefix: 'Dr.' | 'Student' | 'Prof.' | 'Mr.' | 'Ms.';
  email: string;
  password: string;
  confirmPassword: string;
  role: ClinicalRole;
  institution: string;
  department: string;
  medicalRegistrationId: string;
  specialization: string;
  bio: string;
  avatarUrl: string;
  phone?: string;
  location?: string;
  agreeToSaMDTerms: boolean;
}
