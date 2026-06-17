import { useState } from 'react';
import Check from '../components/Check';
import { stars, tone, SERVICE_CATS } from '../data';

const FILTER_CATS = ['All', ...SERVICE_CATS];

export default function Services({ rows, onOpen }) {
  const [cat, setCat] = useState('All');
  const services = rows.filter(r => r.type === 'service');
  const list = cat === 'All' ? services : services.filter(r => r.cat === cat);

  return (
    <div className="page-wrap">
      <div className="services-head">
        <h1>Services</h1>
        <span className="count">{list.length} results</span>
      </div>
      <div className="services-pills">
        {FILTER_CATS.map(c => (
          <button
            key={c}
            className={'pill' + (c === cat ? ' on' : '')}
            onClick={() => setCat(c)}
          >
            {c}
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
                {l.cat}{l.hood && <><span className="dot">·</span>{l.hood}</>}
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
