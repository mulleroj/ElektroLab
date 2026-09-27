import assert from 'node:assert/strict';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  CONTACTOR_MODEL_PATH,
  contactorModel,
  contactorPartGroups,
  contactorParts,
} from '../src/components/threeD/contactorModelConfig';
import { CONTACTOR_MOTION, getContactorPartState } from '../src/components/threeD/contactorState';

const modelPath = resolve(process.cwd(), 'public', CONTACTOR_MODEL_PATH.slice(1));
const ids = contactorParts.map((part) => part.id);
const nodeNames = contactorParts.flatMap((part) => part.nodeNames ?? []);

assert.equal(contactorModel.assetUrl, CONTACTOR_MODEL_PATH, 'stykač používá lokální model path');
assert.ok(existsSync(modelPath), 'lokální contactor GLB existuje');
assert.equal(statSync(modelPath).size, 667864, 'GLB odpovídá ověřené velikosti Blender spike');
assert.equal(new Set(ids).size, ids.length, 'části mají unikátní ID');
assert.equal(new Set(nodeNames).size, nodeNames.length, 'GLB node mapping je jednoznačný');
assert.equal(contactorParts.length, 15, 'stykač má didaktické skupiny všech požadovaných částí');
assert.equal(contactorPartGroups.length, 4, 'seznam částí je rozdělen do čtyř skupin');

for (const requiredNode of [
  'housing',
  'coil',
  'magnetic_core_fixed',
  'armature_moving',
  'return_spring',
  'main_contact_L1',
  'main_contact_T1',
  'aux_contact_NO',
  'aux_contact_NC',
  'coil_terminal_A1',
  'coil_terminal_A2',
  'power_terminal_L1',
  'power_terminal_T3',
  'label_L1',
  'label_T3',
]) {
  assert.ok(nodeNames.includes(requiredNode), `${requiredNode} má mapování na GLB node`);
}

for (const part of contactorParts) {
  assert.ok(part.description.length > 0, `${part.id} má didaktický popis`);
  assert.ok(part.explodedOffset?.some((value) => value !== 0), `${part.id} má exploded offset`);
}

assert.equal(CONTACTOR_MOTION.armatureZ.off, 1.58);
assert.equal(CONTACTOR_MOTION.armatureZ.on, 1.22);
assert.equal(CONTACTOR_MOTION.bridgeZ.off, 1.46);
assert.equal(CONTACTOR_MOTION.bridgeZ.on, 0.97);
assert.equal(CONTACTOR_MOTION.springScaleZ.on, 0.72);
assert.equal(CONTACTOR_MOTION.noZ.off, 0.62);
assert.equal(CONTACTOR_MOTION.noZ.on, 0.35);
assert.equal(CONTACTOR_MOTION.ncZ.off, -0.48);
assert.equal(CONTACTOR_MOTION.ncZ.on, -0.72);
assert.match(getContactorPartState('aux_contact_NO', false), /rozepnutý/);
assert.match(getContactorPartState('aux_contact_NO', true), /sepnutý/);
assert.match(getContactorPartState('aux_contact_NC', false), /sepnutý/);
assert.match(getContactorPartState('aux_contact_NC', true), /rozepnutý/);

const demoSource = readFileSync(resolve(process.cwd(), 'src/components/demos/ContactorRelayDemo.tsx'), 'utf8');
const viewSource = readFileSync(resolve(process.cwd(), 'src/components/threeD/Contactor3DView.tsx'), 'utf8');
const modelSource = readFileSync(resolve(process.cwd(), 'src/components/threeD/ContactorModel.tsx'), 'utf8');
assert.match(demoSource, /lazy\(\(\) =>/);
assert.match(demoSource, /2D schéma/);
assert.match(demoSource, /3D model/);
assert.match(demoSource, /initialCoilActive=\{coilOn\}/);
assert.doesNotMatch(demoSource, /contactor-educational\.glb/);
assert.match(viewSource, /isWebGLAvailable/);
assert.match(viewSource, /useMotionPolicy/);
assert.match(viewSource, /Použít 2D schéma/);
assert.match(viewSource, /initialCoilActiveRef/);
assert.match(viewSource, /initialCoilActiveRef\.current === initialCoilActive/);
assert.match(viewSource, /previousCoilState\.current = coilActive/);
assert.match(modelSource, /useFrame/);

console.log('ElektroLab contactor 3D model tests');
console.log('PASS config, local GLB, node mapping, state transforms, lazy loading and fallback');
