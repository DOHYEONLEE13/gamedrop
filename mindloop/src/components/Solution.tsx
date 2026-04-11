import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { fadeUp } from "@/lib/utils";

const SOLUTION_VIDEO_URL =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260325_125119_8e5ae31c-0021-4396-bc08-f7aebeb877a2.mp4";

const featureKeys = [
  { titleKey: "solution.feature1Title", descKey: "solution.feature1Desc" },
  { titleKey: "solution.feature2Title", descKey: "solution.feature2Desc" },
  { titleKey: "solution.feature3Title", descKey: "solution.feature3Desc" },
  { titleKey: "solution.feature4Title", descKey: "solution.feature4Desc" },
];

export default function Solution() {
  const { t } = useTranslation();

  return (
    <section className="py-32 md:py-44 px-5 md:px-28 border-t border-border/30">
      <motion.p
        {...fadeUp(0)}
        className="text-xs tracking-[3px] uppercase text-muted-foreground mb-6"
      >
        {t("solution.badge")}
      </motion.p>

      <motion.h2
        {...fadeUp(0.1)}
        className="text-[2rem] sm:text-4xl md:text-6xl font-medium tracking-[-1px] md:tracking-[-1.5px] leading-[1.1] mb-12 md:mb-16 max-w-3xl"
      >
        {t("solution.title1")}{" "}
        <span className="font-serif italic font-normal">{t("solution.title2")}</span>
      </motion.h2>

      {/* Video */}
      <motion.div {...fadeUp(0.2)} className="mb-16">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full rounded-2xl object-cover"
          style={{ aspectRatio: "3/1" }}
        >
          <source src={SOLUTION_VIDEO_URL} type="video/mp4" />
        </video>
      </motion.div>

      {/* Feature grid */}
      <div className="grid md:grid-cols-4 gap-8">
        {featureKeys.map((feature, i) => (
          <motion.div key={feature.titleKey} {...fadeUp(0.2 + i * 0.1)}>
            <h3 className="font-semibold text-base mb-2">{t(feature.titleKey)}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {t(feature.descKey)}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
