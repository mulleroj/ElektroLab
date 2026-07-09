# ElektroLab — návrh interaktivní mikro-learningové aplikace pro obor elektrikář

---

## 1. Název a stručná vize aplikace

**Tři návrhy názvů:**

1. **ElektroLab** — evokuje dílnu/laboratoř, kde se něco DĚLÁ, ne čte. Krátké, dobře skloňovatelné, srozumitelné žákům i učitelům.
2. **Fáze** — odborný dvojsmysl (fáze proudu × fáze učení). Chytlavé, ale méně samovysvětlující.
3. **Jistič** — úderné, oborové, ale hůř se z něj staví značka („jdi do Jističe“ zní divně).

**Doporučení: ElektroLab.**

**Vize (výtah pro úvod README):**
> Bezpečná dílna v mobilu. Žák si v krátkých úkolech „sáhne“ na obvody, měření, rozvody a stroje — skládá, přiřazuje, hledá chyby, měří v simulaci a rozhoduje se ve scénářích z praxe — dřív, než na to sáhne v reálné dílně pod dohledem učitele. Aplikace není učebnice s testem na konci; je to série 5–10minutových mikroúkolů s okamžitou zpětnou vazbou, body, odznaky a boss levely.

---

## 2. Hlavní informační architektura

```
ElektroLab
 ├─ 8 hlavních dlaždic (předměty + 2 speciální)
 │   └─ Předmět
 │       └─ Filtr ročníku (1 / 2 / 3 / vše)
 │           └─ Téma (kapitola osnovy)
 │               ├─ Mikrolekce (atomická jednotka, 5–10 min)
 │               │   ├─ Háček z praxe + krátké vysvětlení
 │               │   ├─ Interaktivní aktivita (jádro lekce)
 │               │   ├─ Typická chyba
 │               │   ├─ Bezpečnostní poznámka
 │               │   └─ Mini test (2–3 otázky)
 │               ├─ Chyby z praxe (kartičky k tématu)
 │               ├─ Mini test tématu (5–8 otázek)
 │               └─ Boss level (odemkne se po dokončení mikrolekcí)
 ├─ Speciální režimy (napříč předměty)
 │   ├─ Denní výzva (1 náhodná aktivita denně, série 🔥)
 │   ├─ Režim opakování (mix hotových lekcí, rozložené opakování)
 │   ├─ Příprava na závěrečnou zkoušku (vlastní dlaždice)
 │   ├─ Učitelský režim (spuštění 1 aktivity na projektor, bez pokroku)
 │   └─ SPU/ADHD režim (globální přepínač zjednodušení)
 └─ Profil (XP, úroveň, odznaky, série — vše lokálně)
```

**Mapování dlaždic na ročníky (podle dodaných osnov):**

| Dlaždice | Ročníky |
|---|---|
| Základy elektrotechniky | 1. |
| Elektrotechnická měření a pohony | 1., 2., 3. |
| Rozvodná zařízení | 2., 3. |
| Elektrické stroje a přístroje | 2. |
| Elektronika | 2., 3. |
| Automatická zařízení | 3. |
| Bezpečnost a chyby z praxe | průřezově 1.–3. |
| Příprava na závěrečnou zkoušku | primárně 3. (přístupná všem) |

**Klíčová zásada:** 1 mikrolekce = 1 dovednost. Když se nevejde do 10 minut, rozdělit na dvě.

---

## 3. Návrh hlavní obrazovky

**Layout (mobil, vertikální scroll; na desktopu 4 sloupce dlaždic):**

1. **Horní pruh:** avatar + úroveň (např. „Učeň 3“), XP progress bar do další úrovně, série „🔥 7 dní“.
2. **Karta Denní výzva:** velké tlačítko *„Dnešní výzva — 5 minut“* + náhled typu aktivity („Dnes: najdi chybu ve schématu“).
3. **Mřížka 8 dlaždic** (2 sloupce na mobilu), každá: ikona, název, podtitulek, kruhový ukazatel % dokončení.
4. **Spodní lišta:** Domů · Opakování · Zkouška · Profil.

**Texty na dlaždicích (žákovský jazyk):**

| Dlaždice | Titulek | Podtitulek |
|---|---|---|
| ⚡ Základy | **Základy elektro** | „Proud, napětí, odpor. Tady to všechno začíná.“ |
| 📏 Měření a pohony | **Měřím a poháním** | „Ampérmetr, voltmetr a motory v pohybu.“ |
| 🏠 Rozvody | **Rozvody** | „Od zásuvky až po rozvodnu.“ |
| ⚙️ Stroje | **Stroje a přístroje** | „Trafa, motory, jističe, stykače.“ |
| 🔺 Elektronika | **Elektronika** | „Diody, tranzistory, zesilovače.“ |
| 🤖 Automatizace | **Automatizace** | „Snímače, regulace, logika.“ |
| 🛡️ Bezpečnost | **Bezpečnost a chyby** | „Co nikdy neudělat — a proč.“ |
| 🎓 Zkouška | **Na závěrečnou** | „Trénink na zkoušku bez stresu.“ |

**Pravidla:**
- Dlaždice **Bezpečnost** má trvale odlišnou barvu (výstražná žlutá/červená) a je vždy odemčená.
- Po prvním spuštění krátký onboarding (3 obrazovky): vyber ročník → ukázka jedné aktivity → vysvětlení XP a série.
- Volba ročníku jen přednastaví filtry, nic nezamyká — slabší žák 3. ročníku se může vracet k učivu 1. ročníku bez stigmatu.

---

## 4. Návrh stránky předmětu

Po otevření předmětu (příklad: **Rozvodná zařízení**):

1. **Hlavička:** ikona, název, 2 věty „Co se tu naučíš“ a celkový progress předmětu.
2. **Filtr ročníku:** chipy `2. ročník | 3. ročník | Vše` (zobrazují se jen ročníky, které předmět podle osnovy má). Výchozí = ročník žáka z onboardingu.
3. **Postupová cesta:** témata jako stanice na svislé „lince“ (metro mapa). Stavy: ✔ hotovo · ● aktuální (zvýrazněné, pulzuje) · ○ dostupné · 🔒 doporučeno později (ale lze odemknout — zámek je jen doporučení, tlačítko „Přesto otevřít“).
4. **Karta tématu:** název, počet mikrolekcí (např. „6 lekcí · ~40 min“), progress baterie 🔋, ikona odznaku za boss level.
5. **Přepínač „Volný režim“:** vypne doporučené pořadí — pro učitele a opakování.

**Doporučené pořadí — příklad Rozvodná zařízení:**
- *2. ročník:* 1. Rozvody a slaboproudé sítě → 2. Silnoproudý rozvod v bytech → 3. Silnoproudý rozvod v průmyslu.
- *3. ročník:* 1. Základní pravidla a znalosti → 2. BOZP a požární prevence → 3. Zdroje světla → 4. Hromosvody → 5. Přepětí v síti → 6. Zemní spojení → 7. Kompenzace jalového výkonu → 8. Rozvodná soustava vn/vvn → 9. Rozvodny, transformovny, měnírny → 10. Elektrárny → 11. Výpočty příkladů (průběžně vkládané i mezi témata).
- Didaktická logika: nejdřív to, čeho se žák dotkne v praxi (byt, dílna), pak systémová témata (síť, elektrárny).

---

## 5. Návrh stránky tématu

Struktura (příklad: **Transformátory**):

1. **Úvodní karta:** „Proč to potřebuješ“ (1–2 věty, praktický háček: *„Bez trafa by ti nabíječka mobilu shořela. Zjisti, jak mění napětí.“*) + odhad času celého tématu.
2. **Seznam mikrolekcí** (5–10): každá řádka = název + ikona typu aktivity (🧩 skládání, 🔍 hledání chyby, 🎯 scénář, 📏 simulace měření…) + hvězdičky obtížnosti + stav.
3. **Blok „Chyby z praxe“:** 3–5 varovných kartiček (flip karta: rub = proč je to špatně). Např. *„Připojil trafo naprázdno obráceně a divil se napětí na výstupu.“*
4. **Mini test tématu:** 5–8 otázek namíchaných ze všech mikrolekcí; odemyká se po dokončení ≥ 70 % lekcí.
5. **Boss level:** velká karta dole, zamčená do splnění mini testu. Po zvládnutí: odznak tématu + XP bonus + konfety.

Progres tématu vizualizovat jako **nabíjení baterie** — tematicky sedí a je čitelný na první pohled.

---

## 6. Univerzální šablona mikrolekce

```
NÁZEV:              akční, chytlavý (např. „Který jistič vypne dřív?“)
PŘEDMĚT:            jedna z 8 dlaždic
ROČNÍK:             1 / 2 / 3
TÉMA:               kapitola osnovy
ČAS:                5–10 min
OBTÍŽNOST:          ★ / ★★ / ★★★

CÍL LEKCE:          1 věta, sloveso dovednosti („Rozlišíš zapojení hvězda a trojúhelník podle schématu.“)
HÁČEK Z PRAXE:      1–2 věty, reálná situace, proč to žáka zajímá
KRÁTKÉ VYSVĚTLENÍ:  max 4–6 vět + 1 schéma/obrázek; klíčové pojmy tučně; žádná encyklopedie
INTERAKTIVNÍ AKTIVITA: 1 hlavní úkol z katalogu (kap. 7) — žák něco DĚLÁ
TYPICKÁ CHYBA:      co žáci nejčastěji spletou + jak to poznat
BEZPEČNOSTNÍ POZNÁMKA: školně formulovaná (viz pravidla v kap. 10); povinná u témat s rizikem
MINI TEST:          2–3 otázky s okamžitou zpětnou vazbou a vysvětlením u špatné odpovědi
VĚTA K ZAPAMATOVÁNÍ: 1 úderné pravidlo („Proud měřím V ŘADĚ, napětí VEDLE.“)
ODMĚNA:             XP (10–30 podle obtížnosti) + příspěvek k odznakům a sérii
```

**Pravidla šablony:**
- Vysvětlení nikdy před aktivitou delší než 1 obrazovka mobilu.
- Mini test recykluje obsah aktivity (transfer, ne memorování).
- Věta k zapamatování se zobrazí i při opakování v Denní výzvě.

---

## 7. Typy interaktivních aktivit (katalog)

| # | Typ aktivity | Popis interakce | Hodí se pro |
|---|---|---|---|
| 1 | **Přetahování prvků** (drag&drop do slotů) | žák umísťuje prvky na správná místa ve schématu/rozvaděči | Rozvody, Stroje, Základy, Elektronika |
| 2 | **Poznávání značek** | schematická značka → vyber/napiš název; i obráceně | Základy (el. kreslení), Elektronika, Rozvody |
| 3 | **Hledání chyby ve schématu** | ve schématu je 1–3 chyby; žák na ně klepe | Rozvody, Základy, Elektronika, Stroje |
| 4 | **Rozhodovací scénář** | příběh z praxe, žák volí kroky, větvení, důsledky | Bezpečnost, Rozvody, Měření, Zkouška |
| 5 | **Simulace měření** | virtuální multimetr: volba veličiny, rozsahu, zapojení; přístroj „shoří“ jen v simulaci | Měření a pohony, Základy, Elektronika |
| 6 | **Skládání obvodu** | z palety součástek sestavit funkční obvod; simulace ukáže, zda svítí/točí se | Základy, Elektronika, Automatizace |
| 7 | **Pravdivostní tabulka** | doplň výstupy hradel AND/OR/NOT/NAND…; skládání logických funkcí | Automatická zařízení, Elektronika (3. r.) |
| 8 | **Párování pojmů** (pexeso/spojovačka) | pojem ↔ definice, značka ↔ součástka, veličina ↔ jednotka | všechny předměty, ideální pro 1. ročník |
| 9 | **Výběr správného postupu** (řazení kroků) | zamíchané kroky pracovního postupu → seřaď | Bezpečnost, Měření, Rozvody, Stroje |
| 10 | **Kalkulačkový trenažér** | krátké výpočty (Ohmův zákon, výkon, převody jednotek) se stupňovanou nápovědou | Základy, Rozvody (výpočty), Měření |
| 11 | **Odhad → ověření** | žák nejdřív tipne výsledek, pak ho simulace ukáže (buduje intuici) | Základy, Měření, Elektronika |
| 12 | **Časová osa / řetězec** | seřaď, co se stane po sobě (regulační pochod, rozběh motoru, vybavení jističe) | Automatizace, Stroje, Rozvody |
| 13 | **Boss level** | kombinace 3–5 typů výše do jednoho souvislého scénáře; omezený počet „životů“ ⚡ | závěr každého tématu |

Každý typ = jedna znovupoužitelná komponenta; obsah je čistě datový (JSON). Díky tomu 13 komponent obslouží stovky lekcí.

---

## 8. Gamifikační systém

- **XP body:** mikrolekce ★ = 10 XP, ★★ = 20, ★★★ = 30; mini test tématu = 25; boss level = 50–100; denní výzva = 15 + bonus za sérii. Opakování hotové lekce = 5 XP (viz níže).
- **Úrovně (oborové názvosloví):** 1 Vazač drátků → 2 Pomocník → 3 Učeň → 4 Zapojovač → 5 Mistr měření → 6 Rozvaděčový král → 7 Elektrikář → 8 Mistr → 9 Revizák → 10 Legenda dílny. Křivka: úroveň n vyžaduje `100 × n × 1,3^(n-1)` XP (rychlý start, pozvolné zpomalení).
- **Odznaky:** za témata („Krotitel trafa“, „Lovec chyb“, „Bleskosvod“ za hromosvody), za chování („7 dní v kuse“, „Bez nápovědy“, „Návrat — opakoval sis lekci po týdnu“), speciální bezpečnostní série („Strážce dílny I–III“).
- **Série (streak):** počítá se den, kdy žák splní aspoň denní výzvu NEBO 1 mikrolekci. 1× za týden „náhradní pojistka“ 🧯 — jeden zmeškaný den sérii nepřeruší (důležité pro slabší žáky, ať série nefrustruje).
- **Denní výzvy:** 1 aktivita denně, náhodně z už probraného učiva (nikdy z neodemčeného) — funguje tak zároveň jako rozložené opakování.
- **Boss levely:** na konci tématu; 3 „pojistky“ ⚡ jako životy; při vyčerpání se boss zamkne na 30 minut a nabídne 2 mikrolekce k zopakování (ne trest, ale příprava).
- **Lokální pokrok:** vše v zařízení (localStorage/IndexedDB), export/import pokroku jako soubor JSON (přenos mezi zařízeními bez účtů).
- **Odměny za opakování:** hotová lekce jde opakovat za 5 XP; po 7 dnech od dokončení se lekce označí „zrezivěla 🔧“ a opakování dá znovu plné XP — jednoduchá mechanika rozloženého opakování.
- **Režim pro učitele:** samostatný vstup z menu (bez hesla v MVP). Umožní: spustit libovolnou aktivitu na projektoru bez zásahu do pokroku, „rychlá aktivita do hodiny“ (filtr: předmět + ročník + 5 minut), zobrazit QR/odkaz na konkrétní lekci, vypnout časovače.

---

## 9. Přístupnost a SPU/ADHD režim

Globální přepínač **„Klidný režim“** (neoznačovat jako SPU/ADHD v UI — bez stigmatu) + jednotlivé volby samostatně:

- **Krátké bloky:** vysvětlení rozsekané na kroky „Dál →“ po 1–2 větách; nikdy stěna textu.
- **Jednoduchý jazyk:** věty do 12 slov, činný rod, jeden pojem = jedno slovo v celé aplikaci (ne střídat „jistič/nadproudová ochrana“ bez vysvětlení).
- **Vizuální opory:** každý pojem má ikonu/schéma; barevné kódování konzistentní napříč aplikací (fáze = hnědá/černá/šedá, N = modrá, PE = zelenožlutá — vždy stejně).
- **Audio výklad:** tlačítko 🔊 u každého vysvětlení (Web Speech API — syntéza, offline, bez nahrávek v MVP).
- **Zvýraznění pojmů:** klíčová slova tučně + po klepnutí mini-slovníček (1 věta + obrázek).
- **Méně rušivé prostředí:** Klidný režim vypne animace, konfety, časovače a zvuky; tlumená paleta; jeden úkol na obrazovce.
- **Opakování bez trestu:** špatná odpověď = okamžité vysvětlení + „Zkus znovu“; XP se nikdy neodečítají.
- **Okamžitá zpětná vazba:** každá interakce do 200 ms vizuálně potvrzena (zeleně/červeně + proč).
- **Technická přístupnost:** font min. 16 px, možnost zvětšení, kontrast WCAG AA, ovládání klávesnicí, u drag&drop vždy alternativa „klepni na prvek → klepni na slot“.

---

## 10. Bezpečnostní obsahová pravidla

Závazná pravidla pro KAŽDOU lekci (kontrolní seznam autora obsahu):

1. **Aplikace učí principy a simulaci, ne pracovní postupy na reálném zařízení.** Formulace typu „takto zapoj zásuvku doma“ jsou zakázané; správně: „takto vypadá zapojení ve schématu — v dílně jen pod dohledem učitele“.
2. **Každá lekce dotýkající se napětí, rozvodů, strojů nebo měření na síti má povinné pole `safetyNote`** — bez něj validace obsahu neprojde.
3. **Standardní věta** (varianty se generují, smysl stejný): *„Toto je simulace. Na skutečném zařízení pracuj jen ve škole, pod dohledem učitele, a nikdy pod napětím.“*
4. **Nikdy nepopisovat krok za krokem práci pod napětím** ani „jak si ověřit, že to nekopne“. Beznapěťový stav se zmiňuje jako zásada, ne jako návod k samostatné aplikaci.
5. **Ve scénářích je „zavolat dospělého/učitele/odborníka“ vždy plnohodnotná správná volba,** nikdy zesměšněná.
6. **Chyby z praxe ukazovat na následku pro zařízení a bezpečí, ne jako frajeřinu.** Žádný humor na účet úrazu.
7. **Simulace smí „shořet“ jen virtuálně** — a vždy s vysvětlením, co by se stalo doopravdy a proč se to nesmí zkoušet.
8. **Neodkazovat na konkrétní normy a hodnoty z norem,** pokud nebyly výslovně dodány učitelem — místo čísel norem psát „podle platných předpisů, které probíráte ve škole“.
9. **Domácí kontext jen pasivně:** poznávání (kde je jistič, co je proudový chránič) ano; zásahy (výměna, oprava) ne — vždy „elektrikář s oprávněním“.
10. **Boss levely s bezpečnostní tematikou nesmí odměňovat riskantní volbu** ani ji nabízet jako „rychlejší cestu k výhře“.

---

## 11. Rozpracování podle předmětů

### 11.1 Základy elektrotechniky

- **Popis pro žáka:** „Proud, napětí, odpor a magnetismus. Když pochopíš tohle, dává smysl všechno ostatní.“
- **Ročníky:** 1.
- **Témata:** Veličiny a jednotky · Stavba látek · Stejnosměrný proud · El. kreslení · Elektrostatika · Elektrochemie · Magnetické pole · Elektromagnetická indukce · Střídavý proud · Trojfázový proud.
- **Interaktivity:** párování veličina↔jednotka, poznávání značek, skládání obvodu, kalkulačkový trenažér (Ohmův zákon), odhad→ověření, hledání chyby ve schématu.
- **Gamifikace:** odznaky „Ohmův učeň“, „Značkař“ (20 značek bez chyby), „Trojfázový“ — základ pro první úrovně, rychlé odměny (lekce ★).
- **Typické chyby:** záměna mA/A a kΩ/Ω při převodech; sériové vs. paralelní řazení (co se dělí — proud, nebo napětí); záměna značek zdroje/rezistoru/žárovky; U je „mezi dvěma body“, I „teče prvkem“; hvězda vs. trojúhelník; plete se efektivní a maximální hodnota střídavého napětí.
- **Bezpečnostní poznámky:** i „základní“ pokusy jen ve škole; 230 V není „malé napětí“; nikdy neověřovat teorii doma na síti.
- **Mikrolekce (8):** 1. Veličiny a jednotky: kdo je kdo · 2. Převody jednotek bez paniky · 3. Ohmův zákon: trojúhelník U-I-R · 4. Sériově, nebo paralelně? · 5. Poznej značku (el. kreslení I) · 6. Nakresli obvod (el. kreslení II) · 7. Magnet a cívka: odkud se bere indukce · 8. Střídavý proud: sinusovka v čase · 9. Trojfázová soustava: proč tři fáze · 10. Hvězda vs. trojúhelník.
- **Minihry:** ① **Značkové pexeso** — na čas, dvojice značka↔součástka, žebříček osobních rekordů. ② **Stavitel obvodu** — z palety (zdroj, spínač, žárovka, rezistor, ampérmetr) sestav obvod podle zadání; simulace ukáže, zda žárovka svítí a jak moc.
- **Boss level: „Zkrat v dílně“** — souvislý úkol: přečti schéma → sestav obvod → spočítej proud Ohmovým zákonem → najdi, proč žárovka nesvítí (přerušený vodič ve schématu) → oprav. 3 pojistky ⚡, odznak „Základy pokořeny“.

### 11.2 Elektrotechnická měření a pohony

- **Popis pro žáka:** „Naučíš se změřit, co se v obvodu děje — a rozhýbat motor tak, aby nic neuhořelo.“
- **Ročníky:** 1., 2., 3.
- **Témata:** dle osnovy (bezpečnostní předpisy, metody měření, měřicí přístroje, zpracování hodnot, pohony a jejich stavy, jištění, měniče, měření výkonu/energie/kmitočtu, regulace pohonů…).
- **Interaktivity:** simulace měření (vlajková loď předmětu), výběr správného postupu, rozhodovací scénář, odhad→ověření, časová osa (rozběh motoru), párování přístroj↔veličina.
- **Gamifikace:** odznak „Mistr multimetru“ (10 měření bez spálení přístroje), „Nespálil jsem to“ (série správných rozsahů), boss battle proti „zlobivému motoru“.
- **Typické chyby:** ampérmetr paralelně (= zkrat přes přístroj), voltmetr sériově; špatný rozsah (malý rozsah → „ručička v pravém rohu“); měření odporu v obvodu pod napětím; záměna AC/DC polohy přepínače; odečítání ze špatné stupnice; u pohonů záměna rozběhových stavů.
- **Bezpečnostní poznámky:** měření na reálné síti výhradně s učitelem; před měřením odporu odpojit zdroj; simulátor smí „shořet“, reálný přístroj ne — proto trénujeme tady.
- **Mikrolekce (9):** 1. Multimetr: co která zdířka znamená · 2. Měřím napětí: VEDLE (paralelně) · 3. Měřím proud: V ŘADĚ (sériově) · 4. Volba rozsahu: odhadni dřív, než připojíš · 5. Měřím odpor: nejdřív bez napětí · 6. Zpracování hodnot: průměr a chyba měření · 7. Motor se rozbíhá: co se děje s proudem · 8. Jištění motoru: jistič vs. tepelná ochrana · 9. Měření výkonu: wattmetr do obvodu · 10. Přečti elektroměr.
- **Minihry:** ① **Nespal to!** — rychlá kola: obvod + veličina k změření → žák nastaví přepínač, rozsah a zapojení multimetru; špatně = virtuální dým a vysvětlení. ② **Motor v tahu** — slider zátěže motoru; žák sleduje proud a hlídá, aby tepelná ochrana nevybavila; učí vztah zátěž↔proud.
- **Boss level: „Servis stroje“** — scénář: stroj v dílně „nejede“. Postupně: zvol správný postup (nejdřív beznapěťový stav s učitelem), změř napájení v simulaci, změř vinutí, urči závadu (přerušené vinutí vs. vybavená ochrana), vyber správné jištění. Odznak „Diagnostik“.

### 11.3 Rozvodná zařízení

- **Popis pro žáka:** „Cesta elektřiny od elektrárny až do tvé zásuvky — a co všechno ji po cestě chrání.“
- **Ročníky:** 2., 3.
- **Témata:** dle osnovy (rozvody a slaboproud, rozvody v bytech a průmyslu, hromosvody, výpočty, elektrárny, základní pravidla, zdroje světla, kompenzace, přepětí, zemní spojení, soustava vn/vvn, rozvodny, BOZP).
- **Interaktivity:** přetahování prvků (osazení rozvaděče), hledání chyby ve schématu, rozhodovací scénář, kalkulačkový trenažér, časová osa (co vypne dřív), párování (barvy vodičů, druhy svítidel).
- **Gamifikace:** odznaky „Rozvaděčový král“, „Bleskosvod“, „Světlonoš“; „stavěcí“ progrese — žák postupně „elektrifikuje“ virtuální dům, patro po patře.
- **Typické chyby:** záměna barev vodičů (PE/N/fáze); jistič „chrání zásuvku“, chránič „chrání člověka“ — žáci to slévají; špatná dimenze vedení vs. jistič; zapomenutý PE u spotřebiče třídy I; plete se funkce hromosvodu a přepěťové ochrany; ve výpočtech záměna příkonu a proudu.
- **Bezpečnostní poznámky:** nejcitlivější předmět — každá lekce s povinnou poznámkou; nikdy nepodat jako návod na domácí instalaci; scénáře vždy končí „práci provádí elektrikář s oprávněním / ve škole s učitelem“.
- **Mikrolekce (10):** 1. Barvy vodičů: kdo je kdo · 2. Co dělá jistič (a co nedělá) · 3. Proudový chránič: hlídač života · 4. Domovní rozvaděč: rozmísti přístroje · 5. Zásuvkový a světelný okruh: jak se liší · 6. Rozvod v průmyslu: proč tři fáze a víc mědi · 7. Zdroje světla: porovnej žárovku, zářivku, LED · 8. Hromosvod: kudy blesk do země · 9. Přepětí: co zabije elektroniku · 10. Zemní spojení vs. zkrat: poznej rozdíl.
- **Minihry:** ① **Postav rozvaděč** — drag&drop: hlavní jistič, chránič, jističe okruhů do DIN lišty ve správném pořadí a logice; kontrola s vysvětlením. ② **Blesková neděle** — na dům padají blesky a přepěťové špičky; žák rozmisťuje ochrany (hromosvod, svodiče) a sleduje, co která zachytí.
- **Boss level: „Elektrifikace domu“** — vícekrokový projekt: rozděl místnosti do okruhů → osaď rozvaděč → přiřaď průřezy k jističům (z nabídky) → najdi 3 chyby v hotovém schématu → bezpečnostní scénář (mokrá koupelna). Odznak „Domovní mistr“.

### 11.4 Elektrické stroje a přístroje

- **Popis pro žáka:** „Transformátory, motory a přístroje, které je spínají a chrání. Srdce každé dílny i fabriky.“
- **Ročníky:** 2.
- **Témata:** dle osnovy (úvod, stroje a zařízení, přístroje nn, přístroje vn/vvn, transformátory, synchronní, asynchronní a stejnosměrné stroje, speciální stroje).
- **Interaktivity:** skládání (rozřezaný stroj — poskládej řez motorem), párování přístroj↔funkce, časová osa (rozběh, přepínání Y/D), hledání chyby (zapojení svorkovnice), odhad→ověření (převod trafa).
- **Gamifikace:** sbírka „strojovna“ — za každé zvládnuté téma přibude stroj do virtuální strojovny žáka; odznaky „Krotitel trafa“, „Točivý moment“.
- **Typické chyby:** záměna statoru a rotoru; u trafa převod „obráceně“ (dělení místo násobení); synchronní vs. asynchronní — kdo má skluz; stykač vs. jistič vs. relé (co spíná, co chrání); zapojení svorkovnice Y/D; stejnosměrný motor — záměna kotvy a buzení.
- **Bezpečnostní poznámky:** točivé stroje = i mechanické riziko (vtažení, rotující části); kondenzátory a vinutí mohou „držet“ energii po vypnutí — kontrola jen s učitelem; přístroje vn/vvn výhradně teoreticky.
- **Mikrolekce (9):** 1. Stroj vs. přístroj: v čem je rozdíl · 2. Stykač, relé, jistič: kdo co umí · 3. Transformátor: proč mění napětí · 4. Převod trafa: spočítej výstup · 5. Asynchronní motor: proč se točí (a co je skluz) · 6. Svorkovnice motoru: hvězda, nebo trojúhelník · 7. Synchronní stroj: tanec s frekvencí · 8. Stejnosměrný motor: kotva a buzení · 9. Speciální stroje: krokáč a servo v praxi.
- **Minihry:** ① **Rozřezaný motor** — puzzle: přetáhni části (stator, rotor, ložiska, svorkovnice, ventilátor) na správné místo v řezu; poté kvíz „na co klepu?“. ② **Trafo tetris** — padají zadání (230→12 V, 400→230 V…), žák rychle volí poměr závitů z nabídky; kombo za sérii správných.
- **Boss level: „Rozjeď linku“** — v hale jsou 3 stroje: vyber ke každému správný přístroj (stykač + ochrana), zapoj svorkovnici motoru podle štítku a napětí sítě, najdi chybu, proč se motor točí obráceně, a urči bezpečný postup kontroly (s učitelem, bez napětí). Odznak „Strojník“.

### 11.5 Elektronika

- **Popis pro žáka:** „Co se děje uvnitř nabíječky, zesilovače nebo počítače. Malé proudy, velká kouzla.“
- **Ročníky:** 2., 3.
- **Témata:** dle osnovy (fyzikální základy, prvky obvodů, napájecí zdroj, zesilovače, oscilátory, modulátory, elektroakustika; 3. r.: impulzové a číslicové obvody, tranzistor jako spínač, výpočetní technika, optoelektronika).
- **Interaktivity:** skládání obvodu (usměrňovač, dělič), poznávání součástek a pouzder, simulace (dioda propustně/závěrně), pravdivostní tabulka, hledání chyby (obrácená dioda, elektrolyt naopak), odhad→ověření (co ukáže osciloskop).
- **Gamifikace:** odznaky „Diodový rytíř“, „Zesil to!“, „Logik“; sbírka součástek — každá poznaná součástka přibude do virtuální krabičky.
- **Typické chyby:** obrácená polarita diody a elektrolytického kondenzátoru; záměna anody/katody; plete se usměrnění jednocestné/dvoucestné (kolik „kopečků“); tranzistor: záměna vývodů B-C-E a představa, že „zesiluje napětí z ničeho“; u hradel záměna NAND/NOR; čtení hodnoty rezistoru z barevného kódu.
- **Bezpečnostní poznámky:** i „malá“ elektronika se napájí ze sítě — primární strana zdroje je síťové napětí; nabité kondenzátory kopou i po vypnutí; pájení = popáleniny a výpary, jen ve škole.
- **Mikrolekce (9):** 1. Poznej součástku (a její značku) · 2. Barevný kód rezistorů · 3. Dioda: jednosměrka pro proud · 4. Usměrňovač: z AC na DC · 5. Kondenzátor ve zdroji: vyhlazení · 6. Tranzistor: malý proud řídí velký · 7. Tranzistor jako spínač (3. r.) · 8. Hradla AND/OR/NOT: doplň tabulku (3. r.) · 9. Optočlen a LED: světlo místo drátu (3. r.).
- **Minihry:** ① **Součástkový lovec** — na fotce osazené desky najdi a označ zadané součástky na čas. ② **Postav zdroj** — poskládej blokově napájecí zdroj (trafo → usměrňovač → filtr → stabilizátor) a sleduj, jak se mění průběh napětí za každým blokem.
- **Boss level: „Oprav nabíječku“** — simulovaná deska zdroje: podle příznaku (nesvítí LED / brumí výstup) změř v simulaci napětí za bloky, urči vadný blok, vyber vadnou součástku (prasklá dioda / vyschlý elektrolyt), „vyměň“ ji a ověř průběhy. Odznak „Elektronik“.

### 11.6 Automatická zařízení

- **Popis pro žáka:** „Jak stroje samy měří, rozhodují a řídí. Snímače, regulátory a logika — základ chytré fabriky.“
- **Ročníky:** 3.
- **Témata:** Snímače · Regulační obvod · Regulované soustavy · Regulátory · Regulační pochod · Regulační systémy · Polovodičové součástky · Logické obvody.
- **Interaktivity:** pravdivostní tabulky, skládání regulační smyčky z bloků, párování snímač↔veličina, simulace (topení s termostatem — sleduj přeregulování), časová osa regulačního pochodu.
- **Gamifikace:** odznaky „Logik“, „Regulátor“, „Snímačový detektiv“; výzvy na čas u tabulek.
- **Typické chyby:** záměna regulace a ovládání (zpětná vazba!); plete se snímač/čidlo vs. akční člen; ve smyčce špatné pořadí bloků; u tabulek chyby u NAND/NOR a negací; představa, že regulátor „nastaví a hotovo“ (nechápou trvalé porovnávání).
- **Bezpečnostní poznámky:** automatické stroje se mohou rozběhnout „samy od sebe“ — signál ze snímače stačí; před prací STOP a zajištění, vždy s učitelem; nikdy nestrkat ruce do stroje „když zrovna stojí“.
- **Mikrolekce (8):** 1. Snímače kolem nás: co co měří · 2. Ovládání vs. regulace: kde je zpětná vazba · 3. Poskládej regulační smyčku · 4. Regulovaná soustava: co vlastně řídíme · 5. Regulátor dvoupolohový: termostat v akci · 6. Regulační pochod: proč to kmitá · 7. Hradla: AND, OR, NOT v praxi · 8. Slož logickou funkci: vrátnice se dvěma tlačítky.
- **Minihry:** ① **Termostat hero** — udrž teplotu v pásmu ručním spínáním topení; pak to samé svěř regulátoru a porovnej — zážitkové pochopení regulace. ② **Logická vrátnice** — z hradel postav obvod podle slovního zadání („dveře se otevřou, když je karta A ZÁROVEŇ není alarm“); testovací vstupy ověří.
- **Boss level: „Automatická myčka“** — navrhni řízení mycí linky: vyber snímače (poloha auta, hladina vody), poskládej smyčku, doplň pravdivostní tabulku spouštění a najdi chybu, proč se linka spustila s otevřenými dveřmi (chybějící podmínka). Odznak „Automatik“.

### 11.7 Bezpečnost a chyby z praxe (průřezová dlaždice)

- **Popis pro žáka:** „Skutečné průšvihy, které se staly — a ty rozhodneš, jak jim předejít. Tady se chybuje zadarmo.“
- **Ročníky:** 1.–3. (obsah tagovaný ročníkem).
- **Témata:** účinky proudu na člověka · zásady v dílně · první pomoc (přivolání, bez hrdinství) · ochranné pomůcky · požární prevence u elektro · katalog chyb z praxe (napříč předměty) · „pět pravidel“ bezpečné práce (rámcově, bez odkazů na normy).
- **Interaktivity:** rozhodovací scénáře (hlavní forma), výběr správného postupu, hledání rizika na obrázku dílny, párování pomůcka↔činnost.
- **Gamifikace:** samostatná odznaková řada „Strážce dílny I–III“; bezpečnostní denní výzva 1× týdně povinně v rotaci; boss levely bez časovače (rozvaha > rychlost).
- **Typické chyby:** „vypnul jsem vypínač, takže tam nic není“; práce s poškozeným nářadím/přívodem; hašení elektro vodou; sundávání krytů „jen na koukání“; spoléhání, že „malé napětí nekope“; hrdinské odpojování zasaženého holýma rukama.
- **Bezpečnostní poznámky:** celý předmět JE bezpečnostní poznámka; formulace vždy školní a zodpovědná; první pomoc jen v rozsahu „zavolej, zajisti, nedotýkej se“ — žádné zdravotnické postupy nad rámec laické pomoci.
- **Mikrolekce (8):** 1. Co dělá proud s tělem: mA rozhodují · 2. Vypnuto ≠ bez napětí: proč se to ověřuje (s učitelem) · 3. Najdi 5 rizik v dílně (obrázek) · 4. Ochranné pomůcky: co si beru k čemu · 5. Poškozený přívod: co s ním (nic — vyřadit a nahlásit) · 6. Hoří rozvaděč: čím hasit a čím nikdy · 7. Kamarád „to jde zkusit pod napětím“: co uděláš · 8. Zásah proudem: správné pořadí kroků laika.
- **Minihry:** ① **Rizikohled** — hledání rizik na obrázcích dílen a staveniště na čas, stupňující se záludnost. ② **Rozhodni za 10 sekund** — svižné dilema karty (bezpečné/riskantní) swipe doleva/doprava; po každé kartě jednořádkové vysvětlení.
- **Boss level: „Den v dílně“** — souvislý příběhový scénář od příchodu do dílny po úklid: 8 rozhodovacích bodů (pomůcky, kontrola nářadí, hlášení závady, reakce na spěch mistra, mimořádná událost). Bez životů a času; hodnotí se rozvaha. Odznak „Strážce dílny“.

### 11.8 Příprava na závěrečnou zkoušku

- **Popis pro žáka:** „Všechno důležité z 1.–3. ročníku v tréninkovém režimu. Ať tě u zkoušky nic nepřekvapí.“
- **Ročníky:** primárně 3., přístupné všem.
- **Témata:** nemá vlastní učivo — agreguje obsah ostatních předmětů do okruhů: Základy · Měření · Rozvody · Stroje · Elektronika · Automatizace · Bezpečnost (u zkoušky vždy).
- **Interaktivity:** zkouškový trenažér (mix otázek a aktivit), ústní otázka nanečisto (otázka → žák si rozmyslí → odkryje osnovu správné odpovědi → sebehodnocení), praktický scénář (simulace úlohy), slabá místa (aplikace sama nabízí, kde žák nejvíc chyboval).
- **Gamifikace:** „zkouškový průkaz“ — plní se po okruzích; odznak „Připraven“ za ≥ 80 % ve všech okruzích; odpočet dní do zkoušky (zadá žák/učitel).
- **Typické chyby:** trénuje přesně to, co je nasbírané v datech žáka — režim „Moje slabiny“ tahá lekce s nejhorší úspěšností.
- **Bezpečnostní poznámky:** bezpečnostní okruh nelze přeskočit; průkaz se nezaplní bez něj.
- **Mikrolekce (6 — formou trenažérů):** 1. Rychlotest Základy (10 otázek mix) · 2. Měření nanečisto (3 simulace za sebou) · 3. Rozvody: velké opakování schémat · 4. Stroje: poznávačka + převody · 5. Bezpečnost: scénářový maraton · 6. Ústní otázka dne.
- **Minihry:** ① **Kolo okruhů** — ruleta vybere okruh, žák plní 3 rychlé úkoly; nutí neopakovat jen oblíbené. ② **Poslední minuta** — 60 s, co nejvíc bleskových otázek; žebříček vlastních rekordů.
- **Boss level: „Zkouška nanečisto“** — 30–40 min simulace: test (20 otázek) + 2 praktické simulace + 1 ústní otázka se sebehodnocením + povinný bezpečnostní scénář. Výstup: procenta po okruzích + doporučení 5 lekcí k doučení. Odznak „Velký boss: Závěrečná“.

---

## 12. Prvních 30 mikrolekcí pro MVP

Priorita: bezpečnost → základy → měření → rozvody → zkouškově důležitá a chybová témata.

| # | Název | Předmět | Roč. | Téma | Interaktivita | Cíl | Odměna |
|---|---|---|---|---|---|---|---|
| 1 | Co dělá proud s tělem | Bezpečnost | 1 | Účinky proudu | rozhodovací scénář | chápe, že rozhodují mA a cesta proudu | 20 XP, start řady Strážce dílny |
| 2 | Najdi 5 rizik v dílně | Bezpečnost | 1 | Zásady v dílně | hledání rizik v obrázku | rozpozná běžná rizika | 20 XP |
| 3 | Poškozený přívod: co s ním | Bezpečnost | 1 | Nářadí | výběr postupu | ví: vyřadit a nahlásit, neopravovat | 20 XP |
| 4 | Hoří rozvaděč | Bezpečnost | 2 | Požární prevence | rozhodovací scénář | volí správné hasivo, nikdy vodu | 20 XP |
| 5 | Zásah proudem: kroky laika | Bezpečnost | 1 | První pomoc | řazení kroků | správné pořadí: nedotýkat se, vypnout, volat | 30 XP, odznak Strážce dílny I |
| 6 | Veličiny a jednotky: kdo je kdo | Základy | 1 | Veličiny a jednotky | párování | přiřadí U-V, I-A, R-Ω, P-W | 10 XP |
| 7 | Převody jednotek bez paniky | Základy | 1 | Veličiny a jednotky | kalkulačkový trenažér | převádí mA↔A, kΩ↔Ω | 10 XP |
| 8 | Ohmův zákon: trojúhelník | Základy | 1 | Stejnosměrný proud | kalkulačkový trenažér | dopočítá třetí veličinu | 20 XP |
| 9 | Sériově, nebo paralelně? | Základy | 1 | Stejnosměrný proud | skládání obvodu | rozliší řazení a jeho vliv | 20 XP |
| 10 | Poznej značku I | Základy | 1 | El. kreslení | poznávání značek | pozná 12 základních značek | 10 XP, odznak Značkař (po II) |
| 11 | Poznej značku II | Základy | 1 | El. kreslení | poznávání značek | dalších 12 značek | 10 XP + Značkař |
| 12 | Nakresli obvod | Základy | 1 | El. kreslení | skládání obvodu | složí schéma dle slovního zadání | 20 XP |
| 13 | Magnet a cívka | Základy | 1 | Elmag. indukce | odhad→ověření | chápe vznik indukovaného napětí | 20 XP |
| 14 | Střídavý proud: sinusovka | Základy | 1 | Střídavý proud | odhad→ověření | čte amplitudu, periodu, frekvenci | 20 XP |
| 15 | Trojfázová soustava | Základy | 1 | Trojfázový proud | párování + schéma | rozliší fáze, N, PE; chápe 230/400 V | 30 XP |
| 16 | Hvězda vs. trojúhelník | Základy | 1 | Trojfázový proud | hledání chyby ve schématu | rozliší obě zapojení | 30 XP |
| 17 | Multimetr: zdířky a přepínač | Měření | 1 | Měřicí přístroje | párování + simulace | správně nastaví přístroj | 10 XP |
| 18 | Měřím napětí: VEDLE | Měření | 1 | Metody měření | simulace měření | zapojí voltmetr paralelně | 20 XP |
| 19 | Měřím proud: V ŘADĚ | Měření | 1 | Metody měření | simulace měření | zapojí ampérmetr sériově | 20 XP, odznak Mistr multimetru (se sérií) |
| 20 | Volba rozsahu | Měření | 1 | Metody měření | simulace měření | odhadne a zvolí rozsah | 20 XP |
| 21 | Měřím odpor: bez napětí! | Měření | 1 | Metody měření | výběr postupu + simulace | ví, proč odpojit zdroj | 30 XP |
| 22 | Jistič vs. chránič | Rozvody | 2 | Rozvod v budovách | párování + scénář | rozliší, co chrání vedení a co člověka | 30 XP |
| 23 | Barvy vodičů | Rozvody | 2 | Rozvod v budovách | přetahování prvků | přiřadí PE/N/fázi správně | 20 XP |
| 24 | Domovní rozvaděč | Rozvody | 2 | Rozvod v budovách | přetahování (DIN lišta) | osadí rozvaděč v logickém pořadí | 30 XP |
| 25 | Zásuvkový vs. světelný okruh | Rozvody | 2 | Rozvod v budovách | hledání chyby ve schématu | rozliší okruhy a jejich jištění | 20 XP |
| 26 | Zdroje světla: porovnání | Rozvody | 3 | Zdroje světla | párování + odhad | porovná účinnost a použití | 10 XP |
| 27 | Stykač, relé, jistič | Stroje | 2 | Přístroje nn | párování | rozliší funkce přístrojů | 20 XP |
| 28 | Transformátor: proč mění napětí | Stroje | 2 | Transformátory | odhad→ověření | chápe princip a převod | 20 XP |
| 29 | Asynchronní motor: proč se točí | Stroje | 2 | Asynchronní stroje | skládání (řez motorem) | pozná části a princip | 30 XP |
| 30 | Dioda: jednosměrka pro proud | Elektronika | 2 | Prvky obvodů | simulace + hledání chyby | určí propustný/závěrný směr | 20 XP |

Lekce 1–5 tvoří povinný „bezpečnostní vstup“ — doporučené jako první spuštění pro každého žáka.

---

## 13. Pět ukázkových mikrolekcí (kompletně dle šablony)

### 13.1 Ohmův zákon: trojúhelník U-I-R (Základy elektrotechniky)

- **Ročník:** 1. · **Téma:** Stejnosměrný proud · **Čas:** 7 min · **Obtížnost:** ★★
- **Cíl lekce:** Žák dopočítá třetí veličinu Ohmova zákona, když zná dvě.
- **Háček z praxe:** „Žárovka do auta má odpor 6 Ω a baterka dává 12 V. Kolik proudu poteče? Za minutu to spočítáš z hlavy.“
- **Krátké vysvětlení:** **Ohmův zákon**: U = I × R. Pomůcka: trojúhelník — nahoře **U**, dole **I** a **R**. Zakryj, co hledáš, a zbytek ti řekne výpočet. Hledáš I? Zakryj I → zbyde U/R.
- **Interaktivní aktivita:** Kalkulačkový trenažér, 6 kol. Na obrazovce interaktivní trojúhelník — žák klepne na hledanou veličinu (ta se zakryje a ukáže vzorec), pak zadá výsledek na numerické klávesnici. Kola 1–2 hezká čísla (12 V, 6 Ω), kola 3–4 s převodem (200 mA), kola 5–6 mini-scénář („topné tělísko 24 V / 2 A — jaký má odpor?“). Nápověda po 20 s: zvýrazní se vzorec.
- **Typická chyba:** Dosazení mA místo A → výsledek 1000× vedle. Trenažér na to reaguje konkrétně: „Pozor, 200 mA = 0,2 A. Převeď a zkus znovu.“
- **Bezpečnostní poznámka:** „Počítáme na papíře a v simulaci. Ověřování na skutečném obvodu patří do školní dílny pod dohledem učitele.“
- **Mini test:** ① U = 230 V, R = 460 Ω → I? (0,5 A) ② Jakým vzorcem spočítáš R? (U/I) ③ I = 50 mA — kolik je to A? (0,05 A)
- **Věta k zapamatování:** „Zakryj, co hledáš — trojúhelník ti řekne zbytek.“
- **Odměna:** 20 XP; při 6/6 kolech bez nápovědy bonus 10 XP a příspěvek k odznaku „Ohmův učeň“.

### 13.2 Měřím proud: V ŘADĚ (Elektrotechnická měření a pohony)

- **Ročník:** 1. · **Téma:** Způsoby a metody měření · **Čas:** 8 min · **Obtížnost:** ★★
- **Cíl lekce:** Žák zapojí ampérmetr sériově a zvolí správný rozsah, aniž by (v simulaci) zničil přístroj.
- **Háček z praxe:** „Ampérmetr zapojený špatně je nejrychlejší způsob, jak v dílně vyrobit dým. Tady si to můžeš spálit zadarmo.“
- **Krátké vysvětlení:** Proud **teče obvodem** — proto ampérmetr zapojujeme **sériově** (do řady), aby proud tekl skrz něj. Má malý vnitřní odpor: zapojený **paralelně** vytvoří zkrat. Vždy: nejdřív **odhad**, pak **rozsah**, pak zapojit.
- **Interaktivní aktivita:** Simulace měření. Obvod: zdroj 12 V, spínač, žárovka. Žák: ① rozpojí obvod klepnutím na místo vložení, ② přetáhne ampérmetr, ③ nastaví rozsah (10 A / 200 mA / 20 mA), ④ sepne. Správně → ručička ukáže hodnotu, žák ji opíše do pole. Paralelně → animace dýmu, přístroj „shoří“, vysvětlení proč, nový přístroj, nový pokus (bez ztráty XP, počítá se dokončení). 3 kola s různými obvody.
- **Typická chyba:** Zapojení paralelně „jako voltmetr“ a malý rozsah u velkého proudu. Obojí simulace bezpečně předvede a vysvětlí.
- **Bezpečnostní poznámka:** „Toto je simulace — spálený přístroj tu nic nestojí. Skutečné měření děláš jen ve škole, pod dohledem učitele, nikdy na obvodu pod napětím bez jeho pokynu.“
- **Mini test:** ① Ampérmetr zapojujeme… (sériově) ② Co se stane při paralelním zapojení? (zkrat přes přístroj) ③ Čekáš cca 2 A — jaký rozsah? (10 A, pak případně snížit)
- **Věta k zapamatování:** „Proud měřím V ŘADĚ, napětí VEDLE.“
- **Odměna:** 20 XP; 3 kola bez spálení = příspěvek k odznaku „Mistr multimetru“.

### 13.3 Jistič vs. proudový chránič (Rozvodná zařízení)

- **Ročník:** 2. · **Téma:** Silnoproudý rozvod v obytných budovách · **Čas:** 8 min · **Obtížnost:** ★★
- **Cíl lekce:** Žák rozliší, před čím chrání jistič a před čím proudový chránič, a určí, který prvek v dané situaci zareaguje.
- **Háček z praxe:** „Doma ti ‚vyhodilo pojistky‘. Ale co vlastně vyplo — a proč? Jistič a chránič hlídají každý něco jiného.“
- **Krátké vysvětlení:** **Jistič** hlídá **velikost proudu** ve vedení — chrání **vodiče** před přetížením a zkratem. **Proudový chránič** porovnává proud tam a zpět; když část „uteče“ jinudy (třeba přes člověka), vypne — chrání především **člověka**. Nejsou zaměnitelné, proto bývají v rozvaděči oba.
- **Interaktivní aktivita:** Rozhodovací scénář, 5 situací s obrázkem: ① rychlovarka + topidlo + trouba na jednom okruhu, ② poškozená izolace a dotyk na kostru, ③ zkrat v prodlužovačce, ④ vlhko v koupelně a unikající proud, ⑤ chvilkový rozběhový proud vysavače. Žák volí: vypne JISTIČ / vypne CHRÁNIČ / nevypne nic. Po volbě animace toku proudu ukáže proč.
- **Typická chyba:** „Chránič je silnější jistič.“ Scénář ② ji cíleně boří: proud je malý (mA), jistič mlčí — a právě proto existuje chránič.
- **Bezpečnostní poznámka:** „Chránič nesnižuje opatrnost — je to záchranná síť, ne povolení riskovat. Jakékoli zásahy v rozvaděči provádí jen elektrikář s oprávněním; ty se v aplikaci učíš rozumět tomu, co vidíš.“
- **Mini test:** ① Vodiče před přetížením chrání… (jistič) ② Chránič vypíná, když… (část proudu uniká mimo obvod) ③ Malý unikající proud přes tělo — kdo zareaguje? (chránič)
- **Věta k zapamatování:** „Jistič hlídá dráty, chránič hlídá tebe.“
- **Odměna:** 30 XP; 5/5 situací = příspěvek k odznaku „Rozvaděčový král“.

### 13.4 Dioda: jednosměrka pro proud (Elektronika)

- **Ročník:** 2. · **Téma:** Prvky elektrických obvodů · **Čas:** 6 min · **Obtížnost:** ★
- **Cíl lekce:** Žák určí propustný a závěrný směr diody a najde obráceně zapojenou diodu v obvodu.
- **Háček z praxe:** „Proč nabíječka udělá ze zásuvkové ‚střídačky‘ stejnosměrný proud pro mobil? Začíná to u součástky za pár korun.“
- **Krátké vysvětlení:** **Dioda** pouští proud jen **jedním směrem** — jako jednosměrka. Od **anody (A)** ke **katodě (K)** vede (**propustný směr**); obráceně zavře (**závěrný směr**). Na značce šipka ukazuje směr proudu; pruh na pouzdru = katoda.
- **Interaktivní aktivita:** Dvoufázová. **Fáze 1 — simulace:** obvod baterie–dioda–LED; žák diodu klepnutím otáčí a sleduje, kdy LED svítí; pak přepóluje baterii a ověří pravidlo. **Fáze 2 — hledání chyby:** tři schémata, v každém jedna dioda obráceně; žák na ni klepne. Kontrola s animací toku proudu.
- **Typická chyba:** Záměna anody a katody podle pouzdra (pruh = katoda, ne „plus“). Aplikace ukáže fotku reálné diody vedle značky a nechá žáka spárovat vývody.
- **Bezpečnostní poznámka:** „Zapojování součástek zkoušej na nepájivém poli ve škole. Nikdy nezasahuj do síťové části zařízení — i vypnutá nabíječka může mít nabité kondenzátory.“
- **Mini test:** ① Proud diodou teče od… (anody ke katodě) ② Pruh na pouzdru značí… (katodu) ③ Dioda v závěrném směru se chová jako… (rozpojený obvod)
- **Věta k zapamatování:** „Dioda je jednosměrka — šipka ukazuje, kudy proud smí.“
- **Odměna:** 10 XP; obě fáze bez chyby = příspěvek k odznaku „Diodový rytíř“.

### 13.5 Svorkovnice motoru: hvězda, nebo trojúhelník (Elektrické stroje a přístroje)

- **Ročník:** 2. · **Téma:** Asynchronní stroje · **Čas:** 9 min · **Obtížnost:** ★★★
- **Cíl lekce:** Žák podle štítku motoru a napětí sítě rozhodne o zapojení Y/D a správně rozmístí propojky na svorkovnici.
- **Háček z praxe:** „Dva stejné motory, dvě různá zapojení propojek — jeden běží, druhý ‚mručí‘ a hřeje se. Rozdíl? Tři plíšky na svorkovnici.“
- **Krátké vysvětlení:** Svorkovnice má šest svorek (U1 V1 W1 / W2 U2 V2). **Hvězda (Y):** propojky spojí W2-U2-V2 do uzlu — na vinutí je menší napětí. **Trojúhelník (D):** propojky svisle spojí konce s začátky — na vinutí je plné sdružené napětí. Štítek říká, které zapojení patří ke kterému napětí sítě (např. 400 V Y / 230 V D).
- **Interaktivní aktivita:** Přetahování prvků: vykreslená svorkovnice + 3 propojky. Kolo 1: „Síť 3×400 V, štítek 400 V Y / 230 V D — zapoj správně.“ Žák položí propojky; simulace spustí motor: správně = plynulý rozběh, špatně (D na vyšší napětí) = animace přehřívání s vysvětlením. Kolo 2: opačné zadání. Kolo 3: chybně předzapojená svorkovnice — najdi a oprav.
- **Typická chyba:** Mechanické „hvězda = napříč, trojúhelník = svisle“ bez čtení štítku — lekce nutí vždy nejdřív klepnout na štítek (bez otevření štítku nejde pokládat propojky).
- **Bezpečnostní poznámka:** „Svorkovnici skutečného motoru otevírej jen ve škole, pod dohledem učitele a na stroji prokazatelně bez napětí. Tady si zapojení natrénuješ bez rizika.“
- **Mini test:** ① Ve hvězdě propojky spojují… (konce vinutí do uzlu) ② Kdy zapojíš trojúhelník? (když sdružené napětí sítě odpovídá napětí D na štítku) ③ Co hrozí při D na vyšším napětí? (nadproud a přehřátí vinutí)
- **Věta k zapamatování:** „Nejdřív štítek, pak propojky.“
- **Odměna:** 30 XP; všechna kola bez přehřátí = odznak „Krotitel svorkovnice“.

---

## 14. Datový model aplikace

Obsah = statické JSON soubory přibalené v aplikaci; pokrok = lokální úložiště.

```jsonc
// subject.json — předmět
{
  "id": "rozvody",
  "title": "Rozvodná zařízení",
  "tileTitle": "Rozvody",
  "subtitle": "Od zásuvky až po rozvodnu.",
  "icon": "house-bolt",
  "color": "#E8A020",
  "grades": [2, 3],           // ročníky, kterých se týká
  "topicIds": ["rozvody-byt", "rozvody-prumysl", "hromosvody"]
}

// topic.json — téma
{
  "id": "rozvody-byt",
  "subjectId": "rozvody",
  "grade": 2,                 // ročník tématu
  "title": "Silnoproudý rozvod v obytných budovách",
  "hook": "Elektrika v bytě od rozvaděče po poslední zásuvku.",
  "order": 2,
  "lessonIds": ["rozvody-byt-01", "rozvody-byt-02"],
  "commonMistakes": ["Záměna barev PE a N.", "‚Chránič je silnější jistič.‘"],
  "topicTestId": "test-rozvody-byt",
  "bossLevelId": "boss-rozvody-byt",
  "badgeId": "badge-rozvadecovy-kral"
}

// lesson.json — mikrolekce (kompletní příklad, lekce 13.3)
{
  "id": "rozvody-byt-02",
  "topicId": "rozvody-byt",
  "subjectId": "rozvody",
  "grade": 2,
  "title": "Jistič vs. proudový chránič",
  "durationMin": 8,
  "difficulty": 2,            // 1–3
  "goal": "Rozlišíš, před čím chrání jistič a před čím proudový chránič.",
  "hook": "Doma ti ‚vyhodilo pojistky‘. Ale co vlastně vyplo — a proč?",
  "explanation": {
    "steps": [                // krátké kroky pro Klidný režim
      "**Jistič** hlídá velikost proudu ve vedení. Chrání **vodiče**.",
      "**Proudový chránič** porovnává proud tam a zpět.",
      "Když proud ‚uteče‘ jinudy — třeba přes člověka — chránič vypne.",
      "Proto bývají v rozvaděči **oba**. Nejsou zaměnitelné."
    ],
    "image": "img/jistic-vs-chranic.svg",
    "audioTts": true
  },
  "activity": {
    "type": "decision-scenario",       // klíč komponenty
    "config": {
      "scenarios": [
        {
          "text": "Rychlovarka, topidlo a trouba běží na jednom okruhu.",
          "image": "img/scenar-pretizeni.svg",
          "options": ["Vypne jistič", "Vypne chránič", "Nevypne nic"],
          "correct": 0,
          "feedback": "Velký proud = přetížení vedení. To je práce jističe."
        }
        // … další 4 scénáře
      ]
    }
  },
  "commonMistake": {
    "text": "‚Chránič je silnější jistič.‘ Není — hlídá únik proudu, ne jeho velikost.",
    "trainedByScenario": 1
  },
  "safetyNote": "Chránič není povolení riskovat. Zásahy v rozvaděči provádí jen elektrikář s oprávněním.",
  "quiz": ["q-rb02-1", "q-rb02-2", "q-rb02-3"],
  "keySentence": "Jistič hlídá dráty, chránič hlídá tebe.",
  "reward": { "xp": 30, "badgeProgress": "badge-rozvadecovy-kral" }
}

// activity — obecná obálka interaktivní aktivity
{ "type": "drag-drop | symbol-quiz | find-fault | decision-scenario | measure-sim | circuit-builder | truth-table | pair-match | order-steps | calc-trainer | estimate-verify | timeline | boss",
  "config": { /* schéma dané typem — každá komponenta má vlastní config */ } }

// question.json — otázka v testu
{
  "id": "q-rb02-1",
  "text": "Vodiče před přetížením chrání…",
  "options": ["jistič", "proudový chránič", "hromosvod"],
  "correct": 0,
  "explanation": "Jistič hlídá velikost proudu ve vedení.",
  "tags": ["rozvody", "grade2", "zkouska"]   // tagy pro Zkoušku a opakování
}

// badge.json — odznak
{
  "id": "badge-rozvadecovy-kral",
  "title": "Rozvaděčový král",
  "description": "Zvládl jsi téma domovních rozvodů.",
  "icon": "crown-panel",
  "condition": { "type": "topic-complete", "topicId": "rozvody-byt" }
}

// progress (localStorage/IndexedDB) — pokrok žáka
{
  "profile": { "name": "Žák", "grade": 2, "calmMode": false, "examDate": null },
  "xp": 340,
  "level": 4,
  "streak": { "current": 7, "best": 12, "lastActiveDay": "2026-07-09", "freezeUsedThisWeek": false },
  "lessons": {
    "rozvody-byt-02": { "status": "done", "bestScore": 0.8, "completedAt": "2026-07-08", "attempts": 2 }
  },
  "bosses": { "boss-rozvody-byt": { "status": "locked" } },
  "badges": ["badge-strazce-dilny-1"],
  "dailyChallenge": { "date": "2026-07-09", "lessonId": "zaklady-05", "done": false },
  "weakSpots": { "mereni-03": 0.4 }   // úspěšnost pro režim Moje slabiny
}
```

---

## 15. MVP verze aplikace

**Musí být v MVP:**
- Hlavní obrazovka s 8 dlaždicemi (i když některé předměty budou mít jen 1–2 témata s obsahem; prázdné dlaždice s „Připravujeme“).
- Stránka předmětu s filtrem ročníku, stránka tématu, přehrávač mikrolekce podle šablony.
- **4 typy aktivit:** párování · rozhodovací scénář · hledání chyby ve schématu · kalkulačkový trenažér. (Pokryjí 25 z 30 MVP lekcí.)
- Mini testy s okamžitou zpětnou vazbou.
- XP, úrovně, 5–8 odznaků, denní výzva, série s „náhradní pojistkou“.
- 1 boss level (Rozvody — „Elektrifikace domu“ ve zjednodušené formě: scénář + hledání chyb).
- Lokální pokrok + export/import JSON.
- Klidný režim (vypnutí animací/časovačů, krokované vysvětlení, větší písmo). TTS audio, pokud to Web Speech API na cílových zařízeních zvládne — jinak odložit.

**Odložit:** simulace měření a skládání obvodu (nejpracnější komponenty — verze 2), pravdivostní tabulky, učitelský režim (v MVP stačí „volný režim“), režim Zkouška (potřebuje víc obsahu), virtuální sbírky (strojovna, krabička součástek), žebříčky.

**Pořadí interaktivit ve vývoji:** 1. párování (nejjednodušší, otestuje celou pipeline) → 2. rozhodovací scénář (nese bezpečnostní obsah) → 3. hledání chyby (obrázek + hotspoty) → 4. kalkulačkový trenažér.

**Obsah první verze:** 30 mikrolekcí z kap. 12 (u 5 lekcí vyžadujících simulaci měření dočasně nahradit typ aktivity scénářem) + 1 boss + 5 tématických mini testů.

**Ověření ve třídě (pilot, 2 týdny):**
1. Jedna hodina se 3. ročníkem: 20 min volného používání, pozorovat, kde se zasekávají (bez nápovědy učitele).
2. Suplovaná hodina: učitel zadá „udělejte lekce 1–5“, měřit dokončitelnost bez asistence.
3. Mini dotazník (5 otázek, smajlíky): srozumitelnost, zábavnost, co chybí.
4. Metriky v aplikaci (lokálně): míra dokončení lekce, počet pokusů, čas na lekci — učitel vyčte z exportu.
5. Kritérium úspěchu: ≥ 80 % žáků dokončí lekci bez pomoci; průměrný čas lekce ≤ 10 min.

---

## 16. Roadmapa vývoje

| Etapa | Obsah | Výstup / kritérium hotovosti |
|---|---|---|
| **1. Kostra aplikace** (2–3 týdny) | Routing, dlaždice, předmět + filtr, téma, přehrávač lekce s dummy obsahem, lokální uložení pokroku, Klidný režim (základ) | Proklikatelná aplikace s 1 testovací lekcí, funguje offline z disku |
| **2. Obsah a lekce** (2–4 týdny, souběžně s 3) | Datové schéma finalizovat, validátor obsahu (povinné `safetyNote`!), napsat 30 MVP lekcí + otázky, obrázky/SVG schémata | 30 lekcí prochází validací, obsah zkontroloval učitel |
| **3. Interaktivní aktivity** (3–4 týdny) | Komponenty: párování, scénář, hledání chyby, kalkulačka; jednotné API `<Activity config onComplete>` | Všechny 4 typy hratelné na mobilu i s klávesnicí |
| **4. Gamifikace** (2 týdny) | XP, úrovně, odznaky, série + pojistka, denní výzva, boss level Rozvody, oslavné animace (vypínatelné) | Pilot ve třídě (kap. 15) |
| **5. Závěrečkové opakování** (3 týdny) | Dlaždice Zkouška: okruhy, Moje slabiny, rychlotesty, Zkouška nanečisto; mechanika „zrezivělých“ lekcí | 3. ročník projde zkoušku nanečisto |
| **6. Učitelský režim** (2 týdny) | Projektorový režim aktivity, „rychlá aktivita do hodiny“, odkaz/QR na lekci, čtení exportu pokroku | Učitel spustí aktivitu do 30 s od otevření aplikace |
| Dále | Simulace měření, skládání obvodu, pravdivostní tabulky, zbytek témat 2.–3. ročníku | průběžně po etapě 6 |

---

## 17. Zadání pro vývojáře / Cursor

> **Projekt: ElektroLab — offline-first PWA pro výuku oboru elektrikář**
>
> **Stack:** Vite + React + TypeScript. Bez backendu, bez přihlašování, bez externích CDN a fontů — vše bundlované lokálně (systémový font stack nebo lokální font). PWA se service workerem (precache celé aplikace) → funguje po prvním načtení zcela offline; distribuovatelné i jako složka na školní disk. Stav: Zustand (nebo React context) + persist do localStorage; obrázky jako lokální SVG.
>
> **Struktura:**
> ```
> src/
>  ├─ app/            # router (hash routing — funguje i z file://), layout, theme
>  ├─ screens/        # Home, Subject, Topic, LessonPlayer, Boss, Profile, Review, TeacherMode
>  ├─ components/
>  │   ├─ activities/ # PairMatch, DecisionScenario, FindFault, CalcTrainer (+ registry podle `type`)
>  │   ├─ lesson/     # ExplanationSteps, SafetyNote, MiniQuiz, KeySentence, RewardModal
>  │   └─ ui/         # Tile, ProgressRing, BatteryProgress, StreakFlame, BadgeCard
>  ├─ content/        # JSON: subjects/, topics/, lessons/, questions/, badges/ (import.meta.glob)
>  ├─ store/          # progressStore (persist), settingsStore (calmMode, grade)
>  ├─ lib/            # xp.ts (křivka úrovní), streak.ts, contentSchema.ts (zod), tts.ts
>  └─ assets/         # SVG schémata, ikony
> scripts/validate-content.ts   # CI kontrola obsahu (zod) — mj. povinné safetyNote u rizikových témat
> ```
>
> **Klíčové kontrakty:**
> - Každá aktivita implementuje `ActivityProps { config: unknown; calmMode: boolean; onComplete(result: {score: number; mistakes: string[]}): void }` a registruje se v `activities/registry.ts` pod svým `type` — LessonPlayer je na typech nezávislý.
> - Obsah validovat zodem při buildu; build spadne, když lekce v rizikovém předmětu (rozvody, měření, stroje, bezpečnost) nemá `safetyNote`.
> - Pokrok: pouze localStorage (klíč `elektrolab-progress-v1`), export/import jako stažený/nahraný JSON soubor. Žádná telemetrie, žádné síťové požadavky za běhu.
>
> **Hlavní obrazovky:** Home (dlaždice + denní výzva + XP pruh) · Subject (chips ročníků + cesta témat) · Topic (lekce, chyby z praxe, test, boss) · LessonPlayer (kroky šablony za sebou: háček → vysvětlení → aktivita → chyba → bezpečnost → test → věta → odměna) · Profile (odznaky, série, export/import, Klidný režim).
>
> **Přístupnost:** všechny aktivity ovladatelné klávesnicí (drag&drop má fallback klepni-klepni), aria-live pro zpětnou vazbu, kontrast AA, `prefers-reduced-motion` respektovat vždy (Klidný režim jej vynucuje), font-size škálovatelný přes nastavení (rem-based).
>
> **Bezpečnostní poznámky v kódu:** komponenta `<SafetyNote>` má jednotný výstražný vizuál a NELZE ji skrýt ani přeskočit auto-přechodem; v LessonPlayeru je samostatný krok.
>
> **První větev a commit:**
> - Větev: `feat/app-skeleton`
> - Commit 1: `chore: scaffold Vite + React + TS PWA, hash router, empty screens, content schema (zod) with required safetyNote, progress store with localStorage persist, one demo lesson (pair-match) end-to-end`
> - Definice hotovo pro commit 1: `npm run build` → složku `dist/` lze otevřít offline a projít demo lekci od dlaždice po odměnu.

---

## 18. Kontrolní seznam kvality

**Pedagogicky**
- [ ] Každá lekce má 1 jasný cíl a trvá reálně ≤ 10 min.
- [ ] Žák v každé lekci něco DĚLÁ (aktivita), nejen čte a klika kvíz.
- [ ] Špatná odpověď vždy vysvětlí PROČ a nabídne nový pokus bez trestu.
- [ ] Lekce trénuje aspoň jednu doloženou typickou chybu žáků.
- [ ] Mini test ověřuje dovednost z aktivity, ne memorování definice.
- [ ] Věta k zapamatování je krátká, konkrétní a v žákovském jazyce.

**Technicky**
- [ ] Aplikace funguje zcela offline (letadlový režim po prvním načtení).
- [ ] Žádné požadavky na externí domény (ověřit v network panelu).
- [ ] Pokrok přežije zavření prohlížeče; export/import JSON funguje.
- [ ] Běží plynule na starším školním zařízení / průměrném mobilu.
- [ ] Obsah prochází validačním skriptem bez chyb.

**Bezpečnostně**
- [ ] Každá riziková lekce má viditelnou, nepřeskočitelnou bezpečnostní poznámku.
- [ ] Nikde není postup vybízející k samostatné práci na reálném zařízení či pod napětím.
- [ ] „Zavolat učitele/odborníka“ je ve scénářích vždy správná volba.
- [ ] Simulované poruchy vždy vysvětlují reálný následek.
- [ ] Nikde nejsou citace konkrétních norem, které nebyly dodány.

**Gamifikačně**
- [ ] XP a odznaky odměňují učení a bezpečné chování, nikdy rychlost na úkor rozvahy u bezpečnostních témat.
- [ ] Série má „náhradní pojistku“ — jeden vynechaný den nedemotivuje.
- [ ] Boss level po prohře nabízí přípravu (lekce k zopakování), ne jen zámek.
- [ ] Denní výzva čerpá jen z probraného učiva.
- [ ] Slabší žák dosáhne na odměnu každý den (nízký práh: 1 lekce).

**Přístupnostně**
- [ ] Klidný režim: bez časovačů, animací a zvuků; krokovaný text.
- [ ] Vše ovladatelné klávesnicí; drag&drop má alternativu klepni-klepni.
- [ ] Kontrast AA, písmo min. 16 px, zvětšitelné.
- [ ] Věty krátké, jednotná terminologie, klíčové pojmy s mini-slovníčkem.
- [ ] Zpětná vazba je okamžitá a čitelná i bez barvy (ikona + text).
