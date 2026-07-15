import type { MicroLesson } from '../types';

const ELEKTRONIKA_SAFETY_BASE =
  'Tato lekce je školní simulace. Ve skutečných obvodech se součástky zapojují pouze podle pokynů učitele, s vhodným napětím a při dodržení bezpečnostních pravidel.';

export const elektronikaLessons: MicroLesson[] = [
  {
    id: 'co-dela-dioda',
    subjectId: 'elektronika',
    topicId: 'prvky-obvodu',
    title: 'Co dělá dioda',
    year: 2,
    durationMinutes: 8,
    difficulty: 'základní',
    goal:
      'Žák pochopí, že dioda propouští proud hlavně jedním směrem a v opačném směru proud nepropouští nebo jej výrazně omezuje.',
    hook:
      'Proč LED pásek svítí jen tehdy, když ho připojíš správně? Uvnitř sedí součástka, která funguje jako jednosměrka.',
    explanation:
      '**Dioda** propouští proud hlavně **jedním směrem** — od anody ke katodě. Tomu se říká **propustný směr**. V opačném, **závěrném směru** proud neteče běžnou cestou. **LED** je dioda, která při průchodu proudu svítí — a v obvodu ji chrání **rezistor**, aby proud nebyl příliš velký.',
    safetyNote: ELEKTRONIKA_SAFETY_BASE,
    memorySentence: 'Dioda je jednosměrka — proud pouští hlavně jedním směrem.',
    typicalMistake:
      'Žáci obracejí LED a diví se, že nesvítí — v závěrném směru proud neteče. Pomůcka: šipka značky ukazuje propustný směr.',
    teacherTip:
      'První lekce elektroniky — vhodná před praktickým cvičením s LED a nepájivým polem. Ukázka obou směrů se dobře promítá.',
    interactiveDemo: {
      type: 'diode-direction',
      title: 'Kterým směrem dioda pouští proud?',
      description:
        'Vyber směr zapojení a projdi kroky. Sleduj, jak orientace diody ovlivní průchod proudu a rozsvícení LED.',
    },
    activity: {
      measurementJudgment: {
        type: 'measurement-judgment',
        instruction:
          'U každého zapojení rozhodni, jestli LED svítí, nebo nesvítí. Všechna musí být správně.',
        correctLabel: 'LED svítí',
        wrongLabel: 'LED nesvítí',
        successMessage: 'Výborně! Poznáš propustný i závěrný směr diody.',
        scenarios: [
          {
            id: 's1',
            text: 'Dioda je zapojená v propustném směru, v obvodu je ochranný rezistor.',
            correct: 'correct',
            explanation: 'Propustný směr — proud teče a LED svítí.',
          },
          {
            id: 's2',
            text: 'Dioda je otočená do závěrného směru.',
            correct: 'wrong',
            explanation: 'Závěrný směr — proud neteče běžnou cestou, LED nesvítí.',
          },
          {
            id: 's3',
            text: 'LED je zapojená správně (propustně), ale obvod je přerušený rozpojeným vypínačem.',
            correct: 'wrong',
            explanation:
              'I správně otočená LED potřebuje uzavřený obvod — přerušeným obvodem proud neteče.',
          },
          {
            id: 's4',
            text: 'LED je v propustném směru a obvod je uzavřený.',
            correct: 'correct',
            explanation: 'Uzavřený obvod + propustný směr = LED svítí.',
          },
        ],
      },
    },
    quiz: [
      {
        id: 'q1',
        text: 'Kterým směrem dioda propouští proud?',
        options: [
          { id: 'a', text: 'Hlavně jedním směrem — propustným.' },
          { id: 'b', text: 'Oběma směry stejně.' },
          { id: 'c', text: 'Žádným směrem.' },
          { id: 'd', text: 'Jen střídavě tam a zpět.' },
        ],
        correctOptionId: 'a',
        explanation:
          'Dioda je jednosměrka — vede v propustném směru, v závěrném proud nepropouští.',
      },
      {
        id: 'q2',
        text: 'Co se stane, když LED zapojíš do závěrného směru?',
        options: [
          { id: 'a', text: 'Nesvítí — proud neteče běžnou cestou.' },
          { id: 'b', text: 'Svítí jasněji.' },
          { id: 'c', text: 'Změní barvu.' },
          { id: 'd', text: 'Začne blikat.' },
        ],
        correctOptionId: 'a',
        explanation: 'V závěrném směru dioda proud nepropouští, LED nesvítí.',
      },
      {
        id: 'q3',
        text: 'K čemu je v obvodu s LED rezistor?',
        options: [
          { id: 'a', text: 'Omezuje proud, aby se LED nepoškodila.' },
          { id: 'b', text: 'Zvyšuje napětí zdroje.' },
          { id: 'c', text: 'Obrací směr proudu.' },
          { id: 'd', text: 'Je tam jen na ozdobu.' },
        ],
        correctOptionId: 'a',
        explanation:
          'Rezistor je ochranný prvek — omezí proud na bezpečnou hodnotu pro LED.',
      },
    ],
    activityXp: 20,
    quizXp: 15,
    badgeId: 'dioda-pochopena',
    mvpAvailable: true,
  },
  {
    id: 'tranzistor-jako-spinac',
    subjectId: 'elektronika',
    topicId: 'tranzistor-spinac',
    title: 'Tranzistor jako spínač',
    year: 3,
    durationMinutes: 9,
    difficulty: 'základní',
    goal:
      'Žák pochopí, že tranzistor může fungovat jako elektronický spínač: malý řídicí signál může ovládat větší proud v jiné části obvodu.',
    hook:
      'Jak může slabounký signál z čidla rozsvítit velkou LED nebo spustit ventilátor? Tranzistor je spínač bez pohyblivých částí.',
    explanation:
      '**Tranzistor** má řídicí vstup (**bázi**). Když do báze přivedeš **malý řídicí signál**, tranzistor **sepne** a pustí **větší proud** do spotřebiče. Bez signálu je **rozepnutý** a proud neteče. Funguje tedy jako spínač, který ale neovládá ruka, nýbrž elektrický signál — proto je základem elektronického řízení.',
    safetyNote:
      'Tato lekce je zjednodušená školní simulace. Ve skutečných elektronických obvodech se zapojení provádí pouze podle zadání učitele a s bezpečným nízkým napětím.',
    memorySentence: 'Malý signál do báze — velký proud sepnut.',
    typicalMistake:
      'Žáci si myslí, že tranzistor proud „vyrábí“. Nevyrábí — jen malým signálem spíná proud, který dodává zdroj.',
    teacherTip:
      'Navazuje na lekci o diodě. Dobrá ukázka na projektor: třída předpovídá, co udělá LED po zapnutí signálu.',
    interactiveDemo: {
      type: 'transistor-switch',
      title: 'Malý signál spíná větší proud',
      description:
        'Vyber vypnutý nebo zapnutý řídicí signál a projdi kroky. Sleduj, jak malý proud báze umožní větší proud zátěží a rozsvícení LED.',
    },
    activity: {
      measurementJudgment: {
        type: 'measurement-judgment',
        instruction:
          'U každé situace rozhodni, jestli je tranzistor sepnutý, nebo rozepnutý. Všechny musí být správně.',
        correctLabel: 'Tranzistor je sepnutý',
        wrongLabel: 'Tranzistor je rozepnutý',
        successMessage:
          'Výborně! Víš, kdy tranzistor sepne a pustí proud do spotřebiče.',
        scenarios: [
          {
            id: 's1',
            text: 'Na bázi je přiveden řídicí signál.',
            correct: 'correct',
            explanation: 'Signál na bázi = tranzistor sepne a proud teče do spotřebiče.',
          },
          {
            id: 's2',
            text: 'Řídicí signál je vypnutý.',
            correct: 'wrong',
            explanation: 'Bez signálu na bázi je tranzistor rozepnutý — proud neteče.',
          },
          {
            id: 's3',
            text: 'Čidlo poslalo na bázi malý proud, protože se setmělo.',
            correct: 'correct',
            explanation:
              'I malý signál z čidla stačí — tranzistor sepne. Přesně tak funguje automatické rozsvícení.',
          },
          {
            id: 's4',
            text: 'Vodič mezi čidlem a bází je přerušený.',
            correct: 'wrong',
            explanation:
              'Signál se na bázi nedostane — tranzistor zůstává rozepnutý.',
          },
        ],
      },
    },
    quiz: [
      {
        id: 'q1',
        text: 'Co udělá tranzistor, když na bázi přivedeš malý řídicí signál?',
        options: [
          { id: 'a', text: 'Sepne a umožní větší proud do spotřebiče.' },
          { id: 'b', text: 'Rozepne se a proud zastaví.' },
          { id: 'c', text: 'Zvýší napětí zdroje.' },
          { id: 'd', text: 'Nic — báze nemá vliv.' },
        ],
        correctOptionId: 'a',
        explanation: 'Malý signál do báze tranzistor sepne — to je princip spínače.',
      },
      {
        id: 'q2',
        text: 'Vyrábí tranzistor proud pro spotřebič?',
        options: [
          { id: 'a', text: 'Ne — proud dodává zdroj, tranzistor ho jen spíná.' },
          { id: 'b', text: 'Ano, proud vzniká v bázi.' },
          { id: 'c', text: 'Ano, ale jen v noci.' },
          { id: 'd', text: 'Ne, proud vyrábí LED.' },
        ],
        correctOptionId: 'a',
        explanation:
          'Tranzistor je spínač — energii dodává zdroj, tranzistor řídí, kdy proud poteče.',
      },
      {
        id: 'q3',
        text: 'Proč se tranzistoru říká elektronický spínač?',
        options: [
          { id: 'a', text: 'Spíná ho elektrický signál, ne ruka.' },
          { id: 'b', text: 'Protože cvaká jako vypínač.' },
          { id: 'c', text: 'Protože se musí mačkat.' },
          { id: 'd', text: 'Protože funguje jen s žárovkou.' },
        ],
        correctOptionId: 'a',
        explanation:
          'Tranzistor nemá pohyblivé části — spíná ho řídicí signál. Proto umí spínat rychle a automaticky.',
      },
    ],
    activityXp: 20,
    quizXp: 15,
    badgeId: 'spinac-z-tranzistoru',
    mvpAvailable: true,
  },
  {
    id: 'logicka-hradla',
    subjectId: 'elektronika',
    topicId: 'cislicove-obvody',
    title: 'Logické obvody AND, OR, NOT',
    year: 3,
    durationMinutes: 10,
    difficulty: 'střední',
    goal: 'Žák pochopí základní logické funkce AND, OR a NOT pomocí vstupů 0/1 a výstupu.',
    hook:
      'Dveře se otevřou, jen když máš kartu A ZÁROVEŇ není alarm. Přesně takhle „přemýšlí“ logická hradla.',
    explanation:
      'Číslicové obvody pracují se dvěma stavy: **0** (vypnuto) a **1** (zapnuto). **AND** dá výstup 1, jen když jsou **oba** vstupy 1. **OR** dá výstup 1, když je **alespoň jeden** vstup 1. **NOT** má jediný vstup a výstup **obrací**: z 1 udělá 0 a z 0 udělá 1.',
    safetyNote:
      'Tato lekce je školní digitální simulace. Nejde o návod k zapojování skutečných elektronických obvodů bez zadání a dohledu učitele.',
    memorySentence: 'AND chce oba, OR stačí jeden, NOT obrací.',
    typicalMistake:
      'Žáci zaměňují AND a OR — pomůcka: AND = „a zároveň“ (přísné), OR = „nebo“ (stačí jeden).',
    teacherTip:
      'Vhodné jako úvod do číslicové techniky i rychlá aktivita při suplování — hradla si třída může zkoušet společně na projektoru.',
    interactiveDemo: {
      type: 'logic-gates',
      title: 'Vyzkoušej hradla AND, OR a NOT',
      description:
        'Přepínej vstupy 0/1, vyber hradlo a sleduj výstupní LED — svítí = 1, nesvítí = 0.',
    },
    activity: {
      scenarioChoice: {
        type: 'scenario-choice',
        instruction:
          'Vyřeš pět logických situací. U každé vyber správnou odpověď — všechny musí být správně.',
        options: [
          { id: 'out1', label: 'Výstup 1' },
          { id: 'out0', label: 'Výstup 0' },
        ],
        successMessage: 'Výborně! AND, OR i NOT máš v malíku.',
        scenarios: [
          {
            id: 's1',
            text: 'Hradlo AND má dát na výstupu 1. Jak musí vypadat vstupy?',
            correctOptionId: 'oba1',
            explanation: 'AND dá 1 jen tehdy, když jsou oba vstupy 1.',
            options: [
              { id: 'oba1', label: 'A = 1 a B = 1' },
              { id: 'jeden1', label: 'Stačí A = 1, B = 0' },
              { id: 'oba0', label: 'A = 0 a B = 0' },
            ],
          },
          {
            id: 's2',
            text: 'Hradlo OR má dát na výstupu 1. Které vstupy stačí?',
            correctOptionId: 'aspon1',
            explanation: 'OR dá 1, když je alespoň jeden vstup 1 — třeba jen A.',
            options: [
              { id: 'aspon1', label: 'Stačí A = 1 (B může být 0)' },
              { id: 'oba0', label: 'A = 0 a B = 0' },
              { id: 'zadny', label: 'OR nikdy nedá 1' },
            ],
          },
          {
            id: 's3',
            text: 'Hradlo NOT má dát na výstupu 0. Jaký musí být vstup A?',
            correctOptionId: 'a1',
            explanation: 'NOT obrací — výstup 0 dostaneš při vstupu A = 1.',
            options: [
              { id: 'a1', label: 'A = 1' },
              { id: 'a0', label: 'A = 0' },
            ],
          },
          {
            id: 's4',
            text: 'Které hradlo dá výstup 1 jen tehdy, když jsou OBA vstupy 1?',
            correctOptionId: 'and',
            explanation: '„Oba zároveň“ = AND. OR stačí jeden, NOT má jen jeden vstup.',
            options: [
              { id: 'and', label: 'AND' },
              { id: 'or', label: 'OR' },
              { id: 'not', label: 'NOT' },
            ],
          },
          {
            id: 's5',
            text: 'Hradlo OR, vstupy A = 1 a B = 0. Jaký je výstup?',
            correctOptionId: 'out1',
            explanation: 'Alespoň jeden vstup je 1, takže OR dá výstup 1.',
          },
        ],
      },
    },
    quiz: [
      {
        id: 'q1',
        text: 'Kdy dá hradlo AND na výstupu 1?',
        options: [
          { id: 'a', text: 'Jen když jsou oba vstupy 1.' },
          { id: 'b', text: 'Když je alespoň jeden vstup 1.' },
          { id: 'c', text: 'Vždy.' },
          { id: 'd', text: 'Nikdy.' },
        ],
        correctOptionId: 'a',
        explanation: 'AND = „a zároveň“ — potřebuje oba vstupy 1.',
      },
      {
        id: 'q2',
        text: 'Hradlo OR, vstupy A = 0 a B = 1. Jaký je výstup?',
        options: [
          { id: 'a', text: '1 — stačí jeden vstup 1.' },
          { id: 'b', text: '0 — musí být oba 1.' },
          { id: 'c', text: '2.' },
          { id: 'd', text: 'Nelze určit.' },
        ],
        correctOptionId: 'a',
        explanation: 'OR dá 1, když je alespoň jeden vstup 1.',
      },
      {
        id: 'q3',
        text: 'Co udělá hradlo NOT se vstupem 0?',
        options: [
          { id: 'a', text: 'Na výstupu bude 1 — NOT obrací.' },
          { id: 'b', text: 'Na výstupu bude 0.' },
          { id: 'c', text: 'Výstup bude náhodný.' },
          { id: 'd', text: 'NOT se vstupem 0 nefunguje.' },
        ],
        correctOptionId: 'a',
        explanation: 'NOT vždy obrací vstup: z 0 udělá 1, z 1 udělá 0.',
      },
    ],
    activityXp: 25,
    quizXp: 15,
    badgeId: 'logicky-elektrikar',
    mvpAvailable: true,
  },
];
