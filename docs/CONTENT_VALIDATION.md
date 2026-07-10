# Validace obsahu ElektroLabu

Automatická kontrola datové konzistence celé aplikace. Spouští se lokálně
i v CI a blokuje sloučení nevalidních dat do main.

## Spuštění

```bash
npm run validate:content   # jen validace obsahu
npm run check              # validace + typecheck + lint + build
```

Výstup: souhrn počtů entit, výpis všech chyb a varování, `PASS`/`FAIL`.
Exit code 1 při alespoň jedné chybě (CI tím selže), 0 jinak.

## Co validátor kontroluje

Kód: `src/validation/contentValidation.ts` (čisté funkce, data se předávají
parametrem — žádné vedlejší efekty, žádné DOM API).

- **Globální ID** — unikátnost subject/topic/lesson/badge ID, žádná prázdná,
  URL-safe znaky (error) a kebab-case konvence (warning).
- **Vazby** — topic→subject, lesson→subject/topic, shoda předmětu a ročníku
  lekce s tématem, ročník v rozsahu předmětu, aktivní předmět má aktivní
  lekci, aktivní lekce pod zamčeným tématem (warning).
- **safetyNote** — existuje, není prázdná ani placeholder; příliš krátká
  poznámka je jen warning.
- **Mini testy** — text, ≥2 možnosti, unikátní ID možností i otázek,
  correctOptionId existuje, vysvětlení vyplněné, žádné placeholdery.
- **Aktivity** — vyčerpávající `switch` přes celý union `LessonActivity`
  s `assertNever`; pravidla pro každý typ (unikátní ID, správné odpovědi
  mezi možnostmi, kompletní correctPairs/correctOrder, neprázdné texty
  a volitelné popisky).
- **Interaktivní dema** — vyčerpávající `switch` přes union `InteractiveDemo`
  s `assertNever`; titulek a popis neprázdné. Lekce bez dema je legitimní.
- **Odznaky** — unikátní ID, neprázdné texty, lesson.badgeId existuje,
  předmětové odznaky (`src/data/subjectBadges.ts`) odkazují na existující
  předměty a odznaky, bez duplicit.
- **Final exam** — deleguje na existující pravidla
  v `src/features/finalExam/finalExamValidation.ts` (bez duplikace logiky);
  prázdný registr je platný, chyby published obsahu blokují.

## Error vs. warning

- **Error** = data jsou rozbitá nebo by rozbila aplikaci (chybějící
  reference, duplicitní ID, chybějící safetyNote…). Blokuje CI.
- **Warning** = funguje to, ale vybočuje z konvence nebo zaslouží lidskou
  pozornost (ne-kebab-case ID, krátká safetyNote…). CI neblokuje; posuzuje
  se v code review.

## Jak přidat pravidlo pro nový activity.type

1. Přidej variantu do unionu `LessonActivity` v `src/types.ts`.
2. Typecheck OKAMŽITĚ spadne na `assertNever` ve `validateActivity` —
   to je záměr.
3. Doplň `case` s pravidly podle datového kontraktu nové aktivity.
4. Stejně spadne i `ActivityRenderer`? Ne — tam přidej větev ručně;
   validátor ale nový typ bez pravidel nepustí přes typecheck.

## Jak přidat pravidlo pro nový interactiveDemo.type

1. Přidej config do unionu `InteractiveDemo` v `src/types.ts`.
2. Typecheck spadne na `assertNever` ve `validateDemo` (validátor)
   i v `InteractiveDemoRenderer` (UI) — doplň obě větve.
3. Má-li nové demo bohatší konfiguraci než `{type, title, description}`,
   napiš pro ni pravidla do příslušného `case`.

## Validace obsahového batche (final exam)

Před commitem a před publikací každé dávky závěrečkového obsahu je
`npm run validate:content` POVINNÉ — viz
`docs/FINAL_EXAM_CONTENT_BATCH_CHECKLIST.md` a
`skills/electrolab-final-exam-content/SKILL.md`.

## Migrace historických lesson ID

Historické ID `zakladni-znacKy` (vybočovalo z kebab-case) bylo v MVP-10B
přejmenováno na `zakladni-znacky` pomocí bezpečné legacy alias migrace —
modul `src/lib/lessonIdMigration.ts`:

- **Proč existuje:** přejmenování lesson ID by jinak rozbilo staré hash
  odkazy a uložený pokrok žáků (`elektrolab-progress`,
  `elektrolab-last-lesson`).
- **Co dělá:** `loadProgress()` při načtení jednorázově převede legacy
  klíče pokroku na canonical (sloučí bez duplicit, XP/odznaky nemění,
  uloží jen při skutečné změně — idempotentní); pokračovací box migruje
  uložené poslední ID; hash routing rozpozná
  `#/lesson/zakladni-znacKy`, otevře novou lekci a adresu tiše nahradí
  canonical tvarem bez přidání historie.
- **Aliasy se NESMÍ odstranit** bez vědomého rozhodnutí o ukončení zpětné
  kompatibility (staré odkazy v sešitech žáků, záložky, uložený pokrok).
- Validátor mapu aliasů kontroluje (canonical existuje, legacy už není
  produkční ID, žádné řetězení).

## Zásady

- CI (`.github/workflows/ci.yml`) blokuje nevalidní data při každém PR
  a pushi do main.
- Validátor **nikdy automaticky nemění výukový obsah** — jen hlásí.
- Skutečné opravy obsahu (texty, znění, bezpečnostní poznámky) musí projít
  učitelskou kontrolou; technická oprava bez změny významu (překlep v ID)
  se řeší běžným PR s popisem.
