import { useEffect, useId, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { useModalFocusManagement } from './useModalFocusManagement';
import {
  buildReportContext,
  buildReportPayload,
  CATEGORY_OPTIONS,
  EMPTY_MANUAL_VALUES,
  getSafeAppVersion,
  IMPACT_OPTIONS,
  PROGRESS_IMPACT_OPTIONS,
  REPORT_FORM_NAME,
  REPORT_HONEYPOT_NAME,
  REPRODUCIBILITY_OPTIONS,
  submitReportToNetlify,
  TESTER_ROLE_OPTIONS,
  validateManualValues,
  type ReportManualValues,
  type ReportRouteContext,
} from '../lib/reportProblem';

export interface ReportProblemDialogProps {
  route: ReportRouteContext;
  projectorMode: boolean;
  calmMode: boolean;
  onClose: () => void;
  getFallbackFocusTarget: () => HTMLElement | null;
  /** Testy mohou nahradit fetch. */
  submitFn?: typeof submitReportToNetlify;
}

type FormPhase = 'form' | 'submitting' | 'success' | 'error';

export function ReportProblemDialog({
  route,
  projectorMode,
  calmMode,
  onClose,
  getFallbackFocusTarget,
  submitFn = submitReportToNetlify,
}: ReportProblemDialogProps) {
  const dialogRef = useRef<HTMLElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const firstFieldRef = useRef<HTMLSelectElement>(null);
  const titleId = useId();
  const descId = useId();
  const errorId = useId();

  const [manual, setManual] = useState<ReportManualValues>({ ...EMPTY_MANUAL_VALUES });
  const [honeypot, setHoneypot] = useState('');
  const [phase, setPhase] = useState<FormPhase>('form');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [clientErrors, setClientErrors] = useState<string[]>([]);
  const submittingRef = useRef(false);

  useModalFocusManagement({
    containerRef: dialogRef,
    initialFocusRef: firstFieldRef,
    onEscape: onClose,
    getFallbackFocusTarget,
  });

  // Po přechodu na success přesuň fokus na potvrzovací tlačítko.
  useEffect(() => {
    if (phase === 'success') {
      closeButtonRef.current?.focus();
    }
  }, [phase]);

  const setField = (key: keyof ReportManualValues, value: string) => {
    setManual((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (submittingRef.current || phase === 'submitting') return;

    const missing = validateManualValues(manual);
    if (missing.length > 0) {
      setClientErrors(missing);
      setErrorMessage('Doplň prosím všechna povinná pole označená hvězdičkou.');
      setPhase('error');
      return;
    }

    submittingRef.current = true;
    setPhase('submitting');
    setErrorMessage(null);
    setClientErrors([]);

    const context = buildReportContext({
      route,
      projectorMode,
      calmMode,
      appVersion: getSafeAppVersion(),
    });
    const payload = buildReportPayload({ context, manual, honeypot });
    const result = await submitFn(payload);

    submittingRef.current = false;
    if (result.ok) {
      setPhase('success');
      return;
    }
    setErrorMessage(result.message);
    setPhase('error');
  };

  return (
    <div className="onboarding-overlay report-problem-overlay">
      <section
        ref={dialogRef}
        className="onboarding report-problem-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
      >
        <div className="report-problem-dialog__header">
          <h2 id={titleId}>Nahlásit problém</h2>
          <button
            type="button"
            className="btn btn--secondary btn--small"
            onClick={onClose}
            aria-label="Zavřít dialog"
          >
            Zavřít
          </button>
        </div>

        <p id={descId} className="report-problem-dialog__lead">
          Anonymní hlášení pro pilot ElektroLabu. Nevyplňuj jméno, e-mail ani třídu —
          stačí popis problému. Hlášení se odešle přímo z aplikace.
        </p>

        {phase === 'success' ? (
          <div className="report-problem-dialog__success" role="status">
            <p>Děkujeme, hlášení bylo odesláno. Můžeš pokračovat v lekci.</p>
            <button
              ref={closeButtonRef}
              type="button"
              className="btn btn--primary"
              onClick={onClose}
            >
              Zpět do aplikace
            </button>
          </div>
        ) : (
          <form
            className="report-problem-form"
            name={REPORT_FORM_NAME}
            method="POST"
            data-netlify="true"
            data-netlify-honeypot={REPORT_HONEYPOT_NAME}
            onSubmit={handleSubmit}
            noValidate
          >
            <input type="hidden" name="form-name" value={REPORT_FORM_NAME} />

            {/* Automatický kontext — skrytá pole, bez osobních údajů */}
            <div className="report-problem-form__context" aria-hidden="true">
              {/* Hodnoty se doplní až při odeslání v payloadu; name atributy musí existovat. */}
              <input type="hidden" name="reportId" value="" readOnly />
              <input type="hidden" name="timestamp" value="" readOnly />
              <input type="hidden" name="currentUrl" value="" readOnly />
              <input type="hidden" name="hash" value="" readOnly />
              <input type="hidden" name="subjectId" value={route.subjectId ?? ''} readOnly />
              <input type="hidden" name="subjectTitle" value={route.subjectTitle ?? ''} readOnly />
              <input type="hidden" name="lessonId" value={route.lessonId ?? ''} readOnly />
              <input type="hidden" name="lessonTitle" value={route.lessonTitle ?? ''} readOnly />
              <input type="hidden" name="currentSection" value={route.page} readOnly />
              <input type="hidden" name="mode" value={projectorMode ? 'projector' : 'normal'} readOnly />
              <input type="hidden" name="calmMode" value={calmMode ? 'true' : 'false'} readOnly />
              <input type="hidden" name="viewport" value="" readOnly />
              <input type="hidden" name="userAgent" value="" readOnly />
              <input
                type="hidden"
                name="activityCompleted"
                value={
                  route.activityCompleted === undefined
                    ? ''
                    : route.activityCompleted
                      ? 'true'
                      : 'false'
                }
                readOnly
              />
              <input
                type="hidden"
                name="quizCompleted"
                value={
                  route.quizCompleted === undefined ? '' : route.quizCompleted ? 'true' : 'false'
                }
                readOnly
              />
              <input type="hidden" name="appVersion" value={getSafeAppVersion() ?? ''} readOnly />
            </div>

            <p className={`report-problem-honeypot`} aria-hidden="true">
              <label>
                Nevyplňujte toto pole
                <input
                  type="text"
                  name={REPORT_HONEYPOT_NAME}
                  tabIndex={-1}
                  autoComplete="off"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                />
              </label>
            </p>

            <div className="report-problem-form__grid">
              <label className="report-problem-field">
                <span>
                  Role <abbr title="povinné">*</abbr>
                </span>
                <select
                  ref={firstFieldRef}
                  name="testerRole"
                  required
                  value={manual.testerRole}
                  onChange={(e) => setField('testerRole', e.target.value)}
                  aria-invalid={clientErrors.includes('testerRole')}
                >
                  <option value="">Vyber…</option>
                  {TESTER_ROLE_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="report-problem-field">
                <span>
                  Kategorie <abbr title="povinné">*</abbr>
                </span>
                <select
                  name="category"
                  required
                  value={manual.category}
                  onChange={(e) => setField('category', e.target.value)}
                  aria-invalid={clientErrors.includes('category')}
                >
                  <option value="">Vyber…</option>
                  {CATEGORY_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="report-problem-field report-problem-field--full">
                <span>
                  Kde problém nastal <abbr title="povinné">*</abbr>
                </span>
                <input
                  type="text"
                  name="location"
                  required
                  value={manual.location}
                  onChange={(e) => setField('location', e.target.value)}
                  aria-invalid={clientErrors.includes('location')}
                  placeholder="Např. aktivita Vodiče a izolanty, mini test otázka 2"
                />
              </label>

              <label className="report-problem-field report-problem-field--full">
                <span>
                  Kroky k reprodukci <abbr title="povinné">*</abbr>
                </span>
                <textarea
                  name="steps"
                  required
                  rows={3}
                  value={manual.steps}
                  onChange={(e) => setField('steps', e.target.value)}
                  aria-invalid={clientErrors.includes('steps')}
                />
              </label>

              <label className="report-problem-field report-problem-field--full">
                <span>
                  Co se stalo <abbr title="povinné">*</abbr>
                </span>
                <textarea
                  name="actualResult"
                  required
                  rows={2}
                  value={manual.actualResult}
                  onChange={(e) => setField('actualResult', e.target.value)}
                  aria-invalid={clientErrors.includes('actualResult')}
                />
              </label>

              <label className="report-problem-field report-problem-field--full">
                <span>
                  Co jsi očekával/a <abbr title="povinné">*</abbr>
                </span>
                <textarea
                  name="expectedResult"
                  required
                  rows={2}
                  value={manual.expectedResult}
                  onChange={(e) => setField('expectedResult', e.target.value)}
                  aria-invalid={clientErrors.includes('expectedResult')}
                />
              </label>

              <label className="report-problem-field">
                <span>
                  Opakovatelnost <abbr title="povinné">*</abbr>
                </span>
                <select
                  name="reproducibility"
                  required
                  value={manual.reproducibility}
                  onChange={(e) => setField('reproducibility', e.target.value)}
                  aria-invalid={clientErrors.includes('reproducibility')}
                >
                  <option value="">Vyber…</option>
                  {REPRODUCIBILITY_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="report-problem-field">
                <span>
                  Dopad <abbr title="povinné">*</abbr>
                </span>
                <select
                  name="impact"
                  required
                  value={manual.impact}
                  onChange={(e) => setField('impact', e.target.value)}
                  aria-invalid={clientErrors.includes('impact')}
                >
                  <option value="">Vyber…</option>
                  {IMPACT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="report-problem-field report-problem-field--full">
                <span>
                  Vliv na pokrok <abbr title="povinné">*</abbr>
                </span>
                <select
                  name="progressImpact"
                  required
                  value={manual.progressImpact}
                  onChange={(e) => setField('progressImpact', e.target.value)}
                  aria-invalid={clientErrors.includes('progressImpact')}
                >
                  <option value="">Vyber…</option>
                  {PROGRESS_IMPACT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="report-problem-field report-problem-field--full">
                <span>Poznámka (nepovinné)</span>
                <textarea
                  name="optionalNote"
                  rows={2}
                  value={manual.optionalNote}
                  onChange={(e) => setField('optionalNote', e.target.value)}
                />
              </label>
            </div>

            {errorMessage && (
              <div
                id={errorId}
                className="feedback feedback--error"
                role="alert"
              >
                ✖ {errorMessage}
              </div>
            )}

            <div className="report-problem-form__actions">
              <button
                type="submit"
                className="btn btn--primary"
                disabled={phase === 'submitting'}
              >
                {phase === 'submitting' ? 'Odesílám…' : 'Odeslat hlášení'}
              </button>
              <button type="button" className="btn btn--secondary" onClick={onClose}>
                Zrušit
              </button>
            </div>
          </form>
        )}
      </section>
    </div>
  );
}
