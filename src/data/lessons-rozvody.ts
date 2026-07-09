import type { MicroLesson } from '../types';

export const rozvodyLessons: MicroLesson[] = [
  {
    id: 'co-dela-jistic',
    subjectId: 'rozvody',
    topicId: 'rozvod-obytne-budovy',
    title: 'Co dělá jistič',
    year: 2,
    durationMinutes: 8,
    difficulty: 'základní',
    goal:
      'Žák pochopí, že jistič chrání obvod před nadproudem a zkratem — nechrání primárně člověka před dotykem.',
    hook:
      'Doma „vyhodilo pojistky“. Co se vlastně stalo — a proč jistič vypnul zrovna teď?',
    explanation:
      '**Jistič** hlídá velikost proudu v obvodu. Při **přetížení** (příliš velký proud po delší dobu) vypne, aby se vodiče nepřehřály. Při **zkratu** (prudký nárůst proudu) vypne okamžitě. Jistič tedy chrání **vedení a rozvod** — malý proud unikající třeba přes člověka vůbec nepozná.',
    safetyNote:
      'Tato lekce je školní simulace. Ve skutečné elektrické instalaci se nesmí zasahovat do rozvodů ani jističů bez odborného dohledu a dodržení bezpečnostních pravidel.',
    memorySentence: 'Jistič hlídá dráty — vypíná při přetížení a zkratu.',
    typicalMistake:
      'Žáci si myslí, že jistič chrání člověka před úrazem proudem. Nechrání — malý unikající proud jistič nevypne.',
    teacherTip:
      'Úvodní lekce k domovnímu rozvodu — zařaď před lekci o proudovém chrániči. Ukázka tří scénářů se dobře promítá a komentuje společně.',
    interactiveDemo: {
      type: 'protection-device',
      title: 'Kdy jistič vypne?',
      description:
        'Vyzkoušej tři scénáře školního obvodu — normální provoz, přetížení a zkrat — a sleduj, kdy jistič vypne a proč.',
    },
    activity: {
      measurementJudgment: {
        type: 'measurement-judgment',
        instruction:
          'U každé situace rozhodni, jestli jistič vypne, nebo zůstane sepnutý. Všechny musí být správně.',
        correctLabel: 'Jistič vypne',
        wrongLabel: 'Jistič zůstane sepnutý',
        successMessage: 'Výborně! Víš, kdy jistič vypne — a kdy naopak nepomůže.',
        scenarios: [
          {
            id: 's1',
            text: 'Obvodem teče běžný proud, spotřebiče pracují normálně.',
            correct: 'wrong',
            explanation:
              'Při normálním provozu jistič zůstává sepnutý — proud je v pořádku.',
          },
          {
            id: 's2',
            text: 'Na jednom obvodu běží najednou konvice, přímotop a trouba — proud je dlouhodobě moc velký.',
            correct: 'correct',
            explanation: 'To je přetížení — jistič po chvíli vypne, aby ochránil vedení.',
          },
          {
            id: 's3',
            text: 'Ve spotřebiči vznikl zkrat — proud prudce vzrostl.',
            correct: 'correct',
            explanation: 'Při zkratu jistič vypne okamžitě.',
          },
          {
            id: 's4',
            text: 'Z poškozeného spotřebiče uniká malý proud na kovový kryt.',
            correct: 'wrong',
            explanation:
              'Malý unikající proud jistič nepozná — proud v obvodu není příliš velký. Od toho je proudový chránič.',
          },
        ],
      },
    },
    quiz: [
      {
        id: 'q1',
        text: 'Před čím jistič chrání?',
        options: [
          { id: 'a', text: 'Před přetížením a zkratem v obvodu.' },
          { id: 'b', text: 'Před dotykem člověka na vodič.' },
          { id: 'c', text: 'Před bleskem.' },
          { id: 'd', text: 'Před vybitím baterie.' },
        ],
        correctOptionId: 'a',
        explanation:
          'Jistič hlídá velikost proudu — vypíná při přetížení a zkratu. Člověka před dotykem primárně nechrání.',
      },
      {
        id: 'q2',
        text: 'Co se stane při zkratu?',
        options: [
          { id: 'a', text: 'Jistič vypne okamžitě.' },
          { id: 'b', text: 'Jistič vypne až za hodinu.' },
          { id: 'c', text: 'Jistič zvýší napětí.' },
          { id: 'd', text: 'Nic — zkrat je normální stav.' },
        ],
        correctOptionId: 'a',
        explanation: 'Zkratový proud je obrovský — jistič musí vypnout okamžitě.',
      },
      {
        id: 'q3',
        text: 'Proč jistič nevypne, když z poškozeného spotřebiče uniká malý proud na kryt?',
        options: [
          { id: 'a', text: 'Protože proud v obvodu není příliš velký — jistič hlídá jen nadproud.' },
          { id: 'b', text: 'Protože jistič je rozbitý.' },
          { id: 'c', text: 'Protože únik proudu je vždy neškodný.' },
          { id: 'd', text: 'Protože jistič vypíná jen v noci.' },
        ],
        correctOptionId: 'a',
        explanation:
          'Jistič reaguje na velikost proudu, ne na jeho únik. Malé úniky hlídá proudový chránič.',
      },
    ],
    activityXp: 20,
    quizXp: 15,
    badgeId: 'hlidac-jistice',
    mvpAvailable: true,
  },
  {
    id: 'co-dela-chranic',
    subjectId: 'rozvody',
    topicId: 'rozvod-obytne-budovy',
    title: 'Co dělá proudový chránič',
    year: 2,
    durationMinutes: 9,
    difficulty: 'základní',
    goal:
      'Žák pochopí, že proudový chránič porovnává proud tekoucí tam a zpět a při rozdílu vypíná.',
    hook:
      'Existuje přístroj, který pozná, že se proud „ztrácí“ cestou — a bleskově vypne. Jak to dělá?',
    explanation:
      '**Proudový chránič** neměří, jak velký proud teče — porovnává **proud tam** a **proud zpět**. V pořádku jsou stejné. Když část proudu **uniká jinudy** (třeba přes poškozený spotřebič), proudy se liší a chránič rychle vypne. Proto je důležitou ochranou i tam, kde by jistič mlčel.',
    safetyNote:
      'Tato lekce je školní simulace. Proudový chránič je důležitý ochranný prvek, ale nenahrazuje bezpečné chování, odborný dohled ani pravidla práce na elektrickém zařízení.',
    memorySentence: 'Chránič porovnává proud tam a zpět — při rozdílu vypne.',
    typicalMistake:
      'Žáci si myslí, že chránič je „lepší jistič“. Není — chránič hlídá únik proudu, jistič hlídá nadproud. Každý řeší jiný problém.',
    teacherTip:
      'Navazuje na lekci o jističi — ideálně obě v jedné hodině. Scénář „chránič nahradí jistič“ v ukázce cíleně boří častý omyl.',
    interactiveDemo: {
      type: 'residual-current',
      title: 'Proud tam a proud zpět',
      description:
        'Vyzkoušej scénáře a sleduj, jak chránič porovnává oba proudy — a kdy vypne.',
    },
    activity: {
      scenarioChoice: {
        type: 'scenario-choice',
        instruction:
          'U každé situace rozhodni, co ji řeší: jistič, proudový chránič, nebo ani jedno samo o sobě nestačí. Všechny musí být správně.',
        options: [
          { id: 'jistic', label: 'Jistič' },
          { id: 'chranic', label: 'Proudový chránič' },
          { id: 'nestaci', label: 'Ani jedno samo nestačí' },
        ],
        successMessage:
          'Výborně! Víš, co řeší jistič, co chránič — a kdy technika sama nestačí.',
        scenarios: [
          {
            id: 's1',
            text: 'Na jednom obvodu běží příliš mnoho spotřebičů a proud je dlouhodobě moc velký.',
            correctOptionId: 'jistic',
            explanation:
              'Velký proud správnou cestou = přetížení. To hlídá jistič.',
          },
          {
            id: 's2',
            text: 'Část proudu uniká z poškozeného spotřebiče mimo běžnou cestu.',
            correctOptionId: 'chranic',
            explanation:
              'Rozdíl mezi proudem tam a zpět pozná proudový chránič a vypne.',
          },
          {
            id: 's3',
            text: 'Žák chce sahat na obnažené vodiče, „protože v rozvaděči je přece chránič“.',
            correctOptionId: 'nestaci',
            explanation:
              'Žádný přístroj nenahradí bezpečné chování. Na vodiče se nesahá — chránič je záchranná síť, ne povolení riskovat.',
          },
          {
            id: 's4',
            text: 'Spotřebič má viditelně poškozený přívodní kabel, ale „zatím funguje“.',
            correctOptionId: 'nestaci',
            explanation:
              'Poškozený spotřebič se přestane používat a nahlásí se učiteli — nespoléhá se na to, že ochrana zasáhne včas.',
          },
        ],
      },
    },
    quiz: [
      {
        id: 'q1',
        text: 'Co proudový chránič porovnává?',
        options: [
          { id: 'a', text: 'Proud tekoucí tam a proud tekoucí zpět.' },
          { id: 'b', text: 'Napětí dvou zásuvek.' },
          { id: 'c', text: 'Teplotu vodičů.' },
          { id: 'd', text: 'Počet spotřebičů v obvodu.' },
        ],
        correctOptionId: 'a',
        explanation:
          'Chránič hlídá rozdíl mezi proudem tam a zpět — rozdíl znamená únik.',
      },
      {
        id: 'q2',
        text: 'Kdy proudový chránič vypne?',
        options: [
          { id: 'a', text: 'Když se proud tam a zpět liší — část uniká jinudy.' },
          { id: 'b', text: 'Když je v obvodu příliš mnoho spotřebičů.' },
          { id: 'c', text: 'Každý den v poledne.' },
          { id: 'd', text: 'Když je napětí přesně 230 V.' },
        ],
        correctOptionId: 'a',
        explanation: 'Rozdíl proudů = únik = chránič vypíná.',
      },
      {
        id: 'q3',
        text: 'Nahrazuje proudový chránič jistič?',
        options: [
          { id: 'a', text: 'Ne — každý hlídá něco jiného, proto bývají v rozvaděči oba.' },
          { id: 'b', text: 'Ano, chránič umí všechno co jistič.' },
          { id: 'c', text: 'Ano, ale jen v koupelně.' },
          { id: 'd', text: 'Ne, chránič je jen ozdoba rozvaděče.' },
        ],
        correctOptionId: 'a',
        explanation:
          'Chránič hlídá únik proudu, jistič nadproud — jeden druhého nenahradí.',
      },
    ],
    activityXp: 20,
    quizXp: 15,
    badgeId: 'chranic-pochopen',
    mvpAvailable: true,
  },
  {
    id: 'jistic-vs-chranic',
    subjectId: 'rozvody',
    topicId: 'rozvod-obytne-budovy',
    title: 'Jistič vs. proudový chránič',
    year: 2,
    durationMinutes: 9,
    difficulty: 'střední',
    goal:
      'Žák rozliší, kdy pomáhá jistič a kdy proudový chránič, a pochopí, že každý řeší jiný problém.',
    hook:
      'V rozvaděči sedí vedle sebe jistič i chránič. Kdyby stačil jeden, druhý by tam nebyl. Poznáš, kdy zasáhne který?',
    explanation:
      '**Jistič** hlídá **velikost proudu** — vypíná při přetížení a zkratu, chrání vedení. **Proudový chránič** hlídá **únik proudu** — vypíná při rozdílu mezi proudem tam a zpět, chrání především člověka. A pozor: některé situace nevyřeší žádný přístroj — správnou reakcí je **přestat a zavolat učitele nebo odborníka**.',
    safetyNote:
      'Tato lekce učí rozpoznávat principy a rizikové situace. Ve skutečné instalaci se závady neřeší pokusem, ale bezpečným postupem pod dohledem učitele nebo odborníka.',
    memorySentence: 'Jistič hlídá dráty, chránič hlídá únik — a hlavu musíš mít vlastní.',
    typicalMistake:
      'Žáci hledají „jeden správný přístroj na všechno“. Neexistuje — a některé situace řeší jen bezpečné rozhodnutí, ne technika.',
    teacherTip:
      'Souhrnná lekce tématu — vhodná jako opakování nebo aktivita při suplování. Karty situací se dají řešit společně hlasováním třídy.',
    interactiveDemo: {
      type: 'protection-scenario',
      title: 'Kdo tu situaci řeší?',
      description:
        'Prohlédni si příklady situací z domovního rozvodu a odkryj, který ochranný prvek — nebo jaké rozhodnutí — pomáhá.',
    },
    activity: {
      scenarioChoice: {
        type: 'scenario-choice',
        instruction:
          'Roztřiď situace: co je hlavní ochranný prvek, nebo jaká je správná reakce? Všechny musí být správně.',
        options: [
          { id: 'jistic', label: 'Jistič' },
          { id: 'chranic', label: 'Proudový chránič' },
          { id: 'odbornik', label: 'Učitel / odborník — nepokračovat' },
          { id: 'nelze', label: 'Nelze určit jen z textu' },
        ],
        successMessage:
          'Výborně! Rozlišuješ práci jističe, chrániče i chvíle, kdy je jediné správné rozhodnutí zastavit se.',
        scenarios: [
          {
            id: 's1',
            text: 'Na jednom obvodu je zapojeno příliš mnoho spotřebičů najednou.',
            correctOptionId: 'jistic',
            explanation:
              'Dlouhodobě velký proud = přetížení — to je práce jističe.',
          },
          {
            id: 's2',
            text: 'Ve spotřebiči vznikl zkrat.',
            correctOptionId: 'jistic',
            explanation: 'Prudký nárůst proudu řeší jistič okamžitým vypnutím.',
          },
          {
            id: 's3',
            text: 'Část proudu uniká mimo běžnou cestu obvodu.',
            correctOptionId: 'chranic',
            explanation:
              'Rozdíl mezi proudem tam a zpět pozná jen proudový chránič.',
          },
          {
            id: 's4',
            text: 'Spotřebič je poškozený — víc z textu nevíme.',
            correctOptionId: 'nelze',
            explanation:
              'Poškození může způsobit zkrat i únik proudu — jen z textu to nepoznáš. Spotřebič se vyřadí a nahlásí.',
          },
          {
            id: 's5',
            text: 'Žák chce sám „vyzkoušet“, proč nefunguje zásuvka, bez učitele.',
            correctOptionId: 'odbornik',
            explanation:
              'Závady se neřeší pokusem. Správná reakce: nepokračovat a zavolat učitele nebo odborníka.',
          },
          {
            id: 's6',
            text: 'Jistič vypadává opakovaně, i po opětovném zapnutí.',
            correctOptionId: 'odbornik',
            explanation:
              'Opakované vypadávání znamená závadu v obvodu — hledat ji musí odborník, ne opakované zapínání.',
          },
        ],
      },
    },
    quiz: [
      {
        id: 'q1',
        text: 'Přetížení obvodu mnoha spotřebiči řeší…',
        options: [
          { id: 'a', text: 'Jistič.' },
          { id: 'b', text: 'Proudový chránič.' },
          { id: 'c', text: 'Prodlužovačka.' },
          { id: 'd', text: 'Nic — přetížení nevadí.' },
        ],
        correctOptionId: 'a',
        explanation: 'Přetížení = příliš velký proud správnou cestou = jistič.',
      },
      {
        id: 'q2',
        text: 'Únik proudu mimo běžnou cestu řeší…',
        options: [
          { id: 'a', text: 'Proudový chránič.' },
          { id: 'b', text: 'Jistič.' },
          { id: 'c', text: 'Vypínač světla.' },
          { id: 'd', text: 'Silnější pojistka.' },
        ],
        correctOptionId: 'a',
        explanation: 'Únik pozná chránič podle rozdílu proudů tam a zpět.',
      },
      {
        id: 'q3',
        text: 'Jistič vypadává opakovaně. Co je správná reakce?',
        options: [
          { id: 'a', text: 'Nepokračovat a zavolat učitele nebo odborníka.' },
          { id: 'b', text: 'Zapínat ho tak dlouho, dokud nedrží.' },
          { id: 'c', text: 'Vyměnit ho za silnější jistič.' },
          { id: 'd', text: 'Jistič přelepit páskou.' },
        ],
        correctOptionId: 'a',
        explanation:
          'Opakované vypadávání = závada. Silnější jistič ani opakované zapínání ji neřeší — jen zvětšují riziko.',
      },
    ],
    activityXp: 25,
    quizXp: 15,
    badgeId: 'rozvodovy-detektiv',
    mvpAvailable: true,
  },
];
