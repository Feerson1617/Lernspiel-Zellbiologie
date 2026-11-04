import type { M603Claim, M603Node, M603Relation } from '../domain/m603-contract.ts';

export const M603_NODE_TEXT = Object.freeze({
  A: 'Wasserverlust', B: 'Abnehmendes Vakuolen-/Protoplastvolumen', C: 'Sinkender Turgor',
  D: 'Bei hinreichendem Wasserverlust mögliche Ablösung des Protoplasten von der Zellwand',
} satisfies Record<M603Node, string>);
export const M603_RELATION_TEXT = Object.freeze({
  causes: 'führt zu',
  enables_if: 'kann ermöglichen: hinreichend weitere Volumenabnahme bei Turgor null',
  requires_zero: 'notwendige Bedingung: Turgor null; allein nicht hinreichend',
  coupled: 'hängt zusammen mit – ohne strikte Zeitfolge',
  possible_together: 'kann ermöglichen: Turgor null UND hinreichend weiterer Wasserverlust',
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
    structure: 'Welche Volumenfolge hat Wasserverlust? Unterscheide Vakuolenraum und Zellwand.',
    solution: 'A → B / „führt zu“: Wasser passiert den Tonoplasten von der Vakuole ins Cytosol und die Zellmembran nach außen entlang der gegebenen Gesamtpotenziale. Die Wasserbilanz der Vakuole ist negativ, ihr Volumen nimmt ab. Die Zellwand schrumpft dabei nicht im gleichen Ausmaß.',
  }),
  turgor: Object.freeze({ title: 'Druck und Turgor',
    hint: 'Turgor bezeichnet den Druck des Zellinhalts gegen die Zellwand. Wie verändert Wasserabgabe diesen Druck?',
    structure: 'Wie hängen Wasserverlust und Turgor zusammen? Volumen- und Druckabnahme bilden keine strikte Zeitfolge.',
    solution: 'A → C / „führt zu“: Durch Wasserverlust sinkt der Turgor. Volumen- und Druckänderung sind gekoppelt. Eine strikte Folge B → C oder C → B als „erst vollständig vorher“ ist nicht begründet.',
  }),
  detachment: Object.freeze({ title: 'Bedingungen der Ablösung',
    hint: 'D ist als Möglichkeit formuliert. Reicht schon eine anfängliche Abnahme, um einen sichtbaren Abstand zur Wand zu belegen?',
    structure: 'Prüfe für D zwei gemeinsam geltende Bedingungen: Turgor null und hinreichend weiterer Wasserverlust mit Volumenabnahme. Keine Bedingung allein genügt.',
    solution: 'B → D / „kann ermöglichen“ und C → D / „notwendige Bedingung“ gehören zusammen: Erst vollständiger Turgorverlust und hinreichender weiterer Wasserverlust mit Volumenrückgang erlauben im Erklärungsmodell eine mögliche Ablösung. Keine der beiden Kanten allein bestätigt D; selbst gemeinsam sind sie keine echte Beobachtung oder Garantie sichtbarer Plasmolyse.',
  }),
});
export const M603_SELF_CHECK = Object.freeze([
  'Ich beantworte die Frage und unterscheide sinkenden Turgor von vollständig verlorenem Turgor.',
  'Ich begründe den Zusammenhang von Wasserverlust, Volumen und Turgor, ohne eine starre Reihenfolge zu behaupten.',
  'Ich erkläre, welche Bedingungen gemeinsam eine Ablösung ermöglichen und warum eine notwendige Bedingung allein nicht genügt.',
  'Ich unterscheide eine begründete Möglichkeit von einer sichtbaren Beobachtung und berücksichtige die formstabile Zellwand.',
]);
