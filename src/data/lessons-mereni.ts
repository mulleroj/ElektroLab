import type { MicroLesson } from '../types';

const MERENI_SAFETY =
  'Tato lekce je školní simulace. Ve skutečném obvodu se měří pouze podle pokynů učitele, s vhodným měřicím přístrojem a při dodržení bezpečnostních pravidel.';

export const mereniLessons: MicroLesson[] = [
  {
    id: 'od-vypoctu-k-mereni',
    subjectId: 'mereni',
    topicId: 'metody-mereni',
    title: 'Od výpočtu k měření: U, I a R',
    year: 1,
    durationMinutes: 10,
    difficulty: 'základní',
    goal:
      'Žák rozliší výpočet a měření U, I a R, zná základní zapojení voltmetru a ampérmetru, ví, že odpor se měří jen v odpojeném beznapěťovém obvodu, a umí použít Ohmův zákon na jednoduchou dvojici hodnot.',
    hook:
      'Z Ohmova zákona umíš spočítat R. Ale kdy máš hodnotu spočítat a kdy ji změřit — a proč se obě čísla někdy mírně liší?',
    explanation:
      '**Výpočet** používá známé hodnoty a vztahy — například Ohmův zákon. **Měření** používá měřicí přístroj. Obě metody se mohou vzájemně kontrolovat. Vypočtená a změřená hodnota nemusí být naprosto stejná: malý rozdíl může vzniknout tolerancí součástek, přesností měřidla, odporem vodičů a kontaktů nebo podmínkami měření. Malý rozdíl sám o sobě nemusí znamenat chybu. Velkou nebo neočekávanou odchylku ale neignoruj — nejdřív ji bezpečně prověř.\n\n**Napětí:** voltmetr se připojuje **paralelně** mezi dva body nebo ke svorkám měřeného prvku. Měří rozdíl potenciálů mezi těmito body. Kvůli připojení voltmetru se běžná proudová cesta nerozpojuje.\n\n**Proud:** ampérmetr se zapojuje **sériově** do proudové cesty — proud musí měřidlem procházet. Paralelní připojení ampérmetru ke zdroji nebo spotřebiči je chybný a nebezpečný postup. Takové zapojení se neprovádí.\n\n**Odpor:** měří se pouze v **odpojeném** obvodu a až po ověření **beznapěťového** stavu. Ohmmetr ani režim odporu multimetru se nepřipojuje k živému obvodu — přítomné napětí může zkreslit výsledek a poškodit měřidlo. V zapojeném obvodu mohou výsledek ovlivnit i další vodivé cesty.\n\n**Před připojením** zvol správnou měřenou veličinu. Správné zdířky a rozsah se volí podle návodu a pokynu učitele. Není-li hodnota známa, postupuj podle bezpečného školního postupu a návodu přístroje.\n\n**Příklad:** na bezpečném modelu je U = 6 V a I = 0,03 A. Pak R = U / I = 6 / 0,03 = **200 Ω**. Skutečné měření může ukázat hodnotu blízkou 200 Ω — například 205 Ω. Mírná odchylka sama o sobě nemusí znamenat chybu.',
    safetyNote:
      'Praktické měření provádí žák pouze na schváleném bezpečném školním nízkonapěťovém modelu a vždy pod dohledem učitele. Síťová instalace není určena k žákovskému procvičování. Odpor se měří pouze po odpojení a ověření beznapěťového stavu. Ampérmetr se nikdy nepřipojuje paralelně ke zdroji. Závadu, poškozený vodič nebo nejasný stav žák nezkoumá pokusem, ale hlásí učiteli. Tato lekce není návodem k práci na živém zařízení.',
    memorySentence:
      'Napětí měříme paralelně, proud sériově a odpor jen v odpojeném obvodu.',
    typicalMistake:
      'Žáci zapojí voltmetr sériově nebo ampérmetr paralelně. Další chyba je měřit odpor v obvodu pod napětím. Někteří očekávají, že výpočet a měření musí být vždy naprosto totožné, nebo naopak každý malý rozdíl považují za fatální chybu. Také mění funkci či zdířky měřidla bez kontroly a při výpočtu smíchají mA s A.',
    teacherTip:
      'Navazuje na Ohmův zákon ze Základů. Zdůrazni most výpočet ↔ měření na bezpečném modelu 6 V / 0,03 A → 200 Ω. Nežádej měření na síti. Podrobnosti voltmetru, ampérmetru a rozsahu nech navazujícím lekcím.',
    activity: {
      measurementJudgment: {
        type: 'measurement-judgment',
        instruction:
          'U každé situace rozhodni, jestli je postup nebo úsudek v pořádku, nebo chybný. Všechny čtyři situace musí být správně.',
        correctLabel: 'Postup nebo úsudek je v pořádku',
        wrongLabel: 'Postup nebo úsudek je chybný',
        successMessage:
          'Výborně! Rozlišuješ bezpečné měření U, I a R a umíš posoudit malou odchylku výpočtu a měření.',
        scenarios: [
          {
            id: 's1',
            text: 'Na bezpečném nízkonapěťovém modelu je voltmetr připojen ke dvěma svorkám spotřebiče.',
            correct: 'correct',
            explanation:
              'Správný princip měření napětí — voltmetr je připojen paralelně ke spotřebiči.',
          },
          {
            id: 's2',
            text: 'Návrh počítá s paralelním připojením ampérmetru přímo ke zdroji na bezpečném modelu.',
            correct: 'wrong',
            explanation:
              'Nebezpečný a chybný postup — ampérmetr se takto nepřipojuje. Takové zapojení se neprovádí.',
          },
          {
            id: 's3',
            text: 'Žák chce měřit odpor prvku v odpojeném modelu po ověření beznapěťového stavu.',
            correct: 'correct',
            explanation:
              'Správná základní podmínka měření odporu — odpojený a ověřeně beznapěťový obvod.',
          },
          {
            id: 's4',
            text: 'Výpočet z U = 6 V a I = 0,03 A dal R = 200 Ω. Měření na bezpečném modelu ukázalo 205 Ω.',
            correct: 'correct',
            explanation:
              'Malá odchylka může být přijatelná — ber ji v kontextu tolerance součástek a přesnosti měření. Velkou odchylku bys bezpečně prověřil.',
          },
        ],
      },
    },
    quiz: [
      {
        id: 'q1',
        text: 'Co musí platit před měřením odporu?',
        options: [
          { id: 'a', text: 'Obvod je odpojený a je ověřeno, že není pod napětím.' },
          { id: 'b', text: 'Obvod musí zůstat pod provozním napětím zdroje.' },
          { id: 'c', text: 'Stačí zapnout režim odporu a měřit v zapojeném obvodu.' },
          { id: 'd', text: 'Odpor se měří jen při maximálním proudu obvodu.' },
        ],
        correctOptionId: 'a',
        explanation:
          'Odpor se měří jen v odpojeném obvodu po ověření beznapěťového stavu. Na živý obvod se režim odporu nepřipojuje.',
      },
      {
        id: 'q2',
        text: 'Proč se vypočtená a změřená hodnota mohou mírně lišit?',
        options: [
          { id: 'a', text: 'Kvůli toleranci součástek, přesnosti měřidla a podmínkám měření.' },
          { id: 'b', text: 'Protože Ohmův zákon při měření neplatí.' },
          { id: 'c', text: 'Protože měřidlo vždy ukazuje náhodné číslo.' },
          { id: 'd', text: 'Protože každou odchylku lze bez kontroly ignorovat.' },
        ],
        correctOptionId: 'a',
        explanation:
          'Malý rozdíl může vzniknout tolerancí, přesností přístroje nebo podmínkami měření. Neznamená to, že zákon neplatí, ani že odchylku smíš vždy ignorovat.',
      },
      {
        id: 'q3',
        text: 'Na bezpečném modelu je U = 6 V a I = 0,03 A. Jaký je odpor?',
        options: [
          { id: 'a', text: '200 Ω' },
          { id: 'b', text: '20 Ω' },
          { id: 'c', text: '0,005 Ω' },
          { id: 'd', text: '180 Ω' },
        ],
        correctOptionId: 'a',
        explanation: 'R = U / I = 6 / 0,03 = 200 Ω. Proud je už v ampérech, převod není potřeba.',
      },
    ],
    activityXp: 20,
    quizXp: 15,
    badgeId: 'merici-detektiv',
    mvpAvailable: true,
  },
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
    teacherTip:
      'Zařaď před první praktické měření v dílně. Interaktivní ukázka na projektoru dobře předvede rozdíl sériově/paralelně bez rizika.',
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
    teacherTip:
      'Navazuje na lekci o voltmetru — ideálně obě v jedné hodině. Zdůrazni bezpečnostní rozdíl: špatně zapojený ampérmetr je zkrat.',
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
    teacherTip:
      'Souhrnná lekce po voltmetru a ampérmetru — vhodná jako opakování před praktickým cvičením nebo jako rychlá aktivita při suplování.',
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
  {
    id: 'vyber-rozsahu',
    subjectId: 'mereni',
    topicId: 'merici-pristroje',
    title: 'Výběr správného měřicího rozsahu',
    year: 1,
    durationMinutes: 8,
    difficulty: 'základní',
    goal:
      'Žák vysvětlí, proč se měření začíná na největším rozsahu, a rozpozná správnou a chybnou volbu rozsahu.',
    hook: 'Měříš baterii 12 V a přístroj máš nastavený na rozsah 2 V. Co se stane s ručičkou?',
    explanation:
      'Každý měřicí přístroj má **měřicí rozsahy** — největší hodnotu, kterou na daném nastavení umí změřit. Když neznáš měřenou hodnotu, začni vždy na **největším rozsahu** a postupně přepínej na menší, dokud údaj nečteš přesně. Příliš malý rozsah může přístroj přetížit, příliš velký dává nepřesné čtení.',
    safetyNote:
      'Tato lekce je školní simulace. Špatně zvolený rozsah může ve skutečnosti poškodit měřicí přístroj. Rozsah nastavuj vždy před připojením a měř jen podle pokynů učitele.',
    memorySentence: 'Neznáš hodnotu? Začni od největšího rozsahu.',
    typicalMistake:
      'Žák nechá přístroj na malém rozsahu z minulého měření a připojí ho na větší napětí — ručička narazí a přístroj se může poškodit.',
    teacherTip:
      'Zařaď před první samostatné měření s multimetrem. Scénáře se hodí i jako společné rozhodování třídy na projektoru.',
    activity: {
      measurementJudgment: {
        type: 'measurement-judgment',
        instruction:
          'U každé situace rozhodni, jestli je volba rozsahu v pořádku, nebo chybná. Všechny musí být správně.',
        correctLabel: 'Postup je v pořádku',
        wrongLabel: 'Postup je chybný',
        successMessage: 'Výborně! Rozpoznal jsi správnou i chybnou volbu měřicího rozsahu.',
        scenarios: [
          {
            id: 's1',
            text: 'Žák nezná napětí zdroje, proto začne měřit na největším rozsahu voltmetru.',
            correct: 'correct',
            explanation: 'Správně — od největšího rozsahu se postupuje dolů.',
          },
          {
            id: 's2',
            text: 'Žák měří baterii 12 V na rozsahu 2 V, protože „to je rychlejší“.',
            correct: 'wrong',
            explanation: 'Chyba — hodnota je nad rozsahem, přístroj se přetíží.',
          },
          {
            id: 's3',
            text: 'Údaj je na velkém rozsahu špatně čitelný, žák přepne o rozsah níž a čte přesněji.',
            correct: 'correct',
            explanation: 'Správně — postupné snižování rozsahu zpřesňuje čtení.',
          },
          {
            id: 's4',
            text: 'Žák přepíná rozsah ve chvíli, kdy je přístroj připojený k obvodu, bez pokynu učitele.',
            correct: 'wrong',
            explanation:
              'Chyba — rozsah se nastavuje před připojením a měří se podle pokynů učitele.',
          },
        ],
      },
    },
    quiz: [
      {
        id: 'q1',
        text: 'Neznáš měřenou hodnotu. Na jakém rozsahu začneš?',
        options: [
          { id: 'a', text: 'Na největším rozsahu.' },
          { id: 'b', text: 'Na nejmenším rozsahu.' },
          { id: 'c', text: 'Na libovolném — nezáleží na tom.' },
          { id: 'd', text: 'Rozsah se nastavuje až po měření.' },
        ],
        correctOptionId: 'a',
        explanation: 'Od největšího rozsahu postupuješ dolů — přístroj tak nepřetížíš.',
      },
      {
        id: 'q2',
        text: 'Co hrozí při měření na příliš malém rozsahu?',
        options: [
          { id: 'a', text: 'Přetížení a poškození přístroje.' },
          { id: 'b', text: 'Nic — přístroj se přizpůsobí.' },
          { id: 'c', text: 'Jen o něco pomalejší měření.' },
          { id: 'd', text: 'Zvýší se napětí zdroje.' },
        ],
        correctOptionId: 'a',
        explanation: 'Hodnota nad rozsahem přístroj přetíží — může se poškodit.',
      },
      {
        id: 'q3',
        text: 'Údaj na velkém rozsahu je špatně čitelný. Co uděláš?',
        options: [
          { id: 'a', text: 'Postupně přepnu na menší rozsah a čtu přesněji.' },
          { id: 'b', text: 'Odhadnu hodnotu od oka.' },
          { id: 'c', text: 'Přepnu rovnou na nejmenší rozsah.' },
          { id: 'd', text: 'Vypnu přístroj a napíšu nulu.' },
        ],
        correctOptionId: 'a',
        explanation: 'Rozsah se snižuje postupně, dokud není údaj dobře čitelný.',
      },
    ],
    activityXp: 20,
    quizXp: 15,
    badgeId: 'spravny-rozsah',
    mvpAvailable: true,
  },
];
