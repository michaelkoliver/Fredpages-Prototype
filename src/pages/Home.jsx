import { DATA, PLACE_CATS, tone, initials } from '../data';

const FEATURED_CATS = [
  { name: 'Restaurant',    color: '#a8553c', blurb: 'Local kitchens, taprooms, and weekend brunch spots.' },
  { name: 'Coffee & Tea',  color: '#7a5230', blurb: 'Pour-overs, espresso bars, and quiet corners to work.' },
  { name: 'Brewery',       color: '#3f6b4a', blurb: 'Small-batch taprooms and beer gardens around town.' },
  { name: 'Antiques',      color: '#5a6b7a', blurb: 'Estate furniture, jewelry, and downtown curiosities.' },
  { name: 'Bookstore',     color: '#6b4a3f', blurb: 'Independent shops with deep local sections.' },
  { name: 'Park',          color: '#3f6b4a', blurb: 'Riverfront walks, picnic lawns, and playgrounds.' },
];

export default function Home({ onPlaces, onClaim }) {
  const businesses = DATA.filter(r => !PLACE_CATS.has(r.cat));
  const featured = businesses.filter(r => r.status === 'claimed').slice(0, 3);

  return (
    <div className="home">
      <section className="home-hero">
        <div className="home-hero-inner">
          <span className="home-eyebrow">Fredericksburg, Virginia</span>
          <h1>The local directory for Fredericksburg.</h1>
          <p className="home-lede">
            Find the cafés, breweries, shops, and parks that make this town
            what it is — mapped, reviewed, and kept current by the people who run them.
          </p>
          <div className="home-cta">
            <button className="btn btn-primary btn-lg" onClick={onPlaces}>Browse the map</button>
            <button className="btn btn-lg" onClick={onClaim}>Claim your business</button>
          </div>
          <div className="home-stats">
            <div><b>{businesses.length}+</b><span>local listings</span></div>
            <div><b>6</b><span>neighborhoods</span></div>
            <div><b>{DATA.length - businesses.length}</b><span>parks &amp; places</span></div>
          </div>
        </div>
      </section>

      <section className="home-section">
        <div className="home-section-head">
          <h2>Browse by category</h2>
          <button className="home-link" onClick={onPlaces}>See all on the map →</button>
        </div>
        <div className="home-cats">
          {FEATURED_CATS.map(c => (
            <button key={c.name} className="home-cat" onClick={onPlaces}>
              <div className="home-cat-swatch" style={{ background: tone(c.color) }}>
                {c.name.split(' ')[0][0]}
              </div>
              <div>
                <b>{c.name}</b>
                <p>{c.blurb}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {featured.length > 0 && (
        <section className="home-section">
          <div className="home-section-head">
            <h2>Featured this week</h2>
            <button className="home-link" onClick={onPlaces}>View all →</button>
          </div>
          <div className="home-feature-grid">
            {featured.map(b => (
              <button key={b.id} className="home-feature" onClick={onPlaces}>
                <div className="home-feature-img" style={{ background: tone(b.color) }}>
                  {initials(b.name)}
                </div>
                <div className="home-feature-body">
                  <b>{b.name}</b>
                  <span>{b.cat} · {b.hood}</span>
                  {b.rating > 0 && (
                    <span className="home-feature-rate">★ {b.rating} ({b.reviews})</span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </section>
      )}

      <section className="home-claim">
        <div className="home-claim-inner">
          <h2>Own a business in Fredericksburg?</h2>
          <p>
            Claim your listing to manage hours, post offers, share events,
            and respond to reviews. Free to claim, simple to verify.
          </p>
          <button className="btn btn-primary btn-lg" onClick={onClaim}>Claim your business</button>
        </div>
      </section>
    </div>
  );
}
