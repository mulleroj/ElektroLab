import { useEffect, useState } from 'react';
import type { TransformerDemoConfig } from '../../types';
import { AnimatedDemoControls } from '../animation/AnimatedDemoControls';
import { useAnimatedDemo } from '../animation/useAnimatedDemo';
import { useMotionPolicy } from '../animation/useMotionPolicy';

interface TransformerDemoProps {
  demo: TransformerDemoConfig;
  calmMode: boolean;
  onContinue: () => void;
}

type TurnsVariant = 'less' | 'same' | 'more';

interface TransformerStep {
  title: string;
  description: string;
}

// Názorná školní ukázka principu transformátoru — nejde o fyzikálně přesnou
// simulaci (ztráty, proudy, fázový posun ani magnetizační jevy se neřeší)
// a nikdy neslouží jako návod na práci se skutečným transformátorem.
// Krok 5 (výsledek) má text podle zvolené varianty závitů — viz VARIANTS.
const STEPS: TransformerStep[] = [
  {
    title: 'Výchozí stav',
    description:
      'Transformátor je v klidovém stavu. Na primárním vinutí není žádné napětí, jádrem neprochází magnetický tok a na sekundáru se nic neindukuje.',
  },
  {
    title: 'Střídavé napětí na primáru',
    description:
      'Na primární vinutí je přivedeno střídavé napětí. Jeho polarita se pravidelně střídá — plus a minus si vyměňují místa.',
  },
  {
    title: 'Proud v primárním vinutí',
    description:
      'Střídavý proud v primárním vinutí vytváří měnící se magnetické pole. Proud teče chvíli jedním a chvíli druhým směrem.',
  },
  {
    title: 'Magnetický tok v jádře',
    description:
      'Měnící se magnetický tok se vede magnetickým jádrem. Uzavřené jádro ho přivede až k sekundárnímu vinutí.',
  },
  {
    title: 'Indukce v sekundáru',
    description:
      'Měnící se magnetický tok indukuje napětí v sekundárním vinutí. Obě vinutí spojuje jen magnetické pole — žádný vodič.',
  },
  {
    title: 'Výsledek podle závitů',
    description: '', // nahrazuje se textem zvolené varianty (resultDescription)
  },
];

const RESULT_STEP = STEPS.length - 1;

// Svislé polohy závitů — počty (6 vs. 3/6/9) jsou jen názorný model poměru
// závitů, ne skutečné počty závitů reálného transformátoru.
const PRIMARY_TURNS_Y = [135, 155, 175, 195, 215, 235];

function turnsCenteredAround(count: number, spacing: number): number[] {
  const first = 185 - ((count - 1) * spacing) / 2;
  return Array.from({ length: count }, (_, i) => first + i * spacing);
}

const VARIANTS: {
  id: TurnsVariant;
  label: string;
  turnsWord: string;
  outputLabel: string;
  resultWord: string;
  arrow: string;
  turnsY: number[];
  /** Relativní výška sloupce výstupního napětí (vstup = 0.6). */
  barScale: number;
  resultDescription: string;
}[] = [
  {
    id: 'less',
    label: 'Sekundár: méně závitů',
    turnsWord: 'méně závitů',
    outputLabel: 'nižší než na vstupu',
    resultWord: '↓ nižší',
    arrow: '↓',
    turnsY: turnsCenteredAround(3, 20),
    barScale: 0.35,
    resultDescription:
      'Sekundár má méně závitů než primár, takže se v něm indukuje nižší napětí. Takový transformátor napětí snižuje — třeba v nabíječce telefonu.',
  },
  {
    id: 'same',
    label: 'Sekundár: stejně závitů',
    turnsWord: 'stejně závitů',
    outputLabel: 'přibližně stejné jako na vstupu',
    resultWord: '≈ přibližně stejné',
    arrow: '≈',
    turnsY: turnsCenteredAround(6, 20),
    barScale: 0.6,
    resultDescription:
      'Sekundár má přibližně stejně závitů jako primár, takže výstupní napětí zůstane přibližně stejné. Takový transformátor hlavně bezpečně odděluje obvody.',
  },
  {
    id: 'more',
    label: 'Sekundár: více závitů',
    turnsWord: 'více závitů',
    outputLabel: 'vyšší než na vstupu',
    resultWord: '↑ vyšší',
    arrow: '↑',
    turnsY: turnsCenteredAround(9, 14),
    barScale: 0.9,
    resultDescription:
      'Sekundár má více závitů než primár, takže se v něm indukuje vyšší napětí. Takový transformátor napětí zvyšuje — třeba pro dálkový přenos energie.',
  },
];

// Výška vstupního napětí na sloupci výstupu — referenční čárka „vstup“.
const INPUT_LEVEL = 0.6;
const METER_INNER_TOP = 123;
const METER_INNER_HEIGHT = 124;
const REF_LINE_Y =
  METER_INNER_TOP + METER_INNER_HEIGHT - METER_INNER_HEIGHT * INPUT_LEVEL;

export function TransformerDemoView({
  demo,
  calmMode,
  onContinue,
}: TransformerDemoProps) {
  const motion = useMotionPolicy(calmMode);
  const playback = useAnimatedDemo({
    stepCount: STEPS.length,
    autoPlayAllowed: motion.allowAutoPlay,
  });
  const { status, stepIndex } = playback;

  const [variantId, setVariantId] = useState<TurnsVariant>('less');
  const [tried, setTried] = useState<Set<TurnsVariant>>(new Set());

  const variant = VARIANTS.find((v) => v.id === variantId) ?? VARIANTS[0];

  // Vyzkoušená varianta = žák u ní viděl výsledný stav v kroku 5. Množina se
  // nikdy nezmenšuje — Reset ani přepnutí varianty povolení neodebírá.
  useEffect(() => {
    if (stepIndex !== RESULT_STEP) {
      return;
    }
    setTried((prev) =>
      prev.has(variantId) ? prev : new Set(prev).add(variantId),
    );
  }, [stepIndex, variantId]);

  // Přepnutí varianty: u dokončené ukázky se rovnou ukáže výsledek nové
  // varianty (sekvenci není nutné přehrávat třikrát), jinak se ukázka vrátí
  // do kroku 0 — reset() zároveň zruší případný naplánovaný timeout, takže
  // nikdy neběží animace dvou konfigurací najednou.
  const handleVariant = (id: TurnsVariant) => {
    if (id === variantId) {
      return;
    }
    setVariantId(id);
    if (status !== 'completed') {
      playback.reset();
    }
  };

  const step = STEPS[stepIndex];
  const stepDescription =
    stepIndex === RESULT_STEP ? variant.resultDescription : step.description;

  // Vizuální příznaky odvozené čistě z pedagogického kroku.
  const primaryEnergized = stepIndex >= 1;
  const primaryCurrent = stepIndex >= 2;
  const fluxActive = stepIndex >= 3;
  const secondaryActive = stepIndex >= 4;
  const resultShown = stepIndex >= RESULT_STEP;

  const moving = motion.allowContinuousMotion;
  const pausedMod = status === 'paused' ? ' transformer-anim--paused' : '';

  const inputWire = `transformer-wire${
    primaryEnergized ? ' transformer-wire--on' : ''
  }${primaryCurrent && moving ? ` transformer-wire--current${pausedMod}` : ''}`;
  const outputWire = `transformer-wire${
    secondaryActive ? ' transformer-wire--on' : ''
  }${secondaryActive && moving ? ` transformer-wire--current${pausedMod}` : ''}`;
  const fluxClass = `transformer-flux${
    fluxActive ? ' transformer-flux--visible' : ''
  }${fluxActive && moving ? ` transformer-flux--moving${pausedMod}` : ''}`;
  const primaryTurnClass = `transformer-turn${
    primaryCurrent ? ' transformer-turn--on' : ''
  }`;
  const secondaryTurnClass = `transformer-turn${
    secondaryActive ? ' transformer-turn--on' : ''
  }`;

  const outputStateLabel = resultShown
    ? variant.outputLabel
    : secondaryActive
      ? 'indukuje se'
      : 'žádné';

  const canContinue = playback.hasCompletedOnce && tried.size === VARIANTS.length;

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

      {/* Schéma je názorná grafika — úplný stav transformátoru je vždy popsán
          textem ve výpisu stavu, v popisu kroku a u výběru varianty níže. */}
      <div className="animated-demo__stage">
        <svg
          className="transformer-svg"
          viewBox="0 0 640 350"
          aria-hidden="true"
          focusable="false"
        >
          <text className="transformer-label" x={95} y={60} textAnchor="middle">
            VSTUP
          </text>
          <text className="transformer-label" x={538} y={60} textAnchor="middle">
            VÝSTUP
          </text>

          {/* Magnetické jádro s oknem a smyčkou magnetického toku */}
          <rect
            className="transformer-core"
            x={250}
            y={70}
            width={150}
            height={230}
            rx={10}
          />
          <rect
            className="transformer-core-window"
            x={298}
            y={118}
            width={54}
            height={134}
            rx={6}
          />
          <path className={fluxClass} d="M 274 94 H 376 V 276 H 274 Z" />
          <text
            className={`transformer-label${fluxActive ? ' transformer-label--state' : ''}`}
            x={325}
            y={58}
            textAnchor="middle"
          >
            {fluxActive ? 'jádrem prochází měnící se tok' : 'magnetické jádro'}
          </text>

          {/* Zdroj střídavého napětí a vstupní vodiče */}
          <circle
            className={`transformer-source${
              primaryEnergized ? ' transformer-source--on' : ''
            }`}
            cx={95}
            cy={185}
            r={24}
          />
          <text
            className="transformer-source-symbol"
            x={95}
            y={194}
            textAnchor="middle"
          >
            ~
          </text>
          {primaryEnergized && moving && (
            <g className={`transformer-polarity${pausedMod}`}>
              <g className="transformer-polarity__a">
                <text x={58} y={152}>
                  +
                </text>
                <text x={58} y={232}>
                  −
                </text>
              </g>
              <g className="transformer-polarity__b">
                <text x={58} y={152}>
                  −
                </text>
                <text x={58} y={232}>
                  +
                </text>
              </g>
            </g>
          )}
          {primaryEnergized && !moving && (
            <>
              <text className="transformer-polarity-static" x={58} y={152}>
                ±
              </text>
              <text className="transformer-polarity-static" x={58} y={232}>
                ∓
              </text>
            </>
          )}
          <path className={inputWire} d="M 95 161 V 130 H 242" />
          <path className={inputWire} d="M 95 209 V 240 H 242" />
          {primaryCurrent && (
            <text
              className="transformer-label transformer-label--state"
              x={167}
              y={120}
              textAnchor="middle"
            >
              ⇄ střídavý proud
            </text>
          )}

          {/* Primární vinutí (levý sloupek jádra) */}
          {PRIMARY_TURNS_Y.map((y) => (
            <ellipse
              key={y}
              className={primaryTurnClass}
              cx={274}
              cy={y}
              rx={34}
              ry={8}
            />
          ))}

          {/* Sekundární vinutí (pravý sloupek) — počet závitů podle varianty */}
          {variant.turnsY.map((y) => (
            <ellipse
              key={y}
              className={secondaryTurnClass}
              cx={376}
              cy={y}
              rx={34}
              ry={8}
            />
          ))}

          {/* Výstupní vodiče a indikátor výstupního napětí */}
          <path className={outputWire} d="M 410 130 H 480 V 150 H 514" />
          <path className={outputWire} d="M 410 240 H 480 V 220 H 514" />
          <circle className="transformer-terminal" cx={516} cy={150} r={4} />
          <circle className="transformer-terminal" cx={516} cy={220} r={4} />
          {secondaryActive && (
            <text
              className="transformer-label transformer-label--state"
              x={445}
              y={118}
              textAnchor="middle"
            >
              ⇄
            </text>
          )}

          <rect
            className={`transformer-meter${
              secondaryActive ? ' transformer-meter--on' : ''
            }`}
            x={520}
            y={120}
            width={36}
            height={130}
          />
          <rect
            className="transformer-meter-fill"
            x={523}
            y={METER_INNER_TOP}
            width={30}
            height={METER_INNER_HEIGHT}
            style={{ transform: `scaleY(${resultShown ? variant.barScale : 0})` }}
          />
          <line
            className="transformer-ref-line"
            x1={512}
            y1={REF_LINE_Y}
            x2={564}
            y2={REF_LINE_Y}
          />
          <text
            className="transformer-label transformer-label--small"
            x={506}
            y={REF_LINE_Y + 4}
            textAnchor="end"
          >
            vstup
          </text>

          {/* Popisky */}
          <text className="transformer-label" x={95} y={268} textAnchor="middle">
            Zdroj střídavého napětí
          </text>
          <text className="transformer-label" x={274} y={320} textAnchor="middle">
            Primár
          </text>
          <text className="transformer-label" x={376} y={320} textAnchor="middle">
            Sekundár
          </text>
          <text
            className="transformer-label transformer-label--state"
            x={376}
            y={338}
            textAnchor="middle"
          >
            {variant.turnsWord}
          </text>
          <text className="transformer-label" x={538} y={285} textAnchor="middle">
            Výstupní napětí
          </text>
          <text
            className="transformer-label transformer-label--state"
            x={538}
            y={303}
            textAnchor="middle"
          >
            {resultShown ? variant.resultWord : secondaryActive ? 'indukuje se' : 'žádné'}
          </text>
        </svg>
      </div>

      <ul className="animated-demo__state" aria-label="Stav transformátoru textem">
        <li>
          Primár:{' '}
          <strong>
            {primaryCurrent
              ? 'střídavé napětí, protéká proud'
              : primaryEnergized
                ? 'střídavé napětí (polarita se střídá)'
                : 'bez napětí'}
          </strong>
        </li>
        <li>
          Magnetický tok: <strong>{fluxActive ? 'mění se a prochází jádrem' : 'žádný'}</strong>
        </li>
        <li>
          Sekundár:{' '}
          <strong>{secondaryActive ? 'indukuje se napětí' : 'bez napětí'}</strong>
        </li>
        <li>
          Výstupní napětí: <strong>{outputStateLabel}</strong>
        </li>
      </ul>

      <div
        className="circuit-diagram__controls"
        role="group"
        aria-label="Volba počtu závitů sekundárního vinutí"
      >
        {VARIANTS.map((v) => (
          <button
            key={v.id}
            type="button"
            className={`btn btn--secondary${variantId === v.id ? ' btn--active' : ''}`}
            onClick={() => handleVariant(v.id)}
            aria-pressed={variantId === v.id}
          >
            {tried.has(v.id) ? '✔ ' : ''}
            {v.label}
          </button>
        ))}
      </div>
      <p className="transformer-tried">
        Vybraná varianta: {variant.label}. Vyzkoušené varianty: {tried.size} ze{' '}
        {VARIANTS.length}.
      </p>
      <p className="transformer-variant-note">
        {status === 'completed'
          ? 'Ukázka stojí na výsledku — přepnutím varianty rovnou uvidíš výsledek pro jiný počet závitů. Celou animaci znovu spustíš přes Resetovat a Spustit.'
          : 'Po přepnutí varianty se ukázka vrátí do klidového stavu — animaci pro novou variantu spusť znovu, nebo ji projdi tlačítkem Další krok.'}
      </p>

      <div className="logic-gate__explain">
        <strong>{step.title}.</strong> {stepDescription}
      </div>

      <button
        type="button"
        className="btn btn--primary"
        onClick={onContinue}
        disabled={!canContinue}
      >
        Rozumím, pokračovat na úkol
      </button>
    </section>
  );
}
