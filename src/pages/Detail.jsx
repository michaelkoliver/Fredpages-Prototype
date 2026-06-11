import Check from '../components/Check';
import { stars, tone, initials, monthDay, fmtDate, REVIEWS, MAP_EMBED } from '../data';

export default function Detail({ active, onBack, onDash, onClaim, ping }) {
  if (!active) return null;

  return (
    <div className="page-wrap">
      <button className="back" onClick={onBack}>← Back</button>
      {(active.status === 'claimed' || active.type === 'public') && (
        <div className="hero" style={{ background: tone(active.color) }}>{initials(active.name)}</div>
      )}
      <div className="dhead">
        <div className="avatar" style={{ background: active.color }}>{initials(active.name)}</div>
        <div>
          <h1>{active.name}</h1>
          {active.rating > 0 && (
            <div className="rating">
              <span className="score">{active.rating}</span>
              <span className="stars">{stars(active.rating)}</span>
              <span>({active.reviews} reviews)</span>
            </div>
          )}
          <div className="metaline" style={{ fontSize: 13 }}>
            {active.cat}<span className="dot">·</span>{active.hood}
            {active.status === 'claimed' && (
              <> <span className="dot">·</span> <span className="vbadge"><Check />Verified owner</span></>
            )}
          </div>
          <div className="dactions">
            <button className="btn btn-primary" onClick={() => ping('Opening directions')}>Directions</button>
            {active.phone && <button className="btn" onClick={() => ping(active.phone)}>Call</button>}
            {active.web && <button className="btn" onClick={() => ping(active.web)}>Website</button>}
          </div>
        </div>
      </div>

      {(active.status === 'claimed' || active.type === 'public') ? (
        <>
          {active.about && (
            <div className="dsection"><h2>About</h2><p className="about">{active.about}</p></div>
          )}
          {active.offers.length > 0 && (
            <div className="dsection">
              <h2>Offers & coupons</h2>
              {active.offers.map((o, i) => (
                <div key={i} className="offer">
                  <span className="tag">{o.kind}</span>
                  <b>{o.title}</b>
                  {o.details && <p>{o.details}</p>}
                  {o.expires && <div className="exp">Expires {fmtDate(o.expires)}</div>}
                </div>
              ))}
            </div>
          )}
          {active.events.length > 0 && (
            <div className="dsection">
              <h2>Upcoming events</h2>
              {active.events.map((e, i) => {
                const md = monthDay(e.date);
                return (
                  <div key={i} className="event">
                    <div className="cal">
                      <div className="m">{md.m}</div>
                      <div className="d">{md.d}</div>
                    </div>
                    <div>
                      <b>{e.title}</b>
                      <span>{e.time}{e.desc ? ` · ${e.desc}` : ''}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          {active.hours.length > 0 && (
            <div className="dsection">
              <h2>Hours</h2>
              {active.hours.map((h, i) => (
                <div key={i} className={'hours-row' + (i === active.todayIdx ? ' today' : '')}>
                  <span>{h[0]}</span><span>{h[1]}</span>
                </div>
              ))}
            </div>
          )}
          {active.reviews > 0 && (
            <div className="dsection">
              <h2>Reviews</h2>
              {REVIEWS.map((r, i) => (
                <div key={i} className="review">
                  <div className="ravatar" style={{ background: r.c }}>{r.n[0]}</div>
                  <div>
                    <div className="rtop">
                      <span className="rname">{r.n}</span>
                      <span className="rdate">{r.dt}</span>
                    </div>
                    <div className="rstars">{stars(r.s)}</div>
                    <p>{r.t}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="dsection" style={{ borderBottom: 'none' }}>
            <h2>Location</h2>
            <p className="about" style={{ marginBottom: 12 }}>{active.addr}, Fredericksburg, VA 22401</p>
            <iframe className="mapframe" src={MAP_EMBED} title="map" loading="lazy" />
          </div>
          {active.status === 'claimed' && (
            <button className="btn" onClick={onDash}>Owner? Open dashboard →</button>
          )}
        </>
      ) : (
        <>
          <div className="dsection" style={{ borderBottom: 'none' }}>
            <h2>Location</h2>
            <p className="about" style={{ marginBottom: 12 }}>{active.addr}, Fredericksburg, VA 22401</p>
            <iframe className="mapframe" src={MAP_EMBED} title="map" loading="lazy" />
          </div>
          <div className="claimbox">
            <h3>Is this your business?</h3>
            <p>This profile was added automatically. Claim it to add your description, hours, photos, offers, and events — and get a verified badge.</p>
            <button className="btn btn-primary" onClick={onClaim}>Claim this business — $50/mo</button>
          </div>
        </>
      )}
      <div style={{ height: 40 }} />
    </div>
  );
}
