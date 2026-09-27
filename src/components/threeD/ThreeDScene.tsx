import { useEffect, useRef, type ReactNode } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import type { ThreeDModelDefinition } from './types';
import type { SeriesParallel3DState } from './SeriesParallelModel';
import { SeriesParallelModel } from './SeriesParallelModel';

const DEFAULT_CAMERA_POSITION: [number, number, number] = [5.5, 4.5, 7];
const DEFAULT_CAMERA_TARGET: [number, number, number] = [-0.35, 0, 0];

interface ThreeDSceneProps {
  definition: ThreeDModelDefinition;
  state?: SeriesParallel3DState;
  exploded: boolean;
  selectedPartId: string | null;
  cameraResetKey: number;
  onSelectPart: (partId: string) => void;
  children?: ReactNode;
  cameraPosition?: [number, number, number];
  cameraTarget?: [number, number, number];
  cameraMinDistance?: number;
  cameraMaxDistance?: number;
  reduceMotion?: boolean;
}

export function ThreeDScene({
  definition,
  state,
  exploded,
  selectedPartId,
  cameraResetKey,
  onSelectPart,
  children,
  cameraPosition = DEFAULT_CAMERA_POSITION,
  cameraTarget = DEFAULT_CAMERA_TARGET,
  cameraMinDistance = 3.5,
  cameraMaxDistance = 13,
  reduceMotion = false,
}: ThreeDSceneProps) {
  return (
    <div className="three-d-scene" aria-label={definition.description}>
      <Canvas
        camera={{ position: cameraPosition, fov: 42 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, powerPreference: 'low-power' }}
      >
        <color attach="background" args={['#f8fafc']} />
        <ambientLight intensity={1.8} />
        <directionalLight position={[4, 6, 5]} intensity={2.2} />
        <directionalLight position={[-4, 2, -3]} intensity={0.7} />
        <CameraOrbit
          resetKey={cameraResetKey}
          initialPosition={cameraPosition}
          target={cameraTarget}
          minDistance={cameraMinDistance}
          maxDistance={cameraMaxDistance}
          reduceMotion={reduceMotion}
        />
        {children ??
          (state ? (
            <SeriesParallelModel
              definition={definition}
              state={state}
              exploded={exploded}
              selectedPartId={selectedPartId}
              onSelectPart={onSelectPart}
            />
          ) : null)}
      </Canvas>
      <p className="three-d-scene__hint">
        Táhni myší nebo prstem pro otočení. Kolečkem nebo gestem přibližuj a oddaluj.
      </p>
    </div>
  );
}

function CameraOrbit({
  resetKey,
  initialPosition,
  target,
  minDistance,
  maxDistance,
  reduceMotion,
}: {
  resetKey: number;
  initialPosition: [number, number, number];
  target: [number, number, number];
  minDistance: number;
  maxDistance: number;
  reduceMotion: boolean;
}) {
  const { camera, gl } = useThree();
  const controlsRef = useRef<OrbitControls | null>(null);

  useEffect(() => {
    const controls = new OrbitControls(camera, gl.domElement);
    controls.enablePan = false;
    controls.enableDamping = !reduceMotion;
    controls.dampingFactor = 0.08;
    controls.minDistance = minDistance;
    controls.maxDistance = maxDistance;
    controls.target.set(...target);
    controls.update();
    controlsRef.current = controls;
    return () => {
      controls.dispose();
      controlsRef.current = null;
    };
  }, [camera, gl, maxDistance, minDistance, reduceMotion, target]);

  useEffect(() => {
    camera.position.set(...initialPosition);
    controlsRef.current?.target.set(...target);
    controlsRef.current?.update();
  }, [camera, initialPosition, resetKey, target]);

  useFrame(() => {
    if (!reduceMotion) {
      controlsRef.current?.update();
    }
  });

  return null;
}
