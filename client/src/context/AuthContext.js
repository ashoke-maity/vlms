import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/auth';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    let supabase;
    let unsub = null;
    (async () => {
      try {
        const { createClient } = require('@supabase/supabase-js');
        const supabaseUrl = import.meta.env.VITE_SUPABASE_PROJECT_URL;
        const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
        
        if (!supabaseUrl || !supabaseKey || supabaseKey.includes('placeholder')) {
          console.warn('Supabase credentials not configured, using local auth only');
          // fallback to local authService
          const currentUser = authService.getCurrentUser();
          const isAuth = authService.isAuthenticated();
          setUser(currentUser);
          setIsAuthenticated(isAuth);
          setLoading(false);
          return;
        }
        
        supabase = createClient(supabaseUrl, supabaseKey);

        // On mount, check current session (handles OAuth redirect)
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email,
            ...session.user.user_metadata
          });
          setIsAuthenticated(true);
        } else {
          // fallback to local authService
          const currentUser = authService.getCurrentUser();
          const isAuth = authService.isAuthenticated();
          setUser(currentUser);
          setIsAuthenticated(isAuth);
        }
        setLoading(false);

        // Listen for Supabase auth state changes (OAuth, etc.)
        const { data: listener } = supabase.auth.onAuthStateChange(async (event, session) => {
          console.log('🔄 Auth state change:', event, { hasSession: !!session, hasUser: !!session?.user });
          
          if (event === 'SIGNED_IN') {
            if (session?.access_token) {
              // It's a Google login or other OAuth
              try {
                console.log('🚀 Processing OAuth login...');
                const response = await authService.googleLogin(session.access_token);
                if (response.ok) {
                  const currentUser = authService.getCurrentUser();
                  setUser(currentUser);
                  setIsAuthenticated(true);
                  console.log('✅ Google login successful, user authenticated');
                } else {
                  console.log('❌ Google login failed:', response.message);
                }
              } catch (error) {
                console.error('🚨 Google login failed:', error);
              }
            } else if (session?.user) {
              // It's a manual email/password login
              const { user } = session;
              setUser({
                id: user.id,
                email: user.email,
                ...user.user_metadata
              });
              setIsAuthenticated(true);
              console.log('✅ Email login successful');
            }
          } else if (event === 'SIGNED_OUT') {
            console.log('🚪 User signed out');
            setUser(null);
            setIsAuthenticated(false);
            authService.logout(); // Clear local storage
          }
        });
        unsub = listener?.subscription;
      } catch (err) {
        console.warn('Supabase initialization failed, using local auth:', err.message);
        // fallback to local authService
        const currentUser = authService.getCurrentUser();
        const isAuth = authService.isAuthenticated();
        setUser(currentUser);
        setIsAuthenticated(isAuth);
        setLoading(false);
      }
    })();
    return () => {
      unsub?.unsubscribe();
    };
  }, []);

  const login = async (credentials) => {
    try {
      setLoading(true);
      const response = await authService.login(credentials);
      
      if (response.ok) {
        const currentUser = authService.getCurrentUser();
        setUser(currentUser);
        setIsAuthenticated(true);
        return { success: true, data: response };
      } else {
        return { success: false, error: response.message };
      }
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await authService.register(userData);
      
      if (response.ok) {
        const currentUser = authService.getCurrentUser();
        setUser(currentUser);
        setIsAuthenticated(true);
        return { success: true, data: response };
      } else {
        return { success: false, error: response.message };
      }
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout
  };

  return React.createElement(AuthContext.Provider, { value }, children);
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}