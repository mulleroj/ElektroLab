import type { MicroLesson } from '../types';

export const stridavyProudLessons: MicroLesson[] = [
  {
    id: 'stejnosmerny-a-stridavy-proud',
    subjectId: 'zaklady',
    topicId: 'stridavy-proud',
    title: 'Stejnosměrný a střídavý proud',
    year: 1,
    durationMinutes: 10,
    difficulty: 'základní',
    goal:
      'Žák rozliší stejnosměrný a střídavý průběh podle polarity a směru, odmítne miskoncepci „blikání = AC“ a kvalitativně ví, proč běžný transformátor potřebuje proměnný průběh.',
    hook:
      'Baterie dává stejnosměrný průběh. Elektrická síť používá střídavý. Běžný transformátor potřebuje, aby se elektrický stav měnil — ne aby se jen zapínal a vypínal. Jak poznáš rozdíl?',
    explanation:
      '**Směr a polarita:** Polarita říká, která strana zdroje je „kladná“ a která „záporná“. Směr proudu říká, kterou cestou obvodem proud teče. Oba pojmy spolu souvisejí, ale nejsou totéž.\n\n**Stejnosměrný průběh:** U stejnosměrného napětí se polarita neobrací. U stejnosměrného proudu se směr neobrací. To je hlavní poznávací znak DC.\n\n**Velikost se může měnit:** Stejnosměrný průběh nemusí mít stále stejnou velikost. Napětí nebo proud mohou stoupat či klesat — dokud se neobrátí polarita ani směr, jde stále o stejnosměrný průběh.\n\n**Střídavý průběh:** Střídavé napětí mění polaritu. Střídavý proud mění směr. V základním modelu se tato změna pravidelně opakuje. Proud neteče současně oběma směry — směr se střídá postupně.\n\n**Zapínání není totéž co střídání:** Pouhé zapnutí a vypnutí bez obrácení polarity samo o sobě není střídavý průběh. Blikání světla ani pravidelné spínání ještě neprokazují AC.\n\n**Graf je model v čase:** Čára grafu ukazuje hodnotu veličiny v čase. Není to dráha elektronů ani tvar vodiče. Sinusovka je model průběhu, ne fyzická cesta proudu.\n\n**Proč je změna důležitá pro transformátor:** Běžný transformátor potřebuje proměnný elektrický a magnetický stav. Ustálené stejnosměrné napětí není jeho běžným transformačním pracovním režimem. Přesný vznik magnetického pole a indukovaného napětí vysvětlíme později — zde stačí kvalitativní připomenutí.',
    safetyNote:
      'Výuka probíhá pouze pomocí grafů, schémat, kartiček nebo bezpečného schváleného modelu. Žák neměří střídavé napětí v zásuvce, nepřipojuje transformátor k síti a nepoužívá osciloskop ani multimetr na síťové instalaci. Neotevírá zdroj ani transformátor. Nulová okamžitá hodnota na grafu neznamená, že je skutečný obvod bezpečný. Platí již naučené rozlišení vypnuté, odpojené a ověřeně bez napětí. Skutečnou síťovou instalaci řeší oprávněná osoba.',
    memorySentence:
      'U stejnosměrného průběhu se směr ani polarita neobrací; u střídavého se mění.',
    typicalMistake:
      'Stejnosměrný proud musí mít vždy stejnou velikost — nemusí; rozhoduje neměněný směr nebo polarita. Střídavý proud teče současně oběma směry — neteče; směr se střídá postupně. Každé blikání nebo zapínání je střídavý proud — není; bez obrácení polarity to AC neprokazuje. Sinusovka je fyzická dráha proudu — není; graf ukazuje hodnotu v čase.',
    teacherTip:
      'Použij papírové kartičky s polaritou, šipky směru proudu a nakreslené časové průběhy. Porovnej baterii a grafický model střídavého zdroje. Bezpečný nízkonapěťový model jen podle pravidel školy. Neměř zásuvku, nepřipojuj skutečný transformátor k síti, nepoužívej žákovský osciloskop na síti, neotvírej zdroje a neukazuj živé nechráněné svorky.',
    activity: {
      scenarioChoice: {
        type: 'scenario-choice',
        instruction:
          'U každé situace rozhodni, o jaký průběh jde — nebo že to z popisu nelze určit, případně že se síť prakticky neověřuje. Všechny čtyři situace musí být správně.',
        options: [
          { id: 'dc', label: 'Stejnosměrný průběh' },
          { id: 'ac', label: 'Střídavý průběh' },
          { id: 'nevim', label: 'Z popisu to nelze určit' },
          { id: 'stop', label: 'Zastavit — síť prakticky neověřovat' },
        ],
        successMessage:
          'Výborně! Umíš rozlišit DC a AC a víš, že blikání ani zásuvka nejsou důkaz ani návod.',
        scenarios: [
          {
            id: 's1',
            text: 'Napětí může měnit velikost, ale jeho polarita se nikdy neobrátí.',
            correctOptionId: 'dc',
            explanation:
              'Jde o stejnosměrný průběh. DC nemusí mít stále stejnou velikost — rozhodující je, že se polarita neobrací.',
          },
          {
            id: 's2',
            text: 'Polarita napětí se pravidelně obrací a směr proudu se mění.',
            correctOptionId: 'ac',
            explanation:
              'Jde o střídavý průběh: polarita a směr se postupně střídají, ne současně oběma směry.',
          },
          {
            id: 's3',
            text: 'Zařízení pravidelně bliká, ale není uvedeno nic o polaritě napětí ani směru proudu.',
            correctOptionId: 'nevim',
            explanation:
              'Z popisu to nelze určit. Blikání nebo zapínání samo neprokazuje střídavý průběh.',
          },
          {
            id: 's4',
            text: 'Žák navrhne ověřit střídavý průběh měřením přímo v zásuvce.',
            correctOptionId: 'stop',
            explanation:
              'Zastav — síť prakticky neověřovat. Žák neměří zásuvku ani nepřipojuje osciloskop či multimetr k síti. Používej grafy, data nebo schválený bezpečný model podle učitele.',
          },
        ],
      },
    },
    quiz: [
      {
        id: 'q1',
        text: 'Co nejlépe vystihuje stejnosměrný průběh?',
        options: [
          {
            id: 'a',
            text: 'Velikost musí být vždy dokonale stálá a nikdy se nesmí měnit.',
          },
          {
            id: 'b',
            text: 'Směr nebo polarita se neobrací; velikost se přitom může měnit.',
          },
          {
            id: 'c',
            text: 'Proud teče současně oběma směry.',
          },
          {
            id: 'd',
            text: 'Zařízení pravidelně bliká, takže jde určitě o DC.',
          },
        ],
        correctOptionId: 'b',
        explanation:
          'DC poznáš podle neměněného směru nebo polarity. Velikost může stoupat či klesat.',
      },
      {
        id: 'q2',
        text: 'Co platí o střídavém průběhu?',
        options: [
          {
            id: 'a',
            text: 'Polarita a směr se postupně mění; proud neteče současně oběma směry.',
          },
          {
            id: 'b',
            text: 'Proud teče současně oběma směry naráz.',
          },
          {
            id: 'c',
            text: 'Každé zapnutí a vypnutí bez obrácení polarity je AC.',
          },
          {
            id: 'd',
            text: 'Sinusovka je dráha, po které elektrony fyzicky běží.',
          },
        ],
        correctOptionId: 'a',
        explanation:
          'U AC se polarita a směr střídají postupně. Graf je model hodnoty v čase, ne fyzická cesta.',
      },
      {
        id: 'q3',
        text: 'Která věta o běžném transformátoru a bezpečnosti je správná?',
        options: [
          {
            id: 'a',
            text: 'Běžný transformátor potřebuje proměnný průběh; žák to ověří připojením k zásuvce.',
          },
          {
            id: 'b',
            text: 'Běžný transformátor potřebuje proměnný průběh; žák to neověřuje připojením k síti.',
          },
          {
            id: 'c',
            text: 'Ustálené stejnosměrné napětí je běžný pracovní režim transformátoru.',
          },
          {
            id: 'd',
            text: 'Stačí zapínat a vypínat stejnosměrný zdroj — to už je střídání pro trafo.',
          },
        ],
        correctOptionId: 'b',
        explanation:
          'Běžný transformátor potřebuje proměnný průběh. Žák síť neměří ani k ní nic nepřipojuje — používá grafy a bezpečný model.',
      },
    ],
    activityXp: 20,
    quizXp: 15,
    badgeId: 'rozlisovac-proudu',
    mvpAvailable: true,
  },
  {
    id: 'perioda-a-frekvence',
    subjectId: 'zaklady',
    topicId: 'stridavy-proud',
    title: 'Perioda a frekvence',
    year: 1,
    durationMinutes: 10,
    difficulty: 'základní',
    goal:
      'Žák pozná periodu a frekvenci, zná jednotky s a Hz, použije f = 1/T v jednoduchém příkladu a nezamění frekvenci s napětím ani nulový průchod s bezpečným stavem.',
    hook:
      'Jeden průběh se za sekundu zopakuje dvakrát, druhý pětkrát. Který má vyšší frekvenci — a co vlastně jednotka hertz říká?',
    explanation:
      '**Jedno úplné opakování:** U pravidelného průběhu sledujeme jeden úplný cyklus — od začátku vzoru až po stejný začátek znovu.\n\n**Perioda T:** Perioda je doba jednoho úplného opakování průběhu. Značí se T a její základní jednotkou je sekunda.\n\n**Frekvence f:** Frekvence je počet úplných period za sekundu. Značí se f.\n\n**Sekunda a hertz:** Jednotkou frekvence je hertz (Hz). 1 Hz znamená jednu úplnou periodu za sekundu. Volt patří napětí — hertz frekvenci.\n\n**Vztah periody a frekvence:** Platí f = 1 / T a T = 1 / f. Čím kratší je perioda, tím vyšší je frekvence. Čím delší perioda, tím nižší frekvence. Vyšší frekvence automaticky neznamená vyšší napětí.\n\n**Padesát hertzů:** Údaj 50 Hz znamená 50 úplných period za sekundu. Perioda je T = 1/50 s = 0,02 s = 20 ms. Nejde o 50 voltů a nejde jednoduše o „50 změn směru“ — během jedné periody proběhne celý kladný i záporný děj základního střídavého průběhu.\n\n**Graf není pokyn k měření sítě:** Graf a výpočet slouží k pochopení. Nulový průchod grafu není bezpečný okamžik pro zásah. Frekvenci ani napětí v zásuvce žák neměří.',
    safetyNote:
      'Grafy a výpočty nejsou návodem k měření sítě. Žák neměří frekvenci ani napětí v zásuvce a nepřipojuje osciloskop, multimetr ani jiný přístroj k síti. Nulový průchod střídavého průběhu neznamená bezpečný okamžik pro dotyk nebo zásah. Skutečný stav instalace nelze určit pouze z předpokládaného průběhu. Výuka probíhá na papírových datech, simulaci nebo schváleném bezpečném modelu. Síťové měření provádí oprávněná osoba vhodným postupem.',
    memorySentence:
      'Frekvence je počet period za sekundu; kratší perioda znamená vyšší frekvenci.',
    typicalMistake:
      'Hertz je jednotka napětí — není; volt patří napětí, hertz frekvenci. Vyšší frekvence automaticky znamená vyšší napětí — neznamená. Perioda je počet cyklů za sekundu — není; perioda je čas jednoho cyklu. Když graf právě prochází nulou, skutečný obvod je bezpečný — není; nulový bod grafu to nepotvrzuje.',
    teacherTip:
      'Kresli několik úplných period na časovou osu a nech žáky počítat celé cykly v jedné sekundě. Použij kartičky T, f, s, Hz a jednoduché příklady 1 Hz, 2 Hz, 5 Hz, 50 Hz. Neelektrický rytmus nebo metronom může pomoci jako analogie opakování. Pouze připravené grafy nebo bezpečná simulace — žádné měření frekvence zásuvky, žádný osciloskop na síti, žádné živé nechráněné zapojení a žádné zkoušení nulového průchodu v reálném obvodu.',
    activity: {
      measurementJudgment: {
        type: 'measurement-judgment',
        instruction:
          'U každého tvrzení rozhodni, zda platí, nebo neplatí. Všechna tvrzení musí být správně posouzena.',
        correctLabel: 'Tvrzení platí',
        wrongLabel: 'Tvrzení neplatí',
        successMessage:
          'Výborně! Periodu a frekvenci už nerozhodíš s napětím ani s „bezpečnou nulou“.',
        scenarios: [
          {
            id: 's1',
            text: 'Perioda je doba jednoho úplného opakování průběhu.',
            correct: 'correct',
            explanation:
              'Ano. Perioda T je čas jednoho úplného cyklu.',
          },
          {
            id: 's2',
            text: 'Průběh, který se za jednu sekundu zopakuje pětkrát, má frekvenci 5 Hz.',
            correct: 'correct',
            explanation:
              'Ano. Pět úplných period za sekundu znamená f = 5 Hz.',
          },
          {
            id: 's3',
            text: 'Čím kratší je perioda, tím nižší je frekvence.',
            correct: 'wrong',
            explanation:
              'Neplatí. Čím kratší perioda, tím vyšší frekvence — protože f = 1 / T.',
          },
          {
            id: 's4',
            text: 'Údaj 50 Hz říká, že napětí má 50 V.',
            correct: 'wrong',
            explanation:
              'Neplatí. 50 Hz znamená 50 úplných period za sekundu, ne 50 voltů.',
          },
          {
            id: 's5',
            text: 'Nulový průchod grafu je bezpečný okamžik, kdy se žák může dotknout skutečného obvodu.',
            correct: 'wrong',
            explanation:
              'Neplatí. Nulový bod grafu není potvrzením bezpečného stavu skutečného obvodu.',
          },
        ],
      },
    },
    quiz: [
      {
        id: 'q1',
        text: 'Co je perioda?',
        options: [
          { id: 'a', text: 'Počet cyklů za sekundu.' },
          { id: 'b', text: 'Doba jednoho úplného opakování průběhu.' },
          { id: 'c', text: 'Velikost napětí ve voltech.' },
          { id: 'd', text: 'Okamžik, kdy je obvod vždy bezpečný.' },
        ],
        correctOptionId: 'b',
        explanation:
          'Perioda T je doba jednoho úplného cyklu. Počet cyklů za sekundu je frekvence.',
      },
      {
        id: 'q2',
        text: 'Za dvě sekundy proběhnou čtyři celé periody. Jaká je frekvence?',
        options: [
          { id: 'a', text: '4 Hz' },
          { id: 'b', text: '2 Hz' },
          { id: 'c', text: '8 Hz' },
          { id: 'd', text: '0,5 Hz' },
        ],
        correctOptionId: 'b',
        explanation:
          'Čtyři periody za dvě sekundy znamenají dvě periody za sekundu, tedy f = 2 Hz.',
      },
      {
        id: 'q3',
        text: 'Která věta je správná?',
        options: [
          {
            id: 'a',
            text: '50 Hz znamená, že napětí má 50 V.',
          },
          {
            id: 'b',
            text: 'Když graf prochází nulou, žák se může bezpečně dotknout sítě.',
          },
          {
            id: 'c',
            text: '50 Hz znamená 50 úplných period za sekundu; síť žákovsky neměříme.',
          },
          {
            id: 'd',
            text: 'Vyšší frekvence vždy znamená vyšší napětí.',
          },
        ],
        correctOptionId: 'c',
        explanation:
          'Hertz není volt. Nulový průchod není bezpečnostní potvrzení. Frekvenci v zásuvce žák neměří.',
      },
    ],
    activityXp: 20,
    quizXp: 15,
    badgeId: 'ctenar-prubehu',
    mvpAvailable: true,
  },
];
