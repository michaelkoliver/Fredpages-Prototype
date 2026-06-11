import { useState } from 'react';

export default function MemberSignup({ onBack, onSubmit }) {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', photo: '' });
  const [err, setErr] = useState('');

  const submit = () => {
    if (!form.firstName || !form.email || !form.password) {
      setErr('Required fields missing.');
      return;
    }
    onSubmit({
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      photo: form.photo,
    });
  };

  const onPhoto = e => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => setForm({ ...form, photo: reader.result });
    reader.readAsDataURL(f);
  };

  return (
    <div className="center" style={{ maxWidth: 480 }}>
      <button className="back" onClick={onBack}>←</button>
      <h1>Create profile</h1>
      <div className="paycard" style={{ textAlign: 'left' }}>
        {err && <div className="payerr">{err}</div>}
        <label className="photo-picker">
          {form.photo
            ? <img src={form.photo} alt="" />
            : (
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#8b938f" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="8" r="4"/>
                <path d="M4 21c0-4 4-7 8-7s8 3 8 7"/>
              </svg>
            )}
          <input type="file" accept="image/*" onChange={onPhoto} />
        </label>
        <div className="two">
          <div className="fld">
            <input placeholder="First name *" value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} />
          </div>
          <div className="fld">
            <input placeholder="Last name" value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} />
          </div>
        </div>
        <div className="fld">
          <input type="email" placeholder="Email *" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
        </div>
        <div className="fld">
          <input type="password" placeholder="Password *" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
        </div>
        <button className="btn btn-primary" style={{ width: '100%', padding: 13 }} onClick={submit}>Create</button>
      </div>
    </div>
  );
}
