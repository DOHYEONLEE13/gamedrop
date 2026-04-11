import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { fadeUp } from "@/lib/utils";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

export default function TermsOfServicePage() {
  const { t } = useTranslation();
  return (
    <>
      <SEO title={t("seo.termsTitle")} description={t("terms.title")} path="/terms" />
      <section className="pt-24 md:pt-32 pb-16 px-5 md:px-28 max-w-4xl mx-auto">
        <motion.h1
          {...fadeUp(0)}
          className="text-[2rem] sm:text-4xl md:text-5xl font-medium tracking-[-1px] leading-[1.1] mb-4"
        >
          {t("terms.title")}
        </motion.h1>
        <motion.p {...fadeUp(0.05)} className="text-muted-foreground text-sm mb-12">
          {t("terms.lastUpdated")}
        </motion.p>

        <motion.div
          {...fadeUp(0.1)}
          className="space-y-10 text-muted-foreground text-sm md:text-base leading-relaxed"
        >
          <div>
            <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-4">{t("terms.sec1Title")}</h2>
            <p>{t("terms.sec1Body")}</p>
          </div>

          <div>
            <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-4">{t("terms.sec2Title")}</h2>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>{t("terms.sec2Item1")}</li>
              <li>{t("terms.sec2Item2")}</li>
              <li>{t("terms.sec2Item3")}</li>
              <li>{t("terms.sec2Item4")}</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-4">{t("terms.sec3Title")}</h2>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>{t("terms.sec3Item1")}</li>
              <li>{t("terms.sec3Item2")}</li>
              <li>{t("terms.sec3Item3")}</li>
              <li>{t("terms.sec3Item4")}</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-4">{t("terms.sec4Title")}</h2>
            <p>{t("terms.sec4Body")}</p>
          </div>

          <div>
            <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-4">{t("terms.sec5Title")}</h2>
            <p>{t("terms.sec5Body")}</p>
          </div>

          <div>
            <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-4">{t("terms.sec6Title")}</h2>
            <p>{t("terms.sec6Body")}</p>
          </div>

          <div>
            <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-4">{t("terms.sec7Title")}</h2>
            <p>{t("terms.sec7Body")}</p>
          </div>

          <div className="border-t border-border/30 pt-8">
            <p>{t("terms.effectiveDate")}</p>
          </div>
        </motion.div>
      </section>
      <Footer />
    </>
  );
}
