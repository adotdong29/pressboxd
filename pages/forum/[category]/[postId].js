// pages/forum/[category]/[postId].js
import { useRouter } from 'next/router';
import { useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import Link from 'next/link';

export async function getStaticPaths() {
  return { paths: [], fallback: 'blocking' };
}

export async function getStaticProps({ params }) {
  const { category, postId } = params;
  const { data: post, error: postError } = await supabase
    .from('forum_posts')
    .select('*')
    .eq('id', postId)
    .single();
  if (postError) {
    console.error('Error fetching post:', postError);
    return { notFound: true };
  }
  const { data: comments, error: commentsError } = await supabase
    .from('forum_comments')
    .select('*')
    .eq('post_id', postId)
    .order('created_at', { ascending: true });
  if (commentsError) {
    console.error('Error fetching comments:', commentsError);
  }
  return {
    props: { category, post, comments: comments || [] },
    revalidate: 10,
  };
}

export default function ForumThread({ category, post, comments }) {
  const router = useRouter();
  const [newComment, setNewComment] = useState('');
  const [localComments, setLocalComments] = useState(comments || []);
  const [loading, setLoading] = useState(false);
  const [likes, setLikes] = useState(post.likes || 0);
  const [dislikes, setDislikes] = useState(post.dislikes || 0);

  if (router.isFallback) {
    return <div className="p-4">Loading...</div>;
  }

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    const user = supabase.auth.user();
    if (!user) return;
    setLoading(true);
    const { error } = await supabase
      .from('forum_comments')
      .insert([{ post_id: post.id, user_id: user.id, content: newComment }]);
    if (error) {
      console.error('Error submitting comment:', error);
    } else {
      setNewComment('');
      const { data: commentsData, error: commentsError } = await supabase
        .from('forum_comments')
        .select('*')
        .eq('post_id', post.id)
        .order('created_at', { ascending: true });
      if (commentsError) {
        console.error('Error fetching comments:', commentsError);
      } else {
        setLocalComments(commentsData);
      }
    }
    setLoading(false);
  };

  const handleLike = async () => {
    const { error } = await supabase
      .from('forum_posts')
      .update({ likes: likes + 1 })
      .eq('id', post.id);
    if (!error) setLikes(likes + 1);
  };

  const handleDislike = async () => {
    const { error } = await supabase
      .from('forum_posts')
      .update({ dislikes: dislikes + 1 })
      .eq('id', post.id);
    if (!error) setDislikes(dislikes + 1);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-4 text-yellow-500">{post.title}</h1>
        <p className="mb-4">{post.content}</p>
        {post.image_url && (
          <img src={post.image_url} alt={post.title} className="mb-4 rounded" />
        )}
        <div className="flex items-center space-x-4 mb-4">
          <button onClick={handleLike} className="text-yellow-500 hover:underline">
            Like ({likes})
          </button>
          <button onClick={handleDislike} className="text-yellow-500 hover:underline">
            Dislike ({dislikes})
          </button>
        </div>
        <section className="mb-4">
          <h2 className="text-2xl font-bold mb-2 text-yellow-500">Comments</h2>
          {localComments.map((comment) => (
            <div key={comment.id} className="bg-gray-800 p-4 rounded shadow mb-2">
              <p>{comment.content}</p>
            </div>
          ))}
        </section>
        <form onSubmit={handleCommentSubmit} className="mt-4">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full p-2 bg-gray-700 text-gray-100 rounded mb-2"
            placeholder="Write a comment..."
            required
          ></textarea>
          <button
            type="submit"
            className="py-2 px-4 bg-yellow-500 text-gray-900 font-bold rounded hover:bg-yellow-400"
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit Comment'}
          </button>
        </form>
        <div className="mt-4">
          <Link href={`/forum/${category}`} className="text-yellow-500 hover:underline">
            &larr; Back to {category} forum
          </Link>
        </div>
      </div>
    </div>
  );
}
