// pages/sports/[sport].js
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import Link from 'next/link';

export default function SportPage() {
  const router = useRouter();
  const { sport } = router.query;
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sport) return;
    async function fetchPosts() {
      const { data, error } = await supabase
        .from('forum_posts')
        .select('*')
        .eq('sport', sport)
        .order('created_at', { ascending: false });
      if (error) {
        console.error('Error fetching forum posts:', error);
      } else {
        setPosts(data);
      }
      setLoading(false);
    }
    fetchPosts();
  }, [sport]);

  if (loading)
    return <div className="p-4">Loading forum posts for {sport}...</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-4 text-yellow-500">
          {sport.charAt(0).toUpperCase() + sport.slice(1)} Forum
        </h1>
        {posts.length > 0 ? (
          posts.map((post) => (
            <div key={post.id} className="bg-gray-800 p-4 rounded shadow mb-4">
              <h2 className="text-xl font-semibold">{post.title}</h2>
              <p>{post.content}</p>
              <Link href={`/forums/${sport}/${post.id}`}>
                <a className="text-yellow-500 hover:underline">View Discussion</a>
              </Link>
            </div>
          ))
        ) : (
          <p>No posts available for {sport} yet.</p>
        )}
      </div>
    </div>
  );
}
