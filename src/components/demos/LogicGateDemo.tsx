import { useState } from 'react';
import type { LogicGateDemoConfig } from '../../types';

type Gate = 'AND' | 'OR' | 'NOT';

const GATES: Gate[] = ['AND', 'OR', 'NOT'];

function computeOutput(gate: Gate, a: 0 | 1, b: 0 | 1): 0 | 1 {
  switch (gate) {
    case 'AND':
      return a === 1 && b === 1 ? 1 : 0;
    case 'OR':
      return a === 1 || b === 1 ? 1 : 0;
    case 'NOT':
      return a === 1 ? 0 : 1;
  }
}

function explain(gate: Gate, a: 0 | 1, out: 0 | 1): string {
  switch (gate) {
    case 'AND':
      return out === 1
        ? 'Oba vstupy jsou 1, proto AND dává na výstupu 1.'
        : 'AND dává 1 jen tehdy, když jsou OBA vstupy 1. Teď tomu tak není, výstup je 0.';
    case 'OR':
      return out === 1
        ? 'Alespoň jeden vstup je 1, proto OR dává na výstupu 1.'
        : 'OR dává 1, když je alespoň jeden vstup 1. Oba vstupy jsou 0, výstup je 0.';
    case 'NOT':
      return out === 1
        ? `NOT obrací vstup: A = ${a}, výstup je tedy 1.`
        : `NOT obrací vstup: A = ${a}, výstup je tedy 0.`;
  }
}

interface LogicGateDemoProps {
  demo: LogicGateDemoConfig;
  calmMode: boolean;
  onContinue: () => void;
}

export function LogicGateDemoView({
  demo,
  calmMode,
  onContinue,
}: LogicGateDemoProps) {
  const [gate, setGate] = useState<Gate>('AND');
  const [a, setA] = useState<0 | 1>(0);
  const [b, setB] = useState<0 | 1>(0);
  const [triedGates, setTriedGates] = useState<Set<Gate>>(new Set(['AND']));

  const output = computeOutput(gate, a, b);
  const allTried = triedGates.size === GATES.length;

  const handleGate = (g: Gate) => {
    setGate(g);
    setTriedGates((prev) => new Set(prev).add(g));
  };

  return (
    <section className="interactive-demo" aria-labelledby="demo-title">
      <h2 id="demo-title">Interaktivní ukázka</h2>
      <h3>{demo.title}</h3>
      <p>{demo.description}</p>

      {calmMode && (
        <p className="calm-step-hint" role="status">
          Vyzkoušej všechna tři hradla ({triedGates.size} / {GATES.length}).
        </p>
      )}

      <div className="logic-gate" role="group" aria-label="Výběr hradla">
        {GATES.map((g) => (
          <button
            key={g}
            type="button"
            className={`btn btn--secondary${gate === g ? ' btn--active' : ''}`}
            onClick={() => handleGate(g)}
            aria-pressed={gate === g}
          >
            {triedGates.has(g) ? '✔ ' : ''}
            {g}
          </button>
        ))}
      </div>

      <div className="logic-gate__panel">
        <div className="logic-gate__inputs" role="group" aria-label="Vstupy hradla">
          <button
            type="button"
            className={`logic-io${a === 1 ? ' logic-io--one' : ''}`}
            onClick={() => setA(a === 1 ? 0 : 1)}
            aria-pressed={a === 1}
          >
            Vstup A: <strong>{a}</strong>
          </button>
          {gate !== 'NOT' && (
            <button
              type="button"
              className={`logic-io${b === 1 ? ' logic-io--one' : ''}`}
              onClick={() => setB(b === 1 ? 0 : 1)}
              aria-pressed={b === 1}
            >
              Vstup B: <strong>{b}</strong>
            </button>
          )}
        </div>
        <div className="logic-gate__symbol" aria-hidden="true">
          [{gate}]
        </div>
        <div
          className={`logic-io logic-io--output${output === 1 ? ' logic-io--one' : ''}`}
          role="status"
        >
          <span aria-hidden="true">{output === 1 ? '💡' : '·'}</span> Výstup:{' '}
          <strong>{output}</strong> — LED {output === 1 ? 'svítí' : 'nesvítí'}
        </div>
      </div>

      <div className="logic-gate__explain" role="status">
        {explain(gate, a, output)}
      </div>

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
