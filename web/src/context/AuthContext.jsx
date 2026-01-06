import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../config/supabase';
import api from '../services/api';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check Supabase session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          // Get profile from backend
          try {
            const response = await api.get('/users/me');
            if (response.data.success && response.data.data?.profile) {
              setUser(session.user);
              setProfile(response.data.data.profile);
            }
          } catch (error) {
            // Silent - clear session on profile fetch failure
            await supabase.auth.signOut();
            setUser(null);
            setProfile(null);
          }
        }
      } catch (error) {
        // Silent - not authenticated
        setUser(null);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    // Listen for auth changes
    // NOTE: Navigation is handled by login/register functions, not here
    // This listener only updates state to keep UI in sync
    const authStateChangeResult = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('[AuthContext] Auth state change:', event, { hasSession: !!session, hasUser: !!session?.user });
      
      if (event === 'SIGNED_IN' && session) {
        // Only update user if it's different (prevents unnecessary re-renders)
        setUser((prevUser) => {
          if (prevUser?.id !== session.user.id) {
            console.log('[AuthContext] Setting user from auth listener');
            return session.user;
          }
          return prevUser;
        });
        
        // Try to fetch profile in background (don't block, don't navigate)
        // Navigation is handled by login/register functions
        api.get('/users/me')
          .then((response) => {
            if (response.data.success && response.data.data?.profile) {
              console.log('[AuthContext] Profile fetched in auth listener');
              setProfile(response.data.data.profile);
            }
          })
          .catch((error) => {
            // Silent - profile fetch failed, will be fetched later
            console.log('[AuthContext] Profile fetch failed in auth listener (non-critical):', error.message);
          });
      } else if (event === 'SIGNED_OUT') {
        console.log('[AuthContext] User signed out');
        setUser(null);
        setProfile(null);
      }
    });

    return () => {
      if (authStateChangeResult?.data?.subscription) {
        authStateChangeResult.data.subscription.unsubscribe();
      }
    };
  }, []);

  const login = async (email, password) => {
    console.log('[AuthContext] login() called');
    
    // Create timeout promise
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Login request timed out. Please try again.')), 15000);
    });

    try {
      console.log('[AuthContext] Starting Supabase signInWithPassword');
      // Sign in with Supabase Auth directly with timeout
      const signInPromise = supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      const { data: signInData, error: signInError } = await Promise.race([
        signInPromise,
        timeoutPromise
      ]);

      console.log('[AuthContext] Supabase signInWithPassword completed', { 
        hasUser: !!signInData?.user, 
        hasSession: !!signInData?.session,
        error: signInError?.message 
      });

      if (signInError) {
        console.error('[AuthContext] Sign in error:', signInError);
        toast.error(signInError.message || 'Invalid login credentials');
        return { success: false, error: signInError.message };
      }

      if (!signInData.user || !signInData.session) {
        console.error('[AuthContext] No session received');
        toast.error('Login failed - no session received');
        return { success: false, error: 'No session data' };
      }

      // Set user immediately
      console.log('[AuthContext] Setting user state');
      setUser(signInData.user);

      // Fetch profile immediately before navigation (required for isAuthenticated check)
      try {
        console.log('[AuthContext] Fetching profile from /users/me');
        const profilePromise = api.get('/users/me');
        const response = await Promise.race([
          profilePromise,
          timeoutPromise
        ]);
        
        console.log('[AuthContext] Profile fetch completed');
        const profile = response.data.data?.profile || response.data.profile;
        if (profile) {
          console.log('[AuthContext] Profile found, setting profile and navigating');
          setProfile(profile);
          
          // Navigate based on role
          const role = profile.role || 'student';
          if (['admin', 'owner'].includes(role.toLowerCase())) {
            console.log('[AuthContext] Navigating to admin/overview');
            navigate('/admin/overview', { replace: true });
          } else if (role.toLowerCase() === 'instructor') {
            console.log('[AuthContext] Navigating to instructor/overview');
            navigate('/instructor/overview', { replace: true });
          } else {
            console.log('[AuthContext] Navigating to student/dashboard');
            navigate('/student/dashboard', { replace: true });
          }
        } else {
          // Profile not found, try to bootstrap
          console.log('[AuthContext] Profile not found, attempting bootstrap');
          try {
            const bootstrapPromise = api.post('/auth/bootstrap', {
              first_name: '',
              last_name: '',
              country: '',
              country_code: '',
            });
            await Promise.race([bootstrapPromise, timeoutPromise]);
            
            console.log('[AuthContext] Bootstrap completed, fetching profile again');
            const retryPromise = api.get('/users/me');
            const retryResponse = await Promise.race([
              retryPromise,
              timeoutPromise
            ]);
            
            const retryProfile = retryResponse.data.data?.profile || retryResponse.data.profile;
            if (retryProfile) {
              console.log('[AuthContext] Profile found after bootstrap, navigating');
              setProfile(retryProfile);
              const role = retryProfile.role || 'student';
              if (['admin', 'owner'].includes(role.toLowerCase())) {
                navigate('/admin/overview', { replace: true });
              } else if (role.toLowerCase() === 'instructor') {
                navigate('/instructor/overview', { replace: true });
              } else {
                navigate('/student/dashboard', { replace: true });
              }
            } else {
              // No profile after bootstrap - set minimal profile to allow navigation
              console.log('[AuthContext] No profile after bootstrap, setting minimal profile');
              setProfile({ 
                id: signInData.user.id, 
                role: 'student',
                email: signInData.user.email 
              });
              navigate('/student/dashboard', { replace: true });
            }
          } catch (bootstrapError) {
            console.error('[AuthContext] Bootstrap failed:', bootstrapError);
            // Bootstrap failed, navigate to student dashboard anyway
            setProfile({ 
              id: signInData.user.id, 
              role: 'student',
              email: signInData.user.email 
            });
            navigate('/student/dashboard', { replace: true });
          }
        }
      } catch (profileError) {
        console.error('[AuthContext] Profile fetch failed:', profileError);
        // Profile fetch failed - set a minimal profile to allow navigation
        // The auth state change listener will fetch the real profile
        setProfile({ 
          id: signInData.user.id, 
          role: 'student',
          email: signInData.user.email 
        });
        navigate('/student/dashboard', { replace: true });
      }

      console.log('[AuthContext] Login successful');
      toast.success('Login successful!');
      return { success: true };
    } catch (error) {
      console.error('[AuthContext] Login error:', error);
      const message = error.message || 'Login failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const register = async (registerData) => {
    console.log('[AuthContext] register() called');
    
    // Create timeout promise
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Registration request timed out. Please try again.')), 20000);
    });

    try {
      // Extract data from registerData object
      const { email, password, name, first_name, last_name, country, country_code } = registerData;

      // Validate required fields
      if (!email || !password) {
        console.error('[AuthContext] Missing email or password');
        toast.error('Email and password are required');
        return { success: false, error: 'Email and password are required' };
      }

      // Split name into first_name and last_name if name is provided
      let firstName = first_name || '';
      let lastName = last_name || '';
      
      if (name && !firstName && !lastName) {
        const nameParts = name.trim().split(/\s+/);
        firstName = nameParts[0] || '';
        lastName = nameParts.slice(1).join(' ') || '';
      }

      // Call backend API for registration
      console.log('[AuthContext] Calling /auth/register');
      const registerPromise = api.post('/auth/register', {
        email,
        password,
        first_name: firstName,
        last_name: lastName,
        country: country || '',
        country_code: country_code || ''
      });
      
      const response = await Promise.race([
        registerPromise,
        timeoutPromise
      ]);

      console.log('[AuthContext] Registration API call completed', { 
        hasUser: !!response.data?.user,
        hasProfile: !!response.data?.profile 
      });

      if (response.data && response.data.user) {
        // User was created, now sign in with Supabase to get session
        try {
          console.log('[AuthContext] Attempting Supabase signInWithPassword after registration');
          const signInPromise = supabase.auth.signInWithPassword({
            email,
            password,
          });
          
          const { data: signInData, error: signInError } = await Promise.race([
            signInPromise,
            timeoutPromise
          ]);

          console.log('[AuthContext] Sign in after registration completed', {
            hasUser: !!signInData?.user,
            hasSession: !!signInData?.session,
            error: signInError?.message
          });

          if (signInError) {
            console.error('[AuthContext] Sign in after registration failed:', signInError);
            // Check if email confirmation is required
            if (signInError.message?.toLowerCase().includes('email') || 
                signInError.message?.toLowerCase().includes('confirm')) {
              toast.error('Registration successful! Please check your email to confirm your account.');
              return { 
                success: true, 
                user: response.data.user, 
                profile: response.data.profile,
                needsEmailConfirmation: true,
                needsManualLogin: true
              };
            }
            toast.error('Registration successful but sign-in failed. Please log in manually.');
            return { 
              success: true, 
              user: response.data.user, 
              profile: response.data.profile,
              needsManualLogin: true
            };
          }

          // Check if we have a session (email confirmation might be required)
          if (!signInData.session) {
            console.log('[AuthContext] No session after sign in - email confirmation likely required');
            toast.success('Registration successful! Please check your email to confirm your account.');
            return { 
              success: true, 
              user: signInData.user || response.data.user, 
              profile: response.data.profile,
              needsEmailConfirmation: true
            };
          }

          // Set user and profile
          console.log('[AuthContext] Setting user and profile after successful registration');
          setUser(signInData.user);
          setProfile(response.data.profile);

          toast.success('Registration successful!');
          
          // Check if profile needs onboarding (only during registration)
          const profile = response.data.profile;
          const needsOnboarding = !profile?.first_name || !profile?.last_name || !profile?.country;
          
          if (needsOnboarding) {
            console.log('[AuthContext] Profile needs onboarding, navigating to /onboarding');
            navigate('/onboarding', { replace: true });
            return { 
              success: true, 
              user: signInData.user, 
              profile: response.data.profile,
              needsOnboarding: true
            };
          }
          
          // Profile is complete, route based on role
          const role = profile?.role || 'student';
          console.log('[AuthContext] Navigating based on role:', role);
          if (['admin', 'owner'].includes(role)) {
            navigate('/admin/overview', { replace: true });
          } else if (role === 'instructor') {
            navigate('/instructor/overview', { replace: true });
          } else {
            navigate('/student/dashboard', { replace: true });
          }
          
          return { 
            success: true, 
            user: signInData.user, 
            profile: response.data.profile
          };
        } catch (signInError) {
          console.error('[AuthContext] Sign in error after registration:', signInError);
          toast.error('Registration successful but sign-in failed. Please log in manually.');
          return { 
            success: true, 
            user: response.data.user, 
            profile: response.data.profile,
            needsManualLogin: true
          };
        }
      } else {
        console.error('[AuthContext] Invalid response from server');
        toast.error('Registration failed - invalid response from server');
        return { success: false, error: 'Invalid server response' };
      }
    } catch (error) {
      console.error('[AuthContext] Registration error:', error);
      let message = error.response?.data?.details || error.response?.data?.error || error.message || 'Registration failed';
      
      // Handle specific error codes
      if (error.response?.data?.code === 'MISSING_TABLE') {
        // Show helpful message with instructions
        const instructions = error.response?.data?.instructions || [];
        message = 'Database setup required. The profiles table needs to be created.';
        toast.error(message, { duration: 10000 });
        
        // Log SQL to console for easy access (only in development, minimal output)
        if (error.response?.data?.sql && import.meta.env.DEV) {
          console.log('📋 SQL to run in Supabase SQL Editor:');
          console.log(error.response.data.sql);
        }
      } else if (error.response?.data?.code === 'PROFILE_CREATION_FAILED') {
        message = error.response?.data?.details || 'Profile creation failed. Please try again or contact support.';
        toast.error(message, { duration: 6000 });
      } else if (error.response?.data?.code === 'FOREIGN_KEY_MISMATCH') {
        message = error.response?.data?.details || 'Database configuration error. Please contact support.';
        toast.error(message, { duration: 10000 });
        if (error.response?.data?.migrationFile && import.meta.env.DEV) {
          console.error('🔧 Run this migration in Supabase SQL Editor:', error.response.data.migrationFile);
          console.error('📋 Quick fix: Open', error.response.data.migrationFile, 'and run it in Supabase SQL Editor');
        }
      } else {
        toast.error(message);
      }
      
      return { success: false, error: message };
    }
  };

  const logout = async () => {
    try {
      console.log('[AuthContext] Logout called');
      // Clear Supabase session
      const { error: signOutError } = await supabase.auth.signOut();
      
      // Clear all state
      setUser(null);
      setProfile(null);
      
      // Clear all storage
      localStorage.clear();
      sessionStorage.clear();
      
      console.log('[AuthContext] Logout completed, state cleared');
      
      if (!signOutError) {
        toast.success('Logged out successfully');
      }
    } catch (error) {
      console.error('[AuthContext] Logout error:', error);
      // Even if there's an error, clear state
      setUser(null);
      setProfile(null);
      localStorage.clear();
      sessionStorage.clear();
      toast.success('Logged out successfully');
    }
    // Note: Navigation is handled by the component calling logout (AppNavbar)
  };

  const refreshProfile = useCallback(async () => {
    try {
      const response = await api.get('/me');
      if (response.data.success || response.data.profile) {
        const profile = response.data.profile || response.data.data?.profile;
        setProfile(profile);
        return { success: true, profile };
      }
    } catch (error) {
      // Silent - return error without logging
      return { success: false, error: error.message };
    }
  }, []);

  const value = {
    user,
    profile,
    loading,
    login,
    register,
    logout,
    refreshProfile,
    isAuthenticated: !!user && !!profile,
    role: profile?.role || null,
    isOnboarded: !!(profile?.first_name && profile?.last_name && profile?.country)
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

