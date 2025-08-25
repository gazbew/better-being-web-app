import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Eye, Lock, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Privacy = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="mb-8">
            <Link to="/" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
            <p className="text-gray-600 mt-2">Last updated: January 2025</p>
          </div>

          <div className="grid gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-green-600" />
                  Data Protection
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  We are committed to protecting your personal information and your right to privacy. This policy explains how we collect, use, and safeguard your data.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Eye className="w-5 h-5 mr-2 text-blue-600" />
                  Information We Collect
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-2 text-gray-600">
                  <li>Personal information (name, email, phone number)</li>
                  <li>Billing and shipping addresses</li>
                  <li>Payment information (processed securely)</li>
                  <li>Order history and preferences</li>
                  <li>Website usage data and cookies</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lock className="w-5 h-5 mr-2 text-purple-600" />
                  How We Use Your Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-2 text-gray-600">
                  <li>Process and fulfill your orders</li>
                  <li>Communicate about your orders and account</li>
                  <li>Provide customer support</li>
                  <li>Send promotional emails (with your consent)</li>
                  <li>Improve our products and services</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 mr-2 text-orange-600" />
                  Information Sharing
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  We do not sell, trade, or rent your personal information to third parties. We may share your information only in these circumstances:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-600">
                  <li>With service providers who help us operate our business</li>
                  <li>When required by law or to protect our rights</li>
                  <li>In connection with a business transfer or merger</li>
                  <li>With your explicit consent</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="prose prose-gray max-w-none">
            <h2>Your Rights</h2>
            <p>
              You have the right to access, update, or delete your personal information. You can also opt out of marketing communications at any time.
            </p>

            <h2>Data Security</h2>
            <p>
              We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
            </p>

            <h2>Cookies</h2>
            <p>
              We use cookies to enhance your browsing experience, analyze site traffic, and personalize content. You can control cookie settings through your browser.
            </p>

            <h2>Children's Privacy</h2>
            <p>
              Our services are not intended for children under 13. We do not knowingly collect personal information from children under 13.
            </p>

            <h2>Changes to This Policy</h2>
            <p>
              We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page.
            </p>

            <h2>Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at privacy@betterbeing.co.za
            </p>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/terms">
                <Button variant="outline">View Terms & Conditions</Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline">Contact Us</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;