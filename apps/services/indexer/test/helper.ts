// This file contains code that we reuse between our tests.
import type * as test from 'node:test';
import { createIndexerTestHelper } from './test-utils.js';

export type TestContext = { after: typeof test.after };

// Resolve the app entrypoint as a file URL for ESM dynamic import
const AppPath = new URL('../src/app.ts', import.meta.url).href;

// Use shared test configuration
const { config, build } = createIndexerTestHelper(AppPath);

export { build, config };
