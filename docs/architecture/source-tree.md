# Source Tree Structure - Better Being Ecosystem

## Project Root Structure

```
BetterBeingWEB/
├── .bmad-core/                  # BMad framework configuration
│   ├── agents/                  # AI agent configurations
│   ├── agent-teams/             # Team composition configs  
│   ├── checklists/              # Quality assurance checklists
│   ├── data/                    # Knowledge base and techniques
│   ├── tasks/                   # BMad task definitions
│   ├── templates/               # Document templates
│   ├── utils/                   # BMad utilities
│   ├── workflows/               # Development workflows
│   └── core-config.yaml         # Main BMad configuration
├── .ai/                         # AI development tools
│   └── debug-log.md            # Development debug log
├── docs/                        # Project documentation
│   ├── prd.md                  # Main Product Requirements Document
│   ├── architecture.md         # Main Technical Architecture Document
│   ├── prd/                    # Sharded PRD documents
│   ├── architecture/           # Sharded architecture documents
│   │   ├── tech-stack.md       # Technology stack details
│   │   ├── coding-standards.md # Development standards
│   │   └── source-tree.md      # This file
│   └── stories/                # User stories and epics
├── src/                        # Frontend React application
│   ├── components/             # React components
│   ├── pages/                  # Page components
│   ├── hooks/                  # Custom React hooks
│   ├── services/               # API service layer
│   ├── styles/                 # Styling and CSS files
│   ├── contexts/               # React context providers
│   ├── lib/                    # Utility libraries
│   ├── types/                  # TypeScript type definitions
│   └── test/                   # Testing utilities and setup
├── server/                     # Backend Node.js application
│   ├── src/                    # Server source code
│   │   ├── routes/             # API route handlers
│   │   ├── middleware/         # Express middleware
│   │   ├── models/             # Data models
│   │   ├── controllers/        # Route controllers
│   │   └── config/             # Server configuration
│   └── test/                   # Backend tests
├── mobile/                     # Mobile application (if separate)
├── public/                     # Static assets
├── node_modules/               # Dependencies (ignored in git)
└── config files...             # Various configuration files
```

## Frontend Source Structure (`src/`)

### Component Organization
```
src/components/
├── ui/                         # Base UI components (shadcn/ui)
│   ├── button.tsx
│   ├── input.tsx
│   ├── card.tsx
│   ├── modal.tsx
│   └── ...                     # Other UI primitives
├── forms/                      # Form components
│   ├── LoginForm.tsx
│   ├── RegisterForm.tsx
│   ├── CheckoutForm.tsx
│   └── ContactForm.tsx
├── navigation/                 # Navigation components
│   ├── Header.tsx
│   ├── Navigation.tsx
│   ├── Breadcrumbs.tsx
│   ├── Footer.tsx
│   └── MobileNav.tsx
├── product/                    # Product-related components
│   ├── ProductCard.tsx
│   ├── ProductGrid.tsx
│   ├── ProductDetail.tsx
│   ├── ProductReviews.tsx
│   └── ProductFilters.tsx
├── cart/                       # Shopping cart components
│   ├── CartIcon.tsx
│   ├── CartSidebar.tsx
│   ├── CartItem.tsx
│   └── CartSummary.tsx
├── user/                       # User-related components
│   ├── UserProfile.tsx
│   ├── UserOrders.tsx
│   ├── UserSettings.tsx
│   └── UserDashboard.tsx
├── layout/                     # Layout components
│   ├── MainLayout.tsx
│   ├── AuthLayout.tsx
│   ├── DashboardLayout.tsx
│   └── ErrorBoundary.tsx
└── common/                     # Shared/common components
    ├── LoadingSpinner.tsx
    ├── ErrorMessage.tsx
    ├── SearchBar.tsx
    ├── Pagination.tsx
    └── OptimizedImage.tsx
```

### Pages Structure
```
src/pages/
├── HomePage.tsx                # Landing/home page
├── ProductsPage.tsx            # Product catalog page
├── ProductDetailPage.tsx       # Individual product page
├── CartPage.tsx                # Shopping cart page
├── CheckoutPage.tsx            # Checkout process
├── OrderConfirmationPage.tsx   # Post-purchase confirmation
├── AccountDashboard.tsx        # User account dashboard
├── LoginPage.tsx               # User authentication
├── RegisterPage.tsx            # User registration
├── AboutPage.tsx               # About us page
├── ContactPage.tsx             # Contact page
├── BlogPage.tsx                # Blog/content page
├── NotFoundPage.tsx            # 404 error page
└── wellness/                   # Wellness content pages
    ├── WellnessPage.tsx
    ├── NutritionPage.tsx
    ├── MindfulnessPage.tsx
    └── SleepPage.tsx
```

### Hooks Structure
```
src/hooks/
├── auth/                       # Authentication hooks
│   ├── useAuth.ts
│   ├── useLogin.ts
│   ├── useRegister.ts
│   └── useLogout.ts
├── api/                        # API-related hooks
│   ├── useProducts.ts
│   ├── useProduct.ts
│   ├── useCart.ts
│   ├── useOrders.ts
│   └── useUser.ts
├── ui/                         # UI-related hooks
│   ├── useModal.ts
│   ├── usePagination.ts
│   ├── useDebounce.ts
│   ├── useLocalStorage.ts
│   └── useScrollToTop.ts
└── business/                   # Business logic hooks
    ├── useCheckout.ts
    ├── useWishlist.ts
    ├── useSearch.ts
    └── useRecommendations.ts
```

### Services Structure
```
src/services/
├── api/                        # API service layer
│   ├── client.ts              # HTTP client configuration
│   ├── auth.service.ts        # Authentication services
│   ├── products.service.ts    # Product services
│   ├── cart.service.ts        # Cart services
│   ├── orders.service.ts      # Order services
│   ├── users.service.ts       # User services
│   └── content.service.ts     # Content services
├── storage/                    # Storage services
│   ├── localStorage.service.ts
│   ├── sessionStorage.service.ts
│   └── indexedDB.service.ts
├── analytics/                  # Analytics services
│   ├── gtag.service.ts
│   ├── mixpanel.service.ts
│   └── segment.service.ts
└── utils/                      # Service utilities
    ├── errorHandler.ts
    ├── responseHandler.ts
    └── apiConfig.ts
```

### Types Structure
```
src/types/
├── api/                        # API-related types
│   ├── auth.types.ts
│   ├── products.types.ts
│   ├── cart.types.ts
│   ├── orders.types.ts
│   └── users.types.ts
├── ui/                         # UI component types
│   ├── component.types.ts
│   ├── form.types.ts
│   └── layout.types.ts
├── business/                   # Business domain types
│   ├── ecommerce.types.ts
│   ├── wellness.types.ts
│   └── analytics.types.ts
└── common/                     # Common/shared types
    ├── index.ts
    ├── globals.d.ts
    └── environment.d.ts
```

## Backend Source Structure (`server/src/`)

### API Routes Structure
```
server/src/routes/
├── auth/                       # Authentication routes
│   ├── login.route.ts
│   ├── register.route.ts
│   ├── refresh.route.ts
│   └── index.ts
├── users/                      # User management routes
│   ├── profile.route.ts
│   ├── preferences.route.ts
│   ├── orders.route.ts
│   └── index.ts
├── products/                   # Product routes
│   ├── catalog.route.ts
│   ├── search.route.ts
│   ├── reviews.route.ts
│   └── index.ts
├── cart/                       # Shopping cart routes
│   ├── items.route.ts
│   ├── session.route.ts
│   └── index.ts
├── orders/                     # Order management routes
│   ├── create.route.ts
│   ├── status.route.ts
│   ├── history.route.ts
│   └── index.ts
├── payments/                   # Payment processing routes
│   ├── payfast.route.ts
│   ├── zapper.route.ts
│   ├── webhooks.route.ts
│   └── index.ts
└── content/                    # Content management routes
    ├── articles.route.ts
    ├── pages.route.ts
    └── index.ts
```

### Controllers Structure
```
server/src/controllers/
├── AuthController.ts           # Authentication logic
├── UserController.ts           # User management logic
├── ProductController.ts        # Product management logic
├── CartController.ts           # Cart management logic
├── OrderController.ts          # Order processing logic
├── PaymentController.ts        # Payment processing logic
└── ContentController.ts        # Content management logic
```

### Models Structure
```
server/src/models/
├── User.model.ts              # User data model
├── Product.model.ts           # Product data model
├── Cart.model.ts              # Cart data model
├── Order.model.ts             # Order data model
├── Payment.model.ts           # Payment data model
├── Review.model.ts            # Review data model
└── Content.model.ts           # Content data model
```

### Middleware Structure
```
server/src/middleware/
├── auth.middleware.ts          # Authentication middleware
├── validation.middleware.ts    # Request validation
├── cors.middleware.ts          # CORS configuration
├── rate-limit.middleware.ts    # Rate limiting
├── error.middleware.ts         # Error handling
├── logging.middleware.ts       # Request logging
└── security.middleware.ts      # Security headers
```

### Configuration Structure
```
server/src/config/
├── database.config.ts          # Database configuration
├── auth.config.ts              # Authentication configuration
├── payment.config.ts           # Payment gateway configuration
├── email.config.ts             # Email service configuration
├── analytics.config.ts         # Analytics configuration
└── app.config.ts               # Application configuration
```

## Mobile Application Structure (`mobile/`)

### React Native Structure
```
mobile/
├── src/
│   ├── components/             # React Native components
│   │   ├── ui/                # Base UI components
│   │   ├── forms/             # Form components
│   │   ├── navigation/        # Navigation components
│   │   └── screens/           # Screen-specific components
│   ├── screens/               # Screen components
│   │   ├── auth/             # Authentication screens
│   │   ├── products/         # Product screens
│   │   ├── cart/             # Cart screens
│   │   ├── profile/          # User profile screens
│   │   └── wellness/         # Wellness content screens
│   ├── navigation/            # Navigation configuration
│   │   ├── AppNavigator.tsx
│   │   ├── AuthNavigator.tsx
│   │   └── TabNavigator.tsx
│   ├── services/              # API services
│   ├── hooks/                 # Custom hooks
│   ├── store/                 # State management
│   ├── utils/                 # Utilities
│   └── types/                 # TypeScript types
├── assets/                    # Static assets
│   ├── images/
│   ├── fonts/
│   └── icons/
├── android/                   # Android-specific code
├── ios/                       # iOS-specific code
└── package.json
```

## Static Assets Structure (`public/`)

```
public/
├── images/                     # Image assets
│   ├── products/              # Product images
│   ├── brand/                 # Brand assets
│   ├── icons/                 # Icon files
│   └── backgrounds/           # Background images
├── fonts/                     # Custom fonts
├── docs/                      # Static documents
├── favicon.ico                # Site favicon
├── manifest.json              # Web app manifest
├── robots.txt                 # SEO robots file
└── sitemap.xml               # SEO sitemap
```

## Configuration Files

### Root Level Configurations
```
BetterBeingWEB/
├── package.json               # Node.js dependencies and scripts
├── tsconfig.json             # TypeScript configuration
├── tsconfig.app.json         # App-specific TypeScript config
├── tsconfig.node.json        # Node-specific TypeScript config
├── vite.config.ts            # Vite build configuration
├── vitest.config.ts          # Vitest testing configuration
├── tailwind.config.ts        # Tailwind CSS configuration
├── postcss.config.js         # PostCSS configuration
├── eslint.config.js          # ESLint configuration
├── .gitignore                # Git ignore rules
├── .env                      # Environment variables (local)
├── .env.example              # Environment variables template
├── README.md                 # Project documentation
├── CHANGELOG.md              # Version history
└── LICENSE                   # Project license
```

## Development Workflow Files

### BMad Framework Files
```
.bmad-core/
├── core-config.yaml          # Main BMad configuration
├── install-manifest.yaml    # Installation tracking
├── user-guide.md            # BMad usage guide
├── working-in-the-brownfield.md # Brownfield development guide
├── agents/                  # AI agent configurations
├── agent-teams/            # Team composition configs
├── checklists/             # QA and development checklists
├── data/                   # Knowledge base and techniques
├── tasks/                  # BMad task definitions
├── templates/              # Document and code templates
├── utils/                  # BMad utility functions
└── workflows/              # Development workflow definitions
```

### Documentation Structure
```
docs/
├── prd.md                    # Main Product Requirements Document
├── architecture.md          # Main Technical Architecture Document
├── prd/                     # Detailed PRD sections
│   ├── functional-requirements.md
│   ├── user-stories.md
│   ├── acceptance-criteria.md
│   └── business-rules.md
├── architecture/            # Detailed architecture sections
│   ├── tech-stack.md       # Technology stack details
│   ├── coding-standards.md # Development standards
│   ├── source-tree.md      # This file
│   ├── api-design.md       # API design specifications
│   ├── database-schema.md  # Database design
│   └── security-model.md   # Security architecture
└── stories/                # User stories and epics
    ├── epic-001-auth.md
    ├── epic-002-ecommerce.md
    ├── epic-003-content.md
    └── epic-004-mobile.md
```

## Build and Deployment Structure

### Build Artifacts
```
dist/                          # Production build output (ignored in git)
├── assets/                   # Bundled assets
├── index.html               # Main HTML file
└── ...                      # Other build files

build/                        # Alternative build directory
node_modules/                 # Dependencies (ignored in git)
.next/                       # Next.js build cache (if using Next.js)
.vercel/                     # Vercel deployment cache
```

### Environment Configuration
```
environments/
├── .env.development         # Development environment variables
├── .env.staging            # Staging environment variables
├── .env.production         # Production environment variables
└── .env.example           # Environment variables template
```

## Testing Structure

### Frontend Tests
```
src/test/
├── setup.ts                 # Testing setup and configuration
├── utils.ts                # Testing utilities
├── mocks/                  # Mock implementations
│   ├── api.mock.ts
│   ├── localStorage.mock.ts
│   └── router.mock.ts
└── __tests__/              # Global test files
    ├── App.test.tsx
    └── utils.test.ts

src/components/__tests__/    # Component tests (co-located)
src/hooks/__tests__/         # Hook tests (co-located)
src/services/__tests__/      # Service tests (co-located)
```

### Backend Tests
```
server/test/
├── setup.ts                # Testing setup
├── helpers/                # Test helpers
├── fixtures/               # Test data fixtures
├── integration/            # Integration tests
├── unit/                   # Unit tests
└── e2e/                    # End-to-end tests
```

## File Naming Conventions

### Component Files
- React components: `PascalCase.tsx` (e.g., `ProductCard.tsx`)
- Component tests: `PascalCase.test.tsx` (e.g., `ProductCard.test.tsx`)
- Component stories: `PascalCase.stories.tsx` (e.g., `ProductCard.stories.tsx`)

### Non-Component Files
- Hooks: `camelCase.ts` with `use` prefix (e.g., `useAuth.ts`)
- Services: `camelCase.service.ts` (e.g., `api.service.ts`)
- Types: `camelCase.types.ts` (e.g., `user.types.ts`)
- Utilities: `camelCase.ts` (e.g., `helpers.ts`)
- Constants: `SCREAMING_SNAKE_CASE.ts` (e.g., `API_ENDPOINTS.ts`)

### Backend Files
- Routes: `camelCase.route.ts` (e.g., `users.route.ts`)
- Controllers: `PascalCase.controller.ts` (e.g., `UserController.ts`)
- Models: `PascalCase.model.ts` (e.g., `User.model.ts`)
- Middleware: `camelCase.middleware.ts` (e.g., `auth.middleware.ts`)

This source tree structure provides a clear, scalable organization for the Better Being ecosystem codebase, supporting both current development needs and future growth.