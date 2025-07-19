// src/pages/Login.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate, Navigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  /* 1️⃣ Auth */
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [q] = useSearchParams();
  const verified = q.get('verified') === '1';

  if (!loading && user) return <Navigate to="/dashboard" replace />;

  /* 2️⃣ États locaux */
  const [email, setEmail] = useState('');
  const [password, setPass] = useState('');
  const [isSignUp, setSignUp] = useState(false);
  const [info, setInfo] = useState('');
  useEffect(() => {
    if (q.get('signup') === '1') {
      setSignUp(true);
    }
  }, [q]);

  /* 3️⃣ Soumission */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setInfo('');

    try {
      if (isSignUp) {
        // ✅ SYNTAXE CORRECTE
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });
        if (error) throw error;
        setInfo('📧 Un e-mail de confirmation vient d’être envoyé !');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate('/dashboard');
      }
    } catch (err) {
      console.log('Erreur Supabase :', err);
      setInfo(`❌ ${err.message}`);
    }
  };

  /* 4️⃣ UI */
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md rounded shadow bg-white p-8">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {isSignUp ? 'Créer un compte' : 'Connexion'}
        </h2>

        {/* Message “compte vérifié” */}
        {verified && (
          <div className="mb-4 p-3 bg-green-50 border border-green-300 text-green-800 text-sm rounded">
            ✅ Votre e-mail est confirmé ! Vous pouvez maintenant vous connecter.
          </div>
        )}

        <label className="block mb-2">Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border rounded px-3 py-2 mb-4"
        />

        <label className="block mb-2">Mot de passe</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPass(e.target.value)}
          className="w-full border rounded px-3 py-2 mb-6"
        />

        <button
          type="submit"
          className="w-full py-2 rounded font-semibold text-white bg-blue-600 hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          {isSignUp ? 'Créer le compte' : 'Se connecter'}
        </button>

        <button
          type="button"
          onClick={() => setSignUp(!isSignUp)}
          className="w-full mt-3 text-sm text-blue-600 underline"
        >
          {isSignUp ? 'Déjà inscrit ? Se connecter' : 'Pas de compte ? Créer un compte'}
        </button>

        {info && (
          <div className="mt-4 p-3 rounded bg-blue-50 text-blue-700 border border-blue-200 text-sm">
            {info}
          </div>
        )}
      </form>
    </div>
  );
}
