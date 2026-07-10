# SKILL: Doplnění obsahu závěrečné zkoušky do ElektroLabu

Určeno pro coding agenty (Fable, Cursor a další), kteří budou do aplikace
ElektroLab doplňovat **skutečné, dodané** okruhy závěrečné zkoušky.

---

## 1. Účel skillu

Bezpečně a opakovatelně přidávat obsah závěrečné zkoušky do registru
`src/features/finalExam/finalExamRegistry.ts` — po malých dávkách, s validací,
bez vymýšlení otázek a bez narušení existující aplikace (23 lekcí, 6 předmětů,
XP/odznaky, localStorage, učitelský a projektorový režim).

**Tento skill NENÍ o implementaci závěrečkového UI.** UI se řeší samostatně
podle `docs/FINAL_EXAM_UI_INTEGRATION_CONTRACT.md`.

## 2. Co musíš přečíst před začátkem

V tomto pořadí:

1. `docs/FINAL_EXAM_EXTENSION_STATUS.md` — aktuální stav featury
2. `src/features/finalExam/finalExamTypes.ts` — datový kontrakt
3. `src/features/finalExam/finalExamValidation.ts` — co se validuje
4. `docs/FINAL_EXAM_CONTENT_BATCH_CHECKLIST.md` — checklist batche
5. `docs/FINAL_EXAM_SCHEMA_VERSIONING.md` — verzování schématu
6. `src/data/subjects.ts` a `src/data/lessons.ts` — platná id předmětů a lekcí
7. `templates/final-exam-topic.template.ts` (v tomto adresáři) — šablona záznamu

**Nezačínej implementací.** Nejdřív ověř zdroj dodaných otázek (kap. 14).

## 3. Co smíš a nesmíš měnit

**Smíš:**
- přidávat záznamy do `finalExamRegistry.ts`,
- rozšiřovat validaci o přísnější kontroly (nikdy ji neoslabuj),
- po schválení učitelem měnit `status` a `sourceVerified` záznamů,
- aktualizovat `docs/FINAL_EXAM_EXTENSION_STATUS.md`.

**Nesmíš:**
- měnit formát localStorage klíče `elektrolab-progress`,
- měnit ani mazat existující lekce, předměty, témata, odznaky,
- měnit znění oficiální otázky bez potvrzení učitele,
- zapínat `featureEnabled`/`contentReady` v `finalExamConfig.ts` — to je
  samostatné rozhodnutí uživatele po splnění checklistu,
- vytvářet nový vizuální systém (viz UI kontrakt),
- přidávat backend, účty, cloud, Service Worker, CDN, knihovny,
- přepisovat NAVRH_APLIKACE.md.

## 4. Datový kontrakt

Jediný zdroj pravdy: `src/features/finalExam/finalExamTypes.ts`
(typ `FinalExamTopic` + pomocné typy). Klíčové zásady:

- `officialTitle` a `officialText` = **přesné dodané znění**, žádné parafráze.
- `answerOutline` a `explanationSections` = **výuková opora**, důsledně
  oddělená od oficiálního zadání.
- `sourceReference` je povinná; `sourceVerified: true` až po potvrzení učitelem.
- `schemaVersion` = `FINAL_EXAM_SCHEMA_VERSION` (aktuálně 1).
- Obsah se NIKDY nekopíruje do více míst — vše žije jen v registru
  a odkazuje se přes id (`subjectIds`, `relatedLessonIds`).

## 5. Pravidla stabilních ID

- Formát: kebab-case slug s prefixem `zz-`, např. `zz-transformatory-princip`.
- ID popisuje téma, **nikdy** jen pořadové číslo (`zz-01` je zakázané).
- ID se po publikaci NIKDY nemění (váže se na něj budoucí pokrok žáků).
- Při stažení okruhu se používá `status: 'archived'`, záznam se nemaže.

## 6. Pravidla bezpečnostního obsahu

- Okruh dotýkající se elektrického zařízení, měření, práce nebo manipulace
  MUSÍ mít `safetyNote` — validace to vynucuje.
- Formulace jako ve zbytku aplikace: „školní simulace", „pod dohledem učitele",
  „nepokračovat / učitel / odborník", u VN/VVN „držet odstup".
- Vysvětlení nesmí být návodem k práci na skutečném zařízení pod napětím.
- Rizikové scénáře v `practiceItems` musí mít jako správnou odpověď
  bezpečné rozhodnutí, nikdy riskantní zkratku.

## 7. Pravidla vizuální konzistence

Obsah piš tak, aby fungoval ve stávajících komponentách (viz UI kontrakt):

- vysvětlení v krátkých odstavcích, klíčové pojmy `**tučně**` jako v lekcích,
- `practiceItems` mají přesně tvar `QuizQuestion` (komponenta `Quiz`),
- žádné HTML, žádné obrázky, žádné externí odkazy v textech,
- česky, žákovským jazykem, věty krátké (viz Klidný režim).

## 8. Postup přidání JEDNÉ otázky

1. Zkopíruj `templates/final-exam-topic.template.ts` obsah do registru
   (šablonu samotnou needituj).
2. Nahraď VŠECHNY placeholdery `__NAZEV__` skutečnými dodanými hodnotami.
3. Nastav `status: 'draft'`, `sourceVerified: false`, `version: 1`.
4. Vyplň `sourceReference` podle skutečného zdroje.
5. Ověř, že `subjectIds` a `relatedLessonIds` existují v datech.
6. Spusť validaci (kap. 10) — draft smí mít prázdné výukové části,
   ale nesmí mít chyby v id, zdroji ani vazbách.
7. Commitni jako draft (kap. 12).
8. Po kontrole učitelem: doplň výukové části, nastav `reviewed`,
   `sourceVerified: true`, `lastReviewedAt` — znovu validace, commit.
9. `published` nastavuje až finální krok batche po projití celého checklistu.

## 9. Postup přidání CELÉ DÁVKY otázek

1. Jedna dávka = max. ~10 okruhů = **vlastní git větev**
   (`content/final-exam-batch-N-popis`).
2. Před začátkem: pracovní strom čistý, hlavní větev aktuální,
   předchozí batch sloučený.
3. Každý okruh projde postupem z kap. 8.
4. Na konci dávky: validace celého registru, typecheck, lint, build, QA
   podle `docs/FINAL_EXAM_CONTENT_BATCH_CHECKLIST.md`.
5. Commit → technická kontrola JINÝM agentem → push → PR → merge.
6. Nikdy nezačínej další dávku, dokud předchozí není sloučená.

## 10. Povinné validace

- **`npm run validate:content` je POVINNÉ před každým commitem a před
  publikací každého batche** — spouští validaci celého obsahu včetně
  final-exam registru (pravidla z
  `src/features/finalExam/finalExamValidation.ts`) a musí skončit `PASS`
  (varování posuď a zdůvodni v PR).
- Totéž hlídá CI při každém PR (`.github/workflows/ci.yml`) — nevalidní
  data neprojdou do main.
- Vždy také: `npm run typecheck && npm run lint && npm run build`
  (nebo souhrnně `npm run check`).

## 11. QA checklist

Po každé dávce ověř minimálně:

- [ ] 6 stávajících předmětů a všech 23 lekcí funguje beze změny
- [ ] validace registru: 0 chyb
- [ ] žádný placeholder `__…__` mimo šablonu
- [ ] žádný draft není viditelný žákům (published filtr)
- [ ] XP se nepřičítá opakovaně, odznaky se neduplikují
- [ ] onboarding, učitelský, projektorový a Klidný režim fungují
- [ ] hash routing + refresh fungují
- [ ] konzole bez chyb

## 12. Git workflow

- Větev na dávku: `content/final-exam-batch-N-popis`.
- Commit zprávy: `content: add final exam batch N (draft)`,
  `content: review final exam batch N`, `content: publish final exam batch N`.
- Žádný commit bez proběhlé validace a kontrol.
- Merge do hlavní větve `main` přes PR.
- NIKDY force-push, NIKDY přepis historie publikovaného obsahu.

## 13. Handoff pro dalšího agenta

Na konci každé dávky zapiš do PR (a aktualizuj
`docs/FINAL_EXAM_EXTENSION_STATUS.md`):

- kolik okruhů přidáno a v jakém stavu (draft/reviewed/published),
- zdroj a kdo znění potvrdil,
- výsledky validace a kontrol,
- co zbývá (nepřiřazené okruhy, chybějící lekce, otevřené otázky),
- přesný další krok.

## 14. STOP podmínky — kdy NESMÍŠ pokračovat

Zastav a napiš uživateli, pokud platí cokoli z tohoto:

- není známý zdroj otázky (kdo ji dodal, odkud pochází),
- není jasné, zda jde o oficiální, nebo učitelskou otázku,
- chybí přesné znění (máš jen téma nebo parafrázi),
- musel bys otázku, číslo okruhu nebo znění **domyslet**,
- chybí bezpečnostní ověření obsahu u rizikového tématu,
- `relatedLessonIds` odkazují na neexistující lekce a nevíš, co s tím,
- published obsah neprochází validací,
- pracovní strom není čistý,
- předchozí batch není commitnutý/sloučený,
- hlavní větev není synchronizovaná s originem,
- `npm run typecheck`, `lint` nebo `build` neprochází.

**Nikdy nevymýšlej otázky, okruhy, normové hodnoty ani požadavky školy.
Když si nejsi jistý, zastav se a zeptej se.**
