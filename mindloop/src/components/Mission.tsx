import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useTranslation } from "react-i18next";
import { fadeUp } from "@/lib/utils";

const MISSION_VIDEO_URL =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260325_132944_a0d124bb-eaa1-4082-aa30-2310efb42b4b.mp4";

interface WordProps {
  word: string;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
  range: [number, number];
  highlighted: boolean;
}

function Word({ word, progress, range, highlighted }: WordProps) {
  const opacity = useTransform(progress, range, [0.15, 1]);
  return (
    <motion.span
      style={{ opacity }}
      className={`inline-block mr-[0.3em] ${
        highlighted ? "text-foreground" : "text-hero-subtitle"
      }`}
    >
      {word}
    </motion.span>
  );
}

export default function Mission() {
  const { t, i18n } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.8", "end 0.3"],
  });

  const p1Text = t("mission.text1");
  const p2Text = t("mission.text2");

  // Highlighted words differ by language
  const p1HighlightsKo = new Set(["만나는", "3초", "발견합니다."]);
  const p1HighlightsEn = new Set(["meet", "3sec", "discover"]);
  const p1Highlights = i18n.language.startsWith("ko") ? p1HighlightsKo : p1HighlightsEn;

  const p1Words = p1Text.split(" ");
  const p2Words = p2Text.split(" ");
  const totalWords = p1Words.length + p2Words.length;

  return (
    <section className="pt-0 pb-32 md:pb-44 px-5 md:px-28">
      {/* Video */}
      <motion.div {...fadeUp(0)} className="flex justify-center mb-20">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full max-w-[800px] aspect-square object-cover rounded-2xl"
        >
          <source src={MISSION_VIDEO_URL} type="video/mp4" />
        </video>
      </motion.div>

      {/* Scroll-driven word reveal */}
      <div ref={containerRef} className="max-w-4xl mx-auto">
        <h2 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-medium tracking-[-0.5px] md:tracking-[-1px] leading-snug">
          {p1Words.map((word, i) => {
            const start = i / totalWords;
            const end = (i + 1) / totalWords;
            return (
              <Word
                key={`p1-${i}`}
                word={word}
                progress={scrollYProgress}
                range={[start, end]}
                highlighted={p1Highlights.has(word.replace(/[—,.']/g, "").toLowerCase())}
              />
            );
          })}
        </h2>

        <p className="text-base sm:text-xl md:text-2xl lg:text-3xl font-medium mt-10 leading-snug">
          {p2Words.map((word, i) => {
            const globalIndex = p1Words.length + i;
            const start = globalIndex / totalWords;
            const end = (globalIndex + 1) / totalWords;
            return (
              <Word
                key={`p2-${i}`}
                word={word}
                progress={scrollYProgress}
                range={[start, end]}
                highlighted={false}
              />
            );
          })}
        </p>
      </div>
    </section>
  );
}
