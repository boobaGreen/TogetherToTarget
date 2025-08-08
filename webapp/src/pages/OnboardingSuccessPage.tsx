import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import {
  UserProfilesService,
  type UserProfile,
} from "../services/userProfiles";
import { SimpleProfileService } from "../services/simpleProfile";
import "../styles/onboarding-success.css";

const OnboardingSuccessPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    // Verifica che l'utente abbia completato l'onboarding
    const checkProfile = async () => {
      console.log("🔍 OnboardingSuccessPage: Verifica profilo utente");
      
      if (!user) {
        console.log("❌ Nessun utente autenticato, redirect a login");
        navigate("/login");
        return;
      }

      console.log("👤 Utente autenticato:", user.email, "ID:", user.id);

      try {
        console.log("🔎 Richiesta profilo dal database...");
        
        // Prima prova con la versione semplice
        const simpleProfile = await SimpleProfileService.getSimpleProfile(user.id);
        if (simpleProfile) {
          console.log("✅ [SIMPLE] Profilo trovato, uso versione semplice");
          setUserProfile(simpleProfile as UserProfile);
          return;
        }
        
        // Se fallisce, prova con il servizio completo
        const profile = await UserProfilesService.getUserProfile(user.id);
        
        if (!profile) {
          console.log("❌ Profilo non trovato, redirect a onboarding");
          navigate("/onboarding");
          return;
        }
        
        console.log("✅ Profilo trovato, mostra Success Page:", profile);
        setUserProfile(profile);
      } catch (error) {
        console.error("❌ Errore nel caricamento profilo:", error);
        console.log("🔄 Redirect a onboarding per errore");
        navigate("/onboarding");
      } finally {
        setIsLoading(false);
      }
    };

    checkProfile();
  }, [user, navigate]);

  const handleGoToDashboard = () => {
    navigate("/dashboard");
  };

  const handleEditProfile = () => {
    navigate("/onboarding");
  };

  if (isLoading) {
    return (
      <div className="onboarding-success-page">
        <div className="success-container">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Caricamento...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!userProfile) {
    return null; // Verrà reindirizzato
  }

  return (
    <div className="onboarding-success-page">
      <div className="success-container">
        {/* Header di successo */}
        <div className="success-header">
          <div className="success-icon">🎉</div>
          <h1 className="success-title">Profilo Completato!</h1>
          <p className="success-subtitle">
            Ottimo lavoro! Il tuo profilo è pronto per trovare il partner
            perfetto.
          </p>
        </div>

        {/* Riepilogo profilo */}
        <div className="profile-summary">
          <h2>Il Tuo Profilo</h2>

          <div className="summary-item">
            <span className="summary-label">Categoria:</span>
            <span className="summary-value">
              {userProfile.categories?.emoji} {userProfile.categories?.name_it}
            </span>
          </div>

          <div className="summary-item">
            <span className="summary-label">Obiettivo:</span>
            <span className="summary-value">
              {userProfile.goal_description}
            </span>
          </div>

          {userProfile.goal_deadline && (
            <div className="summary-item">
              <span className="summary-label">Scadenza:</span>
              <span className="summary-value">
                {new Date(userProfile.goal_deadline).toLocaleDateString(
                  "it-IT"
                )}
              </span>
            </div>
          )}

          <div className="summary-item">
            <span className="summary-label">Livello:</span>
            <span className="summary-value">
              {userProfile.experience_level === "beginner" && "🟢 Principiante"}
              {userProfile.experience_level === "intermediate" &&
                "🟡 Intermedio"}
              {userProfile.experience_level === "advanced" && "🔴 Avanzato"}
            </span>
          </div>

          <div className="summary-item">
            <span className="summary-label">Disponibilità:</span>
            <span className="summary-value">
              {userProfile.availability_hours}
            </span>
          </div>
        </div>

        {/* Prossimi passi */}
        <div className="next-steps">
          <h3>Cosa succede ora?</h3>
          <div className="steps-list">
            <div className="step-item">
              <span className="step-number">1</span>
              <div className="step-content">
                <h4>Trova Partner</h4>
                <p>Il nostro algoritmo ti abbinerà con persone compatibili</p>
              </div>
            </div>

            <div className="step-item">
              <span className="step-number">2</span>
              <div className="step-content">
                <h4>Inizia a Collaborare</h4>
                <p>Riceverai notifiche quando troveremo un match perfetto</p>
              </div>
            </div>

            <div className="step-item">
              <span className="step-number">3</span>
              <div className="step-content">
                <h4>Raggiungi i Tuoi Obiettivi</h4>
                <p>Lavora insieme al tuo partner per raggiungere il successo</p>
              </div>
            </div>
          </div>
        </div>

        {/* Statistiche motivazionali */}
        <div className="motivation-stats">
          <div className="stat-item">
            <span className="stat-number">2x</span>
            <span className="stat-label">Più probabilità di successo</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">85%</span>
            <span className="stat-label">Utenti soddisfatti</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">30+</span>
            <span className="stat-label">Categorie disponibili</span>
          </div>
        </div>

        {/* Azioni */}
        <div className="success-actions">
          <button className="btn-primary" onClick={handleGoToDashboard}>
            Vai alla Dashboard
          </button>

          <button className="btn-secondary" onClick={handleEditProfile}>
            Modifica Profilo
          </button>
        </div>

        {/* Footer */}
        <div className="success-footer">
          <p>
            Hai domande? <a href="/help">Visita il centro assistenza</a> o
            <a href="mailto:support@togethertotarget.com"> contattaci</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OnboardingSuccessPage;
