// Componente per form di daily check-in dinamico
import React, { useState, useEffect } from "react";
import { dailyCheckinService } from "../../services/daily-checkins";
import type {
  CheckinTemplate,
  DailyCheckin,
} from "../../services/daily-checkins";
import "./DailyCheckinForm.css";

interface DailyCheckinFormProps {
  categoryId: number;
  subcategoryName: string;
  targetDate?: string; // Default: oggi
  onSuccess?: (checkin: DailyCheckin) => void;
  onCancel?: () => void;
}

interface FormData {
  [key: string]: string | number | boolean;
}

export const DailyCheckinForm: React.FC<DailyCheckinFormProps> = ({
  categoryId,
  subcategoryName,
  targetDate = new Date().toISOString().split("T")[0],
  onSuccess,
  onCancel,
}) => {
  const [template, setTemplate] = useState<CheckinTemplate | null>(null);
  const [formData, setFormData] = useState<FormData>({});
  const [notes, setNotes] = useState("");
  const [shareWithGroup, setShareWithGroup] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [existingCheckin, setExistingCheckin] = useState<DailyCheckin | null>(
    null
  );
  const [canEdit, setCanEdit] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      await loadTemplate();
      await checkExistingCheckin();
    };
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subcategoryName, targetDate, categoryId]);

  const loadTemplate = async () => {
    try {
      const templateData = await dailyCheckinService.getCheckinTemplate(
        subcategoryName
      );
      if (templateData) {
        setTemplate(templateData);
        // Inizializza form data con valori di default
        const initialData: FormData = {};
        Object.entries(templateData.form_schema).forEach(
          ([fieldName, fieldConfig]) => {
            if (fieldConfig.type === "boolean") {
              initialData[fieldName] = false;
            } else if (
              fieldConfig.type === "number" ||
              fieldConfig.type === "scale"
            ) {
              initialData[fieldName] = fieldConfig.min || 0;
            } else {
              initialData[fieldName] = "";
            }
          }
        );
        setFormData(initialData);
      }
    } catch (error) {
      console.error("Errore nel caricare template:", error);
    }
  };

  const checkExistingCheckin = async () => {
    try {
      const existing = await dailyCheckinService.getCheckinForDate(
        categoryId,
        targetDate
      );
      if (existing) {
        setExistingCheckin(existing);
        setFormData(existing.responses as FormData);
        setNotes(existing.notes || "");
        setShareWithGroup(existing.shared_with_group);

        // Verifica se può ancora modificare
        const canStillEdit = await dailyCheckinService.canStillCheckin(
          categoryId,
          targetDate
        );
        setCanEdit(canStillEdit);
      }
    } catch (error) {
      console.error("Errore nel verificare check-in esistente:", error);
    }
  };

  const handleFieldChange = (
    fieldName: string,
    value: string | number | boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!template || isLoading || !canEdit) return;

    setIsLoading(true);
    try {
      const checkin = await dailyCheckinService.submitCheckin({
        category_id: categoryId,
        subcategory_name: subcategoryName,
        target_date: targetDate,
        responses: formData,
        notes: notes.trim() || undefined,
        shared_with_group: shareWithGroup,
      });

      if (checkin && onSuccess) {
        onSuccess(checkin);
      }
    } catch (error) {
      console.error("Errore nel salvare check-in:", error);
      alert("Errore nel salvare il check-in. Riprova.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderField = (
    fieldName: string,
    fieldConfig: CheckinTemplate["form_schema"][string]
  ) => {
    const value = formData[fieldName];

    switch (fieldConfig.type) {
      case "text":
        return (
          <input
            type="text"
            id={fieldName}
            value={(value as string) || ""}
            onChange={(e) => handleFieldChange(fieldName, e.target.value)}
            placeholder={fieldConfig.placeholder}
            required={fieldConfig.required}
            disabled={!canEdit}
            className="form-input"
          />
        );

      case "number":
        return (
          <input
            type="number"
            id={fieldName}
            value={(value as number) || ""}
            onChange={(e) =>
              handleFieldChange(fieldName, parseFloat(e.target.value) || 0)
            }
            placeholder={fieldConfig.placeholder}
            min={fieldConfig.min}
            max={fieldConfig.max}
            step={fieldConfig.step}
            required={fieldConfig.required}
            disabled={!canEdit}
            className="form-input"
          />
        );

      case "boolean":
        return (
          <label className="checkbox-label">
            <input
              type="checkbox"
              id={fieldName}
              checked={(value as boolean) || false}
              onChange={(e) => handleFieldChange(fieldName, e.target.checked)}
              required={fieldConfig.required}
              disabled={!canEdit}
              className="form-checkbox"
            />
            <span className="checkbox-text">{fieldConfig.label}</span>
          </label>
        );

      case "select":
        return (
          <select
            id={fieldName}
            value={(value as string) || ""}
            onChange={(e) => handleFieldChange(fieldName, e.target.value)}
            required={fieldConfig.required}
            disabled={!canEdit}
            className="form-select"
          >
            <option value="">Seleziona...</option>
            {fieldConfig.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );

      case "scale":
        return (
          <div className="scale-input">
            <input
              type="range"
              id={fieldName}
              value={(value as number) || fieldConfig.min || 1}
              onChange={(e) =>
                handleFieldChange(fieldName, parseInt(e.target.value))
              }
              min={fieldConfig.min || 1}
              max={fieldConfig.max || 10}
              required={fieldConfig.required}
              disabled={!canEdit}
              className="form-range"
            />
            <div className="scale-labels">
              <span>{fieldConfig.min || 1}</span>
              <span className="scale-value">
                {(value as number) || fieldConfig.min || 1}
              </span>
              <span>{fieldConfig.max || 10}</span>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    if (dateStr === today.toISOString().split("T")[0]) {
      return "oggi";
    } else if (dateStr === tomorrow.toISOString().split("T")[0]) {
      return "domani";
    } else if (dateStr === yesterday.toISOString().split("T")[0]) {
      return "ieri";
    }

    return date.toLocaleDateString("it-IT", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
  };

  if (!template) {
    return (
      <div className="checkin-form-loading">
        <div className="loading-spinner"></div>
        <p>Caricamento form...</p>
      </div>
    );
  }

  const isEditing = existingCheckin !== null;
  const isToday = targetDate === new Date().toISOString().split("T")[0];

  return (
    <div className="daily-checkin-form">
      <div className="form-header">
        <h2>
          {isEditing ? "Modifica" : "Fai"} check-in {formatDate(targetDate)}
        </h2>
        <p className="subcategory-name">{subcategoryName}</p>

        {!canEdit && (
          <div className="edit-warning">
            <p>⏰ Tempo scaduto - Non puoi più modificare questo check-in</p>
          </div>
        )}

        {existingCheckin && canEdit && (
          <div className="edit-info">
            <p>✅ Check-in già completato - Stai modificando</p>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="checkin-form">
        <div className="form-fields">
          {Object.entries(template.form_schema).map(
            ([fieldName, fieldConfig]) => (
              <div key={fieldName} className="form-field">
                {fieldConfig.type !== "boolean" && (
                  <label htmlFor={fieldName} className="field-label">
                    {fieldConfig.label}
                    {fieldConfig.required && (
                      <span className="required">*</span>
                    )}
                  </label>
                )}
                {renderField(fieldName, fieldConfig)}
              </div>
            )
          )}
        </div>

        <div className="form-field">
          <label htmlFor="notes" className="field-label">
            Note per il gruppo (opzionale)
          </label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Condividi come è andata, sfide incontrate, successi..."
            rows={3}
            disabled={!canEdit}
            className="form-textarea"
          />
        </div>

        <div className="form-field">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={shareWithGroup}
              onChange={(e) => setShareWithGroup(e.target.checked)}
              disabled={!canEdit}
              className="form-checkbox"
            />
            <span className="checkbox-text">
              Condividi questo check-in con il mio gruppo
            </span>
          </label>
        </div>

        <div className="form-actions">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="btn btn-secondary"
              disabled={isLoading}
            >
              Annulla
            </button>
          )}

          {canEdit && (
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? "Salvando..." : isEditing ? "Aggiorna" : "Salva"}{" "}
              Check-in
            </button>
          )}
        </div>
      </form>

      {!isToday && (
        <div className="historical-note">
          <p>📅 Stai facendo il check-in per un giorno passato</p>
        </div>
      )}
    </div>
  );
};
