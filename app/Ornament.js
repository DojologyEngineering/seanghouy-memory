// A small lotus, drawn as a quiet divider or seal emblem.
export function Lotus({ className = "lotus" }) {
  return (
    <svg className={className} viewBox="0 0 40 24" aria-hidden="true">
      <path d="M20 2c4 4 5 9 0 16c-5-7-4-12 0-16z" />
      <path d="M20 18c-3-6-9-9-15-8c2 5 8 8 15 8z" />
      <path d="M20 18c3-6 9-9 15-8c-2 5-8 8-15 8z" />
      <path d="M8 21h24" />
    </svg>
  );
}

export default function Ornament() {
  return (
    <div className="ornament" aria-hidden="true">
      <span />
      <Lotus />
      <span />
    </div>
  );
}
