import type { ThreeDModelDefinition, ThreeDPartDefinition, ThreeDVector } from './types';

export const TRANSFORMER_MODEL_PATH =
  '/models/transformer/transformer-educational.glb';

export type TransformerPartId =
  | 'core'
  | 'primary_winding'
  | 'secondary_winding'
  | 'coil_former'
  | 'primary_terminal_1'
  | 'primary_terminal_2'
  | 'secondary_terminal_1'
  | 'secondary_terminal_2';

const ZERO: ThreeDVector = [0, 0, 0];

const EXPLODED_OFFSETS: Record<TransformerPartId, ThreeDVector> = {
  core: [0, 0.95, 0],
  primary_winding: [-2.35, 0, -0.18],
  secondary_winding: [2.35, 0, 0.18],
  coil_former: [0, 0, -2.05],
  primary_terminal_1: [-1.1, -0.2, -1.2],
  primary_terminal_2: [1.1, -0.2, -1.2],
  secondary_terminal_1: [-1.1, -0.2, 1.2],
  secondary_terminal_2: [1.1, -0.2, 1.2],
};

function assetPart(
  id: TransformerPartId,
  label: string,
  description: string,
  nodeNames: string[],
): ThreeDPartDefinition {
  return {
    id,
    label,
    description,
    kind: 'asset',
    position: ZERO,
    explodedPosition: EXPLODED_OFFSETS[id],
    explodedOffset: EXPLODED_OFFSETS[id],
    nodeNames,
  };
}

export const transformerParts: ThreeDPartDefinition[] = [
  assetPart(
    'core',
    'Magnetické jádro',
    'Vede magnetický tok mezi oblastí primárního a sekundárního vinutí.',
    ['core', 'core_lamination_detail'],
  ),
  assetPart(
    'primary_winding',
    'Primární vinutí',
    'Je připojeno ke vstupnímu střídavému napětí. Střídavý proud v něm vytváří proměnné magnetické pole.',
    ['primary_winding'],
  ),
  assetPart(
    'secondary_winding',
    'Sekundární vinutí',
    'V proměnném magnetickém poli se v něm indukuje napětí.',
    ['secondary_winding'],
  ),
  assetPart(
    'coil_former',
    'Kostra cívek',
    'Mechanicky nese a odděluje primární a sekundární vinutí.',
    ['coil_former'],
  ),
  assetPart(
    'primary_terminal_1',
    'Primární svorka 1',
    'Primární svorky slouží k připojení primárního vinutí.',
    ['primary_terminal_1', 'primary_terminal_1_mount', 'primary_terminal_1_cap'],
  ),
  assetPart(
    'primary_terminal_2',
    'Primární svorka 2',
    'Primární svorky slouží k připojení primárního vinutí.',
    ['primary_terminal_2', 'primary_terminal_2_mount', 'primary_terminal_2_cap'],
  ),
  assetPart(
    'secondary_terminal_1',
    'Sekundární svorka 1',
    'Sekundární svorky slouží k připojení sekundárního vinutí.',
    ['secondary_terminal_1', 'secondary_terminal_1_mount', 'secondary_terminal_1_cap'],
  ),
  assetPart(
    'secondary_terminal_2',
    'Sekundární svorka 2',
    'Sekundární svorky slouží k připojení sekundárního vinutí.',
    ['secondary_terminal_2', 'secondary_terminal_2_mount', 'secondary_terminal_2_cap'],
  ),
];

export const transformerModel: ThreeDModelDefinition = {
  id: 'transformer-educational',
  title: 'Výukový transformátor',
  description:
    'Technická školní 3D pomůcka s magnetickým jádrem, vinutími, kostrou cívek a svorkami.',
  assetUrl: TRANSFORMER_MODEL_PATH,
  parts: transformerParts,
};

export const TRANSFORMER_CAMERA_POSITION: [number, number, number] = [7, 4.5, 8.5];
export const TRANSFORMER_CAMERA_TARGET: [number, number, number] = [0, 0, 0];

export function getTransformer3DModel(): ThreeDModelDefinition {
  return transformerModel;
}
