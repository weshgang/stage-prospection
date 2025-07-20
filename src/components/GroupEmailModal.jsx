import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { ClipboardCopy, X } from 'lucide-react';

export default function GroupEmailModal({ contacts, profile, onClose }) {
  const [template, setTemplate] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchTemplate = async () => {
      const { data } = await supabase
        .from('email_templates')
        .select('*')
        .eq('user_id', profile.id)
        .order('created_at', { ascending: false })
        .limit(1);
      if (data?.length) setTemplate(data[0]);
    };

    fetchTemplate();
  }, [profile.id]);

  useEffect(() => {
    if (!template) return;

    const generated = contacts.map((contact) => {
      const recruiterFirstName = contact.recruiter_name?.split(' ')[0] || '';
      const userFullName = `${profile.prenom ?? ''} ${profile.nom ?? ''}`.trim();

      let msg = template.body
        .replace(/{{prenom}}/g, recruiterFirstName)
        .replace(/{{email}}/g, profile.email)
        .replace(/{{poste}}/g, contact.position ?? '')
        .replace(/{{entreprise}}/g, contact.firm ?? '')
        .replace(/{{ecole}}/g, profile.ecole ?? '')
        .replace(/{{nom}}/g, userFullName);

      return { id: contact.id, email: contact.email, message: msg };
    });

    setMessages(generated);
  }, [template, contacts, profile]);

  const copyAll = async () => {
    const combined = messages
      .map((m, i) => `--- Email ${i + 1} (${m.email}) ---\n\n${m.message}`)
      .join('\n\n');
    await navigator.clipboard.writeText(combined);
    alert('📋 Tous les messages ont été copiés dans le presse-papier !');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="bg-white w-full max-w-3xl p-6 rounded-lg shadow-lg space-y-6 overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">✉️ Emails groupés – {messages.length} contacts</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-black">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          {messages.map((m) => (
            <div key={m.id} className="border rounded p-4 bg-gray-50">
              <p className="text-xs text-gray-500 mb-2">{m.email}</p>
              <pre className="whitespace-pre-wrap text-sm">{m.message}</pre>
            </div>
          ))}
        </div>

        <div className="text-right">
          <button
            onClick={copyAll}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            <ClipboardCopy className="w-4 h-4 inline mr-2" />
            Copier tous les messages
          </button>
        </div>
      </div>
    </div>
  );
}
