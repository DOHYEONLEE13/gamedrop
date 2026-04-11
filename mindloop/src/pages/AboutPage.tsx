import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { fadeUp } from "@/lib/utils";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

export default function AboutPage() {
  const { t } = useTranslation();
  return (
    <>
      <SEO title={t("seo.aboutTitle")} description={t("seo.aboutDesc")} path="/about" />
      <section className="pt-24 md:pt-32 pb-16 px-5 md:px-28 max-w-4xl mx-auto">
        <motion.h1
          {...fadeUp(0)}
          className="text-[2rem] sm:text-4xl md:text-5xl font-medium tracking-[-1px] leading-[1.1] mb-4"
        >
          {t("about.title")}
        </motion.h1>
        <motion.p
          {...fadeUp(0.05)}
          className="text-muted-foreground text-sm mb-12"
        >
          {t("about.subtitle")}
        </motion.p>

        <motion.div
          {...fadeUp(0.1)}
          className="space-y-10 text-muted-foreground text-sm md:text-base leading-relaxed"
        >
          <div>
            <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-4">
              {t("about.whatWeBuild")}
            </h2>
            <p>
              {t("about.whatWeBuildDesc")}
            </p>
          </div>

          <div>
            <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-4">
              {t("about.whyGameDrop")}
            </h2>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>
                <strong className="text-foreground">{t("about.instantPublish")}</strong> — {t("about.instantPublishDesc")}
              </li>
              <li>
                <strong className="text-foreground">{t("about.bothForms")}</strong> — {t("about.bothFormsDesc")}
              </li>
              <li>
                <strong className="text-foreground">{t("about.safeExec")}</strong> — {t("about.safeExecDesc")}
              </li>
              <li>
                <strong className="text-foreground">{t("about.free")}</strong> — {t("about.freeDesc")}
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-4">
              {t("about.contactTitle")}
            </h2>
            <p>
              {t("about.contactDesc", { email: "gamedrop.official1@gmail.com" }).split("gamedrop.official1@gmail.com").map((part, i, arr) =>
                i < arr.length - 1 ? (
                  <span key={i}>
                    {part}
                    <a
                      href="mailto:gamedrop.official1@gmail.com"
                      className="text-accent hover:underline"
                    >
                      gamedrop.official1@gmail.com
                    </a>
                  </span>
                ) : (
                  <span key={i}>{part}</span>
                )
              )}
            </p>
          </div>
        </motion.div>
      </section>
      <Footer />
    </>
  );
}
