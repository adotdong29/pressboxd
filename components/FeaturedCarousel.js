// components/FeaturedCarousel.js
import GameCard from './GameCard';

export default function FeaturedCarousel({ games = [] }) {
  if (!games || games.length === 0) {
    return (
      <div className="p-4 text-center text-gray-400">
        No featured games available.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto whitespace-nowrap animate-fadeIn">
      {games.map((game) => (
        <div key={game.idEvent} className="inline-block mr-4">
          <GameCard game={game} />
        </div>
      ))}
    </div>
  );
}
