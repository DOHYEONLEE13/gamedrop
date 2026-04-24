import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { fadeUp } from "@/lib/utils";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

export default function ContentPolicyPage() {
  const { t } = useTranslation();

  const section = (titleKey: string, children: React.ReactNode) => (
    <div className="mb-10">
      <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-4">
        {t(titleKey)}
      </h2>
      <div className="text-muted-foreground text-sm md:text-base leading-relaxed space-y-2">
        {children}
      </div>
    </div>
  );

  return (
    <>
      <SEO
        title={t("seo.contentPolicyTitle")}
        description={t("seo.contentPolicyDesc")}
        path="/content-policy"
      />
      <section className="pt-24 md:pt-32 pb-16 px-5 md:px-28 max-w-4xl mx-auto">
        <motion.h1
          {...fadeUp(0)}
          className="text-[2rem] sm:text-4xl md:text-5xl font-medium tracking-[-1px] leading-[1.1] mb-4"
        >
          {t("contentPolicy.title")}
        </motion.h1>
        <motion.p {...fadeUp(0.05)} className="text-muted-foreground text-sm mb-4">
          {t("contentPolicy.lastUpdated")}
        </motion.p>
        <motion.p
          {...fadeUp(0.1)}
          className="text-muted-foreground text-sm md:text-base leading-relaxed mb-12"
        >
          {t("contentPolicy.intro")}
        </motion.p>

        <motion.div {...fadeUp(0.15)}>
          {section(
            "contentPolicy.sec1Title",
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>{t("contentPolicy.sec1Item1")}</li>
              <li>{t("contentPolicy.sec1Item2")}</li>
              <li>{t("contentPolicy.sec1Item3")}</li>
            </ul>
          )}

          {section(
            "contentPolicy.sec2Title",
            <>
              <p className="mb-3">{t("contentPolicy.sec2Intro")}</p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>{t("contentPolicy.sec2Item1")}</li>
                <li>{t("contentPolicy.sec2Item2")}</li>
                <li>{t("contentPolicy.sec2Item3")}</li>
                <li>{t("contentPolicy.sec2Item4")}</li>
                <li>{t("contentPolicy.sec2Item5")}</li>
                <li>{t("contentPolicy.sec2Item6")}</li>
                <li>{t("contentPolicy.sec2Item7")}</li>
              </ul>
            </>
          )}

          {section(
            "contentPolicy.sec3Title",
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>{t("contentPolicy.sec3Item1")}</li>
              <li>{t("contentPolicy.sec3Item2")}</li>
              <li>{t("contentPolicy.sec3Item3")}</li>
              <li>{t("contentPolicy.sec3Item4")}</li>
            </ul>
          )}

          {section("contentPolicy.sec4Title", <p>{t("contentPolicy.sec4Body")}</p>)}

          {section(
            "contentPolicy.sec5Title",
            <>
              <p className="mb-3">{t("contentPolicy.sec5Intro")}</p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>
                  {t("contentPolicy.sec5Item1").split("contact@gamedrop.win").map((part, i, arr) =>
                    i < arr.length - 1 ? (
                      <span key={i}>
                        {part}
                        <a
                          href="mailto:contact@gamedrop.win"
                          className="text-accent hover:underline"
                        >
                          contact@gamedrop.win
                        </a>
                      </span>
                    ) : (
                      <span key={i}>{part}</span>
                    )
                  )}
                </li>
                <li>{t("contentPolicy.sec5Item2")}</li>
                <li>{t("contentPolicy.sec5Item3")}</li>
              </ul>
            </>
          )}

          {section("contentPolicy.sec6Title", <p>{t("contentPolicy.sec6Body")}</p>)}

          {section("contentPolicy.sec7Title", <p>{t("contentPolicy.sec7Body")}</p>)}

          <p className="text-muted-foreground text-xs md:text-sm mt-12 pt-6 border-t border-border">
            {t("contentPolicy.effectiveDate")}
          </p>
        </motion.div>
      </section>
      <Footer />
    </>
  );
}
