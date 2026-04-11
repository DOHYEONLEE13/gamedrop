import { useTranslation } from "react-i18next";
import UploadSection from "@/components/UploadSection";
import SEO from "@/components/SEO";

export default function UploadPage() {
  const { t } = useTranslation();
  return (
    <>
      <SEO
        title={t("nav.upload")}
        description={t("upload.subtitle")}
        path="/upload"
      />
      <UploadSection />
    </>
  );
}
