/**
 * Konfigurace featury „Příprava na závěrečnou zkoušku".
 *
 * Feature je VYPNUTÁ, dokud nebudou dodány a ověřeny skutečné okruhy.
 * Zapnutí featury je popsáno v docs/FINAL_EXAM_EXTENSION_STATUS.md a smí
 * proběhnout až po splnění podmínek v docs/FINAL_EXAM_CONTENT_BATCH_CHECKLIST.md.
 */
import { FINAL_EXAM_SCHEMA_VERSION } from './finalExamTypes';

export const finalExamConfig = {
  /** Hlavní vypínač — false = žádné UI závěrečkového režimu se nezobrazuje. */
  featureEnabled: false,
  /** True až po vložení, validaci a schválení prvního obsahového batche. */
  contentReady: false,
  /** Minimální počet publikovaných okruhů pro smysluplné zapnutí featury. */
  minimumPublishedTopics: 5,
  /** Verze schématu, kterou aktuální kód umí číst. */
  schemaVersion: FINAL_EXAM_SCHEMA_VERSION,
} as const;
