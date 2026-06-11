import { useRef, useState, useEffect } from 'react';
import Check from './Check';
import { stars, tone, PLACES_CATS } from '../data';

const NAV_H = 58;
const NAV_H_2 = 44;

function getSnaps() {
  const browse = window.innerHeight - NAV_H - NAV_H_2;
  return [
    148,
    Math.round(browse * 0.52),
    Math.round(browse * 0.88),
  ];
}

function nearest(h) {
  return getSnaps().reduce((a, b) => Math.abs(b - h) < Math.abs(a - h) ? b : a);
}

export default function ListPanel({ list, cat, onCat, hoverId, onHover, onOpen, onClaim, onAdmin }) {
  const hoverTimer = useRef(null);
  const handleEnter = id => {
    clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(() => onHover(id), 80);
  };
  const handleLeave = () => {
    clearTimeout(hoverTimer.current);
    onHover(null);
  };

  const [sheetH, setSheetH]     = useState(() => typeof window !== 'undefined' ? getSnaps()[1] : 420);
  const [snapping, setSnapping] = useState(false);
  const drag      = useRef({ active: false, startY: 0, startH: 0 });
  const handleRef = useRef(null);
  const sheetHRef = useRef(sheetH);

  useEffect(() => {
    sheetHRef.current = sheetH;
  }, [sheetH]);

  // Attach touchmove as non-passive so we can preventDefault and stop the map from also scrolling
  useEffect(() => {
    const el = handleRef.current;
    if (!el) return;

    const onStart = e => {
      drag.current = { active: true, startY: e.touches[0].clientY, startH: sheetHRef.current };
      setSnapping(false);
    };
    const onMove = e => {
      if (!drag.current.active) return;
      e.preventDefault();
      const dy  = drag.current.startY - e.touches[0].clientY;
      const max = window.innerHeight - NAV_H - NAV_H_2 - 12;
      setSheetH(Math.max(100, Math.min(max, drag.current.startH + dy)));
    };
    const onEnd = () => {
      drag.current.active = false;
      setSnapping(true);
      setSheetH(h => nearest(h));
    };

    el.addEventListener('touchstart', onStart, { passive: true });
    el.addEventListener('touchmove',  onMove,  { passive: false }); // must be non-passive to preventDefault
    el.addEventListener('touchend',   onEnd,   { passive: true });
    return () => {
      el.removeEventListener('touchstart', onStart);
      el.removeEventListener('touchmove',  onMove);
      el.removeEventListener('touchend',   onEnd);
    };
  }, []);

  // re-snap to half on orientation change
  useEffect(() => {
    const handler = () => { setSnapping(false); setSheetH(getSnaps()[1]); };
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  return (
    <div
      className={'list-panel' + (snapping ? ' snapping' : '')}
      style={{ height: sheetH }}
    >
      <div ref={handleRef} className="sheet-handle">
        <div className="sheet-handle-pill" />
      </div>

      <div className="filters-bar">
        <div className="pills">
          {PLACES_CATS.map(c => (
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
                {!l.type === 'public' && l.open !== null && (
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
                {!l.type === 'public' && l.coords && <><span className="dot">·</span>{l.addr}</>}
              </div>
              <div className="chips">
                {l.type === 'public' && <span className="placechip">{l.cat}</span>}
                {l.status === 'claimed' && l.offers.length > 0 && (
                  <span className="offerchip">◆ {l.offers.length} offer{l.offers.length > 1 ? 's' : ''}</span>
                )}
                {l.status === 'auto' && !l.type === 'public' && l.coords && (
                  <span className="claimchip">Unclaimed — claim it</span>
                )}
                {!l.coords && !l.type === 'public' && (
                  <span className="svcchip">Service area · no location</span>
                )}
              </div>
            </div>
          </div>
        ))}
        <div className="sheet-footer">
          <button className="sheet-footer-cta" onClick={onClaim}>List your business →</button>
          <button className="sheet-footer-link" onClick={onAdmin}>Admin</button>
        </div>
      </div>
    </div>
  );
}
