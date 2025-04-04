import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';

export default function Onboarding() {
  const router = useRouter();
  const { user: contextUser, loading: contextLoading } = useAuth();
  const [localUser, setLocalUser] = useState(null);
  
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [profilePic, setProfilePic] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [checkingOnboarding, setCheckingOnboarding] = useState(true);

  // Re-fetch session directly on mount
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error fetching session in Onboarding:', error);
        } else {
          console.log('Onboarding: direct getSession returned:', session);
          setLocalUser(session?.user || null);
        }
      } catch (err) {
        console.error('Onboarding: exception in getSession:', err);
      }
    };
    fetchSession();
  }, []);

  const currentUser = localUser || contextUser;

  // Immediately check if onboarding is complete and redirect if so.
  useEffect(() => {
    async function checkOnboarding() {
      if (currentUser) {
        const { data, error } = await supabase
          .from('profiles')
          .select('username')
          .eq('id', currentUser.id)
          .single();
        if (error) {
          console.error('Error checking onboarding status:', error);
        } else if (data && data.username) {
          // Onboarding complete—redirect without showing the form
          router.replace('/app');
          return;
        }
      }
      setCheckingOnboarding(false);
    }
    checkOnboarding();
  }, [currentUser, router]);

  // Show loading state until onboarding check completes.
  if (contextLoading || checkingOnboarding) return <div>Loading...</div>;

  // If no session is found, redirect to login.
  if (!currentUser) {
    router.replace('/login');
    return <div>Redirecting to login...</div>;
  }

  const handleFileChange = (e) => {
    if (e.target.files?.length) {
      setProfilePic(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    let sessionUser = currentUser;
    if (!sessionUser) {
      const { data: { session } } = await supabase.auth.getSession();
      sessionUser = session?.user;
    }
    if (!sessionUser) {
      setErrorMsg('No active session. Please log in again.');
      setSubmitting(false);
      return;
    }

    const userId = sessionUser.id;
    let avatar_url = null;
    if (profilePic) {
      const fileExt = profilePic.name.split('.').pop();
      const fileName = `${userId}_${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, profilePic);
      if (uploadError) {
        setErrorMsg(`Image upload failed: ${uploadError.message}`);
        setSubmitting(false);
        return;
      }
      const { data: publicUrlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);
      avatar_url = publicUrlData.publicUrl;
    }

    const updates = {
      id: userId,
      username,
      bio,
      avatar_url,
      updated_at: new Date(),
      // If you have an onboarding flag, you could add it here:
      // onboarding_complete: true,
    };

    const { error: updateError } = await supabase
      .from('profiles')
      .upsert(updates, { returning: 'minimal' });
    if (updateError) {
      setErrorMsg(`Profile update failed: ${updateError.message}`);
    } else {
      setSuccessMsg('Profile updated successfully!');
      setTimeout(() => router.push('/app'), 2000);
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-lg">
        <h1 className="text-3xl font-bold mb-6">Complete Your Onboarding</h1>
        {errorMsg && <p className="text-red-500 mb-4">{errorMsg}</p>}
        {successMsg && <p className="text-green-500 mb-4">{successMsg}</p>}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Profile Picture</label>
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleFileChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Username</label>
          <input 
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Enter your username"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Tell us about yourself"
            rows="4"
            required
          ></textarea>
        </div>
        <button 
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded w-full"
          disabled={submitting}
        >
          {submitting ? 'Saving...' : 'Complete Onboarding'}
        </button>
      </form>
    </div>
  );
}
