import { motion } from "framer-motion";
import { fadeUp } from "@/lib/utils";

const SOLUTION_VIDEO_URL =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260325_125119_8e5ae31c-0021-4396-bc08-f7aebeb877a2.mp4";

const features = [
  {
    title: "즉시 배포",
    description:
      "HTML 파일을 끌어다 놓으면 3초 안에 플레이 가능한 링크가 생깁니다. 기존 배포 대비 소요 시간 99% 감소.",
  },
  {
    title: "자동 게임 페이지",
    description:
      "썸네일, 설명, 조작법이 정리된 전용 페이지가 자동으로 만들어집니다. 도메인 불필요, 비용 0원.",
  },
  {
    title: "숏폼 피드",
    description:
      "틱톡처럼 스와이프하면 새 게임. 한 판 30초, 끝나면 또 넘기고. 업로드 즉시 피드에 진입합니다.",
  },
  {
    title: "커뮤니티 노출",
    description:
      "심사도, 대기도 없습니다. 업로드 즉시 등록. 개인 배포 대비 평균 플레이 수 12배.",
  },
];

export default function Solution() {
  return (
    <section className="py-32 md:py-44 px-5 md:px-28 border-t border-border/30">
      <motion.p
        {...fadeUp(0)}
        className="text-xs tracking-[3px] uppercase text-muted-foreground mb-6"
      >
        서비스
      </motion.p>

      <motion.h2
        {...fadeUp(0.1)}
        className="text-[2rem] sm:text-4xl md:text-6xl font-medium tracking-[-1px] md:tracking-[-1.5px] leading-[1.1] mb-12 md:mb-16 max-w-3xl"
      >
        이 3가지를{" "}
        <span className="font-serif italic font-normal">없앴습니다</span>
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
        {features.map((feature, i) => (
          <motion.div key={feature.title} {...fadeUp(0.2 + i * 0.1)}>
            <h3 className="font-semibold text-base mb-2">{feature.title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {feature.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
