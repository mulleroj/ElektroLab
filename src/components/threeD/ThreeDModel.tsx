import { useEffect, useState } from 'react';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import type { Object3D } from 'three';
import type { ThreeDModelDefinition } from './types';

interface ThreeDModelProps {
  definition: ThreeDModelDefinition;
  children: React.ReactNode;
}

/**
 * Shared model boundary. A future GLB/GLTF device can opt into the same scene
 * contract by setting a local `assetUrl`; the pilot supplies procedural low
 * polygon children so it has no binary asset dependency.
 */
export function ThreeDModel({ definition, children }: ThreeDModelProps) {
  if (!definition.assetUrl) {
    return <>{children}</>;
  }

  return <LocalGltfModel url={definition.assetUrl} />;
}

function LocalGltfModel({ url }: { url: string }) {
  const [scene, setScene] = useState<Object3D | null>(null);

  useEffect(() => {
    let mounted = true;
    const loader = new GLTFLoader();
    loader.load(url, (result) => {
      if (mounted) {
        setScene(result.scene);
      }
    });
    return () => {
      mounted = false;
    };
  }, [url]);

  return scene ? <primitive object={scene} /> : null;
}
