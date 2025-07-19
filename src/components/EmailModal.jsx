import { useEffect, useState } from 'react';

export default function EmailModal({ contact, profile, onClose }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (contact && profile) {
      const recruiterFirstName = contact.recruiter_name?.split(' ')[0] || '';
      const userFullName = `${profile.prenom ?? ''} ${profile.nom ?? ''}`.trim();
      const emailTemplate = `Bonjour ${recruiterFirstName},

Je me permets de revenir vers vous concernant ma candidature pour un stage en ${
        contact.industry ?? 'finance'
      } au poste de ${contact.position ?? '...'}. Je suis actuellement étudiant à ${
        profile.ecole ?? 'votre école'
      } et je serais ravi d’échanger à ce sujet si vous êtes disponible.

Bien à vous,

${userFullName}
${profile.ecole}
${profile.email}
`;
      setMessage(emailTemplate);
    }
  }, [contact, profile]);
  const sendEmailToContact = async () => {
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: contact.email,
          subject: 'Relance – Candidature de stage',
          html: message.replace(/\n/g, '<br>'), // conversion vers HTML
        }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      alert('✅ Email envoyé avec succès !');
      onClose();
    } catch (err) {
      console.error('Erreur envoi email :', err);
      alert('❌ Erreur lors de l’envoi de l’email');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="bg-white w-full max-w-xl p-6 rounded-lg shadow-lg space-y-4 relative">
        <h2 className="text-lg font-semibold">✉️ Email de relance</h2>

        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={10}
          className="w-full border rounded px-3 py-2 text-sm resize-none"
        />

        <div className="flex justify-between items-center space-x-3">
          <button
            onClick={sendEmailToContact}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            ✅ Envoyer
          </button>

          <button
            onClick={() => {
              navigator.clipboard.writeText(message);
              alert('📋 Email copié !');
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            📋 Copier
          </button>

          <button onClick={onClose} className="text-gray-500 hover:underline px-3 py-2">
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}
