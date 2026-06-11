import { useState } from 'react';
import { tone, initials, PLACE_CATS, CATS } from '../data';

const BLANK = { name: '', cat: 'Restaurant', hood: '', addr: '', phone: '', web: '' };

export default function BusinessSelect({ rows, onBack, onClaimExisting, onAddListing }) {
  const [mode, setMode] = useState('pick');
  const [search, setSearch] = useState('');
  const [form, setForm] = useState(BLANK);
  const [err, setErr] = useState('');

  const claimable = rows
    .filter(r => !PLACE_CATS.has(r.cat) && r.status !== 'claimed')
    .filter(r => !search || r.name.toLowerCase().includes(search.toLowerCase()) || (r.addr || '').toLowerCase().includes(search.toLowerCase()));

  const submitNew = () => {
    if (!form.name || !form.cat) {
      setErr('Name and category are required.');
      return;
    }
    onAddListing(form);
  };

  if (mode === 'new') {
    return (
      <div className="center" style={{ maxWidth: 480 }}>
        <button className="back" onClick={() => setMode('pick')}>←</button>
        <h1>Add business</h1>
        <div className="paycard" style={{ textAlign: 'left' }}>
          {err && <div className="payerr">{err}</div>}
          <div className="fld">
            <label>Business name *</label>
            <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="fld">
            <label>Category *</label>
            <select value={form.cat} onChange={e => setForm({ ...form, cat: e.target.value })}>
              {CATS.filter(c => c !== 'All' && !PLACE_CATS.has(c)).map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="fld">
            <label>Neighborhood</label>
            <input value={form.hood} onChange={e => setForm({ ...form, hood: e.target.value })} />
          </div>
          <div className="fld">
            <label>Address</label>
            <input value={form.addr} onChange={e => setForm({ ...form, addr: e.target.value })} />
          </div>
          <div className="two">
            <div className="fld">
              <label>Phone</label>
              <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div className="fld">
              <label>Website</label>
              <input value={form.web} onChange={e => setForm({ ...form, web: e.target.value })} />
            </div>
          </div>
          <button className="btn btn-primary" style={{ width: '100%', padding: 13 }} onClick={submitNew}>Continue</button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrap">
      <button className="back" onClick={onBack}>←</button>
      <h1 style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-.02em', margin: '8px 0 14px' }}>Find your business</h1>
      <div className="searchbox" style={{ maxWidth: 'none', marginBottom: 14 }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#8b938f" strokeWidth="2"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3" strokeLinecap="round"/></svg>
        <input placeholder="Search by name or address" value={search} onChange={e => setSearch(e.target.value)} />
      </div>
      <div style={{ paddingBottom: 40 }}>
        {claimable.map(b => (
          <div key={b.id} className="card" onClick={() => onClaimExisting(b.id)}>
            <div className="thumb thumb-ph" style={{ background: tone(b.color) }}>{initials(b.name)}</div>
            <div className="card-body">
              <div className="card-row1">
                <span className="bizname">{b.name}</span>
              </div>
              <div className="metaline">
                {b.cat}<span className="dot">·</span>{b.hood}
                {b.addr && <><span className="dot">·</span>{b.addr}</>}
              </div>
              <div className="chips">
                <span className="claimchip">Unclaimed</span>
              </div>
            </div>
          </div>
        ))}
        {claimable.length === 0 && <p className="empty">No matches.</p>}
        <button className="dashed" onClick={() => setMode('new')}>+ Add new</button>
      </div>
    </div>
  );
}
