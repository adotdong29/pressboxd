// components/FeaturedCarousel.js
import Link from 'next/link';
import GameCard from './GameCard';

export default function FeaturedCarousel({ games }) {
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
