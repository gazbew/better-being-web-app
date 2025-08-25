import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { NavigationPrimary } from '../components/NavigationPrimary';
import FooterPrimary from '../components/FooterPrimary';

const StoreLocator: React.FC = () => {
  return (
    <div className="min-h-screen">
      <NavigationPrimary />
      <div className="bg-gradient-to-br from-green-50 to-blue-50 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Store Locator</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Find Our Grounds products at these trusted retail partners across South Africa
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card>
            <CardHeader>
              <CardTitle>Cape Town Locations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-l-4 border-green-500 pl-4">
                  <h3 className="font-semibold">Our Grounds Head Office</h3>
                  <p className="text-gray-600">171 Blaauwberg Rd, Table View, Cape Town 7441</p>
                  <p className="text-sm text-gray-500">Main distribution center</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Become a Stockist</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Interested in stocking Our Grounds products? Join our network of wellness retailers.
              </p>
              <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors">
                Apply Now
              </button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Find Products Near You</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Health Stores</h3>
                <p className="text-gray-600 text-sm">Available at select natural health retailers</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Pharmacies</h3>
                <p className="text-gray-600 text-sm">Stocked at wellness-focused pharmacies</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Online</h3>
                <p className="text-gray-600 text-sm">Order directly from our website</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      </div>
      <FooterPrimary />
    </div>
  );
};

export default StoreLocator;