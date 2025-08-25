# Design Document

## Overview

This design document outlines the comprehensive implementation of Better Being brand guidelines across the web application. The design system will establish consistent visual identity, typography, color usage, spacing, and component patterns that align with the Better Being brand values of wellness, natural health, and premium quality.

Based on analysis of the existing codebase and the Brand Bible BB-4, this design system will enhance the current implementation with proper brand compliance while maintaining modern web standards and accessibility.

## Architecture

### Design System Structure

```
src/
├── styles/
│   ├── brand/
│   │   ├── colors.css          # Brand color definitions
│   │   ├── typography.css      # Font families and scales
│   │   ├── spacing.css         # Brand spacing system
│   │   └── animations.css      # Brand-specific animations
│   ├── components/
│   │   ├── buttons.css         # Button component styles
│   │   ├── cards.css           # Card component styles
│   │   └── forms.css           # Form component styles
│   └── utilities/
│       ├── gradients.css       # Brand gradient utilities
│       └── shadows.css         # Brand shadow utilities
├── components/
│   ├── brand/
│   │   ├── Logo/               # Logo component with guidelines
│   │   ├── Typography/         # Typography components
│   │   └── ColorPalette/       # Color system components
│   └── ui/                     # Enhanced UI components
└── assets/
    ├── fonts/                  # Brand typography assets
    ├── logos/                  # Logo variations
    └── images/                 # Brand imagery
```

### Brand Color System

The Better Being brand utilizes a sophisticated color palette that reflects natural wellness and premium quality:

#### Primary Colors
- **Better Being Orange (#C1581B)**: Primary brand color representing energy and vitality
- **Champagne (#F5F0E8)**: Secondary color representing purity and elegance
- **Fresh Green (#84CC16)**: Accent color representing natural wellness
- **Patsy Gray (#6B7280)**: Neutral color for text and subtle elements
- **Black Bean (#1F2937)**: Deep neutral for high contrast text

#### Color Usage Guidelines
- Primary orange: CTAs, brand elements, active states
- Champagne: Backgrounds, cards, subtle highlights
- Fresh green: Success states, wellness indicators, accent elements
- Patsy gray: Body text, secondary information
- Black bean: Headings, high-contrast text

### Typography System

#### Font Families
- **Primary Headings**: Playfair Display (serif) - Premium, elegant feel
- **Secondary Headings**: League Spartan (sans-serif) - Modern, clean
- **Body Text**: League Spartan (sans-serif) - Readable, contemporary
- **UI Elements**: Inter (sans-serif) - Technical precision

#### Typography Scale
```css
/* Heading Scale */
h1: 3.5rem (56px) - Hero headings
h2: 2.5rem (40px) - Section headings  
h3: 2rem (32px) - Subsection headings
h4: 1.5rem (24px) - Component headings
h5: 1.25rem (20px) - Small headings
h6: 1rem (16px) - Micro headings

/* Body Scale */
body-xl: 1.25rem (20px) - Large body text
body-lg: 1.125rem (18px) - Default body text
body-md: 1rem (16px) - Standard body text
body-sm: 0.875rem (14px) - Small text
body-xs: 0.75rem (12px) - Caption text
```

#### Typography Hierarchy
- **Display**: Playfair Display, 700 weight - Hero sections
- **Heading**: League Spartan, 600-700 weight - Section titles
- **Subheading**: League Spartan, 500-600 weight - Subsections
- **Body**: League Spartan, 400 weight - Content text
- **Caption**: Inter, 400 weight - UI labels and captions

### Spacing System

#### Base Spacing Unit: 4px (0.25rem)

```css
/* Spacing Scale */
xs: 4px (0.25rem)
sm: 8px (0.5rem)
md: 16px (1rem)
lg: 24px (1.5rem)
xl: 32px (2rem)
2xl: 48px (3rem)
3xl: 64px (4rem)
4xl: 96px (6rem)
5xl: 128px (8rem)
```

#### Component Spacing Guidelines
- **Buttons**: 12px vertical, 24px horizontal padding
- **Cards**: 24px internal padding, 16px margin between cards
- **Sections**: 64px vertical spacing between major sections
- **Grid**: 24px gutters on desktop, 16px on mobile

### Component Design Patterns

#### Buttons
- **Primary**: Orange background, white text, rounded corners
- **Secondary**: Champagne background, orange text, orange border
- **Tertiary**: Transparent background, orange text, no border
- **Destructive**: Red background, white text
- **Sizes**: Small (32px), Medium (40px), Large (48px), XL (56px)

#### Cards
- **Standard**: White background, subtle shadow, rounded corners
- **Premium**: Champagne background, enhanced shadow, gold accent
- **Product**: White background, hover effects, image optimization
- **Testimonial**: Champagne background, italic text, author attribution

#### Forms
- **Input Fields**: Champagne background, orange focus border
- **Labels**: League Spartan, uppercase, small size
- **Validation**: Green for success, red for errors
- **Placeholders**: Patsy gray, italic style

## Components and Interfaces

### Logo Component
```typescript
interface LogoProps {
  variant: 'full' | 'icon' | 'text';
  size: 'sm' | 'md' | 'lg' | 'xl';
  color: 'default' | 'white' | 'dark';
  className?: string;
}
```

### Typography Components
```typescript
interface HeadingProps {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  variant: 'display' | 'heading' | 'subheading';
  color?: 'primary' | 'secondary' | 'muted';
  className?: string;
  children: React.ReactNode;
}

interface TextProps {
  variant: 'body-xl' | 'body-lg' | 'body-md' | 'body-sm' | 'body-xs';
  color?: 'primary' | 'secondary' | 'muted';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  className?: string;
  children: React.ReactNode;
}
```

### Button Component Enhancement
```typescript
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'tertiary' | 'destructive';
  size: 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  className?: string;
  children: React.ReactNode;
}
```

### Card Component Enhancement
```typescript
interface CardProps {
  variant: 'standard' | 'premium' | 'product' | 'testimonial';
  padding?: 'sm' | 'md' | 'lg';
  shadow?: 'none' | 'sm' | 'md' | 'lg';
  border?: boolean;
  className?: string;
  children: React.ReactNode;
}
```

## Data Models

### Brand Theme Configuration
```typescript
interface BrandTheme {
  colors: {
    primary: ColorPalette;
    secondary: ColorPalette;
    accent: ColorPalette;
    neutral: ColorPalette;
    semantic: SemanticColors;
  };
  typography: {
    fontFamilies: FontFamilies;
    fontSizes: FontSizes;
    fontWeights: FontWeights;
    lineHeights: LineHeights;
  };
  spacing: SpacingScale;
  borderRadius: BorderRadiusScale;
  shadows: ShadowScale;
  animations: AnimationConfig;
}

interface ColorPalette {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
  DEFAULT: string;
}

interface SemanticColors {
  success: string;
  warning: string;
  error: string;
  info: string;
}
```

### Component Theme Tokens
```typescript
interface ComponentTokens {
  button: {
    primary: ButtonTokens;
    secondary: ButtonTokens;
    tertiary: ButtonTokens;
  };
  card: {
    standard: CardTokens;
    premium: CardTokens;
    product: CardTokens;
  };
  form: {
    input: InputTokens;
    label: LabelTokens;
    validation: ValidationTokens;
  };
}
```

## Error Handling

### Design System Validation
- **Color Contrast**: Ensure WCAG AA compliance (4.5:1 ratio minimum)
- **Font Loading**: Implement fallback fonts for web font failures
- **Component Props**: Validate component prop combinations
- **Theme Switching**: Handle light/dark mode transitions gracefully

### Accessibility Considerations
- **Focus States**: Visible focus indicators for all interactive elements
- **Screen Readers**: Proper ARIA labels and semantic HTML
- **Color Blindness**: Ensure information isn't conveyed by color alone
- **Motion Sensitivity**: Respect prefers-reduced-motion settings

## Testing Strategy

### Visual Regression Testing
- **Component Library**: Storybook with visual testing
- **Cross-browser**: Chrome, Firefox, Safari, Edge compatibility
- **Responsive**: Mobile, tablet, desktop breakpoint testing
- **Theme Switching**: Light/dark mode consistency

### Brand Compliance Testing
- **Color Usage**: Automated checks for brand color compliance
- **Typography**: Font family and size validation
- **Spacing**: Consistent spacing system usage
- **Logo Usage**: Proper logo implementation and sizing

### Performance Testing
- **Font Loading**: Optimize web font delivery and fallbacks
- **Image Optimization**: Ensure brand imagery is properly optimized
- **Animation Performance**: 60fps animations with proper GPU acceleration
- **Bundle Size**: Monitor design system impact on bundle size

### Accessibility Testing
- **Automated**: axe-core integration for accessibility violations
- **Manual**: Keyboard navigation and screen reader testing
- **Color Contrast**: Automated contrast ratio validation
- **Focus Management**: Proper focus flow and visibility

### Integration Testing
- **Component Integration**: Test component combinations and layouts
- **Theme Consistency**: Ensure consistent theming across all components
- **Responsive Behavior**: Test component behavior across breakpoints
- **State Management**: Test component states and interactions

## Implementation Phases

### Phase 1: Foundation (Week 1-2)
- Implement brand color system in CSS variables
- Set up typography scale and font loading
- Create base spacing and layout utilities
- Establish component token system

### Phase 2: Core Components (Week 3-4)
- Enhance Button component with brand styling
- Update Card component variants
- Implement Form component improvements
- Create Logo component with variants

### Phase 3: Advanced Components (Week 5-6)
- Build Typography component system
- Implement Navigation components
- Create Product showcase components
- Develop Testimonial components

### Phase 4: Integration & Testing (Week 7-8)
- Integrate components across all pages
- Implement responsive design improvements
- Conduct accessibility audits
- Perform visual regression testing

This design system will ensure consistent brand implementation while maintaining flexibility for future enhancements and maintaining excellent user experience across all devices and use cases.