import { DATA, tone, initials } from '../data';

const CATS = [
  {
    name: 'Restaurant',
    icon: <><path d="M4 3v8a2 2 0 002 2v8"/><path d="M8 3v8"/><path d="M6 3v8"/><path d="M18 3c-2 0-3 2-3 5s1 5 3 5v8"/></>,
  },
  {
    name: 'Coffee & Tea',
    icon: <><path d="M4 8h13v6a5 5 0 01-5 5H9a5 5 0 01-5-5V8z"/><path d="M17 10h2a2 2 0 010 4h-2"/><path d="M8 3v3"/><path d="M12 3v3"/></>,
  },
  {
    name: 'Brewery',
    icon: <><path d="M6 3h12v18H6z"/><path d="M6 9h12"/><path d="M9 13v4"/><path d="M15 13v4"/></>,
  },
  {
    name: 'Antiques',
    icon: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
  },
  {
    name: 'Bookstore',
    icon: <><path d="M4 4h14a2 2 0 012 2v14a2 2 0 01-2 2H4z"/><path d="M4 4v18"/><path d="M8 8h8"/></>,
  },
  {
    name: 'Park',
    icon: <><path d="M12 3l8 12H4z"/><path d="M12 15v6"/></>,
  },
];

export default function Home({ onPlaces, onOpen }) {
  const featured = DATA
    .filter(r => r.type === 'business' && r.status === 'claimed' && r.coords)
    .slice(0, 6);

  return (
    <div className="home">
      <section className="home-hero">
        <h1>Fredericksburg</h1>
        <button className="btn btn-primary btn-lg" onClick={onPlaces}>Open the map</button>
      </section>

      <section className="home-cats">
        {CATS.map(c => (
          <button key={c.name} className="home-cat" onClick={onPlaces}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              {c.icon}
            </svg>
            <span>{c.name}</span>
          </button>
        ))}
      </section>

      <section className="home-featured">
        {featured.map(b => (
          <button key={b.id} className="home-feature" onClick={() => onOpen(b)}>
            <div className="home-feature-cover" style={{ background: tone(b.color) }}>{initials(b.name)}</div>
            <div className="home-feature-name">{b.name}</div>
          </button>
        ))}
      </section>
    </div>
  );
}
