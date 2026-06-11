import { useState } from 'react';
import Check from '../components/Check';
import { stars, tone, SERVICE_SUBCATS } from '../data';

export default function Services({ rows, onOpen }) {
  const [sub, setSub] = useState('All');
  const services = rows.filter(r => r.cat === 'Services');
  const list = sub === 'All' ? services : services.filter(r => r.subcat === sub);

  return (
    <div className="page-wrap">
      <div className="services-head">
        <h1>Services</h1>
        <span className="count">{list.length} results</span>
      </div>
      <div className="services-pills">
        {SERVICE_SUBCATS.map(s => (
          <button
            key={s}
            className={'pill' + (s === sub ? ' on' : '')}
            onClick={() => setSub(s)}
          >
            {s}
          </button>
        ))}
      </div>
      <div className="services-list">
        {list.map(l => (
          <div key={l.id} className="card" onClick={() => onOpen(l)}>
            <div className="thumb thumb-ph" style={{ background: tone(l.color) }}>{l.name[0]}</div>
            <div className="card-body">
              <div className="card-row1">
                <span className="bizname">{l.name}</span>
                {l.open !== null && (
                  <span className={'statuspill ' + (l.open ? 'is-open' : 'is-closed')}>
                    {l.open ? 'Open' : 'Closed'}
                  </span>
                )}
              </div>
              {l.status === 'claimed' && <span className="vbadge"><Check />Verified</span>}
              {l.rating > 0 && (
                <div className="rating">
                  <span className="score">{l.rating}</span>
                  <span className="stars">{stars(l.rating)}</span>
                  <span>({l.reviews})</span>
                </div>
              )}
              <div className="metaline">
                {l.subcat || l.cat}<span className="dot">·</span>{l.hood}
                {l.addr && <><span className="dot">·</span>{l.addr}</>}
              </div>
            </div>
          </div>
        ))}
        {list.length === 0 && <p className="empty">No services in this category yet.</p>}
      </div>
    </div>
  );
}
