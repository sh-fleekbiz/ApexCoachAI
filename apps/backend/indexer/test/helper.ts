// This file contains code that we reuse between our tests.
import * as path from 'node:path';
import type * as test from 'node:test';
import { createIndexerTestHelper } from './test-utils.js';

export type TestContext = { after: typeof test.after };

const __filename = import.meta.url;
const __dirname = path.dirname(__filename);

const AppPath = path.join(__dirname, '..', 'src', 'app.ts');

// Use shared test configuration
const { config, build } = createIndexerTestHelper(AppPath);

export { build, config };
