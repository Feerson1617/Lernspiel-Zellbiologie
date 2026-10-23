import type { Status } from '../../src/domain/contracts.ts';
/** Supplied 2026-10-23 review sentences. Raw texts, IDs and expectations unchanged;
 * no private examination source. See the separate adjudication in the test helper. */
export interface SuppliedCase { readonly id: string; readonly group: string; readonly field: 'osmosis' | 'tonoplast'; readonly expected: readonly Status[]; readonly text: string }
export const SUPPLIED_MAIN: readonly SuppliedCase[] = [
  {
    "id": "short-correct-01",
    "group": "short-correct",
    "field": "osmosis",
    "expected": [
      "correct"
    ],
    "text": "Ich würde hier den Wassertransport als Osmose bezeichnen."
  },
  {
    "id": "short-correct-02",
    "group": "short-correct",
    "field": "osmosis",
    "expected": [
      "correct"
    ],
    "text": "Die richtige Bezeichnung dafür lautet Osmose."
  },
  {
    "id": "short-correct-03",
    "group": "short-correct",
    "field": "osmosis",
    "expected": [
      "correct"
    ],
    "text": "Dieser Transport von Wasser heißt Osmose."
  },
  {
    "id": "short-correct-04",
    "group": "short-correct",
    "field": "osmosis",
    "expected": [
      "correct"
    ],
    "text": "Für mich lautet die Antwort hier Osmose."
  },
  {
    "id": "short-correct-05",
    "group": "short-correct",
    "field": "osmosis",
    "expected": [
      "correct"
    ],
    "text": "Ich habe als Antwort Osmose gewählt."
  },
  {
    "id": "short-correct-06",
    "group": "short-correct",
    "field": "osmosis",
    "expected": [
      "correct"
    ],
    "text": "Mein Lösungsvorschlag für diesen Transport lautet Osmose."
  },
  {
    "id": "short-correct-07",
    "group": "short-correct",
    "field": "osmosis",
    "expected": [
      "correct"
    ],
    "text": "Als Fachwort würde ich hier Osmose angeben."
  },
  {
    "id": "short-correct-08",
    "group": "short-correct",
    "field": "osmosis",
    "expected": [
      "correct"
    ],
    "text": "Die fachliche Bezeichnung ist hier Osmose."
  },
  {
    "id": "short-correct-09",
    "group": "short-correct",
    "field": "osmosis",
    "expected": [
      "correct"
    ],
    "text": "Ich würde diesen Wassertransport Osmose nennen."
  },
  {
    "id": "short-correct-10",
    "group": "short-correct",
    "field": "osmosis",
    "expected": [
      "correct"
    ],
    "text": "Das Fachwort dafür ist Osmose."
  },
  {
    "id": "short-correct-11",
    "group": "short-correct",
    "field": "osmosis",
    "expected": [
      "correct"
    ],
    "text": "Ich bin der Meinung, dass hier Osmose gemeint ist."
  },
  {
    "id": "short-correct-12",
    "group": "short-correct",
    "field": "osmosis",
    "expected": [
      "correct"
    ],
    "text": "Man bezeichnet diesen Vorgang als Osmose."
  },
  {
    "id": "short-correct-13",
    "group": "short-correct",
    "field": "osmosis",
    "expected": [
      "correct"
    ],
    "text": "Der Fachausdruck für den Vorgang ist Osmose."
  },
  {
    "id": "short-correct-14",
    "group": "short-correct",
    "field": "osmosis",
    "expected": [
      "correct"
    ],
    "text": "Bei der Benennung entscheide ich mich für Osmose."
  },
  {
    "id": "short-correct-15",
    "group": "short-correct",
    "field": "osmosis",
    "expected": [
      "correct"
    ],
    "text": "Osmose lautet meine Antwort auf diese Frage."
  },
  {
    "id": "short-correct-16",
    "group": "short-correct",
    "field": "osmosis",
    "expected": [
      "correct"
    ],
    "text": "Ich antworte hier mit Osmose."
  },
  {
    "id": "short-correct-17",
    "group": "short-correct",
    "field": "osmosis",
    "expected": [
      "correct"
    ],
    "text": "Ich vermute, der gesuchte Wassertransport heißt Osmose."
  },
  {
    "id": "short-correct-18",
    "group": "short-correct",
    "field": "osmosis",
    "expected": [
      "correct"
    ],
    "text": "Mit Osmose würde ich den Vorgang benennen."
  },
  {
    "id": "short-correct-19",
    "group": "short-correct",
    "field": "osmosis",
    "expected": [
      "correct"
    ],
    "text": "Hier würde ich den Begriff Osmose verwenden."
  },
  {
    "id": "short-correct-20",
    "group": "short-correct",
    "field": "osmosis",
    "expected": [
      "correct"
    ],
    "text": "Ich denke an den Begriff Osmose."
  },
  {
    "id": "short-correct-21",
    "group": "short-correct",
    "field": "osmosis",
    "expected": [
      "correct"
    ],
    "text": "Als gesuchten Vorgang nenne ich Osmose."
  },
  {
    "id": "short-correct-22",
    "group": "short-correct",
    "field": "osmosis",
    "expected": [
      "correct"
    ],
    "text": "Ich würde das hier einfach Osmose nennen."
  },
  {
    "id": "short-correct-23",
    "group": "short-correct",
    "field": "osmosis",
    "expected": [
      "correct"
    ],
    "text": "Ich bin mir bei der Benennung sicher: Osmose."
  },
  {
    "id": "short-correct-24",
    "group": "short-correct",
    "field": "osmosis",
    "expected": [
      "correct"
    ],
    "text": "Die passende Antwort wäre hier Osmose."
  },
  {
    "id": "short-correct-25",
    "group": "short-correct",
    "field": "osmosis",
    "expected": [
      "correct"
    ],
    "text": "Dieser Prozess wird in der Biologie Osmose genannt."
  },
  {
    "id": "short-correct-26",
    "group": "short-correct",
    "field": "osmosis",
    "expected": [
      "correct"
    ],
    "text": "Für den beschriebenen Wassertransport passt der Name Osmose."
  },
  {
    "id": "short-correct-27",
    "group": "short-correct",
    "field": "osmosis",
    "expected": [
      "correct"
    ],
    "text": "Osmose wäre der passende Fachausdruck."
  },
  {
    "id": "short-correct-28",
    "group": "short-correct",
    "field": "osmosis",
    "expected": [
      "correct"
    ],
    "text": "Der Name dieses Vorgangs lautet Osmose."
  },
  {
    "id": "short-correct-29",
    "group": "short-correct",
    "field": "osmosis",
    "expected": [
      "correct"
    ],
    "text": "Ich würde hier auf Osmose tippen."
  },
  {
    "id": "short-correct-30",
    "group": "short-correct",
    "field": "osmosis",
    "expected": [
      "correct"
    ],
    "text": "Es sollte sich um Osmose handeln."
  },
  {
    "id": "short-correct-31",
    "group": "short-correct",
    "field": "osmosis",
    "expected": [
      "correct"
    ],
    "text": "Die gesuchte Bezeichnung wäre also Osmose."
  },
  {
    "id": "short-correct-32",
    "group": "short-correct",
    "field": "osmosis",
    "expected": [
      "correct"
    ],
    "text": "Der gesuchte Wassertransportvorgang heißt meines Wissens Osmose."
  },
  {
    "id": "short-correct-33",
    "group": "short-correct",
    "field": "osmosis",
    "expected": [
      "correct"
    ],
    "text": "Diesen Transport nennt man meines Erachtens Osmose."
  },
  {
    "id": "short-correct-34",
    "group": "short-correct",
    "field": "osmosis",
    "expected": [
      "correct"
    ],
    "text": "Ich würde sagen, der Vorgang ist Osmose."
  },
  {
    "id": "short-correct-35",
    "group": "short-correct",
    "field": "osmosis",
    "expected": [
      "correct"
    ],
    "text": "Dazu fällt mir als Begriff Osmose ein."
  },
  {
    "id": "short-correct-36",
    "group": "short-correct",
    "field": "osmosis",
    "expected": [
      "correct"
    ],
    "text": "Osmose ist hier meine endgültige Antwort."
  },
  {
    "id": "short-correct-37",
    "group": "short-correct",
    "field": "osmosis",
    "expected": [
      "correct"
    ],
    "text": "Ich trage hier Osmose ein."
  },
  {
    "id": "short-correct-38",
    "group": "short-correct",
    "field": "osmosis",
    "expected": [
      "correct"
    ],
    "text": "Meine Antwort zu diesem Vorgang lautet Osmose."
  },
  {
    "id": "short-correct-39",
    "group": "short-correct",
    "field": "osmosis",
    "expected": [
      "correct"
    ],
    "text": "Der Vorgang lässt sich als Osmose bezeichnen."
  },
  {
    "id": "short-correct-40",
    "group": "short-correct",
    "field": "osmosis",
    "expected": [
      "correct"
    ],
    "text": "Ich wähle für diesen Vorgang Osmose."
  },
  {
    "id": "short-correct-41",
    "group": "short-correct",
    "field": "osmosis",
    "expected": [
      "correct"
    ],
    "text": "Osmose, das ist der gesuchte Begriff."
  },
  {
    "id": "short-correct-42",
    "group": "short-correct",
    "field": "osmosis",
    "expected": [
      "correct"
    ],
    "text": "Osmose – so nennt man diesen Vorgang."
  },
  {
    "id": "short-correct-43",
    "group": "short-correct",
    "field": "osmosis",
    "expected": [
      "correct"
    ],
    "text": "Der hier gemeinte Prozess heißt Osmose."
  },
  {
    "id": "short-correct-44",
    "group": "short-correct",
    "field": "osmosis",
    "expected": [
      "correct"
    ],
    "text": "Ich meine damit den Vorgang Osmose."
  },
  {
    "id": "short-correct-45",
    "group": "short-correct",
    "field": "osmosis",
    "expected": [
      "correct"
    ],
    "text": "Ich würde den Wassertransport hier Osmose nennen."
  },
  {
    "id": "short-correct-46",
    "group": "short-correct",
    "field": "osmosis",
    "expected": [
      "correct"
    ],
    "text": "Meine Vermutung für den Vorgang ist Osmose."
  },
  {
    "id": "short-correct-47",
    "group": "short-correct",
    "field": "osmosis",
    "expected": [
      "correct"
    ],
    "text": "Als Antwort habe ich hier Osmose."
  },
  {
    "id": "short-correct-48",
    "group": "short-correct",
    "field": "osmosis",
    "expected": [
      "correct"
    ],
    "text": "Ich halte Osmose für die passende Benennung."
  },
  {
    "id": "short-correct-49",
    "group": "short-correct",
    "field": "osmosis",
    "expected": [
      "correct"
    ],
    "text": "Hier müsste der Begriff Osmose passen."
  },
  {
    "id": "short-correct-50",
    "group": "short-correct",
    "field": "osmosis",
    "expected": [
      "correct"
    ],
    "text": "Osmose, so lautet die Bezeichnung dafür."
  },
  {
    "id": "short-correct-51",
    "group": "short-correct",
    "field": "osmosis",
    "expected": [
      "correct"
    ],
    "text": "Das würde ich als Osmose benennen."
  },
  {
    "id": "short-correct-52",
    "group": "short-correct",
    "field": "osmosis",
    "expected": [
      "correct"
    ],
    "text": "Ich würde bei diesem Wassertransport von Osmose sprechen."
  },
  {
    "id": "short-correct-53",
    "group": "short-correct",
    "field": "osmosis",
    "expected": [
      "correct"
    ],
    "text": "Dieser Vorgang heißt meiner Ansicht nach Osmose."
  },
  {
    "id": "short-correct-54",
    "group": "short-correct",
    "field": "osmosis",
    "expected": [
      "correct"
    ],
    "text": "Mit dem Vorgang ist hier Osmose gemeint."
  },
  {
    "id": "short-correct-55",
    "group": "short-correct",
    "field": "osmosis",
    "expected": [
      "correct"
    ],
    "text": "Als Transportvorgang würde ich Osmose nennen."
  },
  {
    "id": "short-correct-56",
    "group": "short-correct",
    "field": "osmosis",
    "expected": [
      "correct"
    ],
    "text": "Ich glaube, hier wäre Osmose die Antwort."
  },
  {
    "id": "short-correct-57",
    "group": "short-correct",
    "field": "osmosis",
    "expected": [
      "correct"
    ],
    "text": "Die Antwort auf die Frage nach dem Vorgang ist Osmose."
  },
  {
    "id": "short-correct-58",
    "group": "short-correct",
    "field": "osmosis",
    "expected": [
      "correct"
    ],
    "text": "Ich würde dafür den Namen Osmose nehmen."
  },
  {
    "id": "short-correct-59",
    "group": "short-correct",
    "field": "osmosis",
    "expected": [
      "correct"
    ],
    "text": "Mein Begriff für diesen Wassertransport ist Osmose."
  },
  {
    "id": "short-correct-60",
    "group": "short-correct",
    "field": "osmosis",
    "expected": [
      "correct"
    ],
    "text": "Ich würde es in diesem Fall Osmose nennen."
  },
  {
    "id": "long-correct-01",
    "group": "long-correct",
    "field": "osmosis",
    "expected": [
      "correct"
    ],
    "text": "Der Vorgang ist Osmose, also die passive Bewegung von Wasser durch eine selektiv permeable Membran."
  },
  {
    "id": "long-correct-02",
    "group": "long-correct",
    "field": "osmosis",
    "expected": [
      "correct"
    ],
    "text": "Osmose ist der Fachbegriff; dabei folgt Wasser dem Wasserpotenzialgefälle."
  },
  {
    "id": "long-correct-03",
    "group": "long-correct",
    "field": "osmosis",
    "expected": [
      "correct"
    ],
    "text": "Hier liegt Osmose vor, denn Wasser kann die Membranen passieren."
  },
  {
    "id": "long-correct-04",
    "group": "long-correct",
    "field": "osmosis",
    "expected": [
      "correct"
    ],
    "text": "Ich nenne den Vorgang Osmose: Wasser bewegt sich netto zum niedrigeren Wasserpotenzial."
  },
  {
    "id": "long-correct-05",
    "group": "long-correct",
    "field": "osmosis",
    "expected": [
      "correct"
    ],
    "text": "Osmose führt hier zum Wasserverlust der Zelle, weil das Wasserpotenzial außen niedriger liegt."
  },
  {
    "id": "long-correct-06",
    "group": "long-correct",
    "field": "osmosis",
    "expected": [
      "correct"
    ],
    "text": "Der passive Wassertransport heißt Osmose und benötigt keine direkte ATP-Spaltung für den Wasserfluss."
  },
  {
    "id": "long-correct-07",
    "group": "long-correct",
    "field": "osmosis",
    "expected": [
      "correct"
    ],
    "text": "Bei diesem Fall strömt Wasser osmotisch aus dem Cytosol in den Außenraum; der Vorgang heißt Osmose."
  },
  {
    "id": "long-correct-08",
    "group": "long-correct",
    "field": "osmosis",
    "expected": [
      "correct"
    ],
    "text": "Das ist Osmose. Das angegebene Gefälle besteht über Zellmembran und Tonoplast."
  },
  {
    "id": "long-correct-09",
    "group": "long-correct",
    "field": "osmosis",
    "expected": [
      "correct"
    ],
    "text": "Osmose beschreibt hier den Wassertransport; die Plasmolyse bezeichnet die nachfolgende Zellreaktion."
  },
  {
    "id": "long-correct-10",
    "group": "long-correct",
    "field": "osmosis",
    "expected": [
      "correct"
    ],
    "text": "Ich würde Osmose sagen, weil Wasser die selektiven Membranen durchquert."
  },
  {
    "id": "long-correct-11",
    "group": "long-correct",
    "field": "osmosis",
    "expected": [
      "correct"
    ],
    "text": "Osmose ist passiver Wassertransport; einzelne Wassermoleküle bewegen sich dabei in beide Richtungen."
  },
  {
    "id": "long-correct-12",
    "group": "long-correct",
    "field": "osmosis",
    "expected": [
      "correct"
    ],
    "text": "Der Wassertransport erfolgt durch Osmose. Die Nettobilanz richtet sich nach dem gesamten Wasserpotenzial."
  },
  {
    "id": "long-correct-13",
    "group": "long-correct",
    "field": "osmosis",
    "expected": [
      "correct"
    ],
    "text": "Ich meine Osmose, also eine Form der Diffusion von Wasser durch eine selektive Membran."
  },
  {
    "id": "long-correct-14",
    "group": "long-correct",
    "field": "osmosis",
    "expected": [
      "correct"
    ],
    "text": "Das nennt sich Osmose, wobei Saccharose im betrachteten Zeitraum weitgehend außen bleibt."
  },
  {
    "id": "long-correct-15",
    "group": "long-correct",
    "field": "osmosis",
    "expected": [
      "correct"
    ],
    "text": "Osmose findet hier statt; aus dem höheren Wasserpotenzial der Vakuole ergibt sich netto Wasserabgabe an das Cytosol."
  },
  {
    "id": "long-correct-16",
    "group": "long-correct",
    "field": "osmosis",
    "expected": [
      "correct"
    ],
    "text": "Es handelt sich um Osmose. Das Vakuolenvolumen nimmt in dieser Phase durch Wasserverlust ab."
  },
  {
    "id": "long-correct-17",
    "group": "long-correct",
    "field": "osmosis",
    "expected": [
      "correct"
    ],
    "text": "Osmose ist hier der Transportprozess; die annähernd formstabile Zellwand schrumpft dabei nicht mit."
  },
  {
    "id": "long-correct-18",
    "group": "long-correct",
    "field": "osmosis",
    "expected": [
      "correct"
    ],
    "text": "Mein Fachbegriff ist Osmose. Der Druckanteil gehört dabei zum Wasserpotenzial."
  },
  {
    "id": "long-correct-19",
    "group": "long-correct",
    "field": "osmosis",
    "expected": [
      "correct"
    ],
    "text": "Ich würde den Vorgang Osmose nennen; eine hohe Zuckerkonzentration allein legt ohne Druckangabe nicht jede Flussrichtung fest."
  },
  {
    "id": "long-correct-20",
    "group": "long-correct",
    "field": "osmosis",
    "expected": [
      "correct"
    ],
    "text": "Osmose bedeutet hier passive Wasserbewegung, während der Name Plasmolyse die Ablösung des Protoplasten von der Wand bezeichnet."
  },
  {
    "id": "wrong-name-01",
    "group": "wrong-name",
    "field": "osmosis",
    "expected": [
      "incorrect"
    ],
    "text": "Ich habe als Antwort Endocytose gewählt."
  },
  {
    "id": "wrong-name-02",
    "group": "wrong-name",
    "field": "osmosis",
    "expected": [
      "incorrect"
    ],
    "text": "Die richtige Bezeichnung dafür lautet Exocytose."
  },
  {
    "id": "wrong-name-03",
    "group": "wrong-name",
    "field": "osmosis",
    "expected": [
      "incorrect"
    ],
    "text": "Dieser Transport von Wasser heißt aktiver Transport."
  },
  {
    "id": "wrong-name-04",
    "group": "wrong-name",
    "field": "osmosis",
    "expected": [
      "incorrect"
    ],
    "text": "Als Fachwort würde ich hier Plasmolyse angeben."
  },
  {
    "id": "wrong-name-05",
    "group": "wrong-name",
    "field": "osmosis",
    "expected": [
      "incorrect"
    ],
    "text": "Ich würde diesen Wassertransport eine ATP-Pumpe nennen."
  },
  {
    "id": "wrong-name-06",
    "group": "wrong-name",
    "field": "osmosis",
    "expected": [
      "incorrect"
    ],
    "text": "Der Name dieses Vorgangs lautet Endozytose."
  },
  {
    "id": "wrong-name-07",
    "group": "wrong-name",
    "field": "osmosis",
    "expected": [
      "incorrect"
    ],
    "text": "Ich trage hier Exozytose ein."
  },
  {
    "id": "wrong-name-08",
    "group": "wrong-name",
    "field": "osmosis",
    "expected": [
      "incorrect"
    ],
    "text": "Als gesuchten Vorgang nenne ich aktiven Wassertransport."
  },
  {
    "id": "wrong-name-09",
    "group": "wrong-name",
    "field": "osmosis",
    "expected": [
      "incorrect"
    ],
    "text": "Hier würde ich den Begriff Plasmolyse verwenden."
  },
  {
    "id": "wrong-name-10",
    "group": "wrong-name",
    "field": "osmosis",
    "expected": [
      "incorrect"
    ],
    "text": "Der hier gemeinte Prozess heißt aktive Pumpe."
  },
  {
    "id": "wrong-name-11",
    "group": "wrong-name",
    "field": "osmosis",
    "expected": [
      "incorrect"
    ],
    "text": "Meine Antwort zu diesem Vorgang lautet Exocytose."
  },
  {
    "id": "wrong-name-12",
    "group": "wrong-name",
    "field": "osmosis",
    "expected": [
      "incorrect"
    ],
    "text": "Ich halte Endocytose für die passende Benennung."
  },
  {
    "id": "partial-01",
    "group": "partial",
    "field": "osmosis",
    "expected": [
      "partial"
    ],
    "text": "Ich würde diesen Wassertransport einfach Diffusion nennen."
  },
  {
    "id": "partial-02",
    "group": "partial",
    "field": "osmosis",
    "expected": [
      "partial"
    ],
    "text": "Als Fachwort würde ich hier Wassertransport angeben."
  },
  {
    "id": "partial-03",
    "group": "partial",
    "field": "osmosis",
    "expected": [
      "partial"
    ],
    "text": "Die passende Antwort wäre hier Wasserbewegung."
  },
  {
    "id": "partial-04",
    "group": "partial",
    "field": "osmosis",
    "expected": [
      "partial"
    ],
    "text": "Mein Lösungsvorschlag lautet Diffusion."
  },
  {
    "id": "partial-05",
    "group": "partial",
    "field": "osmosis",
    "expected": [
      "partial"
    ],
    "text": "Das Fachwort dafür ist Transport von Wasser."
  },
  {
    "id": "partial-06",
    "group": "partial",
    "field": "osmosis",
    "expected": [
      "partial"
    ],
    "text": "Ich trage hier Diffusion ein."
  },
  {
    "id": "partial-07",
    "group": "partial",
    "field": "osmosis",
    "expected": [
      "partial"
    ],
    "text": "Für mich lautet die Antwort hier Bewegung von Wasser."
  },
  {
    "id": "partial-08",
    "group": "partial",
    "field": "osmosis",
    "expected": [
      "partial"
    ],
    "text": "Der Name dieses Vorgangs lautet Wassertransport."
  },
  {
    "id": "ambiguous-01",
    "group": "ambiguous",
    "field": "osmosis",
    "expected": [
      "clarify"
    ],
    "text": "Ich schwanke hier zwischen Osmose und Plasmolyse."
  },
  {
    "id": "ambiguous-02",
    "group": "ambiguous",
    "field": "osmosis",
    "expected": [
      "clarify"
    ],
    "text": "Ich würde entweder Osmose oder Exocytose sagen."
  },
  {
    "id": "ambiguous-03",
    "group": "ambiguous",
    "field": "osmosis",
    "expected": [
      "clarify"
    ],
    "text": "Der Vorgang heißt vielleicht Osmose, vielleicht aber Endocytose."
  },
  {
    "id": "ambiguous-04",
    "group": "ambiguous",
    "field": "osmosis",
    "expected": [
      "clarify"
    ],
    "text": "Osmose beziehungsweise aktive Pumpe ist meine Antwort."
  },
  {
    "id": "ambiguous-05",
    "group": "ambiguous",
    "field": "osmosis",
    "expected": [
      "clarify"
    ],
    "text": "Der Transportvorgang ist Osmose / Plasmolyse."
  },
  {
    "id": "ambiguous-06",
    "group": "ambiguous",
    "field": "osmosis",
    "expected": [
      "clarify"
    ],
    "text": "Mein Lösungsvorschlag lautet Osmose oder Diffusion."
  },
  {
    "id": "ambiguous-07",
    "group": "ambiguous",
    "field": "osmosis",
    "expected": [
      "clarify"
    ],
    "text": "Als Antwort habe ich Osmose und Exocytose."
  },
  {
    "id": "ambiguous-08",
    "group": "ambiguous",
    "field": "osmosis",
    "expected": [
      "clarify"
    ],
    "text": "Ich trage hier Osmose oder Wassertransport ein."
  },
  {
    "id": "ambiguous-09",
    "group": "ambiguous",
    "field": "osmosis",
    "expected": [
      "clarify"
    ],
    "text": "Osmose? Endocytose? Ich kann mich nicht entscheiden."
  },
  {
    "id": "ambiguous-10",
    "group": "ambiguous",
    "field": "osmosis",
    "expected": [
      "clarify"
    ],
    "text": "Osmose, wobei ich auch an Plasmolyse denke."
  },
  {
    "id": "ambiguous-11",
    "group": "ambiguous",
    "field": "osmosis",
    "expected": [
      "clarify"
    ],
    "text": "Ist das jetzt Osmose oder aktiver Transport?"
  },
  {
    "id": "ambiguous-12",
    "group": "ambiguous",
    "field": "osmosis",
    "expected": [
      "clarify"
    ],
    "text": "Ich entscheide mich noch nicht zwischen Osmose und Diffusion."
  },
  {
    "id": "contradiction-01",
    "group": "contradiction",
    "field": "osmosis",
    "expected": [
      "incorrect"
    ],
    "text": "Osmose. Danke! Osmose ist keine Form der Diffusion."
  },
  {
    "id": "contradiction-02",
    "group": "contradiction",
    "field": "osmosis",
    "expected": [
      "incorrect"
    ],
    "text": "Der Vorgang heißt Osmose. Es ist keine Osmose."
  },
  {
    "id": "contradiction-03",
    "group": "contradiction",
    "field": "osmosis",
    "expected": [
      "incorrect"
    ],
    "text": "Ich würde diesen Vorgang Osmose nennen. Osmose ist aktiver Wassertransport."
  },
  {
    "id": "contradiction-04",
    "group": "contradiction",
    "field": "osmosis",
    "expected": [
      "incorrect"
    ],
    "text": "Osmose ist eine ATP-Pumpe. Danke!"
  },
  {
    "id": "contradiction-05",
    "group": "contradiction",
    "field": "osmosis",
    "expected": [
      "incorrect"
    ],
    "text": "Osmose ist keine passive Wasserbewegung. Osmose ist meine Antwort."
  },
  {
    "id": "contradiction-06",
    "group": "contradiction",
    "field": "osmosis",
    "expected": [
      "incorrect"
    ],
    "text": "Der Vorgang ist Osmose. Der Vorgang ist nicht Osmose."
  },
  {
    "id": "contradiction-07",
    "group": "contradiction",
    "field": "osmosis",
    "expected": [
      "incorrect"
    ],
    "text": "Osmose ist passiver Transport; Osmose ist nicht passiver Transport."
  },
  {
    "id": "contradiction-08",
    "group": "contradiction",
    "field": "osmosis",
    "expected": [
      "incorrect"
    ],
    "text": "Osmose ist eine Form des aktiven Transports. Osmose ist kein aktiver Transport."
  },
  {
    "id": "contradiction-09",
    "group": "contradiction",
    "field": "osmosis",
    "expected": [
      "incorrect"
    ],
    "text": "Osmose. Danke! Es ist in Wirklichkeit Exocytose."
  },
  {
    "id": "contradiction-10",
    "group": "contradiction",
    "field": "osmosis",
    "expected": [
      "incorrect"
    ],
    "text": "Osmose ist Diffusion. Osmose ist keine Diffusion. Danke!"
  },
  {
    "id": "contradiction-11",
    "group": "contradiction",
    "field": "osmosis",
    "expected": [
      "incorrect"
    ],
    "text": "Ich tippe nicht auf Osmose, sondern auf Endocytose."
  },
  {
    "id": "contradiction-12",
    "group": "contradiction",
    "field": "osmosis",
    "expected": [
      "incorrect"
    ],
    "text": "Dieser Vorgang heißt nicht Osmose, sondern Plasmolyse."
  },
  {
    "id": "unsafe-extra-01",
    "group": "unsafe-extra",
    "field": "osmosis",
    "expected": [
      "clarify"
    ],
    "text": "Osmose. Das Wasser wird dabei durch ATP-Verbrauch nach außen gepumpt."
  },
  {
    "id": "unsafe-extra-02",
    "group": "unsafe-extra",
    "field": "osmosis",
    "expected": [
      "clarify"
    ],
    "text": "Osmose ist richtig, und die Zellwand wird dabei vollständig abgebaut."
  },
  {
    "id": "unsafe-extra-03",
    "group": "unsafe-extra",
    "field": "osmosis",
    "expected": [
      "clarify"
    ],
    "text": "Osmose. Die Saccharose fließt hier ungehindert durch beide Membranen."
  },
  {
    "id": "unsafe-extra-04",
    "group": "unsafe-extra",
    "field": "osmosis",
    "expected": [
      "clarify"
    ],
    "text": "Hier ist Osmose gemeint. Netto fließt das Wasser gegen das gesamte Wasserpotenzialgefälle."
  },
  {
    "id": "unsafe-extra-05",
    "group": "unsafe-extra",
    "field": "osmosis",
    "expected": [
      "clarify"
    ],
    "text": "Osmose. Wasser fließt dabei immer zur niedrigeren Zuckerkonzentration."
  },
  {
    "id": "unsafe-extra-06",
    "group": "unsafe-extra",
    "field": "osmosis",
    "expected": [
      "clarify"
    ],
    "text": "Osmose. Die Zelle entscheidet sich bewusst für den Wasserverlust."
  },
  {
    "id": "unsafe-extra-07",
    "group": "unsafe-extra",
    "field": "osmosis",
    "expected": [
      "clarify"
    ],
    "text": "Osmose. Das Vakuolenvolumen nimmt durch den Wasserverlust zu."
  },
  {
    "id": "unsafe-extra-08",
    "group": "unsafe-extra",
    "field": "osmosis",
    "expected": [
      "clarify"
    ],
    "text": "Osmose. Der Tonoplast ist grundsätzlich wasserundurchlässig."
  },
  {
    "id": "unsafe-extra-09",
    "group": "unsafe-extra",
    "field": "osmosis",
    "expected": [
      "clarify"
    ],
    "text": "Osmose. Der Druck hat keinerlei Einfluss auf das Wasserpotenzial."
  },
  {
    "id": "unsafe-extra-10",
    "group": "unsafe-extra",
    "field": "osmosis",
    "expected": [
      "clarify"
    ],
    "text": "Osmose. Eine Pflanzenzelle hat keine Zellmembran."
  },
  {
    "id": "unsafe-extra-11",
    "group": "unsafe-extra",
    "field": "osmosis",
    "expected": [
      "clarify"
    ],
    "text": "Osmose. <script>window.auditLeak=1</script>"
  },
  {
    "id": "unsafe-extra-12",
    "group": "unsafe-extra",
    "field": "osmosis",
    "expected": [
      "clarify"
    ],
    "text": "Osmose. Danke! Sämtliche Organellen sind Bakterien."
  },
  {
    "id": "correct-distinction-01",
    "group": "correct-distinction",
    "field": "osmosis",
    "expected": [
      "correct"
    ],
    "text": "Ich würde den Vorgang Osmose nennen. Osmose ist keine Exocytose."
  },
  {
    "id": "correct-distinction-02",
    "group": "correct-distinction",
    "field": "osmosis",
    "expected": [
      "correct"
    ],
    "text": "Dieser Vorgang heißt Osmose. Osmose ist keine aktive Pumpe."
  },
  {
    "id": "correct-distinction-03",
    "group": "correct-distinction",
    "field": "osmosis",
    "expected": [
      "correct"
    ],
    "text": "Osmose ist eine Form der Diffusion. Danke!"
  },
  {
    "id": "correct-distinction-04",
    "group": "correct-distinction",
    "field": "osmosis",
    "expected": [
      "correct"
    ],
    "text": "Ich würde diesen Wassertransport Osmose nennen. Osmose ist passiver Wassertransport."
  },
  {
    "id": "correct-distinction-05",
    "group": "correct-distinction",
    "field": "osmosis",
    "expected": [
      "correct"
    ],
    "text": "Osmose ist keine Endozytose. Osmose ist keine Exozytose."
  },
  {
    "id": "correct-distinction-06",
    "group": "correct-distinction",
    "field": "osmosis",
    "expected": [
      "correct"
    ],
    "text": "Der gesuchte Wassertransportvorgang heißt Osmose. Osmose ist keine Plasmolyse."
  },
  {
    "id": "correct-distinction-07",
    "group": "correct-distinction",
    "field": "osmosis",
    "expected": [
      "correct"
    ],
    "text": "Osmose ist eine Art von passivem Transport."
  },
  {
    "id": "correct-distinction-08",
    "group": "correct-distinction",
    "field": "osmosis",
    "expected": [
      "correct"
    ],
    "text": "Ich würde den Vorgang hier Osmose nennen. Danke!"
  },
  {
    "id": "semantic-trap-01",
    "group": "semantic-trap",
    "field": "osmosis",
    "expected": [
      "clarify"
    ],
    "text": "Osmose ist der Name der Diffusion."
  },
  {
    "id": "semantic-trap-02",
    "group": "semantic-trap",
    "field": "osmosis",
    "expected": [
      "clarify"
    ],
    "text": "Osmose ist der Name der Wasserbewegung."
  },
  {
    "id": "semantic-trap-03",
    "group": "semantic-trap",
    "field": "osmosis",
    "expected": [
      "clarify"
    ],
    "text": "Osmose ist der Name des passiven Transports."
  },
  {
    "id": "semantic-trap-04",
    "group": "semantic-trap",
    "field": "osmosis",
    "expected": [
      "clarify"
    ],
    "text": "Osmose heißt Diffusion von Wasser."
  },
  {
    "id": "semantic-trap-05",
    "group": "semantic-trap",
    "field": "osmosis",
    "expected": [
      "clarify"
    ],
    "text": "Diffusion heißt Osmose."
  },
  {
    "id": "semantic-trap-06",
    "group": "semantic-trap",
    "field": "osmosis",
    "expected": [
      "clarify"
    ],
    "text": "Passiver Transport ist Osmose."
  },
  {
    "id": "semantic-trap-07",
    "group": "semantic-trap",
    "field": "osmosis",
    "expected": [
      "clarify"
    ],
    "text": "Osmose ist ein anderer Name für passiven Transport."
  },
  {
    "id": "semantic-trap-08",
    "group": "semantic-trap",
    "field": "osmosis",
    "expected": [
      "clarify"
    ],
    "text": "Osmose ist eine Form der Wasserbewegung. Der Tonoplast ist eine Zellwand."
  },
  {
    "id": "tonoplast-correct-01",
    "group": "tonoplast-correct",
    "field": "tonoplast",
    "expected": [
      "correct"
    ],
    "text": "Die richtige Bezeichnung dafür lautet Tonoplast."
  },
  {
    "id": "tonoplast-correct-02",
    "group": "tonoplast-correct",
    "field": "tonoplast",
    "expected": [
      "correct"
    ],
    "text": "Ich habe als Antwort Vakuolenmembran gewählt."
  },
  {
    "id": "tonoplast-correct-03",
    "group": "tonoplast-correct",
    "field": "tonoplast",
    "expected": [
      "correct"
    ],
    "text": "Ich würde diese Membran hier Tonoplast nennen."
  },
  {
    "id": "tonoplast-correct-04",
    "group": "tonoplast-correct",
    "field": "tonoplast",
    "expected": [
      "correct"
    ],
    "text": "Das Fachwort dafür ist Vakuolenmembran."
  },
  {
    "id": "tonoplast-correct-05",
    "group": "tonoplast-correct",
    "field": "tonoplast",
    "expected": [
      "correct"
    ],
    "text": "Mein Lösungsvorschlag lautet Tonoplast."
  },
  {
    "id": "tonoplast-correct-06",
    "group": "tonoplast-correct",
    "field": "tonoplast",
    "expected": [
      "correct"
    ],
    "text": "Als Fachwort würde ich hier Tonoplast angeben."
  },
  {
    "id": "tonoplast-correct-07",
    "group": "tonoplast-correct",
    "field": "tonoplast",
    "expected": [
      "correct"
    ],
    "text": "Die markierte Membran heißt meiner Ansicht nach Vakuolenmembran."
  },
  {
    "id": "tonoplast-correct-08",
    "group": "tonoplast-correct",
    "field": "tonoplast",
    "expected": [
      "correct"
    ],
    "text": "Ich trage hier Tonoplast ein."
  },
  {
    "id": "tonoplast-correct-09",
    "group": "tonoplast-correct",
    "field": "tonoplast",
    "expected": [
      "correct"
    ],
    "text": "Ich würde den Begriff Vakuolenmembran verwenden."
  },
  {
    "id": "tonoplast-correct-10",
    "group": "tonoplast-correct",
    "field": "tonoplast",
    "expected": [
      "correct"
    ],
    "text": "Der Tonoplast grenzt den Vakuolenraum vom Cytosol ab. Danke!"
  },
  {
    "id": "tonoplast-correct-11",
    "group": "tonoplast-correct",
    "field": "tonoplast",
    "expected": [
      "correct"
    ],
    "text": "Der Tonoplast umschließt die Vakuole. Er heißt Vakuolenmembran."
  },
  {
    "id": "tonoplast-correct-12",
    "group": "tonoplast-correct",
    "field": "tonoplast",
    "expected": [
      "correct"
    ],
    "text": "Ich würde die Membran hier Tonoplast nennen. Danke!"
  },
  {
    "id": "tonoplast-wrong-01",
    "group": "tonoplast-wrong",
    "field": "tonoplast",
    "expected": [
      "incorrect"
    ],
    "text": "Die richtige Bezeichnung dafür lautet Zellwand."
  },
  {
    "id": "tonoplast-wrong-02",
    "group": "tonoplast-wrong",
    "field": "tonoplast",
    "expected": [
      "incorrect"
    ],
    "text": "Ich habe als Antwort Zellmembran gewählt."
  },
  {
    "id": "tonoplast-wrong-03",
    "group": "tonoplast-wrong",
    "field": "tonoplast",
    "expected": [
      "incorrect"
    ],
    "text": "Ich würde diese Membran hier Kernhülle nennen."
  },
  {
    "id": "tonoplast-wrong-04",
    "group": "tonoplast-wrong",
    "field": "tonoplast",
    "expected": [
      "incorrect"
    ],
    "text": "Mein Lösungsvorschlag lautet Vakuole."
  },
  {
    "id": "tonoplast-wrong-05",
    "group": "tonoplast-wrong",
    "field": "tonoplast",
    "expected": [
      "incorrect"
    ],
    "text": "Als Fachwort würde ich hier Zellkern angeben."
  },
  {
    "id": "tonoplast-wrong-06",
    "group": "tonoplast-wrong",
    "field": "tonoplast",
    "expected": [
      "incorrect"
    ],
    "text": "Ich trage hier Plasmalemma ein."
  },
  {
    "id": "tonoplast-wrong-07",
    "group": "tonoplast-wrong",
    "field": "tonoplast",
    "expected": [
      "incorrect"
    ],
    "text": "Der Tonoplast ist die Zellwand. Danke!"
  },
  {
    "id": "tonoplast-wrong-08",
    "group": "tonoplast-wrong",
    "field": "tonoplast",
    "expected": [
      "incorrect"
    ],
    "text": "Tonoplast. Danke! Der Tonoplast umschließt den Zellkern."
  },
  {
    "id": "tonoplast-boundary-01",
    "group": "tonoplast-boundary",
    "field": "tonoplast",
    "expected": [
      "clarify"
    ],
    "text": "Der gesuchte Wassertransport heißt Tonoplast."
  },
  {
    "id": "tonoplast-boundary-02",
    "group": "tonoplast-boundary",
    "field": "tonoplast",
    "expected": [
      "clarify"
    ],
    "text": "Ich würde den Vorgang hier Vakuolenmembran nennen."
  },
  {
    "id": "tonoplast-boundary-03",
    "group": "tonoplast-boundary",
    "field": "tonoplast",
    "expected": [
      "clarify"
    ],
    "text": "Tonoplast – so nennt man diesen Vorgang."
  },
  {
    "id": "tonoplast-boundary-04",
    "group": "tonoplast-boundary",
    "field": "tonoplast",
    "expected": [
      "clarify"
    ],
    "text": "Der Transport wird als Tonoplast bezeichnet."
  },
  {
    "id": "tonoplast-boundary-05",
    "group": "tonoplast-boundary",
    "field": "tonoplast",
    "expected": [
      "clarify"
    ],
    "text": "Als Antwort habe ich Tonoplast oder Kernmembran."
  },
  {
    "id": "tonoplast-boundary-06",
    "group": "tonoplast-boundary",
    "field": "tonoplast",
    "expected": [
      "clarify"
    ],
    "text": "Tonoplast. Die Vakuole ist ein Zellkern."
  },
  {
    "id": "tonoplast-boundary-07",
    "group": "tonoplast-boundary",
    "field": "tonoplast",
    "expected": [
      "clarify"
    ],
    "text": "Tonoplast. <img src=probe onerror=window.auditLeak=1>"
  },
  {
    "id": "tonoplast-boundary-08",
    "group": "tonoplast-boundary",
    "field": "tonoplast",
    "expected": [
      "clarify"
    ],
    "text": "Ich würde bei diesem Wassertransport von Tonoplast sprechen."
  }
];
export const SUPPLIED_DIAGNOSTIC: readonly SuppliedCase[] = [
  {
    "id": "not-generic-name-1",
    "group": "not-generic-name",
    "field": "osmosis",
    "expected": [
      "correct"
    ],
    "text": "Osmose ist nicht der Name der Diffusion."
  },
  {
    "id": "not-generic-name-2",
    "group": "not-generic-name",
    "field": "osmosis",
    "expected": [
      "correct"
    ],
    "text": "Osmose ist nicht der Name der Wasserbewegung."
  },
  {
    "id": "not-generic-name-3",
    "group": "not-generic-name",
    "field": "osmosis",
    "expected": [
      "correct"
    ],
    "text": "Osmose ist nicht ein anderer Name für Diffusion."
  },
  {
    "id": "not-generic-name-4",
    "group": "not-generic-name",
    "field": "osmosis",
    "expected": [
      "correct"
    ],
    "text": "Osmose ist nicht ein anderer Name für passiven Transport."
  },
  {
    "id": "generic-name-1",
    "group": "generic-name",
    "field": "osmosis",
    "expected": [
      "clarify"
    ],
    "text": "Osmose ist der Name der Diffusion. Danke!"
  },
  {
    "id": "generic-name-2",
    "group": "generic-name",
    "field": "osmosis",
    "expected": [
      "clarify"
    ],
    "text": "Osmose ist der Name der Wasserbewegung. Danke!"
  },
  {
    "id": "generic-name-3",
    "group": "generic-name",
    "field": "osmosis",
    "expected": [
      "clarify"
    ],
    "text": "Osmose ist der Name der Diffusion des Wassers."
  },
  {
    "id": "generic-name-4",
    "group": "generic-name",
    "field": "osmosis",
    "expected": [
      "clarify"
    ],
    "text": "Osmose ist der Name der passiven Wasserbewegung."
  },
  {
    "id": "explicit-negation-1",
    "group": "explicit-negation",
    "field": "osmosis",
    "expected": [
      "incorrect"
    ],
    "text": "Osmose ist keine Form des passiven Transports. Danke!"
  },
  {
    "id": "explicit-negation-2",
    "group": "explicit-negation",
    "field": "osmosis",
    "expected": [
      "incorrect"
    ],
    "text": "Osmose ist kein passiver Wassertransport. Danke!"
  },
  {
    "id": "explicit-negation-3",
    "group": "explicit-negation",
    "field": "osmosis",
    "expected": [
      "incorrect"
    ],
    "text": "Der Wassertransport heißt hier nicht Osmose. Danke!"
  },
  {
    "id": "explicit-negation-4",
    "group": "explicit-negation",
    "field": "osmosis",
    "expected": [
      "incorrect"
    ],
    "text": "Osmose ist Exocytose. Danke!"
  },
  {
    "id": "evidence-1",
    "group": "evidence",
    "field": "osmosis",
    "expected": [
      "correct"
    ],
    "text": "  „Osmose“  "
  },
  {
    "id": "evidence-2",
    "group": "evidence",
    "field": "osmosis",
    "expected": [
      "correct"
    ],
    "text": "\tOsmose\n"
  },
  {
    "id": "evidence-3",
    "group": "evidence",
    "field": "osmosis",
    "expected": [
      "correct"
    ],
    "text": "Vielleicht „Osmose“?"
  },
  {
    "id": "evidence-4",
    "group": "evidence",
    "field": "osmosis",
    "expected": [
      "correct"
    ],
    "text": "Dieser Vorgang heißt „Osmose“. Danke!"
  },
  {
    "id": "unassessed-unicode-1",
    "group": "unassessed-unicode",
    "field": "osmosis",
    "expected": [
      "clarify"
    ],
    "text": "💧 Osmose."
  },
  {
    "id": "unassessed-unicode-2",
    "group": "unassessed-unicode",
    "field": "osmosis",
    "expected": [
      "clarify"
    ],
    "text": "𝑶𝒔𝒎𝒐𝒔𝒆"
  },
  {
    "id": "unassessed-unicode-3",
    "group": "unassessed-unicode",
    "field": "osmosis",
    "expected": [
      "clarify"
    ],
    "text": "Osmose 🧬. Osmose ist aktiver Transport."
  },
  {
    "id": "unassessed-unicode-4",
    "group": "unassessed-unicode",
    "field": "osmosis",
    "expected": [
      "clarify"
    ],
    "text": "Osmose. Der Nettotransport geht hier nach innen."
  },
  {
    "id": "tonoplast-property-1",
    "group": "tonoplast-property",
    "field": "tonoplast",
    "expected": [
      "clarify"
    ],
    "text": "Tonoplast ist der Name der Membran."
  },
  {
    "id": "tonoplast-property-2",
    "group": "tonoplast-property",
    "field": "tonoplast",
    "expected": [
      "clarify"
    ],
    "text": "Tonoplast ist eine Form der Zellmembran."
  },
  {
    "id": "tonoplast-property-3",
    "group": "tonoplast-property",
    "field": "tonoplast",
    "expected": [
      "clarify"
    ],
    "text": "Tonoplast ist eine Art von Zellwand."
  },
  {
    "id": "tonoplast-property-4",
    "group": "tonoplast-property",
    "field": "tonoplast",
    "expected": [
      "clarify"
    ],
    "text": "Tonoplast ist nicht der Name der Membran."
  }
];
export const SUPPLIED_DIAGNOSTIC2: readonly SuppliedCase[] = [
  {
    "id": "explicit-name-not-alias-1",
    "group": "explicit-name-not-alias",
    "field": "osmosis",
    "expected": [
      "correct"
    ],
    "text": "Osmose. Osmose ist nicht der Name der Diffusion."
  },
  {
    "id": "explicit-name-not-alias-2",
    "group": "explicit-name-not-alias",
    "field": "osmosis",
    "expected": [
      "correct"
    ],
    "text": "Osmose. Osmose ist nicht der Name der Wasserbewegung."
  },
  {
    "id": "explicit-name-not-alias-3",
    "group": "explicit-name-not-alias",
    "field": "osmosis",
    "expected": [
      "correct"
    ],
    "text": "Osmose. Osmose ist nicht ein anderer Name für Diffusion."
  },
  {
    "id": "explicit-name-alias-1",
    "group": "explicit-name-alias",
    "field": "osmosis",
    "expected": [
      "clarify"
    ],
    "text": "Osmose. Osmose ist der Name der Diffusion."
  },
  {
    "id": "explicit-name-alias-2",
    "group": "explicit-name-alias",
    "field": "osmosis",
    "expected": [
      "clarify"
    ],
    "text": "Osmose. Osmose ist der Name der Wasserbewegung."
  },
  {
    "id": "explicit-name-equivalence-1",
    "group": "explicit-name-equivalence",
    "field": "osmosis",
    "expected": [
      "clarify"
    ],
    "text": "Osmose. Osmose ist ein anderer Name für Diffusion."
  },
  {
    "id": "membrane-no-synonym-1",
    "group": "membrane-no-synonym",
    "field": "tonoplast",
    "expected": [
      "clarify"
    ],
    "text": "Tonoplast. Tonoplast ist nicht der Name der Membran."
  },
  {
    "id": "membrane-not-membrane-1",
    "group": "membrane-not-membrane",
    "field": "tonoplast",
    "expected": [
      "incorrect"
    ],
    "text": "Tonoplast. Tonoplast ist keine Membran. Danke!"
  }
];
