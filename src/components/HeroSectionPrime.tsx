import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionTemplate, useMotionValue, useTransform } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Star, ShieldCheck, Truck, Sparkles, ArrowRight, ShoppingBag } from 'lucide-react';
import { getFeaturedProducts } from '@/data/products';

export default function HeroSectionPrime() {
  // Mouse-follow glow
  const containerRef = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const maskImage = useMotionTemplate`radial-gradient(300px 300px at ${mx}px ${my}px, rgba(255,255,255,0.35), transparent 70%)`;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      mx.set(e.clientX - rect.left);
      my.set(e.clientY - rect.top);
    };
    el.addEventListener('mousemove', onMove);
    return () => el.removeEventListener('mousemove', onMove);
  }, [mx, my]);

  // Featured products (3) for parallax stack
  const featured = useMemo(() => getFeaturedProducts().slice(0, 3), []);

  return (
    <section ref={containerRef} className="relative overflow-hidden">
      {/* Ambient background: gradient mesh + animated blobs */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(1200px_800px_at_10%_-20%,#F5E6D3_20%,transparent_60%),radial-gradient(1200px_800px_at_110%_0%,#7A9B7A_15%,transparent_60%),linear-gradient(180deg,#fff,transparent_30%)]" />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 mix-blend-multiply"
        style={{ WebkitMaskImage: maskImage, maskImage }}
      >
        <div className="absolute -top-24 -left-24 h-[480px] w-[480px] rounded-full bg-[#B85A3E]/30 blur-3xl" />
        <div className="absolute top-1/3 right-[-120px] h-[420px] w-[420px] rounded-full bg-[#7A9B7A]/30 blur-3xl" />
        <div className="absolute bottom-[-120px] left-1/3 h-[520px] w-[520px] rounded-full bg-[#C4C240]/25 blur-3xl" />
      </motion.div>

      {/* Container */}
      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 pb-16 pt-28 md:grid-cols-2 md:gap-16 md:px-6 lg:px-8 lg:pb-28 lg:pt-36">
        {/* Left: Copy + CTAs + Trust */}
        <div className="space-y-7">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#B85A3E]/20 bg-white/70 px-3 py-1 text-sm text-[#2A1F1A] shadow-sm backdrop-blur">
            <Sparkles className="h-4 w-4 text-[#B85A3E]" />
            Elevate your everyday wellness
          </div>

          <h1 className="text-balance text-4xl font-extrabold tracking-[-0.02em] text-[#2A1F1A] sm:text-5xl lg:text-6xl">
            Nature-first formulas for a
            <span className="bg-gradient-to-r from-[#B85A3E] via-[#C4C240] to-[#7A9B7A] bg-clip-text text-transparent"> better being</span>
          </h1>

          <p className="max-w-prose text-lg leading-relaxed text-[#5a4a44]">
            Premium, clinically-aligned botanicals crafted with modern precision. Designed to
            restore, energize, and balance — so you can thrive naturally.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild className="h-12 rounded-xl bg-[#B85A3E] px-7 text-white hover:bg-[#a04f36]">
              <Link to="/shop">
                <ShoppingBag className="mr-2 h-5 w-5" /> Shop Now
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-12 rounded-xl border-[#B85A3E] px-7 text-[#B85A3E] hover:bg-[#F5E6D3]">
              <Link to="/products">
                Explore Products <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {/* Trust Row */}
          <div className="grid grid-cols-3 gap-4 pt-2 text-sm text-[#2A1F1A] sm:max-w-lg">
            <div className="flex items-center gap-2">
              <div className="flex items-center text-[#C4C240]">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <span className="font-medium">4.9/5 (8,200+)</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-[#7A9B7A]" />
              <span className="font-medium">Fast Delivery</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-[#B85A3E]" />
              <span className="font-medium">Quality Assured</span>
            </div>
          </div>
        </div>

        {/* Right: Parallax product stack */}
        <div className="relative h-[440px] w-full select-none sm:h-[520px]">
          <ParallaxStack />
        </div>
      </div>
    </section>
  );
}

function ParallaxStack() {
  const container = useRef<HTMLDivElement>(null);
  const [bounds, setBounds] = useState<{ w: number; h: number }>({ w: 1, h: 1 });
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const rotateX = useTransform(tiltY, [-0.5, 0.5], [8, -8]);
  const rotateY = useTransform(tiltX, [-0.5, 0.5], [-12, 12]);

  useEffect(() => {
    const el = container.current;
    if (!el) return;
    const rect = () => setBounds({ w: el.clientWidth, h: el.clientHeight });
    rect();
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5; // -0.5..0.5
      const py = (e.clientY - r.top) / r.height - 0.5;
      tiltX.set(px);
      tiltY.set(py);
    };
    el.addEventListener('mousemove', onMove);
    window.addEventListener('resize', rect);
    return () => {
      el.removeEventListener('mousemove', onMove);
      window.removeEventListener('resize', rect);
    };
  }, [tiltX, tiltY]);

  const cards = useMemo(() => getFeaturedProducts().slice(0, 3), []);

  return (
    <motion.div
      ref={container}
      style={{ rotateX, rotateY }}
      className="relative h-full w-full perspective-[1200px]"
    >
      {cards.map((p, i) => (
        <motion.div
          key={p.id}
          className="absolute left-1/2 top-1/2 w-[82%] max-w-md -translate-x-1/2 -translate-y-1/2"
          initial={{ y: 80 - i * 20, x: i * 12, opacity: 0, scale: 0.95 }}
          animate={{ y: -20 + i * 16, x: -10 + i * 10, opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 120, damping: 18, delay: i * 0.08 }}
          style={{ zIndex: 20 - i }}
        >
          <Link to={`/product/${p.id}`} className="block">
            <Card className="overflow-hidden rounded-3xl border border-black/5 bg-white/80 shadow-xl backdrop-blur transition-transform hover:shadow-2xl">
              <div className="relative h-56 w-full bg-gradient-to-b from-gray-50 to-white">
                <img
                  src={p.image}
                  alt={p.name}
                  className="absolute inset-0 h-full w-full object-contain p-6"
                  loading="eager"
                />
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(800px_200px_at_50%_0%,rgba(200,200,200,0.15),transparent)]" />
              </div>
              <CardContent className="space-y-2 p-5">
                <div className="flex items-center justify-between">
                  <h3 className="line-clamp-1 text-lg font-semibold text-[#2A1F1A]">
                    {p.name}
                  </h3>
                  <div className="flex items-center gap-1 text-[#C4C240]">
                    <Star className="h-4 w-4 fill-current" />
                    <span className="text-sm font-medium text-[#2A1F1A]">{p.rating}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xl font-bold text-[#2A1F1A]">{p.price}</span>
                  {p.originalPrice && (
                    <span className="text-sm text-[#6b615d] line-through">{p.originalPrice}</span>
                  )}
                </div>
              </CardContent>
            </Card>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
}

