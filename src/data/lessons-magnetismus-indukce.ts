import type { MicroLesson } from '../types';

export const magnetismusIndukceLessons: MicroLesson[] = [
  {
    id: 'magneticke-pole-vodice-a-civky',
    subjectId: 'zaklady',
    topicId: 'magneticke-pole',
    title: 'Magnetické pole vodiče a cívky',
    year: 1,
    durationMinutes: 10,
    difficulty: 'základní',
    goal:
      'Žák ví, že elektrický proud vytváří magnetické pole v prostoru kolem vodiče, rozliší proud a pole, chápe úlohu cívky a jádra a rozliší stálé a proměnné magnetické pole.',
    hook:
      'Vodič nevypadá jako magnet. Jakmile jím ale teče proud, kompas v jeho blízkosti může změnit směr. Kde se magnetický účinek vzal?',
    explanation:
      '**Proud vytváří magnetické pole:** Když vodičem teče elektrický proud, v okolním prostoru vzniká magnetické pole. Nemusí jít o permanentní magnet — stačí proud.\n\n' +
      '**Pole v okolí vodiče:** Magnetické pole existuje v okolí vodiče a může existovat také uvnitř jeho materiálu. V této lekci sledujeme hlavně jeho účinek v okolním prostoru. Není to látka, která by vodičem protékala.\n\n' +
      '**Směr proudu a orientace pole:** Když se změní směr proudu, změní se i orientace magnetického pole kolem vodiče.\n\n' +
      '**Cívka soustřeďuje účinek závitů:** Když vodič navineme do cívky, magnetické účinky jednotlivých závitů se sčítají a soustřeďují. Cívka s proudem vytváří společné magnetické pole podobné poli tyčového magnetu.\n\n' +
      '**Úloha jádra:** Feromagnetické jádro (například železné) může magnetický účinek cívky výrazně zesílit. Jádro ale není zdrojem energie — zesiluje účinek proudu, který cívkou prochází. V jednoduchém modelu a za jinak stejných podmínek může větší proud nebo více závitů zesílit magnetický účinek.\n\n' +
      '**Stálý a proměnný proud:** Stálý proud po ustálení vytváří přibližně stálé magnetické pole. Střídavý proud, jehož směr se mění, vytváří proměnné magnetické pole. Z lekce o střídavém proudu víš, že se jeho směr mění. Tím se mění také orientace magnetického pole kolem vodiče nebo cívky.\n\n' +
      '**Pole není proud ani látka:** Magnetické pole není totéž co elektrický proud. Není to proudící látka ve vodiči. Po odpojení proudu běžná cívka sama není trvalým zdrojem vlastního elektromagnetického pole.',
    safetyNote:
      'Výuka probíhá pouze pomocí schémat, simulace nebo schváleného nízkonapěťového školního modelu. Žák nevyrábí ani nepřipojuje síťový elektromagnet, nepřipojuje cívku k zásuvce a nevyrábí síťovou cívku. Odkryté síťové svorky se nepoužívají. Cívka se může při nevhodném nebo dlouhém napájení zahřívat — při zahřívání, zápachu nebo nejasném stavu se pokus zastaví a oznámí učiteli. Žák zapojení sám nemění bez pokynu učitele. Silné magnety se používají pouze podle pravidel školy a mimo citlivou elektroniku.',
    memorySentence:
      'Proud vytváří magnetické pole; cívka jeho účinek soustřeďuje a jádro jej může zesílit.',
    typicalMistake:
      'Magnetické pole vzniká pouze u permanentního magnetu — ne; vzniká i kolem vodiče s proudem. Magnetické pole „teče" vodičem jako proud — neteče; pole existuje v prostoru kolem vodiče. Cívka vytváří elektromagnetické pole i bez proudu — běžná nenapájená cívka vlastní elektromagnetické pole nevytváří. Jádro vyrábí energii — nevyrábí; zesiluje magnetický účinek proudu. Magnetické pole a elektrický proud jsou totéž — nejsou; pole je důsledek proudu, ale jde o odlišný jev.',
    teacherTip:
      'Použij papírové šipky proudu a pole. Kompas pouze u připraveného školního nízkonapěťového modelu s proudově omezeným zdrojem. Kartičky proud / pole / cívka / jádro k přiřazování. Krátké pozorování připraveného modelu — hlídej zahřívání cívky. Nepoužívej síť, nedovol samostatné žákovské přepojování, dlouhé napájení cívky ani improvizované vinutí připojené k síti. Odkryté svorky se nepoužívají.',
    activity: {
      scenarioChoice: {
        type: 'scenario-choice',
        instruction:
          'U každé situace vyber správné tvrzení. Všechny čtyři musí být správně.',
        options: [
          { id: 'vytvari', label: 'Proud vytváří magnetické pole' },
          { id: 'obrati', label: 'Obrácení proudu obrátí orientaci pole' },
          { id: 'bez-proudu', label: 'Bez proudu cívka vlastní elektromagnetické pole nevytváří' },
          { id: 'neni-latka', label: 'Pole není proudící látka' },
        ],
        successMessage:
          'Výborně! Víš, že proud vytváří pole, cívka ho soustřeďuje — a že pole není proud ani proudící látka.',
        scenarios: [
          {
            id: 's1',
            text: 'Vodičem teče proud a zkoumáme prostor v jeho okolí.',
            correctOptionId: 'vytvari',
            explanation:
              'Elektrický proud ve vodiči vytváří magnetické pole v okolním prostoru.',
          },
          {
            id: 's2',
            text: 'Směr proudu v téže cívce se obrátí.',
            correctOptionId: 'obrati',
            explanation:
              'Změna směru proudu změní orientaci magnetického pole kolem cívky.',
          },
          {
            id: 's3',
            text: 'Běžná cívka není připojena ke zdroji a někdo tvrdí, že sama stále vytváří silné elektromagnetické pole.',
            correctOptionId: 'bez-proudu',
            explanation:
              'Běžná nenapájená cívka vlastní elektromagnetické pole nevytváří. Permanentní magnety existují, ale běžná cívka bez proudu není trvalým zdrojem elektromagnetického pole.',
          },
          {
            id: 's4',
            text: 'Někdo říká, že magnetické pole teče vodičem stejně jako elektrický proud.',
            correctOptionId: 'neni-latka',
            explanation:
              'Magnetické pole není proudící látka ve vodiči. Pole existuje v prostoru kolem vodiče — neteče jím.',
          },
        ],
      },
    },
    quiz: [
      {
        id: 'q1',
        text: 'Co vzniká v prostoru kolem vodiče, kterým teče proud?',
        options: [
          { id: 'a', text: 'V okolním prostoru vzniká magnetické pole.' },
          { id: 'b', text: 'Kolem vodiče se hromadí volné elektrony.' },
          { id: 'c', text: 'Z vodiče uniká elektrický proud do okolí.' },
          { id: 'd', text: 'V prostoru kolem vodiče nevzniká žádný měřitelný jev.' },
        ],
        correctOptionId: 'a',
        explanation:
          'Elektrický proud ve vodiči vytváří v okolním prostoru magnetické pole. Proud z vodiče neuniká a elektrony se v okolí nehromadí.',
      },
      {
        id: 'q2',
        text: 'Co kvalitativně dělá cívka se společným magnetickým účinkem závitů?',
        options: [
          { id: 'a', text: 'Magnetické účinky závitů se sčítají a cívka je soustřeďuje.' },
          { id: 'b', text: 'Cívka zeslabuje magnetické pole každého závitu na minimum.' },
          { id: 'c', text: 'Cívka mění magnetické pole na elektrický proud ve svém jádru.' },
          { id: 'd', text: 'Závity cívky navzájem ruší magnetický účinek, takže pole mizí.' },
        ],
        correctOptionId: 'a',
        explanation:
          'Závity cívky vytvářejí společný magnetický účinek — sčítají se a soustřeďují pole podobné poli tyčového magnetu.',
      },
      {
        id: 'q3',
        text: 'Co se stane s orientací magnetického pole, když se v cívce obrátí směr proudu?',
        options: [
          { id: 'a', text: 'Orientace pole se obrátí, protože pole závisí na směru proudu.' },
          { id: 'b', text: 'Orientace pole se nezmění — pole závisí pouze na počtu závitů.' },
          { id: 'c', text: 'Pole úplně zmizí, dokud se proud znovu neustálí.' },
          { id: 'd', text: 'Směr proudu nemá na magnetické pole v okolí cívky žádný vliv.' },
        ],
        correctOptionId: 'a',
        explanation:
          'Orientace magnetického pole závisí na směru proudu. Obrácení proudu obrátí orientaci pole.',
      },
    ],
    activityXp: 20,
    quizXp: 15,
    badgeId: 'znalec-pole',
    mvpAvailable: true,
  },
  {
    id: 'jak-vznika-indukovane-napeti',
    subjectId: 'zaklady',
    topicId: 'indukce',
    title: 'Jak vzniká indukované napětí',
    year: 1,
    durationMinutes: 10,
    difficulty: 'základní',
    goal:
      'Žák chápe, že indukované napětí vzniká při změně magnetického působení na cívku, rozliší napětí a proud, popíše transformátorový řetězec a odmítne představu přeskakování proudu mezi vinutími.',
    hook:
      'Magnet leží vedle cívky a nic se nemění. Jakmile se magnet nebo magnetické působení vůči cívce začne měnit, může se na cívce objevit napětí. Proč je důležitá změna?',
    explanation:
      '**Změna je rozhodující:** Indukované napětí vzniká při změně magnetického působení na vodič nebo cívku. Není nutný fyzický dotyk magnetu s cívkou.\n\n' +
      '**Samotná přítomnost nestačí:** Stálý magnet nehybně ležící u nehybné cívky žádné nové indukované napětí nevytváří. Rozhodující je změna, ne pouhá přítomnost pole.\n\n' +
      '**Dva způsoby změny:** Změnu magnetického působení lze vytvořit pohybem magnetu vůči cívce, nebo změnou proudu v jiné cívce. Proměnný proud vytváří proměnné magnetické pole.\n\n' +
      '**Indukované napětí:** Změna magnetického působení na cívku může vyvolat napětí na jejích svorkách — indukované napětí.\n\n' +
      '**Napětí a proud nejsou totéž:** Indukované napětí může existovat i při otevřeném obvodu — cívka není připojena k žádné zátěži. Proud začne téct až tehdy, když existuje uzavřená vodivá cesta.\n\n' +
      '**Řetězec transformátoru:** Proměnný proud v primárním vinutí vytváří proměnné magnetické pole. Proměnné pole působí na sekundární vinutí. V sekundárním vinutí se indukuje napětí. Právě změna magnetického působení na druhou cívku může vyvolat indukované napětí.\n\n' +
      '**Proud nepřeskakuje a energie nevzniká z ničeho:** Elektrický proud nepřeskakuje přímo mezi primárním a sekundárním vinutím — vinutí spojuje magnetické pole, ne vodič. Transformátor nevyrábí energii; mění napětí. Ustálené stejnosměrné napětí není běžným transformačním pracovním režimem. Spínané a přechodové děje jsou mimo tento základní model.',
    safetyNote:
      'Žák nepřipojuje transformátor k síti, neměří síťový transformátor a neotevírá zdroj ani transformátor. Nechráněné primární ani sekundární svorky se nepoužívají. Žádné pokusy s 230 V a žádné vybíjení kondenzátorů. Žák nepřipojuje osciloskop ani multimetr k síti. Výuka probíhá pouze pomocí simulace, schématu, připravených dat nebo schváleného nízkonapěťového školního modelu. Sekundární strana není automaticky bezpečná jen proto, že je „sekundární". Místní školní pravidla mají přednost.',
    memorySentence:
      'Indukované napětí vzniká při změně magnetického působení na cívku; stálý stav nestačí.',
    typicalMistake:
      'Přítomnost magnetu sama trvale indukuje napětí — ne; rozhodující je změna. Indukce vyžaduje dotyk magnetu s cívkou — nevyžaduje; změna působení stačí i na vzdálenost. Napětí a proud vzniknou vždy současně — nemusí; napětí může existovat i při otevřeném obvodu, proud teče až při uzavřené cestě. Proud přeskakuje mezi vinutími transformátoru — nepřeskakuje; vinutí spojuje magnetické pole. Transformátor vytváří energii — nevytváří; mění napětí. Ustálené DC běžně transformuje stejně jako AC — netransformuje; běžný transformátor potřebuje proměnný průběh.',
    teacherTip:
      'Kartičkový řetězec: primár → proměnný proud → proměnné pole → sekundár → indukované napětí. Papírové scénáře „stálé / mění se" pomáhají rozlišit přítomnost a změnu. Případně učitelem připravený nízkonapěťový pokus s magnetem a cívkou — krátké pozorování bez samostatného žákovského přepojování. Nepoužívej síť ani odkryté síťové transformátory. Silné magnety drž podle školních pravidel mimo citlivou elektroniku. Mechanický pohyb prováděj kontrolovaně. Cívku nepřetěžuj.',
    activity: {
      measurementJudgment: {
        type: 'measurement-judgment',
        instruction:
          'U každého tvrzení rozhodni, zda platí, nebo neplatí. Všech pět musí být správně.',
        correctLabel: 'Tvrzení platí',
        wrongLabel: 'Tvrzení neplatí',
        successMessage:
          'Výborně! Víš, že rozhoduje změna — ne pouhá přítomnost pole — a že proud mezi vinutími nepřeskakuje.',
        scenarios: [
          {
            id: 's1',
            text: 'Změna magnetického působení na cívku může vyvolat indukované napětí.',
            correct: 'correct',
            explanation:
              'Ano. Právě změna magnetického působení je rozhodující pro vznik indukovaného napětí.',
          },
          {
            id: 's2',
            text: 'Nehybný magnet vedle nehybné cívky stále vytváří nové indukované napětí.',
            correct: 'wrong',
            explanation:
              'Neplatí. Stálé, neměnné magnetické působení žádné nové indukované napětí nevytváří — rozhodující je změna.',
          },
          {
            id: 's3',
            text: 'Proměnný proud v primárním vinutí může vytvořit proměnné pole a indukovat napětí v sekundárním vinutí.',
            correct: 'correct',
            explanation:
              'Ano. Proměnný proud vytváří proměnné magnetické pole a to může indukovat napětí v sekundárním vinutí.',
          },
          {
            id: 's4',
            text: 'Elektrický proud přeskakuje přímo z primárního vinutí do sekundárního.',
            correct: 'wrong',
            explanation:
              'Neplatí. Vinutí nejsou vodivě spojena — energii přenáší proměnné magnetické pole, ne přímý elektrický kontakt.',
          },
          {
            id: 's5',
            text: 'V otevřeném sekundárním obvodu může být indukované napětí, ale proud zátěží neteče.',
            correct: 'correct',
            explanation:
              'Ano. Napětí může existovat i bez uzavřeného obvodu. Proud začne téct až v uzavřené vodivé cestě.',
          },
        ],
      },
    },
    quiz: [
      {
        id: 'q1',
        text: 'Co je rozhodující pro vznik indukovaného napětí v cívce?',
        options: [
          { id: 'a', text: 'Změna magnetického působení na cívku — ne pouhá přítomnost pole.' },
          { id: 'b', text: 'Stálá přítomnost silného magnetu v blízkosti cívky bez jakékoli změny.' },
          { id: 'c', text: 'Fyzický dotyk magnetu s vinutím cívky při dostatečném tlaku.' },
          { id: 'd', text: 'Vysoký elektrický odpor vodiče, ze kterého je cívka navinuta.' },
        ],
        correctOptionId: 'a',
        explanation:
          'Rozhodující je změna magnetického působení. Stálá přítomnost pole, fyzický dotyk ani odpor vodiče samy o sobě indukované napětí nevytvářejí.',
      },
      {
        id: 'q2',
        text: 'Co platí pro otevřený sekundární obvod transformátoru?',
        options: [
          { id: 'a', text: 'Může existovat indukované napětí, ale proud zátěží neteče.' },
          { id: 'b', text: 'Proud teče sekundárem bez ohledu na to, zda je obvod uzavřen.' },
          { id: 'c', text: 'Transformátor nemůže vytvořit žádné napětí na otevřeném sekundáru.' },
          { id: 'd', text: 'Otevřený sekundár znamená, že se v primáru zastaví proud.' },
        ],
        correctOptionId: 'a',
        explanation:
          'Indukované napětí může existovat i v otevřeném obvodu. Proud začne téct až po uzavření vodivé cesty.',
      },
      {
        id: 'q3',
        text: 'Jak správně popsat přenos energie v transformátoru?',
        options: [
          { id: 'a', text: 'Proměnný proud v primáru vytváří proměnné pole, které indukuje napětí v sekundáru.' },
          { id: 'b', text: 'Elektrický proud přeskakuje přímo z primárního vinutí do sekundárního vodivým spojením.' },
          { id: 'c', text: 'Transformátor vytváří novou energii z magnetického jádra a předává ji na sekundární stranu.' },
          { id: 'd', text: 'Ustálené stejnosměrné napětí je běžný pracovní režim síťového transformátoru.' },
        ],
        correctOptionId: 'a',
        explanation:
          'Energii přenáší proměnné magnetické pole — proud nepřeskakuje, transformátor energii nevyrábí a ustálené DC není běžný transformační režim.',
      },
    ],
    activityXp: 20,
    quizXp: 15,
    badgeId: 'objevitel-indukce',
    mvpAvailable: true,
  },
];
