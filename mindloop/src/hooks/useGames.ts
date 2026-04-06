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
