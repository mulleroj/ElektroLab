import type { InductionMotorPartGroup, InductionMotorPartId } from './inductionMotorModelConfig';
import type {
  InductionMotorIsolation,
  InductionMotorRunState,
  InductionMotorViewMode,
} from './inductionMotorState';

interface InductionMotor3DControlsProps {
  groups: InductionMotorPartGroup[];
  selectedPartId: InductionMotorPartId | null;
  viewMode: InductionMotorViewMode;
  isolation: InductionMotorIsolation;
  showAirGap: boolean;
  showField: boolean;
  runState: InductionMotorRunState;
  exploded: boolean;
  allowContinuousMotion: boolean;
  onSelectPart: (partId: InductionMotorPartId) => void;
  onViewModeChange: (viewMode: InductionMotorViewMode) => void;
  onIsolationChange: (isolation: InductionMotorIsolation) => void;
  onToggleAirGap: () => void;
  onToggleField: () => void;
  onRunStateChange: (runState: InductionMotorRunState) => void;
  onManualRotate: () => void;
  onToggleExploded: () => void;
  onResetCamera: () => void;
}
export function InductionMotor3DControls({
  groups,
  selectedPartId,
  viewMode,
  isolation,
  showAirGap,
  showField,
  runState,
  exploded,
  allowContinuousMotion,
  onSelectPart,
  onViewModeChange,
  onIsolationChange,
  onToggleAirGap,
  onToggleField,
  onRunStateChange,
  onManualRotate,
  onToggleExploded,
  onResetCamera,
}: InductionMotor3DControlsProps) {
  return (
    <div className="three-d-controls induction-motor-3d-controls" aria-label="Ovládání 3D motoru">
      <div className="three-d-controls__actions" role="group" aria-label="Základní pohled motoru">
        <button type="button" className="btn btn--secondary" onClick={onResetCamera}>
          Reset kamery
        </button>
        <button type="button" className="btn btn--secondary" onClick={onToggleExploded} aria-pressed={exploded}>
          {exploded ? 'Složit motor' : 'Rozložit motor'}
        </button>
      </div>

      <div className="induction-motor-3d-controls__section" role="group" aria-label="Celý motor nebo výukový řez">
        <p className="three-d-controls__label">Konstrukční pohled</p>
        <div className="induction-motor-3d-controls__row">
          <button
            type="button"
            className={`btn btn--secondary${viewMode === 'complete' ? ' btn--active' : ''}`}
            aria-pressed={viewMode === 'complete'}
            onClick={() => onViewModeChange('complete')}
          >
            Celý motor
          </button>
          <button
            type="button"
            className={`btn btn--secondary${viewMode === 'cutaway' ? ' btn--active' : ''}`}
            aria-pressed={viewMode === 'cutaway'}
            onClick={() => onViewModeChange('cutaway')}
          >
            Výukový řez
          </button>
        </div>
      </div>

      <div className="induction-motor-3d-controls__section" role="group" aria-label="Izolace konstrukční skupiny">
        <p className="three-d-controls__label">Zobrazit skupinu</p>
        <div className="induction-motor-3d-controls__row">
          {(
            [
              ['all', 'Celý motor'],
              ['stator', 'Stator'],
              ['rotor', 'Rotor'],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              className={`btn btn--secondary${isolation === value ? ' btn--active' : ''}`}
              aria-pressed={isolation === value}
              onClick={() => onIsolationChange(value)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="induction-motor-3d-controls__section" role="group" aria-label="Výukové vrstvy motoru">
        <p className="three-d-controls__label">Výukové vrstvy</p>
        <div className="induction-motor-3d-controls__row">
          <button type="button" className="btn btn--secondary" onClick={onToggleAirGap} aria-pressed={showAirGap}>
            {showAirGap ? 'Skrýt vzduchovou mezeru' : 'Ukázat vzduchovou mezeru'}
          </button>
          <button type="button" className="btn btn--secondary" onClick={onToggleField} aria-pressed={showField} disabled={exploded}>
            {showField ? 'Skrýt rotující pole' : 'Ukázat rotující pole'}
          </button>
        </div>
        <p className="induction-motor-3d-controls__hint">
          Obě vrstvy jsou názorné pomůcky, nikoli další fyzické součásti ani simulace hodnot magnetické indukce.
        </p>
      </div>

      <div className="induction-motor-3d-controls__section" role="group" aria-label="Názorný provoz motoru">
        <p className="three-d-controls__label">Funkční stav</p>
        <div className="induction-motor-3d-controls__row">
          <button type="button" className="btn btn--secondary" onClick={() => onRunStateChange('stopped')} aria-pressed={runState === 'stopped'} disabled={exploded}>
            Motor v klidu
          </button>
          <button type="button" className="btn btn--secondary" onClick={() => onRunStateChange('running')} aria-pressed={runState === 'running'} disabled={exploded || !allowContinuousMotion}>
            Názorný chod
          </button>
          <button type="button" className="btn btn--secondary" onClick={onManualRotate} disabled={exploded}>
            Pootočit rotor
          </button>
        </div>
        <p className="induction-motor-3d-controls__hint" role="status">
          {exploded
            ? 'Při rozloženém motoru je funkční pohyb zastaven.'
            : !allowContinuousMotion
              ? 'Klidný režim nebo reduced motion: použij statický stav nebo pootočení tlačítkem.'
              : 'Názorný chod používá dvě různé rychlosti: pole je rychlejší než rotor.'}
        </p>
      </div>

      <div className="induction-motor-3d-controls__parts">
        <p className="three-d-controls__label">Seznam částí</p>
        {groups.map((group) => (
          <details key={group.id} className="contactor-3d-controls__group" open>
            <summary>{group.label}</summary>
            <div className="contactor-3d-controls__group-parts">
              {group.parts.map((part) => (
                <button
                  key={part.id}
                  type="button"
                  className={`btn btn--secondary${part.id === selectedPartId ? ' btn--active' : ''}`}
                  onClick={() => onSelectPart(part.id as InductionMotorPartId)}
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
