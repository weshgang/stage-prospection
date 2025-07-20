import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export default function TemplateEditor() {
  const { user } = useAuth();
  const [templates, setTemplates] = useState([]);
  const [form, setForm] = useState({ industry: '', subject: '', body: '' });

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
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">📄 Gérer mes templates</h2>

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
        <button
          onClick={saveTemplate}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          💾 Enregistrer
        </button>
      </div>

      <ul className="divide-y">
        {templates.map((t) => (
          <li key={t.id} className="py-4">
            <p className="font-semibold">
              {t.industry} – {t.subject}
            </p>
            <pre className="whitespace-pre-wrap text-sm">{t.body}</pre>
          </li>
        ))}
      </ul>
    </div>
  );
}
