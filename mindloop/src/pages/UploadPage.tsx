import UploadSection from "@/components/UploadSection";
import SEO from "@/components/SEO";

export default function UploadPage() {
  return (
    <>
      <SEO
        title="게임 업로드"
        description="HTML 게임 파일을 드래그 앤 드롭으로 업로드하세요. 서버 없이, 도메인 없이, 무료로 게임을 배포하세요."
        path="/upload"
      />
      <UploadSection />
    </>
  );
}
