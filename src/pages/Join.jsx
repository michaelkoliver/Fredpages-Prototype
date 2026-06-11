export default function Join({ onMember, onOwner, onBack }) {
  return (
    <div className="center">
      <button className="back" onClick={onBack}>←</button>
      <h1>Join</h1>
      <div className="join-choice">
        <button className="join-card" onClick={onMember}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="8" r="4"/>
            <path d="M4 21c0-4 4-7 8-7s8 3 8 7"/>
          </svg>
          <span>Local Member</span>
        </button>
        <button className="join-card" onClick={onOwner}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 10l2-6h14l2 6"/>
            <path d="M4 10v10h16V10"/>
            <path d="M3 10a3 3 0 006 0 3 3 0 006 0 3 3 0 006 0"/>
          </svg>
          <span>Business Owner</span>
        </button>
      </div>
    </div>
  );
}
