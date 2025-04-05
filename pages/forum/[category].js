// pages/forum/[category].js
import { useRouter } from 'next/router';
import { supabase } from '../../lib/supabaseClient';
import Link from 'next/link';

export async function getStaticPaths() {
  const categories = [
    'soccer',
    'cricket',
    'hockey',
    'tennis',
    'volleyball',
    'table-tennis',
    'basketball',
    'baseball',
    'rugby',
    'golf',
  ];
  const paths = categories.map((cat) => ({
    params: { category: cat },
  }));
  return { paths, fallback: 'blocking' };
}

export async function getStaticProps({ params }) {
  const { category } = params;
  const { data: posts, error } = await supabase
    .from('forum_posts')
    .select('*')
    .eq('category', category)
    .order('created_at', { ascending: false });
  if (error) {
    console.error('Error fetching posts:', error);
    return { props: { category, posts: [] }, revalidate: 10 };
  }
  return {
    props: { category, posts },
    revalidate: 10,
  };
}

export default function ForumCategory({ category, posts }) {
  const router = useRouter();

  if (router.isFallback) return <div className="p-4">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-4 text-yellow-500">
          {category.charAt(0).toUpperCase() + category.slice(1)} Forum
        </h1>
        <Link href="/forum/create" className="block p-4 bg-yellow-500 text-gray-900 rounded shadow mb-4 hover:bg-yellow-400">
          Create New Post
        </Link>
        {posts.length > 0 ? (
          posts.map((post) => (
            <div key={post.id} className="bg-gray-800 p-4 rounded shadow mb-4">
              <h2 className="text-xl font-semibold text-yellow-500">{post.title}</h2>
              <p>{post.content}</p>
              {post.image_url && <img src={post.image_url} alt={post.title} className="mt-2 rounded" />}
              <div className="mt-2">
                <Link href={`/forum/${category}/${post.id}`} className="text-yellow-500 hover:underline">
                  View Discussion
                </Link>
              </div>
            </div>
          ))
        ) : (
          <p>No posts available for {category} yet.</p>
        )}
      </div>
    </div>
  );
}
