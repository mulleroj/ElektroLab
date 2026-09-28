import { Component, type ErrorInfo, type ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useMotionPolicy } from '../animation/useMotionPolicy';
import { InductionMotor3DControls } from './InductionMotor3DControls';
import { InductionMotorModel } from './InductionMotorModel';
import {
  INDUCTION_MOTOR_CAMERA_POSITION,
  INDUCTION_MOTOR_CAMERA_TARGET,
  inductionMotorModel,
  inductionMotorPartGroups,
  type InductionMotorPartId,
} from './inductionMotorModelConfig';
import {
  getInductionMotorPartState,
  type InductionMotorIsolation,
  type InductionMotorRunState,
  type InductionMotorViewMode,
} from './inductionMotorState';
import { PartInfoPanel } from './PartInfoPanel';
import { ThreeDScene } from './ThreeDScene';
import { isWebGLAvailable } from './webgl';

interface InductionMotor3DViewProps {
  stepIndex: number;
  calmMode: boolean;
  onUse2D: () => void;
}
interface ErrorBoundaryProps {
  onUse2D: () => void;
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class InductionMotor3DErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ElektroLab induction motor 3D renderer unavailable.', error, info);
  }

  render() {
    return this.state.hasError ? (
      <InductionMotor3DFallback onUse2D={this.props.onUse2D} />
    ) : (
      this.props.children
    );
  }
}

export function InductionMotor3DView({ stepIndex, calmMode, onUse2D }: InductionMotor3DViewProps) {
  const [selectedPartId, setSelectedPartId] = useState<InductionMotorPartId>('stator_core');
  const [viewMode, setViewMode] = useState<InductionMotorViewMode>('complete');
  const [isolation, setIsolation] = useState<InductionMotorIsolation>('all');
  const [showAirGap, setShowAirGap] = useState(false);
  const [showField, setShowField] = useState(false);
  const [runState, setRunState] = useState<InductionMotorRunState>('stopped');
  const [exploded, setExploded] = useState(false);
  const [manualRotation, setManualRotation] = useState(0);
  const [cameraResetKey, setCameraResetKey] = useState(0);
  const previousFunctionalState = useRef({ runState: 'stopped' as InductionMotorRunState, showField: false });
  const motion = useMotionPolicy(calmMode);
  useEffect(() => {
    if (!motion.allowContinuousMotion) setRunState('stopped');
  }, [motion.allowContinuousMotion]);
  const highlightedPartIds = useMemo(() => getHighlightedPartIds(stepIndex), [stepIndex]);
  const selectedPart = inductionMotorModel.parts.find((part) => part.id === selectedPartId);
  const effectiveAirGap = showAirGap && isolation !== 'stator';
  const effectiveField = showField && !exploded && isolation !== 'rotor';

  const toggleExploded = useCallback(() => {
    setExploded((previous) => {
      if (!previous) {
        previousFunctionalState.current = { runState, showField };
        setRunState('stopped');
        setShowField(false);
        return true;
      }
      setRunState(motion.allowContinuousMotion ? previousFunctionalState.current.runState : 'stopped');
      setShowField(previousFunctionalState.current.showField);
      return false;
    });
  }, [motion.allowContinuousMotion, runState, showField]);

  if (!isWebGLAvailable()) return <InductionMotor3DFallback onUse2D={onUse2D} />;

  return (
    <InductionMotor3DErrorBoundary onUse2D={onUse2D}>
      <div className="induction-motor-3d">
        <div className="series-parallel-3d__intro induction-motor-3d__intro">
          <strong>3D pohled:</strong> Výukový model ukazuje vztah stator → rotující magnetické pole → rotor.
          2D průchod zůstává zdrojem pravdy; 3D není FEM simulace ani návod k práci na motoru pod napětím.
        </div>
        <div className="series-parallel-3d__layout induction-motor-3d__layout">
          <ThreeDScene
            definition={inductionMotorModel}
            exploded={exploded}
            selectedPartId={selectedPartId}
            cameraResetKey={cameraResetKey}
            onSelectPart={(partId) => setSelectedPartId(partId as InductionMotorPartId)}
            cameraPosition={INDUCTION_MOTOR_CAMERA_POSITION}
            cameraTarget={INDUCTION_MOTOR_CAMERA_TARGET}
            cameraMinDistance={5}
            cameraMaxDistance={18}
            reduceMotion={!motion.allowContinuousMotion}
          >
            <InductionMotorModel
              definition={inductionMotorModel}
              viewMode={viewMode}
              isolation={isolation}
              showAirGap={showAirGap}
              showField={showField}
              runState={runState}
              exploded={exploded}
              selectedPartId={selectedPartId}
              highlightedPartIds={highlightedPartIds}
              manualRotation={manualRotation}
              reduceMotion={!motion.allowContinuousMotion}
              onSelectPart={setSelectedPartId}
            />
          </ThreeDScene>
          <InductionMotor3DControls
            groups={inductionMotorPartGroups}
            selectedPartId={selectedPartId}
            viewMode={viewMode}
            isolation={isolation}
            showAirGap={showAirGap}
            showField={showField}
            runState={runState}
            exploded={exploded}
            allowContinuousMotion={motion.allowContinuousMotion}
            onSelectPart={setSelectedPartId}
            onViewModeChange={setViewMode}
            onIsolationChange={setIsolation}
            onToggleAirGap={() => setShowAirGap((previous) => !previous)}
            onToggleField={() => setShowField((previous) => !previous)}
            onRunStateChange={(next) => setRunState(motion.allowContinuousMotion ? next : 'stopped')}
            onManualRotate={() => setManualRotation((previous) => previous + Math.PI / 6)}
            onToggleExploded={toggleExploded}
            onResetCamera={() => setCameraResetKey((previous) => previous + 1)}
          />
          <PartInfoPanel
            part={selectedPart}
            stateDescription={
              selectedPart
                ? getInductionMotorPartState(selectedPart.id as InductionMotorPartId, stepIndex, viewMode, isolation)
                : ''
            }
          />
        </div>
        <div className="induction-motor-3d__status" aria-live="polite">
          <strong>Stav výukového modelu</strong>
          <span>2D krok {stepIndex + 1} z 6 je zdrojem pravdy pro výklad.</span>
          <span>Motor: {runState === 'running' && !exploded ? 'názorný chod' : 'v klidu'}</span>
          <span>Točivé pole: {effectiveField ? 'zobrazeno jako názorný helper' : 'skryto'}</span>
          <span>Vzduchová mezera: {effectiveAirGap ? 'zvýrazněna názornou vrstvou' : 'skryta'}</span>
          {exploded && <span>Exploded stav: funkční pohyb je zastaven.</span>}
        </div>
        <p className="series-parallel-3d__fallback-note">
          Výukový řez konstrukcí motoru. Nejde o návod k demontáži nebo práci na zařízení pod napětím.
          Při nedostupném WebGL lze kdykoli pokračovat plnohodnotným 2D schématem.
        </p>
      </div>
    </InductionMotor3DErrorBoundary>
  );
}
function getHighlightedPartIds(stepIndex: number): Set<InductionMotorPartId> {
  const highlighted = new Set<InductionMotorPartId>();
  if (stepIndex >= 1) {
    highlighted.add('stator_core');
    highlighted.add('winding_u');
    highlighted.add('winding_v');
    highlighted.add('winding_w');
  }
  if (stepIndex >= 2) highlighted.add('rotating_field');
  if (stepIndex >= 3) {
    highlighted.add('cage_bars');
    highlighted.add('end_ring_front');
    highlighted.add('end_ring_rear');
  }
  if (stepIndex >= 4) {
    highlighted.add('rotor_core');
    highlighted.add('shaft');
  }
  return highlighted;
}

function InductionMotor3DFallback({ onUse2D }: { onUse2D: () => void }) {
  return (
    <div className="three-d-fallback" role="status">
      <strong>3D pohled asynchronního motoru není dostupný.</strong>
      <p>Výukový průchod pokračuje beze změny v plnohodnotném 2D schématu.</p>
      <button type="button" className="btn btn--secondary" onClick={onUse2D}>
        Použít 2D schéma
      </button>
    </div>
  );
}
