import { test, expect } from '@playwright/test';
import { chromium, devices } from 'playwright';

/**
 * BETTER BEING - HOMEPAGE REDESIGN VALIDATION
 *
 * Professional AI Design Process Validation Suite
 * Tests Brand Bible compliance, Cannabo-inspired structure, and UX excellence
 */

test.describe('Homepage Redesign - Professional Design Validation', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to homepage
    await page.goto('/');

    // Wait for fonts to load to ensure accurate visual testing
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000); // Allow fonts to render
  });

  test.describe('Brand Bible Compliance Validation', () => {

    test('validates Brand Bible color palette implementation', async ({ page }) => {
      // Test Mahogany #BB4500 (Primary)
      const heroSection = page.locator('section').first();
      await expect(heroSection).toHaveCSS('background-image', /.*bb4500.*/i);

      // Test primary buttons use Mahogany
      const primaryButtons = page.locator('button:has-text("Start Shopping")');
      await expect(primaryButtons.first()).toHaveCSS('background-color', 'rgb(187, 69, 0)');

      // Test Citron #C4C240 (Secondary) usage
      const subscribeButton = page.locator('button:has-text("Subscribe Now")');
      await expect(subscribeButton).toHaveCSS('background-color', 'rgb(196, 194, 64)');

      // Test Champagne #F9E7C9 (Accent) in category cards
      const categoryIcons = page.locator('[class*="bg-\\[\\#F9E7C9\\]"]');
      await expect(categoryIcons.first()).toBeVisible();

      // Test Black Bean #280B0B in footer
      const footer = page.locator('footer');
      await expect(footer).toHaveCSS('background-color', 'rgb(40, 11, 11)');
    });

    test('validates League Spartan typography for headings', async ({ page }) => {
      // Test main hero heading
      const heroHeading = page.locator('h1').first();
      await expect(heroHeading).toHaveCSS('font-family', /League Spartan/);
      await expect(heroHeading).toHaveCSS('text-transform', 'uppercase');
      await expect(heroHeading).toHaveCSS('letter-spacing', '0.088em');
      await expect(heroHeading).toHaveCSS('font-weight', '700');

      // Test section headings
      const sectionHeadings = page.locator('h2');
      for (let i = 0; i < await sectionHeadings.count(); i++) {
        const heading = sectionHeadings.nth(i);
        await expect(heading).toHaveCSS('font-family', /League Spartan/);
        await expect(heading).toHaveCSS('text-transform', 'uppercase');
      }
    });

    test('validates Playfair Display typography for body text', async ({ page }) => {
      // Test hero description
      const heroDescription = page.locator('section p').first();
      await expect(heroDescription).toHaveCSS('font-family', /Playfair Display/);

      // Test product descriptions
      const productDescriptions = page.locator('[class*="text-muted-foreground"]');
      if (await productDescriptions.count() > 0) {
        await expect(productDescriptions.first()).toHaveCSS('font-family', /Playfair Display/);
      }
    });
  });

  test.describe('Cannabo-Inspired Structure Validation', () => {

    test('validates clean hero section with clear CTAs', async ({ page }) => {
      // Check hero section exists and has proper structure
      const heroSection = page.locator('section').first();
      await expect(heroSection).toBeVisible();

      // Validate hero badge
      const heroBadge = page.locator('text="Premium Natural Wellness"');
      await expect(heroBadge).toBeVisible();

      // Validate main heading
      const mainHeading = page.locator('h1:has-text("High-Quality Natural")');
      await expect(mainHeading).toBeVisible();

      // Validate CTAs are present and functional
      const startShoppingBtn = page.locator('a:has-text("Start Shopping")');
      const learnMoreBtn = page.locator('a:has-text("Learn More")');

      await expect(startShoppingBtn).toBeVisible();
      await expect(learnMoreBtn).toBeVisible();

      // Test CTA functionality
      await expect(startShoppingBtn).toHaveAttribute('href', '/products');
      await expect(learnMoreBtn).toHaveAttribute('href', '/about');
    });

    test('validates professional category navigation', async ({ page }) => {
      // Check category section heading
      const categoryHeading = page.locator('h2:has-text("Pick Your Product Type")');
      await expect(categoryHeading).toBeVisible();

      // Validate category cards structure
      const categoryCards = page.locator('[class*="grid"] > [class*="Card"]');
      await expect(categoryCards).toHaveCount(5);

      // Test category card content
      const firstCategory = categoryCards.first();
      await expect(firstCategory.locator('[class*="w-16"]')).toBeVisible(); // Icon
      await expect(firstCategory.locator('h3')).toBeVisible(); // Title
      await expect(firstCategory.locator('p:has-text("Products")')).toBeVisible(); // Count

      // Test hover effects
      await firstCategory.hover();
      await expect(firstCategory).toHaveCSS('box-shadow', /.*rgba.*/);
    });

    test('validates professional product grid', async ({ page }) => {
      // Check trending products section
      const productsHeading = page.locator('h2:has-text("Trending Products")');
      await expect(productsHeading).toBeVisible();

      // Validate product grid layout
      const productCards = page.locator('[class*="grid"] [class*="Card"]').nth(1);
      await expect(productCards).toBeVisible();

      // Test product card structure
      const firstProduct = productCards.first();

      // Image
      await expect(firstProduct.locator('img')).toBeVisible();

      // Badge (if present)
      const badge = firstProduct.locator('[class*="Badge"]');
      if (await badge.count() > 0) {
        await expect(badge.first()).toBeVisible();
      }

      // Product title
      await expect(firstProduct.locator('h3')).toBeVisible();

      // Rating stars
      await expect(firstProduct.locator('[class*="text-yellow-400"] svg')).toHaveCount(5);

      // Price
      await expect(firstProduct.locator('span:has-text("R")')).toBeVisible();

      // Add to cart button
      await expect(firstProduct.locator('button:has-text("Add to Cart"), button:has-text("Out of Stock")')).toBeVisible();
    });

    test('validates about section structure', async ({ page }) => {
      // Check about section heading
      const aboutHeading = page.locator('h2:has-text("We Provide High Quality")');
      await expect(aboutHeading).toBeVisible();

      // Validate checkmark list
      const checkmarks = page.locator('svg[class*="w-5 h-5 text-\\[\\#C4C240\\]"]');
      await expect(checkmarks).toHaveCount(3);

      // Validate features list
      const features = [
        '100% Natural Ingredients',
        'Plant Based Formulations',
        'Third Party Lab Tested'
      ];

      for (const feature of features) {
        await expect(page.locator(`text="${feature}"`)).toBeVisible();
      }

      // Test CTA button
      const learnStoryBtn = page.locator('a:has-text("Learn Our Story")');
      await expect(learnStoryBtn).toBeVisible();
      await expect(learnStoryBtn).toHaveAttribute('href', '/about');
    });

    test('validates features section', async ({ page }) => {
      // Check features heading
      const featuresHeading = page.locator('h2:has-text("What Makes Better Being Different")');
      await expect(featuresHeading).toBeVisible();

      // Validate help text
      const helpText = page.locator('text="+27 21 555 0123"');
      await expect(helpText).toBeVisible();

      // Test feature cards - should be 4
      const featureCards = page.locator('h3:has-text("100% Natural"), h3:has-text("Lab Tested"), h3:has-text("Science-Backed"), h3:has-text("Award Winning")');
      await expect(featureCards).toHaveCount(4);

      // Test feature icons
      const featureIcons = page.locator('[class*="w-16 h-16"][class*="bg-\\[\\#F9E7C9\\]"]');
      await expect(featureIcons).toHaveCount(4);
    });

    test('validates services section', async ({ page }) => {
      // Test service items - should be 4
      const serviceItems = [
        'Free Next Day Delivery Over R500',
        '24/7 Customer Support',
        '100% Secured Checkout',
        '30 Days Free Returns'
      ];

      for (const service of serviceItems) {
        await expect(page.locator(`text="${service}"`)).toBeVisible();
      }
    });

    test('validates newsletter section', async ({ page }) => {
      // Check newsletter heading
      const newsletterHeading = page.locator('h2:has-text("Subscribe Newsletter")');
      await expect(newsletterHeading).toBeVisible();

      // Test email input
      const emailInput = page.locator('input[type="email"][placeholder*="email"]');
      await expect(emailInput).toBeVisible();

      // Test subscribe button
      const subscribeBtn = page.locator('button:has-text("Subscribe Now")');
      await expect(subscribeBtn).toBeVisible();

      // Test features text
      await expect(page.locator('text="Weekly wellness tips"')).toBeVisible();
      await expect(page.locator('text="No spam, unsubscribe anytime"')).toBeVisible();
    });
  });

  test.describe('Responsive Design Validation', () => {

    test('validates mobile responsiveness', async ({ browser }) => {
      const context = await browser.newContext({
        ...devices['iPhone 12'],
      });
      const page = await context.newPage();
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Check mobile navigation
      const mobileMenuBtn = page.locator('button[class*="lg:hidden"]');
      await expect(mobileMenuBtn).toBeVisible();

      // Test hero section on mobile
      const heroSection = page.locator('section').first();
      await expect(heroSection).toBeVisible();

      // Test CTAs stack vertically
      const ctaContainer = page.locator('div:has(> a:has-text("Start Shopping"))');
      await expect(ctaContainer).toHaveCSS('flex-direction', 'column');

      // Test category grid responsive
      const categoryGrid = page.locator('h2:has-text("Pick Your Product Type")').locator('..').locator('[class*="grid"]');
      await expect(categoryGrid).toHaveCSS('grid-template-columns', /repeat\(2/);

      await context.close();
    });

    test('validates tablet responsiveness', async ({ browser }) => {
      const context = await browser.newContext({
        ...devices['iPad Pro'],
      });
      const page = await context.newPage();
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Test product grid on tablet
      const productGrid = page.locator('h2:has-text("Trending Products")').locator('..').locator('[class*="grid"]');
      await expect(productGrid).toHaveCSS('grid-template-columns', /repeat\(2/);

      // Test features grid
      const featuresGrid = page.locator('h2:has-text("What Makes Better Being Different")').locator('..').locator('[class*="grid"]');
      await expect(featuresGrid).toHaveCSS('grid-template-columns', /repeat\(2/);

      await context.close();
    });

    test('validates desktop layout', async ({ page }) => {
      // Set desktop viewport
      await page.setViewportSize({ width: 1440, height: 900 });

      // Test full navigation is visible
      const desktopNav = page.locator('div:has(> a:has-text("Home")):has(> a:has-text("Shop"))');
      await expect(desktopNav).toBeVisible();

      // Test product grid shows 4 columns
      const productGrid = page.locator('h2:has-text("Trending Products")').locator('..').locator('[class*="grid"]');
      await expect(productGrid).toHaveCSS('grid-template-columns', /repeat\(4/);

      // Test features show 4 columns
      const featuresGrid = page.locator('h2:has-text("What Makes Better Being Different")').locator('..').locator('[class*="grid"]');
      await expect(featuresGrid).toHaveCSS('grid-template-columns', /repeat\(4/);
    });
  });

  test.describe('Interactive Elements Validation', () => {

    test('validates navigation interactions', async ({ page }) => {
      // Test logo click
      const logo = page.locator('a:has(div:has-text("Better Being"))').first();
      await expect(logo).toHaveAttribute('href', '/');

      // Test navigation links
      const navLinks = {
        'Shop': '/products',
        'About': '/about',
        'Wellness': '/wellness',
        'Contact': '/contact'
      };

      for (const [text, href] of Object.entries(navLinks)) {
        const link = page.locator(`a:has-text("${text}")`).first();
        await expect(link).toHaveAttribute('href', href);
      }

      // Test search functionality
      const searchInput = page.locator('input[placeholder*="Search"]');
      if (await searchInput.count() > 0) {
        await searchInput.fill('test product');
        await searchInput.press('Enter');
        // Should navigate to products page with search
        await expect(page).toHaveURL(/\/products\?search=test\+product/);
        await page.goBack();
      }
    });

    test('validates button interactions', async ({ page }) => {
      // Test primary CTA hover effects
      const startShoppingBtn = page.locator('a:has-text("Start Shopping")');

      // Get initial background color
      const initialBg = await startShoppingBtn.evaluate(el =>
        getComputedStyle(el).backgroundColor
      );

      // Hover and check for change
      await startShoppingBtn.hover();
      const hoveredBg = await startShoppingBtn.evaluate(el =>
        getComputedStyle(el).backgroundColor
      );

      // Colors should be different on hover
      expect(initialBg).not.toBe(hoveredBg);

      // Test card hover effects
      const categoryCard = page.locator('[class*="grid"] > [class*="Card"]').first();
      await categoryCard.hover();

      // Should have shadow on hover
      const shadowValue = await categoryCard.evaluate(el =>
        getComputedStyle(el).boxShadow
      );
      expect(shadowValue).not.toBe('none');
    });

    test('validates form interactions', async ({ page }) => {
      // Test newsletter signup
      const emailInput = page.locator('input[type="email"][placeholder*="email"]');
      const subscribeBtn = page.locator('button:has-text("Subscribe Now")');

      // Test form validation
      await subscribeBtn.click();
      // Should show validation for empty email
      const isRequired = await emailInput.evaluate(el => el.validity.valueMissing);
      expect(isRequired).toBe(true);

      // Test valid email
      await emailInput.fill('test@example.com');
      await subscribeBtn.click();
      // Form should be valid
      const isValid = await emailInput.evaluate(el => el.validity.valid);
      expect(isValid).toBe(true);
    });
  });

  test.describe('Performance & Accessibility Validation', () => {

    test('validates loading performance', async ({ page }) => {
      const startTime = Date.now();
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      const loadTime = Date.now() - startTime;

      // Page should load within 3 seconds
      expect(loadTime).toBeLessThan(3000);

      // Check for performance metrics
      const performanceMetrics = await page.evaluate(() => {
        const paint = performance.getEntriesByType('paint');
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;

        return {
          firstPaint: paint.find(entry => entry.name === 'first-paint')?.startTime || 0,
          firstContentfulPaint: paint.find(entry => entry.name === 'first-contentful-paint')?.startTime || 0,
          domContentLoaded: navigation.domContentLoadedEventEnd - navigation.navigationStart,
        };
      });

      // First Contentful Paint should be under 1.5s
      expect(performanceMetrics.firstContentfulPaint).toBeLessThan(1500);

      // DOM Content Loaded should be under 2s
      expect(performanceMetrics.domContentLoaded).toBeLessThan(2000);
    });

    test('validates accessibility compliance', async ({ page }) => {
      // Inject axe-core for accessibility testing
      await page.addScriptTag({ url: 'https://unpkg.com/axe-core@4.7.0/axe.min.js' });

      // Run accessibility scan
      const accessibilityResults = await page.evaluate(() => {
        return new Promise((resolve) => {
          // @ts-ignore
          window.axe.run().then((results: any) => {
            resolve(results);
          });
        });
      });

      const results = accessibilityResults as any;

      // Should have no critical accessibility violations
      const criticalViolations = results.violations.filter((v: any) =>
        ['critical', 'serious'].includes(v.impact)
      );

      expect(criticalViolations.length).toBe(0);

      // Check for alt text on images
      const images = page.locator('img');
      const imageCount = await images.count();

      for (let i = 0; i < imageCount; i++) {
        const img = images.nth(i);
        const alt = await img.getAttribute('alt');
        expect(alt).toBeTruthy();
      }

      // Check for proper heading hierarchy
      const headings = await page.locator('h1, h2, h3, h4, h5, h6').allTextContents();
      expect(headings.length).toBeGreaterThan(0);

      // Should have exactly one h1
      const h1Count = await page.locator('h1').count();
      expect(h1Count).toBe(1);
    });

    test('validates SEO fundamentals', async ({ page }) => {
      // Check page title
      const title = await page.title();
      expect(title).toContain('Better Being');
      expect(title.length).toBeGreaterThan(10);
      expect(title.length).toBeLessThan(60);

      // Check meta description
      const metaDescription = await page.locator('meta[name="description"]').getAttribute('content');
      if (metaDescription) {
        expect(metaDescription.length).toBeGreaterThan(120);
        expect(metaDescription.length).toBeLessThan(160);
      }

      // Check for h1 tag
      const h1 = await page.locator('h1').textContent();
      expect(h1).toBeTruthy();
      expect(h1).toContain('Better Being');

      // Check for structured data (if implemented)
      const structuredData = await page.locator('script[type="application/ld+json"]').count();
      // This is optional but recommended
    });
  });

  test.describe('Visual Regression Testing', () => {

    test('captures full homepage screenshot for visual regression', async ({ page }) => {
      // Wait for all images to load
      await page.waitForLoadState('networkidle');
      await page.waitForFunction(() => {
        const images = document.querySelectorAll('img');
        return Array.from(images).every(img => img.complete);
      });

      // Hide dynamic content that might cause test flakiness
      await page.addStyleTag({
        content: `
          .animate-pulse { animation: none !important; }
          .animate-spin { animation: none !important; }
          [class*="animate-"] { animation: none !important; }
          * { transition: none !important; }
        `
      });

      // Full page screenshot
      await expect(page).toHaveScreenshot('homepage-full.png', {
        fullPage: true,
        animations: 'disabled',
      });
    });

    test('captures section screenshots for regression testing', async ({ page }) => {
      await page.waitForLoadState('networkidle');

      // Hero section
      const heroSection = page.locator('section').first();
      await expect(heroSection).toHaveScreenshot('hero-section.png');

      // Category section
      const categorySection = page.locator('h2:has-text("Pick Your Product Type")').locator('..');
      await expect(categorySection).toHaveScreenshot('category-section.png');

      // Products section
      const productsSection = page.locator('h2:has-text("Trending Products")').locator('..');
      await expect(productsSection).toHaveScreenshot('products-section.png');

      // About section
      const aboutSection = page.locator('h2:has-text("We Provide High Quality")').locator('..');
      await expect(aboutSection).toHaveScreenshot('about-section.png');

      // Features section
      const featuresSection = page.locator('h2:has-text("What Makes Better Being Different")').locator('..');
      await expect(featuresSection).toHaveScreenshot('features-section.png');
    });

    test('captures mobile screenshots', async ({ browser }) => {
      const context = await browser.newContext({
        ...devices['iPhone 12'],
      });
      const page = await context.newPage();
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      await expect(page).toHaveScreenshot('homepage-mobile.png', {
        fullPage: true,
        animations: 'disabled',
      });

      await context.close();
    });
  });
});

/**
 * ADDITIONAL UTILITY FUNCTIONS FOR DESIGN VALIDATION
 */

// Helper function to check color contrast ratios
async function checkColorContrast(page: any, selector: string) {
  return await page.evaluate((sel: string) => {
    const element = document.querySelector(sel);
    if (!element) return null;

    const style = getComputedStyle(element);
    return {
      color: style.color,
      backgroundColor: style.backgroundColor,
      fontSize: style.fontSize,
      fontWeight: style.fontWeight
    };
  }, selector);
}

// Helper function to validate spacing consistency
async function validateSpacing(page: any, elements: string[]) {
  const spacingValues = [];

  for (const selector of elements) {
    const spacing = await page.evaluate((sel: string) => {
      const element = document.querySelector(sel);
      if (!element) return null;

      const style = getComputedStyle(element);
      return {
        marginTop: style.marginTop,
        marginBottom: style.marginBottom,
        paddingTop: style.paddingTop,
        paddingBottom: style.paddingBottom
      };
    }, selector);

    if (spacing) {
      spacingValues.push(spacing);
    }
  }

  return spacingValues;
}
