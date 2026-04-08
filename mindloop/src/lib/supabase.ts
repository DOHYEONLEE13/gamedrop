import { createClient } from "@supabase/supabase-js";

// Anon key는 공개 키이므로 환경변수가 없을 때를 대비해 하드코딩 fallback을 둔다.
// (Cloudflare Pages에 env vars가 설정되지 않아도 빌드가 동작하도록.)
const FALLBACK_URL = "https://kpgniyvwcqliixslzcam.supabase.co";
const FALLBACK_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtwZ25peXZ3Y3FsaWl4c2x6Y2FtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU0OTIyMzcsImV4cCI6MjA5MTA2ODIzN30.ryLaiy6r-FsI17wKOMICMhrVFCPnViH2ShSeDX3Yqy8";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || FALLBACK_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || FALLBACK_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
