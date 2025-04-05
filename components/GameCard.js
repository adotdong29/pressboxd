// components/GameCard.js
export default function GameCard({ game }) {
  return (
    <div className="bg-gray-800 p-4 rounded shadow transition transform hover:scale-105">
      <h2 className="text-xl font-bold text-yellow-500">{game.strEvent}</h2>
      <p>
        {game.dateEvent} at {game.strTime}
      </p>
    </div>
  );
}
