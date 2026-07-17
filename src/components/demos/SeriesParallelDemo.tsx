import { useCallback, useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import type { SeriesParallelDemoConfig } from '../../types';
import { AnimatedDemoControls } from '../animation/AnimatedDemoControls';
import { useAnimatedDemo } from '../animation/useAnimatedDemo';
import { useMotionPolicy } from '../animation/useMotionPolicy';

type ScenarioId = 'serial' | 'parallel';

interface DemoStep {
  title: string;
  description: string;
}

const SCENARIO_META: { id: ScenarioId; label: string }[] = [
  { id: 'serial', label: 'Sériové zapojení' },
  { id: 'parallel', label: 'Paralelní zapojení' },
];

const SERIAL_STEPS: DemoStep[] = [
  {
    title: 'Přehled zapojení',
    description:
      'Vidíš zdroj (baterii) s póly + a − a dvě žárovky zapojené za sebou v jediné uzavřené smyčce. Vodiče jsou zatím neutrální a žárovky nesvítí.',
  },
  {
    title: 'Jediná proudová cesta',
    description:
      'Celá smyčka je zvýrazněná: od + pólu přes první i druhou žárovku a zpět k − pólu vede jen jedna cesta. Proud se nikde nevětví — oba spotřebiče leží v téže cestě.',
  },
  {
    title: 'Směr proudu a stejný proud',
    description:
      'Šipky ukazují konvenční směr proudu od + k −. Protože existuje jen jedna cesta, stejný proud prochází oběma žárovkami.',
  },
  {
    title: 'Proud prochází oběma žárovkami',
    description:
      'Proud prochází celou smyčkou najednou — před první žárovkou, mezi žárovkami i za druhou žárovkou je stejný. V první žárovce se proud „nespotřebuje“.',
  },
  {
    title: 'Výsledek',
    description:
      'Obě žárovky svítí. Sériové zapojení má jedinou proudovou cestu. Přerušení kteréhokoli místa této jediné cesty zastaví proud v celém obvodu.',
  },
];

const PARALLEL_STEPS: DemoStep[] = [
  {
    title: 'Přehled zapojení',
    description:
      'Vidíš zdroj, společný přívod, rozdělovací uzel, dvě samostatné větve — v každé je jedna žárovka — spojovací uzel a společný návrat k − pólu.',
  },
  {
    title: 'Rozdělení na větve',
    description:
      'V rozdělovacím uzlu se obvod dělí na dvě větve, ve spojovacím uzlu se větve opět spojují. Oba uzly jsou ve schématu zvýrazněné a popsané.',
  },
  {
    title: 'Dvě proudové cesty',
    description:
      'Obě větve existují současně a mají společný začátek i konec. Obě větve jsou připojeny mezi stejné dva uzly, proto je na nich stejné napětí. V tomto zjednodušeném zapojení napětí na každé větvi odpovídá napětí zdroje.',
  },
  {
    title: 'Proud se rozdělí a sloučí',
    description:
      'Proud prochází společným přívodem, v rozdělovacím uzlu se rozdělí do obou větví současně a před návratem se ve spojovacím uzlu opět sloučí.',
  },
  {
    title: 'Výsledek',
    description:
      'Obě žárovky svítí. Paralelní zapojení má více proudových cest. Přerušení jedné větve nemusí zastavit proud v druhé neporušené větvi.',
  },
];

const STEPS_BY_SCENARIO: Record<ScenarioId, DemoStep[]> = {
  serial: SERIAL_STEPS,
  parallel: PARALLEL_STEPS,
};

const FLOW_NOTE =
  'Hustota a rychlost čárek jsou pouze názorné. Nevyjadřují konkrétní velikost proudu ani skutečnou rychlost děje.';

const BRIGHTNESS_NOTE =
  'Jas žárovek je v tomto modelu pouze názorný a závisí na parametrech zdroje a spotřebičů.';

const CONVENTIONAL_NOTE =
  'Animace znázorňuje konvenční směr proudu od + k −. Nezobrazuje pohyb elektronů.';

/**
 * Geometrie sériového schématu (SVG user units, viewBox 0 0 400 260).
 * Jediná obdélníková smyčka: zdroj na levé straně, obě žárovky v horní
 * větvi za sebou, pravá svislá cesta a spodní návrat k − pólu.
 */
const SERIAL_SOURCE_X = 64;
const SERIAL_TOP_Y = 70;
const SERIAL_RETURN_Y = 200;
const SERIAL_PLATE_LONG_Y = 126; // dlouhá deska baterie (+)
const SERIAL_PLATE_SHORT_Y = 144; // krátká deska baterie (−)
const SERIAL_BULB_R = 22;
const SERIAL_BULB1 = { x: 170, y: SERIAL_TOP_Y };
const SERIAL_BULB2 = { x: 300, y: SERIAL_TOP_Y };
const SERIAL_RIGHT_X = 344;
const SERIAL_BULB1_LEFT = SERIAL_BULB1.x - SERIAL_BULB_R; // 148
const SERIAL_BULB1_RIGHT = SERIAL_BULB1.x + SERIAL_BULB_R; // 192
const SERIAL_BULB2_LEFT = SERIAL_BULB2.x - SERIAL_BULB_R; // 278
const SERIAL_BULB2_RIGHT = SERIAL_BULB2.x + SERIAL_BULB_R; // 322

/**
 * Jediný spojitý sériový flow path od kladné (dlouhé) desky přes obě žárovky
 * na zápornou (krátkou) desku. Délka: 56 + 280 + 130 + 280 + 56 = 802 user
 * units. Celý dash pattern se pohybuje současně — před první žárovkou, mezi
 * žárovkami i za druhou je proud stejný, nikde se „nespotřebuje“.
 */
const SERIAL_FLOW_PATH = `M ${SERIAL_SOURCE_X} ${SERIAL_PLATE_LONG_Y} V ${SERIAL_TOP_Y} H ${SERIAL_RIGHT_X} V ${SERIAL_RETURN_Y} H ${SERIAL_SOURCE_X} V ${SERIAL_PLATE_SHORT_Y}`;

/**
 * Geometrie paralelního schématu (SVG user units, viewBox 0 0 400 300).
 * Společný přívod → rozdělovací uzel → dvě větve (každá s jednou žárovkou)
 * → spojovací uzel → společný návrat k − pólu. Horní větev vede doprava a
 * pak dolů, dolní větev dolů a pak doprava — obě mají stejnou délku 246.
 */
const PAR_SOURCE_X = 64;
const PAR_FEED_Y = 70;
const PAR_SPLIT = { x: 170, y: 70 };
const PAR_TOP_BULB = { x: 253, y: 70 };
const PAR_BOT_Y = 150;
const PAR_BOT_BULB = { x: 253, y: PAR_BOT_Y };
const PAR_MERGE = { x: 336, y: PAR_BOT_Y };
const PAR_RETURN_Y = 230;
const PAR_PLATE_LONG_Y = 141; // dlouhá deska baterie (+)
const PAR_PLATE_SHORT_Y = 159; // krátká deska baterie (−)
const PAR_BULB_R = 22;
const PAR_TOP_BULB_LEFT = PAR_TOP_BULB.x - PAR_BULB_R; // 231
const PAR_TOP_BULB_RIGHT = PAR_TOP_BULB.x + PAR_BULB_R; // 275
const PAR_BOT_BULB_LEFT = PAR_BOT_BULB.x - PAR_BULB_R; // 231
const PAR_BOT_BULB_RIGHT = PAR_BOT_BULB.x + PAR_BULB_R; // 275

/**
 * Čtyři synchronizované paralelní flow pathy. Všechny jsou orientované ve
 * skutečném (konvenčním) směru proudu a mountují se současně se stejnou
 * flow třídou (stejná rychlost, dasharray 7 7 → perioda 14, bez delay).
 *
 * Délky: přívod 71 + 106 = 177; horní větev 166 + 80 = 246; dolní větev
 * 80 + 166 = 246 (obě větve stejně dlouhé → symetrická animace); návrat
 * 80 + 272 + 71 = 423 = 177 + 246 (přívod + jedna větev).
 *
 * Fázová návaznost dashů v uzlech: fáze pathu = délka předchozí cesty
 * modulo perioda dash patternu (14). Přívod 0; větve 177 % 14 = 9;
 * návrat (177 + 246) % 14 = 3. Fáze se předává komponentově omezenou CSS
 * custom property --sp-demo-flow-phase (žádný JS timer), takže dash při
 * průchodu rozdělovacím i spojovacím uzlem opticky nepřeskakuje.
 */
const PAR_FLOW_FEED = `M ${PAR_SOURCE_X} ${PAR_PLATE_LONG_Y} V ${PAR_FEED_Y} H ${PAR_SPLIT.x}`;
const PAR_FLOW_TOP = `M ${PAR_SPLIT.x} ${PAR_SPLIT.y} H ${PAR_MERGE.x} V ${PAR_MERGE.y}`;
const PAR_FLOW_BOTTOM = `M ${PAR_SPLIT.x} ${PAR_SPLIT.y} V ${PAR_BOT_Y} H ${PAR_MERGE.x}`;
const PAR_FLOW_RETURN = `M ${PAR_MERGE.x} ${PAR_MERGE.y} V ${PAR_RETURN_Y} H ${PAR_SOURCE_X} V ${PAR_PLATE_SHORT_Y}`;

const FLOW_PHASE_FEED = '0px';
const FLOW_PHASE_BRANCH = '9px'; // 177 % 14
const FLOW_PHASE_RETURN = '3px'; // (177 + 246) % 14

function flowPhaseStyle(phase: string): CSSProperties {
  return { '--sp-demo-flow-phase': phase } as CSSProperties;
}

interface PanelRow {
  label: string;
  value: string;
}

interface DemoVisual {
  /** Série: celá smyčka staticky zvýrazněná (aktivní vodič). */
  loopActive: boolean;
  /** Paralelně: obě větve staticky zvýrazněné. */
  branchesActive: boolean;
  /** Paralelně: společný přívod a návrat staticky zvýrazněné. */
  feedReturnActive: boolean;
  /** Paralelně: zvýraznění rozdělovacího a spojovacího uzlu (krok 1). */
  nodesHighlighted: boolean;
  /** Paralelně: textové popisky „rozdělení“ / „sloučení“. */
  showNodeLabels: boolean;
  showArrows: boolean;
  bulbsReceiving: boolean;
  bulbsOn: boolean;
  /** Krok „proud prochází“ — flow overlay se ale kreslí jen při autoplay. */
  flowActive: boolean;
  panelRows: PanelRow[];
}

function getSteps(scenarioId: ScenarioId): DemoStep[] {
  return STEPS_BY_SCENARIO[scenarioId];
}

function deriveVisual(scenarioId: ScenarioId, stepIndex: number): DemoVisual {
  const bulbsReceiving = stepIndex === 3;
  const bulbsOn = stepIndex === 4;
  const bulbText = bulbsOn
    ? 'svítí'
    : bulbsReceiving
      ? 'prochází jí proud'
      : 'nesvítí';

  if (scenarioId === 'serial') {
    const results = [
      'přehled sériového zapojení',
      'jediná proudová cesta bez větvení',
      'stejný proud v celé smyčce',
      'proud prochází oběma žárovkami současně',
      'obě žárovky svítí — jediná proudová cesta',
    ];
    return {
      loopActive: stepIndex >= 1,
      branchesActive: false,
      feedReturnActive: false,
      nodesHighlighted: false,
      showNodeLabels: false,
      showArrows: stepIndex >= 2,
      bulbsReceiving,
      bulbsOn,
      flowActive: stepIndex === 3,
      panelRows: [
        { label: 'Zapojení', value: 'sériové — spotřebiče za sebou' },
        {
          label: 'Počet proudových cest',
          value: 'jedna — jediná uzavřená smyčka',
        },
        {
          label: 'Uspořádání spotřebičů',
          value: 'žárovka 1 a žárovka 2 za sebou v téže cestě',
        },
        { label: 'Zdroj', value: 'baterie — dodává obvodu elektrickou energii' },
        {
          label: 'Proud',
          value:
            stepIndex <= 1
              ? 'zatím jej neznázorňujeme — sledujeme tvar obvodu'
              : stepIndex === 4
                ? 'prochází celou jedinou cestou od + k −'
                : 'stejný proud prochází oběma žárovkami (směr + → −)',
        },
        {
          label: 'Napětí',
          value:
            'Napětí zdroje se rozdělí mezi spotřebiče. Bez jejich parametrů neurčujeme konkrétní podíl.',
        },
        {
          label: 'Návratová cesta',
          value:
            stepIndex >= 2
              ? 'vede proud zpět k − pólu zdroje'
              : 'spodní vodič zpět k − pólu zdroje',
        },
        { label: 'Žárovka 1', value: bulbText },
        { label: 'Žárovka 2', value: bulbText },
        { label: 'Výsledek', value: results[stepIndex] },
      ],
    };
  }

  const results = [
    'přehled paralelního zapojení',
    'obvod se dělí a znovu spojuje ve dvou uzlech',
    'dvě proudové cesty mezi stejnými uzly',
    'proud se rozdělil do větví a sloučil',
    'obě žárovky svítí — více proudových cest',
  ];
  const branchText = bulbsOn
    ? 'žárovka svítí'
    : bulbsReceiving
      ? 'prochází jí proud'
      : stepIndex === 2
        ? 'samostatná proudová cesta mezi oběma uzly'
        : 'vlastní větev s jednou žárovkou';
  return {
    loopActive: false,
    branchesActive: stepIndex >= 2,
    feedReturnActive: stepIndex >= 3,
    nodesHighlighted: stepIndex === 1,
    // V completed kroku popisky ustupují paprskům žárovek (uzly popisuje
    // stavový panel); povinné jsou v kroku „Rozdělení na větve“.
    showNodeLabels: stepIndex >= 1 && stepIndex <= 3,
    showArrows: stepIndex >= 3,
    bulbsReceiving,
    bulbsOn,
    flowActive: stepIndex === 3,
    panelRows: [
      { label: 'Zapojení', value: 'paralelní — každá žárovka ve vlastní větvi' },
      { label: 'Počet proudových cest', value: 'dvě — horní a dolní větev' },
      {
        label: 'Rozdělovací uzel',
        value:
          stepIndex >= 3
            ? 'proud se zde rozdělí do obou větví'
            : stepIndex === 1
              ? 'zvýrazněn — zde se obvod dělí na dvě větve'
              : stepIndex === 2
                ? 'společný začátek obou větví'
                : 'místo, kde se obvod dělí na větve',
      },
      { label: 'Horní větev', value: branchText },
      { label: 'Dolní větev', value: branchText },
      {
        label: 'Spojovací uzel',
        value:
          stepIndex >= 3
            ? 'proud z obou větví se zde sloučí'
            : stepIndex === 1
              ? 'zvýrazněn — zde se větve opět spojují'
              : stepIndex === 2
                ? 'společný konec obou větví'
                : 'místo, kde se větve opět spojují',
      },
      {
        label: 'Proud',
        value:
          stepIndex < 3
            ? 'zatím jej neznázorňujeme — sledujeme tvar obvodu'
            : stepIndex === 4
              ? 'prochází oběma větvemi současně'
              : 'rozdělí se do obou větví a před návratem se sloučí',
      },
      {
        label: 'Napětí větví',
        value:
          'Obě větve mají stejné napětí, protože jsou připojeny mezi stejné dva uzly.',
      },
      {
        label: 'Návratová cesta',
        value:
          stepIndex >= 3
            ? 'vede sloučený proud zpět k − pólu zdroje'
            : 'společný vodič zpět k − pólu zdroje',
      },
      { label: 'Výsledek', value: results[stepIndex] },
    ],
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

/** Tři dekorativní paprsky nad/pod žárovkou — nikdy nejsou join pointy. */
function bulbRays(cx: number, cy: number, direction: 'up' | 'down') {
  const s = direction === 'up' ? -1 : 1;
  const rays: [number, number, number, number][] = [
    [cx - 30, cy + s * 30, cx - 40, cy + s * 40],
    [cx, cy + s * 34, cx, cy + s * 46],
    [cx + 30, cy + s * 30, cx + 40, cy + s * 40],
  ];
  return (
    <g className="series-parallel-demo-bulb-rays">
      {rays.map(([x1, y1, x2, y2]) => (
        <line key={`${x1}-${y1}`} x1={x1} y1={y1} x2={x2} y2={y2} />
      ))}
    </g>
  );
}

interface BulbProps {
  cx: number;
  cy: number;
  r: number;
  receiving: boolean;
  on: boolean;
  raysDirection: 'up' | 'down';
}

/**
 * Žárovka: kruh s křížem. Neprůhledná výplň kruhu (barva pozadí stage) leží
 * nad flow overlayem, takže dash není uvnitř značky vidět; obrys, kříž a
 * terminálové body (skutečné elektrické join pointy vodičů) se kreslí nad ní.
 */
function Bulb({ cx, cy, r, receiving, on, raysDirection }: BulbProps) {
  const bulbCls = `series-parallel-demo-bulb${
    receiving ? ' series-parallel-demo-bulb--receiving' : ''
  }${on ? ' series-parallel-demo-bulb--on' : ''}`;
  const crossCls = `series-parallel-demo-bulb-cross${
    receiving ? ' series-parallel-demo-bulb-cross--active' : ''
  }`;
  const c = 17;
  return (
    <>
      <circle className={bulbCls} cx={cx} cy={cy} r={r} />
      <line
        className={crossCls}
        x1={cx - c}
        y1={cy - c}
        x2={cx + c}
        y2={cy + c}
      />
      <line
        className={crossCls}
        x1={cx - c}
        y1={cy + c}
        x2={cx + c}
        y2={cy - c}
      />
      <circle
        className="series-parallel-demo-contact"
        cx={cx - r}
        cy={cy}
        r={4}
      />
      <circle
        className="series-parallel-demo-contact"
        cx={cx + r}
        cy={cy}
        r={4}
      />
      {on && bulbRays(cx, cy, raysDirection)}
    </>
  );
}

interface BatteryProps {
  x: number;
  plateLongY: number;
  plateShortY: number;
  labelY: number;
}

/** Baterie: dlouhá deska = +, krátká deska = −. Mezi deskami není vodič. */
function Battery({ x, plateLongY, plateShortY, labelY }: BatteryProps) {
  return (
    <>
      <line
        className="series-parallel-demo-battery-plate series-parallel-demo-battery-plate--long"
        x1={x - 20}
        y1={plateLongY}
        x2={x + 20}
        y2={plateLongY}
      />
      <line
        className="series-parallel-demo-battery-plate series-parallel-demo-battery-plate--short"
        x1={x - 10}
        y1={plateShortY}
        x2={x + 10}
        y2={plateShortY}
      />
      <text
        className="series-parallel-demo-pole"
        x={x - 34}
        y={plateLongY - 2}
        textAnchor="middle"
      >
        +
      </text>
      <text
        className="series-parallel-demo-pole"
        x={x - 34}
        y={plateShortY + 10}
        textAnchor="middle"
      >
        −
      </text>
      <text
        className="series-parallel-demo-label"
        x={x}
        y={labelY}
        textAnchor="middle"
      >
        ZDROJ
      </text>
    </>
  );
}

interface SvgProps {
  visual: DemoVisual;
  showFlowOverlay: boolean;
}

function SerialCircuitSvg({ visual, showFlowOverlay }: SvgProps) {
  const wireCls = `series-parallel-demo-wire${
    visual.loopActive ? ' series-parallel-demo-wire--on' : ''
  }`;
  return (
    <svg
      className="series-parallel-demo-svg"
      viewBox="0 0 400 260"
      aria-hidden="true"
      focusable="false"
    >
      {/* Vodiče jediné smyčky — napojené přesně na terminály žárovek */}
      <path
        className={wireCls}
        fill="none"
        d={`M ${SERIAL_SOURCE_X} ${SERIAL_TOP_Y} V ${SERIAL_PLATE_LONG_Y}`}
      />
      <path
        className={wireCls}
        fill="none"
        d={`M ${SERIAL_SOURCE_X} ${SERIAL_TOP_Y} H ${SERIAL_BULB1_LEFT}`}
      />
      <path
        className={wireCls}
        fill="none"
        d={`M ${SERIAL_BULB1_RIGHT} ${SERIAL_TOP_Y} H ${SERIAL_BULB2_LEFT}`}
      />
      <path
        className={wireCls}
        fill="none"
        d={`M ${SERIAL_BULB2_RIGHT} ${SERIAL_TOP_Y} H ${SERIAL_RIGHT_X}`}
      />
      <path
        className={wireCls}
        fill="none"
        d={`M ${SERIAL_RIGHT_X} ${SERIAL_TOP_Y} V ${SERIAL_RETURN_Y}`}
      />
      <path
        className={wireCls}
        fill="none"
        d={`M ${SERIAL_RIGHT_X} ${SERIAL_RETURN_Y} H ${SERIAL_SOURCE_X}`}
      />
      <path
        className={wireCls}
        fill="none"
        d={`M ${SERIAL_SOURCE_X} ${SERIAL_RETURN_Y} V ${SERIAL_PLATE_SHORT_Y}`}
      />

      <Battery
        x={SERIAL_SOURCE_X}
        plateLongY={SERIAL_PLATE_LONG_Y}
        plateShortY={SERIAL_PLATE_SHORT_Y}
        labelY={232}
      />

      {/* Jediný spojitý flow overlay + → − (jen autoplay, pod žárovkami) */}
      {showFlowOverlay && (
        <path
          className="series-parallel-demo-flow"
          style={flowPhaseStyle(FLOW_PHASE_FEED)}
          fill="none"
          d={SERIAL_FLOW_PATH}
        />
      )}

      <Bulb
        cx={SERIAL_BULB1.x}
        cy={SERIAL_BULB1.y}
        r={SERIAL_BULB_R}
        receiving={visual.bulbsReceiving}
        on={visual.bulbsOn}
        raysDirection="up"
      />
      <Bulb
        cx={SERIAL_BULB2.x}
        cy={SERIAL_BULB2.y}
        r={SERIAL_BULB_R}
        receiving={visual.bulbsReceiving}
        on={visual.bulbsOn}
        raysDirection="up"
      />

      {/* Popisky žárovek: kotvené k pravému terminálu (anchor end), aby se
          nekřížily s pravou svislou cestou ani mezi sebou */}
      <text
        className="series-parallel-demo-label"
        x={SERIAL_BULB1_RIGHT}
        y={112}
        textAnchor="end"
      >
        Žárovka 1
      </text>
      <text
        className="series-parallel-demo-label"
        x={SERIAL_BULB2_RIGHT}
        y={112}
        textAnchor="end"
      >
        Žárovka 2
      </text>

      <text
        className="series-parallel-demo-label"
        x={204}
        y={222}
        textAnchor="middle"
      >
        návratová cesta k −
      </text>

      {/* Statické směrové šipky konvenčního proudu + → − */}
      {visual.showArrows && (
        <g className="series-parallel-demo-arrow">
          {/* horní větev před žárovkou 1: doprava */}
          <polygon points="110,64 110,76 124,70" />
          {/* mezi žárovkami: doprava */}
          <polygon points="228,64 228,76 242,70" />
          {/* pravá strana: dolů */}
          <polygon points="338,110 350,110 344,124" />
          {/* spodní návrat: doleva */}
          <polygon points="212,194 212,206 198,200" />
        </g>
      )}
    </svg>
  );
}

function ParallelCircuitSvg({ visual, showFlowOverlay }: SvgProps) {
  const feedCls = `series-parallel-demo-wire${
    visual.feedReturnActive ? ' series-parallel-demo-wire--on' : ''
  }`;
  const branchCls = `series-parallel-demo-wire${
    visual.branchesActive ? ' series-parallel-demo-wire--on' : ''
  }`;
  const nodeCls = `series-parallel-demo-node${
    visual.nodesHighlighted ? ' series-parallel-demo-node--highlight' : ''
  }`;
  const nodeR = visual.nodesHighlighted ? 7 : 5;
  return (
    <svg
      className="series-parallel-demo-svg"
      viewBox="0 0 400 300"
      aria-hidden="true"
      focusable="false"
    >
      {/* Společný přívod od + pólu k rozdělovacímu uzlu */}
      <path
        className={feedCls}
        fill="none"
        d={`M ${PAR_SOURCE_X} ${PAR_FEED_Y} V ${PAR_PLATE_LONG_Y}`}
      />
      <path
        className={feedCls}
        fill="none"
        d={`M ${PAR_SOURCE_X} ${PAR_FEED_Y} H ${PAR_SPLIT.x}`}
      />
      {/* Horní větev: z rozdělovacího uzlu doprava přes horní žárovku a dolů */}
      <path
        className={branchCls}
        fill="none"
        d={`M ${PAR_SPLIT.x} ${PAR_SPLIT.y} H ${PAR_TOP_BULB_LEFT}`}
      />
      <path
        className={branchCls}
        fill="none"
        d={`M ${PAR_TOP_BULB_RIGHT} ${PAR_FEED_Y} H ${PAR_MERGE.x}`}
      />
      <path
        className={branchCls}
        fill="none"
        d={`M ${PAR_MERGE.x} ${PAR_FEED_Y} V ${PAR_MERGE.y}`}
      />
      {/* Dolní větev: z rozdělovacího uzlu dolů a doprava přes dolní žárovku */}
      <path
        className={branchCls}
        fill="none"
        d={`M ${PAR_SPLIT.x} ${PAR_SPLIT.y} V ${PAR_BOT_Y}`}
      />
      <path
        className={branchCls}
        fill="none"
        d={`M ${PAR_SPLIT.x} ${PAR_BOT_Y} H ${PAR_BOT_BULB_LEFT}`}
      />
      <path
        className={branchCls}
        fill="none"
        d={`M ${PAR_BOT_BULB_RIGHT} ${PAR_BOT_Y} H ${PAR_MERGE.x}`}
      />
      {/* Společný návrat ze spojovacího uzlu k − pólu */}
      <path
        className={feedCls}
        fill="none"
        d={`M ${PAR_MERGE.x} ${PAR_MERGE.y} V ${PAR_RETURN_Y}`}
      />
      <path
        className={feedCls}
        fill="none"
        d={`M ${PAR_MERGE.x} ${PAR_RETURN_Y} H ${PAR_SOURCE_X}`}
      />
      <path
        className={feedCls}
        fill="none"
        d={`M ${PAR_SOURCE_X} ${PAR_RETURN_Y} V ${PAR_PLATE_SHORT_Y}`}
      />

      <Battery
        x={PAR_SOURCE_X}
        plateLongY={PAR_PLATE_LONG_Y}
        plateShortY={PAR_PLATE_SHORT_Y}
        labelY={258}
      />

      {/* Čtyři synchronizované flow pathy (jen autoplay): přívod, horní
          větev, dolní větev, návrat. Stejná třída, rychlost i dasharray;
          fázový offset podle délky předchozí cesty modulo dash periody
          drží dash pattern v uzlech opticky spojitý. */}
      {showFlowOverlay && (
        <>
          <path
            className="series-parallel-demo-flow"
            style={flowPhaseStyle(FLOW_PHASE_FEED)}
            fill="none"
            d={PAR_FLOW_FEED}
          />
          <path
            className="series-parallel-demo-flow"
            style={flowPhaseStyle(FLOW_PHASE_BRANCH)}
            fill="none"
            d={PAR_FLOW_TOP}
          />
          <path
            className="series-parallel-demo-flow"
            style={flowPhaseStyle(FLOW_PHASE_BRANCH)}
            fill="none"
            d={PAR_FLOW_BOTTOM}
          />
          <path
            className="series-parallel-demo-flow"
            style={flowPhaseStyle(FLOW_PHASE_RETURN)}
            fill="none"
            d={PAR_FLOW_RETURN}
          />
        </>
      )}

      {/* Rozdělovací a spojovací uzel: plné kroužky přesně na souřadnicích
          napojení všech segmentů (kreslí se nad flow overlayem) */}
      <circle className={nodeCls} cx={PAR_SPLIT.x} cy={PAR_SPLIT.y} r={nodeR} />
      <circle className={nodeCls} cx={PAR_MERGE.x} cy={PAR_MERGE.y} r={nodeR} />
      {visual.showNodeLabels && (
        <>
          <text
            className="series-parallel-demo-node-label"
            x={PAR_SPLIT.x - 8}
            y={PAR_SPLIT.y - 12}
            textAnchor="end"
          >
            rozdělení
          </text>
          <text
            className="series-parallel-demo-node-label"
            x={PAR_MERGE.x - 6}
            y={PAR_MERGE.y + 34}
            textAnchor="end"
          >
            sloučení
          </text>
        </>
      )}

      <Bulb
        cx={PAR_TOP_BULB.x}
        cy={PAR_TOP_BULB.y}
        r={PAR_BULB_R}
        receiving={visual.bulbsReceiving}
        on={visual.bulbsOn}
        raysDirection="up"
      />
      <Bulb
        cx={PAR_BOT_BULB.x}
        cy={PAR_BOT_BULB.y}
        r={PAR_BULB_R}
        receiving={visual.bulbsReceiving}
        on={visual.bulbsOn}
        raysDirection="down"
      />

      {/* Popisky žárovek mimo vodiče: horní mezi větvemi, dolní vlevo pod
          dolní větví (paprsky dolní žárovky míří dolů od těla) */}
      <text
        className="series-parallel-demo-label"
        x={PAR_TOP_BULB.x}
        y={108}
        textAnchor="middle"
      >
        Žárovka 1
      </text>
      <text
        className="series-parallel-demo-label"
        x={PAR_BOT_BULB_LEFT - 9}
        y={172}
        textAnchor="end"
      >
        Žárovka 2
      </text>

      <text
        className="series-parallel-demo-label"
        x={200}
        y={252}
        textAnchor="middle"
      >
        návratová cesta k −
      </text>

      {/* Statické směrové šipky: přívod, obě větve, návrat */}
      {visual.showArrows && (
        <g className="series-parallel-demo-arrow">
          {/* společný přívod: doprava */}
          <polygon points="110,64 110,76 124,70" />
          {/* horní větev: doprava */}
          <polygon points="196,64 196,76 210,70" />
          {/* horní větev: dolů ke spojovacímu uzlu */}
          <polygon points="330,100 342,100 336,114" />
          {/* dolní větev: dolů */}
          <polygon points="164,100 176,100 170,114" />
          {/* dolní větev: doprava ke spojovacímu uzlu */}
          <polygon points="296,144 296,156 310,150" />
          {/* společný návrat: doleva */}
          <polygon points="208,224 208,236 194,230" />
        </g>
      )}
    </svg>
  );
}

interface ScenarioPlayerProps {
  scenarioId: ScenarioId;
  calmMode: boolean;
  onScenarioCompleted: (id: ScenarioId) => void;
}

function SeriesParallelScenarioPlayer({
  scenarioId,
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
    status === 'paused' && showMotion ? ' series-parallel-demo-anim--paused' : '';

  // Flow overlay existuje jen v kroku „proud prochází“ (index 3) a jen když
  // autoplay dovoluje souvislý pohyb. Ruční krok 3 je plně statický.
  const showFlowOverlay = visual.flowActive && showMotion;

  // Jediný živý region je stavový řádek v AnimatedDemoControls. U klíčových
  // kroků nese i výsledek, aby čtečka nemusela číst SVG.
  let liveStepTitle = step.title;
  if (scenarioId === 'serial' && stepIndex === 3) {
    liveStepTitle = 'Proud prochází oběma žárovkami současně';
  } else if (scenarioId === 'serial' && stepIndex === 4) {
    liveStepTitle = 'Výsledek: jediná proudová cesta, obě žárovky svítí';
  } else if (scenarioId === 'parallel' && stepIndex === 3) {
    liveStepTitle = 'Proud se rozdělil do obou větví a slučuje se';
  } else if (scenarioId === 'parallel' && stepIndex === 4) {
    liveStepTitle = 'Výsledek: dvě proudové cesty, obě žárovky svítí';
  }

  return (
    <>
      {!motion.allowAutoPlay && (
        <p className="calm-step-hint">
          Automatické přehrávání je vypnuté — zapojení projdi vlastním tempem
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

      {/* Schéma je názorná grafika — úplný stav zapojení je vždy popsán
          textem ve výpisu stavu a v popisu kroku níže. */}
      <div className={`animated-demo__stage${pausedMod}`}>
        {scenarioId === 'serial' ? (
          <SerialCircuitSvg visual={visual} showFlowOverlay={showFlowOverlay} />
        ) : (
          <ParallelCircuitSvg
            visual={visual}
            showFlowOverlay={showFlowOverlay}
          />
        )}
      </div>

      <ul className="animated-demo__state" aria-label="Stav zapojení textem">
        {visual.panelRows.map((row) => (
          <li key={row.label}>
            {row.label}: <strong>{row.value}</strong>
          </li>
        ))}
      </ul>

      {/* Popis kroku je viditelný běžný text — není to druhý živý region;
          krok oznamuje jediný stavový řádek v ovládání. */}
      <div className="series-parallel-demo__explain">
        <strong>{step.title}.</strong> {step.description}
      </div>
    </>
  );
}

interface SeriesParallelDemoProps {
  demo: SeriesParallelDemoConfig;
  calmMode: boolean;
  onContinue: () => void;
}

export function SeriesParallelDemoView({
  demo,
  calmMode,
  onContinue,
}: SeriesParallelDemoProps) {
  const [activeScenarioId, setActiveScenarioId] = useState<ScenarioId>('serial');
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

  return (
    <section className="interactive-demo" aria-labelledby="demo-title">
      <h2 id="demo-title">Interaktivní ukázka</h2>
      <h3>{demo.title}</h3>
      <p>{demo.description}</p>

      {calmMode && (
        <p className="calm-step-hint">
          Projdi obě zapojení vlastním tempem ({completedScenarios.size} /{' '}
          {SCENARIO_META.length} hotovo).
        </p>
      )}

      {/* Statický pokyn (obsah se po načtení nemění) → běžný text, ne živý
          region, aby jediným měnícím se hlášením zůstal stav kroku. */}
      <p className="series-parallel-demo-switch-hint">
        Přepnutím zapojení se jeho průchod vrátí na začátek — hotová zapojení
        zůstávají hotová.
      </p>

      <div
        className="circuit-diagram__controls series-parallel-demo-scenarios"
        role="group"
        aria-label="Výběr zapojení"
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
      <SeriesParallelScenarioPlayer
        key={activeScenarioId}
        scenarioId={activeScenarioId}
        calmMode={calmMode}
        onScenarioCompleted={handleScenarioCompleted}
      />

      <p className="series-parallel-demo-progress">
        Dokončená zapojení: {completedScenarios.size} ze {SCENARIO_META.length}.
      </p>
      <p className="series-parallel-demo-note">{FLOW_NOTE}</p>
      <p className="series-parallel-demo-note">{BRIGHTNESS_NOTE}</p>
      <p className="series-parallel-demo-note">{CONVENTIONAL_NOTE}</p>

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
