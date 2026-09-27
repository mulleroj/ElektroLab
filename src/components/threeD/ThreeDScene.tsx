import { useEffect, useRef } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import type { ThreeDModelDefinition } from './types';
import type { SeriesParallel3DState } from './SeriesParallelModel';
import { SeriesParallelModel } from './SeriesParallelModel';

interface ThreeDSceneProps {
  definition: ThreeDModelDefinition;
  state: SeriesParallel3DState;
  exploded: boolean;
  selectedPartId: string | null;
  cameraResetKey: number;
  onSelectPart: (partId: string) => void;
}

export function ThreeDScene({
  definition,
  state,
  exploded,
  selectedPartId,
  cameraResetKey,
  onSelectPart,
}: ThreeDSceneProps) {
  return (
    <div className="three-d-scene" aria-label={definition.description}>
      <Canvas
        camera={{ position: [5.5, 4.5, 7], fov: 42 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, powerPreference: 'low-power' }}
      >
        <color attach="background" args={['#f8fafc']} />
        <ambientLight intensity={1.8} />
        <directionalLight position={[4, 6, 5]} intensity={2.2} />
        <directionalLight position={[-4, 2, -3]} intensity={0.7} />
        <CameraOrbit resetKey={cameraResetKey} />
        <SeriesParallelModel
          definition={definition}
          state={state}
          exploded={exploded}
          selectedPartId={selectedPartId}
          onSelectPart={onSelectPart}
        />
      </Canvas>
      <p className="three-d-scene__hint">
        Táhni myší nebo prstem pro otočení. Kolečkem nebo gestem přibližuj a oddaluj.
      </p>
    </div>
  );
}

function CameraOrbit({ resetKey }: { resetKey: number }) {
  const { camera, gl } = useThree();
  const controlsRef = useRef<OrbitControls | null>(null);

  useEffect(() => {
    const controls = new OrbitControls(camera, gl.domElement);
    controls.enablePan = false;
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.minDistance = 3.5;
    controls.maxDistance = 13;
    controls.target.set(-0.35, 0, 0);
    controls.update();
    controlsRef.current = controls;
    return () => {
      controls.dispose();
      controlsRef.current = null;
    };
  }, [camera, gl]);

  useEffect(() => {
    camera.position.set(5.5, 4.5, 7);
    controlsRef.current?.target.set(-0.35, 0, 0);
    controlsRef.current?.update();
  }, [camera, resetKey]);

  return null;
}
