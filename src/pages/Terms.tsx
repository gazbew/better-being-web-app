import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Terms = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="mb-8">
            <Link to="/" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Terms & Conditions</h1>
            <p className="text-gray-600 mt-2">Last updated: January 2025</p>
          </div>

          <div className="prose prose-gray max-w-none">
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing and using Better Being's website and services, you accept and agree to be bound by the terms and provision of this agreement.
            </p>

            <h2>2. Products and Services</h2>
            <p>
              Better Being provides natural wellness products including vitamins, supplements, and health-related items. All product descriptions, prices, and availability are subject to change without notice.
            </p>

            <h2>3. Orders and Payment</h2>
            <p>
              All orders are subject to acceptance and availability. We reserve the right to refuse or cancel any order. Payment must be received before products are shipped.
            </p>

            <h2>4. Shipping and Delivery</h2>
            <p>
              We aim to process and ship orders within 1-2 business days. Delivery times may vary based on location and shipping method selected.
            </p>

            <h2>5. Returns and Refunds</h2>
            <p>
              We offer a 30-day return policy for unopened products in original packaging. Refunds will be processed within 5-7 business days of receiving returned items.
            </p>

            <h2>6. Privacy Policy</h2>
            <p>
              Your privacy is important to us. Please review our Privacy Policy to understand how we collect, use, and protect your information.
            </p>

            <h2>7. Limitation of Liability</h2>
            <p>
              Better Being shall not be liable for any indirect, incidental, special, or consequential damages arising from the use of our products or services.
            </p>

            <h2>8. Contact Information</h2>
            <p>
              If you have any questions about these Terms & Conditions, please contact us at legal@betterbeing.co.za
            </p>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/privacy">
                <Button variant="outline">View Privacy Policy</Button>
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

export default Terms;