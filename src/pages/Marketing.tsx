import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { NavigationPrimary } from '../components/NavigationPrimary';
import FooterPrimary from '../components/FooterPrimary';

const Marketing: React.FC = () => {
  return (
    <div className="min-h-screen">
      <NavigationPrimary />
      <div className="bg-gradient-to-br from-green-50 to-blue-50 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Marketing Partnership</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join forces with Our Grounds to promote conscious wellness and sustainable living
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card>
            <CardHeader>
              <CardTitle>Brand Partnership Opportunities</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Affiliate marketing programs</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Influencer collaborations</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Content co-creation</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Event partnerships</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Cross-promotional campaigns</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Marketing Resources</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>High-quality product images</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>Brand guidelines and assets</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>Educational content library</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>Social media templates</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>Marketing support team</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Affiliate Program</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">15%</div>
              <p className="text-gray-600 mb-4">Commission on all sales</p>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Easy tracking system</li>
                <li>• Monthly payouts</li>
                <li>• Marketing materials provided</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-center">Influencer Collaboration</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">Custom</div>
              <p className="text-gray-600 mb-4">Partnership packages</p>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Product gifting</li>
                <li>• Exclusive discount codes</li>
                <li>• Long-term partnerships</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-center">Content Partnership</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">Co-op</div>
              <p className="text-gray-600 mb-4">Marketing campaigns</p>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Shared content creation</li>
                <li>• Cross-platform promotion</li>
                <li>• Event collaborations</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Our Marketing Values</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">Authentic Messaging</h3>
                <p className="text-gray-700 mb-4">
                  We believe in honest, transparent communication about our products and their benefits. 
                  Our marketing focuses on education and genuine wellness outcomes.
                </p>
                <ul className="space-y-2 text-gray-700">
                  <li>• Evidence-based claims</li>
                  <li>• Real customer testimonials</li>
                  <li>• Educational content focus</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4">Sustainable Practices</h3>
                <p className="text-gray-700 mb-4">
                  Our marketing efforts align with our commitment to sustainability and 
                  environmental responsibility in all communications.
                </p>
                <ul className="space-y-2 text-gray-700">
                  <li>• Eco-friendly materials</li>
                  <li>• Digital-first approach</li>
                  <li>• Community-focused messaging</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Partner With Us</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Name/Company"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                <option value="">Select Partnership Type</option>
                <option value="affiliate">Affiliate Program</option>
                <option value="influencer">Influencer Collaboration</option>
                <option value="content">Content Partnership</option>
                <option value="event">Event Partnership</option>
                <option value="other">Other</option>
              </select>
              <textarea
                placeholder="Tell us about your audience and how you'd like to partner with Our Grounds"
                rows={4}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
              >
                Submit Partnership Inquiry
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

export default Marketing;