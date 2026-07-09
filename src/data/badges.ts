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
  {
    id: 'merici-elev',
    title: 'Měřicí elév',
    description: 'Dokončil jsi všechny dostupné mikrolekce o měření.',
    icon: '🎖️',
  },
  {
    id: 'voltmetr-zvladnut',
    title: 'Voltmetr zvládnut',
    description: 'Víš, že voltmetr patří paralelně.',
    icon: '📏',
  },
  {
    id: 'ampermetr-zvladnut',
    title: 'Ampérmetr zvládnut',
    description: 'Víš, že ampérmetr patří sériově.',
    icon: '🔋',
  },
  {
    id: 'merak-nespalen',
    title: 'Měřák nespálen',
    description: 'Rozpoznáš správné i chybné zapojení měřáků.',
    icon: '🛡️',
  },
  {
    id: 'spravny-rozsah',
    title: 'Správný rozsah',
    description: 'Umíš zvolit měřicí rozsah — od většího k menšímu.',
    icon: '🎚️',
  },
  {
    id: 'hlidac-jistice',
    title: 'Hlídač jističe',
    description: 'Víš, kdy jistič vypne a co vlastně chrání.',
    icon: '🛑',
  },
  {
    id: 'chranic-pochopen',
    title: 'Chránič pochopen',
    description: 'Rozumíš tomu, že proudový chránič porovnává proud tam a zpět.',
    icon: '💠',
  },
  {
    id: 'rozvodovy-detektiv',
    title: 'Rozvodový detektiv',
    description: 'Rozlišíš, kdy pomáhá jistič, kdy chránič a kdy je čas zavolat odborníka.',
    icon: '🕵️',
  },
  {
    id: 'bezpecny-rozvodar',
    title: 'Bezpečný rozvodář',
    description: 'Dokončil jsi všechny dostupné mikrolekce o rozvodných zařízeních.',
    icon: '🏅',
  },
];

export function getBadgeById(id: string): Badge | undefined {
  return badges.find((b) => b.id === id);
}
