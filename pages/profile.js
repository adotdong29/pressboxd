// pages/profile.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';

export default function Profile() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState({ username: '', bio: '', avatar_url: '' });
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    } else if (user) {
      async function fetchProfile() {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        if (error) {
          console.error('Error fetching profile:', error);
        } else {
          setProfile(data);
        }
        setLoadingProfile(false);
      }
      fetchProfile();
    }
  }, [user, loading, router]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    const updates = {
      ...profile,
      updated_at: new Date(),
    };
    const { error } = await supabase
      .from('profiles')
      .upsert(updates, { returning: 'minimal' });
    if (error) {
      setMessage('Error updating profile.');
    } else {
      setMessage('Profile updated successfully!');
    }
  };

  if (loading || loadingProfile) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-4 text-yellow-500">Your Profile</h1>
        {message && <p className="mb-4">{message}</p>}
        <form onSubmit={handleUpdate} className="bg-gray-800 p-4 rounded shadow">
          <label className="block mb-2">Username</label>
          <input
            type="text"
            value={profile.username || ''}
            onChange={(e) => setProfile({ ...profile, username: e.target.value })}
            className="w-full p-2 mb-4 bg-gray-700 text-gray-100 rounded"
          />
          <label className="block mb-2">Bio</label>
          <textarea
            value={profile.bio || ''}
            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
            className="w-full p-2 mb-4 bg-gray-700 text-gray-100 rounded"
          ></textarea>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-yellow-500 text-gray-900 font-bold rounded hover:bg-yellow-400"
          >
            Update Profile
          </button>
        </form>
      </div>
    </div>
  );
}
