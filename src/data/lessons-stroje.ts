import type { MicroLesson } from '../types';

export const strojeLessons: MicroLesson[] = [
  {
    id: 'co-je-transformator',
    subjectId: 'stroje',
    topicId: 'transformatory',
    title: 'Co je transformátor',
    year: 2,
    durationMinutes: 8,
    difficulty: 'základní',
    goal:
      'Žák pochopí, že transformátor mění velikost střídavého napětí pomocí magnetického pole a vinutí — primár, sekundár, jádro, změna napětí.',
    hook:
      'Nabíječka mobilu udělá z 230 V bezpečných pár voltů. Uvnitř nesedí zázrak, ale dvě cívky a kus železa.',
    explanation:
      '**Transformátor** má dvě vinutí na společném **magnetickém jádru**. Střídavé napětí na **primárním vinutí** vytváří v jádru střídavé magnetické pole — a to indukuje napětí v **sekundárním vinutí**. Kolik ho bude, určuje **poměr závitů**: více závitů na sekundáru = vyšší napětí, méně závitů = nižší napětí, stejně závitů = přibližně stejné napětí.',
    safetyNote:
      'Tato lekce je školní simulace principu transformátoru. Skutečné transformátory a zařízení s vyšším napětím se nesmí otevírat, měřit ani upravovat bez odborného dohledu a dodržení bezpečnostních pravidel.',
    memorySentence: 'Více závitů na sekundáru = vyšší napětí. Méně = nižší.',
    typicalMistake:
      'Žáci si myslí, že transformátor „vyrábí energii“. Nevyrábí — jen mění napětí; funguje navíc pouze se střídavým proudem.',
    teacherTip:
      'První lekce strojů — hodí se před exkurzí i před tématem rozvodné soustavy. Demo se třemi variantami vinutí funguje dobře jako společné tipování.',
    interactiveDemo: {
      type: 'transformer-demo',
      title: 'Závity rozhodují o napětí',
      description:
        'Vyzkoušej tři varianty sekundárního vinutí a sleduj, co se stane s výstupním napětím.',
    },
    activity: {
      scenarioChoice: {
        type: 'scenario-choice',
        instruction:
          'U každé situace rozhodni, co transformátor s napětím udělá. Všechny musí být správně.',
        options: [
          { id: 'zvysuje', label: 'Zvyšuje napětí' },
          { id: 'snizuje', label: 'Snižuje napětí' },
          { id: 'stejne', label: 'Převod přibližně 1:1' },
        ],
        successMessage:
          'Výborně! Poměr závitů máš v malíku — víš, kdy trafo zvyšuje, snižuje i kdy jen odděluje.',
        scenarios: [
          {
            id: 's1',
            text: 'Sekundární vinutí má výrazně více závitů než primární.',
            correctOptionId: 'zvysuje',
            explanation:
              'Více závitů na sekundáru = vyšší výstupní napětí — transformátor zvyšuje.',
          },
          {
            id: 's2',
            text: 'Sekundární vinutí má jen zlomek závitů primáru — třeba v nabíječce z 230 V na pár voltů.',
            correctOptionId: 'snizuje',
            explanation:
              'Méně závitů na sekundáru = nižší napětí — přesně to dělá nabíječka.',
          },
          {
            id: 's3',
            text: 'Obě vinutí mají stejný počet závitů.',
            correctOptionId: 'stejne',
            explanation:
              'Stejný počet závitů = napětí zůstane přibližně stejné; takové trafo hlavně bezpečně odděluje obvody.',
          },
          {
            id: 's4',
            text: 'Elektrárna posílá energii na dálkové vedení a potřebuje k tomu mnohem vyšší napětí.',
            correctOptionId: 'zvysuje',
            explanation:
              'Pro dálkový přenos se napětí transformátorem zvyšuje — sekundár má víc závitů.',
          },
        ],
      },
    },
    quiz: [
      {
        id: 'q1',
        text: 'Co transformátor dělá?',
        options: [
          { id: 'a', text: 'Mění velikost střídavého napětí pomocí vinutí a magnetického jádra.' },
          { id: 'b', text: 'Vyrábí elektrickou energii.' },
          { id: 'c', text: 'Mění střídavý proud na světlo.' },
          { id: 'd', text: 'Skladuje elektřinu na později.' },
        ],
        correctOptionId: 'a',
        explanation:
          'Transformátor napětí jen mění (nahoru či dolů) — energii nevyrábí ani neskladuje.',
      },
      {
        id: 'q2',
        text: 'Sekundár má méně závitů než primár. Co to znamená?',
        options: [
          { id: 'a', text: 'Výstupní napětí bude nižší.' },
          { id: 'b', text: 'Výstupní napětí bude vyšší.' },
          { id: 'c', text: 'Transformátor nebude fungovat.' },
          { id: 'd', text: 'Napětí zůstane úplně stejné.' },
        ],
        correctOptionId: 'a',
        explanation: 'Méně závitů na sekundáru = nižší napětí na výstupu.',
      },
      {
        id: 'q3',
        text: 'Co spojuje primární a sekundární vinutí?',
        options: [
          { id: 'a', text: 'Magnetické pole ve společném jádru.' },
          { id: 'b', text: 'Přímý drát mezi vinutími.' },
          { id: 'c', text: 'Světelný paprsek.' },
          { id: 'd', text: 'Nic — vinutí spolu nesouvisí.' },
        ],
        correctOptionId: 'a',
        explanation:
          'Vinutí nejsou vodivě spojena — energii přenáší střídavé magnetické pole v jádru.',
      },
    ],
    activityXp: 20,
    quizXp: 15,
    badgeId: 'mistr-transformatoru',
    mvpAvailable: true,
  },
  {
    id: 'prevod-transformatoru',
    subjectId: 'stroje',
    topicId: 'transformatory',
    title: 'Převod transformátoru',
    year: 2,
    durationMinutes: 10,
    difficulty: 'základní',
    goal:
      'Žák použije idealizovaný vztah mezi počtem závitů a napětím, vypočítá U2, rozliší zvyšovací, snižovací a přibližně 1 : 1 převod a zkontroluje rozumnost výsledku.',
    hook:
      'Už víš, že více závitů na sekundáru znamená vyšší napětí. Dokážeš ale spočítat, kolikrát se napětí změní?',
    explanation:
      '**Co už znáš:** Transformátor má primární a sekundární vinutí na společném jádru. Více závitů na sekundáru znamená v jednoduchém modelu vyšší napětí, méně závitů nižší napětí.\n\n' +
      '**Čtyři značky:** U1 je napětí na primárním vinutí a N1 je počet jeho závitů. U2 je napětí na sekundárním vinutí a N2 je počet jeho závitů. U1 a U2 se udávají ve voltech. N1 a N2 jsou počty závitů — počet závitů nemá jednotku volt.\n\n' +
      '**Poměr závitů a napětí:** V jednoduchém idealizovaném modelu transformátoru platí přibližně U1 / U2 = N1 / N2. Poměr napětí odpovídá poměru závitů.\n\n' +
      '**Výpočet sekundárního napětí:** Ze stejného vztahu dostaneme praktický tvar U2 = U1 × N2 / N1. Do vzorce dosadíme známé hodnoty a spočítáme U2.\n\n' +
      '**Nejdřív odhad, potom výpočet:** Před počítáním porovnej N2 a N1. Když je N2 menší než N1, očekávej U2 menší než U1. Když je N2 větší než N1, očekávej U2 větší než U1. Když je N2 rovno N1, očekávej přibližně U2 rovno U1. Po výpočtu porovnej výsledek s tímto odhadem.\n\n' +
      '**Zvyšovací, snižovací a 1 : 1:** Příklad snižovacího převodu: U1 = 24 V, N1 = 120 závitů, N2 = 60 závitů. N2 je polovina N1, takže očekáváme přibližně poloviční U2. Výpočet: U2 = 24 × 60 / 120 = 12 V. Dvanáct voltů je méně než 24 V, výsledek odpovídá snižovacímu transformátoru. Příklad zvyšovacího převodu: U1 = 12 V, N1 = 100 závitů, N2 = 200 závitů. N2 je dvojnásobné proti N1, takže U2 je v idealizovaném modelu přibližně dvojnásobné: U2 = 12 × 200 / 100 = 24 V.\n\n' +
      '**Hranice jednoduchého modelu:** Idealizovaný vztah popisuje jen poměr závitů a napětí. Transformátor energii nevyrábí; proud, výkon a ztráty budeme řešit v další lekci. Převod určuje poměr závitů, ne samotná velikost zařízení.',
    safetyNote:
      'Výpočty probíhají pouze z připravených údajů nebo simulace. Žák nepřipojuje transformátor k zásuvce, neměří primární ani sekundární stranu síťového transformátoru a neotevírá nabíječku, zdroj ani transformátor. Odkryté svorky se nepoužívají. Žádné pokusy s 230 V a žádné přepojování vinutí. Sekundární strana není automaticky bezpečná. Nižší napětí neznamená nulové riziko. Transformátor bez připojené zátěže může mít na sekundáru napětí. Nelze předpokládat, že každý transformátor galvanicky odděluje. Místní školní pravidla a pokyn učitele mají přednost.',
    memorySentence:
      'V idealizovaném modelu platí U2 = U1 × N2 / N1; více závitů na sekundáru znamená vyšší napětí.',
    typicalMistake:
      'Obrácení poměru N1 a N2 ve vzorci. Zaměnění počtu závitů za volty. Počítání bez předchozího odhadu zvyšovacího nebo snižovacího směru. Přijetí výsledku, který odporuje poměru závitů. Představa, že transformátor vytváří energii. Představa, že větší fyzický transformátor automaticky více zvyšuje napětí — převod určuje poměr závitů, ne velikost zařízení. Idealizovaný vztah nepopisuje výkon ani bezpečnost.',
    teacherTip:
      'Nakresli tabulku U1, U2, N1, N2. Nejdřív nech žáky odhadnout zvyšovací nebo snižovací směr, až potom dosadit do vzorce a výsledek porovnat s odhadem. Používej připravené kartičky a bezpečná data 12 V nebo 24 V. Nech žáky vysvětlit chybu v obráceném poměru N1 / N2. Existující TransformerDemo můžeš použít jen jako kvalitativní připomenutí — neměň jeho komponentu a nevkládej je do této lekce. Zakázáno je síťové měření, vlastní přepojování vinutí, otevírání zařízení a práce s odkrytými svorkami.',
    activity: {
      measurementJudgment: {
        type: 'measurement-judgment',
        instruction:
          'U každého tvrzení rozhodni, zda platí, nebo neplatí. Všech pět musí být správně.',
        correctLabel: 'Tvrzení platí',
        wrongLabel: 'Tvrzení neplatí',
        successMessage:
          'Výborně! Umíš použít vzorec U2 = U1 × N2 / N1, rozlišit směr převodu a nezaměnit závity za volty.',
        scenarios: [
          {
            id: 's1',
            text: 'U1 = 24 V, N1 = 120 a N2 = 60. Výsledek U2 = 12 V odpovídá poměru závitů.',
            correct: 'correct',
            explanation:
              'Ano. V idealizovaném modelu platí U2 = U1 × N2 / N1, tedy 24 × 60 / 120 = 12 V.',
          },
          {
            id: 's2',
            text: 'Sekundární vinutí má více závitů než primární, proto musí být sekundární napětí v idealizovaném modelu nižší.',
            correct: 'wrong',
            explanation:
              'Neplatí. Více závitů na sekundáru znamená v jednoduchém modelu vyšší sekundární napětí.',
          },
          {
            id: 's3',
            text: 'N1 a N2 jsou počty závitů; jejich jednotkou nejsou volty.',
            correct: 'correct',
            explanation:
              'Ano. U1 a U2 jsou ve voltech, N1 a N2 jsou počty závitů bez jednotky volt.',
          },
          {
            id: 's4',
            text: 'Pro výpočet U2 vždy použijeme U2 = U1 × N1 / N2.',
            correct: 'wrong',
            explanation:
              'Neplatí. Správný poměr je U2 = U1 × N2 / N1 — v čitateli je počet závitů sekundáru.',
          },
          {
            id: 's5',
            text: 'Když N1 = N2, očekáváme v idealizovaném modelu přibližně U2 = U1.',
            correct: 'correct',
            explanation:
              'Ano. Stejný počet závitů znamená v idealizovaném modelu přibližně stejné napětí.',
          },
        ],
      },
    },
    quiz: [
      {
        id: 'q1',
        text: 'Který vztah správně vypočítá sekundární napětí v idealizovaném modelu?',
        options: [
          { id: 'a', text: 'U2 = U1 × N1 / N2' },
          { id: 'b', text: 'U2 = U1 × N2 / N1' },
          { id: 'c', text: 'U2 = N1 × N2 / U1' },
          { id: 'd', text: 'U2 = U1 + N2 − N1' },
        ],
        correctOptionId: 'b',
        explanation:
          'V idealizovaném modelu platí U2 = U1 × N2 / N1. Obrácený poměr N1 / N2 by výsledek pokazil.',
      },
      {
        id: 'q2',
        text: 'U1 = 24 V, N1 = 120 a N2 = 60. Jaké je U2 v idealizovaném modelu?',
        options: [
          { id: 'a', text: '24 V' },
          { id: 'b', text: '48 V' },
          { id: 'c', text: '12 V' },
          { id: 'd', text: '240 V' },
        ],
        correctOptionId: 'c',
        explanation:
          'U2 = 24 × 60 / 120 = 12 V. N2 je polovina N1, takže očekáváme přibližně poloviční napětí.',
      },
      {
        id: 'q3',
        text: 'Sekundární vinutí má třikrát více závitů než primární. Co očekáváme?',
        options: [
          {
            id: 'a',
            text: 'Zvyšovací převod; U2 je přibližně trojnásobné proti U1.',
          },
          {
            id: 'b',
            text: 'Snižovací převod; U2 je přibližně třetinové proti U1.',
          },
          {
            id: 'c',
            text: 'Převod zůstane přibližně 1 : 1 a napětí se téměř nezmění.',
          },
          {
            id: 'd',
            text: 'Počet závitů neurčuje, jestli se napětí zvýší nebo sníží.',
          },
        ],
        correctOptionId: 'a',
        explanation:
          'Když je N2 trojnásobné proti N1, očekáváme v idealizovaném modelu přibližně trojnásobné U2 — zvyšovací převod.',
      },
    ],
    activityXp: 20,
    quizXp: 15,
    badgeId: 'pocitar-prevodu',
    mvpAvailable: true,
  },
  {
    id: 'asynchronni-motor',
    subjectId: 'stroje',
    topicId: 'asynchronni-stroje',
    title: 'Asynchronní motor jednoduše',
    year: 2,
    durationMinutes: 9,
    difficulty: 'základní',
    goal:
      'Žák získá základní představu, že asynchronní motor využívá točivé magnetické pole a rotor se za tímto polem „opožďuje“.',
    hook:
      'Nejrozšířenější motor na světě nemá uvnitř žádné kartáče ani magnety na hřídeli. Točí s ním neviditelné pole.',
    explanation:
      '**Stator** (pevná část) vytváří po připojení ke střídavé síti **točivé magnetické pole**. To pole „táhne“ **rotor** (otáčivou část) za sebou — rotor se roztočí a přes **hřídel** pohání stroj. Rotor se ale točí vždy o kousek **pomaleji než pole** — „opožďuje se“. Právě proto se motor jmenuje **asynchronní**.',
    safetyNote:
      'Tato lekce je zjednodušená školní simulace. Skutečné motory se nesmí rozebírat, spouštět ani zkoušet bez pokynů učitele, odborného dohledu a bezpečného pracovního prostředí.',
    memorySentence: 'Pole se točí, rotor ho honí — a nikdy ho úplně nedožene.',
    typicalMistake:
      'Žáci zaměňují stator a rotor. Pomůcka: STÁtor STOJÍ, ROTor ROTUJE.',
    teacherTip:
      'Navazuje na transformátor (obojí je o magnetickém poli). Demo se šesti kroky se hodí projít společně a nechat třídu předvídat další krok.',
    interactiveDemo: {
      type: 'induction-motor',
      title: 'Od stojícího motoru k běhu',
      description:
        'Projdi šest kroků ukázky a sleduj, jak točivé pole roztáčí rotor — a proč ho nikdy úplně nedožene.',
    },
    activity: {
      termMatching: {
        type: 'term-matching',
        instruction:
          'Klikni na část motoru vlevo a pak na její úlohu vpravo. Spáruj všechny čtyři dvojice.',
        leftTitle: 'Část motoru',
        rightTitle: 'Co dělá',
        terms: [
          { id: 'stator', label: 'Stator' },
          { id: 'rotor', label: 'Rotor' },
          { id: 'pole', label: 'Magnetické pole' },
          { id: 'hridel', label: 'Hřídel' },
        ],
        definitions: [
          { id: 'def-stator', label: 'Pevná část — vytváří točivé pole' },
          { id: 'def-rotor', label: 'Otáčí se uvnitř, opožďuje se za polem' },
          { id: 'def-pole', label: 'Neviditelné, točí se a „táhne“ rotor' },
          { id: 'def-hridel', label: 'Mechanický výstup k poháněnému stroji' },
        ],
        correctPairs: {
          stator: 'def-stator',
          rotor: 'def-rotor',
          pole: 'def-pole',
          hridel: 'def-hridel',
        },
      },
    },
    quiz: [
      {
        id: 'q1',
        text: 'Co vytváří točivé magnetické pole v asynchronním motoru?',
        options: [
          { id: 'a', text: 'Stator připojený ke střídavé síti.' },
          { id: 'b', text: 'Rotor svým otáčením.' },
          { id: 'c', text: 'Hřídel.' },
          { id: 'd', text: 'Ventilátor motoru.' },
        ],
        correctOptionId: 'a',
        explanation: 'Točivé pole vzniká ve statoru — rotor je jím teprve roztáčen.',
      },
      {
        id: 'q2',
        text: 'Proč se motoru říká asynchronní?',
        options: [
          { id: 'a', text: 'Rotor se točí o něco pomaleji než pole — neběží s ním stejně.' },
          { id: 'b', text: 'Protože se točí proti směru pole.' },
          { id: 'c', text: 'Protože běží jen střídavě.' },
          { id: 'd', text: 'Podle jména vynálezce.' },
        ],
        correctOptionId: 'a',
        explanation:
          '„Asynchronní“ = neběží synchronně (stejně) s polem — rotor se opožďuje.',
      },
      {
        id: 'q3',
        text: 'Kudy jde otáčení z motoru ven k poháněnému stroji?',
        options: [
          { id: 'a', text: 'Hřídelí.' },
          { id: 'b', text: 'Statorem.' },
          { id: 'c', text: 'Přívodním kabelem.' },
          { id: 'd', text: 'Magnetickým polem do vzduchu.' },
        ],
        correctOptionId: 'a',
        explanation: 'Hřídel je mechanický výstup motoru.',
      },
    ],
    activityXp: 20,
    quizXp: 15,
    badgeId: 'motorovy-elev',
    mvpAvailable: true,
  },
  {
    id: 'stykac-a-rele',
    subjectId: 'stroje',
    topicId: 'pristroje-nn',
    title: 'Stykač a relé',
    year: 2,
    durationMinutes: 8,
    difficulty: 'základní',
    goal:
      'Žák pochopí, že relé a stykač umožňují ovládat jeden obvod pomocí druhého — malý ovládací signál sepne kontakt pro jiný obvod.',
    hook:
      'Tlačítko u dveří je malé a slaboučké — a přesto spustí velký motor vrat. Mezi nimi sedí stykač.',
    explanation:
      '**Relé i stykač** mají **cívku** a **kontakt**. Když cívkou v **ovládacím obvodu** prochází proud, cívka se chová jako elektromagnet a **přitáhne kontakt**. Kontakt tím sepne **jiný, výkonový obvod** — třeba motor. Malý ovládací signál tak řídí velkou zátěž. Stykač je zjednodušeně „silnější relé“ pro větší proudy.',
    safetyNote:
      'Tato lekce vysvětluje princip ve školní simulaci. Skutečné stykače, relé a rozvaděče se nesmí zapojovat ani upravovat bez odborného dohledu, dokumentace a dodržení BOZP.',
    memorySentence: 'Cívka pod napětím přitáhne kontakt — malý obvod spíná velký.',
    typicalMistake:
      'Žáci si pletou ovládací a výkonový obvod — jsou to dva ODDĚLENÉ obvody; propojuje je jen pohyb kontaktu, ne drát.',
    teacherTip:
      'Navazuje na tranzistor jako spínač (stejný princip, jiná technika). Dobré propojit s ukázkou skutečného stykače v dílně — jen ukázat, nezapojovat.',
    interactiveDemo: {
      type: 'contactor-relay',
      title: 'Cívka spíná kontakt',
      description:
        'Zapni a vypni napájení cívky a sleduj, co udělá kontakt a motor ve výkonovém obvodu.',
    },
    activity: {
      measurementJudgment: {
        type: 'measurement-judgment',
        instruction:
          'U každé situace rozhodni, jestli je kontakt stykače sepnutý, nebo rozepnutý. Všechny musí být správně.',
        correctLabel: 'Kontakt je sepnutý',
        wrongLabel: 'Kontakt je rozepnutý',
        successMessage:
          'Výborně! Víš, kdy cívka kontakt přitáhne — a kdy zůstane rozepnutý.',
        scenarios: [
          {
            id: 's1',
            text: 'Cívka stykače je připojená k napětí.',
            correct: 'correct',
            explanation:
              'Cívka pod napětím se chová jako elektromagnet a kontakt přitáhne — sepnuto.',
          },
          {
            id: 's2',
            text: 'Cívka je bez napětí.',
            correct: 'wrong',
            explanation:
              'Bez napětí cívka nepřitahuje — pružina drží kontakt rozepnutý.',
          },
          {
            id: 's3',
            text: 'Obsluha stiskla tlačítko START a cívka dostala napětí.',
            correct: 'correct',
            explanation:
              'Tlačítko pustilo proud do cívky → kontakt sepnul → motor běží.',
          },
          {
            id: 's4',
            text: 'Vodič ovládacího obvodu k cívce je přerušený.',
            correct: 'wrong',
            explanation:
              'Do cívky nic neteče, takže kontakt zůstává rozepnutý — motor stojí.',
          },
        ],
      },
    },
    quiz: [
      {
        id: 'q1',
        text: 'K čemu slouží stykač?',
        options: [
          { id: 'a', text: 'Malým ovládacím signálem spíná jiný (výkonový) obvod.' },
          { id: 'b', text: 'Měří proud v obvodu.' },
          { id: 'c', text: 'Zvyšuje napětí jako transformátor.' },
          { id: 'd', text: 'Chrání před bleskem.' },
        ],
        correctOptionId: 'a',
        explanation:
          'Stykač (i relé) odděluje ovládání od výkonu — malý signál řídí velkou zátěž.',
      },
      {
        id: 'q2',
        text: 'Co udělá kontakt, když cívka dostane napětí?',
        options: [
          { id: 'a', text: 'Cívka ho přitáhne a kontakt sepne.' },
          { id: 'b', text: 'Kontakt se rozpojí.' },
          { id: 'c', text: 'Nic — kontakt s cívkou nesouvisí.' },
          { id: 'd', text: 'Kontakt se roztaví.' },
        ],
        correctOptionId: 'a',
        explanation: 'Cívka pod napětím = elektromagnet = přitažený, sepnutý kontakt.',
      },
      {
        id: 'q3',
        text: 'Jak spolu souvisí ovládací a výkonový obvod stykače?',
        options: [
          { id: 'a', text: 'Jsou oddělené — spojuje je jen pohyb kontaktu.' },
          { id: 'b', text: 'Je to jeden a tentýž obvod.' },
          { id: 'c', text: 'Jsou spojené vodičem přes cívku.' },
          { id: 'd', text: 'Výkonový obvod napájí cívku.' },
        ],
        correctOptionId: 'a',
        explanation:
          'Dva oddělené obvody — proto může slabé tlačítko bezpečně ovládat velký motor.',
      },
    ],
    activityXp: 20,
    quizXp: 15,
    badgeId: 'vladce-kontaktu',
    mvpAvailable: true,
  },
  {
    id: 'pristroje-nn-vn-vvn',
    subjectId: 'stroje',
    topicId: 'pristroje-vn-vvn',
    title: 'Přístroje NN, VN a VVN bez paniky',
    year: 2,
    durationMinutes: 9,
    difficulty: 'střední',
    goal:
      'Žák pochopí, že elektrické přístroje se liší podle napěťové hladiny a že u VN/VVN je klíčový bezpečný odstup, krytí, odborný dohled a zákaz laického zásahu.',
    hook:
      'U zásuvky doma tě chrání kryt a jistič. U trafostanice tě chrání hlavně jedna věc: že zůstaneš daleko.',
    explanation:
      'Elektrická zařízení se dělí podle **napěťové hladiny**: **NN** (nízké napětí — domovní rozvody), **VN** (vysoké napětí — trafostanice, venkovní vedení) a **VVN** (velmi vysoké napětí — dálkové přenosové trasy). Čím vyšší hladina, tím větší riziko: u VN/VVN může elektřina **přeskočit vzduchem i bez dotyku**. Proto platí: **bezpečný odstup, nezasahovat, nepřelézat, nepřibližovat se** — pracovat tam smí jen odborník s oprávněním.',
    safetyNote:
      'Tato lekce je bezpečnostní školní simulace. Zařízení VN a VVN jsou životu nebezpečná. Žák se k nim nesmí přibližovat, zasahovat do nich ani je zkoušet bez odborného oprávnění a dohledu.',
    memorySentence: 'Čím vyšší napětí, tím větší odstup. K VN a VVN se nechodí blíž.',
    typicalMistake:
      'Žáci si myslí, že nebezpečný je jen přímý dotyk. U VN/VVN může proud přeskočit obloukem na vzdálenost — nebezpečná je už blízkost.',
    teacherTip:
      'Bezpečnostní vyvrcholení předmětu — hodí se před exkurzí do rozvodny. Scénář „zvědavý žák" nech třídu vyřešit nahlas, než odkryješ odpověď.',
    interactiveDemo: {
      type: 'voltage-level-safety',
      title: 'Tři hladiny napětí, jedno pravidlo: odstup',
      description:
        'Projdi karty NN, VN, VVN a nebezpečné situace — u každé zjistíš příklady, riziko a správné chování.',
    },
    activity: {
      scenarioChoice: {
        type: 'scenario-choice',
        instruction:
          'Roztřiď situace podle správné reakce. Všechny musí být správně.',
        options: [
          { id: 'simulace', label: 'V pořádku — školní práce pod dohledem' },
          { id: 'odstup', label: 'Držet odstup — nepřibližovat se' },
          { id: 'nepokracovat', label: 'Nepokračovat — učitel / odborník' },
        ],
        successMessage:
          'Výborně! Víš, kde je práce v pořádku, kde platí odstup — a kdy je jediná správná věc zastavit se.',
        scenarios: [
          {
            id: 's1',
            text: 'Školní model s bezpečným nízkým napětím, učitel je u toho.',
            correctOptionId: 'simulace',
            explanation:
              'Přesně tak se to má dělat — bezpečné napětí, dohled učitele, jasné zadání.',
          },
          {
            id: 's2',
            text: 'Běžný domovní rozvaděč — žák by chtěl „něco přezapojit“.',
            correctOptionId: 'nepokracovat',
            explanation:
              'Do rozvaděče žák nezasahuje ani u NN — práci provádí elektrikář s oprávněním.',
          },
          {
            id: 's3',
            text: 'Trafostanice u sídliště s výstražnou tabulkou.',
            correctOptionId: 'odstup',
            explanation:
              'VN zařízení — platí odstup, dovnitř smí jen odborník. Tabulky a ploty se respektují.',
          },
          {
            id: 's4',
            text: 'Venkovní vedení VN/VVN na stožárech podél cesty.',
            correctOptionId: 'odstup',
            explanation:
              'K vodičům ani stožárům se nepřibližuje — u vysokého napětí hrozí přeskok i bez dotyku.',
          },
          {
            id: 's5',
            text: 'Zařízení má otevřený nebo poškozený kryt.',
            correctOptionId: 'nepokracovat',
            explanation:
              'Neznámý a nebezpečný stav — nesahat, nikoho nepouštět blíž a ihned ohlásit učiteli nebo odborníkovi.',
          },
          {
            id: 's6',
            text: 'Zvědavý spolužák chce jít k trafostanici blíž, „jen se podívat“.',
            correctOptionId: 'odstup',
            explanation:
              'Zvědavost u VN nemá místo — držet odstup a odradit i ostatní. Podívat se dá zdálky.',
          },
        ],
      },
    },
    quiz: [
      {
        id: 'q1',
        text: 'Čím se liší přístroje NN, VN a VVN?',
        options: [
          { id: 'a', text: 'Napěťovou hladinou — a s ní rostoucím rizikem a nároky na odstup.' },
          { id: 'b', text: 'Jen barvou krytu.' },
          { id: 'c', text: 'Ničím podstatným.' },
          { id: 'd', text: 'VVN je bezpečnější než NN.' },
        ],
        correctOptionId: 'a',
        explanation:
          'Čím vyšší napěťová hladina, tím větší riziko a přísnější pravidla.',
      },
      {
        id: 'q2',
        text: 'Proč je nebezpečná už blízkost zařízení VN/VVN?',
        options: [
          { id: 'a', text: 'Elektřina může přeskočit obloukem i bez dotyku.' },
          { id: 'b', text: 'Není — nebezpečný je jen dotyk.' },
          { id: 'c', text: 'Kvůli hluku zařízení.' },
          { id: 'd', text: 'Kvůli silnému větru u stožárů.' },
        ],
        correctOptionId: 'a',
        explanation:
          'U vysokého napětí hrozí přeskok na vzdálenost — proto rozhoduje odstup.',
      },
      {
        id: 'q3',
        text: 'Vidíš otevřený kryt elektrického zařízení. Co uděláš?',
        options: [
          { id: 'a', text: 'Nesahám, držím ostatní dál a hlásím to učiteli nebo odborníkovi.' },
          { id: 'b', text: 'Opatrně nakouknu dovnitř.' },
          { id: 'c', text: 'Kryt sám zavřu, ať to nikoho neláká.' },
          { id: 'd', text: 'Nic — otevřený kryt je normální.' },
        ],
        correctOptionId: 'a',
        explanation:
          'Neznámý stav zařízení = nepokračovat a ohlásit. Ani zavírání krytu není práce pro laika.',
      },
    ],
    activityXp: 25,
    quizXp: 15,
    badgeId: 'bezpecny-u-vn',
    mvpAvailable: true,
  },
];
