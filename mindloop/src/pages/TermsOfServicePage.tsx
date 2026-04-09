import { motion } from "framer-motion";
import { fadeUp } from "@/lib/utils";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

export default function TermsOfServicePage() {
  return (
    <>
      <SEO title="이용약관" description="GameDrop 서비스 이용약관입니다." path="/terms" />
      <section className="pt-24 md:pt-32 pb-16 px-5 md:px-28 max-w-4xl mx-auto">
        <motion.h1
          {...fadeUp(0)}
          className="text-[2rem] sm:text-4xl md:text-5xl font-medium tracking-[-1px] leading-[1.1] mb-4"
        >
          이용약관
        </motion.h1>
        <motion.p
          {...fadeUp(0.05)}
          className="text-muted-foreground text-sm mb-12"
        >
          최종 수정일: 2026년 4월 9일
        </motion.p>

        <motion.div
          {...fadeUp(0.1)}
          className="space-y-10 text-muted-foreground text-sm md:text-base leading-relaxed"
        >
          <div>
            <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-4">
              1. 목적
            </h2>
            <p>
              본 약관은 GameDrop(이하 "서비스")이 제공하는 HTML 게임 업로드 및
              플레이 서비스의 이용 조건과 절차, 이용자와 서비스 간의 권리 및
              의무를 규정합니다.
            </p>
          </div>

          <div>
            <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-4">
              2. 서비스의 내용
            </h2>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>HTML 게임 업로드 및 배포</li>
              <li>브라우저 기반 게임 플레이</li>
              <li>게임 좋아요, 저장, 플레이 기록 관리</li>
              <li>카테고리별 게임 탐색</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-4">
              3. 이용자의 의무
            </h2>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>타인의 저작권을 침해하는 콘텐츠를 업로드하지 않아야 합니다.</li>
              <li>
                악성 코드, 피싱, 또는 보안 위협이 포함된 파일을 업로드하지 않아야
                합니다.
              </li>
              <li>
                서비스의 정상적인 운영을 방해하는 행위를 하지 않아야 합니다.
              </li>
              <li>다른 이용자의 개인정보를 수집하거나 악용하지 않아야 합니다.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-4">
              4. 콘텐츠 관리
            </h2>
            <p>
              업로드된 게임은 관리자의 검토를 거쳐 게시됩니다. 서비스는 약관을
              위반하는 콘텐츠를 사전 통보 없이 삭제하거나 게시를 거절할 수
              있습니다. 거절 시 사유가 업로더에게 안내됩니다.
            </p>
          </div>

          <div>
            <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-4">
              5. 지식재산권
            </h2>
            <p>
              업로더가 업로드한 게임의 저작권은 해당 업로더에게 있습니다.
              GameDrop은 서비스 제공 목적으로 업로드된 콘텐츠를 게시, 배포할 수
              있는 비독점적 라이선스를 가집니다.
            </p>
          </div>

          <div>
            <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-4">
              6. 면책 조항
            </h2>
            <p>
              서비스는 이용자가 업로드한 콘텐츠에 대해 책임을 지지 않습니다.
              서비스 장애, 데이터 손실 등 불가항력으로 인한 피해에 대해 서비스는
              책임을 지지 않습니다.
            </p>
          </div>

          <div>
            <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-4">
              7. 약관의 변경
            </h2>
            <p>
              본 약관은 필요에 따라 변경될 수 있으며, 변경 시 사이트 공지를 통해
              안내합니다. 변경된 약관에 동의하지 않는 경우 서비스 이용을 중단할 수
              있습니다.
            </p>
          </div>

          <div className="border-t border-border/30 pt-8">
            <p>
              본 이용약관은 2026년 4월 9일부터 적용됩니다.
            </p>
          </div>
        </motion.div>
      </section>
      <Footer />
    </>
  );
}
