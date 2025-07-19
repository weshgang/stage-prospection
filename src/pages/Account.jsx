import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

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
            💾 Sauvegarder
          </button>
        </form>
      )}
    </div>
  );
}
