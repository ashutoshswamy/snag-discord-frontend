import { useState } from 'react';
import { Clock, Trophy, Users, Zap, ExternalLink, RotateCcw, Square, CheckCircle, Loader2 } from 'lucide-react';

function timeRemaining(endsAt, ended) {
  if (ended) return 'Ended';
  const diff = new Date(endsAt) - Date.now();
  if (diff <= 0) return 'Ending…';
  const d = Math.floor(diff / 86_400_000);
  const h = Math.floor((diff % 86_400_000) / 3_600_000);
  const m = Math.floor((diff % 3_600_000) / 60_000);
  if (d > 0) return `${d}d ${h}h`;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

export default function GiveawayCard({ giveaway, onEnd, onReroll, index = 0 }) {
  const [busy, setBusy] = useState('');

  async function handle(action, fn) {
    setBusy(action);
    try { await fn(giveaway.message_id); }
    finally { setBusy(''); }
  }

  const jumpUrl = `https://discord.com/channels/${giveaway.guild_id}/${giveaway.channel_id}/${giveaway.message_id}`;
  const isDrop = giveaway.is_drop;
  const accentColor = isDrop ? 'var(--warning)' : 'var(--primary)';
  const accentDim   = isDrop ? 'var(--warning-glow)' : 'var(--primary-dim)';
  const timeLeft = timeRemaining(giveaway.ends_at, giveaway.ended);

  return (
    <div
      className="glass-panel p-5 flex flex-col gap-4 relative overflow-hidden"
      style={{ 
        animationDelay: `${index * 0.06}s`,
        borderTop: giveaway.ended ? '1px solid var(--border)' : `2px solid ${accentColor}`
      }}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-md"
              style={{ background: accentDim, color: accentColor, border: `1px solid rgba(${isDrop ? '255,145,0' : '139,92,246'}, 0.2)` }}>
              {isDrop ? <Zap size={11} /> : <Trophy size={11} />}
              {isDrop ? 'Drop' : 'Giveaway'}
            </span>
            {giveaway.ended && (
              <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-md"
                style={{ background: 'rgba(75, 85, 133, 0.15)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>
                <CheckCircle size={10} />
                Ended
              </span>
            )}
          </div>

          <h3 className="text-sm font-semibold leading-snug truncate" style={{ color: 'var(--text-primary)' }}>
            {giveaway.prize}
          </h3>
          <p className="text-xs font-light mt-0.5" style={{ color: 'var(--text-muted)' }}>
            by {giveaway.host_tag}
          </p>
        </div>

        <div className="text-right shrink-0">
          <p className="text-3xl font-black leading-none tabular-nums" style={{ color: 'var(--text-primary)' }}>
            {giveaway.entryCount}
          </p>
          <p className="text-xs font-light mt-0.5" style={{ color: 'var(--text-muted)' }}>
            entries
          </p>
        </div>
      </div>

      {/* Meta pills */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-md"
          style={{ background: 'rgba(10,6,26,0.4)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>
          <Clock size={11} />
          {timeLeft}
        </span>
        {!isDrop && (
          <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-md"
            style={{ background: 'rgba(10,6,26,0.4)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>
            <Users size={11} />
            {giveaway.winner_count} Winners
          </span>
        )}
      </div>

      {/* Winners (ended only) */}
      {giveaway.ended && giveaway.winner_ids?.length > 0 && (
        <div className="rounded-lg px-3 py-2.5 flex flex-col gap-1"
          style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.18)' }}>
          <p className="text-xs font-semibold flex items-center gap-1" style={{ color: 'var(--success)' }}>
            <Trophy size={12} />{giveaway.winner_ids.length === 1 ? 'Winner' : 'Winners'}
          </p>
          <p className="text-xs font-mono break-all leading-relaxed" style={{ color: 'var(--text-primary)' }}>
            {giveaway.winner_ids.map(id => `<@${id}>`).join(', ')}
          </p>
        </div>
      )}
      {giveaway.ended && (!giveaway.winner_ids || giveaway.winner_ids.length === 0) && (
        <div className="rounded-lg px-3 py-2.5"
          style={{ background: 'rgba(10,6,26,0.5)', border: '1px solid var(--border)' }}>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>No winner — no entries</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2 pt-1">
        {!giveaway.ended && !isDrop && (
          <button
            onClick={() => handle('end', onEnd)}
            disabled={!!busy}
            className="btn btn-danger flex-1"
          >
            {busy === 'end' ? (
              <Loader2 size={12} className="animate-spin" />
            ) : (
              <Square size={12} />
            )}
            End Early
          </button>
        )}
        <button
          onClick={() => handle('reroll', onReroll)}
          disabled={!!busy}
          className="btn flex-1"
          style={{
            background: 'var(--success-glow)',
            color: 'var(--success)',
            border: '1px solid rgba(16, 185, 129, 0.25)',
          }}
          onMouseEnter={e => !busy && (e.currentTarget.style.background = 'rgba(16, 185, 129, 0.2)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'var(--success-glow)')}
        >
          {busy === 'reroll' ? (
            <Loader2 size={12} className="animate-spin" />
          ) : (
            <RotateCcw size={12} />
          )}
          Reroll
        </button>
        <a
          href={jumpUrl}
          target="_blank"
          rel="noopener noreferrer"
          title="Jump to message"
          className="btn btn-secondary"
          style={{ padding: '8px 10px' }}
        >
          <ExternalLink size={13} />
        </a>
      </div>
    </div>
  );
}
