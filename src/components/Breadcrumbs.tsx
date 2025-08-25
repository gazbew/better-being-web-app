import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, className }) => {
  const location = useLocation();

  // Auto-generate breadcrumbs if not provided
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const pathSegments = location.pathname.split("/").filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [
      { label: "Home", href: "/" }
    ];

    let currentPath = "";
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLast = index === pathSegments.length - 1;
      
      // Convert segment to readable label
      const label = segment
        .split("-")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

      breadcrumbs.push({
        label,
        href: isLast ? undefined : currentPath,
        current: isLast
      });
    });

    return breadcrumbs;
  };

  const breadcrumbItems = items || generateBreadcrumbs();

  if (breadcrumbItems.length <= 1) {
    return null; // Don't show breadcrumbs on home page or single-level pages
  }

  return (
    <nav 
      aria-label="Breadcrumb" 
      className={cn("flex items-center space-x-1 text-sm", className)}
    >
      <ol className="flex items-center space-x-1" role="list">
        {breadcrumbItems.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && (
              <ChevronRight 
                className="w-4 h-4 mx-2 text-muted-foreground flex-shrink-0" 
                aria-hidden="true" 
              />
            )}
            
            {item.href ? (
              <Link
                to={item.href}
                className={cn(
                  "font-body transition-colors hover:text-bb-mahogany-600",
                  index === 0 
                    ? "text-muted-foreground flex items-center" 
                    : "text-muted-foreground"
                )}
                aria-label={index === 0 ? "Go to home page" : `Go to ${item.label}`}
              >
                {index === 0 && <Home className="w-4 h-4 mr-1" aria-hidden="true" />}
                {item.label}
              </Link>
            ) : (
              <span 
                className="font-body text-foreground font-medium" 
                aria-current="page"
              >
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

// Pre-defined breadcrumb configurations for common pages
export const breadcrumbConfigs = {
  products: [
    { label: "Home", href: "/" },
    { label: "Products", current: true }
  ],
  productDetail: (productName: string) => [
    { label: "Home", href: "/" },
    { label: "Products", href: "/products" },
    { label: productName, current: true }
  ],
  account: [
    { label: "Home", href: "/" },
    { label: "My Account", current: true }
  ],
  accountOrders: [
    { label: "Home", href: "/" },
    { label: "My Account", href: "/account" },
    { label: "Orders", current: true }
  ],
  checkout: [
    { label: "Home", href: "/" },
    { label: "Cart", href: "/cart" },
    { label: "Checkout", current: true }
  ],
  blog: [
    { label: "Home", href: "/" },
    { label: "Wellness", href: "/wellness" },
    { label: "Blog", current: true }
  ],
  blogPost: (postTitle: string) => [
    { label: "Home", href: "/" },
    { label: "Wellness", href: "/wellness" },
    { label: "Blog", href: "/blog" },
    { label: postTitle, current: true }
  ]
};

export default Breadcrumbs;
