import ShortsSection from "@/components/ShortsSection";
import SEO from "@/components/SEO";

export default function ShortsPage() {
  return (
    <>
      <SEO
        title="숏폼 게임"
        description="TikTok처럼 스와이프하며 HTML 게임을 즐기세요. 5분 이하 숏폼 브라우저 게임 모음."
        path="/shorts"
      />
      <ShortsSection />
    </>
  );
}
