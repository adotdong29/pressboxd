// pages/app.js
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '../lib/supabaseClient';
import FeaturedCarousel from '../components/FeaturedCarousel';
import ProtectedRoute from '../components/ProtectedRoute';

function AppHome() {
  const [featuredGames, setFeaturedGames] = useState([]);

  useEffect(() => {
    async function fetchFeaturedGames() {
      const { data, error } = await supabase
        .from('games')
        .select('*')
        .eq('featured', true)
        .order('date', { ascending: false });
      if (!error) setFeaturedGames(data);
    }
    fetchFeaturedGames();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <header className="flex justify-between items-center mb-8">
        <img src="/logo.png" alt="Pressboxd Logo" className="w-16 h-16" />
        <nav>
          <Link href="/friends" className="mr-4 text-blue-500">Friends</Link>
          <Link href="/forum/general" className="text-blue-500">Forums</Link>
        </nav>
      </header>
      <div className="mb-8">
        <input
          type="text"
          placeholder="Search games..."
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Featured Games</h2>
        <FeaturedCarousel games={featuredGames} />
      </div>
      <div>
        <h2 className="text-xl font-bold mb-4">Popular Sports</h2>
        <div className="flex space-x-4">
          <Link href="/forum/football" className="bg-gray-200 p-2 rounded">
            Football
          </Link>
          <Link href="/forum/basketball" className="bg-gray-200 p-2 rounded">
            Basketball
          </Link>
          <Link href="/forum/soccer" className="bg-gray-200 p-2 rounded">
            Soccer
          </Link>
          <Link href="/forum/baseball" className="bg-gray-200 p-2 rounded">
            Baseball
          </Link>
        </div>
      </div>
    </div>
  );
}

// Wrap the main app page with ProtectedRoute to enforce authentication and onboarding
export default function ProtectedApp() {
  return (
    <ProtectedRoute>
      <AppHome />
    </ProtectedRoute>
  );
}
