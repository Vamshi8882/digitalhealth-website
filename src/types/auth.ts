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

export type UserType = 'student' | 'faculty';

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  fullName: string;
  titlePrefix: 'Dr.' | 'Student' | 'Prof.' | 'Mr.' | 'Ms.';
  role: ClinicalRole;
  userType: UserType;
  institution: string;
  department: string;
  medicalRegistrationId: string; // NMC / Medical Council / Student Roll ID
  specialization: string;
  bio: string;
  avatarUrl: string; // Base64 data URL or preset avatar identifier
  phone: string;
  country: string;
  state: string;
  areaAddress: string;
  postalCode?: string;
  location?: string;
  createdAt: string;
  lastLoginAt: string;
  isVerified: boolean;
  completedModulesList?: number[];
  solvedHospitalCases?: string[];
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
  username?: string;
  fullName: string;
  titlePrefix: 'Dr.' | 'Student' | 'Prof.' | 'Mr.' | 'Ms.';
  email: string;
  password: string;
  confirmPassword: string;
  role: ClinicalRole;
  userType: UserType;
  institution: string;
  department: string;
  medicalRegistrationId: string;
  specialization: string;
  bio: string;
  avatarUrl: string;
  phone: string;
  country: string;
  state: string;
  areaAddress: string;
  location?: string;
  agreeToSaMDTerms: boolean;
}
