// src/components/UploadCSV.jsx
import { useRef } from 'react';
import Papa from 'papaparse';

export default function UploadCSV({ onData }) {
  const inputRef = useRef(null);

  const handleFile = (file) => {
    if (!file) return;
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        // 1 seul setState côté parent ➜ pas de boucle
        onData(results.data);
        // reset input pour pouvoir ré-uploader le même fichier si besoin
        inputRef.current.value = '';
      },
      error: (err) => console.error('[UploadCSV] Parse error:', err),
    });
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <label className="block mb-2 font-semibold">Importer un CSV</label>
      <input
        type="file"
        accept=".csv"
        ref={inputRef}
        onChange={(e) => handleFile(e.target.files[0])}
        className="block w-full text-sm"
      />
    </div>
  );
}
