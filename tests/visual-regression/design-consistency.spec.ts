import { test, expect, Page } from '@playwright/test';

/**
 * Visual Regression Testing Suite
 * Better Being - AI-Native Design Consistency Validation
 *
 * This test suite compares current design implementations against approved baselines
 * to detect visual regressions and ensure design system consistency.
 */

test.describe('Better Being - Visual Regression Testing', () => {
  test.setTimeout(90000);

  let page: Page;

  test.beforeEach(async ({ page: testPage }) => {
    page = testPage;

    // Ensure consistent testing environment
    await page.addStyleTag({
      content: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

        /* Disable animations for consistent screenshots */
        *, *::before, *::after {
          animation-duration: 0.01ms !important;
          animation-delay: -0.01ms !important;
          transition-duration: 0.01ms !important;
          transition-delay: 0.01ms !important;
          scroll-behavior: auto !important;
        }

        /* Ensure fonts are loaded */
        * { font-display: block !important; }
      `
    });

    // Wait for network idle and fonts
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
  });

  test('Homepage - Visual Regression Baseline', async () => {
    console.log('🏠 Testing Homepage Visual Consistency...');

    // Wait for critical elements to load
    await page.waitForSelector('main, [role="main"], .main-content', { timeout: 15000 });

    // Ensure hero section is loaded
    const heroSection = page.locator('[data-testid="hero-section"], .hero, section').first();
    if (await heroSection.count() > 0) {
      await heroSection.waitFor({ state: 'visible' });
    }

    // Full page regression test
    await expect(page).toHaveScreenshot('homepage-regression.png', {
      fullPage: true,
      threshold: 0.2,
      animations: 'disabled'
    });

    // Hero section specific regression test
    if (await heroSection.count() > 0) {
      await expect(heroSection).toHaveScreenshot('hero-section-regression.png', {
        threshold: 0.15,
        animations: 'disabled'
      });
    }

    console.log('✅ Homepage visual regression test passed');
  });

  test('Navigation Header - Design Consistency', async () => {
    console.log('🧭 Testing Navigation Design Consistency...');

    const header = page.locator('header, nav[role="banner"], [data-testid="header"]').first();

    if (await header.count() > 0) {
      await header.waitFor({ state: 'visible' });

      // Header regression test
      await expect(header).toHaveScreenshot('header-regression.png', {
        threshold: 0.1,
        animations: 'disabled'
      });

      // Test hover states on navigation items
      const navLinks = header.locator('a, button');
      const linkCount = await navLinks.count();

      if (linkCount > 0) {
        // Test first nav link hover state
        await navLinks.first().hover();
        await page.waitForTimeout(300);
        await expect(header).toHaveScreenshot('header-nav-hover-regression.png', {
          threshold: 0.15,
          animations: 'disabled'
        });
      }
    }

    console.log('✅ Navigation design consistency test passed');
  });

  test('Product Grid - Visual Consistency', async () => {
    console.log('🛍️ Testing Product Grid Visual Consistency...');

    await page.goto('/products', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    // Wait for product grid to load
    const productGrid = page.locator('[data-testid="product-grid"], .product-grid, .products-container').first();

    if (await productGrid.count() > 0) {
      await productGrid.waitFor({ state: 'visible' });

      // Product grid regression test
      await expect(productGrid).toHaveScreenshot('product-grid-regression.png', {
        threshold: 0.2,
        animations: 'disabled'
      });

      // Individual product card regression test
      const productCard = productGrid.locator('[data-testid="product-card"], .product-card').first();

      if (await productCard.count() > 0) {
        await expect(productCard).toHaveScreenshot('product-card-regression.png', {
          threshold: 0.1,
          animations: 'disabled'
        });

        // Product card hover state
        await productCard.hover();
        await page.waitForTimeout(300);
        await expect(productCard).toHaveScreenshot('product-card-hover-regression.png', {
          threshold: 0.15,
          animations: 'disabled'
        });
      }
    }

    console.log('✅ Product grid visual consistency test passed');
  });

  test('Button Components - Design System Consistency', async () => {
    console.log('🔘 Testing Button Design System Consistency...');

    // Test primary buttons
    const primaryButton = page.locator('button:not([disabled]), .btn-primary, [data-testid*="primary-button"]').first();

    if (await primaryButton.count() > 0) {
      // Default state
      await expect(primaryButton).toHaveScreenshot('button-primary-regression.png', {
        threshold: 0.05,
        animations: 'disabled'
      });

      // Hover state
      await primaryButton.hover();
      await page.waitForTimeout(200);
      await expect(primaryButton).toHaveScreenshot('button-primary-hover-regression.png', {
        threshold: 0.1,
        animations: 'disabled'
      });

      // Focus state
      await primaryButton.focus();
      await page.waitForTimeout(200);
      await expect(primaryButton).toHaveScreenshot('button-primary-focus-regression.png', {
        threshold: 0.1,
        animations: 'disabled'
      });
    }

    // Test secondary buttons if they exist
    const secondaryButton = page.locator('.btn-secondary, [data-testid*="secondary-button"]').first();

    if (await secondaryButton.count() > 0) {
      await expect(secondaryButton).toHaveScreenshot('button-secondary-regression.png', {
        threshold: 0.05,
        animations: 'disabled'
      });
    }

    console.log('✅ Button design system consistency test passed');
  });

  test('Typography Scale - Design System Validation', async () => {
    console.log('📝 Testing Typography Scale Consistency...');

    // Create a typography showcase for testing
    await page.setContent(`
      <!DOCTYPE html>
      <html>
        <head>
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
          <style>
            body {
              font-family: 'Inter', system-ui, sans-serif;
              padding: 24px;
              background: #FEFEFE;
              color: #2A1F1A;
              line-height: 1.6;
            }
            .typography-sample {
              margin: 16px 0;
              padding: 12px 0;
            }
            .display-xxl { font-size: 4.5rem; font-weight: 800; line-height: 1.1; }
            .display-xl { font-size: 3.75rem; font-weight: 700; line-height: 1.15; }
            .display-large { font-size: 3rem; font-weight: 700; line-height: 1.2; }
            .h1 { font-size: 2.25rem; font-weight: 700; line-height: 1.25; }
            .h2 { font-size: 1.875rem; font-weight: 600; line-height: 1.3; }
            .h3 { font-size: 1.5rem; font-weight: 600; line-height: 1.35; }
            .h4 { font-size: 1.25rem; font-weight: 600; line-height: 1.4; }
            .body-large { font-size: 1.125rem; font-weight: 400; line-height: 1.7; }
            .body { font-size: 1rem; font-weight: 400; line-height: 1.6; }
            .body-small { font-size: 0.875rem; font-weight: 400; line-height: 1.55; }
          </style>
        </head>
        <body>
          <div class="typography-sample display-xxl">Display XXL - Better Being</div>
          <div class="typography-sample display-xl">Display XL - Transform Your Life</div>
          <div class="typography-sample display-large">Display Large - Premium Wellness</div>
          <div class="typography-sample h1">H1 - Page Heading Example</div>
          <div class="typography-sample h2">H2 - Section Heading Example</div>
          <div class="typography-sample h3">H3 - Subsection Heading</div>
          <div class="typography-sample h4">H4 - Component Heading</div>
          <div class="typography-sample body-large">Body Large - Hero subtext and important content goes here to showcase the typography scale.</div>
          <div class="typography-sample body">Body - Standard paragraph text that represents the majority of content on the website.</div>
          <div class="typography-sample body-small">Body Small - Helper text, captions, and metadata information.</div>
        </body>
      </html>
    `);

    await page.waitForTimeout(1000);

    await expect(page).toHaveScreenshot('typography-scale-regression.png', {
      fullPage: true,
      threshold: 0.05,
      animations: 'disabled'
    });

    console.log('✅ Typography scale consistency test passed');
  });

  test('Color Palette - Brand Consistency', async () => {
    console.log('🎨 Testing Color Palette Brand Consistency...');

    // Create color palette showcase
    await page.setContent(`
      <!DOCTYPE html>
      <html>
        <head>
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
          <style>
            body {
              font-family: 'Inter', sans-serif;
              padding: 24px;
              background: #FEFEFE;
              margin: 0;
            }
            .color-grid {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
              gap: 16px;
              margin: 20px 0;
            }
            .color-swatch {
              padding: 24px 16px;
              border-radius: 12px;
              text-align: center;
              border: 1px solid rgba(184, 90, 62, 0.1);
              font-weight: 500;
            }
            .primary { background: #B85A3E; color: white; }
            .secondary { background: #7A9B7A; color: white; }
            .champagne { background: #F5E6D3; color: #2A1F1A; }
            .charcoal { background: #2A1F1A; color: white; }
            .gray-100 { background: #F5F5F4; color: #2A1F1A; border: 1px solid #D6D3D1; }
            .gray-300 { background: #D6D3D1; color: #2A1F1A; }
            .gray-600 { background: #57534E; color: white; }
            .gray-800 { background: #292524; color: white; }
            h1 {
              color: #2A1F1A;
              font-weight: 700;
              font-size: 2rem;
              margin-bottom: 1rem;
              text-align: center;
            }
            .hex-code {
              font-size: 0.875rem;
              margin-top: 8px;
              opacity: 0.9;
            }
          </style>
        </head>
        <body>
          <h1>Better Being Brand Color Palette</h1>
          <div class="color-grid">
            <div class="color-swatch primary">
              <div>Rust Orange</div>
              <div class="hex-code">#B85A3E</div>
            </div>
            <div class="color-swatch secondary">
              <div>Sage Green</div>
              <div class="hex-code">#7A9B7A</div>
            </div>
            <div class="color-swatch champagne">
              <div>Warm Champagne</div>
              <div class="hex-code">#F5E6D3</div>
            </div>
            <div class="color-swatch charcoal">
              <div>Deep Charcoal</div>
              <div class="hex-code">#2A1F1A</div>
            </div>
            <div class="color-swatch gray-100">
              <div>Gray 100</div>
              <div class="hex-code">#F5F5F4</div>
            </div>
            <div class="color-swatch gray-300">
              <div>Gray 300</div>
              <div class="hex-code">#D6D3D1</div>
            </div>
            <div class="color-swatch gray-600">
              <div>Gray 600</div>
              <div class="hex-code">#57534E</div>
            </div>
            <div class="color-swatch gray-800">
              <div>Gray 800</div>
              <div class="hex-code">#292524</div>
            </div>
          </div>
        </body>
      </html>
    `);

    await page.waitForTimeout(1000);

    await expect(page).toHaveScreenshot('color-palette-regression.png', {
      fullPage: true,
      threshold: 0.02,
      animations: 'disabled'
    });

    console.log('✅ Color palette brand consistency test passed');
  });

  test('Spacing System - Design Consistency', async () => {
    console.log('📏 Testing Spacing System Consistency...');

    // Create spacing showcase
    await page.setContent(`
      <!DOCTYPE html>
      <html>
        <head>
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
          <style>
            body {
              font-family: 'Inter', sans-serif;
              padding: 24px;
              background: #FEFEFE;
              color: #2A1F1A;
              margin: 0;
            }
            .spacing-demo {
              margin: 16px 0;
              border: 1px solid #D6D3D1;
              border-radius: 8px;
              overflow: hidden;
            }
            .spacing-label {
              background: #F5E6D3;
              padding: 8px 12px;
              font-weight: 500;
              font-size: 14px;
              border-bottom: 1px solid #D6D3D1;
            }
            .spacing-content {
              padding: 16px;
            }
            .spacing-box {
              background: #B85A3E;
              color: white;
              text-align: center;
              font-weight: 500;
              border-radius: 4px;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .xs { padding: 4px; }
            .sm { padding: 8px; }
            .md { padding: 12px; }
            .lg { padding: 16px; }
            .xl { padding: 24px; }
            .xxl { padding: 32px; }
            .xxxl { padding: 48px; }
            h1 {
              text-align: center;
              font-weight: 700;
              font-size: 2rem;
              margin-bottom: 2rem;
            }
          </style>
        </head>
        <body>
          <h1>Better Being Spacing System</h1>

          <div class="spacing-demo">
            <div class="spacing-label">XS - 4px (0.25rem)</div>
            <div class="spacing-content">
              <div class="spacing-box xs">4px padding</div>
            </div>
          </div>

          <div class="spacing-demo">
            <div class="spacing-label">SM - 8px (0.5rem)</div>
            <div class="spacing-content">
              <div class="spacing-box sm">8px padding</div>
            </div>
          </div>

          <div class="spacing-demo">
            <div class="spacing-label">MD - 12px (0.75rem)</div>
            <div class="spacing-content">
              <div class="spacing-box md">12px padding</div>
            </div>
          </div>

          <div class="spacing-demo">
            <div class="spacing-label">LG - 16px (1rem)</div>
            <div class="spacing-content">
              <div class="spacing-box lg">16px padding</div>
            </div>
          </div>

          <div class="spacing-demo">
            <div class="spacing-label">XL - 24px (1.5rem)</div>
            <div class="spacing-content">
              <div class="spacing-box xl">24px padding</div>
            </div>
          </div>

          <div class="spacing-demo">
            <div class="spacing-label">2XL - 32px (2rem)</div>
            <div class="spacing-content">
              <div class="spacing-box xxl">32px padding</div>
            </div>
          </div>

          <div class="spacing-demo">
            <div class="spacing-label">3XL - 48px (3rem)</div>
            <div class="spacing-content">
              <div class="spacing-box xxxl">48px padding</div>
            </div>
          </div>
        </body>
      </html>
    `);

    await page.waitForTimeout(1000);

    await expect(page).toHaveScreenshot('spacing-system-regression.png', {
      fullPage: true,
      threshold: 0.02,
      animations: 'disabled'
    });

    console.log('✅ Spacing system consistency test passed');
  });

  test('Footer Component - Visual Consistency', async () => {
    console.log('🦶 Testing Footer Visual Consistency...');

    // Scroll to bottom to ensure footer is loaded
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1000);

    const footer = page.locator('footer, [data-testid="footer"]').first();

    if (await footer.count() > 0) {
      await footer.waitFor({ state: 'visible' });

      await expect(footer).toHaveScreenshot('footer-regression.png', {
        threshold: 0.1,
        animations: 'disabled'
      });
    }

    console.log('✅ Footer visual consistency test passed');
  });

  test('Mobile Responsive Design - Visual Consistency', async () => {
    console.log('📱 Testing Mobile Responsive Visual Consistency...');

    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    // Mobile homepage regression
    await expect(page).toHaveScreenshot('mobile-homepage-regression.png', {
      fullPage: true,
      threshold: 0.2,
      animations: 'disabled'
    });

    // Test mobile navigation if it exists
    const mobileMenuButton = page.locator('[data-testid="mobile-menu"], button[aria-label*="menu"]').first();

    if (await mobileMenuButton.count() > 0) {
      await mobileMenuButton.click();
      await page.waitForTimeout(500);

      await expect(page).toHaveScreenshot('mobile-menu-regression.png', {
        threshold: 0.15,
        animations: 'disabled'
      });
    }

    console.log('✅ Mobile responsive design consistency test passed');
  });

  test('Accessibility Focus States - Visual Validation', async () => {
    console.log('♿ Testing Accessibility Focus States...');

    // Test keyboard navigation focus states
    await page.keyboard.press('Tab');
    await page.waitForTimeout(300);

    // Capture focused element
    const focusedElement = page.locator(':focus');

    if (await focusedElement.count() > 0) {
      await expect(focusedElement).toHaveScreenshot('focus-state-regression.png', {
        threshold: 0.1,
        animations: 'disabled'
      });
    }

    console.log('✅ Accessibility focus states test passed');
  });
});

/**
 * Cross-browser Visual Regression Tests
 * Tests the same components across different browsers to ensure consistency
 */
test.describe('Cross-Browser Visual Consistency', () => {
  test('Homepage - Cross-Browser Consistency', async ({ page, browserName }) => {
    console.log(`🌐 Testing Homepage in ${browserName}...`);

    await page.goto('/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    // Add browser-specific styling if needed
    await page.addStyleTag({
      content: `
        *, *::before, *::after {
          animation-duration: 0.01ms !important;
          transition-duration: 0.01ms !important;
        }
      `
    });

    await expect(page).toHaveScreenshot(`homepage-${browserName}-regression.png`, {
      fullPage: true,
      threshold: 0.3, // Higher threshold for cross-browser differences
      animations: 'disabled'
    });

    console.log(`✅ ${browserName} homepage consistency test passed`);
  });
});
