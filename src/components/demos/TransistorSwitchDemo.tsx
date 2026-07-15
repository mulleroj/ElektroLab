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
      'Malý řídicí proud báze teče cestou B–E ke společnému návratu. Tento proud LED nenapájí — jen řídí tranzistor.',
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

/** Exact topology join points (SVG user units). */
const TOPO = {
  sourcePlus: { x: 100, y: 52 },
  sourceMinus: { x: 100, y: 112 },
  rledLeft: { x: 118, y: 52 },
  rledRight: { x: 188, y: 52 },
  ledLeft: { x: 206, y: 52 },
  ledRight: { x: 268, y: 52 },
  cTip: { x: 448, y: 108 },
  baseMid: { x: 400, y: 168 },
  baseTop: { x: 400, y: 138 },
  baseBot: { x: 400, y: 198 },
  eTip: { x: 448, y: 248 },
  controlOut: { x: 100, y: 288 },
  rbLeft: { x: 118, y: 288 },
  rbRight: { x: 198, y: 288 },
  commonY: 310,
} as const;

interface TransistorVisual {
  controlSignal: string;
  modelType: string;
  baseTerminalState: string;
  collectorTerminalState: string;
  emitterTerminalState: string;
  transistorState: string;
  collectorBranchState: string;
  baseCurrent: string;
  loadCurrent: string;
  ledState: string;
  resistorBaseState: string;
  resistorLedState: string;
  energySourceState: string;
  commonReturnState: string;
  scenarioResult: string;
  ledOn: boolean;
  pathBlocked: boolean;
  highlightControl: boolean;
  highlightBaseResistor: boolean;
  highlightTransistor: boolean;
  highlightLed: boolean;
  highlightLoadPath: boolean;
  controlFlow: boolean;
  baseCurrentFlow: boolean;
  loadCurrentFlow: boolean;
  transistorPulse: boolean;
  ledReceiving: boolean;
}

function getSteps(scenarioId: ScenarioId): DemoStep[] {
  return STEPS_BY_SCENARIO[scenarioId];
}

function deriveVisual(scenarioId: ScenarioId, stepIndex: number): TransistorVisual {
  const shared = {
    modelType: 'NPN BJT',
    resistorBaseState: 'OMEZENÍ PROUDU BÁZE (bez hodnoty)',
    resistorLedState: 'OCHRANNÝ/OMEZOVACÍ PRVEK (bez hodnoty)',
    energySourceState: 'HLAVNÍ ZDROJ — dodává energii LED',
    commonReturnState: 'SPOLEČNÝ NÁVRAT u E a zdroje −',
    ledOn: false,
    pathBlocked: false,
    highlightControl: false,
    highlightBaseResistor: false,
    highlightTransistor: false,
    highlightLed: false,
    highlightLoadPath: false,
    controlFlow: false,
    baseCurrentFlow: false,
    loadCurrentFlow: false,
    transistorPulse: false,
    ledReceiving: false,
  };

  if (scenarioId === 'off') {
    // OFF: no motion flags in any step.
    if (stepIndex === 0) {
      return {
        ...shared,
        controlSignal: 'VYPNUTÝ',
        baseTerminalState: 'B — bez aktivního řízení',
        collectorTerminalState: 'C — připojen k LED větvi',
        emitterTerminalState: 'E — na společném návratu',
        transistorState: 'VYPNUTÝ (ROZEPNUTÝ)',
        collectorBranchState: 'C–E ROZEPNUTÁ',
        baseCurrent: 'NEAKTIVNÍ',
        loadCurrent: 'NEAKTIVNÍ',
        ledState: 'ZHASNUTÁ',
        highlightControl: true,
        highlightTransistor: true,
        highlightLed: true,
        scenarioResult: 'Přehled low-side zapojení NPN',
      };
    }
    if (stepIndex === 1) {
      return {
        ...shared,
        controlSignal: 'BEZ AKTIVNÍHO SIGNÁLU',
        baseTerminalState: 'B — bez aktivního řízení',
        collectorTerminalState: 'C — připojen k LED větvi',
        emitterTerminalState: 'E — na společném návratu',
        transistorState: 'VYPNUTÝ (ROZEPNUTÝ)',
        collectorBranchState: 'C–E ROZEPNUTÁ',
        baseCurrent: 'NEAKTIVNÍ',
        loadCurrent: 'NEAKTIVNÍ',
        ledState: 'ZHASNUTÁ',
        highlightControl: true,
        highlightBaseResistor: true,
        scenarioResult: 'Řídicí signál na bázi nepřichází',
      };
    }
    if (stepIndex === 2) {
      return {
        ...shared,
        controlSignal: 'VYPNUTÝ',
        baseTerminalState: 'B — bez aktivního řízení',
        collectorTerminalState: 'C — připojen k LED větvi',
        emitterTerminalState: 'E — na společném návratu',
        transistorState: 'VYPNUTÝ (ROZEPNUTÝ)',
        collectorBranchState: 'C–E ROZEPNUTÁ',
        baseCurrent: 'PROUD BÁZE NEAKTIVNÍ',
        loadCurrent: 'NEAKTIVNÍ',
        ledState: 'ZHASNUTÁ',
        highlightBaseResistor: true,
        highlightTransistor: true,
        scenarioResult: 'Proud báze v modelu neaktivní',
      };
    }
    if (stepIndex === 3) {
      return {
        ...shared,
        controlSignal: 'VYPNUTÝ',
        baseTerminalState: 'B — bez aktivního řízení',
        collectorTerminalState: 'C — připojen k LED větvi',
        emitterTerminalState: 'E — na společném návratu',
        transistorState: 'VYPNUTÝ (ROZEPNUTÝ)',
        collectorBranchState: 'C–E VĚTEV ROZEPNUTÁ',
        baseCurrent: 'NEAKTIVNÍ',
        loadCurrent: 'BĚŽNOU CESTOU NEPROCHÁZÍ',
        ledState: 'ZHASNUTÁ',
        pathBlocked: true,
        highlightTransistor: true,
        highlightLoadPath: true,
        highlightLed: true,
        scenarioResult: 'Hlavní větev C–E je v modelu rozepnutá',
      };
    }
    return {
      ...shared,
      controlSignal: 'VYPNUTÝ',
      baseTerminalState: 'B — bez aktivního řízení',
      collectorTerminalState: 'C — připojen k LED větvi',
      emitterTerminalState: 'E — na společném návratu',
      transistorState: 'VYPNUTÝ (ROZEPNUTÝ)',
      collectorBranchState: 'C–E ROZEPNUTÁ',
      baseCurrent: 'NEAKTIVNÍ',
      loadCurrent: 'BĚŽNOU CESTOU NEPROCHÁZÍ',
      ledState: 'NESVÍTÍ',
      pathBlocked: true,
      scenarioResult: 'Bez řídicího signálu LED zůstává zhasnutá',
    };
  }

  if (stepIndex === 0) {
    return {
      ...shared,
      controlSignal: 'PŘIPRAVENÝ K ZAPNUTÍ',
      baseTerminalState: 'B — čeká na řízení přes Rb',
      collectorTerminalState: 'C — připojen k LED větvi',
      emitterTerminalState: 'E — na společném návratu',
      transistorState: 'VYPNUTÝ (ROZEPNUTÝ)',
      collectorBranchState: 'C–E ROZEPNUTÁ',
      baseCurrent: 'NEAKTIVNÍ',
      loadCurrent: 'NEAKTIVNÍ',
      ledState: 'ZHASNUTÁ',
      highlightControl: true,
      highlightTransistor: true,
      highlightLed: true,
      scenarioResult: 'Připraveno k příchodu řídicího signálu',
    };
  }
  if (stepIndex === 1) {
    return {
      ...shared,
      controlSignal: 'ZAPNUTÝ',
      baseTerminalState: 'B — řízená přes Rb',
      collectorTerminalState: 'C — připojen k LED větvi',
      emitterTerminalState: 'E — na společném návratu',
      transistorState: 'VYPNUTÝ (ROZEPNUTÝ)',
      collectorBranchState: 'C–E ROZEPNUTÁ',
      baseCurrent: 'NEAKTIVNÍ',
      loadCurrent: 'NEAKTIVNÍ',
      ledState: 'ZHASNUTÁ',
      controlFlow: true,
      highlightControl: true,
      highlightBaseResistor: true,
      scenarioResult: 'Řídicí signál vede přes rezistor báze na B',
    };
  }
  if (stepIndex === 2) {
    return {
      ...shared,
      controlSignal: 'ZAPNUTÝ',
      baseTerminalState: 'B — řízená přes Rb',
      collectorTerminalState: 'C — připojen k LED větvi',
      emitterTerminalState: 'E — na společném návratu',
      transistorState: 'PŘIPRAVEN K SEPNUTÍ',
      collectorBranchState: 'C–E PŘIPRAVENÁ',
      baseCurrent: 'MALÝ PROUD BÁZE (ŘÍZENÍ)',
      loadCurrent: 'NEAKTIVNÍ',
      ledState: 'ZHASNUTÁ',
      baseCurrentFlow: true,
      highlightBaseResistor: true,
      highlightTransistor: true,
      scenarioResult: 'Malý proud báze řídí tranzistor, LED nenapájí',
    };
  }
  if (stepIndex === 3) {
    return {
      ...shared,
      controlSignal: 'ZAPNUTÝ',
      baseTerminalState: 'B — řízená přes Rb',
      collectorTerminalState: 'C — připojen k LED větvi',
      emitterTerminalState: 'E — na společném návratu',
      transistorState: 'SEPNUTÝ (VODÍ)',
      collectorBranchState: 'C–E VODÍ',
      baseCurrent: 'MALÝ PROUD BÁZE (ŘÍZENÍ)',
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
    ...shared,
    controlSignal: 'ZAPNUTÝ',
    baseTerminalState: 'B — řízená přes Rb',
    collectorTerminalState: 'C — připojen k LED větvi',
    emitterTerminalState: 'E — na společném návratu',
    transistorState: 'SEPNUTÝ (VODÍ)',
    collectorBranchState: 'C–E VODÍ',
    baseCurrent: 'MALÝ PROUD BÁZE (ŘÍZENÍ)',
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
  }`;

  const rbClass = `transistor-switch-demo-block transistor-switch-demo-rb${
    visual.highlightBaseResistor ? ' transistor-switch-demo-block--active' : ''
  }`;

  const transistorClass = `transistor-switch-demo-q${
    visual.highlightTransistor ? ' transistor-switch-demo-q--active' : ''
  }${
    visual.transistorPulse && showMotion
      ? ' transistor-switch-demo-q--pulse'
      : ''
  }${visual.pathBlocked ? ' transistor-switch-demo-q--open' : ''}${
    visual.transistorState.includes('SEPNUTÝ')
      ? ' transistor-switch-demo-q--on'
      : ''
  }`;

  const ledClass = `transistor-switch-demo-led${
    visual.highlightLed ? ' transistor-switch-demo-led--active' : ''
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

  const loadWire = `transistor-switch-demo-wire${
    visual.pathBlocked ? ' transistor-switch-demo-wire--blocked' : ''
  }${
    visual.loadCurrentFlow && showMotion
      ? ' transistor-switch-demo-load--flow'
      : ''
  }${
    visual.highlightLoadPath && !visual.loadCurrentFlow
      ? ' transistor-switch-demo-wire--emphasis'
      : ''
  }`;

  const controlWire = `transistor-switch-demo-wire${
    visual.controlFlow && showMotion
      ? ' transistor-switch-demo-control--flow'
      : ''
  }${
    visual.highlightControl || visual.highlightBaseResistor
      ? ' transistor-switch-demo-wire--emphasis'
      : ''
  }`;

  const baseWire = `transistor-switch-demo-wire${
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
          viewBox="0 0 560 360"
          focusable="false"
        >
          {/* HLAVNÍ ZDROJ */}
          <g className={sourceClass}>
            <rect x={16} y={28} width={84} height={100} rx={8} />
            <text
              x={58}
              y={50}
              textAnchor="middle"
              className="transistor-switch-demo-label"
            >
              HLAVNÍ ZDROJ
            </text>
            <text
              x={78}
              y={72}
              textAnchor="middle"
              className="transistor-switch-demo-pole transistor-switch-demo-pole--plus"
            >
              +
            </text>
            <text
              x={78}
              y={112}
              textAnchor="middle"
              className="transistor-switch-demo-pole transistor-switch-demo-pole--minus"
            >
              −
            </text>
            <text
              x={58}
              y={132}
              textAnchor="middle"
              className="transistor-switch-demo-sublabel"
            >
              energie LED
            </text>
          </g>

          {/* + → Rled */}
          <line
            x1={TOPO.sourcePlus.x}
            y1={TOPO.sourcePlus.y}
            x2={TOPO.rledLeft.x}
            y2={TOPO.rledLeft.y}
            className={loadWire}
          />

          <g className={rledClass}>
            <rect x={118} y={28} width={70} height={48} rx={6} />
            <text
              x={153}
              y={46}
              textAnchor="middle"
              className="transistor-switch-demo-label"
            >
              REZISTOR LED
            </text>
            <rect
              x={137}
              y={52}
              width={32}
              height={10}
              rx={2}
              className="transistor-switch-demo-resistor-symbol"
            />
            <text
              x={153}
              y={72}
              textAnchor="middle"
              className="transistor-switch-demo-sublabel"
            >
              bez hodnoty
            </text>
          </g>

          {/* Rled → LED */}
          <line
            x1={TOPO.rledRight.x}
            y1={TOPO.rledRight.y}
            x2={TOPO.ledLeft.x}
            y2={TOPO.ledLeft.y}
            className={loadWire}
          />

          {/* Standard LED symbol (anode left → cathode right) */}
          <g className={ledClass}>
            <polygon
              points="210,36 210,68 250,52"
              className="transistor-switch-demo-led-body"
            />
            <line
              x1={250}
              y1={36}
              x2={250}
              y2={68}
              className="transistor-switch-demo-led-cathode"
            />
            <line
              x1={256}
              y1={40}
              x2={268}
              y2={32}
              className="transistor-switch-demo-led-ray"
            />
            <line
              x1={256}
              y1={48}
              x2={268}
              y2={40}
              className="transistor-switch-demo-led-ray"
            />
            <polygon points="266,30 270,34 262,36" className="transistor-switch-demo-led-ray-head" />
            <polygon points="266,38 270,42 262,44" className="transistor-switch-demo-led-ray-head" />
            <text
              x={230}
              y={86}
              textAnchor="middle"
              className="transistor-switch-demo-label"
            >
              LED
            </text>
            <text
              x={230}
              y={100}
              textAnchor="middle"
              className="transistor-switch-demo-sublabel"
            >
              {visual.ledState}
            </text>
          </g>

          {/* LED → C tip (continuous) */}
          <path
            d={`M ${TOPO.ledRight.x} ${TOPO.ledRight.y} L ${TOPO.cTip.x} ${TOPO.ledRight.y} L ${TOPO.cTip.x} ${TOPO.cTip.y}`}
            fill="none"
            className={loadWire}
          />

          {/* ŘÍZENÍ */}
          <g className={controlClass}>
            <rect x={16} y={248} width={84} height={80} rx={8} />
            <text
              x={58}
              y={272}
              textAnchor="middle"
              className="transistor-switch-demo-label"
            >
              ŘÍZENÍ
            </text>
            <text
              x={58}
              y={294}
              textAnchor="middle"
              className="transistor-switch-demo-sublabel"
            >
              {visual.controlSignal}
            </text>
            <text
              x={58}
              y={314}
              textAnchor="middle"
              className="transistor-switch-demo-sublabel"
            >
              řídicí vstup
            </text>
          </g>

          {/* ŘÍZENÍ → Rb */}
          <line
            x1={TOPO.controlOut.x}
            y1={TOPO.controlOut.y}
            x2={TOPO.rbLeft.x}
            y2={TOPO.rbLeft.y}
            className={controlWire}
          />

          <g className={rbClass}>
            <rect x={118} y={258} width={80} height={60} rx={6} />
            <text
              x={158}
              y={278}
              textAnchor="middle"
              className="transistor-switch-demo-label"
            >
              REZISTOR BÁZE
            </text>
            <rect
              x={142}
              y={286}
              width={32}
              height={10}
              rx={2}
              className="transistor-switch-demo-resistor-symbol"
            />
            <text
              x={158}
              y={310}
              textAnchor="middle"
              className="transistor-switch-demo-sublabel"
            >
              bez hodnoty
            </text>
          </g>

          {/* Rb → B (ends exactly at base mid) */}
          <path
            d={`M ${TOPO.rbRight.x} ${TOPO.rbRight.y} L 320 ${TOPO.rbRight.y} L 320 ${TOPO.baseMid.y} L ${TOPO.baseMid.x} ${TOPO.baseMid.y}`}
            fill="none"
            className={controlWire}
          />

          {/* Standard NPN BJT symbol */}
          <g className={transistorClass}>
            {/* Vertical base bar */}
            <line
              x1={TOPO.baseTop.x}
              y1={TOPO.baseTop.y}
              x2={TOPO.baseBot.x}
              y2={TOPO.baseBot.y}
              className="transistor-switch-demo-base-bar"
            />
            {/* Collector branch up-right */}
            <line
              x1={TOPO.baseTop.x}
              y1={TOPO.baseTop.y + 8}
              x2={TOPO.cTip.x}
              y2={TOPO.cTip.y}
              className="transistor-switch-demo-collector"
            />
            {/* Emitter branch down-right */}
            <line
              x1={TOPO.baseBot.x}
              y1={TOPO.baseBot.y - 8}
              x2={TOPO.eTip.x}
              y2={TOPO.eTip.y}
              className="transistor-switch-demo-emitter"
            />
            {/* NPN arrow on emitter, pointing away from base */}
            <polygon
              points="442,240 422,226 432,214"
              className="transistor-switch-demo-emitter-arrow"
            />
            <text
              x={378}
              y={172}
              textAnchor="middle"
              className="transistor-switch-demo-terminal"
            >
              B
            </text>
            <text
              x={462}
              y={106}
              className="transistor-switch-demo-terminal"
            >
              C
            </text>
            <text
              x={462}
              y={252}
              className="transistor-switch-demo-terminal"
            >
              E
            </text>
            <text
              x={400}
              y={126}
              textAnchor="middle"
              className="transistor-switch-demo-label"
            >
              NPN BJT
            </text>
            <text
              x={400}
              y={220}
              textAnchor="end"
              className="transistor-switch-demo-sublabel"
            >
              {visual.transistorState}
            </text>
          </g>

          {/* E → common return → source − */}
          <path
            d={`M ${TOPO.eTip.x} ${TOPO.eTip.y} L ${TOPO.eTip.x} ${TOPO.commonY} L ${TOPO.sourceMinus.x} ${TOPO.commonY} L ${TOPO.sourceMinus.x} ${TOPO.sourceMinus.y}`}
            fill="none"
            className={loadWire}
          />

          {/* Modeled B–E path overlay only when base current is active */}
          {visual.baseCurrentFlow && (
            <path
              d={`M ${TOPO.baseMid.x} ${TOPO.baseMid.y} L ${TOPO.baseBot.x} ${TOPO.baseBot.y - 8} L ${TOPO.eTip.x} ${TOPO.eTip.y} L ${TOPO.eTip.x} ${TOPO.commonY}`}
              fill="none"
              className={baseWire}
            />
          )}

          {/* Common return marker */}
          <circle
            cx={TOPO.eTip.x}
            cy={TOPO.commonY}
            r={5}
            className="transistor-switch-demo-common-node"
          />
          <text
            x={340}
            y={TOPO.commonY + 18}
            textAnchor="middle"
            className="transistor-switch-demo-common-label"
          >
            SPOLEČNÝ NÁVRAT
          </text>

          {visual.controlFlow && (
            <text
              x={200}
              y={240}
              textAnchor="middle"
              className="transistor-switch-demo-current-label"
            >
              řídicí cesta → B
            </text>
          )}
          {visual.baseCurrentFlow && (
            <text
              x={360}
              y={280}
              textAnchor="middle"
              className="transistor-switch-demo-current-label"
            >
              proud báze B→E→návrat
            </text>
          )}
          {visual.loadCurrentFlow && (
            <text
              x={280}
              y={20}
              textAnchor="middle"
              className="transistor-switch-demo-current-label"
            >
              proud zátěže +→LED→C→E→−
            </text>
          )}
          {visual.pathBlocked && (
            <text
              x={400}
              y={95}
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
          Typ modelu: <strong>{visual.modelType}</strong>
        </li>
        <li>
          Řídicí signál: <strong>{visual.controlSignal}</strong>
        </li>
        <li>
          Rezistor báze: <strong>{visual.resistorBaseState}</strong>
        </li>
        <li>
          B — báze: <strong>{visual.baseTerminalState}</strong>
        </li>
        <li>
          Proud báze: <strong>{visual.baseCurrent}</strong>
        </li>
        <li>
          Stav tranzistoru: <strong>{visual.transistorState}</strong>
        </li>
        <li>
          C — kolektor: <strong>{visual.collectorTerminalState}</strong>
        </li>
        <li>
          E — emitor: <strong>{visual.emitterTerminalState}</strong>
        </li>
        <li>
          Kolektorová větev C–E: <strong>{visual.collectorBranchState}</strong>
        </li>
        <li>
          Proud zátěže: <strong>{visual.loadCurrent}</strong>
        </li>
        <li>
          Rezistor LED: <strong>{visual.resistorLedState}</strong>
        </li>
        <li>
          Stav LED: <strong>{visual.ledState}</strong>
        </li>
        <li>
          Zdroj energie LED: <strong>{visual.energySourceState}</strong>
        </li>
        <li>
          Společný návrat/reference: <strong>{visual.commonReturnState}</strong>
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
