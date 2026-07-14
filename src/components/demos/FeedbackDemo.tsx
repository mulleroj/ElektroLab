import type { FeedbackDemoConfig } from '../../types';
import { AnimatedDemoControls } from '../animation/AnimatedDemoControls';
import { useAnimatedDemo } from '../animation/useAnimatedDemo';
import { useMotionPolicy } from '../animation/useMotionPolicy';

interface FeedbackDemoProps {
  demo: FeedbackDemoConfig;
  calmMode: boolean;
  onContinue: () => void;
}

interface FeedbackStep {
  title: string;
  description: string;
}

const TARGET_LEVEL = 70;

// Názorná školní ukázka uzavřené zpětnovazební smyčky — nejde o přesný hydraulický
// model ani návod k zapojení skutečného čerpadla a snímače.
const STEPS: FeedbackStep[] = [
  {
    title: 'Rovnovážný stav',
    description:
      'Nádrž má požadovanou hladinu 70 %. Čerpadlo je vypnuté.',
  },
  {
    title: 'Odběr vody',
    description:
      'Odběr vody snížil hladinu na 30 %. Požadovaná hladina zůstává 70 %.',
  },
  {
    title: 'Snímač změří hladinu',
    description:
      'Snímač změří hladinu 30 % a předá údaj regulátoru.',
  },
  {
    title: 'Regulátor porovná hodnoty',
    description:
      'Regulátor porovná naměřených 30 % s požadovanými 70 %.',
  },
  {
    title: 'Čerpadlo se zapne',
    description:
      'Regulátor vydá pokyn a čerpadlo začne doplňovat vodu.',
  },
  {
    title: 'Hladina stoupá',
    description:
      'Čerpadlo doplňuje vodu. Hladina se přibližuje požadované hodnotě.',
  },
  {
    title: 'Cíl dosažen',
    description:
      'Hladina znovu dosáhla 70 %. Čerpadlo se vypne a snímač dál hladinu sleduje.',
  },
];

const LOOP_CLOSURE_NOTE =
  'Zpětná vazba informuje regulátor o skutečném výsledku zásahu. Měření, porovnání a řízení se stále opakují.';

const SIMPLIFICATION_NOTE =
  'Názorný model zjednodušuje rychlost proudění, zpoždění snímače a skutečnou logiku řízení čerpadla.';

type SignalId =
  | 'setpoint-reg'
  | 'sensor-reg'
  | 'reg-pump'
  | 'pump-tank'
  | 'tank-sensor'
  | 'feedback-loop'
  | 'withdrawal';

type BlockId = 'setpoint' | 'regulator' | 'sensor' | 'pump' | 'tank';

interface FeedbackVisual {
  displayLevel: number;
  pumpOn: boolean;
  diff: number;
  activeBlocks: BlockId[];
  activeSignals: SignalId[];
  showWithdrawal: boolean;
  levelRising: boolean;
  loopClosed: boolean;
  sensorState: string;
  regulatorReceived: string;
  regulatorDecision: string;
  regulatorSublabel: string;
  regulatorCompare: string;
  feedbackState: string;
}

function levelBarScale(level: number): number {
  return Math.max(0, Math.min(100, level)) / 100;
}

function formatLevelDiff(diff: number): string {
  return diff === 0 ? '0 procentních bodů' : `${Math.abs(diff)} procentních bodů`;
}

function deriveRegulatorDisplay(
  stepIndex: number,
  displayLevel: number,
  diff: number,
): { sublabel: string; compare: string; received: string } {
  if (stepIndex === 0) {
    return {
      sublabel: 'rovnováha',
      compare: `${TARGET_LEVEL} % ↔ ${TARGET_LEVEL} %`,
      received: `${TARGET_LEVEL} %`,
    };
  }
  if (stepIndex === 1) {
    return {
      sublabel: 'čeká',
      compare: 'Čeká na nové měření',
      received: '—',
    };
  }
  if (stepIndex === 2) {
    return {
      sublabel: 'přijímá',
      compare: `Přijímá měření: ${displayLevel} %`,
      received: `${displayLevel} %`,
    };
  }
  const diffLabel = formatLevelDiff(diff);
  return {
    sublabel: stepIndex >= 6 ? 'sleduje' : 'porovnává',
    compare: `${displayLevel} % ↔ ${TARGET_LEVEL} % (${diffLabel})`,
    received: `${displayLevel} %`,
  };
}

function deriveVisual(stepIndex: number): FeedbackVisual {
  let displayLevel = TARGET_LEVEL;
  let pumpOn = false;
  const activeBlocks: BlockId[] = [];
  const activeSignals: SignalId[] = [];
  let showWithdrawal = false;
  let levelRising = false;
  let loopClosed = false;

  if (stepIndex === 0) {
    activeBlocks.push('setpoint', 'tank');
  } else if (stepIndex === 1) {
    displayLevel = 30;
    showWithdrawal = true;
    activeBlocks.push('tank');
    activeSignals.push('withdrawal');
  } else if (stepIndex === 2) {
    displayLevel = 30;
    activeBlocks.push('sensor', 'tank');
    activeSignals.push('tank-sensor', 'sensor-reg');
  } else if (stepIndex === 3) {
    displayLevel = 30;
    activeBlocks.push('regulator', 'setpoint', 'sensor');
    activeSignals.push('setpoint-reg', 'sensor-reg');
  } else if (stepIndex === 4) {
    displayLevel = 30;
    pumpOn = true;
    activeBlocks.push('regulator', 'pump');
    activeSignals.push('reg-pump');
  } else if (stepIndex === 5) {
    displayLevel = 50;
    pumpOn = true;
    levelRising = true;
    activeBlocks.push('pump', 'tank');
    activeSignals.push('pump-tank', 'tank-sensor', 'sensor-reg');
  } else if (stepIndex >= 6) {
    displayLevel = TARGET_LEVEL;
    loopClosed = true;
    activeBlocks.push('tank', 'sensor', 'regulator');
    activeSignals.push('feedback-loop', 'tank-sensor', 'sensor-reg');
  }

  const diff = TARGET_LEVEL - displayLevel;

  let sensorState = 'Čeká na měření';
  if (stepIndex >= 2) {
    sensorState = `Hlásí ${displayLevel} %`;
  }
  if (loopClosed) {
    sensorState = `Sleduje ${displayLevel} % — smyčka pokračuje`;
  }

  let regulatorDecision = 'Čerpadlo není potřeba — hladina odpovídá.';
  if (stepIndex === 1) {
    regulatorDecision = 'Čeká na údaje ze snímače.';
  } else if (stepIndex === 2) {
    regulatorDecision = 'Přijímá naměřených 30 %.';
  } else if (stepIndex === 3) {
    regulatorDecision =
      '30 % je o 40 procentních bodů pod požadovanými 70 % — zapne čerpadlo.';
  } else if (stepIndex === 4 || stepIndex === 5) {
    regulatorDecision = 'Čerpadlo zapnuto — nádrž se doplňuje.';
  } else if (loopClosed) {
    regulatorDecision = '70 % dosaženo — čerpadlo vypnuto, dál se sleduje.';
  }

  let feedbackState = 'Klidová rovnováha';
  if (stepIndex >= 1 && stepIndex <= 5) {
    feedbackState = 'Zpětná vazba informuje o poklesu a doplňování';
  }
  if (loopClosed) {
    feedbackState = 'Uzavřená smyčka — měření pokračuje';
  }

  const { sublabel: regulatorSublabel, compare: regulatorCompare, received: regulatorReceived } =
    deriveRegulatorDisplay(stepIndex, displayLevel, diff);

  return {
    displayLevel,
    pumpOn,
    diff,
    activeBlocks,
    activeSignals,
    showWithdrawal,
    levelRising,
    loopClosed,
    sensorState,
    regulatorReceived,
    regulatorDecision,
    regulatorSublabel,
    regulatorCompare,
    feedbackState,
  };
}

function blockClass(id: BlockId, active: BlockId[]): string {
  return `feedback-loop-block feedback-loop-block--${id}${
    active.includes(id) ? ' feedback-loop-block--active' : ''
  }`;
}

function signalClass(id: SignalId, active: SignalId[], moving: boolean): string {
  const base = `feedback-loop-path feedback-loop-path--${id}`;
  const on = active.includes(id) ? ' feedback-loop-path--active' : '';
  const flow =
    active.includes(id) && moving ? ' feedback-loop-signal--flow' : '';
  return base + on + flow;
}

export function FeedbackDemoView({
  demo,
  calmMode,
  onContinue,
}: FeedbackDemoProps) {
  const motion = useMotionPolicy(calmMode);
  const playback = useAnimatedDemo({
    stepCount: STEPS.length,
    autoPlayAllowed: motion.allowAutoPlay,
  });
  const { status, stepIndex } = playback;
  const step = STEPS[stepIndex];
  const continuousMotion =
    motion.allowContinuousMotion &&
    (status === 'playing' || status === 'paused');
  const visual = deriveVisual(stepIndex);
  const pausedMod = status === 'paused' ? ' feedback-loop-anim--paused' : '';

  const levelFillClass = `feedback-loop-level-fill${
    visual.levelRising && continuousMotion ? ' feedback-loop-level-fill--rising' : ''
  }`;
  const useRisingAnimation = visual.levelRising && continuousMotion;
  const levelFillStyle = useRisingAnimation
    ? undefined
    : {
        transform: `scaleY(${levelBarScale(visual.displayLevel)})`,
      };
  const pumpClass = `feedback-loop-pump-icon${
    visual.pumpOn ? ' feedback-loop-pump-icon--on' : ''
  }${visual.pumpOn && continuousMotion ? ' feedback-loop-pump-icon--glow' : ''}`;

  const diffLabel =
    visual.diff === 0
      ? '0 procentních bodů'
      : `${Math.abs(visual.diff)} procentních bodů pod požadovanou hodnotou`;

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

      <div className={`animated-demo__stage feedback-loop-stage${pausedMod}`}>
        <svg
          className="feedback-loop-svg"
          viewBox="0 0 640 380"
          aria-hidden="true"
          focusable="false"
        >
          <defs>
            <marker
              id="feedback-loop-arrow"
              markerWidth="8"
              markerHeight="8"
              refX="6"
              refY="4"
              orient="auto"
            >
              <path d="M0,0 L8,4 L0,8 Z" className="feedback-loop-marker" />
            </marker>
          </defs>

          <line
            className={signalClass('setpoint-reg', visual.activeSignals, continuousMotion)}
            x1={168}
            y1={68}
            x2={248}
            y2={68}
            markerEnd="url(#feedback-loop-arrow)"
          />
          <line
            className={signalClass('sensor-reg', visual.activeSignals, continuousMotion)}
            x1={195}
            y1={228}
            x2={248}
            y2={108}
            markerEnd="url(#feedback-loop-arrow)"
          />
          <line
            className={signalClass('reg-pump', visual.activeSignals, continuousMotion)}
            x1={392}
            y1={78}
            x2={488}
            y2={138}
            markerEnd="url(#feedback-loop-arrow)"
          />
          <line
            className={signalClass('pump-tank', visual.activeSignals, continuousMotion)}
            x1={528}
            y1={198}
            x2={470}
            y2={268}
            markerEnd="url(#feedback-loop-arrow)"
          />
          <line
            className={signalClass('tank-sensor', visual.activeSignals, continuousMotion)}
            x1={360}
            y1={310}
            x2={195}
            y2={260}
            markerEnd="url(#feedback-loop-arrow)"
          />
          <path
            className={signalClass('feedback-loop', visual.activeSignals, continuousMotion)}
            d="M 140 260 Q 80 200 140 120 Q 300 40 500 120 Q 560 220 470 300 Q 300 350 140 260"
            fill="none"
            markerEnd="url(#feedback-loop-arrow)"
          />
          {visual.showWithdrawal && (
            <g className={signalClass('withdrawal', visual.activeSignals, continuousMotion)}>
              <line x1={500} y1={300} x2={560} y2={300} markerEnd="url(#feedback-loop-arrow)" />
              <text x={530} y={288} textAnchor="middle" className="feedback-loop-withdrawal-label">
                Odběr
              </text>
            </g>
          )}

          <g className={blockClass('setpoint', visual.activeBlocks)}>
            <rect x={36} y={36} width={132} height={64} rx={8} />
            <text x={102} y={58} textAnchor="middle" className="feedback-loop-label">
              Požadovaná
            </text>
            <text x={102} y={78} textAnchor="middle" className="feedback-loop-value">
              {TARGET_LEVEL} %
            </text>
          </g>

          <g className={blockClass('regulator', visual.activeBlocks)}>
            <rect x={248} y={36} width={144} height={80} rx={8} />
            <text x={320} y={58} textAnchor="middle" className="feedback-loop-label">
              Regulátor
            </text>
            <text x={320} y={78} textAnchor="middle" className="feedback-loop-sublabel">
              {visual.regulatorSublabel}
            </text>
            <text x={320} y={98} textAnchor="middle" className="feedback-loop-compare">
              {visual.regulatorCompare}
            </text>
          </g>

          <g className={blockClass('pump', visual.activeBlocks)}>
            <rect x={488} y={120} width={120} height={78} rx={8} />
            <text x={548} y={142} textAnchor="middle" className="feedback-loop-label">
              Čerpadlo
            </text>
            <text x={548} y={168} textAnchor="middle" className={pumpClass}>
              {visual.pumpOn ? 'ZAPNUTO' : 'VYPNUTO'}
            </text>
          </g>

          <g className={blockClass('sensor', visual.activeBlocks)}>
            <rect x={84} y={228} width={112} height={64} rx={8} />
            <text x={140} y={250} textAnchor="middle" className="feedback-loop-label">
              Snímač
            </text>
            <text x={140} y={272} textAnchor="middle" className="feedback-loop-value">
              {stepIndex >= 2 ? `${visual.displayLevel} %` : '—'}
            </text>
          </g>

          <g className={blockClass('tank', visual.activeBlocks)}>
            <rect x={340} y={248} width={160} height={116} rx={8} />
            <text x={420} y={270} textAnchor="middle" className="feedback-loop-label">
              Nádrž
            </text>
            <rect
              className="feedback-loop-level-track"
              x={400}
              y={280}
              width={40}
              height={72}
              rx={4}
            />
            <rect
              className={levelFillClass}
              x={400}
              y={280}
              width={40}
              height={72}
              rx={4}
              style={levelFillStyle}
            />
            <text x={452} y={320} className="feedback-loop-value">
              {visual.displayLevel} %
            </text>
          </g>
        </svg>
      </div>

      <ul className="animated-demo__state" aria-label="Stav zpětnovazební smyčky textem">
        <li>
          Požadovaná hladina: <strong>{TARGET_LEVEL} %</strong>
        </li>
        <li>
          Skutečná hladina: <strong>{visual.displayLevel} %</strong>
        </li>
        <li>
          Rozdíl: <strong>{diffLabel}</strong>
        </li>
        <li>
          Snímač: <strong>{visual.sensorState}</strong>
        </li>
        <li>
          Údaj u regulátoru: <strong>{visual.regulatorReceived}</strong>
        </li>
        <li>
          Regulátor: <strong>{visual.regulatorDecision}</strong>
        </li>
        <li>
          Čerpadlo: <strong>{visual.pumpOn ? 'ZAPNUTO' : 'VYPNUTO'}</strong>
        </li>
        <li>
          Zpětná vazba: <strong>{visual.feedbackState}</strong>
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

      <p className="feedback-loop-note">{SIMPLIFICATION_NOTE}</p>

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
