import { lazy, Suspense, useState } from 'react';
import type { RotatingFieldDemoConfig } from '../../types';
import { AnimatedDemoControls } from '../animation/AnimatedDemoControls';
import { useAnimatedDemo } from '../animation/useAnimatedDemo';
import { useMotionPolicy } from '../animation/useMotionPolicy';
import {
  getRotatingFieldPlaybackState,
  ROTATING_FIELD_PHASES,
  ROTATING_FIELD_STEPS,
  type RotatingFieldPhase,
} from './rotatingFieldState';

interface RotatingFieldDemoProps {
  demo: RotatingFieldDemoConfig;
  calmMode: boolean;
  onContinue: () => void;
}

const LazyRotatingField3DView = lazy(() =>
  import('../threeD/RotatingField3DView').then((module) => ({
    default: module.RotatingField3DView,
  })),
);

export function RotatingFieldDemoView({ demo, calmMode, onContinue }: RotatingFieldDemoProps) {
  const [viewMode, setViewMode] = useState<'2d' | '3d'>('2d');
  const [selectedPhase, setSelectedPhase] = useState<RotatingFieldPhase>('U');
  const motion = useMotionPolicy(calmMode);
  const playback = useAnimatedDemo({
    stepCount: ROTATING_FIELD_STEPS.length,
    autoPlayAllowed: motion.allowAutoPlay,
  });
  const step = ROTATING_FIELD_STEPS[playback.stepIndex];
  const focusedPhase = step.focus === 'U' || step.focus === 'V' || step.focus === 'W' ? step.focus : null;

  return (
    <section className="interactive-demo" aria-labelledby="rotating-field-demo-title">
      <h2 id="rotating-field-demo-title">Interaktivní ukázka</h2>
      <h3>{demo.title}</h3>
      <p>{demo.description}</p>

      <div className="series-parallel-demo-view-toggle" role="group" aria-label="Volba zobrazení točivého magnetického pole">
        <button
          type="button"
          className={`btn btn--secondary${viewMode === '2d' ? ' btn--active' : ''}`}
          aria-pressed={viewMode === '2d'}
          onClick={() => setViewMode('2d')}
        >
          2D schéma
        </button>
        <button
          type="button"
          className={`btn btn--secondary${viewMode === '3d' ? ' btn--active' : ''}`}
          aria-pressed={viewMode === '3d'}
          onClick={() => setViewMode('3d')}
        >
          3D model
        </button>
      </div>

      <div className="rotating-field-demo__phase-picker" role="group" aria-label="Výběr statorové fáze">
        <p className="three-d-controls__label">Fáze statoru</p>
        <div className="rotating-field-demo__phase-buttons">
          {ROTATING_FIELD_PHASES.map((phase) => (
            <button
              key={phase}
              type="button"
              className={`btn btn--secondary${selectedPhase === phase ? ' btn--active' : ''}`}
              aria-pressed={selectedPhase === phase}
              onClick={() => setSelectedPhase(phase)}
            >
              Fáze {phase}
            </button>
          ))}
        </div>
        <p className="rotating-field-demo__phase-description" role="status">
          Fáze {selectedPhase} – jedna ze tří statorových fází posunutých v prostoru vůči ostatním.
        </p>
      </div>

      {!motion.allowAutoPlay && (
        <p className="calm-step-hint" role="status">
          Automatické přehrávání je vypnuté — ukázku procházej vlastním tempem tlačítkem „Další krok“.
        </p>
      )}

      <AnimatedDemoControls
        status={playback.status}
        stepIndex={playback.stepIndex}
        stepCount={ROTATING_FIELD_STEPS.length}
        stepTitle={step.title}
        autoPlayAllowed={motion.allowAutoPlay}
        onPlay={playback.play}
        onPause={playback.pause}
        onNextStep={playback.nextStep}
        onReset={playback.reset}
      />

      {viewMode === '3d' ? (
        <Suspense
          fallback={
            <p className="three-d-fallback" role="status">
              Načítám 3D pohled statoru… 2D schéma zůstává kdykoli dostupné.
            </p>
          }
        >
          <LazyRotatingField3DView
            stepIndex={playback.stepIndex}
            selectedPhase={selectedPhase}
            calmMode={calmMode}
            onSelectPhase={setSelectedPhase}
            onUse2D={() => setViewMode('2d')}
          />
        </Suspense>
      ) : (
        <RotatingField2DSchema
          stepIndex={playback.stepIndex}
          focusedPhase={focusedPhase}
          selectedPhase={selectedPhase}
          allowContinuousMotion={motion.allowContinuousMotion}
        />
      )}

      <div className="logic-gate__explain">
        <strong>{step.title}.</strong> {step.description}
      </div>

      <button
        type="button"
        className="btn btn--primary"
        onClick={onContinue}
        disabled={!playback.hasCompletedOnce}
      >
        Rozumím, pokračovat na úkol
      </button>
    </section>
  );
}

function RotatingField2DSchema({
  stepIndex,
  focusedPhase,
  selectedPhase,
  allowContinuousMotion,
}: {
  stepIndex: number;
  focusedPhase: RotatingFieldPhase | null;
  selectedPhase: RotatingFieldPhase;
  allowContinuousMotion: boolean;
}) {
  const { fieldVisible, continuousRotationAllowed: fieldMoving } = getRotatingFieldPlaybackState(
    stepIndex,
    allowContinuousMotion,
    false,
  );

  return (
    <>
      <div className="animated-demo__stage rotating-field-demo__stage">
        <svg
          className="rotating-field-demo__svg"
          viewBox="0 0 640 400"
          role="img"
          aria-labelledby="rotating-field-svg-title rotating-field-svg-description"
        >
          <title id="rotating-field-svg-title">Stator s vinutími U, V a W</title>
          <desc id="rotating-field-svg-description">
            Názorné zobrazení prostorově posunutých statorových vinutí a výsledného magnetického pole.
          </desc>
          <text className="rotating-field-demo__svg-label" x="320" y="34" textAnchor="middle">
            Stator a prostorově rozložená vinutí
          </text>
          <g transform="translate(320 210)">
            <circle className="rotating-field-demo__stator" r="132" />
            <circle className="rotating-field-demo__airgap" r="101" />
            {ROTATING_FIELD_PHASES.map((phase, index) => {
              const active = focusedPhase === null || focusedPhase === phase;
              const selected = selectedPhase === phase;
              return (
                <g key={phase} transform={`rotate(${index * 120})`}>
                  <rect
                    className={`rotating-field-demo__coil${active ? ' rotating-field-demo__coil--active' : ''}${selected ? ' rotating-field-demo__coil--selected' : ''}`}
                    x="-17"
                    y="-124"
                    width="34"
                    height="24"
                    rx="5"
                  />
                  <text className="rotating-field-demo__phase-label" y="-139" textAnchor="middle">
                    {phase}
                  </text>
                </g>
              );
            })}
            {fieldVisible && (
              <g className={`rotating-field-demo__field${fieldMoving ? ' rotating-field-demo__field--spinning' : ''}`}>
                <line x1="0" y1="0" x2="0" y2="-88" />
                <polygon points="0,-104 -9,-87 9,-87" />
                <path d="M 64 -64 A 64 64 0 0 1 64 64" />
              </g>
            )}
          </g>
          <text className="rotating-field-demo__svg-label" x="320" y="372" textAnchor="middle">
            {fieldVisible ? 'Názorné zobrazení výsledného magnetického pole' : 'Stator stojí; sledujeme jeho vnitřní prostor'}
          </text>
        </svg>
      </div>
      <ul className="animated-demo__state rotating-field-demo__state" aria-label="Stav točivého pole textem">
        <li>
          Vinutí: <strong>U, V a W zůstávají pevně na statoru</strong>
        </li>
        <li>
          Vybraná fáze: <strong>Fáze {selectedPhase}</strong>
        </li>
        <li>
          Výsledné magnetické pole:{' '}
          <strong>
            {fieldVisible
              ? fieldMoving
                ? 'pomalu se otáčí v prostoru'
                : 'je znázorněno v jedné poloze'
              : 'zatím není zobrazeno'}
          </strong>
        </li>
      </ul>
    </>
  );
}
