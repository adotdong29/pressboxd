// components/GameCard.js
import Link from 'next/link';

export default function GameCard({ game }) {
  return (
    <div className="border rounded shadow p-4 w-64">
      <h3 className="font-bold">{game.title || 'Untitled Game'}</h3>
      <p className="text-sm text-gray-600">{new Date(game.date).toLocaleDateString()}</p>
      <p className="mt-2">Teams: {game.teamA} vs {game.teamB}</p>
      <Link href={`/game/${game.id}`} className="text-blue-500 mt-4 inline-block">
        View Details
      </Link>
    </div>
  );
}
