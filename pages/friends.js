// pages/friends.js
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function Friends() {
  const [friends, setFriends] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function fetchFriends() {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) return;
      // Fetch friends for current user (assuming a "friends" table with user_id and friend_id)
      const { data: friendsData, error } = await supabase
        .from('friends')
        .select('*')
        .eq('user_id', user.id);
      if (!error) setFriends(friendsData);

      // Fetch friend requests (assuming a "friend_requests" table with status "pending")
      const { data: requestsData, error: reqError } = await supabase
        .from('friend_requests')
        .select('*')
        .eq('receiver_id', user.id)
        .eq('status', 'pending');
      if (!reqError) setFriendRequests(requestsData);
    }
    fetchFriends();
  }, []);

  const handleAccept = async (requestId) => {
    // Update friend request status and add to friends table
    const { error } = await supabase
      .from('friend_requests')
      .update({ status: 'accepted' })
      .eq('id', requestId);
    if (error) setMessage(error.message);
    else setMessage('Friend request accepted!');
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Friends</h1>
      {message && <p>{message}</p>}
      <h2 className="text-xl font-bold mt-4">Friend Requests</h2>
      {friendRequests.length === 0 && <p>No pending requests.</p>}
      {friendRequests.map((req) => (
        <div key={req.id} className="border p-2 rounded mb-2 flex justify-between">
          <span>Request from: {req.sender_id}</span>
          <button onClick={() => handleAccept(req.id)} className="bg-green-500 text-white px-2 rounded">Accept</button>
        </div>
      ))}
      <h2 className="text-xl font-bold mt-4">Your Friends</h2>
      {friends.length === 0 && <p>You have no friends yet.</p>}
      {friends.map((friend) => (
        <div key={friend.friend_id} className="border p-2 rounded mb-2">
          Friend ID: {friend.friend_id}
        </div>
      ))}
    </div>
  );
}
