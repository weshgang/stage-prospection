export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  const { to, subject, html } = req.body;

  if (!to || !subject || !html) {
    return res.status(400).json({ error: 'Données manquantes' });
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'StageProspect <noreply@stageprospect.com>',
        to,
        subject,
        html,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('[RESEND ERROR]', data);
      return res.status(500).json({ error: 'Erreur envoi via Resend' });
    }

    res.status(200).json({ success: true, id: data.id });
  } catch (err) {
    console.error('[SERVER ERROR]', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}
