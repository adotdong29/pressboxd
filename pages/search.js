// pages/search.js
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import Link from 'next/link';

export default function SearchPage() {
  const router = useRouter();
  const { q } = router.query;
  const [userResults, setUserResults] = useState([]);
  const [gameResults, setGameResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!q) return;
    async function search() {
      setLoading(true);
      // Search users in profiles table
      const { data: users, error: userError } = await supabase
        .from('profiles')
        .select('*')
        .ilike('username', `%${q}%`);
      if (userError) console.error('Error searching users:', userError);
      else setUserResults(users);

      // Search games in games table (if exists)
      const { data: games, error: gameError } = await supabase
        .from('games')
        .select('*')
        .ilike('title', `%${q}%`);
      if (gameError) console.error('Error searching games:', gameError);
      else setGameResults(games);

      setLoading(false);
    }
    search();
  }, [q]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-4 text-yellow-500">Search Results</h1>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-2 text-yellow-500">Users</h2>
              {userResults.length > 0 ? (
                userResults.map((user) => (
                  <div key={user.id} className="bg-gray-800 p-4 rounded shadow mb-2">
                    <p>{user.username}</p>
                  </div>
                ))
              ) : (
                <p>No users found.</p>
              )}
            </section>
            <section>
              <h2 className="text-2xl font-bold mb-2 text-yellow-500">Games</h2>
              {gameResults.length > 0 ? (
                gameResults.map((game) => (
                  <div key={game.id} className="bg-gray-800 p-4 rounded shadow mb-2">
                    <p>{game.title}</p>
                  </div>
                ))
              ) : (
                <p>No games found.</p>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
}
