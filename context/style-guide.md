# Better Being Style Guide
*Enterprise Brand Standards & Visual Identity*

## Brand Overview

Better Being is a premium wellness brand that bridges the gap between natural health solutions and modern lifestyle needs. Our visual identity reflects trust, sophistication, and the transformative power of natural wellness.

### Brand Promise
"Transform Your Life with Better Being" - We provide premium natural products and personalized wellness journeys that unlock optimal health and vitality.

### Brand Personality
- **Trustworthy**: Reliable, evidence-based, transparent
- **Premium**: High-quality, sophisticated, refined
- **Natural**: Organic, earth-connected, authentic
- **Modern**: Contemporary, accessible, innovative
- **Caring**: Supportive, understanding, nurturing

---

## Color System

### Primary Brand Colors

#### Rust Orange - Primary Brand Color
- **Hex**: `#B85A3E`
- **HSL**: `hsl(18, 65%, 55%)`
- **RGB**: `rgb(184, 90, 62)`
- **Usage**: Primary CTAs, brand elements, focus states, headers
- **Accessibility**: AA compliant with white text

#### Sage Green - Secondary Brand Color  
- **Hex**: `#7A9B7A`
- **HSL**: `hsl(120, 17%, 54%)`
- **RGB**: `rgb(122, 155, 122)`
- **Usage**: Secondary actions, success states, nature elements
- **Accessibility**: AA compliant with white text

#### Warm Champagne - Supporting Color
- **Hex**: `#F5E6D3`
- **HSL**: `hsl(35, 56%, 89%)`
- **RGB**: `rgb(245, 230, 211)`
- **Usage**: Background warmth, card backgrounds, subtle accents

#### Deep Charcoal - Primary Text
- **Hex**: `#2A1F1A`
- **HSL**: `hsl(25, 26%, 14%)`
- **RGB**: `rgb(42, 31, 26)`
- **Usage**: Headlines, body text, icons

### Extended Earth Palette

#### Rich Amber
- **Hex**: `#B8860B`
- **Usage**: Warning states, highlight elements

#### Clay Brown
- **Hex**: `#CD7F52`
- **Usage**: Product imagery borders, decorative elements

#### Stone Gray
- **Hex**: `#E8E2DC`
- **Usage**: Subtle backgrounds, dividers

#### Soft White
- **Hex**: `#FEFEFE`
- **Usage**: Card backgrounds, main content areas

### Neutral System

#### Grays (Warm-tinted)
- **Gray 50**: `#FAFAF9` - Lightest backgrounds
- **Gray 100**: `#F5F5F4` - Card backgrounds
- **Gray 200**: `#E7E5E4` - Borders, dividers
- **Gray 300**: `#D6D3D1` - Disabled states
- **Gray 400**: `#A8A29E` - Placeholder text
- **Gray 500**: `#78716C` - Secondary text
- **Gray 600**: `#57534E` - Body text
- **Gray 700**: `#44403C` - Headings
- **Gray 800**: `#292524` - Primary text
- **Gray 900**: `#1C1917` - Darkest text

---

## Typography System

### Font Family
**Primary**: Inter (Google Fonts)
- Modern, highly legible sans-serif
- Excellent for both display and body text
- Wide language support
- Variable font available

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

font-family: 'Inter', system-ui, sans-serif;
```

### Typography Scale

#### Display Headings (Hero Sections)
- **Display XXL**: 72px / 4.5rem (Desktop), 48px / 3rem (Mobile)
  - Font Weight: 800
  - Line Height: 1.1
  - Letter Spacing: -0.02em
  - Usage: Hero headlines, major page titles

- **Display XL**: 60px / 3.75rem (Desktop), 40px / 2.5rem (Mobile)
  - Font Weight: 700
  - Line Height: 1.15
  - Letter Spacing: -0.015em
  - Usage: Section heroes, key messaging

- **Display Large**: 48px / 3rem (Desktop), 32px / 2rem (Mobile)
  - Font Weight: 700
  - Line Height: 1.2
  - Letter Spacing: -0.01em
  - Usage: Page section headers

#### Content Headings
- **H1**: 36px / 2.25rem (Desktop), 28px / 1.75rem (Mobile)
  - Font Weight: 700
  - Line Height: 1.25
  - Usage: Main page headings

- **H2**: 30px / 1.875rem (Desktop), 24px / 1.5rem (Mobile)
  - Font Weight: 600
  - Line Height: 1.3
  - Usage: Major section headings

- **H3**: 24px / 1.5rem (Desktop), 20px / 1.25rem (Mobile)
  - Font Weight: 600
  - Line Height: 1.35
  - Usage: Subsection headings

- **H4**: 20px / 1.25rem
  - Font Weight: 600
  - Line Height: 1.4
  - Usage: Component headings

- **H5**: 18px / 1.125rem
  - Font Weight: 500
  - Line Height: 1.45
  - Usage: Card titles, small headings

- **H6**: 16px / 1rem
  - Font Weight: 500
  - Line Height: 1.5
  - Usage: Labels, small titles

#### Body Text
- **Body Large**: 18px / 1.125rem
  - Font Weight: 400
  - Line Height: 1.7
  - Usage: Hero subtext, important body copy

- **Body**: 16px / 1rem
  - Font Weight: 400
  - Line Height: 1.6
  - Usage: Standard body text, paragraphs

- **Body Small**: 14px / 0.875rem
  - Font Weight: 400
  - Line Height: 1.55
  - Usage: Captions, helper text, metadata

- **Caption**: 12px / 0.75rem
  - Font Weight: 400
  - Line Height: 1.5
  - Usage: Fine print, timestamps, labels

---

## Spacing System

### Base Unit: 8px
All spacing should be multiples of 8px for consistent rhythm.

#### Spacing Scale
- **xs**: 4px (0.25rem) - Tight element spacing
- **sm**: 8px (0.5rem) - Small gaps, icon padding  
- **md**: 12px (0.75rem) - Standard element spacing
- **lg**: 16px (1rem) - Component padding
- **xl**: 24px (1.5rem) - Section spacing
- **2xl**: 32px (2rem) - Large section gaps
- **3xl**: 48px (3rem) - Major page sections
- **4xl**: 64px (4rem) - Hero sections
- **5xl**: 96px (6rem) - Large page dividers

#### Layout Spacing
- **Container Padding**: 16px mobile, 24px tablet, 32px desktop
- **Section Margins**: 48px mobile, 64px tablet, 96px desktop
- **Component Gaps**: 16px standard, 24px loose, 8px tight

---

## Component Specifications

### Buttons

#### Primary Button
```css
background: #B85A3E;
color: #FFFFFF;
padding: 12px 24px;
border-radius: 12px;
font-weight: 500;
font-size: 16px;
transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
box-shadow: 0 2px 8px rgba(184, 90, 62, 0.3);

/* Hover State */
transform: translateY(-2px);
box-shadow: 0 4px 12px rgba(184, 90, 62, 0.4);
```

#### Secondary Button  
```css
background: #7A9B7A;
color: #FFFFFF;
padding: 12px 24px;
border-radius: 12px;
font-weight: 500;
font-size: 16px;
```

#### Ghost Button
```css
background: transparent;
color: #B85A3E;
border: 1px solid #B85A3E;
padding: 12px 24px;
border-radius: 12px;
font-weight: 500;

/* Hover State */
background: #B85A3E;
color: #FFFFFF;
```

### Cards

#### Standard Card
```css
background: #FFFFFF;
border: 1px solid rgba(184, 90, 62, 0.1);
border-radius: 16px;
padding: 24px;
box-shadow: 0 4px 12px rgba(42, 31, 26, 0.08);
transition: all 0.3s ease;

/* Hover State */
transform: translateY(-4px);
box-shadow: 0 8px 25px rgba(42, 31, 26, 0.15);
```

#### Product Card
```css
background: #FFFFFF;
border: 1px solid rgba(184, 90, 62, 0.1);
border-radius: 16px;
overflow: hidden;
transition: all 0.3s ease;

/* Image Container */
aspect-ratio: 1 / 1;
background: linear-gradient(135deg, #F5F5F4, #E7E5E4);

/* Content Padding */
padding: 20px;
```

### Forms

#### Input Field
```css
background: #FFFFFF;
border: 1px solid #D6D3D1;
border-radius: 8px;
padding: 12px 16px;
font-size: 16px;
color: #292524;
transition: all 0.2s ease;

/* Focus State */
border-color: #B85A3E;
box-shadow: 0 0 0 3px rgba(184, 90, 62, 0.1);
```

#### Label
```css
font-weight: 500;
font-size: 14px;
color: #44403C;
margin-bottom: 6px;
display: block;
```

---

## Layout Guidelines

### Grid System
- **Desktop**: 12-column grid, 24px gutters
- **Tablet**: 8-column grid, 20px gutters  
- **Mobile**: 4-column grid, 16px gutters

### Breakpoints
```css
/* Mobile First Approach */
@media (min-width: 640px) { /* sm */ }
@media (min-width: 768px) { /* md */ }
@media (min-width: 1024px) { /* lg */ }
@media (min-width: 1280px) { /* xl */ }
@media (min-width: 1536px) { /* 2xl */ }
```

### Container Widths
- **Mobile**: 100% - 32px (16px each side)
- **Tablet**: 100% - 48px (24px each side)
- **Desktop**: Max 1200px, centered
- **Wide**: Max 1440px for hero sections

---

## Interactive States

### Hover Effects
```css
/* Buttons */
transform: translateY(-2px);
box-shadow: [enhanced shadow];

/* Cards */
transform: translateY(-4px);
border-color: rgba(184, 90, 62, 0.2);

/* Links */
color: #B85A3E;
text-decoration: underline;
```

### Focus States
```css
outline: 2px solid #B85A3E;
outline-offset: 2px;
```

### Loading States
```css
/* Skeleton */
background: linear-gradient(90deg, #F5F5F4 25%, #E7E5E4 50%, #F5F5F4 75%);
background-size: 200% 100%;
animation: skeleton-loading 1.5s infinite;
```

---

## Icon System

### Icon Library: Lucide React
- Consistent 1.5px stroke width
- 24px default size (16px small, 32px large)
- Rounded line caps and joins
- Optical alignment with text

### Icon Usage
```css
/* Standard Icons */
width: 24px;
height: 24px;
stroke: currentColor;
stroke-width: 1.5;
```

---

## Imagery Guidelines

### Photography Style
- **Natural lighting** preferred
- **Authentic moments** over staged poses
- **Diverse representation** across demographics
- **High resolution** minimum 1920px wide
- **Aspect ratios**: 16:9, 4:3, 1:1, 3:4

### Image Treatment
```css
/* Product Images */
aspect-ratio: 1 / 1;
object-fit: cover;
border-radius: 12px;

/* Hero Images */
aspect-ratio: 16 / 9;
object-fit: cover;
/* Optional overlay */
background: linear-gradient(rgba(42,31,26,0.3), rgba(42,31,26,0.3));
```

---

## Animation Guidelines

### Easing Functions
```css
/* Spring Animation */
cubic-bezier(0.34, 1.56, 0.64, 1)

/* Gentle Ease */
cubic-bezier(0.25, 0.46, 0.45, 0.94)

/* Standard Ease */
cubic-bezier(0.4, 0, 0.2, 1)
```

### Duration Standards
- **Micro interactions**: 200ms
- **Component transitions**: 300ms
- **Page transitions**: 400ms
- **Complex animations**: 600ms max

---

## Usage Examples

### ✅ Do's
- Use warm, muted color palette consistently
- Maintain generous whitespace for breathing room
- Ensure minimum 4.5:1 contrast for text
- Use Inter font family exclusively
- Apply subtle hover effects for interactivity
- Keep corners rounded (8px-16px) for softness
- Use authentic, diverse photography

### ❌ Don'ts  
- Use bright, saturated colors
- Overcrowd layouts with too many elements
- Use pure black (#000000) - always use warm charcoal
- Mix multiple font families
- Create jarring, fast animations
- Use harsh drop shadows
- Include generic stock photography

---

## Brand Voice Guidelines

### Tone of Voice
- **Warm & Approachable**: Use conversational language
- **Expert & Trustworthy**: Back claims with evidence
- **Encouraging & Supportive**: Motivate without pressure
- **Clear & Accessible**: Avoid jargon, explain complex terms

### Messaging Principles
- Focus on transformation, not just products
- Emphasize natural, science-backed solutions
- Use inclusive language that welcomes all
- Lead with benefits, support with features
- Maintain premium positioning without elitism

---

*This style guide ensures consistent, professional brand expression across all Better Being touchpoints, reinforcing our position as a premium wellness brand.*