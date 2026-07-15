import { useCallback, useEffect, useRef, useState } from 'react';
import type { DiodeDirectionDemoConfig } from '../../types';
import { AnimatedDemoControls } from '../animation/AnimatedDemoControls';
import { useAnimatedDemo } from '../animation/useAnimatedDemo';
import { useMotionPolicy } from '../animation/useMotionPolicy';

type ScenarioId = 'forward' | 'reverse';

interface DemoStep {
  title: string;
  description: string;
}

const SCENARIO_META: { id: ScenarioId; label: string }[] = [
  { id: 'forward', label: 'Propustný směr' },
  { id: 'reverse', label: 'Závěrný směr' },
];

const FORWARD_STEPS: DemoStep[] = [
  {
    title: 'Výchozí přehled',
    description:
      'Nejprve porovnáme polaritu zdroje s anodou a katodou diody.',
  },
  {
    title: 'Orientace diody',
    description:
      'Anoda je vůči katodě na vyšším potenciálu. Dioda je zapojena v propustném směru.',
  },
  {
    title: 'Dioda dovolí průchod',
    description:
      'V tomto zjednodušeném modelu dioda dovolí průchod konvenčního proudu.',
  },
  {
    title: 'Symbolický průchod proudu',
    description:
      'Konvenční proud může projít obvodem přes rezistor a testovanou diodu.',
  },
  {
    title: 'Statický závěr',
    description:
      'V propustném směru dioda umožnila průchod proudu a indikátor LED se rozsvítil.',
  },
];

const REVERSE_STEPS: DemoStep[] = [
  {
    title: 'Výchozí přehled',
    description: 'Dioda je nyní vůči zdroji otočena opačně.',
  },
  {
    title: 'Opačná orientace',
    description:
      'Katoda je vůči anodě na vyšším potenciálu. Dioda je zapojena v závěrném směru.',
  },
  {
    title: 'Dioda běžnou cestu zablokuje',
    description:
      'V tomto zjednodušeném modelu dioda běžnou cestou proud nepropustí.',
  },
  {
    title: 'Obvod nemá běžnou vodivou cestu',
    description:
      'Běžná vodivá cesta je v závěrném směru zablokovaná, takže indikátor nedostane proud potřebný k rozsvícení.',
  },
  {
    title: 'Statický závěr',
    description:
      'V závěrném směru zůstává LED v tomto zjednodušeném modelu zhasnutá.',
  },
];

const STEPS_BY_SCENARIO: Record<ScenarioId, DemoStep[]> = {
  forward: FORWARD_STEPS,
  reverse: REVERSE_STEPS,
};

const MODEL_NOTE =
  'Ukázka používá zjednodušený model diody. V závěrném směru běžnou cestou proud prakticky neprochází; malý závěrný proud a průraz zde neřešíme.';

const CONVENTIONAL_NOTE =
  'Znázorněný směr je směr konvenčního proudu, nikoliv směr pohybu elektronů. Animace neukazuje skutečnou rychlost elektrického děje.';

interface DiodeVisual {
  anodePolarity: string;
  cathodePolarity: string;
  orientationState: string;
  diodeState: string;
  currentState: string;
  resistorState: string;
  ledState: string;
  scenarioResult: string;
  ledOn: boolean;
  pathBlocked: boolean;
  highlightSource: boolean;
  highlightResistor: boolean;
  highlightDiode: boolean;
  highlightLed: boolean;
  polarityPulse: boolean;
  diodePulse: boolean;
  currentFlow: boolean;
  ledReceiving: boolean;
}

function getSteps(scenarioId: ScenarioId): DemoStep[] {
  return STEPS_BY_SCENARIO[scenarioId];
}

function deriveVisual(scenarioId: ScenarioId, stepIndex: number): DiodeVisual {
  const base: DiodeVisual = {
    anodePolarity: '—',
    cathodePolarity: '—',
    orientationState: 'Přehled obvodu',
    diodeState: 'NEVYHODNOCENO',
    currentState: 'NEAKTIVNÍ',
    resistorState: 'OCHRANNÝ/OMEZOVACÍ PRVEK',
    ledState: 'ZHASNUTÁ',
    scenarioResult: 'Připravený přehled',
    ledOn: false,
    pathBlocked: false,
    highlightSource: false,
    highlightResistor: false,
    highlightDiode: false,
    highlightLed: false,
    polarityPulse: false,
    diodePulse: false,
    currentFlow: false,
    ledReceiving: false,
  };

  if (scenarioId === 'forward') {
    if (stepIndex === 0) {
      return {
        ...base,
        anodePolarity: 'kladný pól (+) u anody',
        cathodePolarity: 'záporný pól (−) u katody',
        highlightSource: true,
        highlightDiode: true,
        scenarioResult: 'Porovnání polarity zdroje a vývodů diody',
      };
    }
    if (stepIndex === 1) {
      return {
        ...base,
        anodePolarity: 'kladný pól (+) u anody',
        cathodePolarity: 'záporný pól (−) u katody',
        orientationState: 'SPRÁVNÁ ORIENTACE PRO PROPUSTNÝ SMĚR',
        polarityPulse: true,
        highlightSource: true,
        highlightDiode: true,
        scenarioResult: 'Orientace odpovídá propustnému směru',
      };
    }
    if (stepIndex === 2) {
      return {
        ...base,
        anodePolarity: 'kladný pól (+) u anody',
        cathodePolarity: 'záporný pól (−) u katody',
        orientationState: 'SPRÁVNÁ ORIENTACE PRO PROPUSTNÝ SMĚR',
        diodeState: 'PROPUSTNÝ STAV',
        diodePulse: true,
        highlightDiode: true,
        scenarioResult: 'Dioda je ve propustném stavu',
      };
    }
    if (stepIndex === 3) {
      return {
        ...base,
        anodePolarity: 'kladný pól (+) u anody',
        cathodePolarity: 'záporný pól (−) u katody',
        orientationState: 'SPRÁVNÁ ORIENTACE PRO PROPUSTNÝ SMĚR',
        diodeState: 'PROPUSTNÝ STAV',
        currentState: 'MŮŽE PROCHÁZET',
        currentFlow: true,
        ledReceiving: true,
        ledState: 'PŘIJÍMÁ PROUD',
        highlightResistor: true,
        highlightDiode: true,
        highlightLed: true,
        scenarioResult: 'Konvenční proud může projít obvodem',
      };
    }
    return {
      ...base,
      anodePolarity: 'kladný pól (+) u anody',
      cathodePolarity: 'záporný pól (−) u katody',
      orientationState: 'SPRÁVNÁ ORIENTACE PRO PROPUSTNÝ SMĚR',
      diodeState: 'PROPUSTNÝ STAV',
      currentState: 'PROCHÁZÍ V MODELU',
      ledState: 'SVÍTÍ',
      ledOn: true,
      highlightLed: true,
      scenarioResult: 'Propustný směr — LED svítí',
    };
  }

  if (stepIndex === 0) {
    return {
      ...base,
      anodePolarity: 'záporný pól (−) u anody',
      cathodePolarity: 'kladný pól (+) u katody',
      highlightSource: true,
      highlightDiode: true,
      scenarioResult: 'Dioda otočena vůči zdroji',
    };
  }
  if (stepIndex === 1) {
    return {
      ...base,
      anodePolarity: 'záporný pól (−) u anody',
      cathodePolarity: 'kladný pól (+) u katody',
      orientationState: 'ORIENTACE PRO ZÁVĚRNÝ SMĚR',
      polarityPulse: true,
      highlightSource: true,
      highlightDiode: true,
      scenarioResult: 'Orientace odpovídá závěrnému směru',
    };
  }
  if (stepIndex === 2) {
    return {
      ...base,
      anodePolarity: 'záporný pól (−) u anody',
      cathodePolarity: 'kladný pól (+) u katody',
      orientationState: 'ORIENTACE PRO ZÁVĚRNÝ SMĚR',
      diodeState: 'ZÁVĚRNÝ STAV',
      diodePulse: true,
      pathBlocked: true,
      highlightDiode: true,
      scenarioResult: 'Dioda blokuje běžnou cestu',
    };
  }
  if (stepIndex === 3) {
    return {
      ...base,
      anodePolarity: 'záporný pól (−) u anody',
      cathodePolarity: 'kladný pól (+) u katody',
      orientationState: 'ORIENTACE PRO ZÁVĚRNÝ SMĚR',
      diodeState: 'ZÁVĚRNÝ STAV',
      currentState: 'BĚŽNOU CESTOU BLOKOVÁNO',
      pathBlocked: true,
      highlightDiode: true,
      scenarioResult: 'Běžná vodivá cesta je zablokovaná',
    };
  }
  return {
    ...base,
    anodePolarity: 'záporný pól (−) u anody',
    cathodePolarity: 'kladný pól (+) u katody',
    orientationState: 'ORIENTACE PRO ZÁVĚRNÝ SMĚR',
    diodeState: 'ZÁVĚRNÝ STAV',
    currentState: 'BĚŽNOU CESTOU NEPROCHÁZÍ',
    ledState: 'NESVÍTÍ',
    pathBlocked: true,
    scenarioResult: 'Závěrný směr — LED zůstává zhasnutá',
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

function DiodeScenarioPlayer({
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
      ? ' diode-direction-demo-anim--paused'
      : '';
  const isForward = scenarioId === 'forward';
  const diodeAnodeX = isForward ? 324 : 368;
  const diodeCathodeX = isForward ? 368 : 324;
  const diodeSymbolTransform = isForward
    ? undefined
    : 'translate(341, 148) scale(-1, 1) translate(-341, -148)';

  const sourceClass = `diode-direction-demo-block diode-direction-demo-source${
    visual.highlightSource ? ' diode-direction-demo-block--active' : ''
  }${
    visual.polarityPulse && showMotion
      ? ' diode-direction-demo-polarity--pulse'
      : ''
  }`;

  const resistorClass = `diode-direction-demo-block diode-direction-demo-resistor${
    visual.highlightResistor ? ' diode-direction-demo-block--active' : ''
  }`;

  const diodeClass = `diode-direction-demo-block diode-direction-demo-diode${
    visual.highlightDiode ? ' diode-direction-demo-block--active' : ''
  }${
    visual.diodePulse && showMotion ? ' diode-direction-demo-diode--pulse' : ''
  }${visual.pathBlocked ? ' diode-direction-demo-diode--blocking' : ''}`;

  const ledClass = `diode-direction-demo-block diode-direction-demo-led${
    visual.highlightLed ? ' diode-direction-demo-block--active' : ''
  }${visual.ledOn ? ' diode-direction-demo-led--on' : ''}${
    visual.ledReceiving && showMotion ? ' diode-direction-demo-led--receiving' : ''
  }`;

  const wireClass = (segment: 'r' | 'd' | 'l') => {
    const base = 'diode-direction-demo-wire';
    const blocked =
      visual.pathBlocked && (segment === 'd' || segment === 'l')
        ? ' diode-direction-demo-wire--blocked'
        : '';
    const flow =
      visual.currentFlow && showMotion && segment !== 'l'
        ? ' diode-direction-demo-current--flow'
        : '';
    return `${base}${blocked}${flow}`;
  };

  return (
    <>
      {!motion.allowAutoPlay && (
        <p className="calm-step-hint" role="status">
          Automatické přehrávání je vypnuté — směr procházej vlastním tempem
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
        className={`animated-demo__stage diode-direction-demo-stage${pausedMod}`}
        aria-hidden="true"
      >
        <svg
          className="diode-direction-demo-svg"
          viewBox="0 0 720 260"
          focusable="false"
        >
          <g className={sourceClass}>
            <rect x={16} y={72} width={88} height={116} rx={8} />
            <text
              x={60}
              y={96}
              textAnchor="middle"
              className="diode-direction-demo-label"
            >
              ZDROJ
            </text>
            <text
              x={40}
              y={128}
              textAnchor="middle"
              className="diode-direction-demo-pole diode-direction-demo-pole--plus"
            >
              +
            </text>
            <text
              x={80}
              y={128}
              textAnchor="middle"
              className="diode-direction-demo-pole diode-direction-demo-pole--minus"
            >
              −
            </text>
            <text
              x={60}
              y={168}
              textAnchor="middle"
              className="diode-direction-demo-sublabel"
            >
              nízké napětí
            </text>
          </g>

          <rect
            x={112}
            y={134}
            width={48}
            height={12}
            rx={3}
            className={wireClass('r')}
          />

          <g className={resistorClass}>
            <rect x={168} y={100} width={72} height={72} rx={8} />
            <text
              x={204}
              y={124}
              textAnchor="middle"
              className="diode-direction-demo-label"
            >
              REZISTOR
            </text>
            <rect
              x={188}
              y={138}
              width={32}
              height={12}
              rx={2}
              className="diode-direction-demo-resistor-symbol"
            />
            <text
              x={204}
              y={168}
              textAnchor="middle"
              className="diode-direction-demo-sublabel"
            >
              ochrana
            </text>
          </g>

          <rect
            x={248}
            y={134}
            width={40}
            height={12}
            rx={3}
            className={wireClass('d')}
          />

          <g className={diodeClass}>
            <rect x={296} y={88} width={124} height={96} rx={8} />
            <text
              x={358}
              y={112}
              textAnchor="middle"
              className="diode-direction-demo-label"
            >
              TESTOVANÁ DIODA
            </text>
            <g
              className="diode-direction-demo-diode-symbol-group"
              transform={diodeSymbolTransform}
            >
              <polygon
                points="330,148 350,136 350,160"
                className="diode-direction-demo-diode-symbol"
              />
              <line
                x1={352}
                y1={136}
                x2={352}
                y2={160}
                className="diode-direction-demo-diode-bar"
              />
            </g>
            <text
              x={diodeAnodeX}
              y={152}
              textAnchor="middle"
              className="diode-direction-demo-terminal"
            >
              A
            </text>
            <text
              x={diodeCathodeX}
              y={152}
              textAnchor="middle"
              className="diode-direction-demo-terminal"
            >
              K
            </text>
            <text
              x={358}
              y={172}
              textAnchor="middle"
              className="diode-direction-demo-sublabel"
            >
              {visual.diodeState}
            </text>
          </g>

          <rect
            x={428}
            y={134}
            width={48}
            height={12}
            rx={3}
            className={wireClass('l')}
          />

          <g className={ledClass}>
            <rect x={488} y={92} width={96} height={88} rx={8} />
            <text
              x={536}
              y={116}
              textAnchor="middle"
              className="diode-direction-demo-label"
            >
              INDIKÁTOR LED
            </text>
            <circle
              cx={536}
              cy={148}
              r={18}
              className={`diode-direction-demo-led-bulb${
                visual.ledOn ? ' diode-direction-demo-led-bulb--on' : ''
              }`}
            />
            <text
              x={536}
              y={172}
              textAnchor="middle"
              className="diode-direction-demo-sublabel"
            >
              {visual.ledState}
            </text>
          </g>

          {visual.currentFlow && (
            <text
              x={360}
              y={210}
              textAnchor="middle"
              className="diode-direction-demo-current-label"
            >
              konvenční proud →
            </text>
          )}
        </svg>
      </div>

      <ul className="animated-demo__state" aria-label="Stav situace textem">
        <li>
          Aktivní situace: <strong>{scenarioLabel}</strong>
        </li>
        <li>
          Polarita u anody: <strong>{visual.anodePolarity}</strong>
        </li>
        <li>
          Polarita u katody: <strong>{visual.cathodePolarity}</strong>
        </li>
        <li>
          Orientace diody: <strong>{visual.orientationState}</strong>
        </li>
        <li>
          Stav diody: <strong>{visual.diodeState}</strong>
        </li>
        <li>
          Konvenční proud: <strong>{visual.currentState}</strong>
        </li>
        <li>
          Rezistor: <strong>{visual.resistorState}</strong>
        </li>
        <li>
          Indikátor LED: <strong>{visual.ledState}</strong>
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

interface DiodeDirectionDemoProps {
  demo: DiodeDirectionDemoConfig;
  calmMode: boolean;
  onContinue: () => void;
}

export function DiodeDirectionDemoView({
  demo,
  calmMode,
  onContinue,
}: DiodeDirectionDemoProps) {
  const [activeScenarioId, setActiveScenarioId] =
    useState<ScenarioId>('forward');
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
          Projdi oba směry vlastním tempem ({completedScenarios.size} /{' '}
          {SCENARIO_META.length} hotovo).
        </p>
      )}

      <p className="diode-direction-demo-switch-hint" role="status">
        Přepnutím směru se jeho aktuální průchod vrátí na začátek.
      </p>

      <div
        className="circuit-diagram__controls diode-direction-demo-scenarios"
        role="group"
        aria-label="Výběr směru zapojení"
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

      <DiodeScenarioPlayer
        key={activeScenarioId}
        scenarioId={activeScenarioId}
        scenarioLabel={activeMeta.label}
        calmMode={calmMode}
        onScenarioCompleted={handleScenarioCompleted}
      />

      <p className="diode-direction-demo-note">{MODEL_NOTE}</p>
      <p className="diode-direction-demo-note">{CONVENTIONAL_NOTE}</p>

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
