import assert from 'node:assert/strict';
import { existsSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import { getExplodedPartPosition } from '../src/components/threeD/ExplodedViewController';
import {
  getTransformer3DModel,
  TRANSFORMER_MODEL_PATH,
  transformerParts,
} from '../src/components/threeD/transformerModelConfig';

const model = getTransformer3DModel();
const ids = transformerParts.map((part) => part.id);
const modelPath = resolve(process.cwd(), 'public', TRANSFORMER_MODEL_PATH.slice(1));

assert.equal(model.assetUrl, TRANSFORMER_MODEL_PATH, 'transformátor používá lokální model path');
assert.ok(existsSync(modelPath), 'lokální transformer GLB existuje');
assert.equal(statSync(modelPath).size, 711528, 'GLB odpovídá ověřené velikosti Blender spike');
assert.equal(new Set(ids).size, ids.length, 'části mají unikátní ID');
assert.equal(transformerParts.length, 8, 'transformátor má všech osm interaktivních částí');

for (const part of transformerParts) {
  assert.ok(part.nodeNames && part.nodeNames.length > 0, `${part.id} má GLB node mapping`);
  assert.ok(part.description.length > 0, `${part.id} má didaktický popis`);
  assert.deepEqual(getExplodedPartPosition(part, false), [0, 0, 0], `${part.id} má složenou polohu`);
  assert.deepEqual(
    getExplodedPartPosition(part, true),
    part.explodedOffset,
    `${part.id} má explicitní exploded offset`,
  );
}

assert.equal(transformerParts.find((part) => part.id === 'core')?.label, 'Magnetické jádro');
assert.equal(transformerParts.find((part) => part.id === 'primary_winding')?.label, 'Primární vinutí');
assert.equal(transformerParts.find((part) => part.id === 'secondary_winding')?.label, 'Sekundární vinutí');
assert.ok(transformerParts.some((part) => part.nodeNames?.includes('secondary_terminal_2_cap')));

console.log('ElektroLab transformer 3D model tests');
console.log('PASS config, unique IDs, local GLB, node mapping and exploded offsets');
