import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright Configuration for AI-Native Design Workflow
 * Better Being - Enterprise Design Validation System
 */
export default defineConfig({
  // Test directory structure
  testDir: './tests',

  // Global test timeout
  timeout: 60000,

  // Expect timeout for assertions
  expect: {
    // Screenshot comparison threshold
    threshold: 0.2,
    // Animation handling
    toHaveScreenshot: {
      threshold: 0.3,
      animations: 'disabled'
    },
    toMatchSnapshot: {
      threshold: 0.3
    }
  },

  // Retry configuration
  retries: process.env.CI ? 2 : 1,

  // Parallel test execution
  workers: process.env.CI ? 2 : 4,

  // Reporter configuration
  reporter: [
    ['html', {
      outputFolder: 'playwright-report',
      open: 'never'
    }],
    ['json', {
      outputFile: 'test-results/results.json'
    }],
    ['junit', {
      outputFile: 'test-results/junit.xml'
    }],
    ['list']
  ],

  // Output directory for test artifacts
  outputDir: 'test-results',

  // Global test setup
  globalSetup: './tests/global-setup.ts',
  globalTeardown: './tests/global-teardown.ts',

  // Test configuration
  use: {
    // Base URL for testing
    baseURL: process.env.BASE_URL || 'http://localhost:5173',

    // Browser configuration
    headless: process.env.CI ? true : false,

    // Screenshot configuration
    screenshot: {
      mode: 'only-on-failure',
      fullPage: true
    },

    // Video recording
    video: {
      mode: 'retain-on-failure',
      size: { width: 1280, height: 720 }
    },

    // Trace collection
    trace: 'retain-on-failure',

    // Action timeout
    actionTimeout: 15000,

    // Navigation timeout
    navigationTimeout: 30000,

    // Ignore HTTPS errors
    ignoreHTTPSErrors: true,

    // Color scheme
    colorScheme: 'light',

    // Locale
    locale: 'en-US',

    // Timezone
    timezoneId: 'America/New_York',

    // Extra HTTP headers
    extraHTTPHeaders: {
      'Accept-Language': 'en-US,en;q=0.9'
    }
  },

  // Project configurations for different testing scenarios
  projects: [
    // === DESIGN CAPTURE PROJECT ===
    {
      name: 'design-capture',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1440, height: 900 },
        deviceScaleFactor: 1,
        hasTouch: false,
        isMobile: false,
        screenshot: {
          mode: 'always',
          fullPage: true
        }
      },
      testMatch: '**/design-capture/**/*.spec.ts',
      retries: 0,
      timeout: 30000
    },

    // === VISUAL REGRESSION PROJECT ===
    {
      name: 'visual-regression',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1440, height: 900 },
        deviceScaleFactor: 1,
        hasTouch: false,
        isMobile: false
      },
      testMatch: '**/visual-regression/**/*.spec.ts',
      expect: {
        toHaveScreenshot: {
          threshold: 0.2,
          animations: 'disabled',
          clip: undefined,
          fullPage: true,
          omitBackground: false
        }
      }
    },

    // === COMPONENT VISUAL TESTING ===
    {
      name: 'component-visual',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1200, height: 800 },
        deviceScaleFactor: 1
      },
      testMatch: '**/components/**/*.visual.spec.ts',
      expect: {
        toHaveScreenshot: {
          threshold: 0.1,
          animations: 'disabled'
        }
      }
    },

    // === MOBILE TESTING ===
    {
      name: 'mobile',
      use: {
        ...devices['iPhone 13'],
        viewport: { width: 375, height: 667 },
        deviceScaleFactor: 2,
        hasTouch: true,
        isMobile: true
      },
      testMatch: '**/mobile/**/*.spec.ts'
    },

    // === TABLET TESTING ===
    {
      name: 'tablet',
      use: {
        ...devices['iPad Pro'],
        viewport: { width: 1024, height: 1366 },
        deviceScaleFactor: 2,
        hasTouch: true,
        isMobile: false
      },
      testMatch: '**/tablet/**/*.spec.ts'
    },

    // === DESKTOP TESTING ===
    {
      name: 'desktop',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
        deviceScaleFactor: 1,
        hasTouch: false,
        isMobile: false
      },
      testMatch: '**/desktop/**/*.spec.ts'
    },

    // === CROSS-BROWSER TESTING ===
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1440, height: 900 }
      },
      testMatch: '**/cross-browser/**/*.spec.ts'
    },

    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        viewport: { width: 1440, height: 900 }
      },
      testMatch: '**/cross-browser/**/*.spec.ts'
    },

    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
        viewport: { width: 1440, height: 900 }
      },
      testMatch: '**/cross-browser/**/*.spec.ts'
    },

    // === ACCESSIBILITY TESTING ===
    {
      name: 'accessibility',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1440, height: 900 },
        // High contrast mode for accessibility testing
        colorScheme: 'dark',
        reducedMotion: 'reduce'
      },
      testMatch: '**/accessibility/**/*.spec.ts'
    },

    // === PERFORMANCE TESTING ===
    {
      name: 'performance',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1440, height: 900 },
        // Simulate slower network for performance testing
        launchOptions: {
          args: [
            '--disable-web-security',
            '--disable-features=VizDisplayCompositor'
          ]
        }
      },
      testMatch: '**/performance/**/*.spec.ts',
      timeout: 120000
    }
  ],

  // Web server configuration
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
    stderr: 'pipe',
    stdout: 'pipe'
  }
});
