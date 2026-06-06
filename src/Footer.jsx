import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

export default function Footer({ onDashboard }) {
  const inviteUrl = "https://discord.com/oauth2/authorize?client_id=1512527196437352549&permissions=8&scope=bot%20applications.commands";

  return (
    <footer className="lp-footer">
      <div className="lp-container">
        <div className="lp-footer-top">
          {/* Brand */}
          <div className="lp-footer-brand">
            <div className="lp-nav-brand" style={{ marginBottom: '12px' }}>
              <img src="/Logo.png" alt="Snag" className="lp-nav-logo" />
              <span className="lp-nav-name" style={{ fontSize: '16px', letterSpacing: '1px' }}>SNAG</span>
            </div>
            <p className="lp-footer-tagline">Automated Discord giveaways<br />and drop events, around the clock.</p>
            <a href={inviteUrl} target="_blank" rel="noreferrer" className="lp-btn lp-btn-primary" style={{ marginTop: '20px', fontSize: '13px', padding: '9px 18px' }}>
              Invite for Free
            </a>
          </div>

          {/* Link columns */}
          <div className="lp-footer-cols">
            <div className="lp-footer-col">
              <p className="lp-footer-col-heading">Product</p>
              <a href="#features">Features</a>
              <RouterLink to="/commands">Commands</RouterLink>
              <a href="#how">How it works</a>
              <RouterLink to="/status">Status</RouterLink>
            </div>
            <div className="lp-footer-col">
              <p className="lp-footer-col-heading">Access</p>
              <a href={inviteUrl} target="_blank" rel="noreferrer">Add to Discord</a>
              {onDashboard
                ? <button onClick={onDashboard}>Dashboard</button>
                : <RouterLink to="/dashboard">Dashboard</RouterLink>
              }
            </div>
            <div className="lp-footer-col">
              <p className="lp-footer-col-heading">Legal</p>
              <RouterLink to="/privacy">Privacy Policy</RouterLink>
              <RouterLink to="/terms">Terms of Service</RouterLink>
            </div>
          </div>
        </div>

        <div className="lp-footer-bottom">
          <p className="lp-footer-copy">© 2026 Snag Bot. Built for Discord communities.</p>
          <p className="lp-footer-made-by">
            Made by{' '}
            <a href="https://ashutoshswamy.in" target="_blank" rel="noreferrer">Ashutosh Swamy</a>
            {' '}·{' '}
            <a href="https://github.com/ashutoshswamy" target="_blank" rel="noreferrer">GitHub</a>
            {' '}·{' '}
            <a href="https://linkedin.com/in/ashutoshswamy" target="_blank" rel="noreferrer">LinkedIn</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
