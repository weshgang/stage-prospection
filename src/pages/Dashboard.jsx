import { useState, useEffect, useMemo } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import EmailModal from '../components/EmailModal';
import UploadCSV from '../components/UploadCSV';
import ContactForm from '../components/ContactForm';
import { distanceFr } from '../utils/time';
import { useAuth } from '../contexts/AuthContext';
import { Mail, Trash2, CircleCheck, AlarmClock } from 'lucide-react';

export default function Dashboard() {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  const [selectedContact, setSelectedContact] = useState(null);
  const [profile, setProfile] = useState(null);

  const [contacts, setContacts] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [industryFilter, setIndustryFilter] = useState('');
  const [sortKey, setSortKey] = useState('created_at');
  const [sortAsc, setSortAsc] = useState(false);
  const [selected, setSelected] = useState(new Set());
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

  useEffect(() => {
    const id = setInterval(() => setContacts((c) => [...c]), 60_000);
    return () => clearInterval(id);
  }, []);
  const deleteContact = async (id) => {
    await supabase.from('contacts').delete().eq('id', id);
    setContacts((c) => c.filter((x) => x.id !== id));
  };
  useEffect(() => {
    const fetchProfile = async () => {
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      if (data) setProfile({ ...data, email: user.email });
    };
    if (user) fetchProfile();
  }, [user]);

  const addContact = async (payload) => {
    const { data, error } = await supabase
      .from('contacts')
      .insert([{ ...payload, user_id: user.id, last_sent_at: null }])
      .select();

    if (error) {
      console.error('[addContact] Supabase error:', error);
      return;
    }
    setContacts((prev) => [...prev, data[0]]);
  };
  const today = new Date().toISOString().split('T')[0];

  const stats = useMemo(() => {
    const replied = contacts.filter((c) => c.replied).length;
    const sent = contacts.filter((c) => c.last_sent_at).length;
    const toFollowUpToday = contacts.filter((c) => c.follow_up_date === today && !c.replied).length;

    return {
      total: contacts.length,
      replied,
      sent,
      toFollowUpToday,
      responseRate: sent > 0 ? Math.round((replied / sent) * 100) : 0,
    };
  }, [contacts]);

  const sendEmail = async (id) => {
    const now = new Date().toISOString();
    await supabase.from('contacts').update({ last_sent_at: now }).eq('id', id);
    setContacts((c) => c.map((x) => (x.id === id ? { ...x, last_sent_at: now } : x)));
  };

  const markReplied = async (id) => {
    const now = new Date().toISOString();
    await supabase
      .from('contacts')
      .update({ replied: true, last_sent_at: now }) // ← ajoute ça
      .eq('id', id);

    setContacts((c) =>
      c.map((x) => (x.id === id ? { ...x, replied: true, last_sent_at: now } : x))
    );
  };

  const handleCSVData = (rows) => {
    const newRows = rows.map((r, i) => ({
      id: Date.now() + i,
      ...r,
      status: 'Imported',
    }));
    setCampaigns((prev) => [...newRows, ...prev]);
  };
  const filteredContacts = useMemo(() => {
    let out = [...contacts];

    // recherche plein‐texte simple
    const q = search.toLowerCase();
    if (q)
      out = out.filter(
        (c) =>
          c.recruiter_name?.toLowerCase().includes(q) ||
          c.position?.toLowerCase().includes(q) ||
          c.firm?.toLowerCase().includes(q) ||
          c.email?.toLowerCase().includes(q)
      );

    if (statusFilter) out = out.filter((c) => c.tracking_status === statusFilter);
    if (industryFilter) out = out.filter((c) => c.industry === industryFilter);

    // tri
    out.sort((a, b) => {
      const valA = a[sortKey] ?? '';
      const valB = b[sortKey] ?? '';
      return sortAsc ? String(valA).localeCompare(valB) : String(valB).localeCompare(valA);
    });

    return out;
  }, [contacts, search, statusFilter, industryFilter, sortKey, sortAsc]);

  return (
    <div className="min-h-screen bg-[#f7f8fa]">
      {/* HEADER */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-5 flex justify-between items-center">
          <h1 className="text-3xl font-semibold text-gray-800">
            👋 Bienvenue sur ton tableau de bord
          </h1>
        </div>
      </header>

      {/* MAIN */}
      <main className="max-w-6xl mx-auto px-4 py-10 space-y-10">
        <div className="bg-white p-4 rounded-xl shadow flex flex-wrap gap-4 items-center">
          <input
            type="text"
            placeholder="🔍 Rechercher…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 border px-3 py-2 rounded"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border px-3 py-2 rounded"
          >
            <option value="">Statut (tous)</option>
            <option>À relancer</option>
            <option>En attente</option>
            <option>Répondu</option>
            <option>Refus</option>
          </select>

          <select
            value={industryFilter}
            onChange={(e) => setIndustryFilter(e.target.value)}
            className="border px-3 py-2 rounded"
          >
            <option value="">Secteur (tous)</option>
            <option>M&A</option>
            <option>Asset Management</option>
            <option>Private Equity</option>
            <option>Trading</option>
            <option>Audit / TS</option>
            <option>VC / Startups</option>
          </select>
        </div>
        {/* Stats */}
        <section className="bg-white p-6 rounded-xl shadow flex flex-wrap gap-6 justify-between">
          <div>
            <p className="text-sm text-gray-500">Contacts totaux</p>
            <p className="text-xl font-bold text-gray-800">{stats.total}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Relances envoyées</p>
            <p className="text-xl font-bold text-gray-800">{stats.sent}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Réponses reçues</p>
            <p className="text-xl font-bold text-gray-800">{stats.replied}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Taux de réponse</p>
            <p className="text-xl font-bold text-gray-800">{stats.responseRate}%</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Relances à faire aujourd’hui</p>
            <p className="text-xl font-bold text-orange-600">{stats.toFollowUpToday}</p>
          </div>
        </section>

        {/* Ajouter un contact */}
        <section className="bg-white p-6 rounded-xl shadow space-y-4">
          <h2 className="text-lg font-semibold text-gray-700">Ajouter un contact</h2>
          <ContactForm onAdd={addContact} />
        </section>

        {/* Tableau des contacts */}
        {contacts.length > 0 && (
          <section className="bg-white p-6 rounded-xl shadow space-y-4">
            <h2 className="text-lg font-semibold text-gray-700">Mes contacts</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border-separate border-spacing-y-2">
                <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                  <tr>
                    <th className="px-4 py-2">
                      <input
                        type="checkbox"
                        checked={
                          selected.size === filteredContacts.length && filteredContacts.length > 0
                        }
                        onChange={(e) =>
                          setSelected(
                            e.target.checked
                              ? new Set(filteredContacts.map((c) => c.id))
                              : new Set()
                          )
                        }
                      />
                    </th>
                    {[
                      ['Nom', 'recruiter_name'],
                      ['Industry', 'industry'],
                      ['Poste', 'position'],
                      ['Entreprise', 'firm'],
                      ['Email', 'email'],
                      ['Statut', 'tracking_status'],
                      ['Relance', 'follow_up_date'],
                      ['Dernier envoi', 'last_sent_at'],
                      ['Note', 'note'],
                    ].map(([label, key]) => (
                      <th
                        key={key}
                        className="px-4 py-2 cursor-pointer select-none"
                        onClick={() =>
                          key === sortKey
                            ? setSortAsc(!sortAsc)
                            : (setSortKey(key), setSortAsc(true))
                        }
                      >
                        {label}
                        {sortKey === key && (sortAsc ? ' ▲' : ' ▼')}
                      </th>
                    ))}
                    <th className="px-4 py-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredContacts.map((c) => (
                    <tr key={c.id} className="bg-gray-50 hover:bg-gray-100 rounded-xl shadow-sm">
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selected.has(c.id)}
                          onChange={(e) => {
                            const next = new Set(selected);
                            e.target.checked ? next.add(c.id) : next.delete(c.id);
                            setSelected(next);
                          }}
                        />
                      </td>

                      <td className="px-4 py-3 rounded-l">{c.recruiter_name}</td>
                      <td className="px-4 py-3">{c.industry}</td>
                      <td className="px-4 py-3">{c.position}</td>
                      <td className="px-4 py-3">{c.firm}</td>
                      <td className="px-4 py-3">{c.email}</td>
                      <td className="px-4 py-3">
                        <div className="inline-flex items-center px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700 font-semibold">
                          {c.tracking_status || '—'}
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        {c.follow_up_date
                          ? new Date(c.follow_up_date).toLocaleDateString('fr-FR')
                          : '—'}
                      </td>
                      <td className="px-4 py-3">
                        {c.last_sent_at ? distanceFr(c.last_sent_at) : 'Jamais'}
                      </td>
                      <td className="px-4 py-3 max-w-[150px] truncate" title={c.note || ''}>
                        {c.note || '—'}
                      </td>
                      <td className="px-4 py-3 rounded-r">
                        <div className="flex flex-wrap gap-2 items-center">
                          {!c.replied && (
                            <>
                              <button
                                onClick={() => sendEmail(c.id)}
                                className="flex items-center text-xs text-blue-600 hover:underline"
                              >
                                <AlarmClock className="w-4 h-4 mr-1" />
                                Relancer
                              </button>

                              <button
                                onClick={() => markReplied(c.id)}
                                className="flex items-center text-xs text-green-600 hover:underline"
                              >
                                <CircleCheck className="w-4 h-4 mr-1" />
                                Répondu
                              </button>

                              <button
                                onClick={() => setSelectedContact(c)}
                                className="flex items-center text-xs text-gray-600 hover:underline"
                              >
                                <Mail className="w-4 h-4 mr-1" />
                                Email
                              </button>
                            </>
                          )}

                          <button
                            onClick={() => deleteContact(c.id)}
                            className="flex items-center text-xs text-red-500 hover:underline"
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Supprimer
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Import CSV */}
        <section className="bg-white p-6 rounded-xl shadow space-y-4">
          <h2 className="text-lg font-semibold text-gray-700">Importer un fichier CSV</h2>
          <UploadCSV onData={handleCSVData} />
        </section>

        {/* Aperçu CSV importé */}
        {campaigns.length > 0 && (
          <section className="bg-white p-6 rounded-xl shadow space-y-4">
            <h2 className="text-lg font-semibold text-gray-700">Aperçu des données importées</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border-separate border-spacing-y-2">
                <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                  <tr>
                    <th className="px-4 py-2">Recruiter</th>
                    <th className="px-4 py-2">Position</th>
                    <th className="px-4 py-2">Firm</th>
                    <th className="px-4 py-2">Email</th>
                    <th className="px-4 py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {campaigns.map((c) => (
                    <tr key={c.id} className="bg-gray-50 hover:bg-gray-100 rounded-xl shadow-sm">
                      <td className="px-4 py-3 rounded-l">{c.recruiter}</td>
                      <td className="px-4 py-3">{c.position}</td>
                      <td className="px-4 py-3">{c.firm}</td>
                      <td className="px-4 py-3">{c.email}</td>
                      <td className="px-4 py-3 rounded-r">
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          {c.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
        {selectedContact && profile && (
          <EmailModal
            contact={selectedContact}
            profile={profile}
            onClose={() => setSelectedContact(null)}
          />
        )}
      </main>
    </div>
  );
}
