import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import CategorySelector from "../components/onboarding/CategorySelector";
import SubcategorySelector from "../components/onboarding/SubcategorySelector";
import GoalInput from "../components/onboarding/GoalInput";
import ExperienceLevelSelector from "../components/onboarding/ExperienceLevel";
import AvailabilitySettings from "../components/onboarding/AvailabilitySettings";
import { MatchingPreferences } from "../components/matching/MatchingPreferences";
import { CategoriesService } from "../services/categories";
import { SubcategoriesService } from "../services/subcategories";
import { UserProfilesService } from "../services/userProfiles";
import { MatchingService } from "../services/matching";
import { DatabaseTest } from "../services/databaseTest";
import type { Category, Subcategory } from "../types/categories";
import type { GoalInputData } from "../types/goal";
import type { ExperienceLevelData } from "../types/experience";
import type { AvailabilityData } from "../types/availability";

export const OnboardingPage: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [selectedSubcategory, setSelectedSubcategory] =
    useState<Subcategory | null>(null);
  const [subcategoriesLoading, setSubcategoriesLoading] = useState(false);
  const [goalData, setGoalData] = useState<GoalInputData | null>(null);
  const [experienceData, setExperienceData] =
    useState<ExperienceLevelData | null>(null);
  const [isExperienceValid, setIsExperienceValid] = useState(false);
  const [availabilityData, setAvailabilityData] =
    useState<AvailabilityData | null>(null);
  const [isAvailabilityValid, setIsAvailabilityValid] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadCategories();
    // Test del database al caricamento (solo in sviluppo)
    if (user && process.env.NODE_ENV === "development") {
      DatabaseTest.testConnection();
    }
  }, [user]);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const categoriesData = await CategoriesService.getActiveCategories();
      setCategories(categoriesData);
    } catch (error) {
      console.error("Errore nel caricamento delle categorie:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadSubcategories = async (categoryId: number) => {
    try {
      setSubcategoriesLoading(true);
      console.log(`🔍 Caricamento subcategorie per categoria ${categoryId}...`);
      const subcategoriesData =
        await SubcategoriesService.getSubcategoriesByCategory(categoryId);
      setSubcategories(subcategoriesData);
      console.log(`✅ Caricate ${subcategoriesData.length} subcategorie`);
    } catch (error) {
      console.error("Errore nel caricamento delle subcategorie:", error);
      setSubcategories([]);
    } finally {
      setSubcategoriesLoading(false);
    }
  };

  const handleCategorySelect = async (category: Category) => {
    setSelectedCategory(category);
    setSelectedSubcategory(null); // Reset subcategory selection
    await loadSubcategories(category.id);
  };

  const handleSubcategorySelect = (subcategory: Subcategory) => {
    setSelectedSubcategory(subcategory);
  };

  const nextStep = async () => {
    // Se siamo al passo 6 (ultimo step) e tutti i dati sono validi, completa l'onboarding
    if (
      currentStep === 6 &&
      selectedCategory &&
      selectedSubcategory &&
      goalData &&
      experienceData &&
      availabilityData &&
      user
    ) {
      await completeOnboarding();
      return;
    }

    setCurrentStep((prev) => prev + 1);
  };

  const completeOnboarding = async () => {
    if (
      !user ||
      !selectedCategory ||
      !selectedSubcategory ||
      !goalData ||
      !experienceData ||
      !availabilityData
    ) {
      console.error("❌ Dati mancanti per completare l'onboarding");
      console.log("Debug stato:", {
        user: !!user,
        selectedCategory: !!selectedCategory,
        selectedSubcategory: !!selectedSubcategory,
        goalData: !!goalData,
        experienceData: !!experienceData,
        availabilityData: !!availabilityData,
      });
      return;
    }

    try {
      setIsSaving(true);
      console.log("🚀 Avvio salvataggio profilo...");

      // Salva il profilo nel database
      const savedProfile = await UserProfilesService.createOrUpdateProfile(
        user.id,
        {
          categoryId: selectedCategory.id,
          subcategoryId: selectedSubcategory.id, // Aggiungiamo la subcategoria
          goalData,
          experienceData,
          availabilityData,
        }
      );

      console.log("✅ Profilo salvato con successo:", savedProfile);

      // 🎯 NOVITÀ: Inserimento automatico nel primo matching pool
      console.log("🎯 Inserimento automatico nel matching pool...");
      try {
        const poolEntryId = await MatchingService.enterMatchingPool(
          user.id,
          goalData.description || `Obiettivo: ${selectedSubcategory.name_it}`,
          selectedCategory.name_en.toLowerCase(),
          selectedSubcategory.name_en.toLowerCase()
        );
        console.log("✅ Utente inserito nel matching pool:", poolEntryId);
      } catch (poolError) {
        console.error("⚠️ Errore inserimento matching pool:", poolError);
        // Non blocchiamo il flusso se fallisce l'inserimento nel pool
      }

      // Reindirizza alla pagina di successo PRIMA del refresh per evitare race conditions
      console.log("📄 Redirect a /onboarding-success");
      navigate("/onboarding-success");

      // Refresh dell'utente per aggiornare onboarding_completed (in background)
      console.log("🔄 Refresh dati utente in background...");
      setTimeout(async () => {
        await refreshUser();
        console.log("✅ Dati utente aggiornati in background");
      }, 100);
    } catch (error) {
      console.error("❌ Errore nel salvataggio del profilo:", error);

      // Messaggio di errore più dettagliato
      let errorMessage = "Errore nel salvataggio del profilo.";
      if (error instanceof Error) {
        errorMessage += ` Dettagli: ${error.message}`;
      }

      alert(errorMessage + " Controlla la console per maggiori dettagli.");
    } finally {
      setIsSaving(false);
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(0, prev - 1));
  };

  // Step 0: Introduzione
  if (currentStep === 0) {
    return (
      <div
        style={{
          fontFamily: "Inter, sans-serif",
          minHeight: "100vh",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "#1a202c",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
        }}
      >
        <div
          className="onboarding-container"
          style={{
            background: "white",
            padding: "40px",
            borderRadius: "16px",
            boxShadow:
              "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            maxWidth: "500px",
            width: "100%",
            textAlign: "center",
          }}
        >
          <h1
            className="onboarding-title"
            style={{
              fontSize: "2.5rem",
              marginBottom: "1rem",
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "15px",
            }}
          >
            <span className="onboarding-emoji" style={{ fontSize: "3rem" }}>
              🎯
            </span>
            <span
              style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                color: "#1a202c",
              }}
            >
              TogetherToTarget
            </span>
          </h1>

          <h2
            style={{
              fontSize: "1.75rem",
              color: "#1a202c",
              marginBottom: "1rem",
              fontWeight: "600",
            }}
          >
            🎉 Benvenuto, {user?.name || user?.email}!
          </h2>

          <p
            style={{
              color: "#4a5568",
              marginBottom: "2rem",
              lineHeight: "1.6",
              fontSize: "1.1rem",
            }}
          >
            Sei quasi pronto per iniziare il tuo percorso motivazionale!
            Completiamo insieme il setup del tuo profilo.
          </p>

          <div
            style={{
              background: "#f7fafc",
              padding: "20px",
              borderRadius: "12px",
              marginBottom: "30px",
              textAlign: "left",
            }}
          >
            <h3
              style={{
                margin: "0 0 15px 0",
                color: "#1a202c",
                fontSize: "1.2rem",
                fontWeight: "600",
              }}
            >
              🔧 Prossimi passi:
            </h3>

            <div style={{ display: "grid", gap: "10px" }}>
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <span style={{ fontSize: "1.2rem" }}>📝</span>
                <span style={{ color: "#4a5568" }}>
                  Seleziona le tue categorie di interesse
                </span>
              </div>

              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <span style={{ fontSize: "1.2rem" }}>🎯</span>
                <span style={{ color: "#4a5568" }}>
                  Descrivi i tuoi obiettivi
                </span>
              </div>

              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <span style={{ fontSize: "1.2rem" }}>⚙️</span>
                <span style={{ color: "#4a5568" }}>
                  Configura le tue preferenze
                </span>
              </div>

              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <span style={{ fontSize: "1.2rem" }}>🤝</span>
                <span style={{ color: "#4a5568" }}>
                  Entra nel pool di matching
                </span>
              </div>
            </div>
          </div>

          <div
            style={{
              background: "#e6fffa",
              padding: "20px",
              borderRadius: "12px",
              marginBottom: "30px",
              borderLeft: "4px solid #38b2ac",
            }}
          >
            <h4
              style={{
                margin: "0 0 10px 0",
                color: "#234e52",
                fontSize: "1.1rem",
                fontWeight: "600",
              }}
            >
              💡 Come funziona TogetherToTarget:
            </h4>
            <p
              style={{
                margin: "0",
                color: "#234e52",
                fontSize: "0.95rem",
                lineHeight: "1.5",
              }}
            >
              Ti metteremo in contatto con altre 2 persone che condividono i
              tuoi obiettivi. Insieme formerete un gruppo di supporto per 30
              giorni, motivandovi a vicenda attraverso check-in quotidiani e
              chat di gruppo.
            </p>
          </div>

          <button
            onClick={nextStep}
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              border: "none",
              padding: "15px 30px",
              borderRadius: "8px",
              fontSize: "1.1rem",
              fontWeight: "600",
              cursor: "pointer",
              transition: "transform 0.2s ease",
              width: "100%",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow =
                "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            🚀 Inizia l'Onboarding
          </button>

          <p
            style={{
              color: "#a0aec0",
              marginTop: "20px",
              fontSize: "0.9rem",
            }}
          >
            📋 Tempo stimato: 3-5 minuti
          </p>
        </div>
      </div>
    );
  }

  // Step 1: Preferenze Matching
  if (currentStep === 1) {
    return (
      <div
        style={{
          fontFamily: "Inter, sans-serif",
          minHeight: "100vh",
          background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
          padding: "20px",
        }}
      >
        <div
          style={{
            maxWidth: "800px",
            margin: "0 auto",
            padding: "2rem 0",
          }}
        >
          {/* Progress indicator */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginBottom: "2rem",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                background: "white",
                padding: "0.75rem 1.5rem",
                borderRadius: "50px",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                marginBottom: "0.5rem",
              }}
            >
              <span style={{ color: "#667eea", fontWeight: "600" }}>
                Passo 1 di 6
              </span>
              <span style={{ color: "#94a3b8" }}>•</span>
              <span style={{ color: "#64748b" }}>Preferenze Matching</span>
            </div>
            {/* Barra di progresso */}
            <div
              style={{
                width: "200px",
                height: "4px",
                background: "#e2e8f0",
                borderRadius: "2px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: "16.6%", // 1/6
                  height: "100%",
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  transition: "width 0.3s ease",
                }}
              ></div>
            </div>
            <div
              style={{
                fontSize: "0.8rem",
                color: "#94a3b8",
                marginTop: "0.5rem",
                textAlign: "center",
              }}
            >
              ⏱️ Tempo rimanente: ~3 minuti
            </div>
          </div>

          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <h2
              style={{
                fontSize: "1.75rem",
                marginBottom: "0.5rem",
                color: "#1a202c",
              }}
            >
              ⚙️ Configura le tue Preferenze
            </h2>
            <p style={{ color: "#64748b", fontSize: "1.1rem" }}>
              Impostiamo come preferisci che funzioni il matching. Potrai
              modificare queste impostazioni in qualsiasi momento dal tuo
              profilo.
            </p>
          </div>

          <div
            style={{
              background: "white",
              borderRadius: "12px",
              padding: "2rem",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            }}
          >
            <MatchingPreferences />
          </div>

          {/* Bottoni navigazione */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "2rem",
            }}
          >
            <button
              onClick={prevStep}
              style={{
                background: "transparent",
                color: "#64748b",
                border: "1px solid #cbd5e1",
                padding: "12px 24px",
                borderRadius: "8px",
                fontSize: "1rem",
                cursor: "pointer",
              }}
            >
              ← Indietro
            </button>
            <button
              onClick={nextStep}
              style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                border: "none",
                padding: "12px 24px",
                borderRadius: "8px",
                fontSize: "1rem",
                cursor: "pointer",
              }}
            >
              Continua →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Step 2: Selezione categoria
  if (currentStep === 2) {
    return (
      <div
        style={{
          fontFamily: "Inter, sans-serif",
          minHeight: "100vh",
          background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
          padding: "20px",
        }}
      >
        <div
          style={{
            maxWidth: "1000px",
            margin: "0 auto",
            padding: "2rem 0",
          }}
        >
          {/* Progress indicator con tempo stimato */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginBottom: "2rem",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                background: "white",
                padding: "0.75rem 1.5rem",
                borderRadius: "50px",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                marginBottom: "0.5rem",
              }}
            >
              <span style={{ color: "#667eea", fontWeight: "600" }}>
                Passo 2 di 6
              </span>
              <span style={{ color: "#94a3b8" }}>•</span>
              <span style={{ color: "#64748b" }}>Categoria obiettivo</span>
            </div>

            {/* Barra di progresso visuale */}
            <div
              style={{
                width: "200px",
                height: "4px",
                background: "#e2e8f0",
                borderRadius: "2px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: "33.3%", // 2/6
                  height: "100%",
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  transition: "width 0.3s ease",
                }}
              ></div>
            </div>

            <div
              style={{
                fontSize: "0.8rem",
                color: "#94a3b8",
                marginTop: "0.5rem",
                textAlign: "center",
              }}
            >
              ⏱️ Tempo rimanente: ~2 minuti
            </div>
          </div>

          <CategorySelector
            categories={categories}
            selectedCategoryId={selectedCategory?.id}
            onCategorySelect={handleCategorySelect}
            loading={loading}
          />

          {/* Navigation buttons */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              maxWidth: "800px",
              margin: "2rem auto 0",
              padding: "0 2rem",
            }}
          >
            <button
              onClick={prevStep}
              style={{
                background: "transparent",
                color: "#64748b",
                border: "1px solid #cbd5e1",
                padding: "12px 24px",
                borderRadius: "8px",
                fontSize: "1rem",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              ← Indietro
            </button>

            <button
              onClick={nextStep}
              disabled={!selectedCategory}
              style={{
                background: selectedCategory
                  ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                  : "#e2e8f0",
                color: selectedCategory ? "white" : "#94a3b8",
                border: "none",
                padding: "12px 24px",
                borderRadius: "8px",
                fontSize: "1rem",
                cursor: selectedCategory ? "pointer" : "not-allowed",
                transition: "all 0.2s ease",
                position: "relative",
              }}
            >
              {selectedCategory ? "Continua →" : "Seleziona una categoria"}
            </button>
          </div>

          {/* Messaggio motivazionale */}
          {selectedCategory && (
            <div
              style={{
                maxWidth: "600px",
                margin: "1rem auto 0",
                textAlign: "center",
                background: "#f0f9ff",
                padding: "1rem",
                borderRadius: "12px",
                border: "1px solid #bae6fd",
              }}
            >
              <p
                style={{
                  margin: 0,
                  color: "#0369a1",
                  fontSize: "0.95rem",
                  lineHeight: "1.5",
                }}
              >
                💪 Ottima scelta! <strong>{selectedCategory.name_it}</strong> è
                una categoria molto popolare. Insieme al tuo gruppo di supporto
                avrai <strong>3x più probabilità</strong> di raggiungere il tuo
                obiettivo!
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Step 3: Selezione subcategoria
  if (currentStep === 3) {
    return (
      <div
        style={{
          fontFamily: "Inter, sans-serif",
          minHeight: "100vh",
          background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
          padding: "20px",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "2rem 0",
          }}
        >
          {/* Progress indicator con tempo stimato */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginBottom: "2rem",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                background: "white",
                padding: "0.75rem 1.5rem",
                borderRadius: "50px",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                marginBottom: "0.5rem",
              }}
            >
              <span style={{ color: "#667eea", fontWeight: "600" }}>
                Passo 3 di 6
              </span>
              <span style={{ color: "#94a3b8" }}>•</span>
              <span style={{ color: "#64748b" }}>Obiettivo specifico</span>
            </div>

            {/* Barra di progresso visuale */}
            <div
              style={{
                width: "200px",
                height: "4px",
                background: "#e2e8f0",
                borderRadius: "2px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: "50%", // 3/6
                  height: "100%",
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  transition: "width 0.3s ease",
                }}
              ></div>
            </div>

            <div
              style={{
                fontSize: "0.8rem",
                color: "#94a3b8",
                marginTop: "0.5rem",
                textAlign: "center",
              }}
            >
              ⏱️ Tempo rimanente: ~90 secondi
            </div>
          </div>

          {selectedCategory ? (
            <SubcategorySelector
              selectedCategory={selectedCategory}
              subcategories={subcategories}
              selectedSubcategoryId={selectedSubcategory?.id}
              onSubcategorySelect={handleSubcategorySelect}
              loading={subcategoriesLoading}
            />
          ) : (
            <div
              style={{
                textAlign: "center",
                padding: "3rem",
                background: "white",
                borderRadius: "16px",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                margin: "2rem auto",
                maxWidth: "600px",
              }}
            >
              <div
                style={{
                  fontSize: "3rem",
                  marginBottom: "1rem",
                }}
              >
                ⚠️
              </div>
              <h3
                style={{
                  color: "#1a202c",
                  marginBottom: "0.5rem",
                }}
              >
                Categoria non selezionata
              </h3>
              <p
                style={{
                  color: "#64748b",
                  marginBottom: "1.5rem",
                }}
              >
                Per continuare, devi prima selezionare una categoria nel passo
                precedente.
              </p>
              <button
                onClick={prevStep}
                style={{
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "white",
                  border: "none",
                  padding: "12px 24px",
                  borderRadius: "8px",
                  fontSize: "1rem",
                  cursor: "pointer",
                }}
              >
                ← Torna al passo precedente
              </button>
            </div>
          )}

          {/* Navigation buttons */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              maxWidth: "1000px",
              margin: "2rem auto 0",
              padding: "0 2rem",
            }}
          >
            <button
              onClick={prevStep}
              style={{
                background: "transparent",
                color: "#64748b",
                border: "1px solid #cbd5e1",
                padding: "12px 24px",
                borderRadius: "8px",
                fontSize: "1rem",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              ← Indietro
            </button>

            <button
              onClick={nextStep}
              disabled={!selectedSubcategory}
              style={{
                background: selectedSubcategory
                  ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                  : "#e2e8f0",
                color: selectedSubcategory ? "white" : "#94a3b8",
                border: "none",
                padding: "12px 24px",
                borderRadius: "8px",
                fontSize: "1rem",
                cursor: selectedSubcategory ? "pointer" : "not-allowed",
                transition: "all 0.2s ease",
              }}
            >
              Continua →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Step 4: Inserimento obiettivo
  if (currentStep === 4) {
    return (
      <div
        style={{
          fontFamily: "Inter, sans-serif",
          minHeight: "100vh",
          background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
          padding: "20px",
        }}
      >
        <div
          style={{
            maxWidth: "1000px",
            margin: "0 auto",
            padding: "2rem 0",
          }}
        >
          {/* Progress indicator con tempo stimato */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginBottom: "2rem",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                background: "white",
                padding: "0.75rem 1.5rem",
                borderRadius: "50px",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                marginBottom: "0.5rem",
              }}
            >
              <span style={{ color: "#667eea", fontWeight: "600" }}>
                Passo 4 di 6
              </span>
              <span style={{ color: "#94a3b8" }}>•</span>
              <span style={{ color: "#64748b" }}>
                Descrivi il tuo obiettivo
              </span>
            </div>

            {/* Barra di progresso visuale */}
            <div
              style={{
                width: "200px",
                height: "4px",
                background: "#e2e8f0",
                borderRadius: "2px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: "66.6%", // 4/6
                  height: "100%",
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  transition: "width 0.3s ease",
                }}
              ></div>
            </div>

            <div
              style={{
                fontSize: "0.8rem",
                color: "#94a3b8",
                marginTop: "0.5rem",
                textAlign: "center",
              }}
            >
              ⏱️ Tempo rimanente: ~60 secondi
            </div>
          </div>

          {selectedCategory && (
            <GoalInput
              selectedCategory={{
                id: selectedCategory.id,
                name_it: selectedCategory.name_it,
                name_en: selectedCategory.name_en,
                emoji: selectedCategory.emoji,
                color: selectedCategory.color,
              }}
              initialData={goalData || undefined}
              onGoalChange={setGoalData}
            />
          )}

          {/* Navigation buttons */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              maxWidth: "800px",
              margin: "2rem auto 0",
              padding: "0 2rem",
            }}
          >
            <button
              onClick={prevStep}
              style={{
                background: "transparent",
                color: "#64748b",
                border: "1px solid #cbd5e1",
                padding: "12px 24px",
                borderRadius: "8px",
                fontSize: "1rem",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              ← Indietro
            </button>

            <button
              onClick={nextStep}
              disabled={false} // GoalInput sempre valido ora (opzionale)
              style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                border: "none",
                padding: "12px 24px",
                borderRadius: "8px",
                fontSize: "1rem",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              Continua →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Step 5: Livello di esperienza
  if (currentStep === 5) {
    return (
      <div
        style={{
          fontFamily: "Inter, sans-serif",
          minHeight: "100vh",
          background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
          padding: "20px",
        }}
      >
        <div
          style={{
            maxWidth: "1000px",
            margin: "0 auto",
            padding: "2rem 0",
          }}
        >
          {/* Progress indicator con tempo stimato */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginBottom: "2rem",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                background: "white",
                padding: "0.75rem 1.5rem",
                borderRadius: "50px",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                marginBottom: "0.5rem",
              }}
            >
              <span style={{ color: "#667eea", fontWeight: "600" }}>
                Passo 5 di 6
              </span>
              <span style={{ color: "#94a3b8" }}>•</span>
              <span style={{ color: "#64748b" }}>Livello di esperienza</span>
            </div>

            {/* Barra di progresso visuale */}
            <div
              style={{
                width: "200px",
                height: "4px",
                background: "#e2e8f0",
                borderRadius: "2px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: "83.3%", // 5/6
                  height: "100%",
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  transition: "width 0.3s ease",
                }}
              ></div>
            </div>

            <div
              style={{
                fontSize: "0.8rem",
                color: "#94a3b8",
                marginTop: "0.5rem",
                textAlign: "center",
              }}
            >
              ⏱️ Tempo rimanente: ~30 secondi
            </div>
          </div>

          {selectedCategory && goalData && (
            <ExperienceLevelSelector
              selectedCategory={{
                id: selectedCategory.id,
                name_it: selectedCategory.name_it,
                name_en: selectedCategory.name_en,
                emoji: selectedCategory.emoji,
                color: selectedCategory.color,
              }}
              goalDescription={goalData.description}
              initialData={experienceData || undefined}
              onExperienceChange={setExperienceData}
              onValidation={setIsExperienceValid}
            />
          )}

          {/* Navigation buttons */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              maxWidth: "900px",
              margin: "2rem auto 0",
              padding: "0 2rem",
            }}
          >
            <button
              onClick={prevStep}
              style={{
                background: "transparent",
                color: "#64748b",
                border: "1px solid #cbd5e1",
                padding: "12px 24px",
                borderRadius: "8px",
                fontSize: "1rem",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              ← Indietro
            </button>

            <button
              onClick={nextStep}
              disabled={!isExperienceValid}
              style={{
                background: isExperienceValid
                  ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                  : "#e2e8f0",
                color: isExperienceValid ? "white" : "#94a3b8",
                border: "none",
                padding: "12px 24px",
                borderRadius: "8px",
                fontSize: "1rem",
                cursor: isExperienceValid ? "pointer" : "not-allowed",
                transition: "all 0.2s ease",
              }}
            >
              Continua →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Step 6: Disponibilità e preferenze
  if (currentStep === 6) {
    return (
      <div
        style={{
          fontFamily: "Inter, sans-serif",
          minHeight: "100vh",
          background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
          padding: "20px",
        }}
      >
        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
        <div
          style={{
            maxWidth: "1000px",
            margin: "0 auto",
            padding: "2rem 0",
          }}
        >
          {/* Progress indicator con tempo stimato */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginBottom: "2rem",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                background: "white",
                padding: "0.75rem 1.5rem",
                borderRadius: "50px",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                marginBottom: "0.5rem",
              }}
            >
              <span style={{ color: "#667eea", fontWeight: "600" }}>
                Passo 6 di 6
              </span>
              <span style={{ color: "#94a3b8" }}>•</span>
              <span style={{ color: "#64748b" }}>Disponibilità</span>
            </div>

            {/* Barra di progresso visuale */}
            <div
              style={{
                width: "200px",
                height: "4px",
                background: "#e2e8f0",
                borderRadius: "2px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: "100%", // 6/6
                  height: "100%",
                  background:
                    "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                  transition: "width 0.3s ease",
                }}
              ></div>
            </div>

            <div
              style={{
                fontSize: "0.8rem",
                color: "#059669",
                marginTop: "0.5rem",
                textAlign: "center",
                fontWeight: "600",
              }}
            >
              🎉 Quasi fatto! Ultimo step
            </div>
          </div>

          {selectedCategory && goalData && experienceData && (
            <AvailabilitySettings
              selectedCategory={{
                id: selectedCategory.id,
                name_it: selectedCategory.name_it,
                emoji: selectedCategory.emoji,
                color: selectedCategory.color,
              }}
              goalDescription={goalData.description}
              experienceLevel={experienceData.level}
              initialData={availabilityData || undefined}
              onAvailabilityChange={setAvailabilityData}
              onValidation={setIsAvailabilityValid}
            />
          )}

          {/* Navigation buttons */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              maxWidth: "900px",
              margin: "2rem auto 0",
              padding: "0 2rem",
            }}
          >
            <button
              onClick={prevStep}
              style={{
                background: "transparent",
                color: "#64748b",
                border: "1px solid #cbd5e1",
                padding: "12px 24px",
                borderRadius: "8px",
                fontSize: "1rem",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              ← Indietro
            </button>

            <button
              onClick={nextStep}
              disabled={!isAvailabilityValid || isSaving}
              style={{
                background:
                  isAvailabilityValid && !isSaving
                    ? "linear-gradient(135deg, #10b981 0%, #059669 100%)"
                    : "#e2e8f0",
                color: isAvailabilityValid && !isSaving ? "white" : "#94a3b8",
                border: "none",
                padding: "12px 32px",
                borderRadius: "8px",
                fontSize: "1.1rem",
                fontWeight: "600",
                cursor:
                  isAvailabilityValid && !isSaving ? "pointer" : "not-allowed",
                transition: "all 0.2s ease",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              {isSaving ? (
                <>
                  <div
                    style={{
                      width: "16px",
                      height: "16px",
                      border: "2px solid #94a3b8",
                      borderTop: "2px solid #ffffff",
                      borderRadius: "50%",
                      animation: "spin 1s linear infinite",
                    }}
                  ></div>
                  Salvataggio...
                </>
              ) : (
                <>🚀 Completa Onboarding</>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Placeholder per altri step
  return (
    <div
      style={{
        fontFamily: "Inter, sans-serif",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          background: "white",
          padding: "40px",
          borderRadius: "16px",
          textAlign: "center",
          maxWidth: "500px",
        }}
      >
        <h2>🚧 Step {currentStep}</h2>
        <p>Stiamo costruendo questo step...</p>
        <div style={{ textAlign: "left", maxWidth: "600px", margin: "0 auto" }}>
          <p>
            <strong>Categoria:</strong> {selectedCategory?.name_it}
          </p>
          {selectedSubcategory && (
            <p>
              <strong>Subcategoria:</strong> {selectedSubcategory.name_it}{" "}
              {selectedSubcategory.emoji}
            </p>
          )}
          {goalData && (
            <p>
              <strong>Obiettivo:</strong> {goalData.description}
            </p>
          )}
          {experienceData && (
            <div>
              <p>
                <strong>Livello:</strong> {experienceData.level}
              </p>
              <p>
                <strong>Motivazione:</strong> {experienceData.motivation}
              </p>
            </div>
          )}
          {availabilityData && (
            <div>
              <p>
                <strong>Orario:</strong> {availabilityData.availabilityHours}
              </p>
              <p>
                <strong>Giorni:</strong>{" "}
                {availabilityData.preferredDays.join(", ")}
              </p>
              <p>
                <strong>Frequenza:</strong> {availabilityData.meetingFrequency}
              </p>
            </div>
          )}
        </div>

        <div
          style={{
            marginTop: "2rem",
            display: "flex",
            gap: "1rem",
            justifyContent: "center",
          }}
        >
          <button
            onClick={prevStep}
            style={{
              padding: "10px 20px",
              border: "1px solid #ccc",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            ← Indietro
          </button>
          <button
            onClick={nextStep}
            style={{
              padding: "10px 20px",
              background: "#667eea",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Continua →
          </button>
        </div>
      </div>
    </div>
  );
};
