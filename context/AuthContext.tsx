import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

import { Session } from "@supabase/supabase-js";

import { supabase } from "../lib/supabase";

export type Profile = {
  id: string;
  display_name: string;
};

type AuthContextType = {
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  refreshProfile: () => Promise<void>;
};

const AuthContext =
  createContext<AuthContextType | undefined>(
    undefined
  );

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [session, setSession] =
    useState<Session | null>(null);

  const [profile, setProfile] =
    useState<Profile | null>(null);

  const [loading, setLoading] =
    useState(true);

  async function loadProfile(
    currentSession: Session | null
  ) {
    if (!currentSession) {
      setProfile(null);
      return;
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("id, display_name")
      .eq("id", currentSession.user.id)
      .maybeSingle();

    if (error) {
      console.error(
        "Failed to load profile:",
        error.message
      );
      setProfile(null);
      return;
    }

    setProfile(data);
  }

  async function refreshProfile() {
    await loadProfile(session);
  }

  useEffect(() => {
    async function initialise() {
      const {
        data: { session: initialSession },
      } = await supabase.auth.getSession();

      setSession(initialSession);

      await loadProfile(initialSession);

      setLoading(false);
    }

    initialise();

    const {
      data: { subscription },
    } =
      supabase.auth.onAuthStateChange(
        async (_event, newSession) => {
          setSession(newSession);

          await loadProfile(newSession);

          setLoading(false);
        }
      );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        session,
        profile,
        loading,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}