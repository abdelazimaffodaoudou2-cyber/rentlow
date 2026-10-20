import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, SubscriptionTier } from '../types';
import { DEMO_USERS } from '../data/mockData';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, pass: string, rememberMe?: boolean) => Promise<{ success: boolean; error?: string }>;
  register: (data: {
    fullName: string;
    email: string;
    phone: string;
    role: UserRole;
    password: string;
  }) => Promise<{ success: boolean; error?: string }>;
  loginAsDemoUser: (userId: string) => void;
  logout: () => void;
  updateSubscriptionPlan: (tier: SubscriptionTier) => void;
  switchRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'rentflow_current_user_v1';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback
    }
    return null; // Starts unauthenticated to respect "authentification obligatoire avant connexion"
  });

  const isAuthenticated = user !== null;

  useEffect(() => {
    if (user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, [user]);

  const login = async (email: string, pass: string, _rememberMe = true): Promise<{ success: boolean; error?: string }> => {
    // Validate email & pass
    if (!email || !pass) {
      return { success: false, error: 'Veuillez saisir votre adresse email et votre mot de passe.' };
    }

    const matchedDemo = DEMO_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (matchedDemo) {
      setUser(matchedDemo);
      return { success: true };
    }

    // Allow custom login with realistic user
    const newUser: User = {
      id: `user_${Date.now()}`,
      email,
      fullName: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      phone: '+229 97 00 00 00',
      role: 'PROPRIETAIRE',
      subscriptionPlan: 'PRO'
    };
    setUser(newUser);
    return { success: true };
  };

  const register = async (data: {
    fullName: string;
    email: string;
    phone: string;
    role: UserRole;
    password: string;
  }): Promise<{ success: boolean; error?: string }> => {
    if (!data.fullName || !data.email || !data.phone || !data.password) {
      return { success: false, error: 'Veuillez remplir tous les champs obligatoires.' };
    }

    const newUser: User = {
      id: `user_${Date.now()}`,
      email: data.email,
      fullName: data.fullName,
      phone: data.phone,
      role: data.role,
      subscriptionPlan: data.role === 'LOCATAIRE' ? 'FREE' : 'PRO',
      tenantUnitId: data.role === 'LOCATAIRE' ? 'unit_102' : undefined
    };

    setUser(newUser);
    return { success: true };
  };

  const loginAsDemoUser = (userId: string) => {
    const demo = DEMO_USERS.find(u => u.id === userId);
    if (demo) {
      setUser(demo);
    }
  };

  const logout = () => {
    setUser(null);
  };

  const updateSubscriptionPlan = (tier: SubscriptionTier) => {
    if (user) {
      setUser({ ...user, subscriptionPlan: tier });
    }
  };

  const switchRole = (newRole: UserRole) => {
    if (user) {
      // Find matching demo or update current user
      const matchedDemo = DEMO_USERS.find(u => u.role === newRole);
      if (matchedDemo) {
        setUser(matchedDemo);
      } else {
        setUser({ ...user, role: newRole });
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        register,
        loginAsDemoUser,
        logout,
        updateSubscriptionPlan,
        switchRole
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
