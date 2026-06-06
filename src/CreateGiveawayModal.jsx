import { useState, useEffect, useCallback } from 'react';
import { X, Hash, Gift, Zap, Clock, Users, AlertCircle, Loader2, ChevronDown } from 'lucide-react';

function Field({ label, icon: Icon, children }) {
  return (
    <div className="form-group">
      <label className="flex items-center gap-1.5">
        {Icon && <Icon size={11} />}
        {label}
      </label>
      {children}
    </div>
  );
}

export default function CreateGiveawayModal({ guildId, onClose, onCreated, initialType }) {
  const [channels, setChannels] = useState([]);
  const [channelsLoading, setChannelsLoading] = useState(true);
  const [channelsError, setChannelsError] = useState(null);
  const [type, setType] = useState(initialType || 'giveaway');
  const [form, setForm] = useState({ channelId: '', prize: '', duration: '1h', winners: 1 });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const set = useCallback((key, val) => setForm(f => ({ ...f, [key]: val })), []);

  useEffect(() => {
    fetch(`/api/channels/${guildId}`, { credentials: 'include' })
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) {
          setChannels(data);
          if (data.length > 0) set('channelId', data[0].id);
        } else {
          setChannelsError(data.error ?? 'Failed to load channels');
        }
      })
      .catch(() => setChannelsError('Network error. Is the bot in this server?'))
      .finally(() => setChannelsLoading(false));
  }, [guildId, set]);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/giveaways', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ ...form, guildId, type }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Failed to create giveaway');
      onCreated(data);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  const isDrop = type === 'drop';
  const accentColor = isDrop ? 'var(--warning)' : 'var(--primary)';
  const accentGlow  = isDrop ? 'var(--warning-glow)' : 'var(--primary-glow)';
  const accentBorder = isDrop ? 'rgba(255, 145, 0, 0.45)' : 'rgba(139, 92, 246, 0.5)';

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="glass-panel modal-content">
        {/* Modal header */}
        <div className="modal-header">
          <div>
            <h3>New Giveaway</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '11px', marginTop: '2px' }}>
              Configure and launch to Discord
            </p>
          </div>
          <button onClick={onClose} className="modal-close">
            <X size={15} />
          </button>
        </div>

        <div>
          {/* Type toggle */}
          <div className="flex gap-2 mb-6 p-1"
            style={{ background: 'rgba(10,6,26,0.3)', border: '1px solid var(--border)', borderRadius: '10px' }}>
            {[
              { key: 'giveaway', icon: Gift,  label: 'Giveaway' },
              { key: 'drop',     icon: Zap,   label: 'Instant Drop' },
            ].map(({ key, icon: Icon, label }) => {
              const active = type === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setType(key)}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold transition-all duration-150 border-none"
                  style={{
                    borderRadius: '8px',
                    background: active ? (key === 'drop' ? 'var(--warning)' : 'var(--primary)') : 'transparent',
                    color: active ? '#fff' : 'var(--text-secondary)',
                    boxShadow: active ? `0 4px 16px ${accentGlow}` : 'none',
                    cursor: 'pointer'
                  }}
                >
                  <Icon size={14} />
                  {label}
                </button>
              );
            })}
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Channel */}
            <Field label="Channel" icon={Hash}>
              {channelsLoading ? (
                <div className="form-input flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
                  <Loader2 size={13} className="animate-spin" />
                  <span>Loading channels…</span>
                </div>
              ) : channelsError ? (
                <div className="form-input flex items-center gap-2 text-sm"
                  style={{ background: 'var(--primary-dim)', color: 'var(--primary-hover)', borderColor: 'var(--primary-glow)' }}>
                  <AlertCircle size={13} />
                  {channelsError}
                </div>
              ) : (
                <div className="relative">
                  <select
                    value={form.channelId}
                    onChange={e => set('channelId', e.target.value)}
                    required
                    className="form-select"
                    style={{ appearance: 'none', paddingRight: '36px' }}
                  >
                    <option value="">Select a channel…</option>
                    {channels.map(c => (
                      <option key={c.id} value={c.id}>#{c.name}</option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                    style={{ color: 'var(--text-muted)' }} />
                </div>
              )}
            </Field>

            {/* Prize */}
            <Field label="Prize" icon={Gift}>
              <input
                type="text"
                value={form.prize}
                onChange={e => set('prize', e.target.value)}
                required
                maxLength={200}
                placeholder="e.g. Discord Nitro, $10 Gift Card"
                className="form-input"
              />
            </Field>

            {/* Duration + Winners — giveaway only */}
            {!isDrop && (
              <div className="grid grid-cols-2 gap-3">
                <Field label="Duration" icon={Clock}>
                  <input
                    type="text"
                    value={form.duration}
                    onChange={e => set('duration', e.target.value)}
                    required
                    placeholder="1h, 30m, 2d…"
                    className="form-input"
                  />
                  <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Format: s m h d w</p>
                </Field>
                <Field label="Winners" icon={Users}>
                  <input
                    type="number"
                    value={form.winners}
                    onChange={e => set('winners', Math.max(1, parseInt(e.target.value) || 1))}
                    min={1} max={20} required
                    className="form-input"
                  />
                </Field>
              </div>
            )}

            {error && (
              <div className="form-input flex items-center gap-2.5 text-sm"
                style={{ background: 'var(--primary-dim)', color: 'var(--primary-hover)', borderColor: 'var(--primary-glow)' }}>
                <AlertCircle size={13} />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting || channelsLoading || !!channelsError}
              className="btn btn-primary w-full mt-2"
              style={{
                background: isDrop ? 'var(--warning)' : 'var(--primary)',
                boxShadow: `0 4px 16px ${accentGlow}`,
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = isDrop ? 'var(--warning)' : 'var(--primary-hover)';
                e.currentTarget.style.boxShadow = `0 6px 20px ${accentGlow}`;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = isDrop ? 'var(--warning)' : 'var(--primary)';
                e.currentTarget.style.boxShadow = `0 4px 16px ${accentGlow}`;
              }}
            >
              {submitting ? (
                <Loader2 size={14} className="animate-spin" />
              ) : isDrop ? (
                <Zap size={14} />
              ) : (
                <Gift size={14} />
              )}
              {submitting ? 'Launching…' : isDrop ? 'Launch Drop' : 'Start Giveaway'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
