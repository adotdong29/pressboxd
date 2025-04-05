// components/TopBar.js
import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/router';

export default function TopBar() {
  const { user } = useAuth();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    setSearchQuery('');
  };

  return (
    <header className="bg-gray-800 p-4 shadow flex justify-between items-center sticky top-0 z-50 animate-fadeIn">
      <div className="flex items-center space-x-6">
        <Link href="/" className="text-yellow-500 font-bold text-xl transition transform hover:scale-105">
          Pressboxd
        </Link>
        <Link href="/" className="text-gray-100 hover:text-yellow-500 transition transform hover:scale-105">
          Dashboard
        </Link>
        <Link href="/profile" className="text-gray-100 hover:text-yellow-500 transition transform hover:scale-105">
          Profile
        </Link>
        <Link href="/forum" className="text-gray-100 hover:text-yellow-500 transition transform hover:scale-105">
          Forums
        </Link>
        <Link href="/friends" className="text-gray-100 hover:text-yellow-500 transition transform hover:scale-105">
          Friends
        </Link>
        <div 
          className="relative inline-block"
          onMouseEnter={() => setDropdownVisible(true)}
          onMouseLeave={() => setDropdownVisible(false)}
        >
          <button className="text-gray-100 hover:text-yellow-500 focus:outline-none transition transform hover:scale-105">
            Sports
          </button>
          {dropdownVisible && (
            <div className="absolute left-0 top-full mt-1 w-40 bg-gray-800 border border-gray-700 rounded transition-opacity duration-300">
              {[
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
              ].map((sport) => (
                <Link key={sport} href={`/sports/${sport}`}>
                  <span className="block px-4 py-2 hover:bg-gray-700 cursor-pointer capitalize transition transform hover:scale-105">
                    {sport}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <form onSubmit={handleSearch} className="flex">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search users or games"
            className="px-2 py-1 rounded bg-gray-700 text-gray-100 focus:outline-none transition duration-300"
          />
          <button
            type="submit"
            className="px-3 py-1 bg-yellow-500 text-gray-900 rounded hover:bg-yellow-400 transition transform hover:scale-105"
          >
            Search
          </button>
        </form>
        {user ? (
          <button onClick={handleLogout} className="text-yellow-500 hover:underline transition transform hover:scale-105">
            Logout
          </button>
        ) : (
          <Link href="/login" className="text-yellow-500 hover:underline transition transform hover:scale-105">
            Login
          </Link>
        )}
      </div>
    </header>
  );
}
