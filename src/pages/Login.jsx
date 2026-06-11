import { useState } from 'react';

export default function Login({ onBack, onSignUp, onSubmit }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [err, setErr] = useState('');

  const submit = () => {
    if (!form.email || !form.password) {
      setErr('Email and password required.');
      return;
    }
    const name = form.email.split('@')[0] || 'You';
    onSubmit({ firstName: name, lastName: '', email: form.email, photo: '' });
  };

  return (
    <div className="center" style={{ maxWidth: 480 }}>
      <button className="back" onClick={onBack}>←</button>
      <h1>Log in</h1>
      <div className="paycard" style={{ textAlign: 'left' }}>
        {err && <div className="payerr">{err}</div>}
        <div className="fld">
          <input type="email" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
        </div>
        <div className="fld">
          <input type="password" placeholder="Password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
        </div>
        <button className="btn btn-primary" style={{ width: '100%', padding: 13 }} onClick={submit}>Log in</button>
      </div>
      <button className="join-login" onClick={onSignUp}>New here? Create an account →</button>
    </div>
  );
}
