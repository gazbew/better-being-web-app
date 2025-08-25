# Better Being - Claude Code Configuration
*Enterprise AI-Native Design & Development Workflow*

## Project Overview

Better Being is a premium wellness e-commerce platform built with React, TypeScript, Tailwind CSS, and shadcn/ui components. We serve enterprise clients including major brands and require world-class design standards with pixel-perfect implementation.

### Tech Stack
- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS with custom design system
- **Components**: shadcn/ui with custom Better Being branding
- **State**: Zustand, React Query for server state
- **Routing**: React Router v6
- **Testing**: Vitest, React Testing Library
- **Build**: Vite with optimizations for production

### Key Directories
- `/src/pages/` - All page components
- `/src/components/` - Reusable UI components
- `/src/components/ui/` - shadcn/ui base components
- `/context/` - Design principles, style guides, brand assets
- `/.claude/agents/` - Custom sub-agents for specialized tasks
- `/.claude/commands/` - Slash commands for workflows

---

## Brand & Design Context

### Design Philosophy
Better Being represents sophisticated wellness through natural earth tones, modern minimalism, and abstract organic elements. Reference `/context/design-principles.md` and `/context/style-guide.md` for comprehensive guidelines.

**Core Brand Colors:**
- Primary: Rust Orange (#B85A3E) - CTAs, brand elements, focus states
- Secondary: Sage Green (#7A9B7A) - Supporting actions, nature elements  
- Supporting: Warm Champagne (#F5E6D3) - Backgrounds, subtle warmth
- Text: Deep Charcoal (#2A1F1A) - Never pure black

**Typography:** Inter font family exclusively, with display scale for headlines and body scale for content.

**Design Principles:**
- Abstract minimalism with organic shapes
- Generous whitespace and harmonious spacing (8px grid)
- Subtle animations with spring easing
- Glass morphism effects for modern depth
- Accessibility-first approach (WCAG 2.1 AA)

---

## Visual Development Workflow

### Playwright Browser Automation

When making ANY frontend changes, automatically:

1. **Launch Playwright browser** with these specifications:
   - Browser: Chromium (headed mode for visibility)
   - Viewport: 1440x900 (desktop primary)
   - Device emulation: None (desktop first)
   - Wait for network idle before screenshots

2. **Navigate to affected pages**:
   - Homepage: `http://localhost:5173/`
   - Products: `http://localhost:5173/products`
   - Product Detail: `http://localhost:5173/product/1`
   - Any other pages modified in the session

3. **Capture comprehensive screenshots**:
   - Full page screenshot (entire vertical scroll)
   - Above-the-fold screenshot (initial viewport)
   - Mobile viewport screenshot (375px width)
   - Check console for any JavaScript errors

4. **Visual validation process**:
   - Compare against design principles in `/context/design-principles.md`
   - Verify brand consistency with `/context/style-guide.md`
   - Check for accessibility issues (contrast, focus states)
   - Validate responsive behavior across breakpoints
   - Ensure loading states and error states are handled

5. **Iterative refinement**:
   - If issues found, make corrections and re-test
   - Take new screenshots after each iteration
   - Continue until pixel-perfect match to specifications
   - Document any compromises or technical limitations

### Mobile-First Responsive Testing

For significant UI changes, test these viewports:
- **Mobile**: 375px (iPhone SE baseline)
- **Tablet**: 768px (iPad portrait)
- **Desktop**: 1024px (laptop)
- **Large**: 1440px (desktop)

### Console Error Monitoring

Always check browser console for:
- JavaScript runtime errors
- React warnings or errors
- Network request failures (404, 500 errors)
- Accessibility warnings
- Performance warnings (LCP, CLS issues)

---

## Code Quality Standards

### React Best Practices
- Use TypeScript strictly with proper type definitions
- Implement proper error boundaries around major components
- Use React.memo() for expensive components
- Implement proper loading and error states
- Use semantic HTML elements for accessibility
- Add proper ARIA labels where needed

### Component Architecture
- Keep components small and focused (single responsibility)
- Use composition over inheritance
- Implement proper prop types with TypeScript interfaces
- Use custom hooks for complex state logic
- Follow shadcn/ui patterns for consistency

### Performance Requirements
- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- Cumulative Layout Shift: < 0.1
- Time to Interactive: < 3.5s
- Lighthouse score: > 90 for all metrics

### CSS/Styling Standards
- Use Tailwind CSS utility classes exclusively
- Follow Better Being design system colors and spacing
- Implement custom CSS classes in `/src/index.css` for reusable patterns
- Use CSS custom properties for theme values
- Ensure all animations respect `prefers-reduced-motion`

---

## Git Workflow Preferences

### Commit Standards
- Use conventional commit format: `feat:`, `fix:`, `docs:`, `style:`, etc.
- Keep commits atomic and focused on single changes
- Write descriptive commit messages explaining the "why"
- Include ticket/issue numbers when applicable

### Branch Naming
- Feature branches: `feature/design-modernization`
- Bug fixes: `fix/navigation-mobile-issues`
- Hotfixes: `hotfix/critical-checkout-bug`

### Pull Request Guidelines
- Include screenshots of visual changes (before/after)
- Add Playwright screenshots for significant UI updates
- Reference design specifications and acceptance criteria
- Include mobile responsiveness validation
- Test checkout flow for e-commerce changes

---

## Sub-Agent Coordination

### Design Review Agent
Invoke with `@@agent design-review` for comprehensive visual audits including:
- Brand consistency validation
- Accessibility compliance check
- Mobile responsiveness review
- Performance impact assessment
- User experience evaluation

### Development Standards
- Never introduce new CSS frameworks or libraries without approval
- Maintain consistent component patterns across the application
- Ensure all new components are properly typed with TypeScript
- Follow existing project structure and naming conventions
- Update documentation for any new patterns or components

---

## Comprehensive Design Review Trigger

Automatically invoke comprehensive design review for:
- Pull requests touching UI components
- Significant UX/UI refactors
- New page implementations
- Changes affecting mobile responsiveness
- Updates to checkout or conversion-critical flows
- Any changes to the design system or branding

### Design Review Process
1. **Visual Screenshots**: Capture current state across all viewports
2. **Brand Compliance**: Verify adherence to Better Being design principles
3. **Accessibility Audit**: Check WCAG 2.1 AA compliance
4. **Performance Check**: Validate loading times and Core Web Vitals
5. **User Flow Testing**: Ensure critical paths (checkout, product discovery) work seamlessly
6. **Cross-Browser Testing**: Verify consistency across Chrome, Safari, Firefox
7. **Documentation**: Update any affected style guides or component documentation

---

## Error Handling Standards

### UI Error States
- Implement graceful degradation for all components
- Show meaningful error messages, never technical jargon
- Provide clear recovery actions for users
- Use Better Being brand colors for error states (warm, not harsh reds)
- Ensure errors are accessible to screen readers

### Development Error Handling
- Use React Error Boundaries for component-level error catching
- Implement proper TypeScript error types
- Handle async operations with proper loading/error states
- Log meaningful errors to console for debugging
- Never suppress errors silently

---

## Enterprise Quality Checklist

Before marking any frontend work as complete:

- [ ] **Visual Design**: Matches Better Being brand standards exactly
- [ ] **Responsive**: Works seamlessly on mobile, tablet, desktop
- [ ] **Accessibility**: WCAG 2.1 AA compliant with proper focus management
- [ ] **Performance**: Lighthouse score > 90, no performance regressions
- [ ] **Browser Compatibility**: Tested in Chrome, Safari, Firefox
- [ ] **Error States**: Proper handling of loading, error, and empty states  
- [ ] **TypeScript**: No type errors, proper interfaces defined
- [ ] **Testing**: Unit tests for complex logic, visual regression tests
- [ ] **Documentation**: Updated for any new patterns or components

---

## Communication & Handoff

### When Presenting Work
- Always include Playwright screenshots showing before/after
- Document any compromises or technical limitations
- Explain design decisions in context of Better Being brand
- Highlight accessibility improvements or considerations
- Note any performance impacts (positive or negative)

### Collaboration Notes
- Ask for clarification on ambiguous requirements before implementing
- Suggest improvements based on Better Being design principles
- Point out potential issues with user experience or accessibility
- Recommend performance optimizations when applicable
- Flag any deviations from established patterns

---

*This configuration ensures every Claude Code session maintains context of Better Being's enterprise standards, design principles, and automated quality workflows.*