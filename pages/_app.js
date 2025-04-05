// pages/_app.js
import '../styles/globals.css';
import { AuthProvider, useAuth } from '../context/AuthContext';
import TopBar from '../components/TopBar';
import { useRouter } from 'next/router';
import ProtectedRoute from '../components/ProtectedRoute';

function AppContent({ Component, pageProps }) {
  const router = useRouter();
  const { user } = useAuth();

  // Hide TopBar on login, signup, or the welcome page ("/") when not logged in.
  const hideTopBar =
    router.pathname === '/login' ||
    router.pathname === '/signup' ||
    (router.pathname === '/' && !user);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {!hideTopBar && <TopBar />}
      <Component {...pageProps} />
    </div>
  );
}

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <AppContent Component={Component} pageProps={pageProps} />
    </AuthProvider>
  );
}

export default MyApp;
