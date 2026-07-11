import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Stavy přehrávání animovaného dema.
 *
 * idle      — výchozí stav po otevření nebo po Resetu, nic se nehýbe
 * playing   — kroky se posouvají samy (jen mimo Klidný režim / reduced motion)
 * paused    — pohyb zastaven na aktuálním kroku
 * completed — žák prošel poslední pedagogický krok
 */
export type AnimatedDemoStatus = 'idle' | 'playing' | 'paused' | 'completed';

export interface UseAnimatedDemoOptions {
  /** Počet pedagogických kroků; indexy jdou od 0 do stepCount - 1. */
  stepCount: number;
  /** Jak dlouho zůstane jeden krok zobrazen při automatickém přehrávání. */
  stepDurationMs?: number;
  /**
   * Když je false (Klidný režim nebo prefers-reduced-motion),
   * play() nic neudělá a demo se ovládá jen krokováním.
   */
  autoPlayAllowed: boolean;
}

export interface AnimatedDemoPlayback {
  status: AnimatedDemoStatus;
  stepIndex: number;
  /**
   * Žák už alespoň jednou došel k poslednímu kroku. Reset tento příznak
   * nevrací — už udělené povolení pokračovat v lekci zůstává.
   */
  hasCompletedOnce: boolean;
  play: () => void;
  pause: () => void;
  nextStep: () => void;
  reset: () => void;
}

/** Doporučené tempo: jeden pedagogický krok ~1–2 sekundy. */
const DEFAULT_STEP_DURATION_MS = 1800;

/**
 * Deterministický stavový model přehrávání pro animovaná dema.
 *
 * Automatický postup používá jediný setTimeout na krok (žádný setInterval,
 * žádný requestAnimationFrame) — plynulý pohyb uvnitř kroku obstarávají CSS
 * přechody. Timeout se ruší při pauze, resetu, unmountu i při schování
 * záložky, takže nikdy neběží víc časovačů najednou a po návratu z pozadí
 * demo nepřeskočí kroky.
 */
export function useAnimatedDemo({
  stepCount,
  stepDurationMs = DEFAULT_STEP_DURATION_MS,
  autoPlayAllowed,
}: UseAnimatedDemoOptions): AnimatedDemoPlayback {
  const [status, setStatus] = useState<AnimatedDemoStatus>('idle');
  const [stepIndex, setStepIndex] = useState(0);
  const [hasCompletedOnce, setHasCompletedOnce] = useState(false);
  const timeoutRef = useRef<number | null>(null);
  const lastStep = stepCount - 1;

  const clearTimer = useCallback(() => {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  // Automatický postup: pro každý zobrazený krok se naplánuje právě jeden
  // timeout. Cleanup efektu jej zruší při pauze, resetu i unmountu.
  useEffect(() => {
    if (status !== 'playing') {
      return;
    }
    if (stepIndex >= lastStep) {
      setStatus('completed');
      setHasCompletedOnce(true);
      return;
    }
    timeoutRef.current = window.setTimeout(() => {
      timeoutRef.current = null;
      setStepIndex((prev) => Math.min(prev + 1, lastStep));
    }, stepDurationMs);
    return clearTimer;
  }, [status, stepIndex, lastStep, stepDurationMs, clearTimer]);

  // Když se zpřísní pravidla pohybu (zapnutí Klidného režimu nebo
  // reduced motion uprostřed přehrávání), běžící animace se zastaví.
  useEffect(() => {
    if (autoPlayAllowed) {
      return;
    }
    clearTimer();
    setStatus((prev) => (prev === 'playing' ? 'paused' : prev));
  }, [autoPlayAllowed, clearTimer]);

  // Schování záložky animaci pozastaví — po návratu pokračuje žák sám,
  // nic se nedohání a nevznikají duplicitní časovače.
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState !== 'hidden') {
        return;
      }
      clearTimer();
      setStatus((prev) => (prev === 'playing' ? 'paused' : prev));
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () =>
      document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [clearTimer]);

  const play = useCallback(() => {
    if (!autoPlayAllowed) {
      return;
    }
    setStatus((prev) =>
      prev === 'idle' || prev === 'paused' ? 'playing' : prev,
    );
  }, [autoPlayAllowed]);

  const pause = useCallback(() => {
    clearTimer();
    setStatus((prev) => (prev === 'playing' ? 'paused' : prev));
  }, [clearTimer]);

  const nextStep = useCallback(() => {
    if (status === 'completed') {
      return;
    }
    clearTimer();
    const next = Math.min(stepIndex + 1, lastStep);
    setStepIndex(next);
    if (next >= lastStep) {
      setStatus('completed');
      setHasCompletedOnce(true);
    } else {
      setStatus('paused');
    }
  }, [status, stepIndex, lastStep, clearTimer]);

  const reset = useCallback(() => {
    clearTimer();
    setStepIndex(0);
    setStatus('idle');
  }, [clearTimer]);

  return { status, stepIndex, hasCompletedOnce, play, pause, nextStep, reset };
}
