# Brand Animation System Documentation

This document provides comprehensive documentation for the Better Being brand animation system, designed to create consistent, accessible, and performant animations across the web application.

## Overview

The brand animation system includes:
- **Float animations** for gentle, wellness-focused motion
- **Glow effects** for premium and interactive elements  
- **Bounce animations** for playful, engaging interactions
- **Entrance animations** (fade, scale, slide) for content reveals
- **Brand-specific animations** aligned with wellness values
- **Interaction states** for hover, focus, and active states
- **Loading animations** for better user experience
- **Accessibility support** respecting user preferences

## Animation Categories

### 1. Float Animations

Gentle floating motions that convey wellness and natural movement.

```css
/* Basic float animations */
.animate-float          /* Standard 3s floating motion */
.animate-float-gentle   /* Subtle 4s floating motion */
.animate-float-premium  /* Enhanced floating with scale effect */
```

**Usage:**
```html
<div class="animate-float bg-white p-6 rounded-lg">
  <h3>Wellness Content</h3>
  <p>Gently floating element</p>
</div>
```

**Best Practices:**
- Use for wellness-focused content
- Apply to cards, testimonials, or feature highlights
- Avoid on text-heavy content that needs to be read

### 2. Glow Animations

Subtle glow effects that create premium, attention-drawing elements.

```css
/* Glow effect animations */
.animate-glow           /* Orange brand glow (2s cycle) */
.animate-glow-wellness  /* Green wellness glow (3s cycle) */
.animate-glow-premium   /* Multi-layer premium glow (2s cycle) */
```

**Usage:**
```html
<div class="animate-glow-wellness bg-white p-6 rounded-lg">
  <h3>Featured Product</h3>
  <p>Premium wellness solution</p>
</div>
```

**Best Practices:**
- Use sparingly for key call-to-action elements
- Ideal for premium products or special offers
- Ensure sufficient contrast for accessibility

### 3. Bounce Animations

Playful bounce effects for interactive feedback and engagement.

```css
/* Bounce animations */
.animate-bounce-gentle   /* Soft bounce (1s duration) */
.animate-bounce-wellness /* Wellness-themed bounce with scale */
.animate-bounce-premium  /* Premium bounce with multiple stages */
```

**Usage:**
```html
<button class="animate-bounce-gentle bg-orange-600 text-white px-6 py-3 rounded-lg">
  Get Started
</button>
```

**Best Practices:**
- Use for buttons and interactive elements
- Trigger on user actions (clicks, form submissions)
- Avoid continuous bouncing animations

### 4. Entrance Animations

Smooth entrance effects for content that appears on scroll or load.

#### Fade In Animations
```css
.animate-fade-in        /* Basic fade in */
.animate-fade-in-up     /* Fade in with upward motion */
.animate-fade-in-down   /* Fade in with downward motion */
.animate-fade-in-left   /* Fade in from left */
.animate-fade-in-right  /* Fade in from right */
```

#### Scale In Animations
```css
.animate-scale-in          /* Basic scale in */
.animate-scale-in-center   /* Center-focused scale */
.animate-scale-in-wellness /* Wellness-themed scale */
.animate-scale-in-premium  /* Premium scale with rotation */
```

#### Slide In Animations
```css
.animate-slide-in-up    /* Slide in from bottom */
.animate-slide-in-down  /* Slide in from top */
.animate-slide-in-left  /* Slide in from left */
.animate-slide-in-right /* Slide in from right */
```

**Usage with Delays:**
```html
<div class="grid grid-cols-3 gap-4">
  <div class="animate-fade-in-up animate-delay-100">First item</div>
  <div class="animate-fade-in-up animate-delay-200">Second item</div>
  <div class="animate-fade-in-up animate-delay-300">Third item</div>
</div>
```

### 5. Brand-Specific Animations

Unique animations that embody the Better Being brand values.

```css
.animate-wellness-breathe  /* Breathing animation (1s cycle) */
.animate-premium-shimmer   /* Shimmer effect with overlay */
.animate-brand-pulse       /* Pulsing with brand colors */
.animate-wellness-wave     /* Gentle wave motion (4s cycle) */
```

**Usage:**
```html
<!-- Wellness breathing effect -->
<div class="animate-wellness-breathe bg-gradient-wellness p-8 rounded-xl">
  <h2>Natural Wellness Solutions</h2>
</div>

<!-- Premium shimmer effect -->
<div class="animate-premium-shimmer bg-gradient-premium text-white p-8 rounded-xl">
  <h2>Premium Collection</h2>
</div>
```

### 6. Interaction State Animations

Hover, focus, and active state animations for better user feedback.

#### Hover Animations
```css
.hover-float     /* Float effect on hover */
.hover-glow      /* Glow effect on hover */
.hover-bounce    /* Bounce effect on hover */
.hover-scale     /* Scale effect on hover */
.hover-lift      /* Lift effect on hover */
.hover-wellness  /* Combined wellness hover effect */
.hover-premium   /* Combined premium hover effect */
```

#### Focus and Active States
```css
.focus-pulse     /* Pulse effect on focus */
.focus-glow      /* Glow effect on focus */
.active-bounce   /* Bounce effect when active */
.active-scale    /* Scale effect when active */
```

**Usage:**
```html
<button class="hover-wellness focus-pulse bg-green-600 text-white px-6 py-3 rounded-lg">
  Wellness Action
</button>
```

### 7. Loading State Animations

Animations for loading states and skeleton screens.

```css
.loading-pulse   /* Pulsing loading indicator */
.loading-breathe /* Breathing loading animation */
.loading-shimmer /* Shimmer loading effect */
```

**Usage:**
```html
<!-- Loading card -->
<div class="loading-shimmer h-32 rounded-lg"></div>

<!-- Loading button -->
<button class="loading-pulse bg-gray-400 text-white px-6 py-3 rounded-lg" disabled>
  Loading...
</button>
```

## Animation Timing and Delays

### Duration Utilities
```css
.animate-duration-instant  /* 100ms */
.animate-duration-quick    /* 200ms */
.animate-duration-smooth   /* 300ms */
.animate-duration-gentle   /* 500ms */
.animate-duration-slow     /* 700ms */
.animate-duration-wellness /* 1000ms */
```

### Delay Utilities
```css
.animate-delay-none        /* 0ms */
.animate-delay-short       /* 100ms */
.animate-delay-medium      /* 200ms */
.animate-delay-long        /* 300ms */
.animate-delay-extra-long  /* 500ms */

/* Specific delays for staggered animations */
.animate-delay-100 through .animate-delay-1000 /* 100ms increments */
```

### Timing Function Utilities
```css
.animate-ease-gentle   /* Gentle easing curve */
.animate-ease-bounce   /* Bouncy easing curve */
.animate-ease-wellness /* Wellness-focused easing */
.animate-ease-premium  /* Premium easing curve */
.animate-ease-natural  /* Natural easing curve */
```

**Usage:**
```html
<div class="animate-scale-in animate-duration-gentle animate-delay-200 animate-ease-wellness">
  Custom timed animation
</div>
```

## Scroll-Triggered Animations

Animations that trigger when elements come into view during scrolling.

```css
.scroll-fade-in    /* Fade in when scrolled into view */
.scroll-scale-in   /* Scale in when scrolled into view */
.scroll-slide-left /* Slide from left when in view */
.scroll-slide-right/* Slide from right when in view */
```

**JavaScript Integration:**
```javascript
// Example intersection observer for scroll animations
const observeScrollAnimations = () => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
      }
    });
  });

  document.querySelectorAll('.scroll-fade-in, .scroll-scale-in, .scroll-slide-left, .scroll-slide-right')
    .forEach(el => observer.observe(el));
};
```

## Accessibility Features

### Reduced Motion Support

All animations respect the `prefers-reduced-motion` media query:

```css
@media (prefers-reduced-motion: reduce) {
  /* Continuous animations are disabled */
  .animate-float,
  .animate-glow,
  .animate-wellness-breathe {
    animation: none;
  }
  
  /* Entrance animations become instant */
  .animate-fade-in,
  .animate-scale-in {
    animation-duration: 0.01ms;
  }
  
  /* Hover effects are simplified */
  .hover-scale:hover {
    transform: none;
    transition: none;
  }
}
```

### High Contrast Support

Glow and shadow effects are removed in high contrast mode:

```css
@media (prefers-contrast: high) {
  .animate-glow,
  .animate-glow-wellness,
  .animate-glow-premium {
    box-shadow: none;
  }
}
```

### Print Styles

All animations are disabled for print:

```css
@media print {
  *,
  *::before,
  *::after {
    animation: none !important;
    transition: none !important;
    transform: none !important;
  }
}
```

## Performance Considerations

### GPU Acceleration

Animations use transform and opacity properties for optimal performance:

```css
/* Good - GPU accelerated */
.animate-float {
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
}
```

### Animation Optimization

- Use `transform` and `opacity` for smooth 60fps animations
- Avoid animating layout properties (width, height, margin, padding)
- Use `will-change` sparingly and remove after animation completes
- Prefer CSS animations over JavaScript for simple effects

### Bundle Size Impact

The animation system adds approximately 8KB to the CSS bundle:
- Core keyframes: ~3KB
- Utility classes: ~4KB  
- Accessibility overrides: ~1KB

## Browser Support

### Modern Browsers
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

### Fallbacks
- Older browsers receive no animations (graceful degradation)
- CSS custom properties have fallback values
- Animation events are feature-detected in JavaScript

## Usage Examples

### Product Card with Hover Effects
```html
<div class="bg-white rounded-lg shadow-card hover-wellness animate-fade-in-up">
  <img src="product.jpg" alt="Product" class="w-full h-48 object-cover rounded-t-lg">
  <div class="p-6">
    <h3 class="text-xl font-semibold mb-2">Wellness Product</h3>
    <p class="text-gray-600 mb-4">Natural health solution</p>
    <button class="btn-gradient-wellness hover-bounce focus-pulse px-6 py-2 rounded-lg">
      Add to Cart
    </button>
  </div>
</div>
```

### Hero Section with Staggered Animations
```html
<section class="bg-gradient-hero text-white py-20">
  <div class="container mx-auto px-4">
    <h1 class="text-5xl font-bold mb-6 animate-fade-in-down">
      Better Being Awaits
    </h1>
    <p class="text-xl mb-8 animate-fade-in-up animate-delay-200">
      Discover natural wellness solutions
    </p>
    <button class="animate-scale-in animate-delay-400 hover-premium focus-pulse bg-white text-orange-600 px-8 py-4 rounded-lg text-lg font-semibold">
      Start Your Journey
    </button>
  </div>
</section>
```

### Loading State Example
```html
<!-- Loading skeleton -->
<div class="space-y-4">
  <div class="loading-shimmer h-4 rounded w-3/4"></div>
  <div class="loading-shimmer h-4 rounded w-1/2"></div>
  <div class="loading-shimmer h-32 rounded"></div>
</div>

<!-- Loading button -->
<button class="loading-pulse bg-gray-400 text-white px-6 py-3 rounded-lg" disabled>
  <span class="animate-wellness-breathe inline-block">Processing...</span>
</button>
```

### Testimonial with Brand Animation
```html
<div class="bg-gradient-wellness-soft p-8 rounded-xl animate-wellness-breathe">
  <blockquote class="text-lg italic mb-4 animate-fade-in">
    "Better Being transformed my wellness journey with their natural approach."
  </blockquote>
  <cite class="font-semibold animate-fade-in animate-delay-200">
    - Sarah Johnson, Wellness Enthusiast
  </cite>
</div>
```

## Best Practices

### Do's
- ✅ Use animations to enhance user experience
- ✅ Respect accessibility preferences
- ✅ Keep animations subtle and purposeful
- ✅ Use brand-specific animations for key elements
- ✅ Test on various devices and browsers
- ✅ Combine animations thoughtfully (hover + focus states)

### Don'ts
- ❌ Overuse animations - they should enhance, not distract
- ❌ Animate layout properties for performance reasons
- ❌ Ignore reduced motion preferences
- ❌ Use animations longer than 1 second for interactions
- ❌ Apply multiple conflicting animations to the same element
- ❌ Animate elements that users need to read immediately

### Performance Tips
- Use `transform` and `opacity` for smooth animations
- Avoid animating `width`, `height`, `margin`, `padding`
- Use `animation-fill-mode: both` to prevent flashing
- Consider using `animation-play-state: paused` for user-controlled animations
- Test animations on lower-end devices

## Integration with Existing Components

The animation system is designed to work seamlessly with existing components:

```html
<!-- Enhanced Button Component -->
<Button 
  variant="primary" 
  className="hover-wellness focus-pulse animate-scale-in"
>
  Get Started
</Button>

<!-- Enhanced Card Component -->
<Card 
  variant="premium" 
  className="animate-fade-in-up hover-premium animate-delay-200"
>
  <CardContent>Premium content</CardContent>
</Card>
```

This animation system provides a comprehensive foundation for creating engaging, accessible, and performant animations that align with the Better Being brand values and enhance the overall user experience.