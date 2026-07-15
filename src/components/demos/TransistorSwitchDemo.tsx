import { useCallback, useEffect, useRef, useState } from 'react';
import type { TransistorSwitchDemoConfig } from '../../types';
import { AnimatedDemoControls } from '../animation/AnimatedDemoControls';
import { useAnimatedDemo } from '../animation/useAnimatedDemo';
import { useMotionPolicy } from '../animation/useMotionPolicy';

type ScenarioId = 'off' | 'on';

interface DemoStep {
  title: string;
  description: string;
}

const SCENARIO_META: { id: ScenarioId; label: string }[] = [
  { id: 'off', label: 'Řídicí signál vypnutý' },
  { id: 'on', label: 'Řídicí signál zapnutý' },
];

const OFF_STEPS: DemoStep[] = [
  {
    title: 'Výchozí přehled',
    description:
      'Nejdřív prohlédneme low-side zapojení NPN tranzistoru: řízení vede na bázi, zátěž LED je v kolektorové větvi.',
  },
  {
    title: 'Řídicí signál chybí',
    description:
      'Řídicí vstup je vypnutý. Na bázi nepřichází řídicí proud potřebný k sepnutí.',
  },
  {
    title: 'Proud báze je neaktivní',
    description:
      'V tomto zjednodušeném modelu zůstává cesta přes rezistor báze bez aktivního řídicího proudu.',
  },
  {
    title: 'Hlavní větev je rozepnutá',
    description:
      'Tranzistor je vypnutý, takže běžnou cestou neprochází proud potřebný k rozsvícení LED.',
  },
  {
    title: 'Statický závěr',
    description:
      'Bez řídicího signálu zůstává LED v tomto modelu zhasnutá — energii by dodával hlavní zdroj, ale větev C–E je rozepnutá.',
  },
];

const ON_STEPS: DemoStep[] = [
  {
    title: 'Výchozí přehled',
    description:
      'Sledujeme, jak řídicí signál přes rezistor báze umožní sepnutí NPN tranzistoru a průchod proudu zátěží.',
  },
  {
    title: 'Řídicí signál na bázi',
    description:
      'Řídicí signál přichází přes symbolický rezistor báze na vývod B.',
  },
  {
    title: 'Malý proud báze',
    description:
      'Malý řídicí proud báze teče cestou B–E. Tento proud LED nenapájí — jen řídí tranzistor.',
  },
  {
    title: 'Sepnutí a proud zátěže',
    description:
      'Tranzistor přejde do sepnutého stavu. Hlavní zdroj dodá větší proud kolektorovou větví přes rezistor LED a LED.',
  },
  {
    title: 'Statický závěr',
    description:
      'LED svítí, protože hlavní zdroj dodává proud zátěží. Tranzistor proud nevyrábí — jen jej spíná.',
  },
];

const STEPS_BY_SCENARIO: Record<ScenarioId, DemoStep[]> = {
  off: OFF_STEPS,
  on: ON_STEPS,
};

const MODEL_NOTE =
  'Ukázka používá zjednodušený model bipolárního NPN tranzistoru jako spínače. Malý řídicí proud báze umožní průchod většího proudu kolektorovou větví; energii pro zátěž dodává hlavní zdroj.';

const BASE_RESISTOR_NOTE =
  'V praktickém obvodu se proud báze omezuje rezistorem. Ukázka není návodem k zapojení.';

const CONVENTIONAL_NOTE =
  'Znázorněné směry představují konvenční proud, nikoliv pohyb elektronů. Animace neukazuje skutečnou rychlost elektrického děje.';

const SCOPE_NOTE =
  'Model neznázorňuje MOSFET ani přesnou saturační charakteristiku tranzistoru.';

interface TransistorVisual {
  controlSignal: string;
  baseState: string;
  transistorState: string;
  baseCurrent: string;
  loadCurrent: string;
  ledState: string;
  resistorBaseState: string;
  resistorLedState: string;
  scenarioResult: string;
  ledOn: boolean;
  pathBlocked: boolean;
  highlightControl: boolean;
  highlightBaseResistor: boolean;
  highlightTransistor: boolean;
  highlightLed: boolean;
  highlightLoadPath: boolean;
  controlPulse: boolean;
  basePulse: boolean;
  transistorPulse: boolean;
  baseCurrentFlow: boolean;
  loadCurrentFlow: boolean;
  ledReceiving: boolean;
}

function getSteps(scenarioId: ScenarioId): DemoStep[] {
  return STEPS_BY_SCENARIO[scenarioId];
}

function deriveVisual(scenarioId: ScenarioId, stepIndex: number): TransistorVisual {
  const base: TransistorVisual = {
    controlSignal: '—',
    baseState: 'B — báze',
    transistorState: 'NEVYHODNOCENO',
    baseCurrent: 'NEAKTIVNÍ',
    loadCurrent: 'NEAKTIVNÍ',
    ledState: 'ZHASNUTÁ',
    resistorBaseState: 'OMEZENÍ PROUDU BÁZE',
    resistorLedState: 'OCHRANNÝ/OMEZOVACÍ PRVEK',
    scenarioResult: 'Připravený přehled',
    ledOn: false,
    pathBlocked: false,
    highlightControl: false,
    highlightBaseResistor: false,
    highlightTransistor: false,
    highlightLed: false,
    highlightLoadPath: false,
    controlPulse: false,
    basePulse: false,
    transistorPulse: false,
    baseCurrentFlow: false,
    loadCurrentFlow: false,
    ledReceiving: false,
  };

  if (scenarioId === 'off') {
    if (stepIndex === 0) {
      return {
        ...base,
        controlSignal: 'VYPNUTÝ',
        transistorState: 'VYPNUTÝ (ROZEPNUTÝ)',
        highlightControl: true,
        highlightTransistor: true,
        highlightLed: true,
        scenarioResult: 'Přehled low-side zapojení NPN',
      };
    }
    if (stepIndex === 1) {
      return {
        ...base,
        controlSignal: 'VYPNUTÝ — CHYBÍ',
        transistorState: 'VYPNUTÝ (ROZEPNUTÝ)',
        controlPulse: true,
        highlightControl: true,
        highlightBaseResistor: true,
        scenarioResult: 'Řídicí signál na bázi nepřichází',
      };
    }
    if (stepIndex === 2) {
      return {
        ...base,
        controlSignal: 'VYPNUTÝ',
        baseCurrent: 'NEAKTIVNÍ',
        transistorState: 'VYPNUTÝ (ROZEPNUTÝ)',
        basePulse: true,
        highlightBaseResistor: true,
        highlightTransistor: true,
        scenarioResult: 'Proud báze v modelu neaktivní',
      };
    }
    if (stepIndex === 3) {
      return {
        ...base,
        controlSignal: 'VYPNUTÝ',
        baseCurrent: 'NEAKTIVNÍ',
        transistorState: 'VYPNUTÝ (ROZEPNUTÝ)',
        loadCurrent: 'BĚŽNOU CESTOU NEPROCHÁZÍ',
        pathBlocked: true,
        transistorPulse: true,
        highlightTransistor: true,
        highlightLoadPath: true,
        highlightLed: true,
        scenarioResult: 'Hlavní větev C–E je v modelu rozepnutá',
      };
    }
    return {
      ...base,
      controlSignal: 'VYPNUTÝ',
      baseCurrent: 'NEAKTIVNÍ',
      transistorState: 'VYPNUTÝ (ROZEPNUTÝ)',
      loadCurrent: 'BĚŽNOU CESTOU NEPROCHÁZÍ',
      ledState: 'NESVÍTÍ',
      pathBlocked: true,
      scenarioResult: 'Bez řídicího signálu LED zůstává zhasnutá',
    };
  }

  if (stepIndex === 0) {
    return {
      ...base,
      controlSignal: 'PŘIPRAVENÝ K ZAPNUTÍ',
      transistorState: 'VYPNUTÝ (ROZEPNUTÝ)',
      highlightControl: true,
      highlightTransistor: true,
      highlightLed: true,
      scenarioResult: 'Připraveno k příchodu řídicího signálu',
    };
  }
  if (stepIndex === 1) {
    return {
      ...base,
      controlSignal: 'ZAPNUTÝ',
      transistorState: 'VYPNUTÝ (ROZEPNUTÝ)',
      controlPulse: true,
      highlightControl: true,
      highlightBaseResistor: true,
      scenarioResult: 'Řídicí signál vede přes rezistor báze na B',
    };
  }
  if (stepIndex === 2) {
    return {
      ...base,
      controlSignal: 'ZAPNUTÝ',
      baseCurrent: 'MALÝ PROUD BÁZE (ŘÍZENÍ)',
      transistorState: 'PŘIPRAVEN K SEPNUTÍ',
      baseCurrentFlow: true,
      basePulse: true,
      highlightBaseResistor: true,
      highlightTransistor: true,
      scenarioResult: 'Malý proud báze řídí tranzistor, LED nenapájí',
    };
  }
  if (stepIndex === 3) {
    return {
      ...base,
      controlSignal: 'ZAPNUTÝ',
      baseCurrent: 'MALÝ PROUD BÁZE (ŘÍZENÍ)',
      transistorState: 'SEPNUTÝ (VODÍ)',
      loadCurrent: 'MŮŽE PROCHÁZET ZÁTĚŽÍ',
      ledState: 'PŘIJÍMÁ PROUD',
      transistorPulse: true,
      loadCurrentFlow: true,
      ledReceiving: true,
      highlightTransistor: true,
      highlightLoadPath: true,
      highlightLed: true,
      scenarioResult: 'Hlavní zdroj dodává proud kolektorovou větví',
    };
  }
  return {
    ...base,
    controlSignal: 'ZAPNUTÝ',
    baseCurrent: 'MALÝ PROUD BÁZE (ŘÍZENÍ)',
    transistorState: 'SEPNUTÝ (VODÍ)',
    loadCurrent: 'PROCHÁZÍ V MODELU',
    ledState: 'SVÍTÍ',
    ledOn: true,
    highlightLed: true,
    highlightTransistor: true,
    scenarioResult: 'LED svítí — proud zátěže dodává hlavní zdroj',
  };
}

function scenarioButtonLabel(
  label: string,
  id: ScenarioId,
  activeId: ScenarioId,
  completed: Set<ScenarioId>,
): string {
  if (completed.has(id)) {
    return `Hotovo: ${label}`;
  }
  if (activeId === id) {
    return `Rozpracováno: ${label}`;
  }
  return `Neprošlo: ${label}`;
}

interface ScenarioPlayerProps {
  scenarioId: ScenarioId;
  scenarioLabel: string;
  calmMode: boolean;
  onScenarioCompleted: (id: ScenarioId) => void;
}

function TransistorScenarioPlayer({
  scenarioId,
  scenarioLabel,
  calmMode,
  onScenarioCompleted,
}: ScenarioPlayerProps) {
  const motion = useMotionPolicy(calmMode);
  const steps = getSteps(scenarioId);
  const playback = useAnimatedDemo({
    stepCount: steps.length,
    autoPlayAllowed: motion.allowAutoPlay,
  });
  const { status, stepIndex, hasCompletedOnce } = playback;
  const step = steps[stepIndex];
  const holdAutoplayMotionRef = useRef(false);

  useEffect(() => {
    if (hasCompletedOnce) {
      onScenarioCompleted(scenarioId);
    }
  }, [hasCompletedOnce, scenarioId, onScenarioCompleted]);

  useEffect(() => {
    if (status === 'playing') {
      holdAutoplayMotionRef.current = true;
    } else if (status === 'idle' || status === 'completed') {
      holdAutoplayMotionRef.current = false;
    }
  }, [status]);

  const handleNextStep = useCallback(() => {
    holdAutoplayMotionRef.current = false;
    playback.nextStep();
  }, [playback]);

  const handleReset = useCallback(() => {
    holdAutoplayMotionRef.current = false;
    playback.reset();
  }, [playback]);

  const showMotion =
    motion.allowContinuousMotion &&
    (status === 'playing' ||
      (status === 'paused' && holdAutoplayMotionRef.current));
  const visual = deriveVisual(scenarioId, stepIndex);
  const pausedMod =
    status === 'paused' && showMotion
      ? ' transistor-switch-demo-anim--paused'
      : '';

  const controlClass = `transistor-switch-demo-block transistor-switch-demo-control${
    visual.highlightControl ? ' transistor-switch-demo-block--active' : ''
  }${
    visual.controlPulse && showMotion
      ? ' transistor-switch-demo-control--pulse'
      : ''
  }`;

  const rbClass = `transistor-switch-demo-block transistor-switch-demo-rb${
    visual.highlightBaseResistor ? ' transistor-switch-demo-block--active' : ''
  }${
    visual.basePulse && showMotion ? ' transistor-switch-demo-rb--pulse' : ''
  }`;

  const transistorClass = `transistor-switch-demo-block transistor-switch-demo-q${
    visual.highlightTransistor ? ' transistor-switch-demo-block--active' : ''
  }${
    visual.transistorPulse && showMotion
      ? ' transistor-switch-demo-q--pulse'
      : ''
  }${visual.pathBlocked ? ' transistor-switch-demo-q--open' : ''}${
    visual.transistorState.includes('SEPNUTÝ')
      ? ' transistor-switch-demo-q--on'
      : ''
  }`;

  const ledClass = `transistor-switch-demo-block transistor-switch-demo-led${
    visual.highlightLed ? ' transistor-switch-demo-block--active' : ''
  }${visual.ledOn ? ' transistor-switch-demo-led--on' : ''}${
    visual.ledReceiving && showMotion
      ? ' transistor-switch-demo-led--receiving'
      : ''
  }`;

  const rledClass = `transistor-switch-demo-block transistor-switch-demo-rled${
    visual.highlightLoadPath ? ' transistor-switch-demo-block--active' : ''
  }`;

  const sourceClass = `transistor-switch-demo-block transistor-switch-demo-source${
    visual.highlightLoadPath ? ' transistor-switch-demo-block--active' : ''
  }`;

  const loadWireClass = `transistor-switch-demo-wire${
    visual.pathBlocked ? ' transistor-switch-demo-wire--blocked' : ''
  }${
    visual.loadCurrentFlow && showMotion
      ? ' transistor-switch-demo-load--flow'
      : ''
  }`;

  const loadPathClass = `transistor-switch-demo-path${
    visual.pathBlocked ? ' transistor-switch-demo-path--blocked' : ''
  }${
    visual.loadCurrentFlow && showMotion
      ? ' transistor-switch-demo-load--flow'
      : ''
  }`;

  const baseWireClass = `transistor-switch-demo-wire${
    visual.baseCurrentFlow && showMotion
      ? ' transistor-switch-demo-base--flow'
      : ''
  }`;

  const basePathClass = `transistor-switch-demo-path${
    visual.baseCurrentFlow && showMotion
      ? ' transistor-switch-demo-base--flow'
      : ''
  }`;

  return (
    <>
      {!motion.allowAutoPlay && (
        <p className="calm-step-hint" role="status">
          Automatické přehrávání je vypnuté — stav projdi vlastním tempem
          tlačítkem „Další krok“.
        </p>
      )}

      <AnimatedDemoControls
        status={status}
        stepIndex={stepIndex}
        stepCount={steps.length}
        stepTitle={step.title}
        autoPlayAllowed={motion.allowAutoPlay}
        onPlay={playback.play}
        onPause={playback.pause}
        onNextStep={handleNextStep}
        onReset={handleReset}
      />

      <div
        className={`animated-demo__stage transistor-switch-demo-stage${pausedMod}`}
        aria-hidden="true"
      >
        <svg
          className="transistor-switch-demo-svg"
          viewBox="0 0 720 300"
          focusable="false"
        >
          {/* Hlavní zdroj */}
          <g className={sourceClass}>
            <rect x={16} y={28} width={96} height={88} rx={8} />
            <text
              x={64}
              y={50}
              textAnchor="middle"
              className="transistor-switch-demo-label"
            >
              HLAVNÍ ZDROJ
            </text>
            <text
              x={40}
              y={78}
              textAnchor="middle"
              className="transistor-switch-demo-pole transistor-switch-demo-pole--plus"
            >
              +
            </text>
            <text
              x={88}
              y={78}
              textAnchor="middle"
              className="transistor-switch-demo-pole transistor-switch-demo-pole--minus"
            >
              −
            </text>
            <text
              x={64}
              y={100}
              textAnchor="middle"
              className="transistor-switch-demo-sublabel"
            >
              nízké napětí
            </text>
          </g>

          {/* Load path: + → Rled → LED → C */}
          <rect
            x={112}
            y={54}
            width={36}
            height={10}
            rx={3}
            className={loadWireClass}
          />

          <g className={rledClass}>
            <rect x={148} y={28} width={72} height={62} rx={8} />
            <text
              x={184}
              y={48}
              textAnchor="middle"
              className="transistor-switch-demo-label"
            >
              REZISTOR LED
            </text>
            <rect
              x={168}
              y={56}
              width={32}
              height={12}
              rx={2}
              className="transistor-switch-demo-resistor-symbol"
            />
            <text
              x={184}
              y={80}
              textAnchor="middle"
              className="transistor-switch-demo-sublabel"
            >
              ochrana
            </text>
          </g>

          <rect
            x={220}
            y={54}
            width={28}
            height={10}
            rx={3}
            className={loadWireClass}
          />

          <g className={ledClass}>
            <rect x={248} y={24} width={88} height={70} rx={8} />
            <text
              x={292}
              y={44}
              textAnchor="middle"
              className="transistor-switch-demo-label"
            >
              LED ZÁTĚŽ
            </text>
            <circle
              cx={292}
              cy={62}
              r={12}
              className={`transistor-switch-demo-led-bulb${
                visual.ledOn ? ' transistor-switch-demo-led-bulb--on' : ''
              }`}
            />
            <text
              x={292}
              y={86}
              textAnchor="middle"
              className="transistor-switch-demo-sublabel"
            >
              {visual.ledState}
            </text>
          </g>

          <rect
            x={336}
            y={54}
            width={40}
            height={10}
            rx={3}
            className={loadWireClass}
          />

          {/* Control block */}
          <g className={controlClass}>
            <rect x={16} y={160} width={100} height={72} rx={8} />
            <text
              x={66}
              y={182}
              textAnchor="middle"
              className="transistor-switch-demo-label"
            >
              ŘÍZENÍ
            </text>
            <text
              x={66}
              y={204}
              textAnchor="middle"
              className="transistor-switch-demo-sublabel"
            >
              {visual.controlSignal}
            </text>
            <text
              x={66}
              y={220}
              textAnchor="middle"
              className="transistor-switch-demo-sublabel"
            >
              řídicí vstup
            </text>
          </g>

          <rect
            x={116}
            y={188}
            width={32}
            height={10}
            rx={3}
            className={baseWireClass}
          />

          <g className={rbClass}>
            <rect x={148} y={160} width={80} height={72} rx={8} />
            <text
              x={188}
              y={182}
              textAnchor="middle"
              className="transistor-switch-demo-label"
            >
              REZISTOR BÁZE
            </text>
            <rect
              x={172}
              y={192}
              width={32}
              height={12}
              rx={2}
              className="transistor-switch-demo-resistor-symbol"
            />
            <text
              x={188}
              y={220}
              textAnchor="middle"
              className="transistor-switch-demo-sublabel"
            >
              bez hodnoty
            </text>
          </g>

          <rect
            x={228}
            y={188}
            width={40}
            height={10}
            rx={3}
            className={baseWireClass}
          />

          {/* NPN transistor */}
          <g className={transistorClass}>
            <rect x={376} y={100} width={160} height={140} rx={8} />
            <text
              x={456}
              y={122}
              textAnchor="middle"
              className="transistor-switch-demo-label"
            >
              NPN BJT
            </text>
            <text
              x={456}
              y={138}
              textAnchor="middle"
              className="transistor-switch-demo-sublabel"
            >
              low-side spínač
            </text>

            {/* Collector terminal C at top */}
            <line
              x1={456}
              y1={148}
              x2={456}
              y2={168}
              className="transistor-switch-demo-lead"
            />
            <text
              x={470}
              y={160}
              className="transistor-switch-demo-terminal"
            >
              C
            </text>

            {/* Horizontal base bar */}
            <line
              x1={430}
              y1={168}
              x2={482}
              y2={168}
              className="transistor-switch-demo-bar"
            />

            {/* Emitter slant with outward NPN arrow */}
            <line
              x1={456}
              y1={168}
              x2={456}
              y2={210}
              className="transistor-switch-demo-lead"
            />
            <polygon
              points="456,210 448,196 464,196"
              className="transistor-switch-demo-emitter-arrow"
            />
            <text
              x={470}
              y={206}
              className="transistor-switch-demo-terminal"
            >
              E
            </text>

            {/* Base lead from left */}
            <line
              x1={390}
              y1={188}
              x2={430}
              y2={168}
              className="transistor-switch-demo-lead"
            />
            <text
              x={400}
              y={182}
              className="transistor-switch-demo-terminal"
            >
              B
            </text>

            <text
              x={456}
              y={228}
              textAnchor="middle"
              className="transistor-switch-demo-sublabel"
            >
              {visual.transistorState}
            </text>
          </g>

          {/* Emitter return to source − */}
          <path
            d="M 456 240 L 456 268 L 88 268 L 88 116"
            fill="none"
            strokeWidth={8}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={loadPathClass}
          />

          {/* Control return hint to common */}
          <path
            d="M 268 198 L 300 198 L 300 250 L 456 250"
            fill="none"
            strokeWidth={5}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={basePathClass}
          />

          {visual.baseCurrentFlow && (
            <text
              x={200}
              y={248}
              textAnchor="middle"
              className="transistor-switch-demo-current-label"
            >
              řídicí proud báze →
            </text>
          )}
          {visual.loadCurrentFlow && (
            <text
              x={280}
              y={16}
              textAnchor="middle"
              className="transistor-switch-demo-current-label"
            >
              konvenční proud zátěže →
            </text>
          )}
          {visual.pathBlocked && (
            <text
              x={456}
              y={90}
              textAnchor="middle"
              className="transistor-switch-demo-blocked-label"
            >
              C–E rozepnuto
            </text>
          )}
        </svg>
      </div>

      <ul className="animated-demo__state" aria-label="Stav situace textem">
        <li>
          Aktivní situace: <strong>{scenarioLabel}</strong>
        </li>
        <li>
          Řídicí signál: <strong>{visual.controlSignal}</strong>
        </li>
        <li>
          Vývody: <strong>B — báze, C — kolektor, E — emitor (NPN)</strong>
        </li>
        <li>
          Stav tranzistoru: <strong>{visual.transistorState}</strong>
        </li>
        <li>
          Proud báze: <strong>{visual.baseCurrent}</strong>
        </li>
        <li>
          Proud zátěže (C–E): <strong>{visual.loadCurrent}</strong>
        </li>
        <li>
          Rezistor báze: <strong>{visual.resistorBaseState}</strong>
        </li>
        <li>
          Rezistor LED: <strong>{visual.resistorLedState}</strong>
        </li>
        <li>
          LED zátěž: <strong>{visual.ledState}</strong>
        </li>
        <li>
          Výsledek: <strong>{visual.scenarioResult}</strong>
        </li>
      </ul>

      <div className="logic-gate__explain" role="status" aria-live="polite">
        <strong>{step.title}.</strong> {step.description}
      </div>
    </>
  );
}

interface TransistorSwitchDemoProps {
  demo: TransistorSwitchDemoConfig;
  calmMode: boolean;
  onContinue: () => void;
}

export function TransistorSwitchDemoView({
  demo,
  calmMode,
  onContinue,
}: TransistorSwitchDemoProps) {
  const [activeScenarioId, setActiveScenarioId] = useState<ScenarioId>('off');
  const [completedScenarios, setCompletedScenarios] = useState<
    Set<ScenarioId>
  >(new Set());

  const handleScenarioCompleted = useCallback((id: ScenarioId) => {
    setCompletedScenarios((prev) => {
      if (prev.has(id)) {
        return prev;
      }
      return new Set(prev).add(id);
    });
  }, []);

  const allCompleted = completedScenarios.size === SCENARIO_META.length;
  const activeMeta = SCENARIO_META.find((s) => s.id === activeScenarioId)!;

  return (
    <section className="interactive-demo" aria-labelledby="demo-title">
      <h2 id="demo-title">Interaktivní ukázka</h2>
      <h3>{demo.title}</h3>
      <p>{demo.description}</p>

      {calmMode && (
        <p className="calm-step-hint" role="status">
          Projdi oba stavy řídicího signálu vlastním tempem (
          {completedScenarios.size} / {SCENARIO_META.length} hotovo).
        </p>
      )}

      <p className="transistor-switch-demo-switch-hint" role="status">
        Přepnutím stavu řídicího signálu se jeho aktuální průchod vrátí na
        začátek.
      </p>

      <div
        className="circuit-diagram__controls transistor-switch-demo-scenarios"
        role="group"
        aria-label="Výběr stavu řídicího signálu"
      >
        {SCENARIO_META.map((s) => (
          <button
            key={s.id}
            type="button"
            className={`btn btn--secondary${
              activeScenarioId === s.id ? ' btn--active' : ''
            }`}
            aria-pressed={activeScenarioId === s.id}
            onClick={() => setActiveScenarioId(s.id)}
          >
            {scenarioButtonLabel(
              s.label,
              s.id,
              activeScenarioId,
              completedScenarios,
            )}
          </button>
        ))}
      </div>

      <TransistorScenarioPlayer
        key={activeScenarioId}
        scenarioId={activeScenarioId}
        scenarioLabel={activeMeta.label}
        calmMode={calmMode}
        onScenarioCompleted={handleScenarioCompleted}
      />

      <p className="transistor-switch-demo-note">{MODEL_NOTE}</p>
      <p className="transistor-switch-demo-note">{BASE_RESISTOR_NOTE}</p>
      <p className="transistor-switch-demo-note">{CONVENTIONAL_NOTE}</p>
      <p className="transistor-switch-demo-note">{SCOPE_NOTE}</p>

      <button
        type="button"
        className="btn btn--primary"
        onClick={onContinue}
        disabled={!allCompleted}
      >
        Rozumím, pokračovat na úkol
      </button>
    </section>
  );
}
