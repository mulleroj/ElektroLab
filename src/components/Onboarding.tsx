import { useRef } from 'react';
import { useModalFocusManagement } from './useModalFocusManagement';

interface OnboardingProps {
  onClose: () => void;
  /**
   * Text zavíracího tlačítka. Při prvním spuštění „Rozumím, jdeme na to“,
   * při ručním otevření z tlačítka Úvod „Zpět do aplikace“.
   */
  closeLabel?: string;
}

export function Onboarding({
  onClose,
  closeLabel = 'Rozumím, jdeme na to',
}: OnboardingProps) {
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
            <strong>Lekce jsou krátké.</strong> Každá zabere zhruba 5–10 minut.
          </li>
          <li>
            <strong>Pokrok se ukládá jen v tomto prohlížeči.</strong> Nepotřebuješ
            účet. Pokrok se ukládá pouze v tomto zařízení a prohlížeči. Při použití
            jiného zařízení nebo prohlížeče se nepřenese. Po smazání dat prohlížeče
            může zmizet.
          </li>
          <li>
            <strong>Aplikace nenahrazuje učitele</strong> ani bezpečnostní pravidla.
            Na skutečném zařízení pracuj jen pod dohledem.
          </li>
        </ul>

        <section className="onboarding__section" aria-labelledby="onboarding-lesson-flow">
          <h3 id="onboarding-lesson-flow">Jak probíhá lekce</h3>
          <ol className="onboarding__list">
            <li>Krátké vysvětlení tématu.</li>
            <li>
              Úkol, rozhodnutí nebo interaktivní ukázka — ne každá lekce má
              ukázku, ale vždy je v ní aktivita.
            </li>
            <li>Mini test na závěr.</li>
            <li>
              XP získáš za první dokončení aktivity a mini testu.
            </li>
            <li>Za dokončené lekce dostaneš odznaky.</li>
            <li>
              Opakování je možné, ale stejné XP se znovu neudělí.
            </li>
          </ol>
        </section>

        <section className="onboarding__section" aria-labelledby="onboarding-ui-elements">
          <h3 id="onboarding-ui-elements">Co znamenají hlavní prvky</h3>
          <ul className="onboarding__points">
            <li>
              <strong>Pokračovat:</strong> vrátí tě k naposledy otevřené lekci
              (pokud jsi už nějakou otevřel).
            </li>
            <li>
              <strong>Klidný režim:</strong> omezí pohyb, animace a rušivé prvky.
              Obsah, otázky, XP ani pokrok se nemění — kurikulum se nezjednodušuje.
            </li>
            <li>
              <strong>Projektor:</strong> režim pro společnou práci ve třídě.
              Ukázky, úkoly i mini testy zůstávají, ale XP, odznaky ani pokrok se
              neukládají.
            </li>
            <li>
              <strong>Nahlásit problém:</strong> anonymní hlášení přímo z aplikace.
              Nevyplňuj jméno, e-mail ani třídu. Ve formuláři není školní e-mail
              příjemce.
            </li>
          </ul>
        </section>

        <section className="onboarding__section" aria-labelledby="onboarding-teachers">
          <h3 id="onboarding-teachers">Pro učitele</h3>
          <ul className="onboarding__list">
            <li>
              V <strong>Učitelském režimu</strong> rychle vybereš lekci a spustíš
              výběr <strong>Dnes do hodiny</strong>.
            </li>
            <li>
              Otevření na <strong>projektor</strong> zvětší zobrazení a neukládá
              pokrok ani XP.
            </li>
            <li>
              Můžeš zkopírovat přehled lekcí pro přípravu.
            </li>
            <li>
              Reset pokroku maže jen data v tomto zařízení a prohlížeči.
            </li>
            <li>
              Žáci nepotřebují účet ani školní e-mail.
            </li>
          </ul>
        </section>

        <button
          ref={closeButtonRef}
          type="button"
          className="btn btn--primary btn--large"
          onClick={onClose}
        >
          {closeLabel}
        </button>
      </section>
    </div>
  );
}
