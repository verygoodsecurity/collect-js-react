import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import test from 'node:test';
import { spawnSync } from 'node:child_process';
import { chromium } from 'playwright-core';
import { createServer } from 'vite';
import { compatFixtures } from './config.mjs';

const requestedFixture = process.env.COMPAT_REACT_VERSION;

if (requestedFixture && !compatFixtures[requestedFixture]) {
  throw new Error(
    `Unknown COMPAT_REACT_VERSION "${requestedFixture}". Expected one of: ${Object.keys(compatFixtures).join(', ')}`
  );
}

function resolveChromeExecutable() {
  const envPath = process.env.CHROME_BIN || process.env.PLAYWRIGHT_CHROME_PATH;

  if (envPath && existsSync(envPath)) {
    return envPath;
  }

  const localCandidates = [
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing'
  ];

  for (const candidate of localCandidates) {
    if (existsSync(candidate)) {
      return candidate;
    }
  }

  const binaryNames = ['chrome', 'google-chrome', 'google-chrome-stable', 'chromium', 'chromium-browser'];

  for (const binaryName of binaryNames) {
    const result = spawnSync('which', [binaryName], { encoding: 'utf8' });
    const candidate = result.stdout.trim();

    if (result.status === 0 && candidate && existsSync(candidate)) {
      return candidate;
    }
  }

  throw new Error('Chrome executable not found. Set CHROME_BIN to a valid Chrome or Chromium binary.');
}

async function withCompatServer(fixture, run) {
  const server = await createServer({
    configFile: fixture.configFile,
    logLevel: 'error',
    server: {
      host: '127.0.0.1',
      port: fixture.port,
      strictPort: true
    }
  });

  await server.listen();

  try {
    await run(`http://127.0.0.1:${fixture.port}`);
  } finally {
    await server.close();
  }
}

const fixturesToTest = requestedFixture
  ? [compatFixtures[requestedFixture]]
  : [compatFixtures.react16, compatFixtures.react17, compatFixtures.react18, compatFixtures.react19];

for (const fixture of fixturesToTest) {
  test(
    `renders a secure iframe for ${fixture.title}`,
    { timeout: 30000 },
    async () => {
      const browser = await chromium.launch({
        executablePath: resolveChromeExecutable(),
        headless: true
      });

      try {
        await withCompatServer(fixture, async (url) => {
          const page = await browser.newPage();
          const pageErrors = [];

          page.on('pageerror', (error) => {
            pageErrors.push(error);
          });

          await page.goto(url, { waitUntil: 'domcontentloaded' });

          await page.waitForSelector('h1');
          await page.waitForSelector('[data-testid="vgs-collect-field-wrapper"]');
          await page.waitForSelector('iframe[data-vgs-collect-name="card-number"]');

          assert.equal(await page.locator('h1').textContent(), fixture.title);
          assert.equal(await page.locator('[data-testid="vgs-collect-field-wrapper"]').count(), 1);
          assert.equal(await page.locator('iframe[data-vgs-collect-name="card-number"]').count(), 1);
          assert.deepEqual(
            pageErrors.map((error) => error.message),
            [],
            `Unexpected browser errors in ${fixture.key}`
          );

          await page.close();
        });
      } finally {
        await browser.close();
      }
    }
  );
}
