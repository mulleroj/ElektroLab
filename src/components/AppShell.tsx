import type { ReactNode } from 'react';
import type { ProgressState } from '../types';
import { ProgressSummary } from './ProgressSummary';
import { CalmModeToggle } from './CalmModeToggle';

interface AppShellProps {
  children: ReactNode;
  progress: ProgressState;
  onCalmModeToggle: () => void;
  calmMode: boolean;
  projectorMode: boolean;
  onProjectorModeToggle: () => void;
  onOpenOnboarding: () => void;
}

export function AppShell({
  children,
  progress,
  onCalmModeToggle,
  calmMode,
  projectorMode,
  onProjectorModeToggle,
  onOpenOnboarding,
}: AppShellProps) {
  return (
    <div
      className={`app-shell${calmMode ? ' calm-mode' : ''}${projectorMode ? ' projector-mode' : ''}`}
    >
      {projectorMode && (
        <div className="projector-banner" role="status">
          <span>
            📽️ Režim na projektor — pokrok a XP se neukládají.
          </span>
          <button
            type="button"
            className="btn btn--secondary btn--small"
            onClick={onProjectorModeToggle}
          >
            Vypnout projektor
          </button>
        </div>
      )}
      <header className="app-header">
        <div className="app-header__brand">
          <a href="#/" className="app-header__logo">
            ElektroLab
          </a>
          <p className="app-header__tagline">
            Bezpečná dílna v mobilu pro budoucí elektrikáře.
          </p>
        </div>
        <div className="app-header__controls">
          <ProgressSummary progress={progress} />
          <CalmModeToggle enabled={calmMode} onToggle={onCalmModeToggle} />
          <button
            type="button"
            className="teacher-link"
            onClick={onOpenOnboarding}
          >
            ℹ️ Úvod
          </button>
          <a href="#/teacher" className="teacher-link">
            👩‍🏫 Učitelský režim
          </a>
        </div>
      </header>
      {/* tabIndex={-1}: cíl programového návratu fokusu (zavření onboardingu
          při prvním spuštění); v pořadí tabulátoru není. */}
      <main className="app-main" tabIndex={-1}>
        {children}
      </main>
      <footer className="app-footer">
        <p>Školní výuková simulace — nepracuj pod napětím bez odborného dohledu.</p>
      </footer>
    </div>
  );
}
