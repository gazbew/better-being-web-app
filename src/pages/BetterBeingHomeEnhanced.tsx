import React from 'react';
import { NavigationPrimary } from '@/components/NavigationPrimary';
import HeroSectionTailwind from '@/components/HeroSectionTailwind';
import ProductsSectionTailwind from '@/components/ProductsSectionTailwind';
import WellnessJourneyTailwind from '@/components/WellnessJourneyTailwind';
import FooterPrimary from '@/components/FooterPrimary';

const BetterBeingHomeEnhanced = () => {
  return (
    <div className="min-h-screen">
      <NavigationPrimary />
      <HeroSectionTailwind />
      <ProductsSectionTailwind />
      <WellnessJourneyTailwind />
      <FooterPrimary />
    </div>
  );
};

export default BetterBeingHomeEnhanced;