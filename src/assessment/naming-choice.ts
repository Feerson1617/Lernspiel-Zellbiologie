import type { TermClause } from './term-grammar.ts';

/** Resolve a bounded choice of name separately from its original evidence.
 * Only repeated positive names for the same concept can be withdrawn together.
 * Scientific predicates, exclusions and competing alternatives stay active. */
export function resolveNamingChoices(original: readonly TermClause[]): Readonly<{ clauses: readonly TermClause[]; complete: boolean }> {
  const active = original.map(() => true);
  let choice: { id: string; indices: number[]; changes: number } | undefined;
  for (const [index, current] of original.entries()) {
    const ids = current.kind === 'name' ? new Set(current.terms.map(t => t.id)) : null;
    if (current.kind !== 'name' || current.negated || ids?.size !== 1) {
      // Predicates are independent of the naming choice; never retract them.
      if (current.kind === 'name' || current.kind === 'contrast' || current.kind === 'conjoined_negation') choice = undefined;
      continue;
    }
    const id = current.terms[0]!.id;
    const previous = original[index - 1];
    if (current.correctsPrevious && previous?.kind === 'contrast' && previous.chosen.id !== id) return { clauses: original, complete: false };
    if (choice?.id === id) {
      choice.indices.push(index); // Repetition is not another change of name.
    } else if (choice && current.correctsPrevious) {
      if (choice.changes > 0) return { clauses: original, complete: false };
      for (const earlier of choice.indices) active[earlier] = false;
      choice = { id, indices: [index], changes: choice.changes + 1 };
    } else choice = { id, indices: [index], changes: 0 };
  }
  return { clauses: original.filter((_, index) => active[index]), complete: original.length > 0 };
}
