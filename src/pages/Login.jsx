import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail]     = useState('');
  const [password, setPass]   = useState('');
  const [isSignUp, setSignUp] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Auth Supabase simple — erreurs remontées en alert
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password: password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
      navigate('/dashboard');
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-96 rounded shadow bg-white p-8"
      >
        <h2 className="text-2xl font-bold mb-6">
          {isSignUp ? 'Sign Up' : 'Log In'}
        </h2>

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

        {/* BOUTON TOUJOURS BLEU */}
        <button
          type="submit"
          className="w-full py-2 rounded font-semibold text-white
                     bg-blue-600 hover:bg-blue-700
                     transition focus:outline-none focus:ring-2
                     focus:ring-blue-400"
        >
          {isSignUp ? 'Create account' : 'Log in'}
        </button>

        <button
          type="button"
          onClick={() => setSignUp(!isSignUp)}
          className="w-full mt-3 text-sm text-blue-600 underline"
        >
          {isSignUp ? 'Already have an account? Log in'
                     : 'Need an account? Sign up'}
        </button>
      </form>
    </div>
  );
}
