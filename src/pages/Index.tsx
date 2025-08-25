import { NavigationPrimary } from '@/components/NavigationPrimary';
import HeroSection from '@/components/HeroSection';
import ProductsSection from '@/components/ProductsSection';
import WellnessJourneyTailwind from '@/components/WellnessJourneyTailwind';
import FooterPrimary from '@/components/FooterPrimary';

const Index = () => {
  return (
    <div className="min-h-screen">
      <NavigationPrimary />
      <HeroSection />
      <ProductsSection />
      <WellnessJourneyTailwind />
      <FooterPrimary />
    </div>
  );
};

export default Index;