// components/ProtectedRoute.js
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { user, profile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    console.log("ProtectedRoute - loading:", loading, "user:", user, "profile:", profile);
    if (loading) return; // Wait until auth state is loaded

    if (!user) {
      console.log("No user found. Redirecting to /login");
      router.push('/login');
    } else if (!profile?.username) {
      console.log("Profile incomplete. Redirecting to /onboarding");
      router.push('/onboarding');
    }
  }, [user, profile, loading, router]);

  if (loading) return <div>Loading...</div>;
  if (!user || !profile?.username) return <div>Redirecting...</div>;

  return children;
}
