import type { R4Case } from './p02b-r4-cases.ts';
// Complementary field-transfer expectations fixed before evaluation.
export const R4_BOUNDARIES: readonly R4Case[] = [
  {
    "id": "r4-tone-1-1",
    "group": "tone-correct",
    "field": "tonoplast",
    "text": "Ich würde die gesuchte Grenze Tonoplast nennen.",
    "expected": [
      "correct"
    ]
  },
  {
    "id": "r4-tone-1-2",
    "group": "tone-incorrect",
    "field": "tonoplast",
    "text": "Ich würde die gesuchte Grenze Zellwand nennen.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r4-tone-1-3",
    "group": "tone-partial",
    "field": "tonoplast",
    "text": "Ich würde die gesuchte Grenze Membran nennen.",
    "expected": [
      "partial"
    ]
  },
  {
    "id": "r4-tone-1-4",
    "group": "tone-clarify",
    "field": "tonoplast",
    "text": "Ich würde die gesuchte Grenze Tonoplast oder Zellwand nennen.",
    "expected": [
      "clarify"
    ]
  },
  {
    "id": "r4-tone-1-5",
    "group": "tone-incorrect",
    "field": "tonoplast",
    "text": "Ich würde die gesuchte Grenze nicht Tonoplast nennen.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r4-tone-2-1",
    "group": "tone-correct",
    "field": "tonoplast",
    "text": "Für die Membran wäre mein Fachwort Tonoplast.",
    "expected": [
      "correct"
    ]
  },
  {
    "id": "r4-tone-2-2",
    "group": "tone-incorrect",
    "field": "tonoplast",
    "text": "Für die Membran wäre mein Fachwort Zellwand.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r4-tone-2-3",
    "group": "tone-partial",
    "field": "tonoplast",
    "text": "Für die Membran wäre mein Fachwort Membran.",
    "expected": [
      "partial"
    ]
  },
  {
    "id": "r4-tone-2-4",
    "group": "tone-clarify",
    "field": "tonoplast",
    "text": "Für die Membran wäre mein Fachwort Tonoplast oder Zellwand.",
    "expected": [
      "clarify"
    ]
  },
  {
    "id": "r4-tone-2-5",
    "group": "tone-incorrect",
    "field": "tonoplast",
    "text": "Für die Membran wäre mein Fachwort nicht Tonoplast.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r4-tone-3-1",
    "group": "tone-correct",
    "field": "tonoplast",
    "text": "Meine Benennung für die hervorgehobene Grenze lautet Tonoplast.",
    "expected": [
      "correct"
    ]
  },
  {
    "id": "r4-tone-3-2",
    "group": "tone-incorrect",
    "field": "tonoplast",
    "text": "Meine Benennung für die hervorgehobene Grenze lautet Zellwand.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r4-tone-3-3",
    "group": "tone-partial",
    "field": "tonoplast",
    "text": "Meine Benennung für die hervorgehobene Grenze lautet Membran.",
    "expected": [
      "partial"
    ]
  },
  {
    "id": "r4-tone-3-4",
    "group": "tone-clarify",
    "field": "tonoplast",
    "text": "Meine Benennung für die hervorgehobene Grenze lautet Tonoplast oder Zellwand.",
    "expected": [
      "clarify"
    ]
  },
  {
    "id": "r4-tone-3-5",
    "group": "tone-incorrect",
    "field": "tonoplast",
    "text": "Meine Benennung für die hervorgehobene Grenze lautet nicht Tonoplast.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r4-tone-4-1",
    "group": "tone-correct",
    "field": "tonoplast",
    "text": "Der Fachname, den ich dafür kenne, ist Tonoplast.",
    "expected": [
      "correct"
    ]
  },
  {
    "id": "r4-tone-4-2",
    "group": "tone-incorrect",
    "field": "tonoplast",
    "text": "Der Fachname, den ich dafür kenne, ist Zellwand.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r4-tone-4-3",
    "group": "tone-partial",
    "field": "tonoplast",
    "text": "Der Fachname, den ich dafür kenne, ist Membran.",
    "expected": [
      "partial"
    ]
  },
  {
    "id": "r4-tone-4-4",
    "group": "tone-clarify",
    "field": "tonoplast",
    "text": "Der Fachname, den ich dafür kenne, ist Tonoplast oder Zellwand.",
    "expected": [
      "clarify"
    ]
  },
  {
    "id": "r4-tone-4-5",
    "group": "tone-incorrect",
    "field": "tonoplast",
    "text": "Der Fachname, den ich dafür kenne, ist nicht Tonoplast.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r4-tone-5-1",
    "group": "tone-correct",
    "field": "tonoplast",
    "text": "Als Begriff fällt mir für diese Membran Tonoplast ein.",
    "expected": [
      "correct"
    ]
  },
  {
    "id": "r4-tone-5-2",
    "group": "tone-incorrect",
    "field": "tonoplast",
    "text": "Als Begriff fällt mir für diese Membran Zellwand ein.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r4-tone-5-3",
    "group": "tone-partial",
    "field": "tonoplast",
    "text": "Als Begriff fällt mir für diese Membran Membran ein.",
    "expected": [
      "partial"
    ]
  },
  {
    "id": "r4-tone-5-4",
    "group": "tone-clarify",
    "field": "tonoplast",
    "text": "Als Begriff fällt mir für diese Membran Tonoplast oder Zellwand ein.",
    "expected": [
      "clarify"
    ]
  },
  {
    "id": "r4-tone-5-5",
    "group": "tone-incorrect",
    "field": "tonoplast",
    "text": "Als Begriff fällt mir für diese Membran nicht Tonoplast ein.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r4-tone-6-1",
    "group": "tone-correct",
    "field": "tonoplast",
    "text": "Ich tippe beim Namen der Membran auf Tonoplast.",
    "expected": [
      "correct"
    ]
  },
  {
    "id": "r4-tone-6-2",
    "group": "tone-incorrect",
    "field": "tonoplast",
    "text": "Ich tippe beim Namen der Membran auf Zellwand.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r4-tone-6-3",
    "group": "tone-partial",
    "field": "tonoplast",
    "text": "Ich tippe beim Namen der Membran auf Membran.",
    "expected": [
      "partial"
    ]
  },
  {
    "id": "r4-tone-6-4",
    "group": "tone-clarify",
    "field": "tonoplast",
    "text": "Ich tippe beim Namen der Membran auf Tonoplast oder Zellwand.",
    "expected": [
      "clarify"
    ]
  },
  {
    "id": "r4-tone-6-5",
    "group": "tone-incorrect",
    "field": "tonoplast",
    "text": "Ich tippe beim Namen der Membran auf nicht Tonoplast.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r4-tone-7-1",
    "group": "tone-correct",
    "field": "tonoplast",
    "text": "Soweit ich weiß, nennt man diese Grenze Tonoplast.",
    "expected": [
      "correct"
    ]
  },
  {
    "id": "r4-tone-7-2",
    "group": "tone-incorrect",
    "field": "tonoplast",
    "text": "Soweit ich weiß, nennt man diese Grenze Zellwand.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r4-tone-7-3",
    "group": "tone-partial",
    "field": "tonoplast",
    "text": "Soweit ich weiß, nennt man diese Grenze Membran.",
    "expected": [
      "partial"
    ]
  },
  {
    "id": "r4-tone-7-4",
    "group": "tone-clarify",
    "field": "tonoplast",
    "text": "Soweit ich weiß, nennt man diese Grenze Tonoplast oder Zellwand.",
    "expected": [
      "clarify"
    ]
  },
  {
    "id": "r4-tone-7-5",
    "group": "tone-incorrect",
    "field": "tonoplast",
    "text": "Soweit ich weiß, nennt man diese Grenze nicht Tonoplast.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r4-tone-8-1",
    "group": "tone-correct",
    "field": "tonoplast",
    "text": "Die gesuchte Membran würde ich als Tonoplast bezeichnen.",
    "expected": [
      "correct"
    ]
  },
  {
    "id": "r4-tone-8-2",
    "group": "tone-incorrect",
    "field": "tonoplast",
    "text": "Die gesuchte Membran würde ich als Zellwand bezeichnen.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r4-tone-8-3",
    "group": "tone-partial",
    "field": "tonoplast",
    "text": "Die gesuchte Membran würde ich als Membran bezeichnen.",
    "expected": [
      "partial"
    ]
  },
  {
    "id": "r4-tone-8-4",
    "group": "tone-clarify",
    "field": "tonoplast",
    "text": "Die gesuchte Membran würde ich als Tonoplast oder Zellwand bezeichnen.",
    "expected": [
      "clarify"
    ]
  },
  {
    "id": "r4-tone-8-5",
    "group": "tone-incorrect",
    "field": "tonoplast",
    "text": "Die gesuchte Membran würde ich als nicht Tonoplast bezeichnen.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r4-tone-9-1",
    "group": "tone-correct",
    "field": "tonoplast",
    "text": "Ich schreibe als Namen für die Grenze Tonoplast hin.",
    "expected": [
      "correct"
    ]
  },
  {
    "id": "r4-tone-9-2",
    "group": "tone-incorrect",
    "field": "tonoplast",
    "text": "Ich schreibe als Namen für die Grenze Zellwand hin.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r4-tone-9-3",
    "group": "tone-partial",
    "field": "tonoplast",
    "text": "Ich schreibe als Namen für die Grenze Membran hin.",
    "expected": [
      "partial"
    ]
  },
  {
    "id": "r4-tone-9-4",
    "group": "tone-clarify",
    "field": "tonoplast",
    "text": "Ich schreibe als Namen für die Grenze Tonoplast oder Zellwand hin.",
    "expected": [
      "clarify"
    ]
  },
  {
    "id": "r4-tone-9-5",
    "group": "tone-incorrect",
    "field": "tonoplast",
    "text": "Ich schreibe als Namen für die Grenze nicht Tonoplast hin.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r4-tone-10-1",
    "group": "tone-correct",
    "field": "tonoplast",
    "text": "Mit dem Fachwort Tonoplast würde ich die Frage beantworten.",
    "expected": [
      "correct"
    ]
  },
  {
    "id": "r4-tone-10-2",
    "group": "tone-incorrect",
    "field": "tonoplast",
    "text": "Mit dem Fachwort Zellwand würde ich die Frage beantworten.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r4-tone-10-3",
    "group": "tone-partial",
    "field": "tonoplast",
    "text": "Mit dem Fachwort Membran würde ich die Frage beantworten.",
    "expected": [
      "partial"
    ]
  },
  {
    "id": "r4-tone-10-4",
    "group": "tone-clarify",
    "field": "tonoplast",
    "text": "Mit dem Fachwort Tonoplast oder Zellwand würde ich die Frage beantworten.",
    "expected": [
      "clarify"
    ]
  },
  {
    "id": "r4-tone-10-5",
    "group": "tone-incorrect",
    "field": "tonoplast",
    "text": "Mit dem Fachwort nicht Tonoplast würde ich die Frage beantworten.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r4-tone-11-1",
    "group": "tone-correct",
    "field": "tonoplast",
    "text": "Ich würde in dieses Namensfeld das Wort Tonoplast setzen.",
    "expected": [
      "correct"
    ]
  },
  {
    "id": "r4-tone-11-2",
    "group": "tone-incorrect",
    "field": "tonoplast",
    "text": "Ich würde in dieses Namensfeld das Wort Zellwand setzen.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r4-tone-11-3",
    "group": "tone-partial",
    "field": "tonoplast",
    "text": "Ich würde in dieses Namensfeld das Wort Membran setzen.",
    "expected": [
      "partial"
    ]
  },
  {
    "id": "r4-tone-11-4",
    "group": "tone-clarify",
    "field": "tonoplast",
    "text": "Ich würde in dieses Namensfeld das Wort Tonoplast oder Zellwand setzen.",
    "expected": [
      "clarify"
    ]
  },
  {
    "id": "r4-tone-11-5",
    "group": "tone-incorrect",
    "field": "tonoplast",
    "text": "Ich würde in dieses Namensfeld das Wort nicht Tonoplast setzen.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r4-tone-12-1",
    "group": "tone-correct",
    "field": "tonoplast",
    "text": "Als meinen kurzen Vorschlag würde ich hier Tonoplast hinschreiben.",
    "expected": [
      "correct"
    ]
  },
  {
    "id": "r4-tone-12-2",
    "group": "tone-incorrect",
    "field": "tonoplast",
    "text": "Als meinen kurzen Vorschlag würde ich hier Zellwand hinschreiben.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r4-tone-12-3",
    "group": "tone-partial",
    "field": "tonoplast",
    "text": "Als meinen kurzen Vorschlag würde ich hier Membran hinschreiben.",
    "expected": [
      "partial"
    ]
  },
  {
    "id": "r4-tone-12-4",
    "group": "tone-clarify",
    "field": "tonoplast",
    "text": "Als meinen kurzen Vorschlag würde ich hier Tonoplast oder Zellwand hinschreiben.",
    "expected": [
      "clarify"
    ]
  },
  {
    "id": "r4-tone-12-5",
    "group": "tone-incorrect",
    "field": "tonoplast",
    "text": "Als meinen kurzen Vorschlag würde ich hier nicht Tonoplast hinschreiben.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r4-tone-13-1",
    "group": "tone-correct",
    "field": "tonoplast",
    "text": "Ich lege mich beim gesuchten Namen auf Tonoplast fest.",
    "expected": [
      "correct"
    ]
  },
  {
    "id": "r4-tone-13-2",
    "group": "tone-incorrect",
    "field": "tonoplast",
    "text": "Ich lege mich beim gesuchten Namen auf Zellwand fest.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r4-tone-13-3",
    "group": "tone-partial",
    "field": "tonoplast",
    "text": "Ich lege mich beim gesuchten Namen auf Membran fest.",
    "expected": [
      "partial"
    ]
  },
  {
    "id": "r4-tone-13-4",
    "group": "tone-clarify",
    "field": "tonoplast",
    "text": "Ich lege mich beim gesuchten Namen auf Tonoplast oder Zellwand fest.",
    "expected": [
      "clarify"
    ]
  },
  {
    "id": "r4-tone-13-5",
    "group": "tone-incorrect",
    "field": "tonoplast",
    "text": "Ich lege mich beim gesuchten Namen auf nicht Tonoplast fest.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r4-tone-14-1",
    "group": "tone-correct",
    "field": "tonoplast",
    "text": "Ich würde auf die Benennungsfrage mit dem Fachwort Tonoplast antworten.",
    "expected": [
      "correct"
    ]
  },
  {
    "id": "r4-tone-14-2",
    "group": "tone-incorrect",
    "field": "tonoplast",
    "text": "Ich würde auf die Benennungsfrage mit dem Fachwort Zellwand antworten.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r4-tone-14-3",
    "group": "tone-partial",
    "field": "tonoplast",
    "text": "Ich würde auf die Benennungsfrage mit dem Fachwort Membran antworten.",
    "expected": [
      "partial"
    ]
  },
  {
    "id": "r4-tone-14-4",
    "group": "tone-clarify",
    "field": "tonoplast",
    "text": "Ich würde auf die Benennungsfrage mit dem Fachwort Tonoplast oder Zellwand antworten.",
    "expected": [
      "clarify"
    ]
  },
  {
    "id": "r4-tone-14-5",
    "group": "tone-incorrect",
    "field": "tonoplast",
    "text": "Ich würde auf die Benennungsfrage mit dem Fachwort nicht Tonoplast antworten.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r4-tone-15-1",
    "group": "tone-correct",
    "field": "tonoplast",
    "text": "In das Antwortfeld schreibe ich hier das Wort Tonoplast.",
    "expected": [
      "correct"
    ]
  },
  {
    "id": "r4-tone-15-2",
    "group": "tone-incorrect",
    "field": "tonoplast",
    "text": "In das Antwortfeld schreibe ich hier das Wort Zellwand.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r4-tone-15-3",
    "group": "tone-partial",
    "field": "tonoplast",
    "text": "In das Antwortfeld schreibe ich hier das Wort Membran.",
    "expected": [
      "partial"
    ]
  },
  {
    "id": "r4-tone-15-4",
    "group": "tone-clarify",
    "field": "tonoplast",
    "text": "In das Antwortfeld schreibe ich hier das Wort Tonoplast oder Zellwand.",
    "expected": [
      "clarify"
    ]
  },
  {
    "id": "r4-tone-15-5",
    "group": "tone-incorrect",
    "field": "tonoplast",
    "text": "In das Antwortfeld schreibe ich hier das Wort nicht Tonoplast.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r4-tone-16-1",
    "group": "tone-correct",
    "field": "tonoplast",
    "text": "Ich habe für diese Namensfrage Tonoplast im Kopf.",
    "expected": [
      "correct"
    ]
  },
  {
    "id": "r4-tone-16-2",
    "group": "tone-incorrect",
    "field": "tonoplast",
    "text": "Ich habe für diese Namensfrage Zellwand im Kopf.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r4-tone-16-3",
    "group": "tone-partial",
    "field": "tonoplast",
    "text": "Ich habe für diese Namensfrage Membran im Kopf.",
    "expected": [
      "partial"
    ]
  },
  {
    "id": "r4-tone-16-4",
    "group": "tone-clarify",
    "field": "tonoplast",
    "text": "Ich habe für diese Namensfrage Tonoplast oder Zellwand im Kopf.",
    "expected": [
      "clarify"
    ]
  },
  {
    "id": "r4-tone-16-5",
    "group": "tone-incorrect",
    "field": "tonoplast",
    "text": "Ich habe für diese Namensfrage nicht Tonoplast im Kopf.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r4-tone-17-1",
    "group": "tone-correct",
    "field": "tonoplast",
    "text": "Ich bin beim Begriff noch unsicher: Tonoplast.",
    "expected": [
      "correct"
    ]
  },
  {
    "id": "r4-tone-17-2",
    "group": "tone-incorrect",
    "field": "tonoplast",
    "text": "Ich bin beim Begriff noch unsicher: Zellwand.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r4-tone-17-3",
    "group": "tone-partial",
    "field": "tonoplast",
    "text": "Ich bin beim Begriff noch unsicher: Membran.",
    "expected": [
      "partial"
    ]
  },
  {
    "id": "r4-tone-17-4",
    "group": "tone-clarify",
    "field": "tonoplast",
    "text": "Ich bin beim Begriff noch unsicher: Tonoplast oder Zellwand.",
    "expected": [
      "clarify"
    ]
  },
  {
    "id": "r4-tone-17-5",
    "group": "tone-incorrect",
    "field": "tonoplast",
    "text": "Ich bin beim Begriff noch unsicher: nicht Tonoplast.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r4-tone-18-1",
    "group": "tone-correct",
    "field": "tonoplast",
    "text": "Mein Vorschlag für die kurze Antwort lautet wohl Tonoplast.",
    "expected": [
      "correct"
    ]
  },
  {
    "id": "r4-tone-18-2",
    "group": "tone-incorrect",
    "field": "tonoplast",
    "text": "Mein Vorschlag für die kurze Antwort lautet wohl Zellwand.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r4-tone-18-3",
    "group": "tone-partial",
    "field": "tonoplast",
    "text": "Mein Vorschlag für die kurze Antwort lautet wohl Membran.",
    "expected": [
      "partial"
    ]
  },
  {
    "id": "r4-tone-18-4",
    "group": "tone-clarify",
    "field": "tonoplast",
    "text": "Mein Vorschlag für die kurze Antwort lautet wohl Tonoplast oder Zellwand.",
    "expected": [
      "clarify"
    ]
  },
  {
    "id": "r4-tone-18-5",
    "group": "tone-incorrect",
    "field": "tonoplast",
    "text": "Mein Vorschlag für die kurze Antwort lautet wohl nicht Tonoplast.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r4-tone-19-1",
    "group": "tone-correct",
    "field": "tonoplast",
    "text": "Ich würde mich bei dieser Teilfrage auf Tonoplast festlegen.",
    "expected": [
      "correct"
    ]
  },
  {
    "id": "r4-tone-19-2",
    "group": "tone-incorrect",
    "field": "tonoplast",
    "text": "Ich würde mich bei dieser Teilfrage auf Zellwand festlegen.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r4-tone-19-3",
    "group": "tone-partial",
    "field": "tonoplast",
    "text": "Ich würde mich bei dieser Teilfrage auf Membran festlegen.",
    "expected": [
      "partial"
    ]
  },
  {
    "id": "r4-tone-19-4",
    "group": "tone-clarify",
    "field": "tonoplast",
    "text": "Ich würde mich bei dieser Teilfrage auf Tonoplast oder Zellwand festlegen.",
    "expected": [
      "clarify"
    ]
  },
  {
    "id": "r4-tone-19-5",
    "group": "tone-incorrect",
    "field": "tonoplast",
    "text": "Ich würde mich bei dieser Teilfrage auf nicht Tonoplast festlegen.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r4-tone-20-1",
    "group": "tone-correct",
    "field": "tonoplast",
    "text": "Tonoplast nehme ich hier als meine Bezeichnung.",
    "expected": [
      "correct"
    ]
  },
  {
    "id": "r4-tone-20-2",
    "group": "tone-incorrect",
    "field": "tonoplast",
    "text": "Zellwand nehme ich hier als meine Bezeichnung.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r4-tone-20-3",
    "group": "tone-partial",
    "field": "tonoplast",
    "text": "Membran nehme ich hier als meine Bezeichnung.",
    "expected": [
      "partial"
    ]
  },
  {
    "id": "r4-tone-20-4",
    "group": "tone-clarify",
    "field": "tonoplast",
    "text": "Tonoplast oder Zellwand nehme ich hier als meine Bezeichnung.",
    "expected": [
      "clarify"
    ]
  },
  {
    "id": "r4-tone-20-5",
    "group": "tone-incorrect",
    "field": "tonoplast",
    "text": "nicht Tonoplast nehme ich hier als meine Bezeichnung.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r4-tone-21-1",
    "group": "tone-correct",
    "field": "tonoplast",
    "text": "Tonoplast ist für mich der passende Fachausdruck.",
    "expected": [
      "correct"
    ]
  },
  {
    "id": "r4-tone-21-2",
    "group": "tone-incorrect",
    "field": "tonoplast",
    "text": "Zellwand ist für mich der passende Fachausdruck.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r4-tone-21-3",
    "group": "tone-partial",
    "field": "tonoplast",
    "text": "Membran ist für mich der passende Fachausdruck.",
    "expected": [
      "partial"
    ]
  },
  {
    "id": "r4-tone-21-4",
    "group": "tone-clarify",
    "field": "tonoplast",
    "text": "Tonoplast oder Zellwand ist für mich der passende Fachausdruck.",
    "expected": [
      "clarify"
    ]
  },
  {
    "id": "r4-tone-21-5",
    "group": "tone-incorrect",
    "field": "tonoplast",
    "text": "nicht Tonoplast ist für mich der passende Fachausdruck.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r4-tone-22-1",
    "group": "tone-correct",
    "field": "tonoplast",
    "text": "Ich würde in das Feld für die Benennung Tonoplast eintragen.",
    "expected": [
      "correct"
    ]
  },
  {
    "id": "r4-tone-22-2",
    "group": "tone-incorrect",
    "field": "tonoplast",
    "text": "Ich würde in das Feld für die Benennung Zellwand eintragen.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r4-tone-22-3",
    "group": "tone-partial",
    "field": "tonoplast",
    "text": "Ich würde in das Feld für die Benennung Membran eintragen.",
    "expected": [
      "partial"
    ]
  },
  {
    "id": "r4-tone-22-4",
    "group": "tone-clarify",
    "field": "tonoplast",
    "text": "Ich würde in das Feld für die Benennung Tonoplast oder Zellwand eintragen.",
    "expected": [
      "clarify"
    ]
  },
  {
    "id": "r4-tone-22-5",
    "group": "tone-incorrect",
    "field": "tonoplast",
    "text": "Ich würde in das Feld für die Benennung nicht Tonoplast eintragen.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r4-tone-23-1",
    "group": "tone-correct",
    "field": "tonoplast",
    "text": "Ich antworte bei dieser Benennungsfrage mit dem Wort Tonoplast.",
    "expected": [
      "correct"
    ]
  },
  {
    "id": "r4-tone-23-2",
    "group": "tone-incorrect",
    "field": "tonoplast",
    "text": "Ich antworte bei dieser Benennungsfrage mit dem Wort Zellwand.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r4-tone-23-3",
    "group": "tone-partial",
    "field": "tonoplast",
    "text": "Ich antworte bei dieser Benennungsfrage mit dem Wort Membran.",
    "expected": [
      "partial"
    ]
  },
  {
    "id": "r4-tone-23-4",
    "group": "tone-clarify",
    "field": "tonoplast",
    "text": "Ich antworte bei dieser Benennungsfrage mit dem Wort Tonoplast oder Zellwand.",
    "expected": [
      "clarify"
    ]
  },
  {
    "id": "r4-tone-23-5",
    "group": "tone-incorrect",
    "field": "tonoplast",
    "text": "Ich antworte bei dieser Benennungsfrage mit dem Wort nicht Tonoplast.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r4-tone-24-1",
    "group": "tone-correct",
    "field": "tonoplast",
    "text": "Ich würde die gesuchte Benennung Tonoplast wählen.",
    "expected": [
      "correct"
    ]
  },
  {
    "id": "r4-tone-24-2",
    "group": "tone-incorrect",
    "field": "tonoplast",
    "text": "Ich würde die gesuchte Benennung Zellwand wählen.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r4-tone-24-3",
    "group": "tone-partial",
    "field": "tonoplast",
    "text": "Ich würde die gesuchte Benennung Membran wählen.",
    "expected": [
      "partial"
    ]
  },
  {
    "id": "r4-tone-24-4",
    "group": "tone-clarify",
    "field": "tonoplast",
    "text": "Ich würde die gesuchte Benennung Tonoplast oder Zellwand wählen.",
    "expected": [
      "clarify"
    ]
  },
  {
    "id": "r4-tone-24-5",
    "group": "tone-incorrect",
    "field": "tonoplast",
    "text": "Ich würde die gesuchte Benennung nicht Tonoplast wählen.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r4-tone-25-1",
    "group": "tone-correct",
    "field": "tonoplast",
    "text": "Ich habe hier den Fachausdruck Tonoplast als Vorschlag.",
    "expected": [
      "correct"
    ]
  },
  {
    "id": "r4-tone-25-2",
    "group": "tone-incorrect",
    "field": "tonoplast",
    "text": "Ich habe hier den Fachausdruck Zellwand als Vorschlag.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r4-tone-25-3",
    "group": "tone-partial",
    "field": "tonoplast",
    "text": "Ich habe hier den Fachausdruck Membran als Vorschlag.",
    "expected": [
      "partial"
    ]
  },
  {
    "id": "r4-tone-25-4",
    "group": "tone-clarify",
    "field": "tonoplast",
    "text": "Ich habe hier den Fachausdruck Tonoplast oder Zellwand als Vorschlag.",
    "expected": [
      "clarify"
    ]
  },
  {
    "id": "r4-tone-25-5",
    "group": "tone-incorrect",
    "field": "tonoplast",
    "text": "Ich habe hier den Fachausdruck nicht Tonoplast als Vorschlag.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r4-tone-26-1",
    "group": "tone-correct",
    "field": "tonoplast",
    "text": "Meine Angabe für diese Frage ist das Wort Tonoplast.",
    "expected": [
      "correct"
    ]
  },
  {
    "id": "r4-tone-26-2",
    "group": "tone-incorrect",
    "field": "tonoplast",
    "text": "Meine Angabe für diese Frage ist das Wort Zellwand.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r4-tone-26-3",
    "group": "tone-partial",
    "field": "tonoplast",
    "text": "Meine Angabe für diese Frage ist das Wort Membran.",
    "expected": [
      "partial"
    ]
  },
  {
    "id": "r4-tone-26-4",
    "group": "tone-clarify",
    "field": "tonoplast",
    "text": "Meine Angabe für diese Frage ist das Wort Tonoplast oder Zellwand.",
    "expected": [
      "clarify"
    ]
  },
  {
    "id": "r4-tone-26-5",
    "group": "tone-incorrect",
    "field": "tonoplast",
    "text": "Meine Angabe für diese Frage ist das Wort nicht Tonoplast.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r4-tone-27-1",
    "group": "tone-correct",
    "field": "tonoplast",
    "text": "Ich würde bei der Antwort schlicht Tonoplast angeben.",
    "expected": [
      "correct"
    ]
  },
  {
    "id": "r4-tone-27-2",
    "group": "tone-incorrect",
    "field": "tonoplast",
    "text": "Ich würde bei der Antwort schlicht Zellwand angeben.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r4-tone-27-3",
    "group": "tone-partial",
    "field": "tonoplast",
    "text": "Ich würde bei der Antwort schlicht Membran angeben.",
    "expected": [
      "partial"
    ]
  },
  {
    "id": "r4-tone-27-4",
    "group": "tone-clarify",
    "field": "tonoplast",
    "text": "Ich würde bei der Antwort schlicht Tonoplast oder Zellwand angeben.",
    "expected": [
      "clarify"
    ]
  },
  {
    "id": "r4-tone-27-5",
    "group": "tone-incorrect",
    "field": "tonoplast",
    "text": "Ich würde bei der Antwort schlicht nicht Tonoplast angeben.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r4-tone-28-1",
    "group": "tone-correct",
    "field": "tonoplast",
    "text": "Ich tippe bei dieser Frage auf den Begriff Tonoplast.",
    "expected": [
      "correct"
    ]
  },
  {
    "id": "r4-tone-28-2",
    "group": "tone-incorrect",
    "field": "tonoplast",
    "text": "Ich tippe bei dieser Frage auf den Begriff Zellwand.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r4-tone-28-3",
    "group": "tone-partial",
    "field": "tonoplast",
    "text": "Ich tippe bei dieser Frage auf den Begriff Membran.",
    "expected": [
      "partial"
    ]
  },
  {
    "id": "r4-tone-28-4",
    "group": "tone-clarify",
    "field": "tonoplast",
    "text": "Ich tippe bei dieser Frage auf den Begriff Tonoplast oder Zellwand.",
    "expected": [
      "clarify"
    ]
  },
  {
    "id": "r4-tone-28-5",
    "group": "tone-incorrect",
    "field": "tonoplast",
    "text": "Ich tippe bei dieser Frage auf den Begriff nicht Tonoplast.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r4-tone-29-1",
    "group": "tone-correct",
    "field": "tonoplast",
    "text": "Bei dem gesuchten Fachnamen bleibe ich bei Tonoplast.",
    "expected": [
      "correct"
    ]
  },
  {
    "id": "r4-tone-29-2",
    "group": "tone-incorrect",
    "field": "tonoplast",
    "text": "Bei dem gesuchten Fachnamen bleibe ich bei Zellwand.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r4-tone-29-3",
    "group": "tone-partial",
    "field": "tonoplast",
    "text": "Bei dem gesuchten Fachnamen bleibe ich bei Membran.",
    "expected": [
      "partial"
    ]
  },
  {
    "id": "r4-tone-29-4",
    "group": "tone-clarify",
    "field": "tonoplast",
    "text": "Bei dem gesuchten Fachnamen bleibe ich bei Tonoplast oder Zellwand.",
    "expected": [
      "clarify"
    ]
  },
  {
    "id": "r4-tone-29-5",
    "group": "tone-incorrect",
    "field": "tonoplast",
    "text": "Bei dem gesuchten Fachnamen bleibe ich bei nicht Tonoplast.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r4-tone-30-1",
    "group": "tone-correct",
    "field": "tonoplast",
    "text": "In dieses Feld käme für mich der Name Tonoplast.",
    "expected": [
      "correct"
    ]
  },
  {
    "id": "r4-tone-30-2",
    "group": "tone-incorrect",
    "field": "tonoplast",
    "text": "In dieses Feld käme für mich der Name Zellwand.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r4-tone-30-3",
    "group": "tone-partial",
    "field": "tonoplast",
    "text": "In dieses Feld käme für mich der Name Membran.",
    "expected": [
      "partial"
    ]
  },
  {
    "id": "r4-tone-30-4",
    "group": "tone-clarify",
    "field": "tonoplast",
    "text": "In dieses Feld käme für mich der Name Tonoplast oder Zellwand.",
    "expected": [
      "clarify"
    ]
  },
  {
    "id": "r4-tone-30-5",
    "group": "tone-incorrect",
    "field": "tonoplast",
    "text": "In dieses Feld käme für mich der Name nicht Tonoplast.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r4-tone-31-1",
    "group": "tone-correct",
    "field": "tonoplast",
    "text": "Ich meine bei dieser Namensfrage den Begriff Tonoplast.",
    "expected": [
      "correct"
    ]
  },
  {
    "id": "r4-tone-31-2",
    "group": "tone-incorrect",
    "field": "tonoplast",
    "text": "Ich meine bei dieser Namensfrage den Begriff Zellwand.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r4-tone-31-3",
    "group": "tone-partial",
    "field": "tonoplast",
    "text": "Ich meine bei dieser Namensfrage den Begriff Membran.",
    "expected": [
      "partial"
    ]
  },
  {
    "id": "r4-tone-31-4",
    "group": "tone-clarify",
    "field": "tonoplast",
    "text": "Ich meine bei dieser Namensfrage den Begriff Tonoplast oder Zellwand.",
    "expected": [
      "clarify"
    ]
  },
  {
    "id": "r4-tone-31-5",
    "group": "tone-incorrect",
    "field": "tonoplast",
    "text": "Ich meine bei dieser Namensfrage den Begriff nicht Tonoplast.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r4-tone-32-1",
    "group": "tone-correct",
    "field": "tonoplast",
    "text": "Ich würde mich hier für das Fachwort Tonoplast entscheiden.",
    "expected": [
      "correct"
    ]
  },
  {
    "id": "r4-tone-32-2",
    "group": "tone-incorrect",
    "field": "tonoplast",
    "text": "Ich würde mich hier für das Fachwort Zellwand entscheiden.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r4-tone-32-3",
    "group": "tone-partial",
    "field": "tonoplast",
    "text": "Ich würde mich hier für das Fachwort Membran entscheiden.",
    "expected": [
      "partial"
    ]
  },
  {
    "id": "r4-tone-32-4",
    "group": "tone-clarify",
    "field": "tonoplast",
    "text": "Ich würde mich hier für das Fachwort Tonoplast oder Zellwand entscheiden.",
    "expected": [
      "clarify"
    ]
  },
  {
    "id": "r4-tone-32-5",
    "group": "tone-incorrect",
    "field": "tonoplast",
    "text": "Ich würde mich hier für das Fachwort nicht Tonoplast entscheiden.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r4-tone-33-1",
    "group": "tone-correct",
    "field": "tonoplast",
    "text": "Das Ganze ist mit Tonoplast passend benannt.",
    "expected": [
      "correct"
    ]
  },
  {
    "id": "r4-tone-33-2",
    "group": "tone-incorrect",
    "field": "tonoplast",
    "text": "Das Ganze ist mit Zellwand passend benannt.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r4-tone-33-3",
    "group": "tone-partial",
    "field": "tonoplast",
    "text": "Das Ganze ist mit Membran passend benannt.",
    "expected": [
      "partial"
    ]
  },
  {
    "id": "r4-tone-33-4",
    "group": "tone-clarify",
    "field": "tonoplast",
    "text": "Das Ganze ist mit Tonoplast oder Zellwand passend benannt.",
    "expected": [
      "clarify"
    ]
  },
  {
    "id": "r4-tone-33-5",
    "group": "tone-incorrect",
    "field": "tonoplast",
    "text": "Das Ganze ist mit nicht Tonoplast passend benannt.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r4-tone-34-1",
    "group": "tone-correct",
    "field": "tonoplast",
    "text": "Für die Benennungsfrage habe ich den Namen Tonoplast im Kopf.",
    "expected": [
      "correct"
    ]
  },
  {
    "id": "r4-tone-34-2",
    "group": "tone-incorrect",
    "field": "tonoplast",
    "text": "Für die Benennungsfrage habe ich den Namen Zellwand im Kopf.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r4-tone-34-3",
    "group": "tone-partial",
    "field": "tonoplast",
    "text": "Für die Benennungsfrage habe ich den Namen Membran im Kopf.",
    "expected": [
      "partial"
    ]
  },
  {
    "id": "r4-tone-34-4",
    "group": "tone-clarify",
    "field": "tonoplast",
    "text": "Für die Benennungsfrage habe ich den Namen Tonoplast oder Zellwand im Kopf.",
    "expected": [
      "clarify"
    ]
  },
  {
    "id": "r4-tone-34-5",
    "group": "tone-incorrect",
    "field": "tonoplast",
    "text": "Für die Benennungsfrage habe ich den Namen nicht Tonoplast im Kopf.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r4-tone-35-1",
    "group": "tone-correct",
    "field": "tonoplast",
    "text": "Mein Fachausdruck zur Benennung wäre hier Tonoplast.",
    "expected": [
      "correct"
    ]
  },
  {
    "id": "r4-tone-35-2",
    "group": "tone-incorrect",
    "field": "tonoplast",
    "text": "Mein Fachausdruck zur Benennung wäre hier Zellwand.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r4-tone-35-3",
    "group": "tone-partial",
    "field": "tonoplast",
    "text": "Mein Fachausdruck zur Benennung wäre hier Membran.",
    "expected": [
      "partial"
    ]
  },
  {
    "id": "r4-tone-35-4",
    "group": "tone-clarify",
    "field": "tonoplast",
    "text": "Mein Fachausdruck zur Benennung wäre hier Tonoplast oder Zellwand.",
    "expected": [
      "clarify"
    ]
  },
  {
    "id": "r4-tone-35-5",
    "group": "tone-incorrect",
    "field": "tonoplast",
    "text": "Mein Fachausdruck zur Benennung wäre hier nicht Tonoplast.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r4-tone-36-1",
    "group": "tone-correct",
    "field": "tonoplast",
    "text": "Tonoplast würde ich als meine kurze Antwort notieren.",
    "expected": [
      "correct"
    ]
  },
  {
    "id": "r4-tone-36-2",
    "group": "tone-incorrect",
    "field": "tonoplast",
    "text": "Zellwand würde ich als meine kurze Antwort notieren.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r4-tone-36-3",
    "group": "tone-partial",
    "field": "tonoplast",
    "text": "Membran würde ich als meine kurze Antwort notieren.",
    "expected": [
      "partial"
    ]
  },
  {
    "id": "r4-tone-36-4",
    "group": "tone-clarify",
    "field": "tonoplast",
    "text": "Tonoplast oder Zellwand würde ich als meine kurze Antwort notieren.",
    "expected": [
      "clarify"
    ]
  },
  {
    "id": "r4-tone-36-5",
    "group": "tone-incorrect",
    "field": "tonoplast",
    "text": "nicht Tonoplast würde ich als meine kurze Antwort notieren.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r4-tone-37-1",
    "group": "tone-correct",
    "field": "tonoplast",
    "text": "Ich könnte für die Namensfrage Tonoplast schreiben.",
    "expected": [
      "correct"
    ]
  },
  {
    "id": "r4-tone-37-2",
    "group": "tone-incorrect",
    "field": "tonoplast",
    "text": "Ich könnte für die Namensfrage Zellwand schreiben.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r4-tone-37-3",
    "group": "tone-partial",
    "field": "tonoplast",
    "text": "Ich könnte für die Namensfrage Membran schreiben.",
    "expected": [
      "partial"
    ]
  },
  {
    "id": "r4-tone-37-4",
    "group": "tone-clarify",
    "field": "tonoplast",
    "text": "Ich könnte für die Namensfrage Tonoplast oder Zellwand schreiben.",
    "expected": [
      "clarify"
    ]
  },
  {
    "id": "r4-tone-37-5",
    "group": "tone-incorrect",
    "field": "tonoplast",
    "text": "Ich könnte für die Namensfrage nicht Tonoplast schreiben.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r4-tone-38-1",
    "group": "tone-correct",
    "field": "tonoplast",
    "text": "Ich würde als passende Fachbezeichnung Tonoplast eintragen.",
    "expected": [
      "correct"
    ]
  },
  {
    "id": "r4-tone-38-2",
    "group": "tone-incorrect",
    "field": "tonoplast",
    "text": "Ich würde als passende Fachbezeichnung Zellwand eintragen.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r4-tone-38-3",
    "group": "tone-partial",
    "field": "tonoplast",
    "text": "Ich würde als passende Fachbezeichnung Membran eintragen.",
    "expected": [
      "partial"
    ]
  },
  {
    "id": "r4-tone-38-4",
    "group": "tone-clarify",
    "field": "tonoplast",
    "text": "Ich würde als passende Fachbezeichnung Tonoplast oder Zellwand eintragen.",
    "expected": [
      "clarify"
    ]
  },
  {
    "id": "r4-tone-38-5",
    "group": "tone-incorrect",
    "field": "tonoplast",
    "text": "Ich würde als passende Fachbezeichnung nicht Tonoplast eintragen.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r4-tone-39-1",
    "group": "tone-correct",
    "field": "tonoplast",
    "text": "Ich bin mir bei dem Fachwort unsicher: Tonoplast.",
    "expected": [
      "correct"
    ]
  },
  {
    "id": "r4-tone-39-2",
    "group": "tone-incorrect",
    "field": "tonoplast",
    "text": "Ich bin mir bei dem Fachwort unsicher: Zellwand.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r4-tone-39-3",
    "group": "tone-partial",
    "field": "tonoplast",
    "text": "Ich bin mir bei dem Fachwort unsicher: Membran.",
    "expected": [
      "partial"
    ]
  },
  {
    "id": "r4-tone-39-4",
    "group": "tone-clarify",
    "field": "tonoplast",
    "text": "Ich bin mir bei dem Fachwort unsicher: Tonoplast oder Zellwand.",
    "expected": [
      "clarify"
    ]
  },
  {
    "id": "r4-tone-39-5",
    "group": "tone-incorrect",
    "field": "tonoplast",
    "text": "Ich bin mir bei dem Fachwort unsicher: nicht Tonoplast.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r4-tone-40-1",
    "group": "tone-correct",
    "field": "tonoplast",
    "text": "Ich würde die Teilfrage nach dem Namen mit Tonoplast beantworten.",
    "expected": [
      "correct"
    ]
  },
  {
    "id": "r4-tone-40-2",
    "group": "tone-incorrect",
    "field": "tonoplast",
    "text": "Ich würde die Teilfrage nach dem Namen mit Zellwand beantworten.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r4-tone-40-3",
    "group": "tone-partial",
    "field": "tonoplast",
    "text": "Ich würde die Teilfrage nach dem Namen mit Membran beantworten.",
    "expected": [
      "partial"
    ]
  },
  {
    "id": "r4-tone-40-4",
    "group": "tone-clarify",
    "field": "tonoplast",
    "text": "Ich würde die Teilfrage nach dem Namen mit Tonoplast oder Zellwand beantworten.",
    "expected": [
      "clarify"
    ]
  },
  {
    "id": "r4-tone-40-5",
    "group": "tone-incorrect",
    "field": "tonoplast",
    "text": "Ich würde die Teilfrage nach dem Namen mit nicht Tonoplast beantworten.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r4-tone-41-1",
    "group": "tone-correct",
    "field": "tonoplast",
    "text": "Hier setze ich den Begriff Tonoplast in das Antwortfeld.",
    "expected": [
      "correct"
    ]
  },
  {
    "id": "r4-tone-41-2",
    "group": "tone-incorrect",
    "field": "tonoplast",
    "text": "Hier setze ich den Begriff Zellwand in das Antwortfeld.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r4-tone-41-3",
    "group": "tone-partial",
    "field": "tonoplast",
    "text": "Hier setze ich den Begriff Membran in das Antwortfeld.",
    "expected": [
      "partial"
    ]
  },
  {
    "id": "r4-tone-41-4",
    "group": "tone-clarify",
    "field": "tonoplast",
    "text": "Hier setze ich den Begriff Tonoplast oder Zellwand in das Antwortfeld.",
    "expected": [
      "clarify"
    ]
  },
  {
    "id": "r4-tone-41-5",
    "group": "tone-incorrect",
    "field": "tonoplast",
    "text": "Hier setze ich den Begriff nicht Tonoplast in das Antwortfeld.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r4-tone-42-1",
    "group": "tone-correct",
    "field": "tonoplast",
    "text": "Ich würde schlicht den Begriff Tonoplast für die Benennung verwenden.",
    "expected": [
      "correct"
    ]
  },
  {
    "id": "r4-tone-42-2",
    "group": "tone-incorrect",
    "field": "tonoplast",
    "text": "Ich würde schlicht den Begriff Zellwand für die Benennung verwenden.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r4-tone-42-3",
    "group": "tone-partial",
    "field": "tonoplast",
    "text": "Ich würde schlicht den Begriff Membran für die Benennung verwenden.",
    "expected": [
      "partial"
    ]
  },
  {
    "id": "r4-tone-42-4",
    "group": "tone-clarify",
    "field": "tonoplast",
    "text": "Ich würde schlicht den Begriff Tonoplast oder Zellwand für die Benennung verwenden.",
    "expected": [
      "clarify"
    ]
  },
  {
    "id": "r4-tone-42-5",
    "group": "tone-incorrect",
    "field": "tonoplast",
    "text": "Ich würde schlicht den Begriff nicht Tonoplast für die Benennung verwenden.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r4-tone-43-1",
    "group": "tone-correct",
    "field": "tonoplast",
    "text": "Bei der gesuchten Bezeichnung fällt mir Tonoplast ein.",
    "expected": [
      "correct"
    ]
  },
  {
    "id": "r4-tone-43-2",
    "group": "tone-incorrect",
    "field": "tonoplast",
    "text": "Bei der gesuchten Bezeichnung fällt mir Zellwand ein.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r4-tone-43-3",
    "group": "tone-partial",
    "field": "tonoplast",
    "text": "Bei der gesuchten Bezeichnung fällt mir Membran ein.",
    "expected": [
      "partial"
    ]
  },
  {
    "id": "r4-tone-43-4",
    "group": "tone-clarify",
    "field": "tonoplast",
    "text": "Bei der gesuchten Bezeichnung fällt mir Tonoplast oder Zellwand ein.",
    "expected": [
      "clarify"
    ]
  },
  {
    "id": "r4-tone-43-5",
    "group": "tone-incorrect",
    "field": "tonoplast",
    "text": "Bei der gesuchten Bezeichnung fällt mir nicht Tonoplast ein.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r4-tone-44-1",
    "group": "tone-correct",
    "field": "tonoplast",
    "text": "Ich würde beim Fachnamen den Begriff Tonoplast nehmen.",
    "expected": [
      "correct"
    ]
  },
  {
    "id": "r4-tone-44-2",
    "group": "tone-incorrect",
    "field": "tonoplast",
    "text": "Ich würde beim Fachnamen den Begriff Zellwand nehmen.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r4-tone-44-3",
    "group": "tone-partial",
    "field": "tonoplast",
    "text": "Ich würde beim Fachnamen den Begriff Membran nehmen.",
    "expected": [
      "partial"
    ]
  },
  {
    "id": "r4-tone-44-4",
    "group": "tone-clarify",
    "field": "tonoplast",
    "text": "Ich würde beim Fachnamen den Begriff Tonoplast oder Zellwand nehmen.",
    "expected": [
      "clarify"
    ]
  },
  {
    "id": "r4-tone-44-5",
    "group": "tone-incorrect",
    "field": "tonoplast",
    "text": "Ich würde beim Fachnamen den Begriff nicht Tonoplast nehmen.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r4-tone-45-1",
    "group": "tone-correct",
    "field": "tonoplast",
    "text": "Ich schreibe Tonoplast in dieses Feld für die Antwort.",
    "expected": [
      "correct"
    ]
  },
  {
    "id": "r4-tone-45-2",
    "group": "tone-incorrect",
    "field": "tonoplast",
    "text": "Ich schreibe Zellwand in dieses Feld für die Antwort.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r4-tone-45-3",
    "group": "tone-partial",
    "field": "tonoplast",
    "text": "Ich schreibe Membran in dieses Feld für die Antwort.",
    "expected": [
      "partial"
    ]
  },
  {
    "id": "r4-tone-45-4",
    "group": "tone-clarify",
    "field": "tonoplast",
    "text": "Ich schreibe Tonoplast oder Zellwand in dieses Feld für die Antwort.",
    "expected": [
      "clarify"
    ]
  },
  {
    "id": "r4-tone-45-5",
    "group": "tone-incorrect",
    "field": "tonoplast",
    "text": "Ich schreibe nicht Tonoplast in dieses Feld für die Antwort.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r4-tone-46-1",
    "group": "tone-correct",
    "field": "tonoplast",
    "text": "Als Antwort auf die Benennungsfrage hätte ich Tonoplast notiert.",
    "expected": [
      "correct"
    ]
  },
  {
    "id": "r4-tone-46-2",
    "group": "tone-incorrect",
    "field": "tonoplast",
    "text": "Als Antwort auf die Benennungsfrage hätte ich Zellwand notiert.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r4-tone-46-3",
    "group": "tone-partial",
    "field": "tonoplast",
    "text": "Als Antwort auf die Benennungsfrage hätte ich Membran notiert.",
    "expected": [
      "partial"
    ]
  },
  {
    "id": "r4-tone-46-4",
    "group": "tone-clarify",
    "field": "tonoplast",
    "text": "Als Antwort auf die Benennungsfrage hätte ich Tonoplast oder Zellwand notiert.",
    "expected": [
      "clarify"
    ]
  },
  {
    "id": "r4-tone-46-5",
    "group": "tone-incorrect",
    "field": "tonoplast",
    "text": "Als Antwort auf die Benennungsfrage hätte ich nicht Tonoplast notiert.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r4-tone-47-1",
    "group": "tone-correct",
    "field": "tonoplast",
    "text": "Soweit ich weiß, lautet der gesuchte Fachname Tonoplast.",
    "expected": [
      "correct"
    ]
  },
  {
    "id": "r4-tone-47-2",
    "group": "tone-incorrect",
    "field": "tonoplast",
    "text": "Soweit ich weiß, lautet der gesuchte Fachname Zellwand.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r4-tone-47-3",
    "group": "tone-partial",
    "field": "tonoplast",
    "text": "Soweit ich weiß, lautet der gesuchte Fachname Membran.",
    "expected": [
      "partial"
    ]
  },
  {
    "id": "r4-tone-47-4",
    "group": "tone-clarify",
    "field": "tonoplast",
    "text": "Soweit ich weiß, lautet der gesuchte Fachname Tonoplast oder Zellwand.",
    "expected": [
      "clarify"
    ]
  },
  {
    "id": "r4-tone-47-5",
    "group": "tone-incorrect",
    "field": "tonoplast",
    "text": "Soweit ich weiß, lautet der gesuchte Fachname nicht Tonoplast.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r4-tone-48-1",
    "group": "tone-correct",
    "field": "tonoplast",
    "text": "Für diese Teilfrage ist meine kurze Bezeichnung Tonoplast.",
    "expected": [
      "correct"
    ]
  },
  {
    "id": "r4-tone-48-2",
    "group": "tone-incorrect",
    "field": "tonoplast",
    "text": "Für diese Teilfrage ist meine kurze Bezeichnung Zellwand.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r4-tone-48-3",
    "group": "tone-partial",
    "field": "tonoplast",
    "text": "Für diese Teilfrage ist meine kurze Bezeichnung Membran.",
    "expected": [
      "partial"
    ]
  },
  {
    "id": "r4-tone-48-4",
    "group": "tone-clarify",
    "field": "tonoplast",
    "text": "Für diese Teilfrage ist meine kurze Bezeichnung Tonoplast oder Zellwand.",
    "expected": [
      "clarify"
    ]
  },
  {
    "id": "r4-tone-48-5",
    "group": "tone-incorrect",
    "field": "tonoplast",
    "text": "Für diese Teilfrage ist meine kurze Bezeichnung nicht Tonoplast.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r4-tone-contradiction-1",
    "group": "tone-contradiction",
    "field": "tonoplast",
    "text": "Ich würde die gesuchte Grenze Tonoplast nennen. Tonoplast ist keine Membran.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r4-tone-extra-1",
    "group": "tone-extra",
    "field": "tonoplast",
    "text": "Ich würde die gesuchte Grenze Tonoplast nennen. Die Zellwand ist ein Bakterium.",
    "expected": [
      "clarify"
    ]
  },
  {
    "id": "r4-tone-contradiction-2",
    "group": "tone-contradiction",
    "field": "tonoplast",
    "text": "Für die Membran wäre mein Fachwort Vakuolenmembran. Tonoplast ist keine Membran.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r4-tone-extra-2",
    "group": "tone-extra",
    "field": "tonoplast",
    "text": "Für die Membran wäre mein Fachwort Vakuolenmembran. Die Zellwand ist ein Bakterium.",
    "expected": [
      "clarify"
    ]
  },
  {
    "id": "r4-tone-contradiction-3",
    "group": "tone-contradiction",
    "field": "tonoplast",
    "text": "Meine Benennung für die hervorgehobene Grenze lautet Tonoplast. Tonoplast ist keine Membran.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r4-tone-extra-3",
    "group": "tone-extra",
    "field": "tonoplast",
    "text": "Meine Benennung für die hervorgehobene Grenze lautet Tonoplast. Die Zellwand ist ein Bakterium.",
    "expected": [
      "clarify"
    ]
  },
  {
    "id": "r4-tone-contradiction-4",
    "group": "tone-contradiction",
    "field": "tonoplast",
    "text": "Der Fachname, den ich dafür kenne, ist Vakuolenmembran. Tonoplast ist keine Membran.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r4-tone-extra-4",
    "group": "tone-extra",
    "field": "tonoplast",
    "text": "Der Fachname, den ich dafür kenne, ist Vakuolenmembran. Die Zellwand ist ein Bakterium.",
    "expected": [
      "clarify"
    ]
  },
  {
    "id": "r4-tone-contradiction-5",
    "group": "tone-contradiction",
    "field": "tonoplast",
    "text": "Als Begriff fällt mir für diese Membran Tonoplast ein. Tonoplast ist keine Membran.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r4-tone-extra-5",
    "group": "tone-extra",
    "field": "tonoplast",
    "text": "Als Begriff fällt mir für diese Membran Tonoplast ein. Die Zellwand ist ein Bakterium.",
    "expected": [
      "clarify"
    ]
  },
  {
    "id": "r4-tone-contradiction-6",
    "group": "tone-contradiction",
    "field": "tonoplast",
    "text": "Ich tippe beim Namen der Membran auf Tonoplast. Tonoplast ist keine Membran.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r4-tone-extra-6",
    "group": "tone-extra",
    "field": "tonoplast",
    "text": "Ich tippe beim Namen der Membran auf Tonoplast. Die Zellwand ist ein Bakterium.",
    "expected": [
      "clarify"
    ]
  },
  {
    "id": "r4-tone-contradiction-7",
    "group": "tone-contradiction",
    "field": "tonoplast",
    "text": "Soweit ich weiß, nennt man diese Grenze Vakuolenmembran. Tonoplast ist keine Membran.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r4-tone-extra-7",
    "group": "tone-extra",
    "field": "tonoplast",
    "text": "Soweit ich weiß, nennt man diese Grenze Vakuolenmembran. Die Zellwand ist ein Bakterium.",
    "expected": [
      "clarify"
    ]
  },
  {
    "id": "r4-tone-contradiction-8",
    "group": "tone-contradiction",
    "field": "tonoplast",
    "text": "Die gesuchte Membran würde ich als Tonoplast bezeichnen. Tonoplast ist keine Membran.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r4-tone-extra-8",
    "group": "tone-extra",
    "field": "tonoplast",
    "text": "Die gesuchte Membran würde ich als Tonoplast bezeichnen. Die Zellwand ist ein Bakterium.",
    "expected": [
      "clarify"
    ]
  },
  {
    "id": "r4-tone-contradiction-9",
    "group": "tone-contradiction",
    "field": "tonoplast",
    "text": "Ich schreibe als Namen für die Grenze Vakuolenmembran hin. Tonoplast ist keine Membran.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r4-tone-extra-9",
    "group": "tone-extra",
    "field": "tonoplast",
    "text": "Ich schreibe als Namen für die Grenze Vakuolenmembran hin. Die Zellwand ist ein Bakterium.",
    "expected": [
      "clarify"
    ]
  },
  {
    "id": "r4-tone-contradiction-10",
    "group": "tone-contradiction",
    "field": "tonoplast",
    "text": "Mit dem Fachwort Tonoplast würde ich die Frage beantworten. Tonoplast ist keine Membran.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r4-tone-extra-10",
    "group": "tone-extra",
    "field": "tonoplast",
    "text": "Mit dem Fachwort Tonoplast würde ich die Frage beantworten. Die Zellwand ist ein Bakterium.",
    "expected": [
      "clarify"
    ]
  },
  {
    "id": "r4-tone-contradiction-11",
    "group": "tone-contradiction",
    "field": "tonoplast",
    "text": "Ich würde in dieses Namensfeld das Wort Tonoplast setzen. Tonoplast ist keine Membran.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r4-tone-extra-11",
    "group": "tone-extra",
    "field": "tonoplast",
    "text": "Ich würde in dieses Namensfeld das Wort Tonoplast setzen. Die Zellwand ist ein Bakterium.",
    "expected": [
      "clarify"
    ]
  },
  {
    "id": "r4-tone-contradiction-12",
    "group": "tone-contradiction",
    "field": "tonoplast",
    "text": "Als meinen kurzen Vorschlag würde ich hier Tonoplast hinschreiben. Tonoplast ist keine Membran.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r4-tone-extra-12",
    "group": "tone-extra",
    "field": "tonoplast",
    "text": "Als meinen kurzen Vorschlag würde ich hier Tonoplast hinschreiben. Die Zellwand ist ein Bakterium.",
    "expected": [
      "clarify"
    ]
  },
  {
    "id": "r4-tone-contradiction-13",
    "group": "tone-contradiction",
    "field": "tonoplast",
    "text": "Ich lege mich beim gesuchten Namen auf Tonoplast fest. Tonoplast ist keine Membran.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r4-tone-extra-13",
    "group": "tone-extra",
    "field": "tonoplast",
    "text": "Ich lege mich beim gesuchten Namen auf Tonoplast fest. Die Zellwand ist ein Bakterium.",
    "expected": [
      "clarify"
    ]
  },
  {
    "id": "r4-tone-contradiction-14",
    "group": "tone-contradiction",
    "field": "tonoplast",
    "text": "Ich würde auf die Benennungsfrage mit dem Fachwort Tonoplast antworten. Tonoplast ist keine Membran.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r4-tone-extra-14",
    "group": "tone-extra",
    "field": "tonoplast",
    "text": "Ich würde auf die Benennungsfrage mit dem Fachwort Tonoplast antworten. Die Zellwand ist ein Bakterium.",
    "expected": [
      "clarify"
    ]
  },
  {
    "id": "r4-tone-contradiction-15",
    "group": "tone-contradiction",
    "field": "tonoplast",
    "text": "In das Antwortfeld schreibe ich hier das Wort Tonoplast. Tonoplast ist keine Membran.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r4-tone-extra-15",
    "group": "tone-extra",
    "field": "tonoplast",
    "text": "In das Antwortfeld schreibe ich hier das Wort Tonoplast. Die Zellwand ist ein Bakterium.",
    "expected": [
      "clarify"
    ]
  },
  {
    "id": "r4-tone-contradiction-16",
    "group": "tone-contradiction",
    "field": "tonoplast",
    "text": "Ich habe für diese Namensfrage Tonoplast im Kopf. Tonoplast ist keine Membran.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r4-tone-extra-16",
    "group": "tone-extra",
    "field": "tonoplast",
    "text": "Ich habe für diese Namensfrage Tonoplast im Kopf. Die Zellwand ist ein Bakterium.",
    "expected": [
      "clarify"
    ]
  },
  {
    "id": "r4-tone-contradiction-17",
    "group": "tone-contradiction",
    "field": "tonoplast",
    "text": "Ich bin beim Begriff noch unsicher: Tonoplast. Tonoplast ist keine Membran.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r4-tone-extra-17",
    "group": "tone-extra",
    "field": "tonoplast",
    "text": "Ich bin beim Begriff noch unsicher: Tonoplast. Die Zellwand ist ein Bakterium.",
    "expected": [
      "clarify"
    ]
  },
  {
    "id": "r4-tone-contradiction-18",
    "group": "tone-contradiction",
    "field": "tonoplast",
    "text": "Mein Vorschlag für die kurze Antwort lautet wohl Tonoplast. Tonoplast ist keine Membran.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r4-tone-extra-18",
    "group": "tone-extra",
    "field": "tonoplast",
    "text": "Mein Vorschlag für die kurze Antwort lautet wohl Tonoplast. Die Zellwand ist ein Bakterium.",
    "expected": [
      "clarify"
    ]
  },
  {
    "id": "r4-tone-contradiction-19",
    "group": "tone-contradiction",
    "field": "tonoplast",
    "text": "Ich würde mich bei dieser Teilfrage auf Tonoplast festlegen. Tonoplast ist keine Membran.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r4-tone-extra-19",
    "group": "tone-extra",
    "field": "tonoplast",
    "text": "Ich würde mich bei dieser Teilfrage auf Tonoplast festlegen. Die Zellwand ist ein Bakterium.",
    "expected": [
      "clarify"
    ]
  },
  {
    "id": "r4-tone-contradiction-20",
    "group": "tone-contradiction",
    "field": "tonoplast",
    "text": "Tonoplast nehme ich hier als meine Bezeichnung. Tonoplast ist keine Membran.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r4-tone-extra-20",
    "group": "tone-extra",
    "field": "tonoplast",
    "text": "Tonoplast nehme ich hier als meine Bezeichnung. Die Zellwand ist ein Bakterium.",
    "expected": [
      "clarify"
    ]
  },
  {
    "id": "r4-tone-contradiction-21",
    "group": "tone-contradiction",
    "field": "tonoplast",
    "text": "Tonoplast ist für mich der passende Fachausdruck. Tonoplast ist keine Membran.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r4-tone-extra-21",
    "group": "tone-extra",
    "field": "tonoplast",
    "text": "Tonoplast ist für mich der passende Fachausdruck. Die Zellwand ist ein Bakterium.",
    "expected": [
      "clarify"
    ]
  },
  {
    "id": "r4-tone-contradiction-22",
    "group": "tone-contradiction",
    "field": "tonoplast",
    "text": "Ich würde in das Feld für die Benennung Tonoplast eintragen. Tonoplast ist keine Membran.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r4-tone-extra-22",
    "group": "tone-extra",
    "field": "tonoplast",
    "text": "Ich würde in das Feld für die Benennung Tonoplast eintragen. Die Zellwand ist ein Bakterium.",
    "expected": [
      "clarify"
    ]
  },
  {
    "id": "r4-tone-contradiction-23",
    "group": "tone-contradiction",
    "field": "tonoplast",
    "text": "Ich antworte bei dieser Benennungsfrage mit dem Wort Tonoplast. Tonoplast ist keine Membran.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r4-tone-extra-23",
    "group": "tone-extra",
    "field": "tonoplast",
    "text": "Ich antworte bei dieser Benennungsfrage mit dem Wort Tonoplast. Die Zellwand ist ein Bakterium.",
    "expected": [
      "clarify"
    ]
  },
  {
    "id": "r4-tone-contradiction-24",
    "group": "tone-contradiction",
    "field": "tonoplast",
    "text": "Ich würde die gesuchte Benennung Tonoplast wählen. Tonoplast ist keine Membran.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r4-tone-extra-24",
    "group": "tone-extra",
    "field": "tonoplast",
    "text": "Ich würde die gesuchte Benennung Tonoplast wählen. Die Zellwand ist ein Bakterium.",
    "expected": [
      "clarify"
    ]
  },
  {
    "id": "r4-tone-contradiction-25",
    "group": "tone-contradiction",
    "field": "tonoplast",
    "text": "Ich habe hier den Fachausdruck Tonoplast als Vorschlag. Tonoplast ist keine Membran.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r4-tone-extra-25",
    "group": "tone-extra",
    "field": "tonoplast",
    "text": "Ich habe hier den Fachausdruck Tonoplast als Vorschlag. Die Zellwand ist ein Bakterium.",
    "expected": [
      "clarify"
    ]
  },
  {
    "id": "r4-tone-contradiction-26",
    "group": "tone-contradiction",
    "field": "tonoplast",
    "text": "Meine Angabe für diese Frage ist das Wort Tonoplast. Tonoplast ist keine Membran.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r4-tone-extra-26",
    "group": "tone-extra",
    "field": "tonoplast",
    "text": "Meine Angabe für diese Frage ist das Wort Tonoplast. Die Zellwand ist ein Bakterium.",
    "expected": [
      "clarify"
    ]
  },
  {
    "id": "r4-tone-contradiction-27",
    "group": "tone-contradiction",
    "field": "tonoplast",
    "text": "Ich würde bei der Antwort schlicht Tonoplast angeben. Tonoplast ist keine Membran.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r4-tone-extra-27",
    "group": "tone-extra",
    "field": "tonoplast",
    "text": "Ich würde bei der Antwort schlicht Tonoplast angeben. Die Zellwand ist ein Bakterium.",
    "expected": [
      "clarify"
    ]
  },
  {
    "id": "r4-tone-contradiction-28",
    "group": "tone-contradiction",
    "field": "tonoplast",
    "text": "Ich tippe bei dieser Frage auf den Begriff Tonoplast. Tonoplast ist keine Membran.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r4-tone-extra-28",
    "group": "tone-extra",
    "field": "tonoplast",
    "text": "Ich tippe bei dieser Frage auf den Begriff Tonoplast. Die Zellwand ist ein Bakterium.",
    "expected": [
      "clarify"
    ]
  },
  {
    "id": "r4-tone-contradiction-29",
    "group": "tone-contradiction",
    "field": "tonoplast",
    "text": "Bei dem gesuchten Fachnamen bleibe ich bei Tonoplast. Tonoplast ist keine Membran.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r4-tone-extra-29",
    "group": "tone-extra",
    "field": "tonoplast",
    "text": "Bei dem gesuchten Fachnamen bleibe ich bei Tonoplast. Die Zellwand ist ein Bakterium.",
    "expected": [
      "clarify"
    ]
  },
  {
    "id": "r4-tone-contradiction-30",
    "group": "tone-contradiction",
    "field": "tonoplast",
    "text": "In dieses Feld käme für mich der Name Tonoplast. Tonoplast ist keine Membran.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r4-tone-extra-30",
    "group": "tone-extra",
    "field": "tonoplast",
    "text": "In dieses Feld käme für mich der Name Tonoplast. Die Zellwand ist ein Bakterium.",
    "expected": [
      "clarify"
    ]
  },
  {
    "id": "r4-tone-contradiction-31",
    "group": "tone-contradiction",
    "field": "tonoplast",
    "text": "Ich meine bei dieser Namensfrage den Begriff Tonoplast. Tonoplast ist keine Membran.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r4-tone-extra-31",
    "group": "tone-extra",
    "field": "tonoplast",
    "text": "Ich meine bei dieser Namensfrage den Begriff Tonoplast. Die Zellwand ist ein Bakterium.",
    "expected": [
      "clarify"
    ]
  },
  {
    "id": "r4-tone-contradiction-32",
    "group": "tone-contradiction",
    "field": "tonoplast",
    "text": "Ich würde mich hier für das Fachwort Tonoplast entscheiden. Tonoplast ist keine Membran.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r4-tone-extra-32",
    "group": "tone-extra",
    "field": "tonoplast",
    "text": "Ich würde mich hier für das Fachwort Tonoplast entscheiden. Die Zellwand ist ein Bakterium.",
    "expected": [
      "clarify"
    ]
  },
  {
    "id": "r4-tone-contradiction-33",
    "group": "tone-contradiction",
    "field": "tonoplast",
    "text": "Das Ganze ist mit Tonoplast passend benannt. Tonoplast ist keine Membran.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r4-tone-extra-33",
    "group": "tone-extra",
    "field": "tonoplast",
    "text": "Das Ganze ist mit Tonoplast passend benannt. Die Zellwand ist ein Bakterium.",
    "expected": [
      "clarify"
    ]
  },
  {
    "id": "r4-tone-contradiction-34",
    "group": "tone-contradiction",
    "field": "tonoplast",
    "text": "Für die Benennungsfrage habe ich den Namen Tonoplast im Kopf. Tonoplast ist keine Membran.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r4-tone-extra-34",
    "group": "tone-extra",
    "field": "tonoplast",
    "text": "Für die Benennungsfrage habe ich den Namen Tonoplast im Kopf. Die Zellwand ist ein Bakterium.",
    "expected": [
      "clarify"
    ]
  },
  {
    "id": "r4-tone-contradiction-35",
    "group": "tone-contradiction",
    "field": "tonoplast",
    "text": "Mein Fachausdruck zur Benennung wäre hier Tonoplast. Tonoplast ist keine Membran.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r4-tone-extra-35",
    "group": "tone-extra",
    "field": "tonoplast",
    "text": "Mein Fachausdruck zur Benennung wäre hier Tonoplast. Die Zellwand ist ein Bakterium.",
    "expected": [
      "clarify"
    ]
  },
  {
    "id": "r4-tone-contradiction-36",
    "group": "tone-contradiction",
    "field": "tonoplast",
    "text": "Tonoplast würde ich als meine kurze Antwort notieren. Tonoplast ist keine Membran.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r4-tone-extra-36",
    "group": "tone-extra",
    "field": "tonoplast",
    "text": "Tonoplast würde ich als meine kurze Antwort notieren. Die Zellwand ist ein Bakterium.",
    "expected": [
      "clarify"
    ]
  },
  {
    "id": "r4-tone-contradiction-37",
    "group": "tone-contradiction",
    "field": "tonoplast",
    "text": "Ich könnte für die Namensfrage Tonoplast schreiben. Tonoplast ist keine Membran.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r4-tone-extra-37",
    "group": "tone-extra",
    "field": "tonoplast",
    "text": "Ich könnte für die Namensfrage Tonoplast schreiben. Die Zellwand ist ein Bakterium.",
    "expected": [
      "clarify"
    ]
  },
  {
    "id": "r4-tone-contradiction-38",
    "group": "tone-contradiction",
    "field": "tonoplast",
    "text": "Ich würde als passende Fachbezeichnung Tonoplast eintragen. Tonoplast ist keine Membran.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r4-tone-extra-38",
    "group": "tone-extra",
    "field": "tonoplast",
    "text": "Ich würde als passende Fachbezeichnung Tonoplast eintragen. Die Zellwand ist ein Bakterium.",
    "expected": [
      "clarify"
    ]
  },
  {
    "id": "r4-tone-contradiction-39",
    "group": "tone-contradiction",
    "field": "tonoplast",
    "text": "Ich bin mir bei dem Fachwort unsicher: Tonoplast. Tonoplast ist keine Membran.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r4-tone-extra-39",
    "group": "tone-extra",
    "field": "tonoplast",
    "text": "Ich bin mir bei dem Fachwort unsicher: Tonoplast. Die Zellwand ist ein Bakterium.",
    "expected": [
      "clarify"
    ]
  },
  {
    "id": "r4-tone-contradiction-40",
    "group": "tone-contradiction",
    "field": "tonoplast",
    "text": "Ich würde die Teilfrage nach dem Namen mit Tonoplast beantworten. Tonoplast ist keine Membran.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r4-tone-extra-40",
    "group": "tone-extra",
    "field": "tonoplast",
    "text": "Ich würde die Teilfrage nach dem Namen mit Tonoplast beantworten. Die Zellwand ist ein Bakterium.",
    "expected": [
      "clarify"
    ]
  },
  {
    "id": "r4-tone-contradiction-41",
    "group": "tone-contradiction",
    "field": "tonoplast",
    "text": "Hier setze ich den Begriff Tonoplast in das Antwortfeld. Tonoplast ist keine Membran.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r4-tone-extra-41",
    "group": "tone-extra",
    "field": "tonoplast",
    "text": "Hier setze ich den Begriff Tonoplast in das Antwortfeld. Die Zellwand ist ein Bakterium.",
    "expected": [
      "clarify"
    ]
  },
  {
    "id": "r4-tone-contradiction-42",
    "group": "tone-contradiction",
    "field": "tonoplast",
    "text": "Ich würde schlicht den Begriff Tonoplast für die Benennung verwenden. Tonoplast ist keine Membran.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r4-tone-extra-42",
    "group": "tone-extra",
    "field": "tonoplast",
    "text": "Ich würde schlicht den Begriff Tonoplast für die Benennung verwenden. Die Zellwand ist ein Bakterium.",
    "expected": [
      "clarify"
    ]
  },
  {
    "id": "r4-tone-contradiction-43",
    "group": "tone-contradiction",
    "field": "tonoplast",
    "text": "Bei der gesuchten Bezeichnung fällt mir Tonoplast ein. Tonoplast ist keine Membran.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r4-tone-extra-43",
    "group": "tone-extra",
    "field": "tonoplast",
    "text": "Bei der gesuchten Bezeichnung fällt mir Tonoplast ein. Die Zellwand ist ein Bakterium.",
    "expected": [
      "clarify"
    ]
  },
  {
    "id": "r4-tone-contradiction-44",
    "group": "tone-contradiction",
    "field": "tonoplast",
    "text": "Ich würde beim Fachnamen den Begriff Tonoplast nehmen. Tonoplast ist keine Membran.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r4-tone-extra-44",
    "group": "tone-extra",
    "field": "tonoplast",
    "text": "Ich würde beim Fachnamen den Begriff Tonoplast nehmen. Die Zellwand ist ein Bakterium.",
    "expected": [
      "clarify"
    ]
  },
  {
    "id": "r4-tone-contradiction-45",
    "group": "tone-contradiction",
    "field": "tonoplast",
    "text": "Ich schreibe Tonoplast in dieses Feld für die Antwort. Tonoplast ist keine Membran.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r4-tone-extra-45",
    "group": "tone-extra",
    "field": "tonoplast",
    "text": "Ich schreibe Tonoplast in dieses Feld für die Antwort. Die Zellwand ist ein Bakterium.",
    "expected": [
      "clarify"
    ]
  },
  {
    "id": "r4-tone-contradiction-46",
    "group": "tone-contradiction",
    "field": "tonoplast",
    "text": "Als Antwort auf die Benennungsfrage hätte ich Tonoplast notiert. Tonoplast ist keine Membran.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r4-tone-extra-46",
    "group": "tone-extra",
    "field": "tonoplast",
    "text": "Als Antwort auf die Benennungsfrage hätte ich Tonoplast notiert. Die Zellwand ist ein Bakterium.",
    "expected": [
      "clarify"
    ]
  },
  {
    "id": "r4-tone-contradiction-47",
    "group": "tone-contradiction",
    "field": "tonoplast",
    "text": "Soweit ich weiß, lautet der gesuchte Fachname Tonoplast. Tonoplast ist keine Membran.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r4-tone-extra-47",
    "group": "tone-extra",
    "field": "tonoplast",
    "text": "Soweit ich weiß, lautet der gesuchte Fachname Tonoplast. Die Zellwand ist ein Bakterium.",
    "expected": [
      "clarify"
    ]
  },
  {
    "id": "r4-tone-contradiction-48",
    "group": "tone-contradiction",
    "field": "tonoplast",
    "text": "Für diese Teilfrage ist meine kurze Bezeichnung Tonoplast. Tonoplast ist keine Membran.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r4-tone-extra-48",
    "group": "tone-extra",
    "field": "tonoplast",
    "text": "Für diese Teilfrage ist meine kurze Bezeichnung Tonoplast. Die Zellwand ist ein Bakterium.",
    "expected": [
      "clarify"
    ]
  }
];
