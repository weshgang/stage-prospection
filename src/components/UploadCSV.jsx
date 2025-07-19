import { useRef, useState } from 'react';
import Papa from 'papaparse';

export default function UploadCSV({ onData }) {
  const inputRef = useRef(null);
  const [fileName, setFileName] = useState('');

  const handleFile = (file) => {
    if (!file) return;
    setFileName(file.name);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        onData(results.data);
        inputRef.current.value = '';
        setFileName('');
      },
      error: (err) => console.error('[UploadCSV] Parse error:', err),
    });
  };

  return (
    <div className="flex flex-col gap-3">
      <label className="text-sm font-medium text-gray-700">Importer un fichier CSV</label>

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => inputRef.current.click()}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded shadow"
        >
          📂 Choisir un fichier
        </button>

        <span className="text-sm text-gray-600">
          {fileName ? `Fichier sélectionné : ${fileName}` : 'Aucun fichier sélectionné'}
        </span>
      </div>

      <input
        type="file"
        accept=".csv"
        ref={inputRef}
        onChange={(e) => handleFile(e.target.files[0])}
        className="hidden"
      />
    </div>
  );
}
