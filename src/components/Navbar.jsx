import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { FileText, User, LogOut, LayoutDashboard } from 'lucide-react';
export default function Navbar() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-white shadow">
      <Link to="/" className="font-bold text-xl text-gray-800 hover:text-blue-600">
        NetworkingPro
      </Link>

      {user ? (
        <div className="flex items-center space-x-6 text-sm font-medium">
          <Link to="/dashboard" className="text-gray-700 hover:text-blue-600">
            <LayoutDashboard className="w-4 h-4 mr-1" />
            Dashboard
          </Link>
          <Link to="/templates" className="text-sm text-gray-700 hover:underline">
            <FileText className="w-4 h-4 mr-1" />
            Templates
          </Link>

          <Link to="/account" className="text-gray-700 hover:text-blue-600">
            <User className="w-4 h-4 mr-1" />
            Mon compte
          </Link>
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              navigate('/login');
            }}
            className="text-red-500 hover:underline"
          >
            <LogOut className="w-4 h-4 mr-1" />
            Déconnnexion
          </button>
        </div>
      ) : (
        <Link to="/login" className="text-blue-600 underline">
          Connexion
        </Link>
      )}
    </nav>
  );
}
