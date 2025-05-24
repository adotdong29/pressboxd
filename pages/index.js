// pages/index.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import FeaturedCarousel from '../components/FeaturedCarousel';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';

export default function IndexPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  if (loading) return <div className="p-4">Loading...</div>;

  // Welcome page for non-authenticated users, including the Pressboxd logo.
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center justify-center animate-fadeIn">
        <img src="/logo.png" alt="Pressboxd Logo" className="mb-4 w-48" />
        <h1 className="text-5xl font-bold mb-4 text-yellow-500">Welcome to Pressboxd</h1>
        <p className="text-xl mb-8">Rate and review sports games like never before.</p>
        <div className="flex space-x-4">
          <Link
            href="/login"
            className="bg-yellow-500 text-gray-900 py-2 px-4 rounded hover:bg-yellow-400 transition transform hover:scale-105"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="bg-yellow-500 text-gray-900 py-2 px-4 rounded hover:bg-yellow-400 transition transform hover:scale-105"
          >
            Sign Up
          </Link>
        </div>
      </div>
    );
  }

  // Dashboard for logged-in users.
  const [featuredGames, setFeaturedGames] = useState([]);
  const [friendReviews, setFriendReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [gamesError, setGamesError] = useState(null);

  useEffect(() => {
    async function fetchFeaturedGames() {
      try {
        // Use TheSportsDB free API key ("1"). Replace the leagueId with an active league if needed.
        const leagueId = '4328'; // Example: English Premier League
        const url = `https://www.thesportsdb.com/api/v1/json/1/eventsnextleague.php?id=${leagueId}`;
        const res = await fetch(url);
        if (res.status === 404) {
          setFeaturedGames([]);
          setGamesError(null);
          return;
        }
        if (!res.ok) {
          const text = await res.text();
          console.error(`HTTP error! status: ${res.status}\nResponse: ${text}`);
          setGamesError(`Error fetching games: HTTP ${res.status}`);
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

  useEffect(() => {
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
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 animate-fadeIn">
      <div className="container mx-auto p-4">
        {gamesError ? (
          <p className="text-red-500">{gamesError}</p>
        ) : (
          <FeaturedCarousel games={featuredGames} />
        )}
      </div>
      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4 text-yellow-500">What Your Friends Are Reviewing</h2>
        {reviewsLoading ? (
          <p>Loading reviews...</p>
        ) : friendReviews && friendReviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {friendReviews.map((review) => (
              <div key={review.id} className="bg-gray-800 p-4 rounded shadow transition transform hover:scale-105">
                <h3 className="font-bold text-yellow-500">{review.game_title || 'Game Title'}</h3>
                <p className="text-sm text-gray-400">By {review.profiles?.username || 'Unknown'}</p>
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
