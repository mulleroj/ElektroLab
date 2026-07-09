import { useState } from 'react';
import type { SeriesParallelDemoConfig } from '../../types';

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
  const [serialDone, setSerialDone] = useState(false);
  const [parallelDone, setParallelDone] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const completed = serialDone && parallelDone;

  const handlePick = (diagram: 'serial' | 'parallel', choice: 'serial' | 'parallel') => {
    const correct = diagram === choice;
    if (diagram === 'serial' && correct) setSerialDone(true);
    if (diagram === 'parallel' && correct) setParallelDone(true);
    if (!correct) {
      setFeedback(
        diagram === 'serial'
          ? 'Toto schéma má prvky za sebou — je to sériové zapojení.'
          : 'Toto schéma má větve vedle sebe — je to paralelní zapojení.',
      );
    } else {
      setFeedback(
        diagram === 'serial'
          ? 'Správně! Prvky jsou za sebou na jedné cestě proudu.'
          : 'Správně! Prvky jsou ve větvích vedle sebe.',
      );
    }
  };

  return (
    <section className="interactive-demo" aria-labelledby="demo-title">
      <h2 id="demo-title">Interaktivní ukázka</h2>
      <h3>{demo.title}</h3>
      <p>{demo.description}</p>

      {calmMode && (
        <p className="calm-step-hint" role="status">
          Rozliš obě schémata ({Number(serialDone) + Number(parallelDone)} / 2)
        </p>
      )}

      <div className="demo-schemas">
        <article className={`demo-schema${serialDone ? ' demo-schema--done' : ''}`}>
          <h4>Schéma A</h4>
          <div className="schema-visual schema-visual--serial" role="img" aria-label="Sériové zapojení">
            <span className="schema-node">🔋</span>
            <span className="schema-line" />
            <span className="schema-node">💡</span>
            <span className="schema-line" />
            <span className="schema-node">💡</span>
            <span className="schema-line" />
            <span className="schema-node">↩</span>
          </div>
          <div className="demo-schema__buttons" role="group" aria-label="Typ zapojení schéma A">
            <button
              type="button"
              className="btn btn--secondary"
              onClick={() => handlePick('serial', 'serial')}
              disabled={serialDone}
            >
              Sériové
            </button>
            <button
              type="button"
              className="btn btn--secondary"
              onClick={() => handlePick('serial', 'parallel')}
              disabled={serialDone}
            >
              Paralelní
            </button>
          </div>
        </article>

        <article className={`demo-schema${parallelDone ? ' demo-schema--done' : ''}`}>
          <h4>Schéma B</h4>
          <div className="schema-visual schema-visual--parallel" role="img" aria-label="Paralelní zapojení">
            <div className="schema-branch">
              <span className="schema-node">💡</span>
            </div>
            <div className="schema-branch">
              <span className="schema-node">💡</span>
            </div>
            <span className="schema-node schema-node--source">🔋</span>
          </div>
          <div className="demo-schema__buttons" role="group" aria-label="Typ zapojení schéma B">
            <button
              type="button"
              className="btn btn--secondary"
              onClick={() => handlePick('parallel', 'serial')}
              disabled={parallelDone}
            >
              Sériové
            </button>
            <button
              type="button"
              className="btn btn--secondary"
              onClick={() => handlePick('parallel', 'parallel')}
              disabled={parallelDone}
            >
              Paralelní
            </button>
          </div>
        </article>
      </div>

      {feedback && (
        <div className="feedback feedback--success" role="status">
          ✔ {feedback}
        </div>
      )}

      <button
        type="button"
        className="btn btn--primary"
        onClick={onContinue}
        disabled={!completed}
      >
        Rozumím, pokračovat na úkol
      </button>
    </section>
  );
}
