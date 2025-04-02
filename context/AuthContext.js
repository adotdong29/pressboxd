import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const AuthContext = createContext({ user: null, profile: null, loading: true });

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Helper function to fetch the profile for a given user.
  const fetchProfile = async (user) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      if (error) {
        console.warn("Profile not found (new user?) or error:", error.message);
        return null;
      }
      return data;
    } catch (err) {
      console.error("Exception in fetchProfile:", err);
      return null;
    }
  };

  useEffect(() => {
    // Initial session fetch
    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (session) {
          setUser(session.user);
          const prof = await fetchProfile(session.user);
          setProfile(prof);
        }
      } catch (err) {
        console.error("Error in getSession:", err);
      } finally {
        setLoading(false);
        console.log("Finished initial getSession; loading is now false");
      }
    };

    getSession();

    // Listen for auth state changes (e.g. login or logout)
    const { data: listener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state change event:", event, session);
      if (session) {
        setUser(session.user);
        const prof = await fetchProfile(session.user);
        setProfile(prof);
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    });

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    console.log("AuthContext updated:", { user, profile, loading });
  }, [user, profile, loading]);

  return (
    <AuthContext.Provider value={{ user, profile, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
