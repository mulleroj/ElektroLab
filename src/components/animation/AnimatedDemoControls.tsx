import { useEffect, useRef } from 'react';
import type { AnimatedDemoStatus } from './useAnimatedDemo';
import { getFocusableElements } from '../../lib/focus';

interface AnimatedDemoControlsProps {
  status: AnimatedDemoStatus;
  stepIndex: number;
  stepCount: number;
  /** Krátký název aktuálního pedagogického kroku, např. „Pohyb kotvy“. */
  stepTitle: string;
  /**
   * Když je false (Klidný režim / prefers-reduced-motion), Spustit a Pauza
   * se vůbec nenabízejí — demo se prochází jen tlačítkem Další krok.
   */
  autoPlayAllowed: boolean;
  onPlay: () => void;
  onPause: () => void;
  onNextStep: () => void;
  onReset: () => void;
}

const statusLabels: Record<AnimatedDemoStatus, string> = {
  idle: 'připraveno, animace čeká na tebe',
  playing: 'animace běží',
  paused: 'pozastaveno',
  completed: 'dokončeno',
};

/**
 * Jednotné ovládání animovaných dem (Spustit / Pauza / Další krok /
 * Resetovat). Nezapisuje žádný progress ani localStorage — jen volá
 * callbacky z useAnimatedDemo. Stav oznamuje i textem (aria-live).
 *
 * MVP-12A2: když se fokusované tlačítko změnou stavu zakáže (Resetovat po
 * návratu na začátek, Pauza po doběhnutí animace…), fokus by tiše spadl na
 * body — místo toho přejde na první dostupné tlačítko skupiny. Oprava se
 * spouští jen dokud je fokus uvnitř skupiny, takže běžné autoplay změny
 * kroku ani práci uživatele jinde na stránce fokus nikdy nepřesouvají.
 */
export function AnimatedDemoControls({
  status,
  stepIndex,
  stepCount,
  stepTitle,
  autoPlayAllowed,
  onPlay,
  onPause,
  onNextStep,
  onReset,
}: AnimatedDemoControlsProps) {
  const completed = status === 'completed';
  const atInitialState = status === 'idle' && stepIndex === 0;

  const buttonsRef = useRef<HTMLDivElement>(null);
  // Fokus patří skupině ovládacích tlačítek. Prohlížeč při zakázání
  // fokusovaného tlačítka blur/focusout spolehlivě nevystřelí (fokus
  // zmizí tiše na body), proto se příznak vede ručně: zapíná ho klik na
  // tlačítko skupiny a focusin, vypíná focusout při skutečném odchodu
  // na jiný živý prvek.
  const focusWithinRef = useRef(false);

  // Po každém renderu (stav se mění jen přes props): pokud fokus patřil
  // skupině a teď je pryč nebo visí na zakázaném tlačítku, vrátí se na
  // první dostupné tlačítko. Pokrývá kliknutí, které zakáže vlastní
  // tlačítko (Resetovat, Pauza…), i samovolné doběhnutí animace se
  // zakázáním Pauzy. Když je fokus platný nebo patří jinému prvku
  // stránky, nic se neděje — autoplay změny kroku samy o sobě fokus
  // nepřesouvají a smyčka vzniknout nemůže (návrat fokusu do skupiny
  // podmínku hned zneplatní).
  useEffect(() => {
    const group = buttonsRef.current;
    if (!group) {
      return;
    }
    const active = document.activeElement;
    const focusValid =
      active instanceof HTMLElement &&
      group.contains(active) &&
      !(active instanceof HTMLButtonElement && active.disabled);
    if (focusWithinRef.current && !focusValid) {
      const focusLost =
        !(active instanceof HTMLElement) ||
        active === document.body ||
        (active instanceof HTMLButtonElement &&
          active.disabled &&
          group.contains(active));
      if (focusLost) {
        getFocusableElements(group)[0]?.focus();
        return;
      }
    }
    focusWithinRef.current = focusValid;
  });

  // focusin/focusout drží příznak aktuální i při pohybu klávesnicí bez
  // kliknutí (Tab na tlačítko a pryč z něj). focusout ze zakázaného
  // tlačítka příznak nechává — právě ten případ řeší efekt výše.
  useEffect(() => {
    const group = buttonsRef.current;
    if (!group) {
      return;
    }
    const handleFocusIn = () => {
      focusWithinRef.current = true;
    };
    const handleFocusOut = (event: globalThis.FocusEvent) => {
      if (event.target instanceof HTMLButtonElement && event.target.disabled) {
        return;
      }
      const next = event.relatedTarget;
      if (next instanceof Node && group.contains(next)) {
        return;
      }
      focusWithinRef.current = false;
    };
    group.addEventListener('focusin', handleFocusIn);
    group.addEventListener('focusout', handleFocusOut);
    return () => {
      group.removeEventListener('focusin', handleFocusIn);
      group.removeEventListener('focusout', handleFocusOut);
    };
  }, []);

  // Klik na tlačítko skupiny znamená, že fokus má patřit skupině — funguje
  // i tam, kde prohlížeč focus eventy nedoručí.
  const withFocusClaim = (action: () => void) => () => {
    focusWithinRef.current = true;
    action();
  };

  return (
    <div className="animated-demo-controls">
      <div
        ref={buttonsRef}
        className="animated-demo-controls__buttons"
        role="group"
        aria-label="Ovládání animace"
        onFocus={() => {
          focusWithinRef.current = true;
        }}
        onBlur={(event) => {
          // Přesun uvnitř skupiny příznak nemění; blur ze zakázaného
          // tlačítka (pokud ho prohlížeč vůbec vystřelí) taky ne — o ten
          // fokus se stará efekt výše.
          const next = event.relatedTarget;
          if (next instanceof Node && buttonsRef.current?.contains(next)) {
            return;
          }
          if (event.target instanceof HTMLButtonElement && event.target.disabled) {
            return;
          }
          focusWithinRef.current = false;
        }}
      >
        {autoPlayAllowed && (
          <>
            <button
              type="button"
              className="btn btn--primary"
              onClick={withFocusClaim(onPlay)}
              disabled={status === 'playing' || completed}
            >
              <span aria-hidden="true">▶ </span>Spustit
            </button>
            <button
              type="button"
              className="btn btn--secondary"
              onClick={withFocusClaim(onPause)}
              disabled={status !== 'playing'}
            >
              <span aria-hidden="true">⏸ </span>Pauza
            </button>
          </>
        )}
        <button
          type="button"
          className="btn btn--secondary"
          onClick={withFocusClaim(onNextStep)}
          disabled={completed}
        >
          Další krok
        </button>
        <button
          type="button"
          className="btn btn--secondary"
          onClick={withFocusClaim(onReset)}
          disabled={atInitialState}
        >
          Resetovat
        </button>
      </div>
      {/* Viditelný stavový řádek: v accessibility tree zůstává dohledatelný
          (číslo a název kroku), ale není živý region — jinak by autoplay
          chrlil hlášení každé ~2 s. Live oznámení zajišťuje skrytý status níže. */}
      <p className="animated-demo-controls__status">
        Krok {stepIndex + 1} z {stepCount}: {stepTitle} — {statusLabels[status]}.
      </p>
      {/* Živý region pro čtečku: při autoplay ohlásí jen start animace,
          při ručním krokování, pauze a dokončení přesný aktuální krok. */}
      <p className="visually-hidden" role="status">
        {status === 'playing'
          ? 'Animace běží.'
          : `Krok ${stepIndex + 1} z ${stepCount}: ${stepTitle} — ${statusLabels[status]}.`}
      </p>
    </div>
  );
}
