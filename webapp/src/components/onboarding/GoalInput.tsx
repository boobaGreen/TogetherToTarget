import React, { useState, useEffect } from "react";
import type {
  GoalInputProps,
  GoalInputData,
  GoalSuggestion,
} from "../../types/goal";
import "./GoalInput.css";

const GoalInput: React.FC<GoalInputProps> = ({
  selectedCategory,
  initialData,
  onGoalChange,
}) => {
  const [description, setDescription] = useState(
    initialData?.description || ""
  );

  // Suggerimenti basati sulla categoria
  const getSuggestions = (): GoalSuggestion[] => {
    const categoryName = selectedCategory.name_en.toLowerCase();

    if (categoryName.includes("fitness") || categoryName.includes("health")) {
      return [
        {
          text: "Correre 5km senza fermarsi",
          category: "fitness",
          timeframe: "30 giorni",
        },
        {
          text: "Fare 30 flessioni consecutive",
          category: "fitness",
          timeframe: "21 giorni",
        },
        {
          text: "Perdere 3kg in modo sano",
          category: "fitness",
          timeframe: "30 giorni",
        },
        {
          text: "Meditare 10 minuti al giorno",
          category: "wellness",
          timeframe: "21 giorni",
        },
      ];
    } else if (
      categoryName.includes("learn") ||
      categoryName.includes("study")
    ) {
      return [
        {
          text: "Imparare 100 parole in inglese",
          category: "learning",
          timeframe: "30 giorni",
        },
        {
          text: "Completare un corso online",
          category: "learning",
          timeframe: "30 giorni",
        },
        {
          text: "Leggere 2 libri su programmazione",
          category: "learning",
          timeframe: "30 giorni",
        },
        {
          text: "Praticare chitarra 30 min/giorno",
          category: "skill",
          timeframe: "30 giorni",
        },
      ];
    } else if (
      categoryName.includes("career") ||
      categoryName.includes("work")
    ) {
      return [
        {
          text: "Creare un portfolio online",
          category: "career",
          timeframe: "21 giorni",
        },
        {
          text: "Fare networking con 10 professionisti",
          category: "career",
          timeframe: "30 giorni",
        },
        {
          text: "Aggiornare il CV e LinkedIn",
          category: "career",
          timeframe: "7 giorni",
        },
        {
          text: "Candidarsi per 5 posizioni",
          category: "career",
          timeframe: "14 giorni",
        },
      ];
    } else if (
      categoryName.includes("creative") ||
      categoryName.includes("art")
    ) {
      return [
        {
          text: "Disegnare ogni giorno per 30 giorni",
          category: "creative",
          timeframe: "30 giorni",
        },
        {
          text: "Scrivere un racconto breve",
          category: "creative",
          timeframe: "21 giorni",
        },
        {
          text: "Creare 10 design grafici",
          category: "creative",
          timeframe: "30 giorni",
        },
        {
          text: "Imparare una nuova tecnica artistica",
          category: "creative",
          timeframe: "21 giorni",
        },
      ];
    }

    return [
      {
        text: "Definisci un obiettivo specifico e misurabile",
        category: "general",
        timeframe: "30 giorni",
      },
      {
        text: "Crea una routine quotidiana",
        category: "general",
        timeframe: "21 giorni",
      },
      {
        text: "Impara qualcosa di nuovo ogni giorno",
        category: "general",
        timeframe: "30 giorni",
      },
    ];
  };

  const suggestions = getSuggestions();

  // Validazione in tempo reale - CAMPO OPZIONALE, deadline sempre 30 giorni
  useEffect(() => {
    // Deadline automatica a 30 giorni da oggi
    const deadline30Days = new Date();
    deadline30Days.setDate(deadline30Days.getDate() + 30);

    const goalData: GoalInputData = {
      description:
        description.trim() || `Obiettivo in ${selectedCategory.name_it}`, // Default se vuoto
      deadline: deadline30Days,
    };
    onGoalChange(goalData);
  }, [description, selectedCategory.name_it, onGoalChange]);

  const handleSuggestionClick = (suggestionText: string) => {
    setDescription(suggestionText);
  };

  return (
    <div className="goal-input">
      <div className="goal-input-header">
        <div className="selected-category-badge">
          <span className="category-emoji">{selectedCategory.emoji}</span>
          <span className="category-name">{selectedCategory.name_it}</span>
        </div>
        <h2>🎯 Descrivi il tuo obiettivo (Opzionale)</h2>
        <p>
          Puoi essere specifico adesso o definire i dettagli dopo con il tuo
          gruppo!
        </p>

        {/* Messaggio rassicurante */}
        <div
          style={{
            background: "#f0f9ff",
            border: "1px solid #bae6fd",
            borderRadius: "8px",
            padding: "12px",
            marginBottom: "20px",
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: "0.9rem",
              color: "#0369a1",
              lineHeight: "1.4",
            }}
          >
            ⚡ <strong>Suggerimento:</strong> Anche solo la categoria è
            sufficiente per iniziare! Il gruppo ti aiuterà a definire obiettivi
            specifici e raggiungibili.
          </p>
        </div>
      </div>

      <div className="goal-form">
        <div className="form-group">
          <label htmlFor="goal-description" className="form-label">
            📝 Cosa vuoi raggiungere? (Opzionale)
          </label>
          <textarea
            id="goal-description"
            className={`goal-textarea ${
              description.length < 10
                ? "invalid"
                : description.length > 500
                ? "too-long"
                : "valid"
            }`}
            placeholder="Esempio: Correre 5km senza fermarsi, meditare 15 minuti ogni giorno... (puoi anche lasciare vuoto)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            maxLength={500}
            style={{
              width: "100%",
              border: "2px solid #e2e8f0",
              borderRadius: "12px",
              padding: "16px",
              fontSize: "1rem",
              lineHeight: "1.5",
              resize: "vertical",
              transition: "border-color 0.2s ease",
              fontFamily: "inherit",
            }}
          />

          {/* Frasi confezionate sempre visibili */}
          <div style={{ marginTop: "12px" }}>
            <p
              style={{
                fontSize: "0.9rem",
                color: "#6b7280",
                marginBottom: "10px",
                fontWeight: "500",
              }}
            >
              💡 Oppure scegli un obiettivo rapido:
            </p>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "8px",
                marginBottom: "12px",
              }}
            >
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleSuggestionClick(suggestion.text)}
                  style={{
                    background:
                      "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
                    border: `1.5px solid ${selectedCategory.color}40`,
                    borderRadius: "20px",
                    padding: "8px 16px",
                    fontSize: "0.85rem",
                    color: "#374151",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                    fontWeight: "500",
                    lineHeight: "1.3",
                    maxWidth: "200px",
                    textAlign: "left",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = "translateY(-1px)";
                    e.currentTarget.style.boxShadow =
                      "0 4px 8px rgba(0,0,0,0.1)";
                    e.currentTarget.style.borderColor = selectedCategory.color;
                    e.currentTarget.style.background = `${selectedCategory.color}10`;
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 2px 4px rgba(0,0,0,0.05)";
                    e.currentTarget.style.borderColor = `${selectedCategory.color}40`;
                    e.currentTarget.style.background =
                      "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)";
                  }}
                >
                  <span style={{ fontSize: "1rem" }}>✨</span>
                  <span>{suggestion.text}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="char-counter" style={{ marginTop: "8px" }}>
            <span
              style={{
                fontSize: "0.85rem",
                color: description.length > 450 ? "#f59e0b" : "#6b7280",
              }}
            >
              {description.length}/500 caratteri{" "}
              {description.length === 0 && "(opzionale)"}
            </span>
            {description.length > 450 && (
              <span
                style={{
                  marginLeft: "10px",
                  fontSize: "0.8rem",
                  color: "#f59e0b",
                  fontStyle: "italic",
                }}
              >
                Quasi al limite!
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="goal-preview">
        <h4>📋 Anteprima del tuo obiettivo:</h4>
        <div className="preview-content">
          <div className="preview-goal">
            <strong>Obiettivo:</strong>{" "}
            {description.trim() ||
              `Obiettivo generale in ${selectedCategory.name_it}`}
          </div>
          <div
            className="preview-deadline"
            style={{
              color: "#6b7280",
              fontSize: "0.9rem",
              fontStyle: "italic",
              marginTop: "8px",
            }}
          >
            <strong>Durata:</strong> 30 giorni (standard TogetherToGoal)
          </div>
          {!description.trim() && (
            <div
              style={{
                color: "#94a3b8",
                fontSize: "0.85rem",
                fontStyle: "italic",
                marginTop: "8px",
                padding: "8px",
                background: "#f8fafc",
                borderRadius: "6px",
              }}
            >
              💡 Potrai definire meglio i dettagli con il tuo gruppo di
              supporto!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GoalInput;
