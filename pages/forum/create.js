// pages/forum/create.js
import { useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../context/AuthContext';

export default function CreatePost() {
  const { user } = useAuth();
  const router = useRouter();
  const [category, setCategory] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState(null);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    let imageUrl = null;
    if (imageFile) {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${user.id}_${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('forum-images')
        .upload(fileName, imageFile);
      if (uploadError) {
        setError(uploadError.message);
        return;
      }
      imageUrl = supabase.storage.from('forum-images').getPublicUrl(fileName).data.publicUrl;
    }

    // Use "author_id" to satisfy your schema’s not-null constraint.
    const { error: postError } = await supabase
      .from('forum_posts')
      .insert([{ author_id: user.id, category, title, content, image_url: imageUrl }]);
    if (postError) {
      setError(postError.message);
    } else {
      router.push('/forum');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4 animate-fadeIn">
      <div className="container mx-auto max-w-lg">
        <h1 className="text-3xl font-bold mb-4 text-yellow-500">Create New Post</h1>
        {error && <p className="mb-4 text-red-500">{error}</p>}
        <form onSubmit={handleSubmit} className="bg-gray-800 p-4 rounded shadow transition transform hover:scale-105">
          <label className="block mb-2">Category (sport):</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="e.g. soccer"
            className="w-full p-2 mb-4 bg-gray-700 text-gray-100 rounded"
            required
          />
          <label className="block mb-2">Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 mb-4 bg-gray-700 text-gray-100 rounded"
            required
          />
          <label className="block mb-2">Content:</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-2 mb-4 bg-gray-700 text-gray-100 rounded"
            required
          ></textarea>
          <label className="block mb-2">Image (optional):</label>
          <input type="file" onChange={handleImageChange} className="mb-4" />
          <button
            type="submit"
            className="w-full py-2 px-4 bg-yellow-500 text-gray-900 font-bold rounded hover:bg-yellow-400 transition transform hover:scale-105"
          >
            Create Post
          </button>
        </form>
      </div>
    </div>
  );
}
