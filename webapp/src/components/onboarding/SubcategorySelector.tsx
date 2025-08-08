import React, { useState } from "react";
import type { SubcategorySelectorProps } from "../../types/categories";
import "./SubcategorySelector.css";

const SubcategorySelector: React.FC<SubcategorySelectorProps> = ({
  selectedCategory,
  subcategories,
  selectedSubcategoryId,
  onSubcategorySelect,
  loading = false,
}) => {
  const [filterDifficulty, setFilterDifficulty] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Filtra subcategorie per difficoltà e ricerca
  const filteredSubcategories = subcategories.filter((sub) => {
    const matchesDifficulty =
      filterDifficulty === null || sub.difficulty_level === filterDifficulty;
    const matchesSearch =
      searchTerm === "" ||
      sub.name_it.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.description_it.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesDifficulty && matchesSearch;
  });

  const getDifficultyLabel = (level: number): string => {
    const labels = {
      1: "🟢 Facile",
      2: "🟡 Medio-Facile",
      3: "🟠 Medio",
      4: "🔴 Impegnativo",
      5: "⚫ Difficile",
    };
    return labels[level as keyof typeof labels] || `Livello ${level}`;
  };

  const getDifficultyColor = (level: number): string => {
    const colors = {
      1: "#10b981", // Verde
      2: "#f59e0b", // Giallo
      3: "#f97316", // Arancione
      4: "#ef4444", // Rosso
      5: "#6b7280", // Grigio scuro
    };
    return colors[level as keyof typeof colors] || "#6b7280";
  };

  if (loading) {
    return (
      <div className="subcategory-selector-loading">
        <div className="loading-spinner"></div>
        <p>Caricamento subcategorie...</p>
      </div>
    );
  }

  return (
    <div className="subcategory-selector">
      <div className="subcategory-selector-header">
        <div className="category-context">
          <span className="category-emoji" style={{ fontSize: "2rem" }}>
            {selectedCategory.emoji}
          </span>
          <div>
            <h2>🎯 Scegli il tuo obiettivo specifico</h2>
            <p
              className="category-badge"
              style={{ color: selectedCategory.color }}
            >
              {selectedCategory.name_it}
            </p>
            <p className="subcategory-intro">
              Seleziona l'obiettivo specifico che vuoi raggiungere nei prossimi
              30 giorni
            </p>
          </div>
        </div>

        {/* Filtri e ricerca */}
        <div className="subcategory-filters">
          <div className="filter-search">
            <input
              type="text"
              placeholder="🔍 Cerca obiettivo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filter-difficulty">
            <label>Difficoltà:</label>
            <select
              value={filterDifficulty || ""}
              onChange={(e) =>
                setFilterDifficulty(
                  e.target.value ? parseInt(e.target.value) : null
                )
              }
              className="difficulty-select"
            >
              <option value="">Tutte</option>
              <option value="1">🟢 Facile</option>
              <option value="2">🟡 Medio-Facile</option>
              <option value="3">🟠 Medio</option>
              <option value="4">🔴 Impegnativo</option>
              <option value="5">⚫ Difficile</option>
            </select>
          </div>
        </div>
      </div>

      <div className="subcategories-stats">
        <span className="stats-item">
          📊 {filteredSubcategories.length} obiettivi disponibili
        </span>
        <span className="stats-item">⏱️ Cicli da 30 giorni</span>
        <span className="stats-item">👥 Gruppi da 3 persone</span>
      </div>

      <div className="subcategories-grid">
        {filteredSubcategories
          .sort((a, b) => a.sort_order - b.sort_order)
          .map((subcategory) => (
            <div
              key={subcategory.id}
              className={`subcategory-card ${
                selectedSubcategoryId === subcategory.id ? "selected" : ""
              }`}
              onClick={() => onSubcategorySelect(subcategory)}
              style={
                {
                  "--category-color": selectedCategory.color,
                  "--difficulty-color": getDifficultyColor(
                    subcategory.difficulty_level
                  ),
                } as React.CSSProperties
              }
            >
              <div className="subcategory-header">
                <div className="subcategory-emoji">{subcategory.emoji}</div>
                <div
                  className="difficulty-badge"
                  style={{
                    backgroundColor:
                      getDifficultyColor(subcategory.difficulty_level) + "20",
                    color: getDifficultyColor(subcategory.difficulty_level),
                  }}
                >
                  {getDifficultyLabel(subcategory.difficulty_level)}
                </div>
              </div>

              <div className="subcategory-content">
                <h3 className="subcategory-name">{subcategory.name_it}</h3>
                <p className="subcategory-description">
                  {subcategory.description_it}
                </p>

                <div className="subcategory-meta">
                  <span className="meta-item">
                    ⏱️ {subcategory.estimated_duration_days} giorni
                  </span>
                  <span className="meta-item">
                    👥 {subcategory.group_size_optimal} persone
                  </span>
                </div>

                {subcategory.psychological_benefits &&
                  subcategory.psychological_benefits.length > 0 && (
                    <div className="psychological-benefits">
                      <span className="benefits-label">🧠 Benefici:</span>
                      <div className="benefits-tags">
                        {subcategory.psychological_benefits
                          .slice(0, 3)
                          .map((benefit, index) => (
                            <span key={index} className="benefit-tag">
                              {benefit}
                            </span>
                          ))}
                        {subcategory.psychological_benefits.length > 3 && (
                          <span className="benefit-tag more">
                            +{subcategory.psychological_benefits.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
              </div>

              <div className="subcategory-selector-indicator">
                {selectedSubcategoryId === subcategory.id && (
                  <div className="selected-checkmark">✓</div>
                )}
              </div>
            </div>
          ))}
      </div>

      {filteredSubcategories.length === 0 && (
        <div className="no-subcategories">
          <div className="no-results-icon">🔍</div>
          <h3>Nessun obiettivo trovato</h3>
          <p>
            {searchTerm
              ? `Nessun risultato per "${searchTerm}". Prova con termini diversi.`
              : "Non sono stati trovati obiettivi per i filtri selezionati."}
          </p>
          {(searchTerm || filterDifficulty) && (
            <button
              onClick={() => {
                setSearchTerm("");
                setFilterDifficulty(null);
              }}
              className="clear-filters-btn"
            >
              🗑️ Cancella filtri
            </button>
          )}
        </div>
      )}

      {selectedSubcategoryId && (
        <div className="selection-summary">
          <div className="summary-content">
            <span className="summary-emoji">
              {subcategories.find((s) => s.id === selectedSubcategoryId)?.emoji}
            </span>
            <div className="summary-text">
              <div className="summary-title">
                Hai scelto:{" "}
                <strong>
                  {
                    subcategories.find((s) => s.id === selectedSubcategoryId)
                      ?.name_it
                  }
                </strong>
              </div>
              <div className="summary-details">
                {getDifficultyLabel(
                  subcategories.find((s) => s.id === selectedSubcategoryId)
                    ?.difficulty_level || 1
                )}{" "}
                •
                {
                  subcategories.find((s) => s.id === selectedSubcategoryId)
                    ?.estimated_duration_days
                }{" "}
                giorni • Gruppo da{" "}
                {
                  subcategories.find((s) => s.id === selectedSubcategoryId)
                    ?.group_size_optimal
                }{" "}
                persone
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubcategorySelector;
