import { useState } from 'react';
import { initials, CATS, PLACE_CATS } from '../data';

const EMPTY_FORM = { name: '', cat: 'Restaurant', hood: 'Downtown', addr: '' };

export default function Admin({ rows, setRows, atab, setAtab, onBack, onEditRow, ping }) {
  const [form, setForm] = useState(EMPTY_FORM);

  const addListing = () => {
    const nm = form.name.trim() || 'New listing';
    setRows([
      ...rows,
      {
        id: Date.now(),
        name: nm,
        cat: form.cat || 'Other',
        hood: form.hood || 'Downtown',
        color: '#5a6b7a',
        rating: 4.5,
        reviews: 0,
        open: true,
        until: '5:00 PM',
        status: 'auto',
        coords: null,
        about: '',
        addr: form.addr || '—',
        phone: '',
        web: '',
        hours: [],
        offers: [],
        events: [],
      },
    ]);
    setForm(EMPTY_FORM);
    ping('Listing added');
  };

  return (
    <div className="page-wrap" style={{ paddingBottom: 50 }}>
      <button className="back" onClick={onBack}>← Back</button>
      <div className="panel">
        <div className="side">
          <div className="who">
            <div className="av" style={{ background: '#15663f' }}>A</div>
            <div><b>Admin</b><small>Operator</small></div>
          </div>
          {[['listings', 'All listings'], ['add', 'Add listing'], ['sources', 'Data sources']].map(([k, l]) => (
            <a key={k} className={atab === k ? 'on' : ''} onClick={() => setAtab(k)}>{l}</a>
          ))}
        </div>
        <div className="main">
          {atab === 'listings' && (
            <>
              <h2>All listings</h2><p className="sub">Edit any entry — imported, claimed, or place.</p>
              <div className="banner">
                <span>
                  <b>{rows.filter(r => r.status === 'auto').length}</b> imported ·{' '}
                  <b>{rows.filter(r => r.status === 'claimed').length}</b> claimed ·{' '}
                  <b>{rows.filter(r => PLACE_CATS.has(r.cat)).length}</b> places ·{' '}
                  <b>{rows.length}</b> total
                </span>
                <button className="miniedit" onClick={() => ping('Re-syncing…')}>↻ Re-sync</button>
              </div>
              <div className="tblscroll">
                <table className="tbl">
                  <thead><tr><th>Name</th><th>Category</th><th>Status</th><th></th></tr></thead>
                  <tbody>
                    {rows.map(r => (
                      <tr key={r.id}>
                        <td><span className="tn"><span className="av" style={{ background: r.color }}>{initials(r.name)}</span>{r.name}</span></td>
                        <td style={{ color: 'var(--text-2)' }}>{r.cat}</td>
                        <td><span className={'st ' + (r.status === 'claimed' ? 'claimed' : 'auto')}>{r.status === 'claimed' ? 'Claimed' : 'Imported'}</span></td>
                        <td style={{ textAlign: 'right' }}>
                          <button className="miniedit" onClick={() => onEditRow(r)}>Edit</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
          {atab === 'add' && (
            <>
              <h2>Add listing</h2><p className="sub">Create a business or place the import missed.</p>
              <div className="fld">
                <label>Name</label>
                <input
                  placeholder="e.g. Picker's Supply"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div className="two">
                <div className="fld">
                  <label>Category</label>
                  <select value={form.cat} onChange={e => setForm({ ...form, cat: e.target.value })}>
                    {CATS.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="fld">
                  <label>Neighborhood</label>
                  <input
                    placeholder="Downtown"
                    value={form.hood}
                    onChange={e => setForm({ ...form, hood: e.target.value })}
                  />
                </div>
              </div>
              <div className="fld">
                <label>Address</label>
                <input
                  placeholder="000 Caroline St"
                  value={form.addr}
                  onChange={e => setForm({ ...form, addr: e.target.value })}
                />
              </div>
              <div className="publishbar">
                <button className="btn btn-primary" onClick={addListing}>Add listing</button>
              </div>
            </>
          )}
          {atab === 'sources' && (
            <>
              <h2>Data sources</h2><p className="sub">Where imported businesses come from.</p>
              <div className="mc"><div><b>Google Places</b><br /><small>Imports name, category, address, hours, rating</small></div><span className="st claimed">Connected</span></div>
              <div className="mc"><div><b>Yelp Fusion</b><br /><small>Supplemental ratings and photos</small></div><button className="miniedit">Connect</button></div>
              <div className="mc"><div><b>Manual</b><br /><small>Listings you add by hand</small></div><span className="st claimed">On</span></div>
              <p className="sub" style={{ marginTop: 14, marginBottom: 0, lineHeight: 1.5 }}>
                Imported businesses start as <b>unclaimed</b>. Owners take them over by claiming. You retain edit access to every entry.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
