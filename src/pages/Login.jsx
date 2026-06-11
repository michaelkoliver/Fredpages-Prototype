import { useState } from 'react';

export default function Login({ onBack, onMember, onOwner }) {
  const [form, setForm] = useState({ email: '', password: '', role: 'member' });
  const [err, setErr] = useState('');

  const submit = () => {
    if (!form.email || !form.password) {
      setErr('Email and password required.');
      return;
    }
    const name = form.email.split('@')[0] || 'You';
    if (form.role === 'member') {
      onMember({ firstName: name, lastName: '', email: form.email, photo: '' });
    } else {
      onOwner({ firstName: name, lastName: '', email: form.email });
    }
  };

  return (
    <div className="center" style={{ maxWidth: 480 }}>
      <button className="back" onClick={onBack}>←</button>
      <h1>Log in</h1>
      <div className="paycard" style={{ textAlign: 'left' }}>
        {err && <div className="payerr">{err}</div>}
        <div className="role-toggle">
          <button
            className={'role-toggle-btn' + (form.role === 'member' ? ' on' : '')}
            onClick={() => setForm({ ...form, role: 'member' })}
          >Member</button>
          <button
            className={'role-toggle-btn' + (form.role === 'owner' ? ' on' : '')}
            onClick={() => setForm({ ...form, role: 'owner' })}
          >Owner</button>
        </div>
        <div className="fld">
          <input type="email" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
        </div>
        <div className="fld">
          <input type="password" placeholder="Password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
        </div>
        <button className="btn btn-primary" style={{ width: '100%', padding: 13 }} onClick={submit}>Log in</button>
      </div>
    </div>
  );
}
