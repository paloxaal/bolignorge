import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { supabase, isSupabaseConfigured } from "../lib/supabase";

/**
 * Auth state shape:
 *   loading      - initial session/profile fetch in progress
 *   user         - Supabase auth user (or null)
 *   profile      - row from public.profiles (or null) — has { id, email, full_name, role }
 *   role         - shortcut: profile?.role  ('admin' | 'board' | null)
 *   signIn       - (email, password) => { error }
 *   signOut      - () => void
 *   refreshProfile - manual profile reload
 */
const AuthContext = createContext({
  loading: true,
  user: null,
  profile: null,
  role: null,
  signIn: async () => ({ error: new Error("AuthProvider missing") }),
  signOut: async () => {},
  refreshProfile: async () => {},
});

export function AuthProvider({ children }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);

  const loadProfile = useCallback(async (uid) => {
    if (!uid) {
      setProfile(null);
      return;
    }
    const { data, error } = await supabase
      .from("profiles")
      .select("id, email, full_name, role")
      .eq("id", uid)
      .single();
    if (error) {
      console.warn("[auth] profile fetch failed:", error.message);
      setProfile(null);
    } else {
      setProfile(data);
    }
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      const { data } = await supabase.auth.getSession();
      const u = data.session?.user ?? null;
      if (cancelled) return;
      setUser(u);
      if (u) await loadProfile(u.id);
      setLoading(false);
    })();
    const { data: sub } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const u = session?.user ?? null;
      setUser(u);
      if (u) await loadProfile(u.id);
      else setProfile(null);
    });
    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, [loadProfile]);

  const signIn = async (email, password) => {
    if (!isSupabaseConfigured) {
      return { error: new Error("Supabase ikke konfigurert. Sjekk .env.local.") };
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const refreshProfile = async () => {
    if (user) await loadProfile(user.id);
  };

  return (
    <AuthContext.Provider
      value={{
        loading,
        user,
        profile,
        role: profile?.role ?? null,
        signIn,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
