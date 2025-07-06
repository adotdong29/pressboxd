// pages/index.js
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';

export default function IndexPage() {
  const { user, loading } = useAuth();
  if (loading) return <div className="p-4">Loading...</div>;

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center justify-center animate-fadeIn">
        <img src="/logo.png" alt="Pressboxd Logo" className="mb-4 w-48" />
        <h1 className="text-5xl font-bold mb-4 text-yellow-500">
          Welcome to Pressboxd
        </h1>
        <p className="text-xl mb-8">
          Rate and review sports games like never before.
        </p>
        <div className="flex space-x-4">
          <Link href="/login" className="bg-yellow-500 text-gray-900 py-2 px-4 rounded hover:bg-yellow-400 transition hover:scale-105">Login</Link>
          <Link href="/signup" className="bg-yellow-500 text-gray-900 py-2 px-4 rounded hover:bg-yellow-400 transition hover:scale-105">Sign Up</Link>
        </div>
      </div>
    );
  }

  // Map sports → their league IDs for TheSportsDB
  const leagueIds = {
    soccer: '4328',        // English Premier League
    cricket: '5401',       // Major League Cricket
    hockey: '4380',        // NHL
    tennis: '4464',        // ATP World Tour
    volleyball: null,     
    'table-tennis': null, 
    basketball: '4387',    // NBA
    baseball: '4424',      // MLB
    rugby: '5070',         // Major League Rugby
    golf: '4425',          // PGA Tour
  };
  const sportsList = Object.keys(leagueIds);

  const [upcomingGames, setUpcomingGames] = useState([]);
  const [friendReviews, setFriendReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  // Fetch upcoming events for each league
  useEffect(() => {
    async function fetchAll() {
      const apiKey = process.env.NEXT_PUBLIC_SPORTS_API_KEY;
      const results = await Promise.all(
        sportsList.map(async (sport) => {
          const id = leagueIds[sport];
          if (!id) return { sport, events: [] };
          try {
            const res = await fetch(
              `https://www.thesportsdb.com/api/v1/json/${apiKey}/eventsnextleague.php?id=${id}`
            );
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            return { sport, events: data.events || [] };
          } catch {
            return { sport, events: [] };
          }
        })
      );
      setUpcomingGames(results);
    }
    fetchAll();
  }, []);

  // Fetch friends' reviews
  useEffect(() => {
    async function fetchReviews() {
      const { data, error } = await supabase
        .from('reviews')
        .select('*, profiles ( username )')
        .order('created_at', { ascending: false })
        .limit(10);

      setFriendReviews(error ? [] : data);
      setReviewsLoading(false);
    }
    fetchReviews();
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 animate-fadeIn">
      {/* Upcoming Games */}
      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4 text-yellow-500">
          Upcoming Games
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
          {upcomingGames.map(({ sport, events }) => (
            <div
              key={sport}
              className="bg-gray-800 p-4 rounded shadow hover:scale-105 transition"
            >
              <p className="text-yellow-500 font-bold capitalize">{sport}</p>
              {events.length > 0 ? (
                events.map((evt) => (
                  <div key={evt.idEvent} className="mt-2">
                    <p className="text-gray-100 font-semibold">{evt.strEvent}</p>
                    <p className="text-gray-400 text-sm">
                      {evt.dateEvent} {evt.strTime || ''}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 mt-2">No upcoming events</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Friends’ Reviews */}
      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4 text-yellow-500">
          What Your Friends Are Reviewing
        </h2>
        {reviewsLoading ? (
          <p>Loading reviews...</p>
        ) : friendReviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {friendReviews.map((r) => (
              <div
                key={r.id}
                className="bg-gray-800 p-4 rounded shadow hover:scale-105 transition"
              >
                <h3 className="font-bold text-yellow-500">
                  {r.game_title || 'Game Title'}
                </h3>
                <p className="text-sm text-gray-400">
                  By {r.profiles?.username || 'Unknown'}
                </p>
                <p className="text-gray-200">{r.review_text}</p>
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
