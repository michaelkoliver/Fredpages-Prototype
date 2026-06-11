import { useState } from 'react';
import { DATA, nextMonthISO, PUBLIC_PLACE_CATS } from './data';
import MapView from './components/MapView';
import ListPanel from './components/ListPanel';
import Detail from './pages/Detail';
import Claim from './pages/Claim';
import Verify from './pages/Verify';
import Checkout from './pages/Checkout';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';
import Home from './pages/Home';
import Deals from './pages/Deals';
import Events from './pages/Events';
import Services from './pages/Services';
import Join from './pages/Join';
import MemberSignup from './pages/MemberSignup';
import OwnerSignup from './pages/OwnerSignup';
import BusinessSelect from './pages/BusinessSelect';
import Login from './pages/Login';
import PfpMenu from './components/PfpMenu';

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
  const [localUser,     setLocalUser]     = useState(null);
  const [ownerUser,     setOwnerUser]     = useState(null);

  const active = rows.find(r => r.id === activeId);
  const biz    = rows.find(r => r.id === claimedId);

  const placesRows = rows.filter(r => !(r.cat === 'Services' && !r.coords));
  const list = (cat === 'All' ? placesRows : placesRows.filter(r => r.cat === cat)).filter(r =>
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

  const startClaim = targetId => {
    setClaimTargetId(targetId || null);
    if (!ownerUser) {
      go('ownerSignup');
    } else if (targetId) {
      go('claim');
    } else {
      go('businessSelect');
    }
  };

  const addNewListing = form => {
    const nextId = Math.max(...rows.map(r => r.id)) + 1;
    const newRow = {
      id: nextId,
      name: form.name,
      cat: form.cat,
      hood: form.hood || 'Fredericksburg',
      color: '#5a6b7a',
      rating: 0,
      reviews: 0,
      open: true,
      until: '',
      status: 'auto',
      coords: null,
      addr: form.addr || '',
      phone: form.phone || '',
      web: form.web || '',
      about: '',
      hours: [],
      offers: [],
      events: [],
    };
    setRows(rs => [...rs, newRow]);
    setClaimTargetId(nextId);
    go('claim');
  };

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
      <div className="header">
      <nav className="nav"><div className="inner">
        <div className="brand" onClick={() => go('home')}>Fredpages</div>
        <div className="searchbox">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#8b938f" strokeWidth="2"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3" strokeLinecap="round"/></svg>
          <input
            placeholder="Search businesses, places, parks…"
            value={search}
            onChange={e => { setSearch(e.target.value); if (view !== 'places') go('places'); }}
          />
        </div>
        {localUser
          ? <PfpMenu
              user={localUser}
              onSignOut={() => { setLocalUser(null); go('home'); }}
              items={[
                { label: 'Reviews', icon: <path d="M12 2l3 7h7l-5.5 4 2 7-6.5-4.5L5.5 20l2-7L2 9h7z"/>, onClick: () => ping('Reviews coming soon') },
                { label: 'Saved places', icon: <path d="M6 3h12v18l-6-4-6 4z"/>, onClick: () => ping('Saved places coming soon') },
                { label: 'Followed deals', icon: <><path d="M21 11l-9-9H3v9l9 9z"/><circle cx="7.5" cy="7.5" r="1.5"/></>, onClick: () => ping('Followed deals coming soon') },
              ]}
            />
          : ownerUser
            ? <PfpMenu
                user={ownerUser}
                onSignOut={() => { setOwnerUser(null); go('home'); }}
                items={[
                  { label: 'My business', icon: <><path d="M3 10l2-6h14l2 6"/><path d="M4 10v10h16V10"/></>, onClick: () => { setClaimTargetId(null); go('businessSelect'); } },
                ]}
              />
            : <button className="btn btn-primary" onClick={() => go('login')}>Join / Log in</button>}
      </div></nav>

      <nav className="nav-secondary"><div className="inner">
        <button
          className={'navlink' + (view === 'places' && cat === 'All' ? ' on' : '')}
          onClick={() => { setCat('All'); go('places'); }}
        >
          Places
        </button>
        <button
          className={'navlink' + (view === 'services' ? ' on' : '')}
          onClick={() => go('services')}
        >
          Services
        </button>
        <button
          className={'navlink' + (view === 'deals' ? ' on' : '')}
          onClick={() => go('deals')}
        >
          Deals
        </button>
        <button
          className={'navlink' + (view === 'events' ? ' on' : '')}
          onClick={() => go('events')}
        >
          Events
        </button>
      </div></nav>
      </div>

      {/* ── HOME ── */}
      {view === 'home' && (
        <Home
          onPlaces={() => go('places')}
          onOpen={open}
        />
      )}

      {view === 'deals' && <Deals />}
      {view === 'events' && <Events />}
      {view === 'services' && <Services rows={rows} onOpen={open} />}

      {view === 'login' && (
        <Login
          onBack={() => go('home')}
          onSignUp={() => go('join')}
          onSubmit={u => { setLocalUser(u); ping('Welcome back'); go('home'); }}
        />
      )}

      {view === 'join' && (
        <Join
          onBack={() => go('login')}
          onMember={() => go('memberSignup')}
          onOwner={() => go('ownerSignup')}
          onLogin={() => go('login')}
        />
      )}

      {view === 'memberSignup' && (
        <MemberSignup
          onBack={() => go('join')}
          onSubmit={u => { setLocalUser(u); ping('Welcome to Fredpages'); go('home'); }}
        />
      )}

      {view === 'ownerSignup' && (
        <OwnerSignup
          onBack={() => go(claimTargetId ? 'detail' : 'join')}
          onSubmit={u => {
            setOwnerUser(u);
            if (claimTargetId) go('claim');
            else go('businessSelect');
          }}
        />
      )}

      {view === 'businessSelect' && (
        <BusinessSelect
          rows={rows}
          onBack={() => go('home')}
          onClaimExisting={id => { setClaimTargetId(id); go('claim'); }}
          onAddListing={addNewListing}
        />
      )}

      {/* ── BROWSE — always mounted so the map never unmounts ── */}
      <div style={{ display: view === 'places' ? 'block' : 'none' }}>
        <div className="browse">
          <div id="fxbg-map" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', background: '#e8e6df', zIndex: 1 }}>
            <MapView rows={placesRows} cat={cat} hoverId={hoverId} onOpen={open} shown={view === 'places'} />
          </div>
          <ListPanel
            list={list}
            cat={cat}
            onCat={setCat}
            hoverId={hoverId}
            onHover={setHoverId}
            onOpen={open}
            onClaim={() => startClaim(null)}
            onAdmin={() => { setAtab('listings'); go('admin'); }}
          />
        </div>
      </div>

      {/* ── DETAIL ── */}
      {view === 'detail' && active && (
        <Detail
          active={active}
          onBack={() => go(active.cat === 'Services' ? 'services' : 'places')}
          onDash={() => { setClaimedId(active.id); setTab('details'); go('dash'); }}
          onClaim={() => startClaim(active.id)}
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
          onBack={() => go('places')}
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
          onBack={() => go('places')}
          onEditRow={r => {
            if (!PUBLIC_PLACE_CATS.has(r.cat)) {
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
