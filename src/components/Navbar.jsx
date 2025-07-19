import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-white shadow">
      <Link to="/" className="font-bold text-xl">
        StageProspect
      </Link>

      {user ? (
        <div className="space-x-4">
          <Link to="/dashboard" className="text-blue-600 underline">
            Dashboard
          </Link>
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              navigate('/login');
            }}
            className="text-red-600 underline"
          >
            Sign out
          </button>
        </div>
      ) : (
        <Link to="/login" className="text-blue-600 underline">
          Log in
        </Link>
      )}
    </nav>
  );
}
