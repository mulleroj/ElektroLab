import { useCallback, useEffect, useState } from 'react';
import type { ResidualCurrentDemoConfig } from '../../types';
import { AnimatedDemoControls } from '../animation/AnimatedDemoControls';
import {
  useAnimatedDemo,
} from '../animation/useAnimatedDemo';
import { useMotionPolicy } from '../animation/useMotionPolicy';

type ScenarioId = 'normal' | 'leak' | 'fault' | 'myth';

interface DemoStep {
  title: string;
  description: string;
  closureNote?: string;
}

const SCENARIO_META: {
  id: ScenarioId;
  label: string;
}[] = [
  { id: 'normal', label: 'Běžný provoz' },
  { id: 'leak', label: 'Únik proudu' },
  { id: 'fault', label: 'Porucha spotřebiče' },
  {
    id: 'myth',
    label: '„Chránič přece nahradí jistič“',
  },
];

const NORMAL_STEPS: DemoStep[] = [
  {
    title: 'Připravený obvod',
    description:
      'Obvod je připravený a kontakty chrániče jsou sepnuté.',
  },
  {
    title: 'Vyvážený proud',
    description: 'Ke spotřebiči teče stejný proud, jaký se vrací zpět.',
  },
  {
    title: 'Chránič zůstává v klidu',
    description:
      'Rozdíl je nulový. Proudový chránič nemá důvod vypnout.',
  },
];

const LEAK_STEPS: DemoStep[] = [
  {
    title: 'Vyvážený výchozí stav',
    description:
      'Proud ke spotřebiči a zpět jsou stejné. Chránič je v klidu.',
  },
  {
    title: 'Proud teče spotřebičem',
    description: 'Oběma sledovanými vodiči prochází stejný symbolický proud.',
  },
  {
    title: 'Vznikne úniková cesta',
    description:
      'Část proudu může odejít mimo návratní vodič — chránič zatím ještě nevybavil.',
  },
  {
    title: 'Část proudu se nevrací',
    description:
      'Zpět se vrací méně, než odteklo ke spotřebiči. Rozdíl je 1 symbolická jednotka.',
  },
  {
    title: 'Chránič detekuje rozdíl',
    description:
      'Součtové jádro porovná oba proudy a zjistí reziduální rozdíl.',
  },
  {
    title: 'Chránič vybaví',
    description: 'Chránič rozpojí kontakty a přeruší obvod.',
  },
  {
    title: 'Bezpečný závěr',
    description:
      'Rozdíl proudů ukázal, že část proudu uniká mimo návratní vodič. Chránič rozpojil obvod.',
  },
];

const FAULT_STEPS: DemoStep[] = [
  {
    title: 'Vyvážený výchozí stav',
    description: 'Spotřebič je připojený a proudy jsou vyvážené.',
  },
  {
    title: 'Spotřebič pracuje',
    description: 'Proud teče ke spotřebiči a stejně se vrací zpět.',
  },
  {
    title: 'Porucha izolace',
    description:
      'Porucha může pustit proud na kovový kryt — vzniká únik mimo návratní vodič.',
  },
  {
    title: 'Část proudu se nevrací',
    description:
      'Zpět se vrací méně než odteklo. Rozdíl je 1 symbolická jednotka.',
  },
  {
    title: 'Chránič detekuje rozdíl',
    description: 'Součtové jádro zjistí reziduální rozdíl proudů.',
  },
  {
    title: 'Chránič vybaví',
    description: 'Chránič rozpojí kontakty a přeruší obvod.',
  },
  {
    title: 'Bezpečný závěr',
    description:
      'Školní model ukazuje princip ochrany. Skutečnou závadu musí řešit odborník — ne pokusy v obvodu.',
  },
];

const MYTH_STEPS: DemoStep[] = [
  {
    title: 'Nadproudová situace',
    description:
      'Při přetížení teče velký proud správnou cestou — tam i zpět je stejný symbolický proud.',
  },
  {
    title: 'Chránič porovnává',
    description:
      'Součtové jádro porovná oba proudy. Rozdíl je nulový.',
  },
  {
    title: 'Chránič zůstává sepnutý',
    description:
      'Bez reziduálního rozdílu chránič nemá důvod vypnout.',
  },
  {
    title: 'Vyvrácení mýtu',
    description:
      'Samotná funkce proudového chrániče nechrání před přetížením. Nadproudovou ochranu zajišťuje jistič nebo kombinovaný ochranný přístroj.',
  },
];

const STEPS_BY_SCENARIO: Record<ScenarioId, DemoStep[]> = {
  normal: NORMAL_STEPS,
  leak: LEAK_STEPS,
  fault: FAULT_STEPS,
  myth: MYTH_STEPS,
};

const SIMPLIFICATION_NOTE =
  'Ukázka používá symbolické jednotky proudu, nikoli ampéry. Znázorňuje princip rozdílu proudů, ne skutečný vybavovací práh konkrétního chrániče.';

const CONVENTIONAL_CURRENT_NOTE =
  'Pohyblivé šipky znázorňují konvenční směr proudu v názorném modelu, nikoli pohyb jednotlivých elektronů.';

type SignalId = 'forward' | 'return' | 'leak' | 'core';

type BlockId = 'core' | 'rcd' | 'load' | 'supply';

interface ResidualVisual {
  forwardUnits: number;
  returnUnits: number;
  diffUnits: number;
  contactsOpen: boolean;
  showLeakPath: boolean;
  leakPathLabel: string;
  activeSignals: SignalId[];
  activeBlocks: BlockId[];
  rcdState: string;
  contactState: string;
  comparisonState: string;
  leakPathState: string;
  scenarioResult: string;
  overloadNote: boolean;
}

function getSteps(scenarioId: ScenarioId): DemoStep[] {
  return STEPS_BY_SCENARIO[scenarioId];
}

function deriveVisual(
  scenarioId: ScenarioId,
  stepIndex: number,
): ResidualVisual {
  const forwardUnits = 10;
  let returnUnits = 10;
  let contactsOpen = false;
  let showLeakPath = false;
  let leakPathLabel = 'Neaktivní';
  const activeSignals: SignalId[] = [];
  const activeBlocks: BlockId[] = ['supply', 'load'];
  let rcdState = 'V KLIDU';
  let contactState = 'SEPNUTÉ';
  let comparisonState = 'Proudy vyvážené — rozdíl 0';
  let leakPathState = 'Žádná úniková větev';
  let scenarioResult = 'Obvod v normálním stavu';
  let overloadNote = false;

  if (scenarioId === 'normal') {
    if (stepIndex === 0) {
      activeBlocks.push('rcd');
    } else if (stepIndex === 1) {
      activeSignals.push('forward', 'return');
      activeBlocks.push('rcd', 'core');
    } else if (stepIndex >= 2) {
      activeBlocks.push('rcd', 'core');
      comparisonState = 'Porovnání dokončeno — rozdíl 0';
      scenarioResult = 'Chránič zůstává v klidu';
    }
  }

  if (scenarioId === 'leak' || scenarioId === 'fault') {
    if (stepIndex <= 1) {
      if (stepIndex === 1) {
        activeSignals.push('forward', 'return');
      }
      activeBlocks.push('rcd', 'core');
    } else if (stepIndex === 2) {
      showLeakPath = true;
      leakPathLabel =
        scenarioId === 'fault' ? 'Únik ke kovovému krytu' : 'Únik mimo návratní vodič';
      leakPathState = 'Úniková větev vznikla';
      activeBlocks.push('rcd', 'load');
    } else if (stepIndex === 3) {
      returnUnits = 9;
      showLeakPath = true;
      leakPathLabel =
        scenarioId === 'fault' ? 'Únik ke kovovému krytu' : 'Únik mimo návratní vodič';
      activeSignals.push('forward', 'return', 'leak');
      activeBlocks.push('rcd', 'core');
      rcdState = 'POROVNÁVÁ PROUDY';
      leakPathState = 'Část proudu odchází únikovou větví';
      comparisonState = 'Rozdíl 1 symbolická jednotka';
      scenarioResult = 'Chránič porovnává proudy tam a zpět';
    } else if (stepIndex === 4) {
      returnUnits = 9;
      showLeakPath = true;
      activeBlocks.push('core', 'rcd');
      activeSignals.push('forward', 'return', 'leak', 'core');
      rcdState = 'DETEKUJE ROZDÍL';
      comparisonState = 'Součtové jádro detekuje rozdíl 1 jednotka';
      leakPathState = 'Únik pokračuje';
      scenarioResult = 'Chránič vyhodnocuje rozdíl';
    } else if (stepIndex === 5) {
      returnUnits = 9;
      showLeakPath = true;
      contactsOpen = true;
      activeBlocks.push('rcd', 'core');
      rcdState = 'VYBAVIL';
      contactState = 'ROZEPNUTÉ';
      comparisonState = 'Rozdíl překročil práh chrániče (názorně)';
      leakPathState = 'Únik stále přítomen — obvod přerušen';
      scenarioResult = 'Chránič rozpojil obvod';
    } else if (stepIndex >= 6) {
      returnUnits = 9;
      showLeakPath = true;
      contactsOpen = true;
      activeBlocks.push('rcd', 'core', 'load');
      rcdState = 'VYBAVIL';
      contactState = 'ROZEPNUTÉ';
      comparisonState = 'Rozdíl 1 symbolická jednotka — obvod bezpečně přerušen';
      leakPathState =
        scenarioId === 'fault'
          ? 'Porucha spotřebiče — řeší odborník'
          : 'Únik znázorněn staticky';
      scenarioResult =
        scenarioId === 'fault'
          ? 'Závada vyžaduje odborné řešení'
          : 'Chránič rozpojil obvod kvůli úniku';
    }
  }

  if (scenarioId === 'myth') {
    if (stepIndex === 0) {
      overloadNote = true;
      activeBlocks.push('rcd', 'core');
      scenarioResult = 'Nadproud — proud správnou cestou';
    } else if (stepIndex === 1) {
      activeSignals.push('forward', 'return', 'core');
      activeBlocks.push('core', 'rcd');
      comparisonState = 'Proud tam = proud zpět — rozdíl 0';
    } else if (stepIndex === 2) {
      activeBlocks.push('rcd', 'core');
      comparisonState = 'Žádný reziduální rozdíl';
      scenarioResult = 'Chránič zůstává sepnutý';
    } else if (stepIndex >= 3) {
      activeBlocks.push('rcd', 'core');
      comparisonState = 'Rozdíl 0 — chránič nevybavil';
      scenarioResult = 'Nadproud řeší jistič, ne samotný chránič';
    }
  }

  const diffUnits = forwardUnits - returnUnits;

  return {
    forwardUnits,
    returnUnits,
    diffUnits,
    contactsOpen,
    showLeakPath,
    leakPathLabel,
    activeSignals,
    activeBlocks,
    rcdState,
    contactState,
    comparisonState,
    leakPathState,
    scenarioResult,
    overloadNote,
  };
}

function signalClass(
  id: SignalId,
  active: SignalId[],
  moving: boolean,
): string {
  const base = `residual-current-signal residual-current-signal--${id}`;
  const on = active.includes(id) ? ' residual-current-signal--active' : '';
  const flow =
    active.includes(id) && moving ? ' residual-current-signal--flow' : '';
  return base + on + flow;
}

function blockClass(id: BlockId, active: BlockId[]): string {
  return `residual-current-block residual-current-block--${id}${
    active.includes(id) ? ' residual-current-block--active' : ''
  }`;
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

function ResidualCurrentScenarioPlayer({
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
    status === 'paused' ? ' residual-current-anim--paused' : '';

  const contactClass = `residual-current-contacts${
    visual.contactsOpen ? ' residual-current-contacts--open' : ''
  }${
    visual.contactsOpen && continuousMotion
      ? ' residual-current-contacts--opening'
      : ''
  }`;

  const coreClass = `residual-current-core${
    visual.activeBlocks.includes('core') ? ' residual-current-core--active' : ''
  }${
    visual.activeSignals.includes('core') && continuousMotion
      ? ' residual-current-core--pulse'
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

      <div className={`animated-demo__stage residual-current-stage${pausedMod}`}>
        <svg
          className="residual-current-svg"
          viewBox="0 0 640 340"
          aria-hidden="true"
          focusable="false"
        >
          <defs>
            <marker
              id="residual-current-arrow"
              markerWidth="8"
              markerHeight="8"
              refX="6"
              refY="4"
              orient="auto"
            >
              <path
                d="M0,0 L8,4 L0,8 Z"
                className="residual-current-marker"
              />
            </marker>
          </defs>

          <line
            className={signalClass('forward', visual.activeSignals, continuousMotion)}
            x1={48}
            y1={120}
            x2={200}
            y2={120}
            markerEnd="url(#residual-current-arrow)"
          />
          <line
            className={signalClass('return', visual.activeSignals, continuousMotion)}
            x1={200}
            y1={200}
            x2={48}
            y2={200}
            markerEnd="url(#residual-current-arrow)"
          />
          <line
            className={signalClass('forward', visual.activeSignals, continuousMotion)}
            x1={280}
            y1={120}
            x2={420}
            y2={120}
            markerEnd="url(#residual-current-arrow)"
          />
          <line
            className={signalClass('return', visual.activeSignals, continuousMotion)}
            x1={420}
            y1={200}
            x2={280}
            y2={200}
            markerEnd="url(#residual-current-arrow)"
          />
          {visual.showLeakPath && (
            <line
              className={signalClass('leak', visual.activeSignals, continuousMotion)}
              x1={500}
              y1={160}
              x2={500}
              y2={268}
              markerEnd="url(#residual-current-arrow)"
            />
          )}

          <g className={blockClass('supply', visual.activeBlocks)}>
            <rect x={24} y={88} width={80} height={144} rx={8} />
            <text x={64} y={112} textAnchor="middle" className="residual-current-label">
              Přívod
            </text>
            <text x={64} y={136} textAnchor="middle" className="residual-current-sublabel">
              L + N
            </text>
          </g>

          <g className={blockClass('rcd', visual.activeBlocks)}>
            <rect x={208} y={72} width={120} height={176} rx={8} />
            <text x={268} y={96} textAnchor="middle" className="residual-current-label">
              Chránič
            </text>
            <text x={268} y={118} textAnchor="middle" className="residual-current-value">
              {visual.rcdState}
            </text>
            <g className={contactClass}>
              <line x1={236} y1={140} x2={252} y2={128} />
              <line x1={284} y1={128} x2={300} y2={140} />
              <line x1={236} y1={200} x2={252} y2={212} />
              <line x1={284} y1={212} x2={300} y2={200} />
            </g>
            <text x={268} y={232} textAnchor="middle" className="residual-current-sublabel">
              {visual.contactState}
            </text>
          </g>

          <g className={coreClass}>
            <ellipse cx={268} cy={160} rx={36} ry={52} />
            <text x={268} y={164} textAnchor="middle" className="residual-current-core-label">
              Σ
            </text>
            <text x={268} y={228} textAnchor="middle" className="residual-current-sublabel">
              Součtové jádro
            </text>
          </g>

          <g className={blockClass('load', visual.activeBlocks)}>
            <rect x={432} y={100} width={120} height={120} rx={8} />
            <text x={492} y={124} textAnchor="middle" className="residual-current-label">
              Spotřebič
            </text>
            {visual.overloadNote && (
              <text x={492} y={148} textAnchor="middle" className="residual-current-overload">
                Nadproud
              </text>
            )}
          </g>

          {visual.showLeakPath && (
            <g className="residual-current-earth">
              <line x1={476} y1={268} x2={524} y2={268} />
              <line x1={488} y1={280} x2={512} y2={280} />
              <line x1={494} y1={292} x2={506} y2={292} />
              <text x={500} y={258} textAnchor="middle" className="residual-current-sublabel">
                {visual.leakPathLabel}
              </text>
            </g>
          )}
        </svg>
      </div>

      <ul className="animated-demo__state" aria-label="Stav scénáře textem">
        <li>
          Aktivní scénář: <strong>{scenarioLabel}</strong>
        </li>
        <li>
          Proud ke spotřebiči: <strong>{visual.forwardUnits} jednotek</strong>
        </li>
        <li>
          Proud zpět: <strong>{visual.returnUnits} jednotek</strong>
        </li>
        <li>
          Rozdíl proudů: <strong>{visual.diffUnits} symbolických jednotek</strong>
        </li>
        <li>
          Součtové porovnání: <strong>{visual.comparisonState}</strong>
        </li>
        <li>
          Úniková cesta: <strong>{visual.leakPathState}</strong>
        </li>
        <li>
          Chránič: <strong>{visual.rcdState}</strong>
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

interface ResidualCurrentDemoProps {
  demo: ResidualCurrentDemoConfig;
  calmMode: boolean;
  onContinue: () => void;
}

export function ResidualCurrentDemoView({
  demo,
  calmMode,
  onContinue,
}: ResidualCurrentDemoProps) {
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

      <p className="residual-current-switch-hint" role="status">
        Přepnutím scénáře se jeho aktuální průchod vrátí na začátek.
      </p>

      <div
        className="circuit-diagram__controls residual-current-scenarios"
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

      <ResidualCurrentScenarioPlayer
        key={activeScenarioId}
        scenarioId={activeScenarioId}
        scenarioLabel={activeMeta.label}
        calmMode={calmMode}
        onScenarioCompleted={handleScenarioCompleted}
      />

      <p className="residual-current-note">{SIMPLIFICATION_NOTE}</p>
      <p className="residual-current-note">{CONVENTIONAL_CURRENT_NOTE}</p>

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
