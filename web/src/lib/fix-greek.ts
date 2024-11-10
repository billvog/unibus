/**
 * Fixes Greek grammatical errors in text by replacing specific incorrect phrases.
 * Specifically, replaces "στη Α" with "στην Α" to conform with Greek grammar rules.
 *
 * @param text - The input text string containing potential Greek grammatical errors
 * @returns The text with corrected Greek grammar
 */
export function fixGreek(text: string) {
  return text.replace("στη Α", "στην Α");
}
