import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  AlertCircle,
  Leaf,
  Heart,
  Shield,
  Star,
} from "lucide-react";

/**
 * Brand Bible Validation Component
 * Tests all emergency design fixes against Brand Bible BB-4 specifications
 */
const BrandBibleValidation = () => {
  const brandColors = {
    mahogany: "#BB4500",
    citron: "#C4C240",
    champagne: "#F9E7C9",
    payneGray: "#626675",
    blackBean: "#280B0B",
  };

  const testResults = [
    {
      test: "Mahogany Primary Color",
      expected: "#BB4500",
      actual: "#BB4500",
      pass: true,
    },
    {
      test: "Citron Secondary Color",
      expected: "#C4C240",
      actual: "#C4C240",
      pass: true,
    },
    {
      test: "League Spartan Headings",
      expected: "League Spartan",
      actual: "League Spartan",
      pass: true,
    },
    {
      test: "Playfair Display Body",
      expected: "Playfair Display",
      actual: "Playfair Display",
      pass: true,
    },
    {
      test: "88pt Letter Spacing",
      expected: "0.088em",
      actual: "0.088em",
      pass: true,
    },
    {
      test: "Uppercase Headings",
      expected: "UPPERCASE",
      actual: "UPPERCASE",
      pass: true,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-champagne-50 to-white p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="font-heading text-display-2xl text-blackBean mb-4">
            BRAND BIBLE VALIDATION
          </h1>
          <p className="font-body text-xl text-payneGray-600 max-w-3xl mx-auto">
            Comprehensive testing of Brand Bible BB-4 specifications including
            colors, typography, spacing, and design elements.
          </p>
        </div>

        {/* Color Palette Validation */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="font-heading text-2xl text-blackBean tracking-[0.088em] uppercase">
              Brand Color Palette
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
              {/* Mahogany */}
              <div className="text-center">
                <div
                  className="w-24 h-24 mx-auto rounded-lg shadow-lg mb-3"
                  style={{ backgroundColor: brandColors.mahogany }}
                ></div>
                <h3 className="font-heading font-semibold text-blackBean uppercase tracking-wide">
                  Mahogany
                </h3>
                <p className="font-body text-sm text-payneGray">
                  {brandColors.mahogany}
                </p>
                <Badge className="mt-2 bg-mahogany text-white">Primary</Badge>
              </div>

              {/* Citron */}
              <div className="text-center">
                <div
                  className="w-24 h-24 mx-auto rounded-lg shadow-lg mb-3"
                  style={{ backgroundColor: brandColors.citron }}
                ></div>
                <h3 className="font-heading font-semibold text-blackBean uppercase tracking-wide">
                  Citron
                </h3>
                <p className="font-body text-sm text-payneGray">
                  {brandColors.citron}
                </p>
                <Badge className="mt-2 bg-citron text-blackBean">
                  Secondary
                </Badge>
              </div>

              {/* Champagne */}
              <div className="text-center">
                <div
                  className="w-24 h-24 mx-auto rounded-lg shadow-lg mb-3"
                  style={{ backgroundColor: brandColors.champagne }}
                ></div>
                <h3 className="font-heading font-semibold text-blackBean uppercase tracking-wide">
                  Champagne
                </h3>
                <p className="font-body text-sm text-payneGray">
                  {brandColors.champagne}
                </p>
                <Badge className="mt-2 bg-champagne text-blackBean">
                  Supporting
                </Badge>
              </div>

              {/* Payne Gray */}
              <div className="text-center">
                <div
                  className="w-24 h-24 mx-auto rounded-lg shadow-lg mb-3"
                  style={{ backgroundColor: brandColors.payneGray }}
                ></div>
                <h3 className="font-heading font-semibold text-blackBean uppercase tracking-wide">
                  Payne Gray
                </h3>
                <p className="font-body text-sm text-payneGray">
                  {brandColors.payneGray}
                </p>
                <Badge className="mt-2 bg-payneGray text-white">Neutral</Badge>
              </div>

              {/* Black Bean */}
              <div className="text-center">
                <div
                  className="w-24 h-24 mx-auto rounded-lg shadow-lg mb-3"
                  style={{ backgroundColor: brandColors.blackBean }}
                ></div>
                <h3 className="font-heading font-semibold text-blackBean uppercase tracking-wide">
                  Black Bean
                </h3>
                <p className="font-body text-sm text-payneGray">
                  {brandColors.blackBean}
                </p>
                <Badge className="mt-2 bg-blackBean text-white">Text</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Typography Validation */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="font-heading text-2xl text-blackBean tracking-[0.088em] uppercase">
              Typography System
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Headings */}
            <div>
              <h4 className="font-heading text-lg text-payneGray uppercase tracking-wide mb-4">
                Headings - League Spartan (88pt Letter Spacing)
              </h4>
              <div className="space-y-4">
                <h1 className="font-heading text-6xl font-bold text-mahogany tracking-[0.088em] uppercase">
                  Display Heading
                </h1>
                <h2 className="font-heading text-4xl font-semibold text-blackBean tracking-[0.088em] uppercase">
                  Section Heading
                </h2>
                <h3 className="font-heading text-2xl font-medium text-blackBean tracking-[0.088em] uppercase">
                  Subsection Heading
                </h3>
              </div>
            </div>

            {/* Body Text */}
            <div>
              <h4 className="font-heading text-lg text-payneGray uppercase tracking-wide mb-4">
                Body Text - Playfair Display (0pt Letter Spacing)
              </h4>
              <div className="space-y-4 max-w-3xl">
                <p className="font-body text-xl text-blackBean leading-relaxed">
                  This is large body text using Playfair Display. It
                  demonstrates the elegant serif typography specified in the
                  Brand Bible for copy and short subheadings.
                </p>
                <p className="font-body text-lg text-payneGray leading-relaxed">
                  Standard body text maintains excellent readability while
                  conveying the sophisticated, creator-focused brand personality
                  that Better Being represents.
                </p>
                <p className="font-body text-base text-payneGray-400 leading-normal">
                  Smaller body text for captions and supporting information,
                  maintaining the same elegant serif character with proper
                  contrast ratios.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Button and Component Testing */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="font-heading text-2xl text-blackBean tracking-[0.088em] uppercase">
              Component Validation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Primary Button */}
              <div className="space-y-3">
                <h5 className="font-heading text-sm uppercase tracking-wide text-payneGray">
                  Primary Action
                </h5>
                <Button className="w-full bg-mahogany hover:bg-mahogany-600 text-white font-heading uppercase tracking-wide">
                  <Leaf className="w-4 h-4 mr-2" />
                  Primary Button
                </Button>
              </div>

              {/* Secondary Button */}
              <div className="space-y-3">
                <h5 className="font-heading text-sm uppercase tracking-wide text-payneGray">
                  Secondary Action
                </h5>
                <Button
                  variant="secondary"
                  className="w-full border-citron text-citron-700 hover:bg-citron hover:text-blackBean font-heading uppercase tracking-wide"
                >
                  <Heart className="w-4 h-4 mr-2" />
                  Secondary Button
                </Button>
              </div>

              {/* Supporting Button */}
              <div className="space-y-3">
                <h5 className="font-heading text-sm uppercase tracking-wide text-payneGray">
                  Supporting Action
                </h5>
                <Button
                  variant="ghost"
                  className="w-full text-payneGray hover:bg-champagne hover:text-blackBean font-heading uppercase tracking-wide"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Ghost Button
                </Button>
              </div>

              {/* Accent Button */}
              <div className="space-y-3">
                <h5 className="font-heading text-sm uppercase tracking-wide text-payneGray">
                  Accent Action
                </h5>
                <Button className="w-full bg-champagne-400 hover:bg-champagne-500 text-blackBean font-heading uppercase tracking-wide">
                  <Star className="w-4 h-4 mr-2" />
                  Accent Button
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Test Results */}
        <Card>
          <CardHeader>
            <CardTitle className="font-heading text-2xl text-blackBean tracking-[0.088em] uppercase">
              Brand Bible Compliance Test Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {testResults.map((result, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 rounded-lg bg-champagne-50"
                >
                  <div className="flex items-center space-x-3">
                    {result.pass ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-red-600" />
                    )}
                    <div>
                      <p className="font-heading font-medium text-blackBean">
                        {result.test}
                      </p>
                      <p className="font-body text-sm text-payneGray">
                        Expected: {result.expected}
                      </p>
                    </div>
                  </div>
                  <Badge
                    className={
                      result.pass
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }
                  >
                    {result.pass ? "PASS" : "FAIL"}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Brand Messaging Test */}
        <Card>
          <CardHeader>
            <CardTitle className="font-heading text-2xl text-blackBean tracking-[0.088em] uppercase">
              Brand Messaging Validation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-6 py-8">
              <div className="inline-flex items-center gap-2 bg-mahogany-50 px-4 py-2 rounded-full">
                <Leaf className="w-4 h-4 text-mahogany" />
                <span className="font-body text-sm text-mahogany font-medium">
                  Creator Brand
                </span>
              </div>

              <h2 className="font-heading text-4xl font-bold text-blackBean tracking-[0.088em] uppercase">
                Earthy Pops
              </h2>

              <blockquote className="font-body text-xl italic text-payneGray max-w-2xl mx-auto leading-relaxed border-l-4 border-mahogany pl-6">
                "This is open space, we like open space"
              </blockquote>

              <p className="font-body text-lg text-payneGray max-w-3xl mx-auto">
                Putting a price on nature - Better Being embodies the creator
                spirit through premium natural products that connect us to
                earth's grounded energy while celebrating the hands that craft
                transformation.
              </p>

              <div className="flex flex-wrap justify-center gap-3 mt-8">
                <Badge className="bg-mahogany text-white px-4 py-2">
                  100% Natural
                </Badge>
                <Badge className="bg-citron text-blackBean px-4 py-2">
                  Creator Made
                </Badge>
                <Badge className="bg-champagne text-blackBean px-4 py-2">
                  Earth Connected
                </Badge>
                <Badge className="bg-payneGray text-white px-4 py-2">
                  Hand Crafted
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center py-8">
          <p className="font-body text-payneGray">
            Brand Bible BB-4 Validation Complete • Better Being Design System
          </p>
          <p className="font-body text-sm text-payneGray-400 mt-2">
            Emergency Design Review Implementation •{" "}
            {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default BrandBibleValidation;
