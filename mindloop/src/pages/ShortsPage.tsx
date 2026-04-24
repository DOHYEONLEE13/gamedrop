import { useTranslation } from "react-i18next";
import ShortsSection from "@/components/ShortsSection";
import SEO from "@/components/SEO";

export default function ShortsPage() {
  const { t } = useTranslation();
  return (
    <>
      <SEO
        title={t("seo.shortsTitle")}
        description={t("seo.shortsDesc")}
        path="/shorts"
      />
      {/* Visually-hidden h1 for crawlers / screen readers — the full-screen swipe UI has no visible title */}
      <h1 className="sr-only">{t("pageHeading.shortsH1")}</h1>
      <p className="sr-only">{t("pageHeading.shortsLead")}</p>
      <ShortsSection />
    </>
  );
}
