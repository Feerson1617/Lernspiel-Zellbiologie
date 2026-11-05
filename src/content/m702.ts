import { createTaskContext, parseTaskContext } from '../domain/task-context.ts';
import { snapshotContextData } from '../domain/context-data.ts';

export const M702_VERSIONS = Object.freeze({ taskVersion: 'M7.02@evidence-1', rubricVersion: 'M7.02.C01@evidence-1.0.0', contentVersion: 'm702-content/1.0.0', modelVersion: 'm702-didactic-data/1.0.0' });
export const M702_MATERIAL = Object.freeze({ source: 'constructed_not_measured', substance: 'uncharged_X', chemicalChange: false, binding: false, redistribution: false, concentrationUnit: 'mmol/L', outside: 4, inside: 1, rateUnit: 'nmol/(min·cm²)', withoutP: 1, withP: 3, direction: 'initial_net_inward', compared: 'P_only; same_temperature_area_concentrations', energyInvestigated: false });
export const M702_OPTIONS = Object.freeze([
  { id: 'rate', text: 'Unter gleichen Bedingungen ist die anfängliche Aufnahmerate mit P höher als ohne P.' },
  { id: 'atp_pump', text: 'Die höhere Aufnahmerate beweist, dass P eine ATP-Pumpe ist.' },
  { id: 'energy_open', text: 'Eine Energieabhängigkeit ist mit diesen Daten nicht nachgewiesen.' },
  { id: 'active_proven', text: 'Die höhere Aufnahmerate beweist einen aktiven Transport.' },
  { id: 'passive_proven', text: 'Das Konzentrationsgefälle beweist, dass jede Energiekopplung ausgeschlossen ist.' },
  { id: 'other', text: 'Meine Aussage ist durch diese Auswahl nicht abgedeckt.' },
].map(option => Object.freeze(option)));
export type M702Option = typeof M702_OPTIONS[number]['id'];

export const M702_HELP = Object.freeze({
  1: 'Welche Größe wurde verglichen, und welche Frage hast du mit dieser Größe noch nicht untersucht? Markiere den Unterschied zwischen einem Befund und seiner Deutung.',
  2: 'Ordne deine Argumentation: konkreter Materialbefund → begründete Schlussfolgerung → fehlende Information. Nenne bei deinem Untersuchungsvorschlag eine veränderte Bedingung und die dabei zu vergleichende Größe; begründe den Vergleich.',
  3: 'Eine mögliche Vergleichserklärung: Mit P beträgt die anfängliche Nettoaufnahme 3 statt 1 nmol/(min·cm²) bei sonst gleichen Bedingungen. Das stützt einen Beitrag von P zum Transport. Die Aufnahme erfolgt für den ungeladenen, unveränderten Stoff entlang des Konzentrationsgefälles. Ein passiver Proteinweg ist damit vereinbar; die höhere Rate beweist aber weder aktiven Transport noch ATP-Spaltung durch P und schließt eine Kopplung nicht aus. Hilfreich wäre etwa ein kontrollierter Vergleich der Aufnahme bei unterschiedlicher ATP-Verfügbarkeit, während Konzentrationsgefälle und Membranintegrität vergleichbar bleiben. Ein Unterschied könnte eine Energieabhängigkeit stützen; ein ausbleibender Unterschied würde nur für die geprüften Bedingungen sprechen. Auch eine ATP-Abhängigkeit des Systems beweist noch keine direkte ATP-Spaltung durch P: Dafür wäre ein gesonderter Nachweis am Protein nötig. Das ist ein erster begründeter Untersuchungsvorschlag, kein vollständiger Versuchsplan.',
});
export const M702_CRITERIA = Object.freeze([
  'Nenne einen konkreten Vergleich aus dem Material einschließlich Zahlen, Einheit und vergleichbarer Bedingungen.',
  'Verknüpfe den Befund mit deiner Schlussfolgerung; unterscheide gestützte Aussagen von möglichen Mechanismen.',
  'Benenne eine Aussagegrenze: Welche Energiefrage bleibt offen, und warum?',
  'Begründe, wie deine zusätzliche Information diese Frage klären könnte und welche Einschränkung dabei bleibt.',
]);
export function createM702Context(instanceId: string) {
  return createTaskContext({ taskId: 'M7.02', ...M702_VERSIONS, instanceId, phase: 'explain', seed: 'fixed/1', material: M702_MATERIAL, modelState: {} });
}
export function validateM702Context(input: unknown) {
  const c = parseTaskContext(input);
  if (c.taskId !== 'M7.02' || c.phase !== 'explain' || c.seed !== 'fixed/1' || Object.keys(c.modelState).length
    || Object.entries(M702_VERSIONS).some(([k, v]) => c[k as keyof typeof M702_VERSIONS] !== v)
    || snapshotContextData(c.material).json !== snapshotContextData(M702_MATERIAL).json) throw new Error('Unvalidated M7.02 material or version.');
  return c;
}
