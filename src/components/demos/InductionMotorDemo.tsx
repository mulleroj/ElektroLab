import type { InductionMotorDemoConfig } from '../../types';
import { AnimatedDemoControls } from '../animation/AnimatedDemoControls';
import { useAnimatedDemo } from '../animation/useAnimatedDemo';
import { useMotionPolicy } from '../animation/useMotionPolicy';

interface InductionMotorDemoProps {
  demo: InductionMotorDemoConfig;
  calmMode: boolean;
  onContinue: () => void;
}

interface MotorStep {
  title: string;
  description: string;
}

// Názorná školní ukázka principu asynchronního motoru — nejde o fyzikálně přesnou
// simulaci (přesné proudy, moment, otáčky ani skluz v procentech) a nikdy neslouží
// jako návod na zapojování nebo práci se skutečným motorem pod napětím.
const STEPS: MotorStep[] = [
  {
    title: 'Klidový stav',
    description:
      'Motor je v klidovém stavu. Stator není aktivní a rotor stojí.',
  },
  {
    title: 'Třífázové proudy ve statoru',
    description:
      'Třífázové proudy ve statorových vinutích jsou navzájem časově posunuté.',
  },
  {
    title: 'Točivé magnetické pole',
    description:
      'Tři statorové proudy vytvářejí výsledné magnetické pole, které se otáčí kolem statoru.',
  },
  {
    title: 'Indukované proudy v rotoru',
    description:
      'Relativní pohyb točivého pole vůči rotoru indukuje proudy v rotorových vodičích.',
  },
  {
    title: 'Vznik momentu a rozběh',
    description:
      'Interakce magnetického pole a rotorových proudů vytváří moment. Rotor se rozbíhá ve směru točivého pole.',
  },
  {
    title: 'Ustálený chod a skluz',
    description:
      'Rotor se při běžném zatížení otáčí o něco pomaleji než točivé magnetické pole. Tento rozdíl rychlostí se nazývá skluz. Kdyby rotor dosáhl stejné rychlosti jako pole, zanikl by jejich relativní pohyb, omezila by se indukce rotorových proudů a motor by nevytvářel potřebný moment.',
  },
];

const MOTOR_CX = 320;
const MOTOR_CY = 210;
const ROTOR_BARS = 6;
const PHASE_LABELS = ['U', 'V', 'W'] as const;

export function InductionMotorDemoView({
  demo,
  calmMode,
  onContinue,
}: InductionMotorDemoProps) {
  const motion = useMotionPolicy(calmMode);
  const playback = useAnimatedDemo({
    stepCount: STEPS.length,
    autoPlayAllowed: motion.allowAutoPlay,
  });
  const { status, stepIndex } = playback;
  const step = STEPS[stepIndex];

  const statorActive = stepIndex >= 1;
  const fieldActive = stepIndex >= 2;
  const rotorCurrents = stepIndex >= 3;
  const rotorSpinning = stepIndex >= 4;
  const slipShown = stepIndex >= 5;

  const moving = motion.allowContinuousMotion;
  const pausedMod = status === 'paused' ? ' induction-motor-anim--paused' : '';

  const fieldStaticClass =
    fieldActive && !moving
      ? slipShown
        ? ' induction-motor-field--static-slip'
        : stepIndex >= 4
          ? ' induction-motor-field--static-mid'
          : ' induction-motor-field--static-start'
      : '';

  const rotorStaticClass =
    rotorSpinning && !moving
      ? slipShown
        ? ' induction-motor-rotor--static-slip'
        : ' induction-motor-rotor--static-start'
      : '';

  const fieldClass = `induction-motor-field${
    fieldActive ? ' induction-motor-field--visible' : ''
  }${
    fieldActive && moving
      ? ` induction-motor-field--spinning${pausedMod}`
      : fieldStaticClass
  }`;

  const rotorClass = `induction-motor-rotor${rotorStaticClass}${
    rotorSpinning && moving
      ? ` induction-motor-rotor--spinning${pausedMod}`
      : ''
  }`;

  const phasePulse =
    stepIndex === 1 && moving ? ' induction-motor-phase--pulse' : '';
  const pausedPhase = status === 'paused' ? ' induction-motor-anim--paused' : '';

  const statorLabel = !statorActive
    ? 'bez napájení'
    : stepIndex === 1
      ? 'třífázové proudy, časově posunuté'
      : 'napájený, vytváří točivé pole';

  const fieldLabel = !fieldActive
    ? 'nevzniká'
    : rotorSpinning
      ? moving
        ? 'otáčí se kolem statoru (rychlejší než rotor)'
        : slipShown
          ? 'zastaveno — poloha ukazuje, že je napřed'
          : 'zastaveno na aktuálním kroku'
      : moving
        ? 'otáčí se kolem statoru'
        : 'zobrazeno staticky';

  const rotorCurrentLabel = !rotorCurrents
    ? 'žádné'
    : rotorSpinning
      ? 'proudy v rotorových tyčích (indukce z relativního pohybu)'
      : 'indukují se v rotorových tyčích';

  const rotorMotionLabel = !rotorSpinning
    ? rotorCurrents
      ? 'stojí — relativní pohyb pole vůči rotoru stačí k indukci'
      : 'stojí'
    : moving
      ? 'otáčí se stejným směrem jako pole, o něco pomaleji'
      : slipShown
        ? 'zastaveno — poloha ukazuje, že zaostává'
        : 'zastaveno na aktuálním kroku';

  const slipLabel = slipShown
    ? moving
      ? 'ano — pole je rychlejší, rotor zaostává (skluz)'
      : 'ano — pole je napřed, rotor zaostává (staticky znázorněno)'
    : 'neuplatňuje se';

  const canContinue = playback.hasCompletedOnce;

  return (
    <section className="interactive-demo" aria-labelledby="demo-title">
      <h2 id="demo-title">Interaktivní ukázka</h2>
      <h3>{demo.title}</h3>
      <p>{demo.description}</p>

      {!motion.allowAutoPlay && (
        <p className="calm-step-hint" role="status">
          Automatické přehrávání je vypnuté — ukázku procházej vlastním tempem
          tlačítkem „Další krok“.
        </p>
      )}

      <AnimatedDemoControls
        status={status}
        stepIndex={stepIndex}
        stepCount={STEPS.length}
        stepTitle={step.title}
        autoPlayAllowed={motion.allowAutoPlay}
        onPlay={playback.play}
        onPause={playback.pause}
        onNextStep={playback.nextStep}
        onReset={playback.reset}
      />

      {/* Schéma je názorná grafika — úplný stav motoru je vždy popsán textem
          ve výpisu stavu, v popisu kroku a u skluzu níže. */}
      <div className="animated-demo__stage">
        <svg
          className="induction-motor-svg"
          viewBox="0 0 640 400"
          aria-hidden="true"
          focusable="false"
        >
          <text className="induction-motor-label" x={MOTOR_CX} y={36} textAnchor="middle">
            Řez asynchronním motorem (názorný model)
          </text>

          <g transform={`translate(${MOTOR_CX}, ${MOTOR_CY})`}>
            {/* Stator — pevný vnější kruh */}
            <circle className="induction-motor-stator" r={132} />
            <circle className="induction-motor-airgap" r={102} />

            {/* Tři skupiny statorového vinutí U, V, W */}
            {PHASE_LABELS.map((label, index) => (
              <g
                key={`phase-${label}`}
                transform={`rotate(${index * 120})`}
              >
                <g transform="translate(0, -118)">
                  <rect
                    className={`induction-motor-phase${
                      statorActive ? ' induction-motor-phase--on' : ''
                    }${phasePulse}${pausedPhase}`}
                    x={-14}
                    y={-10}
                    width={28}
                    height={20}
                    rx={4}
                    style={
                      phasePulse
                        ? ({ animationDelay: `${index * 0.35}s` } as const)
                        : undefined
                    }
                  />
                  <text
                    className="induction-motor-phase-label"
                    y={-16}
                    textAnchor="middle"
                  >
                    {label}
                  </text>
                </g>
              </g>
            ))}

            {/* Směr otáčení pole — pevná značka na statoru */}
            {fieldActive && (
              <text
                className="induction-motor-label induction-motor-label--direction"
                x={92}
                y={-148}
              >
                ↻ směr pole
              </text>
            )}

            {/* Točivé magnetické pole — otáčí se samostatně */}
            <g className={fieldClass}>
              <line
                className="induction-motor-field-arrow"
                x1={0}
                y1={0}
                x2={0}
                y2={-96}
              />
              <polygon
                className="induction-motor-field-head"
                points="0,-108 -8,-92 8,-92"
              />
              <path
                className="induction-motor-field-arc"
                d="M 70 -70 A 70 70 0 0 1 70 70"
              />
              <text
                className="induction-motor-label induction-motor-label--field"
                x={0}
                y={-112}
                textAnchor="middle"
              >
                pole
              </text>
              {slipShown && !moving && (
                <line
                  className="induction-motor-slip-marker induction-motor-slip-marker--field"
                  x1={0}
                  y1={-118}
                  x2={0}
                  y2={-132}
                />
              )}
            </g>

            {/* Rotor s tyčemi a indikací proudů */}
            <g className={rotorClass}>
              <circle className="induction-motor-rotor-disc" r={88} />
              {Array.from({ length: ROTOR_BARS }, (_, i) => {
                const angle = (i * 360) / ROTOR_BARS;
                return (
                  <g key={`rotor-bar-${i}`} transform={`rotate(${angle})`}>
                    <line
                      className={`induction-motor-rotor-bar${
                        rotorCurrents ? ' induction-motor-rotor-bar--on' : ''
                      }`}
                      x1={0}
                      y1={0}
                      x2={0}
                      y2={-78}
                    />
                    {rotorCurrents && (
                      <text
                        className="induction-motor-rotor-current"
                        x={0}
                        y={-52}
                        textAnchor="middle"
                      >
                        ⇄
                      </text>
                    )}
                  </g>
                );
              })}
              <circle className="induction-motor-shaft" r={14} />
              <text
                className="induction-motor-label induction-motor-label--rotor"
                x={0}
                y={104}
                textAnchor="middle"
              >
                rotor
              </text>
              {slipShown && !moving && (
                <line
                  className="induction-motor-slip-marker induction-motor-slip-marker--rotor"
                  x1={0}
                  y1={-68}
                  x2={0}
                  y2={-82}
                />
              )}
            </g>
          </g>

          <text className="induction-motor-label" x={MOTOR_CX} y={372} textAnchor="middle">
            STÁtor STOJÍ — ROTor ROTUJE (názorná pomůcka z lekce)
          </text>
        </svg>
      </div>

      <ul className="animated-demo__state" aria-label="Stav motoru textem">
        <li>
          Stator: <strong>{statorLabel}</strong>
        </li>
        <li>
          Točivé pole: <strong>{fieldLabel}</strong>
        </li>
        <li>
          Rotorové proudy: <strong>{rotorCurrentLabel}</strong>
        </li>
        <li>
          Pohyb rotoru: <strong>{rotorMotionLabel}</strong>
        </li>
        <li>
          Skluz: <strong>{slipLabel}</strong>
        </li>
      </ul>

      {slipShown && (
        <div className="induction-motor-slip-panel" role="status">
          <p>
            <strong>Pole je napřed</strong> — točivé magnetické pole ubírá rychleji.
          </p>
          <p>
            <strong>Rotor zaostává</strong> — otáčí se stejným směrem, ale o něco
            pomaleji.
          </p>
          <p>
            <strong>Skluz</strong> je právě tento rozdíl rychlostí. Bez něj by rotor
            nedostával indukované proudy a motor by nevytvářel moment.
          </p>
        </div>
      )}

      <div className="logic-gate__explain">
        <strong>{step.title}.</strong> {step.description}
      </div>

      <button
        type="button"
        className="btn btn--primary"
        onClick={onContinue}
        disabled={!canContinue}
      >
        Rozumím, pokračovat na úkol
      </button>
    </section>
  );
}
