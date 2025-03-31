// pages/login.js
import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setErrorMsg(error.message);
    } else {
      router.push('/onboarding'); // or directly to home if onboarding is done
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl mb-4">Login to Pressboxd</h1>
        {errorMsg && <p className="text-red-500 mb-2">{errorMsg}</p>}
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="border p-2 mb-4 w-full" required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="border p-2 mb-4 w-full" required />
        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded w-full">Login</button>
        <p className="mt-4 text-sm">
          Don’t have an account? <Link href="/signup" className="text-blue-500">Sign Up</Link>
        </p>
      </form>
    </div>
  );
}
