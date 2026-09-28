import { Component, type ErrorInfo, type ReactNode, useEffect, useMemo, useState } from 'react';
import { useMotionPolicy } from '../animation/useMotionPolicy';
import {
  getRotatingFieldPlaybackState,
  normalizeRotatingFieldPositionIndex,
  ROTATING_FIELD_PHASES,
  ROTATING_FIELD_STEPS,
  type RotatingFieldPhase,
} from '../demos/rotatingFieldState';
import { PartInfoPanel } from './PartInfoPanel';
import { RotatingFieldModel } from './RotatingFieldModel';
import {
  ROTATING_FIELD_CAMERA_POSITION,
  ROTATING_FIELD_CAMERA_TARGET,
  rotatingFieldModel,
  type RotatingFieldPartId,
} from './rotatingFieldModelConfig';
import { ThreeDScene } from './ThreeDScene';
import { isWebGLAvailable } from './webgl';

interface RotatingField3DViewProps {
  stepIndex: number;
  selectedPhase: RotatingFieldPhase;
  calmMode: boolean;
  onSelectPhase: (phase: RotatingFieldPhase) => void;
  onUse2D: () => void;
}

interface ErrorBoundaryProps {
  onUse2D: () => void;
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class RotatingField3DErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ElektroLab rotating field 3D renderer unavailable.', error, info);
  }

  render() {
    return this.state.hasError ? (
      <RotatingField3DFallback onUse2D={this.props.onUse2D} />
    ) : (
      this.props.children
    );
  }
}

export function RotatingField3DView({
  stepIndex,
  selectedPhase,
  calmMode,
  onSelectPhase,
  onUse2D,
}: RotatingField3DViewProps) {
  const motion = useMotionPolicy(calmMode);
  const [selectedPartId, setSelectedPartId] = useState<RotatingFieldPartId>('winding_u');
  const [fieldPositionIndex, setFieldPositionIndex] = useState(0);
  const [fieldRunning, setFieldRunning] = useState(false);
  const [cameraResetKey, setCameraResetKey] = useState(0);

  useEffect(() => {
    if (stepIndex !== 5) {
      setFieldPositionIndex(0);
      setFieldRunning(false);
      return;
    }
    setFieldRunning(motion.allowContinuousMotion);
  }, [motion.allowContinuousMotion, stepIndex]);

  const playback = getRotatingFieldPlaybackState(
    stepIndex,
    motion.allowContinuousMotion,
    fieldRunning,
    fieldPositionIndex,
  );
  const fieldAngle = (playback.fieldAngleDegrees * Math.PI) / 180;
  const fieldState = !playback.fieldVisible
    ? 'Výsledné magnetické pole zatím není zobrazeno.'
    : playback.continuousRotationActive
      ? 'Výsledné magnetické pole se pomalu otáčí v prostoru.'
      : `Výsledné magnetické pole je nyní natočeno přibližně o ${playback.fieldAngleDegrees}°.`;
  const selectedPart = useMemo(
    () => rotatingFieldModel.parts.find((part) => part.id === selectedPartId),
    [selectedPartId],
  );

  if (!isWebGLAvailable()) return <RotatingField3DFallback onUse2D={onUse2D} />;

  const moveFieldPosition = (delta: number) => {
    if (!playback.fieldSteppingAllowed) return;
    setFieldPositionIndex((index) => normalizeRotatingFieldPositionIndex(index + delta));
  };

  return (
    <RotatingField3DErrorBoundary onUse2D={onUse2D}>
      <div className="rotating-field-3d">
        <div className="series-parallel-3d__intro rotating-field-3d__intro">
          <strong>3D pohled statoru:</strong> Ukazuje prostorové rozmístění fází U, V a W a směr výsledného magnetického pole.
          Nejde o FEM simulaci, měření B ani přesné siločáry.
        </div>
        <div className="series-parallel-3d__layout rotating-field-3d__layout">
          <ThreeDScene
            definition={rotatingFieldModel}
            exploded={false}
            selectedPartId={selectedPartId}
            cameraResetKey={cameraResetKey}
            onSelectPart={(partId) => setSelectedPartId(partId as RotatingFieldPartId)}
            cameraPosition={ROTATING_FIELD_CAMERA_POSITION}
            cameraTarget={ROTATING_FIELD_CAMERA_TARGET}
            cameraMinDistance={5}
            cameraMaxDistance={18}
            reduceMotion={!motion.allowContinuousMotion}
          >
            <RotatingFieldModel
              definition={rotatingFieldModel}
              stepIndex={stepIndex}
              selectedPhase={selectedPhase}
              selectedPartId={selectedPartId}
              fieldAngle={fieldAngle}
              animateField={fieldRunning}
              reduceMotion={!motion.allowContinuousMotion}
              onSelectPart={setSelectedPartId}
            />
          </ThreeDScene>
          <div className="three-d-controls rotating-field-3d-controls" aria-label="Ovládání 3D točivého pole">
            <div className="three-d-controls__actions" role="group" aria-label="Základní pohled statoru">
              <button type="button" className="btn btn--secondary" onClick={() => setCameraResetKey((previous) => previous + 1)}>
                Reset kamery
              </button>
              <button type="button" className="btn btn--secondary" onClick={onUse2D}>
                Použít 2D schéma
              </button>
            </div>
            <div className="rotating-field-3d-controls__section" role="group" aria-label="Fáze statoru v 3D">
              <p className="three-d-controls__label">Fáze statoru</p>
              <div className="rotating-field-3d-controls__row">
                {ROTATING_FIELD_PHASES.map((phase) => (
                  <button
                    key={phase}
                    type="button"
                    className={`btn btn--secondary${selectedPhase === phase ? ' btn--active' : ''}`}
                    aria-pressed={selectedPhase === phase}
                    onClick={() => {
                      onSelectPhase(phase);
                      setSelectedPartId(`winding_${phase.toLowerCase()}` as RotatingFieldPartId);
                    }}
                  >
                    Fáze {phase}
                  </button>
                ))}
              </div>
            </div>
            <div className="rotating-field-3d-controls__section" role="group" aria-label="Poloha výsledného pole">
              <p className="three-d-controls__label">Výsledné pole</p>
              <div className="rotating-field-3d-controls__row">
                <button type="button" className="btn btn--secondary" onClick={() => moveFieldPosition(-1)} disabled={!playback.fieldSteppingAllowed}>
                  Předchozí poloha
                </button>
                <button type="button" className="btn btn--secondary" onClick={() => moveFieldPosition(1)} disabled={!playback.fieldSteppingAllowed}>
                  Další poloha
                </button>
                <button type="button" className="btn btn--secondary" onClick={() => setFieldRunning((running) => !running)} disabled={!playback.continuousRotationAllowed} aria-pressed={playback.continuousRotationActive}>
                  {playback.continuousRotationActive ? 'Zastavit rotaci' : 'Spustit rotaci'}
                </button>
              </div>
              <p className="rotating-field-3d-controls__hint" role="status">
                {!motion.allowContinuousMotion
                  ? 'Klidný režim nebo reduced motion: použij předchozí a další polohu.'
                  : 'Pole je názorný helper směru a prostorové rotace, nikoli fyzikální měření.'}
              </p>
            </div>
            <div className="rotating-field-3d-controls__section" role="group" aria-label="Výběr části statoru">
              <p className="three-d-controls__label">Seznam částí</p>
              <div className="rotating-field-3d-controls__row">
                {rotatingFieldModel.parts.map((part) => (
                  <button
                    key={part.id}
                    type="button"
                    className={`btn btn--secondary${part.id === selectedPartId ? ' btn--active' : ''}`}
                    aria-pressed={part.id === selectedPartId}
                    onClick={() => setSelectedPartId(part.id as RotatingFieldPartId)}
                  >
                    {part.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <PartInfoPanel
            part={selectedPart}
            stateDescription={
              selectedPart
                ? `Krok ${stepIndex + 1} z ${ROTATING_FIELD_STEPS.length} zůstává zdrojem pravdy. ${selectedPart.description}`
                : ''
            }
          />
        </div>
        <div className="rotating-field-3d__status" aria-live="polite">
          <strong>Stav výukového modelu</strong>
          <span>2D krok {stepIndex + 1} z {ROTATING_FIELD_STEPS.length} je zdrojem pravdy pro výklad.</span>
          <span>Vybraná fáze: Fáze {selectedPhase}.</span>
          <span>{fieldState}</span>
          <span>Názorné zobrazení výsledného magnetického pole.</span>
        </div>
        <p className="series-parallel-3d__fallback-note">
          Rotor a mechanické části jsou skryté, protože tato lekce vysvětluje vznik točivého pole ve statoru. Při nedostupném WebGL lze kdykoli pokračovat plnohodnotným 2D schématem.
        </p>
      </div>
    </RotatingField3DErrorBoundary>
  );
}

function RotatingField3DFallback({ onUse2D }: { onUse2D: () => void }) {
  return (
    <div className="three-d-fallback" role="status">
      <strong>3D pohled točivého pole není dostupný.</strong>
      <p>Výukový průchod pokračuje beze změny v plnohodnotném 2D schématu.</p>
      <button type="button" className="btn btn--secondary" onClick={onUse2D}>
        Použít 2D schéma
      </button>
    </div>
  );
}
