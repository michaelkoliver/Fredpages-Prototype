import { useState } from 'react';
import { DATA, nextMonthISO, PLACE_CATS } from './data';
import MapView from './components/MapView';
import ListPanel from './components/ListPanel';
import Detail from './pages/Detail';
import Claim from './pages/Claim';
import Verify from './pages/Verify';
import Checkout from './pages/Checkout';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';
import Home from './pages/Home';

export default function App() {
  const [view,          setView]          = useState('home');
  const [activeId,      setActiveId]      = useState(null);
  const [cat,           setCat]           = useState('All');
  const [search,        setSearch]        = useState('');
  const [tab,           setTab]           = useState('details');
  const [atab,          setAtab]          = useState('listings');
  const [toast,         setToast]         = useState('');
  const [rows,          setRows]          = useState(DATA);
  const [claimedId,     setClaimedId]     = useState(1);
  const [claimTargetId, setClaimTargetId] = useState(null);
  const [offerForm,     setOfferForm]     = useState(null);
  const [eventForm,     setEventForm]     = useState(null);
  const [pay,           setPay]           = useState(null);
  const [vrf,           setVrf]           = useState(null);
  const [hoverId,       setHoverId]       = useState(null);

  const active = rows.find(r => r.id === activeId);
  const biz    = rows.find(r => r.id === claimedId);

  const list = (cat === 'All' ? rows : rows.filter(r => r.cat === cat)).filter(r =>
    !search || [r.name, r.cat, r.hood, r.addr].some(f => f?.toLowerCase().includes(search.toLowerCase()))
  );

  const ping     = m  => { setToast(m); setTimeout(() => setToast(''), 1700); };
  const go       = v  => {
    setView(v);
    requestAnimationFrame(() => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
    });
  };
  const open     = l  => { setActiveId(l.id); go('detail'); };
  const patchBiz = (id, p) => setRows(rs => rs.map(r => r.id === id ? { ...r, ...p } : r));
  const genCode  = ()  => String(Math.floor(100000 + Math.random() * 900000));

  const subscribe = () => {
    const p = pay;
    const digits = (p.card || '').replace(/\D/g, '');
    if (!p.email || digits.length < 15 || (p.exp || '').length < 5 || (p.cvc || '').length < 3 || !p.name) {
      setPay({ ...p, err: 'Please complete all fields with a valid card.' });
      return;
    }
    const target = claimTargetId || 1;
    patchBiz(target, {
      status: 'claimed',
      sub: { active: true, brand: 'Visa', last4: digits.slice(-4), since: new Date().toISOString().slice(0, 10), renews: nextMonthISO() },
    });
    setClaimedId(target);
    setTab('details');
    setPay(null);
    ping('Subscription active');
    go('dash');
  };

  return (
    <div className="app">
      {/* nav */}
      <nav className="nav"><div className="inner">
        <div className="brand" onClick={() => go('home')}>Fredpages</div>
        <button
          className={'navlink' + (view === 'list' ? ' on' : '')}
          onClick={() => go('list')}
        >
          Places
        </button>
        <button
          className={'navlink' + (view === 'list' && cat === 'Services' ? ' on' : '')}
          onClick={() => { setCat('Services'); go('list'); }}
        >
          Services
        </button>
        <div className="searchbox">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#8b938f" strokeWidth="2"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3" strokeLinecap="round"/></svg>
          <input
            placeholder="Search businesses, places, parks…"
            value={search}
            onChange={e => { setSearch(e.target.value); if (view !== 'list') go('list'); }}
          />
        </div>
        <button className="btn btn-primary" onClick={() => { setClaimTargetId(null); go('claim'); }}>Claim a business</button>
      </div></nav>

      {/* ── HOME ── */}
      {view === 'home' && (
        <Home
          onPlaces={() => go('list')}
          onClaim={() => { setClaimTargetId(null); go('claim'); }}
        />
      )}

      {/* ── BROWSE — always mounted so the map never unmounts ── */}
      <div style={{ display: view === 'list' ? 'block' : 'none' }}>
        <div className="browse">
          <div id="fxbg-map" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', background: '#e8e6df', zIndex: 1 }}>
            <MapView rows={rows} cat={cat} hoverId={hoverId} onOpen={open} shown={view === 'list'} />
          </div>
          <ListPanel
            list={list}
            cat={cat}
            onCat={setCat}
            hoverId={hoverId}
            onHover={setHoverId}
            onOpen={open}
            onClaim={() => { setClaimTargetId(null); go('claim'); }}
            onAdmin={() => { setAtab('listings'); go('admin'); }}
          />
        </div>
      </div>

      {/* ── DETAIL ── */}
      {view === 'detail' && active && (
        <Detail
          active={active}
          onBack={() => go('list')}
          onDash={() => { setClaimedId(active.id); setTab('details'); go('dash'); }}
          onClaim={() => { setClaimTargetId(active.id); go('claim'); }}
          ping={ping}
        />
      )}

      {/* ── CLAIM ── */}
      {view === 'claim' && (
        <Claim
          onContinue={() => {
            const target = claimTargetId || (rows.find(r => r.status === 'auto') || { id: 1 }).id;
            setClaimTargetId(target);
            setVrf({ method: 'phone', sent: false, code: '', entry: '', err: '' });
            go('verify');
          }}
        />
      )}

      {/* ── VERIFY ── */}
      {view === 'verify' && vrf && (
        <Verify
          vrf={vrf}
          setVrf={setVrf}
          vBiz={rows.find(r => r.id === claimTargetId)}
          onBack={() => go('claim')}
          onVerified={() => { setPay({ email: '', card: '', exp: '', cvc: '', name: '', zip: '', err: '' }); go('checkout'); }}
          genCode={genCode}
        />
      )}

      {/* ── CHECKOUT ── */}
      {view === 'checkout' && pay && (
        <Checkout
          pay={pay}
          setPay={setPay}
          coBiz={rows.find(r => r.id === claimTargetId)}
          onBack={() => go('claim')}
          onSubscribe={subscribe}
        />
      )}

      {/* ── OWNER DASHBOARD ── */}
      {view === 'dash' && biz && (
        <Dashboard
          biz={biz}
          tab={tab}
          setTab={setTab}
          claimedId={claimedId}
          patchBiz={patchBiz}
          offerForm={offerForm}
          setOfferForm={setOfferForm}
          eventForm={eventForm}
          setEventForm={setEventForm}
          onBack={() => go('list')}
          onViewProfile={() => { setActiveId(claimedId); go('detail'); }}
          onCheckout={() => { setClaimTargetId(claimedId); setPay({ email: '', card: '', exp: '', cvc: '', name: '', zip: '', err: '' }); go('checkout'); }}
          ping={ping}
        />
      )}

      {/* ── ADMIN ── */}
      {view === 'admin' && (
        <Admin
          rows={rows}
          setRows={setRows}
          atab={atab}
          setAtab={setAtab}
          onBack={() => go('list')}
          onEditRow={r => {
            if (!PLACE_CATS.has(r.cat)) {
              setClaimedId(r.id);
              setTab('details');
              go('dash');
            } else {
              ping(`Editing ${r.name}`);
            }
          }}
          ping={ping}
        />
      )}

      <footer className="foot"><div className="inner">
        Fredericksburg business directory · prototype
        <span style={{ margin: '0 8px', color: 'var(--line)' }}>·</span>
        <button
          style={{ background: 'none', border: 'none', color: 'var(--text-3)', fontSize: 12, cursor: 'pointer', padding: 0 }}
          onClick={() => { setAtab('listings'); go('admin'); }}
        >
          Admin
        </button>
      </div></footer>
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}
