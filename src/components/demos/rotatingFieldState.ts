export type RotatingFieldPhase = 'U' | 'V' | 'W';

export interface RotatingFieldStep {
  title: string;
  description: string;
  focus: RotatingFieldPhase | 'field' | null;
}

/**
 * Jediná pedagogická osa pro 2D schéma i volitelný 3D doplněk.
 * Nejde o numerickou simulaci ani o výklad změny sledu fází.
 */
export const ROTATING_FIELD_STEPS: RotatingFieldStep[] = [
  {
    title: 'Prostorové rozmístění vinutí',
    description:
      'Statorová vinutí U, V a W jsou pevně rozmístěná kolem vnitřního prostoru statoru.',
    focus: null,
  },
  {
    title: 'Fáze U',
    description:
      'Fáze U je jedna ze tří statorových fází; její magnetický účinek je součástí společného pole.',
    focus: 'U',
  },
  {
    title: 'Fáze V',
    description:
      'Fáze V je vůči U prostorově posunutá a její časově posunutý proud přispívá k výslednici.',
    focus: 'V',
  },
  {
    title: 'Fáze W',
    description:
      'Fáze W doplňuje trojici prostorově rozložených vinutí s časově posunutými proudy.',
    focus: 'W',
  },
  {
    title: 'Výsledné magnetické pole',
    description:
      'Magnetické účinky tří vinutí se skládají do společného směru uvnitř statoru.',
    focus: 'field',
  },
  {
    title: 'Pole se v prostoru otáčí',
    description:
      'Při plynulé změně časově posunutých proudů se výsledný směr pole postupně posouvá kolem statoru, zatímco stator stojí.',
    focus: 'field',
  },
];

export const ROTATING_FIELD_PHASES: RotatingFieldPhase[] = ['U', 'V', 'W'];
export const ROTATING_FIELD_POSITION_ANGLES = [0, 60, 120, 180, 240, 300] as const;
export const ROTATING_FIELD_FINAL_STEP_INDEX = ROTATING_FIELD_STEPS.length - 1;

export interface RotatingFieldPlaybackState {
  fieldVisible: boolean;
  fieldSteppingAllowed: boolean;
  continuousRotationAllowed: boolean;
  continuousRotationActive: boolean;
  fieldPositionIndex: number;
  fieldAngleDegrees: number;
}

/**
 * Sdílená pravidla pro stav 2D lekce a volitelného 3D helperu.
 * Ruční polohu lze měnit pouze v posledním kroku a při zastavené rotaci.
 */
export function getRotatingFieldPlaybackState(
  stepIndex: number,
  allowContinuousMotion: boolean,
  fieldRunning: boolean,
  fieldPositionIndex = 0,
): RotatingFieldPlaybackState {
  const fieldVisible = stepIndex >= ROTATING_FIELD_STEPS.length - 2;
  const continuousRotationAllowed = stepIndex === ROTATING_FIELD_FINAL_STEP_INDEX && allowContinuousMotion;
  const continuousRotationActive = continuousRotationAllowed && fieldRunning;
  const normalizedPositionIndex = stepIndex === ROTATING_FIELD_FINAL_STEP_INDEX
    ? normalizeRotatingFieldPositionIndex(fieldPositionIndex)
    : 0;

  return {
    fieldVisible,
    fieldSteppingAllowed: stepIndex === ROTATING_FIELD_FINAL_STEP_INDEX && !continuousRotationActive,
    continuousRotationAllowed,
    continuousRotationActive,
    fieldPositionIndex: normalizedPositionIndex,
    fieldAngleDegrees: ROTATING_FIELD_POSITION_ANGLES[normalizedPositionIndex],
  };
}

export function normalizeRotatingFieldPositionIndex(positionIndex: number): number {
  const count = ROTATING_FIELD_POSITION_ANGLES.length;
  return ((Math.trunc(positionIndex) % count) + count) % count;
}

export function getRotatingFieldDiscretePosition(positionIndex: number) {
  const normalizedPositionIndex = normalizeRotatingFieldPositionIndex(positionIndex);
  return {
    fieldPositionIndex: normalizedPositionIndex,
    fieldAngleDegrees: ROTATING_FIELD_POSITION_ANGLES[normalizedPositionIndex],
  };
}

export function getRotatingFieldStepDescription(stepIndex: number): string {
  return ROTATING_FIELD_STEPS[stepIndex]?.description ?? ROTATING_FIELD_STEPS[0].description;
}
