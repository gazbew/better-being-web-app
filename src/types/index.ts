// ==========================================
// SHARED TYPE DEFINITIONS
// ==========================================

// Base Entity
export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

// User Types
export interface User extends BaseEntity {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  profilePictureUrl?: string;
  isEmailVerified: boolean;
  preferences: UserPreferences;
  addresses: Address[];
}

export interface UserPreferences {
  newsletter: boolean;
  smsNotifications: boolean;
  marketingEmails: boolean;
  theme: 'light' | 'dark' | 'auto';
  language: string;
}

export interface Address extends BaseEntity {
  type: 'shipping' | 'billing';
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

// Authentication Types
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

// Product Types
export interface Product extends BaseEntity {
  name: string;
  description: string;
  shortDescription: string;
  price: number;
  originalPrice?: number;
  category: ProductCategory;
  subCategory?: string;
  tags: string[];
  images: ProductImage[];
  variants: ProductVariant[];
  specifications: ProductSpecification[];
  inventory: InventoryInfo;
  seo: SEOInfo;
  reviews: Review[];
  ratings: ProductRatings;
  isActive: boolean;
  isFeatured: boolean;
  nutritionalInfo?: NutritionalInfo;
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl?: string;
  parentCategoryId?: string;
}

export interface ProductImage {
  id: string;
  url: string;
  altText: string;
  isPrimary: boolean;
  order: number;
}

export interface ProductVariant {
  id: string;
  name: string;
  value: string;
  type: 'size' | 'color' | 'flavor' | 'strength';
  priceModifier: number;
  inventoryCount: number;
  sku: string;
}

export interface ProductSpecification {
  name: string;
  value: string;
  unit?: string;
}

export interface InventoryInfo {
  quantity: number;
  lowStockThreshold: number;
  isInStock: boolean;
  estimatedRestockDate?: string;
}

export interface SEOInfo {
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  slug: string;
}

export interface ProductRatings {
  average: number;
  totalReviews: number;
  distribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

export interface NutritionalInfo {
  servingSize: string;
  servingsPerContainer: number;
  calories?: number;
  nutrients: NutritionalValue[];
  allergens: string[];
  ingredients: string[];
}

export interface NutritionalValue {
  name: string;
  amount: number;
  unit: string;
  dailyValue?: number;
}

// Review Types
export interface Review extends BaseEntity {
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  title: string;
  content: string;
  isVerifiedPurchase: boolean;
  helpfulVotes: number;
  images?: string[];
  response?: ReviewResponse;
}

export interface ReviewResponse {
  content: string;
  authorName: string;
  createdAt: string;
}

// Cart Types
export interface CartItem {
  productId: string;
  variantId?: string;
  quantity: number;
  price: number;
  product: Pick<Product, 'id' | 'name' | 'images' | 'price'>;
  variant?: Pick<ProductVariant, 'id' | 'name' | 'value'>;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  totalQuantity: number;
}

export interface CartSummary {
  itemCount: number;
  totalQuantity: number;
  subtotal: number;
  total: number;
}

// Order Types
export interface Order extends BaseEntity {
  orderNumber: string;
  userId: string;
  status: OrderStatus;
  items: OrderItem[];
  shippingAddress: Address;
  billingAddress: Address;
  payment: PaymentInfo;
  shipping: ShippingInfo;
  pricing: OrderPricing;
  timeline: OrderTimeline[];
  notes?: string;
}

export type OrderStatus = 
  | 'pending' 
  | 'confirmed' 
  | 'processing' 
  | 'shipped' 
  | 'delivered' 
  | 'cancelled' 
  | 'refunded';

export interface OrderItem {
  productId: string;
  variantId?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  product: Pick<Product, 'id' | 'name' | 'images'>;
  variant?: Pick<ProductVariant, 'id' | 'name' | 'value'>;
}

export interface PaymentInfo {
  method: PaymentMethod;
  status: PaymentStatus;
  transactionId: string;
  amount: number;
  currency: string;
  gatewayResponse?: Record<string, unknown>;
}

export type PaymentMethod = 'card' | 'paypal' | 'bank_transfer' | 'crypto';
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';

export interface ShippingInfo {
  method: string;
  cost: number;
  estimatedDelivery: string;
  trackingNumber?: string;
  carrier?: string;
}

export interface OrderPricing {
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
}

export interface OrderTimeline {
  status: OrderStatus;
  timestamp: string;
  description: string;
  location?: string;
}

// Search & Filter Types
export interface SearchFilters {
  query?: string;
  category?: string[];
  priceRange?: {
    min: number;
    max: number;
  };
  rating?: number;
  inStock?: boolean;
  tags?: string[];
  sortBy?: SortOption;
  page?: number;
  limit?: number;
}

export type SortOption = 
  | 'relevance' 
  | 'price_asc' 
  | 'price_desc' 
  | 'rating_desc' 
  | 'newest' 
  | 'popular';

export interface SearchResult<T> {
  items: T[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// API Response Types
export interface APIResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> extends APIResponse<T[]> {
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

// Form Types
export interface FormField<T = string> {
  value: T;
  error?: string;
  touched: boolean;
  isValid: boolean;
}

export interface FormState<T> {
  fields: Record<keyof T, FormField>;
  isValid: boolean;
  isSubmitting: boolean;
  submitError?: string;
}

// Notification Types
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// Analytics Types
export interface AnalyticsEvent {
  name: string;
  properties: Record<string, unknown>;
  timestamp: string;
  userId?: string;
  sessionId: string;
}

// Feature Flag Types
export interface FeatureFlag {
  key: string;
  name: string;
  description: string;
  isEnabled: boolean;
  rolloutPercentage: number;
  conditions?: FeatureFlagCondition[];
}

export interface FeatureFlagCondition {
  type: 'user_attribute' | 'segment' | 'random';
  operator: 'equals' | 'contains' | 'greater_than' | 'less_than';
  value: unknown;
}

// Error Types
export interface AppError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  timestamp: string;
  userId?: string;
  path?: string;
}

// Theme Types
export interface Theme {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    foreground: string;
    muted: string;
    border: string;
    error: string;
    warning: string;
    success: string;
    info: string;
  };
  typography: {
    fontFamily: {
      sans: string;
      serif: string;
      mono: string;
    };
    fontSize: Record<string, string>;
    fontWeight: Record<string, number>;
  };
  spacing: Record<string, string>;
  borderRadius: Record<string, string>;
  shadows: Record<string, string>;
}

// Component Prop Types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface LoadingState {
  isLoading: boolean;
  loadingText?: string;
}

export interface ErrorState {
  hasError: boolean;
  error?: Error | string;
  retry?: () => void;
}

// Utility Types
export type Nullable<T> = T | null;
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

// Navigation Types
export interface NavigationItem {
  label: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  children?: NavigationItem[];
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
  isActive?: boolean;
}

// ==========================================
// MINIMAX API TYPE DEFINITIONS
// ==========================================

// MiniMax Message Types
export interface MiniMaxMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

// MiniMax Model Types
export type MiniMaxModel = 'MiniMax-M1' | 'MiniMax-Text-01';

// MiniMax Function/Tool Types
export interface MiniMaxFunctionParameter {
  type: string;
  description?: string;
  properties?: Record<string, MiniMaxFunctionParameter>;
  required?: string[];
  items?: MiniMaxFunctionParameter;
}

export interface MiniMaxFunction {
  name: string;
  description: string;
  parameters: MiniMaxFunctionParameter;
}

export interface MiniMaxTool {
  type: 'function';
  function: MiniMaxFunction;
}

// MiniMax Response Format Types
export interface MiniMaxResponseFormat {
  type: 'json_schema';
  json_schema: Record<string, unknown>;
}

// MiniMax Chat Completion Request
export interface MiniMaxChatCompletionRequest {
  model: MiniMaxModel;
  messages: MiniMaxMessage[];
  stream?: boolean;
  max_tokens?: number;
  temperature?: number;
  top_p?: number;
  mask_sensitive_info?: boolean;
  tools?: MiniMaxTool[];
  tool_choice?: 'auto' | 'none' | { type: 'function'; function: { name: string } };
  response_format?: MiniMaxResponseFormat;
}

// MiniMax Chat Completion Response
export interface MiniMaxUsage {
  total_tokens: number;
  prompt_tokens?: number;
  completion_tokens?: number;
}

export interface MiniMaxChoice {
  index: number;
  message?: MiniMaxMessage;
  delta?: MiniMaxMessage;
  finish_reason: 'stop' | 'length' | 'tool_calls' | 'content_filter' | null;
}

export interface MiniMaxChatCompletionResponse {
  id: string;
  choices: MiniMaxChoice[];
  created: number;
  model: string;
  object: 'chat.completion' | 'chat.completion.chunk';
  usage: MiniMaxUsage;
}

// MiniMax Chat Completion Stream Chunk
export interface MiniMaxChatCompletionChunk {
  id: string;
  choices: Array<{
    index: number;
    delta: MiniMaxMessage;
    finish_reason: 'stop' | 'length' | 'tool_calls' | 'content_filter' | null;
  }>;
  created: number;
  model: string;
  object: 'chat.completion.chunk';
  usage?: MiniMaxUsage;
}