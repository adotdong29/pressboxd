// pages/_app.js
import '../styles/globals.css';
import { AuthProvider } from '../context/AuthContext';
import { useRouter } from 'next/router';
import ProtectedRoute from '../components/ProtectedRoute';

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  // List all routes that should be public
  const publicRoutes = ['/', '/login', '/signup', '/onboarding'];
  const isPublicRoute = publicRoutes.some((route) =>
    router.pathname.startsWith(route)
  );

  return (
    <AuthProvider>
      {isPublicRoute ? (
        <Component {...pageProps} />
      ) : (
        <ProtectedRoute>
          <Component {...pageProps} />
        </ProtectedRoute>
      )}
    </AuthProvider>
  );
}

export default MyApp;
