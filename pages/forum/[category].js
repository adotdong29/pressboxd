// pages/forum/[category].js
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import Link from 'next/link';

export default function ForumCategory() {
  const router = useRouter();
  const { category } = router.query;
  const [posts, setPosts] = useState([]);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (category) {
      async function fetchPosts() {
        const { data, error } = await supabase
          .from('forum_posts')
          .select('*')
          .eq('category', category);
        if (!error) setPosts(data);
      }
      fetchPosts();
    }
  }, [category]);

  const handleNewPost = async () => {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) {
      setMessage('Please log in to post.');
      return;
    }
    const { error } = await supabase.from('forum_posts').insert({
      category,
      author_id: user.id,
      title: newPostTitle,
      content: newPostContent,
      created_at: new Date()
    });
    if (error) setMessage(error.message);
    else {
      setMessage('Post created!');
      setNewPostTitle('');
      setNewPostContent('');
      // Optionally, refresh the list
      const { data } = await supabase
        .from('forum_posts')
        .select('*')
        .eq('category', category);
      setPosts(data);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Link href="/" className="text-blue-500">&larr; Back Home</Link>
      <h1 className="text-3xl font-bold mb-4">{category?.toUpperCase()} Forum</h1>
      {message && <p className="mb-4">{message}</p>}
      <div className="mb-8 border p-4 rounded">
        <h2 className="text-xl font-bold mb-2">Create a New Post</h2>
        <input
          type="text"
          placeholder="Title"
          value={newPostTitle}
          onChange={(e) => setNewPostTitle(e.target.value)}
          className="w-full p-2 border rounded mb-2"
        />
        <textarea
          placeholder="Content"
          value={newPostContent}
          onChange={(e) => setNewPostContent(e.target.value)}
          className="w-full p-2 border rounded mb-2"
          rows="4"
        ></textarea>
        <button onClick={handleNewPost} className="bg-blue-500 text-white py-2 px-4 rounded">Post</button>
      </div>
      <div>
        {posts.length === 0 ? (
          <p>No posts yet.</p>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="border p-4 rounded mb-4">
              <h3 className="font-bold">{post.title}</h3>
              <p className="text-sm text-gray-600">By: {post.author_id} on {new Date(post.created_at).toLocaleDateString()}</p>
              <p className="mt-2">{post.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
