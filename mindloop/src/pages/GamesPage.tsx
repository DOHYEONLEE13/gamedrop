import GameGrid from "@/components/GameGrid";
import AdBanner from "@/components/AdBanner";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

export default function GamesPage() {
  return (
    <>
      <SEO
        title="게임 탐색"
        description="카테고리별로 HTML 브라우저 게임을 탐색하세요. 액션, 퍼즐, RPG, 시뮬레이션 등 다양한 무료 웹 게임."
        path="/games"
      />
      <GameGrid />
      <AdBanner className="py-6 px-4" />
      <Footer />
    </>
  );
}
