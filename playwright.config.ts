import { defineConfig, devices } from "@playwright/test";

const useProdServer = process.env.PLAYWRIGHT_USE_PROD === "1";
const devCommand =
  process.platform === "win32"
    ? "cmd /c npx next dev -H 127.0.0.1 -p 3000"
    : "npx next dev -H 127.0.0.1 -p 3000";
const prodCommand =
  process.platform === "win32" ? "cmd /c npm run start" : "npm run start";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : 2,
  timeout: 45_000,
  expect: {
    timeout: 10_000,
  },
  reporter: "list",
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3000",
    trace: "on-first-retry",
  },
  webServer: process.env.PLAYWRIGHT_SKIP_SERVER
    ? undefined
    : {
        command: useProdServer ? prodCommand : devCommand,
        url: "http://127.0.0.1:3000/api/v1/health",
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      },
  projects: [
    {
      name: "desktop-chromium",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1440, height: 900 },
      },
    },
    {
      name: "tablet-chromium",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 768, height: 1024 },
      },
    },
    {
      name: "mobile-chromium",
      use: {
        ...devices["Pixel 5"],
      },
    },
  ],
});
