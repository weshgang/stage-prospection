import { useState } from 'react';
import { Navigate }  from 'react-router-dom';
import UploadCSV     from '../components/UploadCSV';
import { useAuth }   from '../contexts/AuthContext';

export default function Dashboard() {
  /* Auth */
  const { user, loading } = useAuth();
  if (loading) return null;                       // spinner éventuel
  if (!user)   return <Navigate to="/login" replace />;

  /* État local */
  const [campaigns, setCampaigns] = useState([]);

  /* CSV handler */
  const handleCSVData = (rows) => {
    const newRows = rows.map((r, idx) => ({
      id: Date.now() + idx,
      ...r,
      status: 'Imported',
    }));
    setCampaigns(prev => [...newRows, ...prev]);
  };

  /* UI */
  return (
    <div className="min-h-screen bg-[#f7f8fa]">
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold">Tableau de bord</h1>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
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
                {campaigns.map(c => (
                  <tr key={c.id} className="border-t">
                    <td className="px-4 py-2">{c.recruiter}</td>
                    <td className="px-4 py-2">{c.position}</td>
                    <td className="px-4 py-2">{c.firm}</td>
                    <td className="px-4 py-2">{c.email}</td>
                    <td className="px-4 py-2">
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                        {c.status}
                      </span>
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
