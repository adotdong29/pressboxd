// pages/game/[id].js
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../context/AuthContext';

export default function GameDetail() {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useAuth();
  const [game, setGame] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    async function fetchGame() {
      const { data, error } = await supabase
        .from('games')
        .select('*')
        .eq('id', id)
        .single();
      if (error) {
        console.error('Error fetching game:', error);
      } else {
        setGame(data);
      }
    }
    async function fetchReviews() {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          profiles ( username )
        `)
        .eq('game_id', id)
        .order('created_at', { ascending: false });
      if (error) {
        console.error('Error fetching reviews:', error);
      } else {
        setReviews(data);
      }
      setLoading(false);
    }
    fetchGame();
    fetchReviews();
  }, [id]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user || !newReview) return;
    const { error } = await supabase
      .from('reviews')
      .insert([
        {
          game_id: id,
          review_text: newReview,
          user_id: user.id,
        },
      ]);
    if (error) {
      console.error('Error submitting review:', error);
    } else {
      setNewReview('');
      const { data, error: fetchError } = await supabase
        .from('reviews')
        .select(`
          *,
          profiles ( username )
        `)
        .eq('game_id', id)
        .order('created_at', { ascending: false });
      if (fetchError) {
        console.error('Error refreshing reviews:', fetchError);
      } else {
        setReviews(data);
      }
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4">
      <div className="container mx-auto">
        {game && (
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-yellow-500">{game.title}</h1>
            <p className="mb-4">{game.description}</p>
            <p className="mb-4">
              Date: {new Date(game.date).toLocaleDateString()}
            </p>
          </div>
        )}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-yellow-500">Reviews</h2>
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <div
                key={review.id}
                className="bg-gray-800 p-4 rounded shadow mb-4"
              >
                <p className="text-sm text-gray-400">
                  By {review.profiles?.username || 'Unknown'}
                </p>
                <p>{review.review_text}</p>
              </div>
            ))
          ) : (
            <p>No reviews yet. Be the first to write one!</p>
          )}
        </section>
        {user && (
          <section>
            <h2 className="text-2xl font-bold mb-4 text-yellow-500">
              Write a Review
            </h2>
            <form onSubmit={handleSubmitReview}>
              <textarea
                value={newReview}
                onChange={(e) => setNewReview(e.target.value)}
                className="w-full p-2 bg-gray-700 text-gray-100 rounded mb-4"
                placeholder="Write your review here..."
                required
              />
              <button
                type="submit"
                className="py-2 px-4 bg-yellow-500 text-gray-900 font-bold rounded hover:bg-yellow-400"
              >
                Submit Review
              </button>
            </form>
          </section>
        )}
      </div>
    </div>
  );
}
