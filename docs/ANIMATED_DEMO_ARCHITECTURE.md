# Architektura animovaných dem (MVP-11A)

Společný, znovupoužitelný rámec pro pohyblivé výukové ukázky ElektroLabu.
**První a jediná referenční implementace je `ContactorRelayDemo`**
(`src/components/demos/ContactorRelayDemo.tsx`) — každé další animované demo
(transformátor, asynchronní motor, regulační smyčka, snímače, obvody, měřicí
přístroje…) vzniká podle tohoto vzoru, nikdy jako paralelní systém.

Pro coding agenty existuje samostatný skill:
`skills/electrolab-animated-demo/SKILL.md`.

## Účel rámce

- Dát všem pohyblivým ukázkám **stejné ovládání, stejný stavový model a
  stejná pravidla pohybu** (Klidný režim, reduced motion, projektor).
- Oddělit **pedagogické kroky** (co má žák pochopit) od **vizuálních efektů**
  (jak se to nakreslí).
- Zajistit, že animace je vždy volitelná, zastavitelná a plně popsaná textem.

Animace v ElektroLabu jsou **názorné školní ukázky**, ne fyzikálně přesné
simulace přechodových dějů — a dokumentace i texty dem to musí říkat.

## Struktura komponent

```
src/components/animation/
├─ useMotionPolicy.ts       # calmMode + prefers-reduced-motion → pravidla pohybu
├─ useAnimatedDemo.ts       # stavový model přehrávání (idle/playing/paused/completed)
└─ AnimatedDemoControls.tsx # jednotná tlačítka Spustit/Pauza/Další krok/Resetovat

src/components/demos/
└─ ContactorRelayDemo.tsx   # referenční demo: SVG schéma + kroky + texty
```

Demo komponenta zachovává veřejný kontrakt všech dem:
`{ demo, calmMode, onContinue }` — renderuje ji beze změny
`InteractiveDemoRenderer` (exhaustive switch zůstává).

## Datový tok

```
LessonPage
  └─ InteractiveDemoRenderer (switch podle demo.type)
       └─ ContactorRelayDemoView({ demo, calmMode, onContinue })
            ├─ useMotionPolicy(calmMode)  → MotionPolicy
            ├─ useAnimatedDemo({ stepCount, autoPlayAllowed }) → playback
            ├─ AnimatedDemoControls (tlačítka + textový stav, aria-live)
            ├─ SVG schéma (odvozené z playback.stepIndex)
            ├─ textový výpis stavu zařízení
            └─ tlačítko „Rozumím…“ ← playback.hasCompletedOnce
```

Jediný zdroj pravdy o průběhu je `playback.stepIndex` + `playback.status`.
Vizuální příznaky (`coilOn`, `contactClosed`, …) se **odvozují** z indexu
kroku čistou funkcí — demo nemá druhý, skrytý stav.

## Stav přehrávání (`useAnimatedDemo`)

Deterministický stavový model:

| stav        | význam                                                    |
| ----------- | --------------------------------------------------------- |
| `idle`      | po otevření / po Resetu; nic se nehýbe, zobrazen krok 0   |
| `playing`   | kroky se posouvají samy po `stepDurationMs` (~1,8 s)      |
| `paused`    | pohyb stojí na aktuálním kroku                            |
| `completed` | žák došel k poslednímu kroku                              |

Přechody:

- `play()` — `idle`/`paused` → `playing`; při zakázaném autoplay
  (`autoPlayAllowed: false`) nedělá nic.
- `pause()` — `playing` → `paused`; zruší naplánovaný timeout.
- `nextStep()` — funguje z `idle`, `paused` i `playing` (přehrávání tím
  zastaví); posune o jeden pedagogický krok a zůstane v `paused`.
  Na posledním kroku přejde do `completed`.
- `reset()` — kdykoli → `idle`, krok 0. **Nevrací** příznak
  `hasCompletedOnce` — už dosažené povolení pokračovat v lekci zůstává.

### Krokování

Pedagogický krok = jeden stav, který má vlastní název a vysvětlení
(v referenčním demu pole `STEPS` se 6 kroky). Automatické přehrávání jen
prochází tytéž kroky časovačem — **krokování ručně a autoplay vedou vždy ke
stejným obrazovkám**, nikdy neexistuje stav dosažitelný jen jednou cestou.

### Reset

`reset()` vrátí krok 0 a stav `idle`. Protože `hasCompletedOnce` zůstává,
tlačítko „Rozumím, pokračovat na úkol“ po Resetu nezešedne — v rámci jednoho
otevření lekce se povolení neodebírá (stejně jako u ostatních dem).

## Časování: proč setTimeout, ne setInterval ani rAF

- Postup mezi kroky je **diskrétní** (1 krok ≈ 1,8 s) — hook plánuje **jeden
  `setTimeout` na krok** a v cleanup efektu ho ruší. Nikdy neběží dva
  časovače najednou.
- **`setInterval` se pro plynulé animace nepoužívá**: tiká dál i když je
  záložka v pozadí (throttlovaný), snadno se „rozjede“ se stavem Reactu,
  hromadí zpožděné ticky a při zapomenutém `clearInterval` uniká.
- **`requestAnimationFrame` je tu záměrně vynechán**: plynulý pohyb uvnitř
  kroku obstarávají CSS přechody a CSS animace, které prohlížeč sám
  optimalizuje i pozastavuje. rAF je oprávněný až u dem, která potřebují
  každý snímek počítat (např. průběžně kreslený průběh signálu). Pokud ho
  budoucí demo použije, musí: uložit id snímku, rušit ho při pause/reset/
  unmount, po návratu záložky navázat bez skoku a nikdy netočit
  nekontrolovanou nekonečnou smyčku.

## Kdy použít kterou techniku

- **CSS transition** — jednorázová změna polohy/průhlednosti mezi dvěma
  stavy (kotva, můstek kontaktu, spínač, zvýraznění vodičů). Výchozí volba.
- **SVG atributy / JSX props** — samotná geometrie schématu a stavy, které
  se mění skokem (souřadnice, texty, třídy). Poloha pohyblivých částí se
  mění CSS transformací (`transform: translateY(...)`), ne přepočtem všech
  souřadnic.
- **CSS animation (@keyframes)** — opakovaný pohyb, dokud trvá stav (rotor
  motoru). Pauza = `animation-play-state: paused`, nikdy odstranění třídy
  uprostřed (to by skokem vrátilo úhel).
- **requestAnimationFrame** — až když je potřeba počítat hodnoty každý
  snímek; viz pravidla výše.

## Klidný režim (calmMode)

`useMotionPolicy(calmMode)` vrací `allowAutoPlay: false` a
`allowContinuousMotion: false`, když je Klidný režim zapnutý:

- `AnimatedDemoControls` pak **vůbec nenabízí Spustit/Pauza** — demo se
  prochází jen tlačítkem „Další krok“ (+ Resetovat),
- rotor a jiné opakované pohyby se nespouštějí,
- přechody mezi stavy jsou okamžité — globální pravidlo
  `.calm-mode * { transition: none; animation: none }` v `index.css`,
- veškeré informace zůstávají: texty kroků, výpis stavu, aria-live.

Když se Klidný režim zapne uprostřed přehrávání, hook běžící animaci
pozastaví (efekt nad `autoPlayAllowed`).

## prefers-reduced-motion

`useMotionPolicy` sleduje `matchMedia('(prefers-reduced-motion: reduce)')`
včetně změny za běhu. Chová se **minimálně stejně opatrně jako Klidný
režim**: žádný autoplay, žádná rotace ani pulzování, krokování a texty
zůstávají. Vizuální přechody navíc vypíná CSS blok
`@media (prefers-reduced-motion: reduce)` u tříd dema. Jsou-li aktivní
Klidný režim i reduced motion zároveň, výsledek je stejný — pohyb se nikdy
nevynucuje.

## Projektorový režim

Projektor je vlastnost aplikace (třída `projector-mode` zvětšuje text,
progress se neukládá — řeší `App.tsx`). Animační rámec do toho nijak
nezasahuje: **ovládání ani hook nezapisují progress, XP, localStorage ani
sessionStorage**, takže v projektorovém režimu se nic neukládá automaticky.
Demo musí zůstat čitelné a ovladatelné i na projektoru (velká tlačítka,
texty mimo SVG).

## Viditelnost záložky a cleanup

- `useAnimatedDemo` poslouchá `visibilitychange`: při schování dokumentu
  zruší timeout a `playing` → `paused`. Po návratu se nic nedohání — žák
  pokračuje sám, kroky se nepřeskočí a nevzniknou duplicitní časovače.
- Cleanup efektu ruší timeout při pauze, resetu i **unmountu** (odchod
  z lekce). Listener `visibilitychange` i `matchMedia` se při unmountu
  odhlašují.
- CSS animace a přechody zaniknou s odpojeným DOM samy.

## Focus a přístupnost

- Tlačítka jsou skutečné `<button>` se stálým textovým názvem („Spustit“,
  „Pauza“, „Další krok“, „Resetovat“); ikony jsou `aria-hidden`. Spustit a
  Pauza jsou **dvě samostatná tlačítka** (nepřepínají se v jedno), takže
  focus při ovládání klávesnicí nikam neskáče; nedostupné akce jsou
  `disabled`.
- Globální `:focus-visible` styl aplikace platí i tady.
- Stav a krok oznamuje jediný `role="status"` (aria-live polite) řádek
  v ovládání: „Krok X z N: Název — stav“. Jediná live oblast = žádné dvojí
  předčítání.
- SVG má `aria-hidden="true"` — **všechna informace ze schématu je souběžně
  v textu** (výpis stavu zařízení + popis kroku). Animace nikdy není jediným
  nositelem informace a stav se nikdy nesděluje jen barvou (vodiče pod
  proudem mění i tloušťku, kontakt polohu, motor má textový stav).
- Žádné blikání, žádné vysokofrekvenční změny.

## Propojení s onContinue

Demo si drží `playback.hasCompletedOnce` — nastaví se, jakmile žák poprvé
dojde k poslednímu pedagogickému kroku (autoplayem nebo krokováním), a už
se nevrací. Tlačítko „Rozumím, pokračovat na úkol“ je do té doby `disabled`.
`onContinue` jen přepne krok lekce (`LessonPage`), progress zapisují až
aktivita/kvíz — demo samo nikdy.

## Jak přidat další animované demo

1. Přečti skill `skills/electrolab-animated-demo/SKILL.md` a tento dokument.
2. Projdi referenční `ContactorRelayDemo.tsx` — strukturu kopíruj.
3. Navrhni **pedagogické kroky** (5–7, každý s názvem a vysvětlením) a nech
   je schválit učitelem dřív, než kreslíš.
4. Postav vizuální stav jako čistou funkci `stepIndex` → příznaky.
5. Použij `useMotionPolicy` + `useAnimatedDemo` + `AnimatedDemoControls` —
   žádná vlastní tlačítka, žádný vlastní časovač.
6. Nakresli SVG schéma (viewBox, CSS třídy s prefixem dema, tokeny barev
   z `:root`), pohyb dělej CSS transformacemi.
7. Přidej CSS do `index.css` do sekce MVP-11A včetně bloku
   `@media (prefers-reduced-motion: reduce)`.
8. Doplň textový výpis stavu a popisy kroků; ověř Klidný režim.
9. Projdi QA checklist ve skillu, spusť `npm run check`.

Jedno demo = jedna větev = jeden PR. Další demo začni až po sloučení
předchozího.
