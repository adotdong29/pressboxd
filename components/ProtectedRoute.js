// components/ProtectedRoute.js
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { user, profile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return; // Don't redirect until we've loaded auth state

    // If on the onboarding page, allow access regardless of profile completeness
    if (router.pathname === "/onboarding") return;

    if (!user) {
      router.push('/login');
    } else if (!profile?.username) {
      // If profile is incomplete and the user is not on onboarding, send them there.
      router.push('/onboarding');
    }
  }, [user, profile, loading, router]);

  if (loading) return <div>Loading...</div>;

  // Allow onboarding page even if profile is incomplete
  if (router.pathname === "/onboarding") return children;

  // If user is not logged in or profile is incomplete, render a temporary message.
  if (!user || !profile?.username) {
    return <div>Redirecting...</div>;
  }

  return children;
}
