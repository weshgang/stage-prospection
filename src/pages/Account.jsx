import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Save } from 'lucide-react';
import AccountSecurity from '../components/AccountSecurity';

function SetPasswordForm() {
  const [password, setPassword] = useState('');
  const [info, setInfo] = useState('');
  const { user } = useAuth();

  const handleSetPassword = async () => {
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setInfo(`❌ ${error.message}`);
    } else {
      setInfo('✅ Mot de passe défini ! Vous pouvez maintenant vous connecter sans Google.');
      setPassword('');
    }
  };

  const isGoogleUser = user?.app_metadata?.provider === 'google';

  if (!isGoogleUser) return null;

  return (
    <div className="mt-10 border-t pt-6">
      <h2 className="text-lg font-semibold mb-2">Définir un mot de passe</h2>
      <p className="text-sm text-gray-600 mb-4">
        Cela vous permettra de vous connecter avec votre e-mail, sans Google.
      </p>
      <input
        type="password"
        placeholder="Nouveau mot de passe"
        className="w-full border px-3 py-2 rounded mb-3"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        onClick={handleSetPassword}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Définir le mot de passe
      </button>
      {info && <p className="text-sm mt-3">{info}</p>}
    </div>
  );
}

export default function Account() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    nom: '',
    prenom: '',
    ecole: '',
    niveau: '',
    carriere: '',
  });

  const niveaux = ['L1', 'L2', 'L3', 'Master 1', 'Master 2'];
  const ecoles = [
    'Dauphine',
    'HEC Paris',
    'ESCP',
    'EM Lyon',
    'ESSEC',
    'Skema',
    'Audencia',
    'Paris 1',
    'Paris Assas',
    'EDHEC',
  ];

  const handleChange = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  useEffect(() => {
    if (!user) return;

    const fetchProfile = async () => {
      setLoading(true);
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      if (data) setForm(data);
      setLoading(false);
    };

    fetchProfile();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from('profiles').upsert({
      id: user.id,
      ...form,
      updated_at: new Date().toISOString(),
    });
    if (error) alert('Erreur de sauvegarde');
    else alert('✅ Profil mis à jour');
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">Mon compte</h1>
      {loading ? (
        <p>Chargement...</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Prénom</label>
            <input
              type="text"
              value={form.prenom}
              onChange={handleChange('prenom')}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Nom</label>
            <input
              type="text"
              value={form.nom}
              onChange={handleChange('nom')}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">École</label>
            <select
              value={form.ecole}
              onChange={handleChange('ecole')}
              className="w-full border rounded px-3 py-2"
            >
              <option value="">—</option>
              {ecoles.map((ecole) => (
                <option key={ecole} value={ecole}>
                  {ecole}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Niveau</label>
            <select
              value={form.niveau}
              onChange={handleChange('niveau')}
              className="w-full border rounded px-3 py-2"
            >
              <option value="">—</option>
              {niveaux.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Carrière visée</label>
            <input
              type="text"
              value={form.carriere}
              onChange={handleChange('carriere')}
              className="w-full border rounded px-3 py-2"
              placeholder="Ex: M&A, Sales, Private Equity…"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700"
          >
            <Save className="inline mr-2" />
            Enregistrer
          </button>
        </form>
      )}
      {/* Section sécurité : modifier mot de passe / supprimer compte */}
      <AccountSecurity />
      <SetPasswordForm />
    </div>
  );
}
