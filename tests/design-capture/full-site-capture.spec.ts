import { test, expect, Page } from '@playwright/test';

/**
 * Full Site Design Capture Test
 * AI-Native Design Workflow - Visual State Documentation
 *
 * This test captures comprehensive screenshots of all key pages and components
 * for AI visual analysis and design feedback loops.
 */

// Test configuration
test.describe('Better Being - Full Site Design Capture', () => {
  test.setTimeout(120000); // Extended timeout for comprehensive capture

  let page: Page;

  test.beforeEach(async ({ page: testPage }) => {
    page = testPage;

    // Wait for fonts to load
    await page.addStyleTag({
      content: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        * { font-display: block !important; }
      `
    });

    // Wait for network to be idle
    await page.goto('/', { waitUntil: 'networkidle' });

    // Wait for custom fonts to load
    await page.waitForTimeout(2000);
  });

  test('Homepage - Full Design Capture', async () => {
    console.log('🏠 Capturing Homepage Design...');

    // Wait for hero section to fully load
    await page.waitForSelector('[data-testid="hero-section"]', { timeout: 10000 });

    // Disable animations for consistent screenshots
    await page.addStyleTag({
      content: `
        *, *::before, *::after {
          animation-duration: 0.01ms !important;
          animation-delay: -0.01ms !important;
          transition-duration: 0.01ms !important;
          transition-delay: 0.01ms !important;
        }
      `
    });

    // Wait for layout stability
    await page.waitForTimeout(1000);

    // Full page screenshot
    await expect(page).toHaveScreenshot('homepage-full.png', {
      fullPage: true,
      animations: 'disabled'
    });

    // Above-the-fold screenshot
    await expect(page).toHaveScreenshot('homepage-hero.png', {
      clip: { x: 0, y: 0, width: 1440, height: 900 },
      animations: 'disabled'
    });

    console.log('✅ Homepage capture complete');
  });

  test('Products Page - Design Capture', async () => {
    console.log('🛍️ Capturing Products Page Design...');

    await page.goto('/products', { waitUntil: 'networkidle' });

    // Wait for product grid to load
    await page.waitForSelector('[data-testid="product-grid"]', { timeout: 10000 });
    await page.waitForTimeout(2000);

    // Disable animations
    await page.addStyleTag({
      content: `
        *, *::before, *::after {
          animation-duration: 0.01ms !important;
          transition-duration: 0.01ms !important;
        }
      `
    });

    // Full products page
    await expect(page).toHaveScreenshot('products-full.png', {
      fullPage: true,
      animations: 'disabled'
    });

    // Product grid section
    await expect(page.locator('[data-testid="product-grid"]')).toHaveScreenshot('product-grid.png', {
      animations: 'disabled'
    });

    console.log('✅ Products page capture complete');
  });

  test('Product Detail Page - Design Capture', async () => {
    console.log('📦 Capturing Product Detail Design...');

    // Navigate to first available product
    await page.goto('/products', { waitUntil: 'networkidle' });

    // Wait for products to load and click first product
    await page.waitForSelector('[data-testid="product-card"]', { timeout: 10000 });
    await page.click('[data-testid="product-card"] a', { timeout: 5000 });

    // Wait for product detail page
    await page.waitForSelector('[data-testid="product-detail"]', { timeout: 10000 });
    await page.waitForTimeout(2000);

    // Disable animations
    await page.addStyleTag({
      content: `*, *::before, *::after { animation-duration: 0.01ms !important; }`
    });

    // Full product detail page
    await expect(page).toHaveScreenshot('product-detail-full.png', {
      fullPage: true,
      animations: 'disabled'
    });

    // Product info section
    await expect(page.locator('[data-testid="product-info"]')).toHaveScreenshot('product-info.png', {
      animations: 'disabled'
    });

    console.log('✅ Product detail capture complete');
  });

  test('About Page - Design Capture', async () => {
    console.log('ℹ️ Capturing About Page Design...');

    await page.goto('/about', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    // Disable animations
    await page.addStyleTag({
      content: `*, *::before, *::after { animation-duration: 0.01ms !important; }`
    });

    // Full about page
    await expect(page).toHaveScreenshot('about-full.png', {
      fullPage: true,
      animations: 'disabled'
    });

    console.log('✅ About page capture complete');
  });

  test('Contact Page - Design Capture', async () => {
    console.log('📞 Capturing Contact Page Design...');

    await page.goto('/contact', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    // Disable animations
    await page.addStyleTag({
      content: `*, *::before, *::after { animation-duration: 0.01ms !important; }`
    });

    // Full contact page
    await expect(page).toHaveScreenshot('contact-full.png', {
      fullPage: true,
      animations: 'disabled'
    });

    // Contact form section
    if (await page.locator('[data-testid="contact-form"]').count() > 0) {
      await expect(page.locator('[data-testid="contact-form"]')).toHaveScreenshot('contact-form.png', {
        animations: 'disabled'
      });
    }

    console.log('✅ Contact page capture complete');
  });

  test('Navigation and Header - Component Capture', async () => {
    console.log('🧭 Capturing Navigation Components...');

    await page.goto('/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    // Header in default state
    const header = page.locator('header, [data-testid="header"], nav[role="banner"]').first();
    if (await header.count() > 0) {
      await expect(header).toHaveScreenshot('header-default.png', {
        animations: 'disabled'
      });
    }

    // Mobile menu trigger (if exists)
    const mobileMenuButton = page.locator('[data-testid="mobile-menu-trigger"], button[aria-label*="menu"]').first();
    if (await mobileMenuButton.count() > 0 && await mobileMenuButton.isVisible()) {
      await mobileMenuButton.click();
      await page.waitForTimeout(500);

      await expect(page).toHaveScreenshot('mobile-menu-open.png', {
        animations: 'disabled'
      });
    }

    console.log('✅ Navigation capture complete');
  });

  test('Footer - Component Capture', async () => {
    console.log('🦶 Capturing Footer Component...');

    await page.goto('/', { waitUntil: 'networkidle' });

    // Scroll to footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1000);

    const footer = page.locator('footer, [data-testid="footer"]').first();
    if (await footer.count() > 0) {
      await expect(footer).toHaveScreenshot('footer.png', {
        animations: 'disabled'
      });
    }

    console.log('✅ Footer capture complete');
  });

  test('Button States - Component Capture', async () => {
    console.log('🔘 Capturing Button States...');

    await page.goto('/', { waitUntil: 'networkidle' });

    // Find primary buttons
    const primaryButton = page.locator('button[class*="primary"], .btn-primary, [data-testid*="primary-button"]').first();

    if (await primaryButton.count() > 0) {
      // Default state
      await expect(primaryButton).toHaveScreenshot('button-primary-default.png', {
        animations: 'disabled'
      });

      // Hover state
      await primaryButton.hover();
      await page.waitForTimeout(200);
      await expect(primaryButton).toHaveScreenshot('button-primary-hover.png', {
        animations: 'disabled'
      });

      // Focus state
      await primaryButton.focus();
      await page.waitForTimeout(200);
      await expect(primaryButton).toHaveScreenshot('button-primary-focus.png', {
        animations: 'disabled'
      });
    }

    console.log('✅ Button states capture complete');
  });

  test('Form Elements - Component Capture', async () => {
    console.log('📝 Capturing Form Elements...');

    // Try contact page first, fallback to any page with forms
    await page.goto('/contact', { waitUntil: 'networkidle' });

    let hasContactForm = await page.locator('form, [data-testid="contact-form"]').count() > 0;

    if (!hasContactForm) {
      await page.goto('/', { waitUntil: 'networkidle' });
    }

    // Input field states
    const textInput = page.locator('input[type="text"], input[type="email"]').first();
    if (await textInput.count() > 0) {
      // Empty state
      await expect(textInput).toHaveScreenshot('input-empty.png', {
        animations: 'disabled'
      });

      // Filled state
      await textInput.fill('example@email.com');
      await expect(textInput).toHaveScreenshot('input-filled.png', {
        animations: 'disabled'
      });

      // Focus state
      await textInput.focus();
      await page.waitForTimeout(200);
      await expect(textInput).toHaveScreenshot('input-focus.png', {
        animations: 'disabled'
      });
    }

    console.log('✅ Form elements capture complete');
  });

  test('Loading States - Component Capture', async () => {
    console.log('⏳ Capturing Loading States...');

    await page.goto('/', { waitUntil: 'domcontentloaded' });

    // Capture any loading spinners or skeletons
    const loadingElements = page.locator('[data-testid*="loading"], .loading, .spinner, .skeleton');

    if (await loadingElements.count() > 0) {
      await expect(loadingElements.first()).toHaveScreenshot('loading-state.png', {
        animations: 'disabled'
      });
    }

    console.log('✅ Loading states capture complete');
  });

  test('Error States - Component Capture', async () => {
    console.log('❌ Capturing Error States...');

    // Try to trigger 404 page
    await page.goto('/nonexistent-page', { waitUntil: 'networkidle' });

    // Check if custom 404 page exists
    const errorContent = page.locator('[data-testid="error-404"], .error-page, h1:has-text("404")');

    if (await errorContent.count() > 0) {
      await expect(page).toHaveScreenshot('error-404.png', {
        fullPage: true,
        animations: 'disabled'
      });
    }

    console.log('✅ Error states capture complete');
  });

  test('Design System Colors - Visual Documentation', async () => {
    console.log('🎨 Capturing Design System Colors...');

    // Create a temporary page to showcase colors
    await page.setContent(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Better Being Design System</title>
          <style>
            body { font-family: 'Inter', sans-serif; padding: 20px; background: #FEFEFE; }
            .color-palette { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin: 20px 0; }
            .color-swatch {
              padding: 16px;
              border-radius: 12px;
              border: 1px solid rgba(184, 90, 62, 0.1);
              text-align: center;
            }
            .primary { background: #B85A3E; color: white; }
            .secondary { background: #7A9B7A; color: white; }
            .champagne { background: #F5E6D3; color: #2A1F1A; }
            .charcoal { background: #2A1F1A; color: white; }
            .gray-100 { background: #F5F5F4; color: #2A1F1A; }
            .gray-300 { background: #D6D3D1; color: #2A1F1A; }
            .gray-600 { background: #57534E; color: white; }
            h1 { color: #2A1F1A; font-weight: 700; font-size: 2rem; margin-bottom: 1rem; }
            .swatch-label { font-weight: 500; margin-top: 8px; }
          </style>
        </head>
        <body>
          <h1>Better Being Design System Colors</h1>
          <div class="color-palette">
            <div class="color-swatch primary">
              <div class="swatch-label">Rust Orange<br>#B85A3E</div>
            </div>
            <div class="color-swatch secondary">
              <div class="swatch-label">Sage Green<br>#7A9B7A</div>
            </div>
            <div class="color-swatch champagne">
              <div class="swatch-label">Warm Champagne<br>#F5E6D3</div>
            </div>
            <div class="color-swatch charcoal">
              <div class="swatch-label">Deep Charcoal<br>#2A1F1A</div>
            </div>
            <div class="color-swatch gray-100">
              <div class="swatch-label">Gray 100<br>#F5F5F4</div>
            </div>
            <div class="color-swatch gray-300">
              <div class="swatch-label">Gray 300<br>#D6D3D1</div>
            </div>
            <div class="color-swatch gray-600">
              <div class="swatch-label">Gray 600<br>#57534E</div>
            </div>
          </div>
        </body>
      </html>
    `);

    await page.waitForTimeout(1000);

    await expect(page).toHaveScreenshot('design-system-colors.png', {
      fullPage: true,
      animations: 'disabled'
    });

    console.log('✅ Design system colors capture complete');
  });
});

// Additional utility test for capturing specific components
test.describe('Component-Specific Captures', () => {
  test('Product Cards - All States', async ({ page }) => {
    console.log('🃏 Capturing Product Card States...');

    await page.goto('/products', { waitUntil: 'networkidle' });
    await page.waitForSelector('[data-testid="product-card"]', { timeout: 10000 });

    const productCard = page.locator('[data-testid="product-card"]').first();

    if (await productCard.count() > 0) {
      // Default state
      await expect(productCard).toHaveScreenshot('product-card-default.png', {
        animations: 'disabled'
      });

      // Hover state
      await productCard.hover();
      await page.waitForTimeout(300);
      await expect(productCard).toHaveScreenshot('product-card-hover.png', {
        animations: 'disabled'
      });
    }

    console.log('✅ Product card states capture complete');
  });

  test('Call-to-Action Sections', async ({ page }) => {
    console.log('📢 Capturing CTA Sections...');

    await page.goto('/', { waitUntil: 'networkidle' });

    // Find CTA sections
    const ctaSections = page.locator('[data-testid*="cta"], .cta, section:has(button)');

    const count = await ctaSections.count();
    for (let i = 0; i < Math.min(count, 3); i++) {
      const section = ctaSections.nth(i);
      if (await section.isVisible()) {
        await expect(section).toHaveScreenshot(`cta-section-${i + 1}.png`, {
          animations: 'disabled'
        });
      }
    }

    console.log('✅ CTA sections capture complete');
  });
});
