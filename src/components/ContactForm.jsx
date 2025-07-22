import { useState } from 'react';
import { UserPlus } from 'lucide-react';

export default function ContactForm({ onAdd, initialValues = null, editing = false }) {
  const [v, setV] = useState(
    initialValues || {
      FirstName: '',
      LastName: '',
      position: '',
      firm: '',
      email: '',
      tracking_status: 'À relancer',
      follow_up_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      note: '',
      industry: '',
      sex: '',
    }
  );

  const h = (k) => (e) => setV({ ...v, [k]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    if (!v.email) return;
    onAdd(v);
    if (!editing) {
      setV({
        LastName: '',
        FirstName: '',
        position: '',
        sex: '',
        firm: '',
        email: '',
        tracking_status: 'À relancer',
        follow_up_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        note: '',
        industry: '',
      });
    }
  };
  const getFutureDate = (days) =>
    new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  return (
    <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="flex space-x-2">
        <div className="flex-1">
          <label className="text-sm font-medium">Prénom du recruteur</label>
          <input
            type="text"
            name="recruiter_first_name"
            value={v.FirstName || ''}
            onChange={h('FirstName')}
            className="border rounded px-3 py-2 w-full"
            required
          />
        </div>
        <div className="flex-1">
          <label className="text-sm font-medium">Nom du recruteur</label>
          <input
            type="text"
            name="recruiter_last_name"
            value={v.LastName || ''}
            onChange={h('LastName')}
            className="border rounded px-3 py-2 w-full"
            required
          />
        </div>
      </div>

      <div className="flex flex-col">
        <label className="text-sm text-gray-600 mb-1">Secteur</label>
        <select
          value={v.industry}
          onChange={h('industry')}
          className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">Sélectionner un secteur</option>
          <option>M&A</option>
          <option>Asset Management</option>
          <option>Private Equity</option>
          <option>Trading</option>
          <option>Audit-TS</option>
          <option>VC-Startups</option>
        </select>
      </div>
      <div className="flex flex-col">
        <label className="text-sm text-gray-600 mb-1">Poste</label>
        <input
          className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Ex: Analyste M&A"
          value={v.position}
          onChange={h('position')}
        />
      </div>

      <div className="flex flex-col">
        <label className="text-sm text-gray-600 mb-1">Entreprise</label>
        <input
          className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Ex: Rothschild"
          value={v.firm}
          onChange={h('firm')}
        />
      </div>
      <div className="flex flex-col">
        <label className="text-sm text-gray-600 mb-1">Homme/Femme</label>
        <input
          className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Taper H ou F"
          value={v.sex}
          onChange={h('sex')}
        />
      </div>

      <div className="flex flex-col">
        <label className="text-sm text-gray-600 mb-1">Email</label>
        <input
          type="email"
          required
          className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Ex: j.dupont@rothschild.fr"
          value={v.email}
          onChange={h('email')}
        />
      </div>

      <div className="flex flex-col">
        <label className="text-sm text-gray-600 mb-1">Statut de suivi</label>
        <select
          value={v.tracking_status}
          onChange={h('tracking_status')}
          className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option>À relancer</option>
          <option>En attente</option>
          <option>Répondu</option>
          <option>Refus</option>
        </select>
      </div>

      <div className="flex flex-col">
        <label className="text-sm text-gray-600 mb-1">Relance automatique</label>
        <select
          value={v.follow_up_date}
          onChange={h('follow_up_date')}
          className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">Aucune date</option>
          <option value={getFutureDate(5)}>Dans 5 jours</option>
          <option value={getFutureDate(7)}>Dans 1 semaine</option>
          <option value={getFutureDate(14)}>Dans 2 semaines</option>
        </select>
      </div>

      <div className="flex flex-col md:col-span-2">
        <label className="text-sm text-gray-600 mb-1">Note personnelle</label>
        <textarea
          value={v.note}
          onChange={h('note')}
          rows="3"
          placeholder="Ex: Vu à la conférence de l’AMF, très sympa"
          className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
        />
      </div>

      <div className="md:col-span-2">
        <button
          type="submit"
          className="w-full py-3 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
        >
          <UserPlus className="inline mr-2" />
          Ajouter le contact
        </button>
      </div>
    </form>
  );
}
