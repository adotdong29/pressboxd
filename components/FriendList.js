// components/FriendList.js
// You can use this component inside pages/friends.js if you prefer a separate friend list display.
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function FriendList() {
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    async function fetchFriends() {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) return;
      const { data, error } = await supabase
        .from('friends')
        .select('*')
        .eq('user_id', user.id);
      if (!error) setFriends(data);
    }
    fetchFriends();
  }, []);

  return (
    <div>
      <h2>Your Friends</h2>
      {friends.length === 0 && <p>No friends found.</p>}
      {friends.map((f) => (
        <div key={f.friend_id} className="p-2 border rounded mb-2">
          Friend ID: {f.friend_id}
        </div>
      ))}
    </div>
  );
}
