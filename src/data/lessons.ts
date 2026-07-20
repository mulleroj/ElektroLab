import type { MicroLesson } from '../types';
import { mereniLessons } from './lessons-mereni';
import { rozvodyLessons } from './lessons-rozvody';
import { elektronikaLessons } from './lessons-elektronika';
import { automatizaceLessons } from './lessons-automatizace';
import { strojeLessons } from './lessons-stroje';

const SAFETY_NOTE =
  'Tato lekce je školní simulace. Ve skutečné elektrické instalaci se nesmí pracovat pod napětím bez odborného dohledu a dodržení bezpečnostních pravidel.';

export const lessons: MicroLesson[] = [
  // Základy elektrotechniky — materiály před obvodem a veličinami
  {
    id: 'vodice-a-izolanty',
    subjectId: 'zaklady',
    topicId: 'stavba-latek',
    title: 'Vodiče a izolanty',
    year: 1,
    durationMinutes: 8,
    difficulty: 'základní',
    goal:
      'Žák rozliší elektrický vodič a izolant, uvede běžné materiály a vysvětlí, proč má vodič izolaci a proč izolant není absolutně bezpečný za všech podmínek.',
    hook:
      'Proč je uvnitř kabelu kov, ale zvenku plast? A proč smíme držet nepoškozený izolovaný vodič za plášť, ale nesmíme se dotýkat odkrytého kovového jádra? (Jde o úvahu — ne o pokus na živém zařízení.)',
    explanation:
      '**Elektrický vodič** je materiál, kterým elektrický proud prochází snadno. Běžně se používá **měď** (vede velmi dobře) a **hliník** (je lehčí a také vede dobře). Ocel nebo železo vedou také, ale obvykle hůře než měď. Zajímavý nekovový vodič je grafit. Materiály nevedou „stejně dobře“ — vodivost se liší. Materiál vodiče se nevybírá jen podle vodivosti, ale i podle hmotnosti, ceny, mechanických vlastností a způsobu použití. **Elektrický izolant** je materiál, kterým za běžných podmínek proud prochází velmi obtížně — například PVC, guma, sklo, keramika nebo suchý vzduch. V kabelu kovové jádro vede proud a izolace odděluje vodivou část od člověka i od okolních vodivých částí. Poškozená izolace už nemusí chránit. Samotná barva nebo vzhled materiálu nestačí k posouzení bezpečnosti.',
    safetyNote:
      'Bezpečnost vodiče nikdy neposuzujeme jen podle vzhledu. Poškozené izolace se nedotýkáme. Na živém zařízení se neprovádí pokusy. Skutečný stav vodiče a izolace posuzuje učitel nebo kvalifikovaná osoba vhodným postupem. Plastový povrch automaticky neznamená, že je zařízení bezpečné.',
    memorySentence:
      'Vodič vede proud, izolant odděluje vodivé části — ale ochrana závisí i na stavu a podmínkách.',
    typicalMistake:
      'Žáci si myslí, že izolant proud nikdy nevede. Izolant neznamená, že materiál nemůže nikdy vést proud. Vlhkost, nečistoty, poškození nebo vysoké napětí mohou jeho izolační schopnost zhoršit.',
    teacherTip:
      'Přines pouze odpojené vzorky kabelů. Ukaž kovové jádro a vrstvy izolace. Nech žáky roztřídit kartičky s názvy materiálů. Porovnej neporušenou a mechanicky poškozenou izolaci jen na odpojeném vzorku. Nepracuj pod napětím a neměř živý obvod.',
    activity: {
      termMatching: {
        type: 'term-matching',
        instruction:
          'Klikni na materiál vlevo a pak na správnou kategorii vpravo. Spáruj všechny čtyři dvojice.',
        leftTitle: 'Materiál',
        rightTitle: 'Kategorie',
        terms: [
          { id: 'med', label: 'Měď' },
          { id: 'hlinik', label: 'Hliník' },
          { id: 'pvc', label: 'PVC' },
          { id: 'keramika', label: 'Keramika' },
        ],
        definitions: [
          { id: 'vodic-med', label: 'Běžně používaný kov s velmi dobrou elektrickou vodivostí' },
          { id: 'vodic-hlinik', label: 'Lehký kov používaný jako vodič v některých vedeních' },
          { id: 'izolant-pvc', label: 'Ohebný plast používaný jako elektrická izolace' },
          { id: 'izolant-keramika', label: 'Tvrdý nekovový materiál používaný jako izolant i při vyšších teplotách' },
        ],
        correctPairs: {
          med: 'vodic-med',
          hlinik: 'vodic-hlinik',
          pvc: 'izolant-pvc',
          keramika: 'izolant-keramika',
        },
      },
    },
    quiz: [
      {
        id: 'q1',
        text: 'Který materiál se běžně používá jako dobrý elektrický vodič?',
        options: [
          { id: 'a', text: 'Měď' },
          { id: 'b', text: 'PVC' },
          { id: 'c', text: 'Keramika' },
          { id: 'd', text: 'Guma' },
        ],
        correctOptionId: 'a',
        explanation:
          'Měď vede elektrický proud velmi dobře a běžně se používá v elektrických vodičích. PVC, keramika a guma jsou izolanty za běžných podmínek.',
      },
      {
        id: 'q2',
        text: 'Proč je kovové jádro vodiče zakryto izolací?',
        options: [
          {
            id: 'a',
            text: 'Aby izolace oddělila vodivou část od člověka a okolních vodivých částí',
          },
          { id: 'b', text: 'Aby izolace zvýšila proud v obvodu' },
          { id: 'c', text: 'Aby se kovové jádro snáze ohnulo' },
          { id: 'd', text: 'Aby se kabel lépe nabíjel' },
        ],
        correctOptionId: 'a',
        explanation:
          'Izolace odděluje vodivé jádro od člověka i od okolních vodivých částí. Nezvyšuje proud.',
      },
      {
        id: 'q3',
        text: 'Co může zhoršit izolační schopnost materiálu?',
        options: [
          { id: 'a', text: 'Vlhkost, nečistoty nebo poškození' },
          { id: 'b', text: 'To, že je materiál barevný' },
          { id: 'c', text: 'To, že je kabel krátký' },
          { id: 'd', text: 'Nic — izolant je vždy absolutně bezpečný' },
        ],
        correctOptionId: 'a',
        explanation:
          'Izolant není absolutně nevodivý za všech podmínek. Vlhkost, nečistoty nebo poškození mohou izolační schopnost zhoršit.',
      },
    ],
    activityXp: 20,
    quizXp: 15,
    badgeId: 'znalec-materialu',
    mvpAvailable: true,
  },
  {
    id: 'elektricky-naboj-a-volne-elektrony',
    subjectId: 'zaklady',
    topicId: 'stavba-latek',
    title: 'Elektrický náboj a volné elektrony',
    year: 1,
    durationMinutes: 9,
    difficulty: 'základní',
    goal:
      'Žák vysvětlí elektrický náboj a základní částice, popíše volné elektrony v kovu a rozliší dohodnutý směr proudu od pohybu elektronů v jednoduchém stejnosměrném kovovém obvodu.',
    hook:
      'Když rozsvítíme žárovku, musí elektrony nejprve urazit celou cestu od baterie až k žárovce? A proč se účinek projeví hned, i když samotné elektrony se v kovu pohybují poměrně pomalu?',
    explanation:
      '**Elektrický náboj** je vlastnost částic a těles. Může být kladný nebo záporný. Stejné náboje se odpuzují, opačné se přitahují. Běžné těleso může být elektricky neutrální, když se kladné a záporné náboje vyrovnávají. Ve zjednodušeném modelu atomu jsou **protony** (kladný náboj) a **neutrony** (bez elektrického náboje) v jádře a **elektrony** (záporný náboj) se nacházejí v prostoru kolem jádra. V kovu nejsou všechny elektrony pevně vázány k jednomu atomu — některé se mohou pohybovat strukturou kovu. Nazýváme je **volné** nebo vodivostní elektrony; proto kovy dobře vedou proud. **Elektrický proud v kovovém vodiči** je usměrněný pohyb těchto volných elektronů. Bez zdroje se pohybují neuspořádaně; po uzavření obvodu zdroj vytvoří elektrické pole a jejich pohyb získá společný směr. Elektrony jsou ve vodiči už předem — necestují všechny „jako kuličky v prázdné trubce“ od baterie ke spotřebiči. **Dohodnutý (konvenční) směr proudu** se ve schématech značí od kladného pólu k zápornému. Elektrony v kovu se pohybují opačně, od záporného pólu ke kladnému. Tato dohoda vznikla dříve, než byla známá podstata pohybu elektronů. Ve vodiči se elektrony pohybují opačně než šipka dohodnutého směru proudu — oba popisy se vztahují ke stejnému elektrickému ději. Tento model platí pro kovové vodiče v jednoduchém stejnosměrném obvodu, ne jako univerzální vysvětlení proudu ve všech materiálech.',
    safetyNote:
      'Pohyb elektronů nelze bezpečně ověřovat dotykem. Proud lidským tělem je nebezpečný. Školní ukázky se provádějí pouze na bezpečném školním zdroji určeném pro výuku a pod vedením učitele. Síťové napětí se pro demonstraci této lekce nepoužívá. Nízké napětí není automaticky bezpečné za všech podmínek.',
    memorySentence:
      'V kovu vytváří proud usměrněný pohyb volných elektronů, které se pohybují opačně než dohodnutý směr proudu.',
    typicalMistake:
      'Žáci si často myslí, že elektrony čekají v baterii a po zapnutí všechny vyrazí vodičem ke spotřebiči. Ve skutečnosti jsou elektrony už v celém kovovém vodiči — zdroj vytvoří elektrické pole, které usměrní jejich pohyb. Druhá častá chyba: že směr proudu musí být stejný jako pohyb elektronů. Ve schématech používáme dohodnutý směr od plusu k minusu, ale elektrony v kovu se pohybují opačně.',
    teacherTip:
      'Bezpečná demonstrace: dlouhá řada kuliček nebo žáků představuje elektrony už přítomné ve vodiči. Mírný posun první části řady vyvolá pohyb celé řady — ukazuje, že částice jsou ve vodiči už předem. Jde jen o zjednodušený model. Alternativa: kartičky proton, neutron, elektron a spojování s nábojem a umístěním. Nepoužívej živý elektrický obvod ani dotykové zkoušení vodivosti.',
    activity: {
      termMatching: {
        type: 'term-matching',
        instruction:
          'Klikni na pojem vlevo a pak na správný význam vpravo. Spáruj všechny čtyři dvojice.',
        leftTitle: 'Pojem',
        rightTitle: 'Význam',
        terms: [
          { id: 'elektron', label: 'Elektron' },
          { id: 'proton', label: 'Proton' },
          { id: 'neutron', label: 'Neutron' },
          { id: 'proud-kov', label: 'Elektrický proud v kovu' },
        ],
        definitions: [
          {
            id: 'def-elektron',
            label: 'Záporně nabitá částice nacházející se mimo atomové jádro',
          },
          {
            id: 'def-proton',
            label: 'Kladně nabitá částice nacházející se v atomovém jádře',
          },
          {
            id: 'def-neutron',
            label: 'Částice bez elektrického náboje nacházející se v atomovém jádře',
          },
          {
            id: 'def-proud',
            label: 'Usměrněný pohyb volných elektronů',
          },
        ],
        correctPairs: {
          elektron: 'def-elektron',
          proton: 'def-proton',
          neutron: 'def-neutron',
          'proud-kov': 'def-proud',
        },
      },
    },
    quiz: [
      {
        id: 'q1',
        text: 'Která částice má záporný elektrický náboj?',
        options: [
          { id: 'a', text: 'Elektron' },
          { id: 'b', text: 'Proton' },
          { id: 'c', text: 'Neutron' },
          { id: 'd', text: 'Atomové jádro' },
        ],
        correctOptionId: 'a',
        explanation:
          'Elektron má záporný náboj. Proton je kladný, neutron je elektricky neutrální a jádro obsahuje protony a neutrony.',
      },
      {
        id: 'q2',
        text: 'Proč kovový vodič vede elektrický proud lépe než izolant?',
        options: [
          {
            id: 'a',
            text: 'Protože obsahuje volné elektrony, které se mohou pohybovat jeho strukturou',
          },
          { id: 'b', text: 'Protože všechny jeho atomy mají kladný náboj' },
          { id: 'c', text: 'Protože v něm nejsou žádné elektrony' },
          { id: 'd', text: 'Protože se jeho protony volně pohybují mezi atomy' },
        ],
        correctOptionId: 'a',
        explanation:
          'V kovu jsou některé elektrony volné (vodivostní) a mohou se pohybovat strukturou kovu. Při působení elektrického pole získá jejich pohyb společný směr — právě to umožňuje vedení proudu v kovovém vodiči. Neznamená to, že všechny elektrony jsou volné, ani že stejný mechanismus platí ve všech materiálech.',
      },
      {
        id: 'q3',
        text: 'Jaký je vztah mezi dohodnutým směrem proudu a pohybem elektronů v jednoduchém stejnosměrném kovovém obvodu?',
        options: [
          { id: 'a', text: 'Elektrony se pohybují opačně než dohodnutý směr proudu' },
          { id: 'b', text: 'Elektrony se pohybují stejným směrem jako dohodnutý proud' },
          { id: 'c', text: 'Elektrony se v kovovém vodiči vůbec nepohybují' },
          { id: 'd', text: 'Dohodnutý směr proudu se v elektrotechnice nepoužívá' },
        ],
        correctOptionId: 'a',
        explanation:
          'Dohodnutý směr proudu jde od plusu k minusu. Elektrony v kovu se pohybují opačně. Oba popisy popisují stejný děj — konvenční směr není „chyba“, ale dohoda používaná ve schématech.',
      },
    ],
    activityXp: 20,
    quizXp: 15,
    badgeId: 'znalec-naboje',
    mvpAvailable: true,
  },
  {
    id: 'co-je-obvod',
    subjectId: 'zaklady',
    topicId: 'stejnosmerny-proud',
    title: 'Co je elektrický obvod?',
    year: 1,
    durationMinutes: 7,
    difficulty: 'základní',
    goal:
      'Žák vysvětlí, že elektrický obvod musí být uzavřená cesta pro elektrický proud a pozná základní části jednoduchého obvodu.',
    hook: 'Žárovka je připojená ke zdroji, ale nesvítí. Co může být špatně?',
    explanation:
      'Elektrický proud může procházet jen uzavřeným obvodem. Základní obvod obsahuje zdroj, vodiče, spotřebič a často vypínač. Když je obvod přerušený — například otevřeným vypínačem nebo přerušeným vodičem — proud neteče a spotřebič nepracuje.',
    safetyNote: SAFETY_NOTE,
    memorySentence: 'Elektrický proud teče jen tehdy, když má uzavřenou cestu.',
    typicalMistake:
      'Žáci často zapomínají, že obvod musí být uzavřený — stačí jedno přerušení a proud neteče.',
    teacherTip:
      'Úplně první lekce — vhodná na začátek 1. ročníku nebo jako rychlé opakování při suplování. Ukázka se spínačem funguje dobře na projektoru.',
    interactiveDemo: {
      type: 'circuit-switch',
      title: 'Sepni a rozpoj obvod',
      description:
        'Vyzkoušej, co se stane se žárovkou, když je obvod uzavřený nebo přerušený.',
    },
    activity: {
      circuitOrder: {
        type: 'circuit-order',
        instruction:
          'Klikni na prvky ve správném pořadí, jak proud prochází uzavřeným obvodem od zdroje zpět ke zdroji.',
        elements: [
          { id: 'zdroj', label: 'Zdroj' },
          { id: 'vodic1', label: 'Vodič (ze zdroje)' },
          { id: 'vypinac', label: 'Vypínač (zavřený)' },
          { id: 'spotrebic', label: 'Spotřebič' },
          { id: 'vodic2', label: 'Vodič (zpět ke zdroji)' },
          { id: 'uzavreny', label: 'Uzavřený obvod' },
        ],
        correctOrder: ['zdroj', 'vodic1', 'vypinac', 'spotrebic', 'vodic2', 'uzavreny'],
      },
    },
    quiz: [
      {
        id: 'q1',
        text: 'Kdy může elektrickým obvodem téct proud?',
        options: [
          { id: 'a', text: 'Když je obvod uzavřený.' },
          { id: 'b', text: 'Když je vypínač rozpojený.' },
          { id: 'c', text: 'Když chybí zdroj.' },
          { id: 'd', text: 'Když je spotřebič odpojený.' },
        ],
        correctOptionId: 'a',
        explanation:
          'Proud teče jen uzavřeným obvodem — musí existovat nepřerušená cesta od zdroje zpět ke zdroji.',
      },
      {
        id: 'q2',
        text: 'Co se stane, když je vypínač rozpojený?',
        options: [
          { id: 'a', text: 'Proud teče silněji.' },
          { id: 'b', text: 'Obvod je přerušený a proud neteče.' },
          { id: 'c', text: 'Zdroj se vybije okamžitě.' },
          { id: 'd', text: 'Spotřebič svítí jasněji.' },
        ],
        correctOptionId: 'b',
        explanation:
          'Rozpojený vypínač přeruší obvod — proud nemá uzavřenou cestu a neteče.',
      },
      {
        id: 'q3',
        text: 'Která část dodává obvodu elektrickou energii?',
        options: [
          { id: 'a', text: 'Vypínač' },
          { id: 'b', text: 'Vodič' },
          { id: 'c', text: 'Zdroj' },
          { id: 'd', text: 'Spotřebič' },
        ],
        correctOptionId: 'c',
        explanation:
          'Zdroj (baterie, generátor, síť) dodává obvodu elektrickou energii.',
      },
    ],
    activityXp: 15,
    quizXp: 15,
    badgeId: 'prvni-zapojeni',
    mvpAvailable: true,
  },
  {
    id: 'napeti-proud-odpor',
    subjectId: 'zaklady',
    topicId: 'stejnosmerny-proud',
    title: 'Napětí, proud a odpor jednoduše',
    year: 1,
    durationMinutes: 8,
    difficulty: 'základní',
    goal: 'Žák rozliší tři základní veličiny — napětí, proud a odpor — a vysvětlí jejich význam.',
    hook: 'Proč se někdy říká, že „něco táhne proud“, ale jindy „je tam napětí“? Nejsou to totéž.',
    explanation:
      '**Napětí** je „tlačí“ na elektrony — bez napětí by se nepohnuly. **Proud** je tok elektrického náboje obvodem. **Odpor** materiálu brání průchodu proudu — čím větší odpor, tím menší proud při stejném napětí. Všechny tři veličiny spolu souvisí v každém obvodu.',
    safetyNote: SAFETY_NOTE,
    memorySentence: 'Napětí tlačí, proud teče, odpor brání.',
    typicalMistake:
      'Žáci často zaměňují napětí a proud — napětí je příčina „tlaku“, proud je důsledek toku náboje.',
    teacherTip:
      'Zařaď před Ohmův zákon — bez rozlišení veličin se žáci ve vzorci ztratí. Párování pojmů zvládne i slabší žák.',
    activity: {
      termMatching: {
        type: 'term-matching',
        instruction:
          'Klikni na veličinu vlevo a pak na správný význam vpravo. Spáruj všechny tři páry.',
        terms: [
          { id: 'napeti', label: 'Napětí' },
          { id: 'proud', label: 'Proud' },
          { id: 'odpor', label: 'Odpor' },
        ],
        definitions: [
          { id: 'def-tlak', label: 'Tlačí proud obvodem' },
          { id: 'def-tok', label: 'Tok elektrického náboje' },
          { id: 'def-brani', label: 'Brání průchodu proudu' },
        ],
        correctPairs: {
          napeti: 'def-tlak',
          proud: 'def-tok',
          odpor: 'def-brani',
        },
      },
    },
    quiz: [
      {
        id: 'q1',
        text: 'Co je proud?',
        options: [
          { id: 'a', text: 'Tok elektrického náboje obvodem.' },
          { id: 'b', text: 'Tlak, který tlačí na vodič.' },
          { id: 'c', text: 'Odpor materiálu proti průchodu.' },
          { id: 'd', text: 'Délka vodiče v metrech.' },
        ],
        correctOptionId: 'a',
        explanation: 'Proud je tok elektrického náboje — kolik „náboje“ proteče za čas.',
      },
      {
        id: 'q2',
        text: 'Co dělá odpor v obvodu?',
        options: [
          { id: 'a', text: 'Zvyšuje napětí zdroje.' },
          { id: 'b', text: 'Brání průchodu proudu.' },
          { id: 'c', text: 'Měří teplotu vodiče.' },
          { id: 'd', text: 'Zapíná a vypíná obvod.' },
        ],
        correctOptionId: 'b',
        explanation: 'Odpor brání průchodu proudu — každý materiál ho má (některý větší, některý menší).',
      },
      {
        id: 'q3',
        text: 'Napětí v obvodu můžeme přirovnat k…',
        options: [
          { id: 'a', text: 'Tlaku, který tlačí elektrony do pohybu.' },
          { id: 'b', text: 'Barvě vodiče.' },
          { id: 'c', text: 'Počtu žárovek v místnosti.' },
          { id: 'd', text: 'Délce kabelu.' },
        ],
        correctOptionId: 'a',
        explanation: 'Napětí je „tlačí“ na elektrony — bez něj by proud netekl.',
      },
    ],
    activityXp: 15,
    quizXp: 15,
    badgeId: 'znalec-velicin',
    mvpAvailable: true,
  },
  {
    id: 'jednotky-a-prevody',
    subjectId: 'zaklady',
    topicId: 'veliciny',
    title: 'Jednotky a převody elektrických veličin',
    year: 1,
    durationMinutes: 10,
    difficulty: 'základní',
    goal:
      'Žák rozpozná jednotky V, A a Ω, převádí mA ↔ A a kΩ ↔ Ω a chápe, že předpona mění zápis hodnoty, nikoli její skutečnou velikost.',
    hook:
      'Na štítku je 500 mA a v příkladu počítáš s 0,5 A. Jsou to dvě různé věci, nebo jen jiný zápis stejného proudu?',
    explanation:
      'Číslo samo o sobě nestačí. Údaj **2 A** není totéž jako samotné číslo 2 — bez jednotky může být hodnota nejednoznačná. Při výpočtu musí být veličiny zapsané ve vzájemně vhodných jednotkách.\n\nZákladní jednotky: napětí ve **voltech (V)**, proud v **ampérech (A)**, odpor v **ohmech (Ω)**. Předpona **mili** znamená jednu tisícinu, předpona **kilo** znamená tisíc. Převod nemění skutečnou fyzikální hodnotu — mění jen způsob zápisu. Proto **500 mA** a **0,5 A** označují stejný proud a **2 kΩ** a **2000 Ω** stejný odpor.\n\n**Proud:** 1 A = 1000 mA a 1 mA = 0,001 A. Z ampérů na miliampéry násobíme 1000, z miliampérů na ampéry dělíme 1000. Příklady: 500 mA = 0,5 A; 750 mA = 0,75 A; 0,2 A = 200 mA. Stejně funguje mili u napětí: 250 mV = 0,25 V.\n\n**Odpor:** 1 kΩ = 1000 Ω a 1 Ω = 0,001 kΩ. Z kiloohmů na ohmy násobíme 1000, z ohmů na kiloohmy dělíme 1000. Příklady: 2 kΩ = 2000 Ω; 4,7 kΩ = 4700 Ω; 2200 Ω = 2,2 kΩ. Před Ohmovým zákonem hodnoty převádíme do vhodného tvaru — nesmícháme mA s A ani kΩ s Ω bez převodu.',
    safetyNote:
      'Jednotky a převody se učíme na zadaných hodnotách a bezpečných modelech. Podle samotného čísla nebo jednotky nelze rozhodnout, zda je zařízení bezpečné. Žák nemá měřit živé síťové zařízení jen kvůli procvičení převodů. Skutečný rozsah měřidla a způsob připojení se volí podle návodu a pod dohledem učitele. Tato lekce neučí volbu jištění ani práci na elektrické instalaci.',
    memorySentence:
      'Předpona změní zápis jednotky, ne skutečnou hodnotu veličiny.',
    typicalMistake:
      'Žáci často převádí opačným směrem, nebo při výpočtu jednotku úplně vynechají. Další chyba: myslí si, že 1 kΩ = 100 Ω. Také porovnávají jen čísla — například že 500 mA je větší než 1 A, protože 500 je větší než 1. Ve skutečnosti 500 mA = 0,5 A, tedy méně než 1 A. Hodnoty s různými předponami se před výpočtem musí převést.',
    teacherTip:
      'Nech žáky přiřadit kartičky 500 mA ↔ 0,5 A a 2 kΩ ↔ 2000 Ω. Zdůrazni, že převod nemění hodnotu, jen zápis. Počítej jen s papírem nebo bezpečným modelem — neměř síťové zařízení kvůli převodům.',
    activity: {
      termMatching: {
        type: 'term-matching',
        instruction:
          'Klikni na hodnotu vlevo a pak na stejnou hodnotu zapsanou jinak vpravo. Spáruj všechny čtyři dvojice.',
        leftTitle: 'Zápis',
        rightTitle: 'Stejná hodnota',
        terms: [
          { id: 'ma500', label: '500 mA' },
          { id: 'kohm2', label: '2 kΩ' },
          { id: 'a02', label: '0,2 A' },
          { id: 'ohm4700', label: '4700 Ω' },
        ],
        definitions: [
          { id: 'eq-05a', label: '0,5 A' },
          { id: 'eq-2000ohm', label: '2000 Ω' },
          { id: 'eq-200ma', label: '200 mA' },
          { id: 'eq-47kohm', label: '4,7 kΩ' },
        ],
        correctPairs: {
          ma500: 'eq-05a',
          kohm2: 'eq-2000ohm',
          a02: 'eq-200ma',
          ohm4700: 'eq-47kohm',
        },
      },
    },
    quiz: [
      {
        id: 'q1',
        text: 'Kolik ampérů je 750 mA?',
        options: [
          { id: 'a', text: '0,75 A' },
          { id: 'b', text: '7,5 A' },
          { id: 'c', text: '750 A' },
          { id: 'd', text: '0,075 A' },
        ],
        correctOptionId: 'a',
        explanation:
          'Z miliampérů na ampéry dělíme 1000: 750 mA = 750 / 1000 = 0,75 A. Převod nemění proud, jen jeho zápis.',
      },
      {
        id: 'q2',
        text: 'Kolik ohmů je 4,7 kΩ?',
        options: [
          { id: 'a', text: '4700 Ω' },
          { id: 'b', text: '470 Ω' },
          { id: 'c', text: '47 Ω' },
          { id: 'd', text: '4,7 Ω' },
        ],
        correctOptionId: 'a',
        explanation:
          'Z kiloohmů na ohmy násobíme 1000: 4,7 kΩ = 4,7 · 1000 = 4700 Ω. Neplatí, že 1 kΩ = 100 Ω.',
      },
      {
        id: 'q3',
        text: 'Co znamená převod 500 mA na 0,5 A?',
        options: [
          { id: 'a', text: 'Jde o stejný proud zapsaný jinými jednotkami.' },
          { id: 'b', text: 'Proud se převodem zmenší na polovinu.' },
          { id: 'c', text: 'Proud se převodem zvětší tisíckrát.' },
          { id: 'd', text: 'Jednotku můžeme při výpočtu vynechat.' },
        ],
        correctOptionId: 'a',
        explanation:
          'Předpona mění zápis, ne skutečnou hodnotu. 500 mA a 0,5 A označují stejný proud. Jednotku při výpočtu nevynecháváme.',
      },
    ],
    activityXp: 20,
    quizXp: 15,
    badgeId: 'prekladac-jednotek',
    mvpAvailable: true,
  },
  {
    id: 'proc-ma-vodic-elektricky-odpor',
    subjectId: 'zaklady',
    topicId: 'stejnosmerny-proud',
    title: 'Proč má vodič elektrický odpor',
    year: 1,
    durationMinutes: 9,
    difficulty: 'základní',
    goal:
      'Žák vysvětlí elektrický odpor vodiče, uvede vliv materiálu, délky, průřezu a teploty u kovového vodiče a spojí odpor se zahříváním vodiče.',
    hook:
      'Proč má i měděný vodič určitý odpor, když je měď dobrý elektrický vodič? A proč se dlouhý a tenký vodič zahřívá snáze než krátký vodič s větším průřezem ze stejného materiálu? (Jde o modelovou úvahu — ne o přetěžování kabelu.)',
    explanation:
      '**Elektrický odpor** vyjadřuje, jak moc prvek nebo vodič omezuje elektrický proud. Značí se **R**, základní jednotka je ohm (**Ω**). Dobrý vodič má malý odpor, nikoli nulový. Izolant má za běžných podmínek odpor velmi velký. Proud se ve spotřebiči ani vodiči neztrácí — odpor ovlivňuje, jak velký proud bude při daném napětí obvodem procházet. Ve **zjednodušeném modelu** se volné elektrony v kovu pohybují jeho strukturou. Při usměrněném pohybu jsou ovlivňovány atomy materiálu, nečistotami a nepravidelnostmi, takže pohyb není bez překážek. Část elektrické energie se mění na vnitřní energii materiálu a vodič se může zahřívat. Odpor vodiče závisí zejména na **materiálu**, **délce**, **průřezu** (ploše řezu vodičem) a **teplotě**. Při stejném materiálu, průřezu a teplotě má delší vodič větší odpor. Při stejném materiálu, délce a teplotě má vodič s větším průřezem menší odpor. U kovových vodičů za běžných podmínek se při zvýšení teploty odpor obvykle zvětšuje — toto pravidlo neplatí univerzálně pro všechny materiály. Zahřívání může být užitečné (topné těleso) nebo nežádoucí (přetížené vedení). Samotný výpočet odporu nestačí k posouzení bezpečnosti instalace.',
    safetyNote:
      'Odpor vodiče se nezkouší úmyslným přetěžováním ani zkratem. Poškozený nebo neobvykle teplý kabel se nepoužívá. Síťová instalace se neposuzuje jen podle jednoduchého modelu odporu. Skutečné měření a posouzení provádí učitel nebo kvalifikovaná osoba vhodným měřicím přístrojem a bezpečným postupem. Vodiče za provozu se nedotýkáme kvůli zjištění teploty.',
    memorySentence:
      'Odpor vodiče závisí na materiálu, délce, průřezu a teplotě — delší vodič odpor zvětšuje, větší průřez ho zmenšuje.',
    typicalMistake:
      'Žáci si myslí, že odpor „spotřebuje“ část proudu. Proud se ve vodiči nespotřebovává — odpor ovlivňuje velikost proudu při daném napětí a elektrická energie se může měnit na teplo. Druhá chyba: že vodič s větším průřezem má větší odpor, protože obsahuje více materiálu. Při stejné délce a materiálu má vodič s větším průřezem menší odpor.',
    teacherTip:
      'Připrav odpojené vzorky vodičů různé délky a průřezu a nech žáky jen vizuálně porovnat. Provázkem znázorni delší cestu; jednou úzkou a několika paralelními cestami význam většího průřezu. Zdůrazni, že jde o model. Měření jen na bezpečném školním zařízení podle návodu a pod dohledem — bez síťového napětí.',
    activity: {
      measurementJudgment: {
        type: 'measurement-judgment',
        instruction:
          'U každé situace rozhodni, jestli se elektrický odpor vodiče zvětší, nebo zmenší. Ostatní podmínky zůstávají stejné, jak je uvedeno.',
        correctLabel: 'Odpor se zvětší',
        wrongLabel: 'Odpor se zmenší',
        successMessage: 'Výborně! Správně jsi posoudil, jak se mění odpor vodiče.',
        scenarios: [
          {
            id: 's1',
            text: 'Vodič ze stejného materiálu, se stejným průřezem a při stejné teplotě prodloužíme.',
            correct: 'correct',
            explanation:
              'Delší vodič má při stejném materiálu, průřezu a teplotě větší elektrický odpor.',
          },
          {
            id: 's2',
            text: 'Vodič ze stejného materiálu a stejné délky nahradíme při stejné teplotě vodičem s větším průřezem.',
            correct: 'wrong',
            explanation:
              'Větší průřez znamená při stejné délce, materiálu a teplotě menší elektrický odpor.',
          },
          {
            id: 's3',
            text: 'Kovový vodič za běžných podmínek zahřejeme (materiál, délka i průřez zůstávají stejné).',
            correct: 'correct',
            explanation:
              'U kovových vodičů se při zvýšení teploty odpor obvykle zvětšuje. Nejde o pravidlo pro všechny materiály.',
          },
          {
            id: 's4',
            text: 'Stejně dlouhý a stejně silný (stejný průřez) vodič nahradíme při stejné teplotě materiálem s horší elektrickou vodivostí.',
            correct: 'correct',
            explanation:
              'Materiál s horší vodivostí má při stejné délce, průřezu a teplotě větší elektrický odpor.',
          },
        ],
      },
    },
    quiz: [
      {
        id: 'q1',
        text: 'Co vyjadřuje elektrický odpor?',
        options: [
          { id: 'a', text: 'Jak moc prvek nebo vodič omezuje elektrický proud' },
          { id: 'b', text: 'Kolik nových elektronů prvek vytváří' },
          { id: 'c', text: 'Kolik elektrického náboje prvek spotřebuje' },
          { id: 'd', text: 'Jakou barvu má izolace kabelu' },
        ],
        correctOptionId: 'a',
        explanation:
          'Odpor říká, jak moc prvek nebo vodič omezuje proud. Při daném napětí platí, že větší odpor znamená menší proud. Nevyjadřuje spotřebu náboje ani barvu izolace.',
      },
      {
        id: 'q2',
        text: 'Který z těchto vodičů bude mít při stejné teplotě nejmenší elektrický odpor?',
        options: [
          { id: 'a', text: 'Krátký měděný vodič s větším průřezem' },
          { id: 'b', text: 'Dlouhý měděný vodič s menším průřezem' },
          {
            id: 'c',
            text: 'Dlouhý vodič z hůře vodivého materiálu s menším průřezem',
          },
          {
            id: 'd',
            text: 'Krátký vodič z hůře vodivého materiálu s menším průřezem',
          },
        ],
        correctOptionId: 'a',
        explanation:
          'Při stejné teplotě má menší odpor vodič z lépe vodivého materiálu, s kratší délkou a větším průřezem. Měď je v tomto porovnání lépe vodivá než materiál v ostatních možnostech.',
      },
      {
        id: 'q3',
        text: 'Proč se může vodič při průchodu elektrického proudu zahřívat?',
        options: [
          { id: 'a', text: 'Kvůli odporu se část elektrické energie mění na teplo' },
          { id: 'b', text: 'Protože elektrony ve vodiči hoří' },
          { id: 'c', text: 'Protože se proud ve vodiči spotřebuje' },
          { id: 'd', text: 'Protože vodič vytváří nový elektrický náboj' },
        ],
        correctOptionId: 'a',
        explanation:
          'Kvůli elektrickému odporu se část elektrické energie mění na teplo. Proud se nespotřebovává a elektrony nehoří.',
      },
    ],
    activityXp: 20,
    quizXp: 15,
    badgeId: 'znalec-odporu',
    mvpAvailable: true,
  },
  {
    id: 'ohmuv-zakon',
    subjectId: 'zaklady',
    topicId: 'stejnosmerny-proud',
    title: 'Ohmův zákon bez paniky',
    year: 1,
    durationMinutes: 8,
    difficulty: 'základní',
    goal: 'Žák pozná vztah U = R · I a dopočítá jednoduchý příklad s malými čísly.',
    hook: 'Baterka 6 V, žárovka 3 Ω. Kolik proudu teče? Stačí jeden vzorec — a žádný strach.',
    explanation:
      '**Ohmův zákon**: U = R · I. Napětí U (volt) se rovná součinu odporu R (ohm) a proudu I (ampér). Když znáš dvě veličiny, třetí dopočítáš. Příklad: U = 6 V, R = 3 Ω → I = U / R = 6 / 3 = 2 A.',
    safetyNote: SAFETY_NOTE,
    memorySentence: 'U = R · I — napětí rovná odpor krát proud.',
    typicalMistake:
      'Žáci zaměňují, co dělit — hledáš proud? Dělíš napětí odporem: I = U / R.',
    teacherTip:
      'Vhodné po lekci o veličinách. Dobrá společná aktivita na tabuli: nech třídu hlasovat o správném vzorci, pak teprve odkryj řešení.',
    activity: {
      formulaSelect: {
        type: 'formula-select',
        instruction:
          'Přečti si příklad a vyber správný vztah pro výpočet hledané veličiny.',
        example:
          'Máme baterku 12 V a rezistor 4 Ω. Chceme zjistit, kolik proudu obvodem teče.',
        question: 'Který vztah z Ohmova zákona použijeme pro výpočet proudu?',
        options: [
          { id: 'a', text: 'U = R · I' },
          { id: 'b', text: 'I = U / R' },
          { id: 'c', text: 'R = U · I' },
          { id: 'd', text: 'I = R / U' },
        ],
        correctOptionId: 'b',
        successExplanation:
          'Správně! Z U = R · I vyjde I = U / R. Dosadíme: I = 12 / 4 = 3 A.',
      },
    },
    quiz: [
      {
        id: 'q1',
        text: 'Jaký je správný zápis Ohmova zákona?',
        options: [
          { id: 'a', text: 'U = R · I' },
          { id: 'b', text: 'U = R / I' },
          { id: 'c', text: 'I = R · U' },
          { id: 'd', text: 'R = U · I' },
        ],
        correctOptionId: 'a',
        explanation: 'Ohmův zákon: napětí = odpor × proud, tedy U = R · I.',
      },
      {
        id: 'q2',
        text: 'U = 10 V, R = 5 Ω. Kolik je proud?',
        options: [
          { id: 'a', text: '2 A' },
          { id: 'b', text: '50 A' },
          { id: 'c', text: '0,5 A' },
          { id: 'd', text: '15 A' },
        ],
        correctOptionId: 'a',
        explanation: 'I = U / R = 10 / 5 = 2 A.',
      },
      {
        id: 'q3',
        text: 'Co hledáš, když znáš napětí a odpor?',
        options: [
          { id: 'a', text: 'Proud — I = U / R' },
          { id: 'b', text: 'Barvu vodiče' },
          { id: 'c', text: 'Délku kabelu' },
          { id: 'd', text: 'Teplotu místnosti' },
        ],
        correctOptionId: 'a',
        explanation: 'Když znáš U a R, proud dopočítáš jako I = U / R.',
      },
    ],
    activityXp: 20,
    quizXp: 15,
    badgeId: 'ohmuv-pomocnik',
    mvpAvailable: true,
  },
  {
    id: 'seriove-paralelni',
    subjectId: 'zaklady',
    topicId: 'stejnosmerny-proud',
    title: 'Sériové a paralelní zapojení',
    year: 1,
    durationMinutes: 9,
    difficulty: 'základní',
    goal: 'Žák rozliší sériové zapojení (prvky za sebou) a paralelní zapojení (prvky ve větvích).',
    hook: 'Vánoční řetěz — když jedna žárovka přestane svítit, zhasnou všechny. Proč u lustrů v bytě to tak není?',
    explanation:
      'Při **sériovém** zapojení proud prochází všemi prvky za sebou — jedna cesta. Při **paralelním** zapojení jsou prvky ve větvích vedle sebe — proud se rozdělí. Sériově: žárovky za sebou na jednom vodiči. Paralelně: každá žárovka má vlastní větev ke zdroji.',
    safetyNote: SAFETY_NOTE,
    memorySentence: 'Sériově za sebou, paralelně ve větvích.',
    typicalMistake:
      'Žáci si pletou, kde proud „teče stejně“ — sériově je stejný proud všude, paralelně stejné napětí na větvích.',
    teacherTip:
      'Časté téma závěrečné zkoušky. Interaktivní ukázka dvou schémat se hodí na projektor; příklad s vánočním řetězem spolehlivě chytne pozornost.',
    interactiveDemo: {
      type: 'series-parallel',
      title: 'Sériové nebo paralelní?',
      description:
        'Vyber sériové nebo paralelní zapojení a projdi pět kroků. Sleduj, kolik má proud cest a jak se v obou zapojeních chová proud a napětí.',
    },
    activity: {
      connectionType: {
        type: 'connection-type',
        instruction:
          'U každého scénáře rozhodni, zda jde o sériové nebo paralelní zapojení. Všechny musí být správně.',
        scenarios: [
          {
            id: 's1',
            description:
              'Dvě žárovky na jednom vodiči za sebou — proud prochází první, pak druhou.',
            correctType: 'serial',
          },
          {
            id: 's2',
            description:
              'Dvě žárovky vedle sebe — každá má vlastní větev od zdroje a zpět ke zdroji.',
            correctType: 'parallel',
          },
          {
            id: 's3',
            description:
              'Tři rezistory za sebou na společné větvi — jeden proud prochází všemi třemi.',
            correctType: 'serial',
          },
        ],
      },
    },
    quiz: [
      {
        id: 'q1',
        text: 'Jak poznáš sériové zapojení?',
        options: [
          { id: 'a', text: 'Prvky jsou za sebou na jedné cestě proudu.' },
          { id: 'b', text: 'Každý prvek má vlastní větev ke zdroji.' },
          { id: 'c', text: 'Chybí zdroj napětí.' },
          { id: 'd', text: 'Jsou zapojeny jen vodiče.' },
        ],
        correctOptionId: 'a',
        explanation: 'Sériově jsou prvky za sebou — proud prochází všemi postupně.',
      },
      {
        id: 'q2',
        text: 'Paralelní zapojení znamená…',
        options: [
          { id: 'a', text: 'Prvky ve větvích vedle sebe.' },
          { id: 'b', text: 'Prvky za sebou na jednom drátu.' },
          { id: 'c', text: 'Žádný proud neteče.' },
          { id: 'd', text: 'Jen jeden spotřebič v obvodu.' },
        ],
        correctOptionId: 'a',
        explanation: 'Paralelně jsou prvky ve větvích — vedle sebe, každá větev ke zdroji.',
      },
      {
        id: 'q3',
        text: 'Když v sériovém řetězu jedna žárovka přeruší obvod…',
        options: [
          { id: 'a', text: 'Zhasnou všechny žárovky v řetězu.' },
          { id: 'b', text: 'Ostatní svítí dál stejně.' },
          { id: 'c', text: 'Zdroj se okamžitě zničí.' },
          { id: 'd', text: 'Proud se zdvojnásobí.' },
        ],
        correctOptionId: 'a',
        explanation: 'Sériově je jedna cesta — přerušení zastaví proud v celém řetězu.',
      },
    ],
    activityXp: 20,
    quizXp: 15,
    badgeId: 'seriove-paralelne',
    mvpAvailable: true,
  },
  {
    id: 'elektricky-vykon-a-energie',
    subjectId: 'zaklady',
    topicId: 'stejnosmerny-proud',
    title: 'Elektrický výkon a energie',
    year: 1,
    durationMinutes: 9,
    difficulty: 'základní',
    goal:
      'Žák vysvětlí elektrický výkon a energii, použije vztahy P = U · I a E = P · t a rozliší jednotky W, kW, Wh a kWh.',
    hook:
      'Na štítku LED svítidla čteš 9 W, u rychlovarné konvice 2000 W. Oba spotřebiče mohou jít do stejné zásuvky 230 V — proč mají tak rozdílný příkon?',
    explanation:
      '**Elektrický výkon** říká, jak rychle spotřebič používá elektrickou energii. Základní vztah je **P = U · I**: výkon P ve wattech (W) je součin napětí U ve voltech (V) a proudu I v ampérech (A). Příklad: 12 V · 2 A = 24 W. Při stejném napětí odebírá spotřebič s vyšším výkonem větší proud — obvod je víc zatížený. Od výkonu se liší **elektrická energie**: ta říká, kolik energie spotřebič spotřeboval za určitou dobu. Základní vztah je **E = P · t**. Jednotky energie jsou watthodina (Wh) a kilowatthodina (kWh). Příklad: 100 W po dobu 2 hodin = 200 Wh = 0,2 kWh. Výkon tedy popisuje rychlost spotřeby, energie celkové množství za čas.',
    safetyNote:
      'Údaje na štítku spotřebiče se čtou, neodhadují. Vysoký příkon znamená při stejném napětí vyšší proud. Skutečné připojování a posuzování elektrické instalace patří pod dohled učitele nebo kvalifikované osoby. Tato lekce je školní model — nestačí jediný výpočet výkonu k rozhodnutí o bezpečném připojení.',
    memorySentence:
      'Výkon určuje, jak rychle se energie spotřebovává; vypočítáme ho jako napětí krát proud.',
    typicalMistake:
      'Žáci zaměňují watt (W) a kilowatthodinu (kWh). Watt a kilowatt jsou jednotky výkonu. Watthodina a kilowatthodina jsou jednotky energie. Watt není totéž co kilowatthodina — výkon popisuje rychlost spotřeby, energie celkové množství za určitý čas.',
    teacherTip:
      'Nech žáky porovnat údaje na štítcích dvou bezpečně odpojených spotřebičů (například nabíječka a konvice). Před výpočtem vždy napište veličiny a jednotky. Zdůrazni rozdíl W × Wh — častá chyba u začátečníků. Nepracuj na živém zařízení.',
    activity: {
      formulaSelect: {
        type: 'formula-select',
        instruction:
          'Přečti si příklad a vyber správný vztah pro výpočet hledané veličiny.',
        example:
          'Spotřebič pracuje při napětí 12 V a odebírá proud 2 A. Chceme zjistit jeho výkon.',
        question: 'Který vztah použijeme pro výpočet výkonu?',
        options: [
          { id: 'a', text: 'P = U · I' },
          { id: 'b', text: 'E = P · t' },
          { id: 'c', text: 'R = U / I' },
          { id: 'd', text: 'I = U / R' },
        ],
        correctOptionId: 'a',
        successExplanation:
          'Správně! Výkon spočítáš jako P = U · I. Dosadíme: P = 12 · 2 = 24 W. Vztah E = P · t slouží k energii a R = U / I k odporu.',
      },
    },
    quiz: [
      {
        id: 'q1',
        text: 'Co popisuje elektrický výkon?',
        options: [
          { id: 'a', text: 'Jak rychle spotřebič používá elektrickou energii' },
          { id: 'b', text: 'Kolik energie spotřeboval za určitou dobu' },
          { id: 'c', text: 'Odpor vodiče v ohmech' },
          { id: 'd', text: 'Barvu izolace kabelu' },
        ],
        correctOptionId: 'a',
        explanation:
          'Výkon popisuje rychlost spotřeby energie. Celkové množství energie za čas popisuje elektrická energie (Wh, kWh).',
      },
      {
        id: 'q2',
        text: 'Spotřebič s výkonem 100 W pracuje 2 hodiny. Kolik elektrické energie spotřebuje?',
        options: [
          { id: 'a', text: '200 Wh, tedy 0,2 kWh' },
          { id: 'b', text: '50 Wh' },
          { id: 'c', text: '200 kWh' },
          { id: 'd', text: '0,02 kWh' },
        ],
        correctOptionId: 'a',
        explanation: 'E = P · t = 100 W · 2 h = 200 Wh = 0,2 kWh.',
      },
      {
        id: 'q3',
        text: 'Spotřebič pracuje při napětí 24 V a odebírá proud 0,5 A. Jaký má výkon?',
        options: [
          { id: 'a', text: '12 W' },
          { id: 'b', text: '48 W' },
          { id: 'c', text: '24,5 W' },
          { id: 'd', text: '12 kWh' },
        ],
        correctOptionId: 'a',
        explanation: 'P = U · I = 24 V · 0,5 A = 12 W.',
      },
    ],
    activityXp: 20,
    quizXp: 15,
    badgeId: 'vykon-pod-kontrolou',
    mvpAvailable: true,
  },
  {
    id: 'zkrat-pretizeni-a-jisteni',
    subjectId: 'zaklady',
    topicId: 'stejnosmerny-proud',
    title: 'Zkrat, přetížení a jištění',
    year: 1,
    durationMinutes: 10,
    difficulty: 'základní',
    goal:
      'Žák vysvětlí nadproud, rozliší přetížení a zkrat, uvede úlohu pojistky a jističe a chápe, že ochrana před nadproudem neznamená ochranu před každým úrazem elektrickým proudem.',
    hook:
      'Proč někdy jistič vypne až po připojení více spotřebičů, ale při zkratu může vypnout téměř okamžitě?',
    explanation:
      '**Nadproud** je proud větší, než pro jaký je vedení nebo zařízení za daných podmínek určeno. Může vzniknout například přetížením nebo zkratem. Příliš velký proud může vodiče nebezpečně zahřívat. Dlouhodobé nebo velmi silné zahřívání může poškodit izolaci a způsobit požár — konkrétní bezpečné hodnoty z této lekce neurčíš a neplatí, že každý nadproud automaticky způsobí požár.\n\n**Přetížení** nastane, když obvod zůstává jinak elektricky zapojen obvyklým způsobem, ale odebírá větší proud, než pro jaký je navržen. Příčinou může být například příliš mnoho nebo příliš výkonných spotřebičů na jednom obvodu. Přetížení může trvat určitou dobu a způsobovat zahřívání. Nejde o přímé spojení vodičů s rozdílným potenciálem. Příklad: na jeden nevhodně zatížený přívod je připojeno více výkonných spotřebičů a celkový proud překročí dovolenou hodnotu.\n\n**Zkrat** je nechtěné vodivé spojení mezi místy s rozdílným elektrickým potenciálem. Vznikne cesta s velmi malým odporem, takže při stejném napětí může protékat velmi velký proud. Proud není doslova nekonečný — omezují ho zdroj, vodiče a další impedance obvodu. Zkrat může způsobit velmi rychlé zahřívání, poškození nebo elektrický oblouk; běžný spotřebič může být zkratovou cestou z velké části obejit. Jednoduše: při zkratu vznikne nežádoucí cesta s velmi malým odporem, proto může proud prudce vzrůst. Odpor při zkratu není vždy přesně nula.\n\n**Rozdíl:** při přetížení je obvod zapojen obvyklým způsobem, ale odběr je příliš velký a zahřívání se může rozvíjet postupně. Při zkratu vznikne nechtěná cesta s velmi malým odporem, proud může vzrůst velmi rychle a ochrana musí obvod bezpečně odpojit. Přetížení nemusí být vždy pomalé a zkrat nemusí být vždy okamžitě odpojený — záleží na podmínkách.\n\n**Pojistka** obsahuje tavný prvek. Při příliš velkém proudu se zahřeje a přeruší obvod. Po vybavení se nenahrazuje drátem, nepřemosťuje a neopravuje doma — nahrazuje se pouze správným typem a hodnotou podle dokumentace nebo rozhodnutí kvalifikované osoby.\n\n**Jistič** při nadproudu automaticky rozpojí obvod. Může reagovat na přetížení i zkrat. Po bezpečném odstranění příčiny může být znovu zapnut. Opakované zapínání bez zjištění příčiny je nebezpečné — samotné zapnutí není oprava. Jistič nechrání před každým úrazem elektrickým proudem a po zkratu se nesmí vždy ihned znovu zapnout.\n\n**Hranice ochrany:** pojistka a jistič chrání především vedení a zařízení před následky nadproudu. Samy o sobě nezajišťují ochranu před každým nebezpečným dotykem nebo každým úrazem elektrickým proudem. Jiné prvky (například proudový chránič) mají další úlohy — jejich podrobná funkce není součástí této lekce. Žádné ochranné zařízení neslibuje absolutní bezpečnost.',
    safetyNote:
      'Zkrat ani přetížení se nesmějí záměrně vytvářet. Vodiče se nespojují „na zkoušku“. Pojistka se nikdy nenahrazuje drátem a ochranné prvky se nepřemosťují. Opakovaně vybavující jistič se bez odstranění příčiny znovu nezapíná. Poškozené kabely a spotřebiče se nepoužívají. Na síťovém zařízení pracuje pouze oprávněná nebo kvalifikovaná osoba podle příslušných pravidel. Žák závadu oznámí učiteli nebo odpovědné osobě.',
    memorySentence:
      'Přetížení je příliš velký odběr; zkrat vytváří nechtěnou cestu s velmi malým odporem. Jistič nebo pojistka při nadproudu obvod odpojí.',
    typicalMistake:
      'Žáci si myslí, že přetížení a zkrat jsou totéž. Při přetížení obvod odebírá příliš velký proud v jinak obvyklém zapojení; při zkratu vznikne nechtěná cesta s velmi malým odporem. Druhá chyba: jistič vypnul, takže stačí znovu zapnout a závada je opravena. Vybavení je varování — před opětovným provozem je nutné zjistit a bezpečně odstranit příčinu. Třetí chyba: jistič chrání člověka před každým úrazem. Jistič chrání především vedení a zařízení před nadproudem; ochrana osob vyžaduje více správně navržených opatření.',
    teacherTip:
      'Bezpečná demonstrace bez napětí: kartičky „běžný provoz“, „přetížení“, „zkrat“ a „nebezpečný postup“ — žáci přiřazují popis situace ke kategorii a vysvětlí rozdíl. Nebo model: úzký průchod = omezená proudová zatížitelnost, příliš mnoho figurek = přetížení, zvláštní nežádoucí spojka = zkratová cesta. Výslovně uveď, že jde pouze o model, nikoli doslovný pohyb proudu. Nepoužívej živý obvod, síťové napětí, zahřívání vodiče, tavné pojistky v provozu, skutečný zkrat ani přetěžování prodlužovacího kabelu.',
    activity: {
      scenarioChoice: {
        type: 'scenario-choice',
        instruction:
          'U každé situace rozhodni, o jaký stav jde. Všechny čtyři musí být správně.',
        options: [
          { id: 'bezny', label: 'Běžný provoz' },
          { id: 'pretizeni', label: 'Přetížení' },
          { id: 'zkrat', label: 'Zkrat' },
          { id: 'nebezpecny', label: 'Nebezpečný postup' },
        ],
        successMessage:
          'Výborně! Umíš rozpoznat běžný provoz, přetížení, zkrat i nebezpečný postup.',
        scenarios: [
          {
            id: 's1',
            text: 'K jednomu správně navrženému obvodu je připojen spotřebič, pro který je obvod určen. Vedení se neobvykle nezahřívá a ochranný prvek nevybavuje.',
            correctOptionId: 'bezny',
            explanation:
              'Jde o běžný provoz v rámci určeného zatížení. To ale neznamená absolutní záruku bezpečnosti celé instalace.',
          },
          {
            id: 's2',
            text: 'K jednomu přívodu je současně připojeno více výkonných spotřebičů a celkový odběr překročí hodnotu, pro kterou je obvod určen.',
            correctOptionId: 'pretizeni',
            explanation:
              'Obvod je jinak zapojen obvyklým způsobem, ale odebírá příliš velký proud — to je přetížení, ne zkrat.',
          },
          {
            id: 's3',
            text: 'Po poškození izolace vznikne nechtěné vodivé spojení mezi vodiči s rozdílným potenciálem a proud prudce vzroste.',
            correctOptionId: 'zkrat',
            explanation:
              'Nechtěné spojení rozdílných potenciálů vytvoří cestu s velmi malým odporem — to je zkrat.',
          },
          {
            id: 's4',
            text: 'Jistič opakovaně vypíná a někdo jej bez zjištění příčiny stále znovu zapíná.',
            correctOptionId: 'nebezpecny',
            explanation:
              'Opakované zapínání bez odstranění příčiny je nebezpečný postup, nikoli oprava závady.',
          },
        ],
      },
    },
    quiz: [
      {
        id: 'q1',
        text: 'Proč může při zkratu protékat velmi velký proud?',
        options: [
          { id: 'a', text: 'Protože vznikne nechtěná cesta s velmi malým odporem.' },
          { id: 'b', text: 'Protože zkrat zvětší odpor obvodu na maximum.' },
          { id: 'c', text: 'Protože proud vzniká i bez zdroje napětí.' },
          { id: 'd', text: 'Protože se v místě zkratu začnou vyrábět elektrony.' },
        ],
        correctOptionId: 'a',
        explanation:
          'Při zkratu vznikne cesta s velmi malým odporem, proto může proud prudce vzrůst. Proud není doslova nekonečný — jeho velikost omezují vlastnosti zdroje, vodičů a obvodu.',
      },
      {
        id: 'q2',
        text: 'Jaký je hlavní úkol jističe nebo pojistky?',
        options: [
          { id: 'a', text: 'Přerušit obvod při nebezpečném nadproudu a chránit vedení a zařízení.' },
          { id: 'b', text: 'Zaručit ochranu před každým úrazem elektrickým proudem.' },
          { id: 'c', text: 'Zvýšit výkon připojeného spotřebiče při provozu.' },
          { id: 'd', text: 'Samy odstranit příčinu závady v instalaci.' },
        ],
        correctOptionId: 'a',
        explanation:
          'Pojistka a jistič chrání především vedení a zařízení před následky nadproudu. Neodstraní příčinu a samy nezajišťují ochranu před každým úrazem.',
      },
      {
        id: 'q3',
        text: 'Které tvrzení správně rozlišuje přetížení a zkrat?',
        options: [
          { id: 'a', text: 'Přetížení je příliš velký odběr v obvyklém zapojení; zkrat vytváří nechtěnou cestu s velmi malým odporem.' },
          { id: 'b', text: 'Přetížení i zkrat jsou totéž — vždy jen větší počet spotřebičů.' },
          { id: 'c', text: 'Zkrat znamená, že obvod odebírá málo proudu při vysokém odporu.' },
          { id: 'd', text: 'Přetížení vzniká jen tehdy, když jsou vodiče přímo zkratované.' },
        ],
        correctOptionId: 'a',
        explanation:
          'Přetížení = příliš velký odběr v jinak obvyklém zapojení. Zkrat = nechtěná cesta s velmi malým odporem mezi rozdílnými potenciály.',
      },
    ],
    activityXp: 20,
    quizXp: 15,
    badgeId: 'strazce-obvodu',
    mvpAvailable: true,
  },
  {
    id: 'zakladni-znacky',
    subjectId: 'zaklady',
    topicId: 'el-kresleni',
    title: 'Základní elektrotechnické značky',
    year: 1,
    durationMinutes: 8,
    difficulty: 'základní',
    goal: 'Žák pozná základní značky zdroje, vypínače, rezistoru, spotřebiče a vodiče ve schématu.',
    hook: 'Schéma v učebnici vypadá jako hieroglyfy — ale pět základních značek už po téhle lekci přečteš.',
    explanation:
      'Elektrické schéma používá jednotné značky. **Zdroj** dodává energii. **Vypínač** ovládá obvod. **Rezistor** omezuje proud. **Spotřebič** (žárovka) přemění energii. **Vodič** spojuje prvky. Každá značka má svůj tvar — naučíš se je rozpoznat.',
    safetyNote: SAFETY_NOTE,
    memorySentence: 'Schéma čteš po značkách — každý prvek má svůj symbol.',
    typicalMistake:
      'Žáci zaměňují značku zdroje a spotřebiče — zdroj dodává energii, spotřebič ji spotřebovává.',
    teacherTip:
      'Krátká opakovací aktivita na začátek hodiny elektrotechnického kreslení. Párování značek jde hrát i společně — třída radí, jeden kliká.',
    interactiveDemo: {
      type: 'symbols-demo',
      title: 'Poznej značky ve schématu',
      description:
        'Klikni na každou značku a zobraz její název — tak se učíš číst schéma.',
    },
    activity: {
      symbolMatching: {
        type: 'symbol-matching',
        instruction:
          'Klikni na značku vlevo a pak na správný název prvku vpravo. Spáruj všech pět značek.',
        symbols: [
          { id: 'sym-zdroj', symbol: '┤├', ariaLabel: 'Značka zdroje' },
          { id: 'sym-vypinac', symbol: '─○─', ariaLabel: 'Značka vypínače' },
          { id: 'sym-rezistor', symbol: '╱╲', ariaLabel: 'Značka rezistoru' },
          { id: 'sym-zarovka', symbol: 'ⓧ', ariaLabel: 'Značka žárovky' },
          { id: 'sym-vodic', symbol: '───', ariaLabel: 'Značka vodiče' },
        ],
        names: [
          { id: 'name-zdroj', label: 'Zdroj' },
          { id: 'name-vypinac', label: 'Vypínač' },
          { id: 'name-rezistor', label: 'Rezistor' },
          { id: 'name-spotrebic', label: 'Žárovka / spotřebič' },
          { id: 'name-vodic', label: 'Vodič' },
        ],
        correctPairs: {
          'sym-zdroj': 'name-zdroj',
          'sym-vypinac': 'name-vypinac',
          'sym-rezistor': 'name-rezistor',
          'sym-zarovka': 'name-spotrebic',
          'sym-vodic': 'name-vodic',
        },
      },
    },
    quiz: [
      {
        id: 'q1',
        text: 'Která značka představuje zdroj napětí?',
        options: [
          { id: 'a', text: 'Symbol baterie / zdroje (┤├)' },
          { id: 'b', text: 'Přerušovaná čára vypínače' },
          { id: 'c', text: 'Křivka rezistoru' },
          { id: 'd', text: 'Kolečko žárovky' },
        ],
        correctOptionId: 'a',
        explanation: 'Zdroj má typicky symbol baterie nebo kruhu se značkami + a −.',
      },
      {
        id: 'q2',
        text: 'Značka vypínače ve schématu…',
        options: [
          { id: 'a', text: 'Umožňuje zapnout nebo vypnout obvod.' },
          { id: 'b', text: 'Měří proud v obvodu.' },
          { id: 'c', text: 'Zvyšuje napětí.' },
          { id: 'd', text: 'Nahrazuje rezistor.' },
        ],
        correctOptionId: 'a',
        explanation: 'Vypínač přerušuje nebo uzavírá obvod — ovládací prvek.',
      },
      {
        id: 'q3',
        text: 'Vodič ve schématu se znázorňuje…',
        options: [
          { id: 'a', text: 'Spojnicí (čarou) mezi prvky.' },
          { id: 'b', text: 'Kroužkem se křížkem.' },
          { id: 'c', text: 'Cikcak čárou rezistoru.' },
          { id: 'd', text: 'Šipkou dolů.' },
        ],
        correctOptionId: 'a',
        explanation: 'Vodič je spojnice — spojuje prvky v obvodu.',
      },
    ],
    activityXp: 15,
    quizXp: 15,
    badgeId: 'ctenar-znaciek',
    mvpAvailable: true,
  },
  ...mereniLessons,
  ...rozvodyLessons,
  ...elektronikaLessons,
  ...automatizaceLessons,
  ...strojeLessons,
];

export function getLessonById(id: string): MicroLesson | undefined {
  return lessons.find((l) => l.id === id);
}

export function getLessonsByTopic(topicId: string): MicroLesson[] {
  return lessons.filter((l) => l.topicId === topicId);
}

export function getMvpLessonsBySubject(subjectId: string, year?: number): MicroLesson[] {
  return lessons.filter(
    (l) =>
      l.subjectId === subjectId &&
      l.mvpAvailable &&
      (year === undefined || l.year === year),
  );
}
