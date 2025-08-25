import type { Meta, StoryObj } from '@storybook/react';
import { Logo, LogoFull, LogoIcon, LogoText } from './Logo';

const meta: Meta<typeof Logo> = {
  title: 'Brand/Logo',
  component: Logo,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
The Logo component is a flexible, brand-compliant logo implementation that supports multiple variants, sizes, and color schemes following Better Being Brand Bible BB-4 specifications.

## Features
- **Multiple Variants**: Full logo, icon only, or text only
- **Responsive Sizes**: Small, medium, large, and extra-large
- **Color Schemes**: Default, white, dark, orange, and green variants
- **Interactive**: Optional click handling with proper accessibility
- **Brand Compliant**: Follows exact brand guidelines for spacing, colors, and typography

## Usage Guidelines
- Use the full logo in headers and main brand placements
- Use the icon variant in compact spaces like favicons or mobile navigation
- Use the text variant when space is limited but brand recognition is important
- Choose color variants based on background contrast requirements
        `
      }
    }
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['full', 'icon', 'text'],
      description: 'Logo variant to display'
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg', 'xl'],
      description: 'Size of the logo'
    },
    color: {
      control: { type: 'select' },
      options: ['default', 'white', 'dark', 'orange', 'green'],
      description: 'Color variant for different backgrounds'
    },
    clickable: {
      control: { type: 'boolean' },
      description: 'Whether the logo should be clickable'
    },
    className: {
      control: { type: 'text' },
      description: 'Additional CSS classes'
    },
    alt: {
      control: { type: 'text' },
      description: 'Alt text for accessibility'
    }
  },
  tags: ['autodocs']
};

export default meta;
type Story = StoryObj<typeof Logo>;

// Default story
export const Default: Story = {
  args: {
    variant: 'full',
    size: 'md',
    color: 'default'
  }
};

// Variant stories
export const FullLogo: Story = {
  args: {
    variant: 'full',
    size: 'md',
    color: 'default'
  },
  parameters: {
    docs: {
      description: {
        story: 'The full logo includes both the icon and text elements. Use this for primary brand placements.'
      }
    }
  }
};

export const IconOnly: Story = {
  args: {
    variant: 'icon',
    size: 'md',
    color: 'default'
  },
  parameters: {
    docs: {
      description: {
        story: 'The icon variant shows only the Better Being symbol. Perfect for compact spaces and mobile interfaces.'
      }
    }
  }
};

export const TextOnly: Story = {
  args: {
    variant: 'text',
    size: 'md',
    color: 'default'
  },
  parameters: {
    docs: {
      description: {
        story: 'The text variant shows only the "Better Being" wordmark using brand typography.'
      }
    }
  }
};

// Size variations
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col items-center gap-8 p-8">
      <div className="text-center">
        <h3 className="bb-h3 mb-4">Small (sm)</h3>
        <Logo variant="full" size="sm" />
      </div>
      <div className="text-center">
        <h3 className="bb-h3 mb-4">Medium (md) - Default</h3>
        <Logo variant="full" size="md" />
      </div>
      <div className="text-center">
        <h3 className="bb-h3 mb-4">Large (lg)</h3>
        <Logo variant="full" size="lg" />
      </div>
      <div className="text-center">
        <h3 className="bb-h3 mb-4">Extra Large (xl)</h3>
        <Logo variant="full" size="xl" />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Logo component supports four different sizes to accommodate various use cases and screen sizes.'
      }
    }
  }
};

// Color variations
export const Colors: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-8">
      <div className="text-center p-6 bg-white rounded-lg border">
        <h4 className="bb-h4 mb-4">Default</h4>
        <Logo variant="full" size="md" color="default" />
      </div>
      <div className="text-center p-6 bg-gray-800 rounded-lg">
        <h4 className="bb-h4 mb-4 text-white">White</h4>
        <Logo variant="full" size="md" color="white" />
      </div>
      <div className="text-center p-6 bg-gray-100 rounded-lg">
        <h4 className="bb-h4 mb-4">Dark</h4>
        <Logo variant="full" size="md" color="dark" />
      </div>
      <div className="text-center p-6 bg-orange-50 rounded-lg border border-orange-200">
        <h4 className="bb-h4 mb-4 text-orange-800">Orange</h4>
        <Logo variant="full" size="md" color="orange" />
      </div>
      <div className="text-center p-6 bg-green-50 rounded-lg border border-green-200">
        <h4 className="bb-h4 mb-4 text-green-800">Green</h4>
        <Logo variant="full" size="md" color="green" />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different color variants optimized for various background colors and brand contexts.'
      }
    }
  }
};

// Interactive logo
export const Interactive: Story = {
  args: {
    variant: 'full',
    size: 'md',
    color: 'default',
    clickable: true,
    onClick: () => alert('Logo clicked!')
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive logo with hover effects and click handling. Perfect for navigation headers.'
      }
    }
  }
};

// All variants comparison
export const AllVariants: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-8">
      <div className="text-center p-6 bg-white rounded-lg border">
        <h4 className="bb-h4 mb-6">Full Logo</h4>
        <div className="space-y-4">
          <Logo variant="full" size="sm" />
          <Logo variant="full" size="md" />
          <Logo variant="full" size="lg" />
        </div>
      </div>
      <div className="text-center p-6 bg-white rounded-lg border">
        <h4 className="bb-h4 mb-6">Icon Only</h4>
        <div className="flex justify-center items-center space-x-4">
          <Logo variant="icon" size="sm" />
          <Logo variant="icon" size="md" />
          <Logo variant="icon" size="lg" />
          <Logo variant="icon" size="xl" />
        </div>
      </div>
      <div className="text-center p-6 bg-white rounded-lg border">
        <h4 className="bb-h4 mb-6">Text Only</h4>
        <div className="space-y-4">
          <Logo variant="text" size="sm" />
          <Logo variant="text" size="md" />
          <Logo variant="text" size="lg" />
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Comparison of all logo variants in different sizes to help choose the right option for your use case.'
      }
    }
  }
};

// Component variants
export const ComponentVariants: Story = {
  render: () => (
    <div className="flex flex-col items-center gap-8 p-8">
      <div className="text-center">
        <h3 className="bb-h3 mb-4">LogoFull Component</h3>
        <LogoFull size="md" />
      </div>
      <div className="text-center">
        <h3 className="bb-h3 mb-4">LogoIcon Component</h3>
        <LogoIcon size="md" />
      </div>
      <div className="text-center">
        <h3 className="bb-h3 mb-4">LogoText Component</h3>
        <LogoText size="md" />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Dedicated component variants for easier usage when you know exactly which variant you need.'
      }
    }
  }
};

// Usage examples
export const UsageExamples: Story = {
  render: () => (
    <div className="space-y-12 p-8">
      {/* Header example */}
      <div className="bg-white border rounded-lg p-6">
        <h4 className="bb-h4 mb-4">Header Navigation</h4>
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded">
          <Logo variant="full" size="md" clickable />
          <nav className="flex space-x-4">
            <a href="#" className="text-gray-600 hover:text-gray-900">Products</a>
            <a href="#" className="text-gray-600 hover:text-gray-900">About</a>
            <a href="#" className="text-gray-600 hover:text-gray-900">Contact</a>
          </nav>
        </div>
      </div>

      {/* Mobile header example */}
      <div className="bg-white border rounded-lg p-6">
        <h4 className="bb-h4 mb-4">Mobile Header</h4>
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded max-w-sm">
          <Logo variant="icon" size="sm" clickable />
          <button className="p-2">☰</button>
        </div>
      </div>

      {/* Footer example */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h4 className="bb-h4 mb-4 text-white">Footer</h4>
        <div className="p-6">
          <Logo variant="full" size="sm" color="white" />
          <p className="text-gray-300 mt-4 text-sm">
            © 2024 Better Being. All rights reserved.
          </p>
        </div>
      </div>

      {/* Card example */}
      <div className="bg-white border rounded-lg p-6">
        <h4 className="bb-h4 mb-4">Product Card</h4>
        <div className="bg-gradient-to-br from-orange-50 to-green-50 rounded-lg p-6 max-w-sm">
          <div className="flex items-center mb-4">
            <Logo variant="icon" size="sm" />
            <span className="ml-2 text-sm font-medium text-gray-600">Better Being</span>
          </div>
          <h5 className="font-semibold mb-2">Premium Wellness Package</h5>
          <p className="text-gray-600 text-sm">Complete natural health solution</p>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Real-world usage examples showing how to integrate the Logo component in different contexts.'
      }
    }
  }
};