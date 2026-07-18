/**
 * CLI: npm run test
 *
 * Testy čisté rozhodovací funkce Tab trapu (MVP-12A2) ve stylu projektu:
 * tsx skript bez další testovací knihovny, čitelný report, exit code 1
 * při alespoň jednom selhání. Funkce je čistá matematika nad indexy —
 * DOM tu není potřeba a produkční logika se nekopíruje.
 */
import assert from 'node:assert/strict';

import { getTrapFocusIndex } from '../src/lib/focus';

let passed = 0;
const failures: string[] = [];

function test(name: string, fn: () => void) {
  try {
    fn();
    passed += 1;
    console.log(`PASS ${name}`);
  } catch (error) {
    failures.push(name);
    console.log(`FAIL ${name}`);
    console.log(`  ${error instanceof Error ? error.message : String(error)}`);
  }
}

test('prázdný dialog: není co zaměřit (Tab i Shift+Tab)', () => {
  assert.equal(getTrapFocusIndex(-1, 0, false), null);
  assert.equal(getTrapFocusIndex(-1, 0, true), null);
});

test('jediný prvek: fokus zůstává na něm (Tab i Shift+Tab)', () => {
  assert.equal(getTrapFocusIndex(0, 1, false), 0);
  assert.equal(getTrapFocusIndex(0, 1, true), 0);
});

test('jediný prvek: i fokus mimo seznam se vrací na něj', () => {
  assert.equal(getTrapFocusIndex(-1, 1, false), 0);
  assert.equal(getTrapFocusIndex(-1, 1, true), 0);
});

test('Tab uprostřed jde na následující prvek', () => {
  assert.equal(getTrapFocusIndex(0, 3, false), 1);
  assert.equal(getTrapFocusIndex(1, 3, false), 2);
});

test('Tab na posledním prvku přechází cyklicky na první', () => {
  assert.equal(getTrapFocusIndex(2, 3, false), 0);
  assert.equal(getTrapFocusIndex(1, 2, false), 0);
});

test('Shift+Tab uprostřed jde na předchozí prvek', () => {
  assert.equal(getTrapFocusIndex(2, 3, true), 1);
  assert.equal(getTrapFocusIndex(1, 3, true), 0);
});

test('Shift+Tab na prvním prvku přechází cyklicky na poslední', () => {
  assert.equal(getTrapFocusIndex(0, 3, true), 2);
  assert.equal(getTrapFocusIndex(0, 2, true), 1);
});

test('fokus mimo seznam: Tab vstupuje na první prvek', () => {
  assert.equal(getTrapFocusIndex(-1, 3, false), 0);
});

test('fokus mimo seznam: Shift+Tab vstupuje na poslední prvek', () => {
  assert.equal(getTrapFocusIndex(-1, 3, true), 2);
});

test('index mimo rozsah se bere jako fokus mimo seznam', () => {
  assert.equal(getTrapFocusIndex(3, 3, false), 0);
  assert.equal(getTrapFocusIndex(5, 3, true), 2);
});

console.log('');
console.log(`Passed: ${passed}`);
console.log(`Failed: ${failures.length}`);
console.log('');
console.log(failures.length === 0 ? 'PASS' : 'FAIL');

if (failures.length > 0) {
  process.exit(1);
}
