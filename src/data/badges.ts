import type { Badge } from '../types';

export const badges: Badge[] = [
  {
    id: 'prvni-zapojeni',
    title: 'První zapojení',
    description: 'Dokončil jsi svou první mikrolekci o elektrickém obvodu.',
    icon: '🔌',
  },
];

export function getBadgeById(id: string): Badge | undefined {
  return badges.find((b) => b.id === id);
}
