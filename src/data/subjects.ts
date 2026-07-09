import type { Subject } from '../types';

export const subjects: Subject[] = [
  {
    id: 'zaklady',
    title: 'Základy elektrotechniky',
    subtitle: 'Proud, napětí, odpor. Tady to všechno začíná.',
    description:
      'Proud, napětí, odpor a magnetismus. Když pochopíš tohle, dává smysl všechno ostatní.',
    icon: '⚡',
    years: [1],
    mvpAvailable: true,
  },
  {
    id: 'mereni',
    title: 'Elektrotechnická měření a pohony',
    subtitle: 'Ampérmetr, voltmetr a motory v pohybu.',
    description: 'Měření elektrických veličin a pohony v praxi.',
    icon: '📏',
    years: [1, 2, 3],
    mvpAvailable: true,
  },
  {
    id: 'rozvody',
    title: 'Rozvodná zařízení',
    subtitle: 'Od zásuvky až po rozvodnu.',
    description: 'Silnoproudé a slaboproudé rozvody v bytech i průmyslu.',
    icon: '🏠',
    years: [2, 3],
    mvpAvailable: false,
  },
  {
    id: 'stroje',
    title: 'Elektrické stroje a přístroje',
    subtitle: 'Trafa, motory, jističe, stykače.',
    description: 'Transformátory, motory a ochranná zařízení.',
    icon: '⚙️',
    years: [2],
    mvpAvailable: false,
  },
  {
    id: 'elektronika',
    title: 'Elektronika',
    subtitle: 'Diody, tranzistory, zesilovače.',
    description: 'Polovodiče a elektronické obvody.',
    icon: '🔺',
    years: [2, 3],
    mvpAvailable: false,
  },
  {
    id: 'automatizace',
    title: 'Automatická zařízení',
    subtitle: 'Snímače, regulace, logika.',
    description: 'Automatizace a řídicí systémy.',
    icon: '🤖',
    years: [3],
    mvpAvailable: false,
  },
  {
    id: 'bezpecnost',
    title: 'Bezpečnost a chyby z praxe',
    subtitle: 'Co nikdy neudělat — a proč.',
    description: 'Praktické chyby a bezpečnostní pravidla z dílny.',
    icon: '🛡️',
    years: [1, 2, 3],
    mvpAvailable: false,
  },
  {
    id: 'zkouska',
    title: 'Příprava na závěrečnou zkoušku',
    subtitle: 'Trénink na zkoušku bez stresu.',
    description: 'Opakování a trénink pro závěrečnou zkoušku.',
    icon: '🎓',
    years: [1, 2, 3],
    mvpAvailable: false,
  },
];

export function getSubjectById(id: string): Subject | undefined {
  return subjects.find((s) => s.id === id);
}
