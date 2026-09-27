import { Component, type ErrorInfo, type ReactNode, useMemo, useState } from 'react';
import { useMotionPolicy } from '../animation/useMotionPolicy';
import type { TurnsVariant } from '../demos/TransformerDemo';
import { PartInfoPanel } from './PartInfoPanel';
import { ThreeDControls } from './ThreeDControls';
import { ThreeDScene } from './ThreeDScene';
import { TransformerModel } from './TransformerModel';
import { isWebGLAvailable } from './webgl';
import {
  getTransformer3DModel,
  TRANSFORMER_CAMERA_POSITION,
  TRANSFORMER_CAMERA_TARGET,
} from './transformerModelConfig';

interface Transformer3DViewProps {
  stepIndex: number;
  variantId: TurnsVariant;
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

class Transformer3DErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ElektroLab transformer 3D renderer unavailable.', error, info);
  }

  render() {
    return this.state.hasError ? (
      <Transformer3DFallback onUse2D={this.props.onUse2D} />
    ) : (
      this.props.children
    );
  }
}

export function Transformer3DView({
  stepIndex,
  variantId,
  calmMode,
  onUse2D,
}: Transformer3DViewProps) {
  const [selectedPartId, setSelectedPartId] = useState<string | null>('core');
  const [exploded, setExploded] = useState(false);
  const [cameraResetKey, setCameraResetKey] = useState(0);
  const model = useMemo(() => getTransformer3DModel(), []);
  const motion = useMotionPolicy(calmMode);
  const highlightedPartIds = useMemo(
    () => getHighlightedPartIds(stepIndex),
    [stepIndex],
  );
  const selectedPart = model.parts.find((part) => part.id === selectedPartId);

  if (!isWebGLAvailable()) {
    return <Transformer3DFallback onUse2D={onUse2D} />;
  }

  return (
    <Transformer3DErrorBoundary onUse2D={onUse2D}>
      <div className="transformer-3d">
        <div className="series-parallel-3d__intro">
          <strong>3D pohled:</strong> {model.description} Výklad zůstává stejný jako ve 2D
          schématu; 3D pouze zpřístupní jednotlivé části transformátoru.
        </div>
        <div className="series-parallel-3d__layout">
          <ThreeDScene
            definition={model}
            exploded={exploded}
            selectedPartId={selectedPartId}
            cameraResetKey={cameraResetKey}
            onSelectPart={setSelectedPartId}
            cameraPosition={TRANSFORMER_CAMERA_POSITION}
            cameraTarget={TRANSFORMER_CAMERA_TARGET}
            cameraMinDistance={4.5}
            cameraMaxDistance={15}
            reduceMotion={!motion.allowContinuousMotion}
          >
            <TransformerModel
              definition={model}
              exploded={exploded}
              selectedPartId={selectedPartId}
              highlightedPartIds={highlightedPartIds}
              onSelectPart={setSelectedPartId}
            />
          </ThreeDScene>
          <ThreeDControls
            parts={model.parts}
            selectedPartId={selectedPartId}
            exploded={exploded}
            onSelectPart={setSelectedPartId}
            onToggleExploded={() => setExploded((previous) => !previous)}
            onResetCamera={() => setCameraResetKey((previous) => previous + 1)}
          />
          <PartInfoPanel
            part={selectedPart}
            stateDescription={describeSelectedPart(selectedPartId, stepIndex, variantId)}
          />
        </div>
        <div className="transformer-3d__ratio" aria-label="Napojení 3D modelu na transformační poměr">
          <strong>Napojení na výklad:</strong>
          <span>N1 → primární vinutí · N2 → sekundární vinutí</span>
          <span>U1 → napětí na primáru · U2 → napětí na sekundáru</span>
          <span>V idealizovaném modelu platí U2 = U1 × N2 / N1.</span>
          <span>{variantDescription(variantId)}</span>
        </div>
        <p className="series-parallel-3d__fallback-note">
          3D je doplněk. Pro úplný textový popis a klasické schéma můžeš kdykoli přepnout
          zpět na 2D.
        </p>
      </div>
    </Transformer3DErrorBoundary>
  );
}

function Transformer3DFallback({ onUse2D }: { onUse2D: () => void }) {
  return (
    <div className="three-d-fallback" role="status">
      <strong>3D pohled transformátoru není dostupný.</strong>
      <p>Výukový průchod pokračuje beze změny v plnohodnotném 2D schématu.</p>
      <button type="button" className="btn btn--secondary" onClick={onUse2D}>
        Použít 2D schéma
      </button>
    </div>
  );
}

function getHighlightedPartIds(stepIndex: number): Set<string> {
  const highlighted = new Set<string>();
  if (stepIndex >= 1) highlighted.add('primary_winding');
  if (stepIndex >= 3) highlighted.add('core');
  if (stepIndex >= 4) highlighted.add('secondary_winding');
  return highlighted;
}

function describeSelectedPart(
  partId: string | null,
  stepIndex: number,
  variantId: TurnsVariant,
): string {
  if (!partId) return '';
  const stepState = stepIndex === 0
    ? 'Stav: výchozí klidový stav.'
    : stepIndex >= 4
      ? 'Stav: v tomto kroku se v sekundáru indukuje napětí.'
      : 'Stav: část je připravena pro právě vysvětlovaný krok.';
  if (partId === 'primary_winding') {
    return `${stepState} N1 označuje počet závitů primárního vinutí; U1 je napětí na primáru.`;
  }
  if (partId === 'secondary_winding') {
    return `${stepState} N2 označuje počet závitů sekundárního vinutí; U2 je napětí na sekundáru. ${variantDescription(variantId)}`;
  }
  if (partId === 'core') {
    return `${stepState} Jádro vede měnící se magnetický tok mezi vinutími.`;
  }
  return stepState;
}

function variantDescription(variantId: TurnsVariant): string {
  if (variantId === 'more') return 'Více závitů na sekundáru znamená v tomto modelu vyšší napětí.';
  if (variantId === 'same') return 'Stejný počet závitů znamená v tomto modelu přibližně stejné napětí.';
  return 'Méně závitů na sekundáru znamená v tomto modelu nižší napětí.';
}
