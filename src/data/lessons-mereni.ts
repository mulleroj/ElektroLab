import type { MicroLesson } from '../types';

const MERENI_SAFETY =
  'Tato lekce je školní simulace. Ve skutečném obvodu se měří pouze podle pokynů učitele, s vhodným měřicím přístrojem a při dodržení bezpečnostních pravidel.';

export const mereniLessons: MicroLesson[] = [
  {
    id: 'voltmetr-zapojeni',
    subjectId: 'mereni',
    topicId: 'metody-mereni',
    title: 'Jak správně zapojit voltmetr',
    year: 1,
    durationMinutes: 10,
    difficulty: 'základní',
    goal:
      'Žák pochopí, že voltmetr se zapojuje paralelně k měřenému prvku, protože měří napětí mezi dvěma body.',
    hook: 'Chceš změřit napětí na žárovce — ale kam vlastně voltmetr připojit?',
    explanation:
      '**Voltmetr** měří napětí mezi dvěma body. Proto se zapojuje **paralelně** ke spotřebiči — oběma svorkami na místa, mezi kterými chceš napětí změřit. Sériové zapojení voltmetru je chyba — přeruší obvod a měření nebude správné.',
    safetyNote: MERENI_SAFETY,
    memorySentence: 'Voltmetr vždy paralelně — měří napětí mezi body.',
    typicalMistake: 'Žák si plete zapojení voltmetru a ampérmetru.',
    interactiveDemo: {
      type: 'voltmeter-connection',
      title: 'Kam patří voltmetr?',
      description:
        'Vyzkoušej zapojit voltmetr sériově a paralelně. Uvidíš, proč je správně paralelně.',
    },
    activity: {
      meterConnection: {
        type: 'meter-connection',
        instruction: 'Jak správně zapojíš voltmetr k měření napětí na spotřebiči?',
        meterLabel: 'Voltmetr (V)',
        options: [
          { id: 'a', text: 'Sériově do obvodu' },
          { id: 'b', text: 'Paralelně ke spotřebiči' },
          { id: 'c', text: 'Místo spotřebiče' },
        ],
        correctOptionId: 'b',
        successExplanation:
          'Voltmetr patří paralelně — měří napětí mezi dvěma body, neprotéká jím velký proud.',
      },
    },
    quiz: [
      {
        id: 'q1',
        text: 'Jak se zapojuje voltmetr?',
        options: [
          { id: 'a', text: 'Paralelně k měřenému prvku.' },
          { id: 'b', text: 'Sériově do obvodu.' },
          { id: 'c', text: 'Místo pojistky.' },
          { id: 'd', text: 'Jen k zemi.' },
        ],
        correctOptionId: 'a',
        explanation: 'Voltmetr měří napětí — zapojuje se paralelně.',
      },
      {
        id: 'q2',
        text: 'Co měří voltmetr?',
        options: [
          { id: 'a', text: 'Napětí mezi dvěma body.' },
          { id: 'b', text: 'Proud v obvodu.' },
          { id: 'c', text: 'Odpor izolačního materiálu.' },
          { id: 'd', text: 'Teplotu místnosti.' },
        ],
        correctOptionId: 'a',
        explanation: 'Voltmetr = napětí (V).',
      },
      {
        id: 'q3',
        text: 'Proč je sériové zapojení voltmetru chyba?',
        options: [
          { id: 'a', text: 'Přeruší obvod a měření bude špatné.' },
          { id: 'b', text: 'Je to vždy správně.' },
          { id: 'c', text: 'Zvýší napětí zdroje.' },
          { id: 'd', text: 'Nemá to vliv.' },
        ],
        correctOptionId: 'a',
        explanation: 'Voltmetr sériově nepatří — měří napětí paralelně.',
      },
    ],
    activityXp: 20,
    quizXp: 15,
    badgeId: 'voltmetr-zvladnut',
    mvpAvailable: true,
  },
  {
    id: 'ampermetr-zapojeni',
    subjectId: 'mereni',
    topicId: 'metody-mereni',
    title: 'Jak správně zapojit ampérmetr',
    year: 1,
    durationMinutes: 10,
    difficulty: 'základní',
    goal:
      'Žák pochopí, že ampérmetr se zapojuje sériově, protože měří proud procházející obvodem.',
    hook: 'Kolik proudu teče žárovkou? Ampérmetr musí být v cestě proudu — ale jak přesně?',
    explanation:
      '**Ampérmetr** měří proud, který protéká obvodem. Proto musí být zapojen **sériově** — proud jím prochází. Paralelní zapojení ampérmetru je nebezpečná chyba — vytvoří velký proud (zkrat) a může přístroj poškodit.',
    safetyNote:
      'Tato lekce je školní simulace. Nesprávné zapojení ampérmetru může ve skutečnosti poškodit přístroj nebo způsobit nebezpečnou situaci. Měření prováděj pouze pod dohledem učitele.',
    memorySentence: 'Ampérmetr vždy sériově — proud jím musí téct.',
    typicalMistake: 'Žák se pokusí zapojit ampérmetr paralelně jako voltmetr.',
    interactiveDemo: {
      type: 'ammeter-connection',
      title: 'Kam patří ampérmetr?',
      description:
        'Vyzkoušej zapojit ampérmetr sériově a paralelně. Uvidíš rozdíl a správný způsob.',
    },
    activity: {
      meterConnection: {
        type: 'meter-connection',
        instruction: 'Kam v obvodu správně zapojíš ampérmetr?',
        meterLabel: 'Ampérmetr (A)',
        options: [
          { id: 'a', text: 'Sériově do cesty proudu' },
          { id: 'b', text: 'Paralelně ke zdroji' },
          { id: 'c', text: 'Paralelně ke spotřebiči jako voltmetr' },
        ],
        correctOptionId: 'a',
        successExplanation:
          'Ampérmetr patří sériově — měří proud, který obvodem protéká.',
      },
    },
    quiz: [
      {
        id: 'q1',
        text: 'Jak se zapojuje ampérmetr?',
        options: [
          { id: 'a', text: 'Sériově do cesty proudu.' },
          { id: 'b', text: 'Paralelně ke spotřebiči.' },
          { id: 'c', text: 'Mimo obvod.' },
          { id: 'd', text: 'Jen k záporné svorce zdroje.' },
        ],
        correctOptionId: 'a',
        explanation: 'Ampérmetr měří proud — musí být v sérii.',
      },
      {
        id: 'q2',
        text: 'Co měří ampérmetr?',
        options: [
          { id: 'a', text: 'Proud procházející obvodem.' },
          { id: 'b', text: 'Napětí mezi body.' },
          { id: 'c', text: 'Výkon motoru.' },
          { id: 'd', text: 'Délku kabelu.' },
        ],
        correctOptionId: 'a',
        explanation: 'Ampérmetr = proud (A).',
      },
      {
        id: 'q3',
        text: 'Proč je paralelní ampérmetr nebezpečný?',
        options: [
          { id: 'a', text: 'Může vzniknout zkrat a poškození přístroje.' },
          { id: 'b', text: 'Je to standardní postup.' },
          { id: 'c', text: 'Sníží odpor obvodu výhodně.' },
          { id: 'd', text: 'Nemá to vliv.' },
        ],
        correctOptionId: 'a',
        explanation: 'Paralelní ampérmetr = chyba — hrozí zkrat.',
      },
    ],
    activityXp: 20,
    quizXp: 15,
    badgeId: 'ampermetr-zvladnut',
    mvpAvailable: true,
  },
  {
    id: 'mereni-spatne-zapojeni',
    subjectId: 'mereni',
    topicId: 'metody-mereni',
    title: 'Co se stane, když měřicí přístroj zapojíš špatně',
    year: 1,
    durationMinutes: 10,
    difficulty: 'základní',
    goal:
      'Žák rozpozná, proč je špatné zapojení měřicího přístroje problém a proč musí nejdřív přemýšlet, co vlastně měří.',
    hook: 'Špatně zapojený měřák není jen špatná známka — ve skutečnosti může být nebezpečný.',
    explanation:
      'Každý měřicí přístroj má svůj účel: **voltmetr** měří napětí (paralelně), **ampérmetr** měří proud (sériově). Když je zapojení špatně, měření nedává smysl — a v reálu může hrozit poškození přístroje nebo nebezpečná situace. Vždy si nejdřív polož otázku: měřím napětí, nebo proud?',
    safetyNote:
      'Aplikace vysvětluje principy ve školní simulaci. Ve skutečné instalaci se nesmí měřit ani zasahovat bez odborného dohledu a dodržení BOZP.',
    memorySentence: 'Nejdřív si řekni, co měříš — pak teprve zapoj.',
    typicalMistake:
      'Žák bere měřák jako univerzální krabičku a neřeší rozdíl mezi měřením napětí a proudu.',
    interactiveDemo: {
      type: 'measurement-scenarios',
      title: 'Správně nebo špatně?',
      description:
        'Projdi situace a posuď, jestli je zapojení měřicího přístroje v pořádku, nebo chybné.',
    },
    activity: {
      measurementJudgment: {
        type: 'measurement-judgment',
        instruction:
          'U každé situace rozhodni, jestli je zapojení v pořádku, nebo chybné. Všechny musí být správně.',
        scenarios: [
          {
            id: 's1',
            text: 'Voltmetr je připojen paralelně ke spotřebiči.',
            correct: 'correct',
            explanation: 'Voltmetr paralelně — správně, měří napětí na spotřebiči.',
          },
          {
            id: 's2',
            text: 'Ampérmetr je zapojen paralelně ke zdroji.',
            correct: 'wrong',
            explanation: 'Ampérmetr paralelně je chyba — hrozí zkrat.',
          },
          {
            id: 's3',
            text: 'Ampérmetr je zapojen sériově v obvodu.',
            correct: 'correct',
            explanation: 'Ampérmetr v sérii — správně měří proud.',
          },
          {
            id: 's4',
            text: 'Žák měří neznámý obvod bez pokynu učitele.',
            correct: 'wrong',
            explanation: 'Bez dohledu a pokynů se v praxi neměří — bezpečnostní pravidlo.',
          },
        ],
      },
    },
    quiz: [
      {
        id: 'q1',
        text: 'Které tvrzení je správné?',
        options: [
          { id: 'a', text: 'Voltmetr patří paralelně, ampérmetr sériově.' },
          { id: 'b', text: 'Oba patří vždy paralelně.' },
          { id: 'c', text: 'Oba patří vždy sériově.' },
          { id: 'd', text: 'Zapojení nezáleží.' },
        ],
        correctOptionId: 'a',
        explanation: 'Každý měřák má svůj způsob zapojení.',
      },
      {
        id: 'q2',
        text: 'Proč je důležité znát rozdíl mezi V a A měřením?',
        options: [
          { id: 'a', text: 'Špatné zapojení může poškodit přístroj nebo být nebezpečné.' },
          { id: 'b', text: 'Jen kvůli známce z testu.' },
          { id: 'c', text: 'Není to důležité.' },
          { id: 'd', text: 'Protože voltmetr měří proud.' },
        ],
        correctOptionId: 'a',
        explanation: 'Správné zapojení = bezpečnost a správné měření.',
      },
      {
        id: 'q3',
        text: 'Co má žák udělat před měřením v dílně?',
        options: [
          { id: 'a', text: 'Počkat na pokyn učitele a ověřit, co měří.' },
          { id: 'b', text: 'Zapojit měřák náhodně.' },
          { id: 'c', text: 'Vždy zapojit paralelně.' },
          { id: 'd', text: 'Měřit bez dohledu.' },
        ],
        correctOptionId: 'a',
        explanation: 'Měření jen pod dohledem a s jasným cílem.',
      },
    ],
    activityXp: 20,
    quizXp: 15,
    badgeId: 'merak-nespalen',
    mvpAvailable: true,
  },
];
