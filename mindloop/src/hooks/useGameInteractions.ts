import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { useAuthContext } from "@/contexts/AuthContext";

export function useGameInteractions(gameId: string | null) {
  const { user } = useAuthContext();
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  // Check if user has liked/saved this game
  useEffect(() => {
    if (!user || !gameId) return;

    const check = async () => {
      const [likeRes, saveRes] = await Promise.all([
        supabase
          .from("user_likes")
          .select("user_id")
          .eq("user_id", user.id)
          .eq("game_id", gameId)
          .maybeSingle(),
        supabase
          .from("user_saves")
          .select("user_id")
          .eq("user_id", user.id)
          .eq("game_id", gameId)
          .maybeSingle(),
      ]);
      setLiked(!!likeRes.data);
      setSaved(!!saveRes.data);
    };
    check();
  }, [user, gameId]);

  const toggleLike = useCallback(async () => {
    if (!user || !gameId || likeLoading) return false;
    setLikeLoading(true);

    if (liked) {
      await supabase
        .from("user_likes")
        .delete()
        .eq("user_id", user.id)
        .eq("game_id", gameId);
      setLiked(false);
    } else {
      await supabase
        .from("user_likes")
        .insert({ user_id: user.id, game_id: gameId });
      setLiked(true);
    }

    setLikeLoading(false);
    return true;
  }, [user, gameId, liked, likeLoading]);

  const toggleSave = useCallback(async () => {
    if (!user || !gameId || saveLoading) return false;
    setSaveLoading(true);

    if (saved) {
      await supabase
        .from("user_saves")
        .delete()
        .eq("user_id", user.id)
        .eq("game_id", gameId);
      setSaved(false);
    } else {
      await supabase
        .from("user_saves")
        .insert({ user_id: user.id, game_id: gameId });
      setSaved(true);
    }

    setSaveLoading(false);
    return true;
  }, [user, gameId, saved, saveLoading]);

  const incrementViews = useCallback(async () => {
    if (!gameId) return;

    // Session-based dedup for guests
    const viewKey = `viewed_${gameId}`;
    if (sessionStorage.getItem(viewKey)) return;
    sessionStorage.setItem(viewKey, "1");

    await supabase.rpc("increment_views", { game_id_input: gameId });
  }, [gameId]);

  const recordPlay = useCallback(async () => {
    if (!user || !gameId) return;

    // Dedup: skip if played within last 5 minutes
    const { data: recent } = await supabase
      .from("play_history")
      .select("id")
      .eq("user_id", user.id)
      .eq("game_id", gameId)
      .gte("played_at", new Date(Date.now() - 5 * 60 * 1000).toISOString())
      .maybeSingle();

    if (recent) {
      // Update existing record
      await supabase
        .from("play_history")
        .update({ played_at: new Date().toISOString() })
        .eq("id", recent.id);
    } else {
      await supabase
        .from("play_history")
        .insert({ user_id: user.id, game_id: gameId });
    }
  }, [user, gameId]);

  return { liked, saved, toggleLike, toggleSave, incrementViews, recordPlay };
}
