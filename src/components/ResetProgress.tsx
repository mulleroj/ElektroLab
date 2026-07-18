import { useRef, useState } from 'react';
import { useModalFocusManagement } from './useModalFocusManagement';

interface ResetProgressProps {
  onReset: () => void;
}

interface ResetConfirmDialogProps {
  onConfirm: () => void;
  onCancel: () => void;
  getFallbackFocusTarget: () => HTMLElement | null;
}

/**
 * MVP-12A2: potvrzovací dialog jako samostatná komponenta, aby se focus
 * trap (useModalFocusManagement) montoval jen po dobu otevření dialogu.
 * Počáteční fokus zůstává na bezpečném tlačítku „Zrušit", Escape zavírá
 * bez mazání a po zavření se fokus vrací na otevírací tlačítko.
 */
function ResetConfirmDialog({
  onConfirm,
  onCancel,
  getFallbackFocusTarget,
}: ResetConfirmDialogProps) {
  const dialogRef = useRef<HTMLElement>(null);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);

  useModalFocusManagement({
    containerRef: dialogRef,
    initialFocusRef: cancelButtonRef,
    onEscape: onCancel,
    getFallbackFocusTarget,
  });

  return (
    <div className="onboarding-overlay">
      <section
        ref={dialogRef}
        className="onboarding reset-progress__dialog"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="reset-dialog-title"
        aria-describedby="reset-dialog-description"
      >
        <h2 id="reset-dialog-title">Smazat pokrok v tomto zařízení?</h2>
        <div id="reset-dialog-description">
          <p>Z tohoto zařízení bude odstraněno:</p>
          <ul className="reset-progress__list">
            <li>získané XP,</li>
            <li>dokončené aktivity a mini testy,</li>
            <li>skóre mini testů,</li>
            <li>získané odznaky,</li>
            <li>informace o poslední rozpracované lekci.</li>
          </ul>
          <p>Tuto akci nejde vrátit zpět.</p>
        </div>
        <div className="reset-progress__actions">
          <button type="button" className="btn btn--danger" onClick={onConfirm}>
            Ano, smazat pokrok
          </button>
          <button
            ref={cancelButtonRef}
            type="button"
            className="btn btn--secondary"
            onClick={onCancel}
          >
            Zrušit
          </button>
        </div>
      </section>
    </div>
  );
}

/**
 * MVP-12A: uživatelský reset pokroku v tomto zařízení.
 * První kliknutí jen otevře potvrzovací dialog; data se mažou až po
 * výslovném potvrzení. Dialog je ovladatelný klávesnicí (fokus na
 * „Zrušit", plný Tab trap, Escape zavírá bez mazání).
 */
export function ResetProgress({ onReset }: ResetProgressProps) {
  const [confirming, setConfirming] = useState(false);
  const [done, setDone] = useState(false);
  const openButtonRef = useRef<HTMLButtonElement>(null);

  const handleCancel = () => {
    setConfirming(false);
  };

  const handleConfirm = () => {
    onReset();
    setConfirming(false);
    setDone(true);
  };

  return (
    <section className="reset-progress" aria-labelledby="reset-progress-title">
      <h2 id="reset-progress-title">Správa pokroku</h2>
      <p>
        Pokrok se ukládá jen v tomto prohlížeči. Tady ho můžeš smazat, například
        když zařízení předáváš dalšímu žákovi.
      </p>
      <button
        ref={openButtonRef}
        type="button"
        className="btn btn--secondary"
        onClick={() => {
          setDone(false);
          setConfirming(true);
        }}
      >
        Smazat pokrok v tomto zařízení
      </button>
      <p className="reset-progress__status" role="status">
        {done ? 'Pokrok v tomto zařízení byl smazán.' : ''}
      </p>

      {confirming && (
        <ResetConfirmDialog
          onConfirm={handleConfirm}
          onCancel={handleCancel}
          getFallbackFocusTarget={() => openButtonRef.current}
        />
      )}
    </section>
  );
}
