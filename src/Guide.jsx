import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen, Server, ShieldCheck, Gift, Zap, RotateCcw,
  Square, List, BarChart3, MousePointerClick, Wrench,
} from 'lucide-react';
import './Guide.css';

const SECTIONS = [
  { id: 'getting-started', label: 'Getting Started',    Icon: BookOpen,         color: '#8b5cf6' },
  { id: 'giveaways',       label: 'Timed Giveaways',    Icon: Gift,             color: '#8b5cf6' },
  { id: 'drops',           label: 'Instant Drops',      Icon: Zap,              color: '#ff9100' },
  { id: 'managing',        label: 'Managing Drawings',  Icon: RotateCcw,        color: '#00e676' },
  { id: 'dashboard',       label: 'Web Dashboard',      Icon: MousePointerClick, color: '#a78bfa' },
  { id: 'permissions',     label: 'Permissions',        Icon: ShieldCheck,      color: '#f43f5e' },
  { id: 'utility',         label: 'Utility',            Icon: Wrench,           color: '#38bdf8' },
];

function Tip({ children }) {
  return <div className="guide-tip"><span className="guide-tip-label">TIP</span>{children}</div>;
}

function Warn({ children }) {
  return <div className="guide-warn"><span className="guide-warn-label">NOTE</span>{children}</div>;
}

function CmdRef({ name }) {
  return <code className="guide-cmd-ref">/{name}</code>;
}

function Step({ n, children }) {
  return (
    <div className="guide-step">
      <span className="guide-step-num">{n}</span>
      <span>{children}</span>
    </div>
  );
}

function Table({ headers, rows }) {
  return (
    <div className="guide-table-wrap">
      <table className="guide-table">
        <thead>
          <tr>{headers.map(h => <th key={h}>{h}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>{row.map((cell, j) => <td key={j}>{cell}</td>)}</tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function Guide() {
  const [activeId, setActiveId] = useState('getting-started');
  const observerRef = useRef(null);

  useEffect(() => {
    document.title = 'Guide — Snag Bot';
    return () => { document.title = 'Snag — Free Discord Giveaway Bot'; };
  }, []);

  useEffect(() => {
    const els = document.querySelectorAll('.guide-section[id]');
    observerRef.current = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: '-20% 0px -70% 0px', threshold: 0 }
    );
    els.forEach(el => observerRef.current.observe(el));
    return () => observerRef.current?.disconnect();
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="guide-root">
      <div className="guide-bg-grid" />
      <div className="guide-bg-glow-1" />
      <div className="guide-bg-glow-2" />

      {/* Nav */}
      <header className="guide-nav">
        <Link to="/" className="guide-nav-brand">
          <img src="/Logo.png" alt="Snag" className="guide-nav-logo" />
          <span className="guide-nav-name">SNAG</span>
        </Link>
        <div className="guide-nav-right">
          <Link to="/guide" className="guide-nav-link active">Guide</Link>
          <Link to="/commands" className="guide-nav-link">Commands</Link>
          <Link to="/" className="guide-nav-link">← Home</Link>
        </div>
      </header>

      {/* Hero */}
      <div className="guide-hero">
        <div className="guide-hero-eyebrow">DOCUMENTATION</div>
        <h1 className="guide-hero-title">How Snag Works</h1>
        <p className="guide-hero-desc">
          A complete guide to every feature — from inviting the bot to running your first giveaway and managing winners.
        </p>
      </div>

      {/* Body */}
      <div className="guide-body">

        {/* Sidebar */}
        <aside className="guide-sidebar">
          <div className="guide-sidebar-label">ON THIS PAGE</div>
          {SECTIONS.map(({ id, label, Icon, color }) => (
            <button
              key={id}
              className={`guide-nav-item ${activeId === id ? 'active' : ''}`}
              onClick={() => scrollTo(id)}
              style={activeId === id ? { color, borderLeftColor: color } : {}}
            >
              <Icon size={13} />
              <span>{label}</span>
            </button>
          ))}
        </aside>

        {/* Content */}
        <main className="guide-main">

          {/* ── GETTING STARTED ── */}
          <section id="getting-started" className="guide-section">
            <div className="guide-section-header" style={{ '--sec-color': '#8b5cf6' }}>
              <BookOpen size={22} />
              <h2>Getting Started</h2>
            </div>
            <p className="guide-section-intro">
              Snag is a focused Discord giveaway bot. Invite it, run a command, and your first draw is live in under a minute — no complicated setup required.
            </p>
            <h3 className="guide-sub">Quick Setup</h3>
            <Step n={1}>Click <strong>Add to Discord</strong> on the homepage and authorize Snag with <strong>Administrator</strong> permission so it can post embeds and manage messages in any channel.</Step>
            <Step n={2}>Snag is ready immediately after joining — no configuration commands needed to start running giveaways.</Step>
            <Step n={3}>Use <CmdRef name="gstart" /> or the web dashboard to launch your first timed giveaway, or <CmdRef name="gdrop" /> for an instant claim drop.</Step>
            <Step n={4}>Use <CmdRef name="help" /> in Discord at any time for a built-in command overview.</Step>
            <Tip>The web dashboard lets admins create and manage drawings without typing slash commands — log in with your Discord account at the top right.</Tip>
          </section>

          {/* ── GIVEAWAYS ── */}
          <section id="giveaways" className="guide-section">
            <div className="guide-section-header" style={{ '--sec-color': '#8b5cf6' }}>
              <Gift size={22} />
              <h2>Timed Giveaways</h2>
            </div>
            <p className="guide-section-intro">
              Timed giveaways run for a set duration and automatically draw winners when the timer expires. Members enter by clicking the button in the giveaway embed.
            </p>
            <h3 className="guide-sub">Starting a Giveaway</h3>
            <Step n={1}>Run <CmdRef name="gstart" /> in the channel where you want the giveaway posted. A Discord modal popup will appear.</Step>
            <Step n={2}>Fill in the <strong>Prize</strong> (e.g. <em>Discord Nitro 1 Month</em>), <strong>Duration</strong> (e.g. <code className="guide-inline-code">30m</code>, <code className="guide-inline-code">2h</code>, <code className="guide-inline-code">1d</code>, <code className="guide-inline-code">1w</code>), and <strong>Number of Winners</strong> (1–20).</Step>
            <Step n={3}>Submit the modal. Snag posts the giveaway embed with an <strong>Enter Giveaway</strong> button.</Step>
            <Step n={4}>When the timer ends, Snag draws winners from all button-click entries and announces them in the same channel.</Step>
            <h3 className="guide-sub">Duration Format</h3>
            <Table
              headers={['Input', 'Meaning']}
              rows={[
                ['30m', '30 minutes'],
                ['2h', '2 hours'],
                ['1d', '1 day'],
                ['1w', '1 week'],
              ]}
            />
            <Tip>You can also launch giveaways directly from the web dashboard without using slash commands.</Tip>
          </section>

          {/* ── DROPS ── */}
          <section id="drops" className="guide-section">
            <div className="guide-section-header" style={{ '--sec-color': '#ff9100' }}>
              <Zap size={22} />
              <h2>Instant Drops</h2>
            </div>
            <p className="guide-section-intro">
              Instant drops reward the very first person to click the claim button. Great for rewarding active chat rooms in real time — no waiting for a timer.
            </p>
            <Step n={1}>Run <CmdRef name="gdrop" /> in any channel. A modal opens asking for the <strong>Prize</strong>.</Step>
            <Step n={2}>Submit the modal. Snag posts the drop embed with a <strong>Claim Drop</strong> button.</Step>
            <Step n={3}>The first member to click claims the prize immediately. The embed updates to show who won and when.</Step>
            <Warn>Drops have no entry queue — once claimed, the draw is over. Use <CmdRef name="gstart" /> if you want multiple entrants competing fairly.</Warn>
          </section>

          {/* ── MANAGING DRAWINGS ── */}
          <section id="managing" className="guide-section">
            <div className="guide-section-header" style={{ '--sec-color': '#00e676' }}>
              <RotateCcw size={22} />
              <h2>Managing Drawings</h2>
            </div>
            <p className="guide-section-intro">
              Admins have full control over active and completed drawings — end them early, reroll winners, or browse what's currently running.
            </p>
            <h3 className="guide-sub">End Early</h3>
            <p><CmdRef name="gend" /> opens a select menu listing all active timed giveaways. Pick one to end it immediately and draw winners right away — useful if you need to close a giveaway ahead of schedule.</p>
            <h3 className="guide-sub">Reroll a Winner</h3>
            <p><CmdRef name="greroll" /> shows the last 25 completed giveaways. Select one to pick a new winner from the existing entries pool — ideal when a winner is unreachable or didn't respond.</p>
            <h3 className="guide-sub">View Active Drawings</h3>
            <p><CmdRef name="glist" /> displays all active drawings in an interactive embed. Use the filter buttons to switch between <strong>All</strong>, <strong>Giveaways</strong>, and <strong>Drops</strong>, or hit <strong>Refresh</strong> to pull live data.</p>
            <Table
              headers={['Command', 'What it does', 'Who can use']}
              rows={[
                [<CmdRef name="gend" />, 'End an active giveaway early and draw winners', 'Admin'],
                [<CmdRef name="greroll" />, 'Reroll a winner from a completed drawing', 'Admin'],
                [<CmdRef name="glist" />, 'Browse all active giveaways and drops', 'Everyone'],
              ]}
            />
            <Tip>All three commands — plus <CmdRef name="gstart" /> and <CmdRef name="gdrop" /> — are also available from the web dashboard.</Tip>
          </section>

          {/* ── WEB DASHBOARD ── */}
          <section id="dashboard" className="guide-section">
            <div className="guide-section-header" style={{ '--sec-color': '#a78bfa' }}>
              <MousePointerClick size={22} />
              <h2>Web Dashboard</h2>
            </div>
            <p className="guide-section-intro">
              The Snag web dashboard lets server admins create, end, and reroll drawings without touching Discord slash commands — everything in one place.
            </p>
            <h3 className="guide-sub">Logging In</h3>
            <Step n={1}>Click <strong>Dashboard</strong> on the homepage (or go directly to the dashboard URL).</Step>
            <Step n={2}>You'll be redirected to Discord OAuth2 to authorize Snag to read your account info. No additional permissions are granted at this step.</Step>
            <Step n={3}>After login, you'll see a list of servers you share with Snag where you have <strong>Manage Server</strong> permission.</Step>
            <Step n={4}>Click a server card to open that server's giveaway dashboard.</Step>
            <h3 className="guide-sub">What You Can Do</h3>
            <Table
              headers={['Action', 'Equivalent Command']}
              rows={[
                ['Create timed giveaway', <CmdRef name="gstart" />],
                ['Launch instant drop', <CmdRef name="gdrop" />],
                ['End giveaway early', <CmdRef name="gend" />],
                ['Reroll winner', <CmdRef name="greroll" />],
                ['View all active drawings', <CmdRef name="glist" />],
              ]}
            />
            <Warn>Only users with <strong>Manage Server</strong> or <strong>Administrator</strong> permission in that Discord server can access its dashboard panel.</Warn>
          </section>

          {/* ── PERMISSIONS ── */}
          <section id="permissions" className="guide-section">
            <div className="guide-section-header" style={{ '--sec-color': '#f43f5e' }}>
              <ShieldCheck size={22} />
              <h2>Permissions</h2>
            </div>
            <p className="guide-section-intro">
              Snag uses Discord's built-in permission system to decide who can run management commands and access the dashboard.
            </p>
            <Table
              headers={['Permission', 'What it unlocks']}
              rows={[
                ['None (any member)', <><CmdRef name="glist" />, <CmdRef name="ping" />, <CmdRef name="help" /> — read-only commands</>],
                ['Manage Server', 'All drawing commands + full web dashboard access'],
                ['Administrator', 'Same as Manage Server — also required for Snag bot itself'],
              ]}
            />
            <Tip>Invite Snag with <strong>Administrator</strong> so it can post in any channel, update embeds, and manage button interactions without per-channel permission errors.</Tip>
          </section>

          {/* ── UTILITY ── */}
          <section id="utility" className="guide-section">
            <div className="guide-section-header" style={{ '--sec-color': '#38bdf8' }}>
              <Wrench size={22} />
              <h2>Utility</h2>
            </div>
            <p className="guide-section-intro">
              Two lightweight utility commands available to everyone.
            </p>
            <Table
              headers={['Command', 'What it does']}
              rows={[
                [<CmdRef name="ping" />, "Check Snag's WebSocket latency and Discord API response time — useful for verifying the bot is online and healthy."],
                [<CmdRef name="help" />, 'Shows a full in-Discord command reference with descriptions, usage, and permission requirements.'],
              ]}
            />
          </section>

        </main>
      </div>
    </div>
  );
}
