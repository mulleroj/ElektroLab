import { useEffect, useRef, useState } from 'react';

interface ResetProgressProps {
  onReset: () => void;
}

/**
 * MVP-12A: uživatelský reset pokroku v tomto zařízení.
 * První kliknutí jen otevře potvrzovací dialog; data se mažou až po
 * výslovném potvrzení. Dialog je ovladatelný klávesnicí (fokus na
 * „Zrušit", Escape zavírá bez mazání).
 */
export function ResetProgress({ onReset }: ResetProgressProps) {
  const [confirming, setConfirming] = useState(false);
  const [done, setDone] = useState(false);
  const openButtonRef = useRef<HTMLButtonElement>(null);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (confirming) cancelButtonRef.current?.focus();
  }, [confirming]);

  const handleCancel = () => {
    setConfirming(false);
    openButtonRef.current?.focus();
  };

  const handleConfirm = () => {
    onReset();
    setConfirming(false);
    setDone(true);
    openButtonRef.current?.focus();
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
        <div
          className="onboarding-overlay"
          onKeyDown={(e) => {
            if (e.key === 'Escape') handleCancel();
          }}
        >
          <section
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
              <button type="button" className="btn btn--danger" onClick={handleConfirm}>
                Ano, smazat pokrok
              </button>
              <button
                ref={cancelButtonRef}
                type="button"
                className="btn btn--secondary"
                onClick={handleCancel}
              >
                Zrušit
              </button>
            </div>
          </section>
        </div>
      )}
    </section>
  );
}
