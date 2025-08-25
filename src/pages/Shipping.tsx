import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Truck, Clock, MapPin, Package, Shield, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const Shipping = () => {
  const shippingOptions = [
    {
      name: 'Standard Delivery',
      price: 'R50',
      time: '3-5 business days',
      description: 'Reliable delivery to your door',
      icon: Truck,
    },
    {
      name: 'Express Delivery',
      price: 'R100',
      time: '1-2 business days',
      description: 'Fast delivery for urgent orders',
      icon: Clock,
    },
    {
      name: 'Same Day Delivery',
      price: 'R150',
      time: 'Same day',
      description: 'Available in major cities',
      icon: MapPin,
    },
    {
      name: 'Free Shipping',
      price: 'Free',
      time: '3-5 business days',
      description: 'On orders over R500',
      icon: Package,
    },
  ];

  const deliveryAreas = [
    { city: 'Cape Town', areas: ['City Bowl', 'Southern Suburbs', 'Northern Suburbs', 'Atlantic Seaboard'] },
    { city: 'Johannesburg', areas: ['Sandton', 'Rosebank', 'Midrand', 'Randburg'] },
    { city: 'Durban', areas: ['Umhlanga', 'Westville', 'Pinetown', 'Chatsworth'] },
    { city: 'Pretoria', areas: ['Centurion', 'Hatfield', 'Menlyn', 'Brooklyn'] },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Shipping Information</h1>
          <p className="text-gray-600 mt-2">Fast, reliable delivery across South Africa</p>
        </div>

        {/* Shipping Options */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Delivery Options</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {shippingOptions.map((option, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <option.icon className="w-12 h-12 text-green-600 mx-auto mb-2" />
                  <CardTitle className="text-lg">{option.name}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="text-2xl font-bold text-green-600 mb-2">
                    {option.price}
                  </div>
                  <Badge variant="outline" className="mb-3">
                    {option.time}
                  </Badge>
                  <p className="text-sm text-gray-600">
                    {option.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Delivery Areas */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Delivery Areas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {deliveryAreas.map((area, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                    {area.city}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {area.areas.map((suburb, subIndex) => (
                      <Badge key={subIndex} variant="secondary">
                        {suburb}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Shipping Policies */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="w-5 h-5 mr-2 text-green-600" />
                Shipping Policy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Processing Time</h4>
                <p className="text-sm text-gray-600">
                  Orders are processed within 1-2 business days. Orders placed after 2 PM on Friday will be processed on Monday.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Tracking</h4>
                <p className="text-sm text-gray-600">
                  You'll receive a tracking number via email once your order ships. Track your package in real-time.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Packaging</h4>
                <p className="text-sm text-gray-600">
                  All products are carefully packaged to ensure they arrive in perfect condition.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="w-5 h-5 mr-2 text-blue-600" />
                Additional Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Free Shipping Threshold</h4>
                <p className="text-sm text-gray-600">
                  Enjoy free standard shipping on all orders over R500. No minimum order for express delivery.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">International Shipping</h4>
                <p className="text-sm text-gray-600">
                  Currently, we only ship within South Africa. International shipping coming soon.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Special Items</h4>
                <p className="text-sm text-gray-600">
                  Some items may require special handling and could have extended delivery times.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Section */}
        <Card>
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h4 className="font-semibold mb-2">What if I'm not home for delivery?</h4>
              <p className="text-sm text-gray-600">
                Our courier will attempt delivery twice. If unsuccessful, the package will be held at the nearest collection point for 5 business days.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Can I change my delivery address?</h4>
              <p className="text-sm text-gray-600">
                You can change your delivery address within 2 hours of placing your order by contacting our customer service team.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Do you deliver on weekends?</h4>
              <p className="text-sm text-gray-600">
                Saturday delivery is available for express and same-day orders in major cities. No Sunday deliveries.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">What about damaged packages?</h4>
              <p className="text-sm text-gray-600">
                If your package arrives damaged, please contact us within 24 hours with photos. We'll arrange a replacement immediately.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-12 text-center">
          <div className="space-y-4">
            <p className="text-gray-600">
              Have more questions about shipping? We're here to help!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact">
                <Button>Contact Support</Button>
              </Link>
              <Link to="/products">
                <Button variant="outline">Start Shopping</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shipping;