import React from "react";
import { Link } from "react-router-dom";
import { NavigationPrimary } from "@/components/NavigationPrimary";
import { FooterPrimary } from "@/components/FooterPrimary";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ChevronRight,
  Leaf,
  Shield,
  Award,
  Star,
  Check,
  Users,
  Target,
  Heart,
  Truck,
  CheckCircle,
  Beaker,
  Microscope,
  Globe,
} from "lucide-react";

const About = () => {
  const features = [
    "100% Natural Ingredients",
    "Plant Based Formulations",
    "Third Party Lab Tested",
  ];

  const process = [
    {
      step: "1",
      title: "Browse Our Products",
      description:
        "Explore our carefully curated selection of natural wellness products designed for your unique health journey.",
    },
    {
      step: "2",
      title: "Place Your Order",
      description:
        "Simple, secure ordering process with detailed product information to help you make informed choices.",
    },
    {
      step: "3",
      title: "Receive & Thrive",
      description:
        "Fast, reliable delivery brings premium wellness solutions directly to your door for optimal health results.",
    },
  ];

  const teamMembers = [
    {
      name: "Dr. Sarah Mitchell",
      role: "Chief Wellness Officer",
      image: "/api/placeholder/300/400",
    },
    {
      name: "James Robertson",
      role: "Head of Product Development",
      image: "/api/placeholder/300/400",
    },
    {
      name: "Maria Gonzalez",
      role: "Quality Assurance Manager",
      image: "/api/placeholder/300/400",
    },
    {
      name: "David Chen",
      role: "Customer Experience Director",
      image: "/api/placeholder/300/400",
    },
  ];

  const stats = [
    {
      number: "50,000+",
      label: "Lives Transformed Through Natural Wellness",
    },
    {
      number: "100%",
      label: "Natural Ingredients Sourced Globally",
    },
    {
      number: "95%",
      label: "Customer Satisfaction Rate",
    },
    {
      number: "5+",
      label: "Years of Wellness Innovation",
    },
  ];

  const services = [
    {
      icon: <Leaf className="w-8 h-8" />,
      title: "Natural Formulations",
      description:
        "Expertly crafted products using only the finest natural ingredients sourced from trusted suppliers worldwide.",
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Quality Assurance",
      description:
        "Rigorous testing and quality control processes ensure every product meets our exceptional standards.",
    },
    {
      icon: <Beaker className="w-8 h-8" />,
      title: "Scientific Research",
      description:
        "Evidence-based formulations backed by scientific research and traditional wellness wisdom.",
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Holistic Wellness",
      description:
        "Comprehensive approach to health covering nutrition, skincare, pain relief, and overall wellbeing.",
    },
    {
      icon: <Microscope className="w-8 h-8" />,
      title: "Third-Party Testing",
      description:
        "Independent laboratory testing for purity, potency, and safety to ensure product integrity.",
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Sustainable Practices",
      description:
        "Committed to environmentally responsible sourcing and packaging for a healthier planet.",
    },
  ];

  const testimonials = [
    {
      rating: 5,
      author: "Sarah Johnson",
      title: "Life-Changing Wellness Journey",
      content:
        "Better Being transformed my approach to health. Their natural products and expert guidance helped me achieve wellness goals I never thought possible.",
    },
    {
      rating: 5,
      author: "Michael Brown",
      title: "Outstanding Product Quality",
      content:
        "The quality of Better Being's products is exceptional. I've tried many wellness brands, but none compare to their purity and effectiveness.",
    },
    {
      rating: 5,
      author: "Emma Davis",
      title: "Exceptional Customer Service",
      content:
        "From product selection to delivery, Better Being exceeds expectations. Their team truly cares about customer wellness and satisfaction.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <NavigationPrimary />

      {/* Breadcrumb */}
      <div className="bg-[#F9E7C9]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm">
            <Link
              to="/"
              className="text-[#626675] hover:text-[#BB4500] transition-colors"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Home
            </Link>
            <ChevronRight className="w-4 h-4 text-[#626675]" />
            <span
              className="text-[#BB4500] font-medium"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              About Us
            </span>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <div className="py-16 bg-gradient-to-br from-[#BB4500] to-[#C4C240] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1
            className="text-4xl md:text-6xl font-bold uppercase tracking-[0.088em] mb-4"
            style={{ fontFamily: "'League Spartan', sans-serif" }}
          >
            About Better Being
          </h1>
          <p
            className="text-lg text-white/90 max-w-2xl mx-auto leading-relaxed"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Discover the story behind our commitment to natural wellness and
            learn how we're transforming lives through premium, science-backed
            products.
          </p>
        </div>
      </div>

      {/* Main About Section */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="bg-[#C4C240]/20 text-[#626675] mb-6">
                Welcome to Better Being
              </Badge>
              <h2
                className="text-3xl md:text-4xl font-bold uppercase tracking-[0.088em] text-[#BB4500] mb-6"
                style={{ fontFamily: "'League Spartan', sans-serif" }}
              >
                We Provide High Quality And Certified Products
              </h2>
              <div
                className="text-lg text-[#626675] mb-6 space-y-4 leading-relaxed"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                <p>
                  At Better Being, we believe that optimal wellness comes from
                  nature's finest offerings. Our journey began with a simple yet
                  powerful vision: to make premium natural health products
                  accessible to everyone seeking a better way to live.
                </p>
                <p>
                  Every product in our carefully curated collection undergoes
                  rigorous quality testing and meets our uncompromising
                  standards for purity, potency, and effectiveness. We partner
                  with trusted suppliers worldwide to source only the highest
                  quality natural ingredients.
                </p>
              </div>
              <ul className="space-y-3 mb-8">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-[#C4C240] flex-shrink-0" />
                    <span
                      className="text-[#280B0B] font-medium"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
              <Button
                className="bg-[#BB4500] hover:bg-[#BB4500]/90 text-white"
                asChild
              >
                <Link to="/products">Explore Our Products</Link>
              </Button>
            </div>
            <div className="relative">
              <div className="aspect-square bg-[#F9E7C9] rounded-2xl flex items-center justify-center">
                <div className="text-center text-[#BB4500]">
                  <Leaf className="w-32 h-32 mx-auto mb-6" />
                  <div
                    className="text-3xl font-bold uppercase tracking-wide mb-2"
                    style={{ fontFamily: "'League Spartan', sans-serif" }}
                  >
                    No.1 Natural
                  </div>
                  <div
                    className="text-3xl font-bold uppercase tracking-wide mb-4"
                    style={{ fontFamily: "'League Spartan', sans-serif" }}
                  >
                    Wellness Specialist
                  </div>
                  <div
                    className="text-lg mb-2"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    Natural supplements, wellness solutions, skincare products,
                    pain relief, nutrition support & more...
                  </div>
                  <div className="flex justify-center mb-2">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-current" />
                      ))}
                    </div>
                  </div>
                  <div
                    className="text-sm text-[#626675]"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    Rated 4.9 / 5<br />
                    Based on 2,400+ reviews
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 bg-[#F9E7C9]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge className="bg-[#C4C240]/20 text-[#626675] mb-4">
              Our products are certified
            </Badge>
            <h2
              className="text-3xl md:text-4xl font-bold uppercase tracking-[0.088em] text-[#BB4500] mb-6"
              style={{ fontFamily: "'League Spartan', sans-serif" }}
            >
              Great Results in Improving Well-being
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {process.map((step, index) => (
              <Card
                key={index}
                className="text-center p-8 hover:shadow-lg transition-shadow border-2 hover:border-[#BB4500]/20"
              >
                <div className="w-16 h-16 bg-[#BB4500] text-white rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                  {step.step}
                </div>
                <h3
                  className="text-xl font-bold uppercase tracking-wide mb-4 text-[#BB4500]"
                  style={{ fontFamily: "'League Spartan', sans-serif" }}
                >
                  {step.title}
                </h3>
                <p
                  className="text-[#626675] leading-relaxed"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {step.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge className="bg-[#C4C240]/20 text-[#626675] mb-4">
              Our Team Members
            </Badge>
            <h2
              className="text-3xl md:text-4xl font-bold uppercase tracking-[0.088em] text-[#BB4500]"
              style={{ fontFamily: "'League Spartan', sans-serif" }}
            >
              Meet Our Experts
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <Card
                key={index}
                className="text-center overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="aspect-[3/4] overflow-hidden bg-[#F9E7C9]/20">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-6">
                  <h3
                    className="text-lg font-bold text-[#BB4500] mb-2"
                    style={{ fontFamily: "'League Spartan', sans-serif" }}
                  >
                    {member.name}
                  </h3>
                  <p
                    className="text-[#626675]"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {member.role}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-[#BB4500] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div
                  className="text-4xl md:text-5xl font-bold mb-2"
                  style={{ fontFamily: "'League Spartan', sans-serif" }}
                >
                  {stat.number}
                </div>
                <p
                  className="text-white/90 leading-relaxed"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge className="bg-[#C4C240]/20 text-[#626675] mb-4">
              Our Services and Benefits
            </Badge>
            <h2
              className="text-3xl md:text-4xl font-bold uppercase tracking-[0.088em] text-[#BB4500]"
              style={{ fontFamily: "'League Spartan', sans-serif" }}
            >
              High Standard and Quality Natural Solutions
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card
                key={index}
                className="p-6 hover:shadow-lg transition-shadow border-2 hover:border-[#BB4500]/20"
              >
                <div className="w-16 h-16 bg-[#F9E7C9] rounded-full flex items-center justify-center mb-6 text-[#BB4500]">
                  {service.icon}
                </div>
                <h3
                  className="text-xl font-bold uppercase tracking-wide mb-4 text-[#BB4500]"
                  style={{ fontFamily: "'League Spartan', sans-serif" }}
                >
                  {service.title}
                </h3>
                <p
                  className="text-[#626675] leading-relaxed"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {service.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-[#F9E7C9]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge className="bg-[#C4C240]/20 text-[#626675] mb-4">
              Testimonials
            </Badge>
            <h2
              className="text-3xl md:text-4xl font-bold uppercase tracking-[0.088em] text-[#BB4500]"
              style={{ fontFamily: "'League Spartan', sans-serif" }}
            >
              What Our Customers Say
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="p-8 hover:shadow-lg transition-shadow"
              >
                <div className="flex text-yellow-400 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
                <h3
                  className="text-lg font-bold text-[#BB4500] mb-4"
                  style={{ fontFamily: "'League Spartan', sans-serif" }}
                >
                  {testimonial.title}
                </h3>
                <p
                  className="text-[#626675] leading-relaxed mb-4"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {testimonial.content}
                </p>
                <div className="border-t pt-4">
                  <p
                    className="font-medium text-[#BB4500]"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    By {testimonial.author}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[#626675] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2
            className="text-3xl md:text-4xl font-bold uppercase tracking-[0.088em] mb-6"
            style={{ fontFamily: "'League Spartan', sans-serif" }}
          >
            What Product is For You?
          </h2>
          <p
            className="text-lg text-white/90 mb-8 leading-relaxed"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Discover the perfect wellness solution tailored to your unique needs
            and health goals. Our expert team is here to guide your journey.
          </p>
          <ul className="space-y-3 mb-8 text-left max-w-md mx-auto">
            {[
              "Excellent Value for Money",
              "Premium Service for your health",
              "Lab-Tested Products",
            ].map((benefit, index) => (
              <li
                key={index}
                className="flex items-center gap-3"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                <CheckCircle className="w-5 h-5 text-[#C4C240] flex-shrink-0" />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
          <Button
            className="bg-[#C4C240] hover:bg-[#B5B33A] text-[#280B0B] px-8 py-3 font-bold uppercase tracking-wide"
            style={{ fontFamily: "'League Spartan', sans-serif" }}
            asChild
          >
            <Link to="/products">Find Out More</Link>
          </Button>
        </div>
      </section>

      <FooterPrimary />
    </div>
  );
};

export default About;
