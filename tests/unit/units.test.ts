import { expect, it } from 'vitest';
import { fromSI, SI_UNITS, toSI, UnitConversionError } from '../../src/domain/units.ts';
import type { Dimension, SIQuantity } from '../../src/domain/units.ts';

function relative(actual: number, expected: number): void {
  if (expected === 0) expect(actual).toBe(0);
  else expect(Math.abs((actual - expected) / expected)).toBeLessThan(1e-14);
}

it('documents six separate internal SI dimensions', () => {
  expect(SI_UNITS).toEqual({ concentration: 'mol/m3', amount: 'mol', volume: 'm3', pressure: 'Pa', temperature: 'K', time: 's' });
});

it('converts concentration factors using independently derived decimal targets', () => {
  expect(toSI('concentration', 0.3, 'mol/L')).toEqual({ dimension: 'concentration', value: 300, unit: 'mol/m3' });
  expect(toSI('concentration', 1000, 'mmol/L').value).toBe(1000);
  expect(fromSI(toSI('concentration', 1, 'mol/L'), 'mmol/L')).toBe(1000);
  expect(fromSI(toSI('concentration', 175, 'mol/m3'), 'mol/L')).toBe(0.175);
});

it('preserves biological picolitre volumes with a relative tolerance, not a loose absolute tolerance', () => {
  relative(toSI('volume', 90, 'pL').value, 9e-14);
  relative(toSI('volume', 6, 'pL').value, 6e-15);
  relative(fromSI(toSI('volume', 5.4e-14, 'm3'), 'pL'), 54);
  relative(toSI('volume', 0.001, 'µL').value, 1e-12);
  relative(toSI('volume', 1, 'L').value, 1e-3);
  relative(toSI('volume', 2, 'mL').value, 2e-6);
});

it.each([['mol', 1, 1], ['mmol', 2, 2e-3], ['µmol', 3, 3e-6], ['nmol', 4, 4e-9], ['pmol', 3, 3e-12]] as const)('converts substance amounts in %s', (unit, value, expected) => {
  relative(toSI('amount', value, unit).value, expected);
  relative(fromSI(toSI('amount', expected, 'mol'), unit), value);
});

it('preserves the sign of water potentials expressed in pressure units', () => {
  expect(toSI('pressure', -0.42, 'MPa').value).toBe(-420_000);
  expect(toSI('pressure', 50, 'MPa').value).toBe(50_000_000);
  expect(fromSI(toSI('pressure', 487_000, 'Pa'), 'kPa')).toBe(487);
  expect(fromSI(toSI('pressure', -700_000, 'Pa'), 'MPa')).toBe(-0.7);
});

it('handles absolute temperatures without interpreting Celsius as Kelvin', () => {
  expect(toSI('temperature', 20, '°C').value).toBe(293.15);
  expect(toSI('temperature', -273.15, '°C').value).toBe(0);
  expect(fromSI(toSI('temperature', 293.15, 'K'), '°C')).toBe(20);
  expect(fromSI(toSI('temperature', 0, 'K'), '°C')).toBe(-273.15);
});

it('converts model time without claiming empirical calibration', () => {
  expect(toSI('time', 20, 'min').value).toBe(1200);
  expect(fromSI(toSI('time', 60, 's'), 'min')).toBe(1);
  expect(toSI('time', 0.125, 's').value).toBe(0.125);
});

it('returns immutable, explicitly tagged values', () => {
  const value = toSI('volume', 1, 'pL');
  expect(Object.isFrozen(value)).toBe(true);
  expect(value.dimension).toBe('volume');
  expect(value.unit).toBe('m3');
});

it.each([NaN, Infinity, -Infinity, '0,3', '3', null, undefined, true, 3n, new Number(3)])('rejects nonfinite or nonnumeric input: %s', (value) => {
  expect(() => toSI('concentration', value as number, 'mol/L')).toThrow(UnitConversionError);
});

it.each([undefined, '', 'Pa', 'mol', 'mM', ' mol/L', 'mol/l', '__proto__'])('requires an explicit supported concentration unit: %s', (unit) => {
  expect(() => toSI('concentration', 1, unit as 'mol/L')).toThrow(UnitConversionError);
});

it.each(['pressure', 'temperature', 'volume', 'time', 'amount', 'concentration'] as const)('validates the SI unit tag on an incoming %s quantity', (dimension) => {
  const forged = { dimension, value: 1, unit: 'wrong' } as unknown as SIQuantity<typeof dimension>;
  expect(() => fromSI(forged, SI_UNITS[dimension])).toThrow(UnitConversionError);
});

it.each([null, [], {}, { dimension: 'volume', value: NaN, unit: 'm3' }, { dimension: 'volume', value: 1, unit: 'm3', extra: true }, { dimension: 'wrong', value: 1, unit: 'm3' }])('rejects malformed SI values: %s', (input) => {
  expect(() => fromSI(input as SIQuantity<'volume'>, 'pL')).toThrow(UnitConversionError);
});

it('rejects accessors without evaluating them', () => {
  let called = false;
  const input = { dimension: 'volume', unit: 'm3', get value() { called = true; return 1; } };
  expect(() => fromSI(input as SIQuantity<'volume'>, 'pL')).toThrow(UnitConversionError);
  expect(called).toBe(false);
});

it('rejects unknown dimensions and cross-dimension output units at runtime', () => {
  expect(() => toSI('unknown' as Dimension, 1, 'mol')).toThrow(UnitConversionError);
  expect(() => fromSI(toSI('volume', 1, 'pL'), 'MPa' as 'pL')).toThrow(UnitConversionError);
});

it.each(['concentration', 'amount', 'volume', 'time', 'temperature'] as const)('rejects negative absolute %s values', (dimension) => {
  expect(() => toSI(dimension, -1, SI_UNITS[dimension])).toThrow(UnitConversionError);
});

it('rejects temperatures below absolute zero', () => {
  expect(() => toSI('temperature', -273.16, '°C')).toThrow(UnitConversionError);
});

it('rejects overflow and underflow instead of silently producing infinity or zero', () => {
  expect(() => toSI('pressure', 1e308, 'MPa')).toThrow('NUMERIC_RANGE');
  expect(() => toSI('volume', Number.MIN_VALUE, 'pL')).toThrow('NUMERIC_RANGE');
  expect(() => fromSI(toSI('volume', 1e308, 'm3'), 'pL')).toThrow('NUMERIC_RANGE');
  expect(() => fromSI(toSI('pressure', Number.MIN_VALUE, 'Pa'), 'MPa')).toThrow('NUMERIC_RANGE');
  expect(toSI('volume', 0, 'pL').value).toBe(0);
});

function checkStaticUnitContracts(): void {
  // @ts-expect-error A pressure unit cannot be inferred into concentration.
  toSI('concentration', 1, 'MPa');
  // @ts-expect-error Cross-dimension output units must not widen D to a union.
  fromSI(toSI('volume', 1, 'pL'), 'MPa');
  // @ts-expect-error Missing units must not receive a default.
  toSI('volume', 1);
  // @ts-expect-error Tagged pressure values are not tagged volume values.
  const volume: SIQuantity<'volume'> = toSI('pressure', 1, 'Pa');
  void volume;
}
void checkStaticUnitContracts;
