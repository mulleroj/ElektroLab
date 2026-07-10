# Integrační kontrakt: budoucí UI závěrečkového režimu

Závazná pravidla pro agenta, který bude implementovat UI „Přípravy na
závěrečnou zkoušku". Cíl: režim musí vypadat a chovat se jako zbytek
ElektroLabu — žádný druhý design systém.

## Routing

- Hash routing přes existující `src/lib/routing.ts` — rozšířit `Route` union
  a `parseHash`/`navigate` o nové stránky (vzor: přidání `teacher` v MVP-3).
- Navrhované routy: `#/exam` (přehled okruhů), `#/exam/topic/<topicId>`.
- Routa `#/exam` smí být dosažitelná JEN když
  `finalExamConfig.featureEnabled && contentReady`; jinak zobrazit stávající
  vzor „nedostupné" stránky (viz `error-page` v `App.tsx`) s vysvětlením.
- Refresh (F5) na každé exam routě musí fungovat — žádný stav jen v paměti.

## AppShell a globální komponenty

- Vše se renderuje UVNITŘ stávajícího `<AppShell>` — **zákaz vlastního
  druhého AppShellu**, hlavičky, patičky nebo vlastní navigace.
- Bezpečnostní poznámky výhradně komponentou `SafetyNote`
  (`src/components/SafetyNote.tsx`) — **zákaz duplikace** této komponenty;
  poznámka vždy nahoře, nepřeskočitelná.
- Procvičovací otázky přes existující `Quiz` (`src/components/Quiz.tsx`) —
  `FinalExamPracticeItem` má záměrně stejný tvar jako `QuizQuestion`.
- Názvy předmětů a lekcí se NIKDY nekopírují ručně — vždy přes
  `getSubjectById()` / `getLessonById()` a jejich `title`.

## Vizuální systém

Znovu použít existující třídy a tokeny z `src/index.css`:

- karty: `subject-card`, `topic-card`, `lesson-card` vzory,
- tlačítka: `btn`, `btn--primary`, `btn--secondary`, `btn--large`, `btn--active`,
- štítky: `tag` (+ `tag--safety`, `tag--demo`),
- progress: `subject-progress`, `progress-overview` vzory,
- kroky: `lesson-steps` s číslováním,
- zpětná vazba: `feedback feedback--success/error`, neutrální `logic-gate__explain`,
- design tokeny: CSS proměnné z `:root` (`--color-*`, `--radius`, `--shadow`).

**Zákazy:** jiný systém tlačítek, nový barevný systém, nové breakpointy bez
důvodu (existuje 640px vzor), externí fonty/ikony/knihovny.

## Režimy aplikace

- **Klidný režim** (`calmMode`): předávat prop jako v `LessonPage`; krokovaný
  obsah, žádné animace/časovače; `calm-step-hint` pro nápovědu kroku.
- **Projektorový režim** (`projectorMode`): větší text řeší CSS třída
  `projector-mode` automaticky; v projektoru se NIKDY neukládá pokrok
  (vzor: `handleActivityComplete` v `App.tsx`).
- **Učitelský režim**: publikované okruhy se v `TeacherPage` objeví stejným
  vzorem jako lekce (čas, typ, safetyNote, „kdy použít").

## Stavy obsahu

Exam přehled musí umět čtyři stavy (bez nových vizuálních vzorů):

1. **unavailable** — feature vypnutá: stávající vzor zamčené dlaždice/error-page
   s textem „Závěrečkový režim bude zpřístupněn po vložení a ověření
   skutečných zkušebních okruhů."
2. **empty** — feature zapnutá, ale 0 published okruhů: `empty-state` třída
   („Zatím tu nejsou žádné okruhy…").
3. **error** — validace published obsahu selhala: obsah se NEZOBRAZÍ,
   místo něj `error-page` vzor; chyba jde do konzole přes
   `reportFinalExamValidation`.
4. **loading** — aplikace je synchronní (statická data), loading stav se
   neřeší; NEZAVÁDĚT spinnery.

## Odkazy zpět do lekcí

- `relatedLessonIds` → odkazy `#/lesson/<id>` (přes `navigate()`), zobrazené
  jako existující `lesson-card`/tlačítka.
- Před renderem ověřit existenci lekce (`getLessonById`); neexistující id
  tiše vynechat a zalogovat varování (nesmí shodit stránku).

## Pokrok

- Závěrečkový pokrok NIKDY nezapisovat do `elektrolab-progress`
  (jeho formát je zmrazený).
- Až bude potřeba, založit NOVÝ klíč `elektrolab-exam-progress-v1`
  s vlastním tvarem a vlastním load/save modulem (vzor `src/lib/progress.ts`),
  vč. bezpečného chování při nedostupném localStorage (try/catch).
- XP a odznaková logika lekcí se NEROZŠIŘUJE bez samostatného zadání.

## Bundle

- Feature vypnutá = žádné vedlejší efekty; moduly `finalExam` nesmí být
  importovány z runtime cest, dokud se UI neimplementuje (tree-shaking).
