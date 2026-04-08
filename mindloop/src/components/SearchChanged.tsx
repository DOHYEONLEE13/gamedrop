import { motion } from "framer-motion";
import { fadeUp } from "@/lib/utils";

const problems = [
  {
    name: "배포라는 벽",
    description:
      "터미널, git push, 빌드 설정 — 첫 배포까지 평균 4.5시간. 중간에 포기하는 사람이 73%입니다.",
    icon: "deploy",
  },
  {
    name: "도메인이라는 비용",
    description:
      "도메인 구매, DNS 설정, SSL 인증서, 호스팅 연결. 4단계를 거쳐야 하고, 연 2~5만 원이 나갑니다.",
    icon: "domain",
  },
  {
    name: "유입 경로 부재",
    description:
      "개인 도메인에 올리면 검색에 안 잡힙니다. SNS 링크 클릭률은 2% 미만. 만든 사람만 아는 게임이 됩니다.",
    icon: "traffic",
  },
];

function ProblemIcon({ type }: { type: string }) {
  const size = 160;
  const iconMap: Record<string, { letter: string; bg: string }> = {
    deploy: { letter: ">_", bg: "#ef4444" },
    domain: { letter: ".com", bg: "#f59e0b" },
    traffic: { letter: "0%", bg: "#6366f1" },
  };
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
      <span
        className="text-4xl font-bold font-mono"
        style={{ color: bg, opacity: 0.8 }}
      >
        {letter}
      </span>
    </div>
  );
}

export default function SearchChanged() {
  return (
    <section className="px-5 md:px-28 pt-32 md:pt-64 pb-6 md:pb-9 text-center">
      <motion.h2
        {...fadeUp(0)}
        className="text-[2rem] sm:text-5xl md:text-7xl lg:text-8xl font-medium tracking-[-1px] md:tracking-[-2px] leading-[1.1] mb-6"
      >
        게임은{" "}
        <span className="font-serif italic font-normal">완성했는데,</span>
        <br />
        여기서 멈춥니다.
      </motion.h2>

      <motion.p
        {...fadeUp(0.1)}
        className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto mb-16 md:mb-24"
      >
        바이브 코더 68%가 게임을 다 만들고도 공유하지 못합니다. 이유는 항상 같은
        3가지입니다.
      </motion.p>

      <div className="grid md:grid-cols-3 gap-12 md:gap-8 mb-20 max-w-4xl mx-auto">
        {problems.map((problem, i) => (
          <motion.div key={problem.name} {...fadeUp(0.1 + i * 0.1)}>
            <ProblemIcon type={problem.icon} />
            <h3 className="font-semibold text-base mb-2">{problem.name}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {problem.description}
            </p>
          </motion.div>
        ))}
      </div>

      <motion.p
        {...fadeUp(0.4)}
        className="text-muted-foreground text-sm text-center"
      >
        AI가 게임은 만들어줬는데, 올리는 법은 안 알려줬습니다.
      </motion.p>
    </section>
  );
}
