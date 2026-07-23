/**
 * MVP-13C: anonymní hlášení problémů přes Netlify Forms.
 * Žádné osobní údaje, žádný dump progressu ani localStorage.
 */

export const REPORT_FORM_NAME = 'elektrolab-pilot-feedback';

/** Netlify honeypot — musí být prázdný. */
export const REPORT_HONEYPOT_NAME = 'bot-field';

/** Automatický kontext + ruční pole (bez honeypot a form-name). */
export const REPORT_CONTEXT_FIELDS = [
  'reportId',
  'timestamp',
  'currentUrl',
  'hash',
  'subjectId',
  'subjectTitle',
  'lessonId',
  'lessonTitle',
  'currentSection',
  'mode',
  'calmMode',
  'viewport',
  'userAgent',
  'activityCompleted',
  'quizCompleted',
  'appVersion',
] as const;

export const REPORT_MANUAL_FIELDS = [
  'testerRole',
  'category',
  'location',
  'steps',
  'actualResult',
  'expectedResult',
  'reproducibility',
  'impact',
  'progressImpact',
  'optionalNote',
] as const;

export const REPORT_REQUIRED_MANUAL_FIELDS = [
  'testerRole',
  'category',
  'location',
  'steps',
  'actualResult',
  'expectedResult',
  'reproducibility',
  'impact',
  'progressImpact',
] as const;

export type ReportContextField = (typeof REPORT_CONTEXT_FIELDS)[number];
export type ReportManualField = (typeof REPORT_MANUAL_FIELDS)[number];

export type ReportManualValues = Record<ReportManualField, string>;

export const EMPTY_MANUAL_VALUES: ReportManualValues = {
  testerRole: '',
  category: '',
  location: '',
  steps: '',
  actualResult: '',
  expectedResult: '',
  reproducibility: '',
  impact: '',
  progressImpact: '',
  optionalNote: '',
};

export const TESTER_ROLE_OPTIONS = [
  { value: 'zak', label: 'Žák' },
  { value: 'ucitel', label: 'Učitel' },
  { value: 'jine', label: 'Jiné / preferuji neuvedení' },
] as const;

export const CATEGORY_OPTIONS = [
  { value: 'obsah', label: 'Chyba v obsahu lekce' },
  { value: 'aktivita', label: 'Problém s aktivitou nebo demem' },
  { value: 'quiz', label: 'Problém s mini testem' },
  { value: 'progress', label: 'Pokrok, XP nebo odznaky' },
  { value: 'ovladani', label: 'Ovládání, fokus nebo přístupnost' },
  { value: 'zobrazeni', label: 'Zobrazení / mobil / projektor' },
  { value: 'jine', label: 'Jiné' },
] as const;

export const REPRODUCIBILITY_OPTIONS = [
  { value: 'vzdy', label: 'Vždy' },
  { value: 'casto', label: 'Často' },
  { value: 'obcas', label: 'Občas' },
  { value: 'jednou', label: 'Jen jednou' },
  { value: 'nevim', label: 'Nevím' },
] as const;

export const IMPACT_OPTIONS = [
  { value: 'blokuje', label: 'Blokuje dokončení lekce' },
  { value: 'zmatek', label: 'Mate, ale dá se pokračovat' },
  { value: 'drobnost', label: 'Drobnost / kosmetika' },
] as const;

export const PROGRESS_IMPACT_OPTIONS = [
  { value: 'ne', label: 'Pokrok vypadá v pořádku' },
  { value: 'mozna', label: 'Pokrok možná nesedí' },
  { value: 'ano', label: 'Pokrok / XP / odznak je špatně' },
  { value: 'nevim', label: 'Nevím' },
] as const;

export interface ReportRouteContext {
  page: 'home' | 'subject' | 'topic' | 'lesson' | 'teacher';
  subjectId?: string;
  subjectTitle?: string;
  lessonId?: string;
  lessonTitle?: string;
  activityCompleted?: boolean;
  quizCompleted?: boolean;
}

export interface BuildReportContextInput {
  route: ReportRouteContext;
  projectorMode: boolean;
  calmMode: boolean;
  /** Nasazená verze jen pokud je bezpečně známá; jinak prázdný řetězec. */
  appVersion?: string | null;
  now?: () => Date;
  randomId?: () => string;
  location?: Pick<Location, 'href' | 'hash'>;
  navigator?: Pick<Navigator, 'userAgent'>;
  viewport?: { width: number; height: number };
}

export type ReportPayload = Record<string, string>;

export function createReportId(random = Math.random): string {
  const rand = Math.floor(random() * 1e9)
    .toString(36)
    .padStart(6, '0');
  return `el-${Date.now().toString(36)}-${rand}`;
}

export function buildReportContext(input: BuildReportContextInput): Record<ReportContextField, string> {
  const loc = input.location ?? (typeof window !== 'undefined' ? window.location : { href: '', hash: '' });
  const nav = input.navigator ?? (typeof navigator !== 'undefined' ? navigator : { userAgent: '' });
  const vp =
    input.viewport ??
    (typeof window !== 'undefined'
      ? { width: window.innerWidth, height: window.innerHeight }
      : { width: 0, height: 0 });
  const now = input.now ?? (() => new Date());
  const id = input.randomId ?? (() => createReportId());
  const version = input.appVersion && input.appVersion.trim() ? input.appVersion.trim() : '';

  return {
    reportId: id(),
    timestamp: now().toISOString(),
    currentUrl: loc.href,
    hash: loc.hash,
    subjectId: input.route.subjectId ?? '',
    subjectTitle: input.route.subjectTitle ?? '',
    lessonId: input.route.lessonId ?? '',
    lessonTitle: input.route.lessonTitle ?? '',
    currentSection: input.route.page,
    mode: input.projectorMode ? 'projector' : 'normal',
    calmMode: input.calmMode ? 'true' : 'false',
    viewport: `${vp.width}x${vp.height}`,
    userAgent: nav.userAgent,
    activityCompleted:
      input.route.activityCompleted === undefined
        ? ''
        : input.route.activityCompleted
          ? 'true'
          : 'false',
    quizCompleted:
      input.route.quizCompleted === undefined
        ? ''
        : input.route.quizCompleted
          ? 'true'
          : 'false',
    appVersion: version,
  };
}

export function validateManualValues(values: ReportManualValues): string[] {
  const missing: string[] = [];
  for (const key of REPORT_REQUIRED_MANUAL_FIELDS) {
    if (!values[key].trim()) missing.push(key);
  }
  return missing;
}

export function buildReportPayload(opts: {
  context: Record<ReportContextField, string>;
  manual: ReportManualValues;
  honeypot?: string;
}): ReportPayload {
  const payload: ReportPayload = {
    'form-name': REPORT_FORM_NAME,
    [REPORT_HONEYPOT_NAME]: opts.honeypot ?? '',
  };
  for (const key of REPORT_CONTEXT_FIELDS) {
    payload[key] = opts.context[key] ?? '';
  }
  for (const key of REPORT_MANUAL_FIELDS) {
    payload[key] = opts.manual[key] ?? '';
  }
  return payload;
}

/** Všechna name atributy, která musí být ve skrytém HTML i React formuláři. */
export function allReportFieldNames(): string[] {
  return [
    'form-name',
    REPORT_HONEYPOT_NAME,
    ...REPORT_CONTEXT_FIELDS,
    ...REPORT_MANUAL_FIELDS,
  ];
}

export type SubmitReportResult =
  | { ok: true }
  | { ok: false; message: string };

/**
 * AJAX odeslání Netlify Forms (urlencoded). Nefetchuje progress ani localStorage.
 */
export async function submitReportToNetlify(
  payload: ReportPayload,
  fetchImpl: typeof fetch = fetch,
): Promise<SubmitReportResult> {
  try {
    const body = new URLSearchParams(payload).toString();
    const response = await fetchImpl('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    });
    if (!response.ok) {
      return {
        ok: false,
        message: `Odeslání se nepovedlo (HTTP ${response.status}). Zkus to prosím znovu.`,
      };
    }
    return { ok: true };
  } catch {
    return {
      ok: false,
      message:
        'Odeslání se nepovedlo. Zkontroluj připojení k internetu a zkus to znovu.',
    };
  }
}

/**
 * Bezpečná verze aplikace: Netlify COMMIT_REF přes Vite define, jinak null.
 * Do formuláře se posílá jen když je hodnota neprázdná.
 */
export function getSafeAppVersion(
  env: Record<string, unknown> = import.meta.env as Record<string, unknown>,
): string | null {
  const candidates = [env.VITE_COMMIT_REF, env.VITE_APP_VERSION];
  for (const value of candidates) {
    if (typeof value === 'string' && value.trim()) return value.trim();
  }
  return null;
}
