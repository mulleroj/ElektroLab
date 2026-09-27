import type { ThreeDPartDefinition, ThreeDVector } from './types';

/**
 * A deterministic assembly transform. The pilot intentionally switches
 * between two pedagogical states instead of running an uncontrolled motion
 * loop; this keeps the same information available in Calm Mode and reduced
 * motion.
 */
export function getExplodedPartPosition(
  part: ThreeDPartDefinition,
  exploded: boolean,
): ThreeDVector {
  return exploded ? part.explodedPosition : part.position;
}
