// pages/_app.js
import '../styles/globals.css';
import { AuthProvider } from '../context/AuthContext';
import { useRouter } from 'next/router';
import ProtectedRoute from '../components/ProtectedRoute';

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const publicRoutes = ['/', '/login', '/signup', '/onboarding'];
  const isProtectedRoute = !publicRoutes.includes(router.pathname);

  return (
    <AuthProvider>
      {isProtectedRoute ? (
        <ProtectedRoute>
          <Component {...pageProps} />
        </ProtectedRoute>
      ) : (
        <Component {...pageProps} />
      )}
    </AuthProvider>
  );
}

export default MyApp;
