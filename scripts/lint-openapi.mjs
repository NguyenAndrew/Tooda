// @ts-check
/**
 * Lints the OpenAPI spec defined in src/data/openapi.ts using Spectral.
 * Run with: node --experimental-strip-types scripts/lint-openapi.mjs
 */

import spectralCore from '@stoplight/spectral-core';
import spectralRulesets from '@stoplight/spectral-rulesets';
import spectralParsers from '@stoplight/spectral-parsers';

import { openapiSpec } from '../src/data/openapi.ts';

const { Spectral, Document } = spectralCore;
const { oas } = spectralRulesets;

const spectral = new Spectral();
spectral.setRuleset(oas);

const specJson = JSON.stringify(openapiSpec, null, 2);
const doc = new Document(specJson, spectralParsers.Json, 'openapi.json');

const results = await spectral.run(doc);

if (results.length === 0) {
  console.log('✓ OpenAPI spec passed all linting rules.');
  process.exit(0);
}

let hasErrors = false;
for (const result of results) {
  const severity = ['error', 'warn', 'info', 'hint'][result.severity];
  const location = result.path.length > 0 ? ` (at ${result.path.join('.')})` : '';
  console.error(`[${severity}] ${result.code}: ${result.message}${location}`);
  if (result.severity === 0) hasErrors = true;
}

process.exit(hasErrors ? 1 : 0);
