import { defineConfig, devices } from "@playwright/test";

const rawBaseUrl = process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3000";
const baseURL = rawBaseUrl.replace(/\/+$/, "");
const parsedBaseUrl = new URL(baseURL);
const serverHost = parsedBaseUrl.hostname || "127.0.0.1";
const serverPort =
  parsedBaseUrl.port || (parsedBaseUrl.protocol === "https:" ? "443" : "3000");

const useProdServer = process.env.PLAYWRIGHT_USE_PROD === "1";
const devCommand =
  process.platform === "win32"
    ? `cmd /c npx next dev -H ${serverHost} -p ${serverPort}`
    : `npx next dev -H ${serverHost} -p ${serverPort}`;
const prodCommand =
  process.platform === "win32"
    ? `cmd /c npx next start -H ${serverHost} -p ${serverPort}`
    : `npx next start -H ${serverHost} -p ${serverPort}`;

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
    baseURL,
    trace: "on-first-retry",
  },
  webServer: process.env.PLAYWRIGHT_SKIP_SERVER
    ? undefined
    : {
        command: useProdServer ? prodCommand : devCommand,
        url: `${baseURL}/api/v1/health`,
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
