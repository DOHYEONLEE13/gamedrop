import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { supabase } from "@/lib/supabase";
import { useAuthContext } from "@/contexts/AuthContext";
import { useToast } from "@/components/Toast";
import CountUp from "@/components/CountUp";
import { getSessionToken } from "@/hooks/useAuth";
import type { Game } from "@/types/database";

const CATEGORIES = [
  { value: "action" },
  { value: "puzzle" },
  { value: "rpg" },
  { value: "simulation" },
  { value: "strategy" },
  { value: "casual" },
];

function EditGameModal({ game, onClose, onSaved }: { game: Game | null; onClose: () => void; onSaved: () => void }) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("action");
  const [type, setType] = useState<"shortform" | "longform">("shortform");
  const [playtime, setPlaytime] = useState("");
  const [tags, setTags] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!game) return;
    setTitle(game.title);
    setDescription(game.description || "");
    setCategory(game.category);
    setType(game.type as "shortform" | "longform");
    setPlaytime(game.playtime || "");
    setTags((game.tags || []).join(", "));
  }, [game]);

  if (!game) return null;

  const handleSave = async () => {
    if (!title.trim()) { toast(t("dashboard.enterTitle"), "error"); return; }
    setSaving(true);
    const tagArr = tags.split(",").map((tag) => tag.trim()).filter(Boolean);
    const { error } = await supabase.rpc("uploader_update_game", {
      p_token: getSessionToken(),
      p_game_id: game.id,
      p_title: title.trim(),
      p_description: description.trim() || null,
      p_category: category,
      p_type: type,
      p_playtime: playtime.trim() || null,
      p_tags: tagArr.length ? tagArr : null,
    });
    setSaving(false);
    if (error) { toast(error.message || t("dashboard.editFailed"), "error"); return; }
    toast(t("dashboard.editSuccess"), "success");
    onSaved();
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.95, y: 10 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 10 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-lg bg-card/95 backdrop-blur-xl border border-border/40 rounded-2xl p-6 max-h-[90vh] overflow-y-auto"
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold">{t("dashboard.editTitle")}</h2>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground">✕</button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs text-muted-foreground mb-1.5">{t("dashboard.titleLabel")}</label>
              <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-foreground/40" />
            </div>

            <div>
              <label className="block text-xs text-muted-foreground mb-1.5">{t("dashboard.descLabel")}</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-foreground/40 resize-none" />
            </div>

            <div>
              <label className="block text-xs text-muted-foreground mb-1.5">{t("dashboard.typeLabel")}</label>
              <div className="flex gap-2">
                {(["shortform", "longform"] as const).map((typeOpt) => (
                  <button key={typeOpt} onClick={() => setType(typeOpt)} className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${type === typeOpt ? "bg-foreground text-background" : "bg-white/5 border border-white/10 text-muted-foreground hover:text-foreground"}`}>
                    {t(`gameType.${typeOpt}`)}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs text-muted-foreground mb-1.5">{t("dashboard.categoryLabel")}</label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((c) => (
                  <button key={c.value} onClick={() => setCategory(c.value)} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${category === c.value ? "bg-foreground text-background" : "bg-white/5 border border-white/10 text-muted-foreground hover:text-foreground"}`}>
                    {t(`category.${c.value}`)}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-muted-foreground mb-1.5">{t("dashboard.playtimeLabel")}</label>
                <input value={playtime} onChange={(e) => setPlaytime(e.target.value)} placeholder={t("upload.playtimePlaceholder")} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-foreground/40" />
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-1.5">{t("dashboard.tagsLabel")}</label>
                <input value={tags} onChange={(e) => setTags(e.target.value)} placeholder={t("upload.tagsPlaceholder")} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-foreground/40" />
              </div>
            </div>
          </div>

          <div className="flex gap-2 mt-6">
            <button onClick={onClose} className="flex-1 px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">{t("common.cancel")}</button>
            <button onClick={handleSave} disabled={saving} className="flex-1 px-4 py-2.5 rounded-lg bg-foreground text-background text-sm font-semibold hover:bg-foreground/90 transition-colors disabled:opacity-50">
              {saving ? t("common.saving") : t("common.save")}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

const HERO_VIDEO_URL =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260325_120549_0cd82c36-56b3-4dd9-b190-069cfc3a623f.mp4";

interface UploaderStats {
  total_games: number;
  total_views: number;
  total_likes: number;
  pending_count: number;
  live_count: number;
}

export default function DashboardPage() {
  const { t } = useTranslation();
  const { user, isAdmin, loading: authLoading } = useAuthContext();
  const navigate = useNavigate();
  const [stats, setStats] = useState<UploaderStats>({
    total_games: 0, total_views: 0, total_likes: 0, pending_count: 0, live_count: 0,
  });
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Game | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const token = getSessionToken();
    const [statsRes, gamesRes] = await Promise.all([
      supabase.rpc("uploader_stats", { p_token: token }),
      supabase.rpc("uploader_list_games", { p_token: token }),
    ]);
    if (statsRes.data && statsRes.data[0]) setStats(statsRes.data[0] as UploaderStats);
    if (gamesRes.data) setGames(gamesRes.data as Game[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { navigate("/"); return; }
    if (isAdmin) { navigate("/admin"); return; }
    load();
  }, [user, isAdmin, authLoading, navigate, load]);

  if (!user || isAdmin) return null;

  // Compute max for graph normalization
  const maxViews = Math.max(1, ...games.map((g) => g.views));

  return (
    <section className="relative min-h-screen overflow-hidden">
      <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover z-0"><source src={HERO_VIDEO_URL} type="video/mp4" /></video>
      <div className="absolute inset-0 bg-background/70 z-[1]" />

      <div className="relative z-10 pt-24 pb-24 md:pb-16 px-4 md:px-16 lg:px-28">
        {/* Greeting */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            {t("dashboard.greeting", { name: user.username })} 👋
          </h1>
          <p className="text-muted-foreground text-sm">{t("dashboard.subtitle")}</p>
        </motion.div>

        {/* Stat cards with count-up */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-5">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-3">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" /></svg>
            </div>
            <p className="text-3xl font-bold text-foreground"><CountUp value={stats.total_games} /></p>
            <p className="text-muted-foreground text-xs mt-1">{t("dashboard.myUploads")}</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-5">
            <div className="w-10 h-10 rounded-xl bg-green-500/10 text-green-400 flex items-center justify-center mb-3">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
            </div>
            <p className="text-3xl font-bold text-foreground"><CountUp value={stats.total_views} /></p>
            <p className="text-muted-foreground text-xs mt-1">{t("dashboard.totalViews")}</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-5">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center mb-3">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" /></svg>
            </div>
            <p className="text-3xl font-bold text-foreground"><CountUp value={stats.total_likes} /></p>
            <p className="text-muted-foreground text-xs mt-1">{t("dashboard.totalLikes")}</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-5">
            <div className="w-10 h-10 rounded-xl bg-yellow-500/10 text-yellow-400 flex items-center justify-center mb-3">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
            </div>
            <p className="text-3xl font-bold text-foreground"><CountUp value={stats.pending_count} /></p>
            <p className="text-muted-foreground text-xs mt-1">{t("dashboard.pendingCount")}</p>
          </motion.div>
        </div>

        {/* Rejection notices */}
        {games.filter((g) => g.status === "rejected" && g.rejection_reason).length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 space-y-2"
          >
            {games
              .filter((g) => g.status === "rejected" && g.rejection_reason)
              .map((g) => (
                <div key={g.id} className="rounded-2xl bg-red-500/10 border border-red-500/30 p-4 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center flex-shrink-0">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-foreground text-sm font-semibold">{t("dashboard.rejectionTitle", { title: g.title })}</p>
                    <p className="text-muted-foreground text-xs mt-1">{t("dashboard.rejectionReason", { reason: g.rejection_reason })}</p>
                  </div>
                  <button
                    onClick={async () => {
                      await supabase.rpc("uploader_dismiss_rejection", { p_token: getSessionToken(), p_game_id: g.id });
                      load();
                    }}
                    className="text-xs px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
                  >
                    {t("common.confirm")}
                  </button>
                </div>
              ))}
          </motion.div>
        )}

        {/* Per-game performance bars */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 overflow-hidden"
        >
          <div className="px-5 py-4 border-b border-white/10">
            <h2 className="text-foreground font-semibold">{t("dashboard.performance")}</h2>
            <p className="text-muted-foreground text-xs mt-0.5">{t("dashboard.performanceDesc")}</p>
          </div>
          {loading ? (
            <div className="py-16 flex justify-center">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-6 h-6 border-2 border-muted-foreground/30 border-t-foreground rounded-full" />
            </div>
          ) : games.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground text-sm">
              {t("dashboard.noUploads")}{" "}
              <button onClick={() => navigate("/upload")} className="text-foreground underline">{t("dashboard.uploadNow")}</button>
            </div>
          ) : (
            <div className="p-5 space-y-4">
              {games
                .slice()
                .sort((a, b) => b.views - a.views)
                .map((g, i) => {
                  const pct = (g.views / maxViews) * 100;
                  return (
                    <motion.div
                      key={g.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.25 + i * 0.04 }}
                      className="flex items-center gap-4"
                    >
                      {g.thumbnail_url ? (
                        <img src={g.thumbnail_url} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-white/5 flex-shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1.5 gap-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <p className="text-foreground text-sm font-medium truncate">{g.title}</p>
                            <span className="text-[10px] text-muted-foreground flex-shrink-0">{t(`category.${g.category}`)}</span>
                            <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full flex-shrink-0 ${
                              g.status === "live" ? "bg-green-500/15 text-green-400"
                              : g.status === "pending" ? "bg-yellow-500/15 text-yellow-400"
                              : g.status === "rejected" ? "bg-red-500/15 text-red-400"
                              : "bg-gray-500/15 text-gray-400"
                            }`}>
                              {g.status === "live" ? t("status.live") : g.status === "pending" ? t("status.pending") : g.status === "rejected" ? t("status.rejected") : t("status.draft")}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground flex-shrink-0">
                            <span>👁 {g.views.toLocaleString()}</span>
                            <span>❤ {g.likes.toLocaleString()}</span>
                            <button
                              onClick={() => setEditing(g)}
                              className="px-2 py-1 rounded-md bg-white/5 border border-white/10 text-[10px] font-medium text-muted-foreground hover:text-foreground hover:bg-white/10 transition-colors"
                            >
                              {t("common.edit")}
                            </button>
                          </div>
                        </div>
                        <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 1, delay: 0.3 + i * 0.04 }}
                            className="h-full bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"
                          />
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
            </div>
          )}
        </motion.div>
      </div>

      <EditGameModal game={editing} onClose={() => setEditing(null)} onSaved={load} />
    </section>
  );
}
