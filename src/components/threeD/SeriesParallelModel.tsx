import { useMemo } from 'react';
import { Quaternion, Vector3 } from 'three';
import type { ThreeDPartDefinition, ThreeDVector } from './types';
import { getExplodedPartPosition } from './ExplodedViewController';
import { ThreeDModel } from './ThreeDModel';
import type { ThreeDModelDefinition } from './types';

export interface SeriesParallel3DState {
  activePartIds: Set<string>;
  litPartIds: Set<string>;
  faultyPartIds: Set<string>;
  highlightedPartIds: Set<string>;
  flowVisible: boolean;
}

interface SeriesParallelModelProps {
  definition: ThreeDModelDefinition;
  state: SeriesParallel3DState;
  exploded: boolean;
  selectedPartId: string | null;
  onSelectPart: (partId: string) => void;
}

export function SeriesParallelModel({
  definition,
  state,
  exploded,
  selectedPartId,
  onSelectPart,
}: SeriesParallelModelProps) {
  return (
    <ThreeDModel definition={definition}>
      {definition.parts.map((part) => (
        <CircuitPart
          key={part.id}
          part={part}
          exploded={exploded}
          active={state.activePartIds.has(part.id)}
          lit={state.litPartIds.has(part.id)}
          faulty={state.faultyPartIds.has(part.id)}
          highlighted={state.highlightedPartIds.has(part.id)}
          selected={selectedPartId === part.id}
          flowVisible={state.flowVisible}
          onSelect={onSelectPart}
        />
      ))}
    </ThreeDModel>
  );
}
interface CircuitPartProps {
  part: ThreeDPartDefinition;
  exploded: boolean;
  active: boolean;
  lit: boolean;
  faulty: boolean;
  highlighted: boolean;
  selected: boolean;
  flowVisible: boolean;
  onSelect: (partId: string) => void;
}

function CircuitPart({
  part,
  exploded,
  active,
  lit,
  faulty,
  highlighted,
  selected,
  flowVisible,
  onSelect,
}: CircuitPartProps) {
  const position = getExplodedPartPosition(part, exploded);
  const accent = selected || highlighted;
  const onClick = (event: { stopPropagation: () => void }) => {
    event.stopPropagation();
    onSelect(part.id);
  };

  return (
    <group position={position} onClick={onClick}>
      {part.kind === 'source' && <Battery active={active} selected={selected} />}
      {part.kind === 'bulb' && (
        <Bulb active={active} lit={lit} faulty={faulty} selected={selected} />
      )}
      {part.kind === 'node' && (
        <Node active={active} highlighted={accent} selected={selected} />
      )}
      {part.kind === 'wire' && part.geometry && (
        <Wire
          segments={part.geometry.segments}
          active={active}
          selected={selected}
          flowVisible={flowVisible && active}
        />
      )}
    </group>
  );
}

function Battery({ active, selected }: { active: boolean; selected: boolean }) {
  return (
    <group>
      <mesh position={[0, 0, 0]} castShadow onPointerDown={(event) => event.stopPropagation()}>
        <boxGeometry args={[0.75, 1.15, 0.75]} />
        <meshStandardMaterial
          color={selected ? '#2563eb' : '#334155'}
          roughness={0.72}
          metalness={0.12}
        />
      </mesh>
      <mesh position={[0, 0.72, 0]}>
        <cylinderGeometry args={[0.13, 0.13, 0.18, 8]} />
        <meshStandardMaterial color={active ? '#f59e0b' : '#cbd5e1'} />
      </mesh>
      <mesh position={[0, -0.72, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.18, 8]} />
        <meshStandardMaterial color="#cbd5e1" />
      </mesh>
    </group>
  );
}

function Bulb({
  active,
  lit,
  faulty,
  selected,
}: {
  active: boolean;
  lit: boolean;
  faulty: boolean;
  selected: boolean;
}) {
  const glassColor = faulty ? '#fecaca' : lit ? '#fbbf24' : '#e2e8f0';
  return (
    <group>
      <mesh position={[0, -0.3, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.22, 0.28, 0.35, 10]} />
        <meshStandardMaterial color={selected ? '#2563eb' : '#64748b'} />
      </mesh>
      <mesh position={[0, 0.08, 0]} castShadow>
        <sphereGeometry args={[0.42, 12, 8]} />
        <meshStandardMaterial
          color={selected ? '#60a5fa' : glassColor}
          emissive={lit ? '#f59e0b' : active ? '#2563eb' : '#000000'}
          emissiveIntensity={lit ? 0.55 : active ? 0.12 : 0}
          roughness={0.32}
          transparent
          opacity={0.94}
        />
      </mesh>
      <mesh position={[0, 0.08, 0]} rotation={[0, 0, Math.PI / 4]}>
        <torusGeometry args={[0.18, 0.025, 6, 12]} />
        <meshStandardMaterial color={faulty ? '#b91c1c' : '#475569'} />
      </mesh>
    </group>
  );
}

function Node({
  active,
  highlighted,
  selected,
}: {
  active: boolean;
  highlighted: boolean;
  selected: boolean;
}) {
  return (
    <mesh castShadow>
      <sphereGeometry args={[highlighted ? 0.25 : 0.18, 10, 8]} />
      <meshStandardMaterial
        color={selected ? '#2563eb' : highlighted ? '#f59e0b' : active ? '#0f766e' : '#64748b'}
        emissive={active ? '#0f766e' : '#000000'}
        emissiveIntensity={active ? 0.2 : 0}
      />
    </mesh>
  );
}
function Wire({
  segments,
  active,
  selected,
  flowVisible,
}: {
  segments: Array<[ThreeDVector, ThreeDVector]>;
  active: boolean;
  selected: boolean;
  flowVisible: boolean;
}) {
  return (
    <>
      {segments.map(([start, end], index) => (
        <WireSegment
          key={`${start.join('-')}-${end.join('-')}-${index}`}
          start={start}
          end={end}
          active={active}
          selected={selected}
          flowVisible={flowVisible}
        />
      ))}
    </>
  );
}

function WireSegment({
  start,
  end,
  active,
  selected,
  flowVisible,
}: {
  start: ThreeDVector;
  end: ThreeDVector;
  active: boolean;
  selected: boolean;
  flowVisible: boolean;
}) {
  const { position, quaternion, length } = useMemo(() => {
    const startVector = new Vector3(...start);
    const endVector = new Vector3(...end);
    const direction = endVector.clone().sub(startVector);
    const length = direction.length();
    const position = startVector.clone().add(endVector).multiplyScalar(0.5);
    const quaternion = new Quaternion().setFromUnitVectors(
      new Vector3(0, 1, 0),
      direction.normalize(),
    );
    return { position, quaternion, length };
  }, [end, start]);

  return (
    <mesh position={position} quaternion={quaternion}>
      <cylinderGeometry args={[selected ? 0.095 : 0.07, selected ? 0.095 : 0.07, length, 8]} />
      <meshStandardMaterial
        color={selected ? '#2563eb' : active ? '#0f766e' : '#94a3b8'}
        emissive={flowVisible ? '#f59e0b' : '#000000'}
        emissiveIntensity={flowVisible ? 0.35 : 0}
      />
    </mesh>
  );
}
