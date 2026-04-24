import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { fadeUp } from "@/lib/utils";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

export default function GuidePage() {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  const promptTemplate = t("guide.step2Template");

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(promptTemplate);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore — older browsers; the textarea fallback is the visible pre block
    }
  };

  return (
    <>
      <SEO title={t("seo.guideTitle")} description={t("seo.guideDesc")} path="/guide" />
      <div className="pt-24 md:pt-32 pb-16 px-5 md:px-28 max-w-4xl mx-auto">
        {/* Hero */}
        <section className="mb-16">
          <motion.span
            {...fadeUp(0)}
            className="inline-block text-xs font-medium tracking-wider uppercase text-accent mb-4"
          >
            {t("guide.heroBadge")}
          </motion.span>
          <motion.h1
            {...fadeUp(0.05)}
            className="text-[2rem] sm:text-4xl md:text-5xl font-medium tracking-[-1px] leading-[1.1] mb-4"
          >
            {t("guide.heroTitle1")}{" "}
            <span className="font-serif italic font-normal">{t("guide.heroTitle2")}</span>{" "}
            {t("guide.heroTitle3")}
          </motion.h1>
          <motion.p {...fadeUp(0.1)} className="text-muted-foreground text-base md:text-lg leading-relaxed">
            {t("guide.heroSubtitle")}
          </motion.p>
        </section>

        {/* Step 1 */}
        <motion.section {...fadeUp(0)} className="mb-16">
          <h2 className="text-xl md:text-2xl font-semibold mb-4">{t("guide.step1Title")}</h2>
          <p className="text-muted-foreground text-sm md:text-base leading-relaxed mb-4">
            {t("guide.step1Body")}
          </p>
          <div className="rounded-xl border border-border bg-card/40 px-4 py-3 text-muted-foreground text-sm">
            {t("guide.step1Example")}
          </div>
        </motion.section>

        {/* Step 2 — prompt copy */}
        <motion.section {...fadeUp(0)} className="mb-16">
          <h2 className="text-xl md:text-2xl font-semibold mb-4">{t("guide.step2Title")}</h2>
          <p className="text-muted-foreground text-sm md:text-base leading-relaxed mb-4">
            {t("guide.step2Hint")}
          </p>
          <div className="relative rounded-2xl border border-border bg-card/60 overflow-hidden">
            <button
              type="button"
              onClick={handleCopy}
              className="absolute top-3 right-3 z-10 text-xs px-3 py-1.5 rounded-lg bg-accent text-accent-foreground font-medium hover:opacity-90 transition-opacity"
            >
              {copied ? t("guide.step2Copied") : t("guide.step2Copy")}
            </button>
            <pre className="p-5 pr-24 text-sm leading-relaxed whitespace-pre-wrap font-mono text-foreground/90 overflow-x-auto">
              {promptTemplate}
            </pre>
          </div>
        </motion.section>

        {/* Step 3 — paste into AI */}
        <motion.section {...fadeUp(0)} className="mb-16">
          <h2 className="text-xl md:text-2xl font-semibold mb-4">{t("guide.step3Title")}</h2>
          <p className="text-muted-foreground text-sm md:text-base leading-relaxed mb-4">
            {t("guide.step3Body")}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <a
              href="https://chatgpt.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-3 rounded-xl border border-border bg-card/40 hover:bg-card/70 transition-colors text-center font-medium"
            >
              {t("guide.step3ChatGPT")}
            </a>
            <a
              href="https://claude.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-3 rounded-xl border border-border bg-card/40 hover:bg-card/70 transition-colors text-center font-medium"
            >
              {t("guide.step3Claude")}
            </a>
            <a
              href="https://gemini.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-3 rounded-xl border border-border bg-card/40 hover:bg-card/70 transition-colors text-center font-medium"
            >
              {t("guide.step3Gemini")}
            </a>
          </div>
        </motion.section>

        {/* Step 4 */}
        <motion.section {...fadeUp(0)} className="mb-16">
          <h2 className="text-xl md:text-2xl font-semibold mb-4">{t("guide.step4Title")}</h2>
          <ol className="list-decimal list-inside space-y-3 text-muted-foreground text-sm md:text-base leading-relaxed ml-2">
            <li>{t("guide.step4Item1")}</li>
            <li>{t("guide.step4Item2")}</li>
            <li>{t("guide.step4Item3")}</li>
            <li>{t("guide.step4Item4")}</li>
          </ol>
          <Link
            to="/upload"
            className="inline-block mt-6 px-5 py-3 rounded-xl bg-accent text-accent-foreground font-medium hover:opacity-90 transition-opacity"
          >
            {t("guide.step4Cta")}
          </Link>
        </motion.section>

        {/* FAQ */}
        <motion.section {...fadeUp(0)} className="mb-16">
          <h2 className="text-xl md:text-2xl font-semibold mb-6">{t("guide.faqTitle")}</h2>
          <div className="space-y-5">
            {[
              { q: "faqQ1", a: "faqA1" },
              { q: "faqQ2", a: "faqA2" },
              { q: "faqQ3", a: "faqA3" },
              { q: "faqQ4", a: "faqA4" },
            ].map(({ q, a }) => (
              <details key={q} className="rounded-xl border border-border bg-card/40 overflow-hidden">
                <summary className="px-5 py-4 font-medium cursor-pointer list-none flex items-center justify-between">
                  <span>{t(`guide.${q}`)}</span>
                  <span className="text-muted-foreground text-sm transition-transform duration-200 group-open:rotate-180">+</span>
                </summary>
                <div className="px-5 pb-4 text-muted-foreground text-sm md:text-base leading-relaxed">
                  {t(`guide.${a}`)}
                </div>
              </details>
            ))}
          </div>
        </motion.section>

        {/* Final CTA */}
        <motion.section
          {...fadeUp(0)}
          className="rounded-3xl border border-border bg-card/40 p-8 md:p-12 text-center"
        >
          <h2 className="text-2xl md:text-3xl font-semibold mb-3">{t("guide.finalCtaTitle")}</h2>
          <p className="text-muted-foreground text-sm md:text-base mb-6">{t("guide.finalCtaSub")}</p>
          <Link
            to="/upload"
            className="inline-block px-6 py-3 rounded-xl bg-accent text-accent-foreground font-medium hover:opacity-90 transition-opacity"
          >
            {t("guide.finalCta")}
          </Link>
        </motion.section>
      </div>
      <Footer />
    </>
  );
}
