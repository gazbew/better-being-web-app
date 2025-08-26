import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import DefaultLayout from "./layouts/DefaultLayout";
import { CartProvider } from "./contexts/CartContext";
import { AuthProvider } from "./contexts/AuthContext";
import { Suspense, lazy } from "react";
import { Skeleton } from "./components/ui/skeleton";

// Lazy load pages for better performance

const BetterBeingHome = lazy(() => import("./pages/BetterBeingHome"));
const NotFound = lazy(() => import("./pages/NotFound"));
const DesignValidation = lazy(() => import("./pages/DesignValidation"));
const HeroDemo = lazy(() => import("./components/examples/HeroSectionDemo"));
const HeroRevolutionaryDemo = lazy(() => import("./components/examples/HeroSectionRevolutionaryDemo"));
const Products = lazy(() => import("./pages/Products"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const Shop = lazy(() => import("./pages/Shop"));
const Account = lazy(() => import("./pages/Account"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const Profile = lazy(() => import("./pages/Profile"));
// Additional pages
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Wellness = lazy(() => import("./pages/Wellness"));
const Blog = lazy(() => import("./pages/Blog"));
const Nutrition = lazy(() => import("./pages/Nutrition"));
const Mindfulness = lazy(() => import("./pages/Mindfulness"));
const Sleep = lazy(() => import("./pages/Sleep"));
// Enterprise pages
const Checkout = lazy(() => import("./pages/Checkout"));
const OrderConfirmation = lazy(() => import("./pages/OrderConfirmation"));
// Additional utility pages
const Terms = lazy(() => import("./pages/Terms"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Cart = lazy(() => import("./pages/Cart"));
const Wishlist = lazy(() => import("./pages/Wishlist"));
const Shipping = lazy(() => import("./pages/Shipping"));
const Brands = lazy(() => import("./pages/Brands"));
const Deals = lazy(() => import("./pages/Deals"));
// New pages from Our Grounds scraping
const BecomeStockist = lazy(() => import("./pages/BecomeStockist"));
const Marketing = lazy(() => import("./pages/Marketing"));
const Tech = lazy(() => import("./pages/Tech"));
const InvestorsPool = lazy(() => import("./pages/InvestorsPool"));
const Testimonials = lazy(() => import("./pages/Testimonials"));
const StoreLocator = lazy(() => import("./pages/StoreLocator"));
const RefundPolicy = lazy(() => import("./pages/RefundPolicy"));
const Farming = lazy(() => import("./pages/Farming"));
const Community = lazy(() => import("./pages/Community"));
import EnterpriseNavigation from "@/components/navbar/EnterpriseNavigation";

// Loading component for Suspense
const PageLoader = () => (
  <div className="flex flex-col space-y-3 p-8">
    <Skeleton className="h-[125px] w-full rounded-xl" />
    <div className="space-y-2">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-[80%]" />
    </div>
  </div>
);

const queryClient = new QueryClient();

// Debug: Log when App module is evaluated
console.log("[DEBUG] App.tsx: module evaluated");

const App = () => {
  console.log("[DEBUG] App.tsx: App render start");
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route element={<DefaultLayout />}>
                  <Route path="/" element={<BetterBeingHome />} />
                  <Route path="/better-being" element={<BetterBeingHome />} />
                  <Route path="/hero-demo" element={<HeroDemo />} />
                  <Route path="/hero-revolutionary" element={<HeroRevolutionaryDemo />} />
                  <Route path="/design-validation" element={<DesignValidation />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/shop" element={<Shop />} />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route path="/account" element={<Account />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/wellness" element={<Wellness />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/nutrition" element={<Nutrition />} />
                  <Route path="/mindfulness" element={<Mindfulness />} />
                  <Route path="/sleep" element={<Sleep />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="/privacy" element={<Privacy />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/wishlist" element={<Wishlist />} />
                  <Route path="/shipping" element={<Shipping />} />
                  <Route path="/brands" element={<Brands />} />
                  <Route path="/deals" element={<Deals />} />
                  <Route path="/become-stockist" element={<BecomeStockist />} />
                  <Route path="/marketing" element={<Marketing />} />
                  <Route path="/tech" element={<Tech />} />
                  <Route path="/investors-pool" element={<InvestorsPool />} />
                  <Route path="/testimonials" element={<Testimonials />} />
                  <Route path="/store-locator" element={<StoreLocator />} />
                  <Route path="/refund-policy" element={<RefundPolicy />} />
                  <Route path="/farming" element={<Farming />} />
                  <Route path="/community" element={<Community />} />
                  <Route path="*" element={<NotFound />} />
                </Route>
              </Routes>
            </Suspense>
          </TooltipProvider>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
