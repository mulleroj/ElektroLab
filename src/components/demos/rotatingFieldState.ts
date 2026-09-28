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

export function getRotatingFieldStepDescription(stepIndex: number): string {
  return ROTATING_FIELD_STEPS[stepIndex]?.description ?? ROTATING_FIELD_STEPS[0].description;
}
