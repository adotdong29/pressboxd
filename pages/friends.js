// pages/friends.js
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';
import Link from 'next/link';

export default function FriendsPage() {
  const { user } = useAuth();
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    if (user) {
      async function fetchFriends() {
        const { data, error } = await supabase
          .from('friends')
          .select('friend_id, profiles(username)')
          .eq('user_id', user.id);
        if (error) console.error('Error fetching friends:', error);
        else setFriends(data);
      }
      fetchFriends();
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-4 text-yellow-500">Friends</h1>
        {friends.length > 0 ? (
          friends.map((friend) => (
            <div key={friend.friend_id} className="bg-gray-800 p-4 rounded shadow mb-2">
              <p>{friend.profiles?.username || 'Unknown'}</p>
            </div>
          ))
        ) : (
          <p>You have no friends yet.</p>
        )}
        <Link href="/friends/add" className="text-yellow-500 hover:underline">
          Find and add friends
        </Link>
      </div>
    </div>
  );
}
