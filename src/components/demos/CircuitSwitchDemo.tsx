import { useCallback, useEffect, useRef, useState } from 'react';
import type { CircuitSwitchDemo } from '../../types';
import { AnimatedDemoControls } from '../animation/AnimatedDemoControls';
import { useAnimatedDemo } from '../animation/useAnimatedDemo';
import { useMotionPolicy } from '../animation/useMotionPolicy';

type ScenarioId = 'open' | 'closed';

interface DemoStep {
  title: string;
  description: string;
}

const SCENARIO_META: { id: ScenarioId; label: string }[] = [
  { id: 'open', label: 'Spínač rozepnutý' },
  { id: 'closed', label: 'Spínač sepnutý' },
];

const OPEN_STEPS: DemoStep[] = [
  {
    title: 'Přehled obvodu',
    description:
      'Vidíš celý obvod: zdroj (baterii) s póly + a −, vodiče, spínač v horní větvi a žárovku jako spotřebič. Spínač je rozepnutý.',
  },
  {
    title: 'Kontrola spínače',
    description:
      'Zaměříme se na spínač. Jeho dva kontakty nejsou spojené — rameno je zvednuté, mezi kontakty zůstává mezera.',
  },
  {
    title: 'Přerušená cesta',
    description:
      'Jediné přerušené místo v celém obvodu je mezi kontakty spínače. Všechny ostatní vodiče zůstávají celé a spojité.',
  },
  {
    title: 'Proud neprochází',
    description:
      'Protože smyčka není uzavřená, proud nemá kudy téct. Nic se nepohybuje — nulový proud se neanimuje.',
  },
  {
    title: 'Výsledek',
    description:
      'Obvod je přerušený, proud neteče a žárovka nesvítí. Stačí jediné přerušení a spotřebič nepracuje.',
  },
];

const CLOSED_STEPS: DemoStep[] = [
  {
    title: 'Připravený obvod',
    description:
      'Stejný obvod jako předtím. Spínač je zatím rozepnutý a žárovka nesvítí.',
  },
  {
    title: 'Sepnutí spínače',
    description:
      'Rameno spínače spojí oba kontakty. Smyčka se tím fyzicky uzavře — vzniká spojitá cesta.',
  },
  {
    title: 'Uzavřená smyčka',
    description:
      'Celá cesta je teď spojitá: od + pólu zdroje přes spínač a žárovku a návratovým vodičem zpět k − pólu. Proud zatím neanimujeme.',
  },
  {
    title: 'Proud prochází',
    description:
      'Uzavřeným obvodem prochází proud po celé vnější cestě — konvenčním směrem od + k −. Žárovka přijímá energii.',
  },
  {
    title: 'Žárovka svítí',
    description:
      'Proud prochází celým obvodem a žárovka svítí. Energii dodává zdroj, spínač jen uzavírá cestu.',
  },
];

const STEPS_BY_SCENARIO: Record<ScenarioId, DemoStep[]> = {
  open: OPEN_STEPS,
  closed: CLOSED_STEPS,
};

const MODEL_NOTE =
  'Schéma je názorná školní ukázka jednoduchého stejnosměrného obvodu se zdrojem, spínačem a žárovkou.';

const CONVENTIONAL_NOTE =
  'Animace znázorňuje konvenční směr proudu ve vnějším obvodu. Nezobrazuje pohyb elektronů ani skutečnou rychlost elektrického děje.';

/**
 * Přesné elektrické join pointy schématu (SVG user units, viewBox 0 0 400 280).
 * Vnější smyčka je obdélník: zdroj na levé svislé straně, spínač v horní větvi,
 * žárovka na pravé straně, spodní vodič je skutečná návratová cesta k −.
 */
const SOURCE_POSITIVE = { x: 64, y: 70 }; // horní vývod zdroje (+), roh smyčky
const SOURCE_NEGATIVE = { x: 64, y: 210 }; // dolní vývod zdroje (−), roh smyčky
const PLATE_LONG_Y = 131; // dlouhá deska baterie (+)
const PLATE_SHORT_Y = 149; // krátká deska baterie (−)
const SWITCH_LEFT_CONTACT = { x: 176, y: 70 };
const SWITCH_RIGHT_CONTACT = { x: 224, y: 70 };
const SWITCH_ARM_OPEN = { x: 218, y: 48 }; // zvednuté rameno, nedotýká se pravého kontaktu
const TOP_RIGHT = { x: 344, y: 70 };
const BULB_CENTER = { x: 344, y: 140 };
const BULB_RADIUS = 24;
const BULB_TOP_TERMINAL = { x: 344, y: BULB_CENTER.y - BULB_RADIUS }; // 116
const BULB_BOTTOM_TERMINAL = { x: 344, y: BULB_CENTER.y + BULB_RADIUS }; // 164
const RETURN_Y = 210;

// Vnější proudová cesta od + k − (mimo vnitřek zdroje): horní větev přes spínač,
// pravá strana přes žárovku, spodní návrat. Jediný spojitý path → při animaci se
// pohybují všechny úseky současně (žádný postupný „světelný bod“).
const FLOW_PATH = `M ${SOURCE_POSITIVE.x} ${SOURCE_POSITIVE.y} H ${TOP_RIGHT.x} V ${RETURN_Y} H ${SOURCE_NEGATIVE.x}`;

interface CircuitVisual {
  switchClosed: boolean;
  wireActive: boolean;
  showCurrentArrows: boolean;
  currentFlow: boolean;
  bulbReceiving: boolean;
  bulbOn: boolean;
  switchHighlight: boolean;
  gapEmphasis: boolean;
  switchState: string;
  circuitState: string;
  pathState: string;
  currentState: string;
  bulbState: string;
  sourceState: string;
  plusState: string;
  minusState: string;
  returnState: string;
  scenarioResult: string;
}

const SHARED_TEXT = {
  plusState: '+ pól (horní vývod zdroje)',
  minusState: '− pól (dolní vývod zdroje)',
};

function getSteps(scenarioId: ScenarioId): DemoStep[] {
  return STEPS_BY_SCENARIO[scenarioId];
}

function deriveVisual(scenarioId: ScenarioId, stepIndex: number): CircuitVisual {
  if (scenarioId === 'open') {
    const base: CircuitVisual = {
      switchClosed: false,
      wireActive: false,
      showCurrentArrows: false,
      currentFlow: false,
      bulbReceiving: false,
      bulbOn: false,
      switchHighlight: false,
      gapEmphasis: false,
      switchState: 'rozepnutý',
      circuitState: 'přerušený',
      pathState: 'přerušená mezi kontakty spínače',
      currentState: 'neprochází',
      bulbState: 'nesvítí',
      sourceState: 'baterie — dodává energii, ale obvod je přerušený',
      ...SHARED_TEXT,
      returnState:
        'vodič fyzicky existuje, ale proud jím nyní neprochází',
      scenarioResult: '',
    };
    switch (stepIndex) {
      case 0:
        return { ...base, scenarioResult: 'Přehled přerušeného obvodu' };
      case 1:
        return {
          ...base,
          switchHighlight: true,
          scenarioResult: 'Kontrola rozepnutého spínače',
        };
      case 2:
        return {
          ...base,
          switchHighlight: true,
          gapEmphasis: true,
          scenarioResult: 'Jediné přerušení je mezi kontakty spínače',
        };
      case 3:
        return {
          ...base,
          gapEmphasis: true,
          scenarioResult: 'Proud nemá uzavřenou cestu, neteče',
        };
      default:
        return {
          ...base,
          gapEmphasis: true,
          scenarioResult: 'Obvod přerušený — žárovka nesvítí',
        };
    }
  }

  const switchClosed = stepIndex >= 1;
  const wireActive = stepIndex >= 2;
  const hasCurrent = stepIndex >= 3;
  const base: CircuitVisual = {
    switchClosed,
    wireActive,
    showCurrentArrows: hasCurrent,
    currentFlow: stepIndex === 3,
    bulbReceiving: stepIndex === 3,
    bulbOn: stepIndex === 4,
    switchHighlight: stepIndex === 1,
    gapEmphasis: false,
    switchState: switchClosed ? 'sepnutý' : 'rozepnutý (připraveno)',
    circuitState: switchClosed ? 'uzavřený' : 'zatím přerušený',
    pathState: wireActive
      ? 'spojitá uzavřená smyčka'
      : switchClosed
        ? 'spínač spojil oba kontakty'
        : 'zatím přerušená u spínače',
    currentState: hasCurrent
      ? 'prochází celou vnější cestou od + k −'
      : 'neprochází',
    bulbState:
      stepIndex === 4 ? 'svítí' : stepIndex === 3 ? 'přijímá energii' : 'nesvítí',
    sourceState: 'baterie — dodává obvodu elektrickou energii',
    ...SHARED_TEXT,
    returnState: hasCurrent
      ? 'vodičem prochází proud zpět k − pólu'
      : 'vodič fyzicky existuje, proud zatím neprochází',
    scenarioResult: '',
  };
  switch (stepIndex) {
    case 0:
      return {
        ...base,
        scenarioResult: 'Připravený obvod, spínač ještě rozepnutý',
      };
    case 1:
      return { ...base, scenarioResult: 'Spínač sepnul — smyčka se uzavřela' };
    case 2:
      return { ...base, scenarioResult: 'Uzavřená spojitá smyčka' };
    case 3:
      return { ...base, scenarioResult: 'Proud prochází celým obvodem' };
    default:
      return {
        ...base,
        scenarioResult: 'Žárovka svítí — energii dodává zdroj',
      };
  }
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

function CircuitScenarioPlayer({
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
  // Motion třídy patří jen k autoplay: Pauza je zmrazí, ruční krokování a
  // completed je odstraní (každý krok má úplný statický význam).
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
    status === 'paused' && showMotion ? ' circuit-switch-demo-anim--paused' : '';

  // Tok existuje jen v closed scénáři, jen v kroku „Proud prochází“ (index 3)
  // a jen když autoplay dovoluje souvislý pohyb.
  const showFlowOverlay = visual.currentFlow && showMotion;

  const wireCls = `circuit-switch-demo-wire${
    visual.wireActive ? ' circuit-switch-demo-wire--on' : ''
  }`;
  const armCls = `circuit-switch-demo-wire${
    visual.switchClosed && visual.wireActive
      ? ' circuit-switch-demo-wire--on'
      : ''
  }`;
  const bulbCls = `circuit-switch-demo-bulb${
    visual.bulbReceiving ? ' circuit-switch-demo-bulb--receiving' : ''
  }${visual.bulbOn ? ' circuit-switch-demo-bulb--on' : ''}`;

  // Jediný živý region je stavový řádek v AnimatedDemoControls. U klíčových
  // kroků nese i výsledek (proud / žárovka), aby čtečka nemusela číst SVG.
  let liveStepTitle = step.title;
  if (scenarioId === 'closed' && stepIndex === 3) {
    liveStepTitle = 'Proud prochází celým obvodem';
  } else if (scenarioId === 'closed' && stepIndex === 4) {
    liveStepTitle = 'Výsledek: obvod uzavřený, žárovka svítí';
  } else if (scenarioId === 'open' && stepIndex === 3) {
    liveStepTitle = 'Proud neprochází přerušeným obvodem';
  } else if (scenarioId === 'open' && stepIndex === 4) {
    liveStepTitle = 'Výsledek: obvod přerušený, žárovka nesvítí';
  }

  const armX2 = visual.switchClosed
    ? SWITCH_RIGHT_CONTACT.x
    : SWITCH_ARM_OPEN.x;
  const armY2 = visual.switchClosed
    ? SWITCH_RIGHT_CONTACT.y
    : SWITCH_ARM_OPEN.y;

  return (
    <>
      {!motion.allowAutoPlay && (
        <p className="calm-step-hint">
          Automatické přehrávání je vypnuté — obvod projdi vlastním tempem
          tlačítkem „Další krok“.
        </p>
      )}

      <AnimatedDemoControls
        status={status}
        stepIndex={stepIndex}
        stepCount={steps.length}
        stepTitle={liveStepTitle}
        autoPlayAllowed={motion.allowAutoPlay}
        onPlay={playback.play}
        onPause={playback.pause}
        onNextStep={handleNextStep}
        onReset={handleReset}
      />

      {/* Schéma je názorná grafika — úplný stav obvodu je vždy popsán textem
          ve výpisu stavu a v popisu kroku níže. */}
      <div
        className={`animated-demo__stage${pausedMod}`}
        aria-hidden="true"
      >
        <svg
          className="circuit-switch-demo-svg"
          viewBox="0 0 400 280"
          focusable="false"
        >
          {/* Vnější vodiče smyčky (bez vnitřku zdroje) */}
          {/* Horní větev před spínačem */}
          <path
            className={wireCls}
            fill="none"
            d={`M ${SOURCE_POSITIVE.x} ${SOURCE_POSITIVE.y} H ${SWITCH_LEFT_CONTACT.x}`}
          />
          {/* Horní větev za spínačem */}
          <path
            className={wireCls}
            fill="none"
            d={`M ${SWITCH_RIGHT_CONTACT.x} ${SWITCH_RIGHT_CONTACT.y} H ${TOP_RIGHT.x}`}
          />
          {/* Pravá strana: k hornímu vývodu žárovky */}
          <path
            className={wireCls}
            fill="none"
            d={`M ${TOP_RIGHT.x} ${TOP_RIGHT.y} V ${BULB_TOP_TERMINAL.y}`}
          />
          {/* Pravá strana: od dolního vývodu žárovky dolů */}
          <path
            className={wireCls}
            fill="none"
            d={`M ${BULB_BOTTOM_TERMINAL.x} ${BULB_BOTTOM_TERMINAL.y} V ${RETURN_Y}`}
          />
          {/* Spodní návratová cesta k − pólu */}
          <path
            className={wireCls}
            fill="none"
            d={`M ${TOP_RIGHT.x} ${RETURN_Y} H ${SOURCE_NEGATIVE.x}`}
          />

          {/* Vnitřní vývody zdroje (součást baterie, neutrální) */}
          <path
            className="circuit-switch-demo-wire"
            fill="none"
            d={`M ${SOURCE_POSITIVE.x} ${SOURCE_POSITIVE.y} V ${PLATE_LONG_Y}`}
          />
          <path
            className="circuit-switch-demo-wire"
            fill="none"
            d={`M ${SOURCE_NEGATIVE.x} ${SOURCE_NEGATIVE.y} V ${PLATE_SHORT_Y}`}
          />

          {/* Zdroj — baterie: dlouhá deska (+), krátká deska (−) */}
          <line
            className="circuit-switch-demo-battery-plate circuit-switch-demo-battery-plate--long"
            x1={44}
            y1={PLATE_LONG_Y}
            x2={84}
            y2={PLATE_LONG_Y}
          />
          <line
            className="circuit-switch-demo-battery-plate circuit-switch-demo-battery-plate--short"
            x1={54}
            y1={PLATE_SHORT_Y}
            x2={74}
            y2={PLATE_SHORT_Y}
          />
          <text
            className="circuit-switch-demo-pole circuit-switch-demo-pole--plus"
            x={30}
            y={PLATE_LONG_Y - 2}
            textAnchor="middle"
          >
            +
          </text>
          <text
            className="circuit-switch-demo-pole circuit-switch-demo-pole--minus"
            x={30}
            y={PLATE_SHORT_Y + 10}
            textAnchor="middle"
          >
            −
          </text>
          <text
            className="circuit-switch-demo-label"
            x={64}
            y={236}
            textAnchor="middle"
          >
            ZDROJ
          </text>

          {/* Zvýraznění oblasti spínače */}
          {visual.switchHighlight && (
            <rect
              className="circuit-switch-demo-highlight"
              x={158}
              y={30}
              width={84}
              height={64}
              rx={8}
            />
          )}

          {/* Spínač: dva kontakty + rameno (rozepnuté/sepnuté) */}
          <circle
            className="circuit-switch-demo-contact"
            cx={SWITCH_LEFT_CONTACT.x}
            cy={SWITCH_LEFT_CONTACT.y}
            r={4}
          />
          <circle
            className="circuit-switch-demo-contact"
            cx={SWITCH_RIGHT_CONTACT.x}
            cy={SWITCH_RIGHT_CONTACT.y}
            r={4}
          />
          <line
            className={armCls}
            x1={SWITCH_LEFT_CONTACT.x}
            y1={SWITCH_LEFT_CONTACT.y}
            x2={armX2}
            y2={armY2}
          />
          <text
            className="circuit-switch-demo-label"
            x={200}
            y={104}
            textAnchor="middle"
          >
            SPÍNAČ
          </text>
          {visual.gapEmphasis && (
            <text
              className="circuit-switch-demo-gap-label"
              x={200}
              y={26}
              textAnchor="middle"
            >
              rozpojeno
            </text>
          )}

          {/* Žárovka: kruh s křížem (značka svítidla) */}
          <circle
            className={bulbCls}
            cx={BULB_CENTER.x}
            cy={BULB_CENTER.y}
            r={BULB_RADIUS}
          />
          <line
            className="circuit-switch-demo-bulb-cross"
            x1={BULB_CENTER.x - 17}
            y1={BULB_CENTER.y - 17}
            x2={BULB_CENTER.x + 17}
            y2={BULB_CENTER.y + 17}
          />
          <line
            className="circuit-switch-demo-bulb-cross"
            x1={BULB_CENTER.x - 17}
            y1={BULB_CENTER.y + 17}
            x2={BULB_CENTER.x + 17}
            y2={BULB_CENTER.y - 17}
          />
          {visual.bulbOn && (
            <g className="circuit-switch-demo-bulb-rays">
              {[
                [BULB_CENTER.x + 30, BULB_CENTER.y - 30, BULB_CENTER.x + 40, BULB_CENTER.y - 40],
                [BULB_CENTER.x + 34, BULB_CENTER.y, BULB_CENTER.x + 46, BULB_CENTER.y],
                [BULB_CENTER.x + 30, BULB_CENTER.y + 30, BULB_CENTER.x + 40, BULB_CENTER.y + 40],
              ].map(([x1, y1, x2, y2]) => (
                <line key={`${x1}-${y1}`} x1={x1} y1={y1} x2={x2} y2={y2} />
              ))}
            </g>
          )}
          {/* Popisky žárovky jsou vlevo od symbolu — svislý vodič vede po
              x = 344, takže pod symbolem by text ležel na vodiči. */}
          <text
            className="circuit-switch-demo-label"
            x={BULB_CENTER.x - 32}
            y={BULB_CENTER.y - 8}
            textAnchor="end"
          >
            ŽÁROVKA
          </text>
          <text
            className="circuit-switch-demo-label circuit-switch-demo-label--state"
            x={BULB_CENTER.x - 32}
            y={BULB_CENTER.y + 16}
            textAnchor="end"
          >
            {visual.bulbState}
          </text>

          {/* Návratová cesta – popisek */}
          <text
            className="circuit-switch-demo-label"
            x={200}
            y={RETURN_Y + 22}
            textAnchor="middle"
          >
            návratová cesta k −
          </text>

          {/* Tok proudu: jediný spojitý overlay po celé vnější cestě */}
          {showFlowOverlay && (
            <path
              className="circuit-switch-demo-flow"
              fill="none"
              d={FLOW_PATH}
            />
          )}

          {/* Směrové šipky konvenčního proudu (staticky, closed krok 3–4) */}
          {visual.showCurrentArrows && (
            <g className="circuit-switch-demo-arrow">
              {/* horní větev: doprava */}
              <polygon points="132,64 132,76 146,70" />
              {/* pravá strana: dolů */}
              <polygon points="338,92 350,92 344,104" />
              {/* spodní návrat: doleva */}
              <polygon points="212,204 212,216 198,210" />
            </g>
          )}
        </svg>
      </div>

      <ul className="animated-demo__state" aria-label="Stav obvodu textem">
        <li>
          Aktivní situace: <strong>{scenarioLabel}</strong>
        </li>
        <li>
          Spínač: <strong>{visual.switchState}</strong>
        </li>
        <li>
          Obvod: <strong>{visual.circuitState}</strong>
        </li>
        <li>
          Proudová cesta: <strong>{visual.pathState}</strong>
        </li>
        <li>
          Proud: <strong>{visual.currentState}</strong>
        </li>
        <li>
          Žárovka: <strong>{visual.bulbState}</strong>
        </li>
        <li>
          Zdroj energie: <strong>{visual.sourceState}</strong>
        </li>
        <li>
          Kladný pól: <strong>{visual.plusState}</strong>
        </li>
        <li>
          Záporný pól: <strong>{visual.minusState}</strong>
        </li>
        <li>
          Návratová cesta: <strong>{visual.returnState}</strong>
        </li>
        <li>
          Výsledek: <strong>{visual.scenarioResult}</strong>
        </li>
      </ul>

      {/* Popis kroku zůstává viditelný jako běžný text, ale už není druhý živý
          region — krok oznamuje jediný stavový řádek v ovládání. */}
      <div className="circuit-switch-demo__explain">
        <strong>{step.title}.</strong> {step.description}
      </div>
    </>
  );
}

interface CircuitSwitchDemoProps {
  demo: CircuitSwitchDemo;
  calmMode: boolean;
  onContinue: () => void;
}

export function CircuitSwitchDemoView({
  demo,
  calmMode,
  onContinue,
}: CircuitSwitchDemoProps) {
  const [activeScenarioId, setActiveScenarioId] = useState<ScenarioId>('open');
  const [completedScenarios, setCompletedScenarios] = useState<Set<ScenarioId>>(
    new Set(),
  );

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
          Projdi oba stavy spínače vlastním tempem ({completedScenarios.size} /{' '}
          {SCENARIO_META.length} hotovo).
        </p>
      )}

      {/* Statický pokyn (obsah se po načtení nemění) → běžný text, ne živý
          region, aby jediným měnícím se hlášením zůstal stav kroku. */}
      <p className="circuit-switch-demo-switch-hint">
        Přepnutím stavu spínače se jeho průchod vrátí na začátek — hotové stavy
        zůstávají hotové.
      </p>

      <div
        className="circuit-diagram__controls circuit-switch-demo-scenarios"
        role="group"
        aria-label="Výběr stavu spínače"
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

      {/* key: přepnutí scénáře bezpečně remountuje přehrávač — krok 0, žádný
          starý timeout ani visibility listener, žádný ghost krok. */}
      <CircuitScenarioPlayer
        key={activeScenarioId}
        scenarioId={activeScenarioId}
        scenarioLabel={activeMeta.label}
        calmMode={calmMode}
        onScenarioCompleted={handleScenarioCompleted}
      />

      <p className="circuit-switch-demo-progress">
        Dokončené stavy: {completedScenarios.size} ze {SCENARIO_META.length}.
      </p>
      <p className="circuit-switch-demo-note">{MODEL_NOTE}</p>
      <p className="circuit-switch-demo-note">{CONVENTIONAL_NOTE}</p>

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
