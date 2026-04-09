import Hero from "@/components/Hero";
import SearchChanged from "@/components/SearchChanged";
import Mission from "@/components/Mission";
import Solution from "@/components/Solution";
import CTA from "@/components/CTA";
import AdBanner from "@/components/AdBanner";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

export default function HomePage() {
  return (
    <>
      <SEO path="/" />
      <Hero />
      <SearchChanged />
      <Mission />
      <AdBanner className="py-8 px-4" />
      <Solution />
      <CTA />
      <Footer />
    </>
  );
}
