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
  const [selectedLevel, setSelectedLevel] = useState<ExperienceLevel | null>(
    initialData?.level || null
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

  // Validazione in tempo reale
  useEffect(() => {
    const isValid = selectedLevel !== null && motivation.trim().length >= 20;
    onValidation(isValid);

    if (selectedLevel) {
      const experienceData: ExperienceLevelData = {
        level: selectedLevel,
        motivation: motivation.trim(),
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
          l'esperienza.
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
          <h3 className="motivation-title">💭 Raccontaci la tua motivazione</h3>
          <p className="motivation-description">
            Perché vuoi raggiungere questo obiettivo? Cosa ti spinge a iniziare
            questo percorso?
          </p>

          <textarea
            className={`motivation-textarea ${
              motivation.length < 20 ? "invalid" : "valid"
            }`}
            placeholder="Esempio: Voglio migliorare la mia forma fisica perché mi sento più energico quando sono attivo. Ho provato tante volte da solo ma mi manca la costanza..."
            value={motivation}
            onChange={(e) => setMotivation(e.target.value)}
            rows={4}
            maxLength={300}
          />

          <div className="motivation-counter">
            <span
              className={
                motivation.length < 20
                  ? "error"
                  : motivation.length > 250
                  ? "warning"
                  : "success"
              }
            >
              {motivation.length}/300 caratteri
            </span>
            {motivation.length < 20 && (
              <span className="validation-hint">
                Almeno 20 caratteri richiesti
              </span>
            )}
          </div>
        </div>
      )}

      {selectedLevel && motivation.length >= 20 && (
        <div className="experience-summary">
          <h4>📋 Riepilogo del tuo profilo:</h4>
          <div className="summary-content">
            <div className="summary-item">
              <strong>Livello:</strong>{" "}
              {
                experienceOptions.find((opt) => opt.level === selectedLevel)
                  ?.title
              }
            </div>
            <div className="summary-item">
              <strong>Motivazione:</strong> {motivation}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExperienceLevelSelector;
