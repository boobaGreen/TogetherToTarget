import React, { useState, useEffect } from "react";
import { MatchingService } from "../../services/matching";
import { SUPPORTED_LANGUAGES } from "../../types/matching";
import type { UserMatchingPreferences } from "../../types/matching";
import { useAuth } from "../../hooks/useAuth";
import { Spinner } from "../common/Spinner";
import "./MatchingPreferences.css";

interface MatchingPreferencesProps {
  onPreferencesUpdate?: (preferences: UserMatchingPreferences) => void;
}

export const MatchingPreferences: React.FC<MatchingPreferencesProps> = ({
  onPreferencesUpdate,
}) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Stati per le preferenze
  const [availableForDuos, setAvailableForDuos] = useState(false); // Nuova logica semplificata
  const [videocallLanguages, setVideocallLanguages] = useState<string[]>([
    "it",
  ]);
  const [flexibleOnLanguage, setFlexibleOnLanguage] = useState(true);
  const [timezone, setTimezone] = useState("Europe/Rome");

  // Carica preferenze esistenti
  useEffect(() => {
    const loadPreferences = async () => {
      if (!user?.id) return;

      try {
        const preferences = await MatchingService.getUserPreferences(user.id);
        if (preferences) {
          // Converte preferred_group_size in availableForDuos
          setAvailableForDuos(
            preferences.preferred_group_size === 2 ||
              preferences.preferred_group_size === 0
          );
          setVideocallLanguages(preferences.videocall_languages);
          setFlexibleOnLanguage(preferences.flexible_on_language);
          setTimezone(preferences.timezone);
        }
      } catch (error) {
        console.error("Errore nel caricamento preferenze:", error);
      } finally {
        setLoading(false);
      }
    };

    // Rileva timezone automaticamente
    const detectedTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    setTimezone(detectedTimezone);

    loadPreferences();
  }, [user]);

  // Salva preferenze
  const handleSave = async () => {
    if (!user?.id) return;

    setSaving(true);
    try {
      // Converte availableForDuos in preferred_group_size
      const groupSize = availableForDuos ? 0 : 3; // 0 = qualsiasi (inclusi duetti), 3 = solo trio

      const savedPreferences = await MatchingService.upsertUserPreferences(
        user.id,
        {
          preferred_group_size: groupSize,
          flexible_on_size: true, // Sempre flessibile
          videocall_languages: videocallLanguages,
          flexible_on_language: flexibleOnLanguage,
          timezone,
          timezone_flexibility: true, // Sempre true, l'escalation è automatica
        }
      );

      // Notifica il componente padre se necessario
      if (onPreferencesUpdate && savedPreferences) {
        onPreferencesUpdate(savedPreferences);
      }

      // Feedback visivo di successo
      alert("Preferenze salvate con successo!");
    } catch (error) {
      console.error("Errore nel salvataggio preferenze:", error);
      alert("Errore nel salvataggio delle preferenze");
    } finally {
      setSaving(false);
    }
  };

  // Toggle lingua
  const toggleLanguage = (langCode: string) => {
    setVideocallLanguages((prev) => {
      if (prev.includes(langCode)) {
        // Non permettere di rimuovere tutte le lingue
        if (prev.length === 1) return prev;
        return prev.filter((code) => code !== langCode);
      } else {
        return [...prev, langCode];
      }
    });
  };

  if (loading) {
    return (
      <div className="matching-preferences loading">
        <Spinner size="medium" message="Caricamento preferenze..." />
      </div>
    );
  }

  return (
    <div className="matching-preferences">
      {/* Header */}
      <div className="preferences-header">
        <h3>🎯 Preferenze Matching</h3>
        <p>
          Configura le tue preferenze per trovare compagni di obiettivi
          compatibili
        </p>
      </div>

      {/* Disponibilità gruppi da 2 - SEMPLIFICATO */}
      <div className="preference-section">
        <label className="section-title">Disponibilità gruppi:</label>

        <div className="duo-availability">
          <div
            className={`duo-toggle ${availableForDuos ? "active" : ""}`}
            onClick={() => setAvailableForDuos(!availableForDuos)}
          >
            <div className="toggle-icon">
              {availableForDuos ? "👤👤" : "👤👤👤"}
            </div>
            <div className="toggle-content">
              <h4>
                {availableForDuos
                  ? "Disponibile per duetti"
                  : "Solo gruppi da 3"}
              </h4>
              <p>
                {availableForDuos
                  ? "Accetti sia gruppi da 2 che da 3 persone"
                  : "Preferisci solo gruppi da 3 persone"}
              </p>
            </div>
            <div className="toggle-switch">
              <div className={`switch ${availableForDuos ? "on" : "off"}`}>
                <div className="switch-handle"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lingue videocall */}
      <div className="preference-section">
        <label className="section-title">Lingue per videocall:</label>

        <div className="language-grid">
          {SUPPORTED_LANGUAGES.map((lang) => (
            <div
              key={lang.code}
              className={`language-option ${
                videocallLanguages.includes(lang.code) ? "selected" : ""
              }`}
              onClick={() => toggleLanguage(lang.code)}
            >
              <span className="language-flag">{lang.flag}</span>
              <span className="language-name">{lang.name}</span>
            </div>
          ))}
        </div>

        <div className="flexibility-option">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={flexibleOnLanguage}
              onChange={(e) => setFlexibleOnLanguage(e.target.checked)}
            />
            <span className="checkmark"></span>
            Accetto gruppi multilingua se non trovo match
          </label>
          <div className="help-text">
            Chat tradotta automaticamente, videocall internazionali
          </div>
        </div>
      </div>

      {/* Timezone */}
      <div className="preference-section">
        <label className="section-title">Fuso orario:</label>

        <div className="timezone-info">
          <div className="timezone-display">
            <span className="timezone-icon">🌍</span>
            <span className="timezone-text">
              Il tuo fuso orario: {timezone}
            </span>
          </div>
          <div className="timezone-note">
            (Rilevato automaticamente dal tuo dispositivo)
          </div>
        </div>

        <div className="help-text" style={{ marginLeft: 0, marginTop: 16 }}>
          💡 <strong>Sistema matching intelligente:</strong> Il nostro algoritmo
          espande automaticamente la ricerca a fusi orari compatibili se non
          trova match nelle prime 72 ore.
        </div>
      </div>

      {/* Pulsante Salva */}
      <div className="preferences-actions">
        <button
          className="btn-save"
          onClick={handleSave}
          disabled={saving || videocallLanguages.length === 0}
        >
          {saving ? (
            <>
              <Spinner size="small" color="white" />
              Salvando...
            </>
          ) : (
            <>
              <span className="save-icon">💾</span>
              Salva Preferenze
            </>
          )}
        </button>
      </div>

      {/* Info box */}
      <div className="preferences-info">
        <div className="info-box">
          <h4>Come funziona il matching progressivo:</h4>
          <ul>
            <li>
              <strong>0-24h:</strong> Ricerca match con criteri identici
            </li>
            <li>
              <strong>24-48h:</strong> Estende la ricerca con criteri più
              flessibili
            </li>
            <li>
              <strong>48-72h:</strong> Include categorie correlate e lingue
              alternative
            </li>
            <li>
              <strong>72h+:</strong> Ti proponiamo il miglior match disponibile
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
