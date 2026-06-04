import { fmtCard, fmtExp } from '../data';

export default function Checkout({ pay, setPay, coBiz, onBack, onSubscribe }) {
  if (!pay) return null;

  return (
    <div className="checkout">
      <button className="back" onClick={onBack}>← Back</button>
      <h1>Checkout</h1>
      <div className="demobar">Demo checkout — no real card is charged.</div>
      <div className="cogrid">
        <div className="paycard">
          {pay.err && <div className="payerr">{pay.err}</div>}
          <div className="fld">
            <label>Email</label>
            <input value={pay.email} placeholder="you@business.com" onChange={e => setPay({ ...pay, email: e.target.value })} />
          </div>
          <div className="fld">
            <label>Card number</label>
            <input value={pay.card} placeholder="1234 1234 1234 1234" inputMode="numeric" onChange={e => setPay({ ...pay, card: fmtCard(e.target.value) })} />
          </div>
          <div className="two">
            <div className="fld">
              <label>Expiry</label>
              <input value={pay.exp} placeholder="MM/YY" inputMode="numeric" onChange={e => setPay({ ...pay, exp: fmtExp(e.target.value) })} />
            </div>
            <div className="fld">
              <label>CVC</label>
              <input value={pay.cvc} placeholder="123" inputMode="numeric" onChange={e => setPay({ ...pay, cvc: e.target.value.replace(/\D/g, '').slice(0, 4) })} />
            </div>
          </div>
          <div className="fld">
            <label>Name on card</label>
            <input value={pay.name} onChange={e => setPay({ ...pay, name: e.target.value })} />
          </div>
          <div className="fld">
            <label>Billing ZIP</label>
            <input value={pay.zip} placeholder="22401" inputMode="numeric" onChange={e => setPay({ ...pay, zip: e.target.value.replace(/\D/g, '').slice(0, 5) })} />
          </div>
          <button
            className="btn btn-primary"
            style={{ width: '100%', padding: 13, borderRadius: 9 }}
            onClick={onSubscribe}
          >
            Subscribe — $50/month
          </button>
          <div className="secure">🔒 Secure checkout</div>
        </div>
        <div className="summary">
          <h3>ORDER SUMMARY</h3>
          <div className="srow"><span>Owner plan{coBiz ? ` · ${coBiz.name}` : ''}</span><span>$50.00</span></div>
          <div className="srow"><span>Billing</span><span>Monthly</span></div>
          <div className="srow tot"><span>Due today</span><span>$50.00</span></div>
          <p style={{ marginTop: 14, marginBottom: 0, fontSize: 12, lineHeight: 1.5, color: 'var(--text-2)' }}>
            Renews monthly at $50.00. Cancel anytime from your dashboard.
          </p>
        </div>
      </div>
    </div>
  );
}
