# Better Being Design Principles
*Enterprise-Grade Wellness Design Standards*

## Core Philosophy
Better Being represents the intersection of natural wellness, modern technology, and human-centered design. Our visual identity should evoke trust, tranquility, and transformation while maintaining the sophistication expected by enterprise clients.

## 1. Visual Hierarchy & Typography

### Primary Hierarchy
- **Display Headlines**: Use Inter 700-800, 48-72px desktop, 32-48px mobile
- **Section Headers**: Inter 600, 32-42px desktop, 24-32px mobile  
- **Body Text**: Inter 400-500, 16-18px with 1.6-1.8 line height
- **Supporting Text**: Inter 400, 14-16px with 1.5-1.7 line height

### Typography Rules
- Maximum 3 font weights per page
- Maintain 8px baseline grid alignment
- Use sentence case for buttons and navigation
- Ensure minimum 4.5:1 contrast ratio for accessibility
- Letter spacing: -0.02em for large text, 0 for body text

## 2. Color Psychology & Application

### Primary Palette (Sophisticated Earth Tones)
- **Rust Orange (#B85A3E)**: Primary brand, CTAs, focus states
- **Sage Green (#7A9B7A)**: Secondary actions, success states, nature elements
- **Warm Champagne (#F5E6D3)**: Background warmth, card backgrounds
- **Deep Charcoal (#2A1F1A)**: Primary text, headers

### Usage Guidelines
- 70% neutral backgrounds (whites, warm grays)
- 20% secondary colors (sage green, champagne)
- 10% primary accent (rust orange)
- Never use pure black (#000000) - always warm charcoal
- Gradients: Subtle, 15-30% opacity overlays only

## 3. Spacing & Layout Harmony

### Spacing Scale (8px Base)
- **xs**: 4px - Icon padding, small gaps
- **sm**: 8px - Text spacing, small elements
- **md**: 16px - Component padding, standard gaps
- **lg**: 24px - Section spacing, card padding
- **xl**: 32px - Major section breaks
- **2xl**: 48px - Page section dividers
- **3xl**: 64px - Hero spacing, major breaks

### Layout Rules
- Maximum content width: 1200px
- Sidebar width: 280px or 320px
- Mobile breakpoints: 375px, 768px, 1024px, 1440px
- Maintain minimum 24px margins on mobile
- Use CSS Grid for layout, Flexbox for components

## 4. Component Design Standards

### Cards & Containers
- Border radius: 12-16px for large containers, 8px for small elements
- Box shadow: Subtle elevation (0 4px 12px rgba(42,31,26,0.08))
- Hover states: Lift 2px, increase shadow 20%
- Border: 1px solid with 20% opacity of primary color
- Background: Pure white or warm white (#FEFEFE)

### Buttons & Interactive Elements
- **Primary**: Rust orange background, white text, 12px radius
- **Secondary**: Sage green background, white text, 12px radius  
- **Ghost**: Transparent background, colored text, subtle hover
- Minimum touch target: 44x44px
- Padding: 12px horizontal, 8px vertical (small), 16px/12px (medium)
- Transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)

### Forms & Inputs
- Height: 44px minimum for inputs
- Padding: 12px horizontal, 10px vertical
- Border: 1px solid neutral-300, focus: primary color
- Border radius: 8px
- Label placement: Above input with 6px gap
- Error states: Red border, icon, helper text

## 5. Imagery & Visual Elements

### Photography Style
- High-quality, authentic lifestyle imagery
- Natural lighting preferred over artificial
- Diverse representation across age, ethnicity, body types
- Avoid overly polished, stock photo aesthetic
- Focus on real moments, genuine expressions

### Iconography Rules
- Outline style with 1.5px stroke weight
- 24px standard size, scalable to 16px and 32px
- Rounded line caps and joins
- Consistent optical sizing across icon families
- Use Lucide React or similar cohesive icon set

### Abstract Elements
- Organic shapes over geometric when possible
- Subtle gradients (10-20% opacity)
- Floating elements with gentle animation
- Blur effects: 8-16px backdrop blur for glass morphism
- Avoid harsh shadows or stark contrasts

## 6. Motion & Animation

### Animation Principles
- **Easing**: cubic-bezier(0.34, 1.56, 0.64, 1) for spring effects
- **Duration**: 0.2s for micro-interactions, 0.4s for page transitions
- **Reduce motion**: Respect prefers-reduced-motion
- **Purpose**: Every animation should have functional purpose

### Interaction Patterns
- Hover: Scale 1.02, lift 2px, increase shadow
- Click: Scale 0.98 briefly, then spring back
- Loading: Gentle pulse or skeleton screens
- Page transitions: Slide up 20px with fade
- Form validation: Shake for errors, checkmark for success

## 7. Accessibility & Inclusion

### WCAG 2.1 AA Compliance
- Color contrast minimum 4.5:1 for normal text, 3:1 for large text
- All interactive elements keyboard accessible
- Focus indicators clearly visible
- Alt text for all meaningful images
- Semantic HTML structure with proper headings

### Inclusive Design
- Text size: Minimum 16px on mobile, scalable to 200%
- Touch targets: Minimum 44px square
- Color never sole indicator of meaning
- Descriptive link text, no "click here"
- Test with screen readers regularly

## 8. Performance & Technical Standards

### Loading & Optimization
- Images: WebP format with fallbacks, lazy loading below fold
- Critical CSS inlined, non-critical deferred
- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- Cumulative Layout Shift: < 0.1

### Responsive Behavior
- Mobile-first design approach
- Breakpoints: 375px, 768px, 1024px, 1440px
- Touch-friendly on all devices
- Consistent experience across browsers
- Progressive enhancement strategy

## 9. Brand Voice in Visual Design

### Emotional Tone
- **Calm & Reassuring**: Ample whitespace, soft edges, muted colors
- **Trustworthy**: Consistent patterns, clear information hierarchy
- **Premium**: Quality typography, refined color palette, attention to detail
- **Natural**: Organic shapes, earth tones, authentic imagery
- **Modern**: Clean lines, contemporary layouts, subtle technology integration

### Avoid These Elements
- Bright, saturated colors (except as minimal accents)
- Sharp, angular designs
- Cluttered layouts
- Generic stock photography
- Overly technical or medical aesthetics
- Cold, sterile color schemes

## 10. Enterprise Standards

### Cross-Platform Consistency
- Design system documented in Figma/Storybook
- Component library with usage guidelines
- Brand guidelines accessible to all team members
- Regular design reviews and audits
- Version control for design assets

### Scalability Requirements
- Components work at multiple sizes
- Content strategy for various text lengths
- Internationalization considerations
- Dark mode support (future consideration)
- Design system can scale across products

## Implementation Notes

### For Developers
- Use CSS custom properties for consistent theming
- Implement design tokens for spacing, colors, typography
- Create reusable component classes
- Test designs across devices and browsers
- Validate accessibility with automated tools

### For Designers
- Start with mobile viewport, scale up
- Use 8px grid system consistently  
- Test color combinations for accessibility
- Consider edge cases and error states
- Design with real content, not Lorem ipsum

---

*These principles should guide every design decision, ensuring Better Being maintains its position as a premium, trustworthy wellness brand while delivering exceptional user experiences.*