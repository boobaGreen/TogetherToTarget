import React, { useState, useEffect } from "react";
import type {
  ExperienceLevelProps,
  ExperienceLevelData,
  ExperienceOption,
  ExperienceLevel,
} from "../../types/experience";
import "./ExperienceLevel.css";

const ExperienceLevelSelector: React.FC<ExperienceLevelProps> = ({
  selectedCategory,
  goalDescription,
  initialData,
  onExperienceChange,
  onValidation,
}) => {
  // Frasi motivazionali preconfezionate
  const getPresetMotivations = (): string[] => {
    return [
      "Voglio migliorare me stesso e crescere insieme ad altri",
      "Ho bisogno di motivazione e supporto per rimanere costante",
      "Credo che insieme si raggiungano meglio gli obiettivi",
      "Voglio condividere il mio percorso con persone simili",
      "Mi piace l'idea di motivare ed essere motivato",
      "Ho già provato da solo, ora voglio il supporto di un gruppo",
      "Penso che la responsabilità verso altri mi aiuti a non mollare",
      "Sono curioso di vedere come altri affrontano sfide simili",
    ];
  };

  const [selectedLevel, setSelectedLevel] = useState<ExperienceLevel | null>(
    initialData?.level || "beginner" // Default a Principiante per ridurre friction
  );
  const [motivation, setMotivation] = useState(initialData?.motivation || "");

  // Opzioni di esperienza dinamiche basate sulla categoria
  const getExperienceOptions = (): ExperienceOption[] => {
    const categoryName = selectedCategory.name_en.toLowerCase();

    if (categoryName.includes("fitness") || categoryName.includes("health")) {
      return [
        {
          level: "beginner",
          title: "Principiante",
          description: "Sto iniziando il mio percorso fitness",
          icon: "🌱",
          examples: [
            "Non ho mai fatto sport regolarmente",
            "Voglio creare una routine di base",
            "Ho bisogno di motivazione per iniziare",
          ],
        },
        {
          level: "intermediate",
          title: "Intermedio",
          description: "Ho già esperienza ma voglio migliorare",
          icon: "💪",
          examples: [
            "Faccio sport 2-3 volte a settimana",
            "Conosco gli esercizi base",
            "Voglio raggiungere obiettivi specifici",
          ],
        },
        {
          level: "advanced",
          title: "Avanzato",
          description: "Sono esperto e voglio sfide maggiori",
          icon: "🏆",
          examples: [
            "Mi alleno regolarmente da anni",
            "Ho obiettivi ambiziosi e specifici",
            "Posso aiutare altri nel gruppo",
          ],
        },
      ];
    } else if (
      categoryName.includes("learn") ||
      categoryName.includes("study")
    ) {
      return [
        {
          level: "beginner",
          title: "Principiante",
          description: "Sto iniziando a imparare qualcosa di nuovo",
          icon: "📚",
          examples: [
            "Non ho esperienza in questo campo",
            "Voglio imparare le basi",
            "Ho bisogno di struttura e supporto",
          ],
        },
        {
          level: "intermediate",
          title: "Intermedio",
          description: "Ho conoscenze di base e voglio approfondire",
          icon: "🎓",
          examples: [
            "Conosco i concetti fondamentali",
            "Studio autonomamente ma irregolarmente",
            "Voglio essere più costante",
          ],
        },
        {
          level: "advanced",
          title: "Avanzato",
          description: "Sono esperto e voglio specializzarmi",
          icon: "🧠",
          examples: [
            "Ho anni di esperienza nel settore",
            "Voglio raggiungere livelli molto alti",
            "Posso condividere la mia esperienza",
          ],
        },
      ];
    } else if (
      categoryName.includes("career") ||
      categoryName.includes("work")
    ) {
      return [
        {
          level: "beginner",
          title: "Principiante",
          description: "Sto entrando nel mondo del lavoro",
          icon: "🚀",
          examples: [
            "Sono all'inizio della carriera",
            "Cerco il mio primo lavoro",
            "Ho bisogno di orientamento",
          ],
        },
        {
          level: "intermediate",
          title: "Intermedio",
          description: "Ho esperienza e voglio crescere",
          icon: "📈",
          examples: [
            "Lavoro da alcuni anni",
            "Voglio cambiare ruolo o azienda",
            "Cerco crescita professionale",
          ],
        },
        {
          level: "advanced",
          title: "Avanzato",
          description: "Sono senior e punta a ruoli dirigenziali",
          icon: "💼",
          examples: [
            "Ho molta esperienza nel settore",
            "Punta a posizioni di leadership",
            "Voglio fare il salto di carriera",
          ],
        },
      ];
    }

    // Default per altre categorie
    return [
      {
        level: "beginner",
        title: "Principiante",
        description: "Sto iniziando questo percorso",
        icon: "🌟",
        examples: [
          "Non ho esperienza specifica",
          "Voglio imparare le basi",
          "Ho bisogno di supporto e motivazione",
        ],
      },
      {
        level: "intermediate",
        title: "Intermedio",
        description: "Ho esperienza di base",
        icon: "⚡",
        examples: [
          "Ho già provato in passato",
          "Conosco alcuni aspetti fondamentali",
          "Voglio essere più costante",
        ],
      },
      {
        level: "advanced",
        title: "Avanzato",
        description: "Sono esperto nel settore",
        icon: "🎯",
        examples: [
          "Ho molta esperienza",
          "Voglio raggiungere obiettivi ambiziosi",
          "Posso aiutare altri nel gruppo",
        ],
      },
    ];
  };

  const experienceOptions = getExperienceOptions();

  // Validazione in tempo reale - SOLO livello richiesto, motivazione opzionale
  useEffect(() => {
    const isValid = selectedLevel !== null;
    onValidation(isValid);

    if (selectedLevel) {
      const experienceData: ExperienceLevelData = {
        level: selectedLevel,
        motivation: motivation.trim() || undefined, // Opzionale
      };
      onExperienceChange(experienceData);
    }
  }, [selectedLevel, motivation, onExperienceChange, onValidation]);

  const handleLevelSelect = (level: ExperienceLevel) => {
    setSelectedLevel(level);
  };

  return (
    <div className="experience-level">
      <div className="experience-header">
        <div className="context-info">
          <div className="selected-category-badge">
            <span className="category-emoji">{selectedCategory.emoji}</span>
            <span className="category-name">{selectedCategory.name_it}</span>
          </div>
          <div className="goal-preview">
            📝 <strong>Obiettivo:</strong> {goalDescription.substring(0, 80)}
            {goalDescription.length > 80 && "..."}
          </div>
        </div>

        <h2>⚡ Qual è il tuo livello di esperienza?</h2>
        <p>
          Questo ci aiuterà a formare gruppi equilibrati e a personalizzare
          l'esperienza. <strong>Principiante</strong> è già selezionato come
          suggerimento.
        </p>
      </div>

      <div className="experience-options">
        {experienceOptions.map((option) => (
          <div
            key={option.level}
            className={`experience-card ${
              selectedLevel === option.level ? "selected" : ""
            }`}
            onClick={() => handleLevelSelect(option.level)}
            style={
              {
                "--category-color": selectedCategory.color,
                "--category-color-light": selectedCategory.color + "15",
                "--category-color-dark": selectedCategory.color + "cc",
              } as React.CSSProperties
            }
          >
            <div className="experience-icon">{option.icon}</div>
            <div className="experience-content">
              <h3 className="experience-title">{option.title}</h3>
              <p className="experience-description">{option.description}</p>
              <ul className="experience-examples">
                {option.examples.map((example, index) => (
                  <li key={index}>{example}</li>
                ))}
              </ul>
            </div>
            <div className="experience-selector">
              {selectedLevel === option.level && (
                <div className="selected-indicator">✓</div>
              )}
            </div>
          </div>
        ))}
      </div>

      {selectedLevel && (
        <div className="motivation-section">
          <h3 className="motivation-title">
            💭 Perché vuoi raggiungere questo obiettivo? (Opzionale)
          </h3>
          <p className="motivation-description">
            Seleziona una motivazione o scrivine una personalizzata. Questo
            aiuta il gruppo a conoscerti meglio!
          </p>

          {/* Frasi preconfezionate */}
          <div className="preset-motivations">
            <h4
              style={{
                fontSize: "1rem",
                marginBottom: "10px",
                color: "#4a5568",
              }}
            >
              💫 Scegli una motivazione rapida:
            </h4>
            <div className="preset-grid">
              {getPresetMotivations().map((preset, index) => (
                <button
                  key={index}
                  type="button"
                  className={`preset-motivation-btn ${
                    motivation === preset ? "selected" : ""
                  }`}
                  onClick={() => setMotivation(preset)}
                  style={{
                    background:
                      motivation === preset
                        ? selectedCategory.color + "15"
                        : "#f8fafc",
                    border:
                      motivation === preset
                        ? `2px solid ${selectedCategory.color}`
                        : "1px solid #e2e8f0",
                    borderRadius: "8px",
                    padding: "12px",
                    textAlign: "left",
                    cursor: "pointer",
                    fontSize: "0.9rem",
                    lineHeight: "1.4",
                    transition: "all 0.2s ease",
                    marginBottom: "8px",
                  }}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          {/* Campo personalizzato */}
          <div style={{ marginTop: "20px" }}>
            <h4
              style={{
                fontSize: "1rem",
                marginBottom: "10px",
                color: "#4a5568",
              }}
            >
              ✍️ Oppure scrivi la tua motivazione:
            </h4>
            <textarea
              className="motivation-textarea"
              placeholder="Scrivi qui la tua motivazione personale..."
              value={motivation}
              onChange={(e) => setMotivation(e.target.value)}
              rows={3}
              maxLength={300}
              style={{
                width: "100%",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                padding: "12px",
                fontSize: "0.95rem",
                lineHeight: "1.5",
                resize: "vertical",
              }}
            />

            <div
              className="motivation-counter"
              style={{ marginTop: "5px", textAlign: "right" }}
            >
              <span style={{ color: "#94a3b8", fontSize: "0.85rem" }}>
                {motivation.length}/300 caratteri
              </span>
            </div>
          </div>

          {/* Opzione per saltare */}
          {!motivation && (
            <div style={{ marginTop: "15px", textAlign: "center" }}>
              <button
                type="button"
                onClick={() => setMotivation("")}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#94a3b8",
                  fontSize: "0.9rem",
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
              >
                🏃 Salta questo passo (puoi aggiungerlo dopo)
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ExperienceLevelSelector;
