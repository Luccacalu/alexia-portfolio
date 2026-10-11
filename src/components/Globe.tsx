export default function Globe({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 40 24" aria-hidden="true">
      <ellipse cx="20" cy="12" rx="18" ry="10" />
      <ellipse cx="20" cy="12" rx="8" ry="10" />
      <line x1="2" y1="12" x2="38" y2="12" />
      <path d="M5 6.5h30M5 17.5h30" />
    </svg>
  );
}
