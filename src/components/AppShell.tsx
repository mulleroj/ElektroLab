import type { ReactNode } from 'react';
import type { ProgressState } from '../types';
import { ProgressSummary } from './ProgressSummary';
import { CalmModeToggle } from './CalmModeToggle';

interface AppShellProps {
  children: ReactNode;
  progress: ProgressState;
  onCalmModeToggle: () => void;
  calmMode: boolean;
}

export function AppShell({
  children,
  progress,
  onCalmModeToggle,
  calmMode,
}: AppShellProps) {
  return (
    <div className={`app-shell${calmMode ? ' calm-mode' : ''}`}>
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
        </div>
      </header>
      <main className="app-main">{children}</main>
      <footer className="app-footer">
        <p>Školní výuková simulace — nepracuj pod napětím bez odborného dohledu.</p>
      </footer>
    </div>
  );
}
