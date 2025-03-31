// pages/signup.js
import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import Link from 'next/link';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSignUp = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signUp(
      { email, password },
      { redirectTo: `${window.location.origin}/auth/callback` }
    );
    if (error) {
      setErrorMsg(error.message);
    } else {
      setSuccessMsg('Check your email for a confirmation link!');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSignUp} className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl mb-4">Sign Up for Pressboxd</h1>
        {errorMsg && <p className="text-red-500 mb-2">{errorMsg}</p>}
        {successMsg && <p className="text-green-500 mb-2">{successMsg}</p>}
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="border p-2 mb-4 w-full" required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="border p-2 mb-4 w-full" required />
        <button type="submit" className="bg-green-500 text-white py-2 px-4 rounded w-full">Sign Up</button>
        <p className="mt-4 text-sm">
          Already have an account? <Link href="/login" className="text-blue-500">Login</Link>
        </p>
      </form>
    </div>
  );
}
