// pages/index.js
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <img src="/logo.png" alt="Pressboxd Logo" className="w-32 h-32 mb-6" />
      <h1 className="text-4xl font-bold mb-4">Welcome to Pressboxd</h1>
      <p className="text-lg text-gray-700 mb-8">
        Rate sports games like never before.
      </p>
      <div className="flex space-x-4">
        <Link
          href="/login"
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Login
        </Link>
        <Link
          href="/signup"
          className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
        >
          Sign Up
        </Link>
      </div>
    </div>
  );
}
