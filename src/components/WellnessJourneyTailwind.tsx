import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Leaf, Shield, Star, ArrowRight } from 'lucide-react';

const journeySteps = [
  {
    id: 1,
    title: "Discover",
    description: "Find the perfect supplements for your unique health goals",
    icon: <Leaf className="w-8 h-8 text-green-600" />,
    features: ["Personalized recommendations", "Expert guidance", "Product matching"]
  },
  {
    id: 2,
    title: "Experience",
    description: "Feel the difference with our premium, natural ingredients",
    icon: <Heart className="w-8 h-8 text-green-600" />,
    features: ["30-day guarantee", "Visible results", "Natural ingredients"]
  },
  {
    id: 3,
    title: "Thrive",
    description: "Achieve optimal wellness and maintain your healthy lifestyle",
    icon: <Star className="w-8 h-8 text-green-600" />,
    features: ["Long-term wellness", "Sustained energy", "Better sleep"]
  }
];

const benefits = [
  "100% Natural Ingredients",
  "Scientifically Backed",
  "Third-Party Tested",
  "FDA Registered Facility",
  "30-Day Money Back Guarantee",
  "Free Shipping on Orders $50+"
];

export const WellnessJourneyTailwind = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-green-50 to-emerald-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-green-100 text-green-800 px-4 py-2">
            <Shield className="w-4 h-4 mr-2" />
            Your Wellness Journey
          </Badge>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Transform Your Health in 3 Simple Steps
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join thousands of customers who have transformed their health with our 
            premium supplements and personalized wellness approach.
          </p>
        </div>

        {/* Journey Steps */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {journeySteps.map((step, index) => (
            <Card key={step.id} className="relative group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
              {/* Connection Line */}
              {index < journeySteps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                  <ArrowRight className="w-6 h-6 text-green-600" />
                </div>
              )}
              
              <CardContent className="p-8 text-center">
                <div className="mb-6 flex justify-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    {step.icon}
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{step.title}</h3>
                <p className="text-gray-600 mb-6">{step.description}</p>
                
                <ul className="space-y-2">
                  {step.features.map((feature, i) => (
                    <li key={i} className="text-sm text-gray-600 flex items-center justify-center">
                      <div className="w-2 h-2 bg-green-600 rounded-full mr-2"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Benefits Grid */}
        <div className="bg-white rounded-3xl p-8 shadow-lg mb-12">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">
            Why Choose Better Being?
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center space-x-3 p-4 rounded-lg hover:bg-green-50 transition-colors">
                <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <span className="text-gray-700 font-medium">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <h3 className="text-3xl font-bold text-gray-900 mb-6">
            Ready to Start Your Wellness Journey?
          </h3>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join over 10,000 satisfied customers who have transformed their health 
            with our premium supplements.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white px-8">
              Shop Now
            </Button>
            <Button size="lg" variant="outline" className="border-green-600 text-green-600 hover:bg-green-50 px-8">
              Take Health Quiz
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WellnessJourneyTailwind;