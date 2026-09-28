import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Object3D } from 'three';
import type { ThreeDModelDefinition, ThreeDPartDefinition } from './types';
import type { InductionMotorPartId } from './inductionMotorModelConfig';
import type {
  InductionMotorIsolation,
  InductionMotorRunState,
  InductionMotorViewMode,
} from './inductionMotorState';
import { INDUCTION_MOTOR_MOTION } from './inductionMotorState';
import { useLocalGltfScene } from './useLocalGltfScene';

interface InductionMotorModelProps {
  definition: ThreeDModelDefinition;
  viewMode: InductionMotorViewMode;
  isolation: InductionMotorIsolation;
  showAirGap: boolean;
  showField: boolean;
  runState: InductionMotorRunState;
  exploded: boolean;
  selectedPartId: InductionMotorPartId | null;
  highlightedPartIds: Set<InductionMotorPartId>;
  manualRotation: number;
  reduceMotion: boolean;
  onSelectPart: (partId: InductionMotorPartId) => void;
}
export function InductionMotorModel(props: InductionMotorModelProps) {
  if (!props.definition.assetUrl) return null;
  return <LoadedInductionMotorModel {...props} url={props.definition.assetUrl} />;
}

function LoadedInductionMotorModel({
  definition,
  url,
  viewMode,
  isolation,
  showAirGap,
  showField,
  runState,
  exploded,
  selectedPartId,
  highlightedPartIds,
  manualRotation,
  reduceMotion,
  onSelectPart,
}: InductionMotorModelProps & { url: string }) {
  const sourceScene = useLocalGltfScene(url);
  const scene = useMemo(
    () => prepareScene(sourceScene, definition.parts, selectedPartId, highlightedPartIds),
    [definition.parts, highlightedPartIds, selectedPartId, sourceScene],
  );
  const rotorRef = useRef<Object3D | null>(null);
  const fanRef = useRef<Object3D | null>(null);
  const fieldRef = useRef<Object3D | null>(null);

  useEffect(() => {
    scene.traverse((object) => {
      if (object.name === 'rotor_assembly') rotorRef.current = object;
      if (object.name === 'fan') fanRef.current = object;
      if (object.name === 'rotating_field_guide') fieldRef.current = object;
    });
  }, [scene]);

  useEffect(() => {
    applySceneState(scene, definition.parts, viewMode, isolation, showAirGap, showField, exploded);
    setRotation(rotorRef.current, manualRotation);
    setRotation(fanRef.current, manualRotation);
    setRotation(fieldRef.current, manualRotation * 1.25);
  }, [definition.parts, exploded, isolation, manualRotation, scene, showAirGap, showField, viewMode]);

  useFrame((_, delta) => {
    if (runState !== 'running' || reduceMotion || exploded) return;
    if (rotorRef.current) rotorRef.current.rotation.x += delta * INDUCTION_MOTOR_MOTION.rotorRadiansPerSecond;
    if (fanRef.current) fanRef.current.rotation.x += delta * INDUCTION_MOTOR_MOTION.rotorRadiansPerSecond;
    if (fieldRef.current) fieldRef.current.rotation.x += delta * INDUCTION_MOTOR_MOTION.fieldRadiansPerSecond;
  });

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
  selectedPartId: InductionMotorPartId | null,
  highlightedPartIds: Set<InductionMotorPartId>,
): Object3D {
  const scene = sourceScene.clone(true);
  scene.traverse((object) => {
    const part = findPart(object, parts);
    if (part) object.userData.inductionMotorPartId = part.id;
    object.userData.inductionMotorBasePosition = object.position.clone();
  });

  scene.traverse((object) => {
    const partId = findPartId(object);
    if (!partId) return;
    if (partId === selectedPartId) highlightObject(object, '#2563eb', 0.42);
    else if (highlightedPartIds.has(partId)) highlightObject(object, '#f59e0b', 0.28);
  });
  return scene;
}

function applySceneState(
  scene: Object3D,
  parts: ThreeDPartDefinition[],
  viewMode: InductionMotorViewMode,
  isolation: InductionMotorIsolation,
  showAirGap: boolean,
  showField: boolean,
  exploded: boolean,
) {
  scene.visible = true;
  scene.traverse((object) => {
    object.visible = true;
    const basePosition = object.userData.inductionMotorBasePosition;
    if (basePosition) object.position.copy(basePosition);
  });

  const setVisible = (name: string, visible: boolean) => {
    const object = scene.getObjectByName(name);
    if (object) object.visible = visible;
  };

  if (isolation === 'stator') {
    setVisible('housing_assembly', false);
    setVisible('rotor_assembly', false);
    setVisible('fan', false);
    setVisible('fan_cover', false);
    setVisible('end_shield_front', false);
    setVisible('end_shield_rear', false);
    setVisible('bearing_front', false);
    setVisible('bearing_rear', false);
    setVisible('terminal_box', false);
  } else if (isolation === 'rotor') {
    setVisible('housing_assembly', false);
    setVisible('stator_assembly', false);
    setVisible('end_shield_front', false);
    setVisible('end_shield_rear', false);
    setVisible('bearing_front', false);
    setVisible('bearing_rear', false);
    setVisible('terminal_box', false);
    setVisible('fan_cover', false);
  }

  if (viewMode === 'cutaway' && isolation === 'all') {
    setVisible('housing_cutaway_section', false);
    setVisible('end_shield_front', false);
  }

  setVisible('air_gap_guide', showAirGap && isolation !== 'stator');
  setVisible('rotating_field_guide', showField && !exploded && isolation !== 'rotor');
  setVisible('didactic_helpers', showAirGap || (showField && !exploded));

  if (!exploded) return;

  const offsetPartByNode = new Map<string, ThreeDPartDefinition>();
  for (const part of parts) {
    if (!part.explodedOffset) continue;
    for (const nodeName of part.nodeNames ?? []) offsetPartByNode.set(nodeName, part);
  }

  scene.traverse((object) => {
    const part = offsetPartByNode.get(object.name);
    if (!part?.explodedOffset || hasOffsetAncestor(object, offsetPartByNode)) return;
    object.position.x += part.explodedOffset[0];
    object.position.y += part.explodedOffset[1];
    object.position.z += part.explodedOffset[2];
  });
}

function hasOffsetAncestor(object: Object3D, offsetPartByNode: Map<string, ThreeDPartDefinition>): boolean {
  let ancestor = object.parent;
  while (ancestor) {
    if (offsetPartByNode.has(ancestor.name)) return true;
    ancestor = ancestor.parent;
  }
  return false;
}

function setRotation(object: Object3D | null, rotation: number) {
  if (object) object.rotation.x = rotation;
}

function findPart(object: Object3D, parts: ThreeDPartDefinition[]): ThreeDPartDefinition | undefined {
  return parts.find((part) => part.nodeNames?.includes(object.name));
}

function findPartId(object: Object3D): InductionMotorPartId | null {
  let current: Object3D | null = object;
  while (current) {
    const partId = current.userData.inductionMotorPartId;
    if (typeof partId === 'string') return partId as InductionMotorPartId;
    current = current.parent;
  }
  return null;
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
