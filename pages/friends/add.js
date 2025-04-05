// pages/friends/add.js
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabaseClient';
import { useRouter } from 'next/router';

export default function AddFriends() {
  const { user } = useAuth();
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!username) return;
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .ilike('username', `%${username}%`);
    if (error) {
      setError(error.message);
    } else {
      setSearchResults(data);
    }
  };

  const handleAddFriend = async (friendId) => {
    if (friendId === user.id) {
      setError("You cannot add yourself!");
      return;
    }
    const { error } = await supabase
      .from('friends')
      .insert([{ user_id: user.id, friend_id: friendId }]);
    if (error) {
      setError(error.message);
    } else {
      router.push('/friends');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4 animate-fadeIn">
      <div className="container mx-auto max-w-md">
        <h1 className="text-3xl font-bold mb-4 text-yellow-500">Find Friends</h1>
        {error && <p className="mb-4 text-red-500">{error}</p>}
        <form onSubmit={handleSearch} className="mb-4">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Search by username..."
            className="w-full p-2 mb-4 bg-gray-700 text-gray-100 rounded"
            required
          />
          <button
            type="submit"
            className="w-full py-2 px-4 bg-yellow-500 text-gray-900 font-bold rounded hover:bg-yellow-400 transition transform hover:scale-105"
          >
            Search
          </button>
        </form>
        {searchResults.length > 0 ? (
          <ul>
            {searchResults.map((result) => (
              <li key={result.id} className="mb-2 flex justify-between items-center">
                <span>{result.username}</span>
                <button
                  onClick={() => handleAddFriend(result.id)}
                  className="px-2 py-1 bg-yellow-500 text-gray-900 rounded hover:bg-yellow-400 transition transform hover:scale-105"
                >
                  Add Friend
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No users found.</p>
        )}
      </div>
    </div>
  );
}
