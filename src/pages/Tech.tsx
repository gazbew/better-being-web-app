import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { NavigationPrimary } from '../components/NavigationPrimary';
import FooterPrimary from '../components/FooterPrimary';

const Tech: React.FC = () => {
  return (
    <div className="min-h-screen">
      <NavigationPrimary />
      <div className="bg-gradient-to-br from-green-50 to-blue-50 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Technology & Innovation</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Bridging ancient wisdom with modern technology for conscious wellness solutions
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card>
            <CardHeader>
              <CardTitle>Our Tech Stack</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>E-commerce platform optimization</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Customer relationship management</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Inventory management systems</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Digital wellness tracking</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Sustainable packaging solutions</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Innovation Focus</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>Personalized wellness recommendations</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>AI-powered health insights</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>Sustainable supply chain tracking</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>Community platform development</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>Mobile wellness applications</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Digital Wellness</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-4xl mb-4">📱</div>
              <p className="text-gray-700">
                Mobile apps and digital tools to support your wellness journey
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-center">Data Analytics</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-4xl mb-4">📊</div>
              <p className="text-gray-700">
                Advanced analytics to understand wellness patterns and outcomes
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-center">Sustainability Tech</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-4xl mb-4">🌍</div>
              <p className="text-gray-700">
                Technology solutions for environmental impact tracking
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Tech Partnership Opportunities</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-6">
              We're always looking for innovative technology partners to help us advance 
              conscious wellness and sustainable living solutions.
            </p>
            <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors">
              Partner With Us
            </button>
          </CardContent>
        </Card>
      </div>
      </div>
      <FooterPrimary />
    </div>
  );
};

export default Tech;