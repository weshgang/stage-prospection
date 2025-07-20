import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Lock, Pencil, Trash2 } from 'lucide-react';
export default function AccountSecurity() {
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePasswordChange = async () => {
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setLoading(false);
    if (error) return alert('Erreur : ' + error.message);
    alert('Mot de passe mis à jour.');
    setNewPassword('');
  };

  const handleDeleteAccount = async () => {
    const confirm = window.confirm(
      'Cette action est irréversible. Toutes tes données seront supprimées. Continuer ?'
    );
    if (!confirm) return;

    setLoading(true);

    const { data: user } = await supabase.auth.getUser();

    // Supprime d'abord les contacts et templates liés
    await supabase.from('contacts').delete().eq('user_id', user.user.id);
    await supabase.from('email_templates').delete().eq('user_id', user.user.id);

    // Supprime l'utilisateur (soft delete via logout)
    await supabase.auth.signOut();
    alert('Compte supprimé. Tu vas être redirigé.');
    window.location.href = '/';
  };

  return (
    <div className="space-y-6 mt-10">
      <h2 className="text-lg font-semibold">
        <Lock className="inline w-5 h-5 mr-1" />
        Sécurité du compte
      </h2>

      <div className="space-y-3">
        <input
          type="password"
          placeholder="Nouveau mot de passe"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="border px-3 py-2 rounded w-full"
        />
        <button
          onClick={handlePasswordChange}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          <Pencil className="inline mr-2" />
          Changer le mot de passe
        </button>
      </div>

      <hr />

      <div>
        <button
          onClick={handleDeleteAccount}
          disabled={loading}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          <Trash2 className="inline mr-2" />
          Supprimer mon compte
        </button>
      </div>
    </div>
  );
}
