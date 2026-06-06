import { useState, useEffect } from 'react';
import { Server, AlertCircle, Search, LogOut } from 'lucide-react';
import { useAuth } from './App.jsx';
import { useNavigate } from 'react-router-dom';
import GuildCard from './GuildCard.jsx';

export default function DashboardPage() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [guilds, setGuilds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/guilds`, { credentials: 'include' })
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) setGuilds(data);
        else setError(data.error ?? 'Failed to load servers');
      })
      .catch(() => setError('Network error'))
      .finally(() => setLoading(false));
  }, []);

  async function handleLogout() {
    await logout();
    navigate('/');
  }

  const filtered = guilds.filter(g => g.name.toLowerCase().includes(query.toLowerCase()));

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
    <div className="selection-container" style={{ position: 'relative' }}>
      {/* Logout button */}
      <button 
        className="btn btn-secondary" 
        onClick={handleLogout} 
        style={{ 
          position: 'absolute', 
          top: '-20px', 
          right: '24px', 
          padding: '8px 16px', 
          fontSize: '13px', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}
      >
        <LogOut size={14} /> Sign out
      </button>

      {/* Header */}
      <div className="selection-header">
        <h1>Select Server</h1>
        <p>Choose which Discord server you want to manage giveaways for</p>
      </div>

      {error ? (
        <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', maxWidth: '500px', margin: '0 auto' }}>
          <div className="stat-icon-wrapper stat-icon-warning" style={{ margin: '0 auto 16px auto', width: '48px', height: '48px' }}>
            <AlertCircle size={24} />
          </div>
          <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>Failed to Load</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '24px' }}>{error}</p>
          <button className="btn btn-secondary" onClick={() => window.location.reload()}>
            Retry
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
        <>
          {/* Search bar */}
          {guilds.length > 4 && (
            <div style={{ maxWidth: '320px', margin: '0 auto 32px auto', position: 'relative' }}>
              <Search size={14} style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search servers..."
                className="form-input"
                style={{ paddingLeft: '36px' }}
              />
            </div>
          )}

          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <p style={{ color: 'var(--text-secondary)' }}>No servers match "{query}"</p>
            </div>
          ) : (
            <div className="guild-grid">
              {filtered.map((guild) => (
                <GuildCard key={guild.id} guild={guild} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
