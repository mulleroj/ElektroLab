/**
 * Čisté pomocné funkce pro omezené formátování textu lekcí:
 * odstavce oddělené prázdným řádkem a jednoduché **tučné** zvýraznění.
 * Bez HTML, Markdown engine a dangerouslySetInnerHTML.
 */

export type LessonInlineToken =
  | { type: 'text'; value: string }
  | { type: 'strong'; value: string };

/** Rozdělí text na odstavce; normalizuje CRLF a jednotlivé nové řádky uvnitř odstavce. */
export function splitLessonParagraphs(text: string): string[] {
  const normalized = text.replace(/\r\n/g, '\n').trim();
  if (!normalized) {
    return [];
  }

  return normalized
    .split(/\n\s*\n+/)
    .map((paragraph) =>
      paragraph
        .replace(/\n/g, ' ')
        .replace(/[ \t]+/g, ' ')
        .trim(),
    )
    .filter((paragraph) => paragraph.length > 0);
}

/**
 * Tokenizuje inline text: platné **…** → strong, neúplné / prázdné značky zůstávají textem.
 * Obsah strong je vždy prostý text (žádné vnořené HTML).
 */
export function tokenizeLessonInlineText(text: string): LessonInlineToken[] {
  if (!text) {
    return [];
  }

  const tokens: LessonInlineToken[] = [];
  // Neprázdný obsah bez hvězdiček — **** a neuzavřené ** se neshodují.
  const pattern = /\*\*([^*]+)\*\*/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      tokens.push({ type: 'text', value: text.slice(lastIndex, match.index) });
    }
    tokens.push({ type: 'strong', value: match[1] });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    tokens.push({ type: 'text', value: text.slice(lastIndex) });
  }

  if (tokens.length === 0) {
    tokens.push({ type: 'text', value: text });
  }

  return tokens;
}
