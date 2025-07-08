// pages/sports/[sport].js
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '../../context/AuthContext'

export default function SportPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const { sport } = router.query

  // Config for each sport’s API-Sports endpoint
  const leagueConfigs = {
    soccer: {
      name: 'English Premier League',
      url: `https://v3.football.api-sports.io/fixtures?league=39&season=2023&next=10`,
      header: 'v3.football',
    },
    cricket: {
      name: 'Major League Cricket',
      url: `https://cricket.api-sports.io/fixtures?season=2025&next=10`,
      header: 'cricket',
    },
    hockey: {
      name: 'NHL',
      url: `https://v1.hockey.api-sports.io/games?season=2023&next=10`,
      header: 'v1.hockey',
    },
    tennis: {
      name: 'ATP Tour',
      url: `https://tennis.api-sports.io/fixtures?season=2023&next=10`,
      header: 'tennis',
    },
    volleyball: {
      name: 'Volleyball',
      url: null,
    },
    'table-tennis': {
      name: 'Table Tennis',
      url: null,
    },
    basketball: {
      name: 'NBA',
      url: `https://v1.basketball.api-sports.io/games?league=12&season=2023&next=10`,
      header: 'v1.basketball',
    },
    baseball: {
      name: 'MLB',
      url: `https://v1.baseball.api-sports.io/games?league=1&season=2023&next=10`,
      header: 'v1.baseball',
    },
    rugby: {
      name: 'Major League Rugby',
      url: `https://rugby.api-sports.io/fixtures?league=375&season=2023&next=10`,
      header: 'rugby',
    },
    golf: {
      name: 'PGA Tour',
      url: null,
    },
  }

  const [events, setEvents] = useState([])
  const [errorMsg, setErrorMsg] = useState(null)

  useEffect(() => {
    if (!sport || !leagueConfigs[sport]) return

    const conf = leagueConfigs[sport]
    if (!conf.url) {
      setEvents([])
      return
    }

    async function fetchEvents() {
      try {
        const res = await fetch(conf.url, {
          headers: { 'x-apisports-key': process.env.NEXT_PUBLIC_APISPORTS_KEY },
        })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const json = await res.json()
        // API-Sports puts payload in response or data
        const evts = json.response || json.data || []
        setEvents(evts)
      } catch (err) {
        console.error(err)
        setErrorMsg('Failed to load upcoming events.')
      }
    }
    fetchEvents()
  }, [sport])

  if (loading) return <div className="p-4">Loading...</div>
  if (!user) {
    router.push('/login')
    return null
  }

  const conf = leagueConfigs[sport]
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4 text-yellow-500 capitalize">
          {conf?.name || sport}
        </h1>

        {errorMsg && <p className="text-red-500">{errorMsg}</p>}

        {conf?.url ? (
          events.length > 0 ? (
            events.map((evt, i) => {
              // normalize home/away
              const home =
                evt.teams?.home?.name ||
                evt.home_team ||
                evt.teamsHome?.team_name ||
                ''
              const away =
                evt.teams?.away?.name ||
                evt.away_team ||
                evt.teamsAway?.team_name ||
                ''
              const date =
                evt.fixture?.date?.split('T')[0] || evt.event_date || ''
              return (
                <div
                  key={i}
                  className="mb-4 p-4 bg-gray-800 rounded shadow transition hover:scale-105"
                >
                  <p className="text-xl font-semibold text-gray-100">
                    {home} vs {away}
                  </p>
                  <p className="text-gray-400">{date}</p>
                </div>
              )
            })
          ) : (
            <p className="text-gray-400">No upcoming events</p>
          )
        ) : (
          <p className="text-gray-400">
            Upcoming events for this sport are not available.
          </p>
        )}

        <Link href="/" className="inline-block mt-6 text-yellow-500 underline">
          ← Back to Dashboard
        </Link>
      </div>
    </div>
  )
}
