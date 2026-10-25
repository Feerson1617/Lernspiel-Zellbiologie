import type { Status } from '../../src/domain/contracts.ts';
/** Supplied review cases, now known regressions. Values copied unchanged from cases.mjs
 * SHA256 2c191902371a51cbd78ab8fad1b6a9686589595f0c6d539f331aa86fddfff31a: see the executed revision report for the full provenance hash.
 * These are newly authored review sentences, not private exam source material. */
export interface ReviewCase { readonly id: string; readonly group: string; readonly field: 'osmosis' | 'tonoplast'; readonly text: string; readonly expected: readonly Status[]; readonly rationale: string }
export const COUNTERCHECK_CASES: readonly ReviewCase[] = [
  {
    "id": "short-correct-01",
    "group": "short-correct",
    "field": "osmosis",
    "text": "Das wäre für mich Osmose.",
    "expected": [
      "correct"
    ],
    "rationale": "The specific water transport is unambiguously named Osmose; the surrounding words add no biological claim."
  },
  {
    "id": "short-correct-02",
    "group": "short-correct",
    "field": "osmosis",
    "text": "Ich würde das Osmose nennen.",
    "expected": [
      "correct"
    ],
    "rationale": "The specific water transport is unambiguously named Osmose; the surrounding words add no biological claim."
  },
  {
    "id": "short-correct-03",
    "group": "short-correct",
    "field": "osmosis",
    "text": "Als Prozess würde ich Osmose angeben.",
    "expected": [
      "correct"
    ],
    "rationale": "The specific water transport is unambiguously named Osmose; the surrounding words add no biological claim."
  },
  {
    "id": "short-correct-04",
    "group": "short-correct",
    "field": "osmosis",
    "text": "Das Fachwort dafür lautet Osmose.",
    "expected": [
      "correct"
    ],
    "rationale": "The specific water transport is unambiguously named Osmose; the surrounding words add no biological claim."
  },
  {
    "id": "short-correct-05",
    "group": "short-correct",
    "field": "osmosis",
    "text": "Hier ist Osmose gemeint.",
    "expected": [
      "correct"
    ],
    "rationale": "The specific water transport is unambiguously named Osmose; the surrounding words add no biological claim."
  },
  {
    "id": "short-correct-06",
    "group": "short-correct",
    "field": "osmosis",
    "text": "Ich denke dabei an Osmose.",
    "expected": [
      "correct"
    ],
    "rationale": "The specific water transport is unambiguously named Osmose; the surrounding words add no biological claim."
  },
  {
    "id": "short-correct-07",
    "group": "short-correct",
    "field": "osmosis",
    "text": "Bei dem Vorgang handelt es sich um Osmose.",
    "expected": [
      "correct"
    ],
    "rationale": "The specific water transport is unambiguously named Osmose; the surrounding words add no biological claim."
  },
  {
    "id": "short-correct-08",
    "group": "short-correct",
    "field": "osmosis",
    "text": "Meine Antwort dazu ist Osmose.",
    "expected": [
      "correct"
    ],
    "rationale": "The specific water transport is unambiguously named Osmose; the surrounding words add no biological claim."
  },
  {
    "id": "short-correct-09",
    "group": "short-correct",
    "field": "osmosis",
    "text": "Ich würde mit Osmose antworten.",
    "expected": [
      "correct"
    ],
    "rationale": "The specific water transport is unambiguously named Osmose; the surrounding words add no biological claim."
  },
  {
    "id": "short-correct-10",
    "group": "short-correct",
    "field": "osmosis",
    "text": "Den beschriebenen Wassertransport nennt man Osmose.",
    "expected": [
      "correct"
    ],
    "rationale": "The specific water transport is unambiguously named Osmose; the surrounding words add no biological claim."
  },
  {
    "id": "short-correct-11",
    "group": "short-correct",
    "field": "osmosis",
    "text": "Es müsste hier Osmose sein.",
    "expected": [
      "correct"
    ],
    "rationale": "The specific water transport is unambiguously named Osmose; the surrounding words add no biological claim."
  },
  {
    "id": "short-correct-12",
    "group": "short-correct",
    "field": "osmosis",
    "text": "Das ist meiner Ansicht nach Osmose.",
    "expected": [
      "correct"
    ],
    "rationale": "The specific water transport is unambiguously named Osmose; the surrounding words add no biological claim."
  },
  {
    "id": "short-correct-13",
    "group": "short-correct",
    "field": "osmosis",
    "text": "Osmose wäre mein Vorschlag.",
    "expected": [
      "correct"
    ],
    "rationale": "The specific water transport is unambiguously named Osmose; the surrounding words add no biological claim."
  },
  {
    "id": "short-correct-14",
    "group": "short-correct",
    "field": "osmosis",
    "text": "Ich vermute hier Osmose.",
    "expected": [
      "correct"
    ],
    "rationale": "The specific water transport is unambiguously named Osmose; the surrounding words add no biological claim."
  },
  {
    "id": "short-correct-15",
    "group": "short-correct",
    "field": "osmosis",
    "text": "Der korrekte Fachbegriff lautet Osmose.",
    "expected": [
      "correct"
    ],
    "rationale": "The specific water transport is unambiguously named Osmose; the surrounding words add no biological claim."
  },
  {
    "id": "short-correct-16",
    "group": "short-correct",
    "field": "osmosis",
    "text": "Für den Vorgang passt Osmose.",
    "expected": [
      "correct"
    ],
    "rationale": "The specific water transport is unambiguously named Osmose; the surrounding words add no biological claim."
  },
  {
    "id": "short-correct-17",
    "group": "short-correct",
    "field": "osmosis",
    "text": "Ich bin mir ziemlich sicher: Osmose.",
    "expected": [
      "correct"
    ],
    "rationale": "The specific water transport is unambiguously named Osmose; the surrounding words add no biological claim."
  },
  {
    "id": "short-correct-18",
    "group": "short-correct",
    "field": "osmosis",
    "text": "Das wird als Osmose bezeichnet.",
    "expected": [
      "correct"
    ],
    "rationale": "The specific water transport is unambiguously named Osmose; the surrounding words add no biological claim."
  },
  {
    "id": "short-correct-19",
    "group": "short-correct",
    "field": "osmosis",
    "text": "Als Bezeichnung nehme ich Osmose.",
    "expected": [
      "correct"
    ],
    "rationale": "The specific water transport is unambiguously named Osmose; the surrounding words add no biological claim."
  },
  {
    "id": "short-correct-20",
    "group": "short-correct",
    "field": "osmosis",
    "text": "Osmose, wenn ich richtig liege.",
    "expected": [
      "correct"
    ],
    "rationale": "The specific water transport is unambiguously named Osmose; the surrounding words add no biological claim."
  },
  {
    "id": "short-correct-21",
    "group": "short-correct",
    "field": "osmosis",
    "text": "Ich würde sagen: Osmose.",
    "expected": [
      "correct"
    ],
    "rationale": "The specific water transport is unambiguously named Osmose; the surrounding words add no biological claim."
  },
  {
    "id": "short-correct-22",
    "group": "short-correct",
    "field": "osmosis",
    "text": "Mein Ergebnis lautet Osmose.",
    "expected": [
      "correct"
    ],
    "rationale": "The specific water transport is unambiguously named Osmose; the surrounding words add no biological claim."
  },
  {
    "id": "short-correct-23",
    "group": "short-correct",
    "field": "osmosis",
    "text": "Die passende Bezeichnung ist Osmose.",
    "expected": [
      "correct"
    ],
    "rationale": "The specific water transport is unambiguously named Osmose; the surrounding words add no biological claim."
  },
  {
    "id": "short-correct-24",
    "group": "short-correct",
    "field": "osmosis",
    "text": "Osmose ist hier der gesuchte Vorgang.",
    "expected": [
      "correct"
    ],
    "rationale": "The specific water transport is unambiguously named Osmose; the surrounding words add no biological claim."
  },
  {
    "id": "short-correct-25",
    "group": "short-correct",
    "field": "osmosis",
    "text": "Der Vorgang heißt also Osmose.",
    "expected": [
      "correct"
    ],
    "rationale": "The specific water transport is unambiguously named Osmose; the surrounding words add no biological claim."
  },
  {
    "id": "short-correct-26",
    "group": "short-correct",
    "field": "osmosis",
    "text": "Ich bleibe bei Osmose.",
    "expected": [
      "correct"
    ],
    "rationale": "The specific water transport is unambiguously named Osmose; the surrounding words add no biological claim."
  },
  {
    "id": "short-correct-27",
    "group": "short-correct",
    "field": "osmosis",
    "text": "Das müsste hier wohl Osmose sein.",
    "expected": [
      "correct"
    ],
    "rationale": "The specific water transport is unambiguously named Osmose; the surrounding words add no biological claim."
  },
  {
    "id": "short-correct-28",
    "group": "short-correct",
    "field": "osmosis",
    "text": "Für mich wäre das Osmose.",
    "expected": [
      "correct"
    ],
    "rationale": "The specific water transport is unambiguously named Osmose; the surrounding words add no biological claim."
  },
  {
    "id": "short-correct-29",
    "group": "short-correct",
    "field": "osmosis",
    "text": "Hier lautet meine Antwort Osmose.",
    "expected": [
      "correct"
    ],
    "rationale": "The specific water transport is unambiguously named Osmose; the surrounding words add no biological claim."
  },
  {
    "id": "short-correct-30",
    "group": "short-correct",
    "field": "osmosis",
    "text": "Ich würde den Prozess Osmose nennen.",
    "expected": [
      "correct"
    ],
    "rationale": "The specific water transport is unambiguously named Osmose; the surrounding words add no biological claim."
  },
  {
    "id": "short-correct-31",
    "group": "short-correct",
    "field": "osmosis",
    "text": "Osmose, so heißt der Vorgang.",
    "expected": [
      "correct"
    ],
    "rationale": "The specific water transport is unambiguously named Osmose; the surrounding words add no biological claim."
  },
  {
    "id": "short-correct-32",
    "group": "short-correct",
    "field": "osmosis",
    "text": "Mein Begriff dafür wäre Osmose.",
    "expected": [
      "correct"
    ],
    "rationale": "The specific water transport is unambiguously named Osmose; the surrounding words add no biological claim."
  },
  {
    "id": "short-correct-33",
    "group": "short-correct",
    "field": "osmosis",
    "text": "Es geht hier um Osmose.",
    "expected": [
      "correct"
    ],
    "rationale": "The specific water transport is unambiguously named Osmose; the surrounding words add no biological claim."
  },
  {
    "id": "short-correct-34",
    "group": "short-correct",
    "field": "osmosis",
    "text": "Osmose wäre meine Bezeichnung.",
    "expected": [
      "correct"
    ],
    "rationale": "The specific water transport is unambiguously named Osmose; the surrounding words add no biological claim."
  },
  {
    "id": "short-correct-35",
    "group": "short-correct",
    "field": "osmosis",
    "text": "Ich glaube, hier ist Osmose gesucht.",
    "expected": [
      "correct"
    ],
    "rationale": "The specific water transport is unambiguously named Osmose; the surrounding words add no biological claim."
  },
  {
    "id": "short-correct-36",
    "group": "short-correct",
    "field": "osmosis",
    "text": "Gemeint ist also Osmose.",
    "expected": [
      "correct"
    ],
    "rationale": "The specific water transport is unambiguously named Osmose; the surrounding words add no biological claim."
  },
  {
    "id": "short-correct-37",
    "group": "short-correct",
    "field": "osmosis",
    "text": "Mein Tipp wäre Osmose.",
    "expected": [
      "correct"
    ],
    "rationale": "The specific water transport is unambiguously named Osmose; the surrounding words add no biological claim."
  },
  {
    "id": "short-correct-38",
    "group": "short-correct",
    "field": "osmosis",
    "text": "Als Vorgang nenne ich Osmose.",
    "expected": [
      "correct"
    ],
    "rationale": "The specific water transport is unambiguously named Osmose; the surrounding words add no biological claim."
  },
  {
    "id": "short-correct-39",
    "group": "short-correct",
    "field": "osmosis",
    "text": "Die gesuchte Transportart wäre Osmose.",
    "expected": [
      "correct"
    ],
    "rationale": "The specific water transport is unambiguously named Osmose; the surrounding words add no biological claim."
  },
  {
    "id": "short-correct-40",
    "group": "short-correct",
    "field": "osmosis",
    "text": "Die Bezeichnung dafür ist Osmose.",
    "expected": [
      "correct"
    ],
    "rationale": "The specific water transport is unambiguously named Osmose; the surrounding words add no biological claim."
  },
  {
    "id": "short-correct-41",
    "group": "short-correct",
    "field": "osmosis",
    "text": "Ich nehme an: Osmose.",
    "expected": [
      "correct"
    ],
    "rationale": "The specific water transport is unambiguously named Osmose; the surrounding words add no biological claim."
  },
  {
    "id": "short-correct-42",
    "group": "short-correct",
    "field": "osmosis",
    "text": "Ich tippe hier auf Osmose.",
    "expected": [
      "correct"
    ],
    "rationale": "The specific water transport is unambiguously named Osmose; the surrounding words add no biological claim."
  },
  {
    "id": "short-correct-43",
    "group": "short-correct",
    "field": "osmosis",
    "text": "Ich vermute, dass es Osmose ist. Danke!",
    "expected": [
      "correct"
    ],
    "rationale": "The specific water transport is unambiguously named Osmose; the surrounding words add no biological claim."
  },
  {
    "id": "short-correct-44",
    "group": "short-correct",
    "field": "osmosis",
    "text": "Die Antwort wäre vermutlich Osmose.",
    "expected": [
      "correct"
    ],
    "rationale": "The specific water transport is unambiguously named Osmose; the surrounding words add no biological claim."
  },
  {
    "id": "short-correct-45",
    "group": "short-correct",
    "field": "osmosis",
    "text": "Mein Vorschlag ist Osmose.",
    "expected": [
      "correct"
    ],
    "rationale": "The specific water transport is unambiguously named Osmose; the surrounding words add no biological claim."
  },
  {
    "id": "short-correct-46",
    "group": "short-correct",
    "field": "osmosis",
    "text": "Es ist wohl Osmose.",
    "expected": [
      "correct"
    ],
    "rationale": "The specific water transport is unambiguously named Osmose; the surrounding words add no biological claim."
  },
  {
    "id": "short-correct-47",
    "group": "short-correct",
    "field": "osmosis",
    "text": "Der Begriff lautet wahrscheinlich Osmose.",
    "expected": [
      "correct"
    ],
    "rationale": "The specific water transport is unambiguously named Osmose; the surrounding words add no biological claim."
  },
  {
    "id": "short-correct-48",
    "group": "short-correct",
    "field": "osmosis",
    "text": "Die richtige Antwort wäre Osmose.",
    "expected": [
      "correct"
    ],
    "rationale": "The specific water transport is unambiguously named Osmose; the surrounding words add no biological claim."
  },
  {
    "id": "short-correct-49",
    "group": "short-correct",
    "field": "osmosis",
    "text": "Ich halte das wohl für Osmose.",
    "expected": [
      "correct"
    ],
    "rationale": "The specific water transport is unambiguously named Osmose; the surrounding words add no biological claim."
  },
  {
    "id": "short-correct-50",
    "group": "short-correct",
    "field": "osmosis",
    "text": "Die gesuchte Bezeichnung: Osmose.",
    "expected": [
      "correct"
    ],
    "rationale": "The specific water transport is unambiguously named Osmose; the surrounding words add no biological claim."
  },
  {
    "id": "long-correct-01",
    "group": "long-correct",
    "field": "osmosis",
    "text": "Osmose bezeichnet hier den passiven Wassertransport durch die selektiv durchlässige Membran.",
    "expected": [
      "correct",
      "clarify"
    ],
    "rationale": "Biologically correct and complete naming plus a true explanation; clarification is an admitted scope limit, but remains in recognition-rate denominator."
  },
  {
    "id": "long-correct-02",
    "group": "long-correct",
    "field": "osmosis",
    "text": "Der Vorgang heißt Osmose, weil Wasser durch die selektiv permeable Membran wandert.",
    "expected": [
      "correct",
      "clarify"
    ],
    "rationale": "Biologically correct and complete naming plus a true explanation; clarification is an admitted scope limit, but remains in recognition-rate denominator."
  },
  {
    "id": "long-correct-03",
    "group": "long-correct",
    "field": "osmosis",
    "text": "Hier liegt Osmose vor: Wasser bewegt sich netto zum niedrigeren Wasserpotenzial.",
    "expected": [
      "correct",
      "clarify"
    ],
    "rationale": "Biologically correct and complete naming plus a true explanation; clarification is an admitted scope limit, but remains in recognition-rate denominator."
  },
  {
    "id": "long-correct-04",
    "group": "long-correct",
    "field": "osmosis",
    "text": "Osmose. Dafür ist keine ATP-getriebene Wasserpumpe nötig.",
    "expected": [
      "correct",
      "clarify"
    ],
    "rationale": "Biologically correct and complete naming plus a true explanation; clarification is an admitted scope limit, but remains in recognition-rate denominator."
  },
  {
    "id": "long-correct-05",
    "group": "long-correct",
    "field": "osmosis",
    "text": "Osmose ist eine besondere Form der Diffusion von Wasser durch eine selektiv permeable Membran.",
    "expected": [
      "correct",
      "clarify"
    ],
    "rationale": "Biologically correct and complete naming plus a true explanation; clarification is an admitted scope limit, but remains in recognition-rate denominator."
  },
  {
    "id": "long-correct-06",
    "group": "long-correct",
    "field": "osmosis",
    "text": "Ich nenne Osmose; die Plasmolyse ist die mögliche Zellreaktion auf den Wasserverlust.",
    "expected": [
      "correct",
      "clarify"
    ],
    "rationale": "Biologically correct and complete naming plus a true explanation; clarification is an admitted scope limit, but remains in recognition-rate denominator."
  },
  {
    "id": "long-correct-07",
    "group": "long-correct",
    "field": "osmosis",
    "text": "Das Wasser verlässt die Zelle osmotisch, der Vorgang heißt Osmose.",
    "expected": [
      "correct",
      "clarify"
    ],
    "rationale": "Biologically correct and complete naming plus a true explanation; clarification is an admitted scope limit, but remains in recognition-rate denominator."
  },
  {
    "id": "long-correct-08",
    "group": "long-correct",
    "field": "osmosis",
    "text": "Osmose ist passiver Transport von Wasser, nicht die Beförderung der Saccharose.",
    "expected": [
      "correct",
      "clarify"
    ],
    "rationale": "Biologically correct and complete naming plus a true explanation; clarification is an admitted scope limit, but remains in recognition-rate denominator."
  },
  {
    "id": "long-correct-09",
    "group": "long-correct",
    "field": "osmosis",
    "text": "Osmose: Der passive Nettofluss folgt dem angegebenen Wasserpotenzialgefälle.",
    "expected": [
      "correct",
      "clarify"
    ],
    "rationale": "Biologically correct and complete naming plus a true explanation; clarification is an admitted scope limit, but remains in recognition-rate denominator."
  },
  {
    "id": "long-correct-10",
    "group": "long-correct",
    "field": "osmosis",
    "text": "Wasser passiert beide genannten Membranen durch Osmose, die Saccharose wird weitgehend zurückgehalten.",
    "expected": [
      "correct",
      "clarify"
    ],
    "rationale": "Biologically correct and complete naming plus a true explanation; clarification is an admitted scope limit, but remains in recognition-rate denominator."
  },
  {
    "id": "long-correct-11",
    "group": "long-correct",
    "field": "osmosis",
    "text": "Die gesuchte Benennung ist Osmose; einzelne Wassermoleküle können trotzdem in beide Richtungen wandern.",
    "expected": [
      "correct",
      "clarify"
    ],
    "rationale": "Biologically correct and complete naming plus a true explanation; clarification is an admitted scope limit, but remains in recognition-rate denominator."
  },
  {
    "id": "long-correct-12",
    "group": "long-correct",
    "field": "osmosis",
    "text": "Ich meine Osmose, also die Diffusion von Wasser durch eine selektive Membran.",
    "expected": [
      "correct",
      "clarify"
    ],
    "rationale": "Biologically correct and complete naming plus a true explanation; clarification is an admitted scope limit, but remains in recognition-rate denominator."
  },
  {
    "id": "long-correct-13",
    "group": "long-correct",
    "field": "osmosis",
    "text": "Osmose ist keine aktive Pumpe und keine Exocytose.",
    "expected": [
      "correct",
      "clarify"
    ],
    "rationale": "Biologically correct and complete naming plus a true explanation; clarification is an admitted scope limit, but remains in recognition-rate denominator."
  },
  {
    "id": "long-correct-14",
    "group": "long-correct",
    "field": "osmosis",
    "text": "Osmose. Die Zellwand bleibt dabei annähernd formstabil.",
    "expected": [
      "correct",
      "clarify"
    ],
    "rationale": "Biologically correct and complete naming plus a true explanation; clarification is an admitted scope limit, but remains in recognition-rate denominator."
  },
  {
    "id": "long-correct-15",
    "group": "long-correct",
    "field": "osmosis",
    "text": "Die treibende Bedingung der Osmose ist hier die ausdrücklich angegebene Wasserpotenzialdifferenz.",
    "expected": [
      "correct",
      "clarify"
    ],
    "rationale": "Biologically correct and complete naming plus a true explanation; clarification is an admitted scope limit, but remains in recognition-rate denominator."
  },
  {
    "id": "long-correct-16",
    "group": "long-correct",
    "field": "osmosis",
    "text": "Osmose ist eine Form des passiven Transports. Osmose ist keine Endocytose.",
    "expected": [
      "correct",
      "clarify"
    ],
    "rationale": "Biologically correct and complete naming plus a true explanation; clarification is an admitted scope limit, but remains in recognition-rate denominator."
  },
  {
    "id": "long-correct-17",
    "group": "long-correct",
    "field": "osmosis",
    "text": "Der gesuchte Vorgang heißt Osmose. Er ist nicht mit Plasmolyse gleichzusetzen.",
    "expected": [
      "correct",
      "clarify"
    ],
    "rationale": "Biologically correct and complete naming plus a true explanation; clarification is an admitted scope limit, but remains in recognition-rate denominator."
  },
  {
    "id": "long-correct-18",
    "group": "long-correct",
    "field": "osmosis",
    "text": "Osmose ist Wasserbewegung. Osmose ist kein aktiver Transport. Danke!",
    "expected": [
      "correct",
      "clarify"
    ],
    "rationale": "Biologically correct and complete naming plus a true explanation; clarification is an admitted scope limit, but remains in recognition-rate denominator."
  },
  {
    "id": "long-correct-19",
    "group": "long-correct",
    "field": "osmosis",
    "text": "Es ist Osmose, bei der Wasser aus der Vakuole über das Cytosol nach außen gelangt.",
    "expected": [
      "correct",
      "clarify"
    ],
    "rationale": "Biologically correct and complete naming plus a true explanation; clarification is an admitted scope limit, but remains in recognition-rate denominator."
  },
  {
    "id": "long-correct-20",
    "group": "long-correct",
    "field": "osmosis",
    "text": "Der Wassertransport erfolgt durch Osmose; dabei nimmt das Vakuolenvolumen ab.",
    "expected": [
      "correct",
      "clarify"
    ],
    "rationale": "Biologically correct and complete naming plus a true explanation; clarification is an admitted scope limit, but remains in recognition-rate denominator."
  },
  {
    "id": "wrong-name-01",
    "group": "wrong-name",
    "field": "osmosis",
    "text": "Die richtige Antwort wäre aktiver Transport.",
    "expected": [
      "incorrect",
      "clarify"
    ],
    "rationale": "Active pumping/vesicle transport/cell response is not the requested passive water transport name; unknown syntax must never become green."
  },
  {
    "id": "wrong-name-02",
    "group": "wrong-name",
    "field": "osmosis",
    "text": "Mein Vorschlag ist Endozytose.",
    "expected": [
      "incorrect",
      "clarify"
    ],
    "rationale": "Active pumping/vesicle transport/cell response is not the requested passive water transport name; unknown syntax must never become green."
  },
  {
    "id": "wrong-name-03",
    "group": "wrong-name",
    "field": "osmosis",
    "text": "Ich nehme an: Exocytose.",
    "expected": [
      "incorrect",
      "clarify"
    ],
    "rationale": "Active pumping/vesicle transport/cell response is not the requested passive water transport name; unknown syntax must never become green."
  },
  {
    "id": "wrong-name-04",
    "group": "wrong-name",
    "field": "osmosis",
    "text": "Die gesuchte Transportart wäre Plasmolyse.",
    "expected": [
      "incorrect",
      "clarify"
    ],
    "rationale": "Active pumping/vesicle transport/cell response is not the requested passive water transport name; unknown syntax must never become green."
  },
  {
    "id": "wrong-name-05",
    "group": "wrong-name",
    "field": "osmosis",
    "text": "Der Begriff lautet wahrscheinlich ATP-Pumpe.",
    "expected": [
      "incorrect",
      "clarify"
    ],
    "rationale": "Active pumping/vesicle transport/cell response is not the requested passive water transport name; unknown syntax must never become green."
  },
  {
    "id": "wrong-name-06",
    "group": "wrong-name",
    "field": "osmosis",
    "text": "Ich vermute, dass es aktiver Transport ist. Danke!",
    "expected": [
      "incorrect",
      "clarify"
    ],
    "rationale": "Active pumping/vesicle transport/cell response is not the requested passive water transport name; unknown syntax must never become green."
  },
  {
    "id": "wrong-name-07",
    "group": "wrong-name",
    "field": "osmosis",
    "text": "Ich halte das wohl für Endocytose.",
    "expected": [
      "incorrect",
      "clarify"
    ],
    "rationale": "Active pumping/vesicle transport/cell response is not the requested passive water transport name; unknown syntax must never become green."
  },
  {
    "id": "wrong-name-08",
    "group": "wrong-name",
    "field": "osmosis",
    "text": "Die gesuchte Bezeichnung: Exozytose.",
    "expected": [
      "incorrect",
      "clarify"
    ],
    "rationale": "Active pumping/vesicle transport/cell response is not the requested passive water transport name; unknown syntax must never become green."
  },
  {
    "id": "wrong-name-09",
    "group": "wrong-name",
    "field": "osmosis",
    "text": "Es ist wohl Plasmolyse.",
    "expected": [
      "incorrect",
      "clarify"
    ],
    "rationale": "Active pumping/vesicle transport/cell response is not the requested passive water transport name; unknown syntax must never become green."
  },
  {
    "id": "wrong-name-10",
    "group": "wrong-name",
    "field": "osmosis",
    "text": "Mein Tipp wäre eine ATP-Pumpe.",
    "expected": [
      "incorrect",
      "clarify"
    ],
    "rationale": "Active pumping/vesicle transport/cell response is not the requested passive water transport name; unknown syntax must never become green."
  },
  {
    "id": "contradiction-01",
    "group": "contradiction",
    "field": "osmosis",
    "text": "Die richtige Antwort wäre Osmose. Osmose ist eine Form des aktiven Transports.",
    "expected": [
      "incorrect",
      "clarify"
    ],
    "rationale": "Explicit denial of the correct process or attribution of a false transport property; green is forbidden."
  },
  {
    "id": "contradiction-02",
    "group": "contradiction",
    "field": "osmosis",
    "text": "Ich nehme an: Osmose. Osmose ist keine Diffusion von Wasser.",
    "expected": [
      "incorrect",
      "clarify"
    ],
    "rationale": "Explicit denial of the correct process or attribution of a false transport property; green is forbidden."
  },
  {
    "id": "contradiction-03",
    "group": "contradiction",
    "field": "osmosis",
    "text": "Es ist wohl Osmose. Danke! Osmose ist eine ATP-Pumpe.",
    "expected": [
      "incorrect",
      "clarify"
    ],
    "rationale": "Explicit denial of the correct process or attribution of a false transport property; green is forbidden."
  },
  {
    "id": "contradiction-04",
    "group": "contradiction",
    "field": "osmosis",
    "text": "Mein Vorschlag ist Osmose. Osmose ist Exozytose.",
    "expected": [
      "incorrect",
      "clarify"
    ],
    "rationale": "Explicit denial of the correct process or attribution of a false transport property; green is forbidden."
  },
  {
    "id": "contradiction-05",
    "group": "contradiction",
    "field": "osmosis",
    "text": "Die gesuchte Bezeichnung: Osmose. Es ist keine Osmose.",
    "expected": [
      "incorrect",
      "clarify"
    ],
    "rationale": "Explicit denial of the correct process or attribution of a false transport property; green is forbidden."
  },
  {
    "id": "contradiction-06",
    "group": "contradiction",
    "field": "osmosis",
    "text": "Osmose ist keine Form des passiven Transports.",
    "expected": [
      "incorrect",
      "clarify"
    ],
    "rationale": "Explicit denial of the correct process or attribution of a false transport property; green is forbidden."
  },
  {
    "id": "contradiction-07",
    "group": "contradiction",
    "field": "osmosis",
    "text": "Osmose ist eine Form der Endozytose.",
    "expected": [
      "incorrect",
      "clarify"
    ],
    "rationale": "Explicit denial of the correct process or attribution of a false transport property; green is forbidden."
  },
  {
    "id": "contradiction-08",
    "group": "contradiction",
    "field": "osmosis",
    "text": "Osmose ist eine Art von ATP-Pumpe.",
    "expected": [
      "incorrect",
      "clarify"
    ],
    "rationale": "Explicit denial of the correct process or attribution of a false transport property; green is forbidden."
  },
  {
    "id": "contradiction-09",
    "group": "contradiction",
    "field": "osmosis",
    "text": "Osmose ist Diffusion von Wasser und Osmose ist keine Wasserbewegung.",
    "expected": [
      "incorrect",
      "clarify"
    ],
    "rationale": "Explicit denial of the correct process or attribution of a false transport property; green is forbidden."
  },
  {
    "id": "contradiction-10",
    "group": "contradiction",
    "field": "osmosis",
    "text": "Osmose ist passiver Transport, aber Osmose ist aktiver Transport.",
    "expected": [
      "incorrect",
      "clarify"
    ],
    "rationale": "Explicit denial of the correct process or attribution of a false transport property; green is forbidden."
  },
  {
    "id": "contradiction-11",
    "group": "contradiction",
    "field": "osmosis",
    "text": "Osmose ist eine Form der Diffusion. Osmose ist eine Form des aktiven Transports.",
    "expected": [
      "incorrect",
      "clarify"
    ],
    "rationale": "Explicit denial of the correct process or attribution of a false transport property; green is forbidden."
  },
  {
    "id": "contradiction-12",
    "group": "contradiction",
    "field": "osmosis",
    "text": "Osmose ist Osmose. Danke! Osmose ist keine passive Wasserbewegung.",
    "expected": [
      "incorrect",
      "clarify"
    ],
    "rationale": "Explicit denial of the correct process or attribution of a false transport property; green is forbidden."
  },
  {
    "id": "contradiction-13",
    "group": "contradiction",
    "field": "osmosis",
    "text": "Ich tippe nicht auf Osmose, sondern auf Endozytose.",
    "expected": [
      "incorrect",
      "clarify"
    ],
    "rationale": "Explicit denial of the correct process or attribution of a false transport property; green is forbidden."
  },
  {
    "id": "contradiction-14",
    "group": "contradiction",
    "field": "osmosis",
    "text": "Ich denke nicht an Osmose, sondern an ATP-Pumpe.",
    "expected": [
      "incorrect",
      "clarify"
    ],
    "rationale": "Explicit denial of the correct process or attribution of a false transport property; green is forbidden."
  },
  {
    "id": "contradiction-15",
    "group": "contradiction",
    "field": "osmosis",
    "text": "Ich vermute, dass es keine Osmose ist.",
    "expected": [
      "incorrect",
      "clarify"
    ],
    "rationale": "Explicit denial of the correct process or attribution of a false transport property; green is forbidden."
  },
  {
    "id": "correct-negation-01",
    "group": "correct-negation",
    "field": "osmosis",
    "text": "Ich tippe nicht auf Exozytose, sondern auf Osmose.",
    "expected": [
      "correct",
      "clarify"
    ],
    "rationale": "Correct contrast/negative property; no red is justified."
  },
  {
    "id": "correct-negation-02",
    "group": "correct-negation",
    "field": "osmosis",
    "text": "Ich denke nicht an ATP-Pumpe, sondern an Osmose.",
    "expected": [
      "correct",
      "clarify"
    ],
    "rationale": "Correct contrast/negative property; no red is justified."
  },
  {
    "id": "correct-negation-03",
    "group": "correct-negation",
    "field": "osmosis",
    "text": "Osmose ist keine Form des aktiven Transports. Osmose ist Diffusion von Wasser.",
    "expected": [
      "correct",
      "clarify"
    ],
    "rationale": "Correct contrast/negative property; no red is justified."
  },
  {
    "id": "correct-negation-04",
    "group": "correct-negation",
    "field": "osmosis",
    "text": "Osmose ist kein aktiver Transport und Osmose ist keine Exocytose.",
    "expected": [
      "correct",
      "clarify"
    ],
    "rationale": "Correct contrast/negative property; no red is justified."
  },
  {
    "id": "correct-negation-05",
    "group": "correct-negation",
    "field": "osmosis",
    "text": "Es ist keine Plasmolyse, meine Antwort wäre Osmose.",
    "expected": [
      "correct",
      "clarify"
    ],
    "rationale": "Correct contrast/negative property; no red is justified."
  },
  {
    "id": "correct-negation-06",
    "group": "correct-negation",
    "field": "osmosis",
    "text": "Osmose ist passiver Transport und Osmose ist keine Endocytose.",
    "expected": [
      "correct",
      "clarify"
    ],
    "rationale": "Correct contrast/negative property; no red is justified."
  },
  {
    "id": "correct-negation-07",
    "group": "correct-negation",
    "field": "osmosis",
    "text": "Ich vermute, dass es keine Endocytose, sondern Osmose ist.",
    "expected": [
      "correct",
      "clarify"
    ],
    "rationale": "Correct contrast/negative property; no red is justified."
  },
  {
    "id": "correct-negation-08",
    "group": "correct-negation",
    "field": "osmosis",
    "text": "Osmose ist keine Art von ATP-Pumpe.",
    "expected": [
      "correct",
      "clarify"
    ],
    "rationale": "Correct contrast/negative property; no red is justified."
  },
  {
    "id": "correct-negation-09",
    "group": "correct-negation",
    "field": "osmosis",
    "text": "Osmose ist keine Endozytose. Danke! Osmose ist keine Exozytose.",
    "expected": [
      "correct",
      "clarify"
    ],
    "rationale": "Correct contrast/negative property; no red is justified."
  },
  {
    "id": "correct-negation-10",
    "group": "correct-negation",
    "field": "osmosis",
    "text": "Osmose ist eine Form der Diffusion und Osmose ist kein aktiver Transport.",
    "expected": [
      "correct",
      "clarify"
    ],
    "rationale": "Correct contrast/negative property; no red is justified."
  },
  {
    "id": "unassessed-01",
    "group": "unassessed",
    "field": "osmosis",
    "text": "Die richtige Antwort wäre Osmose. Wasser fließt netto zum höheren Wasserpotenzial.",
    "expected": [
      "clarify",
      "incorrect"
    ],
    "rationale": "Relevant additional assertion is false or contradicts the explicit material; no wholesale green may discard it."
  },
  {
    "id": "unassessed-02",
    "group": "unassessed",
    "field": "osmosis",
    "text": "Die gesuchte Bezeichnung: Osmose. Die Zellwand verliert ihre feste Form.",
    "expected": [
      "clarify",
      "incorrect"
    ],
    "rationale": "Relevant additional assertion is false or contradicts the explicit material; no wholesale green may discard it."
  },
  {
    "id": "unassessed-03",
    "group": "unassessed",
    "field": "osmosis",
    "text": "Ich nehme an: Osmose. Saccharose ist der transportierte Stoff.",
    "expected": [
      "clarify",
      "incorrect"
    ],
    "rationale": "Relevant additional assertion is false or contradicts the explicit material; no wholesale green may discard it."
  },
  {
    "id": "unassessed-04",
    "group": "unassessed",
    "field": "osmosis",
    "text": "Es ist wohl Osmose. Das Vakuolenvolumen nimmt zu.",
    "expected": [
      "clarify",
      "incorrect"
    ],
    "rationale": "Relevant additional assertion is false or contradicts the explicit material; no wholesale green may discard it."
  },
  {
    "id": "unassessed-05",
    "group": "unassessed",
    "field": "osmosis",
    "text": "Mein Vorschlag ist Osmose. Das Wasser wird unter ATP-Verbrauch hinausgepumpt.",
    "expected": [
      "clarify",
      "incorrect"
    ],
    "rationale": "Relevant additional assertion is false or contradicts the explicit material; no wholesale green may discard it."
  },
  {
    "id": "unassessed-06",
    "group": "unassessed",
    "field": "osmosis",
    "text": "Ich vermute, dass es Osmose ist. Der Tonoplast ist wasserundurchlässig.",
    "expected": [
      "clarify",
      "incorrect"
    ],
    "rationale": "Relevant additional assertion is false or contradicts the explicit material; no wholesale green may discard it."
  },
  {
    "id": "unassessed-07",
    "group": "unassessed",
    "field": "osmosis",
    "text": "Osmose, denke ich mal. Die Vakuole wächst durch den Wasserverlust.",
    "expected": [
      "clarify",
      "incorrect"
    ],
    "rationale": "Relevant additional assertion is false or contradicts the explicit material; no wholesale green may discard it."
  },
  {
    "id": "unassessed-08",
    "group": "unassessed",
    "field": "osmosis",
    "text": "Die richtige Antwort wäre Osmose. Alle Organellen sind Bakterien.",
    "expected": [
      "clarify",
      "incorrect"
    ],
    "rationale": "Relevant additional assertion is false or contradicts the explicit material; no wholesale green may discard it."
  },
  {
    "id": "unassessed-09",
    "group": "unassessed",
    "field": "osmosis",
    "text": "Osmose ist meine Vermutung. Die Saccharose passiert ungehindert beide Membranen.",
    "expected": [
      "clarify",
      "incorrect"
    ],
    "rationale": "Relevant additional assertion is false or contradicts the explicit material; no wholesale green may discard it."
  },
  {
    "id": "unassessed-10",
    "group": "unassessed",
    "field": "osmosis",
    "text": "Osmose, wenn ich mich nicht irre. Die Zelle hat keinen Tonoplasten.",
    "expected": [
      "clarify",
      "incorrect"
    ],
    "rationale": "Relevant additional assertion is false or contradicts the explicit material; no wholesale green may discard it."
  },
  {
    "id": "partial-01",
    "group": "partial",
    "field": "osmosis",
    "text": "Die richtige Antwort wäre Diffusion.",
    "expected": [
      "partial"
    ],
    "rationale": "Names a true broader process but does not supply Osmose."
  },
  {
    "id": "partial-02",
    "group": "partial",
    "field": "osmosis",
    "text": "Mein Vorschlag ist Wasserbewegung.",
    "expected": [
      "partial"
    ],
    "rationale": "Names a true broader process but does not supply Osmose."
  },
  {
    "id": "partial-03",
    "group": "partial",
    "field": "osmosis",
    "text": "Die gesuchte Bezeichnung: Transport von Wasser.",
    "expected": [
      "partial"
    ],
    "rationale": "Names a true broader process but does not supply Osmose."
  },
  {
    "id": "partial-04",
    "group": "partial",
    "field": "osmosis",
    "text": "Ich nehme an: Diffusion des Wassers.",
    "expected": [
      "partial"
    ],
    "rationale": "Names a true broader process but does not supply Osmose."
  },
  {
    "id": "partial-05",
    "group": "partial",
    "field": "osmosis",
    "text": "Es ist wohl Wassertransport.",
    "expected": [
      "partial"
    ],
    "rationale": "Names a true broader process but does not supply Osmose."
  },
  {
    "id": "ambiguous-01",
    "group": "ambiguous",
    "field": "osmosis",
    "text": "Die richtige Antwort wäre Osmose oder Plasmolyse.",
    "expected": [
      "clarify"
    ],
    "rationale": "Unresolved alternatives or uncertain double-negation scope."
  },
  {
    "id": "ambiguous-02",
    "group": "ambiguous",
    "field": "osmosis",
    "text": "Mein Vorschlag ist Osmose beziehungsweise Exocytose.",
    "expected": [
      "clarify"
    ],
    "rationale": "Unresolved alternatives or uncertain double-negation scope."
  },
  {
    "id": "ambiguous-03",
    "group": "ambiguous",
    "field": "osmosis",
    "text": "Ich nehme an: Osmose/aktiver Transport.",
    "expected": [
      "clarify"
    ],
    "rationale": "Unresolved alternatives or uncertain double-negation scope."
  },
  {
    "id": "ambiguous-04",
    "group": "ambiguous",
    "field": "osmosis",
    "text": "Die gesuchte Bezeichnung: Osmose und Diffusion.",
    "expected": [
      "clarify"
    ],
    "rationale": "Unresolved alternatives or uncertain double-negation scope."
  },
  {
    "id": "ambiguous-05",
    "group": "ambiguous",
    "field": "osmosis",
    "text": "Es ist wohl Osmose (ATP-Pumpe).",
    "expected": [
      "clarify"
    ],
    "rationale": "Unresolved alternatives or uncertain double-negation scope."
  },
  {
    "id": "ambiguous-06",
    "group": "ambiguous",
    "field": "osmosis",
    "text": "Ich tippe nicht auf keine Osmose.",
    "expected": [
      "clarify"
    ],
    "rationale": "Unresolved alternatives or uncertain double-negation scope."
  },
  {
    "id": "tonoplast-correct-01",
    "group": "tonoplast-correct",
    "field": "tonoplast",
    "text": "Die richtige Antwort wäre Vakuolenmembran.",
    "expected": [
      "correct",
      "clarify"
    ],
    "rationale": "Tonoplast/Vakuolenmembran correctly names the vacuole boundary; unknown naming syntax may clarify, but never red."
  },
  {
    "id": "tonoplast-correct-02",
    "group": "tonoplast-correct",
    "field": "tonoplast",
    "text": "Die gesuchte Bezeichnung: Tonoplast.",
    "expected": [
      "correct",
      "clarify"
    ],
    "rationale": "Tonoplast/Vakuolenmembran correctly names the vacuole boundary; unknown naming syntax may clarify, but never red."
  },
  {
    "id": "tonoplast-correct-03",
    "group": "tonoplast-correct",
    "field": "tonoplast",
    "text": "Ich nehme an: Vakuolenmembran.",
    "expected": [
      "correct",
      "clarify"
    ],
    "rationale": "Tonoplast/Vakuolenmembran correctly names the vacuole boundary; unknown naming syntax may clarify, but never red."
  },
  {
    "id": "tonoplast-correct-04",
    "group": "tonoplast-correct",
    "field": "tonoplast",
    "text": "Es ist wohl Tonoplast.",
    "expected": [
      "correct",
      "clarify"
    ],
    "rationale": "Tonoplast/Vakuolenmembran correctly names the vacuole boundary; unknown naming syntax may clarify, but never red."
  },
  {
    "id": "tonoplast-correct-05",
    "group": "tonoplast-correct",
    "field": "tonoplast",
    "text": "Mein Vorschlag ist Vakuolenmembran.",
    "expected": [
      "correct",
      "clarify"
    ],
    "rationale": "Tonoplast/Vakuolenmembran correctly names the vacuole boundary; unknown naming syntax may clarify, but never red."
  },
  {
    "id": "tonoplast-correct-06",
    "group": "tonoplast-correct",
    "field": "tonoplast",
    "text": "Ich vermute, dass es Tonoplast ist. Danke!",
    "expected": [
      "correct",
      "clarify"
    ],
    "rationale": "Tonoplast/Vakuolenmembran correctly names the vacuole boundary; unknown naming syntax may clarify, but never red."
  },
  {
    "id": "tonoplast-correct-07",
    "group": "tonoplast-correct",
    "field": "tonoplast",
    "text": "Ich denke nicht an Zellwand, sondern an Tonoplast.",
    "expected": [
      "correct",
      "clarify"
    ],
    "rationale": "Tonoplast/Vakuolenmembran correctly names the vacuole boundary; unknown naming syntax may clarify, but never red."
  },
  {
    "id": "tonoplast-correct-08",
    "group": "tonoplast-correct",
    "field": "tonoplast",
    "text": "Ich tippe nicht auf Kernhülle, sondern auf Vakuolenmembran.",
    "expected": [
      "correct",
      "clarify"
    ],
    "rationale": "Tonoplast/Vakuolenmembran correctly names the vacuole boundary; unknown naming syntax may clarify, but never red."
  },
  {
    "id": "tonoplast-correct-09",
    "group": "tonoplast-correct",
    "field": "tonoplast",
    "text": "Der Tonoplast ist eine Form der Membran.",
    "expected": [
      "correct",
      "clarify"
    ],
    "rationale": "Tonoplast/Vakuolenmembran correctly names the vacuole boundary; unknown naming syntax may clarify, but never red."
  },
  {
    "id": "tonoplast-correct-10",
    "group": "tonoplast-correct",
    "field": "tonoplast",
    "text": "Die Vakuolenmembran trennt den Vakuolenraum vom Cytosol.",
    "expected": [
      "correct",
      "clarify"
    ],
    "rationale": "Tonoplast/Vakuolenmembran correctly names the vacuole boundary; unknown naming syntax may clarify, but never red."
  },
  {
    "id": "tonoplast-correct-11",
    "group": "tonoplast-correct",
    "field": "tonoplast",
    "text": "Tonoplast ist keine Zellwand. Danke! Tonoplast umschließt die Vakuole.",
    "expected": [
      "correct",
      "clarify"
    ],
    "rationale": "Tonoplast/Vakuolenmembran correctly names the vacuole boundary; unknown naming syntax may clarify, but never red."
  },
  {
    "id": "tonoplast-correct-12",
    "group": "tonoplast-correct",
    "field": "tonoplast",
    "text": "Mein Tipp wäre der Tonoplast.",
    "expected": [
      "correct",
      "clarify"
    ],
    "rationale": "Tonoplast/Vakuolenmembran correctly names the vacuole boundary; unknown naming syntax may clarify, but never red."
  },
  {
    "id": "tonoplast-correct-13",
    "group": "tonoplast-correct",
    "field": "tonoplast",
    "text": "Ich würde die Grenze Tonoplast nennen.",
    "expected": [
      "correct",
      "clarify"
    ],
    "rationale": "Tonoplast/Vakuolenmembran correctly names the vacuole boundary; unknown naming syntax may clarify, but never red."
  },
  {
    "id": "tonoplast-correct-14",
    "group": "tonoplast-correct",
    "field": "tonoplast",
    "text": "Der richtige Name lautet Vakuolenmembran.",
    "expected": [
      "correct",
      "clarify"
    ],
    "rationale": "Tonoplast/Vakuolenmembran correctly names the vacuole boundary; unknown naming syntax may clarify, but never red."
  },
  {
    "id": "tonoplast-correct-15",
    "group": "tonoplast-correct",
    "field": "tonoplast",
    "text": "Die Membran heißt also Tonoplast.",
    "expected": [
      "correct",
      "clarify"
    ],
    "rationale": "Tonoplast/Vakuolenmembran correctly names the vacuole boundary; unknown naming syntax may clarify, but never red."
  },
  {
    "id": "tonoplast-wrong-01",
    "group": "tonoplast-wrong",
    "field": "tonoplast",
    "text": "Die richtige Antwort wäre Zellwand.",
    "expected": [
      "incorrect",
      "clarify"
    ],
    "rationale": "Wrong boundary or explicit contradiction of vacuole-boundary anatomy; never green."
  },
  {
    "id": "tonoplast-wrong-02",
    "group": "tonoplast-wrong",
    "field": "tonoplast",
    "text": "Die gesuchte Bezeichnung: Zellmembran.",
    "expected": [
      "incorrect",
      "clarify"
    ],
    "rationale": "Wrong boundary or explicit contradiction of vacuole-boundary anatomy; never green."
  },
  {
    "id": "tonoplast-wrong-03",
    "group": "tonoplast-wrong",
    "field": "tonoplast",
    "text": "Ich nehme an: Kernhülle.",
    "expected": [
      "incorrect",
      "clarify"
    ],
    "rationale": "Wrong boundary or explicit contradiction of vacuole-boundary anatomy; never green."
  },
  {
    "id": "tonoplast-wrong-04",
    "group": "tonoplast-wrong",
    "field": "tonoplast",
    "text": "Es ist wohl die Vakuole.",
    "expected": [
      "incorrect",
      "clarify"
    ],
    "rationale": "Wrong boundary or explicit contradiction of vacuole-boundary anatomy; never green."
  },
  {
    "id": "tonoplast-wrong-05",
    "group": "tonoplast-wrong",
    "field": "tonoplast",
    "text": "Mein Vorschlag ist Tonoplast. Tonoplast ist keine Membran.",
    "expected": [
      "incorrect",
      "clarify"
    ],
    "rationale": "Wrong boundary or explicit contradiction of vacuole-boundary anatomy; never green."
  },
  {
    "id": "tonoplast-wrong-06",
    "group": "tonoplast-wrong",
    "field": "tonoplast",
    "text": "Ich vermute, dass es Tonoplast ist. Tonoplast umschließt den Zellkern.",
    "expected": [
      "incorrect",
      "clarify"
    ],
    "rationale": "Wrong boundary or explicit contradiction of vacuole-boundary anatomy; never green."
  },
  {
    "id": "tonoplast-wrong-07",
    "group": "tonoplast-wrong",
    "field": "tonoplast",
    "text": "Ich denke nicht an Tonoplast, sondern an Zellwand.",
    "expected": [
      "incorrect",
      "clarify"
    ],
    "rationale": "Wrong boundary or explicit contradiction of vacuole-boundary anatomy; never green."
  },
  {
    "id": "tonoplast-wrong-08",
    "group": "tonoplast-wrong",
    "field": "tonoplast",
    "text": "Ich tippe nicht auf Vakuolenmembran, sondern auf Zellmembran.",
    "expected": [
      "incorrect",
      "clarify"
    ],
    "rationale": "Wrong boundary or explicit contradiction of vacuole-boundary anatomy; never green."
  },
  {
    "id": "tonoplast-wrong-09",
    "group": "tonoplast-wrong",
    "field": "tonoplast",
    "text": "Der Tonoplast ist eine Form der Zellwand.",
    "expected": [
      "incorrect",
      "clarify"
    ],
    "rationale": "Wrong boundary or explicit contradiction of vacuole-boundary anatomy; never green."
  },
  {
    "id": "tonoplast-wrong-10",
    "group": "tonoplast-wrong",
    "field": "tonoplast",
    "text": "Tonoplast ist Vakuolenmembran und Tonoplast ist keine Vakuolenmembran.",
    "expected": [
      "incorrect",
      "clarify"
    ],
    "rationale": "Wrong boundary or explicit contradiction of vacuole-boundary anatomy; never green."
  },
  {
    "id": "tonoplast-unassessed-01",
    "group": "tonoplast-unassessed",
    "field": "tonoplast",
    "text": "Die richtige Antwort wäre Tonoplast. Alle Organellen sind Bakterien.",
    "expected": [
      "clarify",
      "incorrect"
    ],
    "rationale": "No unassessed relevant biological remainder may receive green."
  },
  {
    "id": "tonoplast-unassessed-02",
    "group": "tonoplast-unassessed",
    "field": "tonoplast",
    "text": "Die gesuchte Bezeichnung: Vakuolenmembran oder Zellmembran.",
    "expected": [
      "clarify",
      "incorrect"
    ],
    "rationale": "No unassessed relevant biological remainder may receive green."
  },
  {
    "id": "tonoplast-unassessed-03",
    "group": "tonoplast-unassessed",
    "field": "tonoplast",
    "text": "Ich nehme an: Tonoplast. Osmose ist eine ATP-Pumpe.",
    "expected": [
      "clarify",
      "incorrect"
    ],
    "rationale": "No unassessed relevant biological remainder may receive green."
  },
  {
    "id": "tonoplast-unassessed-04",
    "group": "tonoplast-unassessed",
    "field": "tonoplast",
    "text": "Es ist wohl Tonoplast. Der Zellkern besitzt keine Membran.",
    "expected": [
      "clarify",
      "incorrect"
    ],
    "rationale": "No unassessed relevant biological remainder may receive green."
  },
  {
    "id": "tonoplast-unassessed-05",
    "group": "tonoplast-unassessed",
    "field": "tonoplast",
    "text": "Mein Vorschlag ist Tonoplast. Wasser wandert immer zum höheren Wasserpotenzial.",
    "expected": [
      "clarify",
      "incorrect"
    ],
    "rationale": "No unassessed relevant biological remainder may receive green."
  }
];
