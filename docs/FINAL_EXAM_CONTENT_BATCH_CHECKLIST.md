# Checklist obsahového batche závěrečné zkoušky

Používá se pro KAŽDOU dávku okruhů. Dávka = vlastní větev
`content/final-exam-batch-N-popis`, max. ~10 okruhů.

## Před vložením

- [ ] Znám zdroj otázek (dokument, rok, kdo dodal) — bez zdroje STOP
- [ ] Mám PŘESNÉ znění každé otázky (ne parafrázi, ne jen téma)
- [ ] Učitel souhlasí s vložením této dávky
- [ ] Vím, kolik otázek dávka obsahuje a že jich není přes ~10
- [ ] Každá otázka má určené předměty (`subjectIds` existují v subjects.ts)
- [ ] U každé otázky je posouzeno bezpečnostní riziko (potřeba safetyNote?)

## Při vložení (každý okruh)

- [ ] Stabilní id `zz-…` (slug, ne číslo), unikátní
- [ ] `status: 'draft'`, `sourceVerified: false`
- [ ] Vyplněná `sourceReference` (popis, dodavatel, datum)
- [ ] `relatedLessonIds` odkazují jen na existující lekce
- [ ] `safetyNote` u rizikových témat (formulace jako v lekcích)
- [ ] `answerOutline` odděluje výuku od oficiálního zadání
- [ ] `practiceItems` mají unikátní id, správnou odpověď mezi možnostmi
      a neprázdné vysvětlení
- [ ] Žádný placeholder `__…__` nezůstal v hodnotách

## Před publikací (celá dávka)

- [ ] Pedagogická kontrola (učitel: srozumitelnost, úroveň, cíle)
- [ ] Obsahová kontrola (znění beze změn proti zdroji, osnova odpovědi správná)
- [ ] Bezpečnostní kontrola (safetyNote, žádné návody k práci na zařízení,
      rizikové scénáře končí bezpečnou volbou)
- [ ] `npm run validate:content` — PASS, 0 chyb, varování posouzena
      (zahrnuje pravidla `validateFinalExamTopics`)
- [ ] Kontrola odkazů (subjectIds, relatedLessonIds, practiceItems)
- [ ] Přístupnost (texty čitelné, žádný význam jen barvou, žádné časovače)
- [ ] Mobilní zobrazení zkontrolováno
- [ ] Projektorový režim zkontrolován (a neukládá pokrok)
- [ ] Klidný režim zkontrolován
- [ ] `npm run typecheck` ✅
- [ ] `npm run lint` ✅
- [ ] `npm run build` ✅
- [ ] Ruční QA průchod (žák uvidí jen published, drafty nikde)

## Po publikaci

- [ ] Před commitem znovu `npm run validate:content` — PASS
- [ ] Commit (`content: publish final exam batch N`)
- [ ] Technická kontrola JINÝM agentem (typy, validace, diff registru)
- [ ] Push větve
- [ ] PR do hlavní větve (pozor: hlavní větev je
      `feat/electrolab-mvp-1-zaklady-five-lessons`, ne `main`)
- [ ] Merge po schválení
- [ ] Release poznámka: kolik okruhů, jaké předměty, zdroj, stav
      (+ aktualizace docs/FINAL_EXAM_EXTENSION_STATUS.md)
