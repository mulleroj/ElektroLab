import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Object3D } from 'three';
import type { ContactorPartId } from './contactorModelConfig';
import type { ContactorCoilState } from './contactorState';
import { CONTACTOR_MOTION } from './contactorState';
import type { ThreeDModelDefinition, ThreeDPartDefinition } from './types';
import { useLocalGltfScene } from './useLocalGltfScene';

interface ContactorModelProps {
  definition: ThreeDModelDefinition;
  coilActive: boolean;
  exploded: boolean;
  selectedPartId: string | null;
  reduceMotion: boolean;
  onSelectPart: (partId: string) => void;
}

export function ContactorModel(props: ContactorModelProps) {
  if (!props.definition.assetUrl) return null;
  return <LoadedContactorModel {...props} url={props.definition.assetUrl} />;
}

function LoadedContactorModel({
  definition,
  url,
  coilActive,
  exploded,
  selectedPartId,
  reduceMotion,
  onSelectPart,
}: ContactorModelProps & { url: string }) {
  const sourceScene = useLocalGltfScene(url);
  const state: ContactorCoilState = coilActive ? 'on' : 'off';
  const scene = useMemo(
    () => prepareScene(sourceScene, definition.parts, selectedPartId, state),
    [definition.parts, selectedPartId, sourceScene, state],
  );
  const progress = useRef(coilActive ? 1 : 0);

  useFrame((_, delta) => {
    const target = coilActive ? 1 : 0;
    if (reduceMotion) {
      progress.current = target;
    } else {
      progress.current += (target - progress.current) * (1 - Math.exp(-delta * 10));
    }
    applyContactorTransforms(scene, definition.parts, progress.current, exploded);
  });

  return (
    <group
      onPointerDown={(event) => {
        event.stopPropagation();
        const partId = findPartId(event.object, definition.parts);
        if (partId) onSelectPart(partId);
      }}
    >
      <primitive object={scene} />
    </group>
  );
}

function prepareScene(
  sourceScene: Object3D,
  parts: ThreeDPartDefinition[],
  selectedPartId: string | null,
  coilState: ContactorCoilState,
): Object3D {
  const scene = sourceScene.clone(true);
  scene.traverse((object) => {
    const part = findPart(object, parts);
    if (!part) return;

    object.userData.contactorPartId = part.id;
    object.userData.contactorBasePosition = object.position.clone();
    object.userData.contactorBaseScale = object.scale.clone();
    if (part.id === selectedPartId) highlightObject(object, '#2563eb', 0.38);
    if (coilState === 'on' && (part.id === 'coil' || part.id === 'magnetic_core_fixed')) {
      highlightObject(object, '#f59e0b', 0.32);
    }
  });
  return scene;
}

function applyContactorTransforms(
  scene: Object3D,
  parts: ThreeDPartDefinition[],
  progress: number,
  exploded: boolean,
) {
  scene.traverse((object) => {
    const part = findPart(object, parts);
    const basePosition = object.userData.contactorBasePosition;
    const baseScale = object.userData.contactorBaseScale;
    if (!part || !basePosition || !baseScale) return;

    object.position.copy(basePosition);
    object.scale.copy(baseScale);
    const nodeName = object.name;
    if (nodeName === 'armature_moving') {
      object.position.z += lerp(CONTACTOR_MOTION.armatureZ.off, CONTACTOR_MOTION.armatureZ.on, progress) - CONTACTOR_MOTION.armatureZ.off;
    } else if (nodeName.startsWith('main_contact_bridge_')) {
      object.position.z += lerp(CONTACTOR_MOTION.bridgeZ.off, CONTACTOR_MOTION.bridgeZ.on, progress) - CONTACTOR_MOTION.bridgeZ.off;
    } else if (nodeName === 'return_spring') {
      object.position.z += lerp(CONTACTOR_MOTION.springZ.off, CONTACTOR_MOTION.springZ.on, progress);
      object.scale.z *= lerp(CONTACTOR_MOTION.springScaleZ.off, CONTACTOR_MOTION.springScaleZ.on, progress);
    } else if (nodeName === 'aux_contact_NO') {
      object.position.z += lerp(CONTACTOR_MOTION.noZ.off, CONTACTOR_MOTION.noZ.on, progress) - CONTACTOR_MOTION.noZ.off;
    } else if (nodeName === 'aux_contact_NC') {
      object.position.z += lerp(CONTACTOR_MOTION.ncZ.off, CONTACTOR_MOTION.ncZ.on, progress) - CONTACTOR_MOTION.ncZ.off;
    }

    if (exploded && part.explodedOffset) {
      object.position.x += part.explodedOffset[0];
      object.position.y += part.explodedOffset[1];
      object.position.z += part.explodedOffset[2];
    }
  });
}

function lerp(from: number, to: number, progress: number): number {
  return from + (to - from) * progress;
}

function findPart(object: Object3D, parts: ThreeDPartDefinition[]): ThreeDPartDefinition | undefined {
  return parts.find((part) => part.nodeNames?.includes(object.name));
}

function findPartId(object: Object3D, parts: ThreeDPartDefinition[]): ContactorPartId | null {
  let current: Object3D | null = object;
  while (current) {
    const directId = current.userData.contactorPartId;
    if (typeof directId === 'string') return directId as ContactorPartId;
    const part = findPart(current, parts);
    if (part) return part.id as ContactorPartId;
    current = current.parent;
  }
  return null;
}

function highlightObject(object: Object3D, color: string, intensity: number) {
  if (!('isMesh' in object) || !object.isMesh) return;
  const mesh = object as Object3D & {
    material?:
      | { clone: () => unknown; emissive?: { set: (value: string) => void }; emissiveIntensity?: number }
      | Array<{ clone: () => unknown; emissive?: { set: (value: string) => void }; emissiveIntensity?: number }>;
  };
  if (!mesh.material) return;
  const materials = Array.isArray(mesh.material)
    ? mesh.material.map((material) => material.clone())
    : mesh.material.clone();
  const apply = (material: { emissive?: { set: (value: string) => void }; emissiveIntensity?: number }) => {
    material.emissive?.set(color);
    if (material.emissive) material.emissiveIntensity = intensity;
  };
  if (Array.isArray(materials)) materials.forEach(apply);
  else apply(materials as { emissive?: { set: (value: string) => void }; emissiveIntensity?: number });
  mesh.material = materials as typeof mesh.material;
}
