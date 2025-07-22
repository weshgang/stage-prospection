import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { CircleCheck, ClipboardCopy, Mail } from 'lucide-react';
import { getGmailAccessToken } from '../contexts/AuthContext';
import { useAuth } from '../contexts/AuthContext';

export default function EmailModal({ contact, profile, onClose }) {
  const [message, setMessage] = useState('');
  const [templates, setTemplates] = useState([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    (async () => {
      const { data, error } = await supabase
        .from('email_templates')
        .select('*')
        .or(`user_id.eq.${user.id},user_id.is.null`)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erreur chargement templates:', error.message);
        return;
      }

      setTemplates(data ?? []);
    })();
  }, [user]);

  function applyTemplate(template) {
    const sexeCode = contact.sex?.toUpperCase();
    const sexeCivil = sexeCode === 'F' ? 'Madame' : sexeCode === 'H' ? 'Monsieur' : '';

    const replacements = {
      '{{prenom}}': contact.FirstName || '',
      '{{nom}}': contact.LastName || '',
      '{{poste}}': contact.position || '',
      '{{entreprise}}': contact.firm || '',
      '{{email}}': profile.email || '',
      '{{ecole}}': profile.ecole || '',
      '{{sexe}}': sexeCivil,
    };

    // Remplacer dans le sujet et le corps
    let subject = template.subject || '';
    let body = template.body || template.content || '';

    for (const [key, value] of Object.entries(replacements)) {
      subject = subject.replaceAll(key, value);
      body = body.replaceAll(key, value);
    }

    setSelectedTemplate({ subject, body });
    setMessage(body);
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
  const handleSendEmails = async () => {
    const { accessToken, email } = await getGmailAccessToken();

    const res = await fetch('/api/sendEmails', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        accessToken,
        email,
        contacts: [contact], // tableau [{ email, name }]
        template: selectedTemplate, // objet { subject, content }
      }),
    });

    const data = await res.json();
    if (data.success) {
      alert('Emails envoyés avec succès !');
    } else {
      alert(`Erreur : ${data.error}`);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="bg-white w-full max-w-xl p-6 rounded-lg shadow-lg space-y-4 relative">
        <h2 className="text-lg font-semibold">
          <Mail className="inline mr-2" />
          Email de relance
        </h2>

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
          <option value="">Sélectionner une template</option>
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
            onClick={handleSendEmails}
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
      </div>
    </div>
  );
}
