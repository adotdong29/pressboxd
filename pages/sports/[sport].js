// pages/sports/[sport].js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const sportsMapping = {
  soccer: { leagueId: '4328', sportName: 'Soccer' },
  cricket: { leagueId: '4391', sportName: 'Cricket' },
  hockey: { leagueId: '4334', sportName: 'Hockey' },
  tennis: { leagueId: '4464', sportName: 'Tennis' },
  volleyball: { leagueId: '4466', sportName: 'Volleyball' },
  'table-tennis': { leagueId: '4468', sportName: 'Table Tennis' },
  basketball: { leagueId: '4387', sportName: 'Basketball' },
  baseball: { leagueId: '4424', sportName: 'Baseball' },
  rugby: { leagueId: '4388', sportName: 'Rugby' },
  golf: { leagueId: '4469', sportName: 'Golf' },
};

export default function SportPage() {
  const router = useRouter();
  const { sport } = router.query;
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!sport) return;
    async function fetchGames() {
      const mapping = sportsMapping[sport];
      if (!mapping) {
        setError('Sport not recognized.');
        setLoading(false);
        return;
      }
      const url = `https://www.thesportsdb.com/api/v1/json/1/eventsnextleague.php?id=${mapping.leagueId}`;
      try {
        const res = await fetch(url);
        if (res.status === 404) {
          setGames([]);
          setError(null);
          setLoading(false);
          return;
        }
        if (!res.ok) {
          const text = await res.text();
          setError(`Error fetching games: HTTP ${res.status}`);
          setGames([]);
          setLoading(false);
          return;
        }
        const data = await res.json();
        setGames(data.events || []);
      } catch (err) {
        setError('Error fetching games.');
        setGames([]);
      } finally {
        setLoading(false);
      }
    }
    fetchGames();
  }, [sport]);

  if (loading)
    return <div className="p-4">Loading games for {sport}...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4 animate-fadeIn">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-4 text-yellow-500">
          {sportsMapping[sport].sportName} Games
        </h1>
        {games.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {games.map((game) => (
              <div key={game.idEvent} className="bg-gray-800 p-4 rounded shadow transition transform hover:scale-105">
                <h2 className="text-xl font-bold text-yellow-500">{game.strEvent}</h2>
                <p>{game.dateEvent} at {game.strTime}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>No upcoming games available for {sport}.</p>
        )}
      </div>
    </div>
  );
}
