// Pagina di test per Daily Check-in System
import React, { useState } from "react";
import { CheckinDashboard } from "../components/checkin/CheckinDashboard";
import { DailyCheckinForm } from "../components/checkin/DailyCheckinForm";
import "./CheckinTestPage.css";

// Mock data per test
const mockCategories = [
  {
    id: 1,
    name: "Fitness",
    subcategories: ["Perdita peso", "Aumento massa", "Resistenza"],
  },
  {
    id: 2,
    name: "Apprendimento",
    subcategories: ["Lingua inglese", "Musica", "Programmazione"],
  },
  {
    id: 3,
    name: "Carriera",
    subcategories: ["Trovare lavoro", "Networking", "Competenze"],
  },
  {
    id: 4,
    name: "Relazioni",
    subcategories: ["Migliorare comunicazione", "Dating", "Famiglia"],
  },
  {
    id: 5,
    name: "Benessere",
    subcategories: ["Meditazione", "Sonno", "Alimentazione"],
  },
];

export const CheckinTestPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState(1);
  const [selectedSubcategory, setSelectedSubcategory] =
    useState("Perdita peso");
  const [viewMode, setViewMode] = useState<"dashboard" | "form">("dashboard");

  const handleCategoryChange = (categoryId: number) => {
    setSelectedCategory(categoryId);
    const category = mockCategories.find((c) => c.id === categoryId);
    if (category) {
      setSelectedSubcategory(category.subcategories[0]);
    }
  };

  const selectedCategoryObj = mockCategories.find(
    (c) => c.id === selectedCategory
  );

  return (
    <div className="checkin-test-page">
      <div className="test-header">
        <h1>🧪 Test Daily Check-in System</h1>
        <p>
          Testa il sistema di check-in quotidiani con diverse categorie e
          sottocategorie
        </p>
      </div>

      {/* Controls */}
      <div className="test-controls">
        <div className="control-group">
          <label>
            <strong>Categoria:</strong>
            <select
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(parseInt(e.target.value))}
              className="control-select"
            >
              {mockCategories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="control-group">
          <label>
            <strong>Sottocategoria:</strong>
            <select
              value={selectedSubcategory}
              onChange={(e) => setSelectedSubcategory(e.target.value)}
              className="control-select"
            >
              {selectedCategoryObj?.subcategories.map((sub) => (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="control-group">
          <label>
            <strong>Vista:</strong>
            <div className="view-toggle">
              <button
                className={`toggle-btn ${
                  viewMode === "dashboard" ? "active" : ""
                }`}
                onClick={() => setViewMode("dashboard")}
              >
                📊 Dashboard
              </button>
              <button
                className={`toggle-btn ${viewMode === "form" ? "active" : ""}`}
                onClick={() => setViewMode("form")}
              >
                📝 Form
              </button>
            </div>
          </label>
        </div>
      </div>

      {/* Current Selection Info */}
      <div className="selection-info">
        <div className="info-card">
          <h3>Configurazione Attuale</h3>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Category ID:</span>
              <span className="info-value">{selectedCategory}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Categoria:</span>
              <span className="info-value">{selectedCategoryObj?.name}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Sottocategoria:</span>
              <span className="info-value">{selectedSubcategory}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Vista:</span>
              <span className="info-value">
                {viewMode === "dashboard" ? "Dashboard" : "Form Check-in"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Component Display */}
      <div className="component-display">
        {viewMode === "dashboard" ? (
          <div className="dashboard-container">
            <h2>📊 Dashboard Check-in</h2>
            <CheckinDashboard
              categoryId={selectedCategory}
              subcategoryName={selectedSubcategory}
            />
          </div>
        ) : (
          <div className="form-container">
            <h2>📝 Form Check-in</h2>
            <DailyCheckinForm
              categoryId={selectedCategory}
              subcategoryName={selectedSubcategory}
              onSuccess={(checkin) => {
                console.log("Check-in salvato:", checkin);
                alert("✅ Check-in salvato con successo!");
                setViewMode("dashboard");
              }}
              onCancel={() => setViewMode("dashboard")}
            />
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="test-instructions">
        <h3>📋 Istruzioni per il Test</h3>
        <div className="instructions-grid">
          <div className="instruction-card">
            <h4>🎯 Come testare</h4>
            <ul>
              <li>Seleziona una categoria dal dropdown</li>
              <li>Scegli una sottocategoria specifica</li>
              <li>Passa tra Dashboard e Form per vedere i componenti</li>
              <li>Compila il form per testare il salvataggio</li>
              <li>Controlla la dashboard per vedere statistiche e streak</li>
            </ul>
          </div>

          <div className="instruction-card">
            <h4>📊 Cosa osservare</h4>
            <ul>
              <li>
                <strong>Form dinamico:</strong> Campi diversi per ogni
                sottocategoria
              </li>
              <li>
                <strong>Validazione:</strong> Campi required, min/max values
              </li>
              <li>
                <strong>Streak tracking:</strong> Contatore giorni consecutivi
              </li>
              <li>
                <strong>Statistics:</strong> Completion rate, consistency score
              </li>
              <li>
                <strong>Calendar:</strong> Visual ultimi 7 giorni
              </li>
            </ul>
          </div>

          <div className="instruction-card">
            <h4>🧪 Test cases</h4>
            <ul>
              <li>
                <strong>Fitness/Perdita peso:</strong> Peso, calorie, esercizio
              </li>
              <li>
                <strong>Musica:</strong> Minuti pratica, brano studiato
              </li>
              <li>
                <strong>Lingua inglese:</strong> Parole nuove, conversazione
              </li>
              <li>
                <strong>Meditazione:</strong> Minuti, tipo pratica, gratitudine
              </li>
              <li>
                <strong>Job hunting:</strong> Candidature, LinkedIn, networking
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Debug Info */}
      <div className="debug-info">
        <details>
          <summary>🔧 Debug Info (Developer)</summary>
          <div className="debug-content">
            <pre>
              {JSON.stringify(
                {
                  categoryId: selectedCategory,
                  subcategoryName: selectedSubcategory,
                  viewMode,
                  timestamp: new Date().toISOString(),
                  targetDate: new Date().toISOString().split("T")[0],
                },
                null,
                2
              )}
            </pre>
          </div>
        </details>
      </div>
    </div>
  );
};
