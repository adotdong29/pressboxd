// pages/forum/[category].js
import { useRouter } from 'next/router';
import { supabase } from '../../lib/supabaseClient';
import Link from 'next/link';

export async function getStaticPaths() {
  // Define your forum categories (must match your Supabase data or intended categories)
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

  const paths = categories.map((category) => ({
    params: { category },
  }));

  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const { category } = params;
  // Fetch forum posts for this category.
  const { data: posts, error } = await supabase
    .from('forum_posts')
    .select('*')
    .eq('category', category)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching forum posts:', error);
    return { props: { category, posts: [] } };
  }

  return {
    props: { category, posts },
    revalidate: 10,
  };
}

export default function ForumCategory({ category, posts }) {
  const router = useRouter();

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-4 text-yellow-500">
          {category.charAt(0).toUpperCase() + category.slice(1)} Forum
        </h1>
        {posts.length > 0 ? (
          posts.map((post) => (
            <div key={post.id} className="bg-gray-800 p-4 rounded shadow mb-4">
              <h2 className="text-xl font-semibold">{post.title}</h2>
              <p>{post.content}</p>
              <Link href={`/forum/${category}/${post.id}`}>
                <a className="text-yellow-500 hover:underline">View Discussion</a>
              </Link>
            </div>
          ))
        ) : (
          <p>No posts available for {category} yet.</p>
        )}
      </div>
    </div>
  );
}
