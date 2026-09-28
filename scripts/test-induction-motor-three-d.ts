import assert from 'node:assert/strict';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  INDUCTION_MOTOR_EXPLODED_OFFSETS,
  INDUCTION_MOTOR_MODEL_PATH,
  inductionMotorModel,
  inductionMotorPartGroups,
  inductionMotorParts,
} from '../src/components/threeD/inductionMotorModelConfig';
import { getExplodedPartPosition } from '../src/components/threeD/ExplodedViewController';

const modelPath = resolve(process.cwd(), 'public', INDUCTION_MOTOR_MODEL_PATH.slice(1));
const ids = inductionMotorParts.map((part) => part.id);
const nodeNames = inductionMotorParts.flatMap((part) => part.nodeNames ?? []);

assert.equal(inductionMotorModel.assetUrl, INDUCTION_MOTOR_MODEL_PATH);
assert.ok(existsSync(modelPath), 'lokální induction motor GLB existuje');
assert.equal(statSync(modelPath).size, 1249712, 'GLB odpovídá ověřené velikosti Blender spike');
assert.equal(new Set(ids).size, ids.length, 'části motoru mají unikátní ID');
assert.equal(new Set(nodeNames).size, nodeNames.length, 'node mapping motoru je jednoznačný');
assert.equal(inductionMotorPartGroups.length, 5, 'motor má pět didaktických skupin');

for (const part of inductionMotorParts) {
  assert.ok(part.nodeNames && part.nodeNames.length > 0, `${part.id} má GLB node mapping`);
  assert.ok(part.description.length > 0, `${part.id} má český didaktický popis`);
  assert.deepEqual(getExplodedPartPosition(part, false), [0, 0, 0], `${part.id} má složenou polohu`);
}

for (const [partId, offset] of Object.entries(INDUCTION_MOTOR_EXPLODED_OFFSETS)) {
  const part = inductionMotorParts.find((candidate) => candidate.id === partId);
  assert.ok(part, `${partId} má část v mappingu`);
  assert.deepEqual(getExplodedPartPosition(part!, true), offset, `${partId} má exploded offset`);
}

for (const requiredNode of [
  'housing',
  'stator_core',
  'stator_winding_phase_u',
  'stator_winding_phase_v',
  'stator_winding_phase_w',
  'rotor_core',
  'rotor_cage_bars',
  'rotor_end_ring_front',
  'rotor_end_ring_rear',
  'shaft',
  'bearing_front',
  'bearing_rear',
  'end_shield_front',
  'end_shield_rear',
  'terminal_box',
  'terminal_block',
  'fan',
  'fan_cover',
  'air_gap_guide',
  'rotating_field_guide',
]) {
  assert.ok(nodeNames.includes(requiredNode), `${requiredNode} má mapování na GLB node`);
}

const demoSource = readFileSync(resolve(process.cwd(), 'src/components/demos/InductionMotorDemo.tsx'), 'utf8');
const viewSource = readFileSync(resolve(process.cwd(), 'src/components/threeD/InductionMotor3DView.tsx'), 'utf8');
const modelSource = readFileSync(resolve(process.cwd(), 'src/components/threeD/InductionMotorModel.tsx'), 'utf8');
const controlsSource = readFileSync(resolve(process.cwd(), 'src/components/threeD/InductionMotor3DControls.tsx'), 'utf8');

assert.match(demoSource, /lazy\(\(\) =>/);
assert.match(demoSource, /2D schéma/);
assert.match(demoSource, /3D model/);
assert.doesNotMatch(demoSource, /induction-motor-educational\.glb/);
assert.match(viewSource, /isWebGLAvailable/);
assert.match(viewSource, /useMotionPolicy/);
assert.match(viewSource, /Použít 2D schéma/);
assert.match(viewSource, /previousFunctionalState/);
assert.match(modelSource, /rotorRadiansPerSecond/);
assert.match(modelSource, /fieldRadiansPerSecond/);
assert.match(modelSource, /useFrame/);
assert.match(modelSource, /air_gap_guide/);
assert.match(modelSource, /rotating_field_guide/);
assert.match(controlsSource, /Celý motor/);
assert.match(controlsSource, /Výukový řez/);
assert.match(controlsSource, /Stator/);
assert.match(controlsSource, /Rotor/);
assert.match(controlsSource, /Pootočit rotor/);
assert.match(demoSource, /Ustálený chod a skluz/);

const lessonSource = readFileSync(resolve(process.cwd(), 'src/data/lessons-stroje.ts'), 'utf8');
assert.match(lessonSource, /type: 'induction-motor'/);
assert.match(lessonSource, /InductionMotorDemo použij jako vizuální potvrzení/);

console.log('ElektroLab induction motor 3D model tests');
console.log('PASS config, local GLB, node mapping, exploded offsets, lazy loading, motion and 2D source-of-truth parity');
