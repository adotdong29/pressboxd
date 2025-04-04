// pages/_app.js
import '../styles/globals.css';
import { AuthProvider } from '../context/AuthContext';
import { useRouter } from 'next/router';
import ProtectedRoute from '../components/ProtectedRoute';

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  // Only allow public routes for login and signup; all others are protected.
  const publicRoutes = ['/login', '/signup'];
  const isPublicRoute = publicRoutes.includes(router.pathname);

  return (
    <AuthProvider>
      <div className="min-h-screen dark bg-gray-900 text-gray-100">
        {isPublicRoute ? (
          <Component {...pageProps} />
        ) : (
          <ProtectedRoute>
            <Component {...pageProps} />
          </ProtectedRoute>
        )}
      </div>
    </AuthProvider>
  );
}

export default MyApp;
