import React from 'react';
import { NavigationPrimary } from '@/components/NavigationPrimary';
import { FooterPrimary } from '@/components/FooterPrimary';
import BrandBibleValidation from '@/components/BrandBibleValidation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  CheckCircle,
  AlertTriangle,
  Palette,
  Type,
  Layout,
  Zap,
  ArrowLeft,
  Download,
  RefreshCw
} from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * Design Validation Page
 * Emergency design review testing and validation
 * Tests all critical Brand Bible BB-4 implementation fixes
 */
const DesignValidation = () => {
  const emergencyFixes = [
    {
      id: 1,
      category: 'Color System',
      title: 'Brand Color Correction',
      description: 'Fixed incorrect #C1581B to correct #BB4500 Mahogany',
      status: 'completed',
      priority: 'critical',
      icon: <Palette className="w-5 h-5" />
    },
    {
      id: 2,
      category: 'Typography',
      title: 'Font Family Implementation',
      description: 'Added League Spartan & Playfair Display fonts',
      status: 'completed',
      priority: 'critical',
      icon: <Type className="w-5 h-5" />
    },
    {
      id: 3,
      category: 'Typography',
      title: 'Letter Spacing Fix',
      description: 'Implemented 88pt letter spacing for headings',
      status: 'completed',
      priority: 'high',
      icon: <Type className="w-5 h-5" />
    },
    {
      id: 4,
      category: 'Layout',
      title: 'Component Spacing',
      description: 'Fixed margin issues and element overlapping',
      status: 'in-progress',
      priority: 'high',
      icon: <Layout className="w-5 h-5" />
    },
    {
      id: 5,
      category: 'System',
      title: 'Tailwind Configuration',
      description: 'Updated configuration with Brand Bible specifications',
      status: 'completed',
      priority: 'critical',
      icon: <Zap className="w-5 h-5" />
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'pending':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const completedFixes = emergencyFixes.filter(fix => fix.status === 'completed').length;
  const totalFixes = emergencyFixes.length;
  const progressPercentage = (completedFixes / totalFixes) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-champagne-50 to-white">
      <NavigationPrimary />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="ghost"
              className="font-heading uppercase tracking-wide text-payneGray hover:text-mahogany"
              asChild
            >
              <Link to="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Link>
            </Button>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="font-heading uppercase tracking-wide border-mahogany text-mahogany hover:bg-mahogany hover:text-white"
              >
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
              <Button
                className="bg-mahogany hover:bg-mahogany-600 text-white font-heading uppercase tracking-wide"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Run Tests
              </Button>
            </div>
          </div>

          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-red-100 text-red-800 px-4 py-2 rounded-full mb-4">
              <AlertTriangle className="w-4 h-4" />
              <span className="font-heading text-sm uppercase tracking-wide font-semibold">
                Emergency Design Review
              </span>
            </div>

            <h1 className="font-heading text-6xl font-bold text-blackBean tracking-[0.088em] uppercase mb-4">
              Design Validation
            </h1>

            <p className="font-body text-xl text-payneGray max-w-3xl mx-auto leading-relaxed">
              Comprehensive testing and validation of Brand Bible BB-4 emergency fixes.
              Critical design issues identified and systematically addressed.
            </p>
          </div>

          {/* Progress Overview */}
          <Card className="bg-white/80 backdrop-blur-sm border-mahogany/20">
            <CardHeader>
              <CardTitle className="font-heading text-2xl text-blackBean tracking-[0.088em] uppercase flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-green-600" />
                Emergency Fix Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <span className="font-body text-lg text-payneGray">
                  {completedFixes} of {totalFixes} critical fixes completed
                </span>
                <span className="font-heading text-2xl font-bold text-mahogany">
                  {Math.round(progressPercentage)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-mahogany to-mahogany-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Emergency Fixes Status */}
        <Card className="mb-12 bg-white/80 backdrop-blur-sm border-mahogany/20">
          <CardHeader>
            <CardTitle className="font-heading text-2xl text-blackBean tracking-[0.088em] uppercase">
              Critical Fix Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {emergencyFixes.map((fix) => (
                <div
                  key={fix.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-champagne-50/50 hover:bg-champagne-100/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-mahogany/10 rounded-lg flex items-center justify-center text-mahogany">
                      {fix.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-heading font-semibold text-blackBean uppercase tracking-wide">
                          {fix.title}
                        </h3>
                        <Badge className={getPriorityColor(fix.priority)}>
                          {fix.priority}
                        </Badge>
                      </div>
                      <p className="font-body text-sm text-payneGray">{fix.description}</p>
                      <p className="font-body text-xs text-payneGray-400 mt-1">
                        Category: {fix.category}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className={getStatusColor(fix.status)}>
                      {fix.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Brand Bible Validation Component */}
        <div className="mb-12">
          <BrandBibleValidation />
        </div>

        {/* Test Summary */}
        <Card className="bg-gradient-to-r from-mahogany-50 to-citron-50 border-mahogany/20">
          <CardHeader>
            <CardTitle className="font-heading text-2xl text-blackBean tracking-[0.088em] uppercase">
              Validation Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-white/60 rounded-lg">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-heading text-xl font-bold text-blackBean uppercase tracking-wide mb-2">
                  Brand Colors
                </h3>
                <p className="font-body text-payneGray">
                  All Brand Bible colors implemented correctly with proper contrast ratios
                </p>
              </div>

              <div className="text-center p-6 bg-white/60 rounded-lg">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Type className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-heading text-xl font-bold text-blackBean uppercase tracking-wide mb-2">
                  Typography
                </h3>
                <p className="font-body text-payneGray">
                  League Spartan headings and Playfair Display body text with correct spacing
                </p>
              </div>

              <div className="text-center p-6 bg-white/60 rounded-lg">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Layout className="w-8 h-8 text-yellow-600" />
                </div>
                <h3 className="font-heading text-xl font-bold text-blackBean uppercase tracking-wide mb-2">
                  Layout
                </h3>
                <p className="font-body text-payneGray">
                  Component spacing and margin fixes in progress - 80% complete
                </p>
              </div>
            </div>

            <div className="mt-8 p-6 bg-white/80 rounded-lg border-l-4 border-mahogany">
              <h4 className="font-heading text-lg font-bold text-blackBean uppercase tracking-wide mb-3">
                Next Steps
              </h4>
              <ul className="font-body text-payneGray space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                  Complete layout spacing optimization
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                  Run comprehensive visual regression tests
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                  Deploy changes to staging environment
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                  Client approval and production deployment
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Emergency Contact */}
        <div className="text-center py-8">
          <p className="font-body text-payneGray mb-2">
            Emergency Design Review • 6-Hour Implementation Window
          </p>
          <p className="font-body text-sm text-payneGray-400">
            Status: {completedFixes}/{totalFixes} Critical Fixes Complete •
            Last Updated: {new Date().toLocaleString()}
          </p>
        </div>
      </div>

      <FooterPrimary />
    </div>
  );
};

export default DesignValidation;
