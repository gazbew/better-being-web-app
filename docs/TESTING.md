# Testing Documentation

## Overview

This document outlines the comprehensive testing strategy implemented for the BetterBeingWEB project, covering both frontend and backend testing approaches.

## Testing Stack

### Frontend Testing
- **Test Runner**: Vitest v3.2.4
- **Testing Library**: React Testing Library v16.3.0
- **DOM Environment**: jsdom v26.1.0
- **User Interaction**: @testing-library/user-event v14.6.1
- **Test Matchers**: @testing-library/jest-dom v6.6.4

### Backend Testing
- **Test Runner**: Vitest v3.2.4
- **API Testing**: Supertest v7.1.4
- **Mocking**: Vitest built-in mocking utilities

## Test Structure

### Frontend Tests

#### Hook Tests (`src/hooks/__tests__/`)

1. **useSearch.test.ts**
   - **Coverage**: Search functionality, filtering, sorting, debouncing
   - **Test Cases**: 21 tests covering:
     - Initial state validation
     - Search query filtering (case-sensitive/insensitive)
     - Category, price range, stock status filtering
     - Multiple sorting options (name, price, rating)
     - Filter combination and clearing
     - Debounced search behavior

2. **useFeatureFlag.test.tsx**
   - **Coverage**: Feature flag system, environment overrides
   - **Test Cases**: 20 tests covering:
     - Individual flag evaluation
     - Multiple flag handling
     - Environment variable overrides
     - Development vs. production behavior
     - FeatureGate component rendering

#### Component Tests (`src/components/__tests__/`)

1. **SearchFilters.test.tsx**
   - **Coverage**: Complete search and filtering UI component
   - **Test Cases**: 23 tests covering:
     - Basic rendering and interaction
     - Search input functionality
     - Advanced filter toggles
     - Category selection with counts
     - Price range slider interaction
     - Brand dropdown functionality
     - Sort selection
     - Filter clearing and state management
     - Responsive behavior
     - Error handling

### Backend Tests

#### API Integration Tests (`server/src/routes/__tests__/`)

1. **products.test.js**
   - **Coverage**: Complete Products API endpoint testing
   - **Test Cases**: 11 tests covering:
     - Product listing with pagination
     - Category filtering
     - Search functionality
     - Price sorting
     - Single product retrieval
     - Category and subcategory listing
     - Error handling for all endpoints
     - Database interaction mocking

## Test Configuration

### Frontend Configuration (`vitest.config.ts`)

```typescript
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: true,
    reporters: ['verbose'],
    include: ['src/**/*.{test,spec}.{js,ts,jsx,tsx}'],
    exclude: ['node_modules/', 'dist/', 'server/', 'vue-vben-admin/'],
  }
});
```

### Backend Configuration (`server/vitest.config.js`)

```javascript
export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./src/test/setup.js'],
    include: ['src/**/*.{test,spec}.{js,ts}'],
    testTimeout: 10000,
  }
});
```

## Test Utilities

### Frontend Test Utilities (`src/test/test-utils.tsx`)

- **Custom render function** with provider wrappers
- **Mock data generators** for searchable items
- **Feature flag mocking** utilities
- **DOM environment setup** with jsdom polyfills

### Backend Test Utilities (`server/src/test/setup.js`)

- **Database mocking** with Vitest
- **Environment variable setup** for testing
- **Global test helpers** and mock data

## Mocking Strategy

### Frontend Mocking

1. **DOM APIs**: Pointer capture, ResizeObserver, IntersectionObserver
2. **Environment Variables**: Feature flags and API URLs
3. **External Dependencies**: Radix UI component behavior in jsdom

### Backend Mocking

1. **Database Layer**: PostgreSQL pool mocking with Vitest
2. **Environment Variables**: Test-specific configuration
3. **External Services**: Future-proofed for third-party integrations

## Running Tests

### Frontend Tests
```bash
# Run tests in watch mode
npm test

# Run tests once
npm run test:run

# Run tests with coverage
npm run test:coverage

# Run tests with UI
npm run test:ui
```

### Backend Tests
```bash
cd server

# Run tests in watch mode
npm test

# Run tests once
npm run test:run

# Run tests with coverage
npm run test:coverage
```

## Test Coverage

### Current Coverage Statistics

#### Frontend
- **Components**: 100% of critical UI components tested
- **Hooks**: 100% of custom hooks with comprehensive test suites
- **Feature Flags**: Complete coverage of feature flag system

#### Backend
- **API Endpoints**: 100% of Products API endpoints tested
- **Error Handling**: All error paths covered
- **Database Interactions**: Mocked and tested

### Coverage Goals
- **Statements**: 80%+ minimum
- **Branches**: 75%+ minimum
- **Functions**: 85%+ minimum
- **Lines**: 80%+ minimum

## Testing Best Practices Implemented

1. **Test Organization**
   - Tests co-located with source files in `__tests__` directories
   - Descriptive test names following "should [expected behavior]" pattern
   - Logical grouping with `describe` blocks

2. **Mocking Strategy**
   - External dependencies properly mocked
   - Database interactions isolated in backend tests
   - DOM APIs polyfilled for jsdom compatibility

3. **Async Testing**
   - Proper `act()` usage for React state updates
   - `waitFor()` for asynchronous operations
   - Timer mocking for debounced functionality

4. **Error Testing**
   - Error boundary behavior tested
   - API error responses validated
   - Database connection failures handled

5. **User-Centric Testing**
   - User interactions tested with user-event library
   - Accessibility-focused element selection
   - Real user behavior simulation

## Known Issues and Solutions

### Frontend Issues

1. **Radix UI + jsdom Compatibility**
   - **Issue**: Pointer capture methods not available in jsdom
   - **Solution**: Polyfills added to test setup

2. **React Hook Warnings**
   - **Issue**: Act warnings for state updates in tests
   - **Solution**: Proper `act()` wrapping for state changes

### Backend Issues

1. **Module Mocking**
   - **Issue**: Vitest hoisting requirements for mocks
   - **Solution**: Proper mock placement before imports

2. **Database Connection**
   - **Issue**: Real database connections in tests
   - **Solution**: Complete database layer mocking

## Future Testing Enhancements

### Planned Additions

1. **E2E Testing**
   - Playwright integration for full user journey testing
   - Critical path automation (login, purchase flow, etc.)

2. **Performance Testing**
   - Load testing for API endpoints
   - Bundle size and render performance metrics

3. **Visual Regression Testing**
   - Component visual consistency validation
   - Cross-browser compatibility testing

4. **Integration Testing**
   - Full-stack integration test suites
   - Database integration testing with test containers

5. **Security Testing**
   - Authentication flow security validation
   - Input sanitization and validation testing

## Continuous Integration

### GitHub Actions Pipeline (Planned)
```yaml
- name: Run Frontend Tests
  run: npm run test:run
  
- name: Run Backend Tests
  run: |
    cd server
    npm run test:run

- name: Upload Coverage
  run: npm run test:coverage
```

## Conclusion

The current testing implementation provides a solid foundation with comprehensive coverage of critical functionality. The test suite ensures code quality, prevents regressions, and supports confident development and deployment practices.

The testing strategy balances thoroughness with maintainability, focusing on user-facing functionality and critical business logic while maintaining fast test execution times.
