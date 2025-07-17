// src/components/UploadCSV.jsx
import { useState } from 'react';
import Papa from 'papaparse';

export default function UploadCSV({ onData }) {
  const [mode, setMode] = useState('csv'); // 'csv' | 'manual'

  /* ---------- CSV upload ---------- */
  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (res) => onData(res.data),
      error: (err) => console.error(err),
    });
  };

  /* ---------- Manual table ---------- */
  const emptyRow = { recruiter: '', position: '', firm: '', email: '' };
  const [rows, setRows] = useState([{ ...emptyRow, id: Date.now() }]);

  const handleChange = (id, field, value) =>
    setRows((r) => r.map((row) => (row.id === id ? { ...row, [field]: value } : row)));

  const addRow = () => setRows((r) => [...r, { ...emptyRow, id: Date.now() }]);

  const removeRow = (id) =>
    setRows((r) => r.filter((row) => row.id !== id));

  const saveManual = () => {
    onData(rows.filter((r) => r.recruiter && r.email)); // only valid rows
    setRows([{ ...emptyRow, id: Date.now() }]); // reset
  };

  return (
    <div className="space-y-6">
      {/* Toggle */}
      <div className="flex items-center space-x-4 text-sm font-medium">
        <button
          onClick={() => setMode('csv')}
          className={`px-3 py-1 rounded ${mode === 'csv' ? 'bg-blue-100 text-blue-700' : 'text-gray-500'}`}
        >
          📁 Importer CSV
        </button>
        <button
          onClick={() => setMode('manual')}
          className={`px-3 py-1 rounded ${mode === 'manual' ? 'bg-blue-100 text-blue-700' : 'text-gray-500'}`}
        >
          ✏️ Créer manuellement
        </button>
      </div>

      {/* CSV */}
      {mode === 'csv' && (
        <label className="block w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-center cursor-pointer hover:border-blue-400">
          <input type="file" accept=".csv" onChange={handleFile} className="hidden" />
          <span className="text-blue-600 font-medium">Choisis un fichier CSV</span>
        </label>
      )}

      {/* Manual table */}
      {mode === 'manual' && (
        <>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2">Recruteur</th>
                  <th className="px-3 py-2">Poste</th>
                  <th className="px-3 py-2">Entreprise</th>
                  <th className="px-3 py-2">Email</th>
                  <th className="px-3 py-2"></th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id} className="border-t">
                    <td className="p-2">
                      <input
                        type="text"
                        value={row.recruiter}
                        onChange={(e) => handleChange(row.id, 'recruiter', e.target.value)}
                        className="w-full px-2 py-1 border rounded"
                        placeholder="Nom"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="text"
                        value={row.position}
                        onChange={(e) => handleChange(row.id, 'position', e.target.value)}
                        className="w-full px-2 py-1 border rounded"
                        placeholder="Poste"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="text"
                        value={row.firm}
                        onChange={(e) => handleChange(row.id, 'firm', e.target.value)}
                        className="w-full px-2 py-1 border rounded"
                        placeholder="Entreprise"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="email"
                        value={row.email}
                        onChange={(e) => handleChange(row.id, 'email', e.target.value)}
                        className="w-full px-2 py-1 border rounded"
                        placeholder="Email"
                      />
                    </td>
                    <td className="p-2">
                      <button
                        onClick={() => removeRow(row.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={addRow}
              className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded"
            >
              + Ajouter une ligne
            </button>
            <button
              onClick={saveManual}
              className="text-sm bg-blue-600 text-white px-4 py-1 rounded shadow hover:bg-blue-700"
            >
              Enregistrer
            </button>
          </div>
        </>
      )}
    </div>
  );
}