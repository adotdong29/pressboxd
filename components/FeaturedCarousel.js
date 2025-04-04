// components/FeaturedCarousel.js
import Link from 'next/link';
import GameCard from './GameCard';

export default function FeaturedCarousel({ games = [] }) {
  if (!games || games.length === 0) {
    return (
      <div className="p-4 text-center">
        No featured games available.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto whitespace-nowrap">
      {games.map((game) => (
        <div key={game.id} className="inline-block mr-4">
          <GameCard game={game} />
        </div>
      ))}
    </div>
  );
}
