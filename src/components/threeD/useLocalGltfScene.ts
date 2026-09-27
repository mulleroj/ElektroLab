import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import type { Object3D } from 'three';

/** Shared local asset loader for GLB-backed viewers built on the foundation. */
export function useLocalGltfScene(url: string): Object3D {
  return useLoader(GLTFLoader, url).scene;
}
