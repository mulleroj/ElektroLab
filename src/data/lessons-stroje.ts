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
      '**Hranice jednoduchého modelu:** Idealizovaný vztah popisuje jen poměr závitů a napětí. Transformátor energii nevyrábí; proud, výkon a ztráty budeme řešit později. Převod určuje poměr závitů, ne samotná velikost zařízení.',
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
    id: 'tocive-magneticke-pole',
    subjectId: 'stroje',
    topicId: 'asynchronni-stroje',
    title: 'Jak vzniká točivé magnetické pole',
    year: 2,
    durationMinutes: 10,
    difficulty: 'základní',
    goal:
      'Žák kvalitativně pochopí, že prostorově rozložená statorová vinutí a časově posunuté třífázové proudy vytvoří výsledné magnetické pole, které se otáčí — aniž by se stator mechanicky točil.',
    hook:
      'Stator motoru se nehýbe. Přesto uvnitř vzniká magnetické pole, které se otáčí. Jak se může něco otáčet, když se žádná cívka mechanicky neotáčí?',
    explanation:
      '**Jedna cívka a střídavý proud:** Ze Základů víš, že změna směru proudu mění orientaci magnetického pole cívky. Jedna samostatná cívka napájená střídavým proudem vytváří magnetické pole, které se mění a v základním modelu především pulzuje. Samotná jedna cívka nevytváří plnohodnotné rovnoměrné točivé magnetické pole třífázového motoru.\n\n' +
      '**Více vinutí kolem statoru:** Stator obsahuje několik vinutí rozložených v prostoru kolem jeho obvodu. V základním třífázovém modelu používáme tři vinutí rozmístěná kolem statoru. Vinutí zůstávají na místě — neotáčejí se jako mechanické součásti.\n\n' +
      '**Proudy nejsou ve stejném okamžiku stejné:** Třífázové proudy mají stejnou frekvenci, ale jsou vzájemně časově posunuté. Kvalitativně je posun o třetinu periody neboli 120°. Nemusíš fázový posun počítat. Jde jen o minimum potřebné k pochopení motoru — plná třífázová soustava přijde později.\n\n' +
      '**Magnetická pole se skládají:** Protože proudy nejsou nejsilnější ve stejném okamžiku, ani magnetický účinek jednotlivých vinutí není nejsilnější najednou. Jejich magnetická pole se v prostoru skládají. Průběhy se mění plynule — nejde o to, že by se fáze jen postupně zapínaly a vypínaly.\n\n' +
      '**Výsledné pole se posouvá kolem statoru:** Výsledný směr nejsilnějšího magnetického působení se postupně posouvá kolem statoru. Na časových snímcích vidíš, kam „ukazuje“ společné pole — a další snímek ho ukáže o kousek dál.\n\n' +
      '**Stator stojí, pole se otáčí:** Když jsou cívky rozloženy kolem statoru a jejich proudy jsou časově posunuté, jejich společné pole se může otáčet. Statorová vinutí ani železné části statoru se kvůli tomu mechanicky neotáčejí. Otáčí se výsledný směr magnetického pole.\n\n' +
      '**Most k rotoru:** Zatím neřešíme podrobně, co dělá rotor. Následující lekce vysvětlí, jak rotor na točivé magnetické pole reaguje a proč se za ním opožďuje.',
    safetyNote:
      'Výuka probíhá pouze pomocí schémat, simulace, připravených dat nebo učitelem zabezpečeného modelu. Žák nepřipojuje motor k síti, neotevírá svorkovnici ani motor, nepřepojuje vinutí a nemění pořadí fází na skutečném zařízení. Živé části se neměří. Nezajištěný motor se nespouští. Hřídele, ventilátoru ani spojky se nedotýkej. Motor se může neočekávaně rozběhnout a jeho povrch se může zahřívat. Odpojený ovládací obvod nemusí znamenat beznapěťový silový obvod. Místní školní pravidla a pokyn učitele mají přednost.',
    memorySentence:
      'Prostorově rozložená statorová vinutí a časově posunuté třífázové proudy vytvářejí výsledné magnetické pole, které se otáčí.',
    typicalMistake:
      'Žáci si myslí, že statorové cívky se mechanicky otáčejí, že jedna střídavá cívka vytváří stejné točivé pole jako třífázový stator, nebo že fáze se jen postupně zapínají a vypínají. Časté je i tvrzení, že všechny tři proudy mají stále stejnou okamžitou hodnotu, že točivé pole vytváří jako první rotor, že proud přeskakuje ze statoru do rotoru, nebo že je nutné počítat fázory. Správně: stator stojí, otáčí se výsledný směr magnetického pole, proudové průběhy se mění plynule a nutné je prostorové rozložení i časový posun.',
    teacherTip:
      'Použij tři barevné šipky nebo kartičky A, B, C rozmístěné kolem kruhu a několik časových snímků společného pole. Nejdřív ukaž jednu cívku a pulzující pole, pak přidej prostorové rozmístění tří vinutí a nakonec časový posun proudů. Nech žáky ukázat, kam se výsledná šipka pole posune. InductionMotorDemo použij až jako kvalitativní návaznost v následující lekci — neměň demo komponentu ani ji nepřidávej do této lekce. Výslovně řekni, že jde o model, ne o praktické zapojování motoru. Zakázáno je žákovské přepojování motoru, živé měření, práce s odkrytými svorkami a manipulace s rotujícími částmi.',
    activity: {
      scenarioChoice: {
        type: 'scenario-choice',
        instruction:
          'U každé situace rozhodni, co se stane s elektromagnetickým polem. Všechny čtyři musí být správně.',
        options: [
          { id: 'toci', label: 'Výsledné pole se otáčí' },
          { id: 'pulzuje', label: 'Pole pouze pulzuje na pevném místě' },
          { id: 'nevznika', label: 'Elektromagnetické pole nevzniká' },
          { id: 'nelze', label: 'Z uvedených údajů to nelze rozhodnout' },
        ],
        successMessage:
          'Výborně! Víš, kdy vzniká točivé pole — a kdy stačí jen pulzující pole jedné cívky nebo žádné pole bez proudu.',
        scenarios: [
          {
            id: 's1',
            text: 'Tři statorová vinutí jsou rozmístěna kolem statoru a protékají jimi třífázové proudy vzájemně časově posunuté.',
            correctOptionId: 'toci',
            explanation:
              'Prostorové rozložení vinutí a časový posun proudů způsobí, že se magnetická pole skládají a výsledné pole se otáčí.',
          },
          {
            id: 's2',
            text: 'Jedna cívka je napájena běžným střídavým proudem a další vinutí nejsou použita.',
            correctOptionId: 'pulzuje',
            explanation:
              'Jedna AC cívka vytváří proměnné, především pulzující pole. Orientace a velikost se mohou měnit, ale nevzniká plnohodnotné výsledné točivé pole třífázového statoru.',
          },
          {
            id: 's3',
            text: 'Tři vinutí jsou rozmístěna kolem statoru a jejich proudy mají stejný časový průběh bez vzájemného fázového posunu. Neznáme ale přesnou orientaci ani polaritu vinutí. Co můžeme rozhodnout o výsledném poli?',
            correctOptionId: 'nelze',
            explanation:
              'Bez vzájemného časového posunu nevznikne standardní točivé pole třífázového statoru. Přesnou výslednici ale bez znalosti orientace a polarity vinutí určit nelze: může pulzovat, zeslabit se nebo se v ideálním symetrickém uspořádání vyrušit. Pro točivé pole jsou potřeba prostorově rozložená vinutí i časově posunuté proudy.',
          },
          {
            id: 's4',
            text: 'Statorovými vinutími neteče proud.',
            correctOptionId: 'nevznika',
            explanation:
              'Bez proudu nevzniká vlastní elektromagnetické pole statorových vinutí. Permanentní nebo zbytkový magnetismus v tomto základním modelu neřešíme.',
          },
        ],
      },
    },
    quiz: [
      {
        id: 'q1',
        text: 'Kdy vzniká v základním modelu výsledné točivé magnetické pole statoru?',
        options: [
          {
            id: 'a',
            text: 'Když se statorové cívky mechanicky otáčejí kolem celého hřídele.',
          },
          {
            id: 'b',
            text: 'Když jsou vinutí v prostoru a proudy navzájem časově posunuté.',
          },
          {
            id: 'c',
            text: 'Když jednou cívkou teče střídavý proud bez dalších vinutí.',
          },
          {
            id: 'd',
            text: 'Když rotor nejdřív vytvoří pole a stator ho jen kopíruje.',
          },
        ],
        correctOptionId: 'b',
        explanation:
          'Potřebuješ současně prostorové rozložení vinutí i časový posun proudů. Samotná jedna cívka ani otáčení cívek to nenahradí.',
      },
      {
        id: 'q2',
        text: 'Co vytvoří jedna samostatná cívka napájená střídavým proudem?',
        options: [
          {
            id: 'a',
            text: 'Plnohodnotné výsledné točivé pole třífázového statoru.',
          },
          {
            id: 'b',
            text: 'Proměnné nebo pulzující magnetické pole na pevném místě.',
          },
          {
            id: 'c',
            text: 'Žádné elektromagnetické pole, protože cívka stojí.',
          },
          {
            id: 'd',
            text: 'Magnetické pole, které mechanicky roztáčí samotnou cívku.',
          },
        ],
        correctOptionId: 'b',
        explanation:
          'Jedna AC cívka vytváří proměnné nebo pulzující pole. Nejde o plnohodnotné výsledné točivé pole třífázového statoru.',
      },
      {
        id: 'q3',
        text: 'Co se v tomto modelu skutečně otáčí?',
        options: [
          {
            id: 'a',
            text: 'Statorová vinutí se mechanicky točí kolem rotoru.',
          },
          {
            id: 'b',
            text: 'Proud přeskakuje mezi cívkami a tím se cívky otáčejí.',
          },
          {
            id: 'c',
            text: 'Výsledné magnetické pole; statorová vinutí přitom stojí.',
          },
          {
            id: 'd',
            text: 'Nejdřív se otáčí rotor a teprve potom vzniká magnetické pole statoru.',
          },
        ],
        correctOptionId: 'c',
        explanation:
          'Statorová vinutí zůstávají na místě. Otáčí se výsledný směr magnetického pole, které vinutí společně vytvářejí.',
      },
    ],
    activityXp: 20,
    quizXp: 15,
    badgeId: 'pruvodce-tocivym-polem',
    mvpAvailable: true,
  },
  {
    id: 'asynchronni-motor',
    subjectId: 'stroje',
    topicId: 'asynchronni-stroje',
    title: 'Asynchronní motor jednoduše',
    year: 2,
    durationMinutes: 10,
    difficulty: 'základní',
    goal:
      'Žák kvalitativně vysvětlí, jak točivé magnetické pole statoru indukuje v rotoru napětí a proud, jak vzniká elektromagnetický moment a proč rotor při běžném motorickém chodu pole úplně nedohoní.',
    hook:
      'Rotor není připojen vodičem ke statoru a není to permanentní magnet. Odkud se tedy v rotoru vezme proud a proč se začne otáčet?',
    explanation:
      '**Navázání na točivé pole:** V předchozí lekci jsi viděl, že mechanicky nehybný stator se základním modelem třífázového asynchronního motoru vytváří točivé magnetické pole. Teď nesledujeme znovu vznik statorového pole — sledujeme, jak na něj reaguje **rotor**, otáčivá část uvnitř statoru.\n\n' +
      '**Pole se vůči rotoru pohybuje:** Při rozběhu rotor zpočátku stojí. Točivé pole se vůči rotorovým vodičům pohybuje, takže magnetické působení na tyto vodivé části se mění. Právě tato relativní změna umožní indukci. Proud ze statoru do rotoru nepřechází a nepřeskakuje vzduchovou mezerou.\n\n' +
      '**Nejdřív napětí, potom proud:** Změna magnetického působení nejprve indukuje v rotorových vodičích **napětí**. V základním modelu klecového rotoru tvoří vodivé tyče a jejich spojení uzavřené vodivé cesty. Teprve v uzavřené cestě může téct **rotorový proud**. Indukované napětí a rotorový proud nejsou totéž. Rotor není přímo elektricky napájen stejně jako stator.\n\n' +
      '**Rotor vytváří vlastní magnetické působení:** Rotorový proud vytváří vlastní magnetické pole neboli magnetické působení. Statorové a rotorové magnetické působení na sebe působí.\n\n' +
      '**Vzniká elektromagnetický moment:** Na rotorové vodiče působí elektromagnetické síly. Jejich společný účinek vytváří otáčivý **moment**, který roztáčí rotor ve směru točivého pole. Rotor se snaží točivé pole následovat — ale ne proto, že by pole „jen táhlo železo“ nebo že by rotor byl permanentní magnet.\n\n' +
      '**Proč rotor pole nedohoní:** Jak rotor zrychluje, rozdíl rychlostí mezi polem a rotorem se zmenšuje a relativní změna magnetického působení slábne. Indukované napětí i rotorový proud se v základním modelu zmenšují. Kdyby se rotor v idealizovaném modelu otáčel přesně stejně rychle a stejným směrem jako pole, relativní změna by zanikla, potřebné rotorové napětí a proud by se neindukovaly a potřebný motorický moment by nevznikal. Proto při běžném motorickém chodu rotor zůstává o něco pomalejší než pole.\n\n' +
      '**Co znamená asynchronní a skluz:** Motor se jmenuje asynchronní právě proto, že rotor při běžném motorickém chodu neběží synchronně s polem. **Skluz** kvalitativně popisuje, že rotor se otáčí pomaleji než točivé pole. Není to mechanické klouzání součástí ani automaticky porucha a v této lekci jej nepočítáme. Velikost skluzu není vždy stejná.',
    safetyNote:
      'Výuka probíhá pouze pomocí schémat, simulace, připravených dat nebo učitelem zabezpečeného modelu. Žák nepřipojuje motor k síti, neotevírá motor ani svorkovnici, nepřepojuje vinutí a nemění pořadí fází na skutečném zařízení. Živé části se neměří. Nezajištěný motor se nespouští. Rotor ani hřídel se neblokují. Hřídele, ventilátoru, spojky ani jiných rotujících částí se nedotýkej. Motor se může neočekávaně rozběhnout. Rotor a připojený stroj mohou po vypnutí dobíhat. Motor a jeho povrch se mohou zahřívat. Volný oděv, vlasy a šperky se mohou zachytit. Odpojený ovládací obvod nemusí znamenat beznapěťový silový obvod. Místní školní pravidla a pokyn učitele mají přednost.',
    memorySentence:
      'Točivé pole vůči rotoru indukuje proud, jeho magnetické působení vytváří moment a rotor proto pole sleduje s malým skluzem.',
    typicalMistake:
      'Žáci zaměňují stator a rotor, myslí si, že rotor je permanentní magnet, nebo že proud přeskakuje ze statoru do rotoru. Časté je i tvrzení, že samotné „pole táhne železo" vysvětluje motorický moment, že se rotor točí stejně rychle jako pole, že skluz je mechanické prokluzování nebo automaticky porucha, anebo že točivé pole vzniká mechanickým otáčením statorových cívek. Správně: STÁtor STOJÍ a ROTor ROTUJE, rotorový proud vzniká indukcí v uzavřených vodivých cestách, moment vzniká magnetickým působením statoru i rotoru a při běžném motorickém chodu rotor pole úplně nedohoní.',
    teacherTip:
      'Použij kartičkový řetězec: točivé pole → indukované napětí → rotorový proud → rotorové magnetické působení → moment → otáčení → skluz. Před každým krokem nech žáky říct, co musí platit, a zvlášť rozliš napětí a proud. InductionMotorDemo použij jako vizuální potvrzení — zastav ukázku u kroků indukce, momentu a skluzu a ukaž rotorové tyče jen jako uzavřené vodivé cesty. Pracuj jen se schématem, simulací nebo odpojeným zabezpečeným modelem. Praktické přepojování motoru ani změnu sledu fází neprováděj. Demo komponentu v této lekci neměň.',
    interactiveDemo: {
      type: 'induction-motor',
      title: 'Od stojícího motoru k běhu',
      description:
        'Projdi šest kroků ukázky a sleduj, jak točivé pole roztáčí rotor — a proč ho nikdy úplně nedožene.',
    },
    activity: {
      scenarioChoice: {
        type: 'scenario-choice',
        instruction:
          'U každé situace rozhodni, co platí pro indukční děj v rotoru. Všechny čtyři musí být správně.',
        options: [
          {
            id: 'proud-a-moment',
            label: 'Indukuje se napětí, teče rotorový proud a vzniká moment',
          },
          {
            id: 'napeti-bez-proudu',
            label: 'Indukuje se napětí, ale bez uzavřené cesty neteče proud',
          },
          {
            id: 'zanika-indukce',
            label: 'V základním modelu zanikne potřebná indukce i moment',
          },
          {
            id: 'bez-statoroveho-pole',
            label: 'Bez statorového pole tento indukční děj nevznikne',
          },
        ],
        successMessage:
          'Výborně! Víš, že točivé pole indukuje v rotoru napětí a proud, vytváří moment a při běžném chodu vyžaduje skluz.',
        scenarios: [
          {
            id: 's1',
            text: 'Stator vytváří točivé magnetické pole. Rotor zpočátku stojí a jeho vodivé cesty jsou v základním modelu uzavřené.',
            correctOptionId: 'proud-a-moment',
            explanation:
              'Pole se vůči stojícímu rotoru pohybuje, takže se mění magnetické působení. Indukuje se napětí, uzavřenou cestou teče proud, vzniká rotorové magnetické působení a elektromagnetický moment.',
          },
          {
            id: 's2',
            text: 'Točivé pole se vůči rotorovému vodiči mění, ale modelovaná vodivá cesta je rozpojená. Jde jen o myšlenkový simulační model — skutečný rotor neotevíráme ani neupravujeme.',
            correctOptionId: 'napeti-bez-proudu',
            explanation:
              'Relativní změna může indukovat napětí i v otevřeném modelu. Bez uzavřené vodivé cesty ale rotorový proud neteče, takže v tomto modelu nevzniká potřebný motorický moment.',
          },
          {
            id: 's3',
            text: 'V idealizovaném modelu se rotor otáčí přesně stejnou rychlostí a stejným směrem jako točivé pole. Relativní změna magnetického působení vůči rotoru zanikla.',
            correctOptionId: 'zanika-indukce',
            explanation:
              'Bez relativní změny se v základním modelu neindukuje potřebné rotorové napětí. Bez rotorového proudu nevzniká potřebný motorický moment. Proto běžný asynchronní motor pracuje se skluzem.',
          },
          {
            id: 's4',
            text: 'Statorovými vinutími neteče proud. V základním modelu neuvažujeme jiné zdroje magnetického pole.',
            correctOptionId: 'bez-statoroveho-pole',
            explanation:
              'Bez proudu nevzniká vlastní elektromagnetické pole statorových vinutí. Bez statorového pole tento indukční děj v rotoru nevznikne. Permanentní, zbytkový nebo vnější magnetismus v tomto modelu neřešíme.',
          },
        ],
      },
    },
    quiz: [
      {
        id: 'q1',
        text: 'Jak v základním modelu vznikne proud v rotorových vodičích?',
        options: [
          {
            id: 'a',
            text: 'Rotor je vodičem napájený přímo ze stejných svorek jako stator.',
          },
          {
            id: 'b',
            text: 'Proud přeskakuje vzduchovou mezerou ze statorových vinutí přímo do rotorových tyčí.',
          },
          {
            id: 'c',
            text: 'Točivé pole se vůči rotoru mění, indukuje napětí a uzavřenou cestou teče proud.',
          },
          {
            id: 'd',
            text: 'Rotor je permanentní magnet a sám vytváří proud i bez jakékoli změny magnetického působení.',
          },
        ],
        correctOptionId: 'c',
        explanation:
          'Relativní změna magnetického působení indukuje napětí. Proud teče teprve v uzavřené vodivé cestě. Rotor není napájen stejně jako stator a proud nepřeskakuje mezerou.',
      },
      {
        id: 'q2',
        text: 'Co v základním modelu vytváří elektromagnetický moment působící na rotor?',
        options: [
          {
            id: 'a',
            text: 'Statorové cívky se mechanicky otáčejí kolem hřídele a tím roztáčí celý rotor.',
          },
          {
            id: 'b',
            text: 'Rotorový proud vytváří magnetické působení; se statorovým polem vzniká moment.',
          },
          {
            id: 'c',
            text: 'Rotor se roztočí jen setrvačností po prvním krátkém impulsu bez dalšího elektromagnetického děje.',
          },
          {
            id: 'd',
            text: 'Neprotékaný kus železa je polem přitahován a právě tím vzniká celý motorický moment.',
          },
        ],
        correctOptionId: 'b',
        explanation:
          'Moment vzniká elektromagnetickým působením statorového a rotorového pole. Samotné „táhnutí železa“, setrvačnost ani mechanické otáčení statoru to nenahradí.',
      },
      {
        id: 'q3',
        text: 'Proč při běžném motorickém chodu rotor točivé pole úplně nedohoní?',
        options: [
          {
            id: 'a',
            text: 'Skluz znamená, že části motoru po sobě mechanicky kloužou a prokluzují.',
          },
          {
            id: 'b',
            text: 'Rotor je pomalejší pouze kvůli tření v ložiskách, vzduchu a mechanických ztrátách.',
          },
          {
            id: 'c',
            text: 'Asynchronní znamená, že se rotor otáčí zcela nepravidelně, náhodně a bez stálého směru.',
          },
          {
            id: 'd',
            text: 'Při stejné rychlosti by v základním modelu zanikla relativní změna a potřebný moment.',
          },
        ],
        correctOptionId: 'd',
        explanation:
          'Bez relativní změny by se neindukovalo potřebné rotorové napětí a proud a nevznikal by motorický moment. Skluz není mechanické klouzání ani nepravidelné otáčení.',
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
    durationMinutes: 10,
    difficulty: 'základní',
    goal:
      'Žák rozliší ovládací a silový obvod, vysvětlí řetězec cívka → magnetické pole → kotva → kontakty a ví, že stykač spíná, ale sám není jistič ani důkaz beznapěťovosti.',
    hook:
      'Motor z minulé lekce potřebuje spínat, ale jeho proud nemá téct obyčejným ovládacím tlačítkem. Jak může malý ovládací obvod bezpečně řídit kontakty v jiném obvodu?',
    explanation:
      '**Motor potřebuje řízení:** Asynchronní motor z předchozí lekce potřebuje řízené zapnutí a vypnutí. Proud motoru nemá procházet běžným ovládacím tlačítkem. **Ovládací obvod** dává povel; **stykač** nebo **relé** mechanicky přestaví kontakty v jiném obvodu.\n\n' +
      '**Dva odlišné obvody:** Ovládací obvod napájí a řídí **cívku**. **Silový obvod** přivádí energii ke spotřebiči, například k motoru. Oba mohou mít jiné napětí a proud. Proud motoru **neteče cívkou**; energii motoru nedává ovládací obvod, ale zdroj silového obvodu. Obvody spojuje **mechanický pohyb kontaktů**, proud mezi nimi nepřeskakuje.\n\n' +
      '**Cívka a magnetické pole:** Po přivedení **správného napětí** na cívku jí proteče proud a vznikne **magnetické pole**, které přitáhne pohyblivou **kotvu**. Na cívku nepatří libovolné napětí.\n\n' +
      '**Kotva přestaví kontakty:** Pohyb kotvy **mechanicky** změní stav kontaktů. Po odpojení cívky působení zeslábne a **pružina** vrátí mechanismus do **klidového stavu**. Cívka sama nevede proud motoru a kontakty se bez pohybu nemění.\n\n' +
      '**Hlavní, pomocné, NO a NC:** **Hlavní kontakty** spínají silový obvod a jsou navrženy pro zátěž, například motor. **Pomocné kontakty** slouží ovládání, signalizaci nebo blokovací logice a běžně nenesou proud motoru. **NO** (spínací) je v klidu bez buzení cívky **rozepnutý**; **NC** (rozpínací) je v klidu **sepnutý**. Po buzení cívky se jejich stav změní. „Normálně“ znamená klidový stav cívky, ne běžný provoz zařízení.\n\n' +
      '**Relé versus stykač:** Oba mohou mít cívku, kotvu a kontakty. Relé se často používá v ovládání, signalizaci nebo pro menší zátěže; stykač pro časté spínání výkonových zátěží, například motorů. Pracují na podobném principu, ale pro jiné úlohy a zatížení — rozhodují jmenovité parametry a určení zařízení.\n\n' +
      '**Stykač spíná, nechrání:** Stykač především **spíná**. Nenahrazuje jistič, pojistku ani určenou ochranu proti přetížení (například samostatné tepelné relé). **Vypnutá cívka** neznamená beznapěťový silový obvod. **Rozepnutý kontakt** není důkaz ověřené beznapěťovosti — kontakt může být svařený a část zařízení může mít jiné napájení.',
    safetyNote:
      'Výuka probíhá pouze pomocí schématu, simulace nebo učitelem zabezpečeného nízkonapěťového modelu. Žák nepřipojuje stykač, relé ani motor k síti, neotevírá rozvaděč ani svorkovnici, nepřepojuje vodiče, vinutí ani fáze a neprovádí živé měření na živých částech. Nezajištěný motor ani mechanismus se nespouští. Kontaktů ani svorek se nedotýkej. Vypnutá cívka neznamená bezpečný silový obvod. Rozepnutý kontakt neznamená ověřenou beznapěťovost — kontakt může být svařený a část zařízení může mít jiné napájení. Zařízení se může neočekávaně rozběhnout. Cívka i kontakty se mohou zahřívat. Tato lekce neučí servisní postup odpojování, měření ani ověřování beznapěťového stavu. Místní školní pravidla a pokyn učitele mají přednost.',
    memorySentence:
      'Proud cívkou pohne kotvou a kontakty přepnou jiný obvod; stykač spíná, nezesiluje ani sám nechrání.',
    typicalMistake:
      'Žáci si myslí, že cívkou teče proud motoru, že stykač proud zesiluje, nebo že pomocný kontakt je hlavní cesta k motoru. Časté je i číst NO jako „normálně zapnutý“ a NC jako „normálně vypnutý“, případně brát stykač jako jistič. Správně: cívka mechanicky přestaví kontakty jiného obvodu; NO a NC se vztahují ke klidovému stavu bez buzení cívky; stykač není jistič ani automatická ochrana; vypnutá cívka neznamená ověřenou beznapěťovost silového obvodu.',
    teacherTip:
      'Barevně odliš ovládací a silový obvod. Použij kartičkový řetězec: povel → cívka → magnetické pole → pohyb kotvy → změna kontaktů → sepnutí nebo rozepnutí jiného obvodu. Přidej samostatné kartičky cívka, hlavní kontakt a pomocný kontakt a dvě kartičky NO a NC se stavem před a po buzení. Nech žáky vysvětlit, kudy proud motoru neteče. ContactorRelayDemo zastav u aktivace cívky, pohybu kotvy a sepnutí kontaktu a navaž na motor z předchozí lekce. Pracuj jen se schématem, simulací nebo odpojeným nízkonapěťovým modelem — praktické síťové přepojování neprováděj.',
    interactiveDemo: {
      type: 'contactor-relay',
      title: 'Cívka spíná kontakt',
      description:
        'Zapni a vypni napájení cívky a sleduj, co udělá kontakt a motor ve výkonovém obvodu.',
    },
    activity: {
      scenarioChoice: {
        type: 'scenario-choice',
        instruction:
          'U každé situace vyber možnost, která přímo odpovídá na závěrečnou otázku. Všechny čtyři musí být správně.',
        options: [
          {
            id: 'hlavni-no-sepne',
            label: 'Hlavní NO kontakt se sepne a silový obvod může napájet motor',
          },
          {
            id: 'pomocny-nc-rozepne',
            label: 'Pomocný NC kontakt se rozepne, protože cívka už není v klidovém stavu',
          },
          {
            id: 'spina-nechrani',
            label: 'Stykač pouze spíná; ochranu musí zajistit určený ochranný prvek',
          },
          {
            id: 'nelze-potvrdit-beznapeti',
            label: 'Z vypnuté cívky nelze potvrdit, že je celý silový obvod bez napětí',
          },
        ],
        successMessage:
          'Výborně! Rozlišuješ ovládací a silový obvod, NO/NC i to, že stykač spíná, ale sám nechrání ani nepotvrzuje beznapěťovost.',
        scenarios: [
          {
            id: 's1',
            text: 'Cívka stykače dostane správné napětí. Hlavní kontakt je typu NO, mechanismus je funkční a silový zdroj i ostatní podmínky jsou připravené. Co se v tomto okamžiku stane s hlavním NO kontaktem a silovým obvodem?',
            correctOptionId: 'hlavni-no-sepne',
            explanation:
              'Správné napětí na cívce → proud cívkou → magnetické pole → pohyb kotvy → sepnutí hlavního NO kontaktu. Silový obvod pak může napájet motor — motor se ale nerozběhne vždy automaticky.',
          },
          {
            id: 's2',
            text: 'Pomocný kontakt je typu NC. Bez buzení cívky je sepnutý; nyní cívka dostane správné napětí a kotva se přitáhne. Co se v tomto okamžiku stane s pomocným NC kontaktem?',
            correctOptionId: 'pomocny-nc-rozepne',
            explanation:
              'NC je v klidu sepnutý; „klid“ znamená cívku bez buzení. Po přitažení kotvy se kontakt rozepne. Pomocný kontakt obvykle slouží ovládání nebo signalizaci, nikoli napájení motoru.',
          },
          {
            id: 's3',
            text: 'V silovém obvodu vznikne zkrat nebo nebezpečné přetížení. Někdo tvrdí, že samotný stykač motor automaticky ochrání. Jak toto tvrzení správně posoudit?',
            correctOptionId: 'spina-nechrani',
            explanation:
              'Stykač není jistič. Samotná cívka ani hlavní kontakty automaticky nenahrazují ochranu. Ochrana proti zkratu a přetížení má vlastní určené prvky — nejde o návod k jejich výběru nebo zapojení.',
          },
          {
            id: 's4',
            text: 'Cívka není buzená a kontakt se jeví jako rozepnutý. Někdo chce z tohoto stavu usoudit, že celé zařízení je bezpečně bez napětí. Co lze z tohoto pozorování skutečně potvrdit?',
            correctOptionId: 'nelze-potvrdit-beznapeti',
            explanation:
              'Vypnutá cívka není důkazem beznapěťovosti. Kontakt může být svařený a může existovat jiné napájení. Mechanická poloha stykače nenahrazuje bezpečné odpojení a ověřený stav.',
          },
        ],
      },
    },
    quiz: [
      {
        id: 'q1',
        text: 'Co se stane po přivedení správného napětí na cívku stykače?',
        options: [
          {
            id: 'a',
            text: 'Proud motoru proteče cívkou a tím přímo napájí celý silový obvod zátěže.',
          },
          {
            id: 'b',
            text: 'Proud cívkou vytvoří magnetické pole a kotva mechanicky změní kontakty.',
          },
          {
            id: 'c',
            text: 'Proud přeskakuje z ovládacího obvodu přímo do silových vodičů motoru.',
          },
          {
            id: 'd',
            text: 'Kontakt sám změní stav bez jakéhokoli mechanického pohybu kotvy.',
          },
        ],
        correctOptionId: 'b',
        explanation:
          'Správné napětí na cívce vytvoří proud a magnetické pole. Kotva se pohne a mechanicky změní kontakty jiného obvodu. Proud motoru cívkou neteče a nepřeskakuje mezi obvody.',
      },
      {
        id: 'q2',
        text: 'Co znamená NO a NC u kontaktů stykače nebo relé?',
        options: [
          {
            id: 'a',
            text: 'NO znamená normálně zapnutý kontakt a NC znamená normálně vypnutý kontakt.',
          },
          {
            id: 'b',
            text: 'Klidový stav znamená, že motor právě běží v běžném provozu celého zařízení.',
          },
          {
            id: 'c',
            text: 'Stav NO a NC se nemění, ať je cívka buzená, nebo zcela bez napětí.',
          },
          {
            id: 'd',
            text: 'NO je bez buzení rozepnutý a NC sepnutý; po přitažení kotvy se stav změní.',
          },
        ],
        correctOptionId: 'd',
        explanation:
          '„Normálně“ se vztahuje ke klidovému stavu cívky bez buzení: NO (spínací) je rozepnutý, NC (rozpínací) sepnutý. Po přitažení kotvy se jejich stav změní.',
      },
      {
        id: 'q3',
        text: 'Co platí o stykači, ochraně a vypnuté cívce?',
        options: [
          {
            id: 'a',
            text: 'Stykač zesiluje proud motoru, proto stačí slabé ovládací tlačítko v obvodu.',
          },
          {
            id: 'b',
            text: 'Stykač automaticky jistí motor proti zkratu i proti každému přetížení.',
          },
          {
            id: 'c',
            text: 'Stykač spíná silový obvod, ale sám není jističem ani zárukou beznapěťovosti.',
          },
          {
            id: 'd',
            text: 'Vypnutá cívka zaručuje, že je celé zařízení včetně silového obvodu bez napětí.',
          },
        ],
        correctOptionId: 'c',
        explanation:
          'Stykač především spíná silový obvod. Není jistič ani automatická ochrana a vypnutá cívka nepotvrzuje bezpečný beznapěťový stav.',
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
