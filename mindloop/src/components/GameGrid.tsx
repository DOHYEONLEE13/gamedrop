import { useState } from "react";
import { motion } from "framer-motion";
import { useGames } from "@/hooks/useGames";
import { games as mockGames } from "@/data/games";
import type { Game } from "@/types/database";
import type { Game as MockGame } from "@/data/games";
import GamePlayModal from "./GamePlayModal";

const HERO_VIDEO_URL =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260325_120549_0cd82c36-56b3-4dd9-b190-069cfc3a623f.mp4";

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

const categories = [
  "장애물 게임", "인기 있는 게임", "어드벤쳐 게임", "모바일 게임",
  "스킬 게임", "액션 게임", "Brainrot Games", "운전 게임",
  "남성용 게임", "동물 게임", "마우스 게임", "멋진 게임",
  "전쟁 게임", "플랫폼 게임", "3D 게임", "아케이드 게임",
  "시뮬레이션 게임", "재미있는 게임", "온라인 게임", "협동 게임",
  "타이쿤 게임", "총 게임", "멀티플레이어 게임", "격투 게임",
  "고양이 게임", "미친 게임", "두뇌 게임", "플래시 게임",
  "수박 게임", "블록 게임", "달리기 게임", "모든 카테고리",
];

const categoryLabel: Record<string, string> = {
  action: "액션", puzzle: "퍼즐", rpg: "RPG",
  simulation: "시뮬레이션", strategy: "전략", casual: "캐주얼",
};

// Normalize DB game or mock game into a common shape for rendering
interface DisplayGame {
  id: string;
  title: string;
  thumbnail: string;
  category: string;
  playtime: string;
  type: string;
  // DB game reference for modal
  dbGame: Game | null;
}

function toDisplayGame(game: Game, index: number): DisplayGame {
  return {
    id: game.id,
    title: game.title,
    thumbnail: game.thumbnail_url || `https://picsum.photos/seed/${index + 200}/400/400`,
    category: categoryLabel[game.category] || game.category,
    playtime: game.playtime || "",
    type: game.type,
    dbGame: game,
  };
}

function mockToDisplayGame(game: MockGame): DisplayGame {
  return {
    id: game.id,
    title: game.title,
    thumbnail: game.thumbnail,
    category: game.category,
    playtime: game.playtime,
    type: game.type,
    dbGame: null,
  };
}

export default function GameGrid() {
  const { games: dbGames, loading } = useGames();
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);

  // Use DB games if available, fallback to mock
  const displayGames: DisplayGame[] =
    dbGames.length > 0
      ? dbGames.map((g, i) => toDisplayGame(g, i))
      : mockGames.map(mockToDisplayGame);

  return (
    <>
      <section className="relative pt-20 pb-12 overflow-hidden min-h-screen">
        {/* Background video */}
        <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover z-0">
          <source src={HERO_VIDEO_URL} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-background/60 z-[1]" />

        {/* Content */}
        <div className="relative z-10 px-4 md:px-16 lg:px-28">
          {loading ? (
            <div className="flex items-center justify-center py-40">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-8 h-8 border-2 border-muted-foreground/30 border-t-foreground rounded-full"
              />
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 auto-rows-[120px] sm:auto-rows-[140px] md:auto-rows-[160px] gap-2 md:gap-3"
            >
              {displayGames.map((game, i) => (
                <motion.div
                  key={game.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.4, delay: i * 0.03, ease: "easeOut" as const }}
                  whileHover={{ scale: 1.04, zIndex: 10 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    if (game.dbGame) setSelectedGame(game.dbGame);
                  }}
                  className={`${getSizeClass(i)} relative rounded-xl overflow-hidden cursor-pointer group`}
                >
                  <img
                    src={game.thumbnail}
                    alt={game.title}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover transition-all duration-300 group-hover:brightness-110 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <p className="text-white text-sm font-semibold truncate">{game.title}</p>
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
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Category Tags */}
          <div className="mt-12 flex flex-wrap gap-2 justify-center">
            {categories.map((cat) => (
              <button
                key={cat}
                className="px-4 py-2 rounded-full text-sm text-muted-foreground border border-border/40 hover:text-foreground hover:border-foreground/40 transition-colors duration-200"
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      <GamePlayModal
        game={selectedGame}
        onClose={() => setSelectedGame(null)}
      />
    </>
  );
}
