// pages/signup.js
import { useState } from 'react';
import Link from 'next/link';
import { supabase } from '../lib/supabaseClient';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const handleSignup = async (e) => {
    e.preventDefault();
    // Ensure window is defined before accessing window.location.origin
    // This operation is client-side, so window should be available.
    const emailRedirectTo = typeof window !== 'undefined' ? `${window.location.origin}/onboarding` : '/onboarding';
    const { data, error } = await supabase.auth.signUp(
      { email, password },
      { emailRedirectTo }
    );
    if (error) {
      setError(error.message);
    } else {
      setMessage("Verification email sent! Please check your inbox.");
      // Do not redirect; allow user to remain on the signup page.
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center text-gray-100">
      <div className="w-full max-w-md p-8 bg-gray-800 rounded shadow">
        <h1 className="text-3xl font-bold mb-6 text-yellow-500 text-center">Sign Up</h1>
        {error && <p className="mb-4 text-red-500">{error}</p>}
        {message && <p className="mb-4 text-green-500">{message}</p>}
        <form onSubmit={handleSignup}>
          <label className="block mb-2">Email</label>
          <input
            type="email"
            className="w-full p-2 mb-4 bg-gray-700 text-gray-100 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label className="block mb-2">Password</label>
          <input
            type="password"
            className="w-full p-2 mb-4 bg-gray-700 text-gray-100 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full py-2 px-4 bg-yellow-500 text-gray-900 font-bold rounded hover:bg-yellow-400 transition transform hover:scale-105"
          >
            Sign Up
          </button>
        </form>
        <p className="mt-4 text-center">
          Already have an account?{' '}
          <Link href="/login" className="text-yellow-500 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
