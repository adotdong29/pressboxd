// pages/game/[id].js
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import RatingComponent from '../../components/RatingComponent';

export default function GameDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [game, setGame] = useState(null);

  useEffect(() => {
    if (id) {
      async function fetchGame() {
        const { data, error } = await supabase.from('games').select('*').eq('id', id).single();
        if (!error) setGame(data);
      }
      fetchGame();
    }
  }, [id]);

  if (!game) return <div className="p-4">Loading game details...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{game.title || 'Game Details'}</h1>
      <p><strong>Date:</strong> {new Date(game.date).toLocaleDateString()}</p>
      <p><strong>Teams:</strong> {game.teamA} vs {game.teamB}</p>
      <p className="mt-4"><strong>Description:</strong> {game.description || 'No description provided.'}</p>
      <RatingComponent gameId={id} />
    </div>
  );
}
