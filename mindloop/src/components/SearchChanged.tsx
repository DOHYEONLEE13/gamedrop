import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { fadeUp } from "@/lib/utils";

const iconMap: Record<string, { letter: string; bg: string }> = {
  deploy: { letter: ">_", bg: "#ef4444" },
  domain: { letter: ".com", bg: "#f59e0b" },
  traffic: { letter: "0%", bg: "#6366f1" },
};

function ProblemIcon({ type }: { type: string }) {
  const size = 160;
  const { letter, bg } = iconMap[type] ?? { letter: "?", bg: "#333" };
  return (
    <div
      className="rounded-2xl flex items-center justify-center mx-auto mb-6"
      style={{
        width: size,
        height: size,
        background: `linear-gradient(135deg, ${bg}22 0%, ${bg}08 100%)`,
        border: `1px solid ${bg}33`,
      }}
    >
      <span className="text-4xl font-bold font-mono" style={{ color: bg, opacity: 0.8 }}>
        {letter}
      </span>
    </div>
  );
}

export default function SearchChanged() {
  const { t } = useTranslation();

  const problems = [
    { nameKey: "searchChanged.problem1Title", descKey: "searchChanged.problem1Desc", icon: "deploy" },
    { nameKey: "searchChanged.problem2Title", descKey: "searchChanged.problem2Desc", icon: "domain" },
    { nameKey: "searchChanged.problem3Title", descKey: "searchChanged.problem3Desc", icon: "traffic" },
  ];

  return (
    <section className="px-5 md:px-28 pt-32 md:pt-64 pb-6 md:pb-9 text-center">
      <motion.h2
        {...fadeUp(0)}
        className="text-[2rem] sm:text-5xl md:text-7xl lg:text-8xl font-medium tracking-[-1px] md:tracking-[-2px] leading-[1.1] mb-6"
      >
        {t("searchChanged.title1")}{" "}
        <span className="font-serif italic font-normal">{t("searchChanged.title2")}</span>
        <br />
        {t("searchChanged.title3")}
      </motion.h2>

      <motion.p
        {...fadeUp(0.1)}
        className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto mb-16 md:mb-24"
      >
        {t("searchChanged.subtitle")}
      </motion.p>

      <div className="grid md:grid-cols-3 gap-12 md:gap-8 mb-20 max-w-4xl mx-auto">
        {problems.map((problem, i) => (
          <motion.div key={problem.icon} {...fadeUp(0.1 + i * 0.1)}>
            <ProblemIcon type={problem.icon} />
            <h3 className="font-semibold text-base mb-2">{t(problem.nameKey)}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {t(problem.descKey)}
            </p>
          </motion.div>
        ))}
      </div>

      <motion.p
        {...fadeUp(0.4)}
        className="text-muted-foreground text-sm text-center"
      >
        {t("searchChanged.closing")}
      </motion.p>
    </section>
  );
}
