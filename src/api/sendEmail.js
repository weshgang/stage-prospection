// src/api/sendEmails.js (ou /api/sendEmails.js pour Vercel)
import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  const { contacts, template, accessToken, email } = req.body;

  if (!accessToken || !email || !contacts || !template) {
    return res.status(400).json({ error: 'Paramètres manquants' });
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
      const html = template.content.replace('{{name}}', contact.name || '');
      await transporter.sendMail({
        from: email,
        to: contact.email,
        subject: template.subject,
        html,
      });
    }

    res.status(200).json({ success: true });
  } catch (err) {
    console.error('Erreur envoi:', err);
    res.status(500).json({ error: 'Erreur lors de l’envoi des emails' });
  }
}
