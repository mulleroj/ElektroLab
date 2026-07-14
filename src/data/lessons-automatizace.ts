import type { MicroLesson } from '../types';

export const automatizaceLessons: MicroLesson[] = [
  {
    id: 'co-je-snimac',
    subjectId: 'automatizace',
    topicId: 'snimace',
    title: 'Co je snímač',
    year: 3,
    durationMinutes: 8,
    difficulty: 'základní',
    goal:
      'Žák pochopí, že snímač zjišťuje určitou veličinu nebo stav a předává informaci dál řídicímu systému.',
    hook:
      'Světlo na chodbě se rozsvítí samo, když vejdeš. Jak systém pozná, že tam jsi? Něco mu to muselo říct.',
    explanation:
      '**Snímač** zjišťuje veličinu nebo stav — pohyb, teplotu, hladinu, polohu — a **předává informaci** řídicímu systému. Sám nic nezapíná ani nerozhoduje: je to „oko“ nebo „ucho“ automatu, ne jeho „mozek“. Rozhodnutí dělá řídicí systém na základě toho, co mu snímače hlásí.',
    safetyNote:
      'Tato lekce je školní simulace. Skutečné snímače a elektrická zařízení se zapojují pouze podle zadání učitele nebo odborníka a při dodržení bezpečnostních pravidel.',
    memorySentence: 'Snímač je oko automatu — hlásí, ale nerozhoduje.',
    typicalMistake:
      'Žáci říkají „snímač rozsvítil světlo“. Nerozsvítil — jen ohlásil pohyb; světlo zapnul řídicí systém.',
    teacherTip:
      'Úvodní lekce automatizace — vhodná před exkurzí nebo praktickou ukázkou čidel. Demo s chodbou se dobře komentuje na projektoru.',
    interactiveDemo: {
      type: 'sensor-demo',
      title: 'Snímač pohybu na chodbě',
      description:
        'Vyber situaci a projdi její kroky. Sleduj, co snímač hlásí a jak na to reaguje řídicí systém.',
    },
    activity: {
      termMatching: {
        type: 'term-matching',
        instruction:
          'Klikni na typ snímače vlevo a pak na situaci vpravo, kam patří. Spáruj všechny čtyři dvojice.',
        leftTitle: 'Typ snímače',
        rightTitle: 'Situace',
        terms: [
          { id: 'pohyb', label: 'Snímač pohybu' },
          { id: 'teplota', label: 'Snímač teploty' },
          { id: 'hladina', label: 'Snímač hladiny' },
          { id: 'poloha', label: 'Snímač polohy' },
        ],
        definitions: [
          { id: 'def-svetlo', label: 'Světlo na chodbě' },
          { id: 'def-termostat', label: 'Termostat v místnosti' },
          { id: 'def-nadrz', label: 'Nádrž s vodou' },
          { id: 'def-koncak', label: 'Koncový spínač stroje' },
        ],
        correctPairs: {
          pohyb: 'def-svetlo',
          teplota: 'def-termostat',
          hladina: 'def-nadrz',
          poloha: 'def-koncak',
        },
      },
    },
    quiz: [
      {
        id: 'q1',
        text: 'Co dělá snímač?',
        options: [
          { id: 'a', text: 'Zjišťuje veličinu nebo stav a předává informaci dál.' },
          { id: 'b', text: 'Rozhoduje, co má systém udělat.' },
          { id: 'c', text: 'Dodává systému energii.' },
          { id: 'd', text: 'Nahrazuje celý řídicí systém.' },
        ],
        correctOptionId: 'a',
        explanation:
          'Snímač měří a hlásí — rozhodování je práce řídicího systému.',
      },
      {
        id: 'q2',
        text: 'Který snímač hlídá, kolik vody je v nádrži?',
        options: [
          { id: 'a', text: 'Snímač hladiny.' },
          { id: 'b', text: 'Snímač pohybu.' },
          { id: 'c', text: 'Snímač polohy.' },
          { id: 'd', text: 'Snímač zvuku.' },
        ],
        correctOptionId: 'a',
        explanation: 'Hladinu v nádrži měří snímač hladiny.',
      },
      {
        id: 'q3',
        text: 'Proč světlo na chodbě nerozsvěcí snímač sám?',
        options: [
          { id: 'a', text: 'Snímač jen hlásí pohyb — o zapnutí rozhoduje řídicí systém.' },
          { id: 'b', text: 'Protože je snímač rozbitý.' },
          { id: 'c', text: 'Protože světlo svítí pořád.' },
          { id: 'd', text: 'Snímač světlo rozsvěcí sám, bez ničeho dalšího.' },
        ],
        correctOptionId: 'a',
        explanation:
          'Snímač je „oko“ systému. Vyhodnocení a povel dává řídicí část.',
      },
    ],
    activityXp: 20,
    quizXp: 15,
    badgeId: 'lovec-signalu',
    mvpAvailable: true,
  },
  {
    id: 'regulacni-obvod-zaklad',
    subjectId: 'automatizace',
    topicId: 'regulacni-obvod',
    title: 'Jak funguje regulační obvod',
    year: 3,
    durationMinutes: 9,
    difficulty: 'základní',
    goal:
      'Žák pochopí základní části regulačního obvodu: požadovaná hodnota, snímač, regulátor, akční člen a regulovaná soustava.',
    hook:
      'Termostat doma udrží 22 °C, i když se venku ochladí. Kdo to vlastně řídí — a jak ví, kdy má topit?',
    explanation:
      'Regulační obvod má stálé role: **požadovaná hodnota** říká, čeho chceme dosáhnout. **Snímač** měří skutečnost. **Regulátor** obě hodnoty porovnává a rozhoduje. **Akční člen** (třeba topení) zasahuje. A **regulovaná soustava** (místnost) je to, co řídíme. Díky **zpětné vazbě** se měří pořád dokola — proto systém drží teplotu sám.',
    safetyNote:
      'Tato lekce ukazuje princip regulace ve školní simulaci. Skutečné regulační systémy se nastavují pouze podle zadání, dokumentace a pod dohledem učitele nebo odborníka.',
    memorySentence: 'Snímač měří, regulátor rozhoduje, akční člen zasahuje.',
    typicalMistake:
      'Žáci zaměňují ovládání a regulaci — regulace má zpětnou vazbu: výsledek se měří a porovnává, ovládání „střílí naslepo“.',
    teacherTip:
      'Navazuje na lekci o snímačích. Demo s teplotou funguje dobře jako společné předvídání: třída tipuje, co regulátor udělá.',
    interactiveDemo: {
      type: 'regulation-loop',
      title: 'Regulace teploty v místnosti',
      description:
        'Projdi sedm kroků ukázky a sleduj, jak snímač měří teplotu, regulátor ji porovnává s požadovanými 22 °C a topení reaguje.',
    },
    activity: {
      circuitOrder: {
        type: 'circuit-order',
        instruction:
          'Klikni na části regulačního obvodu ve správném pořadí — od měření po zpětnou vazbu.',
        elements: [
          { id: 'snimac', label: 'Snímač (měří skutečnou hodnotu)' },
          { id: 'regulator', label: 'Regulátor (porovnává a rozhoduje)' },
          { id: 'akcni-clen', label: 'Akční člen (zasahuje — např. topení)' },
          { id: 'soustava', label: 'Regulovaná soustava (např. místnost)' },
          { id: 'zpetna-vazba', label: 'Zpětná vazba (měří se znovu)' },
        ],
        correctOrder: ['snimac', 'regulator', 'akcni-clen', 'soustava', 'zpetna-vazba'],
        successMessage:
          'Výborně! Sestavil jsi regulační smyčku: snímač → regulátor → akční člen → soustava → a zpětnou vazbou zase od začátku.',
      },
    },
    quiz: [
      {
        id: 'q1',
        text: 'Kdo v regulačním obvodu rozhoduje, jestli zapnout topení?',
        options: [
          { id: 'a', text: 'Regulátor.' },
          { id: 'b', text: 'Snímač.' },
          { id: 'c', text: 'Místnost.' },
          { id: 'd', text: 'Topení samo.' },
        ],
        correctOptionId: 'a',
        explanation:
          'Regulátor porovnává naměřenou hodnotu s požadovanou a dává povel.',
      },
      {
        id: 'q2',
        text: 'Co je akční člen v regulaci teploty místnosti?',
        options: [
          { id: 'a', text: 'Topení — provádí zásah.' },
          { id: 'b', text: 'Teploměr.' },
          { id: 'c', text: 'Požadovaná hodnota.' },
          { id: 'd', text: 'Okno.' },
        ],
        correctOptionId: 'a',
        explanation: 'Akční člen vykonává zásah, o kterém rozhodl regulátor.',
      },
      {
        id: 'q3',
        text: 'K čemu slouží zpětná vazba?',
        options: [
          { id: 'a', text: 'Systém měří výsledek svého zásahu a dál podle něj reaguje.' },
          { id: 'b', text: 'Zesiluje napájení regulátoru.' },
          { id: 'c', text: 'Vypíná systém při poruše.' },
          { id: 'd', text: 'Je to jen ozdoba schématu.' },
        ],
        correctOptionId: 'a',
        explanation:
          'Bez zpětné vazby by systém nevěděl, jestli jeho zásah pomohl — reguluje se pořád dokola.',
      },
    ],
    activityXp: 20,
    quizXp: 15,
    badgeId: 'regulator-junior',
    mvpAvailable: true,
  },
  {
    id: 'zpetna-vazba',
    subjectId: 'automatizace',
    topicId: 'regulacni-systemy',
    title: 'Zpětná vazba bez paniky',
    year: 3,
    durationMinutes: 9,
    difficulty: 'základní',
    goal:
      'Žák pochopí, že zpětná vazba znamená, že systém sleduje výsledek svého působení a podle něj upravuje další činnost.',
    hook:
      'Nádrž se plní sama a nikdy nepřeteče. Jak systém ví, kdy má čerpadlo zastavit?',
    explanation:
      '**Zpětná vazba** znamená, že systém **sleduje výsledek** svého působení a podle něj upravuje další činnost. U nádrže: čerpadlo pumpuje → hladina stoupá → snímač to hlásí → systém porovná s limity a rozhodne, jestli pumpovat dál. Bez zpětné vazby by čerpadlo pumpovalo naslepo — a nádrž by přetekla.',
    safetyNote:
      'Tato lekce je zjednodušená školní simulace. Skutečné systémy s čerpadly, snímači a řízením se nesmí upravovat bez odborného dohledu.',
    memorySentence: 'Zpětná vazba: udělej → změř → uprav → a znovu.',
    typicalMistake:
      'Žáci si myslí, že systém „ví“ stav sám od sebe. Neví — všechno, co ví, mu musí ohlásit snímač. Rozbitý snímač = slepý systém.',
    teacherTip:
      'Dobrá lekce k diskusi ‚co se stane, když snímač lže‘. Aktivitu a otázky o poruše snímače či riziku přetečení propojte s BOZP.',
    interactiveDemo: {
      type: 'feedback-loop',
      title: 'Nádrž, čerpadlo a snímač hladiny',
      description:
        'Projdi sedm kroků ukázky a sleduj, jak snímač měří hladinu, regulátor využívá zpětnou vazbu a čerpadlo doplňuje vodu.',
    },
    activity: {
      scenarioChoice: {
        type: 'scenario-choice',
        instruction:
          'U každé situace rozhodni, co má systém (nebo ty) udělat. Všechny musí být správně.',
        options: [
          { id: 'zapnout', label: 'Zapnout čerpadlo' },
          { id: 'vypnout', label: 'Vypnout čerpadlo' },
          { id: 'porucha', label: 'Signalizovat poruchu' },
          { id: 'nepokracovat', label: 'Nepokračovat — učitel / odborník' },
        ],
        successMessage:
          'Výborně! Víš, jak zpětná vazba řídí čerpadlo — i kdy je čas přestat a zavolat odborníka.',
        scenarios: [
          {
            id: 's1',
            text: 'Snímač hlásí nízkou hladinu, vše ostatní je v pořádku.',
            correctOptionId: 'zapnout',
            explanation:
              'Nízká hladina = systém zapne čerpadlo a doplňuje.',
          },
          {
            id: 's2',
            text: 'Hladina dosáhla správné hodnoty.',
            correctOptionId: 'vypnout',
            explanation:
              'Cíl je splněn — čerpadlo se vypne a systém dál jen sleduje.',
          },
          {
            id: 's3',
            text: 'Čerpadlo běží už dlouho, ale snímač hlásí pořád stejnou hladinu — to nedává smysl.',
            correctOptionId: 'porucha',
            explanation:
              'Když výsledek neodpovídá působení, něco je špatně (snímač, čerpadlo, potrubí) — systém má signalizovat poruchu.',
          },
          {
            id: 's4',
            text: 'Žák chce poruchu čerpadla „opravit“ sám zásahem do zapojení.',
            correctOptionId: 'nepokracovat',
            explanation:
              'Do skutečného zařízení se nezasahuje pokusem — správná reakce je nepokračovat a zavolat učitele nebo odborníka.',
          },
        ],
      },
    },
    quiz: [
      {
        id: 'q1',
        text: 'Co znamená zpětná vazba?',
        options: [
          { id: 'a', text: 'Systém sleduje výsledek svého působení a podle něj upravuje činnost.' },
          { id: 'b', text: 'Systém opakuje pořád stejný povel.' },
          { id: 'c', text: 'Systém vrací proud do zásuvky.' },
          { id: 'd', text: 'Systém funguje bez snímačů.' },
        ],
        correctOptionId: 'a',
        explanation: 'Udělej → změř → uprav — to je smyčka zpětné vazby.',
      },
      {
        id: 'q2',
        text: 'Co by se stalo bez zpětné vazby u plnění nádrže?',
        options: [
          { id: 'a', text: 'Čerpadlo by pumpovalo naslepo a nádrž by mohla přetéct.' },
          { id: 'b', text: 'Nic — nádrž se hlídá sama.' },
          { id: 'c', text: 'Čerpadlo by pumpovalo rychleji, ale bezpečně.' },
          { id: 'd', text: 'Hladina by se zastavila sama přesně na limitu.' },
        ],
        correctOptionId: 'a',
        explanation:
          'Bez měření výsledku systém neví, kdy přestat.',
      },
      {
        id: 'q3',
        text: 'Snímač hladiny se porouchá. Co to pro systém znamená?',
        options: [
          { id: 'a', text: 'Systém je „slepý“ — nemá správnou informaci a nemůže správně reagovat.' },
          { id: 'b', text: 'Nic, systém stav uhodne.' },
          { id: 'c', text: 'Systém začne měřit teplotu místo hladiny.' },
          { id: 'd', text: 'Čerpadlo se samo opraví.' },
        ],
        correctOptionId: 'a',
        explanation:
          'Vše, co systém ví, mu hlásí snímače — proto se poruchy snímačů berou vážně.',
      },
    ],
    activityXp: 20,
    quizXp: 15,
    badgeId: 'zpetna-vazba-zvladnuta',
    mvpAvailable: true,
  },
  {
    id: 'logicke-rizeni',
    subjectId: 'automatizace',
    topicId: 'logicke-obvody-automatizace',
    title: 'Jednoduché logické řízení',
    year: 3,
    durationMinutes: 10,
    difficulty: 'střední',
    goal:
      'Žák pochopí, že jednoduchý automat může rozhodovat podle podmínek typu ANO/NE — například pokud je splněna podmínka A a zároveň podmínka B.',
    hook:
      'Dopravník v dílně se nerozjede, dokud není zavřený kryt — i když mačkáš START jak chceš. Proč? Protože automat počítá s tvojí bezpečností.',
    explanation:
      'Jednoduchý automat rozhoduje podle podmínek **ANO/NE**. Dopravník běží, jen když je **START zapnutý A ZÁROVEŇ kryt zavřený** — to je logická podmínka **AND**. Otevřený kryt podmínku poruší a motor se zastaví. Není to schválnost: **bezpečnostní prvky chrání ruce a život** — proto se nikdy neobcházejí.',
    safetyNote:
      'Tato lekce je školní simulace. Bezpečnostní prvky strojů se nesmí obcházet ani upravovat. Ve skutečné praxi se postupuje podle pravidel BOZP a pokynů odborníka.',
    memorySentence: 'START a zároveň zavřený kryt — jinak motor stojí. Kryt se neobchází.',
    typicalMistake:
      'Žáci berou bezpečnostní kryt jako „otravnou překážku“ a napadne je ho přemostit. Automat je ale navržený tak, aby chránil — obejití krytu je vážné porušení BOZP.',
    teacherTip:
      'Navazuje na hradla z Elektroniky (AND v praxi). Scénář „obejít kryt“ je dobrý odrazový můstek pro diskusi o BOZP a skutečných úrazech.',
    interactiveDemo: {
      type: 'automation-logic',
      title: 'Dopravníkový pás s podmínkou AND',
      description:
        'Přepínej START a bezpečnostní kryt a sleduj, kdy motor běží. Zkus obě situace — běží i stojí.',
    },
    activity: {
      scenarioChoice: {
        type: 'scenario-choice',
        instruction:
          'U každé situace rozhodni, co se stane nebo co je správná reakce. Všechny musí být správně.',
        options: [
          { id: 'bezi', label: 'Motor běží' },
          { id: 'nebezi', label: 'Motor neběží' },
          { id: 'nepokracovat', label: 'Nepokračovat — učitel / odborník' },
        ],
        successMessage:
          'Výborně! Podmínku AND máš v malíku — a hlavně víš, že bezpečnostní prvky se neobcházejí.',
        scenarios: [
          {
            id: 's1',
            text: 'START je zapnutý a kryt je zavřený.',
            correctOptionId: 'bezi',
            explanation:
              'Obě podmínky jsou splněny zároveň — AND platí, motor běží.',
          },
          {
            id: 's2',
            text: 'START je zapnutý, ale kryt je otevřený.',
            correctOptionId: 'nebezi',
            explanation:
              'Podmínka AND neplatí — otevřený kryt motor zastaví. Je to bezpečnostní funkce.',
          },
          {
            id: 's3',
            text: 'START je vypnutý a kryt je zavřený.',
            correctOptionId: 'nebezi',
            explanation:
              'Kryt je v pořádku, ale chybí povel START — AND potřebuje obě podmínky.',
          },
          {
            id: 's4',
            text: 'Kryt hlásí poruchu — nejde poznat, jestli je opravdu zavřený.',
            correctOptionId: 'nepokracovat',
            explanation:
              'S nefunkčním bezpečnostním prvkem se nepracuje. Stroj se nechá stát a závadu řeší učitel nebo odborník.',
          },
          {
            id: 's5',
            text: 'Spolužák navrhuje kryt „přemostit drátem“, ať pás jede i otevřený.',
            correctOptionId: 'nepokracovat',
            explanation:
              'Obejití bezpečnostního prvku je vážné porušení BOZP a může někoho zranit. Správná reakce: nepokračovat a říct to učiteli.',
          },
        ],
      },
    },
    quiz: [
      {
        id: 'q1',
        text: 'Kdy motor dopravníku běží?',
        options: [
          { id: 'a', text: 'Jen když je START zapnutý A ZÁROVEŇ kryt zavřený.' },
          { id: 'b', text: 'Kdykoli je zapnutý START.' },
          { id: 'c', text: 'Kdykoli je zavřený kryt.' },
          { id: 'd', text: 'Pořád.' },
        ],
        correctOptionId: 'a',
        explanation: 'Podmínka AND vyžaduje obě podmínky splněné zároveň.',
      },
      {
        id: 'q2',
        text: 'Proč otevřený kryt zastaví motor?',
        options: [
          { id: 'a', text: 'Je to bezpečnostní funkce — chrání obsluhu před zraněním.' },
          { id: 'b', text: 'Aby se šetřila elektřina.' },
          { id: 'c', text: 'Je to porucha, kterou je potřeba obejít.' },
          { id: 'd', text: 'Motor se bojí průvanu.' },
        ],
        correctOptionId: 'a',
        explanation:
          'Otevřený kryt znamená riziko sáhnutí do stroje — automat proto musí zastavit.',
      },
      {
        id: 'q3',
        text: 'Někdo chce bezpečnostní kryt přemostit. Co uděláš?',
        options: [
          { id: 'a', text: 'Nepokračuji a řeknu to učiteli — bezpečnostní prvky se neobcházejí.' },
          { id: 'b', text: 'Pomůžu mu najít vhodný drát.' },
          { id: 'c', text: 'Nic — je to jeho věc.' },
          { id: 'd', text: 'Přemostím ho sám, ale opatrně.' },
        ],
        correctOptionId: 'a',
        explanation:
          'Obcházení ochran ohrožuje životy. Vždy nepokračovat a nahlásit.',
      },
    ],
    activityXp: 25,
    quizXp: 15,
    badgeId: 'automatizacni-logik',
    mvpAvailable: true,
  },
];
