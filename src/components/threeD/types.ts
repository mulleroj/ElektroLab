export type ThreeDVector = [number, number, number];

export type ThreeDPartKind = 'source' | 'wire' | 'bulb' | 'node' | 'asset';

export interface ThreeDPartDefinition {
  id: string;
  label: string;
  description: string;
  kind: ThreeDPartKind;
  position: ThreeDVector;
  explodedPosition: ThreeDVector;
  /** Optional local translation applied to a GLB node in exploded view. */
  explodedOffset?: ThreeDVector;
  /** GLB object names represented by this didactic part. */
  nodeNames?: string[];
  visible?: boolean;
  geometry?: {
    type: 'segments';
    segments: Array<[ThreeDVector, ThreeDVector]>;
  };
}

export interface ThreeDModelDefinition {
  id: string;
  title: string;
  description: string;
  /** Optional path to a local GLB/GLTF asset. */
  assetUrl?: string;
  parts: ThreeDPartDefinition[];
}
