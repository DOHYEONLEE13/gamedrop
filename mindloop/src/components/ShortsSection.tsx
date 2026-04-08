import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Hls from "hls.js";
import { useGames } from "@/hooks/useGames";
import { useAuthContext } from "@/contexts/AuthContext";
import { useGameInteractions } from "@/hooks/useGameInteractions";
import { useToast } from "@/components/Toast";
import AuthModal from "./AuthModal";
import { shorts as mockShorts } from "@/data/shorts";
import type { Game } from "@/types/database";

const HLS_URL =
  "https://stream.mux.com/8wrHPCX2dC3msyYU9ObwqNdm00u3ViXvOSHUMRYSEe5Q.m3u8";

const categoryLabel: Record<string, string> = {
  action: "액션", puzzle: "퍼즐", rpg: "RPG",
  simulation: "시뮬레이션", strategy: "전략", casual: "캐주얼",
};

function formatNumber(n: number) {
  if (n >= 10000) return (n / 10000).toFixed(1) + "만";
  if (n >= 1000) return (n / 1000).toFixed(1) + "천";
  return n.toString();
}

/* ── Icons ── */
function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

function BookmarkIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8" />
      <polyline points="16,6 12,2 8,6" />
      <line x1="12" y1="2" x2="12" y2="15" />
    </svg>
  );
}

function ActionButton({ icon, label, active, onClick }: {
  icon: React.ReactNode; label: string; active?: boolean; onClick?: (e: React.MouseEvent) => void;
}) {
  return (
    <button onClick={onClick} className="flex flex-col items-center gap-1 group">
      <div className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200 ${
        active ? "bg-white/20 text-white" : "bg-white/10 text-white/70 group-hover:bg-white/20 group-hover:text-white"
      }`}>
        {icon}
      </div>
      <span className="text-[10px] text-white/70">{label}</span>
    </button>
  );
}

/* ── Single Short Card (DB game) ── */
function ShortCard({ game, isActive }: { game: Game; isActive: boolean }) {
  const { user } = useAuthContext();
  const { toast } = useToast();
  const { liked, saved, toggleLike, toggleSave, incrementViews } = useGameInteractions(game.id);
  const [showAuth, setShowAuth] = useState(false);
  const [htmlContent, setHtmlContent] = useState<string | null>(null);
  const viewCounted = useRef(false);

  // Load HTML when active
  useEffect(() => {
    if (!isActive || !game.html_url) {
      setHtmlContent(null);
      return;
    }
    fetch(game.html_url)
      .then((r) => r.text())
      .then(setHtmlContent)
      .catch(() => setHtmlContent(null));
  }, [isActive, game.html_url]);

  // Count view after 2s of visibility
  useEffect(() => {
    if (!isActive || viewCounted.current) return;
    const timer = setTimeout(() => {
      incrementViews();
      viewCounted.current = true;
    }, 2000);
    return () => clearTimeout(timer);
  }, [isActive, incrementViews]);

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) { setShowAuth(true); return; }
    await toggleLike();
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}/shorts?game=${game.id}`;
    try {
      await navigator.clipboard.writeText(url);
      toast("URL이 복사되었습니다", "success");
    } catch {
      toast("복사 실패", "error");
    }
  };

  const handleSave = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) { setShowAuth(true); return; }
    const success = await toggleSave();
    if (success) toast(saved ? "저장 취소" : "나중에 플레이에 저장!", saved ? "info" : "success");
  };

  const thumbnail = game.thumbnail_url || `https://picsum.photos/seed/${game.id.slice(0, 8)}/450/800`;

  return (
    <>
      <div className="snap-start snap-always h-full flex-shrink-0 flex items-center justify-center px-4">
        <motion.div
          animate={isActive ? { scale: 1, opacity: 1 } : { scale: 0.92, opacity: 0.5 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="relative rounded-3xl overflow-hidden"
          style={{ aspectRatio: "9/16", height: "calc(100vh - 120px)", maxHeight: "800px" }}
        >
          {isActive && (
            <div
              className="absolute -inset-[2px] rounded-3xl z-0 pointer-events-none"
              style={{
                background: "linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0) 50%, rgba(255,255,255,0.15) 100%)",
                filter: "blur(1px)",
              }}
            />
          )}

          <div className="relative w-full h-full rounded-3xl overflow-hidden z-[1]">
            {/* Thumbnail background */}
            <img
              src={thumbnail}
              alt={game.title}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                isActive && htmlContent ? "opacity-0" : isActive ? "opacity-30" : "opacity-100"
              }`}
            />

            {/* Actual game iframe when active */}
            {isActive && htmlContent && (
              <iframe
                srcDoc={htmlContent}
                sandbox="allow-scripts"
                title={game.title}
                className="absolute inset-0 w-full h-full border-none z-[1]"
              />
            )}

            {/* Active placeholder when no html_url */}
            <AnimatePresence>
              {isActive && !htmlContent && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="absolute inset-0 z-[1] flex flex-col items-center justify-center bg-black/40"
                >
                  <div className="flex flex-col items-center gap-4">
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.2, duration: 0.4 }}
                      className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20"
                    >
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="3" width="20" height="14" rx="2" />
                        <line x1="8" y1="21" x2="16" y2="21" />
                        <line x1="12" y1="17" x2="12" y2="21" />
                      </svg>
                    </motion.div>
                    <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3, duration: 0.4 }} className="text-center">
                      <p className="text-white font-semibold text-lg">{game.title}</p>
                      <p className="text-white/50 text-xs mt-1">게임 실행 중</p>
                    </motion.div>
                    <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} className="flex items-center gap-1.5 mt-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                      <span className="text-green-400/80 text-[10px] font-medium">LIVE</span>
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Gradients */}
            <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-black/50 to-transparent z-[2]" />
            <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black/70 to-transparent z-[2]" />

            {/* Bottom info */}
            <div className="absolute bottom-0 left-0 right-16 p-4 z-[3]">
              <p className="text-white font-semibold text-base mb-1">{game.title}</p>
              <div className="flex items-center gap-2">
                <span className="text-white/70 text-xs">{formatNumber(game.views)} 조회</span>
                <span className="text-white/40 text-xs">·</span>
                <span className="text-white/70 text-xs">{formatNumber(game.likes)} 좋아요</span>
              </div>
              <span className="inline-block mt-2 text-[10px] px-2 py-0.5 rounded-full bg-white/15 text-white/80 backdrop-blur-sm">
                {categoryLabel[game.category] || game.category}
              </span>
            </div>

            {/* Right action buttons */}
            <div className="absolute bottom-6 right-3 flex flex-col gap-4 z-[3]">
              <ActionButton
                icon={<HeartIcon filled={liked} />}
                label={formatNumber(game.likes + (liked ? 1 : 0))}
                active={liked}
                onClick={handleLike}
              />
              <ActionButton
                icon={<BookmarkIcon filled={saved} />}
                label={saved ? "저장됨" : "저장"}
                active={saved}
                onClick={handleSave}
              />
              <ActionButton icon={<ShareIcon />} label="공유" onClick={handleShare} />
            </div>
          </div>
        </motion.div>
      </div>

      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />
    </>
  );
}

/* ── Mock Short Card (fallback) ── */
function MockShortCard({ game, isActive }: { game: typeof mockShorts[0]; isActive: boolean }) {
  const [liked, setLiked] = useState(false);
  const { toast } = useToast();

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}/shorts?game=${game.id}`;
    try {
      await navigator.clipboard.writeText(url);
      toast("URL이 복사되었습니다", "success");
    } catch {
      toast("복사 실패", "error");
    }
  };

  return (
    <div className="snap-start snap-always h-full flex-shrink-0 flex items-center justify-center px-4">
      <motion.div
        animate={isActive ? { scale: 1, opacity: 1 } : { scale: 0.92, opacity: 0.5 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative rounded-3xl overflow-hidden"
        style={{ aspectRatio: "9/16", height: "calc(100vh - 120px)", maxHeight: "800px" }}
      >
        {isActive && (
          <div className="absolute -inset-[2px] rounded-3xl z-0 pointer-events-none" style={{
            background: "linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0) 50%, rgba(255,255,255,0.15) 100%)", filter: "blur(1px)",
          }} />
        )}
        <div className="relative w-full h-full rounded-3xl overflow-hidden z-[1]">
          <img src={game.thumbnail} alt={game.title} className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${isActive ? "opacity-30" : "opacity-100"}`} />
          <AnimatePresence>
            {isActive && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-[1] flex flex-col items-center justify-center bg-black/40">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5"><rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>
                  </div>
                  <div className="text-center">
                    <p className="text-white font-semibold text-lg">{game.title}</p>
                    <p className="text-white/50 text-xs mt-1">게임 실행 중</p>
                  </div>
                  <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400" /><span className="text-green-400/80 text-[10px] font-medium">LIVE</span>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-black/50 to-transparent z-[2]" />
          <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black/70 to-transparent z-[2]" />
          <div className="absolute bottom-0 left-0 right-16 p-4 z-[3]">
            <p className="text-white font-semibold text-base mb-1">{game.title}</p>
            <p className="text-white/70 text-xs">@{game.creator}</p>
            <span className="inline-block mt-2 text-[10px] px-2 py-0.5 rounded-full bg-white/15 text-white/80 backdrop-blur-sm">{game.category}</span>
          </div>
          <div className="absolute bottom-6 right-3 flex flex-col gap-4 z-[3]">
            <ActionButton icon={<HeartIcon filled={liked} />} label={formatNumber(game.likes + (liked ? 1 : 0))} active={liked} onClick={(e) => { e.stopPropagation(); setLiked(!liked); }} />
            <ActionButton icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5,3 19,12 5,21" /></svg>} label={formatNumber(game.plays)} />
            <ActionButton icon={<ShareIcon />} label="공유" onClick={handleShare} />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/* ── Main Shorts Section ── */
export default function ShortsSection() {
  const bgVideoRef = useRef<HTMLVideoElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const { games: dbGames, loading } = useGames("shortform");

  const useDbGames = dbGames.length > 0;

  // HLS background video
  useEffect(() => {
    const video = bgVideoRef.current;
    if (!video) return;
    if (Hls.isSupported()) {
      const hls = new Hls({ enableWorker: true });
      hls.loadSource(HLS_URL);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => { video.play().catch(() => {}); });
      return () => hls.destroy();
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = HLS_URL;
      video.addEventListener("loadedmetadata", () => { video.play().catch(() => {}); });
    }
  }, []);

  // Detect active card
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const idx = Number((entry.target as HTMLElement).dataset.index);
            if (!isNaN(idx)) setActiveIndex(idx);
          }
        }
      },
      { root: container, threshold: 0.6 }
    );
    const cards = container.querySelectorAll("[data-index]");
    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, [dbGames, loading]);

  const itemCount = useDbGames ? dbGames.length : mockShorts.length;

  return (
    <>
      <section className="relative h-screen overflow-hidden">
        <video ref={bgVideoRef} autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover z-0" />
        <div className="absolute inset-0 bg-black/60 z-[1]" />

        {loading ? (
          <div className="relative z-10 h-full flex items-center justify-center">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full" />
          </div>
        ) : (
          <div ref={scrollRef} className="relative z-10 h-full overflow-y-scroll snap-y snap-mandatory scrollbar-hide" style={{ scrollbarWidth: "none" }}>
            {useDbGames
              ? dbGames.map((game, i) => (
                  <div key={game.id} data-index={i} className="h-full snap-start snap-always flex items-center justify-center">
                    <ShortCard game={game} isActive={activeIndex === i} />
                  </div>
                ))
              : mockShorts.map((game, i) => (
                  <div key={game.id} data-index={i} className="h-full snap-start snap-always flex items-center justify-center">
                    <MockShortCard game={game} isActive={activeIndex === i} />
                  </div>
                ))
            }
          </div>
        )}

        {/* Scroll hint */}
        <AnimatePresence>
          {activeIndex === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1">
              <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" opacity="0.5"><polyline points="6,9 12,15 18,9" /></svg>
              </motion.div>
              <span className="text-white/40 text-xs">스와이프하여 더 보기</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Progress dots */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-2">
          {Array.from({ length: itemCount }).map((_, i) => (
            <div key={i} className={`w-1.5 rounded-full transition-all duration-300 ${activeIndex === i ? "h-6 bg-white" : "h-1.5 bg-white/30"}`} />
          ))}
        </div>
      </section>
      <style>{`.scrollbar-hide::-webkit-scrollbar { display: none; }`}</style>
    </>
  );
}
