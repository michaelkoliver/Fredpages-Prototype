import Check from '../components/Check';

const FEATURES = [
  'Edit your full profile — description, hours, photos, contact',
  'Post unlimited offers and coupons',
  'Add events to your profile and the city calendar',
  'Verified owner badge',
  'Higher placement in your category',
  'Monthly views, calls, and saves',
];

export default function Claim({ onContinue }) {
  return (
    <div className="center">
      <h1>Claim your business</h1>
      <p className="lede">
        Manage how your business appears to people searching Fredericksburg, and post offers and events directly to your profile.
      </p>
      <div className="plan">
        <div className="top">
          <div className="price">$50<span> / month</span></div>
          <div className="pnote">Cancel anytime · no setup fee</div>
        </div>
        <ul>
          {FEATURES.map(f => (
            <li key={f}><Check />{f}</li>
          ))}
        </ul>
        <div className="pfoot">
          <button className="btn btn-primary" onClick={onContinue}>Continue — $50/mo</button>
        </div>
      </div>
    </div>
  );
}
