import { useNavigate } from 'react-router-dom';
import { ChevronRight, Link } from 'lucide-react';

export default function GuildCard({ guild }) {
  const navigate = useNavigate();
  const hasBot = guild.hasBot;

  return (
    <div className={`guild-card glass-panel${hasBot ? ' glow-panel-primary' : ''}`}>
      {guild.iconUrl ? (
        <img
          className="guild-avatar-large"
          src={guild.iconUrl}
          alt={guild.name}
          style={!hasBot ? { opacity: 0.5 } : undefined}
        />
      ) : (
        <div className="guild-avatar-large" style={!hasBot ? { opacity: 0.5 } : undefined}>
          {guild.name?.[0]?.toUpperCase() ?? '?'}
        </div>
      )}

      <h3
        className="guild-name-large"
        title={guild.name}
        style={!hasBot ? { color: 'var(--text-secondary)' } : undefined}
      >
        {guild.name}
      </h3>

      {hasBot ? (
        guild.activeGiveaways > 0 ? (
          <span className="guild-status-badge status-active">
            {guild.activeGiveaways} active
          </span>
        ) : (
          <span className="guild-status-badge status-inactive">
            No active
          </span>
        )
      ) : (
        <span className="guild-status-badge status-inactive">
          Not Present
        </span>
      )}

      {hasBot ? (
        <button
          className="guild-action-btn btn-manage"
          onClick={() => navigate(`/dashboard/${guild.id}`)}
        >
          Manage Server <ChevronRight size={14} />
        </button>
      ) : (
        <a
          className="guild-action-btn btn-setup"
          href={guild.inviteUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: 'none' }}
        >
          Invite Bot <Link size={14} />
        </a>
      )}
    </div>
  );
}
