import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { deriveStatus } from '../utils/followup';

export default function Dashboard() {
  const [contacts, setContacts] = useState([]);
  const [form, setForm] = useState({ recruiter: '', position: '', firm: '', email: '' });

  const user = supabase.auth.user(); // or getSession()
  if (!user) return <p>Please log in.</p>;

  // Load user’s contacts
  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('contacts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      setContacts(data || []);
    })();
  }, []);

  // Create or update row
  const handleSubmit = async () => {
    if (!form.email) return;
    const { data } = await supabase.from('contacts').insert([
      { ...form, user_id: user.id, last_sent_at: new Date().toISOString() }
    ]);
    setContacts([data[0], ...contacts]);
    setForm({ recruiter: '', position: '', firm: '', email: '' });
  };

  const sendEmail = async (id, email) => {
    const now = new Date().toISOString();
    await supabase.from('contacts').update({ last_sent_at: now }).eq('id', id);
    setContacts(contacts.map(c => c.id === id ? { ...c, last_sent_at: now } : c));
  };

  const markReplied = async (id) => {
    await supabase.from('contacts').update({ replied: true }).eq('id', id);
    setContacts(contacts.map(c => c.id === id ? { ...c, replied: true } : c));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* ADD FORM */}
      <div className="bg-white p-4 rounded shadow grid grid-cols-2 gap-3">
        <input placeholder="Recruiter" value={form.recruiter} onChange={e => setForm({ ...form, recruiter: e.target.value })} />
        <input placeholder="Position" value={form.position} onChange={e => setForm({ ...form, position: e.target.value })} />
        <input placeholder="Firm" value={form.firm} onChange={e => setForm({ ...form, firm: e.target.value })} />
        <input placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
        <button onClick={handleSubmit} className="col-span-2 bg-blue-600 text-white rounded px-3 py-1">Add & Send</button>
      </div>

      {/* TABLE */}
      <table className="w-full bg-white rounded shadow text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th>Recruiter</th>
            <th>Position</th>
            <th>Firm</th>
            <th>Email</th>
            <th>Last Sent</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {contacts.map(c => {
            const s = deriveStatus(c.last_sent_at, c.replied);
            return (
              <tr key={c.id} className="border-t">
                <td>{c.recruiter}</td>
                <td>{c.position}</td>
                <td>{c.firm}</td>
                <td>{c.email}</td>
                <td>{c.last_sent_at ? new Date(c.last_sent_at).toLocaleDateString() : '-'}</td>
                <td>
                  <span className={`px-2 py-1 rounded text-xs text-white ${s.color === 'red' ? 'bg-red-500' : s.color === 'green' ? 'bg-green-500' : 'bg-gray-400'}`}>
                    {s.label}
                  </span>
                </td>
                <td>
                  {!c.replied && (
                    <>
                      <button onClick={() => sendEmail(c.id, c.email)} className="text-xs mr-1">Send</button>
                      <button onClick={() => markReplied(c.id)} className="text-xs">Replied</button>
                    </>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}