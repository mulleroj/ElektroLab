import type { ContactorPartGroup } from './contactorModelConfig';

interface Contactor3DControlsProps {
  groups: ContactorPartGroup[];
  selectedPartId: string | null;
  exploded: boolean;
  coilActive: boolean;
  onSelectPart: (partId: string) => void;
  onToggleExploded: () => void;
  onToggleCoil: (active: boolean) => void;
  onResetCamera: () => void;
}

export function Contactor3DControls({
  groups,
  selectedPartId,
  exploded,
  coilActive,
  onSelectPart,
  onToggleExploded,
  onToggleCoil,
  onResetCamera,
}: Contactor3DControlsProps) {
  return (
    <div className="three-d-controls contactor-3d-controls" aria-label="Ovládání 3D stykače">
      <div className="three-d-controls__actions contactor-3d-controls__actions">
        <button type="button" className="btn btn--secondary" onClick={onResetCamera}>
          Reset kamery
        </button>
        <button type="button" className="btn btn--secondary" onClick={onToggleExploded} aria-pressed={exploded}>
          {exploded ? 'Složit model' : 'Exploded view'}
        </button>
      </div>
      <div className="contactor-3d-controls__coil" role="group" aria-label="Stav cívky">
        <p className="three-d-controls__label">Funkční stav cívky</p>
        <button
          type="button"
          className="btn btn--secondary"
          onClick={() => onToggleCoil(false)}
          aria-pressed={!coilActive}
          disabled={exploded}
        >
          Cívka bez napětí
        </button>
        <button
          type="button"
          className="btn btn--secondary"
          onClick={() => onToggleCoil(true)}
          aria-pressed={coilActive}
          disabled={exploded}
        >
          Cívka pod napětím
        </button>
      </div>
      {exploded && <p className="contactor-3d-controls__hint" role="status">Funkční stav obnovíš po složení modelu.</p>}
      <div className="contactor-3d-controls__parts">
        <p className="three-d-controls__label">Seznam součástí</p>
        {groups.map((group) => (
          <details key={group.id} className="contactor-3d-controls__group" open>
            <summary>{group.label}</summary>
            <div className="contactor-3d-controls__group-parts">
              {group.parts.map((part) => (
                <button
                  key={part.id}
                  type="button"
                  className={`btn btn--secondary${part.id === selectedPartId ? ' btn--active' : ''}`}
                  onClick={() => onSelectPart(part.id)}
                  aria-pressed={part.id === selectedPartId}
                >
                  {part.label}
                </button>
              ))}
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
