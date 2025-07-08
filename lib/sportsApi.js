// lib/sportsApi.js

// Pull this from .env.local
const API_KEY = process.env.NEXT_PUBLIC_APISPORTS_KEY;

/**
 * Fetch upcoming fixtures for a league.
 * @param {number|string} leagueId - API-Sports.com league ID (e.g. 39 for EPL)
 * @param {number} [next=10]    - How many upcoming matches to pull
 * @param {number} [season=...] - Season year (defaults to current year)
 * @returns {Promise<Array>}    - Array of fixture objects
 */
export async function getUpcomingGamesByLeague(
  leagueId,
  next = 10,
  season = new Date().getFullYear()
) {
  if (!API_KEY) {
    console.warn('Missing NEXT_PUBLIC_APISPORTS_KEY in .env.local');
    return [];
  }

  const url = `https://v3.football.api-sports.io/fixtures?league=${leagueId}&season=${season}&next=${next}`;
  try {
    const res = await fetch(url, {
      headers: { 'x-apisports-key': API_KEY }
    });
    if (!res.ok) {
      console.error(`Failed to fetch upcoming games: HTTP ${res.status}`);
      return [];
    }
    const json = await res.json();
    return json.response || [];
  } catch (err) {
    console.error('Error fetching upcoming games:', err);
    return [];
  }
}

/**
 * Fetch full details for a single fixture.
 * @param {number|string} fixtureId - API-Sports.com fixture ID
 * @returns {Promise<Object|null>}   - Fixture details or null
 */
export async function getGameDetails(fixtureId) {
  if (!API_KEY) {
    console.warn('Missing NEXT_PUBLIC_APISPORTS_KEY in .env.local');
    return null;
  }

  const url = `https://v3.football.api-sports.io/fixtures?fixture=${fixtureId}`;
  try {
    const res = await fetch(url, {
      headers: { 'x-apisports-key': API_KEY }
    });
    if (!res.ok) {
      console.error(`Failed to fetch fixture ${fixtureId}: HTTP ${res.status}`);
      return null;
    }
    const json = await res.json();
    return (json.response && json.response[0]) || null;
  } catch (err) {
    console.error(`Error fetching game details for ${fixtureId}:`, err);
    return null;
  }
}
