# Brand Utilities Documentation

This directory contains brand-specific utility classes for the Better Being Web application, implementing the Brand Bible BB-4 guidelines.

## Gradients (`gradients.css`)

### Hero Gradients
Primary gradients for hero sections and main call-to-action elements.

```css
/* Basic hero gradients */
.bg-gradient-hero          /* Orange to Green diagonal */
.bg-gradient-hero-soft     /* Orange to Green with transparency */
.bg-gradient-hero-radial   /* Radial gradient from center */

/* Animated hero gradient */
.bg-gradient-hero-animated /* Animated gradient with movement */
```

**Usage Example:**
```html
<div class="bg-gradient-hero text-white p-8">
  <h1>Welcome to Better Being</h1>
</div>
```

### Wellness Gradients
Gradients focused on health and wellness themes using champagne and green colors.

```css
/* Wellness gradients */
.bg-gradient-wellness          /* Champagne to Green horizontal */
.bg-gradient-wellness-soft     /* Soft wellness gradient */
.bg-gradient-wellness-vertical /* Vertical wellness gradient */

/* Animated wellness gradient */
.bg-gradient-wellness-breathing /* Subtle breathing animation */
```

**Usage Example:**
```html
<div class="bg-gradient-wellness p-6 rounded-lg">
  <h2>Natural Health Solutions</h2>
</div>
```

### Premium Gradients
Sophisticated gradients for premium products and exclusive content.

```css
/* Premium gradients */
.bg-gradient-premium         /* Orange to Champagne to Orange */
.bg-gradient-premium-gold    /* Gold-toned premium gradient */
.bg-gradient-premium-subtle  /* Subtle premium gradient */

/* Animated premium gradient */
.bg-gradient-premium-shimmer /* Shimmer effect overlay */
```

**Usage Example:**
```html
<div class="bg-gradient-premium text-white p-8 rounded-xl">
  <h2>Premium Collection</h2>
</div>
```

### Text Gradients
Gradient effects for text elements.

```css
.text-gradient-brand    /* Brand orange to green text */
.text-gradient-premium  /* Premium gold to orange text */
.text-gradient-wellness /* Wellness green to orange text */
```

**Usage Example:**
```html
<h1 class="text-gradient-brand text-4xl font-bold">
  Better Being
</h1>
```

### Button Gradients
Pre-styled gradient buttons with hover effects.

```css
.btn-gradient-hero     /* Hero-style gradient button */
.btn-gradient-wellness /* Wellness-style gradient button */
.btn-gradient-premium  /* Premium-style gradient button */
```

**Usage Example:**
```html
<button class="btn-gradient-hero px-6 py-3 rounded-lg">
  Shop Now
</button>
```

### Overlay Gradients
Gradients for content overlays and image treatments.

```css
.bg-gradient-overlay-dark  /* Dark overlay gradient */
.bg-gradient-overlay-light /* Light overlay gradient */
.bg-gradient-overlay-brand /* Brand-colored overlay */
```

### Responsive Gradients
Gradients that adapt to different screen sizes.

```css
.bg-gradient-hero-responsive     /* Responsive hero gradient */
.bg-gradient-wellness-responsive /* Responsive wellness gradient */
```

## Shadows (`shadows.css`)

### Wellness Shadows
Natural, organic feeling shadows using green tones.

```css
/* Wellness shadow sizes */
.shadow-wellness-xs  /* Extra small wellness shadow */
.shadow-wellness-sm  /* Small wellness shadow */
.shadow-wellness-md  /* Medium wellness shadow */
.shadow-wellness-lg  /* Large wellness shadow */
.shadow-wellness-xl  /* Extra large wellness shadow */

/* Interactive wellness shadows */
.shadow-wellness-hover /* Hover effect shadow */
.shadow-wellness-inner /* Inner/inset shadow */
.shadow-wellness-glow  /* Glow effect */
```

**Usage Example:**
```html
<div class="shadow-wellness-md bg-white p-6 rounded-lg">
  <h3>Wellness Product Card</h3>
</div>
```

### Premium Shadows
Sophisticated, luxury feeling shadows using orange and gold tones.

```css
/* Premium shadow sizes */
.shadow-premium-xs  /* Extra small premium shadow */
.shadow-premium-sm  /* Small premium shadow */
.shadow-premium-md  /* Medium premium shadow */
.shadow-premium-lg  /* Large premium shadow */
.shadow-premium-xl  /* Extra large premium shadow */

/* Interactive premium shadows */
.shadow-premium-hover   /* Hover effect shadow */
.shadow-premium-inner   /* Inner/inset shadow */
.shadow-premium-glow    /* Glow effect */
.shadow-premium-shimmer /* Animated shimmer effect */
```

**Usage Example:**
```html
<div class="shadow-premium-lg bg-white p-8 rounded-xl">
  <h3>Premium Product</h3>
</div>
```

### Floating Shadows
Dynamic, elevated shadows for interactive elements.

```css
/* Floating shadow sizes */
.shadow-floating-xs  /* Extra small floating shadow */
.shadow-floating-sm  /* Small floating shadow */
.shadow-floating-md  /* Medium floating shadow */
.shadow-floating-lg  /* Large floating shadow */
.shadow-floating-xl  /* Extra large floating shadow */

/* Animated floating shadow */
.shadow-floating-animated /* Floating animation effect */
```

**Usage Example:**
```html
<div class="shadow-floating-animated bg-white p-6 rounded-lg">
  <h3>Interactive Card</h3>
</div>
```

### Combined Shadows
Multi-layered shadow effects for special use cases.

```css
.shadow-brand-signature /* Combines wellness and premium */
.shadow-hero           /* For main CTAs and hero elements */
.shadow-card           /* For product and content cards */
.shadow-modal          /* For overlays and modals */
```

**Usage Example:**
```html
<div class="shadow-hero bg-gradient-hero text-white p-8 rounded-lg">
  <h2>Featured Product</h2>
</div>
```

### Focus Shadows
Accessibility-focused shadows for interactive states.

```css
.shadow-focus-wellness /* Wellness-themed focus ring */
.shadow-focus-premium  /* Premium-themed focus ring */
.shadow-focus-brand    /* Brand-themed focus ring */
.shadow-focus-elevated /* Combined focus and elevation */
```

**Usage Example:**
```html
<button class="shadow-focus-brand focus:shadow-focus-elevated">
  Accessible Button
</button>
```

### Interactive Shadows
Pre-configured shadows for common interactive elements.

```css
/* Button shadows */
.shadow-btn-primary  /* Primary button shadow with states */
.shadow-btn-premium  /* Premium button shadow with states */

/* Input shadows */
.shadow-input        /* Input field shadow with focus state */
```

**Usage Example:**
```html
<button class="shadow-btn-primary bg-orange-600 text-white px-4 py-2 rounded">
  Primary Action
</button>

<input class="shadow-input border rounded px-3 py-2" type="text" />
```

### Directional Shadows
Shadows with specific lighting directions.

```css
.shadow-top-lit      /* Top-lit shadow effect */
.shadow-side-lit     /* Side-lit shadow effect */
.shadow-bottom-heavy /* Bottom-heavy shadow effect */
```

### Responsive Shadows
Shadows that adapt to different screen sizes.

```css
.shadow-responsive      /* General responsive shadow */
.shadow-card-responsive /* Responsive card shadow */
.shadow-hero-responsive /* Responsive hero shadow */
```

## Brand Colors Used

The utilities use the following brand colors from the Brand Bible:

- **Better Being Orange**: `#C1581B` - Primary brand color
- **Champagne**: `#F5F0E8` - Secondary color for elegance
- **Fresh Green**: `#84CC16` - Accent color for wellness
- **Patsy Gray**: `#6B7280` - Neutral color for text
- **Black Bean**: `#1F2937` - Deep neutral for contrast

## Accessibility Features

### Reduced Motion Support
All animations respect the `prefers-reduced-motion` setting:

```css
@media (prefers-reduced-motion: reduce) {
  /* Animations are disabled */
}
```

### High Contrast Support
Shadows and gradients adapt for high contrast mode:

```css
@media (prefers-contrast: high) {
  /* Simplified shadows and solid colors */
}
```

### Focus Management
Focus shadows provide clear visual feedback:

```css
.shadow-focus-brand {
  box-shadow: 0 0 0 2px rgba(255, 255, 255, 1), 
              0 0 0 4px rgba(193, 88, 27, 0.3);
}
```

## Performance Considerations

- CSS custom properties are used for efficient color management
- Animations use `transform` and `opacity` for optimal performance
- Gradients are optimized for GPU acceleration
- Shadow values are pre-calculated for consistent rendering

## Browser Support

- Modern browsers with CSS custom properties support
- Graceful degradation for older browsers
- Webkit prefixes included for gradient text effects
- Backdrop-filter fallbacks provided

## Integration with Existing Styles

These utilities are designed to work alongside the existing design system:

- Compatible with Tailwind CSS classes
- Follows the established spacing and sizing conventions
- Integrates with the existing color system
- Maintains consistency with current component patterns

## Examples

### Product Card with Wellness Theme
```html
<div class="shadow-wellness-hover bg-gradient-wellness-soft p-6 rounded-lg">
  <h3 class="text-gradient-wellness text-xl font-bold">Natural Supplement</h3>
  <p class="text-gray-600 mt-2">Organic wellness solution</p>
  <button class="btn-gradient-wellness mt-4 px-4 py-2 rounded">
    Learn More
  </button>
</div>
```

### Premium Product Showcase
```html
<div class="shadow-premium-shimmer bg-gradient-premium text-white p-8 rounded-xl">
  <h2 class="text-2xl font-bold mb-4">Premium Collection</h2>
  <p class="mb-6">Exclusive wellness products</p>
  <button class="btn-gradient-premium px-6 py-3 rounded-lg">
    Shop Premium
  </button>
</div>
```

### Hero Section
```html
<section class="bg-gradient-hero-animated text-white py-20">
  <div class="container mx-auto px-4">
    <h1 class="text-5xl font-bold mb-6">Better Being Awaits</h1>
    <p class="text-xl mb-8">Discover natural wellness solutions</p>
    <button class="shadow-hero btn-gradient-wellness px-8 py-4 rounded-lg text-lg">
      Start Your Journey
    </button>
  </div>
</section>
```