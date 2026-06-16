import { useState } from 'react';
import { initials, BUSINESS_CATS, SERVICE_CATS, PUBLIC_CATS, fmtLong } from '../data';

const TYPE_CATS = { business: BUSINESS_CATS, service: SERVICE_CATS, public: PUBLIC_CATS };
const TYPE_LABEL = { business: 'Business', service: 'Service', public: 'Public place' };

const STATUS_LABEL = {
  pending: 'Pending',
  approved_unpaid: 'Approved — unpaid',
  completed: 'Claimed',
  rejected: 'Rejected',
  none: 'Unclaimed',
};

function getClaimStatus(row, requests) {
  const req = [...requests].reverse().find(r => r.listingId === row.id && r.status !== 'rejected');
  if (req) return req.status;
  return 'none';
}

function getOwner(row, requests) {
  const req = [...requests].reverse().find(r => r.listingId === row.id && r.status !== 'rejected');
  if (!req) return null;
  return { name: (req.userFirstName + ' ' + req.userLastName).trim(), email: req.userEmail };
}

function subState(row) {
  if (row.sub?.active) return 'Active';
  if (row.sub?.status === 'past_due') return 'Past due';
  if (row.sub?.status === 'canceled') return 'Canceled';
  return '—';
}

const TABS = [
  ['claims', 'Claim Requests'],
  ['listings', 'Listings'],
  ['subs', 'Subscriptions'],
];

const BLANK = { type: 'business', name: '', cat: 'Restaurant', hood: 'Downtown', addr: '' };

export default function Admin({
  rows,
  claimRequests,
  atab,
  setAtab,
  onBack,
  onApproveClaim,
  onRejectClaim,
  onToggleClaimable,
  onToggleClosed,
  onEditRow,
  onSubAction,
  onAddListing,
  ping,
}) {
  const [form, setForm] = useState(BLANK);
  const [showAdd, setShowAdd] = useState(false);

  const submitAdd = () => {
    const nm = form.name.trim();
    if (!nm) { ping('Name required'); return; }
    onAddListing({ ...form, name: nm });
    setForm(BLANK);
    setShowAdd(false);
    ping('Listing added');
  };

  const pending = claimRequests.filter(r => r.status === 'pending');
  const subRows = rows.filter(r => {
    const s = getClaimStatus(r, claimRequests);
    return s !== 'none' || r.sub;
  });

  return (
    <div className="page-wrap" style={{ paddingBottom: 50 }}>
      <button className="back" onClick={onBack}>← Back</button>
      <div className="panel">
        <div className="side">
          <div className="who">
            <div className="av" style={{ background: '#15663f' }}>A</div>
            <div><b>Admin</b><small>Operator</small></div>
          </div>
          {TABS.map(([k, l]) => (
            <a key={k} className={atab === k ? 'on' : ''} onClick={() => setAtab(k)}>
              {l}
              {k === 'claims' && pending.length > 0 && <span className="adm-badge">{pending.length}</span>}
            </a>
          ))}
        </div>
        <div className="main">
          {atab === 'claims' && (
            <>
              <h2>Claim requests</h2>
              <p className="sub">{pending.length} pending</p>
              {pending.length === 0 && <p className="empty">No pending claim requests.</p>}
              {pending.map(req => {
                const listing = rows.find(r => r.id === req.listingId);
                return (
                  <div key={req.id} className="claim-row">
                    <div className="claim-row-main">
                      <div className="claim-row-biz">
                        <span className="av" style={{ background: listing?.color || '#5a6b7a' }}>{initials(listing?.name || '?')}</span>
                        <div>
                          <b>{listing?.name || 'Unknown listing'}</b>
                          <small>{listing?.cat} · {listing?.hood}</small>
                        </div>
                      </div>
                      <div className="claim-row-who">
                        <b>{req.userFirstName} {req.userLastName}</b>
                        <small>{req.userEmail}</small>
                        <small>{req.role} · submitted {fmtLong(req.submittedAt) || req.submittedAt}</small>
                      </div>
                    </div>
                    <div className="claim-row-acts">
                      <button className="btn btn-primary" onClick={() => onApproveClaim(req.id)}>Approve</button>
                      <button className="btn" onClick={() => onRejectClaim(req.id)}>Reject</button>
                    </div>
                  </div>
                );
              })}
            </>
          )}

          {atab === 'listings' && (
            <>
              <div className="adm-head">
                <div>
                  <h2>Listings</h2>
                  <p className="sub">{rows.length} total · {rows.filter(r => r.claimable !== false).length} claimable</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowAdd(s => !s)}>{showAdd ? 'Cancel' : '+ Add listing'}</button>
              </div>
              {showAdd && (
                <div className="formcard">
                  <div className="two">
                    <div className="fld">
                      <label>Type</label>
                      <select value={form.type} onChange={e => { const t = e.target.value; setForm({ ...form, type: t, cat: TYPE_CATS[t][0] }); }}>
                        {Object.keys(TYPE_CATS).map(t => <option key={t} value={t}>{TYPE_LABEL[t]}</option>)}
                      </select>
                    </div>
                    <div className="fld">
                      <label>Category</label>
                      <select value={form.cat} onChange={e => setForm({ ...form, cat: e.target.value })}>
                        {TYPE_CATS[form.type].map(c => <option key={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="fld">
                    <label>Name</label>
                    <input placeholder="e.g. Picker's Supply" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                  </div>
                  <div className="fld">
                    <label>Neighborhood</label>
                    <input value={form.hood} onChange={e => setForm({ ...form, hood: e.target.value })} />
                  </div>
                  <div className="fld">
                    <label>Address</label>
                    <input placeholder="000 Caroline St" value={form.addr} onChange={e => setForm({ ...form, addr: e.target.value })} />
                  </div>
                  <div className="formbtns">
                    <button className="btn btn-primary" onClick={submitAdd}>Add</button>
                  </div>
                </div>
              )}
              <div className="tblscroll">
                <table className="tbl tbl-stack">
                  <thead><tr><th>Name</th><th>Category</th><th>Claimable</th><th>Claim</th><th>Subscription</th><th>Owner</th><th></th></tr></thead>
                  <tbody>
                    {rows.map(r => {
                      const cs = getClaimStatus(r, claimRequests);
                      const o = getOwner(r, claimRequests);
                      return (
                        <tr key={r.id}>
                          <td data-label="Name"><span className="tn"><span className="av" style={{ background: r.color }}>{initials(r.name)}</span>{r.name}</span></td>
                          <td data-label="Category" style={{ color: 'var(--text-2)' }}>{r.cat}</td>
                          <td data-label="Claimable">{r.claimable === false ? 'No' : 'Yes'}</td>
                          <td data-label="Claim"><span className={'st ' + (cs === 'completed' ? 'claimed' : 'auto')}>{STATUS_LABEL[cs]}</span></td>
                          <td data-label="Subscription">{subState(r)}</td>
                          <td data-label="Owner" style={{ color: 'var(--text-2)' }}>{o ? o.name : '—'}</td>
                          <td data-label="" className="td-acts">
                            <button className="miniedit" onClick={() => onEditRow(r)}>Edit</button>
                            {r.type !== 'public' && (
                              <button className="miniedit" onClick={() => onToggleClaimable(r.id)}>{r.claimable === false ? 'Make claimable' : 'Make unclaimable'}</button>
                            )}
                            <button className="miniedit" onClick={() => onToggleClosed(r.id)}>{r.open ? 'Mark closed' : 'Reopen'}</button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {atab === 'subs' && (
            <>
              <h2>Subscriptions</h2>
              <p className="sub">{subRows.length} listings with claim or subscription activity</p>
              {subRows.length === 0 && <p className="empty">No subscriptions yet.</p>}
              <div className="tblscroll">
                <table className="tbl tbl-stack">
                  <thead><tr><th>Business</th><th>Owner</th><th>Claim</th><th>Subscription</th><th>Renews</th><th></th></tr></thead>
                  <tbody>
                    {subRows.map(r => {
                      const cs = getClaimStatus(r, claimRequests);
                      const o = getOwner(r, claimRequests);
                      const ss = subState(r);
                      return (
                        <tr key={r.id}>
                          <td data-label="Business"><span className="tn"><span className="av" style={{ background: r.color }}>{initials(r.name)}</span>{r.name}</span></td>
                          <td data-label="Owner" style={{ color: 'var(--text-2)' }}>{o ? <>{o.name}<br /><small style={{ color: 'var(--text-3)' }}>{o.email}</small></> : '—'}</td>
                          <td data-label="Claim"><span className={'st ' + (cs === 'completed' ? 'claimed' : 'auto')}>{STATUS_LABEL[cs]}</span></td>
                          <td data-label="Subscription">{ss}</td>
                          <td data-label="Renews" style={{ color: 'var(--text-2)' }}>{r.sub?.renews ? fmtLong(r.sub.renews) : '—'}</td>
                          <td data-label="" className="td-acts">
                            <button className="miniedit" onClick={() => onSubAction(r.id, 'comp')}>Comp month</button>
                            <button className="miniedit" onClick={() => onSubAction(r.id, 'cancel')}>Cancel</button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
