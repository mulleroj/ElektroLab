/**
 * CLI: npm run test
 *
 * Testy omezeného formátování textu lekcí (MVP-12G): produkční helpery
 * a stejná struktura DOM jako LessonRichText (createElement +
 * renderToStaticMarkup). Bez nové závislosti; exit code 1 při selhání.
 *
 * Komponenta LessonRichText.tsx je tenký React wrapper nad těmito
 * produkčními funkcemi — kontrakt se ověřuje přes ně, aby skript
 * nezávisel na JSX runtime v CLI.
 */
import assert from 'node:assert/strict';
import { createElement, Fragment, type ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import {
  splitLessonParagraphs,
  tokenizeLessonInlineText,
} from '../src/lib/lessonRichText';

let passed = 0;
const failures: string[] = [];

function test(name: string, fn: () => void) {
  try {
    fn();
    passed += 1;
    console.log(`PASS ${name}`);
  } catch (error) {
    failures.push(name);
    console.log(`FAIL ${name}`);
    console.log(`  ${error instanceof Error ? error.message : String(error)}`);
  }
}

/** Stejná struktura jako produkční LessonRichText. */
function render(text: string): string {
  const paragraphs = splitLessonParagraphs(text);
  if (paragraphs.length === 0) {
    return '';
  }

  return renderToStaticMarkup(
    createElement(
      'div',
      { className: 'lesson-rich-text' },
      paragraphs.map((paragraph, index) => {
        const children: ReactNode[] = tokenizeLessonInlineText(paragraph).map(
          (token, tokenIndex) =>
            token.type === 'strong'
              ? createElement('strong', { key: tokenIndex }, token.value)
              : createElement(Fragment, { key: tokenIndex }, token.value),
        );
        return createElement('p', { key: index }, children);
      }),
    ),
  );
}

console.log('ElektroLab lesson rich-text tests (MVP-12G)');
console.log('');

test('prostý text → jeden odstavec bez strong', () => {
  const html = render('Jednoduchá věta bez značek.');
  assert.equal(html, '<div class="lesson-rich-text"><p>Jednoduchá věta bez značek.</p></div>');
  assert.equal(html.includes('<strong>'), false);
  assert.equal(splitLessonParagraphs('Jednoduchá věta bez značek.').length, 1);
});

test('dva odstavce oddělené \\n\\n → dva <p>', () => {
  const html = render('První odstavec.\n\nDruhý odstavec.');
  assert.equal(
    html,
    '<div class="lesson-rich-text"><p>První odstavec.</p><p>Druhý odstavec.</p></div>',
  );
  assert.deepEqual(splitLessonParagraphs('První odstavec.\n\nDruhý odstavec.'), [
    'První odstavec.',
    'Druhý odstavec.',
  ]);
});

test('Windows nové řádky \\r\\n\\r\\n → stejné jako \\n\\n', () => {
  const html = render('První.\r\n\r\nDruhý.');
  assert.equal(
    html,
    '<div class="lesson-rich-text"><p>První.</p><p>Druhý.</p></div>',
  );
});

test('jedna platná dvojice **text** → jeden <strong>', () => {
  const html = render('**Zkrat** je nechtěné spojení.');
  assert.equal(
    html,
    '<div class="lesson-rich-text"><p><strong>Zkrat</strong> je nechtěné spojení.</p></div>',
  );
});

test('více tučných pasáží v jednom odstavci', () => {
  const html = render('Při zkratu může protékat **velmi velký proud** i **teplo**.');
  assert.equal(
    html,
    '<div class="lesson-rich-text"><p>Při zkratu může protékat <strong>velmi velký proud</strong> i <strong>teplo</strong>.</p></div>',
  );
  const tokens = tokenizeLessonInlineText(
    'Při zkratu může protékat **velmi velký proud** i **teplo**.',
  );
  assert.equal(tokens.filter((t) => t.type === 'strong').length, 2);
});

test('neuzavřená značka zůstane doslova', () => {
  const html = render('Toto je **neúplný text');
  assert.equal(
    html,
    '<div class="lesson-rich-text"><p>Toto je **neúplný text</p></div>',
  );
  assert.equal(html.includes('<strong>'), false);
});

test('prázdná značka **** nevytvoří prázdný <strong>', () => {
  const html = render('Před **** za.');
  assert.equal(html, '<div class="lesson-rich-text"><p>Před **** za.</p></div>');
  assert.equal(html.includes('<strong>'), false);
});

test('HTML/XSS payload zůstane textem bez script/img', () => {
  const html = render("**<script>alert('x')</script>** a **<img src=x onerror=alert(1)>**");
  // React escapuje obsah — nesmí vzniknout skutečné HTML elementy.
  assert.equal(/<script\b/i.test(html), false);
  assert.equal(/<img\b/i.test(html), false);
  assert.match(
    html,
    /<strong>&lt;script&gt;alert\(&#x27;x&#x27;\)&lt;\/script&gt;<\/strong>/,
  );
  assert.match(
    html,
    /<strong>&lt;img src=x onerror=alert\(1\)&gt;<\/strong>/,
  );
});

test('prázdný nebo whitespace-only vstup → null / prázdno', () => {
  assert.equal(render(''), '');
  assert.equal(render('   \n\n  '), '');
  assert.deepEqual(splitLessonParagraphs(''), []);
  assert.deepEqual(splitLessonParagraphs('  \n\n '), []);
});

test('více prázdných řádků nevytvoří prázdné odstavce', () => {
  assert.deepEqual(splitLessonParagraphs('A.\n\n\n\nB.'), ['A.', 'B.']);
  const html = render('A.\n\n\n\nB.');
  assert.equal(html, '<div class="lesson-rich-text"><p>A.</p><p>B.</p></div>');
});

test('české znaky, Ω a interpunkce kolem tučného textu', () => {
  const html = render('Odpor **R (Ω)** — základní jednotka.');
  assert.equal(
    html,
    '<div class="lesson-rich-text"><p>Odpor <strong>R (Ω)</strong> — základní jednotka.</p></div>',
  );
});

test('jednotlivý \\n uvnitř odstavce se stane mezerou', () => {
  assert.deepEqual(splitLessonParagraphs('slovo1\nslovo2'), ['slovo1 slovo2']);
  const html = render('slovo1\nslovo2');
  assert.equal(html, '<div class="lesson-rich-text"><p>slovo1 slovo2</p></div>');
});

console.log('');
console.log(`Passed: ${passed}`);
console.log(`Failed: ${failures.length}`);
console.log('');
console.log(failures.length === 0 ? 'PASS' : 'FAIL');

if (failures.length > 0) {
  process.exit(1);
}
