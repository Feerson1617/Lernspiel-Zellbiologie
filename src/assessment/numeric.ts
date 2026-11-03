import type { Status } from '../domain/contracts.ts';
export type NumericUnit = 'percent' | 'percentage_points' | 'gram' | 'dimensionless' | 'mol_per_litre';
export interface Decimal { readonly numerator: bigint; readonly denominator: bigint }
export type NumericInterpretation = Readonly<{ kind: 'number'; value: Decimal; unit: NumericUnit | null }> | Readonly<{ kind: 'empty' }> | Readonly<{ kind: 'clarify' }>;
export type NumericGrammar = 'numeric-input/1.0.0' | 'coordinate-decimal/1.0.0';
export interface NumericRule { readonly grammar?: NumericGrammar; readonly expected: string; readonly tolerance: string; readonly unit: NumericUnit }
export interface NumericOutcome { readonly status: Status; readonly reason: 'empty' | 'format' | 'unit' | 'value' | 'within_tolerance'; readonly interpretation: NumericInterpretation }
const units: Readonly<Record<string, NumericUnit>> = Object.freeze({ '%':'percent', Prozent:'percent', Prozentpunkte:'percentage_points', g:'gram', 'mol/L':'mol_per_litre' });
/** Internal canonical decimal, without rounding or binary floating-point comparisons. */
export function decimal(value: string): Decimal {
  if (!/^[+-]?\d+(?:\.\d+)?$/.test(value) || value.replace(/\D/g,'').length > 40) throw new Error('Invalid decimal contract.');
  const [whole, fraction = ''] = value.replace(/^[+-]/,'').split('.');
  return Object.freeze({ numerator: BigInt((whole ?? '') + fraction) * (value.startsWith('-') ? -1n : 1n), denominator: 10n ** BigInt(fraction.length) });
}
/** Entire input is consumed. Units and uncertainty are never guessed. */
export function interpretNumeric(input: unknown, grammar: NumericGrammar = 'numeric-input/1.0.0'): NumericInterpretation {
  if (typeof input !== 'string' || input.length > 128) return Object.freeze({ kind:'clarify' });
  const value = input.trim().replace(/^−/,'-');
  if (!value) return Object.freeze({ kind:'empty' });
  const pattern = grammar === 'coordinate-decimal/1.0.0' ? /^([+-]?\d+(?:[.,]\d+)?)(?:\s*(%|Prozentpunkte|Prozent|g|mol\/L))?$/ : /^([+-]?\d+(?:[.,]\d+)?)(?:\s*(%|Prozentpunkte|Prozent|g))?$/;
  const match = pattern.exec(value);
  if (!match) return Object.freeze({ kind:'clarify' });
  const number = match[1]!;
  if (number.replace(/\D/g,'').length > 40 || /^[+-]?0\d/.test(number)
    || (/[.,]\d{3}$/.test(number) && !(grammar === 'coordinate-decimal/1.0.0' && /^[+-]?0[.,]/.test(number)))) return Object.freeze({ kind:'clarify' });
  return Object.freeze({ kind:'number', value:decimal(number.replace(',','.')), unit:match[2] ? units[match[2]]! : null });
}
export function evaluateNumeric(input: unknown, rule: NumericRule): NumericOutcome {
  const expected = decimal(rule.expected), tolerance = decimal(rule.tolerance);
  if (tolerance.numerator < 0n || !['percent','percentage_points','gram','dimensionless','mol_per_litre'].includes(rule.unit) || (rule.unit === 'mol_per_litre' && rule.grammar !== 'coordinate-decimal/1.0.0')) throw new Error('Invalid numeric rule.');
  const interpretation = interpretNumeric(input, rule.grammar);
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

/** Exact rational operations shared by numeric and diagram checks; never pixel arithmetic. */
export function compareDecimal(a: Decimal, b: Decimal): number {
  const d = a.numerator * b.denominator - b.numerator * a.denominator;
  return d < 0n ? -1 : d > 0n ? 1 : 0;
}
export function subtractDecimal(a: Decimal, b: Decimal): Decimal {
  return { numerator:a.numerator*b.denominator-b.numerator*a.denominator, denominator:a.denominator*b.denominator };
}
/** Presentation only: does not change any interpretation or assessment status. */
export function numericFormatMessage(input: unknown, grammar: NumericGrammar = 'numeric-input/1.0.0'): string {
  if (typeof input === 'string' && input.length > 128) return 'Die Eingabe ist zu lang: höchstens 128 Zeichen und 40 Ziffern pro Zahl. Kürze sie auf den Zahlenwert mit optionaler Einheit.';
  if (typeof input === 'string' && input.replace(/\D/g,'').length > 40) return 'Die Zahl enthält zu viele Ziffern: höchstens 40 Ziffern und 128 Zeichen pro Eingabe.';
  if (typeof input === 'string' && /[.,]\d{3}(?:\s*(?:%|Prozent|Prozentpunkte|g|mol\/L))?$/.test(input.trim())) {
    return grammar === 'numeric-input/1.0.0'
      ? 'Genau drei Nachkommastellen gelten in dieser Zahlenformatregel als mögliche Tausendergruppe. Schreibe zum Beispiel 8 oder 8,00 statt 8,000. Der Wert wird nicht als Rechenfehler gewertet.'
      : 'Diese Dreiergruppe kann ein Tausendertrennzeichen enthalten. Verwende keine Tausendergruppen; schreibe zum Beispiel 1 oder 1,00. Koordinaten wie 0,095 sind zulässig.';
  }
  return 'Bitte eine eindeutige Dezimalzahl ohne Tausendertrennzeichen, weitere Zahlen oder zusätzliche Aussagen eingeben.';
}
