import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  /* 1️⃣ Déjà connecté ? -> dashboard */
  if (!loading && user) return <Navigate to="/dashboard" replace />;

  /* 2️⃣ États locaux */
  const [email, setEmail] = useState('');
  const [password, setPass] = useState('');
  const [isSignUp, setSignUp] = useState(false);
  const [info, setInfo] = useState('');

  /* 3️⃣ Soumission */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setInfo('');

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password });
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

  /* 4️⃣ Interface */
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md rounded shadow bg-white p-8">
        <h2 className="text-2xl font-bold mb-6 text-center">{isSignUp ? 'Sign Up' : 'Log In'}</h2>

        <label className="block mb-2">Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border rounded px-3 py-2 mb-4"
        />

        <label className="block mb-2">Password</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPass(e.target.value)}
          className="w-full border rounded px-3 py-2 mb-6"
        />

        <button
          type="submit"
          className="w-full py-2 rounded font-semibold text-white
                     bg-blue-600 hover:bg-blue-700 transition
                     focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          {isSignUp ? 'Create account' : 'Log in'}
        </button>

        <button
          type="button"
          onClick={() => setSignUp(!isSignUp)}
          className="w-full mt-3 text-sm text-blue-600 underline"
        >
          {isSignUp ? 'Already have an account? Log in' : 'Need an account? Sign up'}
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
