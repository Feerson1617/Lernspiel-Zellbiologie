import type { Status } from '../domain/contracts.ts';
export type NumericUnit = 'percent' | 'percentage_points' | 'gram' | 'dimensionless';
export interface Decimal { readonly numerator: bigint; readonly denominator: bigint }
export type NumericInterpretation = Readonly<{ kind: 'number'; value: Decimal; unit: NumericUnit | null }> | Readonly<{ kind: 'empty' }> | Readonly<{ kind: 'clarify' }>;
export interface NumericRule { readonly expected: string; readonly tolerance: string; readonly unit: NumericUnit }
export interface NumericOutcome { readonly status: Status; readonly reason: 'empty' | 'format' | 'unit' | 'value' | 'within_tolerance'; readonly interpretation: NumericInterpretation }
const units: Readonly<Record<string, NumericUnit>> = Object.freeze({ '%':'percent', Prozent:'percent', Prozentpunkte:'percentage_points', g:'gram' });
/** Internal canonical decimal, without rounding or binary floating-point comparisons. */
function decimal(value: string): Decimal {
  if (!/^[+-]?\d+(?:\.\d+)?$/.test(value) || value.replace(/\D/g,'').length > 40) throw new Error('Invalid decimal contract.');
  const [whole, fraction = ''] = value.replace(/^[+-]/,'').split('.');
  return Object.freeze({ numerator: BigInt((whole ?? '') + fraction) * (value.startsWith('-') ? -1n : 1n), denominator: 10n ** BigInt(fraction.length) });
}
/** Entire input is consumed. Units and uncertainty are never guessed. */
export function interpretNumeric(input: unknown): NumericInterpretation {
  if (typeof input !== 'string' || input.length > 128) return Object.freeze({ kind:'clarify' });
  const value = input.trim().replace(/^−/,'-');
  if (!value) return Object.freeze({ kind:'empty' });
  const match = /^([+-]?\d+(?:[.,]\d+)?)(?:\s*(%|Prozentpunkte|Prozent|g))?$/.exec(value);
  if (!match) return Object.freeze({ kind:'clarify' });
  const number = match[1]!;
  if (number.replace(/\D/g,'').length > 40 || /^[+-]?0\d/.test(number)
    || /[.,]\d{3}$/.test(number)) return Object.freeze({ kind:'clarify' });
  return Object.freeze({ kind:'number', value:decimal(number.replace(',','.')), unit:match[2] ? units[match[2]]! : null });
}
export function evaluateNumeric(input: unknown, rule: NumericRule): NumericOutcome {
  const expected = decimal(rule.expected), tolerance = decimal(rule.tolerance);
  if (tolerance.numerator < 0n || !['percent','percentage_points','gram','dimensionless'].includes(rule.unit)) throw new Error('Invalid numeric rule.');
  const interpretation = interpretNumeric(input);
  let status: Status, reason: NumericOutcome['reason'];
  if (interpretation.kind === 'empty') { status='empty'; reason='empty'; }
  else if (interpretation.kind === 'clarify') { status='clarify'; reason='format'; }
  else if (interpretation.unit !== null && interpretation.unit !== rule.unit) { status='incorrect'; reason='unit'; }
  else {
    const v=interpretation.value, delta=v.numerator*expected.denominator-expected.numerator*v.denominator;
    const within=(delta<0n ? -delta : delta)*tolerance.denominator <= tolerance.numerator*v.denominator*expected.denominator;
    status=within ? 'correct':'incorrect'; reason=within ? 'within_tolerance':'value';
  }
  return Object.freeze({ status, reason, interpretation });
}
