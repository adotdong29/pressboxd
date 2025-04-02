import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function Test() {
  const [loading, setLoading] = useState(true);
  const [sessionData, setSessionData] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        console.log("Test page: Calling supabase.auth.getSession()...");
        const { data: { session }, error } = await supabase.auth.getSession();
        console.log("Test page: getSession returned:", session, "Error:", error);
        setSessionData(session);
      } catch (err) {
        console.error("Test page: Error in getSession:", err);
      } finally {
        setLoading(false);
        console.log("Test page: Finished getSession; loading is now false");
      }
    })();
  }, []);

  if (loading) return <div>Loading...</div>;
  return (
    <div>
      <h1>Test Page</h1>
      <pre>{JSON.stringify(sessionData, null, 2)}</pre>
    </div>
  );
}
