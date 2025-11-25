import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbDir = path.join(
  __dirname,
  '..',
  'apps',
  'backend',
  'search',
  'src',
  'db'
);

const filesToConvert = [
  'admin-action-log-repository.ts',
  'analytics-repository.ts',
  'invitation-repository.ts',
  'knowledge-base-repository.ts',
  'program-repository.ts',
  'user-settings-repository.ts',
  'white-label-settings-repository.ts',
  'usage-event-repository.ts',
];

for (const file of filesToConvert) {
  const filePath = path.join(dbDir, file);
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  Skipping ${file} - not found`);
    continue;
  }

  let content = fs.readFileSync(filePath, 'utf8');

  // Skip if already converted
  if (content.includes("import { withClient } from '@shared/data'")) {
    console.log(`✓ ${file} already converted`);
    continue;
  }

  console.log(`Converting ${file}...`);

  // Replace import statement
  content = content.replace(
    /import \{ database \} from '\.\/database\.js';/g,
    "import { withClient } from '@shared/data';"
  );

  // Convert methods to async and wrap with withClient
  // This is a simple regex-based conversion - might need manual review

  // Pattern: functionName(...): ReturnType {
  content = content.replace(
    /^(\s+)(\w+)\(([\w\s,?:|\[\]<>{}'"()]*)\):\s*([^\{]+)\{/gm,
    '$1async $2($3): Promise<$4> {\n$1  return withClient(async (client) => {'
  );

  // Add closing bracket for withClient
  // Find method closings and add extra bracket
  content = content.replace(/^(\s+)\},\n/gm, '$1  });\n$1},\n');

  // Replace database.prepare...run/get/all patterns
  content = content.replace(/database\.prepare\(/g, 'await client.query(');
  content = content.replace(/\)\.run\([^\)]*\)/g, ')');
  content = content.replace(/\)\.get\([^\)]*\)/g, ')');
  content = content.replace(/\)\.all\([^\)]*\)/g, ')');

  // Replace ? placeholders with $1, $2, etc.
  let paramIndex = 0;
  content = content.replace(/\?/g, () => {
    paramIndex++;
    return `$${paramIndex}`;
  });

  // Reset param index between queries (this is approximate)
  content = content.replace(/(query\([^;]+;)/g, (match) => {
    paramIndex = 0;
    return match;
  });

  // Replace result.rows access
  content = content.replace(/as (\w+)\[\]/g, 'result.rows as $1[]');
  content = content.replace(/as (\w+) \|/g, 'result.rows[0] as $1 |');

  // Replace lastInsertRowid with RETURNING *
  content = content.replace(/result\.lastInsertRowid/g, 'result.rows[0].id');

  fs.writeFileSync(filePath, content);
  console.log(`  ✓ Converted ${file}`);
}

console.log('\n⚠️  Conversion complete. Manual review recommended for:');
console.log('   - Complex SQL queries');
console.log('   - Transactions');
console.log('   - Return types');
