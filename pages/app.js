// pages/app.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';

export default function AppPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // Fetch reviews from Supabase
  useEffect(() => {
    async function fetchReviews() {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) {
        console.error('Error fetching reviews:', error);
      } else {
        setReviews(data);
      }
      setLoadingReviews(false);
    }
    if (user) {
      fetchReviews();
    }
  }, [user]);

  if (loading || !user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-blue-600 text-white py-4 shadow">
        <div className="container mx-auto flex justify-between items-center px-4">
          <h1 className="text-2xl font-bold">Pressboxd</h1>
          <nav>
            <ul className="flex space-x-4">
              <li>
                <a href="/app" className="hover:underline">
                  Home
                </a>
              </li>
              <li>
                <a href="/profile" className="hover:underline">
                  Profile
                </a>
              </li>
              <li>
                <a href="/reviews" className="hover:underline">
                  Reviews
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-4">
        <h2 className="text-xl font-semibold mb-4">Recent Reviews</h2>
        {loadingReviews ? (
          <p>Loading reviews...</p>
        ) : reviews && reviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reviews.map((review) => (
              <div key={review.id} className="bg-white p-4 rounded shadow">
                <h3 className="text-lg font-bold mb-2">
                  {review.game_title || 'Untitled Game'}
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  Rated: {review.rating ? `${review.rating} / 10` : 'N/A'}
                </p>
                <p className="text-gray-800">
                  {review.review_text || 'No review text provided.'}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p>No reviews found. Be the first to add one!</p>
        )}
      </main>
    </div>
  );
}
