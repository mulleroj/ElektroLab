import type { MicroLesson } from '../types';

export const bezpecnostLessons: MicroLesson[] = [
  {
    id: 'pred-praci-zastav-a-oznam',
    subjectId: 'bezpecnost',
    topicId: 'bezpecne-chovani-v-dilne',
    title: 'Před prací: zastav se a oznam',
    year: 1,
    durationMinutes: 10,
    difficulty: 'základní',
    goal:
      'Žák rozpozná, kdy práci nemá zahájit, při pochybnosti zastaví a informuje učitele, nepodlehne spěchu a ví, že skutečnou instalaci sám neověřuje.',
    hook:
      'Spolužák říká: „Rychle to zapni, ať neztrácíme čas.“ Učitel zatím nedal jasný pokyn a stav pomůcky není potvrzený. Co uděláš dřív — zapneš, nebo se zastavíš?',
    explanation:
      '**Nejdřív pokyn:** V dílně zahajuješ práci jen podle jasného pokynu učitele a s určenou schválenou pomůckou. Bez pokynu nezačínej — ani „jen na chvíli“.\n\n**Spěch není důvod riskovat:** Tlak spolužáka, časový stres ani snaha „nezdržovat“ nemění bezpečnostní pravidla. Spěch není důvod pokračovat bez kontroly a bez pokynu.\n\n**Nejistota znamená stop:** Nevíš-li, zda je pomůcka v pořádku, zda je zapojení připravené, nebo co přesně máš dělat, práci nezahajuj. Nejistotu neřeš pokusem.\n\n**Role žáka a role učitele:** Tvým úkolem je bezpečně se rozhodnout: pokračovat podle pokynu, zastavit, pomůcku nepoužít, nebo odstoupit. Stav skutečné instalace ověřuje učitel nebo oprávněná osoba — ne žák sám.\n\n**Vypnuté není automaticky bezpečné:** Z lekce o měření už víš, že vypnutý vypínač nebo jistič sám o sobě nepotvrzuje odpojení ani nepřítomnost napětí. V této lekci to jen připomínáme: vizuální „vypnuto“ není důvod zařízení otevřít nebo si stav sám ověřovat.\n\n**Bez improvizace:** Nezkoušej neznámé zapojení, neotevírej zařízení a neprováděj vlastní kontrolu sítě. Improvizace není bezpečné řešení.\n\n**Kdy lze pokračovat:** Pokračovat můžeš jen s jasně určenou schválenou pomůckou, na připraveném pracovišti a podle výslovného pokynu učitele. Jinak zastav a informuj.',
    safetyNote:
      'Výuka probíhá pouze na schválených školních pomůckách a modelech a jen podle pokynu učitele. Žák nepracuje na síťové instalaci, neotevírá zařízení, zásuvku ani rozvaděč a neověřuje síť multimetrem ani zkoušečkou. Při nejasnosti zastaví a informuje učitele. Při bezprostředním nebezpečí odstoupí do bezpečí a nezasahuje hrdinsky. Lekce není návodem k práci pod napětím. Místní školní pravidla a pokyny učitele mají přednost.',
    memorySentence: 'Nejsem si jistý — zastavím a oznámím to.',
    typicalMistake:
      'Když spolužák říká, že je to v pořádku, můžu pokračovat — nemůžeš; chybí-li pokyn učitele, zastav. Když je zařízení vypnuté, můžu jej sám otevřít nebo zkontrolovat — vypnutí samo o sobě nestačí a stav ověřuje učitel nebo oprávněná osoba. Zastavení práce je ostuda nebo zdržování — naopak: zastavení při nejistotě je správné a profesionální rozhodnutí.',
    teacherTip:
      'Bezpečná výuka: papírové scénáře, kartičky pokračovat / zastavit / nepoužít / odstoupit, zcela bezpečný odpojený model a diskuse, proč je zastavení práce profesionální rozhodnutí. Nevytvářej skutečnou nebezpečnou situaci, nezapojuj do sítě, nepoškozuj pomůcky a neukazuj praskání, kouř ani poruchu jako demonstraci.',
    activity: {
      scenarioChoice: {
        type: 'scenario-choice',
        instruction:
          'U každé situace rozhodni, co je bezpečné rozhodnutí. Všechny čtyři situace musí být správně.',
        options: [
          { id: 'pokracovat', label: 'Pokračovat podle pokynu' },
          { id: 'zastavit', label: 'Zastavit a informovat učitele' },
          { id: 'nepouzit', label: 'Pomůcku nepoužít' },
          { id: 'odejit', label: 'Odejít do bezpečné vzdálenosti' },
        ],
        successMessage:
          'Výborně! Umíš rozhodnout, kdy pokračovat, kdy zastavit a kdy odstoupit.',
        scenarios: [
          {
            id: 's1',
            text: 'Učitel dal jasný pokyn. Pracuje se na schváleném bezpečném školním modelu a pracoviště je připravené.',
            correctOptionId: 'pokracovat',
            explanation:
              'S jasným pokynem, schválenou pomůckou a připraveným pracovištěm můžeš pokračovat podle pokynu.',
          },
          {
            id: 's2',
            text: 'Spolužák chce zapnout neznámé zapojení dříve, než jej učitel zkontroloval.',
            correctOptionId: 'zastavit',
            explanation:
              'Bez kontroly a bez pokynu učitele nepokračuj. Zastav a informuj učitele — tlak spolužáka pravidla nemění.',
          },
          {
            id: 's3',
            text: 'Připravená pomůcka má viditelně poškozený kryt nebo kabel.',
            correctOptionId: 'nepouzit',
            explanation:
              'Poškozenou pomůcku nepoužívej. Závadu oznam učiteli — nezkoušej ji „ještě jednou“.',
          },
          {
            id: 's4',
            text: 'U zařízení je slyšet praskání, je cítit zápach nebo je patrný jiný bezprostředně nebezpečný stav.',
            correctOptionId: 'odejit',
            explanation:
              'Odstup do bezpečné vzdálenosti, zařízení se nedotýkej a nevaruj ostatní tím, že se k němu přiblížíš. Informuj učitele z bezpečného místa.',
          },
        ],
      },
    },
    quiz: [
      {
        id: 'q1',
        text: 'Spolužák chce začít dřív, než učitel dal pokyn. Co je správné?',
        options: [
          {
            id: 'a',
            text: 'Pokračovat — spolužák říká, že je to v pořádku, a čas běží.',
          },
          {
            id: 'b',
            text: 'Zastavit a počkat na jasný pokyn učitele; bez něj práci nezahajovat.',
          },
          {
            id: 'c',
            text: 'Nejdřív sám proměřit síťovou instalaci a pak rozhodnout.',
          },
          {
            id: 'd',
            text: 'Otevřít zařízení a zkontrolovat, jestli je vypnuté.',
          },
        ],
        correctOptionId: 'b',
        explanation:
          'Bez jasného pokynu učitele práci nezahajuj. Tlak spolužáka ani spěch pravidla nemění.',
      },
      {
        id: 'q2',
        text: 'Stav pomůcky nebo zapojení není jasný. Co uděláš?',
        options: [
          { id: 'a', text: 'Zkusím, jestli to „nějak jde“.' },
          {
            id: 'b',
            text: 'Zastavím se a informuji učitele — nejistotu neřeším pokusem.',
          },
          {
            id: 'c',
            text: 'Zeptám se spolužáka a podle něj pokračuji.',
          },
          {
            id: 'd',
            text: 'Zařízení otevřu a stav si ověřím sám.',
          },
        ],
        correctOptionId: 'b',
        explanation:
          'Nejistota znamená stop. Stav ověřuje učitel nebo oprávněná osoba, ne žák pokusem.',
      },
      {
        id: 'q3',
        text: 'U zařízení slyšíš praskání nebo cítíš zápach. Co je bezpečný úsudek?',
        options: [
          {
            id: 'a',
            text: 'Přiblížit se a zjistit, odkud to jde.',
          },
          {
            id: 'b',
            text: 'Zkusit vypínač — třeba to pomůže.',
          },
          {
            id: 'c',
            text: 'Odstoupit do bezpečí, nedotýkat se a informovat učitele z bezpečného místa.',
          },
          {
            id: 'd',
            text: 'Zavolat spolužáky, ať se také podívají zblízka.',
          },
        ],
        correctOptionId: 'c',
        explanation:
          'Při bezprostředním nebezpečí odstup, nedotýkej se a informuj učitele z bezpečného místa. Není to požární ani zdravotnický návod — jen bezpečný odstup.',
      },
    ],
    activityXp: 20,
    quizXp: 15,
    badgeId: 'dilenska-rozvaha',
    mvpAvailable: true,
  },
  {
    id: 'poskozeny-pristroj-a-kabel',
    subjectId: 'bezpecnost',
    topicId: 'bezpecne-chovani-v-dilne',
    title: 'Poškozený přístroj a kabel',
    year: 1,
    durationMinutes: 10,
    difficulty: 'základní',
    goal:
      'Žák rozpozná běžné viditelné známky poškození, poškozenou pomůcku nepoužije, neimprovizuje opravu a závadu oznámí učiteli.',
    hook:
      'Kabel má prasklou izolaci a vidlice je uvolněná. Někdo navrhne: „Dej na to pásku a ještě to použijeme.“ Je to bezpečné řešení?',
    explanation:
      '**Viditelné poškození je důvod zastavit:** Jakmile vidíš poškození kabelu, vidlice nebo krytu, pomůcku nepoužívej. Nezkoušej, „jestli ještě funguje“.\n\n**Co můžeš rozpoznat pohledem:** Prasklá izolace, odkrytá nebo deformovaná část kabelu, poškozená či ohnutá vidlice, uvolněný kryt, stopy přehřátí nebo zápach. To stačí k rozhodnutí „nepoužít a oznámit“.\n\n**Páska není odborná oprava:** Izolační páska, provázek ani „rychlá úprava“ nejsou opravou. Improvizovaná oprava se neprovádí.\n\n**Poškozené zařízení se nepoužívá:** Ani když zařízení „ještě funguje“, poškození neignoruj. Funkčnost nepotvrzuje bezpečnost.\n\n**Závadu oznam:** Poškození ihned oznam učiteli. Nerozebírej zařízení a nezkoušej jej zapojit.\n\n**Odložení jen podle školního postupu:** Odložit nebo označit pomůcku smíš jen podle výslovného pokynu učitele a školních pravidel. S připojeným zařízením sám nemanipuluj.\n\n**Vizuální kontrola má hranice:** Pohled ti pomůže rozhodnout „použít / nepoužít a oznámit“. Neříká, že zařízení bez viditelného poškození je automaticky bezpečné. Odbornou kontrolu a opravu provádí určená osoba.',
    safetyNote:
      'Poškozené zařízení se nepoužívá a nezapojuje. Žák neprovádí provizorní opravu, zařízení nerozebírá a neověřuje síťovou pomůcku multimetrem ani zkoušečkou. S připojeným zařízením nemanipuluje. Závadu oznamuje učiteli. Odložení nebo označení provádí jen podle školního postupu. Odbornou kontrolu a opravu provádí určená osoba. Lekce není návodem k opravě ani k práci na síti.',
    memorySentence: 'Poškozené zařízení nepoužívám — oznámím závadu.',
    typicalMistake:
      'Páska kabel opraví — neopraví; je to improvizace. Když zařízení funguje, poškození nevadí — funkčnost nepotvrzuje bezpečnost. Stačí poškozené místo vyzkoušet — nezkoušej. Mohu zařízení sám rozebrat — nerozebírej; oznam učiteli.',
    teacherTip:
      'Bezpečná výuka: fotografie nebo kresby poškození, bezpečné makety, zcela odpojené vyřazené vzorky bez odkrytých nebezpečných částí a kartičky rozhodnutí. Nevytvářej skutečné poškození a nepoužívej živou instalaci.',
    activity: {
      scenarioChoice: {
        type: 'scenario-choice',
        instruction:
          'U každé situace rozhodni, co je bezpečné rozhodnutí. Všechny čtyři situace musí být správně.',
        options: [
          { id: 'pouzit', label: 'Použít podle pokynu' },
          { id: 'nepouzit', label: 'Nepoužít a oznámit' },
          { id: 'odlozit', label: 'Odložit podle pokynu učitele' },
          { id: 'odmitnout', label: 'Odmítnout improvizovanou opravu' },
        ],
        successMessage:
          'Výborně! Poškození poznáš a víš, že se neimprovizuje ani nezkouší.',
        scenarios: [
          {
            id: 's1',
            text: 'Schválená pomůcka je bez zjevného poškození a učitel dal pokyn k použití.',
            correctOptionId: 'pouzit',
            explanation:
              'Bez zjevného poškození a s jasným pokynem můžeš pomůcku použít podle pokynu učitele.',
          },
          {
            id: 's2',
            text: 'Kabel má prasklou izolaci nebo odkrytou poškozenou část.',
            correctOptionId: 'nepouzit',
            explanation:
              'Poškozený kabel se nepoužívá. Pomůcku nepoužívej a závadu oznam učiteli.',
          },
          {
            id: 's3',
            text: 'Učitel již odpojil poškozenou pomůcku a určil označené místo, kam ji bezpečně uložit.',
            correctOptionId: 'odlozit',
            explanation:
              'Odložení probíhá jen podle pokynu učitele. Sám nepřipojuješ ani neodpojuješ zařízení bez pokynu.',
          },
          {
            id: 's4',
            text: 'Spolužák navrhne zakrýt poškození páskou a zařízení ještě použít.',
            correctOptionId: 'odmitnout',
            explanation:
              'Páska není odborná oprava. Improvizaci odmítni a závadu oznam učiteli.',
          },
        ],
      },
    },
    quiz: [
      {
        id: 'q1',
        text: 'Kabel má prasklou izolaci. Co je správné?',
        options: [
          { id: 'a', text: 'Ještě jednou vyzkoušet, jestli to funguje.' },
          {
            id: 'b',
            text: 'Pomůcku nepoužít a poškození oznámit učiteli.',
          },
          {
            id: 'c',
            text: 'Zakrýt místo páskou a pokračovat.',
          },
          {
            id: 'd',
            text: 'Kabel sám sestříhat a znovu spojit.',
          },
        ],
        correctOptionId: 'b',
        explanation:
          'Prasklá izolace je důvod pomůcku nepoužít a oznámit závadu. Nezkoušej ji ani neopravuj.',
      },
      {
        id: 'q2',
        text: 'Spolužák chce zakrýt poškození páskou. Co platí?',
        options: [
          {
            id: 'a',
            text: 'Páska je běžná odborná oprava kabelu.',
          },
          {
            id: 'b',
            text: 'Páska není odborná oprava — improvizaci odmítni a oznam závadu.',
          },
          {
            id: 'c',
            text: 'Stačí pásku použít jen „na chvíli“.',
          },
          {
            id: 'd',
            text: 'Nejdřív zařízení rozeber a poškození přelep zevnitř.',
          },
        ],
        correctOptionId: 'b',
        explanation:
          'Izolační páska není odborná oprava. Improvizaci odmítni a informuj učitele.',
      },
      {
        id: 'q3',
        text: 'Pomůcka ještě funguje, ale má poškozený kryt. Co uděláš?',
        options: [
          {
            id: 'a',
            text: 'Použiji ji — když funguje, je bezpečná.',
          },
          {
            id: 'b',
            text: 'Nepoužiji ji a poškození oznámím; funkčnost nepotvrzuje bezpečnost.',
          },
          {
            id: 'c',
            text: 'Kryt připevním provizorně a pokračuji.',
          },
          {
            id: 'd',
            text: 'Proměřím ji žákovským multimetrem na síti.',
          },
        ],
        correctOptionId: 'b',
        explanation:
          'Funkčnost nepotvrzuje bezpečnost. Poškozenou pomůcku nepoužívej a oznam závadu.',
      },
    ],
    activityXp: 20,
    quizXp: 15,
    badgeId: 'lovec-poskozeni',
    mvpAvailable: true,
  },
  {
    id: 'mokro-neporadek-improvizace',
    subjectId: 'bezpecnost',
    topicId: 'bezpecne-chovani-v-dilne',
    title: 'Mokro, nepořádek a improvizace',
    year: 1,
    durationMinutes: 10,
    difficulty: 'základní',
    goal:
      'Žák rozpozná mokro a nepořádek jako důvod práci nezahájit nebo přerušit, odmítne improvizaci a řídí se pokyny učitele a školními pravidly.',
    hook:
      'Máš mokré ruce, vedle pomůcky je rozlitá tekutina a někdo chce „jen na chvíli“ použít neověřenou redukci. Co je bezpečné rozhodnutí?',
    explanation:
      '**Mokro znamená stop:** Mokré ruce a práce s elektrickou pomůckou nejdou dohromady. Práci nezahajuj a nepokračuj.\n\n**Nedotýkej se a nemanipuluj:** Je-li tekutina poblíž elektrické pomůcky a stav není jasný, nepřibližuj se, zařízení neodpojuj ani nepřesouvej. Odstup a informuj učitele.\n\n**Pořádek chrání lidi i pomůcky:** Nepořádek, volné kabely a překážky zvyšují riziko úrazu a poškození. Pracoviště se připravuje podle pokynů učitele.\n\n**Kabel nepatří do nebezpečné cesty:** Kabel přes průchod může způsobit zakopnutí, zachycení nebo poškození. Takové uspořádání oznam — sám ho „nevyřeš“ nebezpečným zásahem.\n\n**Provizorní řešení není bezpečné řešení:** Neautorizované prodlužování, neověřené redukce nebo „spojení jen na chvíli“ se nepoužívají.\n\n**Pracuj jen podle pravidel školy:** Konkrétní uspořádání pracoviště, pomůcek a postupů určuje učitel a školní provozní řád. Obecný text aplikace je nenahrazuje.\n\n**Při nejasnosti oznam:** Nejsi-li si jistý, zastav a informuj učitele. Neimprovizuj a neřeš situaci sám.',
    safetyNote:
      'Mokré ruce a elektrická práce nejdou dohromady. Při tekutině poblíž zařízení žák nemanipuluje, odstoupí do bezpečí a informuje učitele. Kabely a pomůcky uspořádává jen podle pokynů. Žádné improvizované spojení ani adaptér, žádná práce na síti a žádné přepínání ochranných prvků žákem jako „řešení“. Místní školní pravidla mají přednost. Žádný hrdinský zásah.',
    memorySentence:
      'Mokro, nepořádek nebo improvizace znamenají: zastavit a oznámit.',
    typicalMistake:
      'Je to jen trochu mokré — i tak platí stop. Kabel přes průchod nevadí — vadí; oznam. Provizorní spojení na chvíli je v pořádku — není. Stačí pracovat opatrně — opatrnost nenahrazuje bezpečné rozhodnutí zastavit a oznámit.',
    teacherTip:
      'Bezpečná výuka: obrázkové a papírové scénáře, kartičky bezpečného rozhodnutí, suchý bezpečný model a plán pracoviště na papíře. Nepoužívej skutečnou tekutinu u elektrické pomůcky, nevytvářej překážky jako experiment, neukazuj nebezpečné provizorní spojení a nepracuj na živé síťové instalaci.',
    activity: {
      scenarioChoice: {
        type: 'scenario-choice',
        instruction:
          'U každé situace rozhodni, co je bezpečné rozhodnutí. Všechny čtyři situace musí být správně.',
        options: [
          { id: 'pokracovat', label: 'Pokračovat podle pokynu' },
          { id: 'zastavit', label: 'Zastavit a informovat učitele' },
          { id: 'neimprovizovat', label: 'Nepoužít improvizované řešení' },
          { id: 'odstoupit', label: 'Odstoupit do bezpečí' },
        ],
        successMessage:
          'Výborně! Mokro, nepořádek i improvizaci řešíš zastavením a oznámením — ne zásahem.',
        scenarios: [
          {
            id: 's1',
            text: 'Pracoviště je suché a uklizené, pomůcka je schválená a učitel dal jasný pokyn.',
            correctOptionId: 'pokracovat',
            explanation:
              'Za těchto podmínek můžeš pokračovat podle pokynu učitele.',
          },
          {
            id: 's2',
            text: 'Rozlitá tekutina je poblíž elektrické pomůcky a není jasný stav zařízení.',
            correctOptionId: 'odstoupit',
            explanation:
              'Odstup do bezpečí a informuj učitele. Netři tekutinu, neodpojuj zařízení, nepřepínej jistič a zařízení nepřesouvej.',
          },
          {
            id: 's3',
            text: 'Kabel vede přes průchod a hrozí zakopnutí nebo poškození.',
            correctOptionId: 'zastavit',
            explanation:
              'Zastav a informuj učitele. Uspořádání pracoviště se řeší podle pokynů — ne improvizací.',
          },
          {
            id: 's4',
            text: 'Někdo navrhne neověřenou redukci nebo provizorní spojení „jen na chvíli“.',
            correctOptionId: 'neimprovizovat',
            explanation:
              'Improvizované řešení nepoužívej. Provizorní spojení není bezpečné řešení.',
          },
        ],
      },
    },
    quiz: [
      {
        id: 'q1',
        text: 'Poblíž elektrické pomůcky je rozlitá tekutina. Co je správné?',
        options: [
          {
            id: 'a',
            text: 'Tekutinu rychle utřít a pokračovat v práci.',
          },
          {
            id: 'b',
            text: 'Zařízení odpojit a přesunout na suché místo.',
          },
          {
            id: 'c',
            text: 'Odstoupit do bezpečí, nemanipulovat a informovat učitele.',
          },
          {
            id: 'd',
            text: 'Přepnout jistič a tím situaci vyřešit.',
          },
        ],
        correctOptionId: 'c',
        explanation:
          'Při nejasném stavu s tekutinou odstup a informuj učitele. Neutírej, neodpojuj ani nepřepínej ochranné prvky.',
      },
      {
        id: 'q2',
        text: 'Kabel vede přes průchod. Co uděláš?',
        options: [
          {
            id: 'a',
            text: 'Překročím jej opatrně a pokračuji.',
          },
          {
            id: 'b',
            text: 'Zastavím se a informuji učitele — hrozí zakopnutí nebo poškození.',
          },
          {
            id: 'c',
            text: 'Kabel sám přetáhnu přes stůl bez pokynu.',
          },
          {
            id: 'd',
            text: 'Kabel přelepím páskou k podlaze.',
          },
        ],
        correctOptionId: 'b',
        explanation:
          'Kabel v průchodu je důvod zastavit a oznámit. Sám neimprovizuj přesun ani připevnění.',
      },
      {
        id: 'q3',
        text: 'Někdo navrhne neověřenou redukci „jen na chvíli“. Co platí?',
        options: [
          {
            id: 'a',
            text: 'Na chvíli to nevadí, když budeme opatrní.',
          },
          {
            id: 'b',
            text: 'Improvizované řešení nepoužít — provizorní spojení není bezpečné.',
          },
          {
            id: 'c',
            text: 'Redukci nejdřív vyzkoušet na krátký okamžik.',
          },
          {
            id: 'd',
            text: 'Stačí se zeptat spolužáka, jestli to už někdy použil.',
          },
        ],
        correctOptionId: 'b',
        explanation:
          'Neověřená redukce ani „spojení na chvíli“ se nepoužívají. Improvizaci odmítni.',
      },
    ],
    activityXp: 20,
    quizXp: 15,
    badgeId: 'strazce-poradku',
    mvpAvailable: true,
  },
];
