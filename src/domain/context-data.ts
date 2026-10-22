/** Finite, dense JSON data only: no mutable/executable class instances. */
export type ContextValue = null | boolean | string | number | readonly ContextValue[] | ContextRecord;
export interface ContextRecord { readonly [key: string]: ContextValue }

export type ContextErrorCode = 'INVALID_SHAPE' | 'INVALID_ID' | 'INVALID_LABEL' | 'INVALID_PHASE'
  | 'INVALID_DATA' | 'CYCLIC_DATA' | 'DATA_TOO_DEEP' | 'VERSION_MISMATCH' | 'HASH_MISMATCH';

export class ContextContractError extends Error {
  readonly code: ContextErrorCode;
  constructor(code: ContextErrorCode) {
    super(`Invalid task context: ${code}.`);
    this.name = 'ContextContractError';
    this.code = code;
  }
}

/** Reject accessors and hidden fields before reading any supplied values. */
export function readDataRecord(input: unknown): Readonly<Record<string, unknown>> {
  if (typeof input !== 'object' || input === null || Array.isArray(input)) throw new ContextContractError('INVALID_SHAPE');
  const prototype: unknown = Object.getPrototypeOf(input);
  if (prototype !== Object.prototype && prototype !== null) throw new ContextContractError('INVALID_DATA');
  for (const key of Reflect.ownKeys(input)) {
    const descriptor = Object.getOwnPropertyDescriptor(input, key);
    if (typeof key !== 'string' || !descriptor?.enumerable || !Object.hasOwn(descriptor, 'value')) {
      throw new ContextContractError('INVALID_DATA');
    }
  }
  return input as Readonly<Record<string, unknown>>;
}

interface CanonicalValue { readonly value: ContextValue; readonly json: string }

/** UTF-16 key order, JSON escaping/numbers, dense array order, -0 equal to 0. */
export function snapshotContextData(input: unknown): Readonly<{ value: ContextRecord; json: string }> {
  const ancestors = new Set<object>();
  function visit(value: unknown, depth: number): CanonicalValue {
    if (depth > 64) throw new ContextContractError('DATA_TOO_DEEP');
    if (value === null || typeof value === 'string' || typeof value === 'boolean') return { value, json: JSON.stringify(value) };
    if (typeof value === 'number') {
      if (!Number.isFinite(value)) throw new ContextContractError('INVALID_DATA');
      const number = Object.is(value, -0) ? 0 : value;
      return { value: number, json: JSON.stringify(number) };
    }
    if (typeof value !== 'object') throw new ContextContractError('INVALID_DATA');
    if (ancestors.has(value)) throw new ContextContractError('CYCLIC_DATA');
    ancestors.add(value);
    try {
      if (Array.isArray(value)) {
        const keys = Reflect.ownKeys(value);
        if (keys.length !== value.length + 1 || keys.some((key) => typeof key !== 'string')) throw new ContextContractError('INVALID_DATA');
        const children: CanonicalValue[] = [];
        for (let i = 0; i < value.length; i++) {
          const descriptor = Object.getOwnPropertyDescriptor(value, String(i));
          if (!descriptor?.enumerable || !Object.hasOwn(descriptor, 'value')) throw new ContextContractError('INVALID_DATA');
          children.push(visit(descriptor.value as unknown, depth + 1));
        }
        return { value: Object.freeze(children.map((child) => child.value)), json: `[${children.map((child) => child.json).join(',')}]` };
      }
      const record = readDataRecord(value);
      const copy: Record<string, ContextValue> = {};
      const parts: string[] = [];
      for (const key of Object.keys(record).sort()) {
        const child = visit(record[key], depth + 1);
        // defineProperty also preserves a literal '__proto__' key without invoking a setter.
        Object.defineProperty(copy, key, { value: child.value, enumerable: true });
        parts.push(`${JSON.stringify(key)}:${child.json}`);
      }
      return { value: Object.freeze(copy), json: `{${parts.join(',')}}` };
    } finally { ancestors.delete(value); }
  }
  readDataRecord(input);
  const snapshot = visit(input, 0);
  return Object.freeze({ value: snapshot.value as ContextRecord, json: snapshot.json });
}
