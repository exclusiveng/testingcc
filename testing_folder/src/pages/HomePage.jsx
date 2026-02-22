import SEO from "../components/layout/SEO";
import HeroSection from "../components/sections/HeroSection";
import AreaNavSection from "../components/sections/AreaNavSection";
import FeaturedSection from "../components/sections/FeaturedSection";
import TrustSection from "../components/sections/TrustSection";
import CTASection from "../components/sections/CTASection";

export default function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: "360Urban",
    description: "Verified property listings in Abuja, Nigeria",
    url: "https://360urban.ng",
    areaServed: {
      "@type": "City",
      name: "Abuja",
      containedInPlace: {
        "@type": "Country",
        name: "Nigeria",
      },
    },
  };

  return (
    <>
      <SEO
        title="360Urban Verified Properties in Abuja"
        description="Find verified houses, flats, duplexes, and land in Abuja. Area-based property listings with no agent stress."
        jsonLd={jsonLd}
      />
      <HeroSection />
      <AreaNavSection />
      <FeaturedSection />
      <TrustSection />
      <CTASection />
    </>
  );
}
