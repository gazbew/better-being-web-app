import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, User, Heart, Brain, Zap, Shield, Star } from "lucide-react";
import journeyImage from "@/assets/wellness-journey.jpg";

const journeySteps = [
  {
    step: "01",
    title: "Discover Your Wellness Profile",
    description: "Take our comprehensive wellness assessment to understand your unique needs and create a personalized transformation plan.",
    icon: User,
    color: "text-accent"
  },
  {
    step: "02", 
    title: "Begin Your Transformation",
    description: "Start with our scientifically-formulated products designed specifically for your wellness goals and lifestyle.",
    icon: Heart,
    color: "text-primary"
  },
  {
    step: "03",
    title: "Experience the Change",
    description: "Feel increased energy, mental clarity, and overall vitality as your body responds to premium natural ingredients.",
    icon: Brain,
    color: "text-accent"
  },
  {
    step: "04",
    title: "Achieve Lasting Results",
    description: "Maintain your new level of wellness with ongoing support, expert guidance, and our community of transformed lives.",
    icon: Zap,
    color: "text-primary"
  }
];

const testimonial = {
  name: "Sarah Mitchell",
  title: "Marketing Executive",
  image: "/placeholder-avatar.jpg",
  rating: 5,
  quote: "Better Being completely transformed my life. I went from constant fatigue to boundless energy, and my mental clarity has never been better. This isn't just a product - it's a life revolution powered by nature.",
  results: ["300% more energy", "Better sleep quality", "Improved focus", "Enhanced mood"]
};

export const WellnessJourney = () => {
  return (
    <section id="wellness" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <div className="inline-flex items-center space-x-2 bg-primary/10 rounded-full px-6 py-2 mb-6">
            <Shield className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Your Natural Transformation</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-primary mb-6">
            From Where You Are
            <span className="block text-[#C1581B]">To Better Being</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Join thousands who have discovered the power of nature with Better Being. Your wellness revolution starts with a single step.
          </p>
        </div>

        {/* Journey Visual */}
        <div className="relative mb-20 animate-scale-in">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Journey Image */}
            <div className="relative">
              <div className="relative overflow-hidden rounded-3xl shadow-floating">
                <img 
                  src={journeyImage} 
                  alt="Wellness transformation journey"
                  className="w-full h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-premium" />
              </div>
              {/* Floating Stats */}
              <div className="absolute -top-6 -right-6 bg-[#C1581B] text-white rounded-2xl p-4 shadow-premium animate-float">
                <div className="text-2xl font-bold">30 Days</div>
                <div className="text-sm">To Better Being</div>
              </div>
              <div className="absolute -bottom-6 -left-6 bg-primary text-primary-foreground rounded-2xl p-4 shadow-wellness animate-float animation-delay-1000">
                <div className="text-2xl font-bold">97%</div>
                <div className="text-sm">Success Rate</div>
              </div>
            </div>

            {/* Journey Steps */}
            <div className="space-y-8">
              {journeySteps.map((step, index) => (
                <div 
                  key={step.step}
                  className="flex items-start space-x-4 animate-slide-in-right"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  {/* Step Number */}
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-hero rounded-xl flex items-center justify-center text-primary-foreground font-bold">
                    {step.step}
                  </div>
                  
                  {/* Step Content */}
                  <div className="flex-1">
                    <div className={`inline-flex items-center space-x-2 mb-2`}>
                      <step.icon className={`w-5 h-5 ${step.color}`} />
                      <h3 className="text-xl font-bold text-primary">{step.title}</h3>
                    </div>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              ))}

              <Button
                size="lg"
                className="bg-[#C1581B] hover:bg-[#C1581B]/90 text-white shadow-premium mt-8"
              >
                Start Your Better Being Journey
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        </div>

        {/* Testimonial Spotlight */}
        <Card className="bg-gradient-wellness border-0 shadow-floating animate-fade-in-up">
          <CardContent className="p-12">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Testimonial */}
              <div>
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-accent fill-current" />
                  ))}
                </div>
                <blockquote className="text-2xl font-medium text-primary mb-6 leading-relaxed">
                  "{testimonial.quote}"
                </blockquote>
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <div className="font-bold text-primary">{testimonial.name}</div>
                    <div className="text-muted-foreground">{testimonial.title}</div>
                  </div>
                </div>
              </div>

              {/* Results */}
              <div>
                <h4 className="text-2xl font-bold text-primary mb-6">Better Being Results</h4>
                <div className="grid grid-cols-2 gap-4">
                  {testimonial.results.map((result, index) => (
                    <div 
                      key={index}
                      className="bg-background/60 backdrop-blur-sm rounded-xl p-4 text-center"
                    >
                      <div className="text-[#C1581B] text-2xl font-bold mb-1">✓</div>
                      <div className="text-sm text-foreground">{result}</div>
                    </div>
                  ))}
                </div>
                <Button 
                  variant="outline" 
                  className="w-full mt-6 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                >
                  Read More Success Stories
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};