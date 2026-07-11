import type { AnimatedDemoStatus } from './useAnimatedDemo';

interface AnimatedDemoControlsProps {
  status: AnimatedDemoStatus;
  stepIndex: number;
  stepCount: number;
  /** Krátký název aktuálního pedagogického kroku, např. „Pohyb kotvy“. */
  stepTitle: string;
  /**
   * Když je false (Klidný režim / prefers-reduced-motion), Spustit a Pauza
   * se vůbec nenabízejí — demo se prochází jen tlačítkem Další krok.
   */
  autoPlayAllowed: boolean;
  onPlay: () => void;
  onPause: () => void;
  onNextStep: () => void;
  onReset: () => void;
}

const statusLabels: Record<AnimatedDemoStatus, string> = {
  idle: 'připraveno, animace čeká na tebe',
  playing: 'animace běží',
  paused: 'pozastaveno',
  completed: 'dokončeno',
};

/**
 * Jednotné ovládání animovaných dem (Spustit / Pauza / Další krok /
 * Resetovat). Nezapisuje žádný progress ani localStorage — jen volá
 * callbacky z useAnimatedDemo. Stav oznamuje i textem (aria-live).
 */
export function AnimatedDemoControls({
  status,
  stepIndex,
  stepCount,
  stepTitle,
  autoPlayAllowed,
  onPlay,
  onPause,
  onNextStep,
  onReset,
}: AnimatedDemoControlsProps) {
  const completed = status === 'completed';
  const atInitialState = status === 'idle' && stepIndex === 0;

  return (
    <div className="animated-demo-controls">
      <div
        className="animated-demo-controls__buttons"
        role="group"
        aria-label="Ovládání animace"
      >
        {autoPlayAllowed && (
          <>
            <button
              type="button"
              className="btn btn--primary"
              onClick={onPlay}
              disabled={status === 'playing' || completed}
            >
              <span aria-hidden="true">▶ </span>Spustit
            </button>
            <button
              type="button"
              className="btn btn--secondary"
              onClick={onPause}
              disabled={status !== 'playing'}
            >
              <span aria-hidden="true">⏸ </span>Pauza
            </button>
          </>
        )}
        <button
          type="button"
          className="btn btn--secondary"
          onClick={onNextStep}
          disabled={completed}
        >
          Další krok
        </button>
        <button
          type="button"
          className="btn btn--secondary"
          onClick={onReset}
          disabled={atInitialState}
        >
          Resetovat
        </button>
      </div>
      <p className="animated-demo-controls__status" role="status">
        Krok {stepIndex + 1} z {stepCount}: {stepTitle} — {statusLabels[status]}.
      </p>
    </div>
  );
}
