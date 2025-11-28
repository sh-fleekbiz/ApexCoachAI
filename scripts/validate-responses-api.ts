/**
 * Validation Script for Azure OpenAI Responses API Migration
 * Validates that the environment is correctly configured for Responses API
 * and tests basic functionality.
 */

const REQUIRED_VARS = [
  'AZURE_OPENAI_ENDPOINT',
  'AZURE_OPENAI_API_KEY',
  'AZURE_OPENAI_RESPONSES_URL',
  'AI_MODEL_GENERAL',
  'AI_MODEL_EMBEDDING',
  'AZURE_OPENAI_EMBEDDING_ENDPOINT',
];

interface ValidationResult {
  check: string;
  status: 'pass' | 'fail' | 'warning';
  message: string;
}

const results: ValidationResult[] = [];

function addResult(
  check: string,
  status: 'pass' | 'fail' | 'warning',
  message: string,
) {
  results.push({ check, status, message });
  const icon = status === 'pass' ? '✅' : status === 'fail' ? '❌' : '⚠️';
  console.log(`${icon} ${check}: ${message}`);
}

async function validateEnvironment() {
  console.log('\n🔍 Validating Azure OpenAI Responses API Configuration...\n');

  // Check required environment variables
  for (const varName of REQUIRED_VARS) {
    const value = process.env[varName];
    addResult(
      varName,
      value ? 'pass' : 'fail',
      value || 'Missing',
    );
  }

  // Validate Responses URL format
  const responsesUrl = process.env.AZURE_OPENAI_RESPONSES_URL;
  if (responsesUrl) {
    const isV1GA = responsesUrl.includes('/openai/v1/responses');
    const hasApiVersion = responsesUrl.includes('api-version');

    addResult(
      'Responses URL Format',
      isV1GA && !hasApiVersion ? 'pass' : 'fail',
      isV1GA && !hasApiVersion
        ? 'Correct v1 GA format (no api-version param)'
        : 'Should be /openai/v1/responses without api-version',
    );
  }

  // Check model names
  const modelGeneral = process.env.AI_MODEL_GENERAL;
  addResult(
    'AI_MODEL_GENERAL',
    modelGeneral === 'gpt-5.1-codex-mini' ? 'pass' : 'warning',
    modelGeneral || 'Using default',
  );

  // Test API connectivity
  if (responsesUrl && process.env.AZURE_OPENAI_API_KEY) {
    try {
      const testPayload = {
        model: modelGeneral || 'gpt-5.1-codex-mini',
        input: 'Hello',
        max_output_tokens: 10,
      };

      const response = await fetch(responsesUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': process.env.AZURE_OPENAI_API_KEY,
        },
        body: JSON.stringify(testPayload),
      });

      if (response.ok) {
        const data = await response.json();
        const responseId = data.id?.substring(0, 20) || 'unknown';
        addResult(
          'API Connectivity',
          'pass',
          `Successfully connected (Response ID: ${responseId}...)`,
        );
      } else {
        const errorText = await response.text();
        addResult(
          'API Connectivity',
          'fail',
          `Failed: ${response.status} ${response.statusText} - ${errorText.substring(0, 100)}`,
        );
      }
    } catch (error) {
      addResult(
        'API Connectivity',
        'fail',
        `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  } else {
    addResult(
      'API Connectivity',
      'warning',
      'Skipped (missing required env vars)',
    );
  }

  // Summary
  console.log('\n📊 Validation Summary:');
  const passed = results.filter((r) => r.status === 'pass').length;
  const failed = results.filter((r) => r.status === 'fail').length;
  const warnings = results.filter((r) => r.status === 'warning').length;

  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`⚠️  Warnings: ${warnings}\n`);

  if (failed > 0) {
    console.log('❌ Validation failed. Please fix the issues above.');
    process.exit(1);
  } else if (warnings > 0) {
    console.log('⚠️  Validation passed with warnings.');
    process.exit(0);
  } else {
    console.log('✅ All validations passed!');
    process.exit(0);
  }
}

// Run validation
validateEnvironment().catch((error) => {
  console.error('Validation error:', error);
  process.exit(1);
});

