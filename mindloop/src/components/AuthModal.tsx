import { useState, useMemo, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthContext } from "@/contexts/AuthContext";
import { useToast } from "@/components/Toast";

type Tab = "login" | "signup";

const COMMON_PASSWORDS = new Set([
  "password", "password1", "password123", "qwerty", "qwerty123",
  "123456", "1234567", "12345678", "123456789", "1234567890",
  "111111", "000000", "abc123", "iloveyou", "admin", "letmein",
  "welcome", "monkey", "dragon", "master", "asdf1234", "asdfasdf",
  "gamedrop", "playwave",
]);

interface PasswordCheck {
  score: 0 | 1 | 2 | 3 | 4;
  label: string;
  color: string;
  reason: string | null;
}

function evaluatePassword(pw: string): PasswordCheck {
  if (!pw) return { score: 0, label: "", color: "bg-white/10", reason: null };
  if (COMMON_PASSWORDS.has(pw.toLowerCase())) {
    return { score: 1, label: "매우 약함", color: "bg-red-500", reason: "자주 쓰이는 비밀번호입니다" };
  }
  if (pw.length < 8) {
    return { score: 1, label: "매우 약함", color: "bg-red-500", reason: "8자 이상 필요합니다" };
  }
  const hasLower = /[a-z]/.test(pw);
  const hasUpper = /[A-Z]/.test(pw);
  const hasDigit = /\d/.test(pw);
  const hasSymbol = /[^A-Za-z0-9]/.test(pw);
  const variety = [hasLower || hasUpper, hasDigit, hasSymbol, hasUpper && hasLower].filter(Boolean).length;
  if (!hasDigit || !(hasLower || hasUpper)) {
    return { score: 2, label: "약함", color: "bg-orange-500", reason: "영문과 숫자를 함께 사용하세요" };
  }
  if (pw.length >= 12 && variety >= 3) {
    return { score: 4, label: "강함", color: "bg-green-500", reason: null };
  }
  if (pw.length >= 10 && variety >= 2) {
    return { score: 3, label: "보통", color: "bg-yellow-500", reason: null };
  }
  return { score: 2, label: "약함", color: "bg-orange-500", reason: "더 길게 만들거나 기호를 추가하세요" };
}

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: Tab;
}

export default function AuthModal({
  isOpen,
  onClose,
  initialTab = "login",
}: AuthModalProps) {
  const [tab, setTab] = useState<Tab>(initialTab);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { login, register } = useAuthContext();
  const { toast } = useToast();

  const pwCheck = useMemo(() => evaluatePassword(password), [password]);

  const resetForm = () => {
    setUsername("");
    setPassword("");
    setError("");
  };

  const switchTab = (t: Tab) => {
    setTab(t);
    resetForm();
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError("아이디와 비밀번호를 입력하세요");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const user = await login(username, password);
      toast(
        user.role === "admin"
          ? `관리자 ${user.username}님 환영합니다!`
          : `${user.username}님 환영합니다!`,
        "success"
      );
      resetForm();
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: FormEvent) => {
    e.preventDefault();
    if (!username || username.length < 3) {
      setError("아이디는 3자 이상이어야 합니다");
      return;
    }
    if (!password || password.length < 8) {
      setError("비밀번호는 8자 이상이어야 합니다");
      return;
    }
    if (pwCheck.score < 3) {
      setError(pwCheck.reason || "비밀번호가 너무 약합니다 (영문 + 숫자 8자 이상 권장)");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const user = await register(username, password);
      toast(`${user.username}님 환영합니다!`, "success");
      resetForm();
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const tabs: { key: Tab; label: string }[] = [
    { key: "login", label: "로그인" },
    { key: "signup", label: "회원가입" },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
        >
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="relative w-full max-w-md rounded-2xl bg-card/95 backdrop-blur-xl border border-border/40 p-6 shadow-2xl"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="relative flex items-center justify-center w-6 h-6 rounded-full border-2 border-foreground/60">
                <div className="w-2.5 h-2.5 rounded-full border border-foreground/60" />
              </div>
              <span className="font-bold text-sm text-foreground">GAMEDROP</span>
            </div>

            <div className="flex rounded-xl bg-secondary/50 p-1 mb-6">
              {tabs.map((t) => (
                <button
                  key={t.key}
                  onClick={() => switchTab(t.key)}
                  className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    tab === t.key
                      ? "bg-foreground text-background shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={tab === "login" ? handleLogin : handleSignup} className="space-y-4">
              <div>
                <label className="block text-xs text-muted-foreground mb-1.5">아이디</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="아이디"
                  autoComplete="username"
                  className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border/40 text-foreground text-sm placeholder:text-muted-foreground/50 outline-none focus:border-foreground/30 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-1.5">비밀번호</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="비밀번호"
                  autoComplete={tab === "login" ? "current-password" : "new-password"}
                  className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border/40 text-foreground text-sm placeholder:text-muted-foreground/50 outline-none focus:border-foreground/30 transition-colors"
                />
                {tab === "signup" && password.length > 0 && (
                  <div className="mt-2">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className={`h-1 flex-1 rounded-full transition-colors duration-200 ${
                            i <= pwCheck.score ? pwCheck.color : "bg-white/10"
                          }`}
                        />
                      ))}
                    </div>
                    <div className="flex items-center justify-between mt-1.5">
                      <span className="text-[10px] text-muted-foreground">
                        {pwCheck.reason || "영문 + 숫자 8자 이상 권장"}
                      </span>
                      <span className={`text-[10px] font-semibold ${
                        pwCheck.score >= 3 ? "text-green-400"
                        : pwCheck.score === 2 ? "text-orange-400"
                        : "text-red-400"
                      }`}>
                        {pwCheck.label}
                      </span>
                    </div>
                  </div>
                )}
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-foreground text-background font-semibold text-sm hover:bg-foreground/90 transition-colors disabled:opacity-50"
              >
                {loading ? "처리 중..." : tab === "login" ? "로그인" : "회원가입"}
              </button>
              <p className="text-center text-xs text-muted-foreground">
                {tab === "login" ? (
                  <>
                    계정이 없으신가요?{" "}
                    <button type="button" onClick={() => switchTab("signup")} className="text-foreground hover:underline">
                      회원가입
                    </button>
                  </>
                ) : (
                  <>
                    이미 계정이 있으신가요?{" "}
                    <button type="button" onClick={() => switchTab("login")} className="text-foreground hover:underline">
                      로그인
                    </button>
                  </>
                )}
              </p>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
