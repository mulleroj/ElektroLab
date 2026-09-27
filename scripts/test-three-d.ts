import assert from 'node:assert/strict';
import { getExplodedPartPosition } from '../src/components/threeD/ExplodedViewController';
import { getSeriesParallel3DModel } from '../src/components/threeD/seriesParallelModelConfig';

const serial = getSeriesParallel3DModel('serial');
const parallel = getSeriesParallel3DModel('parallel');

assert.equal(serial.parts.length, 5, 'sériový pilot má pět interaktivních částí');
assert.equal(parallel.parts.length, 9, 'paralelní pilot má uzly, větve a dvě žárovky');
assert.ok(parallel.parts.some((part) => part.id === 'node-split'));
assert.ok(parallel.parts.some((part) => part.id === 'node-merge'));
assert.ok(parallel.parts.some((part) => part.id === 'branch-upper'));
assert.ok(parallel.parts.some((part) => part.id === 'branch-lower'));

for (const part of [...serial.parts, ...parallel.parts]) {
  assert.ok(part.label.length > 0, `${part.id} má popisek`);
  assert.ok(part.description.length > 0, `${part.id} má textovou funkci`);
  assert.deepEqual(
    getExplodedPartPosition(part, false),
    part.position,
    `${part.id} zachová složenou polohu`,
  );
  assert.deepEqual(
    getExplodedPartPosition(part, true),
    part.explodedPosition,
    `${part.id} má deterministickou rozloženou polohu`,
  );
}

console.log('ElektroLab 3D model tests');
console.log('PASS sériový a paralelní model mají očekávané součásti');
console.log('PASS exploded view používá textově popsané deterministické polohy');
