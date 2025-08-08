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
  onValidation,
}) => {
  const [description, setDescription] = useState(
    initialData?.description || ""
  );
  const [deadline, setDeadline] = useState<string>(
    initialData?.deadline
      ? initialData.deadline.toISOString().split("T")[0]
      : ""
  );
  const [showSuggestions, setShowSuggestions] = useState(true);

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

  // Validazione in tempo reale
  useEffect(() => {
    const isValid =
      description.trim().length >= 10 && description.trim().length <= 500;
    onValidation(isValid);

    const goalData: GoalInputData = {
      description: description.trim(),
      deadline: deadline ? new Date(deadline) : undefined,
    };
    onGoalChange(goalData);
  }, [description, deadline, onGoalChange, onValidation]);

  const handleSuggestionClick = (suggestionText: string) => {
    setDescription(suggestionText);
    setShowSuggestions(false);
  };

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  };

  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 90); // Max 90 giorni
    return maxDate.toISOString().split("T")[0];
  };

  return (
    <div className="goal-input">
      <div className="goal-input-header">
        <div className="selected-category-badge">
          <span className="category-emoji">{selectedCategory.emoji}</span>
          <span className="category-name">{selectedCategory.name_it}</span>
        </div>
        <h2>🎯 Descrivi il tuo obiettivo</h2>
        <p>
          Sii specifico! Un obiettivo chiaro è più facile da raggiungere insieme
          al tuo gruppo.
        </p>
      </div>

      <div className="goal-form">
        <div className="form-group">
          <label htmlFor="goal-description" className="form-label">
            📝 Cosa vuoi raggiungere?
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
            placeholder="Esempio: Correre 5km senza fermarsi entro 30 giorni..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            maxLength={500}
          />
          <div className="char-counter">
            <span
              className={
                description.length < 10
                  ? "error"
                  : description.length > 450
                  ? "warning"
                  : "success"
              }
            >
              {description.length}/500 caratteri
            </span>
            {description.length < 10 && (
              <span className="validation-hint">
                Almeno 10 caratteri richiesti
              </span>
            )}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="goal-deadline" className="form-label">
            📅 Deadline (opzionale)
          </label>
          <input
            id="goal-deadline"
            type="date"
            className="goal-date-input"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            min={getMinDate()}
            max={getMaxDate()}
          />
          <div className="date-hint">
            Consigliamo un obiettivo di 21-30 giorni per risultati ottimali
          </div>
        </div>
      </div>

      {showSuggestions && description.length < 10 && (
        <div className="suggestions-section">
          <h3 className="suggestions-title">
            💡 Idee per la categoria "{selectedCategory.name_it}"
          </h3>
          <div className="suggestions-grid">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="suggestion-card"
                onClick={() => handleSuggestionClick(suggestion.text)}
                style={
                  {
                    "--category-color": selectedCategory.color,
                    "--category-color-light": selectedCategory.color + "15",
                  } as React.CSSProperties
                }
              >
                <div className="suggestion-text">{suggestion.text}</div>
                <div className="suggestion-timeframe">
                  ⏱️ {suggestion.timeframe}
                </div>
              </div>
            ))}
          </div>
          <button
            type="button"
            className="hide-suggestions-btn"
            onClick={() => setShowSuggestions(false)}
          >
            Nascondi suggerimenti
          </button>
        </div>
      )}

      {!showSuggestions && description.length < 10 && (
        <button
          type="button"
          className="show-suggestions-btn"
          onClick={() => setShowSuggestions(true)}
        >
          💡 Mostra suggerimenti
        </button>
      )}

      {description.length >= 10 && (
        <div className="goal-preview">
          <h4>📋 Anteprima del tuo obiettivo:</h4>
          <div className="preview-content">
            <div className="preview-goal">
              <strong>Obiettivo:</strong> {description}
            </div>
            {deadline && (
              <div className="preview-deadline">
                <strong>Deadline:</strong>{" "}
                {new Date(deadline).toLocaleDateString("it-IT", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default GoalInput;
