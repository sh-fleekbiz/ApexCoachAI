// This file contains code that we reuse between our tests.
import type * as test from 'node:test';
import { createSearchTestHelper } from './test-utils.js';

export type TestContext = { after: typeof test.after };

// Resolve the app entrypoint as a file URL for ESM dynamic import
const APP_PATH = new URL('../src/app.ts', import.meta.url).href;

// Use shared test configuration
const { config, build } = createSearchTestHelper(APP_PATH);

export { build, config };
