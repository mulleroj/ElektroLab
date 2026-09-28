import type { ThreeDModelDefinition, ThreeDPartDefinition, ThreeDVector } from './types';

export const INDUCTION_MOTOR_MODEL_PATH =
  '/models/induction-motor/induction-motor-educational.glb';

export type InductionMotorPartId =
  | 'housing'
  | 'stator_core'
  | 'winding_u'
  | 'winding_v'
  | 'winding_w'
  | 'rotor_core'
  | 'cage_bars'
  | 'end_ring_front'
  | 'end_ring_rear'
  | 'shaft'
  | 'bearing_front'
  | 'bearing_rear'
  | 'end_shield_front'
  | 'end_shield_rear'
  | 'fan'
  | 'fan_cover'
  | 'terminal_box'
  | 'terminal_block'
  | 'air_gap'
  | 'rotating_field';

export interface InductionMotorPartGroup {
  id: string;
  label: string;
  parts: ThreeDPartDefinition[];
}

const ZERO: ThreeDVector = [0, 0, 0];

/** Offsets exported from the Blender spike; units are the GLB's local units. */
export const INDUCTION_MOTOR_EXPLODED_OFFSETS: Partial<
  Record<InductionMotorPartId, ThreeDVector>
> = {
  fan_cover: [-4.1, 0, 0],
  fan: [-3.5, 0, 0],
  end_shield_front: [2.55, 0, 0],
  end_shield_rear: [-2.55, 0, 0],
  bearing_front: [2.05, 0, 0],
  bearing_rear: [-2.05, 0, 0],
  rotor_core: [1.15, 0, 0],
  end_ring_front: [1.15, 0, 0],
  end_ring_rear: [1.15, 0, 0],
  cage_bars: [1.15, 0, 0],
  shaft: [1.15, 0, 0],
  terminal_box: [0, 0, 0.85],
  terminal_block: [0, 0, 0.85],
};

function assetPart(
  id: InductionMotorPartId,
  label: string,
  description: string,
  nodeNames: string[],
): ThreeDPartDefinition {
  const explodedOffset = INDUCTION_MOTOR_EXPLODED_OFFSETS[id] ?? ZERO;
  return {
    id,
    label,
    description,
    kind: 'asset',
    position: ZERO,
    explodedPosition: explodedOffset,
    explodedOffset,
    nodeNames,
  };
}

export const inductionMotorParts: ThreeDPartDefinition[] = [
  assetPart(
    'housing',
    'Skříň motoru',
    'Litá skříň drží stator a chrání vnitřní části motoru. Výukový řez není návod k demontáži.',
    ['housing'],
  ),
  assetPart(
    'stator_core',
    'Statorové železo',
    'Pevná část motoru. Statorové železo vede magnetické působení kolem vnitřního prostoru.',
    ['stator_core'],
  ),
  assetPart(
    'winding_u',
    'Vinutí fáze U',
    'Jedna ze tří prostorově rozložených skupin statorového vinutí.',
    ['stator_winding_phase_u'],
  ),
  assetPart(
    'winding_v',
    'Vinutí fáze V',
    'Jedna ze tří prostorově rozložených skupin statorového vinutí.',
    ['stator_winding_phase_v'],
  ),
  assetPart(
    'winding_w',
    'Vinutí fáze W',
    'Jedna ze tří prostorově rozložených skupin statorového vinutí.',
    ['stator_winding_phase_w'],
  ),
  assetPart(
    'rotor_core',
    'Rotorové železo',
    'Otáčivá část motoru uložená uvnitř statoru.',
    ['rotor_core'],
  ),
  assetPart(
    'cage_bars',
    'Klecové tyče',
    'Podélné vodivé tyče rotoru. Se zkratovacími kruhy tvoří rotorovou klec.',
    ['rotor_cage_bars'],
  ),
  assetPart(
    'end_ring_front',
    'Přední zkratovací kruh',
    'Vodivě spojuje konce rotorových tyčí na přední straně klece.',
    ['rotor_end_ring_front'],
  ),
  assetPart(
    'end_ring_rear',
    'Zadní zkratovací kruh',
    'Vodivě spojuje konce rotorových tyčí na zadní straně klece.',
    ['rotor_end_ring_rear'],
  ),
  assetPart(
    'shaft',
    'Hřídel',
    'Přenáší mechanický výkon motoru na poháněné zařízení.',
    ['shaft'],
  ),
  assetPart(
    'bearing_front',
    'Přední ložisko',
    'Umožňuje otáčení hřídele a zůstává součástí statické mechanické podpory.',
    ['bearing_front'],
  ),
  assetPart(
    'bearing_rear',
    'Zadní ložisko',
    'Umožňuje otáčení hřídele a zůstává součástí statické mechanické podpory.',
    ['bearing_rear'],
  ),
  assetPart(
    'end_shield_front',
    'Přední čelní štít',
    'Uzavírá přední stranu motoru a nese přední ložisko. V řezu se část štítu skryje pouze pro výuku.',
    ['end_shield_front'],
  ),
  assetPart(
    'end_shield_rear',
    'Zadní čelní štít',
    'Uzavírá zadní stranu motoru a nese zadní ložisko. V řezu se část štítu skryje pouze pro výuku.',
    ['end_shield_rear'],
  ),
  assetPart(
    'fan',
    'Ventilátor',
    'Pomáhá odvádět teplo při provozu; v názorném chodu sleduje směr rotoru.',
    ['fan'],
  ),
  assetPart(
    'fan_cover',
    'Kryt ventilátoru',
    'Chrání ventilátor před dotykem. Model není návod k práci s rotujícími částmi.',
    ['fan_cover'],
  ),
  assetPart(
    'terminal_box',
    'Svorkovnicová skříň',
    'Kryje svorkovnici motoru. V této lekci ji pouze identifikujeme, nepřepojujeme.',
    ['terminal_box'],
  ),
  assetPart(
    'terminal_block',
    'Svorkovnice',
    'Nese názorně připravené svorky U1, V1, W1, U2, V2, W2. Nejde o návod k připojení.',
    ['terminal_block'],
  ),
  assetPart(
    'air_gap',
    'Vzduchová mezera',
    'Malý prostor mezi statorem a rotorem, který umožňuje volné otáčení rotoru. Vrstva je pouze názorná.',
    ['air_gap_guide'],
  ),
  assetPart(
    'rotating_field',
    'Rotující magnetické pole',
    'Názorný helper pro směr výsledného pole uvnitř statoru; nejde o FEM simulaci ani hodnotu indukce.',
    ['rotating_field_guide'],
  ),
];

export const inductionMotorPartGroups: InductionMotorPartGroup[] = [
  { id: 'stator', label: 'Stator', parts: inductionMotorParts.slice(1, 5) },
  { id: 'rotor', label: 'Rotor', parts: inductionMotorParts.slice(5, 10) },
  {
    id: 'mechanical',
    label: 'Mechanické části',
    parts: inductionMotorParts.slice(0, 1).concat(inductionMotorParts.slice(10, 16)),
  },
  { id: 'connection', label: 'Připojení', parts: inductionMotorParts.slice(16, 18) },
  { id: 'layers', label: 'Výukové vrstvy', parts: inductionMotorParts.slice(18) },
];

export const inductionMotorModel: ThreeDModelDefinition = {
  id: 'induction-motor-educational',
  title: 'Výukový třífázový asynchronní motor',
  description:
    'Technická školní 3D pomůcka se statorem, třífázovým vinutím, rotorovou klecí a hřídelí.',
  assetUrl: INDUCTION_MOTOR_MODEL_PATH,
  parts: inductionMotorParts,
};

export const INDUCTION_MOTOR_CAMERA_POSITION: [number, number, number] = [7.8, -10.5, 6.2];
export const INDUCTION_MOTOR_CAMERA_TARGET: [number, number, number] = [0, 0, 0.25];
