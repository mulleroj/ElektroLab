# Verzování schématu závěrečkového obsahu

## Aktuální stav

- `schemaVersion = 1` (konstanta `FINAL_EXAM_SCHEMA_VERSION`
  v `src/features/finalExam/finalExamTypes.ts`).
- Každý záznam v registru nese svou `schemaVersion`.

## Kdy zvýšit schemaVersion

Zvyšuje se POUZE při **nekompatibilní** změně:

- odstranění pole nebo jeho přejmenování,
- změna typu existujícího pole,
- změna významu existujícího pole,
- zpřísnění, které zneplatní dosud platná data.

**Zákaz tichého přepisování významu:** existující pole nikdy nesmí začít
znamenat něco jiného, než znamenalo při zápisu dat. Když je potřeba jiný
význam, přidá se nové pole a staré se deprecatuje (viz níže).

## Zpětně kompatibilní změny (bez zvýšení verze)

- Přidání **volitelného** pole (`novePole?: Typ`) s dokumentovaným výchozím
  chováním při absenci.
- Přidání nové hodnoty do union typu, pokud ji starý kód bezpečně ignoruje.
- Zpřísnění validace pouze pro NOVÝ obsah (varování pro starý).

## Jak připravit migraci (až bude potřeba verze 2)

1. Zvýšit `FINAL_EXAM_SCHEMA_VERSION` na 2.
2. Napsat čistou funkci
   `migrateFinalExamTopicV1toV2(topic: FinalExamTopicV1): FinalExamTopic`
   v novém souboru `finalExamMigrations.ts` — bez vedlejších efektů.
3. Starý typ zachovat jako `FinalExamTopicV1` (jen pro migraci).
4. Migrace se spouští jednorázově nad registrem, výsledek se commitne —
   runtime nemigruje za běhu.
5. Validace odmítne záznamy s nepodporovanou verzí.

## Stabilní ID a archivace

- `id` je NEMĚNNÉ napříč verzemi schématu i verzemi obsahu.
- Stažení okruhu = `status: 'archived'`; záznam se NIKDY nemaže
  (kvůli historii, odkazům a budoucímu pokroku žáků).

## Změna oficiálního znění

Když škola/komise změní znění okruhu:

1. Potvrzení učitelem (bez něj STOP).
2. Aktualizovat `officialTitle`/`officialText`, zvýšit `version` záznamu
   (ne schemaVersion), nastavit `sourceVerified: false` a `status` zpět
   na `reviewed`-čekající, doplnit novou `sourceReference` a `lastReviewedAt`.
3. Změnu provést samostatným commitem s jasnou zprávou
   (`content: update official text of zz-… (source: …)`).
4. **Původní znění zůstává dohledatelné v git historii** — proto se znění
   nikdy nemění spolu s nesouvisejícími úpravami v jednom commitu.
