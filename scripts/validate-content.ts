/**
 * CLI: npm run validate:content
 *
 * Načte reálná produkční data ElektroLabu, spustí všechny validační
 * oblasti a vypíše čitelný report. Exit code 1 při alespoň jedné chybě.
 */
import { subjects } from '../src/data/subjects';
import { topics } from '../src/data/topics';
import { lessons } from '../src/data/lessons';
import { badges } from '../src/data/badges';
import { SUBJECT_BADGES } from '../src/data/subjectBadges';
import { finalExamTopics } from '../src/features/finalExam/finalExamRegistry';
import { LEGACY_LESSON_ID_ALIASES } from '../src/lib/lessonIdMigration';
import { finalExamConfig } from '../src/features/finalExam/finalExamConfig';
import { validateContentData } from '../src/validation/contentValidation';
import type { ContentValidationIssue } from '../src/validation/contentValidationTypes';

function printIssue(issue: ContentValidationIssue) {
  const head = `${issue.severity === 'error' ? 'ERROR' : 'WARNING'} [${issue.code}]`;
  const lines = [head, `  ${issue.entityType}: ${issue.entityId ?? '(neurčeno)'}`];
  if (issue.field) lines.push(`  field: ${issue.field}`);
  lines.push(`  ${issue.message}`);
  console.log(lines.join('\n'));
  console.log('');
}

const result = validateContentData({
  subjects,
  topics,
  lessons,
  badges,
  subjectBadges: SUBJECT_BADGES,
  finalExamTopics,
  lessonIdAliases: LEGACY_LESSON_ID_ALIASES,
});

console.log('ElektroLab content validation');
console.log('');
console.log(`Subjects: ${result.summary.subjects} (active: ${result.summary.activeSubjects})`);
console.log(`Topics: ${result.summary.topics}`);
console.log(`Lessons: ${result.summary.lessons}`);
console.log(`Quiz questions: ${result.summary.quizQuestions}`);
console.log(`Activities: ${result.summary.activities}`);
console.log(`Interactive demos: ${result.summary.demos}`);
console.log(`Badges: ${result.summary.badges}`);
console.log(`Final exam topics: ${result.summary.finalExamTopics}`);
console.log(
  `Final exam feature: featureEnabled=${finalExamConfig.featureEnabled}, contentReady=${finalExamConfig.contentReady}`,
);
console.log('');

for (const issue of result.errors) printIssue(issue);
for (const issue of result.warnings) printIssue(issue);

console.log(`Errors: ${result.errors.length}`);
console.log(`Warnings: ${result.warnings.length}`);
console.log('');
console.log(result.valid ? 'PASS' : 'FAIL');

if (!result.valid) {
  process.exit(1);
}
