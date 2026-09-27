import type { ThreeDModelDefinition } from './types';
import { useLocalGltfScene } from './useLocalGltfScene';

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
  return <primitive object={useLocalGltfScene(url)} />;
}
