import Hero from "@/components/Hero";
import SearchChanged from "@/components/SearchChanged";
import Mission from "@/components/Mission";
import Solution from "@/components/Solution";
import CTA from "@/components/CTA";
import AdBanner from "@/components/AdBanner";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { useGames } from "@/hooks/useGames";

// AdSense slot ID for the Home page banner — replace with your real slot ID from AdSense dashboard
const HOME_PAGE_AD_SLOT = "";

export default function HomePage() {
  const { games } = useGames();

  return (
    <>
      <SEO path="/" />
      <Hero />
      <SearchChanged />
      <Mission />
      <AdBanner
        slot={HOME_PAGE_AD_SLOT}
        className="py-8 px-4"
        contentCount={games.length}
        minContent={5}
      />
      <Solution />
      <CTA />
      <Footer />
    </>
  );
}
