import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { NavigationPrimary } from '../components/NavigationPrimary';
import FooterPrimary from '../components/FooterPrimary';

const Farming: React.FC = () => {
  return (
    <div className="min-h-screen">
      <NavigationPrimary />
      <div className="bg-gradient-to-br from-green-50 to-blue-50 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Sustainable Farming Solutions</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Natural solutions for bigger yields - revolutionizing agriculture with probiotic soil health
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card>
            <CardHeader>
              <CardTitle>Keep Growing - Universal Probiotic</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <span className="text-2xl font-bold text-green-600">R135.00</span>
                <span className="text-gray-500 ml-2">per 500ml bottle</span>
              </div>
              <p className="text-gray-700 mb-4">
                Keep Growing is a universal probiotic that improves soil health, promotes greener grass, 
                enhances pest control, and supports better growth for fruits, vegetables, and flowers.
              </p>
              <ul className="space-y-2 text-sm text-gray-600 mb-4">
                <li>✓ Covers 50 square metres of garden</li>
                <li>✓ Restores soil nutrients naturally</li>
                <li>✓ Enhances plant immunity</li>
                <li>✓ Reduces need for chemical fertilizers</li>
                <li>✓ Improves water retention</li>
              </ul>
              <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors">
                Order Now
              </button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>How It Works</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start">
                  <span className="bg-green-100 text-green-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3 mt-1">1</span>
                  <div>
                    <h4 className="font-semibold">Soil Microbiome Restoration</h4>
                    <p className="text-gray-600 text-sm">Introduces beneficial bacteria to restore natural soil balance</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="bg-green-100 text-green-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3 mt-1">2</span>
                  <div>
                    <h4 className="font-semibold">Nutrient Enhancement</h4>
                    <p className="text-gray-600 text-sm">Improves nutrient availability and uptake by plants</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="bg-green-100 text-green-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3 mt-1">3</span>
                  <div>
                    <h4 className="font-semibold">Natural Pest Control</h4>
                    <p className="text-gray-600 text-sm">Strengthens plant immunity against pests and diseases</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="bg-green-100 text-green-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3 mt-1">4</span>
                  <div>
                    <h4 className="font-semibold">Sustainable Growth</h4>
                    <p className="text-gray-600 text-sm">Promotes long-term soil health and productivity</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">For Vegetables</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-4xl mb-4">🥕</div>
              <p className="text-gray-700">
                Enhance vegetable growth, improve taste, and increase nutritional content naturally.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-center">For Flowers</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-4xl mb-4">🌸</div>
              <p className="text-gray-700">
                Promote vibrant blooms, stronger stems, and longer-lasting flower displays.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-center">For Lawns</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-4xl mb-4">🌱</div>
              <p className="text-gray-700">
                Create greener, healthier grass with improved drought resistance and density.
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>The Future of Farming</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">Why Choose Natural Solutions?</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Reduces dependency on chemical fertilizers</li>
                  <li>• Improves long-term soil health</li>
                  <li>• Environmentally sustainable approach</li>
                  <li>• Cost-effective over time</li>
                  <li>• Safer for families and pets</li>
                  <li>• Supports biodiversity</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4">Application Instructions</h3>
                <ol className="space-y-2 text-gray-700">
                  <li>1. Dilute 50ml in 10 litres of water</li>
                  <li>2. Apply to soil around plants</li>
                  <li>3. Water thoroughly after application</li>
                  <li>4. Repeat every 2-3 weeks</li>
                  <li>5. Best applied in early morning or evening</li>
                </ol>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Get Started with Sustainable Farming</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <p className="text-gray-700 mb-6">
                Ready to transform your garden or farm with natural probiotic solutions? 
                Contact us for bulk orders or farming consultation.
              </p>
              <div className="space-y-4">
                <button className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold mr-4">
                  Order Keep Growing
                </button>
                <button className="border border-green-600 text-green-600 px-8 py-3 rounded-lg hover:bg-green-50 transition-colors font-semibold">
                  Farming Consultation
                </button>
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

export default Farming;