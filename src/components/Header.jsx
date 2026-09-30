import React, { useState } from 'react'
import {
  CalendarDays,
  LogIn,
  LogOut,
  Menu,
  ShieldCheck,
} from 'lucide-react'

function AuthAction({ user, roleLabel, onLogin, onLogout, mobile = false }) {
  if (!user) {
    return (
      <button className={mobile ? undefined : 'login-button'} onClick={onLogin}>
        <LogIn size={mobile ? 16 : 17} /> Mit Google anmelden
      </button>
    )
  }

  if (mobile) {
    return (
      <>
        <span className="mobile-user-role">Rolle: {roleLabel}</span>
        <button onClick={onLogout}><LogOut size={16} /> Abmelden</button>
      </>
    )
  }

  return (
    <button className="user-chip" onClick={onLogout}>
      <span className="avatar">
        {(user.displayName || 'M').charAt(0)}
      </span>
      <span className="user-details">
        <span>{user.displayName || 'Mein Konto'}</span>
        <small>Rolle: {roleLabel}</small>
      </span>
      <LogOut size={16} />
    </button>
  )
}

export default function Header({ user, roleLabel, onLogin, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      <header className="topbar">
        <a className="brand" href="#top">
          <span className="brand-mark"><CalendarDays size={23} /></span>
          <span>Bildkalender</span>
        </a>
        <div className="top-actions">
          <AuthAction
            user={user}
            roleLabel={roleLabel}
            onLogin={onLogin}
            onLogout={onLogout}
          />
          <button
            className="menu-button"
            onClick={() => setMenuOpen((isOpen) => !isOpen)}
            aria-label="Menü"
            aria-expanded={menuOpen}
          >
            <Menu />
          </button>
        </div>
      </header>

      {menuOpen && (
        <div className="mobile-menu">
          <AuthAction
            user={user}
            roleLabel={roleLabel}
            onLogin={onLogin}
            onLogout={onLogout}
            mobile
          />
        </div>
      )}
    </>
  )
}
