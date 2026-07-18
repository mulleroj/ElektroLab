/**
 * Pomocné funkce pro skóre mini testu (MVP-12A).
 *
 * Skóre se ukládá jako dvojice correct/total, aby zůstalo srovnatelné
 * i po případné budoucí změně počtu otázek v lekci.
 */
import type { QuizScore } from '../types';

/**
 * Ověří, že hodnota z localStorage je použitelné skóre.
 * Poškozená nebo neúplná data se tiše ignorují — nesmí shodit aplikaci.
 */
export function isValidQuizScore(value: unknown): value is QuizScore {
  if (typeof value !== 'object' || value === null) return false;
  const { correct, total } = value as Record<string, unknown>;
  return (
    typeof correct === 'number' &&
    typeof total === 'number' &&
    Number.isInteger(correct) &&
    Number.isInteger(total) &&
    total >= 1 &&
    correct >= 0 &&
    correct <= total
  );
}

/**
 * Je skóre `a` ostře lepší než `b`? Porovnává podíl správných odpovědí
 * (celočíselně přes křížové násobení), takže funguje i při různém
 * celkovém počtu otázek. Shodný podíl lepší není — dřívější výsledek zůstává.
 */
export function isBetterQuizScore(a: QuizScore, b: QuizScore): boolean {
  return a.correct * b.total > b.correct * a.total;
}

/**
 * Deterministický výběr lepšího ze dvou platných skóre při slučování
 * (migrace legacy + canonical záznamu). Vyšší podíl vyhrává; při shodném
 * podílu vyhrává skóre s větším `total`; při shodě obojího jsou skóre
 * fakticky totožná a vrací se `a`. Výsledek tak nezávisí na pořadí klíčů
 * v uložených datech. Celočíselné křížové násobení — bez plovoucí čárky.
 */
export function pickBetterQuizScore(a: QuizScore, b: QuizScore): QuizScore {
  const cross = a.correct * b.total - b.correct * a.total;
  if (cross !== 0) return cross > 0 ? a : b;
  return a.total >= b.total ? a : b;
}
