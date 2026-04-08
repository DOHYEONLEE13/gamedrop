import GameGrid from "@/components/GameGrid";
import AdBanner from "@/components/AdBanner";
import Footer from "@/components/Footer";

export default function GamesPage() {
  return (
    <>
      <GameGrid />
      <AdBanner className="py-6 px-4" />
      <Footer />
    </>
  );
}
