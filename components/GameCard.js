// components/GameCard.js
export default function GameCard({ fixture }) {
  // API-Sports.com v3 football fixture shape:
  const homeName = fixture.teams.home.name;
  const awayName = fixture.teams.away.name;
  // fixture.fixture.date is ISO "YYYY-MM-DDT..."—split off the date
  const dateOnly = fixture.fixture.date.split('T')[0];
  const timeOnly = fixture.fixture.date.split('T')[1]?.slice(0,5); // "HH:MM"

  return (
    <div className="bg-gray-800 p-4 rounded shadow hover:scale-105 transition">
      <p className="font-bold text-gray-100">
        {homeName} vs {awayName}
      </p>
      <p className="text-gray-400 text-sm">
        {dateOnly} {timeOnly}
      </p>
    </div>
  );
}
