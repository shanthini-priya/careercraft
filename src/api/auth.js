import { supabase, isSupabaseConfigured } from "./supabase";
import { api, getToken, clearToken } from "./client";

export const authApi = {
  async isConfigured() {
    return isSupabaseConfigured();
  },

  /** Sign in with email + password (or OTP magic link if no password). */
  async login({ email, password }) {
    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw new Error(error.message);
      return await this.me();
    }
    // Fallback (no Supabase keys): legacy backend endpoint.
    const data = await api.post("/auth/login", { email, password });
    localStorage.setItem("careercraft_token", data.token);
    return data.user;
  },

  /** Create a new password account via Supabase Auth. */
  async register({ name, email, password }) {
    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name } },
      });
      if (error) throw new Error(error.message);
      return await this.me();
    }
    // Fallback: legacy backend endpoint.
    const data = await api.post("/auth/register", { name, email, password });
    localStorage.setItem("careercraft_token", data.token);
    return data.user;
  },

  /** Sign in with an OAuth provider (Google / GitHub). */
  async signInWithProvider(provider) {
    if (!isSupabaseConfigured() || !supabase) {
      throw new Error("Social login is not configured yet. Add Supabase keys first.");
    }
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: window.location.origin },
    });
    if (error) throw new Error(error.message);
  },

  /** Send a password reset link. */
  async resetPassword(email) {
    if (!isSupabaseConfigured() || !supabase) {
      throw new Error("Password reset requires Supabase to be configured.");
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/#login`,
    });
    if (error) throw new Error(error.message);
  },

  /** Current authenticated user object (upserts the local profile on first hit). */
  async me() {
    if (isSupabaseConfigured() && supabase) {
      const { data } = await supabase.auth.getUser();
      if (!data.user) return null;
      // Ensure a local user row exists + fetch current name/email/role.
      return api.get("/auth/me");
    }
    return api.get("/auth/me");
  },

  /** Update the user's display name (persists to the backend). */
  async saveName(name) {
    const data = await api.put("/auth/me", { name });
    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase.auth.updateUser({ data: { name } }).catch(() => null);
      if (error) return data.user;
    }
    return data.user;
  },

  async logout() {
    if (isSupabaseConfigured() && supabase) {
      await supabase.auth.signOut().catch(() => {});
    }
    clearToken();
  },

  isAuthenticated: () => !!getToken() || isSupabaseConfigured(),
  isSupabaseConfigured,
};

export default authApi;
