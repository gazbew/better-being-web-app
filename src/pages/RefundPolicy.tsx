import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { NavigationPrimary } from '../components/NavigationPrimary';
import FooterPrimary from '../components/FooterPrimary';

const RefundPolicy: React.FC = () => {
  return (
    <div className="min-h-screen">
      <NavigationPrimary />
      <div className="bg-gradient-to-br from-green-50 to-blue-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Refund Policy</h1>
          <p className="text-xl text-gray-600">
            Your satisfaction is our priority. Please review our refund and return policy below.
          </p>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>30-Day Money-Back Guarantee</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                We stand behind the quality of our products. If you're not completely satisfied with your purchase, 
                you may return it within 30 days of delivery for a full refund.
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Products must be in original, unopened condition</li>
                <li>Original packaging and labels must be intact</li>
                <li>Proof of purchase required</li>
                <li>Customer responsible for return shipping costs</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Digital Products</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                For digital products such as recipe e-books and wellness programs:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Refunds available within 7 days of purchase</li>
                <li>Must demonstrate technical issues or significant content discrepancies</li>
                <li>No refunds after program completion or e-book download</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Consultation Services</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                For wellness consultations and personalized programs:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Cancellations must be made 24 hours before scheduled appointment</li>
                <li>Refunds for multi-session programs available before second session</li>
                <li>Partial refunds calculated based on sessions completed</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Damaged or Defective Products</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                If you receive a damaged or defective product:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Contact us within 48 hours of delivery</li>
                <li>Provide photos of the damaged product and packaging</li>
                <li>We'll arrange immediate replacement or full refund</li>
                <li>No return shipping required for damaged items</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>How to Request a Refund</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Step 1: Contact Us</h4>
                  <p className="text-gray-700">Email info@our-grounds.com with your order number and reason for return</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Step 2: Return Authorization</h4>
                  <p className="text-gray-700">We'll provide return instructions and authorization number</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Step 3: Ship Product</h4>
                  <p className="text-gray-700">Package securely and ship to our returns address</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Step 4: Refund Processing</h4>
                  <p className="text-gray-700">Refunds processed within 5-7 business days of receipt</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p><strong>Email:</strong> info@our-grounds.com</p>
                <p><strong>Address:</strong> 171 Blaauwberg Rd, Table View, Cape Town 7441</p>
                <p><strong>Response Time:</strong> Within 24 hours during business days</p>
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

export default RefundPolicy;