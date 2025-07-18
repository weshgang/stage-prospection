import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = isSignUp
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);
    if (error) return alert(error.message);

    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6">{isSignUp ? 'Sign Up' : 'Log In'}</h2>

        <label className="block mb-2">Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border px-3 py-2 mb-4 rounded"
        />

        <label className="block mb-2">Password</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border px-3 py-2 mb-4 rounded"
        />

      <button
      type="submit"
      onClick={handleSubmit}          // ta fonction d’envoi
      className="w-full py-2 rounded font-semibold text-white
             bg-blue-600 hover:bg-blue-700
             transition focus:outline-none focus:ring-2 focus:ring-blue-400">
      {isSignUp ? 'Create account' : 'Log in'}
      </button>


        <button
          type="button"
          onClick={() => setIsSignUp(!isSignUp)}
          className="w-full mt-2 text-sm text-blue-600 underline"
        >
          {isSignUp ? 'Already have an account? Log in' : 'Need an account? Sign up'}
        </button>
      </form>
    </div>
  );
}