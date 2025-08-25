import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { NavigationPrimary } from '../components/NavigationPrimary';
import FooterPrimary from '../components/FooterPrimary';

const InvestorsPool: React.FC = () => {
  return (
    <div className="min-h-screen">
      <NavigationPrimary />
      <div className="bg-gradient-to-br from-green-50 to-blue-50 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Investors Pool</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join us in building a sustainable future through conscious wellness investments
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card>
            <CardHeader>
              <CardTitle>Investment Opportunity</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                Our Grounds represents a unique opportunity to invest in the rapidly growing 
                conscious wellness and sustainable products market in South Africa and beyond.
              </p>
              <ul className="space-y-2 text-gray-700">
                <li>• Growing market demand for natural wellness products</li>
                <li>• Established product line with proven results</li>
                <li>• Strong brand positioning in conscious wellness</li>
                <li>• Experienced team with wellness expertise</li>
                <li>• Scalable business model</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Market Opportunity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900">Wellness Market Growth</h4>
                  <p className="text-gray-600 text-sm">The global wellness market is projected to reach $7 trillion by 2025</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Natural Products Demand</h4>
                  <p className="text-gray-600 text-sm">Increasing consumer preference for natural, sustainable products</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">African Market Potential</h4>
                  <p className="text-gray-600 text-sm">Untapped potential in African wellness and natural products market</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Seed Investment</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-2xl font-bold text-green-600 mb-2">R50K - R250K</div>
              <p className="text-gray-600 mb-4">Early stage investment</p>
              <ul className="text-sm text-gray-700 space-y-1 text-left">
                <li>• Product development support</li>
                <li>• Market expansion funding</li>
                <li>• Equity participation</li>
                <li>• Advisory role opportunity</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-center">Growth Investment</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-2">R250K - R1M</div>
              <p className="text-gray-600 mb-4">Scaling operations</p>
              <ul className="text-sm text-gray-700 space-y-1 text-left">
                <li>• Manufacturing expansion</li>
                <li>• Distribution network growth</li>
                <li>• Marketing and branding</li>
                <li>• Team expansion</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-center">Strategic Investment</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-2xl font-bold text-purple-600 mb-2">R1M+</div>
              <p className="text-gray-600 mb-4">Major partnership</p>
              <ul className="text-sm text-gray-700 space-y-1 text-left">
                <li>• International expansion</li>
                <li>• Research & development</li>
                <li>• Strategic partnerships</li>
                <li>• Board participation</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Why Invest in Our Grounds?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">Strong Fundamentals</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Proven product efficacy and customer satisfaction</li>
                  <li>• Established brand recognition in wellness community</li>
                  <li>• Diversified product portfolio</li>
                  <li>• Multiple revenue streams (products, services, digital)</li>
                  <li>• Experienced leadership team</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4">Growth Potential</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Expanding into new product categories</li>
                  <li>• Growing online and retail presence</li>
                  <li>• International market opportunities</li>
                  <li>• Sustainable and scalable business model</li>
                  <li>• Strong community and customer loyalty</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Investment Process</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="bg-green-100 text-green-600 rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-2">1</div>
                <h4 className="font-semibold mb-2">Initial Inquiry</h4>
                <p className="text-sm text-gray-600">Submit investment interest form</p>
              </div>
              <div className="text-center">
                <div className="bg-blue-100 text-blue-600 rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-2">2</div>
                <h4 className="font-semibold mb-2">Due Diligence</h4>
                <p className="text-sm text-gray-600">Review business plan and financials</p>
              </div>
              <div className="text-center">
                <div className="bg-purple-100 text-purple-600 rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-2">3</div>
                <h4 className="font-semibold mb-2">Terms Discussion</h4>
                <p className="text-sm text-gray-600">Negotiate investment terms</p>
              </div>
              <div className="text-center">
                <div className="bg-orange-100 text-orange-600 rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-2">4</div>
                <h4 className="font-semibold mb-2">Partnership</h4>
                <p className="text-sm text-gray-600">Finalize agreement and onboard</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Investment Inquiry</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Full Name"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="tel"
                  placeholder="Phone Number"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                  <option value="">Investment Range</option>
                  <option value="seed">R50K - R250K (Seed)</option>
                  <option value="growth">R250K - R1M (Growth)</option>
                  <option value="strategic">R1M+ (Strategic)</option>
                </select>
              </div>
              <textarea
                placeholder="Tell us about your investment background and interest in Our Grounds"
                rows={4}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <div className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <span className="text-sm text-gray-600">I agree to receive investment information and updates</span>
              </div>
              <button
                type="submit"
                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
              >
                Submit Investment Inquiry
              </button>
            </form>
          </CardContent>
        </Card>
      </div>
      </div>
      <FooterPrimary />
    </div>
  );
};

export default InvestorsPool;