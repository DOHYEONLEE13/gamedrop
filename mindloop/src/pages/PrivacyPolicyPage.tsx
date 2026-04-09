import { motion } from "framer-motion";
import { fadeUp } from "@/lib/utils";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

export default function PrivacyPolicyPage() {
  return (
    <>
      <SEO title="개인정보 처리방침" description="GameDrop의 개인정보 처리방침입니다." path="/privacy" />
      <section className="pt-24 md:pt-32 pb-16 px-5 md:px-28 max-w-4xl mx-auto">
        <motion.h1
          {...fadeUp(0)}
          className="text-[2rem] sm:text-4xl md:text-5xl font-medium tracking-[-1px] leading-[1.1] mb-4"
        >
          개인정보처리방침
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
              1. 수집하는 개인정보 항목
            </h2>
            <p className="mb-3">
              GameDrop은 서비스 제공을 위해 아래와 같은 개인정보를 수집합니다.
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>
                <strong className="text-foreground">회원가입 시:</strong>{" "}
                사용자 이름(닉네임), 비밀번호
              </li>
              <li>
                <strong className="text-foreground">서비스 이용 시:</strong>{" "}
                게임 플레이 기록, 좋아요/저장 내역, 업로드한 게임 파일 및
                메타데이터
              </li>
              <li>
                <strong className="text-foreground">자동 수집:</strong> IP 주소,
                브라우저 종류 및 버전, 접속 일시, 쿠키 정보
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-4">
              2. 개인정보의 수집 및 이용 목적
            </h2>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>회원 관리: 회원 식별, 로그인, 서비스 이용 권한 관리</li>
              <li>
                서비스 제공: 게임 업로드/배포, 플레이 기록 저장, 좋아요/저장
                기능
              </li>
              <li>서비스 개선: 이용 통계 분석, 서비스 품질 향상</li>
              <li>
                광고 게재: Google AdSense를 통한 맞춤형 광고 제공 (아래 5항
                참조)
              </li>
              <li>부정 이용 방지: 악성 코드 업로드 차단, 비정상 접근 탐지</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-4">
              3. 개인정보의 보유 및 이용 기간
            </h2>
            <p className="mb-3">
              GameDrop은 회원 탈퇴 시 또는 수집 목적이 달성된 후 지체 없이
              개인정보를 파기합니다. 단, 관련 법령에 따라 보존이 필요한 경우 해당
              기간 동안 보관합니다.
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>서비스 이용 기록: 회원 탈퇴 후 즉시 파기</li>
              <li>부정 이용 방지 기록: 1년</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-4">
              4. 개인정보의 파기 절차 및 방법
            </h2>
            <p>
              수집 목적이 달성되거나 보유 기간이 경과한 개인정보는 지체 없이
              파기합니다. 전자적 파일은 복구 불가능한 방법으로 삭제하며, 종이
              문서는 분쇄 또는 소각합니다.
            </p>
          </div>

          <div>
            <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-4">
              5. 쿠키 및 광고
            </h2>
            <p className="mb-3">
              GameDrop은 Google AdSense를 통해 광고를 게재합니다. Google 및
              제3자 광고 네트워크는 사용자의 관심사에 기반한 광고를 표시하기 위해
              쿠키를 사용할 수 있습니다.
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>
                Google은 DoubleClick 쿠키를 사용하여 사용자의 웹사이트 방문
                기록을 기반으로 관련성 높은 광고를 표시합니다.
              </li>
              <li>
                사용자는{" "}
                <a
                  href="https://adssettings.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:underline"
                >
                  Google 광고 설정
                </a>
                에서 맞춤 광고를 비활성화할 수 있습니다.
              </li>
              <li>
                제3자 광고 쿠키의 사용을 거부하려면{" "}
                <a
                  href="https://www.aboutads.info/choices/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:underline"
                >
                  aboutads.info
                </a>
                를 방문하시기 바랍니다.
              </li>
            </ul>
            <p className="mt-3">
              자세한 내용은{" "}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline"
              >
                Google 개인정보처리방침
              </a>
              을 참고하시기 바랍니다.
            </p>
          </div>

          <div>
            <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-4">
              6. 개인정보의 제3자 제공
            </h2>
            <p>
              GameDrop은 원칙적으로 이용자의 개인정보를 제3자에게 제공하지
              않습니다. 다만, 이용자의 동의가 있거나 법령에 의한 경우에는 예외로
              합니다. 광고 게재를 위해 Google AdSense에 쿠키 기반 데이터가
              전달될 수 있으며, 이는 위 5항에서 설명한 범위에 한합니다.
            </p>
          </div>

          <div>
            <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-4">
              7. 이용자의 권리
            </h2>
            <p className="mb-3">
              이용자는 언제든지 다음의 권리를 행사할 수 있습니다.
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>개인정보 열람, 정정, 삭제 요청</li>
              <li>개인정보 처리 정지 요청</li>
              <li>회원 탈퇴를 통한 개인정보 삭제</li>
            </ul>
            <p className="mt-3">
              위 요청은 아래 연락처를 통해 접수할 수 있으며, 지체 없이
              처리하겠습니다.
            </p>
          </div>

          <div>
            <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-4">
              8. 개인정보 보호책임자
            </h2>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>
                <strong className="text-foreground">담당:</strong> GameDrop
                운영팀
              </li>
              <li>
                <strong className="text-foreground">이메일:</strong>{" "}
                <a
                  href="mailto:gamedrop.official1@gmail.com"
                  className="text-accent hover:underline"
                >
                  gamedrop.official1@gmail.com
                </a>
              </li>
            </ul>
          </div>

          <div className="border-t border-border/30 pt-8">
            <p>
              본 개인정보처리방침은 2026년 4월 9일부터 적용됩니다. 정책이 변경될
              경우 사이트 공지를 통해 안내드리겠습니다.
            </p>
          </div>
        </motion.div>
      </section>
      <Footer />
    </>
  );
}
