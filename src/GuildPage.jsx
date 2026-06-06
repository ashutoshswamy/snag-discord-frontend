import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from './App.jsx';
import { 
  Plus, Trophy, Clock, Inbox, Loader2, CheckCircle, AlertCircle, 
  LayoutDashboard, LogOut, ChevronDown, Menu, Home, RefreshCw, Server,
  BarChart3, Settings, Zap, ArrowRight, Shield, Award, Users, Trash2, Edit3,
  BookOpen, Gift, Hash
} from 'lucide-react';
import GiveawayCard from './GiveawayCard.jsx';
import './Commands.css';

function Toast({ toast }) {
  if (!toast) return null;
  const isError = toast.type === 'error';
  return (
    <div className="fixed top-20 right-6 z-50 flex items-center gap-3 px-4 py-3 text-sm font-semibold shadow-2xl anim-fade-up max-w-sm"
      style={{
        background: isError ? 'rgba(255,23,68,0.1)' : 'rgba(0,230,118,0.1)',
        border: `1px solid ${isError ? 'rgba(255,23,68,0.3)' : 'rgba(0,230,118,0.25)'}`,
        borderRadius: '12px',
        color: isError ? 'var(--danger)' : 'var(--success)',
        backdropFilter: 'blur(20px)',
      }}>
      {isError ? <AlertCircle size={15} /> : <CheckCircle size={15} />}
      {toast.msg}
    </div>
  );
}

export default function GuildPage() {
  const { guildId } = useParams();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [guild, setGuild] = useState(null);
  const [guilds, setGuilds] = useState([]);
  const [giveaways, setGiveaways] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [autoRefreshSecs, setAutoRefreshSecs] = useState(30);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showGuildDropdown, setShowGuildDropdown] = useState(false);
  const [toast, setToast] = useState(null);

  // Channels state
  const [channels, setChannels] = useState([]);
  const [channelsLoading, setChannelsLoading] = useState(true);
  const [channelsError, setChannelsError] = useState(null);

  // Roles state
  const [roles, setRoles] = useState([]);
  const [rolesLoading, setRolesLoading] = useState(true);
  const [rolesError, setRolesError] = useState(null);

  // Launch Giveaway form state
  const [giveawayForm, setGiveawayForm] = useState({
    channelId: '',
    prize: '',
    duration: '1h',
    winners: 1,
  });
  const [giveawaySubmitting, setGiveawaySubmitting] = useState(false);
  const [giveawayError, setGiveawayError] = useState(null);

  // Launch Drop form state
  const [dropForm, setDropForm] = useState({
    channelId: '',
    prize: '',
  });
  const [dropSubmitting, setDropSubmitting] = useState(false);
  const [dropError, setDropError] = useState(null);

  // Tabs layout
  const [activeSidebarTab, setActiveSidebarTab] = useState('overview'); // overview, giveaways, drops, analytics, settings
  const [activeSubTab, setActiveSubTab] = useState('active'); // active, history

  // Reset server state
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetConfirmText, setResetConfirmText] = useState('');
  const [resetLoading, setResetLoading] = useState(false);

  // Mock settings state
  const [settingsForm, setSettingsForm] = useState({
    managerRole: '@Giveaway Manager',
    logsChannel: '#giveaways',
    embedColor: '#8b5cf6',
    telemetry: true,
  });

  const showToast = useCallback((msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  }, []);

  const fetchData = useCallback(() => {
    setRefreshing(true);
    setChannelsLoading(true);
    setRolesLoading(true);
    Promise.all([
      fetch(`${import.meta.env.VITE_API_URL}/guilds`, { credentials: 'include' }).then(r => r.json()),
      fetch(`${import.meta.env.VITE_API_URL}/giveaways?guildId=${guildId}`, { credentials: 'include' }).then(r => r.json()),
      fetch(`${import.meta.env.VITE_API_URL}/channels/${guildId}`, { credentials: 'include' }).then(r => r.json()),
      fetch(`${import.meta.env.VITE_API_URL}/settings/${guildId}`, { credentials: 'include' }).then(r => r.json()),
      fetch(`${import.meta.env.VITE_API_URL}/roles/${guildId}`, { credentials: 'include' }).then(r => r.json()),
    ]).then(([guildsData, giveawaysData, channelsData, settingsData, rolesData]) => {
      if (!Array.isArray(guildsData)) { navigate('/dashboard'); return; }
      setGuilds(guildsData);
      const found = guildsData.find(g => g.id === guildId);
      if (!found) { navigate('/dashboard'); return; }
      setGuild(found);
      if (Array.isArray(giveawaysData)) setGiveaways(giveawaysData);
      if (Array.isArray(channelsData)) {
        setChannels(channelsData);
        setChannelsError(null);
      } else {
        setChannelsError(channelsData.error ?? 'Failed to load channels');
      }
      if (Array.isArray(rolesData)) {
        setRoles(rolesData);
        setRolesError(null);
      } else {
        setRolesError(rolesData.error ?? 'Failed to load roles');
      }
      if (settingsData && !settingsData.error) {
        setSettingsForm(settingsData);
      }
    }).catch(() => navigate('/dashboard'))
      .finally(() => {
        setLoading(false);
        setRefreshing(false);
        setChannelsLoading(false);
        setRolesLoading(false);
      });
  }, [guildId, navigate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    setAutoRefreshSecs(30);
    const countdown = setInterval(() => {
      setAutoRefreshSecs(s => (s <= 1 ? 30 : s - 1));
    }, 1000);
    const refresh = setInterval(() => { fetchData(); }, 30000);
    return () => { clearInterval(countdown); clearInterval(refresh); };
  }, [guildId, fetchData]);

  // Pre-select first channel
  useEffect(() => {
    if (channels.length > 0) {
      setGiveawayForm(f => f.channelId ? f : { ...f, channelId: channels[0].id });
      setDropForm(f => f.channelId ? f : { ...f, channelId: channels[0].id });
    }
  }, [channels]);

  async function handleLogout() {
    await logout();
    navigate('/');
  }

  async function handleEnd(messageId) {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/giveaways/${messageId}`, { method: 'DELETE', credentials: 'include' });
    const data = await res.json();
    if (res.ok) {
      setGiveaways(prev => prev.map(g =>
        g.message_id === messageId
          ? { ...g, ended: true, winner_ids: data.winnerIds ?? [] }
          : g
      ));
      showToast(data.winnerMentions?.length
        ? `Ended · ${data.winnerMentions.join(', ')}`
        : 'Giveaway ended with no entries.');
    } else {
      showToast(data.error ?? 'Failed to end giveaway.', 'error');
    }
  }

  async function handleReroll(messageId) {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/giveaways/${messageId}`, { method: 'PATCH', credentials: 'include' });
    const data = await res.json();
    if (res.ok) {
      showToast(data.winnerMentions?.length
        ? `New winner: ${data.winnerMentions.join(', ')}`
        : 'No entries to reroll from.');
    } else {
      showToast(data.error ?? 'Failed to reroll.', 'error');
    }
  }

  async function handleLaunchGiveaway(e) {
    e.preventDefault();
    setGiveawaySubmitting(true);
    setGiveawayError(null);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/giveaways`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ ...giveawayForm, guildId, type: 'giveaway' }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Failed to create giveaway');
      setGiveaways(prev => [data, ...prev]);
      showToast('Giveaway launched successfully!');
      setGiveawayForm(f => ({ ...f, prize: '', duration: '1h', winners: 1 }));
    } catch (err) {
      setGiveawayError(err.message);
      showToast(err.message, 'error');
    } finally {
      setGiveawaySubmitting(false);
    }
  }

  async function handleLaunchDrop(e) {
    e.preventDefault();
    setDropSubmitting(true);
    setDropError(null);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/giveaways`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ ...dropForm, guildId, type: 'drop' }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Failed to create drop');
      setGiveaways(prev => [data, ...prev]);
      showToast('Instant drop launched successfully!');
      setDropForm(f => ({ ...f, prize: '' }));
    } catch (err) {
      setDropError(err.message);
      showToast(err.message, 'error');
    } finally {
      setDropSubmitting(false);
    }
  }

  const selectGuild = (id) => {
    setShowGuildDropdown(false);
    setLoading(true);
    navigate(`/dashboard/${id}`);
  };

  const resetServer = async () => {
    setResetLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/reset/${guildId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Reset failed');
      setShowResetModal(false);
      setResetConfirmText('');
      setGiveaways([]);
      showToast('Server data has been reset.');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setResetLoading(false);
    }
  };

  const saveSettings = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/settings/${guildId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(settingsForm),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? 'Failed to save settings');
      }
      showToast('Configuration saved successfully!');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  // Filtration logic
  const allActive = giveaways.filter(g => !g.ended);
  const allHistory = giveaways.filter(g => g.ended);
  const totalEntries = giveaways.reduce((s, g) => s + (g.entryCount || 0), 0);

  const filterGiveaways = (ended) => giveaways.filter(g => !g.is_drop && g.ended === ended);
  const filterDrops = (ended) => giveaways.filter(g => g.is_drop && g.ended === ended);

  const activeGiveaways = filterGiveaways(false);
  const historyGiveaways = filterGiveaways(true);
  
  const activeDrops = filterDrops(false);
  const historyDrops = filterDrops(true);

  if (loading) {
    return (
      <div className="app-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px', background: 'var(--bg-dark)', width: '100vw' }}>
        <div className="animate-spin"
          style={{ width: '32px', height: '32px', borderRadius: '50%', border: '2.5px solid rgba(255,255,255,0.05)', borderTopColor: 'var(--primary)' }} />
        <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', fontWeight: 500 }}>Loading workspace…</p>
      </div>
    );
  }

  return (
    <div className="app-container">
      <Toast toast={toast} />

      {/* Mobile sidebar backdrop */}
      {sidebarOpen && <div className="sidebar-backdrop" onClick={() => setSidebarOpen(false)} />}

      {/* SIDEBAR */}
      <aside className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
        {/* Brand */}
        <div className="sidebar-header">
          <img src="/Logo.png" alt="Snag" className="sidebar-header-logo" />
          <div className="sidebar-logo">
            SNAG
          </div>
        </div>

        {/* Server switcher dropdown */}
        <div className="guild-selector-container">
          <div className="guild-dropdown-btn" onClick={() => setShowGuildDropdown(!showGuildDropdown)}>
            <div className="guild-info-inline">
              {guild?.iconUrl ? (
                <img className="guild-icon-sm" src={guild.iconUrl} alt={guild.name} />
              ) : (
                <div className="guild-icon-sm">{guild?.name?.[0]?.toUpperCase()}</div>
              )}
              <span className="guild-name-sm">{guild?.name}</span>
            </div>
            <ChevronDown size={13} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
          </div>

          {showGuildDropdown && (
            <div style={{ 
              position: 'absolute', 
              top: 'calc(100% + 4px)', 
              left: '12px', 
              right: '12px', 
              zIndex: 50, 
              background: 'rgba(7,4,18,0.98)', 
              border: '1px solid var(--border-hover)', 
              borderRadius: '8px', 
              overflow: 'hidden', 
              backdropFilter: 'blur(20px)', 
              boxShadow: '0 8px 32px rgba(0,0,0,0.5)' 
            }}>
              {guilds.filter(g => g.id !== guildId).map(g => (
                <div key={g.id} className="nav-item" onClick={() => selectGuild(g.id)} style={{ borderRadius: 0, padding: '9px 12px', borderBottom: '1px solid var(--border)' }}>
                  {g.iconUrl ? <img className="guild-icon-sm" src={g.iconUrl} alt={g.name} /> : <div className="guild-icon-sm">{g.name.charAt(0)}</div>}
                  <span className="guild-name-sm">{g.name}</span>
                </div>
              ))}
              <div className="nav-item" onClick={() => navigate('/dashboard')} style={{ borderRadius: 0, padding: '9px 12px', color: 'var(--primary-hover)', justifyContent: 'center', fontSize: '12px' }}>
                <Server size={13} /> All Servers
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          <div className="sidebar-nav-group">MANAGEMENT</div>
          <button className={`nav-item ${activeSidebarTab === 'overview' ? 'active' : ''}`} onClick={() => { setActiveSidebarTab('overview'); setSidebarOpen(false); }}>
            <LayoutDashboard size={15} /> Overview
          </button>
          <button className={`nav-item ${activeSidebarTab === 'giveaways' ? 'active' : ''}`} onClick={() => { setActiveSidebarTab('giveaways'); setSidebarOpen(false); }}>
            <Trophy size={15} /> Giveaways
          </button>
          <button className={`nav-item ${activeSidebarTab === 'drops' ? 'active' : ''}`} onClick={() => { setActiveSidebarTab('drops'); setSidebarOpen(false); }}>
            <Zap size={15} /> Instant Drops
          </button>
          <button className={`nav-item ${activeSidebarTab === 'analytics' ? 'active' : ''}`} onClick={() => { setActiveSidebarTab('analytics'); setSidebarOpen(false); }}>
            <BarChart3 size={15} /> Analytics
          </button>
          <button className={`nav-item ${activeSidebarTab === 'settings' ? 'active' : ''}`} onClick={() => { setActiveSidebarTab('settings'); setSidebarOpen(false); }}>
            <Settings size={15} /> Settings
          </button>
        </nav>

        {/* Sidebar Footer */}
        <div className="sidebar-footer">
          <div className="sf-nav-links">
            <button className="sf-icon-btn" onClick={() => navigate('/')} title="Home">
              <Home size={13} /> Home
            </button>
            <button className="sf-icon-btn" onClick={() => navigate('/commands')} title="Commands">
              <BookOpen size={13} /> Commands
            </button>
          </div>
          <div className="sf-user">
            {user?.avatar ? (
              <img className="user-avatar-sm" src={user.avatar} alt={user.name} />
            ) : (
              <div className="user-avatar-sm" style={{ background: 'var(--primary-dim)', display: 'flex', alignItems: 'center', justify: 'center', fontWeight: 700, fontSize: '11px', color: 'var(--primary-hover)' }}>
                {(user?.globalName ?? user?.name)?.charAt(0).toUpperCase()}
              </div>
            )}
            <span className="user-username-sm">{user?.globalName ?? user?.name}</span>
            <button className="logout-btn" onClick={handleLogout} title="Logout">
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="main-wrapper">
        <header className="main-header">
          <button className="hamburger-btn" onClick={() => setSidebarOpen(s => !s)} aria-label="Toggle menu">
            <Menu size={20} />
          </button>
          <div className="header-title-container">
            <div className="header-tab-accent" style={{ background: activeSidebarTab === 'drops' ? 'var(--warning)' : 'var(--primary)' }} />
            <h1>
              {activeSidebarTab === 'overview' && 'Giveaways Overview'}
              {activeSidebarTab === 'giveaways' && 'Timed Giveaways'}
              {activeSidebarTab === 'drops' && 'Instant Drops'}
              {activeSidebarTab === 'analytics' && 'Draw Analytics'}
              {activeSidebarTab === 'settings' && 'Bot Configuration'}
            </h1>
          </div>
          <div className="header-actions">
            <button className="btn btn-secondary" onClick={() => { fetchData(); setAutoRefreshSecs(30); }} disabled={refreshing}>
              <RefreshCw size={13} className={refreshing ? 'animate-spin' : ''} />
              {refreshing ? 'Refreshing…' : `${autoRefreshSecs}s`}
            </button>
          </div>
        </header>

        <div className="content-pane">
          {/* ── OVERVIEW TAB ── */}
          {activeSidebarTab === 'overview' && (
            <div className="flex flex-col gap-6">
              {/* Stats Row */}
              <div className="stats-row">
                <div className="stat-card glass-panel glow-panel-primary">
                  <div className="stat-icon-wrapper stat-icon-primary"><Trophy size={20} /></div>
                  <div className="stat-info">
                    <h3>Active Giveaways</h3>
                    <div className="stat-value">{activeGiveaways.length}</div>
                  </div>
                </div>
                <div className="stat-card glass-panel glow-panel-warning">
                  <div className="stat-icon-wrapper stat-icon-warning"><Zap size={20} /></div>
                  <div className="stat-info">
                    <h3>Active Drops</h3>
                    <div className="stat-value">{activeDrops.length}</div>
                  </div>
                </div>
                <div className="stat-card glass-panel glow-panel-success">
                  <div className="stat-icon-wrapper stat-icon-success"><Users size={20} /></div>
                  <div className="stat-info">
                    <h3>Total Entries</h3>
                    <div className="stat-value">{totalEntries}</div>
                  </div>
                </div>
              </div>

              {/* Welcome Card */}
              <div className="glass-panel p-8 relative overflow-hidden" style={{ borderRadius: '16px' }}>
                <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 80% 0%, var(--primary-glow) 0%, transparent 65%)' }} />
                <div className="relative z-10 max-w-2xl">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded bg-purple-500/10 text-[var(--primary-light)] border border-purple-500/20">
                      CONSOLE PANEL
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-xs text-white/40">Snag Manager Active</span>
                  </div>
                  <h2 className="text-2xl font-black mb-3" style={{ color: 'var(--text-primary)' }}>
                    Manage Server Drawings
                  </h2>
                  <p className="text-sm font-light leading-relaxed mb-6" style={{ color: 'var(--text-secondary)' }}>
                    Welcome to the SNAG Server Panel! Here you can create and manage giveaways and instant drop drawings for your community. Switch between sidebar tabs to view drawing logs, telemetry charts, or settings.
                  </p>
                </div>
              </div>

              {/* Recent active grids */}
              <div>
                <h2 className="text-base font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Recent Active Draw Events</h2>
                {allActive.length === 0 ? (
                  <div className="glass-panel p-8 text-center flex flex-col items-center gap-3">
                    <Inbox size={24} style={{ color: 'var(--text-muted)' }} />
                    <p style={{ color: 'var(--text-secondary)' }}>No active drawings currently running in this server.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {allActive.slice(0, 3).map((g, i) => (
                      <GiveawayCard key={g.message_id} giveaway={g} onEnd={handleEnd} onReroll={handleReroll} index={i} />
                    ))}
                  </div>
                )}
              </div>

              {/* Recent history grids */}
              <div>
                <h2 className="text-base font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Recent Completed Events</h2>
                {allHistory.length === 0 ? (
                  <div className="glass-panel p-8 text-center flex flex-col items-center gap-3">
                    <Inbox size={24} style={{ color: 'var(--text-muted)' }} />
                    <p style={{ color: 'var(--text-secondary)' }}>No ended drawings found in this server.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {allHistory.slice(0, 3).map((g, i) => (
                      <GiveawayCard key={g.message_id} giveaway={g} onEnd={handleEnd} onReroll={handleReroll} index={i} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── GIVEAWAYS TAB ── */}
          {activeSidebarTab === 'giveaways' && (
            <div className="flex flex-col gap-6">
              <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: '24px', alignItems: 'start' }}>
                {/* Active Giveaways list */}
                <div className="glass-panel p-6">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Active Giveaways</h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/10 text-[var(--primary-light)] border border-purple-500/20">
                      {activeGiveaways.length} RUNNING
                    </span>
                  </div>
                  {activeGiveaways.length === 0 ? (
                    <div className="text-center py-12 flex flex-col items-center gap-3">
                      <Inbox size={32} style={{ color: 'var(--text-muted)', opacity: 0.5 }} />
                      <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>No active giveaways running. Launch one on the right!</p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-4">
                      {activeGiveaways.map((g, i) => (
                        <GiveawayCard key={g.message_id} giveaway={g} onEnd={handleEnd} onReroll={handleReroll} index={i} />
                      ))}
                    </div>
                  )}
                </div>

                {/* Launch Giveaway Form */}
                <div className="glass-panel p-6">
                  <h3 className="text-sm font-bold mb-4" style={{ color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Gift size={16} color="var(--primary-hover)" /> Launch Giveaway
                  </h3>
                  <form onSubmit={handleLaunchGiveaway} className="flex flex-col gap-4">
                    <div className="form-group">
                      <label className="flex items-center gap-1.5 mb-1.5 text-xs font-semibold text-white/80">
                        <Hash size={11} /> Discord Channel
                      </label>
                      {channelsLoading ? (
                        <div className="form-input flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
                          <Loader2 size={12} className="animate-spin" /> Loading channels…
                        </div>
                      ) : channelsError ? (
                        <div className="form-input text-xs text-red-400 border-red-500/20 bg-red-500/5">{channelsError}</div>
                      ) : (
                        <div className="relative">
                          <select
                            value={giveawayForm.channelId}
                            onChange={e => setGiveawayForm(prev => ({ ...prev, channelId: e.target.value }))}
                            className="form-select"
                            required
                          >
                            <option value="">Select a channel…</option>
                            {channels.map(c => (
                              <option key={c.id} value={c.id}>#{c.name}</option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>

                    <div className="form-group">
                      <label className="flex items-center gap-1.5 mb-1.5 text-xs font-semibold text-white/80">
                        <Gift size={11} /> Prize
                      </label>
                      <input
                        type="text"
                        value={giveawayForm.prize}
                        onChange={e => setGiveawayForm(prev => ({ ...prev, prize: e.target.value }))}
                        className="form-input"
                        placeholder="e.g. Discord Nitro, $10 Steam Key"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="form-group">
                        <label className="flex items-center gap-1.5 mb-1.5 text-xs font-semibold text-white/80">
                          <Clock size={11} /> Duration
                        </label>
                        <input
                          type="text"
                          value={giveawayForm.duration}
                          onChange={e => setGiveawayForm(prev => ({ ...prev, duration: e.target.value }))}
                          className="form-input"
                          placeholder="e.g. 1h, 30m, 2d"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label className="flex items-center gap-1.5 mb-1.5 text-xs font-semibold text-white/80">
                          <Users size={11} /> Winners
                        </label>
                        <input
                          type="number"
                          value={giveawayForm.winners}
                          onChange={e => setGiveawayForm(prev => ({ ...prev, winners: Math.max(1, parseInt(e.target.value) || 1) }))}
                          className="form-input"
                          min={1} max={20}
                          required
                        />
                      </div>
                    </div>

                    {giveawayError && (
                      <div className="form-input text-xs text-red-400 border-red-500/20 bg-red-500/5">{giveawayError}</div>
                    )}

                    <button type="submit" disabled={giveawaySubmitting || channelsLoading} className="btn btn-primary w-full mt-2" style={{ boxShadow: '0 4px 16px var(--primary-glow)' }}>
                      {giveawaySubmitting ? <Loader2 size={13} className="animate-spin" /> : <Gift size={13} />} Launch Giveaway
                    </button>
                  </form>
                </div>
              </div>

              {/* History Row */}
              <div className="glass-panel p-6">
                <h3 className="text-sm font-bold mb-4" style={{ color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Trophy size={15} color="var(--primary-hover)" /> Past Giveaways
                </h3>
                {historyGiveaways.length === 0 ? (
                  <div className="text-center py-8">
                    <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Giveaway history is empty.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {historyGiveaways.map((g, i) => (
                      <GiveawayCard key={g.message_id} giveaway={g} onEnd={handleEnd} onReroll={handleReroll} index={i} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── INSTANT DROPS TAB ── */}
          {activeSidebarTab === 'drops' && (
            <div className="flex flex-col gap-6">
              <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: '24px', alignItems: 'start' }}>
                {/* Active Drops List */}
                <div className="glass-panel p-6">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Active Drops</h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                      {activeDrops.length} RUNNING
                    </span>
                  </div>
                  {activeDrops.length === 0 ? (
                    <div className="text-center py-12 flex flex-col items-center gap-3">
                      <Inbox size={32} style={{ color: 'var(--text-muted)', opacity: 0.5 }} />
                      <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>No active drops currently running. Launch one on the right!</p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-4">
                      {activeDrops.map((g, i) => (
                        <GiveawayCard key={g.message_id} giveaway={g} onEnd={handleEnd} onReroll={handleReroll} index={i} />
                      ))}
                    </div>
                  )}
                </div>

                {/* Launch Drop Form */}
                <div className="glass-panel p-6">
                  <h3 className="text-sm font-bold mb-4" style={{ color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Zap size={16} color="var(--warning)" /> Launch Instant Drop
                  </h3>
                  <form onSubmit={handleLaunchDrop} className="flex flex-col gap-4">
                    <div className="form-group">
                      <label className="flex items-center gap-1.5 mb-1.5 text-xs font-semibold text-white/80">
                        <Hash size={11} /> Discord Channel
                      </label>
                      {channelsLoading ? (
                        <div className="form-input flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
                          <Loader2 size={12} className="animate-spin" /> Loading channels…
                        </div>
                      ) : channelsError ? (
                        <div className="form-input text-xs text-red-400 border-red-500/20 bg-red-500/5">{channelsError}</div>
                      ) : (
                        <div className="relative">
                          <select
                            value={dropForm.channelId}
                            onChange={e => setDropForm(prev => ({ ...prev, channelId: e.target.value }))}
                            className="form-select"
                            required
                          >
                            <option value="">Select a channel…</option>
                            {channels.map(c => (
                              <option key={c.id} value={c.id}>#{c.name}</option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>

                    <div className="form-group">
                      <label className="flex items-center gap-1.5 mb-1.5 text-xs font-semibold text-white/80">
                        <Gift size={11} /> Prize
                      </label>
                      <input
                        type="text"
                        value={dropForm.prize}
                        onChange={e => setDropForm(prev => ({ ...prev, prize: e.target.value }))}
                        className="form-input"
                        placeholder="e.g. Steam Game Key, Spotify Premium"
                        required
                      />
                    </div>

                    {dropError && (
                      <div className="form-input text-xs text-red-400 border-red-500/20 bg-red-500/5">{dropError}</div>
                    )}

                    <button type="submit" disabled={dropSubmitting || channelsLoading} className="btn btn-primary w-full mt-2" style={{ background: 'var(--warning)', color: '#000', border: 'none', boxShadow: '0 4px 16px var(--warning-glow)' }} onMouseEnter={e => e.currentTarget.style.background = 'var(--warning)'} onMouseLeave={e => e.currentTarget.style.background = 'var(--warning)'}>
                      {dropSubmitting ? <Loader2 size={13} className="animate-spin" /> : <Zap size={13} />} Launch Drop
                    </button>
                  </form>
                </div>
              </div>

              {/* History Row */}
              <div className="glass-panel p-6">
                <h3 className="text-sm font-bold mb-4" style={{ color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Zap size={15} color="var(--warning)" /> Claimed Drops
                </h3>
                {historyDrops.length === 0 ? (
                  <div className="text-center py-8">
                    <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Drop history is empty.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {historyDrops.map((g, i) => (
                      <GiveawayCard key={g.message_id} giveaway={g} onEnd={handleEnd} onReroll={handleReroll} index={i} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── ANALYTICS TAB ── */}
          {/* ── ANALYTICS TAB ── */}
          {activeSidebarTab === 'analytics' && (() => {
            if (!settingsForm.telemetry) {
              return (
                <div className="glass-panel p-8 flex flex-col items-center justify-center text-center gap-4 my-6">
                  <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center animate-pulse" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
                    <BarChart3 size={32} style={{ color: 'var(--text-secondary)' }} />
                  </div>
                  <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Telemetry is Disabled</h3>
                  <p className="max-w-md text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    Enable **Telemetry Sharing** in the Settings tab to record drawing metrics and view real-time participation analytics for this server.
                  </p>
                </div>
              );
            }

            const totalGiveawaysCount = giveaways.filter(g => !g.is_drop).length;
            const totalDropsCount = giveaways.filter(g => g.is_drop).length;
            const totalCount = totalGiveawaysCount + totalDropsCount;
            const giveawaysPct = totalCount > 0 ? Math.round((totalGiveawaysCount / totalCount) * 100) : 0;
            const dropsPct = totalCount > 0 ? 100 - giveawaysPct : 0;

            const hourlyBuckets = [0, 0, 0, 0, 0, 0];
            giveaways.forEach(g => {
              if (!g.created_at) return;
              const hr = new Date(g.created_at).getHours();
              const idx = Math.min(5, Math.floor(hr / 4));
              hourlyBuckets[idx] += (g.entryCount || 0);
            });
            const maxBucket = Math.max(...hourlyBuckets, 1);
            const hasAnyEntries = hourlyBuckets.some(b => b > 0);
            const peakChartData = [
              { time: '12 AM', val: Math.round((hourlyBuckets[0] / maxBucket) * 100), color: 'var(--primary-dim)' },
              { time: '4 AM', val: Math.round((hourlyBuckets[1] / maxBucket) * 100), color: 'var(--primary-dim)' },
              { time: '8 AM', val: Math.round((hourlyBuckets[2] / maxBucket) * 100), color: 'var(--primary)' },
              { time: '12 PM', val: Math.round((hourlyBuckets[3] / maxBucket) * 100), color: 'var(--primary)' },
              { time: '4 PM', val: Math.round((hourlyBuckets[4] / maxBucket) * 100), color: 'var(--primary)' },
              { time: '8 PM', val: Math.round((hourlyBuckets[5] / maxBucket) * 100), color: 'var(--primary-hover)' },
            ];

            return (
              <div className="flex flex-col gap-6">
                {/* Telemetry charts panel */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="glass-panel p-6 flex flex-col gap-4 lg:col-span-2">
                    <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Hourly Entry Peaks</h3>

                    {!hasAnyEntries ? (
                      <div className="flex items-center justify-center h-[180px]">
                        <p className="text-xs italic" style={{ color: 'var(--text-muted)' }}>No entry data recorded yet.</p>
                      </div>
                    ) : (
                      /* Glowing pure CSS bar chart */
                      <div className="flex items-end justify-between h-[180px] pt-6 pb-2 px-4 border-b border-white/5">
                        {peakChartData.map(({ time, val, color }) => (
                          <div key={time} className="flex flex-col items-center gap-2 w-12 group">
                            <div className="w-full rounded-t-md transition-all duration-300 relative"
                              style={{
                                height: `${val * 1.3}px`,
                                background: `linear-gradient(0deg, var(--primary) 0%, ${color} 100%)`,
                                boxShadow: `0 0 16px ${color}33`,
                              }}
                            >
                              <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-black text-white opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 px-1.5 py-0.5 rounded">
                                {val}%
                              </div>
                            </div>
                            <span className="text-[10px] text-white/40">{time}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="glass-panel p-6 flex flex-col gap-4">
                    <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Participation Rate</h3>
                    {totalCount === 0 ? (
                      <div className="flex items-center justify-center h-full py-6">
                        <p className="text-xs italic" style={{ color: 'var(--text-muted)' }}>No giveaways recorded yet.</p>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-3 justify-center h-full">
                        {[
                          { label: 'Timed Giveaways', val: giveawaysPct, color: 'var(--primary)' },
                          { label: 'Instant Drops', val: dropsPct, color: 'var(--warning)' },
                        ].map(({ label, val, color }) => (
                          <div key={label} className="flex flex-col gap-1.5">
                            <div className="flex justify-between text-xs font-semibold">
                              <span style={{ color: 'var(--text-secondary)' }}>{label}</span>
                              <span style={{ color }}>{val}%</span>
                            </div>
                            <div className="w-full h-2 rounded bg-black/40 overflow-hidden">
                              <div className="h-full rounded" style={{ width: `${val}%`, background: color, boxShadow: `0 0 8px ${color}` }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Feed logs */}
                <div className="glass-panel p-6">
                  <h3 className="text-sm font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Real-time Event Logging</h3>
                  <div className="flex flex-col gap-2.5 max-h-[250px] overflow-y-auto pr-2">
                    {giveaways.length === 0 ? (
                      <p className="text-xs text-white/40 italic">No events logged yet.</p>
                    ) : (
                      giveaways.map((g, i) => (
                        <div key={g.message_id + i} className="flex items-center justify-between text-xs py-2 px-3 rounded bg-white/2 border border-white/5">
                          <div className="flex items-center gap-2.5">
                            <span className="w-1.5 h-1.5 rounded-full" style={{ background: g.ended ? '#555' : g.is_drop ? 'var(--warning)' : 'var(--primary)' }} />
                            <span className="font-semibold text-white/90">{g.prize}</span>
                            <span className="text-white/40">{g.ended ? 'was drawn and announced' : 'is currently active'}</span>
                          </div>
                          <div className="text-white/40 text-[10px] flex items-center gap-2">
                            <span>{g.entryCount} entries</span>
                            <span>·</span>
                            <span>{g.ended ? 'ENDED' : 'RUNNING'}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            );
          })()}

          {/* ── SETTINGS TAB ── */}
          {activeSidebarTab === 'settings' && (
            <div className="glass-panel p-8" style={{ borderRadius: '16px', maxWidth: '650px' }}>
              <h3 className="text-lg font-bold mb-1" style={{ color: 'var(--text-primary)' }}>General Settings</h3>
              <p className="text-xs text-white/40 mb-6">Manage how Snag behaves on your Discord server</p>

              <form onSubmit={saveSettings} className="flex flex-col gap-5">
                <div className="form-group">
                  <label className="flex items-center gap-1.5 mb-1.5">
                    <Shield size={11} /> Manager Role
                  </label>
                  {rolesLoading ? (
                    <div className="form-input flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
                      <Loader2 size={12} className="animate-spin" /> Loading roles…
                    </div>
                  ) : rolesError ? (
                    <div className="form-input text-xs text-red-400 border-red-500/20 bg-red-500/5">{rolesError}</div>
                  ) : (
                    <select
                      className="form-select"
                      value={settingsForm.managerRole}
                      onChange={e => setSettingsForm(prev => ({ ...prev, managerRole: e.target.value }))}
                    >
                      <option value="">Select a role…</option>
                      {roles.map(r => (
                        <option key={r.id} value={r.id}>{r.name}</option>
                      ))}
                    </select>
                  )}
                  <p className="text-[10px] text-white/40 mt-1">Users with this role can run creation/ended commands.</p>
                </div>

                <div className="form-group">
                  <label className="flex items-center gap-1.5 mb-1.5">
                    <Inbox size={11} /> Default Logging Channel
                  </label>
                  {channelsLoading ? (
                    <div className="form-input flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
                      <Loader2 size={12} className="animate-spin" /> Loading channels…
                    </div>
                  ) : channelsError ? (
                    <div className="form-input text-xs text-red-400 border-red-500/20 bg-red-500/5">{channelsError}</div>
                  ) : (
                    <select
                      className="form-select"
                      value={settingsForm.logsChannel}
                      onChange={e => setSettingsForm(prev => ({ ...prev, logsChannel: e.target.value }))}
                    >
                      <option value="">Select a channel…</option>
                      {channels.map(c => (
                        <option key={c.id} value={c.id}>#{c.name}</option>
                      ))}
                    </select>
                  )}
                  <p className="text-[10px] text-white/40 mt-1">Channel where winner rerolls and logs will be posted by default.</p>
                </div>

                <div className="form-group">
                  <label className="flex items-center gap-1.5 mb-1.5">
                    <Settings size={11} /> Embed Theme Theme Color
                  </label>
                  <div className="flex gap-2">
                    {[
                      { color: '#8b5cf6', name: 'Violet' },
                      { color: '#3b9dff', name: 'Blue' },
                      { color: '#00e676', name: 'Mint Green' },
                      { color: '#ff9100', name: 'Amber' }
                    ].map(x => (
                      <button
                        key={x.color}
                        type="button"
                        onClick={() => setSettingsForm(prev => ({ ...prev, embedColor: x.color }))}
                        className="w-8 h-8 rounded-full border-2 transition-all"
                        style={{
                          background: x.color,
                          borderColor: settingsForm.embedColor === x.color ? '#fff' : 'transparent',
                          transform: settingsForm.embedColor === x.color ? 'scale(1.1)' : 'scale(1)',
                          boxShadow: settingsForm.embedColor === x.color ? `0 0 12px ${x.color}` : 'none'
                        }}
                        title={x.name}
                      />
                    ))}
                  </div>
                </div>

                <div className="form-group flex items-center justify-between border-t border-white/5 pt-4">
                  <div>
                    <label className="flex items-center gap-1.5 font-semibold text-xs text-white/90">
                      Enable Telemetry Sharing
                    </label>
                    <p className="text-[10px] text-white/40">Allow analytics logs to be loaded on web panel charts.</p>
                  </div>
                  <div className="relative inline-flex items-center cursor-pointer"
                    onClick={() => setSettingsForm(prev => ({ ...prev, telemetry: !prev.telemetry }))}>
                    <div className="w-10 h-5 rounded-full transition-colors"
                      style={{ background: settingsForm.telemetry ? 'var(--primary)' : 'rgba(255,255,255,0.1)' }}>
                      <div className="w-4 h-4 rounded-full bg-white absolute top-0.5 transition-all"
                        style={{ left: settingsForm.telemetry ? '22px' : '2px', boxShadow: '0 2px 4px rgba(0,0,0,0.3)' }} />
                    </div>
                  </div>
                </div>

                <button type="submit" className="btn btn-primary w-fit mt-3">
                  Save Configuration
                </button>
              </form>

              {/* Danger Zone */}
              <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid rgba(255,23,68,0.2)' }}>
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontWeight: 700, fontSize: '13px', color: 'var(--danger)', marginBottom: '4px' }}>Danger Zone</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Irreversible actions. Proceed with caution.</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,23,68,0.05)', border: '1px solid rgba(255,23,68,0.2)', borderRadius: '10px', padding: '14px 16px' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '13px', color: 'var(--text-primary)', marginBottom: '3px' }}>Reset Server Data</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Delete all giveaways, entries, and settings for this server.</div>
                  </div>
                  <button
                    type="button"
                    className="btn btn-danger"
                    style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: '7px' }}
                    onClick={() => { setShowResetModal(true); setResetConfirmText(''); }}
                  >
                    <Trash2 size={13} /> Reset Data
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Reset Server Data Modal */}
      {showResetModal && (
        <div className="cmd-modal-overlay" onClick={() => setShowResetModal(false)}>
          <div className="cmd-modal" style={{ '--modal-color': '#ff1744' }} onClick={e => e.stopPropagation()}>
            {/* Titlebar */}
            <div className="cmd-modal-titlebar">
              <div className="cmd-modal-dots">
                <span className="cmd-dot cmd-dot-r" onClick={() => setShowResetModal(false)} title="Close" />
                <span className="cmd-dot cmd-dot-y" />
                <span className="cmd-dot cmd-dot-g" />
              </div>
              <span className="cmd-modal-titlebar-label">Snag Dashboard — Reset Server Data</span>
              <button className="cmd-modal-close" onClick={() => setShowResetModal(false)}><X size={13} /></button>
            </div>

            {/* Body */}
            <div className="cmd-modal-body">
              {/* Info panel */}
              <div className="cmd-modal-panel">
                <div className="cmd-modal-panel-title">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Trash2 size={15} style={{ color: 'var(--danger)', flexShrink: 0 }} />
                    <code className="cmd-modal-cmd-name" style={{ color: 'var(--danger)' }}>Reset Server Data</code>
                  </div>
                  <span className="cmd-badge cmd-badge-admin">DANGER</span>
                </div>
                <p className="cmd-modal-desc">{guild?.name || guildId} — permanently deletes all bot data for this server including giveaways, entries, and settings.</p>
              </div>

              {/* Warning panel */}
              <div className="cmd-modal-panel" style={{ borderColor: 'rgba(255,23,68,0.2)', background: 'rgba(255,23,68,0.05)' }}>
                <div className="cmd-modal-section-label" style={{ color: 'var(--danger)' }}>WARNING</div>
                <p className="cmd-modal-desc">
                  <strong style={{ color: 'var(--danger)' }}>This action is irreversible.</strong> All bot data for this server will be permanently deleted — including all giveaways, entries, and settings.
                </p>
              </div>

              {/* Confirm input panel */}
              <div className="cmd-modal-panel">
                <div className="cmd-modal-section-label">CONFIRM ACTION</div>
                <label style={{ fontSize: '12px', color: 'var(--cmd-sub)', display: 'block', marginBottom: '8px' }}>
                  Type <code style={{ color: 'var(--danger)', fontFamily: 'var(--cmd-mono)', fontSize: '12px' }}>RESET</code> to confirm
                </label>
                <input
                  className="form-input"
                  type="text"
                  placeholder="RESET"
                  value={resetConfirmText}
                  onChange={e => setResetConfirmText(e.target.value)}
                  style={{ width: '100%', borderColor: resetConfirmText === 'RESET' ? 'rgba(255,23,68,0.5)' : undefined }}
                  autoFocus
                />
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '10px' }}>
                <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setShowResetModal(false)}>Cancel</button>
                <button
                  className="btn btn-danger"
                  style={{ flex: 1, opacity: resetConfirmText === 'RESET' ? 1 : 0.4 }}
                  disabled={resetConfirmText !== 'RESET' || resetLoading}
                  onClick={resetServer}
                >
                  {resetLoading ? 'Resetting…' : 'Reset All Data'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
