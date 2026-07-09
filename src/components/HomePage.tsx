import { subjects } from '../data/subjects';
import { SubjectCard } from './SubjectCard';
import { navigate } from '../lib/routing';

export function HomePage() {
  return (
    <section className="home-page">
      <div className="page-intro">
        <h1>ElektroLab</h1>
        <p className="page-intro__lead">
          Bezpečná dílna v mobilu pro budoucí elektrikáře.
        </p>
        <p>
          Vyber předmět a projdi krátké mikrolekce s interaktivními úkoly.
          Vše běží lokálně — bez přihlášení, bez internetu po načtení.
        </p>
      </div>

      <div className="subject-grid" role="list">
        {subjects.map((subject) => (
          <div key={subject.id} role="listitem">
            <SubjectCard
              subject={subject}
              onSelect={(id) => navigate({ page: 'subject', subjectId: id })}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
