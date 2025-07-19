// src/pages/Dashboard.jsx
import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

import UploadCSV from '../components/UploadCSV';
import ContactForm from '../components/ContactForm';
import { distanceFr } from '../utils/time';
import { useAuth } from '../contexts/AuthContext';

export default function Dashboard() {
  /* 1️⃣ Auth */
  const { user, loading } = useAuth();
  if (loading) return null; // petit spinner possible
  if (!user) return <Navigate to="/login" replace />;

  /* 2️⃣ États locaux */
  const [contacts, setContacts] = useState([]);
  const [campaigns, setCampaigns] = useState([]); // lignes importées par CSV

  /* 3️⃣ Charge les contacts existants une seule fois */
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

  /* 4️⃣ Rafraîchir l’affichage “il y a X min” toutes les 60 s */
  useEffect(() => {
    const id = setInterval(() => setContacts((c) => [...c]), 60_000);
    return () => clearInterval(id);
  }, []);

  /* Ajout manuel d’un contact */
  const addContact = async (payload) => {
    const { data, error } = await supabase
      .from('contacts')
      .insert([{ ...payload, user_id: user.id, last_sent_at: null }])
      .select();

    if (error) {
      console.error('[addContact] Supabase error:', error);
      return;
    }
    // On l’ajoute EN BAS (ordre ascendant)
    setContacts((prev) => [...prev, data[0]]);
  };

  /* 6️⃣ Actions ligne par ligne */
  const sendEmail = async (id) => {
    const now = new Date().toISOString();
    await supabase.from('contacts').update({ last_sent_at: now }).eq('id', id);
    setContacts((c) => c.map((x) => (x.id === id ? { ...x, last_sent_at: now } : x)));
  };

  const markReplied = async (id) => {
    await supabase.from('contacts').update({ replied: true }).eq('id', id);
    setContacts((c) => c.map((x) => (x.id === id ? { ...x, replied: true } : x)));
  };

  /* 7️⃣ Handler CSV */
  const handleCSVData = (rows) => {
    const newRows = rows.map((r, i) => ({
      id: Date.now() + i,
      ...r,
      status: 'Imported',
    }));
    setCampaigns((prev) => [...newRows, ...prev]);
  };

  /* 8️⃣ UI */
  return (
    <div className="min-h-screen bg-[#f7f8fa]">
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold">Tableau de bord</h1>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Formulaire d’ajout manuel */}
        <ContactForm onAdd={addContact} />

        {/* Tableau des contacts */}
        {contacts.length > 0 && (
          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3">Nom</th>
                  <th className="px-4 py-3">Poste</th>
                  <th className="px-4 py-3">Entreprise</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Dernier&nbsp;envoi</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {contacts.map((c) => (
                  <tr key={c.id} className="border-t">
                    <td className="px-4 py-2">{c.recruiter_name}</td>
                    <td className="px-4 py-2">{c.position}</td>
                    <td className="px-4 py-2">{c.firm}</td>
                    <td className="px-4 py-2">{c.email}</td>
                    <td className="px-4 py-2">
                      {c.last_sent_at ? distanceFr(c.last_sent_at) : 'Jamais'}
                    </td>
                    <td className="px-4 py-2">
                      {!c.replied && (
                        <>
                          <button
                            onClick={() => sendEmail(c.id)}
                            className="text-xs underline mr-2"
                          >
                            Relancer
                          </button>
                          <button onClick={() => markReplied(c.id)} className="text-xs underline">
                            Répondu
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Import CSV optionnel */}
        <UploadCSV onData={handleCSVData} />

        {campaigns.length > 0 && (
          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3">Recruiter</th>
                  <th className="px-4 py-3">Position</th>
                  <th className="px-4 py-3">Firm</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map((c) => (
                  <tr key={c.id} className="border-t">
                    <td className="px-4 py-2">{c.recruiter}</td>
                    <td className="px-4 py-2">{c.position}</td>
                    <td className="px-4 py-2">{c.firm}</td>
                    <td className="px-4 py-2">{c.email}</td>
                    <td className="px-4 py-2">
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">{c.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
