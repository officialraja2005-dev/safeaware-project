import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase, isSupabaseConfigured } from "../lib/supabase";
import type { Profile } from "../types";

interface AuthContextValue {
  profile: Profile | null;
  loading: boolean;
  isDemoMode: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error?: string }>;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  completeOnboarding: (interests: string[], wantsSurvey: boolean) => void;
  hasCompletedOnboarding: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const DEMO_PROFILE_KEY = "safeaware_demo_profile";
const ONBOARDING_KEY = "safeaware_demo_onboarding";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

  useEffect(() => {
    if (isSupabaseConfigured && supabase) {
      supabase.auth.getSession().then(async ({ data }) => {
        if (data.session?.user) {
          await loadProfile(data.session.user.id, data.session.user.email ?? "");
        }
        setLoading(false);
      });

      const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
        if (session?.user) {
          await loadProfile(session.user.id, session.user.email ?? "");
        } else {
          setProfile(null);
        }
      });

      return () => listener.subscription.unsubscribe();
    } else {
      const stored = localStorage.getItem(DEMO_PROFILE_KEY);
      if (stored) setProfile(JSON.parse(stored));
      const onboarding = localStorage.getItem(ONBOARDING_KEY);
      setHasCompletedOnboarding(onboarding === "true");
      setLoading(false);
    }
  }, []);

  async function loadProfile(userId: string, email: string) {
    if (!supabase) return;
    const { data } = await supabase.from("profiles").select("*").eq("id", userId).single();
    if (data) {
      setProfile(data as Profile);
    } else {
      setProfile({
        id: userId,
        full_name: email.split("@")[0],
        email,
        role: "user",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    }
  }

  async function signUp(email: string, password: string, fullName: string) {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } },
      });
      if (error) return { error: error.message };
      if (data.user) {
        await supabase.from("profiles").upsert({
          id: data.user.id,
          full_name: fullName,
          email,
          role: "user",
        });
      }
      return {};
    }

    const demoProfile: Profile = {
      id: crypto.randomUUID(),
      full_name: fullName,
      email,
      role: email.startsWith("admin@") ? "admin" : "user",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    localStorage.setItem(DEMO_PROFILE_KEY, JSON.stringify(demoProfile));
    setProfile(demoProfile);
    return {};
  }

  async function signIn(email: string, password: string) {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return { error: error.message };
      return {};
    }

    const stored = localStorage.getItem(DEMO_PROFILE_KEY);
    const existing: Profile | null = stored ? JSON.parse(stored) : null;
    if (existing && existing.email === email) {
      setProfile(existing);
      return {};
    }
    const demoProfile: Profile = {
      id: crypto.randomUUID(),
      full_name: email.split("@")[0],
      email,
      role: email.startsWith("admin@") ? "admin" : "user",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    localStorage.setItem(DEMO_PROFILE_KEY, JSON.stringify(demoProfile));
    setProfile(demoProfile);
    return {};
  }

  async function signOut() {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    } else {
      localStorage.removeItem(DEMO_PROFILE_KEY);
    }
    setProfile(null);
  }

  function completeOnboarding(interests: string[], wantsSurvey: boolean) {
    localStorage.setItem(ONBOARDING_KEY, "true");
    localStorage.setItem("safeaware_demo_onboarding_interests", JSON.stringify(interests));
    localStorage.setItem("safeaware_demo_onboarding_wants_survey", String(wantsSurvey));
    setHasCompletedOnboarding(true);
  }

  return (
    <AuthContext.Provider
      value={{
        profile,
        loading,
        isDemoMode: !isSupabaseConfigured,
        signUp,
        signIn,
        signOut,
        completeOnboarding,
        hasCompletedOnboarding,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
