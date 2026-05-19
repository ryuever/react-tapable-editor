import playwright from '@playwright/test';

const { defineConfig, devices } = playwright;

export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  expect: {
    timeout: 5_000,
  },
  use: {
    baseURL: 'http://127.0.0.1:5175',
    launchOptions: {
      args: ['--no-proxy-server'],
    },
    trace: 'retain-on-failure',
  },
  webServer: {
    command:
      'NO_PROXY=localhost,127.0.0.1,::1 HTTP_PROXY= HTTPS_PROXY= ALL_PROXY= http_proxy= https_proxy= all_proxy= npm run start -- --port 5175 --strictPort',
    reuseExistingServer: false,
    timeout: 30_000,
    url: 'http://127.0.0.1:5175',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
