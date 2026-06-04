import { tone, initials, fmtDate, fmtLong, KINDS } from '../data';

export default function Dashboard({ biz, tab, setTab, claimedId, patchBiz, offerForm, setOfferForm, eventForm, setEventForm, onBack, onViewProfile, onCheckout, ping }) {
  if (!biz) return null;

  const saveOffer = f => {
    const o = { kind: f.kind, title: (f.title || '').trim() || 'Untitled offer', details: (f.details || '').trim(), expires: f.expires };
    const arr = [...biz.offers];
    if (f.idx == null) arr.push(o); else arr[f.idx] = o;
    patchBiz(claimedId, { offers: arr });
    setOfferForm(null);
    ping(f.idx == null ? 'Offer published' : 'Offer updated');
  };

  const removeOffer = i => {
    patchBiz(claimedId, { offers: biz.offers.filter((_, j) => j !== i) });
    ping('Offer removed');
  };

  const saveEvent = f => {
    const e = { title: (f.title || '').trim() || 'Untitled event', date: f.date, time: (f.time || '').trim(), desc: (f.desc || '').trim() };
    const arr = [...biz.events];
    if (f.idx == null) arr.push(e); else arr[f.idx] = e;
    patchBiz(claimedId, { events: arr });
    setEventForm(null);
    ping(f.idx == null ? 'Event published' : 'Event updated');
  };

  const removeEvent = i => {
    patchBiz(claimedId, { events: biz.events.filter((_, j) => j !== i) });
    ping('Event removed');
  };

  return (
    <div className="page-wrap" style={{ paddingBottom: 50 }}>
      <button className="back" onClick={onBack}>← Back</button>
      <div className="panel">
        <div className="side">
          <div className="who">
            <div className="av" style={{ background: biz.color }}>{initials(biz.name)}</div>
            <div><b>{biz.name}</b><small>Verified</small></div>
          </div>
          {[['details', 'Profile'], ['offers', 'Offers'], ['events', 'Events'], ['photos', 'Photos'], ['billing', 'Billing'], ['stats', 'Insights']].map(([k, l]) => (
            <a key={k} className={tab === k ? 'on' : ''} onClick={() => setTab(k)}>{l}</a>
          ))}
        </div>
        <div className="main">
          {tab === 'details' && (
            <>
              <h2>Profile</h2><p className="sub">Changes go live right away.</p>
              <div className="fld">
                <label>Business name</label>
                <input value={biz.name} onChange={e => patchBiz(claimedId, { name: e.target.value })} />
              </div>
              <div className="two">
                <div className="fld"><label>Phone</label><input value={biz.phone} onChange={e => patchBiz(claimedId, { phone: e.target.value })} /></div>
                <div className="fld"><label>Website</label><input value={biz.web} onChange={e => patchBiz(claimedId, { web: e.target.value })} /></div>
              </div>
              <div className="fld"><label>Address</label><input value={biz.addr} onChange={e => patchBiz(claimedId, { addr: e.target.value })} /></div>
              <div className="fld"><label>Description</label><textarea rows={3} value={biz.about} onChange={e => patchBiz(claimedId, { about: e.target.value })} /></div>
              <div className="publishbar">
                <button className="btn" onClick={onViewProfile}>View profile</button>
                <button className="btn btn-primary" onClick={() => ping('Changes published')}>Publish</button>
              </div>
            </>
          )}
          {tab === 'offers' && (
            <>
              <h2>Offers & coupons</h2><p className="sub">Active offers appear on your public profile.</p>
              {biz.offers.length === 0 && !offerForm && <div className="empty">No offers yet.</div>}
              {biz.offers.map((o, i) => (
                <div key={i} className="mc">
                  <div><b>{o.title}</b><br /><small>{o.kind}{o.expires ? ` · expires ${fmtDate(o.expires)}` : ''}</small></div>
                  <div className="acts">
                    <button className="miniedit" onClick={() => setOfferForm({ idx: i, kind: o.kind, title: o.title, details: o.details, expires: o.expires })}>Edit</button>
                    <button className="linkbtn" onClick={() => removeOffer(i)}>Remove</button>
                  </div>
                </div>
              ))}
              {offerForm ? (
                <div className="formcard">
                  <h3>{offerForm.idx == null ? 'New offer' : 'Edit offer'}</h3>
                  <div className="fld"><label>Offer title</label><input value={offerForm.title} placeholder="e.g. 15% off any entrée" onChange={e => setOfferForm({ ...offerForm, title: e.target.value })} /></div>
                  <div className="two">
                    <div className="fld"><label>Type</label><select value={offerForm.kind} onChange={e => setOfferForm({ ...offerForm, kind: e.target.value })}>{KINDS.map(k => <option key={k}>{k}</option>)}</select></div>
                    <div className="fld"><label>Expiration</label><input type="date" value={offerForm.expires} onChange={e => setOfferForm({ ...offerForm, expires: e.target.value })} /></div>
                  </div>
                  <div className="fld"><label>Details / terms</label><textarea rows={2} value={offerForm.details} placeholder="Any conditions or exclusions" onChange={e => setOfferForm({ ...offerForm, details: e.target.value })} /></div>
                  <div className="formbtns">
                    <button className="btn" onClick={() => setOfferForm(null)}>Cancel</button>
                    <button className="btn btn-primary" onClick={() => saveOffer(offerForm)}>{offerForm.idx == null ? 'Publish offer' : 'Save'}</button>
                  </div>
                </div>
              ) : (
                <button className="dashed" onClick={() => setOfferForm({ idx: null, kind: '% off', title: '', details: '', expires: '' })}>+ Add offer</button>
              )}
            </>
          )}
          {tab === 'events' && (
            <>
              <h2>Events</h2><p className="sub">Shown on your profile and the city calendar.</p>
              {biz.events.length === 0 && !eventForm && <div className="empty">No events yet.</div>}
              {biz.events.map((e, i) => (
                <div key={i} className="mc">
                  <div><b>{e.title}</b><br /><small>{fmtDate(e.date)}{e.time ? ` · ${e.time}` : ''}</small></div>
                  <div className="acts">
                    <button className="miniedit" onClick={() => setEventForm({ idx: i, title: e.title, date: e.date, time: e.time, desc: e.desc })}>Edit</button>
                    <button className="linkbtn" onClick={() => removeEvent(i)}>Remove</button>
                  </div>
                </div>
              ))}
              {eventForm ? (
                <div className="formcard">
                  <h3>{eventForm.idx == null ? 'New event' : 'Edit event'}</h3>
                  <div className="fld"><label>Event title</label><input value={eventForm.title} placeholder="e.g. Live music night" onChange={e => setEventForm({ ...eventForm, title: e.target.value })} /></div>
                  <div className="two">
                    <div className="fld"><label>Date</label><input type="date" value={eventForm.date} onChange={e => setEventForm({ ...eventForm, date: e.target.value })} /></div>
                    <div className="fld"><label>Time</label><input value={eventForm.time} placeholder="7:00 PM" onChange={e => setEventForm({ ...eventForm, time: e.target.value })} /></div>
                  </div>
                  <div className="fld"><label>Description</label><textarea rows={2} value={eventForm.desc} placeholder="Optional details" onChange={e => setEventForm({ ...eventForm, desc: e.target.value })} /></div>
                  <div className="formbtns">
                    <button className="btn" onClick={() => setEventForm(null)}>Cancel</button>
                    <button className="btn btn-primary" onClick={() => saveEvent(eventForm)}>{eventForm.idx == null ? 'Publish event' : 'Save'}</button>
                  </div>
                </div>
              ) : (
                <button className="dashed" onClick={() => setEventForm({ idx: null, title: '', date: '', time: '', desc: '' })}>+ Add event</button>
              )}
            </>
          )}
          {tab === 'photos' && (
            <>
              <h2>Photos</h2><p className="sub">The first photo is your profile cover.</p>
              <div className="photogrid">
                {[0, 1, 2, 3].map(n => (
                  <div key={n} className="ptile" style={{ background: tone(biz.color), filter: `brightness(${1 - n * 0.07})` }} />
                ))}
                <button className="photoadd" onClick={() => ping('Upload photo')}>+ Add</button>
              </div>
            </>
          )}
          {tab === 'billing' && (
            <>
              <h2>Billing</h2><p className="sub">Manage your subscription and payment method.</p>
              {biz.sub ? (
                <>
                  <div className="mc">
                    <div><b>Owner plan</b><br /><small>$50.00 / month</small></div>
                    <span className={'st ' + (biz.sub.active ? 'claimed' : 'auto')}>{biz.sub.active ? 'Active' : 'Canceled'}</span>
                  </div>
                  <div className="mc">
                    <div><b>{biz.sub.active ? 'Next charge' : 'Access ends'}</b><br /><small>{fmtLong(biz.sub.renews)}</small></div>
                  </div>
                  <div className="mc">
                    <div><b>Payment method</b><br /><small>{biz.sub.brand} ending {biz.sub.last4}</small></div>
                    <button className="miniedit" onClick={() => ping('Update card')}>Update</button>
                  </div>
                  {biz.sub.active
                    ? <button className="cancelbtn" onClick={() => { patchBiz(claimedId, { sub: { ...biz.sub, active: false } }); ping('Subscription canceled'); }}>Cancel subscription</button>
                    : <button className="btn btn-primary" style={{ width: '100%', padding: 12, borderRadius: 9 }} onClick={() => { patchBiz(claimedId, { sub: { ...biz.sub, active: true } }); ping('Subscription resumed'); }}>Resume subscription</button>
                  }
                </>
              ) : (
                <>
                  <div className="empty">No active subscription.</div>
                  <button className="btn btn-primary" style={{ padding: 12, borderRadius: 9 }} onClick={onCheckout}>Subscribe — $50/mo</button>
                </>
              )}
            </>
          )}
          {tab === 'stats' && (
            <>
              <h2>Insights</h2><p className="sub">Last 30 days.</p>
              <div className="stats">
                <div className="stat"><div className="n">1,284</div><div className="l">Profile views</div><div className="d">↑ 12%</div></div>
                <div className="stat"><div className="n">73</div><div className="l">Calls & clicks</div><div className="d">↑ 8%</div></div>
                <div className="stat"><div className="n">41</div><div className="l">Offers saved</div><div className="d">↑ 21%</div></div>
              </div>
              <div className="mc"><div><b>Top search term</b><br /><small>"coffee near me" · 312 views</small></div></div>
              <div className="mc"><div><b>Busiest day</b><br /><small>Saturday · 28% of weekly views</small></div></div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
