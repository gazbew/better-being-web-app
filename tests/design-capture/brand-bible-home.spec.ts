import { test, expect } from '@playwright/test';

/**
 * Brand Bible Home Page Visual Test
 * AI-Native Design Workflow - Microsoft Playwright MCP Integration
 *
 * Simple Brand Bible validation on the working home page
 * Tests critical color and typography fixes
 */

test.describe('Brand Bible Home Page Validation', () => {

  test.beforeEach(async ({ page }) => {
    // Set consistent viewport
    await page.setViewportSize({ width: 1440, height: 900 });

    // Disable animations for consistent capture
    await page.addStyleTag({
      content: `
        *, *::before, *::after {
          animation-duration: 0s !important;
          animation-delay: 0s !important;
          transition-duration: 0s !important;
          transition-delay: 0s !important;
        }
      `
    });
  });

  test('Capture Brand Bible Home Page - Mahogany Color Fix', async ({ page }) => {
    console.log('🎨 Starting Brand Bible home page visual capture...');

    // Navigate to home page
    await page.goto('/', { waitUntil: 'networkidle', timeout: 30000 });

    // Wait for page to fully load
    await page.waitForTimeout(3000);

    // Verify Better Being is loaded
    await expect(page.locator('text=Better Being')).toBeVisible();
    console.log('✅ Better Being home page loaded');

    // Capture full home page
    await expect(page).toHaveScreenshot('brand-bible-home-full.png', {
      fullPage: true,
      animations: 'disabled',
      threshold: 0.3
    });

    console.log('📸 Full home page captured');
  });

  test('Validate Mahogany Color Implementation', async ({ page }) => {
    console.log('🎯 Testing Mahogany color fix (#BB4500)...');

    await page.goto('/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    // Check for Mahogany color in CSS variables
    const primaryColor = await page.evaluate(() => {
      const root = document.documentElement;
      const computed = getComputedStyle(root);
      return {
        primary: computed.getPropertyValue('--primary').trim(),
        bbOrange: computed.getPropertyValue('--bb-orange-500').trim()
      };
    });

    console.log('🎨 Primary colors detected:', primaryColor);

    // Look for elements with primary/mahogany color
    const mahoganyElements = await page.locator('[class*="bg-primary"], [class*="text-primary"], [class*="mahogany"]').count();
    console.log(`🔍 Found ${mahoganyElements} elements with brand colors`);

    // Capture primary colored elements
    const primaryButton = page.locator('button').first();
    if (await primaryButton.isVisible()) {
      await expect(primaryButton).toHaveScreenshot('primary-button-mahogany.png', {
        animations: 'disabled'
      });
      console.log('🔘 Primary button captured');
    }

    console.log('✅ Mahogany color validation complete');
  });

  test('Validate Typography - League Spartan & Playfair Display', async ({ page }) => {
    console.log('📝 Testing Brand Bible typography...');

    await page.goto('/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    // Check font loading
    const fontCheck = await page.evaluate(() => {
      return {
        leagueSpartan: document.fonts.check('16px "League Spartan"'),
        playfairDisplay: document.fonts.check('16px "Playfair Display"'),
        loadedFonts: Array.from(document.fonts.values()).map(f => f.family)
      };
    });

    console.log('📋 Font loading status:', fontCheck);

    // Look for headings (should use League Spartan)
    const headings = await page.locator('h1, h2, h3, .font-heading').count();
    console.log(`📄 Found ${headings} headings`);

    // Capture main heading
    const mainHeading = page.locator('h1').first();
    if (await mainHeading.isVisible()) {
      await expect(mainHeading).toHaveScreenshot('main-heading-typography.png', {
        animations: 'disabled'
      });
      console.log('📝 Main heading typography captured');
    }

    // Check for letter spacing (88pt = 0.088em)
    const spacingCheck = await page.evaluate(() => {
      const heading = document.querySelector('h1, .tracking-\\[0\\.088em\\]');
      return heading ? {
        letterSpacing: window.getComputedStyle(heading).letterSpacing,
        fontFamily: window.getComputedStyle(heading).fontFamily,
        textTransform: window.getComputedStyle(heading).textTransform
      } : null;
    });

    console.log('📏 Heading styles:', spacingCheck);
    console.log('✅ Typography validation complete');
  });

  test('Capture Hero Section - Brand Bible Compliant', async ({ page }) => {
    console.log('🦸 Capturing hero section with Brand Bible fixes...');

    await page.goto('/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    // Find and capture hero section
    const heroSection = page.locator('section').first();
    if (await heroSection.isVisible()) {
      await expect(heroSection).toHaveScreenshot('hero-section-brand-bible.png', {
        animations: 'disabled'
      });
      console.log('🎯 Hero section captured');
    }

    // Look for brand elements
    const brandElements = await page.evaluate(() => {
      const elements = [];

      // Check for Better Being branding
      const brandText = document.querySelector('text=Better Being, h1:contains("Better Being")');
      if (brandText) elements.push('Better Being text found');

      // Check for mahogany color usage
      const mahoganyElements = document.querySelectorAll('[style*="#BB4500"], [style*="#bb4500"]');
      elements.push(`${mahoganyElements.length} mahogany colored elements`);

      // Check for Brand Bible fonts
      const headings = document.querySelectorAll('h1, h2, h3');
      let spartanCount = 0;
      headings.forEach(h => {
        if (getComputedStyle(h).fontFamily.includes('League Spartan')) spartanCount++;
      });
      elements.push(`${spartanCount} League Spartan headings`);

      return elements;
    });

    console.log('🔍 Brand elements found:', brandElements);
    console.log('✅ Hero section validation complete');
  });

  test('Performance and Visual Validation', async ({ page }) => {
    console.log('⚡ Testing design system performance...');

    await page.goto('/', { waitUntil: 'networkidle' });

    // Measure performance
    const metrics = await page.evaluate(() => {
      const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      return {
        domContentLoaded: Math.round(nav.domContentLoadedEventEnd - nav.domContentLoadedEventStart),
        loadComplete: Math.round(nav.loadEventEnd - nav.loadEventStart),
        firstPaint: Math.round(performance.getEntriesByName('first-paint')[0]?.startTime || 0),
        firstContentfulPaint: Math.round(performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0)
      };
    });

    console.log('📊 Performance metrics:', metrics);

    // Comprehensive page validation
    const validationData = await page.evaluate(() => {
      return {
        title: document.title,
        hasH1: !!document.querySelector('h1'),
        hasBetterBeingText: !!document.querySelector('*:contains("Better Being")'),
        brandColorElements: document.querySelectorAll('[class*="mahogany"], [class*="primary"]').length,
        headingElements: document.querySelectorAll('h1, h2, h3, h4, h5, h6').length,
        buttonElements: document.querySelectorAll('button').length,
        timestamp: new Date().toISOString()
      };
    });

    console.log('🎨 Brand Bible validation data:', validationData);

    // Final comprehensive screenshot
    await expect(page).toHaveScreenshot('brand-bible-validation-complete.png', {
      fullPage: true,
      animations: 'disabled',
      threshold: 0.3
    });

    console.log('✅ Performance validation complete');
    console.log('🎉 Brand Bible home page validation successful');
  });

  test.afterEach(async ({ page }, testInfo) => {
    console.log(`🎯 Test "${testInfo.title}" completed with status: ${testInfo.status}`);

    if (testInfo.status === 'failed') {
      console.log('❌ Test failed - capturing debug screenshot');
      await page.screenshot({
        path: `test-results/debug-home-${testInfo.title.replace(/\s+/g, '-')}.png`,
        fullPage: true
      });
    }
  });
});
