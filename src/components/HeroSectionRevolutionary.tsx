import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, useScroll, useTransform, useMotionValue, useSpring, AnimatePresence, useInView } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Play,
  Star,
  Users,
  Award,
  Sparkles,
  Heart,
  Leaf,
  ShoppingBag,
  CheckCircle,
  TrendingUp,
  Shield,
  Zap,
  Brain,
  Target,
  Globe,
  Clock,
  Trophy,
  ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface MousePosition {
  x: number;
  y: number;
}

interface ParticleProps {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  color: string;
}

const HeroSectionRevolutionary = () => {
  const [mousePosition, setMousePosition] = useState<MousePosition>({ x: 50, y: 50 });
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentWord, setCurrentWord] = useState(0);
  const [particles, setParticles] = useState<ParticleProps[]>([]);
  const [isHovered, setIsHovered] = useState(false);
  const [gestureDetected, setGestureDetected] = useState(false);

  const heroRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  // Advanced scroll transforms
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.8, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.3], [1, 0.95]);
  const rotateX = useTransform(scrollYProgress, [0, 0.5], [0, 5]);

  const words = [
    { text: "Revolutionary", color: "from-purple-500 via-pink-500 to-red-500" },
    { text: "Transformative", color: "from-blue-500 via-cyan-500 to-teal-500" },
    { text: "Empowering", color: "from-green-500 via-emerald-500 to-teal-500" },
    { text: "Life-Changing", color: "from-orange-500 via-red-500 to-pink-500" },
  ];

  const achievements = [
    { icon: Trophy, text: "15+ Awards", number: "15+", color: "text-yellow-400" },
    { icon: Users, text: "10K+ Customers", number: "10K+", color: "text-blue-400" },
    { icon: Star, text: "4.9 Rating", number: "4.9★", color: "text-purple-400" },
    { icon: Globe, text: "Global Reach", number: "50+", color: "text-green-400" },
  ];

  const features = [
    { icon: Brain, text: "AI-Powered Wellness", desc: "Personalized recommendations" },
    { icon: Target, text: "Precision Nutrition", desc: "Science-backed formulas" },
    { icon: Shield, text: "Lab Certified", desc: "Third-party verified" },
    { icon: Clock, text: "24/7 Support", desc: "Always here for you" },
  ];

  // Initialize enhanced particles
  useEffect(() => {
    const newParticles: ParticleProps[] = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 6 + 2,
      speed: Math.random() * 0.8 + 0.2,
      opacity: Math.random() * 0.6 + 0.2,
      color: `hsl(${Math.random() * 60 + 15}, 70%, ${Math.random() * 30 + 60}%)`
    }));
    setParticles(newParticles);
    setIsLoaded(true);
  }, []);

  // Advanced mouse tracking with spring physics
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (heroRef.current) {
      const rect = heroRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      mouseX.set(x);
      mouseY.set(y);
      setMousePosition({ x, y });
    }
  }, [mouseX, mouseY]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    const throttledMouseMove = (e: MouseEvent) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => handleMouseMove(e), 8); // ~120fps
    };

    const heroElement = heroRef.current;
    if (heroElement) {
      heroElement.addEventListener("mousemove", throttledMouseMove);
      return () => {
        heroElement.removeEventListener("mousemove", throttledMouseMove);
        clearTimeout(timeoutId);
      };
    }
  }, [handleMouseMove]);

  // Rotating words with smooth transitions
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % words.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [words.length]);

  // Gesture detection for enhanced interactions
  useEffect(() => {
    let startX = 0;
    let startY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      const diffX = Math.abs(endX - startX);
      const diffY = Math.abs(endY - startY);

      if (diffX > 50 || diffY > 50) {
        setGestureDetected(true);
        setTimeout(() => setGestureDetected(false), 1000);
      }
    };

    document.addEventListener("touchstart", handleTouchStart);
    document.addEventListener("touchend", handleTouchEnd);

    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  return (
    <motion.section
      ref={heroRef}
      className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5, ease: "easeOut" }}
    >
      {/* Dynamic Background Layers - Enhanced with More Dramatic Effects */}
      <div className="absolute inset-0">
        {/* Primary gradient layer - More Intense */}
        <motion.div
          className="absolute inset-0 opacity-60"
          style={{
            background: `
              radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%,
                rgba(168, 85, 247, 0.8) 0%,
                rgba(59, 130, 246, 0.6) 25%,
                rgba(16, 185, 129, 0.4) 50%,
                rgba(249, 115, 22, 0.2) 75%,
                transparent 90%)
            `,
            y: y1
          }}
        />

        {/* Secondary animated gradient - More Dynamic */}
        <motion.div
          className="absolute inset-0 opacity-50"
          style={{
            background: `
              conic-gradient(from ${scrollYProgress.get() * 360}deg at 30% 40%,
                rgba(249, 115, 22, 0.5) 0deg,
                rgba(236, 72, 153, 0.4) 90deg,
                rgba(59, 130, 246, 0.5) 180deg,
                rgba(16, 185, 129, 0.4) 270deg,
                rgba(249, 115, 22, 0.5) 360deg)
            `,
            y: y2
          }}
        />

        {/* Animated mesh gradient - Faster and More Pronounced */}
        <motion.div
          className="absolute inset-0 opacity-40"
          animate={{
            background: [
              "radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.6) 0%, transparent 50%)",
              "radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.6) 0%, transparent 50%)",
              "radial-gradient(circle at 40% 80%, rgba(120, 219, 255, 0.6) 0%, transparent 50%)",
              "radial-gradient(circle at 60% 30%, rgba(255, 255, 120, 0.6) 0%, transparent 50%)",
              "radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.6) 0%, transparent 50%)",
            ]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Dramatic Pulsing Overlay */}
        <motion.div
          className="absolute inset-0 opacity-30"
          animate={{
            background: [
              "radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 70%)",
              "radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.3) 0%, transparent 70%)",
              "radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 70%)",
            ]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Enhanced Particle System - More Dramatic */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <AnimatePresence>
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute rounded-full blur-sm"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                backgroundColor: particle.color,
                boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
              }}
              animate={{
                y: [0, -150, 0],
                x: [0, Math.sin(Date.now() * 0.001 + particle.id) * 30, 0],
                opacity: [particle.opacity, 0.8, particle.opacity],
                scale: [1, 2, 1],
                rotate: [0, 360, 0],
              }}
              transition={{
                duration: 6 + particle.speed,
                repeat: Infinity,
                ease: "easeInOut",
                delay: particle.id * 0.05
              }}
            />
          ))}
        </AnimatePresence>

        {/* Additional Sparkle Effects */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={`sparkle-${i}`}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* 3D Floating Elements - Enhanced */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-40 h-40 bg-gradient-to-br from-white/15 to-transparent rounded-full blur-3xl"
            style={{
              left: `${5 + i * 12}%`,
              top: `${15 + i * 8}%`,
            }}
            animate={{
              y: [0, -50, 0],
              x: [0, Math.sin(Date.now() * 0.001 + i) * 30, 0],
              rotateZ: [0, 180, 360],
              scale: [1, 1.3, 1],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 4 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.3
            }}
          />
        ))}

        {/* Geometric Rotating Pattern */}
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={`geo-${i}`}
              className="absolute w-4 h-4 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full"
              style={{
                left: '200px',
                top: '0px',
                transformOrigin: '-200px 0px',
              }}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.7, 1, 0.7],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut"
              }}
            />
          ))}
        </motion.div>

        {/* Dramatic Burst Effect */}
        <motion.div
          className="absolute top-1/4 right-1/4 w-96 h-96"
          animate={{
            scale: [0.5, 1.2, 0.5],
            opacity: [0, 0.1, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeOut"
          }}
        >
          <div className="w-full h-full bg-gradient-radial from-white/20 via-transparent to-transparent rounded-full" />
        </motion.div>
      </div>

      {/* Main Content Container */}
      <motion.div
        className="relative z-10 flex items-center min-h-screen"
        style={{ scale, rotateX, opacity }}
      >
        <div className="max-w-7xl mx-auto px-6 py-20 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Left Content - Enhanced with Framer Motion */}
            <motion.div
              className="space-y-8"
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              {/* Animated Badge */}
              <motion.div
                className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-lg px-6 py-3 rounded-full border border-white/20"
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 20px 40px rgba(0,0,0,0.2)"
                }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="w-5 h-5 text-purple-400" />
                </motion.div>
                <span className="text-white font-semibold text-sm uppercase tracking-wider">
                  Next-Gen Wellness
                </span>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Zap className="w-4 h-4 text-yellow-400" />
                </motion.div>
              </motion.div>

              {/* Dynamic Headline with Word Rotation */}
              <div className="space-y-4">
                <motion.h1
                  className="text-6xl md:text-7xl lg:text-8xl font-bold text-white leading-tight"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  <motion.span className="block">
                    Transform Your
                  </motion.span>
                  <motion.span className="block">
                    Wellness
                  </motion.span>
                  <motion.span className="block">
                    Journey with
                  </motion.span>
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={currentWord}
                      className={`block bg-gradient-to-r ${words[currentWord].color} bg-clip-text text-transparent`}
                      initial={{ opacity: 0, y: 20, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -20, scale: 0.9 }}
                      transition={{
                        duration: 0.6,
                        ease: [0.25, 0.46, 0.45, 0.94]
                      }}
                    >
                      {words[currentWord].text}
                    </motion.span>
                  </AnimatePresence>
                  <motion.span className="block text-purple-400">
                    Technology
                  </motion.span>
                </motion.h1>
              </div>

              {/* Enhanced Description */}
              <motion.p
                className="text-xl text-gray-300 leading-relaxed max-w-lg"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Experience the future of wellness with our AI-powered platform that adapts to your unique needs, providing personalized nutrition, mindfulness, and health insights.
              </motion.p>

              {/* Feature Grid */}
              <motion.div
                className="grid grid-cols-2 gap-4"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    className="flex items-start gap-3 group cursor-pointer"
                    whileHover={{ scale: 1.05, x: 10 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <motion.div
                      className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg"
                      whileHover={{ rotate: 15, scale: 1.1 }}
                    >
                      <feature.icon className="w-5 h-5 text-white" />
                    </motion.div>
                    <div>
                      <div className="text-white font-semibold text-sm group-hover:text-purple-400 transition-colors">
                        {feature.text}
                      </div>
                      <div className="text-gray-400 text-xs">
                        {feature.desc}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Enhanced CTA Buttons */}
              <motion.div
                className="flex flex-col sm:flex-row gap-4"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                <motion.div
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    asChild
                    className="group bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-xl text-lg font-bold shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 transform"
                  >
                    <Link to="/products">
                      <motion.div className="flex items-center gap-3">
                        <Brain className="w-5 h-5 group-hover:animate-pulse" />
                        <span>Start Your Journey</span>
                        <motion.div
                          animate={{ x: [0, 5, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          <ArrowRight className="w-5 h-5" />
                        </motion.div>
                      </motion.div>
                    </Link>
                  </Button>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="tertiary"
                    className="group border-2 border-white/30 text-white hover:bg-white/10 px-8 py-4 rounded-xl text-lg font-bold transition-all duration-300"
                  >
                    <motion.div className="flex items-center gap-3">
                      <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      <span>Watch Demo</span>
                    </motion.div>
                  </Button>
                </motion.div>
              </motion.div>

              {/* Achievements Grid */}
              <motion.div
                className="flex flex-wrap gap-6 pt-8"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1 }}
              >
                {achievements.map((achievement, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center gap-3 group cursor-pointer"
                    whileHover={{
                      scale: 1.1,
                      y: -5,
                      transition: { type: "spring", stiffness: 300 }
                    }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.2 + index * 0.1 }}
                  >
                    <motion.div
                      className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20"
                      whileHover={{ rotate: 15 }}
                    >
                      <achievement.icon className={`w-6 h-6 ${achievement.color}`} />
                    </motion.div>
                    <div>
                      <motion.div
                        className="text-2xl font-bold text-white group-hover:text-purple-400 transition-colors"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                          delay: 1.4 + index * 0.1,
                          type: "spring",
                          stiffness: 200
                        }}
                      >
                        {achievement.number}
                      </motion.div>
                      <div className="text-sm text-gray-400 font-medium">
                        {achievement.text}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right Visual - Revolutionary Design */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
            >
              {/* Main Interactive Card */}
              <motion.div
                className="relative group cursor-pointer"
                whileHover={{ scale: 1.02, rotateY: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {/* Animated Background Glow */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-3xl blur-3xl"
                  animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.5, 0.8, 0.5]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />

                {/* Main Card */}
                <motion.div
                  className="relative bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10"
                  whileHover={{ boxShadow: "0 25px 50px rgba(0,0,0,0.3)" }}
                >
                  {/* Interactive Hover Effect */}
                  <motion.div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{
                      background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(168, 85, 247, 0.1), transparent 70%)`
                    }}
                  />

                  {/* Floating Stats Cards */}
                  {[
                    { icon: Users, value: "10K+", label: "Active Users", color: "from-blue-500 to-cyan-500", delay: 0 },
                    { icon: Star, value: "4.9", label: "Rating", color: "from-yellow-500 to-orange-500", delay: 0.2 },
                    { icon: Trophy, value: "15+", label: "Awards", color: "from-purple-500 to-pink-500", delay: 0.4 },
                  ].map((stat, index) => (
                    <motion.div
                      key={index}
                      className="absolute bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20"
                      style={{
                        top: `${10 + index * 25}%`,
                        left: index % 2 === 0 ? '-10%' : '110%',
                      }}
                      initial={{ opacity: 0, scale: 0, rotate: -15 }}
                      animate={{ opacity: 1, scale: 1, rotate: 0 }}
                      transition={{
                        delay: stat.delay,
                        type: "spring",
                        stiffness: 200
                      }}
                      whileHover={{
                        scale: 1.1,
                        rotate: 5,
                        transition: { type: "spring", stiffness: 300 }
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 bg-gradient-to-br ${stat.color} rounded-full flex items-center justify-center`}>
                          <stat.icon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="font-bold text-white">{stat.value}</div>
                          <div className="text-xs text-gray-300">{stat.label}</div>
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  {/* Central Content */}
                  <motion.div
                    className="text-center space-y-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <motion.div
                      className="w-32 h-32 mx-auto bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-2xl"
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                    >
                      <Brain className="w-16 h-16 text-white" />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.8 }}
                    >
                      <h3 className="text-2xl font-bold text-white mb-2">
                        AI-Powered Wellness
                      </h3>
                      <p className="text-gray-300">
                        Personalized recommendations based on your unique biology and lifestyle.
                      </p>
                    </motion.div>
                  </motion.div>
                </motion.div>
              </motion.div>

              {/* Floating Action Buttons */}
              <motion.div
                className="absolute -bottom-6 -right-6 w-16 h-16 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center shadow-xl cursor-pointer"
                whileHover={{ scale: 1.2, rotate: 15 }}
                whileTap={{ scale: 0.9 }}
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  y: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                  hover: { duration: 0.2 }
                }}
              >
                <Heart className="w-8 h-8 text-white" />
              </motion.div>

              <motion.div
                className="absolute -top-6 -left-6 w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-xl cursor-pointer"
                whileHover={{ scale: 1.2, rotate: -15 }}
                whileTap={{ scale: 0.9 }}
                animate={{
                  y: [0, 10, 0],
                }}
                transition={{
                  y: { duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 },
                  hover: { duration: 0.2 }
                }}
              >
                <Zap className="w-8 h-8 text-white" />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Enhanced Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer group"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5 }}
        whileHover={{ scale: 1.1 }}
      >
        <motion.div
          className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center group-hover:border-white/60 transition-colors"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <motion.div
            className="w-1 h-3 bg-white/50 rounded-full mt-2 group-hover:bg-white transition-colors"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
        <motion.div
          className="text-xs text-white/60 text-center mt-2 opacity-0 group-hover:opacity-100 transition-opacity"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
        >
          Discover More
        </motion.div>
      </motion.div>

      {/* Performance indicator */}
      <motion.div
        className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-2 text-xs text-white/60"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          120fps Optimized
        </div>
      </motion.div>
    </motion.section>
  );
};

export default HeroSectionRevolutionary;