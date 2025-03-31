import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const AuthContext = createContext({ user: null, profile: null, loading: true });

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (user) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      if (error) {
        console.error("Error fetching profile:", error);
        return null;
      }
      console.log("Fetched profile:", data);
      return data;
    } catch (err) {
      console.error("Exception in fetchProfile:", err);
      return null;
    }
  };

  useEffect(() => {
    (async () => {
      try {
        console.log("Calling supabase.auth.getSession()...");
        const { data: { session }, error } = await supabase.auth.getSession().catch(err => {
          console.error("getSession catch:", err);
          return { data: { session: null } };
        });
        console.log("getSession returned:", session, "Error:", error);
        if (session) {
          setUser(session.user);
          const prof = await fetchProfile(session.user);
          setProfile(prof);
        } else {
          console.log("No session found");
        }
      } catch (err) {
        console.error("Error in getSession block:", err);
      } finally {
        setLoading(false);
        console.log("Finished getSession; loading is now false");
      }
    })();
  }, []);

  console.log("AuthContext state:", { user, profile, loading });
  return (
    <AuthContext.Provider value={{ user, profile, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
