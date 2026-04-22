export default function Brand({ onClick }) {
  return (
    <button className="brand" onClick={onClick}>
      <img src="/ejg-mark-primary.svg" alt="" />
      <span className="name">
        EH! JADI GA<span className="q-stamp">?</span>
      </span>
    </button>
  );
}
