interface CalmModeToggleProps {
  enabled: boolean;
  onToggle: () => void;
}

export function CalmModeToggle({ enabled, onToggle }: CalmModeToggleProps) {
  return (
    <button
      type="button"
      className={`calm-toggle${enabled ? ' calm-toggle--active' : ''}`}
      onClick={onToggle}
      aria-pressed={enabled}
      aria-label={enabled ? 'Vypnout klidný režim' : 'Zapnout klidný režim'}
    >
      {enabled ? '🌙 Klidný režim' : '☀️ Klidný režim'}
    </button>
  );
}
