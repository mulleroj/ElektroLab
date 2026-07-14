import { useCallback, useEffect, useRef, useState } from 'react';
import type { SensorDemoConfig } from '../../types';
import { AnimatedDemoControls } from '../animation/AnimatedDemoControls';
import { useAnimatedDemo } from '../animation/useAnimatedDemo';
import { useMotionPolicy } from '../animation/useMotionPolicy';

type ScenarioId = 'empty' | 'entered' | 'left';

interface DemoStep {
  title: string;
  description: string;
  closureNote?: string;
}

const SCENARIO_META: { id: ScenarioId; label: string }[] = [
  { id: 'empty', label: 'Nikdo není v prostoru' },
  { id: 'entered', label: 'Osoba vstoupila' },
  { id: 'left', label: 'Osoba odešla' },
];

const EMPTY_STEPS: DemoStep[] = [
  {
    title: 'Připravený klidový stav',
    description:
      'Chodba je prázdná. Snímač je připravený sledovat změnu.',
  },
  {
    title: 'Snímač nedetekuje pohyb',
    description:
      'Snímač nehlásí pohyb. Stav KLID je běžná informace, nikoliv porucha.',
  },
  {
    title: 'Řídicí systém zachová výstup vypnutý',
    description:
      'Řídicí systém vyhodnotil klidový stav a nevydal povel k rozsvícení.',
  },
  {
    title: 'Statický závěr',
    description:
      'Bez detekovaného pohybu zůstává světlo v tomto modelu zhasnuté.',
  },
];

const ENTERED_STEPS: DemoStep[] = [
  {
    title: 'Výchozí stav',
    description: 'Chodba je prázdná, snímač čeká na změnu.',
  },
  {
    title: 'Osoba vstoupí',
    description:
      'V prostředí nastala změna: osoba vstoupila do chodby.',
  },
  {
    title: 'Snímač detekuje pohyb',
    description:
      'Snímač zaznamenal pohyb a změnil svou výstupní informaci.',
  },
  {
    title: 'Signál se předá řízení',
    description: 'Informace POHYB se předává řídicímu systému.',
  },
  {
    title: 'Řídicí systém vyhodnotí signál',
    description:
      'Řídicí systém signál vyhodnotil a vydává povel k zapnutí světla.',
  },
  {
    title: 'Statický závěr',
    description:
      'Světlo se rozsvítilo až po vyhodnocení informace řídicím systémem.',
  },
];

const LEFT_STEPS: DemoStep[] = [
  {
    title: 'Aktivní výchozí stav',
    description: 'Osoba je v prostoru, světlo svítí — systém je aktivní.',
  },
  {
    title: 'Osoba odejde',
    description:
      'Osoba odešla. Výstup se ještě nemění, dokud systém nezpracuje nový stav.',
  },
  {
    title: 'Detekce přejde do klidu',
    description: 'Po odeznění detekce snímač předává informaci KLID.',
  },
  {
    title: 'Řídicí systém vyhodnotí klid',
    description:
      'Řídicí systém vyhodnotil nový stav a vydává povel k vypnutí světla.',
  },
  {
    title: 'Statický závěr',
    description:
      'Světlo zhaslo po vyhodnocení klidového stavu. Skutečný systém může používat nastavenou časovou prodlevu.',
  },
];

const STEPS_BY_SCENARIO: Record<ScenarioId, DemoStep[]> = {
  empty: EMPTY_STEPS,
  entered: ENTERED_STEPS,
  left: LEFT_STEPS,
};

const SIGNAL_NOTE =
  'Ukázka znázorňuje princip. Skutečný snímač může podle svého typu poskytovat analogový nebo digitální signál.';

const SYMBOLIC_NOTE =
  'Stavy POHYB a KLID jsou v této ukázce symbolické informace, nikoliv konkrétní napětí, proud nebo komunikační protokol.';

const DELAY_NOTE =
  'Skutečný systém může mít nastavenou časovou prodlevu. Ukázka znázorňuje logickou posloupnost, nikoliv přesné časování.';

interface SensorVisual {
  environmentState: string;
  observedEvent: string;
  sensorState: string;
  signalState: string;
  controllerState: string;
  commandState: string;
  outputState: string;
  scenarioResult: string;
  personPresent: boolean;
  lightOn: boolean;
  personMotion: 'none' | 'entering' | 'leaving';
  sensorPulse: boolean;
  signalFlow: boolean;
  controllerPulse: boolean;
  highlightEnvironment: boolean;
  highlightSensor: boolean;
  highlightSignal: boolean;
  highlightController: boolean;
  highlightOutput: boolean;
}

function getSteps(scenarioId: ScenarioId): DemoStep[] {
  return STEPS_BY_SCENARIO[scenarioId];
}

function deriveVisual(scenarioId: ScenarioId, stepIndex: number): SensorVisual {
  const base: SensorVisual = {
    environmentState: 'Chodba prázdná',
    observedEvent: 'bez pohybu',
    sensorState: 'PŘIPRAVEN',
    signalState: 'KLID',
    controllerState: 'ČEKÁ',
    commandState: 'žádný',
    outputState: 'ZHASNUTÉ',
    scenarioResult: 'Klidový stav bez pohybu',
    personPresent: false,
    lightOn: false,
    personMotion: 'none',
    sensorPulse: false,
    signalFlow: false,
    controllerPulse: false,
    highlightEnvironment: false,
    highlightSensor: false,
    highlightSignal: false,
    highlightController: false,
    highlightOutput: false,
  };

  if (scenarioId === 'empty') {
    if (stepIndex === 0) {
      return {
        ...base,
        highlightEnvironment: true,
        highlightSensor: true,
        scenarioResult: 'Připravený klidový stav',
      };
    }
    if (stepIndex === 1) {
      return {
        ...base,
        sensorState: 'NEDETEKUJE POHYB',
        highlightSensor: true,
        highlightSignal: true,
        scenarioResult: 'Snímač hlásí KLID — běžný stav, ne porucha',
      };
    }
    if (stepIndex === 2) {
      return {
        ...base,
        sensorState: 'NEDETEKUJE POHYB',
        controllerState: 'VYHODNOTILO KLID',
        commandState: 'PONECHAT VYPNUTO',
        controllerPulse: true,
        highlightSignal: true,
        highlightController: true,
        scenarioResult: 'Řízení ponechává světlo vypnuté',
      };
    }
    return {
      ...base,
      scenarioResult: 'Bez pohybu zůstává světlo zhasnuté',
    };
  }

  if (scenarioId === 'entered') {
    if (stepIndex === 0) {
      return {
        ...base,
        scenarioResult: 'Výchozí klid před vstupem',
      };
    }
    if (stepIndex === 1) {
      return {
        ...base,
        environmentState: 'Osoba vstoupila do chodby',
        observedEvent: 'pohyb',
        personPresent: true,
        personMotion: 'entering',
        sensorState: 'ZAZNAMENÁVÁ ZMĚNU',
        highlightEnvironment: true,
        highlightSensor: true,
        scenarioResult: 'Změna v prostředí — výstup se zatím nemění',
      };
    }
    if (stepIndex === 2) {
      return {
        ...base,
        environmentState: 'Osoba v chodbě',
        observedEvent: 'pohyb',
        personPresent: true,
        sensorState: 'DETEKUJE POHYB',
        signalState: 'POHYB',
        sensorPulse: true,
        highlightSensor: true,
        highlightSignal: true,
        scenarioResult: 'Snímač změnil informaci na POHYB',
      };
    }
    if (stepIndex === 3) {
      return {
        ...base,
        environmentState: 'Osoba v chodbě',
        observedEvent: 'pohyb',
        personPresent: true,
        sensorState: 'DETEKUJE POHYB',
        signalState: 'POHYB',
        signalFlow: true,
        controllerState: 'PŘIJÍMÁ SIGNÁL',
        highlightSignal: true,
        highlightController: true,
        scenarioResult: 'Informace se předává řízení',
      };
    }
    if (stepIndex === 4) {
      return {
        ...base,
        environmentState: 'Osoba v chodbě',
        observedEvent: 'pohyb',
        personPresent: true,
        sensorState: 'DETEKUJE POHYB',
        signalState: 'POHYB',
        controllerState: 'VYHODNOCUJE',
        commandState: 'ZAPNOUT',
        controllerPulse: true,
        highlightController: true,
        scenarioResult: 'Řízení vydává povel — světlo se ještě nemění',
      };
    }
    return {
      ...base,
      environmentState: 'Osoba v chodbě',
      observedEvent: 'pohyb',
      personPresent: true,
      sensorState: 'DETEKUJE POHYB',
      signalState: 'POHYB',
      controllerState: 'VYDÁVÁ POVEL ZAPNOUT',
      commandState: 'ZAPNOUT',
      outputState: 'SVÍTÍ',
      lightOn: true,
      highlightOutput: true,
      scenarioResult: 'Světlo svítí až po rozhodnutí řízení',
    };
  }

  if (stepIndex === 0) {
    return {
      ...base,
      environmentState: 'Osoba v chodbě',
      observedEvent: 'pohyb',
      personPresent: true,
      sensorState: 'DETEKUJE POHYB',
      signalState: 'POHYB',
      controllerState: 'AKTIVNÍ',
      commandState: 'ZAPNOUT',
      outputState: 'SVÍTÍ',
      lightOn: true,
      scenarioResult: 'Aktivní provoz se světlem',
    };
  }
  if (stepIndex === 1) {
    return {
      ...base,
      environmentState: 'Osoba opouští chodbu',
      observedEvent: 'pohyb',
      personPresent: false,
      personMotion: 'leaving',
      sensorState: 'DETEKUJE POHYB',
      signalState: 'POHYB',
      controllerState: 'AKTIVNÍ',
      commandState: 'ZAPNOUT',
      outputState: 'SVÍTÍ',
      lightOn: true,
      highlightEnvironment: true,
      scenarioResult: 'Odchod osoby — výstup zatím beze změny',
    };
  }
  if (stepIndex === 2) {
    return {
      ...base,
      sensorState: 'NEDETEKUJE POHYB',
      signalState: 'KLID',
      signalFlow: true,
      controllerState: 'PŘIJÍMÁ NOVÝ STAV',
      outputState: 'SVÍTÍ',
      lightOn: true,
      highlightSensor: true,
      highlightSignal: true,
      highlightController: true,
      scenarioResult: 'Snímač předává KLID — světlo zatím svítí',
    };
  }
  if (stepIndex === 3) {
    return {
      ...base,
      sensorState: 'NEDETEKUJE POHYB',
      signalState: 'KLID',
      controllerState: 'VYHODNOCUJE',
      commandState: 'VYPNOUT',
      controllerPulse: true,
      outputState: 'SVÍTÍ',
      lightOn: true,
      highlightController: true,
      scenarioResult: 'Řízení vydává povel vypnout — světlo zatím svítí',
    };
  }
  return {
    ...base,
    sensorState: 'PŘIPRAVEN',
    scenarioResult: 'Světlo zhaslo po vyhodnocení klidu',
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

function SensorScenarioPlayer({
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
    status === 'paused' && showMotion ? ' sensor-demo-anim--paused' : '';
  const liveMod = showMotion ? ' sensor-demo-stage--live' : '';

  const personClass = `sensor-demo-person${
    visual.personPresent ? ' sensor-demo-person--present' : ''
  }${
    visual.personMotion === 'entering' && showMotion
      ? ' sensor-demo-person--entering'
      : ''
  }${
    visual.personMotion === 'leaving' && showMotion
      ? ' sensor-demo-person--leaving'
      : ''
  }`;

  const sensorClass = `sensor-demo-sensor${
    visual.highlightSensor ? ' sensor-demo-block--active' : ''
  }${
    visual.sensorPulse && showMotion ? ' sensor-demo-sensor--pulse' : ''
  }`;

  const signalClass = `sensor-demo-signal${
    visual.highlightSignal ? ' sensor-demo-block--active' : ''
  }${
    visual.signalFlow && showMotion ? ' sensor-demo-signal--flow' : ''
  }`;

  const controllerClass = `sensor-demo-controller${
    visual.highlightController ? ' sensor-demo-block--active' : ''
  }${
    visual.controllerPulse && showMotion
      ? ' sensor-demo-controller--pulse'
      : ''
  }`;

  const environmentClass = `sensor-demo-environment${
    visual.highlightEnvironment ? ' sensor-demo-block--active' : ''
  }`;

  const outputClass = `sensor-demo-output${
    visual.highlightOutput ? ' sensor-demo-block--active' : ''
  }${visual.lightOn ? ' sensor-demo-output--on' : ''}`;

  return (
    <>
      {!motion.allowAutoPlay && (
        <p className="calm-step-hint" role="status">
          Automatické přehrávání je vypnuté — situaci procházej vlastním tempem
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
        className={`animated-demo__stage sensor-demo-stage${pausedMod}${liveMod}`}
        aria-hidden="true"
      >
        <svg
          className="sensor-demo-svg"
          viewBox="0 0 720 280"
          focusable="false"
        >
          <g className={`sensor-demo-block ${environmentClass}`}>
            <rect x={16} y={48} width={120} height={184} rx={8} />
            <text x={76} y={72} textAnchor="middle" className="sensor-demo-label">
              PROSTŘEDÍ
            </text>
            <rect
              x={32}
              y={88}
              width={88}
              height={120}
              rx={4}
              className="sensor-demo-corridor"
            />
            <g className={personClass}>
              <circle cx={76} cy={148} r={10} className="sensor-demo-person-head" />
              <rect
                x={68}
                y={158}
                width={16}
                height={28}
                rx={3}
                className="sensor-demo-person-body"
              />
            </g>
            <text x={76} y={228} textAnchor="middle" className="sensor-demo-sublabel">
              Chodba
            </text>
          </g>

          <g className={`sensor-demo-block ${sensorClass}`}>
            <rect x={168} y={88} width={96} height={104} rx={8} />
            <text x={216} y={112} textAnchor="middle" className="sensor-demo-label">
              SNÍMAČ
            </text>
            <circle cx={216} cy={148} r={18} className="sensor-demo-sensor-icon" />
            <text x={216} y={154} textAnchor="middle" className="sensor-demo-sensor-ray">
              ◉
            </text>
            <text x={216} y={178} textAnchor="middle" className="sensor-demo-sublabel">
              {visual.sensorState}
            </text>
          </g>

          <rect
            x={280}
            y={132}
            width={48}
            height={16}
            rx={3}
            className={`sensor-demo-signal-path${
              visual.signalFlow && showMotion
                ? ' sensor-demo-signal-path--flow'
                : ''
            }`}
          />

          <g className={`sensor-demo-block ${signalClass}`}>
            <rect x={344} y={88} width={96} height={104} rx={8} />
            <text x={392} y={112} textAnchor="middle" className="sensor-demo-label">
              SIGNÁL
            </text>
            <text x={392} y={152} textAnchor="middle" className="sensor-demo-value">
              {visual.signalState}
            </text>
            <text x={392} y={178} textAnchor="middle" className="sensor-demo-sublabel">
              informace
            </text>
          </g>

          <rect
            x={456}
            y={132}
            width={48}
            height={16}
            rx={3}
            className={`sensor-demo-signal-path${
              visual.signalFlow && showMotion
                ? ' sensor-demo-signal-path--flow'
                : ''
            }`}
          />

          <g className={`sensor-demo-block ${controllerClass}`}>
            <rect x={520} y={72} width={112} height={136} rx={8} />
            <text x={576} y={96} textAnchor="middle" className="sensor-demo-label">
              ŘÍDICÍ SYSTÉM
            </text>
            <text x={576} y={132} textAnchor="middle" className="sensor-demo-value">
              {visual.controllerState}
            </text>
            <text x={576} y={168} textAnchor="middle" className="sensor-demo-sublabel">
              povel: {visual.commandState}
            </text>
          </g>

          <line
            x1={632}
            y1={140}
            x2={656}
            y2={140}
            className="sensor-demo-connector"
          />

          <g className={`sensor-demo-block ${outputClass}`}>
            <rect x={656} y={100} width={48} height={80} rx={8} />
            <text x={680} y={120} textAnchor="middle" className="sensor-demo-label">
              VÝSTUP
            </text>
            <circle
              cx={680}
              cy={152}
              r={16}
              className={`sensor-demo-bulb${
                visual.lightOn ? ' sensor-demo-bulb--on' : ''
              }`}
            />
            <text x={680} y={182} textAnchor="middle" className="sensor-demo-sublabel">
              {visual.outputState}
            </text>
          </g>
        </svg>
      </div>

      <ul className="animated-demo__state" aria-label="Stav situace textem">
        <li>
          Aktivní situace: <strong>{scenarioLabel}</strong>
        </li>
        <li>
          Prostředí: <strong>{visual.environmentState}</strong>
        </li>
        <li>
          Sledovaný jev: <strong>{visual.observedEvent}</strong>
        </li>
        <li>
          Snímač: <strong>{visual.sensorState}</strong>
        </li>
        <li>
          Signál: <strong>{visual.signalState}</strong>
        </li>
        <li>
          Řídicí systém: <strong>{visual.controllerState}</strong>
        </li>
        <li>
          Povel: <strong>{visual.commandState}</strong>
        </li>
        <li>
          Výstup (světlo): <strong>{visual.outputState}</strong>
        </li>
        <li>
          Výsledek: <strong>{visual.scenarioResult}</strong>
        </li>
      </ul>

      <div className="logic-gate__explain" role="status" aria-live="polite">
        <strong>{step.title}.</strong> {step.description}
        {step.closureNote && <> {step.closureNote}</>}
      </div>
    </>
  );
}

interface SensorDemoProps {
  demo: SensorDemoConfig;
  calmMode: boolean;
  onContinue: () => void;
}

export function SensorDemoView({ demo, calmMode, onContinue }: SensorDemoProps) {
  const [activeScenarioId, setActiveScenarioId] =
    useState<ScenarioId>('empty');
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
          Projdi všechny situace vlastním tempem ({completedScenarios.size} /{' '}
          {SCENARIO_META.length} hotovo).
        </p>
      )}

      <p className="sensor-demo-switch-hint" role="status">
        Přepnutím situace se její aktuální průchod vrátí na začátek.
      </p>

      <div
        className="circuit-diagram__controls sensor-demo-scenarios"
        role="group"
        aria-label="Výběr situace"
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

      <SensorScenarioPlayer
        key={activeScenarioId}
        scenarioId={activeScenarioId}
        scenarioLabel={activeMeta.label}
        calmMode={calmMode}
        onScenarioCompleted={handleScenarioCompleted}
      />

      <p className="sensor-demo-note">{SIGNAL_NOTE}</p>
      <p className="sensor-demo-note">{SYMBOLIC_NOTE}</p>
      {activeScenarioId === 'left' && (
        <p className="sensor-demo-note">{DELAY_NOTE}</p>
      )}

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
