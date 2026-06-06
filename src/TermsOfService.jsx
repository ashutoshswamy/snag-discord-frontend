import { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import './Landing.css';
import './Legal.css';

const TOC = [
  { id: 'agreement',   label: 'Agreement' },
  { id: 'eligibility', label: 'Eligibility' },
  { id: 'bot-use',     label: 'Use of the Bot' },
  { id: 'prohibited',  label: 'Prohibited Use' },
  { id: 'dashboard',   label: 'Dashboard Access' },
  { id: 'giveaways',   label: 'Giveaways & Drops' },
  { id: 'termination', label: 'Termination' },
  { id: 'disclaimers', label: 'Disclaimers' },
  { id: 'liability',   label: 'Liability' },
  { id: 'changes',     label: 'Changes' },
  { id: 'contact',     label: 'Contact' },
];

export default function TermsOfService() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    document.title = 'Terms of Service — Snag Bot';
    const onScroll = () => setScrolled(window.scrollY > 36);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="lp-root">

      {/* ── NAV ── */}
      <header className={`lp-nav ${scrolled ? 'lp-nav--scrolled' : ''}`}>
        <div className="lp-nav-inner">
          <RouterLink to="/" className="lp-nav-brand" style={{ textDecoration: 'none' }}>
            <img src="/Logo.png" alt="Snag" className="lp-nav-logo" />
            <span className="lp-nav-name">SNAG</span>
          </RouterLink>

          <nav className="lp-nav-links">
            <RouterLink to="/#features">Features</RouterLink>
            <RouterLink to="/#how">How it works</RouterLink>
            <RouterLink to="/commands">Commands</RouterLink>
          </nav>

          <div className="lp-nav-ctas">
            <RouterLink to="/" className="lp-btn lp-btn-outline">Home</RouterLink>
            <RouterLink to="/dashboard" className="lp-btn lp-btn-primary">Dashboard</RouterLink>
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
            <RouterLink to="/#features" onClick={() => setMobileMenuOpen(false)}>Features</RouterLink>
            <RouterLink to="/#how" onClick={() => setMobileMenuOpen(false)}>How it works</RouterLink>
            <RouterLink to="/commands" onClick={() => setMobileMenuOpen(false)}>Commands</RouterLink>
            <RouterLink to="/" className="lp-btn lp-btn-outline" style={{ textAlign: 'center' }} onClick={() => setMobileMenuOpen(false)}>Home</RouterLink>
            <RouterLink to="/dashboard" className="lp-btn lp-btn-primary" style={{ textAlign: 'center', justifyContent: 'center' }} onClick={() => setMobileMenuOpen(false)}>Dashboard</RouterLink>
          </div>
        )}
      </header>

      {/* ── HERO ── */}
      <section className="legal-hero" style={{ marginTop: '72px' }}>
        <div className="lp-container legal-hero-inner">
          <div className="legal-eyebrow">
            <span className="legal-eyebrow-line" />
            <span className="legal-eyebrow-label">Legal</span>
          </div>
          <h1 className="legal-hero-title">
            Terms of <span>Service</span>
          </h1>
          <div className="legal-hero-meta">
            <span className="legal-hero-meta-item">Snag Bot</span>
            <span className="legal-hero-meta-dot" />
            <span className="legal-hero-meta-item">Effective: June 2026</span>
            <span className="legal-hero-meta-dot" />
            <span className="legal-hero-meta-item">Last updated: June 6, 2026</span>
          </div>
        </div>
      </section>

      {/* ── BODY ── */}
      <div className="lp-container">
        <div className="legal-body">

          {/* Sidebar TOC */}
          <aside className="legal-toc">
            <p className="legal-toc-label">Contents</p>
            <ul className="legal-toc-list">
              {TOC.map(({ id, label }) => (
                <li key={id}>
                  <a href={`#${id}`}>{label}</a>
                </li>
              ))}
            </ul>
          </aside>

          {/* Main content */}
          <main className="legal-content">

            <div className="legal-section" id="agreement">
              <p className="legal-section-num">01</p>
              <h2 className="legal-section-title">Agreement to Terms</h2>
              <div className="legal-section-body">
                <p>
                  These Terms of Service ("Terms") govern your access to and use of Snag Bot ("Snag", "the Bot", "we", "us") — including the Discord bot, the web dashboard, and any associated services. By adding Snag to a Discord server, using any of its commands, or accessing the dashboard, you agree to be bound by these Terms.
                </p>
                <p>
                  If you are adding Snag on behalf of a Discord server, you represent that you have the authority to bind that server and its administrators to these Terms.
                </p>
                <div className="legal-highlight">
                  <p>
                    <strong>Short version:</strong> Use Snag in good faith, don't abuse it or other users, and respect Discord's own rules. We reserve the right to remove access for misuse.
                  </p>
                </div>
              </div>
            </div>

            <div className="legal-section" id="eligibility">
              <p className="legal-section-num">02</p>
              <h2 className="legal-section-title">Eligibility</h2>
              <div className="legal-section-body">
                <p>To use Snag, you must:</p>
                <ul className="legal-ul">
                  <li>Meet Discord's minimum age requirement (13 years old, or higher in your jurisdiction).</li>
                  <li>Comply with Discord's <a href="https://discord.com/terms" target="_blank" rel="noreferrer">Terms of Service</a> and <a href="https://discord.com/guidelines" target="_blank" rel="noreferrer">Community Guidelines</a>.</li>
                  <li>Have the "Manage Server" permission in a Discord server to add Snag or configure it via the dashboard.</li>
                </ul>
                <p>
                  Access may be suspended or terminated for users or servers that violate these requirements.
                </p>
              </div>
            </div>

            <div className="legal-section" id="bot-use">
              <p className="legal-section-num">03</p>
              <h2 className="legal-section-title">Use of the Bot</h2>
              <div className="legal-section-body">
                <p>
                  Snag is provided as a giveaway and instant drop management tool for Discord servers. You are permitted to:
                </p>
                <ul className="legal-ul">
                  <li>Add Snag to Discord servers where you have the "Manage Server" permission.</li>
                  <li>Configure Snag's features through the web dashboard.</li>
                  <li>Use all commands (<code style={{ background: 'rgba(139,92,246,0.1)', padding: '2px 6px', borderRadius: '4px', fontSize: '13px', color: 'var(--lp-primary-hover)' }}>/gstart</code>, <code style={{ background: 'rgba(139,92,246,0.1)', padding: '2px 6px', borderRadius: '4px', fontSize: '13px', color: 'var(--lp-primary-hover)' }}>/gend</code>, <code style={{ background: 'rgba(139,92,246,0.1)', padding: '2px 6px', borderRadius: '4px', fontSize: '13px', color: 'var(--lp-primary-hover)' }}>/greroll</code>, <code style={{ background: 'rgba(139,92,246,0.1)', padding: '2px 6px', borderRadius: '4px', fontSize: '13px', color: 'var(--lp-primary-hover)' }}>/gdrop</code>) as described in the documentation.</li>
                  <li>Create legitimate giveaways and instant drop events for your community.</li>
                </ul>
                <p>
                  Snag is provided free of charge. We reserve the right to introduce usage limits or feature restrictions in the future, with reasonable notice to existing users.
                </p>
              </div>
            </div>

            <div className="legal-section" id="prohibited">
              <p className="legal-section-num">04</p>
              <h2 className="legal-section-title">Prohibited Use</h2>
              <div className="legal-section-body">
                <p>You agree not to use Snag to:</p>
                <ol className="legal-ol">
                  <li>Create fraudulent or deceptive giveaways — including giveaways where prizes are not intended to be fulfilled.</li>
                  <li>Violate Discord's Terms of Service or Community Guidelines.</li>
                  <li>Attempt to exploit bugs or vulnerabilities in Snag to manipulate winner selection or affect other servers.</li>
                  <li>Automate interactions with Snag in ways that circumvent rate limits or generate abnormal load.</li>
                  <li>Reverse engineer, copy, or attempt to replicate Snag's codebase, infrastructure, or intellectual property without written permission.</li>
                  <li>Use Snag in servers that promote illegal activity, hate speech, or content that violates Discord's policies.</li>
                </ol>
                <div className="legal-warning">
                  <p>
                    Violations may result in immediate and permanent removal of Snag from your server, with no obligation to provide advance notice.
                  </p>
                </div>
              </div>
            </div>

            <div className="legal-section" id="dashboard">
              <p className="legal-section-num">05</p>
              <h2 className="legal-section-title">Dashboard Access</h2>
              <div className="legal-section-body">
                <p>
                  The Snag web dashboard allows server administrators to manage giveaways, configure bot settings, and view draw analytics. Dashboard access is authenticated via Discord OAuth2.
                </p>
                <ul className="legal-ul">
                  <li>You are responsible for maintaining the confidentiality of your Discord account credentials.</li>
                  <li>Dashboard sessions are tied to your Discord account via a signed, HTTP-only cookie. Do not share session tokens with others.</li>
                  <li>Only users with "Manage Server" permission can access a server's dashboard. This permission is verified on every request.</li>
                  <li>We reserve the right to revoke dashboard access for any account engaging in abuse or policy violations.</li>
                </ul>
              </div>
            </div>

            <div className="legal-section" id="giveaways">
              <p className="legal-section-num">06</p>
              <h2 className="legal-section-title">Giveaways & Instant Drops</h2>
              <div className="legal-section-body">
                <p>
                  Snag facilitates giveaway and instant drop events within Discord servers. Regarding these features:
                </p>
                <ul className="legal-ul">
                  <li><strong>Prize responsibility:</strong> The server administrator who creates a giveaway is solely responsible for fulfilling the prize to the selected winner(s). Snag has no involvement in prize delivery.</li>
                  <li><strong>Winner selection:</strong> Winners are selected using a cryptographically random process. Snag makes no guarantees about specific outcomes.</li>
                  <li><strong>Disputes:</strong> Any dispute regarding a giveaway prize is strictly between the server administrator and the participants. Snag disclaims all liability for prize-related disputes.</li>
                  <li><strong>Rerolls:</strong> The reroll feature (<code style={{ background: 'rgba(139,92,246,0.1)', padding: '2px 6px', borderRadius: '4px', fontSize: '13px', color: 'var(--lp-primary-hover)' }}>/greroll</code>) is provided to select a new winner if the original winner cannot claim their prize. This feature must not be used to manipulate outcomes unfairly.</li>
                </ul>
              </div>
            </div>

            <div className="legal-section" id="termination">
              <p className="legal-section-num">07</p>
              <h2 className="legal-section-title">Termination</h2>
              <div className="legal-section-body">
                <p>
                  Either party may terminate the relationship at any time:
                </p>
                <ul className="legal-ul">
                  <li><strong>You</strong> can remove Snag from your server at any time via Discord's server settings. Your data will be retained until you request deletion per our Privacy Policy.</li>
                  <li><strong>We</strong> may remove Snag from a server, suspend dashboard access, or shut down the service entirely, with or without prior notice, for reasons including but not limited to: ToS violations, abuse, legal requirements, or discontinuation of the service.</li>
                </ul>
                <p>
                  Upon termination, your license to use Snag ends immediately. These Terms survive termination where their nature requires it (Disclaimers, Liability, etc.).
                </p>
              </div>
            </div>

            <div className="legal-section" id="disclaimers">
              <p className="legal-section-num">08</p>
              <h2 className="legal-section-title">Disclaimers</h2>
              <div className="legal-section-body">
                <p>
                  Snag is provided <strong>"as is"</strong> and <strong>"as available"</strong> without warranties of any kind, either express or implied. We specifically disclaim:
                </p>
                <ul className="legal-ul">
                  <li>Any warranty of merchantability, fitness for a particular purpose, or non-infringement.</li>
                  <li>Guarantees of uptime, availability, or uninterrupted service. Discord API outages, server maintenance, or unforeseen issues may cause downtime.</li>
                  <li>Responsibility for actions taken by server administrators using Snag's giveaway features or moderation settings.</li>
                </ul>
                <p>
                  Snag is not affiliated with, endorsed by, or in any way officially connected with Discord Inc.
                </p>
              </div>
            </div>

            <div className="legal-section" id="liability">
              <p className="legal-section-num">09</p>
              <h2 className="legal-section-title">Limitation of Liability</h2>
              <div className="legal-section-body">
                <p>
                  To the maximum extent permitted by applicable law, Snag and its developers shall not be liable for any indirect, incidental, special, consequential, or punitive damages — including but not limited to:
                </p>
                <ul className="legal-ul">
                  <li>Unfulfilled prizes in giveaways created by server administrators.</li>
                  <li>Disruptions caused by Discord API changes, outages, or policy changes by Discord Inc.</li>
                  <li>Loss of giveaway data or entry records due to technical failures.</li>
                  <li>Actions taken by other server members as a result of giveaway outcomes.</li>
                </ul>
                <p>
                  Our total liability for any claim arising from your use of Snag shall not exceed the amount you have paid us in the past 12 months (which, for free users, is zero).
                </p>
              </div>
            </div>

            <div className="legal-section" id="changes">
              <p className="legal-section-num">10</p>
              <h2 className="legal-section-title">Changes to Terms</h2>
              <div className="legal-section-body">
                <p>
                  We reserve the right to modify these Terms at any time. When we make significant changes, we will:
                </p>
                <ul className="legal-ul">
                  <li>Update the "Last updated" date at the top of this page.</li>
                  <li>Announce major changes through the Snag support server or this website.</li>
                </ul>
                <p>
                  Continued use of Snag after changes are posted constitutes acceptance of the updated Terms. If you do not agree to the revised Terms, you should remove Snag from your server.
                </p>
              </div>
            </div>

            <div className="legal-section" id="contact">
              <p className="legal-section-num">11</p>
              <h2 className="legal-section-title">Contact</h2>
              <div className="legal-section-body">
                <p>
                  Questions about these Terms, requests for clarification, or reports of ToS violations can be directed to:
                </p>
                <div className="legal-contact-box">
                  <div className="legal-contact-info">
                    <strong>Snag Bot — Ashutosh Swamy</strong>
                    For ToS questions, abuse reports, or legal inquiries.
                  </div>
                  <a
                    href="https://ashutoshswamy.in"
                    target="_blank"
                    rel="noreferrer"
                    className="lp-btn lp-btn-outline"
                    style={{ flexShrink: 0 }}
                  >
                    Contact Us
                  </a>
                </div>
                <p style={{ marginTop: '16px' }}>
                  These Terms are governed by applicable law. Any disputes shall be resolved through good-faith negotiation before any formal legal proceedings.
                </p>
              </div>
            </div>

          </main>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <footer className="legal-footer">
        <div className="lp-container">
          <div className="legal-footer-inner">
            <div className="legal-footer-links">
              <RouterLink to="/">Home</RouterLink>
              <RouterLink to="/commands">Commands</RouterLink>
              <RouterLink to="/privacy">Privacy Policy</RouterLink>
              <a href="https://github.com/ashutoshswamy" target="_blank" rel="noreferrer">GitHub</a>
            </div>
            <p className="legal-footer-copy">© 2026 Snag Bot. Built for Discord communities.</p>
          </div>
        </div>
      </footer>

    </div>
  );
}
