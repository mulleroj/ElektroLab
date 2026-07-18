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
          { id: 'vodic-med', label: 'Vodič — vede proud velmi dobře' },
          { id: 'vodic-hlinik', label: 'Vodič — lehčí kov, také vede' },
          { id: 'izolant-pvc', label: 'Izolant — plast za běžných podmínek' },
          { id: 'izolant-keramika', label: 'Izolant — keramika za běžných podmínek' },
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
