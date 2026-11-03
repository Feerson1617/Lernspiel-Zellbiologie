import { createContextBinding, parseTaskContext } from '../domain/task-context.ts';
import { M604_CONTRACT } from '../domain/m604-contract.ts';
import type { M604Answer, M604Field, M604Outcome } from '../domain/m604-contract.ts';
import type { InvestigationCriterion } from '../domain/structured-investigation.ts';
import { readM604Material } from '../content/m604-materials.ts';
import { m604Fields } from '../content/m604-learning.ts';
import { aggregateInvestigation, assessInvestigationField, parseInvestigationAnswer } from './structured-investigation.ts';

export function parseM604Answer(input: unknown): M604Answer {
  return parseInvestigationAnswer(input, m604Fields('recovery'));
}
/** C18 connects the two existing decisions; no extra answer or text grammar. */
function hypothesisMeasurement(criteria: readonly InvestigationCriterion<M604Field>[]): InvestigationCriterion<M604Field> {
  const hypothesis = criteria.find(c => c.field === 'hypothesis')!;
  const dependent = criteria.find(c => c.field === 'dependent')!;
  const related = [hypothesis, dependent];
  const status = related.every(c => c.status === 'empty') ? 'empty'
    : related.some(c => c.status === 'incorrect') ? 'partial'
      : related.some(c => c.status === 'clarify') ? 'clarify'
        : hypothesis.status !== 'correct' || dependent.status !== 'correct' ? 'partial'
          : dependent.decisions.some(d => d.id === 'relative_volume') ? 'correct' : 'partial';
  const text = status === 'empty' ? 'Wähle zuerst eine Hypothese und passende Messgrößen.'
    : related.some(c => c.status === 'incorrect') ? 'Prüfe zuerst die konkret widersprechende Entscheidung bei Hypothese oder Messgröße. Die Einzelrückmeldungen nennen den Grund.'
      : status === 'clarify' ? 'Kläre zuerst deine Hypothese und Messgrößenauswahl. Eine unsichere Entscheidung ist kein nachgewiesener biologischer Fehler.'
        : hypothesis.status !== 'correct' ? 'Formuliere über die Auswahl zuerst eine prüfbare Hypothese und verbinde sie mit ihrer direkten Messgröße.'
          : status === 'correct' ? 'Die relative Protoplastvolumenmessung prüft die gewählte Volumenhypothese unmittelbar. Der Ablösungsanteil darf sie ergänzen. Prüfbarkeit bedeutet nicht, dass der spätere Befund die Hypothese bestätigt.'
            : 'Ergänze das relative Protoplastvolumen, um die Volumenhypothese unmittelbar zu prüfen. Der Ablösungsanteil bleibt als Ergänzung zulässig.';
  return Object.freeze({ id: 'M6.04.C18', field: 'dependent', status, text, reasonCode: `HYPOTHESIS_MEASUREMENT_${status.toUpperCase()}`,
    evidence: Object.freeze(related.flatMap(c => c.evidence)), decisions: Object.freeze(related.flatMap(c => c.decisions)) });
}
/** Pure finite interpretation, independent of DOM, writing, storage and M6.02. */
export function evaluateM604(contextInput: unknown, answerInput: unknown): M604Outcome {
  try {
    const material = readM604Material(contextInput), answer = parseM604Answer(answerInput);
    const fields = m604Fields(material.caseId).map(field => assessInvestigationField(field, answer[field.id]));
    const criteria = Object.freeze([...fields, hypothesisMeasurement(fields)]);
    return Object.freeze({ contractVersion: M604_CONTRACT, binding: createContextBinding(parseTaskContext(contextInput)),
      status: aggregateInvestigation(criteria), criteria,
      message: 'Geprüft sind ausschließlich die strukturierten Entscheidungen dieses Befundfalls. Eigene Vorhersage und schriftlicher Versuchsplan werden nicht automatisch bewertet.' });
  } catch {
    return Object.freeze({ contractVersion: M604_CONTRACT, binding: null, status: 'technical', criteria: Object.freeze([]),
      message: 'Material oder Eingabe ist technisch ungültig oder veraltet. Keine fachliche Bewertung; die Eingabe wird nicht teilweise oder als Freitext interpretiert.' });
  }
}
