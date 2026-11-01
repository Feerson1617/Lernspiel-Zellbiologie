import { readDataRecord, snapshotContextData } from '../domain/context-data.ts';
import { createContextBinding, parseTaskContext } from '../domain/task-context.ts';
import { readM603Material } from '../content/m603-materials.ts';
import { M603_CLAIMS, M603_CONTRACT, M603_NODES, M603_RELATIONS, M603_REQUIRED } from '../domain/m603-contract.ts';
import type { M603Answer, M603Edge, M603Feedback, M603ItemFeedback, M603Outcome } from '../domain/m603-contract.ts';
import type { Status } from '../domain/contracts.ts';
import type { CriterionResult } from './result.ts';

function exact(record: Readonly<Record<string, unknown>>, keys: readonly string[]) {
  if (Object.keys(record).length !== keys.length || keys.some(key => !Object.hasOwn(record, key))) throw new Error('Invalid causal answer.');
}
export function parseM603Answer(input: unknown): M603Answer {
  // Bound arrays before the deep snapshot; do not inspect/evaluate a prefix.
  const record = readDataRecord(input); exact(record, ['edges', 'claims']);
  if (!Array.isArray(record['edges']) || record['edges'].length > 24 || !Array.isArray(record['claims']) || record['claims'].length > 8) throw new Error('Invalid causal answer.');
  const value = snapshotContextData(record).value;
  for (const candidate of value['edges'] as readonly unknown[]) {
    const edge = readDataRecord(candidate); exact(edge, ['from', 'to', 'relation']);
    if (!M603_NODES.includes(edge['from'] as never) || !M603_NODES.includes(edge['to'] as never)
      || edge['from'] === edge['to'] || !M603_RELATIONS.includes(edge['relation'] as never)) throw new Error('Invalid causal edge.');
  }
  if (!(value['claims'] as readonly unknown[]).every(claim => M603_CLAIMS.includes(claim as never))) throw new Error('Invalid causal claim.');
  return value as unknown as M603Answer;
}
export function m603EdgeKey(edge: M603Edge): string { return `${edge.from}:${edge.to}:${edge.relation}`; }
const samePair = (a: M603Edge, b: M603Edge) => a.from === b.from && a.to === b.to;
function feedback(status: Status, code: string, text: string): M603Feedback { return Object.freeze({ status, code, text }); }

function judgeEdge(edge: M603Edge): M603Feedback {
  const key = m603EdgeKey(edge);
  const required = M603_REQUIRED.find(item => m603EdgeKey(item) === key);
  if (required) {
    const texts = {
      'M6.03.C01': 'Wasserabgabe durch den Tonoplasten verändert die Wasserbilanz der Vakuole: Ihr Volumen nimmt ab; auch der Protoplast verliert Volumen.',
      'M6.03.C02': 'Bei Wasserverlust sinkt der Turgor, der Druck des Zellinhalts gegen die Wand. Das ist eine mit der Volumenänderung gekoppelte Folge.',
      'M6.03.C03': 'Weitere hinreichende Volumenabnahme kann Ablösung ermöglichen. Diese Teilbeziehung gilt nur zusammen mit vollständigem Turgorverlust; sie beweist keine sichtbare Plasmolyse.',
      'M6.03.C04': 'Vollständiger Turgorverlust ist eine notwendige Bedingung der möglichen Ablösung. Eine bloße Druckabnahme oder Turgor null allein genügt nicht: weiterer Wasserverlust muss hinzukommen.',
    };
    return feedback('correct', required.criterion, texts[required.criterion]);
  }
  const bc = (edge.from === 'B' && edge.to === 'C') || (edge.from === 'C' && edge.to === 'B');
  if (bc && edge.relation === 'coupled') return feedback('correct', 'COUPLED', 'Volumen und Turgor hängen zusammen. Die Verbindung behauptet keine zwingende zeitliche Reihenfolge.');
  if (edge.from === 'A' && edge.to === 'D' && edge.relation === 'possible_together') return feedback('correct', 'CONDITIONAL_SUMMARY', 'Als Zusammenfassung zutreffend: nur bei vollständigem Turgorverlust und hinreichendem weiterem Wasserverlust ist Ablösung möglich. Ergänze auch die differenzierten Kernbeziehungen.');
  if (bc && edge.relation === 'strictly_before') return feedback('incorrect', 'FALSE_LINEAR_ORDER', 'Volumenänderung und Turgorabnahme sind gekoppelt. Das Material begründet keine zwingende Folge „erst das eine vollständig, dann das andere“. Entferne die strikte Zeitfolge.');
  if (edge.to === 'D' && edge.relation === 'causes') return feedback('incorrect', 'DETACHMENT_NOT_GUARANTEED', 'Diese unbedingte Ursache-Wirkungs-Behauptung reicht nicht: Ablösung erfordert vollständigen Turgorverlust und hinreichenden weiteren Wasserverlust. Eine anfängliche Abnahme beweist keine sichtbare Plasmolyse. Wähle eine bedingte Bedeutung.');
  const reversed = M603_REQUIRED.find(item => item.from === edge.to && item.to === edge.from && item.relation === edge.relation);
  if (reversed) return feedback('incorrect', 'REVERSED_EXPLANATION', `Der Pfeil ${edge.from} → ${edge.to} kehrt die hier gefragte Erklärung um. ${edge.from === 'D' ? 'Die mögliche Ablösung begründet nicht den vorherigen Volumen- oder Turgorverlust.' : 'Im gegebenen Zustand erklärt der osmotische Wasserverlust die Volumen- bzw. Turgorabnahme.'} Prüfe Start und Ziel.`);
  if (edge.relation === 'prevents' && M603_REQUIRED.some(item => samePair(item, edge))) {
    return feedback('incorrect', 'WRONG_RELATION', edge.from === 'A'
      ? 'Bei den gegebenen Gesamtwasserpotenzialen führt Wasserverlust zur Abnahme von Volumen bzw. Turgor. Die gewählte Bedeutung beschreibt diese Folge nicht.'
      : edge.from === 'B'
        ? 'Volumenabnahme ist keine alleinige Garantie oder Verhinderung der Ablösung. Erforderlich sind hinreichende weitere Volumenabnahme und vollständiger Turgorverlust gemeinsam.'
        : 'Sinkender Turgor muss bis zum vollständigen Turgorverlust präzisiert werden. Dies ist notwendig, allein aber nicht hinreichend für Ablösung.');
  }
  return feedback('clarify', 'OUTSIDE_CONTRACT', 'Diese zusätzliche Beziehung ist durch die begrenzte Aufgabe nicht eindeutig prüfbar. Sie wird nicht als fachlich falsch bezeichnet. Entferne sie oder nutze die differenzierten Beziehungen zwischen den vier Aussagen.');
}

const CLAIM_FEEDBACK = Object.freeze({
  wall_stable: feedback('correct', 'WALL_STABLE', 'Die Zellwand bleibt vergleichsweise formstabil; sie ist nicht der schrumpfende Protoplast.'),
  passive_potential: feedback('correct', 'PASSIVE_POTENTIAL', 'Wasser bewegt sich passiv entlang des Gesamtwasserpotenzialgefälles einschließlich Druck; beide Membranen sind wasserpermeabel.'),
  wall_shrinks: feedback('incorrect', 'WALL_NOT_PROTOPLAST', 'Die vergleichsweise formstabile Zellwand schrumpft nicht im gleichen Ausmaß wie der Protoplast.'),
  already_detached: feedback('incorrect', 'NO_OBSERVATION_OF_DETACHMENT', 'Das Material beschreibt einen frühen Wasserverlustzustand. Anfängliche Volumenabnahme beweist keine bereits sichtbare Ablösung; Turgorverlust und weiterer Wasserverlust sind gesondert zu berücksichtigen.'),
  active_water_pump: feedback('incorrect', 'NO_WATER_PUMP', 'Hier ist Wassertransport passiv durch die gegebenen Gesamtwasserpotenziale begründet. Eine aktive Wasserpumpe ist weder gegeben noch erforderlich.'),
  intentional_loss: feedback('incorrect', 'NO_INTENTION', 'Die Wasserbilanz folgt aus Permeabilität und Gesamtwasserpotenzialen. Eine absichtliche Entscheidung der Zelle erklärt diesen passiven Vorgang nicht.'),
  concentration_only: feedback('incorrect', 'PRESSURE_MATTERS', 'Die Richtung folgt aus den Gesamtwasserpotenzialen einschließlich Druck. Eine universelle Regel allein aus Stoffkonzentrationen ist unzulässig.'),
});

/** Bounded pure checker: no DOM, layout, storage, clock, randomness or text parsing. */
export function evaluateM603(contextInput: unknown, answerInput: unknown): M603Outcome {
  let binding: M603Outcome['binding'] = null;
  function result(status: Status, criteria: readonly CriterionResult[], edges: readonly M603ItemFeedback[], claims: readonly M603ItemFeedback[], messages: readonly M603Feedback[]): M603Outcome {
    return Object.freeze({ contractVersion: M603_CONTRACT, binding, status,
      criteria: Object.freeze(criteria), edges: Object.freeze(edges), claims: Object.freeze(claims), messages: Object.freeze(messages) });
  }
  let answer: M603Answer;
  try {
    readM603Material(contextInput);
    binding = createContextBinding(parseTaskContext(contextInput));
    answer = parseM603Answer(answerInput);
  } catch {
    return result('technical', [], [], [], [feedback('technical', 'INVALID_INPUT', 'Kontext oder Antwort sind technisch ungültig oder außerhalb des begrenzten Formats. Es wird kein fachlicher Fehler und kein Erfolg bestätigt. Der Entwurf wird nicht abgeschnitten.')]);
  }
  const messages: M603Feedback[] = [], seen = new Set<string>(), seenClaims = new Set<string>();
  const edges = answer.edges.map((edge, index) => {
    const key = m603EdgeKey(edge), duplicate = seen.has(key); seen.add(key);
    if (duplicate) messages.push(feedback('clarify', 'DUPLICATE_EDGE', `Verbindung ${index + 1} ist doppelt vorhanden. Sie wird einmal anerkannt; entferne die Wiederholung.`));
    return Object.freeze({ index, ...judgeEdge(edge) });
  });
  const claims = answer.claims.map((claim, index) => {
    if (seenClaims.has(claim)) messages.push(feedback('clarify', 'DUPLICATE_CLAIM', 'Eine Zusatzbehauptung wurde doppelt ausgewählt. Entferne die Wiederholung.'));
    seenClaims.add(claim);
    return Object.freeze({ index, ...CLAIM_FEEDBACK[claim] });
  });
  const joint = seen.has('B:D:enables_if') && seen.has('C:D:requires_zero');
  const criteria = M603_REQUIRED.map((required, index): CriterionResult => {
    const selected = answer.edges.map((edge, i) => ({ edge, i })).filter(item => m603EdgeKey(item.edge) === m603EdgeKey(required));
    const contrary = answer.edges.map((edge, i) => ({ edge, i })).filter(item => edges[item.i]!.status === 'incorrect'
      && (samePair(required, item.edge) || (required.from === item.edge.to && required.to === item.edge.from)));
    const status: Status = contrary.length ? 'incorrect' : !selected.length ? 'empty' : index >= 2 && !joint ? 'partial' : 'correct';
    if (selected.length && contrary.length) messages.push(feedback('incorrect', 'CONTRADICTORY_RELATIONS', `Widerspruch bei ${required.from} → ${required.to}: Eine passende und eine widersprechende Beziehung sind zugleich ausgewählt. Entferne oder ändere die falsche Behauptung; die passende Teilbeziehung bleibt erkennbar.`));
    return Object.freeze({ id: required.criterion, status,
      reasonCode: contrary.length ? 'CONTRADICTED' : !selected.length ? 'MISSING' : index >= 2 && !joint ? 'JOINT_CONDITION_MISSING' : 'RELATION_VERIFIED',
      evidence: Object.freeze([...selected, ...contrary].map(item => Object.freeze({ kind: 'option_id' as const, value: m603EdgeKey(item.edge) }))),
    });
  });
  if (answer.edges.some(edge => edge.to === 'D') && !joint) messages.push(feedback('partial', 'JOINT_CONDITION_MISSING', 'Die Bedingungen für D sind noch nicht gemeinsam belegt: vollständiger Turgorverlust UND hinreichender weiterer Wasserverlust. Eine einzelne passende Teilbeziehung genügt nicht.'));
  const incorrect = [...edges, ...claims].some(item => item.status === 'incorrect');
  const unclear = messages.some(item => item.status === 'clarify') || edges.some(item => item.status === 'clarify');
  const empty = !answer.edges.length && !answer.claims.length;
  const complete = criteria.every(item => item.status === 'correct');
  return result(incorrect ? 'incorrect' : unclear ? 'clarify' : empty ? 'empty' : complete ? 'correct' : 'partial', criteria, edges, claims, messages);
}
