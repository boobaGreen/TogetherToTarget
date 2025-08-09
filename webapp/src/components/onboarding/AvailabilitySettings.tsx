import React, { useState, useEffect } from "react";
import type {
  AvailabilitySettingsProps,
  AvailabilityData,
  TimeSlot,
  DayOption,
  AvailabilityHours,
  MeetingFrequency,
} from "../../types/availability";
import "./AvailabilitySettings.css";

const AvailabilitySettings: React.FC<AvailabilitySettingsProps> = ({
  selectedCategory,
  goalDescription,
  experienceLevel,
  initialData,
  onAvailabilityChange,
  onValidation,
}) => {
  const [availabilityHours, setAvailabilityHours] = useState<AvailabilityHours>(
    initialData?.availabilityHours || "flexible"
  );
  const [preferredDays, setPreferredDays] = useState<number[]>(
    initialData?.preferredDays || []
  );
  const [meetingFrequency] = useState<MeetingFrequency>("weekly"); // Fisso a settimanale per tutti
  const [timezone] = useState(initialData?.timezone || "Europe/Rome");
  const [notes, setNotes] = useState(initialData?.notes || "");

  // Opzioni di orario
  const timeSlots: TimeSlot[] = [
    {
      id: "morning",
      label: "Mattina",
      description: "Preferisco la mattina per essere più fresco ed energico",
      icon: "🌅",
      timeRange: "06:00 - 12:00",
    },
    {
      id: "afternoon",
      label: "Pomeriggio",
      description: "Il pomeriggio è il momento migliore per me",
      icon: "☀️",
      timeRange: "12:00 - 18:00",
    },
    {
      id: "evening",
      label: "Sera",
      description: "Preferisco la sera dopo il lavoro",
      icon: "🌙",
      timeRange: "18:00 - 22:00",
    },
    {
      id: "flexible",
      label: "Flessibile",
      description: "Posso adattarmi agli orari del gruppo",
      icon: "🕐",
      timeRange: "Qualsiasi orario",
    },
  ];

  // Giorni della settimana
  const dayOptions: DayOption[] = [
    { id: 1, short: "Lun", long: "Lunedì" },
    { id: 2, short: "Mar", long: "Martedì" },
    { id: 3, short: "Mer", long: "Mercoledì" },
    { id: 4, short: "Gio", long: "Giovedì" },
    { id: 5, short: "Ven", long: "Venerdì" },
    { id: 6, short: "Sab", long: "Sabato" },
    { id: 0, short: "Dom", long: "Domenica" },
  ];

  // Validazione e aggiornamento dati
  useEffect(() => {
    // Almeno deve selezionare orario e almeno 2 giorni (o essere flessibile con gli orari)
    const isValid =
      availabilityHours &&
      (availabilityHours === "flexible" || preferredDays.length >= 2);

    onValidation(isValid);

    const availabilityData: AvailabilityData = {
      availabilityHours,
      preferredDays,
      meetingFrequency,
      timezone,
      notes: notes.trim(),
    };
    onAvailabilityChange(availabilityData);
  }, [
    availabilityHours,
    preferredDays,
    meetingFrequency,
    timezone,
    notes,
    onAvailabilityChange,
    onValidation,
  ]);

  const handleTimeSlotSelect = (timeSlot: AvailabilityHours) => {
    setAvailabilityHours(timeSlot);
  };

  const handleDayToggle = (dayId: number) => {
    setPreferredDays((prev) => {
      if (prev.includes(dayId)) {
        return prev.filter((id) => id !== dayId);
      } else {
        return [...prev, dayId].sort();
      }
    });
  };

  const getSelectedDaysText = () => {
    if (preferredDays.length === 0) return "Nessun giorno selezionato";
    if (preferredDays.length === 7) return "Tutti i giorni";

    const selectedDayNames = preferredDays
      .map((id) => dayOptions.find((day) => day.id === id)?.short)
      .filter(Boolean);

    return selectedDayNames.join(", ");
  };

  return (
    <div className="availability-settings">
      <div className="availability-header">
        <div className="context-summary">
          <div className="summary-item">
            <span className="emoji">{selectedCategory.emoji}</span>
            <span className="text">{selectedCategory.name_it}</span>
          </div>
          <div className="summary-item">
            <span className="emoji">🎯</span>
            <span className="text">{goalDescription.substring(0, 40)}...</span>
          </div>
          <div className="summary-item">
            <span className="emoji">⚡</span>
            <span className="text">Livello {experienceLevel}</span>
          </div>
        </div>

        <h2>📅 Quando sei disponibile?</h2>
        <p>
          Configuriamo i tuoi orari per trovare il gruppo perfetto e organizzare
          gli incontri.{" "}
          <strong>Tutti i gruppi si incontrano 1 volta a settimana</strong> per
          4 settimane.
        </p>
      </div>

      {/* Selezione orario preferito */}
      <div className="settings-section">
        <h3 className="section-title">⏰ Orario preferito</h3>
        <div className="time-slots">
          {timeSlots.map((slot) => (
            <div
              key={slot.id}
              className={`time-slot ${
                availabilityHours === slot.id ? "selected" : ""
              }`}
              onClick={() => handleTimeSlotSelect(slot.id)}
              style={
                {
                  "--category-color": selectedCategory.color,
                  "--category-color-light": selectedCategory.color + "15",
                } as React.CSSProperties
              }
            >
              <div className="slot-icon">{slot.icon}</div>
              <div className="slot-content">
                <h4 className="slot-label">{slot.label}</h4>
                <p className="slot-description">{slot.description}</p>
                <span className="slot-time">{slot.timeRange}</span>
              </div>
              {availabilityHours === slot.id && (
                <div className="slot-selected">✓</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Selezione giorni (se non flessibile) */}
      {availabilityHours !== "flexible" && (
        <div className="settings-section">
          <h3 className="section-title">🗓️ Giorni disponibili</h3>
          <p className="section-description">
            Seleziona almeno 2 giorni della settimana in cui potresti
            partecipare agli incontri.
          </p>
          <div className="days-selector">
            {dayOptions.map((day) => (
              <button
                key={day.id}
                className={`day-button ${
                  preferredDays.includes(day.id) ? "selected" : ""
                }`}
                onClick={() => handleDayToggle(day.id)}
                style={
                  {
                    "--category-color": selectedCategory.color,
                  } as React.CSSProperties
                }
              >
                <span className="day-short">{day.short}</span>
                <span className="day-long">{day.long}</span>
              </button>
            ))}
          </div>
          <div className="days-summary">
            <strong>Giorni selezionati:</strong> {getSelectedDaysText()}
          </div>
        </div>
      )}

      {/* Note aggiuntive */}
      <div className="settings-section">
        <h3 className="section-title">💭 Note aggiuntive (opzionale)</h3>
        <textarea
          className="notes-textarea"
          placeholder="Esempio: Preferisco evitare il lunedì mattina, sono più motivato la sera, ho esperienza con app di fitness..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          maxLength={200}
        />
        <div className="notes-counter">{notes.length}/200 caratteri</div>
      </div>

      {/* Riepilogo finale */}
      <div className="final-summary">
        <h4>📋 Riepilogo delle tue preferenze:</h4>
        <div className="summary-grid">
          <div className="summary-item">
            <strong>Orario:</strong>{" "}
            {timeSlots.find((slot) => slot.id === availabilityHours)?.label}
          </div>
          <div className="summary-item">
            <strong>Giorni:</strong>{" "}
            {availabilityHours === "flexible"
              ? "Flessibile"
              : getSelectedDaysText()}
          </div>
          {notes && (
            <div className="summary-item">
              <strong>Note:</strong> {notes}
            </div>
          )}
        </div>

        {/* Messaggio informativo semplificato */}
        <div
          style={{
            background: "#f0f9ff",
            border: "1px solid #bae6fd",
            borderRadius: "8px",
            padding: "12px",
            marginTop: "16px",
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
            ⚡ <strong>Tutti i gruppi si incontrano 1 volta a settimana</strong>{" "}
            per 4 settimane totali.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AvailabilitySettings;
