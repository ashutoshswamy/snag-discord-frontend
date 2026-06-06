import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export default function GuildCard({ guild }) {
  const navigate = useNavigate();

  return (
    <div className="guild-card glass-panel glow-panel-primary">
      {guild.iconUrl ? (
        <img 
          className="guild-avatar-large" 
          src={guild.iconUrl} 
          alt={guild.name} 
        />
      ) : (
        <div className="guild-avatar-large">
          {guild.name?.[0]?.toUpperCase() ?? '?'}
        </div>
      )}

      <h3 className="guild-name-large" title={guild.name}>
        {guild.name}
      </h3>

      {guild.hasBot ? (
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
        <span className="guild-status-badge status-inactive" style={{ background: 'rgba(255, 23, 68, 0.1)', color: 'var(--danger)' }}>
          Bot Missing
        </span>
      )}

      {guild.hasBot ? (
        <button 
          className="guild-action-btn btn-manage" 
          onClick={() => navigate(`/dashboard/${guild.id}`)}
        >
          Manage Server <ChevronRight size={14} />
        </button>
      ) : (
        <a 
          className="guild-action-btn btn-invite" 
          href={guild.inviteUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: 'none' }}
        >
          Add to Discord <ChevronRight size={14} />
        </a>
      )}
    </div>
  );
}
