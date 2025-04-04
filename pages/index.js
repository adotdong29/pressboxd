// pages/index.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import FeaturedCarousel from '../components/FeaturedCarousel';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';

export default function Dashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [featuredGames, setFeaturedGames] = useState([]);
  const [friendReviews, setFriendReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [gamesError, setGamesError] = useState(null);

  // Force login on every visit.
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // Fetch upcoming games from an external sports API with error handling.
  useEffect(() => {
    async function fetchFeaturedGames() {
      try {
        const url =
          'https://www.thesportsdb.com/api/v1/json/1/eventsnextleague.php?id=4328';
        const res = await fetch(url);
        if (!res.ok) {
          const text = await res.text();
          console.error(`HTTP error! status: ${res.status}\nResponse: ${text}`);
          setGamesError(`Error fetching games: HTTP ${res.status}`);
          setFeaturedGames([]);
          return;
        }
        const contentType = res.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          const text = await res.text();
          console.error('Expected JSON response but got:', text);
          setGamesError('Error: Response is not JSON.');
          setFeaturedGames([]);
          return;
        }
        const data = await res.json();
        setFeaturedGames(data.events || []);
      } catch (error) {
        console.error('Error fetching featured games:', error);
        setGamesError('Error fetching featured games.');
        setFeaturedGames([]);
      }
    }
    fetchFeaturedGames();
  }, []);

  // Fetch friend reviews from Supabase.
  useEffect(() => {
    if (user) {
      async function fetchFriendReviews() {
        const { data, error } = await supabase
          .from('reviews')
          .select(`
            *,
            profiles ( username )
          `)
          .order('created_at', { ascending: false })
          .limit(10);
        if (error) {
          console.error('Error fetching friend reviews:', error);
          setFriendReviews([]);
        } else {
          setFriendReviews(data);
        }
        setReviewsLoading(false);
      }
      fetchFriendReviews();
    }
  }, [user]);

  if (loading || !user) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Upcoming Games Carousel */}
      <div className="container mx-auto p-4">
        {gamesError ? (
          <p className="text-red-500">{gamesError}</p>
        ) : (
          <FeaturedCarousel games={featuredGames} />
        )}
      </div>

      {/* Friend Reviews Section */}
      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4 text-yellow-500">
          What Your Friends Are Reviewing
        </h2>
        {reviewsLoading ? (
          <p>Loading reviews...</p>
        ) : friendReviews && friendReviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {friendReviews.map((review) => (
              <div key={review.id} className="bg-gray-800 p-4 rounded shadow">
                <h3 className="font-bold text-yellow-500">
                  {review.game_title || 'Game Title'}
                </h3>
                <p className="text-sm text-gray-400">
                  By {review.profiles?.username || 'Unknown'}
                </p>
                <p className="text-gray-200">{review.review_text}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>No reviews available from your friends yet.</p>
        )}
      </div>
    </div>
  );
}
