import { useEffect, useState } from 'react';

/**
 * Souhrn pravidel pohybu pro animovaná dema.
 *
 * Kombinuje Klidný režim aplikace (calmMode) a systémovou volbu
 * `prefers-reduced-motion: reduce`. Když je aktivní kterákoli z nich,
 * demo nesmí samo přehrávat souvislý pohyb — zůstává krokování tlačítkem
 * „Další krok“ a plný textový popis každého stavu.
 */
export interface MotionPolicy {
  /** Uživatel má zapnutý Klidný režim aplikace. */
  calmMode: boolean;
  /** Systém hlásí prefers-reduced-motion: reduce. */
  prefersReducedMotion: boolean;
  /** Smí se nabídnout automatické přehrávání kroků (Spustit / Pauza). */
  allowAutoPlay: boolean;
  /** Smí běžet souvislý opakovaný pohyb (např. rotující rotor). */
  allowContinuousMotion: boolean;
}

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

function readPrefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false;
  }
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

export function useMotionPolicy(calmMode: boolean): MotionPolicy {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(
    readPrefersReducedMotion,
  );

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return;
    }
    const query = window.matchMedia(REDUCED_MOTION_QUERY);
    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };
    query.addEventListener('change', handleChange);
    return () => query.removeEventListener('change', handleChange);
  }, []);

  const allowMotion = !calmMode && !prefersReducedMotion;

  return {
    calmMode,
    prefersReducedMotion,
    allowAutoPlay: allowMotion,
    allowContinuousMotion: allowMotion,
  };
}
