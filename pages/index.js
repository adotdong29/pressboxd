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
          <Link
            href="/login"
            className="bg-yellow-500 text-gray-900 py-2 px-4 rounded hover:bg-yellow-400 transition hover:scale-105"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="bg-yellow-500 text-gray-900 py-2 px-4 rounded hover:bg-yellow-400 transition hover:scale-105"
          >
            Sign Up
          </Link>
        </div>
      </div>
    );
  }

  // API-Sports league IDs / endpoints
  const apiKey = process.env.NEXT_PUBLIC_APISPORTS_KEY;
  const configs = {
    soccer: {
      url: `https://v3.football.api-sports.io/fixtures?league=39&season=2023&next=5`,
      header: 'v3.football',
    },
    cricket: {
      url: `https://cricket.api-sports.io/fixtures?season=2025&next=5`,
      header: 'cricket',
    },
    hockey: {
      url: `https://v1.hockey.api-sports.io/games?season=2023&next=5`,
      header: 'v1.hockey',
    },
    tennis: {
      url: `https://tennis.api-sports.io/fixtures?season=2023&next=5`,
      header: 'tennis',
    },
    volleyball: { url: null },
    'table-tennis': { url: null },
    basketball: {
      url: `https://v1.basketball.api-sports.io/games?league=12&season=2023&next=5`,
      header: 'v1.basketball',
    },
    baseball: {
      url: `https://v1.baseball.api-sports.io/games?league=1&season=2023&next=5`,
      header: 'v1.baseball',
    },
    rugby: {
      url: `https://rugby.api-sports.io/fixtures?league=375&season=2023&next=5`,
      header: 'rugby',
    },
    golf: { url: null },
  };
  const sportsList = Object.keys(configs);

  const [upcomingGames, setUpcomingGames] = useState([]);
  const [friendReviews, setFriendReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  // Fetch upcoming fixtures per sport via API-Sports.com
  useEffect(() => {
    async function fetchAll() {
      const results = await Promise.all(
        sportsList.map(async (sport) => {
          const conf = configs[sport];
          if (!conf.url) return { sport, events: [] };

          try {
            const res = await fetch(conf.url, {
              headers: { 'x-apisports-key': apiKey },
            });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const json = await res.json();
            // response field differs by sport API version:
            const events = json.response || json.data || [];
            return { sport, events };
          } catch (err) {
            console.error(`Error fetching ${sport}:`, err);
            return { sport, events: [] };
          }
        })
      );
      setUpcomingGames(results);
    }
    fetchAll();
  }, []);

  // Fetch friends’ latest reviews
  useEffect(() => {
    async function fetchReviews() {
      const { data, error } = await supabase
        .from('reviews')
        .select('*, profiles(username)')
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
                events.map((evt, i) => {
                  // For tennis/cricket may have different field names
                  const home = evt.teams ? evt.teams.home.name : evt.teamsHome?.team_name || evt.home_team || '';
                  const away = evt.teams ? evt.teams.away.name : evt.teamsAway?.team_name || evt.away_team || '';
                  const date = evt.fixture?.date?.split('T')[0] || evt.event_date || '';
                  return (
                    <div key={i} className="mt-2">
                      <p className="text-gray-100 font-semibold">
                        {home} vs {away}
                      </p>
                      <p className="text-gray-400 text-sm">{date}</p>
                    </div>
                  );
                })
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
