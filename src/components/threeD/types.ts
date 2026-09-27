export type ThreeDVector = [number, number, number];

export type ThreeDPartKind = 'source' | 'wire' | 'bulb' | 'node';

export interface ThreeDPartDefinition {
  id: string;
  label: string;
  description: string;
  kind: ThreeDPartKind;
  position: ThreeDVector;
  explodedPosition: ThreeDVector;
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
  /** Optional path to a local GLB/GLTF asset for future device models. */
  assetUrl?: string;
  parts: ThreeDPartDefinition[];
}
