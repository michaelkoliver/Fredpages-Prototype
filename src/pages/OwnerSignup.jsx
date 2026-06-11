import { useState } from 'react';

export default function OwnerSignup({ onBack, onSubmit }) {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '' });
  const [err, setErr] = useState('');

  const submit = () => {
    if (!form.firstName || !form.lastName || !form.email || !form.password) {
      setErr('Required fields missing.');
      return;
    }
    onSubmit({ firstName: form.firstName, lastName: form.lastName, email: form.email });
  };

  return (
    <div className="center" style={{ maxWidth: 480 }}>
      <button className="back" onClick={onBack}>←</button>
      <h1>Owner account</h1>
      <div className="paycard" style={{ textAlign: 'left' }}>
        {err && <div className="payerr">{err}</div>}
        <div className="two">
          <div className="fld">
            <input placeholder="First name *" value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} />
          </div>
          <div className="fld">
            <input placeholder="Last name *" value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} />
          </div>
        </div>
        <div className="fld">
          <input type="email" placeholder="Email *" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
        </div>
        <div className="fld">
          <input type="password" placeholder="Password *" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
        </div>
        <button className="btn btn-primary" style={{ width: '100%', padding: 13 }} onClick={submit}>Continue</button>
      </div>
    </div>
  );
}
