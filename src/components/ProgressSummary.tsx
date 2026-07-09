import type { ProgressState } from '../types';
import { getBadgeById } from '../data/badges';

interface ProgressSummaryProps {
  progress: ProgressState;
}

export function ProgressSummary({ progress }: ProgressSummaryProps) {
  const latestBadge = progress.earnedBadges.at(-1);
  const badge = latestBadge ? getBadgeById(latestBadge) : undefined;

  return (
    <div className="progress-summary" aria-label="Přehled pokroku">
      <span className="progress-summary__xp">
        <span className="progress-summary__label">XP</span>
        <strong>{progress.totalXp}</strong>
      </span>
      {badge && (
        <span className="progress-summary__badge" title={badge.description}>
          {badge.icon} {badge.title}
        </span>
      )}
    </div>
  );
}
