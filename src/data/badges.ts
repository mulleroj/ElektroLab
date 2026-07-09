import type { Badge } from '../types';

export const badges: Badge[] = [
  {
    id: 'prvni-zapojeni',
    title: 'První zapojení',
    description: 'Dokončil jsi svou první mikrolekci o elektrickém obvodu.',
    icon: '🔌',
  },
  {
    id: 'znalec-velicin',
    title: 'Znalec veličin',
    description: 'Rozlišuješ napětí, proud a odpor.',
    icon: '⚡',
  },
  {
    id: 'ohmuv-pomocnik',
    title: 'Ohmův pomocník',
    description: 'Rozumíš vztahu U = R · I.',
    icon: '📐',
  },
  {
    id: 'seriove-paralelne',
    title: 'Sériově i paralelně',
    description: 'Rozlišíš sériové a paralelní zapojení.',
    icon: '🔗',
  },
  {
    id: 'ctenar-znaciek',
    title: 'Čtenář značek',
    description: 'Poznáš základní elektrotechnické značky.',
    icon: '📋',
  },
];

export function getBadgeById(id: string): Badge | undefined {
  return badges.find((b) => b.id === id);
}
