import React, { useState } from "react";
import { NavigationPrimary } from "@/components/NavigationPrimary";
import { FooterPrimary } from "@/components/FooterPrimary";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowRight,
  ArrowLeft,
  Shield,
  Lock,
  Truck,
  Clock,
  CreditCard,
  CheckCircle,
  MapPin,
  User,
  Mail,
  Phone,
  Tag,
} from "lucide-react";
import { Link } from "react-router-dom";

const Checkout = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Billing Information
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",

    // Shipping Address
    address: "",
    apartment: "",
    city: "",
    province: "",
    postalCode: "",
    country: "South Africa",

    // Shipping Options
    shippingMethod: "",

    // Payment
    paymentMethod: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardName: "",

    // Additional
    orderNotes: "",
    sameAsShipping: true,
    marketingEmails: false,
  });

  // Mock cart items
  const cartItems = [
    {
      id: 1,
      name: "Go Go Pain Relief",
      category: "Pain Management",
      price: 185,
      quantity: 2,
      image: "/api/placeholder/80/80",
    },
    {
      id: 2,
      name: "Raw Pro-Biotic Gut Repair",
      category: "Digestive Health",
      price: 225,
      quantity: 1,
      image: "/api/placeholder/80/80",
    },
    {
      id: 3,
      name: "Night Care Renewal",
      category: "Skincare",
      price: 200,
      quantity: 1,
      image: "/api/placeholder/80/80",
    },
  ];

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const shipping = subtotal > 500 ? 0 : 50;
  const tax = subtotal * 0.15; // 15% VAT
  const total = subtotal + shipping + tax;

  const steps = [
    { number: 1, title: "Information", description: "Contact & Shipping" },
    { number: 2, title: "Shipping", description: "Delivery Options" },
    { number: 3, title: "Payment", description: "Payment Details" },
    { number: 4, title: "Review", description: "Order Confirmation" },
  ];

  const shippingOptions = [
    {
      id: "standard",
      name: "Standard Delivery",
      description: "5-7 business days",
      price: 50,
      icon: <Truck className="w-5 h-5" />,
    },
    {
      id: "express",
      name: "Express Delivery",
      description: "2-3 business days",
      price: 100,
      icon: <Clock className="w-5 h-5" />,
    },
    {
      id: "overnight",
      name: "Overnight Delivery",
      description: "Next business day",
      price: 200,
      icon: <ArrowRight className="w-5 h-5" />,
    },
  ];

  const paymentMethods = [
    {
      id: "card",
      name: "Credit/Debit Card",
      description: "Visa, Mastercard, American Express",
      icon: <CreditCard className="w-5 h-5" />,
    },
    {
      id: "eft",
      name: "EFT/Bank Transfer",
      description: "Direct bank transfer",
      icon: <Shield className="w-5 h-5" />,
    },
  ];

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmitOrder = () => {
    // Handle order submission
    alert("Order submitted successfully!");
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {steps.map((step, index) => (
        <div key={step.number} className="flex items-center">
          <div className="flex items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                step.number <= currentStep
                  ? "bg-[#BB4500] text-white"
                  : "bg-[#F9E7C9] text-[#626675]"
              }`}
            >
              {step.number < currentStep ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                step.number
              )}
            </div>
            <div className="ml-3 hidden md:block">
              <div
                className={`text-sm font-medium ${
                  step.number <= currentStep
                    ? "text-[#280B0B]"
                    : "text-[#626675]"
                }`}
              >
                {step.title}
              </div>
              <div className="text-xs text-[#626675]">{step.description}</div>
            </div>
          </div>
          {index < steps.length - 1 && (
            <div
              className={`w-16 h-0.5 mx-4 ${
                step.number < currentStep ? "bg-[#BB4500]" : "bg-[#F9E7C9]"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );

  const renderInformationStep = () => (
    <div className="space-y-6">
      <Card className="border-none shadow-md">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-[#280B0B] uppercase tracking-wide">
            CONTACT INFORMATION
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-[#280B0B] font-medium">
                First Name *
              </Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                className="border-[#626675]/20 focus:border-[#BB4500]"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-[#280B0B] font-medium">
                Last Name *
              </Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                className="border-[#626675]/20 focus:border-[#BB4500]"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-[#280B0B] font-medium">
              Email Address *
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className="border-[#626675]/20 focus:border-[#BB4500]"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-[#280B0B] font-medium">
              Phone Number *
            </Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              className="border-[#626675]/20 focus:border-[#BB4500]"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="company" className="text-[#280B0B] font-medium">
              Company (Optional)
            </Label>
            <Input
              id="company"
              value={formData.company}
              onChange={(e) => handleInputChange("company", e.target.value)}
              className="border-[#626675]/20 focus:border-[#BB4500]"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-md">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-[#280B0B] uppercase tracking-wide">
            SHIPPING ADDRESS
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="address" className="text-[#280B0B] font-medium">
              Address *
            </Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              className="border-[#626675]/20 focus:border-[#BB4500]"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="apartment" className="text-[#280B0B] font-medium">
              Apartment, Suite, etc. (Optional)
            </Label>
            <Input
              id="apartment"
              value={formData.apartment}
              onChange={(e) => handleInputChange("apartment", e.target.value)}
              className="border-[#626675]/20 focus:border-[#BB4500]"
            />
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city" className="text-[#280B0B] font-medium">
                City *
              </Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => handleInputChange("city", e.target.value)}
                className="border-[#626675]/20 focus:border-[#BB4500]"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="province" className="text-[#280B0B] font-medium">
                Province *
              </Label>
              <Select
                value={formData.province}
                onValueChange={(value) => handleInputChange("province", value)}
              >
                <SelectTrigger className="border-[#626675]/20 focus:border-[#BB4500]">
                  <SelectValue placeholder="Select province" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="western-cape">Western Cape</SelectItem>
                  <SelectItem value="gauteng">Gauteng</SelectItem>
                  <SelectItem value="kwazulu-natal">KwaZulu-Natal</SelectItem>
                  <SelectItem value="eastern-cape">Eastern Cape</SelectItem>
                  <SelectItem value="free-state">Free State</SelectItem>
                  <SelectItem value="limpopo">Limpopo</SelectItem>
                  <SelectItem value="mpumalanga">Mpumalanga</SelectItem>
                  <SelectItem value="northern-cape">Northern Cape</SelectItem>
                  <SelectItem value="north-west">North West</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="postalCode"
                className="text-[#280B0B] font-medium"
              >
                Postal Code *
              </Label>
              <Input
                id="postalCode"
                value={formData.postalCode}
                onChange={(e) =>
                  handleInputChange("postalCode", e.target.value)
                }
                className="border-[#626675]/20 focus:border-[#BB4500]"
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderShippingStep = () => (
    <Card className="border-none shadow-md">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-[#280B0B] uppercase tracking-wide">
          DELIVERY OPTIONS
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {shippingOptions.map((option) => (
          <div
            key={option.id}
            className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
              formData.shippingMethod === option.id
                ? "border-[#BB4500] bg-[#BB4500]/5"
                : "border-[#626675]/20 hover:border-[#BB4500]/50"
            }`}
            onClick={() => handleInputChange("shippingMethod", option.id)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-[#BB4500]">{option.icon}</div>
                <div>
                  <h4 className="font-bold text-[#280B0B]">{option.name}</h4>
                  <p className="text-sm text-[#626675]">{option.description}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-[#280B0B]">
                  {option.price === 0 ? "FREE" : `R${option.price}`}
                </div>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );

  const renderPaymentStep = () => (
    <div className="space-y-6">
      <Card className="border-none shadow-md">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-[#280B0B] uppercase tracking-wide">
            PAYMENT METHOD
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                formData.paymentMethod === method.id
                  ? "border-[#BB4500] bg-[#BB4500]/5"
                  : "border-[#626675]/20 hover:border-[#BB4500]/50"
              }`}
              onClick={() => handleInputChange("paymentMethod", method.id)}
            >
              <div className="flex items-center gap-4">
                <div className="text-[#BB4500]">{method.icon}</div>
                <div>
                  <h4 className="font-bold text-[#280B0B]">{method.name}</h4>
                  <p className="text-sm text-[#626675]">{method.description}</p>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {formData.paymentMethod === "card" && (
        <Card className="border-none shadow-md">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-[#280B0B] uppercase tracking-wide">
              CARD DETAILS
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="cardNumber"
                className="text-[#280B0B] font-medium"
              >
                Card Number *
              </Label>
              <Input
                id="cardNumber"
                type="text"
                placeholder="1234 5678 9012 3456"
                value={formData.cardNumber}
                onChange={(e) =>
                  handleInputChange("cardNumber", e.target.value)
                }
                className="border-[#626675]/20 focus:border-[#BB4500]"
                required
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="expiryDate"
                  className="text-[#280B0B] font-medium"
                >
                  Expiry Date *
                </Label>
                <Input
                  id="expiryDate"
                  type="text"
                  placeholder="MM/YY"
                  value={formData.expiryDate}
                  onChange={(e) =>
                    handleInputChange("expiryDate", e.target.value)
                  }
                  className="border-[#626675]/20 focus:border-[#BB4500]"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvv" className="text-[#280B0B] font-medium">
                  CVV *
                </Label>
                <Input
                  id="cvv"
                  type="text"
                  placeholder="123"
                  value={formData.cvv}
                  onChange={(e) => handleInputChange("cvv", e.target.value)}
                  className="border-[#626675]/20 focus:border-[#BB4500]"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="cardName" className="text-[#280B0B] font-medium">
                Name on Card *
              </Label>
              <Input
                id="cardName"
                type="text"
                value={formData.cardName}
                onChange={(e) => handleInputChange("cardName", e.target.value)}
                className="border-[#626675]/20 focus:border-[#BB4500]"
                required
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderReviewStep = () => (
    <div className="space-y-6">
      <Card className="border-none shadow-md">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-[#280B0B] uppercase tracking-wide">
            ORDER REVIEW
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-[#626675]">
            <p>
              Please review your order details before completing your purchase.
            </p>
          </div>

          <Separator />

          <div className="space-y-2">
            <h4 className="font-bold text-[#280B0B]">SHIPPING TO:</h4>
            <p className="text-[#626675]">
              {formData.firstName} {formData.lastName}
              <br />
              {formData.address} {formData.apartment}
              <br />
              {formData.city}, {formData.province} {formData.postalCode}
              <br />
              {formData.country}
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-[#280B0B]">CONTACT:</h4>
            <p className="text-[#626675]">
              {formData.email}
              <br />
              {formData.phone}
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="terms"
            className="border-[#BB4500] data-[state=checked]:bg-[#BB4500]"
          />
          <Label htmlFor="terms" className="text-sm text-[#626675]">
            I agree to the{" "}
            <Link to="/terms" className="text-[#BB4500] hover:underline">
              Terms & Conditions
            </Link>{" "}
            and{" "}
            <Link to="/privacy" className="text-[#BB4500] hover:underline">
              Privacy Policy
            </Link>
          </Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="marketing"
            checked={formData.marketingEmails}
            onCheckedChange={(checked) =>
              handleInputChange("marketingEmails", checked)
            }
            className="border-[#BB4500] data-[state=checked]:bg-[#BB4500]"
          />
          <Label htmlFor="marketing" className="text-sm text-[#626675]">
            Subscribe to our newsletter for wellness tips and exclusive offers
          </Label>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F9E7C9]">
      <NavigationPrimary />

      {/* Header */}
      <section className="bg-gradient-to-r from-[#BB4500] to-[#BB4500]/90 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4">
            <h1 className="text-3xl lg:text-4xl font-bold uppercase tracking-wide">
              SECURE CHECKOUT
            </h1>
            <p className="text-lg text-white/90">
              Complete your wellness journey
            </p>
            <div className="flex justify-center items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span>SSL Secured</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                <span>256-bit Encryption</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderStepIndicator()}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {currentStep === 1 && renderInformationStep()}
            {currentStep === 2 && renderShippingStep()}
            {currentStep === 3 && renderPaymentStep()}
            {currentStep === 4 && renderReviewStep()}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={handlePrevStep}
                disabled={currentStep === 1}
                className="border-[#626675]/20 text-[#626675] hover:border-[#BB4500] hover:text-[#BB4500]"
              >
                <ArrowLeft className="mr-2 w-4 h-4" />
                Back
              </Button>

              {currentStep < 4 ? (
                <Button
                  onClick={handleNextStep}
                  className="bg-[#BB4500] hover:bg-[#BB4500]/90 text-white"
                >
                  Continue
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmitOrder}
                  className="bg-[#BB4500] hover:bg-[#BB4500]/90 text-white font-bold"
                >
                  Complete Order
                  <CheckCircle className="ml-2 w-4 h-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card className="border-none shadow-lg sticky top-8">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-[#280B0B] uppercase tracking-wide">
                  ORDER SUMMARY
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-[#F9E7C9]/50 rounded-lg overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-[#280B0B] text-sm">
                          {item.name}
                        </h4>
                        <p className="text-xs text-[#626675]">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <div className="text-sm font-bold text-[#280B0B]">
                        R{(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#626675]">Subtotal</span>
                    <span className="font-medium">R{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#626675]">Shipping</span>
                    <span className="font-medium">
                      {shipping === 0 ? "FREE" : `R${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#626675]">VAT (15%)</span>
                    <span className="font-medium">R{tax.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold text-[#280B0B]">
                    <span>TOTAL</span>
                    <span>R{total.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Security Badges */}
            <Card className="border-none shadow-md">
              <CardContent className="p-6 space-y-4">
                <h4 className="font-medium text-[#280B0B] uppercase tracking-wide">
                  SECURE CHECKOUT
                </h4>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3 text-[#626675]">
                    <Shield className="w-5 h-5 text-green-600" />
                    <span>SSL Certificate Protection</span>
                  </div>
                  <div className="flex items-center gap-3 text-[#626675]">
                    <Lock className="w-5 h-5 text-green-600" />
                    <span>256-bit Secure Encryption</span>
                  </div>
                  <div className="flex items-center gap-3 text-[#626675]">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span>PCI DSS Compliant</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <FooterPrimary />
    </div>
  );
};

export default Checkout;
