import React, { createContext, useEffect, useState } from "react";
import { supabase } from "../services/supabase";
import {
  AuthService,
  type LoginCredentials,
  type SignupCredentials,
  type DBUser,
} from "../services/auth";
import type { Session } from "@supabase/supabase-js";
import type { AuthContextType } from "../types/auth";

// Messaggio di successo per conferma email
const EMAIL_CONFIRMATION_MESSAGE =
  "Account creato con successo! Ti abbiamo inviato un'email di conferma. Controlla la tua casella di posta, clicca sul link per attivare l'account e poi torna qui per fare login.";

// Context di autenticazione
// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

// Provider delle props
interface AuthProviderProps {
  children: React.ReactNode;
}

// Provider di autenticazione
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<DBUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  // Funzioni per pulire stati
  const clearError = () => setError(null);
  const clearMessage = () => setMessage(null);

  // Funzione per refreshare i dati dell'utente
  const refreshUser = async () => {
    try {
      await loadUserFromDB();
    } catch (error) {
      console.error("Errore nel refresh dell'utente:", error);
    }
  };

  // Carica i dati dell'utente dal database
  const loadUserFromDB = async () => {
    try {
      const { user: dbUser, error } = await AuthService.getCurrentUser();
      if (error) {
        console.error("Errore caricamento utente:", error);
        setUser(null);
      } else {
        setUser(dbUser);
      }
    } catch (error) {
      console.error("Errore nel caricamento utente:", error);
      setUser(null);
    }
  };

  // Login
  const login = async (credentials: LoginCredentials) => {
    try {
      setLoading(true);
      setError(null);
      clearMessage();

      const result = await AuthService.signInWithPassword(credentials);

      if (result.error) {
        setError(result.error);
        return { error: result.error };
      }

      // L'onAuthStateChange si occuperà di caricare l'utente
      return { error: null };
    } catch {
      const errorMsg = "Errore durante il login";
      setError(errorMsg);
      return { error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // Login con Google
  const loginWithGoogle = async () => {
    try {
      setLoading(true);
      setError(null);
      clearMessage();

      const result = await AuthService.signInWithGoogle();

      if (result.error) {
        setError(result.error);
        return { error: result.error };
      }

      return { error: null };
    } catch {
      const errorMsg = "Errore durante l'accesso con Google";
      setError(errorMsg);
      return { error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // Registrazione
  const signup = async (credentials: SignupCredentials) => {
    try {
      setLoading(true);
      setError(null);
      clearMessage();

      const result = await AuthService.signUp(credentials);

      if (result.error) {
        setError(result.error);
        return { error: result.error };
      }

      // Se serve conferma email, mostra il messaggio
      if (result.needsEmailConfirmation) {
        setMessage(EMAIL_CONFIRMATION_MESSAGE);
        return { error: null, needsEmailConfirmation: true };
      }

      // Altrimenti l'onAuthStateChange si occuperà del resto
      return { error: null, needsEmailConfirmation: false };
    } catch {
      const errorMsg = "Errore durante la registrazione";
      setError(errorMsg);
      return { error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await AuthService.signOut();

      if (result.error) {
        setError(result.error);
        return { error: result.error };
      }

      return { error: null };
    } catch {
      const errorMsg = "Errore durante il logout";
      setError(errorMsg);
      return { error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // Reset password
  const resetPassword = async (email: string) => {
    try {
      setLoading(true);
      setError(null);
      clearMessage();

      const result = await AuthService.resetPassword(email);

      if (result.error) {
        setError(result.error);
        return { error: result.error };
      }

      setMessage(
        "Ti abbiamo inviato un'email con le istruzioni per reimpostare la password."
      );
      return { error: null };
    } catch {
      const errorMsg = "Errore durante l'invio dell'email di reset";
      setError(errorMsg);
      return { error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // Update password
  const updatePassword = async (newPassword: string) => {
    try {
      setLoading(true);
      setError(null);
      clearMessage();

      const result = await AuthService.updatePassword(newPassword);

      if (result.error) {
        setError(result.error);
        return { error: result.error };
      }

      setMessage("Password aggiornata con successo!");
      return { error: null };
    } catch {
      const errorMsg = "Errore durante l'aggiornamento della password";
      setError(errorMsg);
      return { error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // Effect per inizializzare e ascoltare i cambiamenti di auth
  useEffect(() => {
    // Inizializzazione
    const initAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        setSession(session);

        if (session?.user) {
          await loadUserFromDB();
        }
      } catch (error) {
        console.error("Errore inizializzazione auth:", error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // Listener per i cambiamenti di stato
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state change:", event);
      setSession(session);

      if (event === "SIGNED_IN" && session?.user) {
        // Pulisce il messaggio quando l'utente si logga con successo
        clearMessage();
        await loadUserFromDB();
      } else if (event === "SIGNED_OUT") {
        setUser(null);
        clearMessage();
      } else if (event === "TOKEN_REFRESHED" && session?.user) {
        await loadUserFromDB();
      }

      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const value: AuthContextType = {
    user,
    session,
    loading,
    error,
    message,
    login,
    loginWithGoogle,
    signup,
    logout,
    resetPassword,
    updatePassword,
    refreshUser,
    clearError,
    clearMessage,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
