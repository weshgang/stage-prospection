import React from 'react';

export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 text-gray-800">
      <h1 className="text-3xl font-bold mb-6">Politique de confidentialité — NetworkingPro</h1>
      <p className="text-sm text-gray-500 mb-10">Dernière mise à jour : 21 juillet 2025</p>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">1. Qui sommes-nous ?</h2>
        <p>
          <strong>NetworkingPro</strong> est une plateforme destinée aux étudiants qui souhaitent
          structurer et accélérer leur recherche de stage ou d’emploi. Elle centralise les contacts
          professionnels, les relances et facilite l’envoi d’emails personnalisés.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">2. Données collectées</h2>
        <p className="mb-2">
          Nous collectons uniquement les données nécessaires au bon fonctionnement du service :
        </p>
        <ul className="list-disc list-inside ml-4 mb-2">
          <li>Adresse e-mail (via Google)</li>
          <li>Nom et prénom (le cas échéant)</li>
        </ul>
        <p>
          Si vous autorisez l'accès Gmail (`gmail.send`), nous utilisons uniquement :
          <ul className="list-disc list-inside ml-4">
            <li>Votre adresse Gmail</li>
            <li>Le jeton OAuth2 sécurisé pour envoyer les emails à votre demande</li>
          </ul>
          <span className="font-semibold">
            Nous ne lisons ni stockons aucun email reçu ou envoyé.
          </span>
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">3. Utilisation des données</h2>
        <p>
          Vos données sont utilisées pour :
          <ul className="list-disc list-inside ml-4 mt-2">
            <li>Vous connecter à votre espace personnel</li>
            <li>
              Envoyer des emails à vos contacts professionnels depuis votre propre adresse Gmail
            </li>
          </ul>
          <span className="block mt-2">
            Les emails sont uniquement envoyés à votre demande, depuis votre compte personnel.
          </span>
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">4. Stockage & sécurité</h2>
        <p>
          Toutes les données sont stockées de manière sécurisée via <strong>Supabase</strong>. Nous
          ne stockons jamais vos emails ni vos identifiants Gmail.
        </p>
        <p className="mt-2">
          Nous utilisons :
          <ul className="list-disc list-inside ml-4">
            <li>Connexion chiffrée HTTPS</li>
            <li>Jetons OAuth2 sécurisés</li>
            <li>Règles d’accès serveur strictes</li>
          </ul>
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">5. Vos droits</h2>
        <p>
          Conformément au RGPD, vous pouvez :
          <ul className="list-disc list-inside ml-4">
            <li>Consulter, modifier ou supprimer vos données</li>
            <li>Révoquer l'accès de votre compte Google à tout moment</li>
          </ul>
        </p>
        <p className="mt-2">
          Pour cela, rendez-vous sur votre tableau de bord Google :{' '}
          <a
            href="https://myaccount.google.com/permissions"
            target="_blank"
            className="text-blue-600 underline"
          >
            https://myaccount.google.com/permissions
          </a>
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">6. Contact</h2>
        <p>
          Pour toute question : <br />
          📧{' '}
          <a href="mailto:contact@networkingpro.app" className="text-blue-600 underline">
            contact@networkingpro.app
          </a>{' '}
          <br />
          🌐{' '}
          <a href="https://www.networkingpro.app" className="text-blue-600 underline">
            www.networkingpro.app
          </a>
        </p>
      </section>
    </div>
  );
}
