import { useState } from 'react';
import UploadCSV from '../components/UploadCSV';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';

export const SignOutButton = () => {
  const navigate = useNavigate();
  return (
    <button
      onClick={async () => {
        await supabase.auth.signOut();
        navigate('/login');
      }}
      className="text-sm text-red-600 underline"
    >
      Sign Out
    </button>
  );
};

export default function Dashboard() {
  const user = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  // 1️⃣ Local state that will later come from MongoDB
  const [campaigns, setCampaigns] = useState([]);

  // 2️⃣ Handler fired by UploadCSV component
  const handleCSVData = (rows) => {
    // rows = [{ recruiter, position, firm, email, ... }, ...]
    const newCampaigns = rows.map((r, idx) => ({
      id: Date.now() + idx,          // temporary ID
      ...r,
      sentAt: '-',
      status: 'Imported',
    }));
    setCampaigns((prev) => [...prev, ...newCampaigns]);
  };

  return (
    <div className="min-h-screen bg-[#f7f8fa]">
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold">Tableau de bord</h1>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* CSV importer */}
        <UploadCSV onData={handleCSVData} />

        {/* Tracking table */}
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