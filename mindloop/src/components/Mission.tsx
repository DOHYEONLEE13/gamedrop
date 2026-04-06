import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
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

const p1Text =
  "우리는 만드는 사람과 플레이하는 사람이 만나는 공간을 짓고 있습니다 — 제작자는 3초 만에 배포하고, 플레이어는 스와이프 한 번으로 새 게임을 발견합니다.";
const p2Text =
  "도메인도, 서버도, 배포 지식도 필요 없는 세상 — 더 적은 장벽, 더 적은 비용, 더 많은 플레이어를 위한 플랫폼.";

const p1Highlights = new Set(["만나는", "3초", "발견합니다."]);

export default function Mission() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.8", "end 0.3"],
  });

  const p1Words = p1Text.split(" ");
  const p2Words = p2Text.split(" ");
  const totalWords = p1Words.length + p2Words.length;

  return (
    <section className="pt-0 pb-32 md:pb-44 px-6 md:px-28">
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
        <p className="text-2xl md:text-4xl lg:text-5xl font-medium tracking-[-1px] leading-snug">
          {p1Words.map((word, i) => {
            const start = i / totalWords;
            const end = (i + 1) / totalWords;
            return (
              <Word
                key={`p1-${i}`}
                word={word}
                progress={scrollYProgress}
                range={[start, end]}
                highlighted={p1Highlights.has(
                  word.replace(/[—,.']/g, "").toLowerCase()
                )}
              />
            );
          })}
        </p>

        <p className="text-xl md:text-2xl lg:text-3xl font-medium mt-10 leading-snug">
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
