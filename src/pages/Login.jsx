// src/pages/Login.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function Login() {
  const nav = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) nav('/dashboard');
    });
  }, [nav]);

  const handleGitHub = async () => {
    await supabase.auth.signInWithOAuth({ provider: 'github' });
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <button
        onClick={handleGitHub}
        className="bg-black text-white px-6 py-3 rounded font-semibold"
      >
        Sign in with GitHub
      </button>
    </div>
  );
}