import React from 'react';
import { Card, CardContent } from '../components/ui/card';
import { NavigationPrimary } from '../components/NavigationPrimary';
import FooterPrimary from '../components/FooterPrimary';

const Testimonials: React.FC = () => {
  const testimonials = [
    {
      name: "Sarah M.",
      location: "Cape Town",
      product: "Gut Fix Semosis™",
      text: "After years of digestive issues, Gut Fix has been a game-changer. I feel so much better and my energy levels have improved dramatically.",
      rating: 5
    },
    {
      name: "David K.",
      location: "Johannesburg", 
      product: "Go Go Pain",
      text: "As someone who works physically demanding job, Go Go Pain has become essential. Natural relief without the side effects.",
      rating: 5
    },
    {
      name: "Lisa P.",
      location: "Durban",
      product: "Raw Pro-Biotic Gut Repair",
      text: "The probiotic has helped restore my gut health after antibiotics. I love that it's completely natural and vegan.",
      rating: 5
    },
    {
      name: "Michael R.",
      location: "Pretoria",
      product: "Bronchial Relief",
      text: "This has helped me through several respiratory challenges. The honey and herbs make it pleasant to take too.",
      rating: 4
    },
    {
      name: "Emma T.",
      location: "Port Elizabeth",
      product: "Night Care",
      text: "My skin has never looked better. The essential oils are so nourishing and I wake up with glowing skin.",
      rating: 5
    },
    {
      name: "James L.",
      location: "Bloemfontein",
      product: "8-Week Wellness Journey",
      text: "Dr. Mel's program completely transformed my approach to health. I feel like a new person after 8 weeks.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen">
      <NavigationPrimary />
      <div className="bg-gradient-to-br from-green-50 to-blue-50 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Customer Testimonials</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Real stories from real people who have experienced the benefits of Our Grounds products
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="h-full">
              <CardContent className="p-6">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={`text-lg ${
                        i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">"{testimonial.text}"</p>
                <div className="border-t pt-4">
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-600">{testimonial.location}</p>
                  <p className="text-sm text-green-600 font-medium">{testimonial.product}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Share Your Story</h2>
            <p className="text-gray-600 mb-6">
              Have you experienced positive results with Our Grounds products? We'd love to hear from you!
            </p>
            <button className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold">
              Submit Your Testimonial
            </button>
          </CardContent>
        </Card>
      </div>
      </div>
      <FooterPrimary />
    </div>
  );
};

export default Testimonials;