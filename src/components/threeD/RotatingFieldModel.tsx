import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Object3D } from 'three';
import type { ThreeDModelDefinition, ThreeDPartDefinition } from './types';
import { useLocalGltfScene } from './useLocalGltfScene';
import {
  ROTATING_FIELD_HIDDEN_NODES,
  type RotatingFieldPartId,
} from './rotatingFieldModelConfig';
import type { RotatingFieldPhase } from '../demos/rotatingFieldState';

interface RotatingFieldModelProps {
  definition: ThreeDModelDefinition;
  stepIndex: number;
  selectedPhase: RotatingFieldPhase;
  selectedPartId: RotatingFieldPartId;
  fieldAngle: number;
  animateField: boolean;
  reduceMotion: boolean;
  onSelectPart: (partId: RotatingFieldPartId) => void;
}

export function RotatingFieldModel(props: RotatingFieldModelProps) {
  if (!props.definition.assetUrl) return null;
  return <LoadedRotatingFieldModel {...props} url={props.definition.assetUrl} />;
}

function LoadedRotatingFieldModel({
  definition,
  url,
  stepIndex,
  selectedPhase,
  selectedPartId,
  fieldAngle,
  animateField,
  reduceMotion,
  onSelectPart,
}: RotatingFieldModelProps & { url: string }) {
  const sourceScene = useLocalGltfScene(url);
  const activePhase = stepIndex >= 1 && stepIndex <= 3 ? (['U', 'V', 'W'] as const)[stepIndex - 1] : null;
  const highlightedPartIds = useMemo(
    () => new Set<RotatingFieldPartId>([
      'stator_core',
      ...(activePhase ? [phaseToPartId(activePhase)] : []),
      ...(stepIndex >= 4 ? (['winding_u', 'winding_v', 'winding_w', 'rotating_field'] as const) : []),
    ]),
    [activePhase, stepIndex],
  );
  const scene = useMemo(
    () => prepareScene(sourceScene, definition.parts, selectedPartId, selectedPhase, highlightedPartIds),
    [definition.parts, highlightedPartIds, selectedPartId, selectedPhase, sourceScene],
  );
  const fieldRef = useRef<Object3D | null>(null);
  const rotationRef = useRef(fieldAngle);

  useEffect(() => {
    scene.traverse((object) => {
      if (object.name === 'rotating_field_guide') fieldRef.current = object;
    });
  }, [scene]);

  useEffect(() => {
    rotationRef.current = fieldAngle;
    setRotation(fieldRef.current, rotationRef.current);
  }, [fieldAngle, stepIndex]);

  useFrame((_, delta) => {
    if (!animateField || reduceMotion || stepIndex !== 5) return;
    rotationRef.current += delta * 0.42;
    setRotation(fieldRef.current, rotationRef.current);
  });

  useEffect(() => {
    applySceneState(scene, stepIndex);
    setRotation(fieldRef.current, rotationRef.current);
  }, [scene, stepIndex]);

  return (
    <group
      onPointerDown={(event) => {
        event.stopPropagation();
        const partId = findPartId(event.object);
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
  selectedPartId: RotatingFieldPartId,
  selectedPhase: RotatingFieldPhase,
  highlightedPartIds: Set<RotatingFieldPartId>,
): Object3D {
  const scene = sourceScene.clone(true);
  scene.traverse((object) => {
    const part = parts.find((candidate) => candidate.nodeNames?.includes(object.name));
    if (part) object.userData.rotatingFieldPartId = part.id;
  });
  scene.traverse((object) => {
    const partId = findPartId(object);
    if (!partId) return;
    if (partId === phaseToPartId(selectedPhase) || partId === selectedPartId) {
      highlightObject(object, '#2563eb', 0.5);
    } else if (highlightedPartIds.has(partId)) {
      highlightObject(object, '#f59e0b', 0.28);
    }
  });
  return scene;
}

function applySceneState(scene: Object3D, stepIndex: number) {
  scene.visible = true;
  scene.traverse((object) => {
    object.visible = true;
  });
  for (const nodeName of ROTATING_FIELD_HIDDEN_NODES) {
    const object = scene.getObjectByName(nodeName);
    if (object) object.visible = false;
  }
  const helper = scene.getObjectByName('rotating_field_guide');
  if (helper) helper.visible = stepIndex >= 4;
}

function phaseToPartId(phase: RotatingFieldPhase): RotatingFieldPartId {
  return `winding_${phase.toLowerCase()}` as RotatingFieldPartId;
}

function findPartId(object: Object3D): RotatingFieldPartId | null {
  let current: Object3D | null = object;
  while (current) {
    const partId = current.userData.rotatingFieldPartId;
    if (typeof partId === 'string') return partId as RotatingFieldPartId;
    current = current.parent;
  }
  return null;
}

function setRotation(object: Object3D | null, rotation: number) {
  if (object) object.rotation.x = rotation;
}

type EmissiveMaterial = {
  clone: () => EmissiveMaterial;
  emissive?: { set: (color: string) => void };
  emissiveIntensity?: number;
};

function highlightObject(object: Object3D, color: string, intensity: number) {
  if (!('isMesh' in object) || !object.isMesh) return;
  const mesh = object as Object3D & { material?: EmissiveMaterial | EmissiveMaterial[] };
  if (!mesh.material) return;
  const materials = Array.isArray(mesh.material)
    ? mesh.material.map((material) => material.clone())
    : mesh.material.clone();
  const apply = (material: EmissiveMaterial) => {
    material.emissive?.set(color);
    if (material.emissive) material.emissiveIntensity = intensity;
  };
  if (Array.isArray(materials)) materials.forEach(apply);
  else apply(materials);
  mesh.material = materials;
}
