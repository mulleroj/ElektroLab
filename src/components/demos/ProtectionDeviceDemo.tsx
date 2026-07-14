import { useCallback, useEffect, useState } from 'react';
import type { ProtectionDeviceDemoConfig } from '../../types';
import { AnimatedDemoControls } from '../animation/AnimatedDemoControls';
import { useAnimatedDemo } from '../animation/useAnimatedDemo';
import { useMotionPolicy } from '../animation/useMotionPolicy';

type ScenarioId = 'normal' | 'overload' | 'short';

type CurrentLevel = 'BĚŽNÁ' | 'ZVÝŠENÁ' | 'VELMI VYSOKÁ';

type CurrentMotion = 'none' | 'normal' | 'elevated' | 'surge';

interface DemoStep {
  title: string;
  description: string;
  closureNote?: string;
}

const SCENARIO_META: { id: ScenarioId; label: string }[] = [
  { id: 'normal', label: 'Normální provoz' },
  { id: 'overload', label: 'Přetížení' },
  { id: 'short', label: 'Zkrat' },
];

const NORMAL_STEPS: DemoStep[] = [
  {
    title: 'Obvod je připravený',
    description:
      'Obvod je připravený a kontakty jističe jsou sepnuté.',
  },
  {
    title: 'Běžný proud',
    description: 'Proud je v běžném rozsahu a jistič nemusí zasáhnout.',
  },
  {
    title: 'Jistič zůstává sepnutý',
    description:
      'Jistič nezjistil nadproud. Kontakty zůstávají sepnuté.',
  },
];

const OVERLOAD_STEPS: DemoStep[] = [
  {
    title: 'Běžný výchozí stav',
    description: 'Obvod pracuje s běžnou zátěží. Jistič je v klidu.',
  },
  {
    title: 'Zátěž se zvětší',
    description:
      'Větší zatížení zvyšuje požadavky na obvod — jistič zatím ještě nevypíná.',
  },
  {
    title: 'Proud je zvýšený',
    description:
      'Jistič sleduje nadproud. Tepelná spoušť se začíná zahřívat.',
  },
  {
    title: 'Tepelná spoušť se zahřívá',
    description:
      'Při delším zvýšeném proudu se zahřívá tepelný prvek jističe.',
  },
  {
    title: 'Tepelná spoušť působí',
    description:
      'Tepelná spoušť dosáhla prahu pro vybavení — kontakty se chystají rozepnout.',
  },
  {
    title: 'Jistič vybaví',
    description: 'Jistič rozpojí kontakty a přeruší obvod.',
  },
  {
    title: 'Bezpečný závěr',
    description:
      'Při déle trvajícím přetížení může tepelná spoušť způsobit vybavení jističe. Skutečná doba závisí na velikosti proudu a vlastnostech konkrétního přístroje.',
  },
];

const SHORT_STEPS: DemoStep[] = [
  {
    title: 'Běžný výchozí stav',
    description: 'Obvod je v klidu s běžnou zátěží.',
  },
  {
    title: 'Zkratová porucha',
    description:
      'Vznikne symbolická zkratová porucha — proud může najít zkratovou cestu.',
  },
  {
    title: 'Proud prudce vzroste',
    description:
      'Jistič detekuje velmi vysoký proud. Elektromagnetická spoušť se aktivuje.',
  },
  {
    title: 'Elektromagnetická spoušť působí',
    description:
      'Elektromagnetická spoušť rychle působí na mechanismus jističe.',
  },
  {
    title: 'Jistič vybaví',
    description: 'Jistič rozpojí kontakty a přeruší obvod.',
  },
  {
    title: 'Bezpečný závěr',
    description:
      'Při velmi vysokém zkratovém proudu může elektromagnetická spoušť vybavit jistič velmi rychle.',
  },
];

const STEPS_BY_SCENARIO: Record<ScenarioId, DemoStep[]> = {
  normal: NORMAL_STEPS,
  overload: OVERLOAD_STEPS,
  short: SHORT_STEPS,
};

const CURRENT_LEVEL_NOTE =
  'Úrovně proudu jsou pouze názorné. Nejde o skutečné ampéry, jmenovitý proud ani přesnou vybavovací charakteristiku jističe.';

const MOTION_NOTE =
  'Pohyb v názorném modelu pouze ukazuje přítomnost a velikost proudu. Neznázorňuje skutečný průběh střídavého proudu ani pohyb jednotlivých elektronů.';

const RCD_DIFF_NOTE =
  'Jistič sleduje velikost proudu v obvodu. Proudový chránič porovnává proud tam a zpět — to je jiný princip ochrany.';

interface ProtectionVisual {
  currentLevel: CurrentLevel;
  currentMotion: CurrentMotion;
  thermalState: string;
  magneticState: string;
  thermalMotion: boolean;
  magneticMotion: boolean;
  breakerState: string;
  contactState: string;
  loadState: string;
  faultState: string;
  scenarioResult: string;
  contactsOpen: boolean;
  showFault: boolean;
  showHeavyLoad: boolean;
  loadActive: boolean;
}

function getSteps(scenarioId: ScenarioId): DemoStep[] {
  return STEPS_BY_SCENARIO[scenarioId];
}

function deriveVisual(
  scenarioId: ScenarioId,
  stepIndex: number,
): ProtectionVisual {
  let currentLevel: CurrentLevel = 'BĚŽNÁ';
  let currentMotion: CurrentMotion = 'none';
  let thermalState = 'NEAKTIVNÍ';
  let magneticState = 'NEAKTIVNÍ';
  let thermalMotion = false;
  let magneticMotion = false;
  let breakerState = 'V KLIDU';
  let contactState = 'SEPNUTÉ';
  let loadState = 'Zátěž připojená';
  let faultState = 'Žádná porucha';
  let scenarioResult = 'Obvod v normálním stavu';
  let contactsOpen = false;
  let showFault = false;
  let showHeavyLoad = false;
  let loadActive = true;

  if (scenarioId === 'normal') {
    if (stepIndex === 0) {
      loadState = 'Spotřebič připojený';
    } else if (stepIndex === 1) {
      currentMotion = 'normal';
      scenarioResult = 'Běžný proud v obvodu';
    } else if (stepIndex >= 2) {
      scenarioResult = 'Provoz pokračuje — jistič sepnutý';
    }
  }

  if (scenarioId === 'overload') {
    if (stepIndex === 0) {
      scenarioResult = 'Normální provoz';
    } else if (stepIndex === 1) {
      showHeavyLoad = true;
      loadState = 'Zvětšená zátěž (názorně)';
      scenarioResult = 'Zátěž roste';
    } else if (stepIndex === 2) {
      showHeavyLoad = true;
      currentLevel = 'ZVÝŠENÁ';
      currentMotion = 'elevated';
      breakerState = 'SLEDUJE NADPROUD';
      thermalState = 'ZAHŘÍVÁ SE';
      thermalMotion = true;
      loadState = 'Zvětšená zátěž (názorně)';
      scenarioResult = 'Jistič sleduje nadproud';
    } else if (stepIndex === 3) {
      showHeavyLoad = true;
      currentLevel = 'ZVÝŠENÁ';
      currentMotion = 'elevated';
      breakerState = 'TEPELNÁ SPOUŠŤ SE ZAHŘÍVÁ';
      thermalState = 'ZAHŘÍVÁ SE';
      thermalMotion = true;
      loadState = 'Zvětšená zátěž (názorně)';
      scenarioResult = 'Tepelný prvek se zahřívá';
    } else if (stepIndex === 4) {
      showHeavyLoad = true;
      currentLevel = 'ZVÝŠENÁ';
      currentMotion = 'elevated';
      breakerState = 'TEPELNÁ SPOUŠŤ PŮSOBÍ';
      thermalState = 'PŮSOBÍ';
      thermalMotion = true;
      loadState = 'Zvětšená zátěž (názorně)';
      scenarioResult = 'Tepelná spoušť působí — vybavení brzy následuje';
    } else if (stepIndex === 5) {
      showHeavyLoad = true;
      currentLevel = 'ZVÝŠENÁ';
      contactsOpen = true;
      loadActive = false;
      breakerState = 'VYBAVIL';
      contactState = 'ROZEPNUTÉ';
      thermalState = 'PŮSOBÍ';
      loadState = 'Zátěž odpojená — obvod přerušen';
      scenarioResult = 'Jistič rozpojil obvod kvůli přetížení';
    } else if (stepIndex >= 6) {
      showHeavyLoad = true;
      currentLevel = 'ZVÝŠENÁ';
      contactsOpen = true;
      loadActive = false;
      breakerState = 'VYBAVIL';
      contactState = 'ROZEPNUTÉ';
      thermalState = 'PŮSOBÍ — příčina přetížení';
      loadState = 'Obvod bezpečně přerušen';
      scenarioResult = 'Přetížení vyřešeno vypnutím jističe';
    }
  }

  if (scenarioId === 'short') {
    if (stepIndex === 0) {
      scenarioResult = 'Normální provoz';
    } else if (stepIndex === 1) {
      showFault = true;
      faultState = 'Symbolická zkratová porucha';
      scenarioResult = 'Porucha vznikla — proud může najít zkratovou cestu';
    } else if (stepIndex === 2) {
      showFault = true;
      currentLevel = 'VELMI VYSOKÁ';
      currentMotion = 'surge';
      breakerState = 'DETEKUJE VELMI VYSOKÝ PROUD';
      magneticState = 'DETEKUJE';
      faultState = 'Zkratová cesta aktivní';
      scenarioResult = 'Jistič detekuje velmi vysoký proud';
    } else if (stepIndex === 3) {
      showFault = true;
      currentLevel = 'VELMI VYSOKÁ';
      currentMotion = 'surge';
      breakerState = 'ELEKTROMAGNETICKÁ SPOUŠŤ PŮSOBÍ';
      magneticState = 'PŮSOBÍ';
      magneticMotion = true;
      faultState = 'Zkratová cesta aktivní';
      scenarioResult = 'Elektromagnetická spoušť působí';
    } else if (stepIndex === 4) {
      showFault = true;
      currentLevel = 'VELMI VYSOKÁ';
      contactsOpen = true;
      loadActive = false;
      breakerState = 'VYBAVIL';
      contactState = 'ROZEPNUTÉ';
      magneticState = 'PŮSOBÍ';
      faultState = 'Zkrat stále přítomen — obvod přerušen';
      scenarioResult = 'Jistič rozpojil obvod kvůli zkratu';
    } else if (stepIndex >= 5) {
      showFault = true;
      currentLevel = 'VELMI VYSOKÁ';
      contactsOpen = true;
      loadActive = false;
      breakerState = 'VYBAVIL';
      contactState = 'ROZEPNUTÉ';
      magneticState = 'PŮSOBÍ — příčina zkratu';
      faultState = 'Porucha znázorněna staticky';
      scenarioResult = 'Zkrat vyřešen vypnutím jističe';
    }
  }

  return {
    currentLevel,
    currentMotion,
    thermalState,
    magneticState,
    thermalMotion,
    magneticMotion,
    breakerState,
    contactState,
    loadState,
    faultState,
    scenarioResult,
    contactsOpen,
    showFault,
    showHeavyLoad,
    loadActive,
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

function currentSegmentClass(
  motion: CurrentMotion,
  moving: boolean,
): string {
  const base = 'protection-device-current';
  if (!moving || motion === 'none') {
    return base;
  }
  return `${base} protection-device-current--${motion}`;
}

interface ScenarioPlayerProps {
  scenarioId: ScenarioId;
  scenarioLabel: string;
  calmMode: boolean;
  onScenarioCompleted: (id: ScenarioId) => void;
}

function ProtectionDeviceScenarioPlayer({
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

  useEffect(() => {
    if (hasCompletedOnce) {
      onScenarioCompleted(scenarioId);
    }
  }, [hasCompletedOnce, scenarioId, onScenarioCompleted]);

  const continuousMotion =
    motion.allowContinuousMotion &&
    (status === 'playing' || status === 'paused');
  const visual = deriveVisual(scenarioId, stepIndex);
  const pausedMod =
    status === 'paused' ? ' protection-device-anim--paused' : '';

  const movingCurrent =
    continuousMotion && visual.currentMotion !== 'none';
  const thermalClass = `protection-device-thermal${
    visual.thermalState !== 'NEAKTIVNÍ'
      ? ' protection-device-thermal--active'
      : ''
  }${
    visual.thermalMotion && continuousMotion
      ? ' protection-device-thermal--heating'
      : ''
  }`;
  const magneticClass = `protection-device-magnetic${
    visual.magneticState !== 'NEAKTIVNÍ'
      ? ' protection-device-magnetic--active'
      : ''
  }${
    visual.magneticMotion && continuousMotion
      ? ' protection-device-magnetic--pulse'
      : ''
  }`;
  const contactClass = `protection-device-contacts${
    visual.contactsOpen ? ' protection-device-contacts--open' : ''
  }${
    visual.contactsOpen && continuousMotion
      ? ' protection-device-contacts--opening'
      : ''
  }`;

  return (
    <>
      {!motion.allowAutoPlay && (
        <p className="calm-step-hint" role="status">
          Automatické přehrávání je vypnuté — scénář procházej vlastním tempem
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
        onNextStep={playback.nextStep}
        onReset={playback.reset}
      />

      <div className={`animated-demo__stage protection-device-stage${pausedMod}`}>
        <svg
          className="protection-device-svg"
          viewBox="0 0 640 320"
          aria-hidden="true"
          focusable="false"
        >
          <g className="protection-device-block protection-device-block--source">
            <rect x={24} y={100} width={72} height={80} rx={8} />
            <text x={60} y={128} textAnchor="middle" className="protection-device-label">
              Zdroj
            </text>
          </g>

          <line
            x1={96}
            y1={140}
            x2={168}
            y2={140}
            className="protection-device-wire"
          />
          <g className={currentSegmentClass(visual.currentMotion, movingCurrent)}>
            <rect x={100} y={132} width={60} height={16} rx={3} />
          </g>

          <g className="protection-device-block protection-device-block--breaker">
            <rect x={168} y={72} width={144} height={176} rx={8} />
            <text x={240} y={96} textAnchor="middle" className="protection-device-label">
              Jistič
            </text>
            <text x={240} y={118} textAnchor="middle" className="protection-device-value">
              {visual.breakerState}
            </text>

            <g className={thermalClass}>
              <rect x={188} y={132} width={40} height={28} rx={4} />
              <text x={208} y={150} textAnchor="middle" className="protection-device-sublabel">
                Tepelná
              </text>
            </g>

            <g className={magneticClass}>
              <rect x={252} y={132} width={40} height={28} rx={4} />
              <text x={272} y={150} textAnchor="middle" className="protection-device-sublabel">
                El. magn.
              </text>
            </g>

            <g className={contactClass}>
              <line x1={196} y1={178} x2={220} y2={166} />
              <line x1={260} y1={166} x2={284} y2={178} />
            </g>
            <text x={240} y={208} textAnchor="middle" className="protection-device-sublabel">
              {visual.contactState}
            </text>
          </g>

          <line
            x1={312}
            y1={140}
            x2={visual.contactsOpen ? 360 : 400}
            y2={140}
            className={`protection-device-wire${
              visual.contactsOpen ? ' protection-device-wire--broken' : ''
            }`}
          />
          {!visual.contactsOpen && (
            <g className={currentSegmentClass(visual.currentMotion, movingCurrent)}>
              <rect x={316} y={132} width={76} height={16} rx={3} />
            </g>
          )}

          {visual.showFault && (
            <g className="protection-device-fault">
              <path d="M 420 200 L 440 160 L 460 200 Z" />
              <text x={440} y={218} textAnchor="middle" className="protection-device-fault-label">
                Zkrat
              </text>
              <line
                x1={440}
                y1={160}
                x2={440}
                y2={140}
                className="protection-device-fault-line"
              />
            </g>
          )}

          <g
            className={`protection-device-block protection-device-block--load${
              visual.loadActive ? ' protection-device-block--active' : ''
            }`}
          >
            <rect x={420} y={108} width={100} height={72} rx={8} />
            <text x={470} y={132} textAnchor="middle" className="protection-device-label">
              Zátěž
            </text>
            {visual.showHeavyLoad && (
              <text x={470} y={154} textAnchor="middle" className="protection-device-overload">
                Větší zátěž
              </text>
            )}
          </g>
        </svg>
      </div>

      <ul className="animated-demo__state" aria-label="Stav scénáře textem">
        <li>
          Aktivní scénář: <strong>{scenarioLabel}</strong>
        </li>
        <li>
          Modelová úroveň proudu: <strong>{visual.currentLevel}</strong>
        </li>
        <li>
          Zátěž / porucha: <strong>{visual.loadState}</strong>
          {visual.showFault && (
            <>
              {' '}
              — <strong>{visual.faultState}</strong>
            </>
          )}
        </li>
        <li>
          Tepelná spoušť: <strong>{visual.thermalState}</strong>
        </li>
        <li>
          Elektromagnetická spoušť: <strong>{visual.magneticState}</strong>
        </li>
        <li>
          Jistič: <strong>{visual.breakerState}</strong>
        </li>
        <li>
          Kontakty: <strong>{visual.contactState}</strong>
        </li>
        <li>
          Výsledek: <strong>{visual.scenarioResult}</strong>
        </li>
      </ul>

      <div className="logic-gate__explain">
        <strong>{step.title}.</strong> {step.description}
        {step.closureNote && <> {step.closureNote}</>}
      </div>
    </>
  );
}

interface ProtectionDeviceDemoProps {
  demo: ProtectionDeviceDemoConfig;
  calmMode: boolean;
  onContinue: () => void;
}

export function ProtectionDeviceDemoView({
  demo,
  calmMode,
  onContinue,
}: ProtectionDeviceDemoProps) {
  const [activeScenarioId, setActiveScenarioId] =
    useState<ScenarioId>('normal');
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
          Projdi všechny scénáře vlastním tempem ({completedScenarios.size} /{' '}
          {SCENARIO_META.length} hotovo).
        </p>
      )}

      <p className="protection-device-switch-hint" role="status">
        Přepnutím scénáře se jeho aktuální průchod vrátí na začátek.
      </p>

      <div
        className="circuit-diagram__controls protection-device-scenarios"
        role="group"
        aria-label="Výběr scénáře"
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

      <ProtectionDeviceScenarioPlayer
        key={activeScenarioId}
        scenarioId={activeScenarioId}
        scenarioLabel={activeMeta.label}
        calmMode={calmMode}
        onScenarioCompleted={handleScenarioCompleted}
      />

      <p className="protection-device-note">{CURRENT_LEVEL_NOTE}</p>
      <p className="protection-device-note">{MOTION_NOTE}</p>
      <p className="protection-device-note">{RCD_DIFF_NOTE}</p>

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
