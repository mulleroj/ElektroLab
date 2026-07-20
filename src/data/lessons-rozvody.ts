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
        'Vyber scénář a projdi jeho kroky. Sleduj, jak jistič reaguje při běžném provozu, přetížení a zkratu.',
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
    id: 'pe-n-pen',
    subjectId: 'rozvody',
    topicId: 'rozvod-obytne-budovy',
    title: 'PE, N a PEN — kdo má jakou úlohu',
    year: 2,
    durationMinutes: 10,
    difficulty: 'základní',
    goal:
      'Žák rozliší PE, N a PEN podle funkce, přiřadí pracovní a ochrannou úlohu, vysvětlí význam spojitosti ochranné cesty a chápe, že barva sama není důkazem funkce ani bezpečného stavu.',
    hook:
      'Proč může spotřebič zdánlivě fungovat, i když ochranná cesta není v pořádku? Který vodič potřebuje běžná funkce zařízení, který slouží ochraně — a který vodič obě úlohy kombinuje?',
    explanation:
      '**Dvě různé funkce:** Některé vodiče jsou součástí běžné pracovní proudové cesty. Jiné mají ochrannou funkci. Pracovní a ochranná funkce nejsou totéž. Zařízení může zdánlivě fungovat, i když ochranná funkce není v pořádku — funkčnost sama nepotvrzuje bezpečnost.\n\n**N — střední vodič:** Střední vodič N se v běžném provozu účastní pracovní proudové cesty a proud se jím může vracet ke zdroji. N není ochranný vodič a nelze ho považovat za automaticky bezpečný. Označení ani předpokládaná funkce neznamenají, že se jej lze dotýkat nebo s ním manipulovat.\n\n**PE — ochranný vodič:** Ochranný vodič PE spojuje přístupné vodivé části s ochrannou soustavou. V běžném správném provozu není určen jako vodič pracovního proudu spotřebiče. Při poruše může vytvořit ochrannou cestu pro poruchový proud a tím pomoci působení ochranných prvků. Odpojení nebo přerušení PE může odstranit ochranu, i když zařízení zdánlivě dál funguje. PE se nesmí používat jako náhrada pracovního vodiče — a samotný PE nezabrání každému úrazu.\n\n**PEN — spojené funkce:** Kombinovaný ochranný a střední vodič PEN v jednom vodiči spojuje ochrannou i střední funkci. Nejde jen o jiný název pro PE ani o „dva vodiče slepené dohromady“. Jeho správná spojitost je bezpečnostně kritická. V určeném místě může být podle návrhu instalace rozdělen na samostatný PE a N — podmínky a provedení rozdělení patří do pozdějšího učiva a nejsou předmětem praktické práce žáka.\n\n**Proč je přerušení nebezpečné:** Přerušením PE se může ztratit ochranná cesta. Přerušením PEN se současně naruší pracovní i ochranná funkce. Podle konkrétního zapojení mohou vzniknout nebezpečné potenciály na přístupných vodivých částech. Nemusí jít jen o závadu, při které spotřebič „přestane fungovat“ — závada ochrany může zůstat na první pohled skrytá.\n\n**Barvy a označení:** Ve schématu nebo na bezpečném školním modelu bývá PE označen zelenožlutě a N světle modře; ostatní barvy mohou označovat pracovní nebo fázové vodiče podle zapojení. Barva sama ale není důkazem skutečné funkce ani beznapěťového stavu. Starší, poškozená, přeznačená nebo chybně provedená instalace nemusí odpovídat očekávání. Žádného vodiče se nelze bezpečně dotýkat pouze na základě jeho barvy.\n\n**Schéma není skutečná instalace:** Na schématu nebo školním modelu se žák učí funkce vodičů. Skutečná instalace se neposuzuje pouze pohledem. Žák neotevírá zásuvku, rozvaděč ani svorkovnici a neurčuje vodiče multimetrem ani zkoušečkou. Ověřování skutečné instalace patří pouze oprávněné osobě a vhodným pracovním postupům. Tato lekce není návodem k zásahu do instalace.',
    safetyNote:
      'Výuka probíhá pouze na schématu nebo bezpečném odpojeném školním modelu. Žák neotevírá zásuvky, rozvaděče ani svorkovnice, nepracuje na síťové instalaci a nemanipuluje s vodičem podle barvy. Barva není důkazem funkce ani beznapěťového stavu a vypnutý vypínač není ověření beznapěťového stavu. Žák nepoužívá zkoušečku ani multimetr k určování síťových vodičů. Nejasné, poškozené nebo neobvyklé označení hlásí učiteli. Skutečnou instalaci ověřuje pouze oprávněná osoba vhodnými postupy. Lekce není návodem k práci pod napětím ani k zásahu do instalace.',
    memorySentence:
      'N má pracovní funkci, PE ochrannou, PEN obě spojené — barva sama nepotvrzuje bezpečnost.',
    typicalMistake:
      'Žáci si myslí, že N a PE jsou totéž. N má pracovní funkci, PE ochrannou; PEN kombinuje obě funkce, ale není libovolnou náhradou dvou vodičů. Druhá chyba: podle barvy vždy bezpečně poznám funkci vodiče — barva sama nepotvrzuje funkci ani bezpečný stav. Třetí chyba: když spotřebič funguje, ochranný vodič není potřeba. Funkčnost zařízení nepotvrzuje funkčnost ochrany.',
    teacherTip:
      'Bezpečná výuka: vytištěné jednoduché schéma, kartičky PE / N / PEN / pracovní funkce / ochranná funkce, magnetické symboly na tabuli nebo zcela odpojený školní model. Barvy používej jen jako podpůrné označení, ne jako jediný klíč. Neotevírej skutečnou instalaci, nepracuj na živém zařízení, nenech žáky hledat vodiče zkoušečkou, nepřerušuj PE, N ani PEN, nevytvářej poruchový stav a nezasahuj do rozvaděče ani zásuvky.',
    activity: {
      scenarioChoice: {
        type: 'scenario-choice',
        instruction:
          'U každé situace na jednoduchém schématu nebo v popisu rozhodni, o jaký vodič jde — nebo že to podle barvy bezpečně určit nelze. Všechny čtyři musí být správně.',
        options: [
          { id: 'pe', label: 'PE' },
          { id: 'n', label: 'N' },
          { id: 'pen', label: 'PEN' },
          { id: 'nelze-barva', label: 'Nelze bezpečně určit pouze podle barvy' },
        ],
        successMessage:
          'Výborně! Rozlišuješ PE, N a PEN podle funkce a víš, kdy barva sama nestačí.',
        scenarios: [
          {
            id: 's1',
            text: 'Na jednoduchém schématu vodič patří do běžné pracovní proudové cesty, vede proud ze spotřebiče zpět ke zdroji a nemá ochrannou funkci PE.',
            correctOptionId: 'n',
            explanation:
              'To je střední vodič N — účastní se pracovní proudové cesty. N není ochranný vodič a nelze ho považovat za automaticky bezpečný.',
          },
          {
            id: 's2',
            text: 'Na jednoduchém schématu vodič spojuje přístupnou vodivou část zařízení s ochrannou soustavou. V běžném provozu není určen jako vodič pracovního proudu spotřebiče; při poruše může vést poruchový proud.',
            correctOptionId: 'pe',
            explanation:
              'To je ochranný vodič PE. V běžném provozu není pracovní cestou spotřebiče, ale při poruše může vést poruchový proud — neříkáme, že proud nikdy nevede.',
          },
          {
            id: 's3',
            text: 'Na jednoduchém schématu jeden vodič plní ochrannou i střední funkci. Jeho přerušení může současně narušit obě funkce.',
            correctOptionId: 'pen',
            explanation:
              'To je PEN — kombinovaný ochranný a střední vodič. Nejde jen o jiný název pro PE.',
          },
          {
            id: 's4',
            text: 'V neznámé skutečné instalaci je vidět vodič určité barvy. Žák má rozhodnout, zda je bezpečný a jakou má skutečnou funkci.',
            correctOptionId: 'nelze-barva',
            explanation:
              'Pouze podle barvy to bezpečně určit nelze. S vodičem nemanipuluj, instalaci neotvírej, situaci oznam učiteli nebo odpovědné osobě — funkci a stav ověřuje oprávněná osoba.',
          },
        ],
      },
    },
    quiz: [
      {
        id: 'q1',
        text: 'Čím se liší střední vodič N a ochranný vodič PE?',
        options: [
          { id: 'a', text: 'N patří do pracovní proudové cesty; PE má ochrannou funkci a není náhradou pracovního vodiče.' },
          { id: 'b', text: 'N a PE jsou totéž — jen jiný název pro stejný vodič v každé instalaci.' },
          { id: 'c', text: 'PE běžně napájí spotřebič místo fázového vodiče.' },
          { id: 'd', text: 'Podle barvy je každý z nich vždy bezpečný.' },
        ],
        correctOptionId: 'a',
        explanation:
          'N patří do pracovní proudové cesty. PE má ochrannou funkci a neslouží jako náhrada pracovního vodiče. Barva sama bezpečnost nepotvrzuje.',
      },
      {
        id: 'q2',
        text: 'Co platí o vodiči PEN?',
        options: [
          { id: 'a', text: 'Je to jen starší název pro PE.' },
          { id: 'b', text: 'Kombinuje ochrannou a střední funkci; přerušení může narušit obě.' },
          { id: 'c', text: 'Lze ho libovolně nahradit dvěma vodiči bez ohledu na návrh instalace.' },
          { id: 'd', text: 'Bezpečně ho vždy poznáš jen podle barvy.' },
        ],
        correctOptionId: 'b',
        explanation:
          'PEN spojuje ochrannou a střední funkci. Přerušení může narušit obě. Nejde jen o jiný název PE a barva sama nestačí.',
      },
      {
        id: 'q3',
        text: 'V neznámé skutečné instalaci vidíš vodič očekávané barvy. Co je správný postup?',
        options: [
          { id: 'a', text: 'Dotknout se ho — očekávaná barva znamená, že je bezpečný.' },
          { id: 'b', text: 'Otevřít zásuvku nebo rozvaděč a vodič přeznačit.' },
          { id: 'c', text: 'Barva nepotvrzuje funkci ani bezpečný stav; s vodičem nemanipuluj — instalaci ověřuje oprávněná osoba.' },
          { id: 'd', text: 'Proměřit ho žákovským multimetrem a podle naměřené hodnoty rozhodnout o bezpečnosti.' },
        ],
        correctOptionId: 'c',
        explanation:
          'Barva není důkaz funkce ani beznapěťového stavu. Žák s vodičem nemanipuluje a skutečnou instalaci ověřuje oprávněná osoba.',
      },
    ],
    activityXp: 20,
    quizXp: 15,
    badgeId: 'vodicovy-strazce',
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
        'Vyber scénář a projdi jeho kroky. Sleduj, jak proudový chránič porovnává proud tam a zpět — a kdy vypne.',
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
