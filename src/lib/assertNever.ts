/**
 * Vyčerpávající kontrola discriminated unionů: když přibude nová varianta
 * bez ošetření, TypeScript ohlásí chybu už při typecheck.
 */
export function assertNever(value: never): never {
  throw new Error(`Neošetřená varianta: ${JSON.stringify(value)}`);
}
