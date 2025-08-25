#!/usr/bin/env node

/**
 * Design System Audit Script
 * Better Being - Enterprise Design System Compliance Checker
 *
 * This script performs comprehensive audits of design system compliance including:
 * - Brand color usage validation
 * - Typography scale adherence
 * - Spacing grid system compliance
 * - Component consistency checks
 * - Accessibility compliance
 * - Design token validation
 */

const { chromium } = require('playwright');
const fs = require('fs').promises;
const path = require('path');

// Design System Configuration
const DESIGN_SYSTEM = {
  colors: {
    primary: '#B85A3E',
    secondary: '#7A9B7A',
    champagne: '#F5E6D3',
    charcoal: '#2A1F1A',
    grays: {
      50: '#FAFAF9',
      100: '#F5F5F4',
      200: '#E7E5E4',
      300: '#D6D3D1',
      400: '#A8A29E',
      500: '#78716C',
      600: '#57534E',
      700: '#44403C',
      800: '#292524',
      900: '#1C1917'
    }
  },
  typography: {
    fontFamily: 'Inter',
    fontWeights: [300, 400, 500, 600, 700, 800],
    scale: {
      'display-xxl': '4.5rem',
      'display-xl': '3.75rem',
      'display-large': '3rem',
      'h1': '2.25rem',
      'h2': '1.875rem',
      'h3': '1.5rem',
      'h4': '1.25rem',
      'body-large': '1.125rem',
      'body': '1rem',
      'body-small': '0.875rem',
      'caption': '0.75rem'
    }
  },
  spacing: {
    baseUnit: 8,
    scale: [4, 8, 12, 16, 24, 32, 48, 64, 96]
  },
  breakpoints: {
    mobile: 375,
    tablet: 768,
    desktop: 1024,
    wide: 1440
  }
};

// Audit Configuration
const AUDIT_CONFIG = {
  baseUrl: process.env.BASE_URL || 'http://localhost:5173',
  outputDir: 'design-system-audit',
  viewport: { width: 1440, height: 900 },

  // Compliance thresholds
  thresholds: {
    colorCompliance: 0.90,
    typographyCompliance: 0.85,
    spacingCompliance: 0.80,
    accessibilityCompliance: 0.95,
    overallCompliance: 0.85
  },

  // Pages to audit
  pages: [
    { name: 'Homepage', url: '/', priority: 'high' },
    { name: 'Products', url: '/products', priority: 'high' },
    { name: 'About', url: '/about', priority: 'medium' },
    { name: 'Contact', url: '/contact', priority: 'medium' }
  ]
};

class DesignSystemAuditor {
  constructor() {
    this.browser = null;
    this.page = null;
    this.auditResults = {};
    this.startTime = Date.now();
  }

  async initialize() {
    console.log('🎨 Initializing Design System Auditor...');

    // Create output directory
    await fs.mkdir(AUDIT_CONFIG.outputDir, { recursive: true });

    // Launch browser
    this.browser = await chromium.launch({
      headless: process.env.CI ? true : false
    });

    this.page = await this.browser.newPage({
      viewport: AUDIT_CONFIG.viewport
    });

    console.log('✅ Design System Auditor initialized');
  }

  async runFullAudit() {
    console.log('\n🔍 Starting Comprehensive Design System Audit');
    console.log('='.repeat(60));

    const auditResults = {
      timestamp: new Date().toISOString(),
      summary: {},
      pages: {},
      compliance: {},
      violations: [],
      recommendations: [],
      metadata: {
        auditVersion: '1.0.0',
        designSystemVersion: '1.0.0',
        executionTime: 0
      }
    };

    try {
      // Audit each page
      for (const pageConfig of AUDIT_CONFIG.pages) {
        console.log(`\n📄 Auditing ${pageConfig.name}...`);

        await this.page.goto(`${AUDIT_CONFIG.baseUrl}${pageConfig.url}`, {
          waitUntil: 'networkidle',
          timeout: 30000
        });

        await this.page.waitForTimeout(2000);

        const pageAudit = await this.auditPage(pageConfig);
        auditResults.pages[pageConfig.name] = pageAudit;
      }

      // Calculate overall compliance
      auditResults.compliance = this.calculateOverallCompliance(auditResults.pages);
      auditResults.violations = this.extractViolations(auditResults.pages);
      auditResults.recommendations = this.generateRecommendations(auditResults.compliance, auditResults.violations);

      // Calculate summary
      auditResults.summary = this.generateSummary(auditResults);
      auditResults.metadata.executionTime = Date.now() - this.startTime;

      // Save results
      await this.saveAuditResults(auditResults);

      console.log('\n✅ Design System Audit Complete!');
      this.printSummary(auditResults.summary);

      return auditResults;

    } catch (error) {
      console.error('❌ Design System Audit failed:', error.message);
      throw error;
    }
  }

  async auditPage(pageConfig) {
    const pageAudit = {
      name: pageConfig.name,
      url: pageConfig.url,
      priority: pageConfig.priority,
      colorCompliance: await this.auditColors(),
      typographyCompliance: await this.auditTypography(),
      spacingCompliance: await this.auditSpacing(),
      componentCompliance: await this.auditComponents(),
      accessibilityCompliance: await this.auditAccessibility(),
      performanceImpact: await this.auditPerformanceImpact(),
      violations: [],
      score: 0
    };

    // Calculate page score
    const scores = [
      pageAudit.colorCompliance.score,
      pageAudit.typographyCompliance.score,
      pageAudit.spacingCompliance.score,
      pageAudit.componentCompliance.score,
      pageAudit.accessibilityCompliance.score
    ];

    pageAudit.score = scores.reduce((a, b) => a + b, 0) / scores.length;

    // Collect violations
    pageAudit.violations = [
      ...pageAudit.colorCompliance.violations,
      ...pageAudit.typographyCompliance.violations,
      ...pageAudit.spacingCompliance.violations,
      ...pageAudit.componentCompliance.violations,
      ...pageAudit.accessibilityCompliance.violations
    ];

    return pageAudit;
  }

  async auditColors() {
    console.log('  🎨 Auditing color compliance...');

    const colorAnalysis = await this.page.evaluate((designColors) => {
      const elements = document.querySelectorAll('*');
      const usedColors = new Set();
      const nonCompliantColors = [];
      const brandColorUsage = {};

      // Initialize brand color counters
      Object.values(designColors).forEach(color => {
        if (typeof color === 'string') {
          brandColorUsage[color.toLowerCase()] = 0;
        }
      });

      elements.forEach(element => {
        const styles = getComputedStyle(element);
        const colors = [
          styles.color,
          styles.backgroundColor,
          styles.borderColor,
          styles.borderTopColor,
          styles.borderRightColor,
          styles.borderBottomColor,
          styles.borderLeftColor
        ];

        colors.forEach(color => {
          if (color && color !== 'rgba(0, 0, 0, 0)' && color !== 'transparent') {
            usedColors.add(color);

            // Check if it's a brand color
            const hexColor = this.rgbToHex ? this.rgbToHex(color) : color;
            const normalizedColor = hexColor.toLowerCase();

            if (brandColorUsage.hasOwnProperty(normalizedColor)) {
              brandColorUsage[normalizedColor]++;
            } else {
              // Check if it's close to a brand color (potential inconsistency)
              nonCompliantColors.push({
                element: element.tagName + (element.className ? `.${element.className}` : ''),
                color: color,
                issue: 'Non-brand color usage'
              });
            }
          }
        });
      });

      return {
        totalColors: usedColors.size,
        brandColorUsage,
        nonCompliantColors: nonCompliantColors.slice(0, 10), // Limit results
        primaryColorUsage: brandColorUsage[designColors.primary.toLowerCase()] || 0,
        secondaryColorUsage: brandColorUsage[designColors.secondary.toLowerCase()] || 0
      };
    }, DESIGN_SYSTEM.colors);

    // Calculate compliance score
    const totalBrandUsage = Object.values(colorAnalysis.brandColorUsage).reduce((a, b) => a + b, 0);
    const complianceScore = Math.min(1.0, totalBrandUsage / Math.max(colorAnalysis.totalColors * 0.3, 1));

    const violations = colorAnalysis.nonCompliantColors.map(violation => ({
      type: 'color',
      severity: 'medium',
      element: violation.element,
      issue: violation.issue,
      color: violation.color,
      recommendation: 'Use brand colors from design system'
    }));

    return {
      score: complianceScore,
      details: colorAnalysis,
      violations,
      recommendations: violations.length > 0 ? [
        'Review non-brand color usage and replace with design system colors',
        'Ensure primary brand color (#B85A3E) is used for CTAs and key elements',
        'Use secondary color (#7A9B7A) for supporting elements'
      ] : []
    };
  }

  async auditTypography() {
    console.log('  📝 Auditing typography compliance...');

    const typographyAnalysis = await this.page.evaluate((designTypography) => {
      const textElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, div, a, button, label');
      let totalElements = 0;
      let compliantElements = 0;
      const violations = [];
      const fontUsage = {};

      textElements.forEach(element => {
        const styles = getComputedStyle(element);
        const fontFamily = styles.fontFamily.toLowerCase();
        const fontSize = styles.fontSize;
        const fontWeight = styles.fontWeight;

        totalElements++;

        // Track font family usage
        fontUsage[fontFamily] = (fontUsage[fontFamily] || 0) + 1;

        // Check font family compliance
        if (fontFamily.includes('inter')) {
          compliantElements++;
        } else {
          violations.push({
            element: element.tagName.toLowerCase(),
            issue: 'Non-Inter font family',
            actual: fontFamily,
            expected: 'Inter'
          });
        }

        // Check font weight compliance
        const weightNum = parseInt(fontWeight);
        if (weightNum && !designTypography.fontWeights.includes(weightNum)) {
          violations.push({
            element: element.tagName.toLowerCase(),
            issue: 'Non-standard font weight',
            actual: fontWeight,
            expected: designTypography.fontWeights.join(', ')
          });
        }
      });

      return {
        totalElements,
        compliantElements,
        fontUsage,
        violations: violations.slice(0, 15),
        interUsagePercentage: compliantElements / totalElements
      };
    }, DESIGN_SYSTEM.typography);

    const violations = typographyAnalysis.violations.map(violation => ({
      type: 'typography',
      severity: 'medium',
      element: violation.element,
      issue: violation.issue,
      actual: violation.actual,
      expected: violation.expected,
      recommendation: 'Use Inter font family with standard weights (300, 400, 500, 600, 700, 800)'
    }));

    return {
      score: typographyAnalysis.interUsagePercentage,
      details: typographyAnalysis,
      violations,
      recommendations: violations.length > 0 ? [
        'Ensure all text uses Inter font family',
        'Use standard font weights from design system',
        'Implement proper typography scale hierarchy'
      ] : []
    };
  }

  async auditSpacing() {
    console.log('  📏 Auditing spacing compliance...');

    const spacingAnalysis = await this.page.evaluate((designSpacing) => {
      const elements = document.querySelectorAll('*');
      let totalSpacingValues = 0;
      let compliantSpacingValues = 0;
      const violations = [];

      elements.forEach(element => {
        const styles = getComputedStyle(element);
        const spacingProperties = [
          'marginTop', 'marginRight', 'marginBottom', 'marginLeft',
          'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft'
        ];

        spacingProperties.forEach(prop => {
          const value = parseInt(styles[prop]);
          if (value > 0) {
            totalSpacingValues++;

            // Check if value is multiple of base unit (8px) or in allowed scale
            if (value % designSpacing.baseUnit === 0 || designSpacing.scale.includes(value)) {
              compliantSpacingValues++;
            } else {
              violations.push({
                element: element.tagName.toLowerCase() + (element.className ? `.${element.className.split(' ')[0]}` : ''),
                property: prop,
                value: `${value}px`,
                issue: 'Not aligned to 8px grid'
              });
            }
          }
        });
      });

      return {
        totalSpacingValues,
        compliantSpacingValues,
        compliancePercentage: compliantSpacingValues / Math.max(totalSpacingValues, 1),
        violations: violations.slice(0, 20)
      };
    }, DESIGN_SYSTEM.spacing);

    const violations = spacingAnalysis.violations.map(violation => ({
      type: 'spacing',
      severity: 'low',
      element: violation.element,
      property: violation.property,
      issue: violation.issue,
      value: violation.value,
      recommendation: 'Use spacing values from 8px grid system (4px, 8px, 16px, 24px, 32px, 48px)'
    }));

    return {
      score: spacingAnalysis.compliancePercentage,
      details: spacingAnalysis,
      violations,
      recommendations: violations.length > 0 ? [
        'Align all spacing to 8px grid system',
        'Use standard spacing scale: 4px, 8px, 12px, 16px, 24px, 32px, 48px',
        'Review component margins and paddings'
      ] : []
    };
  }

  async auditComponents() {
    console.log('  🧩 Auditing component compliance...');

    const componentAnalysis = await this.page.evaluate(() => {
      const buttons = document.querySelectorAll('button, .btn, [role="button"]');
      const cards = document.querySelectorAll('.card, [data-testid*="card"]');
      const forms = document.querySelectorAll('form, input, textarea, select');

      let componentViolations = [];
      let compliantComponents = 0;
      let totalComponents = 0;

      // Audit buttons
      buttons.forEach(button => {
        totalComponents++;
        const styles = getComputedStyle(button);
        const borderRadius = parseInt(styles.borderRadius);

        if (borderRadius >= 8 && borderRadius <= 16) {
          compliantComponents++;
        } else {
          componentViolations.push({
            type: 'button',
            element: button.tagName.toLowerCase(),
            issue: 'Border radius not in range 8-16px',
            actual: `${borderRadius}px`
          });
        }
      });

      // Audit cards
      cards.forEach(card => {
        totalComponents++;
        const styles = getComputedStyle(card);
        const borderRadius = parseInt(styles.borderRadius);

        if (borderRadius >= 12 && borderRadius <= 16) {
          compliantComponents++;
        } else {
          componentViolations.push({
            type: 'card',
            element: 'card component',
            issue: 'Card border radius should be 12-16px',
            actual: `${borderRadius}px`
          });
        }
      });

      return {
        totalComponents,
        compliantComponents,
        compliancePercentage: compliantComponents / Math.max(totalComponents, 1),
        violations: componentViolations.slice(0, 10),
        componentCounts: {
          buttons: buttons.length,
          cards: cards.length,
          forms: forms.length
        }
      };
    });

    const violations = componentAnalysis.violations.map(violation => ({
      type: 'component',
      severity: 'medium',
      componentType: violation.type,
      element: violation.element,
      issue: violation.issue,
      actual: violation.actual,
      recommendation: violation.type === 'button' ?
        'Use 12px border radius for buttons' :
        'Use 16px border radius for cards'
    }));

    return {
      score: componentAnalysis.compliancePercentage,
      details: componentAnalysis,
      violations,
      recommendations: violations.length > 0 ? [
        'Ensure consistent border radius across components',
        'Use design system component patterns',
        'Implement proper hover and focus states'
      ] : []
    };
  }

  async auditAccessibility() {
    console.log('  ♿ Auditing accessibility compliance...');

    const accessibilityAnalysis = await this.page.evaluate(() => {
      let violations = [];
      let score = 1.0;

      // Check for alt attributes on images
      const images = document.querySelectorAll('img');
      images.forEach(img => {
        if (!img.alt && !img.getAttribute('role') === 'presentation') {
          violations.push({
            type: 'image',
            issue: 'Missing alt attribute',
            element: 'img',
            src: img.src
          });
        }
      });

      // Check for proper heading hierarchy
      const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      let previousLevel = 0;
      headings.forEach(heading => {
        const level = parseInt(heading.tagName[1]);
        if (level > previousLevel + 1 && previousLevel !== 0) {
          violations.push({
            type: 'heading',
            issue: 'Heading hierarchy skip',
            element: heading.tagName.toLowerCase(),
            text: heading.textContent.substring(0, 50)
          });
        }
        previousLevel = level;
      });

      // Check for form labels
      const inputs = document.querySelectorAll('input, select, textarea');
      inputs.forEach(input => {
        const id = input.id;
        const label = id ? document.querySelector(`label[for="${id}"]`) : null;
        const ariaLabel = input.getAttribute('aria-label');

        if (!label && !ariaLabel) {
          violations.push({
            type: 'form',
            issue: 'Missing label or aria-label',
            element: input.tagName.toLowerCase(),
            inputType: input.type
          });
        }
      });

      // Basic color contrast check (simplified)
      const textElements = document.querySelectorAll('p, span, div, a, button, h1, h2, h3, h4, h5, h6');
      let contrastIssues = 0;

      textElements.forEach(element => {
        const styles = getComputedStyle(element);
        const color = styles.color;
        const backgroundColor = styles.backgroundColor;

        // Simplified contrast check (in real implementation, use proper contrast calculation)
        if (color === 'rgb(255, 255, 255)' && backgroundColor === 'rgb(255, 255, 255)') {
          contrastIssues++;
        }
      });

      score = Math.max(0, 1 - (violations.length + contrastIssues) / 100);

      return {
        score,
        violations: violations.slice(0, 15),
        totalIssues: violations.length,
        contrastIssues
      };
    });

    const violations = accessibilityAnalysis.violations.map(violation => ({
      type: 'accessibility',
      severity: 'high',
      category: violation.type,
      element: violation.element,
      issue: violation.issue,
      details: violation.text || violation.src || violation.inputType,
      recommendation: this.getAccessibilityRecommendation(violation.type)
    }));

    return {
      score: accessibilityAnalysis.score,
      details: accessibilityAnalysis,
      violations,
      recommendations: violations.length > 0 ? [
        'Add alt attributes to all meaningful images',
        'Ensure proper heading hierarchy (h1 → h2 → h3)',
        'Provide labels or aria-labels for all form inputs',
        'Check color contrast ratios meet WCAG 2.1 AA standards'
      ] : []
    };
  }

  getAccessibilityRecommendation(type) {
    const recommendations = {
      image: 'Add descriptive alt attribute or role="presentation" for decorative images',
      heading: 'Use proper heading hierarchy without skipping levels',
      form: 'Associate labels with form controls using for/id or aria-label',
      contrast: 'Ensure minimum 4.5:1 contrast ratio for normal text'
    };
    return recommendations[type] || 'Follow WCAG 2.1 AA guidelines';
  }

  async auditPerformanceImpact() {
    console.log('  ⚡ Auditing performance impact...');

    const performanceMetrics = await this.page.evaluate(() => {
      const start = performance.now();

      // Count DOM elements
      const elementCount = document.querySelectorAll('*').length;

      // Count stylesheets
      const stylesheetCount = document.querySelectorAll('link[rel="stylesheet"], style').length;

      // Get page size estimate
      const htmlSize = document.documentElement.outerHTML.length;

      const end = performance.now();

      return {
        elementCount,
        stylesheetCount,
        htmlSize,
        evaluationTime: end - start,
        score: Math.max(0, 1 - (elementCount / 5000) - (stylesheetCount / 20))
      };
    });

    return {
      score: Math.min(1, performanceMetrics.score),
      details: performanceMetrics,
      violations: [],
      recommendations: performanceMetrics.elementCount > 3000 ? [
        'Consider reducing DOM complexity',
        'Optimize component rendering',
        'Implement code splitting for large pages'
      ] : []
    };
  }

  calculateOverallCompliance(pages) {
    const allScores = [];
    const complianceByCategory = {
      colors: 0,
      typography: 0,
      spacing: 0,
      components: 0,
      accessibility: 0
    };

    Object.values(pages).forEach(page => {
      allScores.push(page.score);
      complianceByCategory.colors += page.colorCompliance.score;
      complianceByCategory.typography += page.typographyCompliance.score;
      complianceByCategory.spacing += page.spacingCompliance.score;
      complianceByCategory.components += page.componentCompliance.score;
      complianceByCategory.accessibility += page.accessibilityCompliance.score;
    });

    const pageCount = Object.keys(pages).length;

    return {
      overall: allScores.reduce((a, b) => a + b, 0) / allScores.length,
      byCategory: {
        colors: complianceByCategory.colors / pageCount,
        typography: complianceByCategory.typography / pageCount,
        spacing: complianceByCategory.spacing / pageCount,
        components: complianceByCategory.components / pageCount,
        accessibility: complianceByCategory.accessibility / pageCount
      }
    };
  }

  extractViolations(pages) {
    const allViolations = [];

    Object.values(pages).forEach(page => {
      allViolations.push(...page.violations);
    });

    return allViolations.sort((a, b) => {
      const severityOrder = { high: 3, medium: 2, low: 1 };
      return severityOrder[b.severity] - severityOrder[a.severity];
    });
  }

  generateRecommendations(compliance, violations) {
    const recommendations = [];

    // Color recommendations
    if (compliance.byCategory.colors < AUDIT_CONFIG.thresholds.colorCompliance) {
      recommendations.push({
        category: 'Colors',
        priority: 'high',
        issue: 'Brand color usage below threshold',
        action: 'Increase usage of primary brand colors (#B85A3E, #7A9B7A)',
        impact: 'Brand recognition and visual consistency'
      });
    }

    // Typography recommendations
    if (compliance.byCategory.typography < AUDIT_CONFIG.thresholds.typographyCompliance) {
      recommendations.push({
        category: 'Typography',
        priority: 'high',
        issue: 'Typography not following design system',
        action: 'Ensure all text uses Inter font family and standard weights',
        impact: 'Brand consistency and readability'
      });
    }

    // Spacing recommendations
    if (compliance.byCategory.spacing < AUDIT_CONFIG.thresholds.spacingCompliance) {
      recommendations.push({
        category: 'Spacing',
        priority: 'medium',
        issue: 'Spacing not aligned to 8px grid',
        action: 'Update margins and paddings to use 8px grid system',
        impact: 'Visual rhythm and consistency'
      });
    }

    // Accessibility recommendations
    if (compliance.byCategory.accessibility < AUDIT_CONFIG.thresholds.accessibilityCompliance) {
      recommendations.push({
        category: 'Accessibility',
        priority: 'high',
        issue: 'Accessibility compliance below standards',
        action: 'Address missing alt attributes, labels, and contrast issues',
        impact: 'User accessibility and legal compliance'
      });
    }

    return recommendations;
  }

  generateSummary(results) {
    const totalViolations = results.violations.length;
    const highPriorityViolations = results.violations.filter(v => v.severity === 'high').length;
    const overallScore = results.compliance.overall;

    return {
      overallScore,
      grade: this.calculateGrade(overallScore),
      totalViolations,
      highPriorityViolations,
      complianceStatus: overallScore >= AUDIT_CONFIG.thresholds.overallCompliance ? 'PASS' : 'FAIL',
      pagesAudited: Object.keys(results.pages).length,
      executionTime: results.metadata.executionTime,
      recommendations: results.recommendations.length
    };
  }

  calculateGrade(score) {
    if (score >= 0.95) return 'A+';
    if (score >= 0.90) return 'A';
    if (score >= 0.85) return 'B+';
    if (score >= 0.80) return 'B';
    if (score >= 0.75) return 'C+';
    if (score >= 0.70) return 'C';
    return 'D';
  }

  async saveAuditResults(results) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

    // Save JSON results
    const jsonPath = path.join(AUDIT_CONFIG.outputDir, `design-audit-${timestamp}.json`);
    await fs.writeFile(jsonPath, JSON.stringify(results, null, 2));

    // Save human-readable report
    const report = this.createMarkdownReport(results);
    const reportPath = path.join(AUDIT_CONFIG.outputDir, `design-audit-${timestamp}.md`);
    await fs.writeFile(reportPath, report);

    console.log(`\n📊 Audit results saved:`);
    console.log(`  JSON: ${jsonPath}`);
    console.log(`  Report: ${reportPath}`);
  }

  createMarkdownReport(results) {
    return `# Better Being - Design System Audit Report

**Generated:** ${results.timestamp}
**Overall Score:** ${(results.compliance.overall * 100).toFixed(1)}% (Grade: ${results.summary.grade})
**Status:** ${results.summary.complianceStatus}

## Executive Summary

- **Pages Audited:** ${results.summary.pagesAudited}
- **Total Violations:** ${results.summary.totalViolations}
- **High Priority Issues:** ${results.summary.highPriorityViolations}
- **Execution Time:** ${(results.summary.executionTime / 1000).toFixed(2)}s

## Compliance Breakdown

| Category | Score | Status |
|----------|-------|--------|
| Colors | ${(results.compliance.byCategory.colors * 100).toFixed(1)}% | ${results.compliance.byCategory.colors >= AUDIT_CONFIG.thresholds.colorCompliance ? '✅' : '❌'} |
| Typography | ${(results.compliance.byCategory.typography * 100).toFixed(1)}% | ${results.compliance.byCategory.typography >= AUDIT_CONFIG.thresholds.typographyCompliance ? '✅' : '❌'} |
| Spacing | ${(results.compliance.byCategory.spacing * 100).toFixed(1)}% | ${results.compliance.byCategory.spacing >= AUDIT_CONFIG.thresholds.spacingCompliance ? '✅' : '❌'} |
| Components | ${(results.compliance.byCategory.components * 100).toFixed(1)}% | ${results.compliance.byCategory.components >= 0.80 ? '✅' : '❌'} |
| Accessibility | ${(results.compliance.byCategory.accessibility * 100).toFixed(1)}% | ${results.compliance.byCategory.accessibility >= AUDIT_CONFIG.thresholds.accessibilityCompliance ? '✅' : '❌'} |

## Top Violations

${results.violations.slice(0, 10).map((violation, index) => `
### ${index +
