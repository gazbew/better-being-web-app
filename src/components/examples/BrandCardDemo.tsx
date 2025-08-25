import React from 'react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter,
  CardImage,
  CardBadge,
  CardPrice
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// Demo icons
const StarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
  </svg>
);

const HeartIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z"/>
  </svg>
);

const ShoppingCartIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l1.313 7h8.17l1.313-7H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
  </svg>
);

/**
 * Brand Card Demo Component
 * 
 * Showcases all Better Being Card component variants and features
 * following Brand Bible BB-4 specifications.
 */
export const BrandCardDemo: React.FC = () => {
  return (
    <div className="bb-container py-bb-section-md">
      <div className="space-y-bb-12">
        {/* Header */}
        <div className="text-center">
          <h1 className="bb-h1 text-bb-primary mb-bb-4">
            Better Being Card Components
          </h1>
          <p className="bb-body-lg text-bb-secondary max-w-2xl mx-auto">
            Comprehensive showcase of brand-compliant card components with multiple variants,
            interactive states, and specialized components for different use cases.
          </p>
        </div>

        {/* Card Variants */}
        <section className="space-y-bb-8">
          <h2 className="bb-h2 text-bb-primary">Card Variants</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-bb-6">
            {/* Standard Card */}
            <Card variant="standard">
              <CardHeader>
                <CardTitle>Standard Card</CardTitle>
                <CardDescription>
                  Clean white background with subtle shadow. Perfect for general content and information display.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="bb-body-md text-bb-secondary">
                  This is the default card variant with a clean, professional appearance that works well 
                  for most content types including articles, features, and general information.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="secondary" size="sm">Learn More</Button>
              </CardFooter>
            </Card>

            {/* Premium Card */}
            <Card variant="premium">
              <CardHeader>
                <CardBadge variant="premium">Premium</CardBadge>
                <CardTitle>Premium Card</CardTitle>
                <CardDescription>
                  Champagne background with orange accent bar. Designed for premium content and featured items.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="bb-body-md text-bb-secondary">
                  The premium variant features our signature champagne background with an orange accent bar 
                  at the top, perfect for highlighting special offers or premium content.
                </p>
              </CardContent>
              <CardFooter>
                <Button size="sm">Get Premium</Button>
              </CardFooter>
            </Card>

            {/* Product Card */}
            <Card variant="product" interactive hoverable>
              <CardImage 
                src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop"
                alt="Natural Wellness Product"
                aspectRatio="landscape"
              />
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle>Natural Wellness Blend</CardTitle>
                  <Button variant="ghost" size="icon-sm" aria-label="Add to wishlist">
                    <HeartIcon />
                  </Button>
                </div>
                <CardDescription>
                  Premium organic blend for daily wellness support
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-bb-2 mb-bb-3">
                  <div className="flex items-center gap-bb-1">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon key={i} />
                    ))}
                  </div>
                  <span className="bb-body-sm text-bb-tertiary">(127 reviews)</span>
                </div>
                <CardPrice price="49.99" originalPrice="69.99" />
              </CardContent>
              <CardFooter>
                <Button icon={<ShoppingCartIcon />} fullWidth>
                  Add to Cart
                </Button>
              </CardFooter>
            </Card>

            {/* Testimonial Card */}
            <Card variant="testimonial">
              <CardContent className="pt-bb-8">
                <p className="bb-body-lg text-bb-secondary italic leading-bb-relaxed mb-bb-4">
                  Better Being has completely transformed my wellness journey. The natural products 
                  and personalized approach have made all the difference in my daily routine.
                </p>
                <div className="flex items-center gap-bb-3">
                  <div className="w-12 h-12 rounded-full bg-bb-orange-100 flex items-center justify-center">
                    <span className="font-bb-secondary font-bb-semibold text-bb-orange">SJ</span>
                  </div>
                  <div>
                    <p className="font-bb-secondary font-bb-semibold text-bb-primary">Sarah Johnson</p>
                    <p className="bb-body-sm text-bb-tertiary">Wellness Enthusiast</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Card Sizes and Padding */}
        <section className="space-y-bb-8">
          <h2 className="bb-h2 text-bb-primary">Card Sizes & Padding</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-bb-6">
            <Card variant="standard" padding="sm">
              <CardHeader>
                <CardTitle>Small Padding</CardTitle>
                <CardDescription>Compact card with minimal spacing</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="bb-body-sm text-bb-secondary">Perfect for dense layouts</p>
              </CardContent>
            </Card>

            <Card variant="standard" padding="md">
              <CardHeader>
                <CardTitle>Medium Padding</CardTitle>
                <CardDescription>Default comfortable spacing</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="bb-body-sm text-bb-secondary">Balanced spacing for most use cases</p>
              </CardContent>
            </Card>

            <Card variant="standard" padding="lg">
              <CardHeader>
                <CardTitle>Large Padding</CardTitle>
                <CardDescription>Generous spacing for emphasis</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="bb-body-sm text-bb-secondary">More breathing room</p>
              </CardContent>
            </Card>

            <Card variant="standard" padding="xl">
              <CardHeader>
                <CardTitle>XL Padding</CardTitle>
                <CardDescription>Maximum spacing for hero cards</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="bb-body-sm text-bb-secondary">Spacious and prominent</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Shadow Variants */}
        <section className="space-y-bb-8">
          <h2 className="bb-h2 text-bb-primary">Shadow Variants</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-bb-6">
            <Card variant="standard" shadow="none">
              <CardHeader>
                <CardTitle>No Shadow</CardTitle>
                <CardDescription>Flat design without elevation</CardDescription>
              </CardHeader>
            </Card>

            <Card variant="standard" shadow="sm">
              <CardHeader>
                <CardTitle>Small Shadow</CardTitle>
                <CardDescription>Subtle elevation effect</CardDescription>
              </CardHeader>
            </Card>

            <Card variant="standard" shadow="md">
              <CardHeader>
                <CardTitle>Medium Shadow</CardTitle>
                <CardDescription>Moderate elevation</CardDescription>
              </CardHeader>
            </Card>

            <Card variant="standard" shadow="lg">
              <CardHeader>
                <CardTitle>Large Shadow</CardTitle>
                <CardDescription>Prominent floating effect</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>

        {/* Product Showcase */}
        <section className="space-y-bb-8">
          <h2 className="bb-h2 text-bb-primary">Product Showcase</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-bb-6">
            {/* Featured Product */}
            <Card variant="product" interactive>
              <div className="relative">
                <CardBadge 
                  variant="success" 
                  className="absolute top-bb-3 left-bb-3 z-10"
                >
                  Best Seller
                </CardBadge>
                <CardImage 
                  src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop"
                  alt="Organic Supplements"
                  aspectRatio="square"
                />
              </div>
              <CardHeader>
                <CardTitle>Organic Daily Vitamins</CardTitle>
                <CardDescription>Complete daily nutrition support</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-bb-2 mb-bb-3">
                  <div className="flex items-center gap-bb-1 text-bb-orange">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon key={i} />
                    ))}
                  </div>
                  <span className="bb-body-sm text-bb-tertiary">(89 reviews)</span>
                </div>
                <CardPrice price="34.99" />
              </CardContent>
              <CardFooter>
                <Button icon={<ShoppingCartIcon />} fullWidth>
                  Add to Cart
                </Button>
              </CardFooter>
            </Card>

            {/* Sale Product */}
            <Card variant="product" interactive>
              <div className="relative">
                <CardBadge 
                  variant="error" 
                  className="absolute top-bb-3 left-bb-3 z-10"
                >
                  Sale
                </CardBadge>
                <CardImage 
                  src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop"
                  alt="Herbal Tea Blend"
                  aspectRatio="square"
                />
              </div>
              <CardHeader>
                <CardTitle>Calming Herbal Tea</CardTitle>
                <CardDescription>Relaxing evening blend</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-bb-2 mb-bb-3">
                  <div className="flex items-center gap-bb-1 text-bb-orange">
                    {[...Array(4)].map((_, i) => (
                      <StarIcon key={i} />
                    ))}
                    <StarIcon className="text-bb-champagne-300" />
                  </div>
                  <span className="bb-body-sm text-bb-tertiary">(45 reviews)</span>
                </div>
                <CardPrice price="19.99" originalPrice="29.99" />
              </CardContent>
              <CardFooter>
                <Button icon={<ShoppingCartIcon />} fullWidth>
                  Add to Cart
                </Button>
              </CardFooter>
            </Card>

            {/* Premium Product */}
            <Card variant="premium" interactive>
              <div className="relative">
                <CardBadge 
                  variant="premium" 
                  className="absolute top-bb-3 left-bb-3 z-10"
                >
                  Premium
                </CardBadge>
                <CardImage 
                  src="https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=400&h=300&fit=crop"
                  alt="Premium Wellness Kit"
                  aspectRatio="square"
                />
              </div>
              <CardHeader>
                <CardTitle>Complete Wellness Kit</CardTitle>
                <CardDescription>Everything you need for optimal health</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-bb-2 mb-bb-3">
                  <div className="flex items-center gap-bb-1 text-bb-orange">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon key={i} />
                    ))}
                  </div>
                  <span className="bb-body-sm text-bb-tertiary">(203 reviews)</span>
                </div>
                <CardPrice price="149.99" />
              </CardContent>
              <CardFooter>
                <Button icon={<ShoppingCartIcon />} fullWidth>
                  Add to Cart
                </Button>
              </CardFooter>
            </Card>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="space-y-bb-8">
          <h2 className="bb-h2 text-bb-primary">Customer Testimonials</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-bb-6">
            <Card variant="testimonial">
              <CardContent className="pt-bb-8">
                <p className="bb-body-lg text-bb-secondary italic leading-bb-relaxed mb-bb-4">
                  The quality of Better Being products is unmatched. I've been using their supplements 
                  for over a year and have never felt better. Highly recommend to anyone serious about their health.
                </p>
                <div className="flex items-center gap-bb-3">
                  <div className="w-12 h-12 rounded-full bg-bb-green-100 flex items-center justify-center">
                    <span className="font-bb-secondary font-bb-semibold text-bb-green">MR</span>
                  </div>
                  <div>
                    <p className="font-bb-secondary font-bb-semibold text-bb-primary">Michael Rodriguez</p>
                    <p className="bb-body-sm text-bb-tertiary">Fitness Coach</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card variant="testimonial">
              <CardContent className="pt-bb-8">
                <p className="bb-body-lg text-bb-secondary italic leading-bb-relaxed mb-bb-4">
                  Better Being's personalized approach to wellness is exactly what I needed. 
                  The team really understands individual health goals and provides tailored solutions.
                </p>
                <div className="flex items-center gap-bb-3">
                  <div className="w-12 h-12 rounded-full bg-bb-orange-100 flex items-center justify-center">
                    <span className="font-bb-secondary font-bb-semibold text-bb-orange">AL</span>
                  </div>
                  <div>
                    <p className="font-bb-secondary font-bb-semibold text-bb-primary">Amanda Lee</p>
                    <p className="bb-body-sm text-bb-tertiary">Nutritionist</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Interactive Examples */}
        <section className="space-y-bb-8">
          <h2 className="bb-h2 text-bb-primary">Interactive Features</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-bb-8">
            {/* Clickable Card */}
            <Card 
              variant="standard" 
              interactive 
              hoverable
              onClick={() => alert('Card clicked!')}
              className="cursor-pointer"
            >
              <CardHeader>
                <CardTitle>Interactive Card</CardTitle>
                <CardDescription>
                  This entire card is clickable and includes proper focus states for accessibility.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="bb-body-md text-bb-secondary">
                  Click anywhere on this card to see the interaction. The card includes proper 
                  keyboard navigation and focus indicators.
                </p>
              </CardContent>
              <CardFooter>
                <span className="bb-body-sm text-bb-tertiary">Click to interact →</span>
              </CardFooter>
            </Card>

            {/* Hover Effects Demo */}
            <Card variant="product" hoverable>
              <CardHeader>
                <CardTitle>Hover Effects</CardTitle>
                <CardDescription>
                  Hover over this card to see the smooth animations and state changes.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="bb-body-md text-bb-secondary">
                  Product cards include subtle scale effects, shadow changes, and border color 
                  transitions on hover to provide visual feedback.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="secondary" size="sm">
                  Hover to see effects
                </Button>
              </CardFooter>
            </Card>
          </div>
        </section>

        {/* Usage Guidelines */}
        <section className="space-y-bb-8">
          <h2 className="bb-h2 text-bb-primary">Usage Guidelines</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-bb-8">
            <Card variant="standard" padding="lg">
              <CardHeader>
                <CardTitle className="text-bb-success">Best Practices</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-bb-2 bb-body-md text-bb-secondary">
                  <li className="flex items-start gap-bb-2">
                    <span className="text-bb-success mt-1">✓</span>
                    Use standard cards for general content
                  </li>
                  <li className="flex items-start gap-bb-2">
                    <span className="text-bb-success mt-1">✓</span>
                    Use premium cards for featured content
                  </li>
                  <li className="flex items-start gap-bb-2">
                    <span className="text-bb-success mt-1">✓</span>
                    Use product cards for e-commerce items
                  </li>
                  <li className="flex items-start gap-bb-2">
                    <span className="text-bb-success mt-1">✓</span>
                    Use testimonial cards for customer reviews
                  </li>
                  <li className="flex items-start gap-bb-2">
                    <span className="text-bb-success mt-1">✓</span>
                    Include proper alt text for images
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card variant="standard" padding="lg">
              <CardHeader>
                <CardTitle className="text-bb-error">Avoid These</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-bb-2 bb-body-md text-bb-secondary">
                  <li className="flex items-start gap-bb-2">
                    <span className="text-bb-error mt-1">✗</span>
                    Don't mix different card variants in the same grid
                  </li>
                  <li className="flex items-start gap-bb-2">
                    <span className="text-bb-error mt-1">✗</span>
                    Don't use premium cards for regular content
                  </li>
                  <li className="flex items-start gap-bb-2">
                    <span className="text-bb-error mt-1">✗</span>
                    Don't overcrowd cards with too much content
                  </li>
                  <li className="flex items-start gap-bb-2">
                    <span className="text-bb-error mt-1">✗</span>
                    Don't forget hover states for interactive cards
                  </li>
                  <li className="flex items-start gap-bb-2">
                    <span className="text-bb-error mt-1">✗</span>
                    Don't use cards without proper semantic structure
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
};

export default BrandCardDemo;