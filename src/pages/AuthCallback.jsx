import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function AuthCallback() {
  const [ok, setOk] = useState(false);
  const [err, setErr] = useState(null);

  useEffect(() => {
    (async () => {
      const { error } = await supabase.auth.exchangeCodeForSession(window.location.search);
      if (error) setErr(error.message);
      else setOk(true); // session créée
    })();
  }, []);

  if (err) return <div className="p-8 text-red-600">Erreur : {err}</div>;
  if (ok) return <Navigate to="/login?verified=1" replace />;
  return <div className="p-8">Validation en cours…</div>;
}
