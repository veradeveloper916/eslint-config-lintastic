import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { ESLint } from "eslint";
import { fileURLToPath } from "url";

import baseConfig from "#lib/node"


describe("Integration Test -> Node", () => {
  it('node:base should well integrated', async () => {
    const eslint = new ESLint({ baseConfig });

    const dir = fileURLToPath(new URL("../samples", import.meta.url));

    // const [{ errorCount, fatalErrorCount, warningCount, fixableErrorCount, fixableWarningCount }] = await eslint.lintFiles([`${dir}/**`]);

    const results = await eslint.lintFiles([`${dir}/**`]);

    assert.ok(results.length > 0);
    // results.forEach(({ /*errorCount, */ fatalErrorCount, warningCount, fixableErrorCount, fixableWarningCount }) => {
    //   // assert.equal(errorCount > 0, true);
    //   assert.equal(fatalErrorCount, 0);
    //   assert.equal(warningCount, 0);
    //   assert.ok(fixableErrorCount);
    //   assert.equal(fixableWarningCount, 0);
    // });
  });
});