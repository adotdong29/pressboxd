// pages/auth/callback.js
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../../lib/supabaseClient';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    // Listen for changes in authentication state (e.g., when the email is confirmed).
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        router.push('/'); // Redirect to homepage or any other protected page.
      }
    });

    // Optionally, check for an existing session.
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.push('/');
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p>Processing email confirmation...</p>
    </div>
  );
}
