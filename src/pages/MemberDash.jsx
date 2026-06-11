const SECTIONS = [
  {
    title: 'Reviews',
    icon: <path d="M12 2l3 7h7l-5.5 4 2 7-6.5-4.5L5.5 20l2-7L2 9h7z"/>,
  },
  {
    title: 'Saved',
    icon: <path d="M6 3h12v18l-6-4-6 4z"/>,
  },
  {
    title: 'Deals',
    icon: <><path d="M21 11l-9-9H3v9l9 9z"/><circle cx="7.5" cy="7.5" r="1.5"/></>,
  },
];

export default function MemberDash({ user, onSignOut }) {
  const name = user.firstName + (user.lastName ? ' ' + user.lastName : '');
  return (
    <div className="page-wrap">
      <div className="dhead">
        {user.photo
          ? <img src={user.photo} alt="" style={{ width: 64, height: 64, borderRadius: 32, objectFit: 'cover', flexShrink: 0 }} />
          : <div className="avatar" style={{ background: '#5a6b7a', borderRadius: 32 }}>{user.firstName[0]}</div>}
        <div>
          <h1>{name}</h1>
          <div className="metaline" style={{ fontSize: 13 }}>{user.email}</div>
          <div className="dactions">
            <button className="btn" onClick={onSignOut}>Sign out</button>
          </div>
        </div>
      </div>
      <div className="member-tiles">
        {SECTIONS.map(s => (
          <button key={s.title} className="member-tile">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              {s.icon}
            </svg>
            <span>{s.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
