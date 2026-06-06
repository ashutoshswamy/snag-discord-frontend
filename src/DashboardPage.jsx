import { useState, useEffect, useCallback } from 'react';
import { Server, AlertCircle, LogOut, RefreshCw } from 'lucide-react';
import { useAuth } from './App.jsx';
import { useNavigate } from 'react-router-dom';
import GuildCard from './GuildCard.jsx';

export default function DashboardPage() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [guilds, setGuilds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [autoRefreshSecs, setAutoRefreshSecs] = useState(30);

  const fetchGuilds = useCallback(() => {
    setLoading(true);
    setError(null);
    fetch(`${import.meta.env.VITE_API_URL}/guilds`, { credentials: 'include' })
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) setGuilds(data);
        else setError(data.error ?? 'Failed to load servers');
      })
      .catch(() => setError('Network error'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchGuilds(); }, [fetchGuilds]);

  useEffect(() => {
    setAutoRefreshSecs(30);
    const countdown = setInterval(() => {
      setAutoRefreshSecs(s => (s <= 1 ? 30 : s - 1));
    }, 1000);
    const refresh = setInterval(() => { fetchGuilds(); }, 30000);
    return () => { clearInterval(countdown); clearInterval(refresh); };
  }, [fetchGuilds]);

  async function handleLogout() {
    await logout();
    navigate('/');
  }

  if (loading) {
    return (
      <div className="selection-container" style={{ minHeight: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
        <div className="animate-spin"
          style={{ width: '32px', height: '32px', borderRadius: '50%', border: '2.5px solid rgba(255,255,255,0.05)', borderTopColor: 'var(--primary)' }} />
        <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', fontWeight: 500 }}>Loading servers…</p>
      </div>
    );
  }

  return (
    <div className="selection-container">
      {/* Header */}
      <div className="selection-header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1>Select Server</h1>
          <p>Choose which Discord server you want to manage giveaways for</p>
        </div>
        <button className="btn btn-secondary" onClick={() => { fetchGuilds(); setAutoRefreshSecs(30); }} disabled={loading} style={{ flexShrink: 0 }}>
          <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
          {loading ? 'Loading…' : `${autoRefreshSecs}s`}
        </button>
      </div>

      {error ? (
        <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', maxWidth: '500px', margin: '0 auto' }}>
          <div className="stat-icon-wrapper stat-icon-warning" style={{ margin: '0 auto 16px auto', width: '48px', height: '48px' }}>
            <AlertCircle size={24} />
          </div>
          <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>Failed to Load</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '24px' }}>{error}</p>
          <button className="btn btn-secondary" onClick={() => { fetchGuilds(); setAutoRefreshSecs(30); }}>
            <RefreshCw size={13} /> Retry
          </button>
        </div>
      ) : guilds.length === 0 ? (
        <div className="glass-panel" style={{ padding: '48px 24px', textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
          <div className="stat-icon-wrapper stat-icon-primary" style={{ margin: '0 auto 20px auto', width: '56px', height: '56px' }}>
            <Server size={28} />
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '10px' }}>No Servers Found</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14.5px', lineHeight: 1.6, maxWidth: '400px', margin: '0 auto' }}>
            You need <strong style={{ color: 'var(--text-primary)' }}>Manage Server</strong> permission in a server that has Snag added.
          </p>
        </div>
      ) : (
        <div className="guild-grid">
          {guilds.map((guild) => (
            <GuildCard key={guild.id} guild={guild} />
          ))}
        </div>
      )}

      <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'center' }}>
        <button className="btn btn-secondary" onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <LogOut size={14} /> Sign out
        </button>
      </div>
    </div>
  );
}
