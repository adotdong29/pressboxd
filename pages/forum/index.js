// pages/forum/index.js
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function ForumIndex() {
  const [latestChains, setLatestChains] = useState([]);
  const [popularChains, setPopularChains] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchChains() {
      // Fetch latest chains ordered by created_at.
      const { data: latest, error: latestError } = await supabase
        .from('forum_posts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);
      if (latestError) {
        console.error('Error fetching latest chains:', latestError);
        setLatestChains([]);
      } else {
        setLatestChains(latest);
      }

      // Fetch popular chains, e.g., by likes (assumes a "likes" column).
      const { data: popular, error: popularError } = await supabase
        .from('forum_posts')
        .select('*')
        .order('likes', { ascending: false })
        .limit(10);
      if (popularError) {
        console.error('Error fetching popular chains:', popularError);
        setPopularChains([]);
      } else {
        setPopularChains(popular);
      }

      setLoading(false);
    }
    fetchChains();
  }, []);

  if (loading) return <div className="p-4">Loading forum chains...</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4 animate-fadeIn">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-4 text-yellow-500">Forums</h1>
        <Link href="/forum/create" className="block p-4 bg-yellow-500 text-gray-900 rounded shadow mb-4 hover:bg-yellow-400 transition transform hover:scale-105">
          Create New Forum Chain
        </Link>
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-yellow-500">Popular Forum Chains</h2>
          {popularChains.length > 0 ? (
            popularChains.map((chain) => (
              <div key={chain.id} className="bg-gray-800 p-4 rounded shadow mb-4">
                <h3 className="text-xl font-semibold text-yellow-500">{chain.title}</h3>
                <p>{chain.content}</p>
                <Link href={`/forum/${chain.category}/${chain.id}`} className="text-yellow-500 hover:underline transition transform hover:scale-105">
                  View Discussion
                </Link>
              </div>
            ))
          ) : (
            <p>No popular forum chains available.</p>
          )}
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4 text-yellow-500">Latest Forum Chains</h2>
          {latestChains.length > 0 ? (
            latestChains.map((chain) => (
              <div key={chain.id} className="bg-gray-800 p-4 rounded shadow mb-4">
                <h3 className="text-xl font-semibold text-yellow-500">{chain.title}</h3>
                <p>{chain.content}</p>
                <Link href={`/forum/${chain.category}/${chain.id}`} className="text-yellow-500 hover:underline transition transform hover:scale-105">
                  View Discussion
                </Link>
              </div>
            ))
          ) : (
            <p>No latest forum chains available.</p>
          )}
        </div>
      </div>
    </div>
  );
}
