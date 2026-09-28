import assert from 'node:assert/strict';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  INDUCTION_MOTOR_MODEL_PATH,
  inductionMotorParts,
} from '../src/components/threeD/inductionMotorModelConfig';
import {
  rotatingFieldModel,
  rotatingFieldParts,
  ROTATING_FIELD_HIDDEN_NODES,
} from '../src/components/threeD/rotatingFieldModelConfig';
import {
  ROTATING_FIELD_PHASES,
  ROTATING_FIELD_POSITION_ANGLES,
  ROTATING_FIELD_STEPS,
} from '../src/components/demos/rotatingFieldState';

const modelPath = resolve(process.cwd(), 'public', INDUCTION_MOTOR_MODEL_PATH.slice(1));
const ids = rotatingFieldParts.map((part) => part.id);
const nodeNames = rotatingFieldParts.flatMap((part) => part.nodeNames ?? []);

assert.equal(rotatingFieldModel.assetUrl, INDUCTION_MOTOR_MODEL_PATH, '3D doplněk reuseuje motorový GLB path');
assert.ok(existsSync(modelPath), 'sdílený induction motor GLB existuje');
assert.equal(statSync(modelPath).size, 1249712, 'sdílený GLB se neduplikoval ani nezměnil');
assert.deepEqual(ids, ['stator_core', 'winding_u', 'winding_v', 'winding_w', 'rotating_field']);
assert.equal(new Set(ids).size, ids.length, 'statorové části mají unikátní ID');
assert.equal(new Set(nodeNames).size, nodeNames.length, 'statorový node mapping je jednoznačný');
for (const part of rotatingFieldParts) {
  assert.ok(part.nodeNames && part.nodeNames.length > 0, `${part.id} má GLB node mapping`);
  assert.ok(part.description.length > 0, `${part.id} má český didaktický popis`);
}
for (const requiredNode of [
  'stator_core',
  'stator_winding_phase_u',
  'stator_winding_phase_v',
  'stator_winding_phase_w',
  'rotating_field_guide',
]) {
  assert.ok(nodeNames.includes(requiredNode), `${requiredNode} má reuseované GLB mapping`);
}
for (const hiddenNode of ['housing_assembly', 'rotor_assembly', 'fan', 'fan_cover']) {
  assert.ok(ROTATING_FIELD_HIDDEN_NODES.includes(hiddenNode as (typeof ROTATING_FIELD_HIDDEN_NODES)[number]));
}

assert.equal(ROTATING_FIELD_STEPS.length, 6, '2D a 3D sdílejí šest pedagogických kroků');
assert.deepEqual(
  ROTATING_FIELD_STEPS.map((step) => step.focus),
  [null, 'U', 'V', 'W', 'field', 'field'],
  'kroky mají explicitní U/V/W a výsledné pole mapping',
);
assert.deepEqual(ROTATING_FIELD_PHASES, ['U', 'V', 'W']);
assert.deepEqual(ROTATING_FIELD_POSITION_ANGLES, [0, 60, 120, 180, 240, 300]);

const demoSource = readFileSync(resolve(process.cwd(), 'src/components/demos/RotatingFieldDemo.tsx'), 'utf8');
const viewSource = readFileSync(resolve(process.cwd(), 'src/components/threeD/RotatingField3DView.tsx'), 'utf8');
const modelSource = readFileSync(resolve(process.cwd(), 'src/components/threeD/RotatingFieldModel.tsx'), 'utf8');
const configSource = readFileSync(resolve(process.cwd(), 'src/components/threeD/rotatingFieldModelConfig.ts'), 'utf8');
const lessonSource = readFileSync(resolve(process.cwd(), 'src/data/lessons-stroje.ts'), 'utf8');

assert.match(demoSource, /lazy\(\(\) =>/);
assert.match(demoSource, /2D schéma/);
assert.match(demoSource, /3D model/);
assert.match(demoSource, /selectedPhase/);
assert.match(demoSource, /Názorné zobrazení výsledného magnetického pole/);
assert.doesNotMatch(demoSource, /induction-motor-educational\.glb/);
assert.match(viewSource, /isWebGLAvailable/);
assert.match(viewSource, /useMotionPolicy\(calmMode\)/);
assert.match(viewSource, /Předchozí poloha/);
assert.match(viewSource, /Další poloha/);
assert.match(viewSource, /reduceMotion=\{!motion\.allowContinuousMotion\}/);
assert.match(viewSource, /Použít 2D schéma/);
assert.match(modelSource, /useLocalGltfScene/);
assert.match(modelSource, /rotating_field_guide/);
assert.match(modelSource, /useFrame/);
assert.match(configSource, /INDUCTION_MOTOR_MODEL_PATH/);
assert.match(lessonSource, /type: 'rotating-field'/);
assert.match(lessonSource, /RotatingFieldDemo/);

const publicGlbFiles = [
  resolve(process.cwd(), 'public/models/induction-motor/induction-motor-educational.glb'),
  resolve(process.cwd(), 'public/models/contactor/contactor-educational.glb'),
  resolve(process.cwd(), 'public/models/transformer/transformer-educational.glb'),
];
assert.equal(publicGlbFiles.filter((path) => existsSync(path)).length, 3, 'v public/models jsou tři původní GLB assety');
assert.equal(inductionMotorParts.filter((part) => part.id === 'rotating_field').length, 1, 'rotating field mapping vychází z jediného motorového assetu');

console.log('ElektroLab rotating magnetic field 3D tests');
console.log('PASS 2D source-of-truth steps, U/V/W mapping, helper, motion policy, fallback and shared GLB path');
