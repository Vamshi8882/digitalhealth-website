/**
 * Digitalization in Healthcare - Auth Context & Hook
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AuthUser, LoginFormData, RegisterFormData, UserProfile } from '../types/auth';
import {
  authenticateUser,
  getActiveSessionUserId,
  getStoredUsers,
  registerNewUser,
  saveStoredUsers,
  setActiveSessionUserId,
  updateUserProfileInStorage,
  SEED_USERS
} from '../services/authStorage';

interface AuthContextType {
  currentUser: AuthUser | null;
  isAuthenticated: boolean;
  allUsers: AuthUser[];
  login: (credentials: LoginFormData) => Promise<AuthUser>;
  loginAsDemo: (userId: string) => Promise<AuthUser>;
  signup: (formData: RegisterFormData) => Promise<AuthUser>;
  logout: () => void;
  updateProfile: (updates: Partial<UserProfile>) => Promise<AuthUser>;
  switchUser: (userId: string) => void;
  deleteAccount: (userId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [allUsers, setAllUsers] = useState<AuthUser[]>([]);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);

  // Initialize Auth State from LocalStorage / Seed
  useEffect(() => {
    const users = getStoredUsers();
    setAllUsers(users);

    const activeId = getActiveSessionUserId();
    const activeUser = users.find(u => u.id === activeId) || users[0] || null;
    setCurrentUser(activeUser);
  }, []);

  // Login handler
  const login = useCallback(async (credentials: LoginFormData): Promise<AuthUser> => {
    const authenticated = await authenticateUser(credentials);
    setCurrentUser(authenticated);
    setAllUsers(getStoredUsers());
    return authenticated;
  }, []);

  // Quick Demo Login
  const loginAsDemo = useCallback(async (userId: string): Promise<AuthUser> => {
    const users = getStoredUsers();
    const target = users.find(u => u.id === userId);
    if (!target) {
      throw new Error('Demo account not found.');
    }
    target.lastLoginAt = new Date().toISOString();
    saveStoredUsers(users);
    setActiveSessionUserId(target.id);
    setCurrentUser(target);
    setAllUsers(users);
    return target;
  }, []);

  // Sign up handler
  const signup = useCallback(async (formData: RegisterFormData): Promise<AuthUser> => {
    const created = await registerNewUser(formData);
    setCurrentUser(created);
    setAllUsers(getStoredUsers());
    return created;
  }, []);

  // Logout handler
  const logout = useCallback(() => {
    setActiveSessionUserId(null);
    setCurrentUser(null);
  }, []);

  // Update profile
  const updateProfile = useCallback(async (updates: Partial<UserProfile>): Promise<AuthUser> => {
    if (!currentUser) throw new Error('No active user logged in.');
    const updated = updateUserProfileInStorage(currentUser.id, updates);
    setCurrentUser(updated);
    setAllUsers(getStoredUsers());
    return updated;
  }, [currentUser]);

  // Switch between existing user accounts
  const switchUser = useCallback((userId: string) => {
    const users = getStoredUsers();
    const target = users.find(u => u.id === userId);
    if (target) {
      target.lastLoginAt = new Date().toISOString();
      saveStoredUsers(users);
      setActiveSessionUserId(target.id);
      setCurrentUser(target);
      setAllUsers(users);
    }
  }, []);

  // Delete user account
  const deleteAccount = useCallback((userId: string) => {
    let users = getStoredUsers().filter(u => u.id !== userId);
    if (users.length === 0) {
      users = SEED_USERS;
    }
    saveStoredUsers(users);
    setAllUsers(users);
    if (currentUser?.id === userId) {
      const nextUser = users[0] || null;
      setCurrentUser(nextUser);
      setActiveSessionUserId(nextUser ? nextUser.id : null);
    }
  }, [currentUser]);

  const value: AuthContextType = {
    currentUser,
    isAuthenticated: Boolean(currentUser),
    allUsers,
    login,
    loginAsDemo,
    signup,
    logout,
    updateProfile,
    switchUser,
    deleteAccount
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
