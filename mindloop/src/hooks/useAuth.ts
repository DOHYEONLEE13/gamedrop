import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import type { User, Session } from "@supabase/supabase-js";
import type { Profile } from "@/types/database";

interface AuthState {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  isAdmin: boolean;
  loading: boolean;
}

const ADMIN_TOKEN_KEY = "playwave_admin_token";
const ADMIN_EXPIRY_KEY = "playwave_admin_expiry";

function checkAdminToken(): boolean {
  const token = localStorage.getItem(ADMIN_TOKEN_KEY);
  const expiry = localStorage.getItem(ADMIN_EXPIRY_KEY);
  if (!token || !expiry) return false;
  if (Date.now() > Number(expiry)) {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    localStorage.removeItem(ADMIN_EXPIRY_KEY);
    return false;
  }
  return true;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    session: null,
    isAdmin: checkAdminToken(),
    loading: true,
  });

  // Fetch profile from DB
  const fetchProfile = useCallback(async (userId: string) => {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();
    return data as Profile | null;
  }, []);

  // Listen to auth state changes
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      let profile: Profile | null = null;
      if (session?.user) {
        profile = await fetchProfile(session.user.id);
      }
      setState((prev) => ({
        ...prev,
        user: session?.user ?? null,
        session,
        profile,
        loading: false,
      }));
    });

    // Subscribe to changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      let profile: Profile | null = null;
      if (session?.user) {
        profile = await fetchProfile(session.user.id);
      }
      setState((prev) => ({
        ...prev,
        user: session?.user ?? null,
        session,
        profile,
        loading: false,
      }));
    });

    return () => subscription.unsubscribe();
  }, [fetchProfile]);

  // Sign up
  const signUp = useCallback(
    async (email: string, password: string, nickname: string) => {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { nickname } },
      });
      if (error) throw error;
      return data;
    },
    []
  );

  // Sign in
  const signIn = useCallback(async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  }, []);

  // Sign out
  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setState((prev) => ({
      ...prev,
      user: null,
      session: null,
      profile: null,
    }));
  }, []);

  // Admin login via RPC
  const adminLogin = useCallback(async (password: string) => {
    const { data, error } = await supabase.rpc("verify_admin_password", {
      password_input: password,
    });
    if (error) throw error;
    if (!data) throw new Error("비밀번호가 올바르지 않습니다");

    // Store token with 24h expiry
    const expiry = Date.now() + 24 * 60 * 60 * 1000;
    localStorage.setItem(ADMIN_TOKEN_KEY, "admin_authenticated");
    localStorage.setItem(ADMIN_EXPIRY_KEY, String(expiry));
    setState((prev) => ({ ...prev, isAdmin: true }));
  }, []);

  // Admin logout
  const adminLogout = useCallback(() => {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    localStorage.removeItem(ADMIN_EXPIRY_KEY);
    setState((prev) => ({ ...prev, isAdmin: false }));
  }, []);

  return {
    ...state,
    signUp,
    signIn,
    signOut,
    adminLogin,
    adminLogout,
  };
}
