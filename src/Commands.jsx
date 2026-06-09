import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Layers, Gift, Terminal, X, Shield, LayoutDashboard, Copy, Check
} from 'lucide-react';
import { useAuth } from './App.jsx';
import './Commands.css';

const CATEGORIES = [
  { id: 'all',        label: 'All Commands',  Icon: Layers    },
  { id: 'drawing',    label: 'Drawings & Drops', Icon: Gift   },
  { id: 'management', label: 'Management',    Icon: Terminal  },
];

const COMMANDS = [
  {
    name: 'gstart',
    category: 'drawing',
    desc: 'Starts a timed giveaway draw with automatic winner selection. This command does not take any direct slash options; instead, it opens a Discord modal popup where you enter the prize, duration, and number of winners.',
    usage: '/gstart',
    options: [],
    modalFields: [
      { name: 'Prize', type: 'Text (Short)', required: true, desc: 'The item to give away (e.g. Nitro Classic, Steam Game Key). Max 100 characters.' },
      { name: 'Duration', type: 'Text (Short)', required: true, desc: 'How long the giveaway lasts (e.g. 30m, 1h, 2d, 1w). Max 10 characters.' },
      { name: 'Number of Winners', type: 'Text (Short)', required: true, desc: 'Number of winners to draw (between 1 and 20). Max 2 digits.' },
    ],
    admin: true,
    dashboard: true,
  },
  {
    name: 'gdrop',
    category: 'drawing',
    desc: 'Launch an instant drop where the first person to click the claim button wins the prize immediately. This command does not take any direct slash options; instead, it opens a Discord modal popup to enter the prize.',
    usage: '/gdrop',
    options: [],
    modalFields: [
      { name: 'Prize', type: 'Text (Short)', required: true, desc: 'The prize to drop (e.g. Steam Game Key, Spotify Code). Max 100 characters.' },
    ],
    admin: true,
    dashboard: true,
  },
  {
    name: 'greroll',
    category: 'management',
    desc: 'Draws a new winner randomly from the existing entries pool of an ended giveaway. This command does not take any direct slash options; instead, it fetches the server history and opens an interactive select menu listing the last 25 completed drawings.',
    usage: '/greroll',
    options: [],
    menuFields: [
      { name: 'Select Giveaway', type: 'String Select Menu', required: true, desc: 'Dropdown list showing completed giveaways/drops (denoted by dice and bolt icons) with active winner counts.' }
    ],
    admin: true,
    dashboard: true,
  },
  {
    name: 'gend',
    category: 'management',
    desc: 'Ends an active giveaway early and draws the winners immediately. This command does not take any direct slash options; instead, it fetches active drawings and opens an interactive select menu listing up to 25 active giveaways.',
    usage: '/gend',
    options: [],
    menuFields: [
      { name: 'Select Giveaway', type: 'String Select Menu', required: true, desc: 'Dropdown list showing active timed giveaways (denoted by a party icon) along with their configured duration and winner count.' }
    ],
    admin: true,
    dashboard: true,
  },
  {
    name: 'glist',
    category: 'management',
    desc: 'Browse all active giveaways and drops in the current server. Displays an interactive Discord embed containing custom filter and refresh buttons. Available for use by everyone.',
    usage: '/glist',
    options: [],
    interactiveFields: [
      { name: 'All', type: 'Button', desc: 'Displays all active giveaways and drops currently running in the server.' },
      { name: 'Giveaways', type: 'Button', desc: 'Filters the view to only show active timed giveaways.' },
      { name: 'Drops', type: 'Button', desc: 'Filters the view to only show active instant drops.' },
      { name: 'Refresh', type: 'Button', desc: 'Queries the database in real time to fetch updated drawing lists.' },
    ],
    admin: false,
    dashboard: false,
  },
  {
    name: 'ping',
    category: 'management',
    desc: "Check the bot's WebSocket latency and Discord API response time to verify service health.",
    usage: '/ping',
    options: [],
    admin: false,
    dashboard: false,
  },
  {
    name: 'help',
    category: 'management',
    desc: "Shows a comprehensive manual of all available Snag slash commands, dynamic manager permissions, and custom guild configurations.",
    usage: '/help',
    options: [],
    admin: false,
    dashboard: false,
  },
];

const CAT_COLORS = {
  all: '#8b5cf6',
  drawing: '#8b5cf6',
  management: '#8b5cf6',
};

const TYPE_COLORS = {
  'Text (Short)': '#00e676',
  'String Select Menu': '#6366f1',
  'Button': '#a78bfa',
};

export default function Commands() {
  const { user } = useAuth();
  const [activeCategory, setActiveCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedCmd, setSelectedCmd] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    document.title = 'Commands — Snag Bot';
    const meta = document.querySelector('meta[name="description"]');
    const prev = meta?.getAttribute('content');
    if (meta) meta.setAttribute('content', 'Browse all Snag Discord bot slash commands. Includes giveaway start, instant drops, reroll winners, and management commands.');
    window.scrollTo({ top: 0, behavior: 'instant' });
    return () => {
      document.title = 'Snag — Free Discord Giveaway Bot';
      if (meta && prev) meta.setAttribute('content', prev);
    };
  }, []);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setSelectedCmd(null); };
    if (selectedCmd) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selectedCmd]);

  const filtered = useMemo(() => {
    let list = COMMANDS;
    if (activeCategory !== 'all') list = list.filter(c => c.category === activeCategory);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(c =>
        c.name.includes(q) ||
        c.desc.toLowerCase().includes(q) ||
        c.category.includes(q)
      );
    }
    return list;
  }, [activeCategory, search]);

  const totalByCategory = useMemo(() => {
    const counts = {};
    COMMANDS.forEach(c => { counts[c.category] = (counts[c.category] || 0) + 1; });
    return counts;
  }, []);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="cmd-root">
      {/* Background */}
      <div className="cmd-bg-grid" />
      <div className="cmd-bg-glow-1" />
      <div className="cmd-bg-glow-2" />

      {/* Modal */}
      {selectedCmd && (
        <div className="cmd-modal-overlay" onClick={() => setSelectedCmd(null)}>
          <div className="cmd-modal" style={{ '--modal-color': CAT_COLORS[selectedCmd.category] }} onClick={e => e.stopPropagation()}>
            {/* Titlebar */}
            <div className="cmd-modal-titlebar">
              <div className="cmd-modal-dots">
                <span className="cmd-dot cmd-dot-r" onClick={() => setSelectedCmd(null)} title="Close" />
                <span className="cmd-dot cmd-dot-y" />
                <span className="cmd-dot cmd-dot-g" />
              </div>
              <span className="cmd-modal-titlebar-label">Snag Dashboard — /{selectedCmd.name}</span>
              <button className="cmd-modal-close" onClick={() => setSelectedCmd(null)}><X size={13} /></button>
            </div>

            {/* Body */}
            <div className="cmd-modal-body">
              {/* Command info panel */}
              <div className="cmd-modal-panel">
                <div className="cmd-modal-panel-title">
                  <code className="cmd-modal-cmd-name" style={{ color: CAT_COLORS[selectedCmd.category] }}>/{selectedCmd.name}</code>
                  <div className="cmd-modal-badges">
                    {selectedCmd.admin && <span className="cmd-badge cmd-badge-admin">ADMIN</span>}
                    {selectedCmd.dashboard && <span className="cmd-badge cmd-badge-dashboard">DASHBOARD</span>}
                    <span className="cmd-badge cmd-badge-cat" style={{ background: CAT_COLORS[selectedCmd.category] + '1a', color: CAT_COLORS[selectedCmd.category], borderColor: CAT_COLORS[selectedCmd.category] + '33' }}>
                      {selectedCmd.category === 'drawing' ? 'Drawings' : 'Management'}
                    </span>
                  </div>
                </div>
                <p className="cmd-modal-desc">{selectedCmd.desc}</p>
              </div>

              {/* Usage panel */}
              <div className="cmd-modal-panel">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div className="cmd-modal-section-label" style={{ marginBottom: 0 }}>USAGE</div>
                  <button
                    onClick={() => handleCopy(selectedCmd.usage)}
                    className="flex items-center gap-1 text-xs border border-white/10 hover:border-white/20 rounded px-2 py-1 bg-white/5 text-white/60 hover:text-white transition-colors"
                  >
                    {copied ? <Check size={11} className="text-green-400" /> : <Copy size={11} />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <code className="cmd-modal-usage-block">{selectedCmd.usage}</code>
              </div>

              {/* Modal Fields Panel */}
              {selectedCmd.modalFields && selectedCmd.modalFields.length > 0 && (
                <div className="cmd-modal-panel">
                  <div className="cmd-modal-section-label">MODAL FIELDS</div>
                  <div className="cmd-modal-options">
                    {selectedCmd.modalFields.map(opt => (
                      <div key={opt.name} className="cmd-modal-option-row">
                        <div className="cmd-modal-option-meta">
                          <code className="cmd-modal-option-name">{opt.name}</code>
                          <span className="cmd-option-type" style={{ color: TYPE_COLORS[opt.type] || '#888', borderColor: (TYPE_COLORS[opt.type] || '#888') + '33', background: (TYPE_COLORS[opt.type] || '#888') + '12' }}>
                            {opt.type}
                          </span>
                          <span className="cmd-option-optional">required</span>
                        </div>
                        <p className="cmd-modal-option-desc">{opt.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Menu Fields Panel */}
              {selectedCmd.menuFields && selectedCmd.menuFields.length > 0 && (
                <div className="cmd-modal-panel">
                  <div className="cmd-modal-section-label">INTERACTIVE SELECT MENU</div>
                  <div className="cmd-modal-options">
                    {selectedCmd.menuFields.map(opt => (
                      <div key={opt.name} className="cmd-modal-option-row">
                        <div className="cmd-modal-option-meta">
                          <code className="cmd-modal-option-name">{opt.name}</code>
                          <span className="cmd-option-type" style={{ color: TYPE_COLORS[opt.type] || '#888', borderColor: (TYPE_COLORS[opt.type] || '#888') + '33', background: (TYPE_COLORS[opt.type] || '#888') + '12' }}>
                            {opt.type}
                          </span>
                          <span className="cmd-option-optional">required</span>
                        </div>
                        <p className="cmd-modal-option-desc">{opt.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Interactive Fields Panel */}
              {selectedCmd.interactiveFields && selectedCmd.interactiveFields.length > 0 && (
                <div className="cmd-modal-panel">
                  <div className="cmd-modal-section-label">INTERACTIVE EMBED BUTTONS</div>
                  <div className="cmd-modal-options">
                    {selectedCmd.interactiveFields.map(opt => (
                      <div key={opt.name} className="cmd-modal-option-row">
                        <div className="cmd-modal-option-meta">
                          <code className="cmd-modal-option-name">{opt.name}</code>
                          <span className="cmd-option-type" style={{ color: TYPE_COLORS[opt.type] || '#888', borderColor: (TYPE_COLORS[opt.type] || '#888') + '33', background: (TYPE_COLORS[opt.type] || '#888') + '12' }}>
                            {opt.type}
                          </span>
                        </div>
                        <p className="cmd-modal-option-desc">{opt.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Nav */}
      <header className="cmd-nav">
        <Link to="/" className="cmd-nav-brand">
          <img src="/Logo.png" alt="Snag" className="cmd-nav-logo" />
          <span className="cmd-nav-name">SNAG</span>
        </Link>
        <div className="cmd-nav-right">
          <span className="cmd-nav-count">{COMMANDS.length} commands</span>
          <Link to="/guide" className="cmd-nav-link">Guide</Link>
          <Link to="/" className="cmd-nav-link">← Back to Home</Link>
          {user && (
            <Link to="/dashboard" className="cmd-nav-link" style={{ marginLeft: '16px' }}>
              Dashboard
            </Link>
          )}
        </div>
      </header>

      {/* Hero */}
      <div className="cmd-hero">
        <div className="cmd-hero-eyebrow">COMMAND REFERENCE</div>
        <h1 className="cmd-hero-title">
          Every command.<br />
          <span className="cmd-hero-accent">All in one place.</span>
        </h1>
        <p className="cmd-hero-desc">
          Complete reference for all {COMMANDS.length} Snag slash commands — modal fields, select dropdowns, and button actions.
        </p>

        {/* Search */}
        <div className="cmd-search-wrap">
          <span className="cmd-search-icon">⌕</span>
          <input
            className="cmd-search"
            type="text"
            placeholder="Search commands..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button className="cmd-search-clear" onClick={() => setSearch('')}><X size={13} /></button>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="cmd-body">
        {/* Sidebar */}
        <aside className="cmd-sidebar">
          <div className="cmd-sidebar-label">CATEGORIES</div>
          {CATEGORIES.map(({ id, label, Icon }) => (
            <button
              key={id}
              className={`cmd-cat-btn ${activeCategory === id ? 'active' : ''}`}
              onClick={() => setActiveCategory(id)}
              style={activeCategory === id && id !== 'all' ? {
                borderColor: CAT_COLORS[id] + '55',
                color: CAT_COLORS[id],
                background: CAT_COLORS[id] + '0f',
              } : {}}
            >
              <Icon size={14} className="cmd-cat-icon" />
              <span className="cmd-cat-label">{label}</span>
              <span className="cmd-cat-count">
                {id === 'all' ? COMMANDS.length : (totalByCategory[id] || 0)}
              </span>
            </button>
          ))}

          <div className="cmd-legend">
            <div className="cmd-legend-title">LEGEND</div>
            <div className="cmd-legend-item">
              <span className="cmd-badge cmd-badge-admin">ADMIN</span>
              <span>Requires Manage Server</span>
            </div>
            <div className="cmd-legend-item">
              <span className="cmd-badge cmd-badge-dashboard">DASHBOARD</span>
              <span>Available in Web Panel</span>
            </div>
          </div>
        </aside>

        {/* Grid */}
        <main className="cmd-main">
          {filtered.length === 0 ? (
            <div className="cmd-empty">
              <div className="cmd-empty-icon">⌕</div>
              <p>No commands match <strong>"{search}"</strong></p>
            </div>
          ) : (
            <div className="cmd-grid">
              {filtered.map(cmd => (
                <div
                  key={cmd.name}
                  className="cmd-card"
                  style={{ '--cat-color': CAT_COLORS[cmd.category], cursor: 'pointer' }}
                  onClick={() => setSelectedCmd(cmd)}
                >
                  <div className="cmd-card-header">
                    <code className="cmd-card-name">/{cmd.name}</code>
                    <div className="cmd-card-badges">
                      {cmd.admin && <span className="cmd-badge cmd-badge-admin">ADMIN</span>}
                      {cmd.dashboard && <span className="cmd-badge cmd-badge-dashboard">DASHBOARD</span>}
                      <span className="cmd-badge cmd-badge-cat" style={{ background: CAT_COLORS[cmd.category] + '1a', color: CAT_COLORS[cmd.category], borderColor: CAT_COLORS[cmd.category] + '33' }}>
                        {cmd.category === 'drawing' ? 'Drawings' : 'Management'}
                      </span>
                    </div>
                  </div>
                  <p className="cmd-card-desc">{cmd.desc}</p>
                  <div className="cmd-card-footer">
                    <span className="cmd-card-action">View Details →</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
