import { Fragment } from 'react';
import { splitLessonParagraphs, tokenizeLessonInlineText } from '../lib/lessonRichText';

export type LessonRichTextProps = {
  text: string;
  className?: string;
};

/**
 * Bezpečný renderer výkladových textů lekce: odstavce + jednoduché **tučné**.
 * Všechny části jsou React text nodes / <strong> — bez dangerouslySetInnerHTML.
 */
export function LessonRichText({ text, className }: LessonRichTextProps) {
  const paragraphs = splitLessonParagraphs(text);

  if (paragraphs.length === 0) {
    return null;
  }

  const rootClass = className
    ? `lesson-rich-text ${className}`
    : 'lesson-rich-text';

  return (
    <div className={rootClass}>
      {paragraphs.map((paragraph, index) => (
        <p key={index}>
          {tokenizeLessonInlineText(paragraph).map((token, tokenIndex) =>
            token.type === 'strong' ? (
              <strong key={tokenIndex}>{token.value}</strong>
            ) : (
              <Fragment key={tokenIndex}>{token.value}</Fragment>
            ),
          )}
        </p>
      ))}
    </div>
  );
}
