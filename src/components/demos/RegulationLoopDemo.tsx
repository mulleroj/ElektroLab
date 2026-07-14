import type { RegulationLoopDemoConfig } from '../../types';
import { AnimatedDemoControls } from '../animation/AnimatedDemoControls';
import { useAnimatedDemo } from '../animation/useAnimatedDemo';
import { useMotionPolicy } from '../animation/useMotionPolicy';

interface RegulationLoopDemoProps {
  demo: RegulationLoopDemoConfig;
  calmMode: boolean;
  onContinue: () => void;
}

interface LoopStep {
  title: string;
  description: string;
}

const TARGET_TEMP = 22;

// Názorná školní ukázka uzavřené regulační smyčky — nejde o přesný PID model,
// tepelnou setrvačnost ani návod k zapojení skutečného regulátoru.
const STEPS: LoopStep[] = [
  {
    title: 'Rovnovážný klidový stav',
    description: 'Místnost má požadovaných 22 °C. Topení je vypnuté.',
  },
  {
    title: 'Porucha: místnost se ochladí',
    description:
      'Místnost se ochladila na 18 °C, ale požadovaná teplota zůstává 22 °C.',
  },
  {
    title: 'Snímač změří teplotu',
    description:
      'Snímač změří skutečnou teplotu 18 °C a předá ji regulátoru.',
  },
  {
    title: 'Regulátor porovná hodnoty',
    description:
      'Regulátor porovná naměřených 18 °C s požadovanými 22 °C.',
  },
  {
    title: 'Akční člen zapne topení',
    description: 'Regulátor vydá pokyn a topení se zapne.',
  },
  {
    title: 'Teplota stoupá',
    description:
      'Topení ohřívá místnost. Skutečná teplota se přibližuje požadované hodnotě.',
  },
  {
    title: 'Dosažení cíle a pokračování smyčky',
    description:
      'Místnost znovu dosáhla 22 °C. Topení se vypne a snímač dál sleduje teplotu.',
  },
];

const LOOP_CLOSURE_NOTE =
  'Regulace nekončí jedním zásahem. Měření, porovnání a zásah se stále opakují.';

const SIMPLIFICATION_NOTE =
  'Názorný model zjednodušuje tepelnou setrvačnost, hysterezi a vlastnosti skutečného regulátoru.';

type SignalId =
  | 'setpoint-reg'
  | 'sensor-reg'
  | 'reg-heater'
  | 'heater-room'
  | 'room-sensor'
  | 'feedback-loop';

type BlockId = 'setpoint' | 'regulator' | 'sensor' | 'heater' | 'room';

interface LoopVisual {
  displayTemp: number;
  heatingOn: boolean;
  diff: number;
  activeBlocks: BlockId[];
  activeSignals: SignalId[];
  showCold: boolean;
  tempRising: boolean;
  loopClosed: boolean;
  sensorState: string;
  regulatorDecision: string;
  regulatorSublabel: string;
  regulatorCompare: string;
  loopState: string;
}

function tempBarPercent(temp: number): number {
  const clamped = Math.max(18, Math.min(22, temp));
  return ((clamped - 18) / (22 - 18)) * 100;
}

function formatRegulatorDiff(diff: number): string {
  return diff === 0 ? '0 °C' : `${Math.abs(diff)} °C`;
}

function deriveRegulatorDisplay(
  stepIndex: number,
  displayTemp: number,
  diff: number,
): { sublabel: string; compare: string } {
  if (stepIndex === 0) {
    return {
      sublabel: 'rovnováha',
      compare: `${TARGET_TEMP} °C ↔ ${TARGET_TEMP} °C`,
    };
  }
  if (stepIndex === 1) {
    return { sublabel: 'čeká', compare: 'Čeká na nové měření' };
  }
  if (stepIndex === 2) {
    return {
      sublabel: 'přijímá',
      compare: `Přijímá měření: ${displayTemp} °C`,
    };
  }
  const diffLabel = formatRegulatorDiff(diff);
  return {
    sublabel: stepIndex >= 6 ? 'sleduje' : 'porovnává',
    compare: `${displayTemp} °C ↔ ${TARGET_TEMP} °C (${diffLabel})`,
  };
}

function deriveVisual(stepIndex: number): LoopVisual {
  let displayTemp = TARGET_TEMP;
  let heatingOn = false;
  const activeBlocks: BlockId[] = [];
  const activeSignals: SignalId[] = [];
  let showCold = false;
  let tempRising = false;
  let loopClosed = false;

  if (stepIndex === 0) {
    activeBlocks.push('setpoint', 'room');
  } else if (stepIndex === 1) {
    displayTemp = 18;
    showCold = true;
    activeBlocks.push('room');
  } else if (stepIndex === 2) {
    displayTemp = 18;
    activeBlocks.push('sensor', 'room');
    activeSignals.push('room-sensor', 'sensor-reg');
  } else if (stepIndex === 3) {
    displayTemp = 18;
    activeBlocks.push('regulator', 'setpoint', 'sensor');
    activeSignals.push('setpoint-reg', 'sensor-reg');
  } else if (stepIndex === 4) {
    displayTemp = 18;
    heatingOn = true;
    activeBlocks.push('regulator', 'heater');
    activeSignals.push('reg-heater');
  } else if (stepIndex === 5) {
    displayTemp = 20;
    heatingOn = true;
    tempRising = true;
    activeBlocks.push('heater', 'room');
    activeSignals.push('heater-room', 'room-sensor');
  } else if (stepIndex >= 6) {
    displayTemp = TARGET_TEMP;
    loopClosed = true;
    activeBlocks.push('room', 'sensor', 'regulator');
    activeSignals.push('feedback-loop', 'room-sensor', 'sensor-reg');
  }

  const diff = TARGET_TEMP - displayTemp;

  let sensorState = 'Čeká na měření';
  if (stepIndex >= 2) {
    sensorState = `Hlásí ${displayTemp} °C`;
  }
  if (loopClosed) {
    sensorState = `Sleduje ${displayTemp} °C — smyčka pokračuje`;
  }

  let regulatorDecision = 'Topení není potřeba — teplota odpovídá.';
  if (stepIndex === 1) {
    regulatorDecision = 'Čeká na údaje ze snímače.';
  } else if (stepIndex === 2) {
    regulatorDecision = 'Přijímá naměřených 18 °C.';
  } else if (stepIndex === 3) {
    regulatorDecision = '18 °C je o 4 °C pod požadovanými 22 °C — zapne topení.';
  } else if (stepIndex === 4 || stepIndex === 5) {
    regulatorDecision = 'Topení zapnuto — místnost se ohřívá.';
  } else if (loopClosed) {
    regulatorDecision = '22 °C dosaženo — topení vypnuto, dál se sleduje.';
  }

  let loopState = 'Klidová rovnováha';
  if (stepIndex >= 1 && stepIndex <= 5) {
    loopState = 'Regulace reaguje na ochlazení';
  }
  if (loopClosed) {
    loopState = 'Uzavřená smyčka — měření pokračuje';
  }

  const { sublabel: regulatorSublabel, compare: regulatorCompare } =
    deriveRegulatorDisplay(stepIndex, displayTemp, diff);

  return {
    displayTemp,
    heatingOn,
    diff,
    activeBlocks,
    activeSignals,
    showCold,
    tempRising,
    loopClosed,
    sensorState,
    regulatorDecision,
    regulatorSublabel,
    regulatorCompare,
    loopState,
  };
}

function blockClass(id: BlockId, active: BlockId[]): string {
  return `regulation-loop-block regulation-loop-block--${id}${
    active.includes(id) ? ' regulation-loop-block--active' : ''
  }`;
}

function signalClass(id: SignalId, active: SignalId[], moving: boolean): string {
  const base = `regulation-loop-path regulation-loop-path--${id}`;
  const on = active.includes(id) ? ' regulation-loop-path--active' : '';
  const flow =
    active.includes(id) && moving ? ' regulation-loop-signal--flow' : '';
  return base + on + flow;
}

export function RegulationLoopDemoView({
  demo,
  calmMode,
  onContinue,
}: RegulationLoopDemoProps) {
  const motion = useMotionPolicy(calmMode);
  const playback = useAnimatedDemo({
    stepCount: STEPS.length,
    autoPlayAllowed: motion.allowAutoPlay,
  });
  const { status, stepIndex } = playback;
  const step = STEPS[stepIndex];
  // Souvislý pohyb jen při přehrávání nebo pauze (zmrazení). V completed zůstane
  // statický závěrečný snímek — aktivní bloky a cesty bez nekonečných animací.
  const continuousMotion =
    motion.allowContinuousMotion &&
    (status === 'playing' || status === 'paused');
  const visual = deriveVisual(stepIndex);
  const pausedMod = status === 'paused' ? ' regulation-loop-anim--paused' : '';

  const tempFillClass = `regulation-loop-temp-fill${
    visual.tempRising && continuousMotion ? ' regulation-loop-temp-fill--rising' : ''
  }`;
  const useRisingAnimation = visual.tempRising && continuousMotion;
  const tempFillStyle = useRisingAnimation
    ? undefined
    : {
        transform: `scaleY(${tempBarPercent(visual.displayTemp) / 100})`,
      };
  const heaterClass = `regulation-loop-heater-icon${
    visual.heatingOn ? ' regulation-loop-heater-icon--on' : ''
  }${visual.heatingOn && continuousMotion ? ' regulation-loop-heater-icon--glow' : ''}`;

  const diffLabel =
    visual.diff === 0
      ? '0 °C'
      : `${Math.abs(visual.diff)} °C ${visual.diff > 0 ? 'pod požadovanou hodnotou' : 'nad požadovanou hodnotou'}`;

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

      <div className={`animated-demo__stage regulation-loop-stage${pausedMod}`}>
        <svg
          className="regulation-loop-svg"
          viewBox="0 0 640 380"
          aria-hidden="true"
          focusable="false"
        >
          <defs>
            <marker
              id="regulation-loop-arrow"
              markerWidth="8"
              markerHeight="8"
              refX="6"
              refY="4"
              orient="auto"
            >
              <path d="M0,0 L8,4 L0,8 Z" className="regulation-loop-marker" />
            </marker>
          </defs>

          {/* Požadovaná hodnota → regulátor */}
          <line
            className={signalClass('setpoint-reg', visual.activeSignals, continuousMotion)}
            x1={168}
            y1={68}
            x2={248}
            y2={68}
            markerEnd="url(#regulation-loop-arrow)"
          />
          {/* Snímač → regulátor */}
          <line
            className={signalClass('sensor-reg', visual.activeSignals, continuousMotion)}
            x1={195}
            y1={228}
            x2={248}
            y2={108}
            markerEnd="url(#regulation-loop-arrow)"
          />
          {/* Regulátor → topení */}
          <line
            className={signalClass('reg-heater', visual.activeSignals, continuousMotion)}
            x1={392}
            y1={78}
            x2={488}
            y2={138}
            markerEnd="url(#regulation-loop-arrow)"
          />
          {/* Topení → místnost */}
          <line
            className={signalClass('heater-room', visual.activeSignals, continuousMotion)}
            x1={528}
            y1={198}
            x2={470}
            y2={268}
            markerEnd="url(#regulation-loop-arrow)"
          />
          {/* Místnost → snímač */}
          <line
            className={signalClass('room-sensor', visual.activeSignals, continuousMotion)}
            x1={360}
            y1={310}
            x2={195}
            y2={260}
            markerEnd="url(#regulation-loop-arrow)"
          />
          {/* Zvýraznění uzavřené smyčky (krok 6) */}
          <path
            className={signalClass('feedback-loop', visual.activeSignals, continuousMotion)}
            d="M 140 260 Q 80 200 140 120 Q 300 40 500 120 Q 560 220 470 300 Q 300 350 140 260"
            fill="none"
            markerEnd="url(#regulation-loop-arrow)"
          />

          <g className={blockClass('setpoint', visual.activeBlocks)}>
            <rect x={36} y={36} width={132} height={64} rx={8} />
            <text x={102} y={58} textAnchor="middle" className="regulation-loop-label">
              Požadovaná
            </text>
            <text x={102} y={78} textAnchor="middle" className="regulation-loop-value">
              {TARGET_TEMP} °C
            </text>
          </g>

          <g className={blockClass('regulator', visual.activeBlocks)}>
            <rect x={248} y={36} width={144} height={80} rx={8} />
            <text x={320} y={58} textAnchor="middle" className="regulation-loop-label">
              Regulátor
            </text>
            <text x={320} y={78} textAnchor="middle" className="regulation-loop-sublabel">
              {visual.regulatorSublabel}
            </text>
            <text x={320} y={98} textAnchor="middle" className="regulation-loop-compare">
              {visual.regulatorCompare}
            </text>
          </g>

          <g className={blockClass('heater', visual.activeBlocks)}>
            <rect x={488} y={120} width={120} height={78} rx={8} />
            <text x={548} y={142} textAnchor="middle" className="regulation-loop-label">
              Topení
            </text>
            <text x={548} y={168} textAnchor="middle" className={heaterClass}>
              {visual.heatingOn ? 'ZAPNUTO' : 'VYPNUTO'}
            </text>
          </g>

          <g className={blockClass('sensor', visual.activeBlocks)}>
            <rect x={84} y={228} width={112} height={64} rx={8} />
            <text x={140} y={250} textAnchor="middle" className="regulation-loop-label">
              Snímač
            </text>
            <text x={140} y={272} textAnchor="middle" className="regulation-loop-value">
              {stepIndex >= 2 ? `${visual.displayTemp} °C` : '—'}
            </text>
          </g>

          <g className={blockClass('room', visual.activeBlocks)}>
            <rect x={340} y={268} width={160} height={96} rx={8} />
            <text x={420} y={290} textAnchor="middle" className="regulation-loop-label">
              Místnost
            </text>
            <rect
              className="regulation-loop-temp-track"
              x={400}
              y={300}
              width={24}
              height={52}
              rx={4}
            />
            <rect
              className={tempFillClass}
              x={400}
              y={300}
              width={24}
              height={52}
              rx={4}
              style={tempFillStyle}
            />
            <text x={436} y={328} className="regulation-loop-value">
              {visual.displayTemp} °C
            </text>
            {visual.showCold && (
              <text x={420} y={352} textAnchor="middle" className="regulation-loop-cold">
                ❄ ochlazení
              </text>
            )}
          </g>
        </svg>
      </div>

      <ul className="animated-demo__state" aria-label="Stav regulační smyčky textem">
        <li>
          Požadovaná teplota: <strong>{TARGET_TEMP} °C</strong>
        </li>
        <li>
          Skutečná teplota: <strong>{visual.displayTemp} °C</strong>
        </li>
        <li>
          Rozdíl: <strong>{diffLabel}</strong>
        </li>
        <li>
          Snímač: <strong>{visual.sensorState}</strong>
        </li>
        <li>
          Regulátor: <strong>{visual.regulatorDecision}</strong>
        </li>
        <li>
          Topení: <strong>{visual.heatingOn ? 'ZAPNUTO' : 'VYPNUTO'}</strong>
        </li>
        <li>
          Smyčka: <strong>{visual.loopState}</strong>
        </li>
      </ul>

      <div className="logic-gate__explain">
        <strong>{step.title}.</strong> {step.description}
        {stepIndex >= 6 && (
          <>
            {' '}
            {LOOP_CLOSURE_NOTE}
          </>
        )}
      </div>

      <p className="regulation-loop-note">{SIMPLIFICATION_NOTE}</p>

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
