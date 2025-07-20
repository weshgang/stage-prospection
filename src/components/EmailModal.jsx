import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { CircleCheck, ClipboardCopy } from 'lucide-react';

export default function EmailModal({ contact, profile, onClose }) {
  const [message, setMessage] = useState('');
  const [templates, setTemplates] = useState([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState('');

  useEffect(() => {
    const fetchTemplates = async () => {
      if (!contact || !profile) return;

      const { data } = await supabase
        .from('email_templates')
        .select('*')
        .eq('user_id', profile.id)
        .order('created_at', { ascending: false });

      setTemplates(data ?? []);

      // Auto-sélectionner template du même secteur
      const match = data?.find((tpl) => tpl.industry === contact.industry);
      if (match) {
        setSelectedTemplateId(match.id);
        applyTemplate(match);
      }
    };

    fetchTemplates();
  }, [contact, profile]);

  function applyTemplate(template) {
    const replacements = {
      '{{prenom}}': contact.recruiter_name?.split(' ')[0] || '',
      '{{nom}}': contact.recruiter_name?.split(' ').slice(1).join(' ') || '',
      '{{poste}}': contact.position || '',
      '{{entreprise}}': contact.firm || '',
      '{{email}}': profile.email || '',
      '{{ecole}}': profile.ecole || '',
    };

    let result = template.body;
    for (const [key, value] of Object.entries(replacements)) {
      result = result.replaceAll(key, value);
    }

    setMessage(result);
  }

  const sendEmailToContact = async () => {
    try {
      await navigator.clipboard.writeText(message);
      alert('📋 Le message a été copié dans le presse-papier ! Ouvre Gmail et colle-le.');
      onClose();
    } catch (err) {
      console.error('Erreur copie email :', err);
      alert('❌ Erreur lors de la copie de l’email');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="bg-white w-full max-w-xl p-6 rounded-lg shadow-lg space-y-4 relative">
        <h2 className="text-lg font-semibold">✉️ Email de relance</h2>

        <select
          className="border px-3 py-2 rounded w-full text-sm"
          value={selectedTemplateId}
          onChange={(e) => {
            const id = e.target.value;
            setSelectedTemplateId(id);
            const template = templates.find((t) => t.id === id);
            if (template) applyTemplate(template);
          }}
        >
          <option value="">📄 Choisir un template</option>
          {templates.map((t) => (
            <option key={t.id} value={t.id}>
              {t.industry} – {t.subject}
            </option>
          ))}
        </select>

        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={10}
          className="w-full border rounded px-3 py-2 text-sm resize-none"
        />

        <div className="flex justify-between items-center space-x-3">
          <button
            onClick={sendEmailToContact}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center"
          >
            <CircleCheck className="w-4 h-4 mr-2" />
            Envoyer
          </button>

          <button
            onClick={() => {
              navigator.clipboard.writeText(message);
              alert('📋 Email copié !');
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center"
          >
            <ClipboardCopy className="w-4 h-4 mr-2" />
            Copier
          </button>

          <button onClick={onClose} className="text-gray-500 hover:underline px-3 py-2">
            Fermer
          </button>
        </div>

        <a
          href={`mailto:${contact.email}?subject=${encodeURIComponent(
            'Relance – Candidature de stage'
          )}&body=${encodeURIComponent(message)}`}
          className="block mt-4 text-center bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          target="_blank"
          rel="noopener noreferrer"
        >
          📬 Ouvrir Gmail
        </a>
      </div>
    </div>
  );
}
