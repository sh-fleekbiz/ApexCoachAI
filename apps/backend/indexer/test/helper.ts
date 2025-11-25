// This file contains code that we reuse between our tests.
import { createIndexerTestHelper } from '@shared/test-utils';
import * as path from 'node:path';
import type * as test from 'node:test';

export type TestContext = { after: typeof test.after };

const __filename = import.meta.url;
const __dirname = path.dirname(__filename);

const AppPath = path.join(__dirname, '..', 'src', 'app.ts');

// Use shared test configuration
const { config, build } = createIndexerTestHelper(AppPath);

export { build, config };
