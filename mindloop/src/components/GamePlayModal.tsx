import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthContext } from "@/contexts/AuthContext";
import { useGameInteractions } from "@/hooks/useGameInteractions";
import { useToast } from "@/components/Toast";
import AuthModal from "./AuthModal";
import type { Game } from "@/types/database";

interface GamePlayModalProps {
  game: Game | null;
  onClose: () => void;
}

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

function BookmarkIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
    </svg>
  );
}

export default function GamePlayModal({ game, onClose }: GamePlayModalProps) {
  const { user } = useAuthContext();
  const { toast } = useToast();
  const { liked, saved, toggleLike, toggleSave, incrementViews, recordPlay } =
    useGameInteractions(game?.id ?? null);
  const [htmlContent, setHtmlContent] = useState<string | null>(null);
  const [loadingHtml, setLoadingHtml] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const viewCounted = useRef(false);

  // Load HTML content from Storage
  useEffect(() => {
    if (!game?.html_url) {
      setHtmlContent(null);
      return;
    }
    setLoadingHtml(true);
    fetch(game.html_url)
      .then((res) => res.text())
      .then((html) => setHtmlContent(html))
      .catch(() => setHtmlContent(null))
      .finally(() => setLoadingHtml(false));
  }, [game?.html_url]);

  // Increment views + record play on open
  useEffect(() => {
    if (!game || viewCounted.current) return;
    viewCounted.current = true;
    incrementViews();
    recordPlay();
    return () => {
      viewCounted.current = false;
    };
  }, [game, incrementViews, recordPlay]);

  // ESC to close
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (game) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [game, onClose]);

  const handleLike = async () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    const success = await toggleLike();
    if (success) {
      toast(liked ? "좋아요 취소" : "좋아요!", liked ? "info" : "success");
    }
  };

  const handleSave = async () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    const success = await toggleSave();
    if (success) {
      toast(saved ? "저장 취소" : "나중에 플레이에 저장!", saved ? "info" : "success");
    }
  };

  const categoryLabel: Record<string, string> = {
    action: "액션", puzzle: "퍼즐", rpg: "RPG",
    simulation: "시뮬레이션", strategy: "전략", casual: "캐주얼",
  };

  return (
    <>
      <AnimatePresence>
        {game && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[100] flex flex-col"
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
              onClick={onClose}
            />

            {/* Content */}
            <div className="relative z-10 flex flex-col h-full">
              {/* Top bar */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-border/30">
                <div className="flex items-center gap-3">
                  <h3 className="text-foreground font-semibold text-lg">
                    {game.title}
                  </h3>
                  <span className="text-muted-foreground text-xs px-2 py-0.5 rounded-full bg-secondary">
                    {categoryLabel[game.category] || game.category}
                  </span>
                  {game.playtime && (
                    <span className="text-muted-foreground text-xs">
                      {game.playtime}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {/* Like button */}
                  <button
                    onClick={handleLike}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                      liked
                        ? "text-red-400 bg-red-400/10"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                    }`}
                  >
                    <HeartIcon filled={liked} />
                  </button>
                  {/* Save button */}
                  <button
                    onClick={handleSave}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                      saved
                        ? "text-blue-400 bg-blue-400/10"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                    }`}
                  >
                    <BookmarkIcon filled={saved} />
                  </button>
                  {/* Close button */}
                  <button
                    onClick={onClose}
                    className="w-10 h-10 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Game area */}
              <motion.div
                initial={{ scale: 0.96, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.96, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="flex-1 flex items-center justify-center p-6"
              >
                <div className="w-full h-full max-w-5xl rounded-2xl overflow-hidden border border-border/30 bg-card">
                  {loadingHtml ? (
                    <div className="w-full h-full flex items-center justify-center">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-8 h-8 border-2 border-muted-foreground/30 border-t-foreground rounded-full"
                      />
                    </div>
                  ) : htmlContent ? (
                    <iframe
                      srcDoc={htmlContent}
                      sandbox="allow-scripts"
                      title={game.title}
                      className="w-full h-full border-none"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-center p-12">
                      <div>
                        {game.thumbnail_url && (
                          <img
                            src={game.thumbnail_url}
                            alt={game.title}
                            className="w-48 h-48 rounded-2xl object-cover mx-auto mb-6 opacity-60"
                          />
                        )}
                        <p className="text-2xl font-semibold mb-2">{game.title}</p>
                        <p className="text-muted-foreground text-sm mb-6">
                          {game.html_url ? "게임 로딩에 실패했습니다" : "아직 게임 파일이 없습니다"}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </>
  );
}
