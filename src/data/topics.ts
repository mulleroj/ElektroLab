import type { Topic } from '../types';

export const topics: Topic[] = [
  {
    id: 'veliciny',
    subjectId: 'zaklady',
    title: 'Veličiny a jednotky',
    description: 'Základní elektrické veličiny a jejich jednotky.',
    year: 1,
    estimatedMinutes: 35,
    mvpAvailable: false,
  },
  {
    id: 'stavba-latek',
    subjectId: 'zaklady',
    title: 'Stavba látek',
    description: 'Vlastnosti látek a vodivost.',
    year: 1,
    estimatedMinutes: 30,
    mvpAvailable: false,
  },
  {
    id: 'stejnosmerny-proud',
    subjectId: 'zaklady',
    title: 'Stejnosměrný proud',
    description: 'Jak teče proud v uzavřeném obvodu a co ovlivňuje jeho velikost.',
    year: 1,
    estimatedMinutes: 35,
    mvpAvailable: true,
  },
  {
    id: 'el-kresleni',
    subjectId: 'zaklady',
    title: 'Základy elektrotechnického kreslení',
    description: 'Elektrické schémata a značky prvků.',
    year: 1,
    estimatedMinutes: 10,
    mvpAvailable: true,
  },
  {
    id: 'elektrostatika',
    subjectId: 'zaklady',
    title: 'Elektrostatika',
    description: 'Elektrický náboj a statické jevy.',
    year: 1,
    estimatedMinutes: 30,
    mvpAvailable: false,
  },
  {
    id: 'elektrochemie',
    subjectId: 'zaklady',
    title: 'Elektrochemie',
    description: 'Chemické články a elektrolýza.',
    year: 1,
    estimatedMinutes: 35,
    mvpAvailable: false,
  },
  {
    id: 'magneticke-pole',
    subjectId: 'zaklady',
    title: 'Magnetické pole',
    description: 'Magnetismus a jeho vztah k elektrickému proudu.',
    year: 1,
    estimatedMinutes: 40,
    mvpAvailable: false,
  },
  {
    id: 'indukce',
    subjectId: 'zaklady',
    title: 'Elektromagnetická indukce',
    description: 'Indukované napětí a jeho využití.',
    year: 1,
    estimatedMinutes: 40,
    mvpAvailable: false,
  },
  {
    id: 'stridavy-proud',
    subjectId: 'zaklady',
    title: 'Střídavý proud',
    description: 'Střídavé napětí a proud v praxi.',
    year: 1,
    estimatedMinutes: 45,
    mvpAvailable: false,
  },
  {
    id: 'trojfazovy-proud',
    subjectId: 'zaklady',
    title: 'Trojfázový proud',
    description: 'Třífázové soustavy a jejich zapojení.',
    year: 1,
    estimatedMinutes: 40,
    mvpAvailable: false,
  },
  {
    id: 'metody-mereni',
    subjectId: 'mereni',
    title: 'Způsoby a metody měření elektrických veličin',
    description: 'Jak správně měřit napětí a proud — voltmetr, ampérmetr a bezpečné postupy.',
    year: 1,
    estimatedMinutes: 30,
    mvpAvailable: true,
  },
];

export function getTopicsBySubject(subjectId: string, year?: number): Topic[] {
  return topics.filter(
    (t) => t.subjectId === subjectId && (year === undefined || t.year === year),
  );
}

export function getTopicById(id: string): Topic | undefined {
  return topics.find((t) => t.id === id);
}
