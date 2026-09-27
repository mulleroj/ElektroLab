import { Component, type ErrorInfo, type ReactNode, useMemo, useState } from 'react';
import { useMotionPolicy } from '../animation/useMotionPolicy';
import type { SeriesParallelScenarioId } from '../demos/SeriesParallelDemo';
import { PartInfoPanel } from './PartInfoPanel';
import { ThreeDControls } from './ThreeDControls';
import { ThreeDScene } from './ThreeDScene';
import { getSeriesParallel3DModel } from './seriesParallelModelConfig';
import { derive3DState } from './seriesParallelState';
import type { SeriesParallel3DState } from './SeriesParallelModel';
import { isWebGLAvailable } from './webgl';

interface SeriesParallel3DViewProps {
  scenarioId: SeriesParallelScenarioId;
  stepIndex: number;
  calmMode: boolean;
  onUse2D: () => void;
}

interface WebglErrorBoundaryProps {
  onUse2D: () => void;
  children: ReactNode;
}

interface WebglErrorBoundaryState {
  hasError: boolean;
}

class WebglErrorBoundary extends Component<
  WebglErrorBoundaryProps,
  WebglErrorBoundaryState
> {
  state: WebglErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): WebglErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Keep the fallback visible to the learner; details remain in the console
    // for development without making 3D a hard lesson dependency.
    console.error('ElektroLab 3D renderer unavailable.', error, info);
  }

  render() {
    if (this.state.hasError) {
      return <ThreeDFallback onUse2D={this.props.onUse2D} />;
    }
    return this.props.children;
  }
}

export function SeriesParallel3DView({
  scenarioId,
  stepIndex,
  calmMode,
  onUse2D,
}: SeriesParallel3DViewProps) {
  const [selectedPartId, setSelectedPartId] = useState<string | null>('source');
  const [exploded, setExploded] = useState(false);
  const [cameraResetKey, setCameraResetKey] = useState(0);
  const model = useMemo(() => getSeriesParallel3DModel(scenarioId), [scenarioId]);
  const state = derive3DState(scenarioId, stepIndex);
  const motion = useMotionPolicy(calmMode);
  const selectedPart = model.parts.find((part) => part.id === selectedPartId);
  const stateDescription = describeSelectedPart(selectedPartId, state, scenarioId);

  if (!isWebGLAvailable()) {
    return <ThreeDFallback onUse2D={onUse2D} />;
  }

  return (
    <WebglErrorBoundary onUse2D={onUse2D}>
      <div className="series-parallel-3d">
        <div className="series-parallel-3d__intro">
          <strong>3D pohled:</strong> {model.description} Vyber součást a přečti si její
          funkci; stav obvodu se řídí stejnými kroky jako 2D schéma.
        </div>
        <div className="series-parallel-3d__layout">
          <ThreeDScene
            definition={model}
            state={state}
            exploded={exploded}
            selectedPartId={selectedPartId}
            cameraResetKey={cameraResetKey}
            onSelectPart={setSelectedPartId}
            reduceMotion={!motion.allowContinuousMotion}
          />
          <ThreeDControls
            parts={model.parts}
            selectedPartId={selectedPartId}
            exploded={exploded}
            onSelectPart={setSelectedPartId}
            onToggleExploded={() => setExploded((previous) => !previous)}
            onResetCamera={() => setCameraResetKey((previous) => previous + 1)}
          />
          <PartInfoPanel part={selectedPart} stateDescription={stateDescription} />
        </div>
        <p className="series-parallel-3d__fallback-note">
          3D je doplněk. Pro úplný textový popis a klasické schéma můžeš kdykoli přepnout
          zpět na 2D.
        </p>
      </div>
    </WebglErrorBoundary>
  );
}

function ThreeDFallback({ onUse2D }: { onUse2D: () => void }) {
  return (
    <div className="three-d-fallback" role="status">
      <strong>3D pohled není na tomto zařízení dostupný.</strong>
      <p>Výukový průchod pokračuje beze změny v plnohodnotném 2D schématu.</p>
      <button type="button" className="btn btn--secondary" onClick={onUse2D}>
        Použít 2D schéma
      </button>
    </div>
  );
}

function describeSelectedPart(
  partId: string | null,
  state: SeriesParallel3DState,
  scenarioId: SeriesParallelScenarioId,
): string {
  if (!partId) return '';
  if (state.faultyPartIds.has(partId)) {
    return 'Stav: vlákno je přerušené; tato část je ve fault scénáři bez proudu.';
  }
  if (state.litPartIds.has(partId)) return 'Stav: žárovka svítí v právě zobrazeném kroku.';
  if (state.activePartIds.has(partId)) {
    return 'Stav: tato část patří k právě aktivní proudové cestě.';
  }
  if (state.highlightedPartIds.has(partId)) {
    return 'Stav: uzel je v tomto kroku zvýrazněný pro vysvětlení větvení.';
  }
  if (partId.startsWith('node-') && scenarioId === 'parallel') {
    return 'Stav: uzel je součástí paralelního zapojení, i když není v tomto kroku zvýrazněný.';
  }
  return 'Stav: tato část je v obvodu přítomná, ale v tomto kroku není zvýrazněná.';
}
