import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  const { contacts, template, accessToken, email } = req.body;

  if (!accessToken || !email || !contacts || !template) {
    return res.status(400).json({ error: 'Paramètres manquants' });
  }

  function applyTemplate(text, variables) {
    return text.replace(/{{(.*?)}}/g, (_, key) => {
      const value = variables[key.trim()];
      return value !== undefined && value !== null ? value : '';
    });
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: email,
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      accessToken,
    },
  });

  try {
    for (const contact of contacts) {
      // Sécurité : ne traiter que "H" ou "F"
      const sexeCode = contact.sexe?.toUpperCase();
      const sexeCivil = sexeCode === 'F' ? 'Madame' : sexeCode === 'H' ? 'Monsieur' : null;

      if (!sexeCivil) {
        console.warn(`Contact invalide (sexe non reconnu):`, contact);
        continue; // skip
      }

      // Remplacer les variables dynamiques
      const variables = {
        ...contact,
        sexe: contact.sexe === 'F' ? 'Madame' : 'Monsieur',
        prenom: contact.contact_firstname || '',
        nom: contact.contact_familyname || '',
      };

      const filledSubject = applyTemplate(template.subject, variables);
      const filledBody = applyTemplate(template.content || template.body, variables);

      await transporter.sendMail({
        from: email,
        to: contact.email,
        subject: filledSubject,
        html: filledBody.replace(/\n/g, '<br>'),
      });
    }

    res.status(200).json({ success: true });
  } catch (err) {
    console.error('Erreur envoi:', err);
    res.status(500).json({ error: 'Erreur lors de l’envoi des emails' });
  }
}
