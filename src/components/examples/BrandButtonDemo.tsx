import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

// Demo icons
const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z"/>
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

const TrashIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
    <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
  </svg>
);

/**
 * Brand Button Demo Component
 * 
 * Showcases all Better Being Button component variants, sizes, and features
 * following Brand Bible BB-4 specifications.
 */
export const BrandButtonDemo: React.FC = () => {
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});

  const handleLoadingDemo = (buttonId: string) => {
    setLoadingStates(prev => ({ ...prev, [buttonId]: true }));
    setTimeout(() => {
      setLoadingStates(prev => ({ ...prev, [buttonId]: false }));
    }, 2000);
  };

  return (
    <div className="bb-container py-bb-section-md">
      <div className="space-y-bb-12">
        {/* Header */}
        <div className="text-center">
          <h1 className="bb-h1 text-bb-primary mb-bb-4">
            Better Being Button Components
          </h1>
          <p className="bb-body-lg text-bb-secondary max-w-2xl mx-auto">
            Comprehensive showcase of brand-compliant button components following 
            Better Being Brand Bible BB-4 specifications.
          </p>
        </div>

        {/* Button Variants */}
        <section className="space-y-bb-8">
          <h2 className="bb-h2 text-bb-primary">Button Variants</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-bb-6">
            <div className="space-y-bb-4">
              <h3 className="bb-h4 text-bb-secondary">Primary</h3>
              <div className="space-y-bb-3">
                <Button variant="primary">Shop Now</Button>
                <Button variant="primary" icon={<ShoppingCartIcon />}>
                  Add to Cart
                </Button>
                <Button 
                  variant="primary" 
                  icon={<PlusIcon />} 
                  iconPosition="right"
                >
                  Create Account
                </Button>
              </div>
            </div>

            <div className="space-y-bb-4">
              <h3 className="bb-h4 text-bb-secondary">Secondary</h3>
              <div className="space-y-bb-3">
                <Button variant="secondary">Learn More</Button>
                <Button variant="secondary" icon={<HeartIcon />}>
                  Add to Wishlist
                </Button>
                <Button variant="secondary" fullWidth>
                  Full Width Secondary
                </Button>
              </div>
            </div>

            <div className="space-y-bb-4">
              <h3 className="bb-h4 text-bb-secondary">Tertiary</h3>
              <div className="space-y-bb-3">
                <Button variant="tertiary">View Details</Button>
                <Button variant="tertiary" icon={<PlusIcon />}>
                  Quick Add
                </Button>
                <Button variant="tertiary" disabled>
                  Disabled Tertiary
                </Button>
              </div>
            </div>

            <div className="space-y-bb-4">
              <h3 className="bb-h4 text-bb-secondary">Destructive</h3>
              <div className="space-y-bb-3">
                <Button variant="destructive">Delete Account</Button>
                <Button variant="destructive" icon={<TrashIcon />}>
                  Remove Item
                </Button>
                <Button 
                  variant="destructive" 
                  icon={<TrashIcon />} 
                  iconPosition="right"
                >
                  Clear Cart
                </Button>
              </div>
            </div>

            <div className="space-y-bb-4">
              <h3 className="bb-h4 text-bb-secondary">Ghost</h3>
              <div className="space-y-bb-3">
                <Button variant="ghost">Cancel</Button>
                <Button variant="ghost" icon={<HeartIcon />}>
                  Like
                </Button>
                <Button variant="ghost" fullWidth>
                  Full Width Ghost
                </Button>
              </div>
            </div>

            <div className="space-y-bb-4">
              <h3 className="bb-h4 text-bb-secondary">Link</h3>
              <div className="space-y-bb-3">
                <Button variant="link">Privacy Policy</Button>
                <Button variant="link" icon={<PlusIcon />}>
                  Terms of Service
                </Button>
                <Button variant="link" disabled>
                  Disabled Link
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Button Sizes */}
        <section className="space-y-bb-8">
          <h2 className="bb-h2 text-bb-primary">Button Sizes</h2>
          
          <div className="space-y-bb-6">
            <div className="space-y-bb-4">
              <h3 className="bb-h4 text-bb-secondary">Text Buttons</h3>
              <div className="flex flex-wrap items-end gap-bb-4">
                <Button size="sm">Small Button</Button>
                <Button size="md">Medium Button</Button>
                <Button size="lg">Large Button</Button>
                <Button size="xl">Extra Large Button</Button>
              </div>
            </div>

            <div className="space-y-bb-4">
              <h3 className="bb-h4 text-bb-secondary">Icon Buttons</h3>
              <div className="flex flex-wrap items-end gap-bb-4">
                <Button size="icon-sm" aria-label="Small icon button">
                  <PlusIcon />
                </Button>
                <Button size="icon" aria-label="Medium icon button">
                  <PlusIcon />
                </Button>
                <Button size="icon-lg" aria-label="Large icon button">
                  <PlusIcon />
                </Button>
              </div>
            </div>

            <div className="space-y-bb-4">
              <h3 className="bb-h4 text-bb-secondary">Buttons with Icons</h3>
              <div className="flex flex-wrap items-end gap-bb-4">
                <Button size="sm" icon={<ShoppingCartIcon />}>
                  Small with Icon
                </Button>
                <Button size="md" icon={<ShoppingCartIcon />}>
                  Medium with Icon
                </Button>
                <Button size="lg" icon={<ShoppingCartIcon />}>
                  Large with Icon
                </Button>
                <Button size="xl" icon={<ShoppingCartIcon />}>
                  XL with Icon
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Loading States */}
        <section className="space-y-bb-8">
          <h2 className="bb-h2 text-bb-primary">Loading States</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-bb-6">
            <div className="space-y-bb-4">
              <h3 className="bb-h4 text-bb-secondary">Loading Buttons</h3>
              <div className="space-y-bb-3">
                <Button 
                  loading={loadingStates.primary}
                  onClick={() => handleLoadingDemo('primary')}
                >
                  {loadingStates.primary ? 'Processing...' : 'Process Order'}
                </Button>
                <Button 
                  variant="secondary"
                  loading={loadingStates.secondary}
                  onClick={() => handleLoadingDemo('secondary')}
                >
                  {loadingStates.secondary ? 'Saving...' : 'Save Changes'}
                </Button>
                <Button 
                  variant="tertiary"
                  loading={loadingStates.tertiary}
                  onClick={() => handleLoadingDemo('tertiary')}
                >
                  {loadingStates.tertiary ? 'Loading...' : 'Load More'}
                </Button>
              </div>
            </div>

            <div className="space-y-bb-4">
              <h3 className="bb-h4 text-bb-secondary">Loading with Icons</h3>
              <div className="space-y-bb-3">
                <Button 
                  icon={<ShoppingCartIcon />}
                  loading={loadingStates.iconPrimary}
                  onClick={() => handleLoadingDemo('iconPrimary')}
                >
                  {loadingStates.iconPrimary ? 'Adding...' : 'Add to Cart'}
                </Button>
                <Button 
                  variant="secondary"
                  icon={<HeartIcon />}
                  loading={loadingStates.iconSecondary}
                  onClick={() => handleLoadingDemo('iconSecondary')}
                >
                  {loadingStates.iconSecondary ? 'Adding...' : 'Add to Wishlist'}
                </Button>
              </div>
            </div>

            <div className="space-y-bb-4">
              <h3 className="bb-h4 text-bb-secondary">Always Loading</h3>
              <div className="space-y-bb-3">
                <Button loading>Always Loading</Button>
                <Button variant="secondary" loading icon={<PlusIcon />}>
                  Loading with Icon
                </Button>
                <Button size="icon" loading aria-label="Loading icon button">
                  <PlusIcon />
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Examples */}
        <section className="space-y-bb-8">
          <h2 className="bb-h2 text-bb-primary">Interactive Examples</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-bb-8">
            {/* E-commerce Actions */}
            <div className="space-y-bb-6 p-bb-6 bg-bb-champagne-50 rounded-bb-lg">
              <h3 className="bb-h3 text-bb-primary">E-commerce Actions</h3>
              <div className="space-y-bb-4">
                <div className="flex gap-bb-3">
                  <Button icon={<ShoppingCartIcon />} fullWidth>
                    Add to Cart
                  </Button>
                  <Button variant="secondary" size="icon" aria-label="Add to wishlist">
                    <HeartIcon />
                  </Button>
                </div>
                <Button variant="secondary" fullWidth>
                  Buy Now
                </Button>
                <div className="flex gap-bb-3">
                  <Button variant="tertiary" className="flex-1">
                    View Details
                  </Button>
                  <Button variant="tertiary" className="flex-1">
                    Compare
                  </Button>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="space-y-bb-6 p-bb-6 bg-bb-champagne-50 rounded-bb-lg">
              <h3 className="bb-h3 text-bb-primary">Form Actions</h3>
              <div className="space-y-bb-4">
                <Button fullWidth>
                  Create Account
                </Button>
                <div className="flex gap-bb-3">
                  <Button variant="secondary" className="flex-1">
                    Cancel
                  </Button>
                  <Button variant="primary" className="flex-1">
                    Save
                  </Button>
                </div>
                <Button variant="destructive" fullWidth icon={<TrashIcon />}>
                  Delete Account
                </Button>
                <Button variant="link" fullWidth>
                  Forgot Password?
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Accessibility Examples */}
        <section className="space-y-bb-8">
          <h2 className="bb-h2 text-bb-primary">Accessibility Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-bb-6">
            <div className="space-y-bb-4">
              <h3 className="bb-h4 text-bb-secondary">Keyboard Navigation</h3>
              <p className="bb-body-sm text-bb-tertiary">
                All buttons support keyboard navigation with Tab, Enter, and Space keys.
              </p>
              <div className="space-y-bb-3">
                <Button>Tab to me first</Button>
                <Button variant="secondary">Then to me</Button>
                <Button variant="tertiary">Finally to me</Button>
              </div>
            </div>

            <div className="space-y-bb-4">
              <h3 className="bb-h4 text-bb-secondary">Screen Reader Support</h3>
              <p className="bb-body-sm text-bb-tertiary">
                Icon buttons include proper aria-labels for screen readers.
              </p>
              <div className="flex gap-bb-3">
                <Button size="icon" aria-label="Add new item">
                  <PlusIcon />
                </Button>
                <Button size="icon" aria-label="Add to favorites">
                  <HeartIcon />
                </Button>
                <Button size="icon" aria-label="Add to shopping cart">
                  <ShoppingCartIcon />
                </Button>
                <Button size="icon" variant="destructive" aria-label="Delete item">
                  <TrashIcon />
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Usage Guidelines */}
        <section className="space-y-bb-8">
          <h2 className="bb-h2 text-bb-primary">Usage Guidelines</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-bb-8">
            <div className="space-y-bb-4">
              <h3 className="bb-h3 text-bb-secondary">Do's</h3>
              <ul className="space-y-bb-2 bb-body-md text-bb-secondary">
                <li className="flex items-start gap-bb-2">
                  <span className="text-bb-success mt-1">✓</span>
                  Use primary buttons for main actions
                </li>
                <li className="flex items-start gap-bb-2">
                  <span className="text-bb-success mt-1">✓</span>
                  Use secondary buttons for alternative actions
                </li>
                <li className="flex items-start gap-bb-2">
                  <span className="text-bb-success mt-1">✓</span>
                  Use tertiary buttons for less important actions
                </li>
                <li className="flex items-start gap-bb-2">
                  <span className="text-bb-success mt-1">✓</span>
                  Include loading states for async actions
                </li>
                <li className="flex items-start gap-bb-2">
                  <span className="text-bb-success mt-1">✓</span>
                  Use appropriate aria-labels for icon buttons
                </li>
              </ul>
            </div>

            <div className="space-y-bb-4">
              <h3 className="bb-h3 text-bb-secondary">Don'ts</h3>
              <ul className="space-y-bb-2 bb-body-md text-bb-secondary">
                <li className="flex items-start gap-bb-2">
                  <span className="text-bb-error mt-1">✗</span>
                  Don't use multiple primary buttons in the same context
                </li>
                <li className="flex items-start gap-bb-2">
                  <span className="text-bb-error mt-1">✗</span>
                  Don't use destructive buttons for non-destructive actions
                </li>
                <li className="flex items-start gap-bb-2">
                  <span className="text-bb-error mt-1">✗</span>
                  Don't mix different button sizes in the same group
                </li>
                <li className="flex items-start gap-bb-2">
                  <span className="text-bb-error mt-1">✗</span>
                  Don't use buttons for navigation (use links instead)
                </li>
                <li className="flex items-start gap-bb-2">
                  <span className="text-bb-error mt-1">✗</span>
                  Don't forget loading states for async operations
                </li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default BrandButtonDemo;