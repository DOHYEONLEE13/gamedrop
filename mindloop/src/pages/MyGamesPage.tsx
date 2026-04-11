import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { supabase } from "@/lib/supabase";
import { useAuthContext } from "@/contexts/AuthContext";
import AuthModal from "@/components/AuthModal";
import GamePlayModal from "@/components/GamePlayModal";
import SEO from "@/components/SEO";
import type { Game } from "@/types/database";

const HERO_VIDEO_URL =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260325_120549_0cd82c36-56b3-4dd9-b190-069cfc3a623f.mp4";

type Tab = "saved" | "history" | "liked";

interface PlayHistoryItem {
  id: string;
  played_at: string;
  game: Game;
}

function useRelativeTime() {
  const { t } = useTranslation();
  return (dateStr: string): string => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const seconds = Math.floor(diff / 1000);
    if (seconds < 60) return t("format.justNow");
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return t("format.minutesAgo", { n: minutes });
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return t("format.hoursAgo", { n: hours });
    const days = Math.floor(hours / 24);
    if (days < 30) return t("format.daysAgo", { n: days });
    const months = Math.floor(days / 30);
    return t("format.monthsAgo", { n: months });
  };
}

function GameCard({ game, onClick }: { game: Game; onClick: () => void }) {
  const { t } = useTranslation();
  const thumbnail = game.thumbnail_url || `https://picsum.photos/seed/${game.id.slice(0, 8)}/400/400`;
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.03, zIndex: 10 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="relative rounded-xl overflow-hidden cursor-pointer group aspect-[4/3]"
    >
      <img src={thumbnail} alt={game.title} loading="lazy" className="absolute inset-0 w-full h-full object-cover transition-all duration-300 group-hover:brightness-110 group-hover:scale-105" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
        <p className="text-white text-sm font-semibold truncate">{game.title}</p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-white/70 text-xs">{t(`category.${game.category}`)}</span>
          {game.playtime && (<><span className="text-white/40 text-xs">·</span><span className="text-white/70 text-xs">{game.playtime}</span></>)}
        </div>
      </div>
      <div className="absolute top-2 right-2">
        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full backdrop-blur-md bg-white/20 text-white">
          {game.type === "shortform" ? t("gameType.short") : t("gameType.long")}
        </span>
      </div>
    </motion.div>
  );
}

function EmptyState({ icon, message }: { icon: React.ReactNode; message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4">
        {icon}
      </div>
      <p className="text-muted-foreground text-sm">{message}</p>
    </div>
  );
}

export default function MyGamesPage() {
  const { t } = useTranslation();
  const { user, loading: authLoading } = useAuthContext();
  const [tab, setTab] = useState<Tab>("saved");
  const [savedGames, setSavedGames] = useState<Game[]>([]);
  const [likedGames, setLikedGames] = useState<Game[]>([]);
  const [history, setHistory] = useState<PlayHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const relativeTime = useRelativeTime();

  useEffect(() => {
    if (!user) { setLoading(false); return; }

    const load = async () => {
      setLoading(true);

      if (tab === "saved") {
        const { data } = await supabase
          .from("user_saves")
          .select("game_id, games(*)")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });
        setSavedGames((data || []).map((d: any) => d.games).filter(Boolean));
      } else if (tab === "liked") {
        const { data } = await supabase
          .from("user_likes")
          .select("game_id, games(*)")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });
        setLikedGames((data || []).map((d: any) => d.games).filter(Boolean));
      } else {
        const { data } = await supabase
          .from("play_history")
          .select("id, played_at, games(*)")
          .eq("user_id", user.id)
          .order("played_at", { ascending: false })
          .limit(50);
        setHistory(
          (data || [])
            .filter((d: any) => d.games)
            .map((d: any) => ({ id: d.id, played_at: d.played_at, game: d.games }))
        );
      }

      setLoading(false);
    };
    load();
  }, [user, tab]);

  if (authLoading) return null;

  if (!user) {
    return (
      <>
        <section className="relative min-h-screen overflow-hidden flex items-center justify-center">
          <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover z-0"><source src={HERO_VIDEO_URL} type="video/mp4" /></video>
          <div className="absolute inset-0 bg-background/70 z-[1]" />
          <div className="relative z-10 text-center">
            <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-6">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-muted-foreground"><path d="M19 21v-2a4 4 0 00-4-4H9a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
            </div>
            <h2 className="text-xl font-semibold mb-2">{t("myGames.loginRequired")}</h2>
            <p className="text-muted-foreground text-sm mb-6">{t("myGames.loginSubtitle")}</p>
            <button onClick={() => setShowAuth(true)} className="px-6 py-3 rounded-xl bg-foreground text-background text-sm font-semibold hover:bg-foreground/90 transition-colors">
              {t("common.login")}
            </button>
          </div>
        </section>
        <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />
      </>
    );
  }

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: "saved", label: t("myGames.tabSaved"), icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" /></svg> },
    { key: "history", label: t("myGames.tabHistory"), icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12,6 12,12 16,14" /></svg> },
    { key: "liked", label: t("myGames.tabLiked"), icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" /></svg> },
  ];

  return (
    <>
      <SEO title={t("seo.myGamesTitle")} description={t("myGames.subtitle")} path="/my-games" noindex />
      <section className="relative min-h-screen overflow-hidden">
        <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover z-0"><source src={HERO_VIDEO_URL} type="video/mp4" /></video>
        <div className="absolute inset-0 bg-background/70 z-[1]" />

        <div className="relative z-10 pt-24 pb-16 px-4 md:px-16 lg:px-28">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="text-3xl font-bold mb-1">{t("myGames.title")}</h1>
            <p className="text-muted-foreground text-sm">{t("myGames.subtitle")}</p>
          </motion.div>

          {/* Tabs */}
          <div className="flex gap-2 mb-8">
            {tabs.map((tabItem) => (
              <button
                key={tabItem.key}
                onClick={() => setTab(tabItem.key)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  tab === tabItem.key
                    ? "bg-foreground text-background"
                    : "bg-white/5 text-muted-foreground border border-white/10 hover:bg-white/10 hover:text-foreground"
                }`}
              >
                {tabItem.icon}
                {tabItem.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center justify-center py-20">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-8 h-8 border-2 border-muted-foreground/30 border-t-foreground rounded-full" />
              </motion.div>
            ) : tab === "saved" ? (
              <motion.div key="saved" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                {savedGames.length === 0 ? (
                  <EmptyState
                    icon={<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-muted-foreground"><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" /></svg>}
                    message={t("myGames.emptySaved")}
                  />
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                    {savedGames.map((game, i) => (
                      <motion.div key={game.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                        <GameCard game={game} onClick={() => setSelectedGame(game)} />
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            ) : tab === "liked" ? (
              <motion.div key="liked" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                {likedGames.length === 0 ? (
                  <EmptyState
                    icon={<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-muted-foreground"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" /></svg>}
                    message={t("myGames.emptyLiked")}
                  />
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                    {likedGames.map((game, i) => (
                      <motion.div key={game.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                        <GameCard game={game} onClick={() => setSelectedGame(game)} />
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div key="history" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                {history.length === 0 ? (
                  <EmptyState
                    icon={<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-muted-foreground"><circle cx="12" cy="12" r="10" /><polyline points="12,6 12,12 16,14" /></svg>}
                    message={t("myGames.emptyHistory")}
                  />
                ) : (
                  <div className="space-y-2">
                    {history.map((item, i) => {
                      const g = item.game;
                      const thumb = g.thumbnail_url || `https://picsum.photos/seed/${g.id.slice(0, 8)}/80/80`;
                      return (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.03 }}
                          onClick={() => setSelectedGame(g)}
                          className="flex items-center gap-4 p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 cursor-pointer transition-colors"
                        >
                          <img src={thumb} alt={g.title} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-foreground text-sm font-medium truncate">{g.title}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-muted-foreground text-xs">{t(`category.${g.category}`)}</span>
                              {g.playtime && (<><span className="text-muted-foreground/40 text-xs">·</span><span className="text-muted-foreground text-xs">{g.playtime}</span></>)}
                            </div>
                          </div>
                          <div className="flex items-center gap-3 flex-shrink-0">
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/10 text-muted-foreground">
                              {g.type === "shortform" ? t("gameType.short") : t("gameType.long")}
                            </span>
                            <span className="text-muted-foreground text-xs whitespace-nowrap">{relativeTime(item.played_at)}</span>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <GamePlayModal game={selectedGame} onClose={() => setSelectedGame(null)} />
    </>
  );
}
