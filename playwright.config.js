import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  testMatch: 'portal.spec.js',
  fullyParallel: false,
  workers: 1,
  reporter: 'list',
  use: { baseURL: 'http://127.0.0.1:4179', browserName: 'chromium', viewport: { width: 1440, height: 1000 }, screenshot: 'only-on-failure' },
  webServer: {
    command: 'npm run preview:contract', url: 'http://127.0.0.1:4179',
    env: { PORT: '4179', PREVIEW_STRICT_PORT: '1' }, reuseExistingServer: false
  }
});