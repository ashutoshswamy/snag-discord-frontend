import React, { useState, useEffect } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from './App.jsx';
import {
  Gift, Zap, RotateCcw, BarChart3, MousePointerClick, ShieldCheck,
  ChevronRight, ArrowRight, Star, Check, Menu, X, Clock, Trophy, Play,
  Terminal, Sparkles, Server, AlertCircle
} from 'lucide-react';
import './Landing.css';
import Footer from './Footer.jsx';

const ORBIT_ICONS = [
  { Icon: Gift,               label: 'Timed Giveaways',    color: '#a78bfa', angle: 0   },
  { Icon: Zap,                label: 'Instant Drops',      color: '#ff9100', angle: 60  },
  { Icon: RotateCcw,          label: 'Reroll Winners',     color: '#00e676', angle: 120 },
  { Icon: BarChart3,          label: 'Entry Analytics',    color: '#a78bfa', angle: 180 },
  { Icon: MousePointerClick,  label: 'One-Click Launch',   color: '#a78bfa', angle: 240 },
  { Icon: ShieldCheck,        label: 'Permission Guard',   color: '#00e676', angle: 300 },
];

const FEATURES = [
  {
    Icon: Gift,
    title: 'Timed Giveaways',
    desc: 'Set custom durations from seconds to weeks. Supports multiple winners, button entry reaction, and automatic resolution on completion.',
    color: '#8b5cf6',
    num: '01',
    pos: { gridColumn: '1 / 3', gridRow: '1 / 2' }
  },
  {
    Icon: Zap,
    title: 'Instant Drops',
    desc: 'First-click-claims-wins prizes that create instant excitement. Perfect for rewarding the most active members in real time.',
    color: '#ff9100',
    num: '02',
    pos: { gridColumn: '3 / 4', gridRow: '1 / 2' }
  },
  {
    Icon: RotateCcw,
    title: 'Reroll Winners',
    desc: "Winner didn't respond? Pick a new one from the existing entries pool with a single click — no command typing or configuration required.",
    color: '#00e676',
    num: '03',
    pos: { gridColumn: '1 / 2', gridRow: '2 / 3' }
  },
  {
    Icon: BarChart3,
    title: 'Live Entry Analytics',
    desc: 'Track participation metrics across all your drawings. View active entries, ends, and server statistics at a glance from the dashboard.',
    color: '#8b5cf6',
    num: '04',
    pos: { gridColumn: '2 / 3', gridRow: '2 / 3' }
  },
  {
    Icon: MousePointerClick,
    title: 'Web Control Panel',
    desc: 'Create, edit, end, and reroll giveaways directly from our beautiful glassmorphic web dashboard without running a single Discord slash command.',
    color: '#a78bfa',
    num: '05',
    pos: { gridColumn: '3 / 4', gridRow: '2 / 4' }
  },
  {
    Icon: ShieldCheck,
    title: 'OAuth2 Permission Guard',
    desc: 'Only server administrators can manage their server dashboard. Secure Discord OAuth2 login ensures only the right people are in control.',
    color: '#6366f1',
    num: '06',
    pos: { gridColumn: '1 / 3', gridRow: '3 / 4' }
  }
];


const STEPS = [
  {
    Icon: Server,
    number: '01',
    title: 'Invite Snag',
    desc: 'Add Snag to your Discord server with a single click. No complex permissions setup needed — Snag is ready to run giveaways immediately.',
  },
  {
    Icon: ShieldCheck,
    number: '02',
    title: 'Authenticate',
    desc: 'Sign into the web dashboard using your Discord account. Your servers appear instantly with no manual linking required.',
  },
  {
    Icon: Star,
    number: '03',
    title: 'Launch Draw',
    desc: 'Configure a giveaway or drop from the dashboard, click launch, and watch Snag draw winners automatically in your server.',
  },
];

const PREVIEW_ITEMS = [
  {
    id: 'giveaways', label: 'Timed Giveaways', Icon: Gift, color: '#8b5cf6', eyebrow: 'TIMED GIVEAWAYS',
    title: 'Draw Winners Automatically',
    desc: 'Configure multi-winner draws with custom durations. Snag posts the message inside Discord and lets members enter with a single button click.',
    bullets: ['Button-based entry mechanism', 'Configurable winner counts', 'Custom timers up to weeks', 'Automatic winner selection on end'],
  },
  {
    id: 'drops', label: 'Instant Drops', Icon: Zap, color: '#ff9100', eyebrow: 'INSTANT DROPS',
    title: 'First-Click Claims Wins',
    desc: 'Reward active chat rooms in real-time. Members race to click the claim button; the first one to interact wins the prize instantly.',
    bullets: ['Instant first-click wins', 'High engagement chat builder', 'Direct claim status updates', 'Zero configuration required'],
  },
  {
    id: 'analytics', label: 'Dashboard Statistics', Icon: BarChart3, color: '#8b5cf6', eyebrow: 'ANALYTICS DASHBOARD',
    title: 'Real-time Telemetry Tracking',
    desc: 'Get full transparency. Keep track of how many giveaways are active, ended, and count total entries across all servers.',
    bullets: ['Centralized stats overview', 'Active and ended drawing metrics', 'Cumulative entry counts', 'Seamless server switcher list'],
  },
];

export default function Landing() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activePreview, setActivePreview] = useState('giveaways');

  useEffect(() => {
    document.title = 'Snag Bot — Modern Discord Giveaways';
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 36);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);



  const error = new URLSearchParams(window.location.search).get('error');

  const inviteUrl = "https://discord.com/oauth2/authorize";
  const ORBIT_RADIUS = 155;
  const ORBIT_CENTER = 190;
  const ICON_HALF = 22;

  const handleDashboard = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      window.location.href = '/api/auth/discord';
    }
  };

  const renderCard = (type) => {
    if (type === 'giveaways') {
      return (
        <div className="lp-dash-card">
          <div className="lp-dash-titlebar">
            <div className="lp-automod-dots">
              <span className="lp-dot lp-dot-r" />
              <span className="lp-dot lp-dot-y" />
              <span className="lp-dot lp-dot-g" />
            </div>
            <span className="lp-dash-titlebar-label">Snag Dashboard — Timed Giveaways</span>
          </div>
          <div className="lp-dash-body">
            <div className="lp-dash-chart-panel">
              <div className="lp-dash-chart-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                Active Drawings
                <span style={{ fontSize: '9px', color: '#8b5cf6', background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)', borderRadius: '4px', padding: '2px 7px', fontWeight: 600 }}>2 ACTIVE</span>
              </div>
              <div className="lp-alerts-list">
                {[
                  { prize: 'Discord Nitro (1 Month)', channel: '#giveaways', status: 'Active', entries: '42 entries' },
                  { prize: '$50 Steam Gift Card', channel: '#announcements', status: 'Active', entries: '18 entries' }
                ].map(({ prize, channel, status, entries }) => (
                  <div key={prize} className="lp-alert-row" style={{ padding: '12px 10px' }}>
                    <div className="lp-alert-dot" style={{ background: '#8b5cf6' }} />
                    <div className="lp-alert-info">
                      <div className="lp-alert-name" style={{ fontWeight: 600 }}>{prize}</div>
                      <div className="lp-alert-channel">{channel} · {entries}</div>
                    </div>
                    <span className="lp-alert-badge" style={{ color: '#8b5cf6', borderColor: 'rgba(139,92,246,0.25)', background: 'rgba(139,92,246,0.08)' }}>
                      RUNNING
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="lp-dash-chart-panel">
              <div className="lp-dash-chart-title">Quick Settings Form</div>
              <div className="lp-gw-form" style={{ marginTop: '8px' }}>
                <div className="lp-gw-form-group">
                  <label className="lp-gw-label">Prize</label>
                  <div className="lp-gw-input-mock">e.g. Discord Nitro</div>
                </div>
                <div className="lp-gw-form-row" style={{ display: 'flex', gap: '10px' }}>
                  <div className="lp-gw-form-group" style={{ flex: 1 }}>
                    <label className="lp-gw-label">Duration</label>
                    <div className="lp-gw-select-mock">30 Minutes ▾</div>
                  </div>
                  <div className="lp-gw-form-group" style={{ flex: 1 }}>
                    <label className="lp-gw-label">Winners</label>
                    <div className="lp-gw-select-mock">1 ▾</div>
                  </div>
                </div>
                <button className="lp-gw-launch-btn" style={{ background: 'var(--lp-primary)', width: '100%', border: 'none', borderRadius: '6px', color: '#fff', padding: '10px', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '12px', marginTop: '10px' }}>
                  <Gift size={13} /> Launch Giveaway
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }
    if (type === 'drops') {
      return (
        <div className="lp-dash-card">
          <div className="lp-dash-titlebar">
            <div className="lp-automod-dots">
              <span className="lp-dot lp-dot-r" />
              <span className="lp-dot lp-dot-y" />
              <span className="lp-dot lp-dot-g" />
            </div>
            <span className="lp-dash-titlebar-label">Snag Dashboard — Instant Drops</span>
          </div>
          <div className="lp-dash-body">
            <div className="lp-dash-chart-panel">
              <div className="lp-dash-chart-title">Recent Drop Claims</div>
              <div className="lp-audit-list">
                {[
                  { type: 'claimed', user: 'nova_knight', content: 'Steam Key (Claimed in 0.8s)', time: '2m ago', color: '#00e676' },
                  { type: 'claimed', user: 'blazex99', content: 'Spotify Premium (Claimed in 1.4s)', time: '14m ago', color: '#00e676' },
                  { type: 'expired', user: 'system', content: 'Xbox Pass (No claims in 24h)', time: '1h ago', color: '#f43f5e' }
                ].map(({ type, user, content, time, color }) => (
                  <div key={user + time} className="lp-audit-row">
                    <span className="lp-audit-badge" style={{ color, borderColor: color + '33', background: color + '10' }}>{type}</span>
                    <div className="lp-audit-info">
                      <span className="lp-audit-user">{user}</span>
                      <span className="lp-audit-content">{content}</span>
                    </div>
                    <span className="lp-audit-time">{time}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lp-dash-chart-panel">
              <div className="lp-dash-chart-title">Post New Drop</div>
              <div className="lp-gw-form" style={{ marginTop: '8px' }}>
                <div className="lp-gw-form-group">
                  <label className="lp-gw-label">Drop Prize</label>
                  <div className="lp-gw-input-mock">Steam Game Key</div>
                </div>
                <div className="lp-gw-form-group" style={{ marginTop: '8px' }}>
                  <label className="lp-gw-label">Discord Channel</label>
                  <div className="lp-gw-select-mock"># drops ▾</div>
                </div>
                <button className="lp-gw-launch-btn" style={{ background: '#ff9100', width: '100%', border: 'none', borderRadius: '6px', color: '#000', padding: '10px', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '12px', marginTop: '10px' }}>
                  <Zap size={13} /> Launch Drop
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }
    if (type === 'analytics') {
      return (
        <div className="lp-dash-card">
          <div className="lp-dash-titlebar">
            <div className="lp-automod-dots">
              <span className="lp-dot lp-dot-r" />
              <span className="lp-dot lp-dot-y" />
              <span className="lp-dot lp-dot-g" />
            </div>
            <span className="lp-dash-titlebar-label">Snag Dashboard — Telemetry</span>
          </div>
          <div className="lp-dash-body">
            <div className="lp-dash-chart-panel">
              <div className="lp-modstats-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                {[
                  { label: 'Active', value: 3, color: '#8b5cf6' },
                  { label: 'Ended', value: 18, color: '#8b5cf6' },
                  { label: 'Entries', value: 824, color: '#00e676' },
                  { label: 'Uptime', value: '100%', color: '#a78bfa' }
                ].map(({ label, value, color }) => (
                  <div key={label} className="lp-modstat-cell" style={{ textAlign: 'center', padding: '10px 4px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '6px' }}>
                    <div className="lp-modstat-value" style={{ color, fontSize: '18px', fontWeight: 800 }}>{value}</div>
                    <div className="lp-modstat-label" style={{ fontSize: '9px', textTransform: 'uppercase', color: 'var(--lp-text-2)', marginTop: '4px' }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lp-dash-chart-panel">
              <div className="lp-dash-chart-title">Real-time Entry Logs</div>
              <div className="lp-audit-list" style={{ maxHeight: '110px', overflowY: 'hidden' }}>
                {[
                  { type: 'joined', user: 'nova_knight', content: 'entered Discord Nitro', time: '1s ago', color: '#8b5cf6' },
                  { type: 'joined', user: 'blazex99', content: 'entered Discord Nitro', time: '12s ago', color: '#8b5cf6' },
                  { type: 'claimed', user: 'crystal_void', content: 'claimed Steam Key Drop', time: '1m ago', color: '#00e676' }
                ].map(({ type, user, content, time, color }) => (
                  <div key={user + time} className="lp-audit-row" style={{ padding: '6px 8px' }}>
                    <span className="lp-audit-badge" style={{ color, borderColor: color + '33', background: color + '10', fontSize: '9px', padding: '1px 5px' }}>{type}</span>
                    <div className="lp-audit-info" style={{ fontSize: '11px' }}>
                      <span className="lp-audit-user" style={{ fontWeight: 600 }}>{user}</span>
                      <span className="lp-audit-content">{content}</span>
                    </div>
                    <span className="lp-audit-time" style={{ fontSize: '10px' }}>{time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="lp-root">
      {/* ── NAV ── */}
      <header className={`lp-nav ${scrolled ? 'lp-nav--scrolled' : ''}`}>
        <div className="lp-nav-inner">
          <div className="lp-nav-brand">
            <img src="/Logo.png" alt="Snag" className="lp-nav-logo" />
            <span className="lp-nav-name">SNAG</span>
          </div>

          <nav className="lp-nav-links">
            <a href="#features">Features</a>
            <RouterLink to="/commands">Commands</RouterLink>
            <a href="#how">How it works</a>
            <a href="#preview">Preview</a>
          </nav>

          <div className="lp-nav-ctas">
            <a href={inviteUrl} target="_blank" rel="noreferrer" className="lp-btn lp-btn-discord" style={{ padding: '8px 16px', fontSize: '13px' }}>
              <svg width="14" height="11" viewBox="0 0 24 18" fill="currentColor" aria-hidden="true" style={{ marginRight: '6px' }}>
                <path d="M20.317 1.492a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 1.492a.07.07 0 0 0-.032.027C.533 6.168-.32 10.702.099 15.179a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 12.452c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
              </svg>
              Add to Discord
            </a>
            <button className="lp-btn lp-btn-primary" onClick={handleDashboard}>
              {user ? 'Go to Dashboard' : 'Dashboard'}
            </button>
          </div>

          <button
            className="lp-mobile-menu-btn"
            onClick={() => setMobileMenuOpen(o => !o)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="lp-mobile-menu">
            <a href="#features" onClick={() => setMobileMenuOpen(false)}>Features</a>
            <RouterLink to="/commands" onClick={() => setMobileMenuOpen(false)}>Commands</RouterLink>
            <a href="#how" onClick={() => setMobileMenuOpen(false)}>How it works</a>
            <a href="#preview" onClick={() => setMobileMenuOpen(false)}>Preview</a>
            <a
              href={inviteUrl}
              target="_blank"
              rel="noreferrer"
              className="lp-btn lp-btn-discord"
              style={{ textAlign: 'center', justifyContent: 'center' }}
              onClick={() => setMobileMenuOpen(false)}
            >
              Add to Discord
            </a>
            <button
              className="lp-btn lp-btn-primary"
              style={{ textAlign: 'center', justifyContent: 'center' }}
              onClick={() => { setMobileMenuOpen(false); handleDashboard(); }}
            >
              Dashboard
            </button>
          </div>
        )}
      </header>

      {/* ── HERO ── */}
      <section className="lp-hero">
        <div className="lp-hero-bg-glow" />
        <div className="lp-hero-bg-glow-2" />

        <div className="lp-container lp-hero-grid">
          {/* Left: Content */}
          <div className="lp-hero-content">
            <div className="lp-discord-badge">
              <Sparkles size={11} style={{ marginRight: '6px' }} />
              Discord Giveaway Bot — Free Forever
            </div>

            <h1 className="lp-hero-title">
              The <span className="lp-hero-title-accent">Giveaway Bot</span><br />
              Your Server's Been<br />
              Waiting For.
            </h1>

            <p className="lp-hero-desc">
              Create giveaways, launch instant drops, and manage everything from a sleek web dashboard — built for Discord communities.
            </p>

            <div className="lp-hero-actions">
              <a href={inviteUrl} target="_blank" rel="noreferrer" className="lp-btn lp-btn-discord lp-btn-lg">
                <svg width="18" height="14" viewBox="0 0 24 18" fill="currentColor" aria-hidden="true" style={{ marginRight: '6px' }}>
                  <path d="M20.317 1.492a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 1.492a.07.07 0 0 0-.032.027C.533 6.168-.32 10.702.099 15.179a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 12.452c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
                Add to Discord
              </a>
              <button className="lp-btn lp-btn-ghost lp-btn-lg" onClick={handleDashboard}>
                Open Dashboard <ArrowRight size={16} />
              </button>
            </div>

            <div className="lp-hero-stats">
              <div className="lp-stat">
                <span className="lp-stat-num">4+</span>
                <span className="lp-stat-label">Slash Commands</span>
              </div>
              <div className="lp-stat-divider" />
              <div className="lp-stat">
                <span className="lp-stat-num">3</span>
                <span className="lp-stat-label">Main Systems</span>
              </div>
              <div className="lp-stat-divider" />
              <div className="lp-stat">
                <span className="lp-stat-num">Free</span>
                <span className="lp-stat-label">No Premium Paywalls</span>
              </div>
            </div>
          </div>

          {/* Right: Orbit visual */}
          <div className="lp-hero-visual">
            <div className="lp-orbit-container">
              <div className="lp-orbit-ring lp-orbit-ring-3" />
              <div className="lp-orbit-ring lp-orbit-ring-1" />
              <div className="lp-orbit-ring lp-orbit-ring-2" />

              <div className="lp-bot-logo-wrapper">
                <div className="lp-bot-glow" />
                <img src="/Logo.png" alt="Snag Bot" className="lp-bot-logo" />
              </div>

              {ORBIT_ICONS.map(({ Icon, label, color, angle }) => {
                const rad = (angle * Math.PI) / 180;
                const x = ORBIT_CENTER + ORBIT_RADIUS * Math.sin(rad) - ICON_HALF;
                const y = ORBIT_CENTER - ORBIT_RADIUS * Math.cos(rad) - ICON_HALF;
                return (
                  <div
                    key={label}
                    className="lp-orbit-icon"
                    style={{ left: `${x}px`, top: `${y}px` }}
                    title={label}
                  >
                    <Icon size={18} color={color} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Error Message */}
      {error && (
        <div className="lp-container" style={{ marginBottom: '40px' }}>
          <div className="glass-panel flex items-center gap-3 px-5 py-4"
            style={{ borderLeft: '3px solid var(--danger)', background: 'rgba(239, 68, 68, 0.08)', maxWidth: '600px', margin: '0 auto' }}>
            <AlertCircle size={20} style={{ color: 'var(--danger)' }} />
            <div>
              <h4 style={{ fontWeight: 700, fontSize: '14px', marginBottom: '2px' }}>Authentication Error</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Login failed ({error}). Please check your application settings and try again.</p>
            </div>
          </div>
        </div>
      )}

      {/* ── FEATURES ── */}
      <section className="lp-features" id="features">
        <div className="lp-container">
          <div className="lp-section-eyebrow">
            <span className="lp-section-eyebrow-line" />
            <span className="lp-section-label">FEATURES</span>
          </div>
          <h2 className="lp-section-title">Everything Your Server Needs</h2>
          <p className="lp-section-desc">
            Six powerful features working in harmony to create the ultimate giveaway experience for your community.
          </p>

          <div className="lp-features-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
            {FEATURES.map(({ Icon, title, desc, color, num, pos }) => (
              <div
                className="lp-feature-card"
                key={title}
                style={{ ...pos, '--feat-color': color, '--feat-color-dim': color + '18', '--feat-color-border': color + '30' }}
              >
                <span className="lp-feat-watermark">{num}</span>
                <div className="lp-feat-inner">
                  <div className="lp-feat-icon-wrap" style={{ background: color + '14', border: `1px solid ${color}28` }}>
                    <Icon size={20} color={color} />
                  </div>
                  <h3 className="lp-feat-title">{title}</h3>
                  <p className="lp-feat-desc">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ── HOW IT WORKS ── */}
      <section className="lp-how" id="how">
        <div className="lp-container">
          {/* Header */}
          <div className="lp-how-header">
            <div className="lp-section-eyebrow">
              <span className="lp-section-eyebrow-line" />
              <span className="lp-section-label">HOW IT WORKS</span>
            </div>
            <h2 className="lp-section-title">Up and Running in Minutes</h2>
            <p className="lp-section-desc">
              No complicated setup. No technical knowledge required. Just invite, authenticate, and launch your first draw.
            </p>
          </div>

          {/* Steps */}
          <div className="lp-how-steps">
            {STEPS.map(({ Icon, number, title, desc }, i) => (
              <div key={number} className="lp-how-step-card">
                <div className="lp-how-step-num">{number}</div>
                <div className="lp-how-step-icon-wrap">
                  <Icon size={20} color="var(--lp-primary)" />
                </div>
                <h3 className="lp-how-step-title">{title}</h3>
                <p className="lp-how-step-desc">{desc}</p>
                {i < STEPS.length - 1 && (
                  <div className="lp-how-step-arrow">
                    <ArrowRight size={16} color="rgba(139,92,246,0.35)" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DASHBOARD PREVIEW ── */}
      <section className="lp-preview" id="preview">
        <div className="lp-container">
          <div className="lp-how-header">
            <div className="lp-section-eyebrow">
              <span className="lp-section-eyebrow-line" />
              <span className="lp-section-label">DASHBOARD PREVIEW</span>
            </div>
            <h2 className="lp-section-title">See Snag in Action</h2>
            <p className="lp-section-desc">
              A live look at the Snag dashboard — click any feature tab to preview how the web interface behaves.
            </p>
          </div>

          <div className="lp-preview-split">
            {/* Left — sticky feature list */}
            <div className="lp-preview-list">
              {PREVIEW_ITEMS.map(({ id, label, Icon, color }) => (
                <button
                  key={id}
                  className={`lp-preview-list-btn ${activePreview === id ? 'active' : ''}`}
                  onClick={() => setActivePreview(id)}
                  style={activePreview === id ? { color, borderColor: color + '44', background: color + '0d' } : {}}
                >
                  <div className="lp-preview-list-icon" style={activePreview === id ? { background: color + '18', color } : {}}>
                    <Icon size={15} />
                  </div>
                  <span>{label}</span>
                  {activePreview === id && <ChevronRight size={13} className="lp-preview-list-arrow" />}
                </button>
              ))}
            </div>

            {/* Right — active preview */}
            <div className="lp-preview-active">
              <div className="lp-preview-active-card">
                {renderCard(activePreview)}
              </div>
              <div className="lp-preview-active-text">
                {(() => {
                  const p = PREVIEW_ITEMS.find(x => x.id === activePreview);
                  if (!p) return null;
                  return (
                    <>
                      <div className="lp-section-eyebrow" style={{ marginBottom: '16px' }}>
                        <span className="lp-section-eyebrow-line" />
                        <span className="lp-section-label" style={{ color: p.color }}>{p.eyebrow}</span>
                      </div>
                      <h3 className="lp-preview-text-title">{p.title}</h3>
                      <p className="lp-preview-text-desc">{p.desc}</p>
                      <ul className="lp-preview-bullets">
                        {p.bullets.map((b, i) => (
                          <li key={i}><Check size={14} color={p.color} /><span>{b}</span></li>
                        ))}
                      </ul>
                    </>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="lp-cta">
        <div className="lp-cta-glow" />
        <div className="lp-container">
          <img src="/Logo.png" alt="Snag Bot" className="lp-cta-logo" />
          <h2 className="lp-cta-title">
            Ready to elevate<br />your server?
          </h2>
          <p className="lp-cta-desc">
            Join Discord communities using Snag to run better, automated, and more engaging giveaway events — completely free.
          </p>

          <div className="lp-cta-actions">
            <a href={inviteUrl} target="_blank" rel="noreferrer" className="lp-btn lp-btn-discord lp-btn-lg">
              <svg width="18" height="14" viewBox="0 0 24 18" fill="currentColor" aria-hidden="true">
                <path d="M20.317 1.492a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 1.492a.07.07 0 0 0-.032.027C.533 6.168-.32 10.702.099 15.179a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 12.452c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
              </svg>
              Add to Discord — Free
            </a>
            <button className="lp-btn lp-btn-outline lp-btn-lg" onClick={handleDashboard}>
              View Dashboard
            </button>
          </div>

          <div className="lp-cta-checks">
            {['Free to use', 'No credit card', 'Setup in 2 minutes'].map(t => (
              <div key={t} className="lp-cta-check">
                <Check size={14} color="var(--lp-primary)" />
                <span>{t}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer onDashboard={handleDashboard} />
    </div>
  );
}
