import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Heart,
  Leaf,
  Brain,
  Moon,
  Dumbbell,
  Coffee,
  Flower2,
  Users,
  BookOpen,
  Play,
  Clock,
  ChevronRight,
  Star,
  Quote,
  CheckCircle,
  ArrowRight,
  Calendar,
  Target,
  Sparkles,
  Award,
  TrendingUp,
  MessageCircle,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

const wellnessCategories = [
  {
    id: "mindfulness",
    title: "Mindfulness & Mental Health",
    description: "Cultivate inner peace and emotional wellbeing",
    icon: Brain,
    color: "from-[#e5c287] to-[#d4b8a1]",
    articles: 24,
    image: "/api/placeholder/400/300",
  },
  {
    id: "nutrition",
    title: "Nutrition & Superfoods",
    description: "Fuel your body with nature's best nutrients",
    icon: Leaf,
    color: "from-[#d4b8a1] to-[#c19854]",
    articles: 32,
    image: "/api/placeholder/400/300",
  },
  {
    id: "sleep",
    title: "Sleep & Recovery",
    description: "Optimize your rest for better performance",
    icon: Moon,
    color: "from-[#c19854] to-[#a67c52]",
    articles: 18,
    image: "/api/placeholder/400/300",
  },
  {
    id: "fitness",
    title: "Movement & Fitness",
    description: "Stay active with mindful movement practices",
    icon: Dumbbell,
    color: "from-[#a67c52] to-[#8b6642]",
    articles: 28,
    image: "/api/placeholder/400/300",
  },
  {
    id: "stress",
    title: "Stress Management",
    description: "Find balance in life's challenging moments",
    icon: Flower2,
    color: "from-[#e5c287] to-[#f0e9d2]",
    articles: 22,
    image: "/api/placeholder/400/300",
  },
  {
    id: "community",
    title: "Community & Connection",
    description: "Build meaningful relationships and support",
    icon: Users,
    color: "from-[#f0e9d2] to-[#e5c287]",
    articles: 16,
    image: "/api/placeholder/400/300",
  },
];

const featuredArticles = [
  {
    id: 1,
    title: "The Science of Adaptogens: How They Help Your Body Handle Stress",
    excerpt:
      "Discover how these remarkable plants can help your body adapt to stress and maintain balance in our modern world.",
    author: "Dr. Sarah Mitchell",
    readTime: "8 min read",
    category: "Stress Management",
    image: "/api/placeholder/600/400",
    featured: true,
    publishDate: "2024-01-15",
    likes: 124,
    comments: 18,
  },
  {
    id: 2,
    title: "Morning Rituals That Transform Your Entire Day",
    excerpt:
      "Simple yet powerful morning practices that can revolutionize your energy, focus, and overall wellbeing.",
    author: "Marcus Chen",
    readTime: "6 min read",
    category: "Mindfulness",
    image: "/api/placeholder/600/400",
    featured: false,
    publishDate: "2024-01-12",
    likes: 89,
    comments: 12,
  },
  {
    id: 3,
    title: "Superfoods Decoded: What Actually Works and What's Just Hype",
    excerpt:
      "Cut through the marketing noise and discover which superfoods deliver real health benefits backed by science.",
    author: "Dr. Emily Rodriguez",
    readTime: "10 min read",
    category: "Nutrition",
    image: "/api/placeholder/600/400",
    featured: false,
    publishDate: "2024-01-10",
    likes: 156,
    comments: 24,
  },
];

const wellnessTips = [
  {
    tip: "Start your day with 5 minutes of deep breathing",
    category: "Mindfulness",
    icon: Brain,
  },
  {
    tip: "Drink a glass of water before your morning coffee",
    category: "Hydration",
    icon: Coffee,
  },
  {
    tip: "Take a 10-minute walk after meals",
    category: "Movement",
    icon: Dumbbell,
  },
  {
    tip: "Practice gratitude by writing down 3 things daily",
    category: "Mental Health",
    icon: Heart,
  },
];

const WellnessCard = ({ category }: { category: any }) => (
  <Card className="group relative bg-gradient-to-br from-[#faf8f1] to-[#f7f3eb] border-2 border-[#e5c287]/20 hover:border-[#e5c287]/60 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-warm hover:-translate-y-2">
    <div
      className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
    ></div>

    <div className="relative aspect-video overflow-hidden">
      <img
        src={category.image}
        alt={category.title}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#7a4d3b]/50 to-transparent"></div>

      <div className="absolute top-4 left-4">
        <div className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-gentle">
          <category.icon className="w-6 h-6 text-[#7a4d3b]" />
        </div>
      </div>

      <div className="absolute top-4 right-4">
        <Badge className="bg-[#e5c287]/90 text-[#7a4d3b] backdrop-blur-sm">
          {category.articles} Articles
        </Badge>
      </div>
    </div>

    <CardContent className="p-6 space-y-4">
      <div>
        <h3 className="text-xl font-bold text-[#7a4d3b] mb-2 group-hover:text-[#5c3a2d] transition-colors duration-300">
          {category.title}
        </h3>
        <p className="text-[#7a4d3b]/70 font-body leading-relaxed">
          {category.description}
        </p>
      </div>

      <Button
        asChild
        className="w-full bg-gradient-to-r from-[#e5c287] to-[#d4b8a1] hover:from-[#d4ab6a] hover:to-[#c19854] text-[#7a4d3b] rounded-xl font-semibold shadow-soft hover:shadow-warm transition-all duration-300 group/btn"
      >
        <Link to={`/wellness/${category.id}`}>
          Explore Topics
          <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform duration-300" />
        </Link>
      </Button>
    </CardContent>
  </Card>
);

const ArticleCard = ({
  article,
  featured = false,
}: {
  article: any;
  featured?: boolean;
}) => (
  <Card
    className={`group relative bg-gradient-to-br from-[#faf8f1] to-[#f7f3eb] border-2 border-[#e5c287]/20 hover:border-[#e5c287]/60 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-warm hover:-translate-y-1 ${
      featured ? "lg:col-span-2 lg:row-span-2" : ""
    }`}
  >
    <div
      className={`relative overflow-hidden ${featured ? "aspect-video" : "aspect-[4/3]"}`}
    >
      <img
        src={article.image}
        alt={article.title}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#7a4d3b]/60 via-[#7a4d3b]/20 to-transparent"></div>

      {featured && (
        <div className="absolute top-4 left-4">
          <Badge className="bg-[#e5c287] text-[#7a4d3b] shadow-gentle">
            <Sparkles className="w-3 h-3 mr-1" />
            Featured
          </Badge>
        </div>
      )}

      <div className="absolute bottom-4 left-4 right-4">
        <Badge variant="secondary" className="bg-white/90 text-[#7a4d3b] mb-3">
          {article.category}
        </Badge>
        {featured && (
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 font-heading">
            {article.title}
          </h2>
        )}
      </div>
    </div>

    <CardContent className="p-6 space-y-4">
      {!featured && (
        <h3 className="text-xl font-bold text-[#7a4d3b] line-clamp-2 group-hover:text-[#5c3a2d] transition-colors duration-300">
          {article.title}
        </h3>
      )}

      <p className="text-[#7a4d3b]/70 font-body line-clamp-3 leading-relaxed">
        {article.excerpt}
      </p>

      <div className="flex items-center justify-between pt-4 border-t border-[#e5c287]/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#e5c287] to-[#d4b8a1] rounded-full flex items-center justify-center">
            <span className="text-[#7a4d3b] font-bold text-sm">
              {article.author.split(" ")[0][0]}
              {article.author.split(" ")[1][0]}
            </span>
          </div>
          <div>
            <p className="text-[#7a4d3b] font-semibold text-sm">
              {article.author}
            </p>
            <p className="text-[#7a4d3b]/60 text-xs">{article.readTime}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-[#7a4d3b]/60">
          <div className="flex items-center gap-1">
            <Heart className="w-4 h-4" />
            <span className="text-sm">{article.likes}</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageCircle className="w-4 h-4" />
            <span className="text-sm">{article.comments}</span>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

const Wellness = () => {
  const [email, setEmail] = useState("");

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
                Wellness Hub
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-[#7a4d3b] font-heading">
              Your Journey to
              <span className="block text-gradient-soft">Better Being</span>
            </h1>

            <p className="text-xl md:text-2xl text-[#7a4d3b]/80 leading-relaxed font-body max-w-3xl mx-auto">
              Discover evidence-based wellness practices, expert insights, and
              natural solutions to help you thrive in mind, body, and spirit.
            </p>

            {/* Stats */}
            <div className="flex justify-center items-center gap-12 pt-8">
              {[
                { icon: BookOpen, number: "140+", label: "Expert Articles" },
                { icon: Users, number: "25K+", label: "Community Members" },
                { icon: Award, number: "98%", label: "Satisfaction Rate" },
              ].map(({ icon: Icon, number, label }) => (
                <div
                  key={label}
                  className="text-center bg-[#7a4d3b]/10 backdrop-blur-sm rounded-2xl p-4"
                >
                  <Icon className="w-8 h-8 text-[#7a4d3b] mx-auto mb-2" />
                  <div className="text-2xl font-bold text-[#7a4d3b]">
                    {number}
                  </div>
                  <div className="text-sm text-[#7a4d3b]/70">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Daily Wellness Tips */}
      <section className="py-16 bg-gradient-to-r from-[#7a4d3b] to-[#5c3a2d] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-24 h-24 bg-[#e5c287] rounded-full blur-2xl animate-gentle-float"></div>
          <div
            className="absolute bottom-10 left-10 w-32 h-32 bg-[#d4b8a1] rounded-full blur-3xl animate-gentle-float"
            style={{ animationDelay: "3s" }}
          ></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-[#e5c287] mb-4 font-heading">
              Daily Wellness Tips
            </h2>
            <p className="text-[#f7f3eb]/80 text-lg font-body">
              Small changes that make a big difference
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {wellnessTips.map((tip, index) => (
              <div
                key={index}
                className="bg-[#7a4d3b]/20 backdrop-blur-sm border border-[#e5c287]/20 rounded-2xl p-6 text-center hover:bg-[#7a4d3b]/30 transition-all duration-300 group"
              >
                <div className="w-12 h-12 bg-[#e5c287] rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <tip.icon className="w-6 h-6 text-[#7a4d3b]" />
                </div>
                <Badge className="mb-3 bg-[#e5c287]/20 text-[#e5c287] border-[#e5c287]/30">
                  {tip.category}
                </Badge>
                <p className="text-[#f7f3eb] font-body leading-relaxed">
                  {tip.tip}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Wellness Categories */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-[#7a4d3b] mb-6 font-heading">
              Explore Wellness Topics
            </h2>
            <p className="text-xl text-[#7a4d3b]/80 font-body max-w-3xl mx-auto">
              Dive deep into specific areas of wellness with expert-curated
              content designed to support your unique journey.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {wellnessCategories.map((category, index) => (
              <div
                key={category.id}
                className="animate-fade-in-gentle"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <WellnessCard category={category} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Articles */}
      <section className="py-20 bg-gradient-to-br from-[#f7f3eb] to-[#f0e9d2]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-[#7a4d3b] mb-6 font-heading">
              Latest Wellness Articles
            </h2>
            <p className="text-xl text-[#7a4d3b]/80 font-body max-w-3xl mx-auto">
              Stay informed with the latest research, tips, and insights from
              our community of wellness experts.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {featuredArticles.map((article, index) => (
              <div
                key={article.id}
                className={`animate-fade-in-gentle ${
                  index === 0 ? "lg:col-span-2 lg:row-span-2" : ""
                }`}
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <ArticleCard article={article} featured={index === 0} />
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button
              asChild
              className="bg-gradient-to-r from-[#e5c287] to-[#d4b8a1] hover:from-[#d4ab6a] hover:to-[#c19854] text-[#7a4d3b] px-8 py-3 rounded-xl font-semibold shadow-soft hover:shadow-warm transition-all duration-300 group"
            >
              <Link to="/blog">
                View All Articles
                <BookOpen className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-20 bg-gradient-to-r from-[#e5c287] to-[#d4b8a1] relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-1/4 w-32 h-32 bg-[#7a4d3b] rounded-full blur-3xl animate-gentle-float"></div>
          <div
            className="absolute bottom-10 right-1/4 w-24 h-24 bg-[#f0e9d2] rounded-full blur-2xl animate-gentle-float"
            style={{ animationDelay: "2s" }}
          ></div>
        </div>

        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <div className="bg-[#7a4d3b]/10 backdrop-blur-sm rounded-3xl p-12 border border-[#7a4d3b]/20">
            <h2 className="text-4xl md:text-5xl font-bold text-[#7a4d3b] mb-6 font-heading">
              Join Our Wellness Community
            </h2>
            <p className="text-xl text-[#7a4d3b]/80 font-body mb-8 max-w-2xl mx-auto">
              Get weekly wellness tips, exclusive content, and early access to
              our latest products and programs.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto mb-6">
              <div className="relative flex-1">
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-4 pr-4 py-4 bg-white/90 backdrop-blur-sm border-2 border-[#7a4d3b]/20 focus:border-[#7a4d3b] text-[#7a4d3b] placeholder-[#7a4d3b]/60 rounded-xl text-lg font-body shadow-gentle focus:shadow-warm transition-all duration-300"
                />
              </div>
              <Button className="bg-[#7a4d3b] hover:bg-[#5c3a2d] text-[#f7f3eb] px-8 py-4 rounded-xl font-bold shadow-soft hover:shadow-warm transition-all duration-300 group">
                Subscribe
                <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
            </div>

            <p className="text-[#7a4d3b]/60 text-sm">
              ✨ No spam, just wellness. Unsubscribe anytime.
            </p>

            <div className="flex justify-center items-center gap-8 mt-8 pt-8 border-t border-[#7a4d3b]/20">
              <div className="text-center">
                <div className="text-2xl font-bold text-[#7a4d3b]">25,000+</div>
                <div className="text-[#7a4d3b]/70 text-sm">Subscribers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#7a4d3b]">4.9⭐</div>
                <div className="text-[#7a4d3b]/70 text-sm">
                  Community Rating
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#7a4d3b]">Weekly</div>
                <div className="text-[#7a4d3b]/70 text-sm">Fresh Content</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Wellness;
