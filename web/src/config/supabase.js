import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

let supabase;

if (!supabaseUrl || !supabaseAnonKey) {
  // Always create a safe mock client to prevent crashes
  // Silent - no warnings
  
  const mockSubscription = { unsubscribe: () => {} };
  supabase = {
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      signInWithPassword: () => Promise.resolve({ 
        data: null, 
        error: { message: 'Supabase not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY' } 
      }),
      signUp: () => Promise.resolve({ 
        data: null, 
        error: { message: 'Supabase not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY' } 
      }),
      signOut: () => Promise.resolve({ error: null }),
      setSession: () => Promise.resolve({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: mockSubscription } })
    },
    from: () => ({
      select: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
      insert: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
      update: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
      delete: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } })
    })
  };
} else {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
  } catch (error) {
    // Silent - fall back to mock client
    const mockSubscription = { unsubscribe: () => {} };
    supabase = {
      auth: {
        getSession: () => Promise.resolve({ data: { session: null }, error: null }),
        signInWithPassword: () => Promise.resolve({ data: null, error: { message: 'Supabase client error' } }),
        signUp: () => Promise.resolve({ data: null, error: { message: 'Supabase client error' } }),
        signOut: () => Promise.resolve({ error: null }),
        setSession: () => Promise.resolve({ data: { session: null }, error: null }),
        onAuthStateChange: () => ({ data: { subscription: mockSubscription } })
      },
      from: () => ({
        select: () => Promise.resolve({ data: null, error: { message: 'Supabase client error' } }),
        insert: () => Promise.resolve({ data: null, error: { message: 'Supabase client error' } }),
        update: () => Promise.resolve({ data: null, error: { message: 'Supabase client error' } }),
        delete: () => Promise.resolve({ data: null, error: { message: 'Supabase client error' } })
      })
    };
  }
}

export { supabase };
