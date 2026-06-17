import { useState } from 'react';
import { DATA, nextMonthISO } from './data';
import MapView from './components/MapView';
import ListPanel from './components/ListPanel';
import Detail from './pages/Detail';
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
import ClaimRequest from './pages/ClaimRequest';
import Neighborhoods from './pages/Neighborhoods';
import PfpMenu from './components/PfpMenu';

const INITIAL_CLAIM_REQUESTS = [
  { id: 'cr-h1', listingId: 1, userFirstName: 'Maya',   userLastName: 'Chen',   userEmail: 'maya@carolinestcoffee.com',  role: 'Owner',   status: 'completed', submittedAt: '2025-08-20' },
  { id: 'cr-h2', listingId: 2, userFirstName: 'Robert', userLastName: 'Hyde',   userEmail: 'robert@hyperionantiques.com', role: 'Owner',   status: 'completed', submittedAt: '2025-11-10' },
  { id: 'cr-h3', listingId: 3, userFirstName: 'Jess',   userLastName: 'Carver', userEmail: 'jess@battlefieldbrewing.com', role: 'Owner',   status: 'completed', submittedAt: '2025-06-25' },
  { id: 'cr-p1', listingId: 4, userFirstName: 'Hans',   userLastName: 'Mueller', userEmail: 'hans@bavarianchef.com',      role: 'Owner',   status: 'pending',   submittedAt: '2026-06-09' },
  { id: 'cr-p2', listingId: 5, userFirstName: 'Linda',  userLastName: 'Park',    userEmail: 'linda@riverbybooks.com',     role: 'Manager', status: 'pending',   submittedAt: '2026-06-08' },
];

export default function App() {
  const [view,          setView]          = useState('home');
  const [activeId,      setActiveId]      = useState(null);
  const [cat,           setCat]           = useState('All');
  const [search,        setSearch]        = useState('');
  const [tab,           setTab]           = useState('details');
  const [atab,           setAtab]          = useState('claims');
  const [toast,          setToast]         = useState('');
  const [rows,           setRows]          = useState(DATA);
  const [claimedId,      setClaimedId]     = useState(1);
  const [claimTargetId,  setClaimTargetId] = useState(null);
  const [offerForm,      setOfferForm]     = useState(null);
  const [eventForm,      setEventForm]     = useState(null);
  const [pay,            setPay]           = useState(null);
  const [hoverId,        setHoverId]       = useState(null);
  const [localUser,      setLocalUser]     = useState(null);
  const [ownerUser,      setOwnerUser]     = useState(null);
  const [claimRequests,  setClaimRequests] = useState(INITIAL_CLAIM_REQUESTS);
  const [ownerListingId, setOwnerListingId] = useState(null);

  const active = rows.find(r => r.id === activeId);
  const biz    = rows.find(r => r.id === claimedId);

  const placesRows = rows.filter(r => !(r.type === 'service' && !r.coords));
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

  const startClaim = targetId => {
    setClaimTargetId(targetId || null);
    if (!ownerUser) {
      go('ownerSignup');
    } else if (targetId) {
      go('claimRequest');
    } else {
      go('businessSelect');
    }
  };

  const buildRow = (form, nextId) => ({
    id: nextId,
    name: form.name,
    cat: form.cat,
    type: form.type || 'business',
    hood: form.hood || '',
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
    ...(form.type === 'public' ? { claimable: false } : {}),
  });

  const addNewListing = form => {
    const nextId = Math.max(...rows.map(r => r.id)) + 1;
    setRows(rs => [...rs, buildRow(form, nextId)]);
    setClaimTargetId(nextId);
    go('claimRequest');
  };

  const adminAddListing = form => {
    const nextId = Math.max(...rows.map(r => r.id)) + 1;
    setRows(rs => [...rs, buildRow(form, nextId)]);
  };

  const submitClaimRequest = ({ role }) => {
    const newReq = {
      id: 'cr-' + Date.now(),
      listingId: claimTargetId,
      userFirstName: ownerUser.firstName,
      userLastName: ownerUser.lastName,
      userEmail: ownerUser.email,
      role,
      status: 'pending',
      submittedAt: new Date().toISOString().slice(0, 10),
    };
    setClaimRequests(rs => [...rs, newReq]);
    setOwnerListingId(claimTargetId);
    ping('Claim submitted — pending review');
    go('home');
  };

  const myBusiness = () => {
    if (!ownerListingId) {
      setClaimTargetId(null);
      go('businessSelect');
      return;
    }
    const listing = rows.find(r => r.id === ownerListingId);
    if (!listing) { setClaimTargetId(null); go('businessSelect'); return; }
    const req = [...claimRequests].reverse().find(r => r.listingId === ownerListingId && r.userEmail === ownerUser.email);
    if (!req) { setClaimTargetId(null); go('businessSelect'); return; }
    if (req.status === 'pending')         { ping('Your claim is pending review'); return; }
    if (req.status === 'rejected')        { ping('Your claim was rejected'); setClaimTargetId(null); go('businessSelect'); return; }
    if (req.status === 'approved_unpaid') {
      setClaimTargetId(ownerListingId);
      setPay({ email: ownerUser.email, card: '', exp: '', cvc: '', name: (ownerUser.firstName + ' ' + ownerUser.lastName).trim(), zip: '', err: '' });
      go('checkout');
      return;
    }
    setClaimedId(ownerListingId);
    setTab('details');
    go('dash');
  };

  const approveClaim = id => {
    setClaimRequests(rs => rs.map(r => r.id === id ? { ...r, status: 'approved_unpaid' } : r));
    ping('Claim approved');
  };
  const rejectClaim = id => {
    setClaimRequests(rs => rs.map(r => r.id === id ? { ...r, status: 'rejected' } : r));
    ping('Claim rejected');
  };
  const toggleClaimable = id => patchBiz(id, { claimable: rows.find(r => r.id === id)?.claimable === false ? true : false });
  const toggleClosed    = id => { const r = rows.find(x => x.id === id); patchBiz(id, { open: !r.open }); };
  const subAction = (id, action) => {
    const r = rows.find(x => x.id === id);
    if (!r) return;
    const sub = r.sub || { brand: 'Visa', last4: '0000', since: new Date().toISOString().slice(0, 10), renews: nextMonthISO() };
    if (action === 'comp') {
      const d = new Date((sub.renews || nextMonthISO()) + 'T00:00');
      d.setMonth(d.getMonth() + 1);
      patchBiz(id, { sub: { ...sub, renews: d.toISOString().slice(0, 10) } });
      ping('Comped one month');
      return;
    }
    if (action === 'cancel') {
      patchBiz(id, { sub: { ...sub, active: false, status: 'canceled' } });
      ping('Subscription canceled');
      return;
    }
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
      sub: { active: true, status: 'active', brand: 'Visa', last4: digits.slice(-4), since: new Date().toISOString().slice(0, 10), renews: nextMonthISO() },
    });
    setClaimRequests(rs => rs.map(r => r.listingId === target && r.status === 'approved_unpaid' ? { ...r, status: 'completed' } : r));
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
                onSignOut={() => { setOwnerUser(null); setOwnerListingId(null); go('home'); }}
                items={[
                  { label: 'My business', icon: <><path d="M3 10l2-6h14l2 6"/><path d="M4 10v10h16V10"/></>, onClick: myBusiness },
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
        <button
          className={'navlink' + (view === 'neighborhoods' ? ' on' : '')}
          onClick={() => go('neighborhoods')}
        >
          Neighborhoods
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
      {view === 'neighborhoods' && <Neighborhoods />}

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
            if (claimTargetId) go('claimRequest');
            else go('businessSelect');
          }}
        />
      )}

      {view === 'businessSelect' && (
        <BusinessSelect
          rows={rows.filter(r => !claimRequests.some(cr => cr.listingId === r.id && (cr.status === 'pending' || cr.status === 'approved_unpaid' || cr.status === 'completed')))}
          onBack={() => go('home')}
          onClaimExisting={id => { setClaimTargetId(id); go('claimRequest'); }}
          onAddListing={addNewListing}
        />
      )}

      {view === 'claimRequest' && ownerUser && (
        <ClaimRequest
          listing={rows.find(r => r.id === claimTargetId)}
          owner={ownerUser}
          onBack={() => go('businessSelect')}
          onSubmit={submitClaimRequest}
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
            onAdmin={() => { setAtab('claims'); go('admin'); }}
          />
        </div>
      </div>

      {/* ── DETAIL ── */}
      {view === 'detail' && active && (
        <Detail
          active={active}
          onBack={() => go(active.type === 'service' ? 'services' : 'places')}
          onDash={() => { setClaimedId(active.id); setTab('details'); go('dash'); }}
          onClaim={() => startClaim(active.id)}
          ping={ping}
        />
      )}

      {/* ── CHECKOUT ── */}
      {view === 'checkout' && pay && (
        <Checkout
          pay={pay}
          setPay={setPay}
          coBiz={rows.find(r => r.id === claimTargetId)}
          onBack={() => go('home')}
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
          claimRequests={claimRequests}
          atab={atab}
          setAtab={setAtab}
          onBack={() => go('places')}
          onApproveClaim={approveClaim}
          onRejectClaim={rejectClaim}
          onToggleClaimable={toggleClaimable}
          onToggleClosed={toggleClosed}
          onSubAction={subAction}
          onAddListing={adminAddListing}
          onEditRow={r => {
            if (r.type !== 'public') {
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
          onClick={() => { setAtab('claims'); go('admin'); }}
        >
          Admin
        </button>
      </div></footer>
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}
