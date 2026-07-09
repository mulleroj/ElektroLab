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
}

export function AppShell({
  children,
  progress,
  onCalmModeToggle,
  calmMode,
  projectorMode,
  onProjectorModeToggle,
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
          <a href="#/teacher" className="teacher-link">
            👩‍🏫 Učitelský režim
          </a>
        </div>
      </header>
      <main className="app-main">{children}</main>
      <footer className="app-footer">
        <p>Školní výuková simulace — nepracuj pod napětím bez odborného dohledu.</p>
      </footer>
    </div>
  );
}
