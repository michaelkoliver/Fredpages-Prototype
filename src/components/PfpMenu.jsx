import { useEffect, useRef, useState } from 'react';

export default function PfpMenu({ user, items, onSignOut }) {
  const [open, setOpen] = useState(false);
  const wrap = useRef(null);
  const closeTimer = useRef(null);

  useEffect(() => {
    if (!open) return;
    const off = e => { if (!wrap.current?.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', off);
    return () => document.removeEventListener('mousedown', off);
  }, [open]);

  const onEnter = () => { clearTimeout(closeTimer.current); setOpen(true); };
  const onLeave = () => { closeTimer.current = setTimeout(() => setOpen(false), 180); };

  return (
    <div className="pfp-wrap" ref={wrap} onMouseEnter={onEnter} onMouseLeave={onLeave}>
      <button className="pfp" onClick={() => setOpen(o => !o)} aria-label="Account menu">
        {user.photo
          ? <img src={user.photo} alt="" />
          : <span>{(user.firstName || '?')[0]}</span>}
      </button>
      {open && (
        <div className="pfp-menu" role="menu">
          <div className="pfp-menu-head">
            {user.photo
              ? <img src={user.photo} alt="" />
              : <div className="pfp-menu-av"><span>{(user.firstName || '?')[0]}</span></div>}
            <div>
              <b>{user.firstName + (user.lastName ? ' ' + user.lastName : '')}</b>
              <small>{user.email}</small>
            </div>
          </div>
          {items.map(it => (
            <button key={it.label} className="pfp-menu-item" onClick={() => { setOpen(false); it.onClick(); }}>
              {it.icon && (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  {it.icon}
                </svg>
              )}
              <span>{it.label}</span>
            </button>
          ))}
          <div className="pfp-menu-sep" />
          <button className="pfp-menu-item" onClick={() => { setOpen(false); onSignOut(); }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 17l5-5-5-5"/><path d="M20 12H9"/><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
            </svg>
            <span>Sign out</span>
          </button>
        </div>
      )}
    </div>
  );
}
