import { useState } from 'react';
import type { ContactorRelayDemoConfig } from '../../types';

interface ContactorRelayDemoProps {
  demo: ContactorRelayDemoConfig;
  calmMode: boolean;
  onContinue: () => void;
}

export function ContactorRelayDemoView({
  demo,
  calmMode,
  onContinue,
}: ContactorRelayDemoProps) {
  const [coilOn, setCoilOn] = useState<boolean | null>(null);
  const [tried, setTried] = useState<Set<'on' | 'off'>>(new Set());

  const on = coilOn === true;
  const allTried = tried.size === 2;

  const handleCoil = (next: boolean) => {
    setCoilOn(next);
    setTried((prev) => new Set(prev).add(next ? 'on' : 'off'));
  };

  return (
    <section className="interactive-demo" aria-labelledby="demo-title">
      <h2 id="demo-title">Interaktivní ukázka</h2>
      <h3>{demo.title}</h3>
      <p>{demo.description}</p>

      {calmMode && (
        <p className="calm-step-hint" role="status">
          Vyzkoušej cívku pod napětím i bez napětí ({tried.size} / 2).
        </p>
      )}

      <div
        className="automation-diagram"
        role="img"
        aria-label={
          coilOn === null
            ? 'Stykač: ovládací obvod s cívkou a výkonový obvod s kontaktem a motorem. Zapni nebo vypni cívku.'
            : on
              ? 'Cívka je pod napětím, přitáhla kontakt — kontakt je sepnutý a motor běží.'
              : 'Cívka je bez napětí, kontakt je rozepnutý a motor stojí.'
        }
      >
        <div
          className={`automation-diagram__box${on ? ' automation-diagram__box--active' : ''}`}
        >
          <span aria-hidden="true">{on ? '🔋' : '·'}</span>
          <span>
            <strong>Ovládací obvod</strong> — cívka:{' '}
            <strong>{coilOn === null ? '—' : on ? 'pod napětím' : 'bez napětí'}</strong>
          </span>
        </div>
        <div className="automation-diagram__arrow" aria-hidden="true">
          ↓ {on ? 'cívka magneticky přitáhla kontakt' : 'bez napětí cívka kontakt pustí'}
        </div>
        <div
          className={`automation-diagram__box${on ? ' automation-diagram__box--active' : ''}`}
        >
          <span aria-hidden="true">{on ? '🔗' : '⛓️‍💥'}</span>
          <span>
            Kontakt: <strong>{coilOn === null ? '—' : on ? 'sepnutý' : 'rozepnutý'}</strong>
          </span>
        </div>
        <div className="automation-diagram__arrow" aria-hidden="true">
          ↓ kontakt spíná jiný (výkonový) obvod
        </div>
        <div
          className={`automation-diagram__box${on ? ' automation-diagram__box--active' : ''}`}
        >
          <span aria-hidden="true">{on ? '⚙️' : '·'}</span>
          <span>
            <strong>Výkonový obvod</strong> — motor:{' '}
            <strong>{coilOn === null ? '—' : on ? 'běží' : 'stojí'}</strong>
          </span>
        </div>
      </div>

      <div
        className="circuit-diagram__controls"
        role="group"
        aria-label="Ovládání cívky"
      >
        <button
          type="button"
          className={`btn btn--secondary${on ? ' btn--active' : ''}`}
          onClick={() => handleCoil(true)}
          aria-pressed={on}
        >
          {tried.has('on') ? '✔ ' : ''}Cívka pod napětím
        </button>
        <button
          type="button"
          className={`btn btn--secondary${coilOn === false ? ' btn--active' : ''}`}
          onClick={() => handleCoil(false)}
          aria-pressed={coilOn === false}
        >
          {tried.has('off') ? '✔ ' : ''}Cívka bez napětí
        </button>
      </div>

      {coilOn !== null && (
        <div className="logic-gate__explain" role="status">
          {on
            ? 'Cívka pod napětím přitáhla kontakt a ten sepnul výkonový obvod — motor běží. Malý ovládací proud tak řídí větší zátěž. Přesně proto se stykače používají k ovládání motorů a velkých spotřebičů.'
            : 'Cívka je bez napětí, pružina drží kontakt rozepnutý — výkonový obvod je přerušený a motor stojí.'}
        </div>
      )}

      <button
        type="button"
        className="btn btn--primary"
        onClick={onContinue}
        disabled={!allTried}
      >
        Rozumím, pokračovat na úkol
      </button>
    </section>
  );
}
