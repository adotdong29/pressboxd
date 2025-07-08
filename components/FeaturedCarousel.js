// NEW: components/FeaturedCarousel.js
import React, { useEffect, useState } from 'react';
import { getUpcomingGamesByLeague } from '../lib/sportsApi';

export default function FeaturedCarousel({ leagueId = 39 /*EPL*/ }) {
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    async function load() {
      const events = await getUpcomingGamesByLeague(leagueId, 5);
      setFeatured(events);
    }
    load();
  }, [leagueId]);

  if (!featured.length) {
    return <p className="text-gray-400 italic">No featured games available.</p>;
  }

  return (
    <div className="carousel">
      {featured.map((evt) => (
        <div key={evt.fixture.id} className="carousel-item">
          <p className="font-bold">{evt.teams.home.name} vs {evt.teams.away.name}</p>
          <p className="text-sm">{evt.fixture.date.split('T')[0]}</p>
        </div>
      ))}
    </div>
  );
}
