import { useState } from 'react';

export default function OwnerSignup({ onBack, onSubmit }) {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '' });
  const [err, setErr] = useState('');

  const submit = () => {
    if (!form.firstName || !form.lastName || !form.email || !form.password) {
      setErr('All fields are required.');
      return;
    }
    onSubmit({ firstName: form.firstName, lastName: form.lastName, email: form.email });
  };

  return (
    <div className="center" style={{ maxWidth: 520 }}>
      <button className="back" onClick={onBack}>← Back</button>
      <h1>Business owner account</h1>
      <p className="lede">Tell us who you are. You'll pick or add your business next.</p>
      <div className="paycard" style={{ textAlign: 'left' }}>
        {err && <div className="payerr">{err}</div>}
        <div className="two">
          <div className="fld">
            <label>First name *</label>
            <input value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} />
          </div>
          <div className="fld">
            <label>Last name *</label>
            <input value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} />
          </div>
        </div>
        <div className="fld">
          <label>Email *</label>
          <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
        </div>
        <div className="fld">
          <label>Password *</label>
          <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
        </div>
        <button className="btn btn-primary" style={{ width: '100%', padding: 13 }} onClick={submit}>Continue</button>
      </div>
    </div>
  );
}
