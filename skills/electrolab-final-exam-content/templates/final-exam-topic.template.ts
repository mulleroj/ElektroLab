/**
 * ŠABLONA záznamu okruhu závěrečné zkoušky.
 *
 * - NENÍ importovaná do aplikace a nesmí být — slouží jen ke kopírování
 *   do src/features/finalExam/finalExamRegistry.ts.
 * - Všechny hodnoty __VELKYMI_PISMENY__ jsou placeholdery a MUSÍ být
 *   nahrazeny skutečnými dodanými údaji (nikdy vymyšlenými).
 * - Výchozí stav je draft + sourceVerified: false — mění se až po kontrole
 *   učitelem, viz skills/electrolab-final-exam-content/SKILL.md.
 *
 * Tvar odpovídá typu FinalExamTopic
 * (src/features/finalExam/finalExamTypes.ts, schemaVersion 1).
 */

export const finalExamTopicTemplate = {
  // Verze schématu — neměň bez přečtení docs/FINAL_EXAM_SCHEMA_VERSIONING.md.
  schemaVersion: 1,

  // POVINNÉ: stabilní kebab-case slug s prefixem 'zz-', popisuje téma.
  // Např. 'zz-transformatory-princip'. NIKDY jen číslo. Po publikaci se nemění.
  id: '__STABLE_ID__',

  // Číslo okruhu z oficiálního seznamu; null = záměrně nepřiděleno.
  officialNumber: null as number | null, // __OFFICIAL_NUMBER__

  // POVINNÉ: PŘESNÝ dodaný název okruhu — bez parafrází.
  officialTitle: '__EXACT_OFFICIAL_TITLE__',

  // POVINNÉ: PŘESNÉ dodané znění otázky/okruhu — bez parafrází.
  officialText: '__EXACT_OFFICIAL_TEXT__',

  // POVINNÉ: odkud znění pochází a kdo ho dodal.
  sourceReference: {
    description: '__SOURCE_REFERENCE__', // např. název dokumentu se seznamem okruhů
    providedBy: '__PROVIDED_BY__', // jméno/role učitele, který znění dodal
    providedAt: '__YYYY-MM-DD__',
  },

  // Výchozí false — na true smí přepnout až kontrola učitelem.
  sourceVerified: false,

  // Výchozí stav — draft se NIKDY nezobrazuje žákům.
  status: 'draft',

  // POVINNÉ: id existujících předmětů ze src/data/subjects.ts.
  subjectIds: ['__SUBJECT_ID__'],

  // Ročník 1–3, ke kterému se učivo primárně váže.
  year: 0, // __YEAR__

  // Odhad času na projití okruhu v aplikaci (minuty).
  estimatedMinutes: 0, // __ESTIMATED_MINUTES__

  // POVINNÉ u reviewed/published: id existujících lekcí ze src/data/lessons*.ts.
  relatedLessonIds: ['__RELATED_LESSON_ID__'],

  // Výukové cíle (u draftu mohou být prázdné, u reviewed/published povinné).
  learningGoals: [],

  // Klíčové pojmy okruhu.
  keyTerms: [],

  // Výuková OSNOVA odpovědi — opora pro žáka, ne změna oficiálního zadání.
  answerOutline: [],

  // Výukové vysvětlení po sekcích ({ id, title, text }).
  explanationSections: [],

  // POVINNÉ u témat s el. zařízením, měřením, prací či rizikem.
  // Formulace: „školní simulace", „pod dohledem učitele", u VN/VVN „odstup".
  safetyNote: '__SAFETY_NOTE_IF_RISK_TOPIC__',

  // Procvičovací otázky ve tvaru QuizQuestion ({ id, text, options,
  // correctOptionId, explanation }); u draftu mohou chybět.
  practiceItems: [],

  // VOLITELNÉ: interní poznámka pro učitele, žákům se nezobrazuje.
  teacherNote: '__OPTIONAL_TEACHER_NOTE__',

  // Verze obsahu záznamu — začíná na 1, zvyšuje se při změně znění/vysvětlení.
  version: 1,

  // Datum poslední kontroly (ISO), u draftu null.
  lastReviewedAt: null as string | null,
};
