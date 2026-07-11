import type { ContactorRelayDemoConfig } from '../../types';
import { AnimatedDemoControls } from '../animation/AnimatedDemoControls';
import { useAnimatedDemo } from '../animation/useAnimatedDemo';
import { useMotionPolicy } from '../animation/useMotionPolicy';

interface ContactorRelayDemoProps {
  demo: ContactorRelayDemoConfig;
  calmMode: boolean;
  onContinue: () => void;
}

interface ContactorStep {
  title: string;
  description: string;
}

// Názorná školní ukázka principu stykače — nejde o fyzikálně přesnou
// simulaci přechodových dějů ani o návod na skutečné zapojení.
const STEPS: ContactorStep[] = [
  {
    title: 'Výchozí stav',
    description:
      'Cívka je bez napětí. Pružina drží kotvu v klidové poloze, hlavní kontakt je rozepnutý — výkonový obvod je přerušený a motor stojí.',
  },
  {
    title: 'Aktivace ovládacího obvodu',
    description:
      'Spínač v ovládacím obvodu se sepnul a přivedl napětí na cívku stykače. Cívkou prochází malý ovládací proud a kolem ní vzniká magnetické pole.',
  },
  {
    title: 'Pohyb kotvy',
    description:
      'Magnetické pole přitahuje pohyblivou kotvu k jádru cívky. Kotva se mechanicky dává do pohybu a překonává sílu pružiny.',
  },
  {
    title: 'Sepnutí kontaktu',
    description:
      'Kotva dosedla a její pohyb uzavřel hlavní kontakt. Výkonový obvod je teď spojitý — malý ovládací obvod tak řídí úplně jiný, silnější obvod.',
  },
  {
    title: 'Motor běží',
    description:
      'Výkonovým obvodem prochází proud a motor běží. Ovládací a výkonový obvod zůstávají oddělené — spojuje je jen mechanický pohyb kontaktu, žádný drát.',
  },
  {
    title: 'Vypnutí',
    description:
      'Spínač se rozepnul a cívka je bez napětí. Magnetické pole zaniklo, pružina vrátila kotvu do klidové polohy, kontakt se rozepnul a motor se zastavil.',
  },
];

export function ContactorRelayDemoView({
  demo,
  calmMode,
  onContinue,
}: ContactorRelayDemoProps) {
  const motion = useMotionPolicy(calmMode);
  const playback = useAnimatedDemo({
    stepCount: STEPS.length,
    autoPlayAllowed: motion.allowAutoPlay,
  });
  const { status, stepIndex } = playback;
  const step = STEPS[stepIndex];

  // Vizuální stav odvozený z pedagogického kroku (krok 5 = návrat do klidu).
  const coilOn = stepIndex >= 1 && stepIndex <= 4;
  const contactClosed = stepIndex >= 3 && stepIndex <= 4;
  const motorRunning = stepIndex === 4;
  // Kotva má jeden souvislý zdvih 24 px; krok 2 ukazuje pohyb v mezipoloze,
  // krok 3 dokončí zdvih a tím sepne kontakt.
  const armatureTravel = contactClosed ? 24 : stepIndex === 2 ? 14 : 0;

  const armatureLabel =
    stepIndex === 2 ? 'přitahuje se' : contactClosed ? 'přitažená' : 'v klidové poloze';

  const controlWire = `contactor-wire${coilOn ? ' contactor-wire--on' : ''}`;
  const powerWire = `contactor-wire${contactClosed ? ' contactor-wire--on' : ''}`;
  const rotorClass = `contactor-rotor${
    motorRunning && motion.allowContinuousMotion ? ' contactor-rotor--spinning' : ''
  }${status === 'paused' ? ' contactor-rotor--paused' : ''}`;

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

      {/* Schéma je názorná grafika — úplný stav zařízení je vždy popsán
          textem ve výpisu stavu a v popisu kroku níže. */}
      <div className="animated-demo__stage">
        <svg
          className="contactor-svg"
          viewBox="0 0 640 340"
          aria-hidden="true"
          focusable="false"
        >
          {/* --- Výkonový obvod (nahoře) --- */}
          <text className="contactor-label" x={320} y={30}>
            Výkonový obvod (velký proud)
          </text>
          <text className="contactor-label" x={320} y={88} textAnchor="middle">
            L
          </text>
          <circle className="contactor-terminal" cx={320} cy={103} r={4} />
          <line className={powerWire} x1={324} y1={103} x2={435} y2={103} />
          <line className={powerWire} x1={505} y1={103} x2={545} y2={103} />
          <line className={powerWire} x1={605} y1={103} x2={628} y2={103} />
          <circle className="contactor-terminal" cx={632} cy={103} r={4} />
          <text className="contactor-label" x={632} y={88} textAnchor="middle">
            N
          </text>

          {/* Pevné kontakty výkonového obvodu */}
          <text className="contactor-label" x={470} y={48} textAnchor="middle">
            Kontakt
          </text>
          <rect className="contactor-pad" x={435} y={96} width={20} height={14} />
          <rect className="contactor-pad" x={485} y={96} width={20} height={14} />

          {/* Motor se symbolem rotoru */}
          <circle className="contactor-motor" cx={575} cy={103} r={30} />
          <g className={rotorClass}>
            <line x1={575} y1={85} x2={575} y2={121} />
            <line x1={559.4} y1={94} x2={590.6} y2={112} />
            <line x1={559.4} y1={112} x2={590.6} y2={94} />
          </g>
          <text className="contactor-label" x={575} y={152} textAnchor="middle">
            Motor
          </text>
          <text
            className="contactor-label contactor-label--state"
            x={575}
            y={170}
            textAnchor="middle"
          >
            {motorRunning ? '↻ běží' : 'stojí'}
          </text>

          {/* --- Pohyblivá sestava: můstek kontaktu + táhlo + kotva --- */}
          <g
            className="contactor-moving"
            style={{ transform: `translateY(${armatureTravel}px)` }}
          >
            <rect className="contactor-bridge" x={430} y={60} width={80} height={12} />
            <rect className="contactor-rod" x={462} y={72} width={8} height={78} />
            <rect
              className="contactor-armature"
              x={220}
              y={150}
              width={290}
              height={16}
            />
          </g>
          <text className="contactor-label" x={365} y={142} textAnchor="middle">
            Kotva
          </text>

          {/* --- Cívka s naznačeným magnetickým polem --- */}
          <g
            className={`contactor-field${coilOn ? ' contactor-field--visible' : ''}`}
          >
            <path d="M 245 186 Q 275 168 305 186" />
            <path d="M 252 189 Q 275 176 298 189" />
          </g>
          <rect
            className={`contactor-coil${coilOn ? ' contactor-coil--on' : ''}`}
            x={240}
            y={190}
            width={70}
            height={60}
          />
          <line className="contactor-winding" x1={254} y1={196} x2={254} y2={244} />
          <line className="contactor-winding" x1={268} y1={196} x2={268} y2={244} />
          <line className="contactor-winding" x1={282} y1={196} x2={282} y2={244} />
          <line className="contactor-winding" x1={296} y1={196} x2={296} y2={244} />
          <text className="contactor-label" x={275} y={270} textAnchor="middle">
            Cívka
          </text>

          {/* --- Ovládací obvod (dole) --- */}
          <line className="contactor-battery" x1={46} y1={252} x2={74} y2={252} />
          <line
            className="contactor-battery contactor-battery--short"
            x1={54}
            y1={262}
            x2={66}
            y2={262}
          />
          <line className={controlWire} x1={60} y1={252} x2={60} y2={220} />
          <line className={controlWire} x1={60} y1={220} x2={107} y2={220} />
          <circle className="contactor-terminal" cx={110} cy={220} r={4} />
          <g transform="translate(110, 220)">
            <line
              className="contactor-switch-blade"
              x1={0}
              y1={0}
              x2={36}
              y2={0}
              style={{ transform: coilOn ? 'rotate(0deg)' : 'rotate(-28deg)' }}
            />
          </g>
          <circle className="contactor-terminal" cx={146} cy={220} r={4} />
          <text className="contactor-label" x={112} y={245}>
            spínač
          </text>
          <line className={controlWire} x1={146} y1={220} x2={240} y2={220} />
          <line className={controlWire} x1={310} y1={220} x2={350} y2={220} />
          <line className={controlWire} x1={350} y1={220} x2={350} y2={300} />
          <line className={controlWire} x1={350} y1={300} x2={60} y2={300} />
          <line className={controlWire} x1={60} y1={300} x2={60} y2={262} />
          <text className="contactor-label" x={48} y={325}>
            Ovládací obvod (malé napětí)
          </text>
        </svg>
      </div>

      <ul className="animated-demo__state" aria-label="Stav zařízení textem">
        <li>
          Cívka: <strong>{coilOn ? 'pod napětím' : 'bez napětí'}</strong>
        </li>
        <li>
          Kotva: <strong>{armatureLabel}</strong>
        </li>
        <li>
          Kontakt: <strong>{contactClosed ? 'sepnutý' : 'rozepnutý'}</strong>
        </li>
        <li>
          Motor: <strong>{motorRunning ? 'běží' : 'stojí'}</strong>
        </li>
      </ul>

      <div className="logic-gate__explain">
        <strong>{step.title}.</strong> {step.description}
      </div>

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
