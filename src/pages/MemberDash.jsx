const SECTIONS = [
  { title: 'My reviews', sub: 'Reviews you write will appear here.' },
  { title: 'Saved places', sub: 'Bookmark places to find them later.' },
  { title: 'Followed deals', sub: 'Get notified when businesses you follow post a new offer.' },
];

export default function MemberDash({ user, onSignOut }) {
  const name = user.firstName + (user.lastName ? ' ' + user.lastName : '');
  return (
    <div className="page-wrap">
      <div className="dhead">
        {user.photo
          ? <img src={user.photo} alt="" style={{ width: 64, height: 64, borderRadius: 14, objectFit: 'cover', flexShrink: 0 }} />
          : <div className="avatar" style={{ background: '#5a6b7a' }}>{user.firstName[0]}</div>}
        <div>
          <h1>{name}</h1>
          <div className="metaline" style={{ fontSize: 13 }}>{user.email}<span className="dot">·</span>Local member</div>
          <div className="dactions">
            <button className="btn" onClick={onSignOut}>Sign out</button>
          </div>
        </div>
      </div>
      {SECTIONS.map(s => (
        <div key={s.title} className="dsection">
          <h2>{s.title}</h2>
          <p className="empty">{s.sub}</p>
        </div>
      ))}
    </div>
  );
}
