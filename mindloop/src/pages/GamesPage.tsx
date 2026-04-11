import { useTranslation } from "react-i18next";
import GameGrid from "@/components/GameGrid";
import AdBanner from "@/components/AdBanner";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { useGames } from "@/hooks/useGames";

// AdSense slot ID for the Games page banner — replace with your real slot ID from AdSense dashboard
const GAMES_PAGE_AD_SLOT = "";

export default function GamesPage() {
  const { t } = useTranslation();
  const { games } = useGames();

  return (
    <>
      <SEO
        title={t("seo.gamesTitle")}
        description={t("seo.gamesDesc")}
        path="/games"
      />
      <GameGrid />
      <AdBanner
        slot={GAMES_PAGE_AD_SLOT}
        className="py-6 px-4"
        contentCount={games.length}
        minContent={5}
      />
      <Footer />
    </>
  );
}
