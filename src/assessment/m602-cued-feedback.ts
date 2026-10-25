import type { NamingFeedback } from '../domain/naming-contract.ts';
import type { RelationField } from './m602-relations.ts';
import { relationFeedback } from './m602-feedback.ts';

export function cuedRelationFeedback(field: RelationField, reason: string): NamingFeedback {
  if (reason === 'scope') return Object.freeze({
    recognized: 'Der vollständige Ausdruck ist im angekündigten kurzen Eingabeformat noch nicht sicher zugeordnet.',
    difference: 'Das ist kein Nachweis eines biologischen Fehlers. Ein ganzer Satz, ein unklarer Rückbezug oder ein unbekannter Zusatz wird hier nicht als fachlich falsch bezeichnet und nicht still mitbestätigt.',
    next: field === 'direction' ? 'Trage nur deine kurze Richtung oder Quelle und Ziel ein. Wasser, Nettobetrachtung, Zellmembran und Phase sind bereits gegeben.' : 'Trage nur deine kurze Veränderung ein. Vakuole und Volumen sind bereits gegeben; du musst sie nicht abschreiben.',
  });
  if (reason === 'net_zero') return Object.freeze({
    recognized: 'Du gibst eine ausgeglichene Nettowasserbilanz an.',
    difference: 'Im gegebenen frühen Zustand sind die Gesamtwasserpotenziale über der Zellmembran verschieden. Eine ausgeglichene Nettobilanz passt dazu nicht. Einzelne Durchtritte in beide Richtungen sind davon zu unterscheiden.',
    next: 'Vergleiche Cytosol und Außenraum einschließlich des Druckanteils und bestimme die Richtung der überwiegenden Wasserbilanz.',
  });
  return relationFeedback(field, reason);
}
