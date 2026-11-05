import type { Status } from '../domain/contracts.ts';
import { snapshotContextData } from '../domain/context-data.ts';
import { createContextBinding } from '../domain/task-context.ts';
import type { ContextBinding } from '../domain/task-context.ts';
import { validateM702Context } from '../content/m702.ts';

export interface M702Feedback { readonly recognized: string; readonly reason: string; readonly next: string }
export interface M702Part extends M702Feedback { readonly id: string; readonly status: Status }
export interface M702Outcome {
  readonly binding: ContextBinding | null;
  readonly status: Status;
  readonly parts: readonly M702Part[];
  readonly feedback: M702Feedback;
}
const unknown: M702Feedback = Object.freeze({ recognized: 'Diese Aussage ist durch die begrenzte Auswahl nicht abgedeckt.', reason: 'Der eigene Text wird nicht automatisch interpretiert; daraus folgt kein fachliches Falsch.', next: 'Besprich deine konkrete Aussage anhand des Materials mit einer Partnerperson oder Lehrkraft.' });
const claims: Readonly<Record<string, Readonly<{ status: Status } & M702Feedback>>> = Object.freeze({
  rate: { status: 'correct', recognized: 'Du beschreibst den passenden Ratenunterschied mit und ohne P.', reason: 'Die Vergleichswerte stützen diesen Befund unter den angegebenen Bedingungen.', next: 'Ergänze in deiner Argumentation, welche Aussagegrenze zu diesem Befund gehört.' },
  energy_open: { status: 'correct', recognized: 'Du benennst eine passende Aussagegrenze.', reason: 'Eine Energieabhängigkeit wurde nicht untersucht.', next: 'Begründe diese Grenze in deinem Text mit einem konkreten Materialbefund.' },
  atp_pump: { status: 'incorrect', recognized: 'Du deutest die höhere Rate als Beweis für eine ATP-Pumpe.', reason: 'Verglichen wurde die Aufnahme mit und ohne P; eine ATP-Nutzung wurde nicht untersucht.', next: 'Überlege, welche zusätzliche Messung eine Aussage zur Energieabhängigkeit erlauben könnte.' },
  active_proven: { status: 'incorrect', recognized: 'Du leitest aus der höheren Rate sicher aktiven Transport ab.', reason: 'Die Ratenmessung erfasst keinen gekoppelten Energieeinsatz.', next: 'Prüfe, welche Angabe zum Antrieb deiner Schlussfolgerung noch fehlt.' },
  passive_proven: { status: 'incorrect', recognized: 'Du schließt aus dem Konzentrationsgefälle jede Energiekopplung aus.', reason: 'Das Gefälle gibt eine mögliche Antriebsrichtung an; eine Kopplung wurde nicht untersucht.', next: 'Formuliere deine Schlussfolgerung so um, dass sie nur den tatsächlich geprüften Umfang beansprucht.' },
  other: { status: 'clarify', ...unknown },
});
/** Only stable selected claims are checked. No free writing is accepted or inspected. */
export function evaluateM702(contextInput: unknown, selectedInput: unknown): M702Outcome {
  let binding: ContextBinding | null = null;
  function outcome(status: Status, parts: readonly M702Part[], feedback: M702Feedback): M702Outcome {
    return Object.freeze({ binding, status, parts: Object.freeze(parts), feedback: Object.freeze(feedback) });
  }
  let selected: readonly string[];
  try {
    binding = createContextBinding(validateM702Context(contextInput));
    if (!Array.isArray(selectedInput) || selectedInput.length > 6) throw new Error('Invalid selection.');
    const data = snapshotContextData({ selected: selectedInput }).value['selected'] as readonly unknown[];
    if (!data.every(id => typeof id === 'string' && id.length > 0 && id.length <= 128) || new Set(data).size !== data.length) throw new Error('Invalid claim IDs.');
    selected = data as readonly string[];
  } catch {
    return outcome('technical', [], { recognized: 'Die Auswahl oder ihre Materialfassung kann technisch nicht geprüft werden.', reason: 'Das ist kein fachliches Urteil über deine Antwort; es wird kein abgeschnittener Teil bewertet.', next: 'Öffne den Baustein erneut und prüfe die Auswahl im zugehörigen Material.' });
  }
  if (!selected.length) return outcome('empty', [], { recognized: 'Noch keine Aussage ausgewählt.', reason: 'Es liegt keine automatisch prüfbare Entscheidung vor.', next: 'Wähle die Aussagen, die du auf Grundlage des Materials vertreten möchtest.' });
  const parts = selected.map(id => Object.freeze({ id, ...(Object.hasOwn(claims, id) ? claims[id]! : { status: 'clarify' as const, ...unknown }) }));
  const wrong = parts.find(p => p.status === 'incorrect');
  if (wrong) return outcome('incorrect', parts, { recognized: 'Mindestens eine gewählte Behauptung ist nicht gerechtfertigt.', reason: 'Zutreffende Teilaussagen bleiben getrennt richtig sichtbar.', next: wrong.next });
  if (parts.some(p => p.status === 'clarify')) return outcome('clarify', parts, unknown);
  if (selected.includes('rate') && selected.includes('energy_open')) return outcome('correct', parts, { recognized: 'Befund und Energiegrenze sind in dieser Auswahl richtig verbunden.', reason: 'Geprüft ist nur die Auswahl. Deine freie Argumentation und dein Untersuchungsvorschlag sind weiterhin nicht fachlich geprüft.', next: 'Überarbeite deinen eigenen Text anhand der Kriterien und besprich ihn mit einer Partnerperson oder Lehrkraft.' });
  return outcome('partial', parts, { recognized: 'Ein richtiger Teil ist vorhanden.', reason: 'Zum begrenzten Abgleich gehören ein Materialbefund und eine Aussagegrenze.', next: selected.includes('rate') ? 'Ergänze eine Aussage dazu, was die Daten über die Energiefrage belegen.' : 'Ergänze einen passenden Befund aus dem Vergleich mit und ohne P.' });
}
