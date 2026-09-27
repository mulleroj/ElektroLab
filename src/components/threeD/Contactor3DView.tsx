import { Component, type ErrorInfo, type ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import { useMotionPolicy } from '../animation/useMotionPolicy';
import { Contactor3DControls } from './Contactor3DControls';
import { ContactorModel } from './ContactorModel';
import { contactorModel, contactorPartGroups, type ContactorPartId, CONTACTOR_CAMERA_POSITION, CONTACTOR_CAMERA_TARGET } from './contactorModelConfig';
import { getContactorCoilLabel, getContactorPartState } from './contactorState';
import { PartInfoPanel } from './PartInfoPanel';
import { ThreeDScene } from './ThreeDScene';
import { isWebGLAvailable } from './webgl';

interface Contactor3DViewProps {
  stepIndex: number;
  initialCoilActive: boolean;
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

class Contactor3DErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ElektroLab contactor 3D renderer unavailable.', error, info);
  }

  render() {
    return this.state.hasError ? <Contactor3DFallback onUse2D={this.props.onUse2D} /> : this.props.children;
  }
}

export function Contactor3DView({
  stepIndex,
  initialCoilActive,
  calmMode,
  onUse2D,
}: Contactor3DViewProps) {
  const [selectedPartId, setSelectedPartId] = useState<ContactorPartId>('coil');
  const [coilActive, setCoilActive] = useState(initialCoilActive);
  const [exploded, setExploded] = useState(false);
  const [cameraResetKey, setCameraResetKey] = useState(0);
  const previousCoilState = useRef(initialCoilActive);
  const motion = useMotionPolicy(calmMode);

  useEffect(() => {
    setCoilActive(initialCoilActive);
    previousCoilState.current = initialCoilActive;
  }, [initialCoilActive]);

  const selectedPart = useMemo(
    () => contactorModel.parts.find((part) => part.id === selectedPartId),
    [selectedPartId],
  );
  const coilState = exploded ? false : coilActive;
  const contactState = coilState ? 'sepnuté' : 'rozepnuté';
  const selectedState = selectedPartId
    ? getContactorPartState(selectedPartId, coilState)
    : '';

  if (!isWebGLAvailable()) return <Contactor3DFallback onUse2D={onUse2D} />;

  return (
    <Contactor3DErrorBoundary onUse2D={onUse2D}>
      <div className="contactor-3d">
        <div className="series-parallel-3d__intro contactor-3d__intro">
          <strong>3D pohled:</strong> Výukový řez stykačem. 2D schéma zůstává zdrojem pravdy;
          3D pouze zpřístupňuje mechanismus, kontakty a svorky. Model není určen k připojení
          ke skutečnému napětí.
        </div>
        <div className="series-parallel-3d__layout contactor-3d__layout">
          <ThreeDScene
            definition={contactorModel}
            exploded={exploded}
            selectedPartId={selectedPartId}
            cameraResetKey={cameraResetKey}
            onSelectPart={(partId) => setSelectedPartId(partId as ContactorPartId)}
            cameraPosition={CONTACTOR_CAMERA_POSITION}
            cameraTarget={CONTACTOR_CAMERA_TARGET}
            cameraMinDistance={4.5}
            cameraMaxDistance={15}
            reduceMotion={!motion.allowContinuousMotion}
          >
            <ContactorModel
              definition={contactorModel}
              coilActive={coilState}
              exploded={exploded}
              selectedPartId={selectedPartId}
              reduceMotion={!motion.allowContinuousMotion}
              onSelectPart={(partId) => setSelectedPartId(partId as ContactorPartId)}
            />
          </ThreeDScene>
          <Contactor3DControls
            groups={contactorPartGroups}
            selectedPartId={selectedPartId}
            exploded={exploded}
            coilActive={coilState}
            onSelectPart={(partId) => setSelectedPartId(partId as ContactorPartId)}
            onToggleExploded={() => {
              setExploded((previous) => {
                if (!previous) {
                  previousCoilState.current = coilActive;
                  setCoilActive(false);
                } else {
                  setCoilActive(previousCoilState.current);
                }
                return !previous;
              });
            }}
            onToggleCoil={setCoilActive}
            onResetCamera={() => setCameraResetKey((previous) => previous + 1)}
          />
          <PartInfoPanel part={selectedPart} stateDescription={selectedState} />
        </div>
        <div className="contactor-3d__status" aria-live="polite">
          <strong>Stav mechanismu</strong>
          <span>Cívka: {getContactorCoilLabel(coilState)}</span>
          <span>Kotva: {coilState ? 'přitažená' : 'v klidové poloze'}</span>
          <span>Hlavní kontakty L1–T1, L2–T2, L3–T3: {contactState}</span>
          <span>NO: {coilState ? 'sepnutý' : 'rozepnutý'} · NC: {coilState ? 'rozepnutý' : 'sepnutý'}</span>
          <span className="contactor-3d__step-source">2D krok {stepIndex + 1} z 6 zůstává výukovým zdrojem pravdy.</span>
        </div>
        <p className="series-parallel-3d__fallback-note">
          3D je doplněk. Všechny důležité stavy a bezpečnostní informace zůstávají dostupné textem;
          při nedostupném WebGL lze kdykoli použít plnohodnotné 2D schéma.
        </p>
      </div>
    </Contactor3DErrorBoundary>
  );
}

function Contactor3DFallback({ onUse2D }: { onUse2D: () => void }) {
  return (
    <div className="three-d-fallback" role="status">
      <strong>3D pohled stykače není dostupný.</strong>
      <p>Výukový průchod pokračuje beze změny v plnohodnotném 2D schématu.</p>
      <button type="button" className="btn btn--secondary" onClick={onUse2D}>
        Použít 2D schéma
      </button>
    </div>
  );
}
