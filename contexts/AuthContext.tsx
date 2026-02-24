/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User } from '../types';
import { DEMO_SELLER, DEMO_BUYER } from '../constants';

interface AuthContextType {
  user: User | null;
  users: User[];
  isAuthenticated: boolean;
  login: (email: string, password: string) => { success: boolean; error?: string };
  signup: (name: string, email: string, password: string, role: 'seller' | 'buyer') => { success: boolean; error?: string };
  logout: () => void;
  switchUser: (userId: string) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);

  // Initialize: load users and current session from localStorage
  useEffect(() => {
    const savedUsers = localStorage.getItem('chatmarket_users');
    let loadedUsers: User[] = savedUsers ? JSON.parse(savedUsers) : [];

    // Seed demo accounts if not present
    if (!loadedUsers.find(u => u.id === DEMO_SELLER.id)) {
      loadedUsers = [DEMO_SELLER, ...loadedUsers];
    }
    if (!loadedUsers.find(u => u.id === DEMO_BUYER.id)) {
      loadedUsers = [DEMO_BUYER, ...loadedUsers];
    }

    setUsers(loadedUsers);
    localStorage.setItem('chatmarket_users', JSON.stringify(loadedUsers));

    // Restore session
    const sessionId = localStorage.getItem('chatmarket_session');
    if (sessionId) {
      const sessionUser = loadedUsers.find(u => u.id === sessionId);
      if (sessionUser) setUser(sessionUser);
    }
  }, []);

  const persistUsers = useCallback((updated: User[]) => {
    setUsers(updated);
    localStorage.setItem('chatmarket_users', JSON.stringify(updated));
  }, []);

  const login = useCallback((email: string, password: string) => {
    const found = users.find(u => u.email === email && u.password === password);
    if (!found) return { success: false, error: 'Invalid email or password' };
    setUser(found);
    localStorage.setItem('chatmarket_session', found.id);
    return { success: true };
  }, [users]);

  const signup = useCallback((name: string, email: string, password: string, role: 'seller' | 'buyer') => {
    if (users.find(u => u.email === email)) {
      return { success: false, error: 'Email already registered' };
    }
    const newUser: User = {
      id: `${role}-${Date.now()}`,
      email,
      password,
      name,
      avatar: name.charAt(0).toUpperCase(),
      role,
      createdAt: Date.now(),
    };
    const updated = [...users, newUser];
    persistUsers(updated);
    setUser(newUser);
    localStorage.setItem('chatmarket_session', newUser.id);
    return { success: true };
  }, [users, persistUsers]);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('chatmarket_session');
  }, []);

  const switchUser = useCallback((userId: string) => {
    const found = users.find(u => u.id === userId);
    if (found) {
      setUser(found);
      localStorage.setItem('chatmarket_session', found.id);
    }
  }, [users]);

  return (
    <AuthContext.Provider value={{ user, users, isAuthenticated: !!user, login, signup, logout, switchUser }}>
      {children}
    </AuthContext.Provider>
  );
};
