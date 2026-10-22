export const MAX_ANSWER_LENGTH = 4096;
export interface TextToken { readonly word: string; readonly start: number; readonly end: number }

/** Matching only: original UTF-16 offsets/text remain untouched for evidence. */
export function normalizeWord(word: string): string {
  return word.normalize('NFC').toLowerCase().replaceAll('ß', 'ss')
    .replaceAll('ä', 'ae').replaceAll('ö', 'oe').replaceAll('ü', 'ue');
}

export function isSupportedText(text: string): boolean {
  // Preserve tabs/newlines/NBSP; reject control/bidi/zero-width formatting instead of hiding it.
  if (/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f\u200b-\u200f\u202a-\u202e\u2060-\u206f\ufeff]/u.test(text)) return false;
  for (const character of text) {
    const code = character.codePointAt(0)!;
    if (code >= 0xd800 && code <= 0xdfff) return false;
  }
  return true;
}

/** Every non-whitespace character belongs to a token; no keyword/prefix extraction. */
export function tokenizeText(text: string): readonly TextToken[] {
  return Object.freeze([...text.matchAll(/[\p{L}\p{M}]+|[^\s]/gu)].map((match) => Object.freeze({
    word: normalizeWord(match[0]), start: match.index, end: match.index + match[0].length,
  })));
}

export function editDistance(left: string, right: string): number {
  let previous = Array.from({ length: right.length + 1 }, (_, index) => index);
  for (let i = 1; i <= left.length; i++) {
    const current = [i];
    for (let j = 1; j <= right.length; j++) current[j] = Math.min(
      current[j - 1]! + 1, previous[j]! + 1, previous[j - 1]! + (left[i - 1] === right[j - 1] ? 0 : 1),
    );
    previous = current;
  }
  return previous[right.length]!;
}

/** Conservative edits: one omission, one duplicated letter, or adjacent transposition. */
export function isLimitedTypo(word: string, target: string): boolean {
  if (word.length < 8 || !/^[a-z]+$/.test(word)) return false;
  if (target.length === word.length + 1) {
    return [...target].some((_, index) => target.slice(0, index) + target.slice(index + 1) === word);
  }
  if (word.length === target.length + 1) {
    return [...word].some((letter, index) => index > 0 && letter === word[index - 1]
      && word.slice(0, index) + word.slice(index + 1) === target);
  }
  if (word.length === target.length) {
    return [...word].some((_, index) => index + 1 < word.length && word[index] !== word[index + 1]
      && word.slice(0, index) + word[index + 1] + word[index] + word.slice(index + 2) === target);
  }
  return false;
}
