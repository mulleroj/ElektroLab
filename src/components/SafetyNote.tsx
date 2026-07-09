interface SafetyNoteProps {
  text: string;
}

export function SafetyNote({ text }: SafetyNoteProps) {
  return (
    <aside className="safety-note" role="note" aria-label="Bezpečnostní poznámka">
      <div className="safety-note__header">
        <span className="safety-note__icon" aria-hidden="true">
          🛡️
        </span>
        <strong>Bezpečnostní poznámka</strong>
      </div>
      <p>{text}</p>
    </aside>
  );
}
