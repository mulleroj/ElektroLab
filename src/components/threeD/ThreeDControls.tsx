import type { ThreeDPartDefinition } from './types';

interface ThreeDControlsProps {
  parts: ThreeDPartDefinition[];
  selectedPartId: string | null;
  exploded: boolean;
  onSelectPart: (partId: string) => void;
  onToggleExploded: () => void;
  onResetCamera: () => void;
}

export function ThreeDControls({
  parts,
  selectedPartId,
  exploded,
  onSelectPart,
  onToggleExploded,
  onResetCamera,
}: ThreeDControlsProps) {
  return (
    <div className="three-d-controls">
      <div className="three-d-controls__actions" role="group" aria-label="Ovládání 3D pohledu">
        <button type="button" className="btn btn--secondary" onClick={onResetCamera}>
          Resetovat pohled
        </button>
        <button type="button" className="btn btn--secondary" onClick={onToggleExploded}>
          {exploded ? 'Složit sestavu' : 'Rozložit sestavu'}
        </button>
      </div>

      <div className="three-d-controls__parts" role="group" aria-label="Výběr součásti">
        <p className="three-d-controls__label">Součásti k prozkoumání</p>
        {parts.map((part) => (
          <button
            key={part.id}
            type="button"
            className={`btn btn--secondary${selectedPartId === part.id ? ' btn--active' : ''}`}
            aria-pressed={selectedPartId === part.id}
            onClick={() => onSelectPart(part.id)}
          >
            {part.label}
          </button>
        ))}
      </div>
    </div>
  );
}
