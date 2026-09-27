import type { ThreeDModelDefinition, ThreeDVector } from './types';

export type SeriesParallelModelScenario =
  | 'serial'
  | 'parallel'
  | 'serial-fault'
  | 'parallel-fault';

const SOURCE = [-3.2, 0, 0] as ThreeDVector;
const SERIAL_BULB_1 = [-1.35, 0, 0] as ThreeDVector;
const SERIAL_BULB_2 = [0.65, 0, 0] as ThreeDVector;
const PARALLEL_BULB_1 = [-0.45, 0.95, 0] as ThreeDVector;
const PARALLEL_BULB_2 = [-0.45, -0.95, 0] as ThreeDVector;
const SPLIT = [-1.95, 0, 0] as ThreeDVector;
const MERGE = [1.35, 0, 0] as ThreeDVector;

const serialWires = [
  [
    [-2.8, 0.25, 0],
    [-1.7, 0.25, 0],
  ],
  [
    [-1.0, 0.25, 0],
    [0.3, 0.25, 0],
  ],
  [
    [1.0, 0.25, 0],
    [2.35, 0.25, 0],
  ],
] as Array<[ThreeDVector, ThreeDVector]>;

const serialReturn = [
  [
    [2.35, 0.25, 0],
    [2.35, -1.25, 0],
  ],
  [
    [2.35, -1.25, 0],
    [-3.2, -1.25, 0],
  ],
  [
    [-3.2, -1.25, 0],
    [-3.2, -0.45, 0],
  ],
] as Array<[ThreeDVector, ThreeDVector]>;

const parallelFeed = [
  [
    [-2.8, 0.25, 0],
    SPLIT,
  ],
] as Array<[ThreeDVector, ThreeDVector]>;

const parallelUpper = [
  [SPLIT, [-1.5, 0.95, 0]],
  [[-1.5, 0.95, 0], [-0.85, 0.95, 0]],
  [[-0.05, 0.95, 0], MERGE],
] as Array<[ThreeDVector, ThreeDVector]>;

const parallelLower = [
  [SPLIT, [-1.5, -0.95, 0]],
  [[-1.5, -0.95, 0], [-0.85, -0.95, 0]],
  [[-0.05, -0.95, 0], MERGE],
] as Array<[ThreeDVector, ThreeDVector]>;

const parallelReturn = [
  [MERGE, [1.35, 0, 0]],
  [
    [1.35, 0, 0],
    [1.35, -1.45, 0],
  ],
  [
    [1.35, -1.45, 0],
    [-3.2, -1.45, 0],
  ],
  [
    [-3.2, -1.45, 0],
    [-3.2, -0.45, 0],
  ],
] as Array<[ThreeDVector, ThreeDVector]>;

const part = (
  id: string,
  label: string,
  description: string,
  kind: 'source' | 'wire' | 'bulb' | 'node',
  position: ThreeDVector,
  explodedPosition: ThreeDVector,
  geometry?: Array<[ThreeDVector, ThreeDVector]>,
) => ({
  id,
  label,
  description,
  kind,
  position,
  explodedPosition,
  ...(geometry ? { geometry: { type: 'segments' as const, segments: geometry } } : {}),
});

export function getSeriesParallel3DModel(
  scenarioId: SeriesParallelModelScenario,
): ThreeDModelDefinition {
  const parallel = scenarioId === 'parallel' || scenarioId === 'parallel-fault';
  const suffix = parallel ? 'paralelní' : 'sériové';

  return {
    id: `series-parallel-${parallel ? 'parallel' : 'serial'}`,
    title: `3D model — ${suffix} zapojení`,
    description:
      'Názorný nízkopolygonový model obvodu. Nejde o fyzikálně přesnou simulaci ani návod k práci na zařízení.',
    parts: parallel
      ? [
          part('source', 'Zdroj / baterie', 'Dodává obvodu elektrickou energii. Model ukazuje pouze bezpečný školní princip.', 'source', SOURCE, [-3.2, 0, 0]),
          part('wire-feed', 'Společný přívod', 'Vodič vede od kladného pólu ke společnému rozdělovacímu uzlu.', 'wire', [0, 0, 0], [0, 0.2, 0], parallelFeed),
          part('branch-upper', 'Horní větev', 'Samostatná proudová cesta s horní žárovkou.', 'wire', [0, 0, 0], [0, 0.7, 0], parallelUpper),
          part('branch-lower', 'Dolní větev', 'Samostatná proudová cesta s dolní žárovkou.', 'wire', [0, 0, 0], [0, -0.7, 0], parallelLower),
          part('wire-return', 'Společný návrat', 'Vodič vrací proud ze spojovacího uzlu ke zdroji.', 'wire', [0, 0, 0], [0, -0.2, 0], parallelReturn),
          part('bulb-1', 'Horní žárovka', 'Spotřebič v horní paralelní větvi.', 'bulb', PARALLEL_BULB_1, [-0.45, 1.55, 0]),
          part('bulb-2', 'Dolní žárovka', 'Spotřebič v dolní paralelní větvi.', 'bulb', PARALLEL_BULB_2, [-0.45, -1.55, 0]),
          part('node-split', 'Rozdělovací uzel', 'Místo, kde se společný proud rozdělí do dvou větví.', 'node', SPLIT, [-2.2, 0, 0]),
          part('node-merge', 'Spojovací uzel', 'Místo, kde se proudy z obou větví opět spojí.', 'node', MERGE, [1.7, 0, 0]),
        ]
      : [
          part('source', 'Zdroj / baterie', 'Dodává obvodu elektrickou energii. Model ukazuje pouze bezpečný školní princip.', 'source', SOURCE, [-3.2, 0, 0]),
          part('wire-series', 'Jediná vodičová cesta', 'Vodiče tvoří jednu uzavřenou proudovou cestu přes obě žárovky.', 'wire', [0, 0, 0], [0, -0.15, 0], serialWires),
          part('wire-return', 'Návratová cesta', 'Návratový vodič vede proud zpět k zápornému pólu zdroje.', 'wire', [0, 0, 0], [0, -0.5, 0], serialReturn),
          part('bulb-1', 'Žárovka 1', 'První spotřebič v jediné sériové cestě.', 'bulb', SERIAL_BULB_1, [-1.35, 0.65, 0]),
          part('bulb-2', 'Žárovka 2', 'Druhý spotřebič v jediné sériové cestě.', 'bulb', SERIAL_BULB_2, [0.65, 0.65, 0]),
        ],
  };
}

export const seriesParallelGeometry = {
  parallelBulb1: PARALLEL_BULB_1,
  parallelBulb2: PARALLEL_BULB_2,
};
