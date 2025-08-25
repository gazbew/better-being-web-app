import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  CreditCard, 
  Truck, 
  Shield, 
  CheckCircle,
  AlertTriangle,
  Loader2,
  ArrowLeft,
  Lock,
  Package
} from 'lucide-react';

import { NavigationPrimary } from '@/components/NavigationPrimary';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';

import { api } from '@/services/api';
import { useAuth } from '@/hooks/useAuth';

// Form schemas
const shippingSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phone: z.string().min(10, 'Valid phone number required'),
  streetAddress: z.string().min(1, 'Street address is required'),
  suburb: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  province: z.string().min(1, 'Province is required'),
  postalCode: z.string().min(4, 'Valid postal code required'),
  deliveryInstructions: z.string().optional(),
});

const billingSchema = z.object({
  sameAsShipping: z.boolean(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  company: z.string().optional(),
  streetAddress: z.string().optional(),
  suburb: z.string().optional(),
  city: z.string().optional(),
  province: z.string().optional(),
  postalCode: z.string().optional(),
  taxNumber: z.string().optional(),
});

const checkoutSchema = z.object({
  shipping: shippingSchema,
  billing: billingSchema,
  paymentMethod: z.string().min(1, 'Payment method is required'),
  customerNotes: z.string().optional(),
  termsAccepted: z.boolean().refine(val => val === true, 'You must accept the terms and conditions'),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

const SOUTH_AFRICAN_PROVINCES = [
  'Eastern Cape',
  'Free State',
  'Gauteng',
  'KwaZulu-Natal',
  'Limpopo',
  'Mpumalanga',
  'Northern Cape',
  'North West',
  'Western Cape',
];

export default function CheckoutNew() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);

  // Form setup
  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      shipping: {
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        phone: user?.phone || '',
        streetAddress: '',
        suburb: '',
        city: '',
        province: '',
        postalCode: '',
        deliveryInstructions: '',
      },
      billing: {
        sameAsShipping: true,
      },
      paymentMethod: 'paystack',
      customerNotes: '',
      termsAccepted: false,
    },
  });

  // Watch for billing address toggle
  const sameAsShipping = form.watch('billing.sameAsShipping');

  // Fetch cart data
  const { data: cartResponse, isLoading: cartLoading, error: cartError } = useQuery({
    queryKey: ['cart'],
    queryFn: () => api.getCart(),
  });

  // Fetch payment config
  const { data: paymentConfigResponse } = useQuery({
    queryKey: ['payment-config'],
    queryFn: () => api.getPaymentConfig(),
  });

  // Validate cart before checkout
  const { data: cartValidationResponse } = useQuery({
    queryKey: ['cart-validation'],
    queryFn: () => api.validateCart(),
    enabled: !!cartResponse?.data?.cart && !cartResponse.data.cart.isEmpty,
  });

  const cart = cartResponse?.data?.cart;
  const paymentConfig = paymentConfigResponse?.data?.config;
  const cartValidation = cartValidationResponse?.data;

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/checkout');
    }
  }, [isAuthenticated, navigate]);

  // Redirect if cart is empty
  useEffect(() => {
    if (cartResponse && cart?.isEmpty) {
      navigate('/products');
      toast.error('Your cart is empty');
    }
  }, [cart, navigate, cartResponse]);

  // Create order mutation
  const createOrderMutation = useMutation({
    mutationFn: (orderData: any) => api.createOrder(orderData),
    onSuccess: async (response) => {
      if (response.success) {
        const orderId = response.data.order.id;
        
        // Initialize payment
        try {
          const paymentResponse = await api.initializePayment(orderId);
          if (paymentResponse.success && paymentResponse.data.authorization_url) {
            // Redirect to Paystack
            window.location.href = paymentResponse.data.authorization_url;
          } else {
            throw new Error(paymentResponse.error || 'Payment initialization failed');
          }
        } catch (error) {
          console.error('Payment initialization error:', error);
          toast.error('Payment initialization failed. Please try again.');
          setIsProcessing(false);
        }
      } else {
        throw new Error(response.error || 'Order creation failed');
      }
    },
    onError: (error: any) => {
      console.error('Order creation error:', error);
      toast.error(error.message || 'Failed to create order');
      setIsProcessing(false);
    },
  });

  const onSubmit = async (data: CheckoutFormData) => {
    if (!cartValidation?.valid) {
      toast.error('Please review your cart for any issues');
      return;
    }

    setIsProcessing(true);

    const shippingAddress = data.shipping;
    const billingAddress = data.billing.sameAsShipping 
      ? {
          firstName: data.shipping.firstName,
          lastName: data.shipping.lastName,
          streetAddress: data.shipping.streetAddress,
          suburb: data.shipping.suburb,
          city: data.shipping.city,
          province: data.shipping.province,
          postalCode: data.shipping.postalCode,
        }
      : {
          firstName: data.billing.firstName || '',
          lastName: data.billing.lastName || '',
          company: data.billing.company,
          streetAddress: data.billing.streetAddress || '',
          suburb: data.billing.suburb,
          city: data.billing.city || '',
          province: data.billing.province || '',
          postalCode: data.billing.postalCode || '',
          taxNumber: data.billing.taxNumber,
        };

    const orderData = {
      shippingAddress,
      billingAddress,
      paymentMethod: data.paymentMethod,
      customerNotes: data.customerNotes,
    };

    createOrderMutation.mutate(orderData);
  };

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (!isAuthenticated || cartLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    );
  }

  if (cartError || !cart) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600">Failed to load cart data</p>
          <Button onClick={() => navigate('/cart')} className="mt-4">
            Back to Cart
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationPrimary />
      
      <div className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/cart')}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Cart
            </Button>
            
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-gray-900">Secure Checkout</h1>
              <div className="flex items-center text-sm text-gray-600">
                <Lock className="h-4 w-4 mr-1" />
                Secured with SSL encryption
              </div>
            </div>
            
            {/* Progress Steps */}
            <div className="mt-6 flex items-center justify-center space-x-4">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold
                    ${step <= currentStep 
                      ? 'bg-green-600 text-white' 
                      : 'bg-gray-200 text-gray-600'
                    }
                  `}>
                    {step < currentStep ? <CheckCircle className="h-5 w-5" /> : step}
                  </div>
                  {step < 3 && (
                    <div className={`
                      w-16 h-1 mx-2
                      ${step < currentStep ? 'bg-green-600' : 'bg-gray-200'}
                    `} />
                  )}
                </div>
              ))}
            </div>
            
            <div className="mt-2 flex justify-center space-x-16 text-sm text-gray-600">
              <span className={currentStep >= 1 ? 'text-green-600' : ''}>Shipping</span>
              <span className={currentStep >= 2 ? 'text-green-600' : ''}>Payment</span>
              <span className={currentStep >= 3 ? 'text-green-600' : ''}>Review</span>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  
                  {/* Step 1: Shipping Information */}
                  {currentStep === 1 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Truck className="h-5 w-5" />
                          Shipping Information
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="shipping.firstName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>First Name</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="shipping.lastName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Last Name</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name="shipping.phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Number</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="+27 12 345 6789" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="shipping.streetAddress"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Street Address</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="123 Main Street" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="shipping.suburb"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Suburb (Optional)</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="shipping.city"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>City</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="shipping.province"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Province</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select province" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {SOUTH_AFRICAN_PROVINCES.map((province) => (
                                      <SelectItem key={province} value={province}>
                                        {province}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="shipping.postalCode"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Postal Code</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name="shipping.deliveryInstructions"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Delivery Instructions (Optional)</FormLabel>
                              <FormControl>
                                <Textarea 
                                  {...field} 
                                  placeholder="Any special delivery instructions..."
                                  rows={3}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="flex justify-end">
                          <Button type="button" onClick={nextStep}>
                            Continue to Payment
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Step 2: Payment Method */}
                  {currentStep === 2 && (
                    <div className="space-y-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <CreditCard className="h-5 w-5" />
                            Payment Method
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <FormField
                            control={form.control}
                            name="paymentMethod"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    className="space-y-3"
                                  >
                                    <div className="flex items-center space-x-2 p-4 border rounded-lg">
                                      <RadioGroupItem value="paystack" id="paystack" />
                                      <Label htmlFor="paystack" className="flex-1 cursor-pointer">
                                        <div className="flex items-center justify-between">
                                          <div>
                                            <div className="font-semibold">Paystack Payment</div>
                                            <div className="text-sm text-gray-600">
                                              Pay securely with card, bank transfer, or mobile money
                                            </div>
                                          </div>
                                          <Badge variant="secondary">Recommended</Badge>
                                        </div>
                                      </Label>
                                    </div>
                                  </RadioGroup>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          {paymentConfig && (
                            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                              <div className="flex items-center gap-2 mb-2">
                                <Shield className="h-4 w-4 text-blue-600" />
                                <span className="text-sm font-medium text-blue-800">
                                  Supported Payment Methods
                                </span>
                              </div>
                              <div className="text-xs text-blue-700">
                                {paymentConfig.supportedChannels.join(', ')}
                              </div>
                              {paymentConfig.testMode && (
                                <Badge variant="outline" className="mt-2 text-xs">
                                  Test Mode Active
                                </Badge>
                              )}
                            </div>
                          )}
                        </CardContent>
                      </Card>

                      {/* Billing Address */}
                      <Card>
                        <CardHeader>
                          <CardTitle>Billing Address</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <FormField
                            control={form.control}
                            name="billing.sameAsShipping"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel>
                                    Same as shipping address
                                  </FormLabel>
                                </div>
                              </FormItem>
                            )}
                          />

                          {!sameAsShipping && (
                            <div className="mt-4 space-y-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                  control={form.control}
                                  name="billing.firstName"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>First Name</FormLabel>
                                      <FormControl>
                                        <Input {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={form.control}
                                  name="billing.lastName"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Last Name</FormLabel>
                                      <FormControl>
                                        <Input {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
                              {/* Additional billing fields... */}
                            </div>
                          )}
                        </CardContent>
                      </Card>

                      <div className="flex justify-between">
                        <Button type="button" variant="outline" onClick={prevStep}>
                          Back to Shipping
                        </Button>
                        <Button type="button" onClick={nextStep}>
                          Review Order
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Review & Place Order */}
                  {currentStep === 3 && (
                    <div className="space-y-6">
                      {/* Order Review */}
                      <Card>
                        <CardHeader>
                          <CardTitle>Review Your Order</CardTitle>
                        </CardHeader>
                        <CardContent>
                          {/* Cart validation warnings */}
                          {cartValidation && !cartValidation.valid && (
                            <Alert className="mb-4">
                              <AlertTriangle className="h-4 w-4" />
                              <AlertDescription>
                                Some items in your cart may no longer be available. Please review below.
                              </AlertDescription>
                            </Alert>
                          )}

                          {/* Order items */}
                          <div className="space-y-3 mb-6">
                            {cart.items.map((item: any) => (
                              <div key={item.id} className="flex justify-between items-center py-2 border-b">
                                <div className="flex items-center gap-3">
                                  <img 
                                    src={item.product_image} 
                                    alt={item.product_name}
                                    className="w-12 h-12 object-cover rounded"
                                  />
                                  <div>
                                    <div className="font-medium">{item.product_name}</div>
                                    <div className="text-sm text-gray-600">Qty: {item.quantity}</div>
                                  </div>
                                </div>
                                <div className="font-semibold">
                                  R{(parseFloat(item.product_price) * item.quantity).toFixed(2)}
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>

                      {/* Customer Notes */}
                      <Card>
                        <CardHeader>
                          <CardTitle>Order Notes (Optional)</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <FormField
                            control={form.control}
                            name="customerNotes"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Textarea 
                                    {...field} 
                                    placeholder="Any special instructions for your order..."
                                    rows={3}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </CardContent>
                      </Card>

                      {/* Terms & Conditions */}
                      <Card>
                        <CardContent className="pt-6">
                          <FormField
                            control={form.control}
                            name="termsAccepted"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel className="text-sm">
                                    I accept the{' '}
                                    <a href="/terms" className="text-blue-600 hover:underline">
                                      Terms & Conditions
                                    </a>{' '}
                                    and{' '}
                                    <a href="/privacy" className="text-blue-600 hover:underline">
                                      Privacy Policy
                                    </a>
                                  </FormLabel>
                                </div>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </CardContent>
                      </Card>

                      <div className="flex justify-between">
                        <Button type="button" variant="outline" onClick={prevStep}>
                          Back to Payment
                        </Button>
                        <Button 
                          type="submit" 
                          disabled={isProcessing}
                          className="min-w-[200px]"
                        >
                          {isProcessing ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                              Processing...
                            </>
                          ) : (
                            `Place Order • ${cart.summary.total}`
                          )}
                        </Button>
                      </div>
                    </div>
                  )}
                </form>
              </Form>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Order Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Items */}
                  <div className="space-y-3">
                    {cart?.items?.slice(0, 3).map((item: any) => (
                      <div key={item.id} className="flex gap-3">
                        <img 
                          src={item.product_image} 
                          alt={item.product_name}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium line-clamp-2">
                            {item.product_name}
                          </div>
                          <div className="text-sm text-gray-600">
                            Qty: {item.quantity}
                          </div>
                        </div>
                        <div className="text-sm font-semibold">
                          R{item.product_price}
                        </div>
                      </div>
                    ))}
                    
                    {cart?.items && cart.items.length > 3 && (
                      <div className="text-sm text-gray-600 text-center pt-2 border-t">
                        +{cart.items.length - 3} more items
                      </div>
                    )}
                  </div>

                  <Separator />

                  {/* Pricing */}
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span>{cart?.summary?.subtotal}</span>
                    </div>
                    
                    {cart?.summary?.savings && parseFloat(cart.summary.savings.replace('R', '')) > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>You save</span>
                        <span>-{cart.summary.savings}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax (15%)</span>
                      <span>{cart?.summary?.tax}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping</span>
                      <span className={cart?.summary?.freeShippingEligible ? 'text-green-600' : ''}>
                        {cart?.summary?.freeShippingEligible ? 'FREE' : cart?.summary?.shipping}
                      </span>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span className="text-green-600">{cart?.summary?.total}</span>
                  </div>

                  {/* Free shipping progress */}
                  {cart?.summary && !cart.summary.freeShippingEligible && (
                    <div className="p-3 bg-green-50 rounded-lg text-sm">
                      <div className="text-green-800 font-medium mb-1">
                        Add R{cart.summary.freeShippingRemaining} for free shipping
                      </div>
                      <div className="w-full bg-green-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full"
                          style={{ 
                            width: `${Math.max(10, (500 - parseFloat(cart.summary.freeShippingRemaining)) / 500 * 100)}%` 
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Security badges */}
                  <div className="pt-4 border-t">
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                      <Shield className="h-4 w-4" />
                      <span>SSL Secured Checkout</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle className="h-4 w-4" />
                      <span>Money-back Guarantee</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}