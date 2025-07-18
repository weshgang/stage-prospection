import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
export const SignOutButton = () => {
  const navigate = useNavigate();
  return (
    <button
      onClick={async () => {
        await supabase.auth.signOut();
        navigate('/login');
      }}
      className="text-sm text-red-600 underline"
    >
      Sign Out
    </button>
  );
};
export default function Home() {
  return (
    <div className="min-h-screen bg-[#f7f8fa] text-[#1d1d1d] flex flex-col items-center">
      <div className="w-full max-w-3xl text-center py-16 px-6">
        <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
          Être un <span className="text-[#2e5bff]">shark</span> n'a jamais été aussi simple
        </h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto text-gray-600">
          Crée ta campagne LinkedIn + email pour contacter les bons recruteurs<br />
          avec des messages personnalisés. Simple, rapide, efficace.
        </p>
        <div className="mt-8 space-x-4">
          <Link to="/dashboard" className="bg-white text-[#2e5bff] font-bold py-3 px-6 rounded-lg border-2 border-[#2e5bff] hover:bg-[#f0f2ff] shadow">
            Démarrer gratuitement
          </Link>
          <Link to="/login" className="text-[#2e5bff] underline">
            J’ai déjà un compte
          </Link>
        </div>
      </div>
      <div className="bg-white w-full max-w-3xl py-10 px-6 border-t border-gray-200 text-left">
        <h2 className="text-xl font-semibold mb-2">Fonctionnalités principales :</h2>
        <ul className="list-disc list-inside text-gray-700">
          <li>Import de contacts via CSV</li>
          <li>Personnalisation des messages</li>
          <li>Suivi des réponses et envois</li>
          <li>Navigation simple & rapide</li>
        </ul>
      </div>
    </div>
  );
}

