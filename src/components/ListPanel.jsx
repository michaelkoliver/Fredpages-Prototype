import { useRef } from 'react';
import Check from './Check';
import { stars, tone, CATS, PLACE_CATS } from '../data';

export default function ListPanel({ list, cat, onCat, hoverId, onHover, onOpen, mobileTab, onMobileTab }) {
  const hoverTimer = useRef(null);
  const handleEnter = id => {
    clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(() => onHover(id), 80);
  };
  const handleLeave = () => {
    clearTimeout(hoverTimer.current);
    onHover(null);
  };

  return (
    <div className={'list-panel' + (mobileTab === 'map' ? ' mob-map' : '')}>
      {/* tab strip lives inside the panel on mobile */}
      <div className="panel-tabs">
        <button className={mobileTab === 'list' ? 'on' : ''} onClick={() => onMobileTab('list')}>List</button>
        <button className={mobileTab === 'map' ? 'on' : ''} onClick={() => onMobileTab('map')}>Map</button>
      </div>

      <div className="filters-bar">
        <div className="pills">
          {CATS.map(c => (
            <button key={c} className={'pill' + (c === cat ? ' on' : '')} onClick={() => onCat(c)}>{c}</button>
          ))}
        </div>
      </div>

      <div className="list-scroll">
        <div className="listhead">
          <h2>{cat === 'All' ? 'Explore Fredericksburg' : cat}</h2>
          <span className="count">{list.length} results</span>
        </div>
        {list.map(l => (
          <div
            key={l.id}
            className={'card' + (hoverId === l.id ? ' hl' : '')}
            onClick={() => onOpen(l)}
            onMouseEnter={() => handleEnter(l.id)}
            onMouseLeave={handleLeave}
          >
            <div className="thumb thumb-ph" style={{ background: tone(l.color) }}>{l.name[0]}</div>
            <div className="card-body">
              <div className="card-row1">
                <span className="bizname">{l.name}</span>
                {!PLACE_CATS.has(l.cat) && l.open !== null && (
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
                {l.cat}<span className="dot">·</span>{l.hood}
                {!PLACE_CATS.has(l.cat) && l.coords && <><span className="dot">·</span>{l.addr}</>}
              </div>
              <div className="chips">
                {PLACE_CATS.has(l.cat) && <span className="placechip">{l.cat}</span>}
                {l.status === 'claimed' && l.offers.length > 0 && (
                  <span className="offerchip">◆ {l.offers.length} offer{l.offers.length > 1 ? 's' : ''}</span>
                )}
                {l.status === 'auto' && !PLACE_CATS.has(l.cat) && l.coords && (
                  <span className="claimchip">Unclaimed — claim it</span>
                )}
                {!l.coords && !PLACE_CATS.has(l.cat) && (
                  <span className="svcchip">Service area · no location</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
