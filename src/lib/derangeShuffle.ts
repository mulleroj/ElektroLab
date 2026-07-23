/**
 * Promíchá pořadí tak, aby u n > 1 žádný prvek nezůstal na původním indexu
 * (derangement). Používá Sattolův algoritmus (náhodná cyklická permutace).
 *
 * @param items Vstupní položky (pořadí odpovídá „správnému“ zarovnání).
 * @param rng Generátor [0, 1); výchozí Math.random. Testy mohou dodat deterministický RNG.
 */
export function derangeItems<T>(
  items: readonly T[],
  rng: () => number = Math.random,
): T[] {
  const n = items.length;
  if (n === 0) return [];
  if (n === 1) return [items[0]];

  const result = items.slice();
  // Sattolo: j ∈ [0, i) — nikdy ne vymění prvek sám se sebou, výsledek je derangement.
  for (let i = n - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * i);
    const tmp = result[i];
    result[i] = result[j];
    result[j] = tmp;
  }
  return result;
}

/**
 * Seřadí pravý sloupec párovací aktivity tak, aby při zarovnání s levým
 * sloupcem žádná správná dvojice (podle correctPairs) nebyla ve stejném řádku.
 * Levé pořadí se nemění. Identita páru zůstává v ID.
 */
export function orderRightItemsWithoutRowHints<T extends { id: string }>(
  leftItems: readonly { id: string }[],
  rightItems: readonly T[],
  correctPairs: Readonly<Record<string, string>>,
  rng: () => number = Math.random,
): T[] {
  const byId = new Map(rightItems.map((item) => [item.id, item]));
  const aligned: T[] = [];
  for (const left of leftItems) {
    const rightId = correctPairs[left.id];
    const right = byId.get(rightId);
    if (right) aligned.push(right);
  }
  // Doplň případné pravé položky mimo correctPairs (nemělo by nastat ve validním obsahu).
  for (const item of rightItems) {
    if (!aligned.some((a) => a.id === item.id)) aligned.push(item);
  }
  return derangeItems(aligned, rng);
}

/** True, pokud u n > 1 žádný index nemá správnou dvojici ve stejném řádku. */
export function hasNoCorrectRowAlignment(
  leftItems: readonly { id: string }[],
  rightItems: readonly { id: string }[],
  correctPairs: Readonly<Record<string, string>>,
): boolean {
  const n = Math.min(leftItems.length, rightItems.length);
  if (n <= 1) return true;
  for (let i = 0; i < n; i += 1) {
    if (correctPairs[leftItems[i].id] === rightItems[i].id) return false;
  }
  return true;
}
