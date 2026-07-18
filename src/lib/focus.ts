/**
 * MVP-12A2: sdílené pomůcky pro správu fokusu.
 *
 * Používají je modální dialogy (focus trap) a ovládání animovaných dem
 * (náhradní fokus po zakázání tlačítka). Nic tady nesahá na progress
 * ani localStorage.
 */

/** Prvky, které lze zaměřit klávesnicí (bez tabindex="-1"). */
const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

/**
 * Fokusovatelné prvky uvnitř kontejneru v pořadí DOM. Prvky bez
 * vykresleného boxu (display: none, odpojené větve) se vynechávají,
 * aby fokus nikdy nemířil na skrytý prvek.
 */
export function getFocusableElements(root: HTMLElement): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    (el) => el.getClientRects().length > 0,
  );
}

/**
 * Čistá rozhodovací funkce Tab trapu: kam má přejít fokus po stisku
 * Tab (shiftKey = false) nebo Shift+Tab (shiftKey = true) uvnitř dialogu.
 *
 * activeIndex je index právě zaměřeného prvku v seznamu fokusovatelných
 * prvků dialogu; -1 (nebo hodnota mimo rozsah) znamená, že fokus je mimo
 * seznam — pak se vstupuje na kraj podle směru. Vrací index cílového
 * prvku, nebo null, když v dialogu není co zaměřit. Počet prvků se nikde
 * nepředpokládá natvrdo; jediný prvek si fokus prostě nechá.
 */
export function getTrapFocusIndex(
  activeIndex: number,
  count: number,
  shiftKey: boolean,
): number | null {
  if (count <= 0) {
    return null;
  }
  if (count === 1) {
    return 0;
  }
  if (activeIndex < 0 || activeIndex >= count) {
    return shiftKey ? count - 1 : 0;
  }
  if (shiftKey) {
    return activeIndex === 0 ? count - 1 : activeIndex - 1;
  }
  return activeIndex === count - 1 ? 0 : activeIndex + 1;
}
