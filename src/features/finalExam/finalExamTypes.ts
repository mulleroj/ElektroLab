/**
 * Datový kontrakt pro budoucí obsah „Příprava na závěrečnou zkoušku".
 *
 * DŮLEŽITÉ: Tento modul definuje POUZE typy. Žádný skutečný obsah
 * závěrečných otázek zatím neexistuje — oficiální okruhy nebyly dodány.
 * Postup doplnění obsahu popisuje skills/electrolab-final-exam-content/SKILL.md.
 */

/** Aktuálně podporovaná verze schématu. Zvyšuje se dle docs/FINAL_EXAM_SCHEMA_VERSIONING.md. */
export const FINAL_EXAM_SCHEMA_VERSION = 1;

/**
 * Životní cyklus okruhu:
 * - draft: vloženo, neprošlo kontrolou — NIKDY se nezobrazuje žákům
 * - reviewed: zkontrolováno učitelem, čeká na publikaci
 * - published: viditelné v aplikaci (až bude feature zapnutá)
 * - archived: staženo z výuky, drží se kvůli historii a stabilním ID
 */
export type FinalExamTopicStatus = 'draft' | 'reviewed' | 'published' | 'archived';

/** Odkaz na zdroj oficiálního zadání — bez něj nelze obsah publikovat. */
export interface FinalExamSourceReference {
  /** Popis zdroje, např. „Seznam okruhů ZZ 2026/27, SŠE …" (bez vymýšlení). */
  description: string;
  /** Kdo znění dodal/potvrdil (učitel, komise). */
  providedBy: string;
  /** Datum dodání ve formátu ISO (YYYY-MM-DD). */
  providedAt: string;
}

/** Jedna sekce výukového vysvětlení — ODDĚLENÁ od oficiálního znění otázky. */
export interface FinalExamExplanationSection {
  id: string;
  title: string;
  /** Krátké odstavce; klíčové pojmy tučně pomocí **hvězdiček** jako v lekcích. */
  text: string;
}

/**
 * Procvičovací položka (otázka s výběrem odpovědi) k okruhu.
 * Formát záměrně kopíruje QuizQuestion ze stávajících lekcí,
 * aby šla znovu použít komponenta Quiz.
 */
export interface FinalExamPracticeItem {
  id: string;
  text: string;
  options: { id: string; text: string }[];
  correctOptionId: string;
  explanation: string;
}

/** Jeden okruh/otázka závěrečné zkoušky. */
export interface FinalExamTopic {
  /** Verze schématu, podle které je záznam zapsán. */
  schemaVersion: number;
  /**
   * Stabilní ID — kebab-case slug odvozený z názvu tématu
   * (např. 'zz-transformatory-princip'). NIKDY jen pořadové číslo,
   * NIKDY se nemění po publikaci.
   */
  id: string;
  /** Číslo okruhu dle oficiálního seznamu; null = záměrně nepřiděleno. */
  officialNumber: number | null;
  /** PŘESNÝ dodaný název okruhu — nesmí se parafrázovat. */
  officialTitle: string;
  /** PŘESNÉ dodané znění otázky/okruhu — nesmí se parafrázovat. */
  officialText: string;
  /** Odkud znění pochází. Povinné. */
  sourceReference: FinalExamSourceReference;
  /** True až po ověření znění učitelem/komisí. Published vyžaduje true. */
  sourceVerified: boolean;
  status: FinalExamTopicStatus;
  /** Id existujících předmětů (viz src/data/subjects.ts), kterých se okruh týká. */
  subjectIds: string[];
  /** Ročník, ke kterému se učivo primárně váže (1–3). */
  year: number;
  /** Odhad času na projití okruhu v aplikaci. */
  estimatedMinutes: number;
  /** Id existujících mikrolekcí (src/data/lessons*.ts), které okruh procvičují. */
  relatedLessonIds: string[];
  /** Co má žák po projití umět (výukové cíle, ne oficiální text). */
  learningGoals: string[];
  /** Klíčové pojmy okruhu. */
  keyTerms: string[];
  /**
   * Výuková OSNOVA odpovědi — body, které má správná odpověď obsahovat.
   * Není to změna oficiálního zadání, jen studijní opora.
   */
  answerOutline: string[];
  /** Výukové vysvětlení po sekcích. */
  explanationSections: FinalExamExplanationSection[];
  /**
   * Povinné, pokud se okruh týká elektrického zařízení, měření, práce,
   * manipulace nebo jiného bezpečnostního rizika. Stejná pravidla jako u lekcí.
   */
  safetyNote?: string;
  /** Procvičovací otázky (mohou být prázdné u draftu). */
  practiceItems: FinalExamPracticeItem[];
  /** Interní poznámka pro učitele — nezobrazuje se žákům. */
  teacherNote?: string;
  /** Verze obsahu záznamu (1, 2, …) — zvyšuje se při změně znění/vysvětlení. */
  version: number;
  /** Datum poslední kontroly ve formátu ISO (YYYY-MM-DD). */
  lastReviewedAt: string | null;
}

/** Jedna chyba nebo varování z validace. */
export interface FinalExamValidationIssue {
  topicId: string;
  field: string;
  message: string;
  severity: 'error' | 'warning';
}

/** Strukturovaný výsledek validace registru. */
export interface FinalExamValidationResult {
  valid: boolean;
  errors: FinalExamValidationIssue[];
  warnings: FinalExamValidationIssue[];
}

/** Tvar registru obsahu — jediné místo, kde budou budoucí data. */
export interface FinalExamContentRegistry {
  schemaVersion: number;
  topics: FinalExamTopic[];
}
