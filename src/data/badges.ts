import type { Badge } from '../types';

export const badges: Badge[] = [
  {
    id: 'prvni-zapojeni',
    title: 'První zapojení',
    description: 'Dokončil jsi svou první mikrolekci o elektrickém obvodu.',
    icon: '🔌',
  },
  {
    id: 'znalec-materialu',
    title: 'Znalec materiálů',
    description: 'Rozlišuješ vodiče a izolanty a rozumíš roli izolace.',
    icon: '🧱',
  },
  {
    id: 'znalec-naboje',
    title: 'Znalec náboje',
    description: 'Rozumíš elektrickému náboji, volným elektronům a směru proudu v kovu.',
    icon: '➖',
  },
  {
    id: 'znalec-velicin',
    title: 'Znalec veličin',
    description: 'Rozlišuješ napětí, proud a odpor.',
    icon: '⚡',
  },
  {
    id: 'znalec-odporu',
    title: 'Znalec odporu',
    description: 'Víš, proč má vodič odpor a co odpor ovlivňuje.',
    icon: '🌡️',
  },
  {
    id: 'ohmuv-pomocnik',
    title: 'Ohmův pomocník',
    description: 'Rozumíš vztahu U = R · I.',
    icon: '📐',
  },
  {
    id: 'vykon-pod-kontrolou',
    title: 'Výkon pod kontrolou',
    description: 'Rozlišuješ výkon a energii a umíš použít P = U · I.',
    icon: '💡',
  },
  {
    id: 'strazce-obvodu',
    title: 'Strážce obvodu',
    description: 'Rozlišuješ přetížení a zkrat a víš, k čemu slouží pojistka a jistič.',
    icon: '🛡️',
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
    id: 'zakladni-elev',
    title: 'Základní elév',
    description: 'Dokončil jsi všechny dostupné mikrolekce ze Základů elektrotechniky.',
    icon: '🎖️',
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
  {
    id: 'dioda-pochopena',
    title: 'Dioda pochopena',
    description: 'Víš, že dioda propouští proud hlavně jedním směrem.',
    icon: '🔺',
  },
  {
    id: 'spinac-z-tranzistoru',
    title: 'Spínač z tranzistoru',
    description: 'Rozumíš tomu, jak malý signál spíná větší proud.',
    icon: '🎛️',
  },
  {
    id: 'logicky-elektrikar',
    title: 'Logický elektrikář',
    description: 'Zvládáš hradla AND, OR a NOT se vstupy 0 a 1.',
    icon: '🧮',
  },
  {
    id: 'elektronicky-elev',
    title: 'Elektronický elév',
    description: 'Dokončil jsi všechny dostupné mikrolekce z elektroniky.',
    icon: '🎖️',
  },
  {
    id: 'lovec-signalu',
    title: 'Lovec signálu',
    description: 'Víš, že snímač zjišťuje stav a předává informaci dál.',
    icon: '📡',
  },
  {
    id: 'regulator-junior',
    title: 'Regulátor junior',
    description: 'Znáš části regulačního obvodu a jejich pořadí.',
    icon: '🌡️',
  },
  {
    id: 'zpetna-vazba-zvladnuta',
    title: 'Zpětná vazba zvládnuta',
    description: 'Rozumíš tomu, že systém sleduje výsledek a upravuje činnost.',
    icon: '🔁',
  },
  {
    id: 'automatizacni-logik',
    title: 'Automatizační logik',
    description: 'Chápeš řízení podmínkou A ZÁROVEŇ B — a proč se kryt neobchází.',
    icon: '🦾',
  },
  {
    id: 'automatizacni-elev',
    title: 'Automatizační elév',
    description: 'Dokončil jsi všechny dostupné mikrolekce o automatických zařízeních.',
    icon: '🤖',
  },
  {
    id: 'mistr-transformatoru',
    title: 'Mistr transformátoru',
    description: 'Víš, kdy transformátor napětí zvyšuje, snižuje a kdy je převod 1:1.',
    icon: '🧲',
  },
  {
    id: 'motorovy-elev',
    title: 'Motorový elév',
    description: 'Chápeš točivé pole a proč se rotor za polem opožďuje.',
    icon: '🌀',
  },
  {
    id: 'vladce-kontaktu',
    title: 'Vládce kontaktů',
    description: 'Rozumíš tomu, jak cívka stykače spíná jiný obvod.',
    icon: '🕹️',
  },
  {
    id: 'bezpecny-u-vn',
    title: 'Bezpečný u vysokého napětí',
    description: 'Znáš napěťové hladiny a víš, že u VN/VVN rozhoduje odstup.',
    icon: '🚧',
  },
  {
    id: 'strojarsky-elev',
    title: 'Strojařský elév',
    description: 'Dokončil jsi všechny dostupné mikrolekce o strojích a přístrojích.',
    icon: '⚙️',
  },
];

export function getBadgeById(id: string): Badge | undefined {
  return badges.find((b) => b.id === id);
}
