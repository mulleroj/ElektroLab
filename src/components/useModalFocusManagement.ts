import { useEffect, useRef } from 'react';
import type { RefObject } from 'react';
import { getFocusableElements, getTrapFocusIndex } from '../lib/focus';

interface UseModalFocusManagementOptions {
  /** Kontejner otevřeného dialogu (prvek s role="dialog" / "alertdialog"). */
  containerRef: RefObject<HTMLElement | null>;
  /**
   * Prvek, který má dostat počáteční fokus. Bez něj se zaměří první
   * fokusovatelný prvek dialogu.
   */
  initialFocusRef?: RefObject<HTMLElement | null>;
  /** Zavření dialogu klávesou Escape. Bez callbacku se Escape nezachytává. */
  onEscape?: () => void;
  /**
   * Náhradní cíl pro návrat fokusu, když prvek zaměřený před otevřením
   * už neexistuje nebo žádný nebyl (např. onboarding při prvním spuštění).
   */
  getFallbackFocusTarget?: () => HTMLElement | null;
}

/**
 * MVP-12A2: základní modální chování fokusu pro dialogy, které se
 * montují jen po dobu otevření (Onboarding, potvrzení resetu).
 *
 * Řeší: uložení původně zaměřeného prvku, počáteční fokus, cyklický
 * Tab / Shift+Tab trap, Escape a návrat fokusu při unmountu. Listenery
 * existují jen po dobu života dialogu — po zavření se uklidí, takže se
 * Escape ani Tab trap nezachytávají mimo otevřený dialog.
 *
 * Vizuální podobu, roli ani potvrzovací logiku dialogů hook neřeší.
 */
export function useModalFocusManagement({
  containerRef,
  initialFocusRef,
  onEscape,
  getFallbackFocusTarget,
}: UseModalFocusManagementOptions): void {
  // Callbacky se drží v ref, aby efekty níže běžely jen při mount/unmount
  // a nereagovaly na každou novou identitu funkce z re-renderu.
  const onEscapeRef = useRef(onEscape);
  const getFallbackRef = useRef(getFallbackFocusTarget);
  useEffect(() => {
    onEscapeRef.current = onEscape;
    getFallbackRef.current = getFallbackFocusTarget;
  });

  // Počáteční fokus po otevření + návrat fokusu po zavření (unmount).
  useEffect(() => {
    const opener =
      document.activeElement instanceof HTMLElement &&
      document.activeElement !== document.body
        ? document.activeElement
        : null;
    const container = containerRef.current;
    const initial =
      initialFocusRef?.current ??
      (container ? getFocusableElements(container)[0] : null);
    initial?.focus();
    return () => {
      const target =
        opener && opener.isConnected
          ? opener
          : (getFallbackRef.current?.() ?? null);
      target?.focus();
    };
  }, [containerRef, initialFocusRef]);

  // Tab / Shift+Tab se cyklí výhradně uvnitř dialogu; Escape zavírá.
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const container = containerRef.current;
      if (!container) {
        return;
      }
      if (event.key === 'Escape') {
        if (onEscapeRef.current) {
          event.preventDefault();
          onEscapeRef.current();
        }
        return;
      }
      if (event.key !== 'Tab') {
        return;
      }
      event.preventDefault();
      const focusable = getFocusableElements(container);
      const activeIndex =
        document.activeElement instanceof HTMLElement
          ? focusable.indexOf(document.activeElement)
          : -1;
      const nextIndex = getTrapFocusIndex(
        activeIndex,
        focusable.length,
        event.shiftKey,
      );
      if (nextIndex !== null) {
        focusable[nextIndex].focus();
      }
    };
    document.addEventListener('keydown', handleKeyDown, true);
    return () => document.removeEventListener('keydown', handleKeyDown, true);
  }, [containerRef]);
}
