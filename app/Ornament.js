// A small lotus, drawn as a quiet divider.
export default function Ornament() {
  return (
    <svg className="ornament" viewBox="0 0 120 24" aria-hidden="true">
      <line x1="0" y1="14" x2="40" y2="14" />
      <line x1="80" y1="14" x2="120" y2="14" />
      <path d="M60 4c4 4 5 8 0 14c-5-6-4-10 0-14z" />
      <path d="M60 18c-3-5-8-7-13-6c2 4 7 6 13 6z" />
      <path d="M60 18c3-5 8-7 13-6c-2 4-7 6-13 6z" />
    </svg>
  );
}
