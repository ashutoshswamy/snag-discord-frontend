import { useState, useEffect, useCallback } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Activity, Server, Users, Zap, Terminal, RefreshCw,
  CheckCircle2, XCircle, Clock, ArrowLeft, Wifi, Gift, Rocket,
} from 'lucide-react';
import Footer from './Footer.jsx';
import './Status.css';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

function formatUptime(ms) {
  if (!ms || ms <= 0) return '—';
  const s = Math.floor(ms / 1000);
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  const parts = [];
  if (d > 0) parts.push(`${d}d`);
  if (h > 0) parts.push(`${h}h`);
  if (m > 0) parts.push(`${m}m`);
  if (d === 0 && h === 0 && m === 0) parts.push(`${s % 60}s`);
  return parts.join(' ');
}

function formatNumber(n) {
  if (n == null) return '—';
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K';
  return String(n);
}

function LatencyBar({ ms }) {
  if (ms < 0) return null;
  const pct = Math.min(100, (ms / 400) * 100);
  const color = ms < 80 ? '#00e676' : ms < 200 ? '#ff9100' : '#ff1744';
  const label = ms < 80 ? 'Excellent' : ms < 200 ? 'Good' : 'Degraded';
  return (
    <div className="st-latency-bar">
      <div className="st-latency-track">
        <div className="st-latency-fill" style={{ width: `${pct}%`, background: color, boxShadow: `0 0 8px ${color}80` }} />
      </div>
      <span className="st-latency-label" style={{ color }}>{label}</span>
    </div>
  );
}

const SERVICES = [
  { key: 'gateway',   name: 'Discord Gateway',  desc: 'WebSocket connection to Discord',    Icon: Wifi,     check: (online) => online },
  { key: 'commands',  name: 'Command Handler',  desc: 'Slash command processing',            Icon: Terminal, check: (online, stats) => online && (stats.commandCount || 0) > 0 },
  { key: 'giveaways', name: 'Giveaway Engine',  desc: 'Timed giveaway creation & endings',  Icon: Gift,     check: (online) => online },
  { key: 'drops',     name: 'Instant Drops',    desc: 'First-click drop event processing',  Icon: Rocket,   check: (online) => online },
  { key: 'api',       name: 'Dashboard API',    desc: 'REST API for this dashboard',         Icon: Activity, check: (_, __, data) => !!data && !data.error },
];

export default function Status() {
  const [data, setData]               = useState(null);
  const [loading, setLoading]         = useState(true);
  const [lastFetched, setLastFetched] = useState(null);
  const [countdown, setCountdown]     = useState(30);

  const doFetch = useCallback(async () => {
    setLoading(true);
    try {
      const res  = await fetch(`${API_BASE}/status`);
      const json = await res.json();
      setData(json);
      setLastFetched(new Date());
      setCountdown(30);
    } catch {
      setData({ online: false, error: 'Cannot reach API' });
      setCountdown(30);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { doFetch(); }, [doFetch]);
  useEffect(() => {
    const id = setInterval(doFetch, 30_000);
    return () => clearInterval(id);
  }, [doFetch]);
  useEffect(() => {
    const id = setInterval(() => setCountdown(c => (c <= 1 ? 30 : c - 1)), 1000);
    return () => clearInterval(id);
  }, [lastFetched]);

  const online = data?.online ?? false;
  const stats  = data?.stats  ?? {};
  const bot    = data?.bot    ?? null;

  const latencyMs    = stats.latencyMs ?? -1;
  const latencyColor = latencyMs < 0 ? '#546b87' : latencyMs < 80 ? '#00e676' : latencyMs < 200 ? '#ff9100' : '#ff1744';

  const statCards = [
    { icon: <Server size={20} />, label: 'Servers',        value: formatNumber(stats.guildCount),   accent: '#8b5cf6' },
    { icon: <Users  size={20} />, label: 'Members',        value: formatNumber(stats.memberCount),  accent: '#6366f1' },
    { icon: <Gift   size={20} />, label: 'Giveaways Run',  value: formatNumber(stats.giveawayCount), accent: '#a78bfa' },
    { icon: <Clock  size={20} />, label: 'Uptime',         value: formatUptime(stats.uptimeMs),     accent: '#ff9100' },
    { icon: <Zap    size={20} />, label: 'Latency',        value: latencyMs >= 0 ? `${latencyMs}ms` : '—', accent: latencyColor },
  ];

  const allOk  = SERVICES.every(s => s.check(online, stats, data));
  const someOk = !allOk && SERVICES.some(s => s.check(online, stats, data));

  const overallColor = !online ? '#ff1744' : allOk ? '#00e676' : someOk ? '#ff9100' : '#ff1744';
  const overallLabel = !online ? 'Offline' : allOk ? 'All Systems Operational' : someOk ? 'Partial Outage' : 'Major Outage';
  const overallSub   = !online
    ? 'Snag is currently unreachable. Please check back shortly.'
    : allOk
    ? 'All services are running normally with no issues detected.'
    : 'Some services are experiencing disruptions.';

  return (
    <div className="st-root lp-root">
      {/* NAV */}
      <header className="st-nav">
        <div className="st-nav-inner">
          <RouterLink to="/" className="st-nav-back">
            <ArrowLeft size={14} /> Home
          </RouterLink>
          <RouterLink to="/" className="lp-nav-brand" style={{ textDecoration: 'none' }}>
            <img src="/Logo.png" alt="Snag" className="lp-nav-logo" />
            <span className="lp-nav-name">SNAG</span>
          </RouterLink>
          <button className="st-refresh-btn" onClick={doFetch} disabled={loading}>
            <RefreshCw size={13} className={loading ? 'st-spin' : ''} />
            {loading ? 'Checking…' : `${countdown}s`}
          </button>
        </div>
      </header>

      <main className="st-main">

        {/* HERO */}
        <section className="st-hero">
          {bot?.avatar ? (
            <div className="st-avatar-wrap" style={{ '--glow': overallColor }}>
              <img src={bot.avatar} alt={bot.username} className="st-avatar" />
              <div className="st-avatar-ring" style={{ borderColor: overallColor, boxShadow: `0 0 24px ${overallColor}50` }} />
              <div className="st-avatar-dot" style={{ background: overallColor, boxShadow: `0 0 8px ${overallColor}` }} />
            </div>
          ) : (
            <div className="st-avatar-placeholder" style={{ borderColor: overallColor }}>
              <Activity size={32} color={overallColor} />
            </div>
          )}

          <div className="st-hero-status" style={{ color: overallColor }}>
            {online && allOk
              ? <CheckCircle2 size={22} />
              : online && someOk
              ? <Activity size={22} />
              : <XCircle size={22} />}
            <span>{overallLabel}</span>
          </div>

          <p className="st-hero-sub">{overallSub}</p>

          {lastFetched && (
            <p className="st-hero-ts">
              Last updated · {lastFetched.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </p>
          )}
        </section>

        {/* OVERALL BANNER */}
        <div className="st-banner" style={{ '--color': overallColor, '--bg': `${overallColor}0d`, '--border': `${overallColor}30` }}>
          <div className="st-banner-dot" style={{ background: overallColor, boxShadow: `0 0 8px ${overallColor}` }} />
          <div className="st-banner-text">
            <strong>{overallLabel}</strong>
            <span>{bot ? `${bot.username}` : 'Snag Bot'} · Discord Bot Service</span>
          </div>
          {online && latencyMs >= 0 && (
            <div className="st-banner-ping">
              <span className="st-banner-ping-label">WS Ping</span>
              <span className="st-banner-ping-val" style={{ color: latencyColor }}>{latencyMs}ms</span>
              <LatencyBar ms={latencyMs} />
            </div>
          )}
        </div>

        {/* STAT CARDS */}
        {loading && !data ? (
          <div className="st-loader"><RefreshCw size={30} color="#8b5cf6" className="st-spin" /></div>
        ) : (
          <div className="st-cards">
            {statCards.map(({ icon, label, value, accent }) => (
              <div key={label} className="st-card" style={{ '--accent': accent }}>
                <div className="st-card-icon">{icon}</div>
                <div className="st-card-val">{value}</div>
                <div className="st-card-label">{label}</div>
              </div>
            ))}
          </div>
        )}

        {/* SERVICES */}
        <div className="st-section">
          <div className="st-section-hd">
            <Terminal size={14} color="#8b5cf6" />
            <span>Services</span>
            <div className="st-section-hd-pill" style={{ background: allOk ? 'rgba(0,230,118,0.1)' : 'rgba(255,145,0,0.1)', color: allOk ? '#00e676' : '#ff9100', border: `1px solid ${allOk ? 'rgba(0,230,118,0.25)' : 'rgba(255,145,0,0.25)'}` }}>
              {SERVICES.filter(s => s.check(online, stats, data)).length} / {SERVICES.length} operational
            </div>
          </div>
          <div className="st-services">
            {SERVICES.map((svc, i) => {
              const ok = svc.check(online, stats, data);
              return (
                <div key={svc.key} className="st-svc" style={{ animationDelay: `${i * 40}ms` }}>
                  <div className="st-svc-icon-wrap" style={{ background: ok ? 'rgba(0,230,118,0.07)' : 'rgba(255,23,68,0.07)', border: `1px solid ${ok ? 'rgba(0,230,118,0.15)' : 'rgba(255,23,68,0.15)'}` }}>
                    <svc.Icon size={16} color={ok ? '#00e676' : '#ff4d6d'} />
                  </div>
                  <div className="st-svc-info">
                    <span className="st-svc-name">{svc.name}</span>
                    <span className="st-svc-desc">{svc.desc}</span>
                  </div>
                  <div className="st-svc-badge" style={{ background: ok ? 'rgba(0,230,118,0.08)' : 'rgba(255,23,68,0.08)', color: ok ? '#00e676' : '#ff4d6d', border: `1px solid ${ok ? 'rgba(0,230,118,0.2)' : 'rgba(255,23,68,0.2)'}` }}>
                    <div className="st-svc-dot" style={{ background: ok ? '#00e676' : '#ff1744', boxShadow: `0 0 5px ${ok ? '#00e676' : '#ff1744'}` }} />
                    {ok ? 'Operational' : 'Down'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* INCIDENT HISTORY */}
        <div className="st-section">
          <div className="st-section-hd">
            <Clock size={14} color="#8b5cf6" />
            <span>Incident History</span>
          </div>
          <div className="st-incident-empty">
            <CheckCircle2 size={28} color="#00e67640" />
            <p>No incidents reported.</p>
            <span>Snag has been running without any recorded incidents.</span>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
