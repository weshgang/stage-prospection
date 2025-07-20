import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Home() {
  const { user, loading } = useAuth();

  const renderButtons = () => {
    if (loading) return null; // attend la réponse Supabase
    if (user) {
      return (
        <Link
          to="/dashboard"
          className="bg-[#2e5bff] text-white font-bold py-3 px-8 rounded-lg shadow hover:bg-[#234ae6] transition"
        >
          Dashboard
        </Link>
      );
    }
    return (
      <>
        <Link
          to="/login?signup=1"
          className="bg-white text-[#2e5bff] font-bold py-3 px-6 rounded-lg border-2 border-[#2e5bff] hover:bg-[#f0f2ff] shadow"
        >
          Démarrer gratuitement
        </Link>
        <Link to="/login" className="text-[#2e5bff] underline">
          J’ai déjà un compte
        </Link>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-[#f7f8fa] text-[#1d1d1d] flex flex-col items-center">
      <div className="w-full max-w-3xl text-center py-16 px-6">
        <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
          Être un <span className="text-[#2e5bff]">shark</span> n'a jamais été aussi simple
        </h1>

        <p className="text-lg md:text-xl max-w-2xl mx-auto text-gray-600">
          Suis tes échanges LinkedIn + e-mail avec les recruteurs, organise tes relances, et
          décroche plus facilement un stage.
        </p>

        <div className="mt-8 space-x-4">{renderButtons()}</div>
      </div>

      {/* Section Fonctionnalités affichée seulement si NON connecté */}
      {!loading && !user && (
        <div className="bg-white w-full max-w-3xl py-10 px-6 border-t border-gray-200 text-left">
          <h2 className="text-xl font-semibold mb-2">Fonctionnalités principales :</h2>
          <ul className="list-disc list-inside text-gray-700">
            <li>Import de contacts via CSV</li>
            <li>Ajout manuel de contacts</li>
            <li>Suivi des réponses et relances</li>
            <li>Navigation simple & rapide</li>
          </ul>
        </div>
      )}
    </div>
  );
}
