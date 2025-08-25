import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  console.log('🚀 Starting AI-Native Design Workflow Global Setup...');

  // Start development server if not already running
  const baseURL = config.projects[0].use.baseURL || 'http://localhost:5173';

  console.log(`📋 Checking if server is running at ${baseURL}...`);

  // Test if server is already running
  try {
    const response = await fetch(baseURL);
    if (response.ok) {
      console.log('✅ Development server is already running');
    }
  } catch (error) {
    console.log('❌ Development server not running, will be started by webServer config');
  }

  // Launch browser for global setup validation
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    console.log('🔍 Performing initial health check...');

    // Wait for server to be ready
    await page.goto(baseURL, { waitUntil: 'networkidle', timeout: 30000 });

    // Check if Better Being app is loaded
    const title = await page.title();
    console.log(`📄 Page title: ${title}`);

    // Verify Brand Bible colors are loaded
    const primaryColor = await page.evaluate(() => {
      const root = document.documentElement;
      return getComputedStyle(root).getPropertyValue('--bb-orange-500').trim();
    });

    if (primaryColor === '#bb4500' || primaryColor === '#BB4500') {
      console.log('✅ Brand Bible primary color correctly loaded: ' + primaryColor);
    } else {
      console.log('⚠️  Brand Bible color may need verification: ' + primaryColor);
    }

    // Check if fonts are loaded
    const leagueSpartanLoaded = await page.evaluate(() => {
      return document.fonts.check('16px "League Spartan"');
    });

    const playfairLoaded = await page.evaluate(() => {
      return document.fonts.check('16px "Playfair Display"');
    });

    console.log(`📝 League Spartan loaded: ${leagueSpartanLoaded ? '✅' : '❌'}`);
    console.log(`📝 Playfair Display loaded: ${playfairLoaded ? '✅' : '❌'}`);

    // Set up viewport for consistent testing
    await page.setViewportSize({ width: 1440, height: 900 });

    console.log('✅ Global setup completed successfully');
    console.log('🎨 Ready for Brand Bible validation and visual testing');

  } catch (error) {
    console.error('❌ Global setup failed:', error);
    throw error;
  } finally {
    await browser.close();
  }

  // Store setup timestamp for reporting
  process.env.PLAYWRIGHT_SETUP_TIME = new Date().toISOString();

  console.log('🔄 AI-Native Design Workflow initialized');
  console.log('📸 Visual capture and validation ready');
}

export default globalSetup;
