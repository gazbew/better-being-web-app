import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { NavigationPrimary } from '../components/NavigationPrimary';
import FooterPrimary from '../components/FooterPrimary';

const Community: React.FC = () => {
  return (
    <div className="min-h-screen">
      <NavigationPrimary />
      <div className="bg-gradient-to-br from-green-50 to-blue-50 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Community</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join a heart-centered community committed to conscious wellness and sustainable living
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <span className="text-2xl mr-2">🌱</span>
                Wellness Circle
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                Connect with like-minded individuals on their wellness journey. Share experiences, 
                tips, and support each other's growth.
              </p>
              <button className="text-green-600 hover:text-green-700 font-semibold">
                Join the Circle →
              </button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <span className="text-2xl mr-2">📚</span>
                Educational Hub
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                Access exclusive content, webinars, and workshops on natural health, 
                nutrition, and sustainable living practices.
              </p>
              <button className="text-green-600 hover:text-green-700 font-semibold">
                Explore Resources →
              </button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <span className="text-2xl mr-2">🤝</span>
                Support Network
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                Get guidance from wellness experts and connect with others who understand 
                your health challenges and goals.
              </p>
              <button className="text-green-600 hover:text-green-700 font-semibold">
                Find Support →
              </button>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card>
            <CardHeader>
              <CardTitle>Community Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-l-4 border-green-500 pl-4">
                  <h3 className="font-semibold">Monthly Wellness Workshops</h3>
                  <p className="text-gray-600 text-sm">Learn about natural remedies and holistic health</p>
                  <p className="text-xs text-gray-500">Every first Saturday</p>
                </div>
                <div className="border-l-4 border-blue-500 pl-4">
                  <h3 className="font-semibold">Sustainable Living Meetups</h3>
                  <p className="text-gray-600 text-sm">Share tips for eco-friendly lifestyle choices</p>
                  <p className="text-xs text-gray-500">Bi-weekly online</p>
                </div>
                <div className="border-l-4 border-purple-500 pl-4">
                  <h3 className="font-semibold">Wellness Challenges</h3>
                  <p className="text-gray-600 text-sm">Join community-wide health and wellness challenges</p>
                  <p className="text-xs text-gray-500">Quarterly</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Success Stories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <blockquote className="border-l-4 border-green-500 pl-4 italic">
                  "The community support helped me stay committed to my wellness journey. 
                  I've never felt more energized and healthy!"
                </blockquote>
                <p className="text-sm text-gray-600">- Sarah, Cape Town</p>
                
                <blockquote className="border-l-4 border-blue-500 pl-4 italic">
                  "Finding others who understand natural health has been incredible. 
                  The knowledge sharing is invaluable."
                </blockquote>
                <p className="text-sm text-gray-600">- Michael, Johannesburg</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Join Our Community</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="First Name"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <input
                type="email"
                placeholder="Email Address"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">Interests (select all that apply):</p>
                <div className="grid grid-cols-2 gap-2">
                  {['Natural Health', 'Nutrition', 'Sustainable Living', 'Mindfulness', 'Herbal Remedies', 'Community Events'].map((interest) => (
                    <label key={interest} className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span className="text-sm">{interest}</span>
                    </label>
                  ))}
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
              >
                Join Our Community
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

export default Community;