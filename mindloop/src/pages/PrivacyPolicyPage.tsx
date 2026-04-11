import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { fadeUp } from "@/lib/utils";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

export default function PrivacyPolicyPage() {
  const { t } = useTranslation();
  return (
    <>
      <SEO title={t("seo.privacyTitle")} description={t("privacy.title")} path="/privacy" />
      <section className="pt-24 md:pt-32 pb-16 px-5 md:px-28 max-w-4xl mx-auto">
        <motion.h1
          {...fadeUp(0)}
          className="text-[2rem] sm:text-4xl md:text-5xl font-medium tracking-[-1px] leading-[1.1] mb-4"
        >
          {t("privacy.title")}
        </motion.h1>
        <motion.p {...fadeUp(0.05)} className="text-muted-foreground text-sm mb-12">
          {t("privacy.lastUpdated")}
        </motion.p>

        <motion.div
          {...fadeUp(0.1)}
          className="space-y-10 text-muted-foreground text-sm md:text-base leading-relaxed"
        >
          <div>
            <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-4">{t("privacy.sec1Title")}</h2>
            <p className="mb-3">{t("privacy.sec1Intro")}</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong className="text-foreground">{t("privacy.sec1SignupLabel")}</strong> {t("privacy.sec1SignupVal")}</li>
              <li><strong className="text-foreground">{t("privacy.sec1UseLabel")}</strong> {t("privacy.sec1UseVal")}</li>
              <li><strong className="text-foreground">{t("privacy.sec1AutoLabel")}</strong> {t("privacy.sec1AutoVal")}</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-4">{t("privacy.sec2Title")}</h2>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>{t("privacy.sec2Item1")}</li>
              <li>{t("privacy.sec2Item2")}</li>
              <li>{t("privacy.sec2Item3")}</li>
              <li>{t("privacy.sec2Item4")}</li>
              <li>{t("privacy.sec2Item5")}</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-4">{t("privacy.sec3Title")}</h2>
            <p className="mb-3">{t("privacy.sec3Intro")}</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>{t("privacy.sec3Item1")}</li>
              <li>{t("privacy.sec3Item2")}</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-4">{t("privacy.sec4Title")}</h2>
            <p>{t("privacy.sec4Body")}</p>
          </div>

          <div>
            <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-4">{t("privacy.sec5Title")}</h2>
            <p className="mb-3">{t("privacy.sec5Intro")}</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>{t("privacy.sec5Item1")}</li>
              <li>
                {t("privacy.sec5Item2Before")}
                <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                  {t("privacy.sec5Item2Link")}
                </a>
                {t("privacy.sec5Item2After")}
              </li>
              <li>
                {t("privacy.sec5Item3Before")}
                <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                  aboutads.info
                </a>
                {t("privacy.sec5Item3After")}
              </li>
            </ul>
            <p className="mt-3">
              {t("privacy.sec5OutroBefore")}
              <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                {t("privacy.sec5OutroLink")}
              </a>
              {t("privacy.sec5OutroAfter")}
            </p>
          </div>

          <div>
            <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-4">{t("privacy.sec6Title")}</h2>
            <p>{t("privacy.sec6Body")}</p>
          </div>

          <div>
            <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-4">{t("privacy.sec7Title")}</h2>
            <p className="mb-3">{t("privacy.sec7Intro")}</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>{t("privacy.sec7Item1")}</li>
              <li>{t("privacy.sec7Item2")}</li>
              <li>{t("privacy.sec7Item3")}</li>
            </ul>
            <p className="mt-3">{t("privacy.sec7Outro")}</p>
          </div>

          <div>
            <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-4">{t("privacy.sec8Title")}</h2>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong className="text-foreground">{t("privacy.sec8OwnerLabel")}</strong> {t("privacy.sec8OwnerVal")}</li>
              <li>
                <strong className="text-foreground">{t("privacy.sec8EmailLabel")}</strong>{" "}
                <a href="mailto:gamedrop.official1@gmail.com" className="text-accent hover:underline">
                  gamedrop.official1@gmail.com
                </a>
              </li>
            </ul>
          </div>

          <div className="border-t border-border/30 pt-8">
            <p>{t("privacy.effectiveDate")}</p>
          </div>
        </motion.div>
      </section>
      <Footer />
    </>
  );
}
