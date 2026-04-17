import { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { games as mockGames } from "@/data/games";
import { useGames } from "@/hooks/useGames";
import type { Game as DbGame } from "@/types/database";

const MotionLink = motion(Link);

const HERO_VIDEO_URL =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260325_120549_0cd82c36-56b3-4dd9-b190-069cfc3a623f.mp4";

/* ── Icons ── */
function SearchIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function ClearIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function SparkleIcon() {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-muted-foreground"
    >
      <path d="M12 2l2.09 6.26L20 10l-5.91 1.74L12 18l-2.09-6.26L4 10l5.91-1.74L12 2z" />
    </svg>
  );
}

/* ── Size helper ── */
const sizePattern = ["lg", "sm", "sm", "md", "sm", "wide", "sm", "md", "lg", "sm", "wide", "sm", "sm", "sm", "md", "wide", "sm", "sm"] as const;
function getSizeClass(index: number) {
  const size = sizePattern[index % sizePattern.length];
  switch (size) {
    case "lg": return "col-span-2 row-span-2";
    case "wide": return "col-span-2 row-span-1";
    case "md": return "col-span-1 row-span-2";
    case "sm": default: return "col-span-1 row-span-1";
  }
}

/* ── Popular categories for quick search ── */
const quickTags = ["액션", "퍼즐", "캐주얼", "RPG", "전략", "숏폼", "롱폼"];

// Unified display type
interface DisplayGame {
  id: string;
  slug: string | null;
  title: string;
  thumbnail: string;
  category: string;
  playtime: string;
  type: string;
}

function hrefFor(game: DisplayGame): string {
  return game.slug ? `/games/${game.slug}` : "/games";
}

/* ── Main Component ── */
export default function SearchSection() {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { games: dbGames } = useGames();

  // Build display list from DB or mock
  const allGames: DisplayGame[] = useMemo(() => {
    if (dbGames.length > 0) {
      return dbGames.map((g: DbGame, i) => ({
        id: g.id,
        slug: g.slug,
        title: g.title,
        thumbnail: g.thumbnail_url || `https://picsum.photos/seed/${i + 200}/400/400`,
        category: t(`category.${g.category}`, g.category),
        playtime: g.playtime || "",
        type: g.type,
      }));
    }
    return mockGames.map((g) => ({
      id: g.id,
      slug: null,
      title: g.title,
      thumbnail: g.thumbnail,
      category: g.category,
      playtime: g.playtime,
      type: g.type,
    }));
  }, [dbGames, t]);

  // Real-time filter by title or category
  const filteredGames = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return allGames.filter(
      (game) =>
        game.title.toLowerCase().includes(q) ||
        game.category.toLowerCase().includes(q) ||
        game.type.toLowerCase().includes(q) ||
        (q === "숏폼" && game.type === "shortform") ||
        (q === "롱폼" && game.type === "longform")
    );
  }, [query, allGames]);

  const hasQuery = query.trim().length > 0;
  const noResults = hasQuery && filteredGames.length === 0;

  // Recommended games for empty state
  const recommendedGames = useMemo(
    () => allGames.filter((_, i) => [0, 3, 5, 8, 11, 15].includes(i)),
    [allGames]
  );

  // Focus input on mount
  useEffect(() => {
    const timer = setTimeout(() => inputRef.current?.focus(), 600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <section className="relative min-h-screen overflow-hidden">
        {/* Background video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0"
        >
          <source src={HERO_VIDEO_URL} type="video/mp4" />
        </video>

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-background/70 z-[1]" />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center pt-28 pb-16 px-4 md:px-16 lg:px-28 min-h-screen">
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              {t("search.title")}
            </h1>
            <p className="text-muted-foreground text-sm md:text-base">
              {t("search.subtitle", { count: allGames.length })}
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
            className="w-full max-w-2xl mb-6"
          >
            <div
              className={`relative rounded-2xl transition-all duration-300 ${
                isFocused
                  ? "shadow-[0_0_30px_rgba(255,255,255,0.12)]"
                  : ""
              }`}
            >
              {/* Glow border on focus */}
              <div
                className={`absolute -inset-[1px] rounded-2xl transition-opacity duration-300 pointer-events-none ${
                  isFocused ? "opacity-100" : "opacity-0"
                }`}
                style={{
                  background:
                    "linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0.15) 100%)",
                }}
              />

              <div className="relative flex items-center gap-3 px-5 py-4 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10">
                <div className="text-muted-foreground flex-shrink-0">
                  <SearchIcon />
                </div>
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  placeholder={t("search.placeholder")}
                  className="flex-1 bg-transparent outline-none text-foreground text-base placeholder:text-muted-foreground/60"
                />
                {/* Clear button */}
                <AnimatePresence>
                  {hasQuery && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.15 }}
                      onClick={() => {
                        setQuery("");
                        inputRef.current?.focus();
                      }}
                      className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-full hover:bg-white/10"
                    >
                      <ClearIcon />
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

          {/* Quick Tags */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap justify-center gap-2 mb-10 max-w-2xl"
          >
            {quickTags.map((tag) => (
              <button
                key={tag}
                onClick={() => {
                  setQuery(tag);
                  inputRef.current?.focus();
                }}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border ${
                  query.trim() === tag
                    ? "bg-white/15 text-foreground border-white/30"
                    : "bg-white/5 text-muted-foreground border-white/10 hover:bg-white/10 hover:text-foreground hover:border-white/20"
                }`}
              >
                {tag}
              </button>
            ))}
          </motion.div>

          {/* Results Section */}
          <div className="w-full">
            <AnimatePresence mode="wait">
              {/* Default state — no query */}
              {!hasQuery && (
                <motion.div
                  key="default"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="text-center"
                >
                  <div className="flex flex-col items-center gap-3 mb-10 mt-4">
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <SparkleIcon />
                    </motion.div>
                    <p className="text-muted-foreground text-sm">
                      {t("search.browsePopular")}
                    </p>
                  </div>

                  {/* Recommended games grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 auto-rows-[120px] sm:auto-rows-[140px] md:auto-rows-[160px] gap-2 md:gap-3">
                    {allGames.map((game, i) => (
                      <MotionLink
                        key={game.id}
                        to={hrefFor(game)}
                        aria-label={game.title}
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{
                          duration: 0.4,
                          delay: i * 0.03,
                          ease: "easeOut" as const,
                        }}
                        whileHover={{ scale: 1.04, zIndex: 10 }}
                        whileTap={{ scale: 0.97 }}
                        className={`${getSizeClass(i)} relative rounded-xl overflow-hidden cursor-pointer group block`}
                      >
                        <img
                          src={game.thumbnail}
                          alt={game.title}
                          loading="lazy"
                          className="absolute inset-0 w-full h-full object-cover transition-all duration-300 group-hover:brightness-110 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                          <p className="text-white text-sm font-semibold truncate">
                            {game.title}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-white/70 text-xs">{game.category}</span>
                            <span className="text-white/40 text-xs">·</span>
                            <span className="text-white/70 text-xs">{game.playtime}</span>
                          </div>
                        </div>
                        <div className="absolute top-2 right-2">
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full backdrop-blur-md bg-white/20 text-white">
                            {game.type === "shortform" ? "SHORT" : "LONG"}
                          </span>
                        </div>
                      </MotionLink>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Search results */}
              {hasQuery && !noResults && (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Result count */}
                  <div className="mb-6 flex items-center gap-2">
                    <span className="text-muted-foreground text-sm">
                      {t("search.foundGames", { count: filteredGames.length })}
                    </span>
                  </div>

                  {/* Poki-style grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 auto-rows-[120px] sm:auto-rows-[140px] md:auto-rows-[160px] gap-2 md:gap-3">
                    {filteredGames.map((game, i) => (
                      <MotionLink
                        key={game.id}
                        to={hrefFor(game)}
                        aria-label={game.title}
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{
                          duration: 0.35,
                          delay: i * 0.05,
                          ease: "easeOut" as const,
                        }}
                        whileHover={{ scale: 1.04, zIndex: 10 }}
                        whileTap={{ scale: 0.97 }}
                        className={`${getSizeClass(i)} relative rounded-xl overflow-hidden cursor-pointer group block`}
                      >
                        {/* Thumbnail */}
                        <img
                          src={game.thumbnail}
                          alt={game.title}
                          loading="lazy"
                          className="absolute inset-0 w-full h-full object-cover transition-all duration-300 group-hover:brightness-110 group-hover:scale-105"
                        />

                        {/* Hover overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        {/* Info on hover */}
                        <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                          <p className="text-white text-sm font-semibold truncate">
                            {game.title}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-white/70 text-xs">
                              {game.category}
                            </span>
                            <span className="text-white/40 text-xs">·</span>
                            <span className="text-white/70 text-xs">
                              {game.playtime}
                            </span>
                          </div>
                        </div>

                        {/* Type badge */}
                        <div className="absolute top-2 right-2">
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full backdrop-blur-md bg-white/20 text-white">
                            {game.type === "shortform" ? "SHORT" : "LONG"}
                          </span>
                        </div>
                      </MotionLink>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* No results */}
              {noResults && (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="text-center"
                >
                  {/* Empty state illustration */}
                  <div className="flex flex-col items-center gap-4 mb-12 mt-4">
                    <motion.div
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                      className="w-24 h-24 rounded-full bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center"
                    >
                      <svg
                        width="40"
                        height="40"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-muted-foreground"
                      >
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                        <line x1="8" y1="11" x2="14" y2="11" />
                      </svg>
                    </motion.div>
                    <div>
                      <p className="text-foreground font-semibold text-lg mb-1">
                        {t("search.noResultsTitle")}
                      </p>
                      <p className="text-muted-foreground text-sm">
                        {t("search.noResultsSubtitle")}
                      </p>
                    </div>
                  </div>

                  {/* Recommended games */}
                  <div className="text-left mb-4">
                    <span className="text-muted-foreground text-sm font-medium flex items-center gap-2">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2l2.09 6.26L20 10l-5.91 1.74L12 18l-2.09-6.26L4 10l5.91-1.74L12 2z" />
                      </svg>
                      {t("search.recommendations")}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 auto-rows-[120px] sm:auto-rows-[140px] md:auto-rows-[160px] gap-2 md:gap-3">
                    {recommendedGames.map((game, i) => (
                      <MotionLink
                        key={game.id}
                        to={hrefFor(game)}
                        aria-label={game.title}
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{
                          duration: 0.35,
                          delay: i * 0.06,
                          ease: "easeOut" as const,
                        }}
                        whileHover={{ scale: 1.04, zIndex: 10 }}
                        whileTap={{ scale: 0.97 }}
                        className={`${getSizeClass(i)} relative rounded-xl overflow-hidden cursor-pointer group block`}
                      >
                        <img
                          src={game.thumbnail}
                          alt={game.title}
                          loading="lazy"
                          className="absolute inset-0 w-full h-full object-cover transition-all duration-300 group-hover:brightness-110 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                          <p className="text-white text-sm font-semibold truncate">
                            {game.title}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-white/70 text-xs">{game.category}</span>
                            <span className="text-white/40 text-xs">·</span>
                            <span className="text-white/70 text-xs">{game.playtime}</span>
                          </div>
                        </div>
                        <div className="absolute top-2 right-2">
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full backdrop-blur-md bg-white/20 text-white">
                            {game.type === "shortform" ? "SHORT" : "LONG"}
                          </span>
                        </div>
                      </MotionLink>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>
    </>
  );
}
