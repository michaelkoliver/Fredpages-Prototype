const METHODS = [
  ['phone', 'Text a code', 'To the phone on your listing'],
  ['email', 'Email a code', 'To your business email address'],
];

export default function Verify({ vrf, setVrf, vBiz, onBack, onVerified, genCode }) {
  const mask = p => p ? p.replace(/\d(?=\d{4})/g, '•') : 'the number on your listing';

  const toCheckout = () => {
    setVrf(null);
    onVerified();
  };

  return (
    <div className="center" style={{ maxWidth: 520 }}>
      <button className="back" onClick={onBack}>← Back</button>
      <h1>Verify ownership</h1>
      <p className="lede">Confirm you represent {vBiz ? vBiz.name : 'this business'} before managing its listing.</p>
      <div className="paycard" style={{ textAlign: 'left' }}>
        {!vrf.sent ? (
          <>
            {METHODS.map(([m, t, d]) => (
              <div
                key={m}
                className={'opt' + (vrf.method === m ? ' sel' : '')}
                onClick={() => setVrf({ ...vrf, method: m })}
              >
                <div className="rdo" />
                <div><b>{t}</b><small>{d}</small></div>
              </div>
            ))}
            <button
              className="btn btn-primary"
              style={{ width: '100%', padding: 12, borderRadius: 9, marginTop: 6 }}
              onClick={() => setVrf({ ...vrf, sent: true, code: genCode(), entry: '', err: '' })}
            >
              Send code
            </button>
          </>
        ) : (
          <>
            <p style={{ fontSize: 13.5, color: 'var(--text-2)', margin: '0 0 12px' }}>
              Enter the 6-digit code sent to {vrf.method === 'phone' ? mask(vBiz && vBiz.phone) : 'your business email'}.
            </p>
            <input
              className="codeinput"
              placeholder="······"
              inputMode="numeric"
              value={vrf.entry}
              onChange={e => setVrf({ ...vrf, entry: e.target.value.replace(/\D/g, '').slice(0, 6), err: '' })}
            />
            <div className="vhint">Demo code: {vrf.code}</div>
            {vrf.err && <div className="payerr" style={{ marginTop: 10 }}>{vrf.err}</div>}
            <button
              className="btn btn-primary"
              style={{ width: '100%', padding: 12, borderRadius: 9, marginTop: 10 }}
              onClick={() => vrf.entry === vrf.code ? toCheckout() : setVrf({ ...vrf, err: "That code doesn't match. Try again." })}
            >
              Verify &amp; continue
            </button>
            <button className="changemethod" onClick={() => setVrf({ ...vrf, sent: false, err: '' })}>
              Change method
            </button>
          </>
        )}
      </div>
    </div>
  );
}
