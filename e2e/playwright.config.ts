import { defineConfig, devices } from "@playwright/test";

// The same suite runs against any app: point E2E_BASE_URL at a running instance.
// When it is unset, the React app is started and used.
const externalBaseURL = process.env.E2E_BASE_URL;
const baseURL = externalBaseURL ?? "http://localhost:5173";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: "list",
  use: { baseURL, trace: "on-first-retry" },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: externalBaseURL
    ? undefined
    : {
        command: "pnpm --filter @todolist/react dev",
        url: baseURL,
        reuseExistingServer: !process.env.CI,
      },
});
