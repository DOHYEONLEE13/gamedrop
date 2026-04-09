import SearchSection from "@/components/SearchSection";
import SEO from "@/components/SEO";

export default function SearchPage() {
  return (
    <>
      <SEO
        title="게임 검색"
        description="GameDrop에서 원하는 HTML 브라우저 게임을 검색하세요. 제목, 카테고리, 태그로 게임 찾기."
        path="/search"
      />
      <SearchSection />
    </>
  );
}
