import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  CheckCircle, Package, Truck, Mail, Phone,
  Download, Share2, Copy, Clock, MapPin,
  ArrowRight, Home, ShoppingBag, User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/hooks/useAuth';
import confetti from 'canvas-confetti';

interface OrderDetails {
  id: string;
  orderNumber: string;
  createdAt: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  shipping: {
    address: string;
    address2?: string;
    city: string;
    province: string;
    postalCode: string;
    country: string;
    method: string;
    trackingNumber?: string;
    estimatedDelivery: string;
  };
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
    image: string;
  }>;
  payment: {
    method: string;
    last4?: string;
    brand?: string;
  };
  totals: {
    subtotal: number;
    shipping: number;
    tax: number;
    discount: number;
    total: number;
  };
}

const OrderTrackingTimeline: React.FC<{ status: string }> = ({ status }) => {
  const steps = [
    { id: 'pending', label: 'Order Placed', icon: <CheckCircle className="w-5 h-5" /> },
    { id: 'processing', label: 'Processing', icon: <Package className="w-5 h-5" /> },
    { id: 'shipped', label: 'Shipped', icon: <Truck className="w-5 h-5" /> },
    { id: 'delivered', label: 'Delivered', icon: <CheckCircle className="w-5 h-5" /> },
  ];

  const currentStepIndex = steps.findIndex(step => step.id === status);

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-8">
        {steps.map((step, index) => (
          <div key={step.id} className="flex flex-col items-center flex-1">
            <div className={`
              w-12 h-12 rounded-full flex items-center justify-center mb-2
              ${index <= currentStepIndex 
                ? 'bg-primary text-white' 
                : 'bg-gray-200 text-gray-400'}
            `}>
              {step.icon}
            </div>
            <span className={`text-sm font-medium ${
              index <= currentStepIndex ? 'text-foreground' : 'text-muted-foreground'
            }`}>
              {step.label}
            </span>
            {index < steps.length - 1 && (
              <div className={`
                absolute top-6 left-0 w-full h-0.5
                ${index < currentStepIndex ? 'bg-primary' : 'bg-gray-200'}
              `} style={{ 
                left: `${(100 / (steps.length - 1)) * index + (50 / (steps.length - 1))}%`,
                width: `${100 / (steps.length - 1)}%`
              }} />
            )}
          </div>
        ))}
      </div>
      <Progress value={(currentStepIndex + 1) / steps.length * 100} className="h-2" />
    </div>
  );
};

const RelatedProducts: React.FC = () => {
  const products = [
    { id: '1', name: 'Vitamin D3', price: 299, image: '/api/placeholder/200/200' },
    { id: '2', name: 'Omega-3', price: 399, image: '/api/placeholder/200/200' },
    { id: '3', name: 'Probiotics', price: 449, image: '/api/placeholder/200/200' },
    { id: '4', name: 'Magnesium', price: 249, image: '/api/placeholder/200/200' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>You Might Also Like</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {products.map((product) => (
            <Link 
              key={product.id} 
              to={`/products/${product.id}`}
              className="group"
            >
              <div className="aspect-square bg-gray-100 rounded-lg mb-2 overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                />
              </div>
              <h4 className="font-medium text-sm group-hover:text-primary transition-colors">
                {product.name}
              </h4>
              <p className="text-sm font-bold">R{product.price}</p>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const OrderConfirmation: React.FC = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Trigger confetti animation
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    // Fetch order details
    fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      // Mock order data - replace with actual API call
      const mockOrder: OrderDetails = {
        id: orderId || '1',
        orderNumber: 'ORD-2025-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
        createdAt: new Date().toISOString(),
        status: 'processing',
        customer: {
          firstName: user?.firstName || 'John',
          lastName: user?.lastName || 'Doe',
          email: user?.email || 'john@example.com',
          phone: '+27 123 456 7890'
        },
        shipping: {
          address: '123 Main Street',
          city: 'Cape Town',
          province: 'Western Cape',
          postalCode: '8001',
          country: 'South Africa',
          method: 'Standard Shipping',
          estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString()
        },
        items: [
          {
            id: '1',
            name: 'Premium Multivitamin',
            quantity: 2,
            price: 599,
            image: '/api/placeholder/100/100'
          },
          {
            id: '2',
            name: 'Omega-3 Fish Oil',
            quantity: 1,
            price: 399,
            image: '/api/placeholder/100/100'
          }
        ],
        payment: {
          method: 'Credit Card',
          last4: '4242',
          brand: 'Visa'
        },
        totals: {
          subtotal: 1597,
          shipping: 0,
          tax: 239.55,
          discount: 159.70,
          total: 1676.85
        }
      };

      setOrder(mockOrder);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching order:', error);
      setLoading(false);
    }
  };

  const handleCopyOrderNumber = () => {
    if (order) {
      navigator.clipboard.writeText(order.orderNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadInvoice = () => {
    // Implement invoice download logic
    console.log('Downloading invoice...');
  };

  const handleShareOrder = () => {
    if (navigator.share && order) {
      navigator.share({
        title: 'Order Confirmation',
        text: `Order ${order.orderNumber} has been confirmed!`,
        url: window.location.href
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p>Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Order Not Found</h2>
            <p className="text-muted-foreground mb-4">
              We couldn't find the order you're looking for.
            </p>
            <Button onClick={() => navigate('/')}>Return to Home</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
          <p className="text-lg text-muted-foreground mb-4">
            Thank you for your purchase, {order.customer.firstName}!
          </p>
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-sm text-muted-foreground">Order Number:</span>
            <Badge variant="secondary" className="text-base px-3 py-1">
              {order.orderNumber}
            </Badge>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleCopyOrderNumber}
              className="h-8 w-8 p-0"
            >
              {copied ? <CheckCircle className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            A confirmation email has been sent to {order.customer.email}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          <Button onClick={handleDownloadInvoice} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Download Invoice
          </Button>
          <Button onClick={handleShareOrder} variant="outline">
            <Share2 className="w-4 h-4 mr-2" />
            Share Order
          </Button>
          <Button onClick={() => navigate('/account/orders')} variant="outline">
            <User className="w-4 h-4 mr-2" />
            View All Orders
          </Button>
        </div>

        {/* Order Tracking Timeline */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Order Status</CardTitle>
          </CardHeader>
          <CardContent>
            <OrderTrackingTimeline status={order.status} />
            <Alert className="mt-4">
              <Truck className="h-4 w-4" />
              <AlertDescription>
                <strong>Estimated Delivery:</strong> {order.shipping.estimatedDelivery}
                {order.shipping.trackingNumber && (
                  <span className="block mt-1">
                    <strong>Tracking Number:</strong> {order.shipping.trackingNumber}
                  </span>
                )}
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Items */}
            <Card>
              <CardHeader>
                <CardTitle>Order Items</CardTitle>
              </CardHeader>
              <CardContent>
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 py-3 border-b last:border-0">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                    </div>
                    <p className="font-semibold">R{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Shipping Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-medium">
                  {order.customer.firstName} {order.customer.lastName}
                </p>
                <p className="text-sm text-muted-foreground">
                  {order.shipping.address}<br />
                  {order.shipping.address2 && <>{order.shipping.address2}<br /></>}
                  {order.shipping.city}, {order.shipping.province} {order.shipping.postalCode}<br />
                  {order.shipping.country}
                </p>
                <div className="flex items-center gap-4 mt-3 text-sm">
                  <span className="flex items-center gap-1">
                    <Mail className="w-4 h-4" />
                    {order.customer.email}
                  </span>
                  <span className="flex items-center gap-1">
                    <Phone className="w-4 h-4" />
                    {order.customer.phone}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>R{order.totals.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span>
                    {order.totals.shipping === 0 ? (
                      <Badge variant="secondary" className="text-xs">FREE</Badge>
                    ) : (
                      `R${order.totals.shipping.toFixed(2)}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax (VAT 15%)</span>
                  <span>R{order.totals.tax.toFixed(2)}</span>
                </div>
                {order.totals.discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount</span>
                    <span>-R{order.totals.discount.toFixed(2)}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total Paid</span>
                  <span>R{order.totals.total.toFixed(2)}</span>
                </div>
                <div className="pt-2">
                  <p className="text-sm text-muted-foreground">
                    Payment Method: {order.payment.method}
                    {order.payment.brand && order.payment.last4 && (
                      <span className="block">
                        {order.payment.brand} ending in {order.payment.last4}
                      </span>
                    )}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Next Steps */}
            <Card>
              <CardHeader>
                <CardTitle>What's Next?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-primary">1</span>
                  </div>
                  <div>
                    <p className="font-medium text-sm">Order Processing</p>
                    <p className="text-xs text-muted-foreground">
                      We're preparing your order for shipment
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-gray-400">2</span>
                  </div>
                  <div>
                    <p className="font-medium text-sm">Shipment Notification</p>
                    <p className="text-xs text-muted-foreground">
                      You'll receive tracking details via email
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-gray-400">3</span>
                  </div>
                  <div>
                    <p className="font-medium text-sm">Delivery</p>
                    <p className="text-xs text-muted-foreground">
                      Your order will arrive by {order.shipping.estimatedDelivery}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Continue Shopping */}
            <div className="space-y-3">
              <Button className="w-full" onClick={() => navigate('/products')}>
                <ShoppingBag className="w-4 h-4 mr-2" />
                Continue Shopping
              </Button>
              <Button variant="outline" className="w-full" onClick={() => navigate('/')}>
                <Home className="w-4 h-4 mr-2" />
                Return to Home
              </Button>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-12">
          <RelatedProducts />
        </div>

        {/* Customer Support */}
        <Card className="mt-8 bg-primary/5 border-primary/20">
          <CardContent className="p-6">
            <div className="text-center">
              <h3 className="font-bold text-lg mb-2">Need Help?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Our customer support team is here to assist you with any questions about your order.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button variant="outline" size="sm">
                  <Mail className="w-4 h-4 mr-2" />
                  support@betterbeing.com
                </Button>
                <Button variant="outline" size="sm">
                  <Phone className="w-4 h-4 mr-2" />
                  0800-WELLNESS
                </Button>
                <Button variant="outline" size="sm">
                  <Clock className="w-4 h-4 mr-2" />
                  Mon-Fri 9AM-5PM
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OrderConfirmation;
