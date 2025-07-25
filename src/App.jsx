import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AuthCallback from './pages/AuthCallback';
import Navbar from './components/Navbar';
import AuthGate from './components/AuthGate';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Account from './pages/Account';
import TemplatesPage from './pages/TemplatesPage';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Footer from './components/Footer';
function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <AuthGate>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/account" element={<Account />} />
          <Route path="/templates" element={<TemplatesPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        <Footer />
      </AuthGate>
    </AuthProvider>
  );
}
