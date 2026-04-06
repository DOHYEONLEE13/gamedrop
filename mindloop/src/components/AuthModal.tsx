import { useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthContext } from "@/contexts/AuthContext";
import { useToast } from "@/components/Toast";

type Tab = "login" | "signup" | "admin";

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

  // Form fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [adminPassword, setAdminPassword] = useState("");

  const { signIn, signUp, adminLogin } = useAuthContext();
  const { toast } = useToast();

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setNickname("");
    setAdminPassword("");
    setError("");
  };

  const switchTab = (t: Tab) => {
    setTab(t);
    resetForm();
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("이메일과 비밀번호를 입력하세요");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const data = await signIn(email, password);
      const name = data.user?.user_metadata?.nickname || email.split("@")[0];
      toast(`${name}님 환영합니다!`, "success");
      resetForm();
      onClose();
    } catch (err: any) {
      setError(err.message === "Invalid login credentials"
        ? "이메일 또는 비밀번호가 올바르지 않습니다"
        : err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: FormEvent) => {
    e.preventDefault();
    if (!nickname) {
      setError("닉네임을 입력하세요");
      return;
    }
    if (!email) {
      setError("이메일을 입력하세요");
      return;
    }
    if (!password || password.length < 6) {
      setError("비밀번호는 6자 이상이어야 합니다");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await signUp(email, password, nickname);
      toast(`${nickname}님 환영합니다!`, "success");
      resetForm();
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLogin = async (e: FormEvent) => {
    e.preventDefault();
    if (!adminPassword) {
      setError("관리자 비밀번호를 입력하세요");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await adminLogin(adminPassword);
      toast("관리자 로그인 성공", "success");
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
    { key: "admin", label: "관리자" },
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
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="relative w-full max-w-md rounded-2xl bg-card/95 backdrop-blur-xl border border-border/40 p-6 shadow-2xl"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            {/* Logo */}
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="relative flex items-center justify-center w-6 h-6 rounded-full border-2 border-foreground/60">
                <div className="w-2.5 h-2.5 rounded-full border border-foreground/60" />
              </div>
              <span className="font-bold text-sm text-foreground">PLAYWAVE</span>
            </div>

            {/* Tabs */}
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

            {/* Error message */}
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

            {/* Login Form */}
            {tab === "login" && (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs text-muted-foreground mb-1.5">
                    이메일
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border/40 text-foreground text-sm placeholder:text-muted-foreground/50 outline-none focus:border-foreground/30 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1.5">
                    비밀번호
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="6자 이상"
                    className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border/40 text-foreground text-sm placeholder:text-muted-foreground/50 outline-none focus:border-foreground/30 transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-foreground text-background font-semibold text-sm hover:bg-foreground/90 transition-colors disabled:opacity-50"
                >
                  {loading ? "로그인 중..." : "로그인"}
                </button>
                <p className="text-center text-xs text-muted-foreground">
                  계정이 없으신가요?{" "}
                  <button
                    type="button"
                    onClick={() => switchTab("signup")}
                    className="text-foreground hover:underline"
                  >
                    회원가입
                  </button>
                </p>
              </form>
            )}

            {/* Signup Form */}
            {tab === "signup" && (
              <form onSubmit={handleSignup} className="space-y-4">
                <div>
                  <label className="block text-xs text-muted-foreground mb-1.5">
                    닉네임
                  </label>
                  <input
                    type="text"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    placeholder="게임 속 당신의 이름"
                    className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border/40 text-foreground text-sm placeholder:text-muted-foreground/50 outline-none focus:border-foreground/30 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1.5">
                    이메일
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border/40 text-foreground text-sm placeholder:text-muted-foreground/50 outline-none focus:border-foreground/30 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1.5">
                    비밀번호
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="6자 이상"
                    className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border/40 text-foreground text-sm placeholder:text-muted-foreground/50 outline-none focus:border-foreground/30 transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-foreground text-background font-semibold text-sm hover:bg-foreground/90 transition-colors disabled:opacity-50"
                >
                  {loading ? "가입 중..." : "회원가입"}
                </button>
                <p className="text-center text-xs text-muted-foreground">
                  이미 계정이 있으신가요?{" "}
                  <button
                    type="button"
                    onClick={() => switchTab("login")}
                    className="text-foreground hover:underline"
                  >
                    로그인
                  </button>
                </p>
              </form>
            )}

            {/* Admin Login Form */}
            {tab === "admin" && (
              <form onSubmit={handleAdminLogin} className="space-y-4">
                <div className="flex items-center gap-2 mb-2 px-3 py-2 rounded-lg bg-secondary/30 border border-border/20">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground flex-shrink-0">
                    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  <span className="text-xs text-muted-foreground">
                    관리자 전용 접근입니다
                  </span>
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1.5">
                    관리자 비밀번호
                  </label>
                  <input
                    type="password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="관리자 비밀번호를 입력하세요"
                    className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border/40 text-foreground text-sm placeholder:text-muted-foreground/50 outline-none focus:border-foreground/30 transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-foreground text-background font-semibold text-sm hover:bg-foreground/90 transition-colors disabled:opacity-50"
                >
                  {loading ? "확인 중..." : "관리자 로그인"}
                </button>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
