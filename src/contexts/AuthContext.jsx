import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext();

// 🔐 Fonction pour récupérer access_token et email
const getGmailAccessToken = async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return {
    accessToken: session?.provider_token,
    email: session?.user?.email,
  };
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // ✅ Corrigé : ajout du listener en temps réel
    const { data: subscription } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription?.subscription?.unsubscribe(); // proprement nettoyé
    };
  }, []);

  return <AuthContext.Provider value={{ user, loading }}>{children}</AuthContext.Provider>;
}

export { getGmailAccessToken };
export const useAuth = () => useContext(AuthContext);
