import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { getExplodedPartPosition } from '../src/components/threeD/ExplodedViewController';
import { getSeriesParallel3DModel } from '../src/components/threeD/seriesParallelModelConfig';
import { derive3DState } from '../src/components/threeD/seriesParallelState';
import { isWebGLAvailable } from '../src/components/threeD/webgl';

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

const serialStep0 = derive3DState('serial', 0);
const serialStep1 = derive3DState('serial', 1);
const serialStep3 = derive3DState('serial', 3);
assert.equal(serialStep0.activePartIds.size, 0);
assert.equal(serialStep1.activePartIds.has('wire-series'), true);
assert.equal(serialStep3.flowVisible, true);
assert.equal(derive3DState('serial', 4).flowVisible, false);

const parallelStep0 = derive3DState('parallel', 0);
const parallelStep1 = derive3DState('parallel', 1);
const parallelStep2 = derive3DState('parallel', 2);
const parallelStep3 = derive3DState('parallel', 3);
assert.equal(parallelStep0.activePartIds.size, 0);
assert.deepEqual([...parallelStep1.highlightedPartIds].sort(), ['node-merge', 'node-split']);
assert.equal(parallelStep2.activePartIds.has('branch-upper'), true);
assert.equal(parallelStep2.activePartIds.has('branch-lower'), true);
assert.equal(parallelStep2.activePartIds.has('wire-feed'), false);
assert.equal(parallelStep2.activePartIds.has('wire-return'), false);
assert.equal(parallelStep3.activePartIds.has('wire-feed'), true);
assert.equal(parallelStep3.flowVisible, true);

const parallelFaultStep1 = derive3DState('parallel-fault', 1);
assert.equal(parallelFaultStep1.activePartIds.has('branch-upper'), false);
assert.equal(parallelFaultStep1.activePartIds.has('branch-lower'), true);
assert.equal(parallelFaultStep1.activePartIds.has('wire-feed'), true);
assert.equal(parallelFaultStep1.activePartIds.has('wire-return'), true);
assert.equal(parallelFaultStep1.highlightedPartIds.size, 0);
assert.equal(derive3DState('serial-fault', 1).faultyPartIds.has('bulb-1'), true);

const originalDocument = Object.getOwnPropertyDescriptor(globalThis, 'document');
let contextCalls = 0;
let loseContextCalls = 0;
const fakeContext = {
  getExtension(name: string) {
    if (name === 'WEBGL_lose_context') {
      return { loseContext: () => loseContextCalls++ };
    }
    return null;
  },
};

Object.defineProperty(globalThis, 'document', {
  configurable: true,
  value: {
    createElement(tag: string) {
      assert.equal(tag, 'canvas');
      return {
        getContext(type: string) {
          contextCalls++;
          assert.equal(type, 'webgl');
          return fakeContext;
        },
      };
    },
  },
});
try {
  assert.equal(isWebGLAvailable(), true);
  assert.equal(isWebGLAvailable(), true);
  assert.equal(contextCalls, 1, 'WebGL probe se cacheuje mezi rendery');
  assert.equal(loseContextCalls, 1, 'testovací WebGL context se uvolní');
} finally {
  if (originalDocument) {
    Object.defineProperty(globalThis, 'document', originalDocument);
  } else {
    delete (globalThis as { document?: unknown }).document;
  }
}

console.log('PASS Series/Parallel 3D stav odpovídá krokům 2D včetně fault scénářů');
console.log('PASS WebGL capability probe používá jeden cacheovaný context');

const seriesViewSource = readFileSync(
  'src/components/threeD/SeriesParallel3DView.tsx',
  'utf8',
);
const seriesDemoSource = readFileSync(
  'src/components/demos/SeriesParallelDemo.tsx',
  'utf8',
);
assert.match(seriesViewSource, /useMotionPolicy\(calmMode\)/);
assert.match(seriesViewSource, /reduceMotion=\{!motion\.allowContinuousMotion\}/);
assert.match(seriesDemoSource, /calmMode=\{calmMode\}/);
console.log('PASS Series/Parallel 3D dědí Calm Mode a reduced-motion policy');
