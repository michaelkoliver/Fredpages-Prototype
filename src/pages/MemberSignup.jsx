import { useState } from 'react';

export default function MemberSignup({ onBack, onSubmit }) {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', photo: '' });
  const [err, setErr] = useState('');

  const submit = () => {
    if (!form.firstName || !form.email || !form.password) {
      setErr('First name, email, and password are required.');
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
    <div className="center" style={{ maxWidth: 520 }}>
      <button className="back" onClick={onBack}>← Back</button>
      <h1>Create your profile</h1>
      <p className="lede">A free local member account.</p>
      <div className="paycard" style={{ textAlign: 'left' }}>
        {err && <div className="payerr">{err}</div>}
        <div className="two">
          <div className="fld">
            <label>First name *</label>
            <input value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} />
          </div>
          <div className="fld">
            <label>Last name</label>
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
        <div className="fld">
          <label>Profile photo (optional)</label>
          <input type="file" accept="image/*" onChange={onPhoto} />
          {form.photo && <img src={form.photo} alt="" style={{ width: 64, height: 64, borderRadius: 32, objectFit: 'cover', marginTop: 8 }} />}
        </div>
        <button className="btn btn-primary" style={{ width: '100%', padding: 13 }} onClick={submit}>Create profile</button>
      </div>
    </div>
  );
}
