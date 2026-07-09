import type { Subject } from '../types';

interface SubjectCardProps {
  subject: Subject;
  onSelect: (subjectId: string) => void;
}

export function SubjectCard({ subject, onSelect }: SubjectCardProps) {
  const statusLabel = subject.mvpAvailable
    ? 'Dostupné v MVP'
    : 'Připraveno pro další fázi';

  return (
    <article
      className={`subject-card${subject.mvpAvailable ? '' : ' subject-card--locked'}`}
    >
      <div className="subject-card__icon" aria-hidden="true">
        {subject.icon}
      </div>
      <h2 className="subject-card__title">{subject.title}</h2>
      <p className="subject-card__subtitle">{subject.subtitle}</p>
      <p className="subject-card__description">{subject.description}</p>
      <span
        className={`subject-card__status${subject.mvpAvailable ? ' subject-card__status--active' : ''}`}
      >
        {statusLabel}
      </span>
      {subject.mvpAvailable ? (
        <button
          type="button"
          className="btn btn--primary subject-card__btn"
          onClick={() => onSelect(subject.id)}
        >
          Otevřít předmět
        </button>
      ) : (
        <button type="button" className="btn btn--secondary subject-card__btn" disabled>
          Brzy k dispozici
        </button>
      )}
    </article>
  );
}
