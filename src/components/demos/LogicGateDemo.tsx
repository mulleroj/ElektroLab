import { useCallback, useEffect, useRef, useState } from 'react';
import type { LogicGateDemoConfig } from '../../types';
import { AnimatedDemoControls } from '../animation/AnimatedDemoControls';
import { useAnimatedDemo } from '../animation/useAnimatedDemo';
import { useMotionPolicy } from '../animation/useMotionPolicy';

type Gate = 'AND' | 'OR' | 'NOT';
type Bit = 0 | 1;

const GATES: Gate[] = ['AND', 'OR', 'NOT'];

// Značky ČSN EN 60617 (IEC): obdélník se symbolem funkce; NOT má na výstupu
// negační kroužek. V jednom schématu se nemíchá jiná norma značení.
const GATE_SYMBOLS: Record<Gate, string> = {
  AND: '&',
  OR: '≥1',
  NOT: '1',
};

const GATE_RULES: Record<Gate, string> = {
  AND: 'Výstup je 1 pouze tehdy, když jsou oba vstupy 1.',
  OR: 'Výstup je 1, když je alespoň jeden vstup 1.',
  NOT: 'Výstup je opačný než vstup A.',
};

const MODEL_NOTE =
  'Animace znázorňuje logický stav signálu. Nezobrazuje skutečnou rychlost elektrického děje.';

function computeOutput(gate: Gate, a: Bit, b: Bit): Bit {
  switch (gate) {
    case 'AND':
      return a === 1 && b === 1 ? 1 : 0;
    case 'OR':
      return a === 1 || b === 1 ? 1 : 0;
    case 'NOT':
      return a === 1 ? 0 : 1;
  }
}

/** Logický výraz, např. „1 AND 0 = 0“; před vyhodnocením s otazníkem. */
function expression(
  gate: Gate,
  a: Bit,
  b: Bit,
  showValues: boolean,
  showResult: boolean,
): string {
  const y = showResult ? String(computeOutput(gate, a, b)) : '?';
  if (gate === 'NOT') {
    return `NOT ${showValues ? a : 'A'} = ${y}`;
  }
  return `${showValues ? a : 'A'} ${gate} ${showValues ? b : 'B'} = ${y}`;
}

interface GateStep {
  title: string;
  description: string;
}

// Názorná školní ukázka průchodu logického signálu hradlem — nejde o
// simulaci skutečných rychlostí ani elektrických úrovní obvodu.
function getSteps(gate: Gate, a: Bit, b: Bit): GateStep[] {
  const y = computeOutput(gate, a, b);
  const expr = expression(gate, a, b, true, true);
  const anyActive = gate === 'NOT' ? a === 1 : a === 1 || b === 1;
  const inputsText =
    gate === 'NOT'
      ? `Vstup A má hodnotu ${a}.`
      : `Vstup A má hodnotu ${a}, vstup B má hodnotu ${b}.`;

  return [
    {
      title: 'Nastavení',
      description: `Hradlo ${gate} je připravené a zatím nic nevyhodnotilo. ${
        gate === 'NOT'
          ? 'NOT má jediný vstup A.'
          : 'Vstupy A a B můžeš přepínat mezi 0 a 1.'
      } Spusť průchod signálu, nebo krokuj tlačítkem Další krok.`,
    },
    {
      title: 'Vstupy',
      description: `${inputsText} Logická 1 znamená aktivní signál, logická 0 znamená, že signál není — nula se nikam „nehýbe“.`,
    },
    {
      title: 'Přenos k hradlu',
      description: anyActive
        ? 'Aktivní signál (logická 1) putuje svým vstupním vodičem k hradlu. Vodič s hodnotou 0 zůstává v klidu — žádný signál po něm neputuje.'
        : 'Žádný vstup nemá hodnotu 1, takže k hradlu po vodičích žádný signál neputuje. Hradlo přesto vstupy vyhodnotí.',
    },
    {
      title: 'Vyhodnocení',
      description: `Hradlo použije své pravidlo: ${GATE_RULES[gate]} Výsledek: ${expr}.`,
    },
    {
      title: 'Výsledek',
      description:
        y === 1
          ? `Y = 1 — na výstupu je aktivní signál a LED svítí. ${GATE_RULES[gate]}`
          : `Y = 0 — na výstupu žádný signál není a LED nesvítí. ${GATE_RULES[gate]}`,
    },
  ];
}

// Geometrie schématu (viewBox 0 0 640 300)
const GATE_LEFT = 270;
const GATE_RIGHT = 380;
const WIRE_A_Y = 107;
const WIRE_B_Y = 197;
const WIRE_NOT_Y = 150;
const OUT_Y = 150;
const LED_X = 528;
// Poloměr LED; konec výstupního vodiče se odvozuje z této geometrie, aby se
// vodič fyzicky dotýkal obrysu LED (ne světelných paprsků) pro Y=0 i Y=1.
const LED_RADIUS = 24;
const LED_RAYS = [
  [528, 114, 528, 100],
  [528, 186, 528, 200],
  [496, 118, 486, 108],
  [560, 118, 570, 108],
  [496, 182, 486, 192],
  [560, 182, 570, 192],
];

interface GatePlayerProps {
  gate: Gate;
  a: Bit;
  b: Bit;
  calmMode: boolean;
  onGateCompleted: (gate: Gate) => void;
}

function LogicGatePlayer({
  gate,
  a,
  b,
  calmMode,
  onGateCompleted,
}: GatePlayerProps) {
  const motion = useMotionPolicy(calmMode);
  const steps = getSteps(gate, a, b);
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
      onGateCompleted(gate);
    }
  }, [hasCompletedOnce, gate, onGateCompleted]);

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
  const pausedMod =
    status === 'paused' && showMotion ? ' logic-gate-demo-anim--paused' : '';

  const y = computeOutput(gate, a, b);
  const isNot = gate === 'NOT';

  // Vizuální příznaky odvozené čistě z pedagogického kroku.
  const inputsShown = stepIndex >= 1;
  const transfer = stepIndex >= 2;
  const evaluated = stepIndex >= 3;
  const resultShown = stepIndex >= 4;

  const padClass = (value: Bit) =>
    `logic-gate-demo-pad${
      inputsShown && value === 1 ? ' logic-gate-demo-pad--one' : ''
    }`;
  // Logická 0 = souvislý neutrální vodič bez pohybu; flow má jen signál 1.
  // Vstupní flow patří výhradně kroku „Přenos k hradlu“ (stepIndex === 2);
  // ve vyhodnocení a výsledku už žádný vstupní pohyb neběží.
  const inputWireClass = (value: Bit) =>
    `logic-gate-demo-wire${
      transfer && value === 1 ? ' logic-gate-demo-wire--on' : ''
    }${
      stepIndex === 2 && value === 1 && showMotion
        ? ' logic-gate-demo-wire--flow'
        : ''
    }`;
  // Výstupní vodič: aktivní (statické zvýraznění) od vyhodnocení dál pro Y=1;
  // směrový tok gate → LED běží jen ve vyhodnocení (stepIndex === 3) a jen při
  // autoplay. V kroku Výsledek (completed) už žádný pohyb není.
  const outputFlow = stepIndex === 3 && y === 1 && showMotion;
  const outputWireClass = `logic-gate-demo-wire${
    evaluated && y === 1 ? ' logic-gate-demo-wire--on' : ''
  }${outputFlow ? ' logic-gate-demo-wire--flow-out' : ''}`;
  const bodyClass = `logic-gate-demo-body${
    evaluated ? ' logic-gate-demo-body--active' : ''
  }`;
  const ledOn = resultShown && y === 1;

  const exprText = expression(gate, a, b, inputsShown, evaluated);
  const outWireStartX = isNot ? GATE_RIGHT + 16 : GATE_RIGHT;

  // Jediný živý region (stav v AnimatedDemoControls) nese i důležitý výsledek:
  // u vyhodnocení výraz, u výsledku hodnotu Y a stav LED. Lokální popis kroku
  // níže už není live region, takže se čtečce nic neduplikuje.
  let liveStepTitle = step.title;
  if (stepIndex === 3) {
    liveStepTitle = `Vyhodnocení: ${expression(gate, a, b, true, true)}`;
  } else if (stepIndex === 4) {
    liveStepTitle = `Výsledek: Y = ${y}, LED ${y === 1 ? 'svítí' : 'nesvítí'}`;
  }

  return (
    <>
      {!motion.allowAutoPlay && (
        // Statický pokyn (po načtení se nemění) → není live/status region,
        // aby nepřidával další oznámení ke stavu kroku v ovládání.
        <p className="calm-step-hint">
          Automatické přehrávání je vypnuté — průchod signálu procházej
          vlastním tempem tlačítkem „Další krok“.
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

      {/* Schéma je názorná grafika — úplný stav hradla je vždy popsán textem
          ve výpisu stavu a v popisu kroku níže. */}
      <div
        className={`animated-demo__stage${pausedMod}`}
        aria-hidden="true"
      >
        <svg
          className="logic-gate-demo-svg"
          viewBox="0 0 640 300"
          focusable="false"
        >
          <text
            className="logic-gate-demo-expression"
            x={320}
            y={34}
            textAnchor="middle"
          >
            {exprText}
          </text>

          {/* Vstupní hodnoty */}
          {isNot ? (
            <>
              <rect
                className={padClass(a)}
                x={28}
                y={WIRE_NOT_Y - 22}
                width={68}
                height={44}
                rx={8}
              />
              <text
                className="logic-gate-demo-pad-text"
                x={62}
                y={WIRE_NOT_Y + 6}
                textAnchor="middle"
              >
                A = {a}
              </text>
              <path
                className={inputWireClass(a)}
                d={`M 96 ${WIRE_NOT_Y} H ${GATE_LEFT}`}
              />
            </>
          ) : (
            <>
              <rect
                className={padClass(a)}
                x={28}
                y={WIRE_A_Y - 22}
                width={68}
                height={44}
                rx={8}
              />
              <text
                className="logic-gate-demo-pad-text"
                x={62}
                y={WIRE_A_Y + 6}
                textAnchor="middle"
              >
                A = {a}
              </text>
              <path
                className={inputWireClass(a)}
                d={`M 96 ${WIRE_A_Y} H ${GATE_LEFT}`}
              />
              <rect
                className={padClass(b)}
                x={28}
                y={WIRE_B_Y - 22}
                width={68}
                height={44}
                rx={8}
              />
              <text
                className="logic-gate-demo-pad-text"
                x={62}
                y={WIRE_B_Y + 6}
                textAnchor="middle"
              >
                B = {b}
              </text>
              <path
                className={inputWireClass(b)}
                d={`M 96 ${WIRE_B_Y} H ${GATE_LEFT}`}
              />
            </>
          )}

          {/* Tělo hradla (IEC obdélník se symbolem funkce) */}
          <rect
            className={bodyClass}
            x={GATE_LEFT}
            y={75}
            width={GATE_RIGHT - GATE_LEFT}
            height={150}
            rx={4}
          />
          <text
            className="logic-gate-demo-symbol"
            x={(GATE_LEFT + GATE_RIGHT) / 2}
            y={162}
            textAnchor="middle"
          >
            {GATE_SYMBOLS[gate]}
          </text>
          <text
            className="logic-gate-demo-label logic-gate-demo-label--state"
            x={(GATE_LEFT + GATE_RIGHT) / 2}
            y={250}
            textAnchor="middle"
          >
            hradlo {gate}
          </text>

          {/* Negační kroužek NOT na výstupu */}
          {isNot && (
            <circle
              className={`logic-gate-demo-bubble${
                evaluated ? ' logic-gate-demo-bubble--active' : ''
              }`}
              cx={GATE_RIGHT + 8}
              cy={OUT_Y}
              r={8}
            />
          )}

          {/* Výstup a LED */}
          <path
            className={outputWireClass}
            d={`M ${outWireStartX} ${OUT_Y} H ${LED_X - LED_RADIUS}`}
          />
          <text
            className="logic-gate-demo-label"
            x={445}
            y={OUT_Y - 12}
            textAnchor="middle"
          >
            výstup Y
          </text>
          <text
            className="logic-gate-demo-label logic-gate-demo-label--state"
            x={LED_X}
            y={92}
            textAnchor="middle"
          >
            Y = {evaluated ? y : '?'}
          </text>
          <circle
            className={`logic-gate-demo-led${ledOn ? ' logic-gate-demo-led--on' : ''}`}
            cx={LED_X}
            cy={OUT_Y}
            r={LED_RADIUS}
          />
          {ledOn && (
            <g className="logic-gate-demo-led-rays">
              {LED_RAYS.map(([x1, y1, x2, y2]) => (
                <line key={`${x1}-${y1}`} x1={x1} y1={y1} x2={x2} y2={y2} />
              ))}
            </g>
          )}
          <text
            className="logic-gate-demo-label logic-gate-demo-label--state"
            x={LED_X}
            y={224}
            textAnchor="middle"
          >
            {resultShown ? (ledOn ? 'LED svítí' : 'LED nesvítí') : 'LED čeká'}
          </text>
        </svg>
      </div>

      <ul className="animated-demo__state" aria-label="Stav hradla textem">
        <li>
          Hradlo: <strong>{gate}</strong> — {GATE_RULES[gate]}
        </li>
        <li>
          Vstup A: <strong>{a}</strong>
        </li>
        <li>
          Vstup B: <strong>{isNot ? 'nepoužívá se' : b}</strong>
        </li>
        <li>
          Výraz: <strong>{exprText}</strong>
        </li>
        <li>
          Výstup:{' '}
          <strong>
            {evaluated ? `Y = ${y}` : 'zatím nevyhodnocen'}
            {resultShown ? `, LED ${ledOn ? 'svítí' : 'nesvítí'}` : ''}
          </strong>
        </li>
      </ul>

      {/* Popis kroku zůstává viditelný a čitelný jako běžný text, ale už není
          druhý live region — krok oznamuje jediný stavový řádek v ovládání. */}
      <div className="logic-gate__explain">
        <strong>{step.title}.</strong> {step.description}
      </div>
    </>
  );
}

interface LogicGateDemoProps {
  demo: LogicGateDemoConfig;
  calmMode: boolean;
  onContinue: () => void;
}

export function LogicGateDemoView({
  demo,
  calmMode,
  onContinue,
}: LogicGateDemoProps) {
  const [gate, setGate] = useState<Gate>('AND');
  const [a, setA] = useState<Bit>(0);
  const [b, setB] = useState<Bit>(0);
  // Hotová hradla: hradlo se počítá až po dosažení výsledného kroku, ne po
  // pouhém kliknutí. Množina se nikdy nezmenšuje (Reset ani přepnutí
  // povolení neodebírá) a nikam se neukládá.
  const [doneGates, setDoneGates] = useState<Set<Gate>>(new Set());

  const handleGateCompleted = useCallback((g: Gate) => {
    setDoneGates((prev) => {
      if (prev.has(g)) {
        return prev;
      }
      return new Set(prev).add(g);
    });
  }, []);

  const allDone = doneGates.size === GATES.length;

  return (
    <section className="interactive-demo" aria-labelledby="demo-title">
      <h2 id="demo-title">Interaktivní ukázka</h2>
      <h3>{demo.title}</h3>
      <p>{demo.description}</p>

      {calmMode && (
        <p className="calm-step-hint" role="status">
          Projdi všechna tři hradla vlastním tempem ({doneGates.size} /{' '}
          {GATES.length} hotovo).
        </p>
      )}

      {/* Statický pokyn (obsah se po načtení nemění) → běžný text, ne live
          region, aby jediným měnícím se hlášením zůstal stav kroku. */}
      <p className="logic-gate-demo-switch-hint">
        Přepnutím hradla nebo změnou vstupu se průchod vrátí na začátek —
        hotová hradla zůstávají hotová.
      </p>

      <div className="logic-gate" role="group" aria-label="Výběr hradla">
        {GATES.map((g) => (
          <button
            key={g}
            type="button"
            className={`btn btn--secondary${gate === g ? ' btn--active' : ''}`}
            onClick={() => setGate(g)}
            aria-pressed={gate === g}
          >
            {doneGates.has(g) ? '✔ ' : ''}
            {g}
          </button>
        ))}
      </div>

      <div
        className="logic-gate__inputs logic-gate-demo-inputs"
        role="group"
        aria-label="Nastavení vstupů hradla"
      >
        <button
          type="button"
          className={`logic-io logic-gate-demo-input${a === 1 ? ' logic-io--one' : ''}`}
          onClick={() => setA(a === 1 ? 0 : 1)}
          aria-pressed={a === 1}
        >
          Vstup A: <strong>{a}</strong>
        </button>
        {gate !== 'NOT' && (
          <button
            type="button"
            className={`logic-io logic-gate-demo-input${b === 1 ? ' logic-io--one' : ''}`}
            onClick={() => setB(b === 1 ? 0 : 1)}
            aria-pressed={b === 1}
          >
            Vstup B: <strong>{b}</strong>
          </button>
        )}
      </div>

      {/* key: změna hradla nebo vstupu bezpečně remountuje přehrávač —
          krok 0, žádný starý timeout, žádný výsledek předchozí kombinace. */}
      <LogicGatePlayer
        key={`${gate}-${a}-${b}`}
        gate={gate}
        a={a}
        b={b}
        calmMode={calmMode}
        onGateCompleted={handleGateCompleted}
      />

      <p className="logic-gate-demo-progress">
        Dokončená hradla: {doneGates.size} ze {GATES.length}.
      </p>
      <p className="logic-gate-demo-note">{MODEL_NOTE}</p>

      <button
        type="button"
        className="btn btn--primary"
        onClick={onContinue}
        disabled={!allDone}
      >
        Rozumím, pokračovat na úkol
      </button>
    </section>
  );
}
