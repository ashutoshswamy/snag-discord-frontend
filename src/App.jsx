import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useState, useEffect, createContext, useContext } from 'react';
import Landing from './Landing.jsx';
import DashboardPage from './DashboardPage.jsx';
import GuildPage from './GuildPage.jsx';
import Commands from './Commands.jsx';
import PrivacyPolicy from './PrivacyPolicy.jsx';
import TermsOfService from './TermsOfService.jsx';
import Status from './Status.jsx';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

function AuthProvider({ children }) {
  const [user, setUser] = useState(undefined); // undefined = loading

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/auth/me`, { credentials: 'include' })
      .then(r => r.ok ? r.json() : null)
      .then(data => setUser(data))
      .catch(() => setUser(null));
  }, []);

  const logout = async () => {
    await fetch(`${import.meta.env.VITE_API_URL}/auth/logout`, { method: 'POST', credentials: 'include' });
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  if (user === undefined) {
    return (
      <div className="connect-screen">
        <div className="connect-card">
          <div className="connect-logo-wrap">
            <img src="/Logo.png" alt="Snag" className="connect-logo" />
            <div className="connect-spinner-ring" />
          </div>
          <div className="connect-brand">Snag Bot</div>
          <div className="connect-headline">Loading<br /><span>Dashboard</span></div>
          <div className="connect-status">
            <div className="connect-status-dot" />
            Authenticating your session<span className="connect-dots" />
          </div>
          <div className="connect-progress">
            <div className="connect-progress-bar" />
          </div>
        </div>
      </div>
    );
  }
  if (!user) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/commands" element={<Commands />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/status" element={<Status />} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/dashboard/:guildId" element={<ProtectedRoute><GuildPage /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}
