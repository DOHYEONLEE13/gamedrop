import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Hls from "hls.js";
import { fadeUp } from "@/lib/utils";
import { useAuthContext } from "@/contexts/AuthContext";
import AuthModal from "./AuthModal";

const HLS_URL =
  "https://stream.mux.com/8wrHPCX2dC3msyYU9ObwqNdm00u3ViXvOSHUMRYSEe5Q.m3u8";

export default function CTA() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [authOpen, setAuthOpen] = useState(false);

  const handleCta = () => {
    if (user) navigate("/upload");
    else setAuthOpen(true);
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (Hls.isSupported()) {
      const hls = new Hls({ enableWorker: true });
      hls.loadSource(HLS_URL);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch(() => {});
      });
      return () => hls.destroy();
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      // Safari native HLS
      video.src = HLS_URL;
      video.addEventListener("loadedmetadata", () => {
        video.play().catch(() => {});
      });
    }
  }, []);

  return (
    <section className="relative py-32 md:py-44 px-5 md:px-28 border-t border-border/30 overflow-hidden">
      {/* HLS Background Video */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-background/45 z-[1]" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-2xl mx-auto">
        {/* Logo icon */}
        <motion.div
          {...fadeUp(0)}
          className="mb-8 flex items-center justify-center"
        >
          <div className="relative flex items-center justify-center w-10 h-10 rounded-full border-2 border-foreground/60">
            <div className="w-5 h-5 rounded-full border border-foreground/60" />
          </div>
        </motion.div>

        <motion.h2
          {...fadeUp(0.1)}
          className="text-[2rem] sm:text-4xl md:text-6xl font-medium tracking-[-1px] md:tracking-[-1.5px] leading-[1.1] mb-6"
        >
          서랍 속 게임,{" "}
          <span className="font-serif italic font-normal">지금</span>{" "}
          꺼내세요
        </motion.h2>

        <motion.p
          {...fadeUp(0.2)}
          className="text-muted-foreground text-base md:text-lg mb-10 max-w-md"
        >
          회원가입 30초. 업로드 3초. 비용 0원.
          만든 게임이 내 컴퓨터에만 있을 이유는 없습니다.
        </motion.p>

        <motion.div {...fadeUp(0.3)} className="flex flex-wrap gap-4 justify-center">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleCta}
            className="bg-foreground text-background rounded-lg px-8 py-3.5 text-sm font-semibold"
          >
            무료로 시작하기
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleCta}
            className="liquid-glass rounded-lg px-8 py-3.5 text-sm font-semibold text-foreground"
          >
            게임 업로드하기
          </motion.button>
        </motion.div>
      </div>

      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </section>
  );
}
