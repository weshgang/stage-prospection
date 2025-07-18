import { useState, useEffect } from 'react';
import { Navigate }            from 'react-router-dom';
import UploadCSV               from '../components/UploadCSV';
import { supabase }            from '../lib/supabase';
import { deriveStatus }        from '../utils/followup';
import { useAuth }             from '../contexts/AuthContext';

export default function Dashboard() {
  /* 1️⃣ Auth : récupère user & loading depuis le contexte v2 */
  const { user, loading } = useAuth();
  if (loading) return null;                            // spinner éventuel
  if (!user)   return <Navigate to="/login" replace />;

  /* 2️⃣ État local pour les contacts */
  const [contacts, setContacts] = useState([]);
  const [form, setForm] = useState({
    recruiter: '', position: '', firm: '', email: '',
  });

  /* 3️⃣ Charge les contacts du user */
  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (!error) setContacts(data ?? []);
    })();
  }, [user.id]);

  /* 4️⃣ Ajoute un contact + envoie immédiat (placeholder) */
  const handleSubmit = async () => {
    if (!form.email) return;

    const { data, error } = await supabase
      .from('contacts')
      .insert([{ ...form, user_id: user.id, last_sent_at: new Date().toISOString() }])
      .select();                       // ⬅️ pour récupérer la ligne insérée

    if (!error && data) {
      setContacts([data[0], ...contacts]);
      setForm({ recruiter: '', position: '', firm: '', email: '' });
    }
  };

  /* 5️⃣ Actions ligne par ligne */
  const sendEmail = async (id) => {
    const now = new Date().toISOString();
    await supabase.from('contacts').update({ last_sent_at: now }).eq('id', id);
    setContacts(contacts.map(c => c.id === id ? { ...c, last_sent_at: now } : c));
  };

  const markReplied = async (id) => {
    await supabase.from('contacts').update({ replied: true }).eq('id', id);
    setContacts(contacts.map(c => c.id === id ? { ...c, replied: true } : c));
  };

  /* 6️⃣ UI */
  return (
    <div className="min-h-screen bg-[#f7f8fa]">
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold">Tableau de bord</h1>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Import CSV (optionnel) */}
        <UploadCSV onData={rows => {
          const newRows = rows.map((r, i) => ({
            id: Date.now() + i, ...r, sentAt: '-', status: 'Imported'
          }));
          setContacts(prev => [...newRows, ...prev]);
        }} />

        {/* Formulaire ajout manuel */}
        <div className="bg-white p-4 rounded shadow grid grid-cols-2 gap-3">
          <input placeholder="Recruiter"
                 value={form.recruiter}
                 onChange={e => setForm({ ...form, recruiter: e.target.value })} />
          <input placeholder="Position"
                 value={form.position}
                 onChange={e => setForm({ ...form, position: e.target.value })} />
          <input placeholder="Firm"
                 value={form.firm}
                 onChange={e => setForm({ ...form, firm: e.target.value })} />
          <input placeholder="Email"
                 value={form.email}
                 onChange={e => setForm({ ...form, email: e.target.value })} />
          <button onClick={handleSubmit}
                  className="col-span-2 bg-blue-600 text-white rounded px-3 py-1">
            Add & Send
          </button>
        </div>

        {/* Tableau */}
        {contacts.length > 0 && (
          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3">Recruiter</th>
                  <th className="px-4 py-3">Position</th>
                  <th className="px-4 py-3">Firm</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Last&nbsp;Sent</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {contacts.map(c => {
                  const s = deriveStatus(c.last_sent_at, c.replied);
                  return (
                    <tr key={c.id} className="border-t">
                      <td className="px-4 py-2">{c.recruiter}</td>
                      <td className="px-4 py-2">{c.position}</td>
                      <td className="px-4 py-2">{c.firm}</td>
                      <td className="px-4 py-2">{c.email}</td>
                      <td className="px-4 py-2">
                        {c.last_sent_at ? new Date(c.last_sent_at).toLocaleDateString() : '-'}
                      </td>
                      <td className="px-4 py-2">
                        <span className={`px-2 py-1 rounded text-xs text-white ${
                          s.color === 'red'   ? 'bg-red-500'
                        : s.color === 'green' ? 'bg-green-500'
                        : 'bg-gray-400'}`}>
                          {s.label}
                        </span>
                      </td>
                      <td className="px-4 py-2 space-x-1">
                        {!c.replied && (
                          <>
                            <button onClick={() => sendEmail(c.id)}
                                    className="text-xs underline">Send</button>
                            <button onClick={() => markReplied(c.id)}
                                    className="text-xs underline">Replied</button>
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
