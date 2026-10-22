export const SI_UNITS = Object.freeze({ concentration: 'mol/m3', amount: 'mol', volume: 'm3', pressure: 'Pa', temperature: 'K', time: 's' } as const);
export type Dimension = keyof typeof SI_UNITS;
export type SIUnitFor<D extends Dimension> = (typeof SI_UNITS)[D];

const definitions = {
  concentration: { 'mol/m3': [1, 0], 'mol/L': [1e3, 0], 'mmol/L': [1, 0] },
  amount: { mol: [1, 0], mmol: [1e-3, 0], 'µmol': [1e-6, 0], nmol: [1e-9, 0], pmol: [1e-12, 0] },
  volume: { m3: [1, 0], L: [1e-3, 0], mL: [1e-6, 0], 'µL': [1e-9, 0], pL: [1e-15, 0] },
  pressure: { Pa: [1, 0], kPa: [1e3, 0], MPa: [1e6, 0] },
  temperature: { K: [1, 0], '°C': [1, 273.15] },
  time: { s: [1, 0], min: [60, 0] },
} as const;

export type UnitFor<D extends Dimension> = D extends Dimension ? keyof (typeof definitions)[D] & string : never;
export type SIQuantity<D extends Dimension> = Readonly<{ dimension: D; value: number; unit: SIUnitFor<D> }>;
export type UnitErrorCode = 'INVALID_DIMENSION' | 'INVALID_UNIT' | 'INVALID_NUMBER' | 'INVALID_QUANTITY' | 'OUT_OF_RANGE' | 'NUMERIC_RANGE';

export class UnitConversionError extends Error {
  readonly code: UnitErrorCode;
  constructor(code: UnitErrorCode) {
    super(`Invalid quantity: ${code}.`);
    this.name = 'UnitConversionError';
    this.code = code;
  }
}

function requireDimension(value: unknown): asserts value is Dimension {
  if (typeof value !== 'string' || !Object.hasOwn(SI_UNITS, value)) throw new UnitConversionError('INVALID_DIMENSION');
}

function requireNumber(value: unknown): asserts value is number {
  if (typeof value !== 'number' || !Number.isFinite(value)) throw new UnitConversionError('INVALID_NUMBER');
}

function requireRange(dimension: Dimension, value: number): void {
  // Absolute quantities, not signed concentration/volume/time differences.
  // Pressure-unit values may also represent signed water potentials.
  if (dimension !== 'pressure' && value < 0) throw new UnitConversionError('OUT_OF_RANGE');
}

function conversion(dimension: Dimension, unit: unknown): readonly [number, number] {
  const units = definitions[dimension] as Readonly<Record<string, readonly [number, number]>>;
  if (typeof unit !== 'string' || !Object.hasOwn(units, unit)) throw new UnitConversionError('INVALID_UNIT');
  return units[unit]!;
}

function requireComputed(value: number, original: number, offset: number): void {
  if (!Number.isFinite(value) || (offset === 0 && original !== 0 && value === 0)) throw new UnitConversionError('NUMERIC_RANGE');
}

/** Explicit units, no coercion or numeric-answer parsing. Returns a tagged SI value. */
export function toSI<D extends Dimension>(dimension: D, value: number, unit: UnitFor<NoInfer<D>>): SIQuantity<D> {
  requireDimension(dimension);
  requireNumber(value);
  const [factor, offset] = conversion(dimension, unit);
  const converted = value * factor + offset;
  requireComputed(converted, value, offset);
  requireRange(dimension, converted);
  return Object.freeze({ dimension, value: Object.is(converted, -0) ? 0 : converted, unit: SI_UNITS[dimension] });
}

function requireSIQuantity(input: unknown): asserts input is SIQuantity<Dimension> {
  if (typeof input !== 'object' || input === null || Array.isArray(input)) throw new UnitConversionError('INVALID_QUANTITY');
  const prototype: unknown = Object.getPrototypeOf(input);
  const keys = Reflect.ownKeys(input);
  if ((prototype !== Object.prototype && prototype !== null) || keys.length !== 3 || !['dimension', 'value', 'unit'].every((key) => keys.includes(key))) throw new UnitConversionError('INVALID_QUANTITY');
  for (const key of keys) {
    const descriptor = Object.getOwnPropertyDescriptor(input, key);
    if (!descriptor?.enumerable || !Object.hasOwn(descriptor, 'value')) throw new UnitConversionError('INVALID_QUANTITY');
  }
  const record = input as Record<string, unknown>;
  const dimension = record['dimension'];
  requireDimension(dimension);
  requireNumber(record['value']);
  if (record['unit'] !== SI_UNITS[dimension]) throw new UnitConversionError('INVALID_UNIT');
  requireRange(dimension, record['value']);
}

export function fromSI<D extends Dimension>(quantity: SIQuantity<D>, unit: UnitFor<NoInfer<D>>): number {
  requireSIQuantity(quantity);
  const [factor, offset] = conversion(quantity.dimension, unit);
  const converted = (quantity.value - offset) / factor;
  requireComputed(converted, quantity.value, offset);
  return Object.is(converted, -0) ? 0 : converted;
}
