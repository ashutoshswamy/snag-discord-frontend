import { useNavigate } from 'react-router-dom';
import { useAuth } from './App.jsx';
import { LogOut } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate('/');
  }

  return (
    <nav className="sticky top-0 z-50 animate-fade-in"
      style={{
        borderBottom: '1px solid var(--border-2)',
        background: 'rgba(6, 3, 18, 0.85)',
        backdropFilter: 'blur(24px) saturate(1.4)',
        WebkitBackdropFilter: 'blur(24px) saturate(1.4)',
      }}>
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2.5 group hover:opacity-95 transition-opacity outline-none"
        >
          <img src="/Logo.png" alt="Snag" className="w-8 h-8 rounded-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6" />
          <span className="text-lg font-bold tracking-tight transition-colors group-hover:text-[var(--primary-light)]" style={{ color: 'var(--text-1)' }}>Snag</span>
        </button>

        {/* User */}
        {user && (
          <div className="flex items-center gap-3">
            {user.avatar ? (
              <img src={user.avatar} alt={user.name}
                className="w-8 h-8 rounded-full ring-2"
                style={{ ringColor: 'var(--primary-dim)' }} />
            ) : (
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ background: 'var(--primary-dim)', color: 'var(--primary-light)', border: '1px solid var(--border-2)' }}>
                {(user.globalName ?? user.name)?.[0]?.toUpperCase()}
              </div>
            )}
            <span className="text-sm font-semibold hidden sm:block" style={{ color: 'var(--text-2)' }}>
              {user.globalName ?? user.name}
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all outline-none"
              style={{ color: 'var(--text-2)', border: '1px solid var(--border-2)', background: 'rgba(10,6,26,0.3)' }}
              onMouseEnter={e => { e.currentTarget.style.color = 'var(--primary)'; e.currentTarget.style.borderColor = 'rgba(139,92,246,0.5)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-2)'; e.currentTarget.style.borderColor = 'var(--border-2)'; }}
            >
              <LogOut size={13} />
              Sign out
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
