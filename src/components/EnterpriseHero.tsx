import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, Star, Sparkles, Leaf, Heart, Shield, 
  TrendingUp, Award, Clock, Truck, ChevronLeft, ChevronRight,
  Play, Volume2, VolumeX, Zap, Gift
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface HeroCampaign {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  cta: {
    primary: { text: string; link: string; };
    secondary?: { text: string; link: string; };
  };
  image?: string;
  video?: string;
  badge?: string;
  countdown?: Date;
  stats?: Array<{ label: string; value: string; }>;
}

interface LiveSalesNotificationProps {
  sales: Array<{
    customer: string;
    location: string;
    product: string;
    timeAgo: string;
  }>;
}

const LiveSalesNotification: React.FC<LiveSalesNotificationProps> = ({ sales }) => {
  const [currentSale, setCurrentSale] = useState(0);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const showTimer = setTimeout(() => setShow(true), 2000);
    const rotateTimer = setInterval(() => {
      setShow(false);
      setTimeout(() => {
        setCurrentSale((prev) => (prev + 1) % sales.length);
        setShow(true);
      }, 500);
    }, 5000);

    return () => {
      clearTimeout(showTimer);
      clearInterval(rotateTimer);
    };
  }, [sales.length]);

  if (!sales.length) return null;

  const sale = sales[currentSale];

  return (
    <div
      className={cn(
        "fixed bottom-8 left-8 z-50 transition-all duration-500",
        show ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"
      )}
    >
      <Card className="bg-white/95 backdrop-blur-lg shadow-2xl border-primary-200">
        <CardContent className="p-4 flex items-center gap-3">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <div>
            <p className="text-sm font-medium">
              {sale.customer} from {sale.location}
            </p>
            <p className="text-xs text-muted-foreground">
              Just purchased {sale.product} • {sale.timeAgo}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

interface CountdownTimerProps {
  endDate: Date;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ endDate }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = endDate.getTime() - now;

      if (distance < 0) {
        clearInterval(timer);
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [endDate]);

  return (
    <div className="flex items-center gap-2">
      <Clock className="w-4 h-4 text-red-500" />
      <div className="flex gap-1 text-sm font-mono">
        <span className="bg-red-500/10 text-red-600 px-2 py-1 rounded">
          {String(timeLeft.days).padStart(2, '0')}d
        </span>
        <span className="bg-red-500/10 text-red-600 px-2 py-1 rounded">
          {String(timeLeft.hours).padStart(2, '0')}h
        </span>
        <span className="bg-red-500/10 text-red-600 px-2 py-1 rounded">
          {String(timeLeft.minutes).padStart(2, '0')}m
        </span>
        <span className="bg-red-500/10 text-red-600 px-2 py-1 rounded">
          {String(timeLeft.seconds).padStart(2, '0')}s
        </span>
      </div>
    </div>
  );
};

interface VideoBackgroundProps {
  src: string;
  poster?: string;
}

const VideoBackground: React.FC<VideoBackgroundProps> = ({ src, poster }) => {
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <>
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
        poster={poster}
      >
        <source src={src} type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/50" />
      
      {/* Video Controls */}
      <div className="absolute bottom-4 right-4 flex gap-2 z-20">
        <Button
          size="sm"
          variant="secondary"
          className="bg-white/20 backdrop-blur-sm hover:bg-white/30"
          onClick={togglePlay}
        >
          {isPlaying ? <Play className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </Button>
        <Button
          size="sm"
          variant="secondary"
          className="bg-white/20 backdrop-blur-sm hover:bg-white/30"
          onClick={toggleMute}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </Button>
      </div>
    </>
  );
};

interface TrustBadgesProps {
  badges: Array<{
    icon: React.ReactNode;
    title: string;
    description: string;
  }>;
}

const TrustBadges: React.FC<TrustBadgesProps> = ({ badges }) => {
  return (
    <div className="flex flex-wrap justify-center gap-4 mb-8">
      {badges.map((badge, index) => (
        <div
          key={index}
          className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20"
        >
          <div className="text-primary-300">{badge.icon}</div>
          <div>
            <p className="text-xs font-semibold text-white">{badge.title}</p>
            <p className="text-xs text-white/70">{badge.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export const EnterpriseHero: React.FC = () => {
  const [currentCampaign, setCurrentCampaign] = useState(0);
  const [progress, setProgress] = useState(0);

  // Mock campaigns data
  const campaigns: HeroCampaign[] = [
    {
      id: '1',
      title: 'Transform Your Wellness Journey',
      subtitle: 'Premium Natural Supplements',
      description: 'Discover our scientifically-formulated botanical supplements, ethically sourced and crafted for optimal health.',
      cta: {
        primary: { text: 'Shop Collection', link: '/products' },
        secondary: { text: 'Learn More', link: '/about' }
      },
      video: '/videos/wellness-hero.mp4',
      badge: 'New Year Sale - 40% OFF',
      countdown: new Date('2025-02-01'),
      stats: [
        { label: 'Happy Customers', value: '50K+' },
        { label: 'Natural Products', value: '100%' },
        { label: 'Average Rating', value: '4.9★' }
      ]
    },
    {
      id: '2',
      title: 'Boost Your Immunity',
      subtitle: 'Advanced Immune Support Formula',
      description: 'Strengthen your body\'s natural defenses with our premium immune support supplements.',
      cta: {
        primary: { text: 'Shop Immune Support', link: '/products?category=immune' },
        secondary: { text: 'View Research', link: '/research' }
      },
      image: '/images/immune-hero.jpg',
      badge: 'Doctor Recommended',
      stats: [
        { label: 'Clinical Studies', value: '15+' },
        { label: 'Satisfaction Rate', value: '97%' },
        { label: 'Fast Shipping', value: '24h' }
      ]
    }
  ];

  const campaign = campaigns[currentCampaign];

  // Auto-rotate campaigns
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentCampaign((prev) => (prev + 1) % campaigns.length);
      setProgress(0);
    }, 10000);

    const progressTimer = setInterval(() => {
      setProgress((prev) => Math.min(prev + 1, 100));
    }, 100);

    return () => {
      clearInterval(timer);
      clearInterval(progressTimer);
    };
  }, [campaigns.length, currentCampaign]);

  const nextCampaign = () => {
    setCurrentCampaign((prev) => (prev + 1) % campaigns.length);
    setProgress(0);
  };

  const prevCampaign = () => {
    setCurrentCampaign((prev) => (prev - 1 + campaigns.length) % campaigns.length);
    setProgress(0);
  };

  const trustBadges = [
    {
      icon: <Shield className="w-4 h-4" />,
      title: 'Secure Checkout',
      description: '256-bit SSL'
    },
    {
      icon: <Truck className="w-4 h-4" />,
      title: 'Free Shipping',
      description: 'Orders over R500'
    },
    {
      icon: <Award className="w-4 h-4" />,
      title: 'Quality Guaranteed',
      description: '30-day returns'
    },
    {
      icon: <Heart className="w-4 h-4" />,
      title: 'Customer Support',
      description: '24/7 assistance'
    }
  ];

  const liveSales = [
    {
      customer: 'Sarah M.',
      location: 'Cape Town',
      product: 'Vitamin C Complex',
      timeAgo: '2 minutes ago'
    },
    {
      customer: 'John D.',
      location: 'Johannesburg',
      product: 'Omega-3 Premium',
      timeAgo: '5 minutes ago'
    },
    {
      customer: 'Lisa K.',
      location: 'Durban',
      product: 'Probiotic Plus',
      timeAgo: '8 minutes ago'
    }
  ];

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
      {/* Background */}
      {campaign.video ? (
        <VideoBackground src={campaign.video} poster={campaign.image} />
      ) : campaign.image ? (
        <>
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${campaign.image})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/50" />
        </>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900" />
      )}

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="max-w-5xl mx-auto text-center">
          {/* Campaign Badge */}
          {campaign.badge && (
            <div className="mb-6 animate-bounce">
              <Badge className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-6 py-2 text-sm font-semibold">
                <Sparkles className="w-4 h-4 mr-2" />
                {campaign.badge}
              </Badge>
            </div>
          )}

          {/* Countdown Timer */}
          {campaign.countdown && (
            <div className="flex justify-center mb-6">
              <CountdownTimer endDate={campaign.countdown} />
            </div>
          )}

          {/* Main Title */}
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 animate-fade-in">
            {campaign.title}
          </h1>

          {/* Subtitle */}
          <p className="text-2xl md:text-3xl text-white/90 mb-6 animate-fade-in delay-100">
            {campaign.subtitle}
          </p>

          {/* Description */}
          <p className="text-lg text-white/80 max-w-3xl mx-auto mb-8 animate-fade-in delay-200">
            {campaign.description}
          </p>

          {/* Stats */}
          {campaign.stats && (
            <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto mb-10">
              {campaign.stats.map((stat, index) => (
                <div
                  key={index}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 animate-fade-in"
                  style={{ animationDelay: `${300 + index * 100}ms` }}
                >
                  <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-sm text-white/70">{stat.label}</div>
                </div>
              ))}
            </div>
          )}

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10 animate-fade-in delay-500">
            <Link to={campaign.cta.primary.link}>
              <Button 
                size="lg"
                className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white px-8 py-6 text-lg font-semibold shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300"
              >
                <Zap className="w-5 h-5 mr-2" />
                {campaign.cta.primary.text}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            {campaign.cta.secondary && (
              <Link to={campaign.cta.secondary.link}>
                <Button 
                  size="lg"
                  variant="outline"
                  className="border-2 border-white text-white hover:bg-white hover:text-primary-900 px-8 py-6 text-lg font-semibold backdrop-blur-sm"
                >
                  {campaign.cta.secondary.text}
                </Button>
              </Link>
            )}
          </div>

          {/* Trust Badges */}
          <TrustBadges badges={trustBadges} />

          {/* Special Offer Banner */}
          <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-sm rounded-2xl p-6 border border-yellow-500/30 max-w-3xl mx-auto animate-pulse">
            <div className="flex items-center justify-center gap-3">
              <Gift className="w-6 h-6 text-yellow-400" />
              <p className="text-white font-semibold">
                Limited Time: Free Gift with Orders Over R1000 + Extra 10% OFF for New Customers
              </p>
              <Badge className="bg-yellow-500 text-black">CODE: WELLNESS10</Badge>
            </div>
          </div>
        </div>

        {/* Campaign Navigation */}
        {campaigns.length > 1 && (
          <div className="absolute top-1/2 -translate-y-1/2 left-4 right-4 flex justify-between pointer-events-none">
            <Button
              size="icon"
              variant="secondary"
              className="pointer-events-auto bg-white/20 backdrop-blur-sm hover:bg-white/30"
              onClick={prevCampaign}
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button
              size="icon"
              variant="secondary"
              className="pointer-events-auto bg-white/20 backdrop-blur-sm hover:bg-white/30"
              onClick={nextCampaign}
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        )}

        {/* Campaign Progress Indicator */}
        {campaigns.length > 1 && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
            {campaigns.map((_, index) => (
              <button
                key={index}
                className={cn(
                  "w-16 h-1 rounded-full overflow-hidden bg-white/30",
                  index === currentCampaign && "bg-white/50"
                )}
                onClick={() => {
                  setCurrentCampaign(index);
                  setProgress(0);
                }}
              >
                {index === currentCampaign && (
                  <div
                    className="h-full bg-white transition-all duration-100"
                    style={{ width: `${progress}%` }}
                  />
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Live Sales Notification */}
      <LiveSalesNotification sales={liveSales} />

      {/* Floating Customer Reviews */}
      <div className="absolute top-20 right-8 hidden lg:block animate-float">
        <Card className="bg-white/90 backdrop-blur-sm shadow-xl max-w-xs">
          <CardContent className="p-4">
            <div className="flex items-center gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <p className="text-sm italic mb-2">
              "Best wellness products I've ever used! Noticed improvements in just 2 weeks."
            </p>
            <p className="text-xs font-semibold">- Emma R., Verified Buyer</p>
          </CardContent>
        </Card>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-scroll" />
        </div>
      </div>
    </section>
  );
};
