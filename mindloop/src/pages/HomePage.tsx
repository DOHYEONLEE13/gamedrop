import Hero from "@/components/Hero";
import SearchChanged from "@/components/SearchChanged";
import Mission from "@/components/Mission";
import Solution from "@/components/Solution";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <>
      <Hero />
      <SearchChanged />
      <Mission />
      <Solution />
      <CTA />
      <Footer />
    </>
  );
}
