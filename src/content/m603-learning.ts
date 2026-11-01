import type { M603Claim, M603Node, M603Relation } from '../domain/m603-contract.ts';

export const M603_NODE_TEXT = Object.freeze({
  A: 'Wasserverlust', B: 'Abnehmendes Vakuolen-/Protoplastvolumen', C: 'Sinkender Turgor',
  D: 'Bei hinreichendem Wasserverlust mögliche Ablösung des Protoplasten von der Zellwand',
} satisfies Record<M603Node, string>);
export const M603_RELATION_TEXT = Object.freeze({
  causes: 'führt zu',
  enables_if: 'kann ermöglichen: bei hinreichender weiterer Volumenabnahme, nach vollständigem Turgorverlust',
  requires_zero: 'notwendige Bedingung: vollständiger Turgorverlust; allein nicht hinreichend',
  coupled: 'hängt zusammen mit – ohne strikte Zeitfolge',
  possible_together: 'kann ermöglichen: nur bei Turgor null UND hinreichendem weiterem Wasserverlust',
  strictly_before: 'muss vollständig vorher geschehen, erst danach folgt',
  prevents: 'verhindert',
} satisfies Record<M603Relation, string>);
export const M603_CLAIM_TEXT = Object.freeze({
  wall_stable: 'Die Zellwand bleibt vergleichsweise formstabil.',
  passive_potential: 'Wasser bewegt sich passiv entlang der Gesamtwasserpotenziale einschließlich Druck.',
  wall_shrinks: 'Die Zellwand schrumpft im gleichen Ausmaß wie der Protoplast.',
  already_detached: 'Anfängliche Volumenabnahme beweist bereits sichtbare Plasmolyse.',
  active_water_pump: 'Eine aktive Wasserpumpe verursacht hier den Wasserverlust.',
  intentional_loss: 'Die Zelle gibt Wasser absichtlich ab.',
  concentration_only: 'Die Wasserrichtung folgt immer allein aus den Stoffkonzentrationen.',
} satisfies Record<M603Claim, string>);
export const M603_HELP_TOPICS = Object.freeze(['water', 'turgor', 'detachment'] as const);
export type M603HelpTopic = (typeof M603_HELP_TOPICS)[number];
export const M603_HELP = Object.freeze({
  water: Object.freeze({ title: 'Wasserbilanz und Volumen',
    hint: 'Vergleiche die Gesamtwasserpotenziale beiderseits des Tonoplasten. Was bedeutet eine negative Wasserbilanz für den gefüllten Raum?',
    structure: 'Beginne mit dem Wasserverlust. Suche die Aussage zum Volumen und wähle eine Bedeutung, die eine Folge beschreibt. Unterscheide Vakuolenraum und Zellwand.',
    solution: 'A → B / „führt zu“: Wasser passiert den Tonoplasten von der Vakuole ins Cytosol und die Zellmembran nach außen entlang der gegebenen Gesamtpotenziale. Die Wasserbilanz der Vakuole ist negativ, ihr Volumen nimmt ab. Die Zellwand schrumpft dabei nicht im gleichen Ausmaß.',
  }),
  turgor: Object.freeze({ title: 'Druck und Turgor',
    hint: 'Turgor bezeichnet den Druck des Zellinhalts gegen die Zellwand. Wie verändert Wasserabgabe diesen Druck?',
    structure: 'Verbinde den Wasserverlust mit der Aussage zum Turgor. Erzwinge keine Reihenfolge zwischen Volumenabnahme und Druckabnahme: Beide hängen zusammen.',
    solution: 'A → C / „führt zu“: Durch Wasserverlust sinkt der Turgor. Volumen- und Druckänderung sind gekoppelt. Eine strikte Folge B → C oder C → B als „erst vollständig vorher“ ist nicht begründet.',
  }),
  detachment: Object.freeze({ title: 'Bedingungen der Ablösung',
    hint: 'D ist als Möglichkeit formuliert. Reicht schon eine anfängliche Abnahme, um einen sichtbaren Abstand zur Wand zu belegen?',
    structure: 'Für D brauchst du zwei gemeinsam geltende Bedingungen: vollständiger Turgorverlust und hinreichender weiterer Wasserverlust mit Volumenabnahme. Suche zwei passende Ausgangsaussagen und bedingte Bedeutungen.',
    solution: 'B → D / „kann ermöglichen“ und C → D / „notwendige Bedingung“ gehören zusammen: Erst vollständiger Turgorverlust und hinreichender weiterer Wasserverlust mit Volumenrückgang erlauben im Erklärungsmodell eine mögliche Ablösung. Keine der beiden Kanten allein bestätigt D; selbst gemeinsam sind sie keine echte Beobachtung oder Garantie sichtbarer Plasmolyse.',
  }),
});
export const M603_SELF_CHECK = Object.freeze([
  'Ich begründe die Wasserbewegung mit den gegebenen Gesamtwasserpotenzialen, Zahlen in Pa und dem enthaltenen Druckbeitrag.',
  'Ich unterscheide die Zellmembran (Cytosol ↔ Außenraum) vom Tonoplasten (Vakuole ↔ Cytosol) und benenne beide Wasserwege.',
  'Ich verbinde Wasserverlust mit der Wasserbilanz, dem Vakuolen-/Protoplastvolumen und sinkendem Turgor, ohne eine strikte zeitliche Folge von Volumen und Druck zu erfinden.',
  'Ich erkläre die mögliche Ablösung mit vollständigem Turgorverlust UND hinreichendem weiterem Wasserverlust. Die Zellwand bleibt vergleichsweise formstabil; das Modell beweist keine reale sichtbare Plasmolyse.',
]);
