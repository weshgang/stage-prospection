import { useAuth } from '../contexts/AuthContext';

export default function AuthGate({ children }) {
  const { loading } = useAuth();
  if (loading) return <div className="text-center p-8">Chargement...</div>; // ou spinner
  return children;
}
