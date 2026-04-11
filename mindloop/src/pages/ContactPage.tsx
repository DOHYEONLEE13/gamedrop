import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { fadeUp } from "@/lib/utils";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

export default function ContactPage() {
  const { t } = useTranslation();
  return (
    <>
      <SEO title={t("seo.contactTitle")} description={t("contact.subtitle")} path="/contact" />
      <section className="pt-24 md:pt-32 pb-16 px-5 md:px-28 max-w-4xl mx-auto">
        <motion.h1
          {...fadeUp(0)}
          className="text-[2rem] sm:text-4xl md:text-5xl font-medium tracking-[-1px] leading-[1.1] mb-4"
        >
          {t("contact.title")}
        </motion.h1>
        <motion.p
          {...fadeUp(0.05)}
          className="text-muted-foreground text-sm mb-12"
        >
          {t("contact.subtitle")}
        </motion.p>

        <motion.div
          {...fadeUp(0.1)}
          className="space-y-8 text-muted-foreground text-sm md:text-base leading-relaxed"
        >
          <div className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-6 md:p-8 space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-2">
                {t("contact.email")}
              </h2>
              <a
                href="mailto:gamedrop.official1@gmail.com"
                className="text-accent hover:underline"
              >
                gamedrop.official1@gmail.com
              </a>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-foreground mb-2">
                {t("contact.inquiryTypes")}
              </h2>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>{t("contact.type1")}</li>
                <li>{t("contact.type2")}</li>
                <li>{t("contact.type3")}</li>
                <li>{t("contact.type4")}</li>
                <li>{t("contact.type5")}</li>
              </ul>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-foreground mb-2">
                {t("contact.responseTime")}
              </h2>
              <p>
                {t("contact.responseTimeDesc")}
              </p>
            </div>
          </div>
        </motion.div>
      </section>
      <Footer />
    </>
  );
}
