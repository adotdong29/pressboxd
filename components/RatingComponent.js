// components/RatingComponent.js
import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function RatingComponent({ gameId }) {
  const [starRating, setStarRating] = useState(0);
  const [excitement, setExcitement] = useState(0);
  const [action, setAction] = useState(0);
  const [message, setMessage] = useState('');

  const handleRating = async () => {
    const user = supabase.auth.getUser();
    if (!user.data?.user) {
      setMessage('Please log in to rate.');
      return;
    }
    const { error } = await supabase.from('ratings').insert({
      user_id: user.data.user.id,
      game_id: gameId,
      star_rating: starRating,
      excitement,
      action,
      created_at: new Date()
    });
    if (error) setMessage(`Error: ${error.message}`);
    else setMessage('Rating submitted!');
  };

  return (
    <div className="mt-8 border p-4 rounded">
      <h2 className="text-xl font-bold mb-2">Rate this game</h2>
      <div className="mb-4">
        <p>Stars:</p>
        <div className="flex">
          {[1,2,3,4,5].map((star) => (
            <button
              key={star}
              onClick={() => setStarRating(star)}
              className={`mr-1 ${starRating >= star ? 'text-yellow-500' : 'text-gray-300'}`}
            >
              ★
            </button>
          ))}
        </div>
      </div>
      <div className="mb-4">
        <label className="block">Excitement (1-10):</label>
        <input type="number" min="1" max="10" value={excitement} onChange={(e) => setExcitement(Number(e.target.value))} className="border p-1" />
      </div>
      <div className="mb-4">
        <label className="block">Action (1-10):</label>
        <input type="number" min="1" max="10" value={action} onChange={(e) => setAction(Number(e.target.value))} className="border p-1" />
      </div>
      <button onClick={handleRating} className="bg-blue-500 text-white py-2 px-4 rounded">Submit Rating</button>
      {message && <p className="mt-2">{message}</p>}
    </div>
  );
}
