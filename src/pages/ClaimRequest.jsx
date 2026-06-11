import { useState } from 'react';

const ROLES = ['Owner', 'Co-owner', 'Manager', 'Authorized representative'];

export default function ClaimRequest({ listing, owner, onBack, onSubmit }) {
  const [role, setRole] = useState(ROLES[0]);
  if (!listing) return null;
  return (
    <div className="center" style={{ maxWidth: 480 }}>
      <button className="back" onClick={onBack}>←</button>
      <h1>Claim {listing.name}</h1>
      <div className="paycard" style={{ textAlign: 'left' }}>
        <div className="fld">
          <label>Submitting as</label>
          <input value={(owner.firstName + ' ' + owner.lastName).trim()} disabled />
        </div>
        <div className="fld">
          <label>Your role at this business</label>
          <select value={role} onChange={e => setRole(e.target.value)}>
            {ROLES.map(r => <option key={r}>{r}</option>)}
          </select>
        </div>
        <button className="btn btn-primary" style={{ width: '100%', padding: 13 }} onClick={() => onSubmit({ role })}>
          Submit claim
        </button>
        <p className="empty" style={{ marginTop: 12 }}>An admin will review your claim. You'll be able to pay and access the dashboard once it's approved.</p>
      </div>
    </div>
  );
}
