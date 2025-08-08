import { supabase } from "./supabase";
import { AuthError } from "../types/auth";
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import * as Crypto from "expo-crypto";
import { Platform } from "react-native";

// Configurazione per OAuth
WebBrowser.maybeCompleteAuthSession();

export const authService = {
  // Login con email e password
  async signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: error as AuthError };
    }
  },

  // Signup con email e password
  async signUp(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: "com.togethertoTarget://email-confirmation",
        },
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: error as AuthError };
    }
  },

  // Login con Google OAuth
  async signInWithGoogle() {
    try {
      if (Platform.OS === "web") {
        // Per il web, usiamo il redirect normale di Supabase senza skipBrowserRedirect
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: "google",
          options: {
            redirectTo: window.location.origin,
            queryParams: {
              access_type: "offline",
              prompt: "consent",
            },
          },
        });

        if (error) throw error;

        // Su web, Supabase gestisce automaticamente il redirect
        // Questo return non verrà mai raggiunto perché la pagina viene ricaricata
        return { data, error: null };
      } else {
        // Per mobile in Expo Go, usiamo AuthSession che gestisce meglio il redirect
        const redirectUri = AuthSession.makeRedirectUri();

        console.log("Mobile redirect URI:", redirectUri);

        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: "google",
          options: {
            redirectTo: redirectUri,
            skipBrowserRedirect: true,
          },
        });

        if (error) throw error;

        // Apriamo il browser per l'autenticazione
        const result = await WebBrowser.openAuthSessionAsync(
          data.url,
          redirectUri
        );

        if (result.type === "success") {
          // Estraiamo i parametri dall'URL di ritorno
          const url = result.url;
          const params = new URLSearchParams(
            url.split("#")[1] || url.split("?")[1]
          );

          const accessToken = params.get("access_token");
          const refreshToken = params.get("refresh_token");

          if (accessToken) {
            // Settiamo la sessione in Supabase
            const { data: session, error: sessionError } =
              await supabase.auth.setSession({
                access_token: accessToken,
                refresh_token: refreshToken || "",
              });

            if (sessionError) throw sessionError;
            return { data: session, error: null };
          }
        }

        return { data: null, error: { message: "Login annullato o fallito" } };
      }
    } catch (error: any) {
      return { data: null, error: error as AuthError };
    }
  },

  // Logout
  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { error: null };
    } catch (error: any) {
      return { error: error as AuthError };
    }
  },

  // Get current session
  async getSession() {
    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
      if (error) throw error;
      return { session, error: null };
    } catch (error: any) {
      return { session: null, error: error as AuthError };
    }
  },

  // Password reset
  async resetPassword(email: string) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: "com.togethertoTarget://reset-password",
      });
      if (error) throw error;
      return { error: null };
    } catch (error: any) {
      return { error: error as AuthError };
    }
  },

  // Auth state listener
  onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback);
  },
};
