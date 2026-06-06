import { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import './Landing.css';
import './Legal.css';

const TOC = [
  { id: 'overview',    label: 'Overview' },
  { id: 'data',        label: 'Data We Collect' },
  { id: 'how-we-use', label: 'How We Use Data' },
  { id: 'retention',  label: 'Data Retention' },
  { id: 'sharing',    label: 'Data Sharing' },
  { id: 'security',   label: 'Security' },
  { id: 'rights',     label: 'Your Rights' },
  { id: 'children',   label: 'Children' },
  { id: 'changes',    label: 'Policy Changes' },
  { id: 'contact',    label: 'Contact' },
];

export default function PrivacyPolicy() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    document.title = 'Privacy Policy — Snag Bot';
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
            Privacy <span>Policy</span>
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

            <div className="legal-section" id="overview">
              <p className="legal-section-num">01</p>
              <h2 className="legal-section-title">Overview</h2>
              <div className="legal-section-body">
                <p>
                  Snag Bot ("Snag", "we", "us", or "our") is a Discord bot that provides automated giveaway and instant drop management services to Discord servers. This Privacy Policy explains what information we collect when you use Snag, how we use it, and your choices regarding that information.
                </p>
                <p>
                  By adding Snag to your Discord server or accessing the Snag web dashboard, you agree to the collection and use of information as described in this policy.
                </p>
                <div className="legal-highlight">
                  <p>
                    <strong>Short version:</strong> We collect only what's necessary to run Snag's giveaway and drop features — Discord IDs, server configuration, and giveaway entry data. We don't sell your data, and we never read your message content.
                  </p>
                </div>
              </div>
            </div>

            <div className="legal-section" id="data">
              <p className="legal-section-num">02</p>
              <h2 className="legal-section-title">Data We Collect</h2>
              <div className="legal-section-body">
                <p>We collect the minimum data required to operate Snag's features. This includes:</p>

                <div className="legal-data-grid">
                  {[
                    { label: 'Discord User IDs', desc: 'Numeric identifiers for users who enter giveaways or instant drops' },
                    { label: 'Guild (Server) IDs', desc: 'Identifier of the Discord server Snag is operating in' },
                    { label: 'Channel IDs', desc: 'Used to configure where giveaway announcements and logs are posted' },
                    { label: 'Role IDs', desc: 'Used for Manager Role configuration and permission checks' },
                    { label: 'Giveaway Records', desc: 'Prize name, duration, winner count, host ID, and entry participant IDs' },
                    { label: 'Server Configuration', desc: 'Manager role, logging channel, theme color, and telemetry settings' },
                  ].map(({ label, desc }) => (
                    <div key={label} className="legal-data-card">
                      <span className="legal-data-dot" />
                      <div>
                        <p className="legal-data-label">{label}</p>
                        <p className="legal-data-desc">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <p style={{ marginTop: '24px' }}>
                  <strong>Dashboard authentication:</strong> When you log in to the Snag dashboard via Discord OAuth2, we receive your Discord username, avatar, and the list of servers where you have the "Manage Server" permission. We store a signed session cookie to maintain your session — no passwords are stored.
                </p>
              </div>
            </div>

            <div className="legal-section" id="how-we-use">
              <p className="legal-section-num">03</p>
              <h2 className="legal-section-title">How We Use Data</h2>
              <div className="legal-section-body">
                <p>All data collected is used solely to provide Snag's functionality. Specifically:</p>
                <ul className="legal-ul">
                  <li>Giveaway and entry data is used to randomly select winners and announce results in your server.</li>
                  <li>Participant IDs are used to enable reroll functionality without re-entering data.</li>
                  <li>Server configuration is used to apply theme colors, route log messages to the correct channel, and enforce manager role permissions.</li>
                  <li>Dashboard OAuth data is used to authenticate you and display only the servers you administrate.</li>
                  <li>Aggregated entry counts are used to display analytics charts in the dashboard if telemetry is enabled.</li>
                </ul>
                <p>
                  We do not use your data for advertising, profiling, or any purpose beyond operating the features you've configured.
                </p>
              </div>
            </div>

            <div className="legal-section" id="retention">
              <p className="legal-section-num">04</p>
              <h2 className="legal-section-title">Data Retention</h2>
              <div className="legal-section-body">
                <p>
                  Data is retained for as long as Snag is active in your server.
                </p>
                <ul className="legal-ul">
                  <li><strong>Active servers:</strong> All giveaway records, entry data, and configuration are kept for as long as the bot remains in the server.</li>
                  <li><strong>Ended giveaways:</strong> Concluded giveaways are marked as ended but retained for history and reroll purposes.</li>
                  <li><strong>Dashboard sessions:</strong> Session cookies expire after 7 days and are not persisted beyond that.</li>
                  <li><strong>After removal:</strong> You may contact us to request full deletion of your server's data at any time.</li>
                </ul>
                <p>
                  Server administrators can request immediate deletion of all server data by contacting us (see Contact section below).
                </p>
              </div>
            </div>

            <div className="legal-section" id="sharing">
              <p className="legal-section-num">05</p>
              <h2 className="legal-section-title">Data Sharing</h2>
              <div className="legal-section-body">
                <p><strong>We do not sell, rent, or trade your data.</strong> The only circumstances under which data is shared with third parties are:</p>
                <ul className="legal-ul">
                  <li><strong>Supabase:</strong> Our database infrastructure is provided by Supabase. Data is stored in their hosted PostgreSQL service and is subject to Supabase's privacy policy. Supabase is SOC 2 compliant.</li>
                  <li><strong>Discord API:</strong> All bot interactions go through Discord's infrastructure. Discord's Terms of Service and Privacy Policy apply.</li>
                  <li><strong>Legal requirements:</strong> We may disclose data if required by law or to protect the rights, property, or safety of users.</li>
                </ul>
                <div className="legal-highlight">
                  <p>No analytics companies, ad networks, or data brokers receive any information from Snag.</p>
                </div>
              </div>
            </div>

            <div className="legal-section" id="security">
              <p className="legal-section-num">06</p>
              <h2 className="legal-section-title">Security</h2>
              <div className="legal-section-body">
                <p>
                  We take reasonable precautions to protect data stored by Snag. This includes:
                </p>
                <ul className="legal-ul">
                  <li>All API communication is encrypted over HTTPS/TLS.</li>
                  <li>Dashboard authentication uses signed HTTP-only session cookies — your Discord credentials are never seen by Snag.</li>
                  <li>Database access is restricted to application-level credentials with least-privilege access.</li>
                  <li>Supabase enforces row-level security policies on all data tables.</li>
                </ul>
                <p>
                  No system is perfectly secure. If you discover a security vulnerability, please report it to us immediately rather than disclosing it publicly.
                </p>
              </div>
            </div>

            <div className="legal-section" id="rights">
              <p className="legal-section-num">07</p>
              <h2 className="legal-section-title">Your Rights</h2>
              <div className="legal-section-body">
                <p>You have the following rights regarding your data:</p>
                <ol className="legal-ol">
                  <li><strong>Access:</strong> You can request a summary of data Snag has stored about your Discord account or server.</li>
                  <li><strong>Deletion:</strong> You can request deletion of all data associated with your Discord account or your server.</li>
                  <li><strong>Correction:</strong> Server administrators can modify giveaway settings and configuration directly from the dashboard.</li>
                  <li><strong>Opt-out of telemetry:</strong> You can disable analytics data collection at any time via Settings → Telemetry in the dashboard.</li>
                </ol>
                <p>
                  To exercise any of these rights, contact us using the information in the Contact section. We will respond within 30 days.
                </p>
              </div>
            </div>

            <div className="legal-section" id="children">
              <p className="legal-section-num">08</p>
              <h2 className="legal-section-title">Children's Privacy</h2>
              <div className="legal-section-body">
                <p>
                  Snag is not directed at children under the age of 13, consistent with Discord's own minimum age requirement. We do not knowingly collect personal information from children under 13. If we become aware that we have inadvertently received data from a user under 13, we will delete that information promptly.
                </p>
                <div className="legal-warning">
                  <p>
                    Discord requires all users to be at least 13 years old. By using Snag, you confirm you meet Discord's minimum age requirement.
                  </p>
                </div>
              </div>
            </div>

            <div className="legal-section" id="changes">
              <p className="legal-section-num">09</p>
              <h2 className="legal-section-title">Policy Changes</h2>
              <div className="legal-section-body">
                <p>
                  We may update this Privacy Policy from time to time. When we do, we'll update the "Last updated" date at the top of this page. For significant changes, we may provide additional notice through the Snag support server or an announcement on this website.
                </p>
                <p>
                  Continued use of Snag after changes are posted constitutes your acceptance of the revised policy.
                </p>
              </div>
            </div>

            <div className="legal-section" id="contact">
              <p className="legal-section-num">10</p>
              <h2 className="legal-section-title">Contact</h2>
              <div className="legal-section-body">
                <p>
                  If you have questions about this Privacy Policy, want to exercise your data rights, or need to report a security issue, reach out to us:
                </p>
                <div className="legal-contact-box">
                  <div className="legal-contact-info">
                    <strong>Snag Bot — Ashutosh Swamy</strong>
                    For privacy requests, data deletion, or security reports.
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
                  You may also reach us via <a href="https://github.com/ashutoshswamy" target="_blank" rel="noreferrer">GitHub</a>. We respond to all privacy-related inquiries within 72 hours.
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
              <RouterLink to="/terms">Terms of Service</RouterLink>
              <a href="https://github.com/ashutoshswamy" target="_blank" rel="noreferrer">GitHub</a>
            </div>
            <p className="legal-footer-copy">© 2026 Snag Bot. Built for Discord communities.</p>
          </div>
        </div>
      </footer>

    </div>
  );
}
