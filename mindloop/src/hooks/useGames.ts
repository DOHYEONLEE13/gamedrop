import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import type { Game } from "@/types/database";

export function useGames(type?: "shortform" | "longform") {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchGames = useCallback(async () => {
    setLoading(true);
    let query = supabase
      .from("games")
      .select("*")
      .eq("status", "live")
      .order("created_at", { ascending: false });

    if (type) query = query.eq("type", type);

    const { data, error } = await query;
    if (!error && data) setGames(data as Game[]);
    setLoading(false);
  }, [type]);

  useEffect(() => {
    fetchGames();
  }, [fetchGames]);

  return { games, loading, refetch: fetchGames };
}

/**
 * 단일 게임을 slug로 조회. 게임 상세 페이지(/games/:slug)에서 사용.
 * - notFound: slug에 해당하는 live 게임이 없을 때 true
 */
export function useGameBySlug(slug: string | undefined) {
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) {
      setGame(null);
      setLoading(false);
      setNotFound(true);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setNotFound(false);

    supabase
      .from("games")
      .select("*")
      .eq("slug", slug)
      .eq("status", "live")
      .maybeSingle()
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error || !data) {
          setGame(null);
          setNotFound(true);
        } else {
          setGame(data as Game);
          setNotFound(false);
        }
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  return { game, loading, notFound };
}
