import { useRef } from 'react';
import { useModalFocusManagement } from './useModalFocusManagement';

interface OnboardingProps {
  onClose: () => void;
}

export function Onboarding({ onClose }: OnboardingProps) {
  const dialogRef = useRef<HTMLElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useModalFocusManagement({
    containerRef: dialogRef,
    initialFocusRef: closeButtonRef,
    onEscape: onClose,
    // Při prvním spuštění onboarding neotevřelo žádné tlačítko — fokus se
    // pak vrací na hlavní obsah aplikace místo na body.
    getFallbackFocusTarget: () =>
      document.querySelector<HTMLElement>('.app-main'),
  });

  return (
    <div className="onboarding-overlay">
      <section
        ref={dialogRef}
        className="onboarding"
        role="dialog"
        aria-modal="true"
        aria-labelledby="onboarding-title"
      >
        <h2 id="onboarding-title">⚡ Vítej v ElektroLabu</h2>
        <ul className="onboarding__points">
          <li>
            <strong>Co je ElektroLab?</strong> Interaktivní mikrolekce pro obor
            elektrikář — skládáš, rozhoduješ a zkoušíš si principy v simulaci.
          </li>
          <li>
            <strong>Je to školní simulace.</strong> Nic tady není návod k práci na
            skutečném elektrickém zařízení.
          </li>
          <li>
            <strong>Lekce jsou krátké.</strong> Každá zabere zhruba 5–10 minut a má
            ukázku, úkol a mini test.
          </li>
          <li>
            <strong>Pokrok se ukládá jen v tomto prohlížeči.</strong> Bez účtů a bez
            internetu — když smažeš data prohlížeče, pokrok zmizí.
          </li>
          <li>
            <strong>Aplikace nenahrazuje učitele</strong> ani bezpečnostní pravidla.
            Na skutečném zařízení pracuj jen pod dohledem.
          </li>
        </ul>
        <button
          ref={closeButtonRef}
          type="button"
          className="btn btn--primary btn--large"
          onClick={onClose}
        >
          Rozumím, jdeme na to
        </button>
      </section>
    </div>
  );
}
