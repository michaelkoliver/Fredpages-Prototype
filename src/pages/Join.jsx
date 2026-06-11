export default function Join({ onMember, onOwner, onBack }) {
  return (
    <div className="center">
      <button className="back" onClick={onBack}>← Back</button>
      <h1>Join Fredpages</h1>
      <p className="lede">Pick the kind of account you want.</p>
      <div className="join-choice">
        <button className="join-card" onClick={onMember}>
          <div className="join-card-tag">Local Member</div>
          <h3>I live in Fredericksburg</h3>
          <p>Save places, leave reviews, and follow deals from local businesses.</p>
          <span className="join-card-cta">Create a member profile →</span>
        </button>
        <button className="join-card" onClick={onOwner}>
          <div className="join-card-tag">Business Owner</div>
          <h3>I run a local business</h3>
          <p>Claim or add your listing, post offers and events, respond to reviews.</p>
          <span className="join-card-cta">Set up a business account →</span>
        </button>
      </div>
    </div>
  );
}
