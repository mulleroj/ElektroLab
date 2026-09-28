import type { ThreeDModelDefinition, ThreeDPartDefinition } from './types';
import { INDUCTION_MOTOR_MODEL_PATH, inductionMotorParts } from './inductionMotorModelConfig';

export type RotatingFieldPartId =
  | 'stator_core'
  | 'winding_u'
  | 'winding_v'
  | 'winding_w'
  | 'rotating_field';

const ROTATING_FIELD_PART_IDS: RotatingFieldPartId[] = [
  'stator_core',
  'winding_u',
  'winding_v',
  'winding_w',
  'rotating_field',
];

export const rotatingFieldParts: ThreeDPartDefinition[] = inductionMotorParts.filter((part) =>
  ROTATING_FIELD_PART_IDS.includes(part.id as RotatingFieldPartId),
);

export const rotatingFieldModel: ThreeDModelDefinition = {
  id: 'rotating-field-stator',
  title: 'Výukový stator s točivým magnetickým polem',
  description:
    'Názorné zobrazení statoru, fází U, V, W a směru výsledného magnetického pole.',
  assetUrl: INDUCTION_MOTOR_MODEL_PATH,
  parts: rotatingFieldParts,
};

export const ROTATING_FIELD_CAMERA_POSITION: [number, number, number] = [7.8, -10.5, 6.2];
export const ROTATING_FIELD_CAMERA_TARGET: [number, number, number] = [0, 0, 0.25];

export const ROTATING_FIELD_HIDDEN_NODES = [
  'housing_assembly',
  'rotor_assembly',
  'fan',
  'fan_cover',
  'end_shield_front',
  'end_shield_rear',
  'bearing_front',
  'bearing_rear',
  'terminal_box',
  'terminal_block',
  'air_gap_guide',
] as const;
