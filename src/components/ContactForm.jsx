import { useState } from 'react';

export default function ContactForm({ onAdd }) {
  const [v, setV] = useState({
    recruiter_name: '',
    position: '',
    firm: '',
    email: '',
  });
  const h = (k) => (e) => setV({ ...v, [k]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    if (!v.email) return;
    onAdd(v); // ⬅️ envoie au parent
    setV({ recruiter_name: '', position: '', firm: '', email: '' });
  };

  return (
    <form onSubmit={submit} className="grid grid-cols-2 gap-3 bg-white p-4 rounded shadow">
      <input placeholder="Nom recruteur" value={v.recruiter_name} onChange={h('recruiter_name')} />
      <input placeholder="Poste" value={v.position} onChange={h('position')} />
      <input placeholder="Entreprise" value={v.firm} onChange={h('firm')} />
      <input placeholder="Email" value={v.email} onChange={h('email')} required />
      <button className="col-span-2 bg-blue-600 text-white rounded py-2">Ajouter</button>
    </form>
  );
}
