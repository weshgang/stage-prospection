import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Save, FileText } from 'lucide-react';
export default function TemplateEditor() {
  const { user } = useAuth();
  const [templates, setTemplates] = useState([]);
  const [form, setForm] = useState({ industry: '', subject: '', body: '' });
  const defaultTemplates = [
    {
      industry: 'M&A',
      subject: 'Candidature – Stage en M&A',
      body: 'Bonjour {{prenom}},\n\nJe vous contacte pour un stage en M&A chez {{entreprise}}...',
    },
    {
      industry: 'Sales Equity',
      subject: 'Stage – Sales Equity',
      body: 'Bonjour {{prenom}},\n\nJe suis étudiant à {{ecole}} et je suis très intéressé par le sales...',
    },
    {
      industry: 'Equity Derivatives',
      subject: 'Candidature – Equity Derivatives',
      body: 'Bonjour {{prenom}},\n\nPassionné par les dérivés, je souhaiterais rejoindre votre équipe...',
    },
    {
      industry: 'Asset Management',
      subject: 'Stage – Asset Management',
      body: 'Bonjour {{prenom}},\n\nJe suis passionné par les marchés et souhaite rejoindre {{entreprise}}...',
    },
    {
      industry: 'Private Equity',
      subject: 'Stage – Private Equity',
      body: 'Bonjour {{prenom}},\n\nJe vous contacte dans le cadre de ma recherche de stage en PE...',
    },
  ];

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data, error } = await supabase
        .from('email_templates')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erreur chargement templates:', error.message);
        return;
      }

      setTemplates(data ?? []);
    })();
  }, [user]);

  const saveTemplate = async () => {
    const { data, error } = await supabase.from('email_templates').insert([
      {
        user_id: user.id,
        ...form,
      },
    ]);

    if (error) return alert('Erreur : ' + error.message);
    if (!data || !data[0]) return alert('Aucun template n’a été créé.');

    setTemplates((t) => [data[0], ...t]);
    setForm({ industry: '', subject: '', body: '' });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-10">
      <h1 className="text-3xl font-bold">Gérer mes templates</h1>
      {/* Cartes templates */}
      <div>
        <p className="text-gray-600 mb-2">Mes templates existantes</p>
        <div className="border rounded-lg p-4 shadow-sm hover:shadow-md transition">
          <ul className="divide-y">
            {(templates.length === 0 ? defaultTemplates : templates).map((t, i) => (
              <li key={i} className="py-4">
                <p className="font-semibold">
                  {t.industry} – {t.subject}
                </p>
                <pre className="whitespace-pre-wrap text-sm">{t.body}</pre>
              </li>
            ))}
          </ul>

          {templates.map((t) => (
            <div key={t.id} className="border rounded-lg p-4 shadow-sm hover:shadow-md transition">
              <h3 className="text-lg font-semibold">{t.industry}</h3>
              <p className="text-sm text-gray-500 mb-2">{t.subject}</p>
              <p className="text-sm text-gray-600 whitespace-pre-wrap">{t.body.slice(0, 100)}...</p>
            </div>
          ))}
        </div>
      </div>
      {/* Formulaire de création */}
      <h2 className="text-2xl font-bold mb-4">Créer ma propre template</h2>
      <div className="bg-white p-4 border rounded-md shadow space-y-4 max-w-xl">
        <div className="space-y-3">
          <input
            placeholder="Secteur (ex: M&A)"
            className="border px-3 py-2 rounded w-full"
            value={form.industry}
            onChange={(e) => setForm({ ...form, industry: e.target.value })}
          />
          <input
            placeholder="Objet de l’email"
            className="border px-3 py-2 rounded w-full"
            value={form.subject}
            onChange={(e) => setForm({ ...form, subject: e.target.value })}
          />
          <textarea
            placeholder="Corps de l’email (tu peux inclure {{prenom}}, {{email}}, etc.)"
            className="border px-3 py-2 rounded w-full"
            rows={6}
            value={form.body}
            onChange={(e) => setForm({ ...form, body: e.target.value })}
          />
          <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded border">
            <p className="font-medium mb-2">Variables disponibles :</p>
            <ul className="space-y-1 list-disc list-inside">
              <li>
                <span className="text-blue-600 font-semibold">{'{{prenom}}'}</span> → Prénom du
                recruteur
              </li>
              <li>
                <span className="text-blue-600 font-semibold">{'{{nom}}'}</span> → Nom du recruteur
              </li>
              <li>
                <span className="text-blue-600 font-semibold">{'{{email}}'}</span> → Ton adresse
                email
              </li>
              <li>
                <span className="text-blue-600 font-semibold">{'{{ecole}}'}</span> → Ton école
              </li>
              <li>
                <span className="text-blue-600 font-semibold">{'{{poste}}'}</span> → Poste visé
              </li>
              <li>
                <span className="text-blue-600 font-semibold">{'{{entreprise}}'}</span> → Nom de
                l’entreprise
              </li>
            </ul>
          </div>
          <button
            onClick={saveTemplate}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            <Save className="w-4 h-4 mr-1" />
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
}
