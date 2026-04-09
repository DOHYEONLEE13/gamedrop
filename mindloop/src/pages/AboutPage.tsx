import { motion } from "framer-motion";
import { fadeUp } from "@/lib/utils";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

export default function AboutPage() {
  return (
    <>
      <SEO title="GameDrop 소개" description="GameDrop은 누구나 HTML 게임을 무료로 업로드하고 배포할 수 있는 플랫폼입니다." path="/about" />
      <section className="pt-24 md:pt-32 pb-16 px-5 md:px-28 max-w-4xl mx-auto">
        <motion.h1
          {...fadeUp(0)}
          className="text-[2rem] sm:text-4xl md:text-5xl font-medium tracking-[-1px] leading-[1.1] mb-4"
        >
          GameDrop 소개
        </motion.h1>
        <motion.p
          {...fadeUp(0.05)}
          className="text-muted-foreground text-sm mb-12"
        >
          누구나 게임을 만들고, 공유하고, 즐기는 공간
        </motion.p>

        <motion.div
          {...fadeUp(0.1)}
          className="space-y-10 text-muted-foreground text-sm md:text-base leading-relaxed"
        >
          <div>
            <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-4">
              우리가 만드는 것
            </h2>
            <p>
              GameDrop은 HTML 게임을 업로드하고 브라우저에서 바로 플레이할 수
              있는 플랫폼입니다. 별도의 설치 없이 드래그앤드롭으로 게임을
              게시하고, 전 세계 플레이어와 공유하세요.
            </p>
          </div>

          <div>
            <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-4">
              왜 GameDrop인가
            </h2>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>
                <strong className="text-foreground">즉시 게시</strong> — 파일을
                올리면 바로 플레이 가능
              </li>
              <li>
                <strong className="text-foreground">숏폼 + 롱폼</strong> — 짧은
                캐주얼 게임부터 깊이 있는 게임까지
              </li>
              <li>
                <strong className="text-foreground">안전한 실행</strong> — 모든
                게임은 격리된 샌드박스에서 실행
              </li>
              <li>
                <strong className="text-foreground">무료</strong> — 업로드도
                플레이도 무료
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-4">
              연락처
            </h2>
            <p>
              제안, 문의, 제휴는{" "}
              <a
                href="mailto:gamedrop.official1@gmail.com"
                className="text-accent hover:underline"
              >
                gamedrop.official1@gmail.com
              </a>
              으로 보내주세요.
            </p>
          </div>
        </motion.div>
      </section>
      <Footer />
    </>
  );
}
