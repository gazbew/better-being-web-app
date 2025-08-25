import React, { useState } from "react";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  MessageSquare,
  Calendar,
  Users,
  Heart,
  CheckCircle,
  ArrowRight,
  Star,
  Quote,
  Headphones,
  Globe,
  Smartphone,
  Video,
  Coffee,
  Award,
  Shield,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const contactMethods = [
  {
    icon: Phone,
    title: "Call Us",
    description: "Speak directly with our wellness experts",
    contact: "+27 12 345 6789",
    availability: "Mon-Fri: 8AM-6PM",
    action: "tel:+27123456789",
    color: "from-[#e5c287] to-[#d4b8a1]",
  },
  {
    icon: Mail,
    title: "Email Support",
    description: "Get detailed help via email",
    contact: "support@betterbeing.co.za",
    availability: "24/7 Response",
    action: "mailto:support@betterbeing.co.za",
    color: "from-[#d4b8a1] to-[#c19854]",
  },
  {
    icon: MessageSquare,
    title: "Live Chat",
    description: "Instant help when you need it",
    contact: "Start Chat",
    availability: "Mon-Fri: 8AM-8PM",
    action: "#chat",
    color: "from-[#c19854] to-[#a67c52]",
  },
  {
    icon: Video,
    title: "Video Call",
    description: "Personal consultation sessions",
    contact: "Book Consultation",
    availability: "By Appointment",
    action: "#video",
    color: "from-[#a67c52] to-[#8b6642]",
  },
];

const officeInfo = {
  address: "171 Blaauwberg Road, Table View, Cape Town 7441",
  phone: "+27 12 345 6789",
  email: "info@betterbeing.co.za",
  hours: {
    weekdays: "Monday - Friday: 8:00 AM - 6:00 PM",
    weekends: "Saturday - Sunday: 9:00 AM - 4:00 PM",
  },
};

const faqs = [
  {
    question: "What are your shipping times and costs?",
    answer:
      "We offer free shipping on orders over R500. Standard delivery takes 2-3 business days, while express delivery is available within 24 hours for major cities.",
  },
  {
    question: "Are all your products certified organic?",
    answer:
      "Yes, all our products are certified organic and undergo rigorous third-party testing. We maintain the highest quality standards and provide certificates upon request.",
  },
  {
    question: "Do you offer wellness consultations?",
    answer:
      "Absolutely! We have certified wellness practitioners available for one-on-one consultations. Book a session through our contact form or call us directly.",
  },
  {
    question: "What is your return policy?",
    answer:
      "We offer a 30-day satisfaction guarantee. If you're not completely happy with your purchase, we'll provide a full refund or exchange.",
  },
];

const testimonials = [
  {
    name: "Sarah Mitchell",
    role: "Wellness Enthusiast",
    content:
      "The customer service is exceptional. They helped me find the perfect supplements for my needs and followed up to ensure I was happy with my purchase.",
    rating: 5,
    avatar: "/api/placeholder/80/80",
  },
  {
    name: "Marcus Chen",
    role: "Fitness Coach",
    content:
      "Quick response times and knowledgeable staff. They truly care about their customers' wellness journey. Highly recommend!",
    rating: 5,
    avatar: "/api/placeholder/80/80",
  },
  {
    name: "Emily Rodriguez",
    role: "Nutritionist",
    content:
      "Professional, friendly, and always helpful. The team goes above and beyond to ensure customer satisfaction.",
    rating: 5,
    avatar: "/api/placeholder/80/80",
  },
];

const ContactMethodCard = ({ method }: { method: any }) => (
  <Card className="group relative bg-gradient-to-br from-[#faf8f1] to-[#f7f3eb] border-2 border-[#e5c287]/20 hover:border-[#e5c287]/60 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-warm hover:-translate-y-2">
    <div
      className={`absolute inset-0 bg-gradient-to-br ${method.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
    ></div>

    <CardHeader className="relative text-center pb-4">
      <div className="w-16 h-16 bg-gradient-to-br from-[#e5c287] to-[#d4b8a1] rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-soft">
        <method.icon className="w-8 h-8 text-[#7a4d3b]" />
      </div>
      <CardTitle className="text-xl font-bold text-[#7a4d3b] font-heading">
        {method.title}
      </CardTitle>
      <p className="text-[#7a4d3b]/70 font-body">{method.description}</p>
    </CardHeader>

    <CardContent className="relative text-center space-y-4">
      <div className="space-y-2">
        <p className="text-lg font-semibold text-[#7a4d3b]">{method.contact}</p>
        <Badge className="bg-[#e5c287]/20 text-[#7a4d3b]">
          {method.availability}
        </Badge>
      </div>

      <Button
        asChild
        className="w-full bg-gradient-to-r from-[#e5c287] to-[#d4b8a1] hover:from-[#d4ab6a] hover:to-[#c19854] text-[#7a4d3b] rounded-xl font-semibold shadow-soft hover:shadow-warm transition-all duration-300 group/btn"
      >
        <a href={method.action}>
          Contact Now
          <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform duration-300" />
        </a>
      </Button>
    </CardContent>
  </Card>
);

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    priority: "medium",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
        priority: "medium",
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#faf8f1] via-[#f7f3eb] to-[#f0e9d2]">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-[#e5c287] via-[#d4b8a1] to-[#c19854] py-20">
        {/* Decorative Background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-32 h-32 bg-[#7a4d3b] rounded-full blur-3xl animate-gentle-float"></div>
          <div
            className="absolute bottom-20 right-20 w-40 h-40 bg-[#f0e9d2] rounded-full blur-3xl animate-gentle-float"
            style={{ animationDelay: "2s" }}
          ></div>
          <div
            className="absolute top-1/2 left-1/3 w-24 h-24 bg-[#7a4d3b] rounded-full blur-2xl animate-gentle-float"
            style={{ animationDelay: "4s" }}
          ></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6">
          <div className="text-center max-w-4xl mx-auto space-y-8">
            <div className="inline-flex items-center gap-3 bg-[#7a4d3b]/10 backdrop-blur-sm px-6 py-2 rounded-full">
              <Heart className="w-5 h-5 text-[#7a4d3b]" />
              <span className="text-[#7a4d3b] font-semibold text-sm uppercase tracking-wider">
                We're Here to Help
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-[#7a4d3b] font-heading">
              Get in
              <span className="block text-gradient-soft">Touch</span>
            </h1>

            <p className="text-xl md:text-2xl text-[#7a4d3b]/80 leading-relaxed font-body max-w-3xl mx-auto">
              Have questions about our products or need wellness guidance? Our
              expert team is here to support your journey to better being.
            </p>

            {/* Quick Stats */}
            <div className="flex justify-center items-center gap-12 pt-8">
              {[
                {
                  icon: Headphones,
                  label: "24/7 Support",
                  desc: "Always Here",
                },
                { icon: Award, label: "Expert Team", desc: "Certified Pros" },
                { icon: Zap, label: "Fast Response", desc: "Within 2 Hours" },
              ].map(({ icon: Icon, label, desc }) => (
                <div
                  key={label}
                  className="text-center bg-[#7a4d3b]/10 backdrop-blur-sm rounded-2xl p-4"
                >
                  <Icon className="w-8 h-8 text-[#7a4d3b] mx-auto mb-2" />
                  <div className="font-bold text-[#7a4d3b]">{label}</div>
                  <div className="text-sm text-[#7a4d3b]/70">{desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-20 -mt-10 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactMethods.map((method, index) => (
              <div
                key={method.title}
                className="animate-fade-in-gentle"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <ContactMethodCard method={method} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Contact Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Contact Form */}
            <div className="space-y-8">
              <div>
                <h2 className="text-4xl font-bold text-[#7a4d3b] mb-4 font-heading">
                  Send us a Message
                </h2>
                <p className="text-[#7a4d3b]/80 font-body text-lg">
                  Fill out the form below and we'll get back to you within 24
                  hours. For urgent matters, please call us directly.
                </p>
              </div>

              {submitted ? (
                <Card className="bg-gradient-to-br from-[#e5c287]/20 to-[#d4b8a1]/20 border-2 border-[#e5c287]/30 rounded-2xl p-8 text-center">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#7a4d3b] mb-2">
                    Message Sent Successfully!
                  </h3>
                  <p className="text-[#7a4d3b]/80 font-body">
                    Thank you for reaching out. We'll get back to you within 24
                    hours.
                  </p>
                </Card>
              ) : (
                <Card className="bg-gradient-to-br from-[#faf8f1] to-[#f7f3eb] border-2 border-[#e5c287]/20 rounded-2xl shadow-warm">
                  <CardContent className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-[#7a4d3b] font-semibold mb-2">
                            Full Name *
                          </label>
                          <Input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            className="bg-white border-2 border-[#e5c287]/30 focus:border-[#e5c287] rounded-xl py-3 text-[#7a4d3b] placeholder-[#7a4d3b]/60 shadow-gentle focus:shadow-warm transition-all duration-300"
                            placeholder="Enter your full name"
                          />
                        </div>
                        <div>
                          <label className="block text-[#7a4d3b] font-semibold mb-2">
                            Email Address *
                          </label>
                          <Input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            className="bg-white border-2 border-[#e5c287]/30 focus:border-[#e5c287] rounded-xl py-3 text-[#7a4d3b] placeholder-[#7a4d3b]/60 shadow-gentle focus:shadow-warm transition-all duration-300"
                            placeholder="your.email@example.com"
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-[#7a4d3b] font-semibold mb-2">
                            Phone Number
                          </label>
                          <Input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="bg-white border-2 border-[#e5c287]/30 focus:border-[#e5c287] rounded-xl py-3 text-[#7a4d3b] placeholder-[#7a4d3b]/60 shadow-gentle focus:shadow-warm transition-all duration-300"
                            placeholder="+27 12 345 6789"
                          />
                        </div>
                        <div>
                          <label className="block text-[#7a4d3b] font-semibold mb-2">
                            Priority Level
                          </label>
                          <Select
                            value={formData.priority}
                            onValueChange={(value) =>
                              setFormData((prev) => ({
                                ...prev,
                                priority: value,
                              }))
                            }
                          >
                            <SelectTrigger className="bg-white border-2 border-[#e5c287]/30 focus:border-[#e5c287] rounded-xl py-3 text-[#7a4d3b] shadow-gentle">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-white border-[#e5c287]/30 rounded-xl shadow-warm">
                              <SelectItem value="low">Low Priority</SelectItem>
                              <SelectItem value="medium">
                                Medium Priority
                              </SelectItem>
                              <SelectItem value="high">
                                High Priority
                              </SelectItem>
                              <SelectItem value="urgent">Urgent</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[#7a4d3b] font-semibold mb-2">
                          Subject *
                        </label>
                        <Input
                          type="text"
                          name="subject"
                          value={formData.subject}
                          onChange={handleInputChange}
                          required
                          className="bg-white border-2 border-[#e5c287]/30 focus:border-[#e5c287] rounded-xl py-3 text-[#7a4d3b] placeholder-[#7a4d3b]/60 shadow-gentle focus:shadow-warm transition-all duration-300"
                          placeholder="What can we help you with?"
                        />
                      </div>

                      <div>
                        <label className="block text-[#7a4d3b] font-semibold mb-2">
                          Message *
                        </label>
                        <Textarea
                          name="message"
                          value={formData.message}
                          onChange={handleInputChange}
                          required
                          rows={6}
                          className="bg-white border-2 border-[#e5c287]/30 focus:border-[#e5c287] rounded-xl py-3 text-[#7a4d3b] placeholder-[#7a4d3b]/60 shadow-gentle focus:shadow-warm transition-all duration-300 resize-none"
                          placeholder="Please provide as much detail as possible about your inquiry..."
                        />
                      </div>

                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-gradient-to-r from-[#e5c287] to-[#d4b8a1] hover:from-[#d4ab6a] hover:to-[#c19854] text-[#7a4d3b] py-4 rounded-xl font-bold text-lg shadow-soft hover:shadow-warm transition-all duration-300 group disabled:opacity-50"
                      >
                        {isSubmitting ? (
                          "Sending Message..."
                        ) : (
                          <>
                            Send Message
                            <Send className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                          </>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Contact Information & Map */}
            <div className="space-y-8">
              {/* Office Information */}
              <Card className="bg-gradient-to-br from-[#faf8f1] to-[#f7f3eb] border-2 border-[#e5c287]/20 rounded-2xl shadow-warm overflow-hidden">
                <div className="aspect-video bg-gradient-to-br from-[#e5c287] to-[#d4b8a1] flex items-center justify-center">
                  <div className="text-center text-[#7a4d3b]">
                    <MapPin className="w-16 h-16 mx-auto mb-4" />
                    <p className="font-semibold">Interactive Map Coming Soon</p>
                  </div>
                </div>

                <CardContent className="p-8 space-y-6">
                  <div>
                    <h3 className="text-2xl font-bold text-[#7a4d3b] mb-4 font-heading">
                      Visit Our Office
                    </h3>
                    <p className="text-[#7a4d3b]/80 font-body">
                      Come visit us at our wellness center for personalized
                      consultations and product recommendations.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-[#e5c287] rounded-xl flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-5 h-5 text-[#7a4d3b]" />
                      </div>
                      <div>
                        <p className="font-semibold text-[#7a4d3b]">Address</p>
                        <p className="text-[#7a4d3b]/80 font-body">
                          {officeInfo.address}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-[#e5c287] rounded-xl flex items-center justify-center flex-shrink-0">
                        <Phone className="w-5 h-5 text-[#7a4d3b]" />
                      </div>
                      <div>
                        <p className="font-semibold text-[#7a4d3b]">Phone</p>
                        <a
                          href={`tel:${officeInfo.phone}`}
                          className="text-[#7a4d3b]/80 hover:text-[#e5c287] transition-colors font-body"
                        >
                          {officeInfo.phone}
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-[#e5c287] rounded-xl flex items-center justify-center flex-shrink-0">
                        <Mail className="w-5 h-5 text-[#7a4d3b]" />
                      </div>
                      <div>
                        <p className="font-semibold text-[#7a4d3b]">Email</p>
                        <a
                          href={`mailto:${officeInfo.email}`}
                          className="text-[#7a4d3b]/80 hover:text-[#e5c287] transition-colors font-body"
                        >
                          {officeInfo.email}
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-[#e5c287] rounded-xl flex items-center justify-center flex-shrink-0">
                        <Clock className="w-5 h-5 text-[#7a4d3b]" />
                      </div>
                      <div>
                        <p className="font-semibold text-[#7a4d3b]">Hours</p>
                        <div className="text-[#7a4d3b]/80 font-body text-sm">
                          <p>{officeInfo.hours.weekdays}</p>
                          <p>{officeInfo.hours.weekends}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Customer Testimonials */}
              <Card className="bg-gradient-to-br from-[#7a4d3b] to-[#5c3a2d] border-2 border-[#e5c287]/20 rounded-2xl shadow-warm text-white">
                <CardContent className="p-8">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-[#e5c287] mb-2 font-heading">
                      What Our Customers Say
                    </h3>
                    <div className="flex justify-center mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-5 h-5 text-[#e5c287] fill-[#e5c287]"
                        />
                      ))}
                    </div>
                    <p className="text-[#f7f3eb]/80 font-body">
                      4.9/5 based on 2,500+ reviews
                    </p>
                  </div>

                  <div className="space-y-6">
                    {testimonials.slice(0, 2).map((testimonial, index) => (
                      <div
                        key={index}
                        className="bg-[#7a4d3b]/20 backdrop-blur-sm rounded-xl p-6 border border-[#e5c287]/20"
                      >
                        <div className="flex items-center gap-4 mb-4">
                          <img
                            src={testimonial.avatar}
                            alt={testimonial.name}
                            className="w-12 h-12 rounded-full bg-[#e5c287]"
                          />
                          <div>
                            <p className="font-semibold text-[#e5c287]">
                              {testimonial.name}
                            </p>
                            <p className="text-[#f7f3eb]/70 text-sm">
                              {testimonial.role}
                            </p>
                          </div>
                        </div>
                        <Quote className="w-6 h-6 text-[#e5c287] mb-2" />
                        <p className="text-[#f7f3eb]/90 font-body italic">
                          "{testimonial.content}"
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gradient-to-br from-[#f7f3eb] to-[#f0e9d2]">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-[#7a4d3b] mb-6 font-heading">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-[#7a4d3b]/80 font-body">
              Find quick answers to common questions about our products and
              services.
            </p>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <Card
                key={index}
                className="bg-gradient-to-br from-[#faf8f1] to-[#f7f3eb] border-2 border-[#e5c287]/20 hover:border-[#e5c287]/60 rounded-2xl shadow-gentle hover:shadow-warm transition-all duration-300"
              >
                <CardContent className="p-8">
                  <h3 className="text-xl font-bold text-[#7a4d3b] mb-4 font-heading">
                    {faq.question}
                  </h3>
                  <p className="text-[#7a4d3b]/80 font-body leading-relaxed">
                    {faq.answer}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-[#7a4d3b]/80 font-body mb-4">
              Still have questions?
            </p>
            <Button className="bg-gradient-to-r from-[#e5c287] to-[#d4b8a1] hover:from-[#d4ab6a] hover:to-[#c19854] text-[#7a4d3b] px-8 py-3 rounded-xl font-semibold shadow-soft hover:shadow-warm transition-all duration-300 group">
              Contact Support
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
