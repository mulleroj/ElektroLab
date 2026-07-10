# Stav rozšíření: Příprava na závěrečnou zkoušku

Poslední aktualizace: 2026-07-10 (větev feat/electrolab-mvp-9a-final-exam-extension-kit)

## Co JE připravené

- **Datový kontrakt** — `src/features/finalExam/finalExamTypes.ts`
  (`FinalExamTopic` + pomocné typy, `schemaVersion = 1`).
- **Prázdný registr** — `src/features/finalExam/finalExamRegistry.ts`
  s bezpečnými dotazovacími funkcemi (fungují i nad prázdným polem).
- **Validace** — `src/features/finalExam/finalExamValidation.ts`
  (strukturované chyby/varování; prázdný registr je platný).
- **Feature flag** — `src/features/finalExam/finalExamConfig.ts`
  (`featureEnabled: false`, `contentReady: false`).
- **Skill pro agenty** — `skills/electrolab-final-exam-content/SKILL.md`
  + šablona záznamu v `templates/`.
- **UI kontrakt** — `docs/FINAL_EXAM_UI_INTEGRATION_CONTRACT.md`.
- **Batch checklist** — `docs/FINAL_EXAM_CONTENT_BATCH_CHECKLIST.md`.
- **Verzování schématu** — `docs/FINAL_EXAM_SCHEMA_VERSIONING.md`.
- Dlaždice „Příprava na závěrečnou zkoušku" vysvětluje, že čeká na okruhy.

## Co NENÍ připravené (záměrně)

- Žádné skutečné okruhy ani otázky (nebyly dodány).
- Žádné UI závěrečkového režimu (routy `#/exam` neexistují).
- Žádný závěrečkový pokrok/localStorage klíč.
- Žádné napojení na XP/odznaky.
- Žádný npm script pro validaci (viz „Zapojení validace" níže).

## Proč je feature vypnutá

Nemáme oficiální seznam závěrečných otázek. Aplikace nesmí prezentovat
vymyšlený obsah jako přípravu na zkoušku — feature se zapne až po dodání,
vložení a ověření skutečných okruhů.

## Co je potřeba dodat

1. Oficiální seznam okruhů/otázek (dokument, rok platnosti).
2. Přesná znění otázek (ne parafráze).
3. Kontakt/roli učitele, který znění potvrdí (`sourceVerified`).
4. Informaci, které okruhy patří ke kterým předmětům/ročníkům.
5. Souhlas s publikací po jednotlivých dávkách.

## Přesný další krok po získání otázek

1. Otevřít `skills/electrolab-final-exam-content/SKILL.md` a projít STOP
   podmínky (kap. 14).
2. Založit větev `content/final-exam-batch-1-<popis>` z hlavní větve
   (`feat/electrolab-mvp-1-zaklady-five-lessons`).
3. Vložit první dávku (max ~10 okruhů) jako `draft` podle šablony.
4. Spustit validaci + typecheck/lint/build, commitnout draft.
5. Nechat zkontrolovat učitelem → `reviewed` → checklist před publikací →
   `published`.
6. Teprve po splnění `minimumPublishedTopics` a celého checklistu samostatně
   rozhodnout o zapnutí `featureEnabled` a implementaci UI podle
   `docs/FINAL_EXAM_UI_INTEGRATION_CONTRACT.md`.

## Zapojení validace (než vznikne npm script)

Validace je čistá funkce bez závislostí. Spouští se jednou z cest:

- dočasně přidat `reportFinalExamValidation(finalExamTopics)` do
  `src/main.tsx` za `validateAllLessons()` a sledovat konzoli dev serveru
  (po kontrole volání odstranit, dokud je feature vypnutá), nebo
- v konzoli prohlížeče nad dev serverem:
  `const m = await import('/src/features/finalExam/finalExamValidation.ts');`
  `const r = await import('/src/features/finalExam/finalExamRegistry.ts');`
  `m.reportFinalExamValidation(r.finalExamTopics)`.

Samostatný `npm run validate:final-exam` by dnes vyžadoval novou závislost
(spouštění TS mimo Vite, např. tsx/vitest) — proto se zatím nepřidává.
Až projekt někdy zavede testovací runner, validace se do něj zapojí jako
první test.
