import { useRef, useState } from 'react';
import type { ReactNode } from 'react';
import type { ProgressState, Route } from '../types';
import { ProgressSummary } from './ProgressSummary';
import { CalmModeToggle } from './CalmModeToggle';
import { ReportProblemDialog } from './ReportProblemDialog';
import { buildRouteReportContext } from '../lib/reportRouteContext';

interface AppShellProps {
  children: ReactNode;
  progress: ProgressState;
  route: Route;
  onCalmModeToggle: () => void;
  calmMode: boolean;
  projectorMode: boolean;
  onProjectorModeToggle: () => void;
  onOpenOnboarding: () => void;
}

export function AppShell({
  children,
  progress,
  route,
  onCalmModeToggle,
  calmMode,
  projectorMode,
  onProjectorModeToggle,
  onOpenOnboarding,
}: AppShellProps) {
  const [reportOpen, setReportOpen] = useState(false);
  const reportButtonRef = useRef<HTMLButtonElement>(null);

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
          {!projectorMode && (
            <button
              ref={reportButtonRef}
              type="button"
              className="teacher-link"
              onClick={() => setReportOpen(true)}
            >
              Nahlásit problém
            </button>
          )}
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

      {reportOpen && !projectorMode && (
        <ReportProblemDialog
          route={buildRouteReportContext(route, progress)}
          projectorMode={projectorMode}
          calmMode={calmMode}
          onClose={() => setReportOpen(false)}
          getFallbackFocusTarget={() => reportButtonRef.current}
        />
      )}
    </div>
  );
}
