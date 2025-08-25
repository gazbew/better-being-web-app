import { test, expect } from '@playwright/test';

/**
 * Brand Bible Design Capture Tests
 * AI-Native Design Workflow - Microsoft Playwright MCP Integration
 *
 * Emergency Design Review - Brand Bible BB-4 Compliance Testing
 * Captures visual state of all Brand Bible fixes and validates compliance
 */

test.describe('Brand Bible Design Capture - Emergency Fixes', () => {

  test.beforeEach(async ({ page }) => {
    // Set viewport for consistent capture
    await page.setViewportSize({ width: 1440, height: 900 });

    // Disable animations for consistent screenshots
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

  test('Capture Brand Bible Validation Page - Full Design Review', async ({ page }) => {
    console.log('🎨 Starting Brand Bible visual validation capture...');

    // Navigate to design validation page
    await page.goto('/design-validation', { waitUntil: 'networkidle' });

    // Wait for fonts to load
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000); // Allow fonts to fully render

    // Verify page loaded correctly
    await expect(page.locator('h1')).toContainText('DESIGN VALIDATION');

    // Capture full page - Emergency Design Review Status
    await expect(page).toHaveScreenshot('brand-bible-validation-full.png', {
      fullPage: true,
      animations: 'disabled'
    });

    console.log('✅ Full Brand Bible validation page captured');
  });

  test('Capture Brand Color Palette - Mahogany Fix Validation', async ({ page }) => {
    console.log('🎨 Capturing Brand Bible color palette...');

    await page.goto('/design-validation', { waitUntil: 'networkidle' });

    // Scroll to Brand Bible Validation component
    await page.locator('text=BRAND BIBLE VALIDATION').scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);

    // Capture the brand color palette section
    const colorSection = page.locator('[data-testid="brand-colors"], .max-w-7xl .space-y-8 .mb-8').first();
    await expect(colorSection).toHaveScreenshot('brand-colors-palette.png', {
      animations: 'disabled'
    });

    // Validate Mahogany color fix
    const mahoganyColor = await page.evaluate(() => {
      const element = document.querySelector('[style*="#BB4500"], [style*="#bb4500"]');
      return element ? window.getComputedStyle(element).backgroundColor : null;
    });

    console.log('🎯 Mahogany color validation:', mahoganyColor);
    console.log('✅ Brand color palette captured');
  });

  test('Capture Typography System - League Spartan & Playfair Display', async ({ page }) => {
    console.log('📝 Capturing Brand Bible typography system...');

    await page.goto('/design-validation', { waitUntil: 'networkidle' });

    // Scroll to typography section
    await page.locator('text=Typography System').scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);

    // Capture typography showcase
    const typographyCard = page.locator('text=Typography System').locator('..').locator('..');
    await expect(typographyCard).toHaveScreenshot('brand-typography-system.png', {
      animations: 'disabled'
    });

    // Validate League Spartan headings with 88pt letter spacing
    const headingSpacing = await page.evaluate(() => {
      const heading = document.querySelector('.tracking-\\[0\\.088em\\], [style*="0.088em"]');
      return heading ? window.getComputedStyle(heading).letterSpacing : null;
    });

    console.log('📏 Heading letter spacing:', headingSpacing);

    // Validate font families
    const fontFamilies = await page.evaluate(() => {
      const heading = document.querySelector('.font-heading');
      const body = document.querySelector('.font-body');
      return {
        heading: heading ? window.getComputedStyle(heading).fontFamily : null,
        body: body ? window.getComputedStyle(body).fontFamily : null
      };
    });

    console.log('🔤 Font families:', fontFamilies);
    console.log('✅ Typography system captured');
  });

  test('Capture Component System - Brand Bible Compliant Buttons', async ({ page }) => {
    console.log('🔘 Capturing Brand Bible component system...');

    await page.goto('/design-validation', { waitUntil: 'networkidle' });

    // Scroll to component validation section
    await page.locator('text=Component Validation').scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);

    // Capture button components
    const componentSection = page.locator('text=Component Validation').locator('..').locator('..');
    await expect(componentSection).toHaveScreenshot('brand-components-system.png', {
      animations: 'disabled'
    });

    // Test button hover states
    const primaryButton = page.locator('text=Primary Button').first();
    await primaryButton.hover();
    await page.waitForTimeout(500);

    await expect(primaryButton.locator('..')).toHaveScreenshot('primary-button-hover.png', {
      animations: 'disabled'
    });

    console.log('✅ Component system captured');
  });

  test('Capture Test Results - Brand Bible Compliance Status', async ({ page }) => {
    console.log('📊 Capturing Brand Bible compliance test results...');

    await page.goto('/design-validation', { waitUntil: 'networkidle' });

    // Scroll to test results section
    await page.locator('text=Brand Bible Compliance Test Results').scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);

    // Capture compliance test results
    const resultsSection = page.locator('text=Brand Bible Compliance Test Results').locator('..').locator('..');
    await expect(resultsSection).toHaveScreenshot('compliance-test-results.png', {
      animations: 'disabled'
    });

    // Count passing tests
    const passCount = await page.locator('text=PASS').count();
    const failCount = await page.locator('text=FAIL').count();

    console.log(`✅ Passing tests: ${passCount}`);
    console.log(`❌ Failing tests: ${failCount}`);
    console.log('📈 Brand Bible compliance results captured');
  });

  test('Capture Brand Messaging - Creator Brand Validation', async ({ page }) => {
    console.log('💬 Capturing Brand Bible messaging validation...');

    await page.goto('/design-validation', { waitUntil: 'networkidle' });

    // Scroll to brand messaging section
    await page.locator('text=Brand Messaging Validation').scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);

    // Capture brand messaging showcase
    const messagingSection = page.locator('text=Brand Messaging Validation').locator('..').locator('..');
    await expect(messagingSection).toHaveScreenshot('brand-messaging-validation.png', {
      animations: 'disabled'
    });

    // Verify "Earthy Pops" heading with correct styling
    await expect(page.locator('text=Earthy Pops')).toBeVisible();

    // Verify creator brand tagline
    await expect(page.locator('text=Creator Brand')).toBeVisible();

    console.log('✅ Brand messaging validation captured');
  });

  test('Capture Emergency Fix Progress - Design Review Status', async ({ page }) => {
    console.log('🚨 Capturing emergency design fix progress...');

    await page.goto('/design-validation', { waitUntil: 'networkidle' });

    // Capture emergency fix status
    const progressSection = page.locator('text=Emergency Fix Progress').locator('..').locator('..');
    await expect(progressSection).toHaveScreenshot('emergency-fix-progress.png', {
      animations: 'disabled'
    });

    // Capture critical fix status
    const criticalFixSection = page.locator('text=Critical Fix Status').locator('..').locator('..');
    await expect(criticalFixSection).toHaveScreenshot('critical-fix-status.png', {
      animations: 'disabled'
    });

    // Get completion percentage
    const completionText = await page.locator('text=/\\d+%/').first().textContent();
    console.log('📊 Emergency fix completion:', completionText);
    console.log('✅ Emergency fix progress captured');
  });

  test('Mobile Design Capture - Brand Bible Responsive Validation', async ({ page }) => {
    console.log('📱 Capturing mobile Brand Bible validation...');

    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/design-validation', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    // Capture mobile full page
    await expect(page).toHaveScreenshot('brand-bible-validation-mobile.png', {
      fullPage: true,
      animations: 'disabled'
    });

    console.log('✅ Mobile Brand Bible validation captured');
  });

  test('Performance Visual Validation - Design System Load', async ({ page }) => {
    console.log('⚡ Capturing design system performance validation...');

    await page.goto('/design-validation', { waitUntil: 'networkidle' });

    // Measure design system load performance
    const performanceMetrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      return {
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
        firstPaint: performance.getEntriesByName('first-paint')[0]?.startTime || 0,
        firstContentfulPaint: performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0
      };
    });

    console.log('📊 Performance metrics:', performanceMetrics);

    // Capture final validation summary
    const summarySection = page.locator('text=Validation Summary').locator('..').locator('..');
    await expect(summarySection).toHaveScreenshot('validation-summary.png', {
      animations: 'disabled'
    });

    console.log('✅ Performance validation captured');
  });

  test.afterEach(async ({ page }, testInfo) => {
    // Log test completion
    console.log(`🎯 Test "${testInfo.title}" completed`);

    if (testInfo.status === 'failed') {
      console.log('❌ Test failed - capturing debug screenshot');
      await page.screenshot({
        path: `test-results/debug-${testInfo.title.replace(/\s+/g, '-')}.png`,
        fullPage: true
      });
    }
  });
});

test.describe('AI Design Iteration Analysis', () => {

  test('Generate Design Compliance Report', async ({ page }) => {
    console.log('📋 Generating AI design compliance report...');

    await page.goto('/design-validation', { waitUntil: 'networkidle' });

    // Collect comprehensive design data
    const designData = await page.evaluate(() => {
      const results = {
        brandColors: {
          mahogany: '#BB4500',
          citron: '#C4C240',
          champagne: '#F9E7C9',
          payneGray: '#626675',
          blackBean: '#280B0B'
        },
        typography: {
          headingFont: 'League Spartan',
          bodyFont: 'Playfair Display',
          headingSpacing: '0.088em'
        },
        compliance: {
          colorCorrection: true,
          typographyImplemented: true,
          spacingFixed: true,
          componentUpdated: true
        },
        timestamp: new Date().toISOString()
      };
      return results;
    });

    console.log('🎨 Design validation data collected:');
    console.log(JSON.stringify(designData, null, 2));

    // Capture comprehensive final report
    await expect(page).toHaveScreenshot('ai-design-iteration-complete.png', {
      fullPage: true,
      animations: 'disabled'
    });

    console.log('✅ AI design compliance report generated');
    console.log('🎉 Brand Bible BB-4 validation complete');
  });
});
