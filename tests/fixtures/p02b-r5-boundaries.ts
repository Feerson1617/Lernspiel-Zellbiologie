import type { R5Case } from './p02b-r5-cases.ts';
// Fixed before first execution: field transfer and question decision controls.
export const R5_BOUNDARIES: readonly R5Case[] = [
  {
    "id": "r5-tone-1-1",
    "group": "tone-correct",
    "field": "tonoplast",
    "text": "Als Bezeichnung für die Vakuolengrenze passt Tonoplast.",
    "expected": [
      "correct"
    ]
  },
  {
    "id": "r5-tone-1-2",
    "group": "tone-incorrect",
    "field": "tonoplast",
    "text": "Als Bezeichnung für die Vakuolengrenze passt Zellwand.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r5-tone-1-3",
    "group": "tone-partial",
    "field": "tonoplast",
    "text": "Als Bezeichnung für die Vakuolengrenze passt Membran.",
    "expected": [
      "partial"
    ]
  },
  {
    "id": "r5-tone-1-4",
    "group": "tone-clarify",
    "field": "tonoplast",
    "text": "Als Bezeichnung für die Vakuolengrenze passt Tonoplast oder Zellwand.",
    "expected": [
      "clarify"
    ]
  },
  {
    "id": "r5-tone-1-5",
    "group": "tone-incorrect",
    "field": "tonoplast",
    "text": "Als Bezeichnung für die Vakuolengrenze passt nicht Tonoplast.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r5-tone-2-1",
    "group": "tone-correct",
    "field": "tonoplast",
    "text": "Der biologische Name für diese Membran lautet Tonoplast.",
    "expected": [
      "correct"
    ]
  },
  {
    "id": "r5-tone-2-2",
    "group": "tone-incorrect",
    "field": "tonoplast",
    "text": "Der biologische Name für diese Membran lautet Zellwand.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r5-tone-2-3",
    "group": "tone-partial",
    "field": "tonoplast",
    "text": "Der biologische Name für diese Membran lautet Membran.",
    "expected": [
      "partial"
    ]
  },
  {
    "id": "r5-tone-2-4",
    "group": "tone-clarify",
    "field": "tonoplast",
    "text": "Der biologische Name für diese Membran lautet Tonoplast oder Zellwand.",
    "expected": [
      "clarify"
    ]
  },
  {
    "id": "r5-tone-2-5",
    "group": "tone-incorrect",
    "field": "tonoplast",
    "text": "Der biologische Name für diese Membran lautet nicht Tonoplast.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r5-tone-3-1",
    "group": "tone-correct",
    "field": "tonoplast",
    "text": "Ich wähle für die Grenze um den Vakuolenraum den Begriff Tonoplast.",
    "expected": [
      "correct"
    ]
  },
  {
    "id": "r5-tone-3-2",
    "group": "tone-incorrect",
    "field": "tonoplast",
    "text": "Ich wähle für die Grenze um den Vakuolenraum den Begriff Zellwand.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r5-tone-3-3",
    "group": "tone-partial",
    "field": "tonoplast",
    "text": "Ich wähle für die Grenze um den Vakuolenraum den Begriff Membran.",
    "expected": [
      "partial"
    ]
  },
  {
    "id": "r5-tone-3-4",
    "group": "tone-clarify",
    "field": "tonoplast",
    "text": "Ich wähle für die Grenze um den Vakuolenraum den Begriff Tonoplast oder Zellwand.",
    "expected": [
      "clarify"
    ]
  },
  {
    "id": "r5-tone-3-5",
    "group": "tone-incorrect",
    "field": "tonoplast",
    "text": "Ich wähle für die Grenze um den Vakuolenraum den Begriff nicht Tonoplast.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r5-tone-4-1",
    "group": "tone-correct",
    "field": "tonoplast",
    "text": "Ich benenne diese Membran mit Tonoplast.",
    "expected": [
      "correct"
    ]
  },
  {
    "id": "r5-tone-4-2",
    "group": "tone-incorrect",
    "field": "tonoplast",
    "text": "Ich benenne diese Membran mit Zellwand.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r5-tone-4-3",
    "group": "tone-partial",
    "field": "tonoplast",
    "text": "Ich benenne diese Membran mit Membran.",
    "expected": [
      "partial"
    ]
  },
  {
    "id": "r5-tone-4-4",
    "group": "tone-clarify",
    "field": "tonoplast",
    "text": "Ich benenne diese Membran mit Tonoplast oder Zellwand.",
    "expected": [
      "clarify"
    ]
  },
  {
    "id": "r5-tone-4-5",
    "group": "tone-incorrect",
    "field": "tonoplast",
    "text": "Ich benenne diese Membran mit nicht Tonoplast.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r5-tone-5-1",
    "group": "tone-correct",
    "field": "tonoplast",
    "text": "Tonoplast ist die Benennung, die ich für diese Grenze wählen würde.",
    "expected": [
      "correct"
    ]
  },
  {
    "id": "r5-tone-5-2",
    "group": "tone-incorrect",
    "field": "tonoplast",
    "text": "Zellwand ist die Benennung, die ich für diese Grenze wählen würde.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r5-tone-5-3",
    "group": "tone-partial",
    "field": "tonoplast",
    "text": "Membran ist die Benennung, die ich für diese Grenze wählen würde.",
    "expected": [
      "partial"
    ]
  },
  {
    "id": "r5-tone-5-4",
    "group": "tone-clarify",
    "field": "tonoplast",
    "text": "Tonoplast oder Zellwand ist die Benennung, die ich für diese Grenze wählen würde.",
    "expected": [
      "clarify"
    ]
  },
  {
    "id": "r5-tone-5-5",
    "group": "tone-incorrect",
    "field": "tonoplast",
    "text": "nicht Tonoplast ist die Benennung, die ich für diese Grenze wählen würde.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r5-tone-6-1",
    "group": "tone-correct",
    "field": "tonoplast",
    "text": "Mein Fachausdruck für die Vakuolengrenze wäre Tonoplast.",
    "expected": [
      "correct"
    ]
  },
  {
    "id": "r5-tone-6-2",
    "group": "tone-incorrect",
    "field": "tonoplast",
    "text": "Mein Fachausdruck für die Vakuolengrenze wäre Zellwand.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r5-tone-6-3",
    "group": "tone-partial",
    "field": "tonoplast",
    "text": "Mein Fachausdruck für die Vakuolengrenze wäre Membran.",
    "expected": [
      "partial"
    ]
  },
  {
    "id": "r5-tone-6-4",
    "group": "tone-clarify",
    "field": "tonoplast",
    "text": "Mein Fachausdruck für die Vakuolengrenze wäre Tonoplast oder Zellwand.",
    "expected": [
      "clarify"
    ]
  },
  {
    "id": "r5-tone-6-5",
    "group": "tone-incorrect",
    "field": "tonoplast",
    "text": "Mein Fachausdruck für die Vakuolengrenze wäre nicht Tonoplast.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r5-tone-7-1",
    "group": "tone-correct",
    "field": "tonoplast",
    "text": "Bei der gesuchten Membranbezeichnung denke ich an Tonoplast.",
    "expected": [
      "correct"
    ]
  },
  {
    "id": "r5-tone-7-2",
    "group": "tone-incorrect",
    "field": "tonoplast",
    "text": "Bei der gesuchten Membranbezeichnung denke ich an Zellwand.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r5-tone-7-3",
    "group": "tone-partial",
    "field": "tonoplast",
    "text": "Bei der gesuchten Membranbezeichnung denke ich an Membran.",
    "expected": [
      "partial"
    ]
  },
  {
    "id": "r5-tone-7-4",
    "group": "tone-clarify",
    "field": "tonoplast",
    "text": "Bei der gesuchten Membranbezeichnung denke ich an Tonoplast oder Zellwand.",
    "expected": [
      "clarify"
    ]
  },
  {
    "id": "r5-tone-7-5",
    "group": "tone-incorrect",
    "field": "tonoplast",
    "text": "Bei der gesuchten Membranbezeichnung denke ich an nicht Tonoplast.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r5-tone-8-1",
    "group": "tone-correct",
    "field": "tonoplast",
    "text": "Ich ordne dieser Grenze den Namen Tonoplast zu.",
    "expected": [
      "correct"
    ]
  },
  {
    "id": "r5-tone-8-2",
    "group": "tone-incorrect",
    "field": "tonoplast",
    "text": "Ich ordne dieser Grenze den Namen Zellwand zu.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r5-tone-8-3",
    "group": "tone-partial",
    "field": "tonoplast",
    "text": "Ich ordne dieser Grenze den Namen Membran zu.",
    "expected": [
      "partial"
    ]
  },
  {
    "id": "r5-tone-8-4",
    "group": "tone-clarify",
    "field": "tonoplast",
    "text": "Ich ordne dieser Grenze den Namen Tonoplast oder Zellwand zu.",
    "expected": [
      "clarify"
    ]
  },
  {
    "id": "r5-tone-8-5",
    "group": "tone-incorrect",
    "field": "tonoplast",
    "text": "Ich ordne dieser Grenze den Namen nicht Tonoplast zu.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r5-tone-9-1",
    "group": "tone-correct",
    "field": "tonoplast",
    "text": "Für die Grenze um die Vakuole ist Tonoplast das richtige Fachwort.",
    "expected": [
      "correct"
    ]
  },
  {
    "id": "r5-tone-9-2",
    "group": "tone-incorrect",
    "field": "tonoplast",
    "text": "Für die Grenze um die Vakuole ist Zellwand das richtige Fachwort.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r5-tone-9-3",
    "group": "tone-partial",
    "field": "tonoplast",
    "text": "Für die Grenze um die Vakuole ist Membran das richtige Fachwort.",
    "expected": [
      "partial"
    ]
  },
  {
    "id": "r5-tone-9-4",
    "group": "tone-clarify",
    "field": "tonoplast",
    "text": "Für die Grenze um die Vakuole ist Tonoplast oder Zellwand das richtige Fachwort.",
    "expected": [
      "clarify"
    ]
  },
  {
    "id": "r5-tone-9-5",
    "group": "tone-incorrect",
    "field": "tonoplast",
    "text": "Für die Grenze um die Vakuole ist nicht Tonoplast das richtige Fachwort.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r5-tone-10-1",
    "group": "tone-correct",
    "field": "tonoplast",
    "text": "Den Namen Tonoplast würde ich für die hervorgehobene Membran hinschreiben.",
    "expected": [
      "correct"
    ]
  },
  {
    "id": "r5-tone-10-2",
    "group": "tone-incorrect",
    "field": "tonoplast",
    "text": "Den Namen Zellwand würde ich für die hervorgehobene Membran hinschreiben.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r5-tone-10-3",
    "group": "tone-partial",
    "field": "tonoplast",
    "text": "Den Namen Membran würde ich für die hervorgehobene Membran hinschreiben.",
    "expected": [
      "partial"
    ]
  },
  {
    "id": "r5-tone-10-4",
    "group": "tone-clarify",
    "field": "tonoplast",
    "text": "Den Namen Tonoplast oder Zellwand würde ich für die hervorgehobene Membran hinschreiben.",
    "expected": [
      "clarify"
    ]
  },
  {
    "id": "r5-tone-10-5",
    "group": "tone-incorrect",
    "field": "tonoplast",
    "text": "Den Namen nicht Tonoplast würde ich für die hervorgehobene Membran hinschreiben.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r5-tone-11-1",
    "group": "tone-correct",
    "field": "tonoplast",
    "text": "Bei der Benennung entscheide ich mich für das Lösungswort Tonoplast.",
    "expected": [
      "correct"
    ]
  },
  {
    "id": "r5-tone-11-2",
    "group": "tone-incorrect",
    "field": "tonoplast",
    "text": "Bei der Benennung entscheide ich mich für das Lösungswort Zellwand.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r5-tone-11-3",
    "group": "tone-partial",
    "field": "tonoplast",
    "text": "Bei der Benennung entscheide ich mich für das Lösungswort Membran.",
    "expected": [
      "partial"
    ]
  },
  {
    "id": "r5-tone-11-4",
    "group": "tone-clarify",
    "field": "tonoplast",
    "text": "Bei der Benennung entscheide ich mich für das Lösungswort Tonoplast oder Zellwand.",
    "expected": [
      "clarify"
    ]
  },
  {
    "id": "r5-tone-11-5",
    "group": "tone-incorrect",
    "field": "tonoplast",
    "text": "Bei der Benennung entscheide ich mich für das Lösungswort nicht Tonoplast.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r5-tone-12-1",
    "group": "tone-correct",
    "field": "tonoplast",
    "text": "Ich bin nicht sicher, aber ich wähle den Namen Tonoplast.",
    "expected": [
      "correct"
    ]
  },
  {
    "id": "r5-tone-12-2",
    "group": "tone-incorrect",
    "field": "tonoplast",
    "text": "Ich bin nicht sicher, aber ich wähle den Namen Zellwand.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r5-tone-12-3",
    "group": "tone-partial",
    "field": "tonoplast",
    "text": "Ich bin nicht sicher, aber ich wähle den Namen Membran.",
    "expected": [
      "partial"
    ]
  },
  {
    "id": "r5-tone-12-4",
    "group": "tone-clarify",
    "field": "tonoplast",
    "text": "Ich bin nicht sicher, aber ich wähle den Namen Tonoplast oder Zellwand.",
    "expected": [
      "clarify"
    ]
  },
  {
    "id": "r5-tone-12-5",
    "group": "tone-incorrect",
    "field": "tonoplast",
    "text": "Ich bin nicht sicher, aber ich wähle den Namen nicht Tonoplast.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r5-tone-13-1",
    "group": "tone-correct",
    "field": "tonoplast",
    "text": "Der Name, den ich hier benutzen würde, lautet Tonoplast.",
    "expected": [
      "correct"
    ]
  },
  {
    "id": "r5-tone-13-2",
    "group": "tone-incorrect",
    "field": "tonoplast",
    "text": "Der Name, den ich hier benutzen würde, lautet Zellwand.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r5-tone-13-3",
    "group": "tone-partial",
    "field": "tonoplast",
    "text": "Der Name, den ich hier benutzen würde, lautet Membran.",
    "expected": [
      "partial"
    ]
  },
  {
    "id": "r5-tone-13-4",
    "group": "tone-clarify",
    "field": "tonoplast",
    "text": "Der Name, den ich hier benutzen würde, lautet Tonoplast oder Zellwand.",
    "expected": [
      "clarify"
    ]
  },
  {
    "id": "r5-tone-13-5",
    "group": "tone-incorrect",
    "field": "tonoplast",
    "text": "Der Name, den ich hier benutzen würde, lautet nicht Tonoplast.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r5-tone-14-1",
    "group": "tone-correct",
    "field": "tonoplast",
    "text": "Ich würde als biologischen Fachausdruck Tonoplast einsetzen.",
    "expected": [
      "correct"
    ]
  },
  {
    "id": "r5-tone-14-2",
    "group": "tone-incorrect",
    "field": "tonoplast",
    "text": "Ich würde als biologischen Fachausdruck Zellwand einsetzen.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r5-tone-14-3",
    "group": "tone-partial",
    "field": "tonoplast",
    "text": "Ich würde als biologischen Fachausdruck Membran einsetzen.",
    "expected": [
      "partial"
    ]
  },
  {
    "id": "r5-tone-14-4",
    "group": "tone-clarify",
    "field": "tonoplast",
    "text": "Ich würde als biologischen Fachausdruck Tonoplast oder Zellwand einsetzen.",
    "expected": [
      "clarify"
    ]
  },
  {
    "id": "r5-tone-14-5",
    "group": "tone-incorrect",
    "field": "tonoplast",
    "text": "Ich würde als biologischen Fachausdruck nicht Tonoplast einsetzen.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r5-tone-15-1",
    "group": "tone-correct",
    "field": "tonoplast",
    "text": "Mein Lösungswort zur Namensfrage wäre hier Tonoplast.",
    "expected": [
      "correct"
    ]
  },
  {
    "id": "r5-tone-15-2",
    "group": "tone-incorrect",
    "field": "tonoplast",
    "text": "Mein Lösungswort zur Namensfrage wäre hier Zellwand.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r5-tone-15-3",
    "group": "tone-partial",
    "field": "tonoplast",
    "text": "Mein Lösungswort zur Namensfrage wäre hier Membran.",
    "expected": [
      "partial"
    ]
  },
  {
    "id": "r5-tone-15-4",
    "group": "tone-clarify",
    "field": "tonoplast",
    "text": "Mein Lösungswort zur Namensfrage wäre hier Tonoplast oder Zellwand.",
    "expected": [
      "clarify"
    ]
  },
  {
    "id": "r5-tone-15-5",
    "group": "tone-incorrect",
    "field": "tonoplast",
    "text": "Mein Lösungswort zur Namensfrage wäre hier nicht Tonoplast.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r5-tone-16-1",
    "group": "tone-correct",
    "field": "tonoplast",
    "text": "Mit der Bezeichnung Tonoplast würde ich die Teilfrage lösen.",
    "expected": [
      "correct"
    ]
  },
  {
    "id": "r5-tone-16-2",
    "group": "tone-incorrect",
    "field": "tonoplast",
    "text": "Mit der Bezeichnung Zellwand würde ich die Teilfrage lösen.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r5-tone-16-3",
    "group": "tone-partial",
    "field": "tonoplast",
    "text": "Mit der Bezeichnung Membran würde ich die Teilfrage lösen.",
    "expected": [
      "partial"
    ]
  },
  {
    "id": "r5-tone-16-4",
    "group": "tone-clarify",
    "field": "tonoplast",
    "text": "Mit der Bezeichnung Tonoplast oder Zellwand würde ich die Teilfrage lösen.",
    "expected": [
      "clarify"
    ]
  },
  {
    "id": "r5-tone-16-5",
    "group": "tone-incorrect",
    "field": "tonoplast",
    "text": "Mit der Bezeichnung nicht Tonoplast würde ich die Teilfrage lösen.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r5-tone-17-1",
    "group": "tone-correct",
    "field": "tonoplast",
    "text": "Das nennt man bei dieser Benennung Tonoplast.",
    "expected": [
      "correct"
    ]
  },
  {
    "id": "r5-tone-17-2",
    "group": "tone-incorrect",
    "field": "tonoplast",
    "text": "Das nennt man bei dieser Benennung Zellwand.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r5-tone-17-3",
    "group": "tone-partial",
    "field": "tonoplast",
    "text": "Das nennt man bei dieser Benennung Membran.",
    "expected": [
      "partial"
    ]
  },
  {
    "id": "r5-tone-17-4",
    "group": "tone-clarify",
    "field": "tonoplast",
    "text": "Das nennt man bei dieser Benennung Tonoplast oder Zellwand.",
    "expected": [
      "clarify"
    ]
  },
  {
    "id": "r5-tone-17-5",
    "group": "tone-incorrect",
    "field": "tonoplast",
    "text": "Das nennt man bei dieser Benennung nicht Tonoplast.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r5-tone-18-1",
    "group": "tone-correct",
    "field": "tonoplast",
    "text": "Die gesuchte Benennung würde bei mir Tonoplast lauten.",
    "expected": [
      "correct"
    ]
  },
  {
    "id": "r5-tone-18-2",
    "group": "tone-incorrect",
    "field": "tonoplast",
    "text": "Die gesuchte Benennung würde bei mir Zellwand lauten.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r5-tone-18-3",
    "group": "tone-partial",
    "field": "tonoplast",
    "text": "Die gesuchte Benennung würde bei mir Membran lauten.",
    "expected": [
      "partial"
    ]
  },
  {
    "id": "r5-tone-18-4",
    "group": "tone-clarify",
    "field": "tonoplast",
    "text": "Die gesuchte Benennung würde bei mir Tonoplast oder Zellwand lauten.",
    "expected": [
      "clarify"
    ]
  },
  {
    "id": "r5-tone-18-5",
    "group": "tone-incorrect",
    "field": "tonoplast",
    "text": "Die gesuchte Benennung würde bei mir nicht Tonoplast lauten.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r5-tone-19-1",
    "group": "tone-correct",
    "field": "tonoplast",
    "text": "Der passende biologische Name wäre für mich Tonoplast.",
    "expected": [
      "correct"
    ]
  },
  {
    "id": "r5-tone-19-2",
    "group": "tone-incorrect",
    "field": "tonoplast",
    "text": "Der passende biologische Name wäre für mich Zellwand.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r5-tone-19-3",
    "group": "tone-partial",
    "field": "tonoplast",
    "text": "Der passende biologische Name wäre für mich Membran.",
    "expected": [
      "partial"
    ]
  },
  {
    "id": "r5-tone-19-4",
    "group": "tone-clarify",
    "field": "tonoplast",
    "text": "Der passende biologische Name wäre für mich Tonoplast oder Zellwand.",
    "expected": [
      "clarify"
    ]
  },
  {
    "id": "r5-tone-19-5",
    "group": "tone-incorrect",
    "field": "tonoplast",
    "text": "Der passende biologische Name wäre für mich nicht Tonoplast.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r5-tone-20-1",
    "group": "tone-correct",
    "field": "tonoplast",
    "text": "Ich bin nicht ganz sicher, aber ich würde Tonoplast nennen.",
    "expected": [
      "correct"
    ]
  },
  {
    "id": "r5-tone-20-2",
    "group": "tone-incorrect",
    "field": "tonoplast",
    "text": "Ich bin nicht ganz sicher, aber ich würde Zellwand nennen.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r5-tone-20-3",
    "group": "tone-partial",
    "field": "tonoplast",
    "text": "Ich bin nicht ganz sicher, aber ich würde Membran nennen.",
    "expected": [
      "partial"
    ]
  },
  {
    "id": "r5-tone-20-4",
    "group": "tone-clarify",
    "field": "tonoplast",
    "text": "Ich bin nicht ganz sicher, aber ich würde Tonoplast oder Zellwand nennen.",
    "expected": [
      "clarify"
    ]
  },
  {
    "id": "r5-tone-20-5",
    "group": "tone-incorrect",
    "field": "tonoplast",
    "text": "Ich bin nicht ganz sicher, aber ich würde nicht Tonoplast nennen.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r5-tone-21-1",
    "group": "tone-correct",
    "field": "tonoplast",
    "text": "Tonoplast wäre das Lösungswort, das ich dafür nehmen würde.",
    "expected": [
      "correct"
    ]
  },
  {
    "id": "r5-tone-21-2",
    "group": "tone-incorrect",
    "field": "tonoplast",
    "text": "Zellwand wäre das Lösungswort, das ich dafür nehmen würde.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r5-tone-21-3",
    "group": "tone-partial",
    "field": "tonoplast",
    "text": "Membran wäre das Lösungswort, das ich dafür nehmen würde.",
    "expected": [
      "partial"
    ]
  },
  {
    "id": "r5-tone-21-4",
    "group": "tone-clarify",
    "field": "tonoplast",
    "text": "Tonoplast oder Zellwand wäre das Lösungswort, das ich dafür nehmen würde.",
    "expected": [
      "clarify"
    ]
  },
  {
    "id": "r5-tone-21-5",
    "group": "tone-incorrect",
    "field": "tonoplast",
    "text": "nicht Tonoplast wäre das Lösungswort, das ich dafür nehmen würde.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r5-tone-22-1",
    "group": "tone-correct",
    "field": "tonoplast",
    "text": "Bei der Namensfrage tippe ich auf den Fachausdruck Tonoplast.",
    "expected": [
      "correct"
    ]
  },
  {
    "id": "r5-tone-22-2",
    "group": "tone-incorrect",
    "field": "tonoplast",
    "text": "Bei der Namensfrage tippe ich auf den Fachausdruck Zellwand.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r5-tone-22-3",
    "group": "tone-partial",
    "field": "tonoplast",
    "text": "Bei der Namensfrage tippe ich auf den Fachausdruck Membran.",
    "expected": [
      "partial"
    ]
  },
  {
    "id": "r5-tone-22-4",
    "group": "tone-clarify",
    "field": "tonoplast",
    "text": "Bei der Namensfrage tippe ich auf den Fachausdruck Tonoplast oder Zellwand.",
    "expected": [
      "clarify"
    ]
  },
  {
    "id": "r5-tone-22-5",
    "group": "tone-incorrect",
    "field": "tonoplast",
    "text": "Bei der Namensfrage tippe ich auf den Fachausdruck nicht Tonoplast.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r5-tone-23-1",
    "group": "tone-correct",
    "field": "tonoplast",
    "text": "Tonoplast ist der Name, den ich zur Benennung wählen würde.",
    "expected": [
      "correct"
    ]
  },
  {
    "id": "r5-tone-23-2",
    "group": "tone-incorrect",
    "field": "tonoplast",
    "text": "Zellwand ist der Name, den ich zur Benennung wählen würde.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r5-tone-23-3",
    "group": "tone-partial",
    "field": "tonoplast",
    "text": "Membran ist der Name, den ich zur Benennung wählen würde.",
    "expected": [
      "partial"
    ]
  },
  {
    "id": "r5-tone-23-4",
    "group": "tone-clarify",
    "field": "tonoplast",
    "text": "Tonoplast oder Zellwand ist der Name, den ich zur Benennung wählen würde.",
    "expected": [
      "clarify"
    ]
  },
  {
    "id": "r5-tone-23-5",
    "group": "tone-incorrect",
    "field": "tonoplast",
    "text": "nicht Tonoplast ist der Name, den ich zur Benennung wählen würde.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r5-tone-24-1",
    "group": "tone-correct",
    "field": "tonoplast",
    "text": "Ich nehme für die Antwort auf die Namensfrage den Begriff Tonoplast.",
    "expected": [
      "correct"
    ]
  },
  {
    "id": "r5-tone-24-2",
    "group": "tone-incorrect",
    "field": "tonoplast",
    "text": "Ich nehme für die Antwort auf die Namensfrage den Begriff Zellwand.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r5-tone-24-3",
    "group": "tone-partial",
    "field": "tonoplast",
    "text": "Ich nehme für die Antwort auf die Namensfrage den Begriff Membran.",
    "expected": [
      "partial"
    ]
  },
  {
    "id": "r5-tone-24-4",
    "group": "tone-clarify",
    "field": "tonoplast",
    "text": "Ich nehme für die Antwort auf die Namensfrage den Begriff Tonoplast oder Zellwand.",
    "expected": [
      "clarify"
    ]
  },
  {
    "id": "r5-tone-24-5",
    "group": "tone-incorrect",
    "field": "tonoplast",
    "text": "Ich nehme für die Antwort auf die Namensfrage den Begriff nicht Tonoplast.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r5-tone-25-1",
    "group": "tone-correct",
    "field": "tonoplast",
    "text": "Ich vermute bei dem gesuchten Fachausdruck den Namen Tonoplast.",
    "expected": [
      "correct"
    ]
  },
  {
    "id": "r5-tone-25-2",
    "group": "tone-incorrect",
    "field": "tonoplast",
    "text": "Ich vermute bei dem gesuchten Fachausdruck den Namen Zellwand.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r5-tone-25-3",
    "group": "tone-partial",
    "field": "tonoplast",
    "text": "Ich vermute bei dem gesuchten Fachausdruck den Namen Membran.",
    "expected": [
      "partial"
    ]
  },
  {
    "id": "r5-tone-25-4",
    "group": "tone-clarify",
    "field": "tonoplast",
    "text": "Ich vermute bei dem gesuchten Fachausdruck den Namen Tonoplast oder Zellwand.",
    "expected": [
      "clarify"
    ]
  },
  {
    "id": "r5-tone-25-5",
    "group": "tone-incorrect",
    "field": "tonoplast",
    "text": "Ich vermute bei dem gesuchten Fachausdruck den Namen nicht Tonoplast.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r5-tone-26-1",
    "group": "tone-correct",
    "field": "tonoplast",
    "text": "Der Name, den ich bei dieser Frage nehmen würde, heißt Tonoplast.",
    "expected": [
      "correct"
    ]
  },
  {
    "id": "r5-tone-26-2",
    "group": "tone-incorrect",
    "field": "tonoplast",
    "text": "Der Name, den ich bei dieser Frage nehmen würde, heißt Zellwand.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r5-tone-26-3",
    "group": "tone-partial",
    "field": "tonoplast",
    "text": "Der Name, den ich bei dieser Frage nehmen würde, heißt Membran.",
    "expected": [
      "partial"
    ]
  },
  {
    "id": "r5-tone-26-4",
    "group": "tone-clarify",
    "field": "tonoplast",
    "text": "Der Name, den ich bei dieser Frage nehmen würde, heißt Tonoplast oder Zellwand.",
    "expected": [
      "clarify"
    ]
  },
  {
    "id": "r5-tone-26-5",
    "group": "tone-incorrect",
    "field": "tonoplast",
    "text": "Der Name, den ich bei dieser Frage nehmen würde, heißt nicht Tonoplast.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r5-tone-27-1",
    "group": "tone-correct",
    "field": "tonoplast",
    "text": "Ich würde auf die Frage nach dem Fachnamen Tonoplast antworten.",
    "expected": [
      "correct"
    ]
  },
  {
    "id": "r5-tone-27-2",
    "group": "tone-incorrect",
    "field": "tonoplast",
    "text": "Ich würde auf die Frage nach dem Fachnamen Zellwand antworten.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r5-tone-27-3",
    "group": "tone-partial",
    "field": "tonoplast",
    "text": "Ich würde auf die Frage nach dem Fachnamen Membran antworten.",
    "expected": [
      "partial"
    ]
  },
  {
    "id": "r5-tone-27-4",
    "group": "tone-clarify",
    "field": "tonoplast",
    "text": "Ich würde auf die Frage nach dem Fachnamen Tonoplast oder Zellwand antworten.",
    "expected": [
      "clarify"
    ]
  },
  {
    "id": "r5-tone-27-5",
    "group": "tone-incorrect",
    "field": "tonoplast",
    "text": "Ich würde auf die Frage nach dem Fachnamen nicht Tonoplast antworten.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r5-tone-28-1",
    "group": "tone-correct",
    "field": "tonoplast",
    "text": "Ich würde zur Benennung hier das Wort Tonoplast einsetzen.",
    "expected": [
      "correct"
    ]
  },
  {
    "id": "r5-tone-28-2",
    "group": "tone-incorrect",
    "field": "tonoplast",
    "text": "Ich würde zur Benennung hier das Wort Zellwand einsetzen.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r5-tone-28-3",
    "group": "tone-partial",
    "field": "tonoplast",
    "text": "Ich würde zur Benennung hier das Wort Membran einsetzen.",
    "expected": [
      "partial"
    ]
  },
  {
    "id": "r5-tone-28-4",
    "group": "tone-clarify",
    "field": "tonoplast",
    "text": "Ich würde zur Benennung hier das Wort Tonoplast oder Zellwand einsetzen.",
    "expected": [
      "clarify"
    ]
  },
  {
    "id": "r5-tone-28-5",
    "group": "tone-incorrect",
    "field": "tonoplast",
    "text": "Ich würde zur Benennung hier das Wort nicht Tonoplast einsetzen.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r5-tone-29-1",
    "group": "tone-correct",
    "field": "tonoplast",
    "text": "Ich trage als Lösungswort für die Teilfrage Tonoplast ein.",
    "expected": [
      "correct"
    ]
  },
  {
    "id": "r5-tone-29-2",
    "group": "tone-incorrect",
    "field": "tonoplast",
    "text": "Ich trage als Lösungswort für die Teilfrage Zellwand ein.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r5-tone-29-3",
    "group": "tone-partial",
    "field": "tonoplast",
    "text": "Ich trage als Lösungswort für die Teilfrage Membran ein.",
    "expected": [
      "partial"
    ]
  },
  {
    "id": "r5-tone-29-4",
    "group": "tone-clarify",
    "field": "tonoplast",
    "text": "Ich trage als Lösungswort für die Teilfrage Tonoplast oder Zellwand ein.",
    "expected": [
      "clarify"
    ]
  },
  {
    "id": "r5-tone-29-5",
    "group": "tone-incorrect",
    "field": "tonoplast",
    "text": "Ich trage als Lösungswort für die Teilfrage nicht Tonoplast ein.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r5-tone-30-1",
    "group": "tone-correct",
    "field": "tonoplast",
    "text": "Der biologische Begriff dafür müsste Tonoplast sein.",
    "expected": [
      "correct"
    ]
  },
  {
    "id": "r5-tone-30-2",
    "group": "tone-incorrect",
    "field": "tonoplast",
    "text": "Der biologische Begriff dafür müsste Zellwand sein.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r5-tone-30-3",
    "group": "tone-partial",
    "field": "tonoplast",
    "text": "Der biologische Begriff dafür müsste Membran sein.",
    "expected": [
      "partial"
    ]
  },
  {
    "id": "r5-tone-30-4",
    "group": "tone-clarify",
    "field": "tonoplast",
    "text": "Der biologische Begriff dafür müsste Tonoplast oder Zellwand sein.",
    "expected": [
      "clarify"
    ]
  },
  {
    "id": "r5-tone-30-5",
    "group": "tone-incorrect",
    "field": "tonoplast",
    "text": "Der biologische Begriff dafür müsste nicht Tonoplast sein.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r5-tone-31-1",
    "group": "tone-correct",
    "field": "tonoplast",
    "text": "Den gesuchten Namen würde ich mit Tonoplast angeben.",
    "expected": [
      "correct"
    ]
  },
  {
    "id": "r5-tone-31-2",
    "group": "tone-incorrect",
    "field": "tonoplast",
    "text": "Den gesuchten Namen würde ich mit Zellwand angeben.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r5-tone-31-3",
    "group": "tone-partial",
    "field": "tonoplast",
    "text": "Den gesuchten Namen würde ich mit Membran angeben.",
    "expected": [
      "partial"
    ]
  },
  {
    "id": "r5-tone-31-4",
    "group": "tone-clarify",
    "field": "tonoplast",
    "text": "Den gesuchten Namen würde ich mit Tonoplast oder Zellwand angeben.",
    "expected": [
      "clarify"
    ]
  },
  {
    "id": "r5-tone-31-5",
    "group": "tone-incorrect",
    "field": "tonoplast",
    "text": "Den gesuchten Namen würde ich mit nicht Tonoplast angeben.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r5-tone-32-1",
    "group": "tone-correct",
    "field": "tonoplast",
    "text": "Ich würde den Namen Tonoplast bei dieser Benennung benutzen.",
    "expected": [
      "correct"
    ]
  },
  {
    "id": "r5-tone-32-2",
    "group": "tone-incorrect",
    "field": "tonoplast",
    "text": "Ich würde den Namen Zellwand bei dieser Benennung benutzen.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r5-tone-32-3",
    "group": "tone-partial",
    "field": "tonoplast",
    "text": "Ich würde den Namen Membran bei dieser Benennung benutzen.",
    "expected": [
      "partial"
    ]
  },
  {
    "id": "r5-tone-32-4",
    "group": "tone-clarify",
    "field": "tonoplast",
    "text": "Ich würde den Namen Tonoplast oder Zellwand bei dieser Benennung benutzen.",
    "expected": [
      "clarify"
    ]
  },
  {
    "id": "r5-tone-32-5",
    "group": "tone-incorrect",
    "field": "tonoplast",
    "text": "Ich würde den Namen nicht Tonoplast bei dieser Benennung benutzen.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r5-tone-contradiction-1",
    "group": "tone-contradiction",
    "field": "tonoplast",
    "text": "Als Bezeichnung für die Vakuolengrenze passt Tonoplast. Tonoplast ist keine Membran.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r5-tone-extra-1",
    "group": "tone-extra",
    "field": "tonoplast",
    "text": "Als Bezeichnung für die Vakuolengrenze passt Tonoplast. Alle Zellkerne sind Viren.",
    "expected": [
      "clarify"
    ]
  },
  {
    "id": "r5-tone-contradiction-2",
    "group": "tone-contradiction",
    "field": "tonoplast",
    "text": "Der biologische Name für diese Membran lautet Vakuolenmembran. Tonoplast ist keine Membran.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r5-tone-extra-2",
    "group": "tone-extra",
    "field": "tonoplast",
    "text": "Der biologische Name für diese Membran lautet Vakuolenmembran. Alle Zellkerne sind Viren.",
    "expected": [
      "clarify"
    ]
  },
  {
    "id": "r5-tone-contradiction-3",
    "group": "tone-contradiction",
    "field": "tonoplast",
    "text": "Ich wähle für die Grenze um den Vakuolenraum den Begriff Tonoplast. Tonoplast ist keine Membran.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r5-tone-extra-3",
    "group": "tone-extra",
    "field": "tonoplast",
    "text": "Ich wähle für die Grenze um den Vakuolenraum den Begriff Tonoplast. Alle Zellkerne sind Viren.",
    "expected": [
      "clarify"
    ]
  },
  {
    "id": "r5-tone-contradiction-4",
    "group": "tone-contradiction",
    "field": "tonoplast",
    "text": "Ich benenne diese Membran mit Vakuolenmembran. Tonoplast ist keine Membran.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r5-tone-extra-4",
    "group": "tone-extra",
    "field": "tonoplast",
    "text": "Ich benenne diese Membran mit Vakuolenmembran. Alle Zellkerne sind Viren.",
    "expected": [
      "clarify"
    ]
  },
  {
    "id": "r5-tone-contradiction-5",
    "group": "tone-contradiction",
    "field": "tonoplast",
    "text": "Tonoplast ist die Benennung, die ich für diese Grenze wählen würde. Tonoplast ist keine Membran.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r5-tone-extra-5",
    "group": "tone-extra",
    "field": "tonoplast",
    "text": "Tonoplast ist die Benennung, die ich für diese Grenze wählen würde. Alle Zellkerne sind Viren.",
    "expected": [
      "clarify"
    ]
  },
  {
    "id": "r5-tone-contradiction-6",
    "group": "tone-contradiction",
    "field": "tonoplast",
    "text": "Mein Fachausdruck für die Vakuolengrenze wäre Tonoplast. Tonoplast ist keine Membran.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r5-tone-extra-6",
    "group": "tone-extra",
    "field": "tonoplast",
    "text": "Mein Fachausdruck für die Vakuolengrenze wäre Tonoplast. Alle Zellkerne sind Viren.",
    "expected": [
      "clarify"
    ]
  },
  {
    "id": "r5-tone-contradiction-7",
    "group": "tone-contradiction",
    "field": "tonoplast",
    "text": "Bei der gesuchten Membranbezeichnung denke ich an Vakuolenmembran. Tonoplast ist keine Membran.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r5-tone-extra-7",
    "group": "tone-extra",
    "field": "tonoplast",
    "text": "Bei der gesuchten Membranbezeichnung denke ich an Vakuolenmembran. Alle Zellkerne sind Viren.",
    "expected": [
      "clarify"
    ]
  },
  {
    "id": "r5-tone-contradiction-8",
    "group": "tone-contradiction",
    "field": "tonoplast",
    "text": "Ich ordne dieser Grenze den Namen Tonoplast zu. Tonoplast ist keine Membran.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r5-tone-extra-8",
    "group": "tone-extra",
    "field": "tonoplast",
    "text": "Ich ordne dieser Grenze den Namen Tonoplast zu. Alle Zellkerne sind Viren.",
    "expected": [
      "clarify"
    ]
  },
  {
    "id": "r5-tone-contradiction-9",
    "group": "tone-contradiction",
    "field": "tonoplast",
    "text": "Für die Grenze um die Vakuole ist Vakuolenmembran das richtige Fachwort. Tonoplast ist keine Membran.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r5-tone-extra-9",
    "group": "tone-extra",
    "field": "tonoplast",
    "text": "Für die Grenze um die Vakuole ist Vakuolenmembran das richtige Fachwort. Alle Zellkerne sind Viren.",
    "expected": [
      "clarify"
    ]
  },
  {
    "id": "r5-tone-contradiction-10",
    "group": "tone-contradiction",
    "field": "tonoplast",
    "text": "Den Namen Tonoplast würde ich für die hervorgehobene Membran hinschreiben. Tonoplast ist keine Membran.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r5-tone-extra-10",
    "group": "tone-extra",
    "field": "tonoplast",
    "text": "Den Namen Tonoplast würde ich für die hervorgehobene Membran hinschreiben. Alle Zellkerne sind Viren.",
    "expected": [
      "clarify"
    ]
  },
  {
    "id": "r5-tone-contradiction-11",
    "group": "tone-contradiction",
    "field": "tonoplast",
    "text": "Bei der Benennung entscheide ich mich für das Lösungswort Tonoplast. Tonoplast ist keine Membran.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r5-tone-extra-11",
    "group": "tone-extra",
    "field": "tonoplast",
    "text": "Bei der Benennung entscheide ich mich für das Lösungswort Tonoplast. Alle Zellkerne sind Viren.",
    "expected": [
      "clarify"
    ]
  },
  {
    "id": "r5-tone-contradiction-12",
    "group": "tone-contradiction",
    "field": "tonoplast",
    "text": "Ich bin nicht sicher, aber ich wähle den Namen Tonoplast. Tonoplast ist keine Membran.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r5-tone-extra-12",
    "group": "tone-extra",
    "field": "tonoplast",
    "text": "Ich bin nicht sicher, aber ich wähle den Namen Tonoplast. Alle Zellkerne sind Viren.",
    "expected": [
      "clarify"
    ]
  },
  {
    "id": "r5-tone-contradiction-13",
    "group": "tone-contradiction",
    "field": "tonoplast",
    "text": "Der Name, den ich hier benutzen würde, lautet Tonoplast. Tonoplast ist keine Membran.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r5-tone-extra-13",
    "group": "tone-extra",
    "field": "tonoplast",
    "text": "Der Name, den ich hier benutzen würde, lautet Tonoplast. Alle Zellkerne sind Viren.",
    "expected": [
      "clarify"
    ]
  },
  {
    "id": "r5-tone-contradiction-14",
    "group": "tone-contradiction",
    "field": "tonoplast",
    "text": "Ich würde als biologischen Fachausdruck Tonoplast einsetzen. Tonoplast ist keine Membran.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r5-tone-extra-14",
    "group": "tone-extra",
    "field": "tonoplast",
    "text": "Ich würde als biologischen Fachausdruck Tonoplast einsetzen. Alle Zellkerne sind Viren.",
    "expected": [
      "clarify"
    ]
  },
  {
    "id": "r5-tone-contradiction-15",
    "group": "tone-contradiction",
    "field": "tonoplast",
    "text": "Mein Lösungswort zur Namensfrage wäre hier Tonoplast. Tonoplast ist keine Membran.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r5-tone-extra-15",
    "group": "tone-extra",
    "field": "tonoplast",
    "text": "Mein Lösungswort zur Namensfrage wäre hier Tonoplast. Alle Zellkerne sind Viren.",
    "expected": [
      "clarify"
    ]
  },
  {
    "id": "r5-tone-contradiction-16",
    "group": "tone-contradiction",
    "field": "tonoplast",
    "text": "Mit der Bezeichnung Tonoplast würde ich die Teilfrage lösen. Tonoplast ist keine Membran.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r5-tone-extra-16",
    "group": "tone-extra",
    "field": "tonoplast",
    "text": "Mit der Bezeichnung Tonoplast würde ich die Teilfrage lösen. Alle Zellkerne sind Viren.",
    "expected": [
      "clarify"
    ]
  },
  {
    "id": "r5-tone-contradiction-17",
    "group": "tone-contradiction",
    "field": "tonoplast",
    "text": "Das nennt man bei dieser Benennung Tonoplast. Tonoplast ist keine Membran.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r5-tone-extra-17",
    "group": "tone-extra",
    "field": "tonoplast",
    "text": "Das nennt man bei dieser Benennung Tonoplast. Alle Zellkerne sind Viren.",
    "expected": [
      "clarify"
    ]
  },
  {
    "id": "r5-tone-contradiction-18",
    "group": "tone-contradiction",
    "field": "tonoplast",
    "text": "Die gesuchte Benennung würde bei mir Tonoplast lauten. Tonoplast ist keine Membran.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r5-tone-extra-18",
    "group": "tone-extra",
    "field": "tonoplast",
    "text": "Die gesuchte Benennung würde bei mir Tonoplast lauten. Alle Zellkerne sind Viren.",
    "expected": [
      "clarify"
    ]
  },
  {
    "id": "r5-tone-contradiction-19",
    "group": "tone-contradiction",
    "field": "tonoplast",
    "text": "Der passende biologische Name wäre für mich Tonoplast. Tonoplast ist keine Membran.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r5-tone-extra-19",
    "group": "tone-extra",
    "field": "tonoplast",
    "text": "Der passende biologische Name wäre für mich Tonoplast. Alle Zellkerne sind Viren.",
    "expected": [
      "clarify"
    ]
  },
  {
    "id": "r5-tone-contradiction-20",
    "group": "tone-contradiction",
    "field": "tonoplast",
    "text": "Ich bin nicht ganz sicher, aber ich würde Tonoplast nennen. Tonoplast ist keine Membran.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r5-tone-extra-20",
    "group": "tone-extra",
    "field": "tonoplast",
    "text": "Ich bin nicht ganz sicher, aber ich würde Tonoplast nennen. Alle Zellkerne sind Viren.",
    "expected": [
      "clarify"
    ]
  },
  {
    "id": "r5-tone-contradiction-21",
    "group": "tone-contradiction",
    "field": "tonoplast",
    "text": "Tonoplast wäre das Lösungswort, das ich dafür nehmen würde. Tonoplast ist keine Membran.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r5-tone-extra-21",
    "group": "tone-extra",
    "field": "tonoplast",
    "text": "Tonoplast wäre das Lösungswort, das ich dafür nehmen würde. Alle Zellkerne sind Viren.",
    "expected": [
      "clarify"
    ]
  },
  {
    "id": "r5-tone-contradiction-22",
    "group": "tone-contradiction",
    "field": "tonoplast",
    "text": "Bei der Namensfrage tippe ich auf den Fachausdruck Tonoplast. Tonoplast ist keine Membran.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r5-tone-extra-22",
    "group": "tone-extra",
    "field": "tonoplast",
    "text": "Bei der Namensfrage tippe ich auf den Fachausdruck Tonoplast. Alle Zellkerne sind Viren.",
    "expected": [
      "clarify"
    ]
  },
  {
    "id": "r5-tone-contradiction-23",
    "group": "tone-contradiction",
    "field": "tonoplast",
    "text": "Tonoplast ist der Name, den ich zur Benennung wählen würde. Tonoplast ist keine Membran.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r5-tone-extra-23",
    "group": "tone-extra",
    "field": "tonoplast",
    "text": "Tonoplast ist der Name, den ich zur Benennung wählen würde. Alle Zellkerne sind Viren.",
    "expected": [
      "clarify"
    ]
  },
  {
    "id": "r5-tone-contradiction-24",
    "group": "tone-contradiction",
    "field": "tonoplast",
    "text": "Ich nehme für die Antwort auf die Namensfrage den Begriff Tonoplast. Tonoplast ist keine Membran.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r5-tone-extra-24",
    "group": "tone-extra",
    "field": "tonoplast",
    "text": "Ich nehme für die Antwort auf die Namensfrage den Begriff Tonoplast. Alle Zellkerne sind Viren.",
    "expected": [
      "clarify"
    ]
  },
  {
    "id": "r5-tone-contradiction-25",
    "group": "tone-contradiction",
    "field": "tonoplast",
    "text": "Ich vermute bei dem gesuchten Fachausdruck den Namen Tonoplast. Tonoplast ist keine Membran.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r5-tone-extra-25",
    "group": "tone-extra",
    "field": "tonoplast",
    "text": "Ich vermute bei dem gesuchten Fachausdruck den Namen Tonoplast. Alle Zellkerne sind Viren.",
    "expected": [
      "clarify"
    ]
  },
  {
    "id": "r5-tone-contradiction-26",
    "group": "tone-contradiction",
    "field": "tonoplast",
    "text": "Der Name, den ich bei dieser Frage nehmen würde, heißt Tonoplast. Tonoplast ist keine Membran.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r5-tone-extra-26",
    "group": "tone-extra",
    "field": "tonoplast",
    "text": "Der Name, den ich bei dieser Frage nehmen würde, heißt Tonoplast. Alle Zellkerne sind Viren.",
    "expected": [
      "clarify"
    ]
  },
  {
    "id": "r5-tone-contradiction-27",
    "group": "tone-contradiction",
    "field": "tonoplast",
    "text": "Ich würde auf die Frage nach dem Fachnamen Tonoplast antworten. Tonoplast ist keine Membran.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r5-tone-extra-27",
    "group": "tone-extra",
    "field": "tonoplast",
    "text": "Ich würde auf die Frage nach dem Fachnamen Tonoplast antworten. Alle Zellkerne sind Viren.",
    "expected": [
      "clarify"
    ]
  },
  {
    "id": "r5-tone-contradiction-28",
    "group": "tone-contradiction",
    "field": "tonoplast",
    "text": "Ich würde zur Benennung hier das Wort Tonoplast einsetzen. Tonoplast ist keine Membran.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r5-tone-extra-28",
    "group": "tone-extra",
    "field": "tonoplast",
    "text": "Ich würde zur Benennung hier das Wort Tonoplast einsetzen. Alle Zellkerne sind Viren.",
    "expected": [
      "clarify"
    ]
  },
  {
    "id": "r5-tone-contradiction-29",
    "group": "tone-contradiction",
    "field": "tonoplast",
    "text": "Ich trage als Lösungswort für die Teilfrage Tonoplast ein. Tonoplast ist keine Membran.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r5-tone-extra-29",
    "group": "tone-extra",
    "field": "tonoplast",
    "text": "Ich trage als Lösungswort für die Teilfrage Tonoplast ein. Alle Zellkerne sind Viren.",
    "expected": [
      "clarify"
    ]
  },
  {
    "id": "r5-tone-contradiction-30",
    "group": "tone-contradiction",
    "field": "tonoplast",
    "text": "Der biologische Begriff dafür müsste Tonoplast sein. Tonoplast ist keine Membran.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r5-tone-extra-30",
    "group": "tone-extra",
    "field": "tonoplast",
    "text": "Der biologische Begriff dafür müsste Tonoplast sein. Alle Zellkerne sind Viren.",
    "expected": [
      "clarify"
    ]
  },
  {
    "id": "r5-tone-contradiction-31",
    "group": "tone-contradiction",
    "field": "tonoplast",
    "text": "Den gesuchten Namen würde ich mit Tonoplast angeben. Tonoplast ist keine Membran.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r5-tone-extra-31",
    "group": "tone-extra",
    "field": "tonoplast",
    "text": "Den gesuchten Namen würde ich mit Tonoplast angeben. Alle Zellkerne sind Viren.",
    "expected": [
      "clarify"
    ]
  },
  {
    "id": "r5-tone-contradiction-32",
    "group": "tone-contradiction",
    "field": "tonoplast",
    "text": "Ich würde den Namen Tonoplast bei dieser Benennung benutzen. Tonoplast ist keine Membran.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r5-tone-extra-32",
    "group": "tone-extra",
    "field": "tonoplast",
    "text": "Ich würde den Namen Tonoplast bei dieser Benennung benutzen. Alle Zellkerne sind Viren.",
    "expected": [
      "clarify"
    ]
  },
  {
    "id": "r5-question-osmosis-224",
    "group": "question-pair",
    "field": "osmosis",
    "text": "Vielleicht nicht Osmose? Vielleicht Endocytose?",
    "expected": [
      "clarify"
    ]
  },
  {
    "id": "r5-question-osmosis-224-predicate",
    "group": "question-predicate",
    "field": "osmosis",
    "text": "Vielleicht nicht Osmose? Vielleicht Endocytose? Osmose ist aktiver Transport.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r5-question-osmosis-226",
    "group": "question-pair",
    "field": "osmosis",
    "text": "Vielleicht Endocytose? Vielleicht nicht Osmose?",
    "expected": [
      "clarify"
    ]
  },
  {
    "id": "r5-question-osmosis-226-predicate",
    "group": "question-predicate",
    "field": "osmosis",
    "text": "Vielleicht Endocytose? Vielleicht nicht Osmose? Osmose ist aktiver Transport.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r5-question-osmosis-228",
    "group": "question-pair",
    "field": "osmosis",
    "text": "Vielleicht nicht Osmose? Vielleicht Osmose?",
    "expected": [
      "clarify"
    ]
  },
  {
    "id": "r5-question-osmosis-228-predicate",
    "group": "question-predicate",
    "field": "osmosis",
    "text": "Vielleicht nicht Osmose? Vielleicht Osmose? Osmose ist aktiver Transport.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r5-question-osmosis-230",
    "group": "question-pair",
    "field": "osmosis",
    "text": "Vielleicht Osmose? Vielleicht nicht Osmose?",
    "expected": [
      "clarify"
    ]
  },
  {
    "id": "r5-question-osmosis-230-predicate",
    "group": "question-predicate",
    "field": "osmosis",
    "text": "Vielleicht Osmose? Vielleicht nicht Osmose? Osmose ist aktiver Transport.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r5-question-osmosis-232",
    "group": "question-pair",
    "field": "osmosis",
    "text": "Vielleicht nicht Osmose? Vielleicht Osmosse?",
    "expected": [
      "clarify"
    ]
  },
  {
    "id": "r5-question-osmosis-232-predicate",
    "group": "question-predicate",
    "field": "osmosis",
    "text": "Vielleicht nicht Osmose? Vielleicht Osmosse? Osmose ist aktiver Transport.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r5-question-osmosis-234",
    "group": "question-pair",
    "field": "osmosis",
    "text": "Vielleicht Osmosse? Vielleicht nicht Osmose?",
    "expected": [
      "clarify"
    ]
  },
  {
    "id": "r5-question-osmosis-234-predicate",
    "group": "question-predicate",
    "field": "osmosis",
    "text": "Vielleicht Osmosse? Vielleicht nicht Osmose? Osmose ist aktiver Transport.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r5-question-osmosis-236",
    "group": "question-pair",
    "field": "osmosis",
    "text": "Vielleicht Osmose? Vielleicht Osmosse?",
    "expected": [
      "correct"
    ]
  },
  {
    "id": "r5-question-osmosis-236-predicate",
    "group": "question-predicate",
    "field": "osmosis",
    "text": "Vielleicht Osmose? Vielleicht Osmosse? Osmose ist aktiver Transport.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r5-question-osmosis-238",
    "group": "question-pair",
    "field": "osmosis",
    "text": "Vielleicht Endocytose? Vielleicht Endocytose?",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r5-question-osmosis-238-predicate",
    "group": "question-predicate",
    "field": "osmosis",
    "text": "Vielleicht Endocytose? Vielleicht Endocytose? Osmose ist aktiver Transport.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r5-question-osmosis-240",
    "group": "question-pair",
    "field": "osmosis",
    "text": "Vielleicht nicht Osmose? Vielleicht nicht Osmosse?",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r5-question-osmosis-240-predicate",
    "group": "question-predicate",
    "field": "osmosis",
    "text": "Vielleicht nicht Osmose? Vielleicht nicht Osmosse? Osmose ist aktiver Transport.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r5-question-tonoplast-242",
    "group": "question-pair",
    "field": "tonoplast",
    "text": "Vielleicht nicht Tonoplast? Vielleicht Zellwand?",
    "expected": [
      "clarify"
    ]
  },
  {
    "id": "r5-question-tonoplast-242-predicate",
    "group": "question-predicate",
    "field": "tonoplast",
    "text": "Vielleicht nicht Tonoplast? Vielleicht Zellwand? Tonoplast ist keine Membran.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r5-question-tonoplast-244",
    "group": "question-pair",
    "field": "tonoplast",
    "text": "Vielleicht Zellwand? Vielleicht nicht Tonoplast?",
    "expected": [
      "clarify"
    ]
  },
  {
    "id": "r5-question-tonoplast-244-predicate",
    "group": "question-predicate",
    "field": "tonoplast",
    "text": "Vielleicht Zellwand? Vielleicht nicht Tonoplast? Tonoplast ist keine Membran.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r5-question-tonoplast-246",
    "group": "question-pair",
    "field": "tonoplast",
    "text": "Vielleicht nicht Tonoplast? Vielleicht Tonoplast?",
    "expected": [
      "clarify"
    ]
  },
  {
    "id": "r5-question-tonoplast-246-predicate",
    "group": "question-predicate",
    "field": "tonoplast",
    "text": "Vielleicht nicht Tonoplast? Vielleicht Tonoplast? Tonoplast ist keine Membran.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r5-question-tonoplast-248",
    "group": "question-pair",
    "field": "tonoplast",
    "text": "Vielleicht Tonoplast? Vielleicht nicht Tonoplast?",
    "expected": [
      "clarify"
    ]
  },
  {
    "id": "r5-question-tonoplast-248-predicate",
    "group": "question-predicate",
    "field": "tonoplast",
    "text": "Vielleicht Tonoplast? Vielleicht nicht Tonoplast? Tonoplast ist keine Membran.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r5-question-tonoplast-250",
    "group": "question-pair",
    "field": "tonoplast",
    "text": "Vielleicht nicht Tonoplast? Vielleicht Vakuolenmembran?",
    "expected": [
      "clarify"
    ]
  },
  {
    "id": "r5-question-tonoplast-250-predicate",
    "group": "question-predicate",
    "field": "tonoplast",
    "text": "Vielleicht nicht Tonoplast? Vielleicht Vakuolenmembran? Tonoplast ist keine Membran.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r5-question-tonoplast-252",
    "group": "question-pair",
    "field": "tonoplast",
    "text": "Vielleicht Vakuolenmembran? Vielleicht nicht Tonoplast?",
    "expected": [
      "clarify"
    ]
  },
  {
    "id": "r5-question-tonoplast-252-predicate",
    "group": "question-predicate",
    "field": "tonoplast",
    "text": "Vielleicht Vakuolenmembran? Vielleicht nicht Tonoplast? Tonoplast ist keine Membran.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r5-question-tonoplast-254",
    "group": "question-pair",
    "field": "tonoplast",
    "text": "Vielleicht Tonoplast? Vielleicht Vakuolenmembran?",
    "expected": [
      "correct"
    ]
  },
  {
    "id": "r5-question-tonoplast-254-predicate",
    "group": "question-predicate",
    "field": "tonoplast",
    "text": "Vielleicht Tonoplast? Vielleicht Vakuolenmembran? Tonoplast ist keine Membran.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r5-question-tonoplast-256",
    "group": "question-pair",
    "field": "tonoplast",
    "text": "Vielleicht Zellwand? Vielleicht Zellwand?",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r5-question-tonoplast-256-predicate",
    "group": "question-predicate",
    "field": "tonoplast",
    "text": "Vielleicht Zellwand? Vielleicht Zellwand? Tonoplast ist keine Membran.",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r5-question-tonoplast-258",
    "group": "question-pair",
    "field": "tonoplast",
    "text": "Vielleicht nicht Tonoplast? Vielleicht nicht Vakuolenmembran?",
    "expected": [
      "incorrect"
    ]
  },
  {
    "id": "r5-question-tonoplast-258-predicate",
    "group": "question-predicate",
    "field": "tonoplast",
    "text": "Vielleicht nicht Tonoplast? Vielleicht nicht Vakuolenmembran? Tonoplast ist keine Membran.",
    "expected": [
      "incorrect"
    ]
  }
];

export const R5_QUESTION_READINGS = [
  {
    "id": "r4-own-question-osmosis",
    "field": "osmosis",
    "text": "Vielleicht doch keine Osmose? Vielleicht Osmosse?",
    "originalExpected": [
      "incorrect"
    ],
    "decidedExpected": [
      "clarify"
    ],
    "basis": "Two explicitly tentative competing polarities, no decided assertion. Symmetric question reading; previous own literal exclusion interpretation retained."
  },
  {
    "id": "r4-own-question-tonoplast",
    "field": "tonoplast",
    "text": "Vielleicht doch keine Tonoplast? Vielleicht Vakuolenmembran?",
    "originalExpected": [
      "incorrect"
    ],
    "decidedExpected": [
      "clarify"
    ],
    "basis": "Two explicitly tentative competing polarities, no decided assertion. Symmetric question reading; previous own literal exclusion interpretation retained."
  }
] as const;
