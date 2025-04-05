// pages/forum/index.js
import Link from 'next/link';

export default function ForumIndex() {
  const categories = [
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
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4 animate-fadeIn">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-4 text-yellow-500">Forums</h1>
        <Link href="/forum/create" className="block p-4 bg-yellow-500 text-gray-900 rounded shadow mb-4 hover:bg-yellow-400 transition transform hover:scale-105">
          Create New Post
        </Link>
        <p className="mb-4">Select a sport forum:</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat}
              href={`/forum/${cat}`}
              className="block p-4 bg-gray-800 rounded shadow hover:bg-gray-700 transition transform hover:scale-105 capitalize"
            >
              {cat}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
