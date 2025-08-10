import React, { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { MatchingService } from "../../services/matching";
import { CategoriesService } from "../../services/categories";
import { SubcategoriesService } from "../../services/subcategories";
import type { Category, Subcategory } from "../../types/categories";
import { Spinner } from "../common/Spinner";
import { useToast } from "../../hooks/useToast";
import "./MatchingPoolTest.css";

interface MatchingStatus {
  in_pool: boolean;
  objective?: string;
  category?: string;
  subcategory?: string;
  current_level?: string;
  hours_in_pool?: number;
  escalation_count?: number;
  estimated_next_escalation_hours?: number;
}

export const MatchingPoolTest: React.FC = () => {
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();
  const [status, setStatus] = useState<MatchingStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [subcategoriesLoading, setSubcategoriesLoading] = useState(false);
  const [testObjective, setTestObjective] = useState("Imparare React avanzato");

  // State per categorie e sottocategorie dal database
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [selectedSubcategory, setSelectedSubcategory] =
    useState<Subcategory | null>(null);

  // Ref per tracciare se stiamo già caricando per evitare richieste multiple
  const categoriesLoadingRef = React.useRef(false);
  const subcategoriesLoadingRef = React.useRef(false);

  // Carica categorie dal database al mount
  useEffect(() => {
    let cancelled = false;

    const loadCategories = async () => {
      if (categoriesLoadingRef.current) return; // Evita richieste multiple

      try {
        categoriesLoadingRef.current = true;
        setCategoriesLoading(true);
        console.log("🔍 Caricamento categorie dal database...");
        const categoriesData = await CategoriesService.getActiveCategories();

        if (!cancelled) {
          setCategories(categoriesData);
          console.log(`✅ Caricate ${categoriesData.length} categorie`);

          // Seleziona la prima categoria come default
          if (categoriesData.length > 0) {
            setSelectedCategory(categoriesData[0]);
          }
        }
      } catch (error) {
        if (!cancelled) {
          console.error("Errore caricamento categorie:", error);
          // Non mostriamo toast per errori di caricamento iniziale per evitare loop
        }
      } finally {
        if (!cancelled) {
          setCategoriesLoading(false);
        }
        categoriesLoadingRef.current = false;
      }
    };

    loadCategories();

    return () => {
      cancelled = true;
      categoriesLoadingRef.current = false;
    };
  }, []); // Nessuna dipendenza per evitare loop

  // Carica sottocategorie quando cambia la categoria selezionata
  useEffect(() => {
    let cancelled = false;

    const loadSubcategories = async () => {
      if (!selectedCategory) return;
      if (subcategoriesLoadingRef.current) return; // Evita richieste multiple

      try {
        subcategoriesLoadingRef.current = true;
        setSubcategoriesLoading(true);
        console.log(
          `🔍 Caricamento subcategorie per categoria ${selectedCategory.id}...`
        );
        const subcategoriesData =
          await SubcategoriesService.getSubcategoriesByCategory(
            selectedCategory.id
          );

        if (!cancelled) {
          setSubcategories(subcategoriesData);
          console.log(`✅ Caricate ${subcategoriesData.length} subcategorie`);

          // Seleziona la prima sottocategoria come default
          if (subcategoriesData.length > 0) {
            setSelectedSubcategory(subcategoriesData[0]);
          } else {
            setSelectedSubcategory(null);
          }
        }
      } catch (error) {
        if (!cancelled) {
          console.error("Errore caricamento sottocategorie:", error);
          setSubcategories([]);
          setSelectedSubcategory(null);
        }
      } finally {
        if (!cancelled) {
          setSubcategoriesLoading(false);
        }
        subcategoriesLoadingRef.current = false;
      }
    };

    loadSubcategories();

    return () => {
      cancelled = true;
      subcategoriesLoadingRef.current = false;
    };
  }, [selectedCategory]);

  // Gestisce il cambio di categoria
  const handleCategoryChange = (categoryId: number) => {
    const category = categories.find((cat) => cat.id === categoryId);
    if (category) {
      setSelectedCategory(category);
      setSelectedSubcategory(null); // Reset sottocategoria
    }
  };

  // Gestisce il cambio di sottocategoria
  const handleSubcategoryChange = (subcategoryId: string) => {
    const subcategory = subcategories.find((sub) => sub.id === subcategoryId);
    if (subcategory) {
      setSelectedSubcategory(subcategory);
    }
  };

  // Funzione per aggiornare lo status manualmente
  const refreshStatus = async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      const statusData = await MatchingService.getUserMatchingStatus(user.id);
      setStatus(statusData);
    } catch (error) {
      console.error("Errore refresh status:", error);
      showError("Errore nel caricamento status");
    } finally {
      setLoading(false);
    }
  };

  // Carica status solo quando user.id cambia
  useEffect(() => {
    let cancelled = false;

    const loadStatusEffect = async () => {
      if (!user?.id) return;

      setLoading(true);
      try {
        const statusData = await MatchingService.getUserMatchingStatus(user.id);
        if (!cancelled) {
          setStatus(statusData);
        }
      } catch (error) {
        if (!cancelled) {
          console.error("Errore caricamento status:", error);
          // Gestiamo l'errore senza causare loop - non mostriamo toast qui
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadStatusEffect();

    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  const handleEnterPool = async () => {
    if (!user || !selectedCategory || !selectedSubcategory) return;

    setLoading(true);
    try {
      const poolId = await MatchingService.enterMatchingPool(
        user.id,
        testObjective,
        selectedCategory.name_it,
        selectedSubcategory.name_it
      );

      if (poolId) {
        showSuccess("Inserito nel pool di matching!");
        await refreshStatus();
      } else {
        showError("Errore nell'inserimento nel pool");
      }
    } catch (error) {
      console.error("Errore enter pool:", error);
      showError("Errore nell'inserimento nel pool");
    } finally {
      setLoading(false);
    }
  };

  const handleExitPool = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const success = await MatchingService.exitMatchingPool(user.id);

      if (success) {
        showSuccess("Rimosso dal pool di matching!");
        await refreshStatus();
      } else {
        showError("Errore nella rimozione dal pool");
      }
    } catch (error) {
      console.error("Errore exit pool:", error);
      showError("Errore nella rimozione dal pool");
    } finally {
      setLoading(false);
    }
  };

  const formatLevel = (level?: string) => {
    const levels = {
      perfect: "🎯 Perfect (0-24h)",
      good: "✅ Good (24-48h)",
      acceptable: "⚡ Acceptable (48-72h)",
      fallback: "🚨 Fallback (72h+)",
    };
    return levels[level as keyof typeof levels] || level;
  };

  if (loading || categoriesLoading) {
    return (
      <div className="matching-pool-test">
        <Spinner
          size="medium"
          message={
            categoriesLoading ? "Caricamento categorie..." : "Caricamento..."
          }
        />
      </div>
    );
  }

  return (
    <div className="matching-pool-test">
      <div className="test-section">
        <h3>🏊‍♂️ Test Matching Pool</h3>
        <p>Testa l'inserimento e rimozione dal pool di matching progressivo</p>
      </div>

      {/* Status Display */}
      <div className="status-section">
        <h4>Status Attuale</h4>
        {status ? (
          status.in_pool ? (
            <div className="status-card in-pool">
              <div className="status-header">
                <span className="status-badge in-pool">🏊‍♂️ Nel Pool</span>
                <span className="level-badge">
                  {formatLevel(status.current_level)}
                </span>
              </div>
              <div className="status-details">
                <p>
                  <strong>Obiettivo:</strong> {status.objective}
                </p>
                <p>
                  <strong>Categoria:</strong> {status.category}
                </p>
                {status.subcategory && (
                  <p>
                    <strong>Sottocategoria:</strong> {status.subcategory}
                  </p>
                )}
                <p>
                  <strong>Ore nel pool:</strong>{" "}
                  {status.hours_in_pool?.toFixed(1) || 0}h
                </p>
                <p>
                  <strong>Escalation:</strong> {status.escalation_count || 0}
                </p>
                {status.estimated_next_escalation_hours &&
                  status.estimated_next_escalation_hours > 0 && (
                    <p>
                      <strong>Prossima escalation:</strong>{" "}
                      {status.estimated_next_escalation_hours.toFixed(1)}h
                    </p>
                  )}
              </div>
            </div>
          ) : (
            <div className="status-card not-in-pool">
              <span className="status-badge not-in-pool">🚶‍♂️ Non nel Pool</span>
              <p>Non sei attualmente in ricerca di matching</p>
            </div>
          )
        ) : (
          <div className="status-card error">
            <span className="status-badge error">❌ Errore</span>
            <p>Impossibile recuperare lo status</p>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="controls-section">
        <h4>Controlli Test</h4>

        {/* Input fields */}
        <div className="input-group">
          <label>Categoria:</label>
          <select
            value={selectedCategory?.id || ""}
            onChange={(e) => handleCategoryChange(parseInt(e.target.value))}
            disabled={status?.in_pool || categoriesLoading}
          >
            {categoriesLoading ? (
              <option value="">Caricamento categorie...</option>
            ) : (
              categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.emoji} {category.name_it}
                </option>
              ))
            )}
          </select>
        </div>

        <div className="input-group">
          <label>Sottocategoria:</label>
          <select
            value={selectedSubcategory?.id || ""}
            onChange={(e) => handleSubcategoryChange(e.target.value)}
            disabled={
              status?.in_pool || !selectedCategory || subcategoriesLoading
            }
          >
            {subcategoriesLoading ? (
              <option value="">Caricamento sottocategorie...</option>
            ) : subcategories.length === 0 ? (
              <option value="">
                {selectedCategory
                  ? "Nessuna sottocategoria disponibile"
                  : "Seleziona prima una categoria"}
              </option>
            ) : (
              subcategories.map((subcategory) => (
                <option key={subcategory.id} value={subcategory.id}>
                  {subcategory.emoji} {subcategory.name_it}
                </option>
              ))
            )}
          </select>
        </div>

        <div className="input-group">
          <label>Obiettivo Test:</label>
          <input
            type="text"
            value={testObjective}
            onChange={(e) => setTestObjective(e.target.value)}
            disabled={status?.in_pool}
            placeholder="Descrivi il tuo obiettivo specifico..."
          />
        </div>

        {/* Action buttons */}
        <div className="action-buttons">
          {status?.in_pool ? (
            <>
              <button
                className="btn btn-danger"
                onClick={handleExitPool}
                disabled={loading}
              >
                🚪 Esci dal Pool
              </button>
              <button
                className="btn btn-secondary"
                onClick={refreshStatus}
                disabled={loading}
              >
                🔄 Aggiorna Status
              </button>
            </>
          ) : (
            <button
              className="btn btn-primary"
              onClick={handleEnterPool}
              disabled={
                loading ||
                !testObjective.trim() ||
                !selectedCategory ||
                !selectedSubcategory
              }
            >
              🏊‍♂️ Entra nel Pool
            </button>
          )}
        </div>
      </div>

      {/* Info section */}
      <div className="info-section">
        <h4>ℹ️ Sistema Progressivo</h4>
        <div className="levels-info">
          <div className="level-item">
            <span className="level-icon">🎯</span>
            <div>
              <strong>Perfect (0-24h):</strong> Matching perfetto con preferenze
              esatte
            </div>
          </div>
          <div className="level-item">
            <span className="level-icon">✅</span>
            <div>
              <strong>Good (24-48h):</strong> Matching buono con flessibilità
              moderata
            </div>
          </div>
          <div className="level-item">
            <span className="level-icon">⚡</span>
            <div>
              <strong>Acceptable (48-72h):</strong> Matching accettabile con
              maggiore flessibilità
            </div>
          </div>
          <div className="level-item">
            <span className="level-icon">🚨</span>
            <div>
              <strong>Fallback (72h+):</strong> Sistema fallback, opzioni di
              scelta
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
