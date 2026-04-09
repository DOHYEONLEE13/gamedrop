import { motion } from "framer-motion";
import { fadeUp } from "@/lib/utils";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

export default function ContactPage() {
  return (
    <>
      <SEO title="문의하기" description="GameDrop에 문의사항이 있으시면 연락해주세요." path="/contact" />
      <section className="pt-24 md:pt-32 pb-16 px-5 md:px-28 max-w-4xl mx-auto">
        <motion.h1
          {...fadeUp(0)}
          className="text-[2rem] sm:text-4xl md:text-5xl font-medium tracking-[-1px] leading-[1.1] mb-4"
        >
          문의하기
        </motion.h1>
        <motion.p
          {...fadeUp(0.05)}
          className="text-muted-foreground text-sm mb-12"
        >
          궁금한 점이나 제안이 있으시면 언제든 연락해 주세요.
        </motion.p>

        <motion.div
          {...fadeUp(0.1)}
          className="space-y-8 text-muted-foreground text-sm md:text-base leading-relaxed"
        >
          <div className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-6 md:p-8 space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-2">
                이메일
              </h2>
              <a
                href="mailto:gamedrop.official1@gmail.com"
                className="text-accent hover:underline"
              >
                gamedrop.official1@gmail.com
              </a>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-foreground mb-2">
                문의 유형
              </h2>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>서비스 이용 관련 문의</li>
                <li>게임 업로드/게시 관련 문의</li>
                <li>저작권 침해 신고</li>
                <li>버그 리포트 및 기능 제안</li>
                <li>광고 및 제휴 문의</li>
              </ul>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-foreground mb-2">
                응답 시간
              </h2>
              <p>
                영업일 기준 1~2일 이내에 답변 드리겠습니다.
              </p>
            </div>
          </div>
        </motion.div>
      </section>
      <Footer />
    </>
  );
}
