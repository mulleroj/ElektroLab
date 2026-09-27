import { useMemo } from 'react';
import type { Object3D } from 'three';
import type { ThreeDModelDefinition, ThreeDPartDefinition } from './types';
import { getExplodedPartPosition } from './ExplodedViewController';
import { useLocalGltfScene } from './useLocalGltfScene';

interface TransformerModelProps {
  definition: ThreeDModelDefinition;
  exploded: boolean;
  selectedPartId: string | null;
  highlightedPartIds: Set<string>;
  onSelectPart: (partId: string) => void;
}

export function TransformerModel({
  definition,
  exploded,
  selectedPartId,
  highlightedPartIds,
  onSelectPart,
}: TransformerModelProps) {
  if (!definition.assetUrl) {
    return null;
  }

  return (
    <LoadedTransformerModel
      definition={definition}
      url={definition.assetUrl}
      exploded={exploded}
      selectedPartId={selectedPartId}
      highlightedPartIds={highlightedPartIds}
      onSelectPart={onSelectPart}
    />
  );
}

function LoadedTransformerModel({
  definition,
  url,
  exploded,
  selectedPartId,
  highlightedPartIds,
  onSelectPart,
}: TransformerModelProps & { url: string }) {
  const sourceScene = useLocalGltfScene(url);
  const scene = useMemo(
    () => prepareScene(sourceScene, definition.parts, exploded, selectedPartId, highlightedPartIds),
    [definition.parts, exploded, highlightedPartIds, selectedPartId, sourceScene],
  );

  return (
    <group
      onPointerDown={(event) => {
        event.stopPropagation();
        const partId = findPartId(event.object, definition.parts);
        if (partId) {
          onSelectPart(partId);
        }
      }}
    >
      <primitive object={scene} />
    </group>
  );
}

function prepareScene(
  sourceScene: Object3D,
  parts: ThreeDPartDefinition[],
  exploded: boolean,
  selectedPartId: string | null,
  highlightedPartIds: Set<string>,
): Object3D {
  const scene = sourceScene.clone(true);
  scene.traverse((object) => {
    const part = findPart(object, parts);
    if (!part) {
      return;
    }

    const offset = exploded
      ? getExplodedPartPosition(part, true)
      : part.position;
    object.position.x += part.explodedOffset ? offset[0] : 0;
    object.position.y += part.explodedOffset ? offset[1] : 0;
    object.position.z += part.explodedOffset ? offset[2] : 0;
    object.userData.transformerPartId = part.id;

    if (part.id === selectedPartId || highlightedPartIds.has(part.id)) {
      highlightObject(object);
    }
  });
  return scene;
}

function findPart(object: Object3D, parts: ThreeDPartDefinition[]): ThreeDPartDefinition | undefined {
  return parts.find((part) => part.nodeNames?.includes(object.name));
}

function findPartId(object: Object3D, parts: ThreeDPartDefinition[]): string | null {
  let current: Object3D | null = object;
  while (current) {
    const directId = current.userData.transformerPartId;
    if (typeof directId === 'string') {
      return directId;
    }
    const part = findPart(current, parts);
    if (part) {
      return part.id;
    }
    current = current.parent;
  }
  return null;
}

function highlightObject(object: Object3D) {
  if (!('isMesh' in object) || !object.isMesh) {
    return;
  }
  const mesh = object as Object3D & {
    material?:
      | { clone: () => unknown; emissive?: { set: (color: string) => void }; emissiveIntensity?: number }
      | Array<{ clone: () => unknown; emissive?: { set: (color: string) => void }; emissiveIntensity?: number }>;
  };
  const sourceMaterials = mesh.material;
  if (!sourceMaterials) {
    return;
  }
  const materials = Array.isArray(sourceMaterials)
    ? sourceMaterials.map((material) => material.clone())
    : sourceMaterials.clone();
  const apply = (material: {
    emissive?: { set: (color: string) => void };
    emissiveIntensity?: number;
  }) => {
    material.emissive?.set('#2563eb');
    if (material.emissive) {
      material.emissiveIntensity = 0.35;
    }
  };
  if (Array.isArray(materials)) {
    materials.forEach(apply);
  } else {
    apply(materials as { emissive?: { set: (color: string) => void }; emissiveIntensity?: number });
  }
  mesh.material = materials as typeof mesh.material;
}
