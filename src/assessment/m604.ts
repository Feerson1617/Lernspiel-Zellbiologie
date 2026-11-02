import { createContextBinding, parseTaskContext } from '../domain/task-context.ts';
import { M604_CONTRACT } from '../domain/m604-contract.ts';
import type { M604Answer, M604Outcome } from '../domain/m604-contract.ts';
import { readM604Material } from '../content/m604-materials.ts';
import { m604Fields } from '../content/m604-learning.ts';
import { aggregateInvestigation, assessInvestigationField, parseInvestigationAnswer } from './structured-investigation.ts';

export function parseM604Answer(input: unknown): M604Answer {
  return parseInvestigationAnswer(input, m604Fields('recovery'));
}
/** Pure finite interpretation, independent of DOM, writing, storage and M6.02. */
export function evaluateM604(contextInput: unknown, answerInput: unknown): M604Outcome {
  try {
    const material = readM604Material(contextInput), answer = parseM604Answer(answerInput);
    const criteria = Object.freeze(m604Fields(material.caseId).map(field => assessInvestigationField(field, answer[field.id])));
    return Object.freeze({ contractVersion: M604_CONTRACT, binding: createContextBinding(parseTaskContext(contextInput)),
      status: aggregateInvestigation(criteria), criteria,
      message: 'Geprüft sind ausschließlich die strukturierten Entscheidungen dieses Befundfalls. Eigene Vorhersage und schriftlicher Versuchsplan werden nicht automatisch bewertet.' });
  } catch {
    return Object.freeze({ contractVersion: M604_CONTRACT, binding: null, status: 'technical', criteria: Object.freeze([]),
      message: 'Material oder Eingabe ist technisch ungültig oder veraltet. Keine fachliche Bewertung; die Eingabe wird nicht teilweise oder als Freitext interpretiert.' });
  }
}
