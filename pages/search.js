// pages/search.js
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import GameCard from '../components/GameCard';

export default function Search() {
  const [query, setQuery] = useState('');
  const [games, setGames] = useState([]);

  useEffect(() => {
    async function searchGames() {
      if (!query) {
        setGames([]);
        return;
      }
      const { data, error } = await supabase
        .from('games')
        .select('*')
        .ilike('title', `%${query}%`);
      if (!error) setGames(data);
    }
    searchGames();
  }, [query]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Search Games</h1>
      <input
        type="text"
        placeholder="Type to search..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full p-2 border rounded mb-4"
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {games.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>
    </div>
  );
}
