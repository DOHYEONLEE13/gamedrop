import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { fadeUp } from "@/lib/utils";
import { useAuthContext } from "@/contexts/AuthContext";
import AuthModal from "./AuthModal";

const HERO_VIDEO_URL =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260325_120549_0cd82c36-56b3-4dd9-b190-069cfc3a623f.mp4";

const avatarColors = ["#444", "#666", "#888"];

export default function Hero() {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [authOpen, setAuthOpen] = useState(false);

  const handleCta = () => {
    if (user) navigate("/upload");
    else setAuthOpen(true);
  };

  return (
    <section className="relative min-h-screen flex items-start justify-center overflow-hidden">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src={HERO_VIDEO_URL} type="video/mp4" />
      </video>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-background to-transparent z-[1]" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-5 pt-24 md:pt-32 max-w-3xl mx-auto w-full">
        {/* Avatar row */}
        <motion.div {...fadeUp(0)} className="flex items-center mb-6">
          <div className="flex -space-x-2">
            {avatarColors.map((color, i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-full border-2 border-background"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
          <span className="ml-3 text-muted-foreground text-sm">
            가입 47초, 업로드 3초, 비용 0원
          </span>
        </motion.div>

        {/* Heading */}
        <motion.h1
          {...fadeUp(0.1)}
          className="text-[2rem] sm:text-5xl md:text-7xl lg:text-8xl font-medium tracking-[-1px] md:tracking-[-2px] leading-[1.1] mb-6"
        >
          게임 만들었으면,{" "}
          <span className="font-serif italic font-normal">3초</span>면
          올린다.
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          {...fadeUp(0.2)}
          className="text-base md:text-lg text-hero-subtitle mb-8 md:mb-10 max-w-xl px-2"
        >
          AI로 만든 HTML 게임, 파일 하나 끌어다 놓으면 전 세계가 플레이합니다.
          도메인 없이. 서버 없이. 배포 지식 없이.
        </motion.p>

        {/* CTA row */}
        <motion.div
          {...fadeUp(0.3)}
          className="liquid-glass rounded-full p-2 flex items-center w-full max-w-lg cursor-pointer"
          onClick={handleCta}
        >
          <div className="flex-1 min-w-0 px-3 sm:px-5 py-3 text-xs sm:text-sm text-muted-foreground text-left truncate">
            지금 게임을 업로드 하세요
          </div>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={(e) => {
              e.stopPropagation();
              handleCta();
            }}
            className="bg-foreground text-background rounded-full px-4 sm:px-8 py-3 text-xs sm:text-sm font-semibold whitespace-nowrap flex-shrink-0"
          >
            지금 무료로 시작하기
          </motion.button>
        </motion.div>
      </div>

      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </section>
  );
}
