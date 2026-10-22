import type { Assistance, Status } from '../domain/contracts.ts';

/** Presentation vocabulary only; it never infers correctness or changes assistance. */
export const STATUS_PRESENTATION = Object.freeze({
  correct: Object.freeze({ color: 'green', symbol: '✓', label: 'Richtig' }),
  incorrect: Object.freeze({ color: 'red', symbol: '✕', label: 'Fachlich falsch' }),
  partial: Object.freeze({ color: 'yellow', symbol: '+', label: 'Teilweise richtig' }),
  clarify: Object.freeze({ color: 'yellow', symbol: '?', label: 'Klärung nötig' }),
  empty: Object.freeze({ color: 'neutral', symbol: '○', label: 'Noch offen' }),
  technical: Object.freeze({ color: 'yellow', symbol: '!', label: 'Technischer Hinweis, kein fachliches Urteil' }),
} satisfies Record<Status, Readonly<{ color: string; symbol: string; label: string }>>);

export const ASSISTANCE_LABELS = Object.freeze({
  independent: 'Ohne Hilfe beantwortet', hint: 'Mit Hinweis beantwortet', wordbank: 'Mit Wortbank beantwortet',
  clarified: 'Mit Auswahl geklärt', solution_viewed: 'Lösung angesehen',
} satisfies Record<Assistance, string>);
