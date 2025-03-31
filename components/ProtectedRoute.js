// components/ProtectedRoute.js
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { user, profile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return; // Wait for loading to finish

    // If no user, redirect to login
    if (!user) {
      router.push('/login');
    } 
    // If user is logged in but profile is incomplete, redirect to onboarding
    else if (!profile?.username) {
      router.push('/onboarding');
    }
  }, [user, profile, loading, router]);

  if (loading) return <div>Loading...</div>;

  // If user is not logged in or profile incomplete, show a temporary message
  if (!user || !profile?.username) {
    return <div>Redirecting...</div>;
  }

  return children;
}
