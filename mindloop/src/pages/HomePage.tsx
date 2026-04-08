import Hero from "@/components/Hero";
import SearchChanged from "@/components/SearchChanged";
import Mission from "@/components/Mission";
import Solution from "@/components/Solution";
import CTA from "@/components/CTA";
import AdBanner from "@/components/AdBanner";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <>
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
